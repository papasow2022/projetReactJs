import { Router } from 'express';
import connectMongo from '../lib/mongo.js';
import Order from '../models/Order.js';
import Catalogue from '../models/Catalogue.js';
import { notifyAdminNewOrder } from '../controllers/adminNotificationController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = Router();

// ===== ROUTES PUBLIQUES =====

// 1. Créer une nouvelle commande
router.post('/', async (req, res) => {
  try {
    await connectMongo();
    
    const {
      customer,
      items,
      shipping = 0,
      tax = 0,
      notes = '',
      source = 'website',
      userAgent,
      ipAddress
    } = req.body;

    // Validation des données
    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ 
        error: 'missing_data', 
        message: 'Informations client et produits requis' 
      });
    }

    // Validation des champs client
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address'];
    for (const field of requiredFields) {
      if (!customer[field]) {
        return res.status(400).json({ 
          error: 'missing_customer_field', 
          message: `Champ requis manquant: ${field}` 
        });
      }
    }

    // Validation de l'adresse
    const requiredAddressFields = ['street', 'city', 'postalCode'];
    for (const field of requiredAddressFields) {
      if (!customer.address[field]) {
        return res.status(400).json({ 
          error: 'missing_address_field', 
          message: `Champ d'adresse requis manquant: ${field}` 
        });
      }
    }

    // Récupérer les détails complets des produits depuis le catalogue
    console.log('📥 DONNÉES REÇUES DU FRONTEND:');
    console.log('Items:', JSON.stringify(items, null, 2));
    
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        try {
          // Récupérer les détails du produit depuis le catalogue
          // Vérifier si item.id est un ObjectId valide ou un chemin
          const isObjectId = /^[a-f\d]{24}$/i.test(item.id);
          
          console.log(`🔍 Recherche produit pour:`, {
            itemId: item.id,
            itemName: item.name,
            itemImage: item.image,
            isObjectId: isObjectId,
            itemSize: item.size
          });

          const product = await Catalogue.findOne({ 
            $or: [
              ...(isObjectId ? [{ _id: item.id }] : []),
              { path: item.image },
              { path: item.id }, // item.id peut être un path
              { name: item.name }
            ]
          });

          if (!product) {
            console.warn(`⚠️ Produit non trouvé: ${item.name} (ID: ${item.id})`);
            // Créer un item avec les données minimales
            return {
              productId: item.id || 'unknown',
              productName: item.name,
              productImage: item.image,
              brand: item.brand || 'Marque inconnue',
              category: item.category || 'chaussure',
              genre: item.genre || 'homme',
              color: item.color || 'Non spécifié',
              size: item.size || 'N/A',
              sku: item.id || 'unknown',
              price: item.price,
              quantity: item.quantity,
              total: item.price * item.quantity,
              stockBefore: 0,
              stockAfter: 0,
              stockRemaining: 0
            };
          }

          console.log(`✅ Produit trouvé:`, {
            productId: product._id,
            productName: product.name,
            currentStock: product.stock,
            sizes: product.sizes
          });

          // Calculer le stock total
          const stockBefore = product.stock || 0;
          const stockAfter = Math.max(0, stockBefore - item.quantity);
          const stockRemaining = stockAfter;

          // Mettre à jour le stock de la taille spécifique
          console.log(`📏 Mise à jour stock pour taille ${item.size}:`, {
            tailleCommandee: item.size,
            quantiteCommandee: item.quantity,
            taillesAvant: product.sizes
          });

          const updatedSizes = product.sizes.map(size => {
            if (size.size === item.size) {
              const newStock = Math.max(0, size.stock - item.quantity);
              console.log(`🔄 Taille ${size.size}: ${size.stock} → ${newStock}`);
              return {
                size: size.size,
                stock: newStock,
                sku: size.sku,
                active: size.active,
                _id: size._id
              };
            }
            return {
              size: size.size,
              stock: size.stock,
              sku: size.sku,
              active: size.active,
              _id: size._id
            };
          });

          console.log(`📏 Tailles après mise à jour:`, updatedSizes);

          // Mettre à jour le stock total et les tailles dans le catalogue
          try {
            const updateResult = await Catalogue.updateOne(
              { _id: product._id },
              {
                $set: {
                  stock: stockRemaining,
                  sizes: updatedSizes,
                  updatedAt: new Date()
                }
              }
            );
            
            console.log(`💾 Mise à jour sauvegardée:`, updateResult.modifiedCount > 0 ? 'Succès' : 'Échec');
            console.log(`📊 Documents modifiés:`, updateResult.modifiedCount);
          } catch (error) {
            console.error(`❌ Erreur lors de la sauvegarde:`, error.message);
          }

          console.log(`✅ Stock mis à jour: ${product.name} (${stockBefore} → ${stockRemaining})`);

          return {
            productId: product._id.toString(),
            productName: product.name,
            productImage: product.path,
            brand: product.brand,
            category: 'chaussure', // Toujours chaussure pour les chaussures
            genre: product.category || 'homme', // Le genre vient de la catégorie du catalogue
            color: product.color,
            size: item.size || 'N/A',
            sku: product._id.toString(),
            price: product.price,
            quantity: item.quantity,
            total: product.price * item.quantity,
            stockBefore,
            stockAfter,
            stockRemaining
          };
        } catch (error) {
          console.error(`❌ Erreur enrichissement produit ${item.name}:`, error);
          // Retourner un item avec les données minimales en cas d'erreur
          return {
            productId: item.id || 'error',
            productName: item.name,
            productImage: item.image,
            brand: item.brand || 'Marque inconnue',
            category: item.category || 'chaussure',
            genre: item.genre || 'homme',
            color: item.color || 'Non spécifié',
            size: item.size || 'N/A',
            sku: item.id || 'error',
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
            stockBefore: 0,
            stockAfter: 0,
            stockRemaining: 0
          };
        }
      })
    );

    // Créer la commande avec les items enrichis
    const order = new Order({
      orderNumber: Order.generateOrderNumber(),
      customer,
      items: enrichedItems,
      shipping,
      tax,
      notes,
      source,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip || req.connection.remoteAddress
    });

    // Calculer les totaux
    order.calculateTotal();

    // Sauvegarder la commande
    await order.save();

    console.log('✅ Nouvelle commande créée:', {
      orderNumber: order.orderNumber,
      customer: `${customer.firstName} ${customer.lastName}`,
      total: order.total,
      items: order.items.length
    });

    // Notifier l'admin de la nouvelle commande
    await notifyAdminNewOrder(order);

    res.status(201).json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        orderDate: order.orderDate
      }
    });

  } catch (err) {
    console.error('❌ Erreur création commande:', err);
    res.status(500).json({ 
      error: 'server_error', 
      message: 'Erreur lors de la création de la commande' 
    });
  }
});

// 2. Récupérer les commandes de l'utilisateur connecté
router.get('/user', verifyToken, async (req, res) => {
  try {
    await connectMongo();
    const { limit = 50, skip = 0 } = req.query;
    const userEmail = req.user.email; // Email depuis le token
    
    const orders = await Order.find({ 'customer.email': userEmail })
      .select('orderNumber customer status total orderDate payment.status items')
      .sort({ orderDate: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    
    res.json({ success: true, orders, count: orders.length });
  } catch (err) {
    console.error('❌ Erreur récupération commandes utilisateur:', err);
    res.status(500).json({ 
      error: 'server_error', 
      message: 'Erreur lors de la récupération des commandes' 
    });
  }
});

// 3. Récupérer une commande par ID (pour l'utilisateur authentifié)
router.get('/:orderId', verifyToken, async (req, res) => {
  try {
    await connectMongo();
    
    const { orderId } = req.params;
    const userId = req.user._id;

    // Récupérer la commande
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ 
        error: 'order_not_found', 
        message: 'Commande non trouvée' 
      });
    }

    // Vérifier que la commande appartient à l'utilisateur
    if (order.customer.email !== req.user.email) {
      return res.status(403).json({ 
        error: 'access_denied', 
        message: 'Accès non autorisé à cette commande' 
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (err) {
    console.error('❌ Erreur récupération commande:', err);
    res.status(500).json({ 
      error: 'server_error', 
      message: 'Erreur lors de la récupération de la commande' 
    });
  }
});

// 3. Récupérer une commande par numéro (pour le client non authentifié)
router.get('/public/:orderNumber', async (req, res) => {
  try {
    await connectMongo();
    
    const { orderNumber } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ 
        error: 'email_required', 
        message: 'Email requis pour vérifier la commande' 
      });
    }

    const order = await Order.findOne({ 
      orderNumber, 
      'customer.email': email 
    }).select('-__v');

    if (!order) {
      return res.status(404).json({ 
        error: 'order_not_found', 
        message: 'Commande non trouvée' 
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (err) {
    console.error('❌ Erreur récupération commande:', err);
    res.status(500).json({ 
      error: 'server_error', 
      message: 'Erreur lors de la récupération de la commande' 
    });
  }
});

// 3. Mettre à jour le statut de paiement
router.patch('/:orderNumber/payment', async (req, res) => {
  try {
    await connectMongo();
    
    const { orderNumber } = req.params;
    const { status, transactionId, paypalOrderId } = req.body;

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({ 
        error: 'order_not_found', 
        message: 'Commande non trouvée' 
      });
    }

    // Mettre à jour le paiement
    order.payment.status = status;
    if (transactionId) order.payment.transactionId = transactionId;
    if (paypalOrderId) order.payment.paypalOrderId = paypalOrderId;

    // Si le paiement est confirmé, confirmer la commande
    if (status === 'completed' && order.status === 'pending') {
      order.status = 'confirmed';
      order.confirmedDate = new Date();
    }

    await order.save();

    console.log('✅ Statut de paiement mis à jour:', {
      orderNumber,
      paymentStatus: status,
      orderStatus: order.status
    });

    res.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        payment: order.payment
      }
    });

  } catch (err) {
    console.error('❌ Erreur mise à jour paiement:', err);
    res.status(500).json({ 
      error: 'server_error', 
      message: 'Erreur lors de la mise à jour du paiement' 
    });
  }
});

// ===== ROUTES ADMIN (nécessitent authentification) =====

// 4. Lister toutes les commandes (admin)
router.get('/admin/all', async (req, res) => {
  try {
    await connectMongo();
    
    const { 
      page = 1, 
      limit = 20, 
      status, 
      startDate, 
      endDate,
      search 
    } = req.query;

    // Construire le filtre
    const filter = {};
    
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.orderDate = {};
      if (startDate) filter.orderDate.$gte = new Date(startDate);
      if (endDate) filter.orderDate.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.firstName': { $regex: search, $options: 'i' } },
        { 'customer.lastName': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(filter)
      .select('orderNumber customer status total orderDate payment.status')
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    console.error('❌ Erreur liste commandes admin:', err);
    res.status(500).json({ 
      error: 'server_error', 
      message: 'Erreur lors de la récupération des commandes' 
    });
  }
});

// 5. Statistiques des commandes (admin) - DOIT ÊTRE AVANT /admin/:orderId
router.get('/admin/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$total' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    // Importer les constantes de statut pour le mapping
    const { STATUS_LABELS } = await import('../constants/orderStatus.js');

    // Mapper les statuts anglais vers les labels français
    const mappedStats = stats.map(stat => ({
      _id: STATUS_LABELS[stat._id] || stat._id, // Utiliser le label français
      count: stat.count,
      totalRevenue: stat.totalRevenue,
      originalStatus: stat._id // Garder le statut original pour référence
    }));

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        byStatus: mappedStats
      }
    });

  } catch (err) {
    console.error('❌ Erreur statistiques:', err);
    res.status(500).json({ 
      error: 'server_error', 
      message: 'Erreur lors de la récupération des statistiques' 
    });
  }
});

// 6. Récupérer une commande complète (admin)
router.get('/admin/:orderId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ 
        error: 'order_not_found', 
        message: 'Commande non trouvée' 
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (err) {
    console.error('❌ Erreur récupération commande admin:', err);
    res.status(500).json({ 
      error: 'server_error', 
      message: 'Erreur lors de la récupération de la commande' 
    });
  }
});

// 7. Mettre à jour le statut d'une commande (admin)
router.patch('/admin/:orderId/status', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    const { orderId } = req.params;
    const { status, adminNotes } = req.body;

    // Mapping des statuts français vers anglais
    const statusMapping = {
      'En attente': 'pending',
      'Confirmée': 'confirmed',
      'En préparation': 'processing',
      'Prête': 'ready',
      'Expédiée': 'shipped',
      'Livrée': 'delivered',
      'Annulée': 'cancelled',
      'Retournée': 'returned',
      'Remboursée': 'refunded'
    };

    const validFrenchStatuses = Object.keys(statusMapping);
    
    if (!validFrenchStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'invalid_status', 
        message: 'Statut invalide' 
      });
    }

    // Convertir le statut français en anglais pour la base de données
    const englishStatus = statusMapping[status];

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ 
        error: 'order_not_found', 
        message: 'Commande non trouvée' 
      });
    }

    // Mettre à jour le statut avec la valeur anglaise
    order.status = englishStatus;
    
    // Mettre à jour les dates selon le statut
    switch (englishStatus) {
      case 'confirmed':
        order.confirmedDate = new Date();
        break;
      case 'shipped':
        order.shippedDate = new Date();
        break;
      case 'delivered':
        order.deliveredDate = new Date();
        break;
    }
    
    if (adminNotes) {
      order.adminNotes = adminNotes;
    }
    
    await order.save();

    console.log('✅ Statut commande mis à jour:', {
      orderNumber: order.orderNumber,
      newStatus: status
    });

    res.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: status, // Retourner le statut français pour l'interface
        adminNotes: order.adminNotes
      }
    });

  } catch (err) {
    console.error('❌ Erreur mise à jour statut:', err);
    res.status(500).json({ 
      error: 'server_error', 
      message: 'Erreur lors de la mise à jour du statut' 
    });
  }
});


export default router;