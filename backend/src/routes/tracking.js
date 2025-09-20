import { Router } from 'express';
import connectMongo from '../lib/mongo.js';
import Order from '../models/Order.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { emitOrderStatusUpdate } from '../socket.js';

const router = Router();

// ===== ROUTES ADMIN =====

// 1. Initialiser le suivi d'une commande (admin)
router.post('/admin/orders/:orderId/tracking', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    const { orderId } = req.params;
    const { carrier, trackingNumber, trackingUrl, estimatedDelivery } = req.body;

    // Validation des données
    if (!carrier || !trackingNumber) {
      return res.status(400).json({ 
        error: 'missing_data', 
        message: 'Transporteur et numéro de suivi requis' 
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ 
        error: 'order_not_found', 
        message: 'Commande non trouvée' 
      });
    }

    // Initialiser le suivi
    await order.initializeTracking({
      carrier,
      trackingNumber,
      trackingUrl,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null
    });

    // Ajouter l'étape initiale
    await order.addTrackingStep({
      status: 'Suivi initialisé',
      description: `Commande confiée à ${carrier}`,
      location: 'Entrepôt',
      source: 'admin'
    });

    console.log('✅ Suivi initialisé:', {
      orderNumber: order.orderNumber,
      carrier,
      trackingNumber
    });

    // Émettre la mise à jour via WebSocket
    emitOrderStatusUpdate(
      order._id.toString(),
      order.status,
      order.customer.email,
      {
        orderNumber: order.orderNumber,
        customer: order.customer,
        total: order.total,
        items: order.items,
        tracking: order.tracking
      }
    );

    res.json({
      success: true,
      message: 'Suivi initialisé avec succès',
      tracking: order.tracking
    });

  } catch (err) {
    console.error('❌ Erreur initialisation suivi:', err);
    res.status(500).json({ 
      error: 'server_error', 
      message: 'Erreur lors de l\'initialisation du suivi' 
    });
  }
});

// 2. Ajouter une étape de suivi (admin)
router.post('/admin/orders/:orderId/tracking/steps', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    const { orderId } = req.params;
    const { status, description, location, timestamp } = req.body;

    // Validation des données
    if (!status || !description) {
      return res.status(400).json({ 
        error: 'missing_data', 
        message: 'Statut et description requis' 
      });
    }

    // Validation des localisations africaines
    const validLocations = [
      // Centres de tri
      'Entrepôt', 'Hub DHL Conakry', 'Hub FedEx Dakar', 'Hub UPS Abidjan',
      'Centre de tri Paris', 'Centre de tri Marseille',
      
      // Guinée
      'Conakry - Kaloum', 'Conakry - Dixinn', 'Conakry - Matam', 'Conakry - Ratoma', 'Conakry - Matoto',
      'Kankan - Centre', 'Kankan - Commune', 'Labé - Centre', 'Labé - Commune',
      'Nzérékoré - Centre', 'Nzérékoré - Commune', 'Kindia - Centre', 'Mamou - Centre',
      
      // Sénégal
      'Dakar - Plateau', 'Dakar - Médina', 'Dakar - Fann', 'Dakar - Ouakam', 'Dakar - Parcelles',
      'Thiès - Centre', 'Saint-Louis - Centre', 'Kaolack - Centre', 'Ziguinchor - Centre',
      
      // Côte d'Ivoire
      'Abidjan - Plateau', 'Abidjan - Cocody', 'Abidjan - Yopougon', 'Abidjan - Adjamé', 'Abidjan - Marcory',
      'Bouaké - Centre', 'Yamoussoukro - Centre', 'San-Pédro - Centre', 'Korhogo - Centre',
      
      // Mali
      'Bamako - Commune I', 'Bamako - Commune II', 'Bamako - Commune III', 'Bamako - Commune IV', 'Bamako - Commune V', 'Bamako - Commune VI',
      'Sikasso - Centre', 'Ségou - Centre', 'Mopti - Centre', 'Tombouctou - Centre',
      
      // Burkina Faso
      'Ouagadougou - Centre', 'Ouagadougou - Commune', 'Bobo-Dioulasso - Centre', 'Bobo-Dioulasso - Commune',
      'Koudougou - Centre', 'Ouahigouya - Centre',
      
      // Statuts génériques
      'En cours de livraison', 'En transit international', 'En transit national',
      'En attente de récupération', 'Retourné à l\'expéditeur', 'Autre'
    ];

    if (location && !validLocations.includes(location)) {
      console.warn(`⚠️ Localisation non reconnue: ${location}`);
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ 
        error: 'order_not_found', 
        message: 'Commande non trouvée' 
      });
    }

    if (!order.tracking) {
      return res.status(400).json({ 
        error: 'tracking_not_initialized', 
        message: 'Le suivi n\'a pas été initialisé pour cette commande' 
      });
    }

    // Ajouter l'étape
    await order.addTrackingStep({
      status,
      description,
      location,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      source: 'admin'
    });

    // Mettre à jour le statut de la commande si nécessaire
    if (status.toLowerCase().includes('livré') || status.toLowerCase().includes('livrée')) {
      order.status = 'delivered';
      order.deliveredDate = new Date();
      order.tracking.actualDelivery = new Date();
      await order.save();
    } else if (status.toLowerCase().includes('expédié') || status.toLowerCase().includes('expédiée') || 
               status.toLowerCase().includes('en cours de livraison')) {
      order.status = 'shipped';
      order.shippedDate = new Date();
      await order.save();
    } else if (status.toLowerCase().includes('en transit') || status.toLowerCase().includes('transit')) {
      order.status = 'processing';
      await order.save();
    } else if (status.toLowerCase().includes('retourné') || status.toLowerCase().includes('retournée')) {
      order.status = 'returned';
      await order.save();
    } else if (status.toLowerCase().includes('problème') || status.toLowerCase().includes('problème')) {
      order.status = 'processing';
      await order.save();
    }

    console.log('✅ Étape de suivi ajoutée:', {
      orderNumber: order.orderNumber,
      status,
      description,
      location: location || 'Non spécifiée'
    });

    // Émettre la mise à jour via WebSocket
    emitOrderStatusUpdate(
      order._id.toString(),
      order.status,
      order.customer.email,
      {
        orderNumber: order.orderNumber,
        customer: order.customer,
        total: order.total,
        items: order.items,
        tracking: order.tracking
      }
    );

    res.json({
      success: true,
      message: 'Étape de suivi ajoutée avec succès',
      tracking: order.tracking
    });

  } catch (err) {
    console.error('❌ Erreur ajout étape suivi:', err);
    res.status(500).json({ 
      error: 'server_error', 
      message: 'Erreur lors de l\'ajout de l\'étape de suivi' 
    });
  }
});

// 3. Mettre à jour le suivi (admin)
router.put('/admin/orders/:orderId/tracking', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    const { orderId } = req.params;
    const { carrier, trackingNumber, trackingUrl, estimatedDelivery } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ 
        error: 'order_not_found', 
        message: 'Commande non trouvée' 
      });
    }

    if (!order.tracking) {
      return res.status(400).json({ 
        error: 'tracking_not_initialized', 
        message: 'Le suivi n\'a pas été initialisé pour cette commande' 
      });
    }

    // Mettre à jour les informations de suivi
    if (carrier) order.tracking.carrier = carrier;
    if (trackingNumber) order.tracking.trackingNumber = trackingNumber;
    if (trackingUrl) order.tracking.trackingUrl = trackingUrl;
    if (estimatedDelivery) order.tracking.estimatedDelivery = new Date(estimatedDelivery);

    await order.save();

    console.log('✅ Suivi mis à jour:', {
      orderNumber: order.orderNumber,
      carrier: order.tracking.carrier,
      trackingNumber: order.tracking.trackingNumber
    });

    // Émettre la mise à jour via WebSocket
    emitOrderStatusUpdate(
      order._id.toString(),
      order.status,
      order.customer.email,
      {
        orderNumber: order.orderNumber,
        customer: order.customer,
        total: order.total,
        items: order.items,
        tracking: order.tracking
      }
    );

    res.json({
      success: true,
      message: 'Suivi mis à jour avec succès',
      tracking: order.tracking
    });

  } catch (err) {
    console.error('❌ Erreur mise à jour suivi:', err);
    res.status(500).json({ 
      error: 'server_error', 
      message: 'Erreur lors de la mise à jour du suivi' 
    });
  }
});

// ===== ROUTES CLIENT =====

// 4. Récupérer le suivi d'une commande (client)
router.get('/orders/:orderId/tracking', verifyToken, async (req, res) => {
  try {
    await connectMongo();
    
    const { orderId } = req.params;
    const userId = req.user._id;

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
      tracking: order.tracking || null,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        orderDate: order.orderDate,
        customer: order.customer,
        total: order.total,
        items: order.items
      }
    });

  } catch (err) {
    console.error('❌ Erreur récupération suivi:', err);
    res.status(500).json({ 
      error: 'server_error', 
      message: 'Erreur lors de la récupération du suivi' 
    });
  }
});

// 5. Récupérer le suivi par numéro de commande (public)
router.get('/public/orders/:orderNumber/tracking', async (req, res) => {
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
    });

    if (!order) {
      return res.status(404).json({ 
        error: 'order_not_found', 
        message: 'Commande non trouvée' 
      });
    }

    res.json({
      success: true,
      tracking: order.tracking || null,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        orderDate: order.orderDate,
        customer: order.customer,
        total: order.total,
        items: order.items
      }
    });

  } catch (err) {
    console.error('❌ Erreur récupération suivi public:', err);
    res.status(500).json({ 
      error: 'server_error', 
      message: 'Erreur lors de la récupération du suivi' 
    });
  }
});

export default router;
