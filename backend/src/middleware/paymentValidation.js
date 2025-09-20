import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { validationResult } from 'express-validator';

// Middleware pour valider qu'une commande peut être payée
export const validateOrderForPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const userId = req.user._id;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'ID de commande requis'
      });
    }

    // Vérifier que la commande existe
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Vérifier que la commande peut être payée
    if (!order.canBePaid()) {
      return res.status(400).json({
        success: false,
        message: 'Cette commande ne peut pas être payée',
        orderStatus: order.status,
        paymentStatus: order.paymentStatus
      });
    }

    // Vérifier qu'il n'y a pas déjà un paiement en cours
    const existingPayment = await Payment.findOne({
      orderId,
      status: { $in: ['pending', 'processing'] }
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Un paiement est déjà en cours pour cette commande',
        existingPaymentId: existingPayment._id
      });
    }

    // Ajouter la commande à la requête pour les contrôleurs
    req.order = order;
    next();

  } catch (error) {
    console.error('Erreur validation commande pour paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la validation'
    });
  }
};

// Middleware pour valider les montants de paiement
export const validatePaymentAmount = (req, res, next) => {
  try {
    const { amount, currency = 'XOF' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Le montant doit être supérieur à 0'
      });
    }

    // Vérifier les limites de montant selon la devise
    const limits = {
      'XOF': { min: 100, max: 1000000 }, // 100 FCFA à 1,000,000 FCFA
      'USD': { min: 1, max: 10000 },     // 1$ à 10,000$
      'EUR': { min: 1, max: 10000 }      // 1€ à 10,000€
    };

    const limit = limits[currency.toUpperCase()];
    if (!limit) {
      return res.status(400).json({
        success: false,
        message: 'Devise non supportée'
      });
    }

    if (amount < limit.min) {
      return res.status(400).json({
        success: false,
        message: `Le montant minimum est de ${limit.min} ${currency}`
      });
    }

    if (amount > limit.max) {
      return res.status(400).json({
        success: false,
        message: `Le montant maximum est de ${limit.max} ${currency}`
      });
    }

    // Vérifier que le montant correspond au total de la commande
    if (req.order && Math.abs(amount - req.order.total) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Le montant ne correspond pas au total de la commande',
        orderTotal: req.order.total,
        providedAmount: amount
      });
    }

    next();

  } catch (error) {
    console.error('Erreur validation montant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la validation du montant'
    });
  }
};

// Middleware pour valider les méthodes de paiement
export const validatePaymentMethod = (req, res, next) => {
  try {
    const { method, provider } = req.body;

    const validMethods = {
      'stripe': ['card'],
      'paypal': ['paypal'],
      'mobile_money': ['mobile_money'],
      'bank_transfer': ['bank_transfer'],
      'cash_on_delivery': ['cash_on_delivery']
    };

    if (provider && !validMethods[provider]) {
      return res.status(400).json({
        success: false,
        message: 'Fournisseur de paiement non supporté'
      });
    }

    if (method && provider && !validMethods[provider].includes(method)) {
      return res.status(400).json({
        success: false,
        message: `Méthode de paiement ${method} non supportée pour ${provider}`
      });
    }

    next();

  } catch (error) {
    console.error('Erreur validation méthode de paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la validation de la méthode'
    });
  }
};

// Middleware pour valider les remboursements
export const validateRefund = async (req, res, next) => {
  try {
    const { paymentId, amount } = req.body;
    const userId = req.user._id;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'ID de paiement requis'
      });
    }

    // Vérifier que le paiement existe et appartient à l'utilisateur
    const payment = await Payment.findOne({ _id: paymentId, userId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    // Vérifier que le paiement peut être remboursé
    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Seuls les paiements complétés peuvent être remboursés'
      });
    }

    // Vérifier le montant de remboursement
    if (amount) {
      const totalRefunded = payment.getTotalRefunded();
      const maxRefundable = payment.amount - totalRefunded;

      if (amount > maxRefundable) {
        return res.status(400).json({
          success: false,
          message: `Le montant de remboursement ne peut pas dépasser ${maxRefundable} ${payment.currency}`,
          maxRefundable,
          totalRefunded
        });
      }
    }

    // Ajouter le paiement à la requête
    req.payment = payment;
    next();

  } catch (error) {
    console.error('Erreur validation remboursement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la validation du remboursement'
    });
  }
};

// Middleware pour valider les webhooks
export const validateWebhook = (provider) => {
  return async (req, res, next) => {
    try {
      // Vérifier que la requête provient bien du bon fournisseur
      const userAgent = req.headers['user-agent'];
      const contentType = req.headers['content-type'];

      if (provider === 'stripe') {
        if (!req.headers['stripe-signature']) {
          return res.status(400).json({
            success: false,
            message: 'Signature Stripe manquante'
          });
        }
      } else if (provider === 'paypal') {
        if (!req.headers['paypal-transmission-id']) {
          return res.status(400).json({
            success: false,
            message: 'Headers PayPal manquants'
          });
        }
      }

      next();

    } catch (error) {
      console.error('Erreur validation webhook:', error);
      res.status(400).json({
        success: false,
        message: 'Erreur de validation du webhook'
      });
    }
  };
};

// Middleware pour logger les tentatives de paiement
export const logPaymentAttempt = (req, res, next) => {
  const startTime = Date.now();
  
  // Logger la tentative
  console.log(`[PAYMENT] Tentative de paiement - User: ${req.user._id}, Order: ${req.body.orderId}, Amount: ${req.body.amount}`);
  
  // Intercepter la réponse pour logger le résultat
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    const success = data && typeof data === 'object' && data.success;
    
    console.log(`[PAYMENT] Résultat - User: ${req.user._id}, Success: ${success}, Duration: ${duration}ms`);
    
    originalSend.call(this, data);
  };
  
  next();
};

// Middleware pour vérifier les limites de taux
export const checkPaymentRateLimit = (req, res, next) => {
  // Cette fonction pourrait être étendue pour implémenter un rate limiting
  // basé sur Redis ou une base de données
  const userId = req.user._id;
  const now = Date.now();
  
  // Pour l'instant, on log juste l'activité
  console.log(`[RATE_LIMIT] Payment attempt by user ${userId} at ${new Date(now).toISOString()}`);
  
  next();
};

export default {
  validateOrderForPayment,
  validatePaymentAmount,
  validatePaymentMethod,
  validateRefund,
  validateWebhook,
  logPaymentAttempt,
  checkPaymentRateLimit
};
