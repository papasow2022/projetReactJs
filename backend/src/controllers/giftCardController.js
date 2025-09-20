import GiftCard from '../models/GiftCard.js';
import { validationResult } from 'express-validator';

// Créer une nouvelle carte-cadeau
export const createGiftCard = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const {
      amount,
      message,
      sender,
      recipient,
      currency = 'GNF',
      expirationYears = 10,
      design = 'default',
      deliveryDate = null,
      videoMessage = null
    } = req.body;

    // Générer un code unique
    let code;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      code = GiftCard.generateCode();
      const existingCard = await GiftCard.findOne({ code });
      if (!existingCard) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération du code unique'
      });
    }

    // Calculer la date d'expiration
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + expirationYears);

    const giftCard = new GiftCard({
      code,
      amount: Number(amount),
      balance: Number(amount),
      currency,
      message: message || '',
      sender: {
        name: sender.name,
        email: sender.email,
        phone: sender.phone || ''
      },
      recipient: {
        name: recipient.name,
        email: recipient.email,
        phone: recipient.phone || ''
      },
      expiresAt: expirationDate,
      design,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      videoMessage: videoMessage || null,
      personalized: !!(message || videoMessage),
      security: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    await giftCard.save();

    res.status(201).json({
      success: true,
      message: 'Carte-cadeau créée avec succès',
      data: {
        code: giftCard.code,
        amount: giftCard.amount,
        currency: giftCard.currency,
        expiresAt: giftCard.expiresAt,
        message: giftCard.message
      }
    });

  } catch (error) {
    console.error('Erreur lors de la création de la carte-cadeau:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la carte-cadeau'
    });
  }
};

// Utiliser une carte-cadeau
export const redeemGiftCard = async (req, res) => {
  try {
    const { code, amount, orderId } = req.body;

    if (!code || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Code et montant requis'
      });
    }

    const giftCard = await GiftCard.findOne({ code });
    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: 'Carte-cadeau non trouvée'
      });
    }

    const result = giftCard.redeem(Number(amount), orderId);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Impossible d\'utiliser la carte-cadeau',
        reason: result.reason,
        cardBalance: result.cardBalance,
        requiredAmount: result.requiredAmount
      });
    }

    await giftCard.save();

    res.json({
      success: true,
      message: 'Carte-cadeau utilisée avec succès',
      data: {
        used: result.used,
        remaining: result.remaining,
        currency: result.cardCurrency
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'utilisation de la carte-cadeau:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'utilisation de la carte-cadeau'
    });
  }
};

// Vérifier le solde d'une carte-cadeau
export const checkBalance = async (req, res) => {
  try {
    const { code } = req.params;

    const giftCard = await GiftCard.findOne({ code });
    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: 'Carte-cadeau non trouvée'
      });
    }

    const validation = giftCard.validateCard();
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Carte-cadeau non valide',
        reason: validation.reason,
        balance: giftCard.balance,
        expiresAt: giftCard.expiresAt
      });
    }

    res.json({
      success: true,
      data: {
        balance: giftCard.balance,
        currency: giftCard.currency,
        expiresAt: giftCard.expiresAt,
        daysUntilExpiration: giftCard.daysUntilExpiration
      }
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du solde:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la vérification du solde'
    });
  }
};

// Recharger une carte-cadeau
export const rechargeGiftCard = async (req, res) => {
  try {
    const { code, amount, description, paymentMethod, transactionId } = req.body;

    if (!code || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Code et montant requis'
      });
    }

    const giftCard = await GiftCard.findOne({ code });
    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: 'Carte-cadeau non trouvée'
      });
    }

    const result = giftCard.recharge(
      Number(amount), 
      description || 'Recharge de solde',
      paymentMethod || 'credit_card',
      transactionId
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de recharger la carte-cadeau',
        reason: result.reason
      });
    }

    await giftCard.save();

    res.json({
      success: true,
      message: 'Carte-cadeau rechargée avec succès',
      data: {
        newBalance: result.newBalance,
        currency: result.cardCurrency
      }
    });

  } catch (error) {
    console.error('Erreur lors de la recharge de la carte-cadeau:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la recharge de la carte-cadeau'
    });
  }
};

// Obtenir l'historique d'une carte-cadeau
export const getGiftCardHistory = async (req, res) => {
  try {
    const { code } = req.params;

    const giftCard = await GiftCard.findOne({ code });
    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: 'Carte-cadeau non trouvée'
      });
    }

    res.json({
      success: true,
      data: {
        card: {
          code: giftCard.code,
          amount: giftCard.amount,
          balance: giftCard.balance,
          currency: giftCard.currency,
          createdAt: giftCard.createdAt,
          expiresAt: giftCard.expiresAt,
          redeemed: giftCard.redeemed,
          status: giftCard.status
        },
        transactions: giftCard.transactions,
        rechargeHistory: giftCard.rechargeHistory
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'historique'
    });
  }
};

// Obtenir les analytics des cartes-cadeaux
export const getAnalytics = async (req, res) => {
  try {
    const analytics = await GiftCard.getAnalytics();
    
    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des analytics'
    });
  }
};

// Lister les cartes-cadeaux d'un utilisateur
export const getUserGiftCards = async (req, res) => {
  try {
    const { email } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const query = {
      $or: [
        { 'sender.email': email },
        { 'recipient.email': email }
      ]
    };

    if (status) {
      query.status = status;
    }

    const giftCards = await GiftCard.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-security -metadata');

    const total = await GiftCard.countDocuments(query);

    res.json({
      success: true,
      data: {
        giftCards,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des cartes-cadeaux:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des cartes-cadeaux'
    });
  }
};

// Annuler une carte-cadeau
export const cancelGiftCard = async (req, res) => {
  try {
    const { code } = req.params;
    const { reason } = req.body;

    const giftCard = await GiftCard.findOne({ code });
    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: 'Carte-cadeau non trouvée'
      });
    }

    if (giftCard.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Carte-cadeau déjà annulée'
      });
    }

    giftCard.status = 'cancelled';
    giftCard.metadata.cancellationReason = reason || 'Annulée par l\'utilisateur';
    giftCard.metadata.cancelledAt = new Date();

    await giftCard.save();

    res.json({
      success: true,
      message: 'Carte-cadeau annulée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de l\'annulation de la carte-cadeau:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'annulation de la carte-cadeau'
    });
  }
};

export default {
  createGiftCard,
  redeemGiftCard,
  checkBalance,
  getGiftCardHistory,
  rechargeGiftCard,
  getUserGiftCards,
  getAnalytics,
  cancelGiftCard
};
