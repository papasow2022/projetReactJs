import { Router } from 'express';
import connectMongo from '../lib/mongo.js';
import SupportTicket from '../models/SupportTicket.js';
import { body, validationResult } from 'express-validator';
import { notifyAdminNewTicket } from '../controllers/adminNotificationController.js';

const router = Router();

// Validation middleware
const validateTicket = [
  body('subject').trim().isLength({ min: 3, max: 200 }).withMessage('Le sujet doit contenir entre 3 et 200 caractères'),
  body('user').trim().isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('description').trim().isLength({ min: 3, max: 2000 }).withMessage('La description doit contenir entre 3 et 2000 caractères'),
  body('category').isIn(['commande', 'retour', 'livraison', 'compte', 'paiement', 'autre']).withMessage('Catégorie invalide'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Priorité invalide')
];

const validateConversation = [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Le message doit contenir entre 1 et 1000 caractères'),
  body('type').isIn(['customer', 'agent', 'system']).withMessage('Type de message invalide'),
  body('author').trim().isLength({ min: 1, max: 100 }).withMessage('L\'auteur doit contenir entre 1 et 100 caractères')
];

// GET /api/support/tickets - Récupérer tous les tickets
router.get('/tickets', async (req, res) => {
  try {
    await connectMongo();
    
    const { 
      page = 1, 
      limit = 20, 
      status, 
      priority, 
      category, 
      email,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Construire le filtre
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (email) filter.email = email;
    
    // Options de pagination
    const options = {
      page: parseInt(page),
      limit: Math.min(parseInt(limit), 100),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: 'assignedTo'
    };
    
    const tickets = await SupportTicket.find(filter)
      .sort(options.sort)
      .limit(options.limit * options.page)
      .skip((options.page - 1) * options.limit)
      .lean();
    
    const total = await SupportTicket.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          page: options.page,
          limit: options.limit,
          total,
          pages: Math.ceil(total / options.limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Erreur GET /api/support/tickets:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur lors de la récupération des tickets' 
    });
  }
});

// GET /api/support/tickets/:id - Récupérer un ticket spécifique
router.get('/tickets/:id', async (req, res) => {
  try {
    await connectMongo();
    
    const ticket = await SupportTicket.findOne({ 
      $or: [
        { _id: req.params.id },
        { ticketId: req.params.id }
      ]
    }).lean();
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        error: 'Ticket non trouvé' 
      });
    }
    
    res.json({
      success: true,
      data: ticket
    });
    
  } catch (error) {
    console.error('Erreur GET /api/support/tickets/:id:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur lors de la récupération du ticket' 
    });
  }
});

// POST /api/support/tickets - Créer un nouveau ticket
router.post('/tickets', validateTicket, async (req, res) => {
  try {
    console.log('📥 Données reçues:', JSON.stringify(req.body, null, 2));
    
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Erreurs de validation:', errors.array());
      return res.status(400).json({
        success: false,
        error: 'Données invalides',
        details: errors.array()
      });
    }
    
    await connectMongo();
    
    const ticketData = {
      ...req.body,
      conversations: [{
        id: 1,
        type: 'customer',
        message: req.body.description,
        author: req.body.user,
        timestamp: new Date()
      }]
    };
    
    const ticket = new SupportTicket(ticketData);
    await ticket.save();
    
    // Notifier l'admin du nouveau ticket
    await notifyAdminNewTicket(ticket);
    
    res.status(201).json({
      success: true,
      data: ticket,
      message: 'Ticket créé avec succès'
    });
    
  } catch (error) {
    console.error('Erreur POST /api/support/tickets:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur lors de la création du ticket' 
    });
  }
});

// PUT /api/support/tickets/:id - Mettre à jour un ticket
router.put('/tickets/:id', async (req, res) => {
  try {
    await connectMongo();
    
    const { status, priority, assignedTo, tags, resolution } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (tags) updateData.tags = tags;
    if (resolution) updateData.resolution = resolution;
    
    const ticket = await SupportTicket.findOneAndUpdate(
      { 
        $or: [
          { _id: req.params.id },
          { ticketId: req.params.id }
        ]
      },
      { $set: updateData },
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        error: 'Ticket non trouvé' 
      });
    }
    
    res.json({
      success: true,
      data: ticket,
      message: 'Ticket mis à jour avec succès'
    });
    
  } catch (error) {
    console.error('Erreur PUT /api/support/tickets/:id:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur lors de la mise à jour du ticket' 
    });
  }
});

// POST /api/support/tickets/:id/conversations - Ajouter une conversation
router.post('/tickets/:id/conversations', validateConversation, async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Données invalides',
        details: errors.array()
      });
    }
    
    await connectMongo();
    
    const ticket = await SupportTicket.findOne({ 
      $or: [
        { _id: req.params.id },
        { ticketId: req.params.id }
      ]
    });
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        error: 'Ticket non trouvé' 
      });
    }
    
    // Ajouter la conversation
    await ticket.addConversation(req.body);
    
    res.json({
      success: true,
      data: ticket,
      message: 'Message ajouté avec succès'
    });
    
  } catch (error) {
    console.error('Erreur POST /api/support/tickets/:id/conversations:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur lors de l\'ajout du message' 
    });
  }
});

// GET /api/support/stats - Statistiques des tickets
router.get('/stats', async (req, res) => {
  try {
    await connectMongo();
    
    const stats = await SupportTicket.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          urgent: { $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] } }
        }
      }
    ]);
    
    const categoryStats = await SupportTicket.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          total: 0, open: 0, pending: 0, inProgress: 0, resolved: 0, closed: 0,
          high: 0, urgent: 0
        },
        byCategory: categoryStats
      }
    });
    
  } catch (error) {
    console.error('Erreur GET /api/support/stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur lors de la récupération des statistiques' 
    });
  }
});

// DELETE /api/support/tickets/:id - Supprimer un ticket
router.delete('/tickets/:id', async (req, res) => {
  try {
    await connectMongo();
    
    const ticket = await SupportTicket.findOneAndDelete({ 
      $or: [
        { _id: req.params.id },
        { ticketId: req.params.id }
      ]
    });
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        error: 'Ticket non trouvé' 
      });
    }
    
    res.json({
      success: true,
      message: 'Ticket supprimé avec succès'
    });
    
  } catch (error) {
    console.error('Erreur DELETE /api/support/tickets/:id:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur lors de la suppression du ticket' 
    });
  }
});

export default router;





