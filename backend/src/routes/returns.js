import { Router } from 'express';
import connectMongo from '../lib/mongo.js';
import Return from '../models/Return.js';
import Order from '../models/Order.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { emitOrderStatusUpdate } from '../socket.js';

const router = Router();

// ===== ROUTES CLIENT =====

// 1. Créer une demande de retour (client)
router.post('/', verifyToken, async (req, res) => {
  try {
    await connectMongo();
    
    const { orderId, items, customerNotes, contactInfo } = req.body;
    const userId = req.user._id;
    const userEmail = req.user.email;

    // Validation des données
    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'missing_data',
        message: 'ID de commande et articles requis'
      });
    }

    // Vérifier que la commande existe et appartient à l'utilisateur
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        error: 'order_not_found',
        message: 'Commande non trouvée'
      });
    }

    if (order.customer.email !== userEmail) {
      return res.status(403).json({
        error: 'access_denied',
        message: 'Accès non autorisé à cette commande'
      });
    }

    // Vérifier si un retour existe déjà pour cette commande
    const existingReturn = await Return.findOne({ orderId });
    if (existingReturn) {
      return res.status(400).json({
        error: 'return_exists',
        message: 'Une demande de retour existe déjà pour cette commande',
        returnId: existingReturn._id
      });
    }

    // Calculer le montant total du retour
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Créer le retour
    const returnRequest = new Return({
      orderId,
      orderNumber: order.orderNumber,
      customer: {
        firstName: order.customer.firstName,
        lastName: order.customer.lastName,
        email: order.customer.email,
        phone: order.customer.phone
      },
      items,
      customerNotes,
      contactInfo,
      refund: {
        amount: totalAmount,
        type: 'full' // Par défaut, remboursement complet
      },
      source: 'website',
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });

    await returnRequest.save();

    // Ajouter à l'historique
    await returnRequest.addHistoryEntry(
      'return_requested',
      'Demande de retour créée par le client',
      'customer',
      { itemsCount: items.length, totalAmount }
    );

    console.log('✅ Demande de retour créée:', {
      returnNumber: returnRequest.returnNumber,
      orderNumber: order.orderNumber,
      customer: userEmail,
      itemsCount: items.length
    });

    res.status(201).json({
      success: true,
      message: 'Demande de retour créée avec succès',
      return: {
        id: returnRequest._id,
        returnNumber: returnRequest.returnNumber,
        status: returnRequest.status,
        items: returnRequest.items,
        totalAmount: returnRequest.refund.amount
      }
    });

  } catch (err) {
    console.error('❌ Erreur création retour:', err);
    res.status(500).json({
      error: 'server_error',
      message: 'Erreur lors de la création de la demande de retour'
    });
  }
});

// 2. Récupérer les retours de l'utilisateur (client)
router.get('/user', verifyToken, async (req, res) => {
  try {
    await connectMongo();
    
    const userEmail = req.user.email;
    const { limit = 20, skip = 0, status } = req.query;

    const filter = { 'customer.email': userEmail };
    if (status) filter.status = status;

    const returns = await Return.find(filter)
      .select('returnNumber orderNumber status items refund requestedDate completedDate adminNotes customerNotes returnDetails returnReason')
      .sort({ requestedDate: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Return.countDocuments(filter);

    res.json({
      success: true,
      returns,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: (parseInt(skip) + parseInt(limit)) < total
      }
    });

  } catch (err) {
    console.error('❌ Erreur récupération retours client:', err);
    res.status(500).json({
      error: 'server_error',
      message: 'Erreur lors de la récupération des retours'
    });
  }
});

// 2.5. Ajouter une note client à un retour
router.patch('/:returnId/customer-note', verifyToken, async (req, res) => {
  try {
    await connectMongo();
    
    const { returnId } = req.params;
    const { customerNotes } = req.body;
    const userEmail = req.user.email;

    const returnRequest = await Return.findById(returnId);
    
    if (!returnRequest) {
      return res.status(404).json({
        error: 'return_not_found',
        message: 'Retour non trouvé'
      });
    }

    // Vérifier que le retour appartient à l'utilisateur
    if (returnRequest.customer.email !== userEmail) {
      return res.status(403).json({
        error: 'unauthorized',
        message: 'Vous n\'êtes pas autorisé à modifier ce retour'
      });
    }

    // Mettre à jour la note client
    returnRequest.customerNotes = customerNotes;
    await returnRequest.save();

    res.json({
      success: true,
      message: 'Note client mise à jour avec succès',
      return: returnRequest
    });

  } catch (err) {
    console.error('❌ Erreur mise à jour note client:', err);
    res.status(500).json({
      error: 'server_error',
      message: 'Erreur lors de la mise à jour de la note'
    });
  }
});

// 3. Récupérer un retour spécifique (client)
router.get('/:returnId', verifyToken, async (req, res) => {
  try {
    await connectMongo();
    
    const { returnId } = req.params;
    const userEmail = req.user.email;

    const returnRequest = await Return.findById(returnId);
    
    if (!returnRequest) {
      return res.status(404).json({
        error: 'return_not_found',
        message: 'Retour non trouvé'
      });
    }

    if (returnRequest.customer.email !== userEmail) {
      return res.status(403).json({
        error: 'access_denied',
        message: 'Accès non autorisé à ce retour'
      });
    }

    res.json({
      success: true,
      return: returnRequest
    });

  } catch (err) {
    console.error('❌ Erreur récupération retour:', err);
    res.status(500).json({
      error: 'server_error',
      message: 'Erreur lors de la récupération du retour'
    });
  }
});

// 4. Annuler un retour (client)
router.patch('/:returnId/cancel', verifyToken, async (req, res) => {
  try {
    await connectMongo();
    
    const { returnId } = req.params;
    const userEmail = req.user.email;
    const { reason } = req.body;

    const returnRequest = await Return.findById(returnId);
    
    if (!returnRequest) {
      return res.status(404).json({
        error: 'return_not_found',
        message: 'Retour non trouvé'
      });
    }

    if (returnRequest.customer.email !== userEmail) {
      return res.status(403).json({
        error: 'access_denied',
        message: 'Accès non autorisé à ce retour'
      });
    }

    if (!['requested', 'approved'].includes(returnRequest.status)) {
      return res.status(400).json({
        error: 'invalid_status',
        message: 'Ce retour ne peut pas être annulé dans son état actuel'
      });
    }

    await returnRequest.updateStatus('cancelled', 'customer', reason || 'Annulé par le client');

    res.json({
      success: true,
      message: 'Retour annulé avec succès',
      return: {
        id: returnRequest._id,
        status: returnRequest.status
      }
    });

  } catch (err) {
    console.error('❌ Erreur annulation retour:', err);
    res.status(500).json({
      error: 'server_error',
      message: 'Erreur lors de l\'annulation du retour'
    });
  }
});

// ===== ROUTES ADMIN =====

// 5. Statistiques des retours (admin) - DOIT être avant /admin/:returnId
router.get('/admin/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    const { startDate, endDate } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.requestedDate = {};
      if (startDate) filter.requestedDate.$gte = new Date(startDate);
      if (endDate) filter.requestedDate.$lte = new Date(endDate);
    }

    const [
      totalReturns,
      byStatus,
      byPriority,
      totalRefundAmount,
      avgProcessingTime
    ] = await Promise.all([
      Return.countDocuments(filter),
      Return.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Return.aggregate([
        { $match: filter },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      Return.aggregate([
        { $match: { ...filter, 'refund.amount': { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$refund.amount' } } }
      ]),
      Return.aggregate([
        { 
          $match: { 
            ...filter, 
            completedDate: { $exists: true },
            requestedDate: { $exists: true }
          } 
        },
        {
          $project: {
            processingTime: {
              $divide: [
                { $subtract: ['$completedDate', '$requestedDate'] },
                1000 * 60 * 60 * 24 // Convertir en jours
              ]
            }
          }
        },
        { $group: { _id: null, avg: { $avg: '$processingTime' } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalReturns,
        byStatus: byStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byPriority: byPriority.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        totalRefundAmount: totalRefundAmount[0]?.total || 0,
        avgProcessingTime: avgProcessingTime[0]?.avg || 0
      }
    });

  } catch (err) {
    console.error('❌ Erreur statistiques retours:', err);
    res.status(500).json({
      error: 'server_error',
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// 6. Lister tous les retours (admin)
router.get('/admin/all', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    const { 
      page = 1, 
      limit = 20, 
      status, 
      priority,
      startDate, 
      endDate,
      search 
    } = req.query;

    // Construire le filtre
    const filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (startDate || endDate) {
      filter.requestedDate = {};
      if (startDate) filter.requestedDate.$gte = new Date(startDate);
      if (endDate) filter.requestedDate.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { returnNumber: { $regex: search, $options: 'i' } },
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.firstName': { $regex: search, $options: 'i' } },
        { 'customer.lastName': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    
    const returns = await Return.find(filter)
          .select('returnNumber orderNumber customer status priority items refund requestedDate adminNotes customerNotes returnDetails returnReason')
      .sort({ requestedDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Return.countDocuments(filter);

    res.json({
      success: true,
      returns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    console.error('❌ Erreur liste retours admin:', err);
    res.status(500).json({
      error: 'server_error',
      message: 'Erreur lors de la récupération des retours'
    });
  }
});

// 6. Récupérer un retour spécifique (admin)
router.get('/admin/:returnId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    const { returnId } = req.params;

    const returnRequest = await Return.findById(returnId);
    
    if (!returnRequest) {
      return res.status(404).json({
        error: 'return_not_found',
        message: 'Retour non trouvé'
      });
    }

    res.json({
      success: true,
      return: returnRequest
    });

  } catch (err) {
    console.error('❌ Erreur récupération retour admin:', err);
    res.status(500).json({
      error: 'server_error',
      message: 'Erreur lors de la récupération du retour'
    });
  }
});

// 7. Mettre à jour le statut d'un retour (admin)
router.patch('/admin/:returnId/status', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    const { returnId } = req.params;
    const { status, notes, refundType, refundAmount, adminNotes, productCondition } = req.body;
    const adminEmail = req.user.email;
    
    console.log('🔧 Données reçues:', { status, notes, refundType, refundAmount, adminNotes, productCondition });

    const returnRequest = await Return.findById(returnId);
    
    if (!returnRequest) {
      return res.status(404).json({
        error: 'return_not_found',
        message: 'Retour non trouvé'
      });
    }

    // Mettre à jour le statut
    await returnRequest.updateStatus(status, 'admin', notes);

    // Mettre à jour les informations de remboursement si fournies
    if (refundType) {
      returnRequest.refund.type = refundType;
    }
    if (refundAmount !== undefined) {
      returnRequest.refund.amount = refundAmount;
    }
    if (adminNotes) {
      returnRequest.adminNotes = adminNotes;
    }
    if (productCondition && returnRequest.items && returnRequest.items.length > 0) {
      console.log('🔧 Mise à jour de l\'état du produit:', productCondition);
      returnRequest.items[0].condition = productCondition;
    }

    await returnRequest.save();
    console.log('✅ Retour sauvegardé avec succès');

    // Émettre une notification WebSocket si nécessaire
    if (['approved', 'rejected', 'refund_completed'].includes(status)) {
      emitOrderStatusUpdate(
        returnRequest.orderId.toString(),
        'return_updated',
        returnRequest.customer.email,
        {
          returnNumber: returnRequest.returnNumber,
          orderNumber: returnRequest.orderNumber,
          status: returnRequest.status,
          refund: returnRequest.refund
        }
      );
    }

    console.log('✅ Statut retour mis à jour:', {
      returnNumber: returnRequest.returnNumber,
      status,
      admin: adminEmail
    });

    res.json({
      success: true,
      message: 'Statut du retour mis à jour avec succès',
      return: {
        id: returnRequest._id,
        status: returnRequest.status,
        refund: returnRequest.refund
      }
    });

  } catch (err) {
    console.error('❌ Erreur mise à jour statut retour:', err);
    res.status(500).json({
      error: 'server_error',
      message: 'Erreur lors de la mise à jour du statut'
    });
  }
});

// 8. Ajouter des informations de suivi retour (admin)
router.patch('/admin/:returnId/shipping', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    const { returnId } = req.params;
    const { carrier, trackingNumber, trackingUrl, shippingCost } = req.body;
    const adminEmail = req.user.email;

    const returnRequest = await Return.findById(returnId);
    
    if (!returnRequest) {
      return res.status(404).json({
        error: 'return_not_found',
        message: 'Retour non trouvé'
      });
    }

    // Mettre à jour les informations de suivi
    if (carrier) returnRequest.returnShipping.carrier = carrier;
    if (trackingNumber) returnRequest.returnShipping.trackingNumber = trackingNumber;
    if (trackingUrl) returnRequest.returnShipping.trackingUrl = trackingUrl;
    if (shippingCost !== undefined) returnRequest.returnShipping.shippingCost = shippingCost;

    await returnRequest.save();

    // Ajouter à l'historique
    await returnRequest.addHistoryEntry(
      'shipping_updated',
      'Informations de suivi retour mises à jour',
      'admin',
      { carrier, trackingNumber, adminEmail }
    );

    res.json({
      success: true,
      message: 'Informations de suivi mises à jour',
      return: {
        id: returnRequest._id,
        returnShipping: returnRequest.returnShipping
      }
    });

  } catch (err) {
    console.error('❌ Erreur mise à jour suivi retour:', err);
    res.status(500).json({
      error: 'server_error',
      message: 'Erreur lors de la mise à jour du suivi'
    });
  }
});


export default router;
