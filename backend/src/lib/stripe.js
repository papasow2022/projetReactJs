import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Configuration Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: false
});

// Configuration des webhooks
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Méthodes utilitaires Stripe
export const stripeUtils = {
  // Créer un PaymentIntent
  createPaymentIntent: async (amount, currency = 'xof', metadata = {}) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe utilise les centimes
        currency: currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          ...metadata,
          platform: 'ventechaussure'
        }
      });
      return paymentIntent;
    } catch (error) {
      console.error('Erreur création PaymentIntent:', error);
      throw error;
    }
  },

  // Récupérer un PaymentIntent
  retrievePaymentIntent: async (paymentIntentId) => {
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Erreur récupération PaymentIntent:', error);
      throw error;
    }
  },

  // Confirmer un PaymentIntent
  confirmPaymentIntent: async (paymentIntentId, paymentMethodId) => {
    try {
      return await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId
      });
    } catch (error) {
      console.error('Erreur confirmation PaymentIntent:', error);
      throw error;
    }
  },

  // Annuler un PaymentIntent
  cancelPaymentIntent: async (paymentIntentId) => {
    try {
      return await stripe.paymentIntents.cancel(paymentIntentId);
    } catch (error) {
      console.error('Erreur annulation PaymentIntent:', error);
      throw error;
    }
  },

  // Créer un remboursement
  createRefund: async (paymentIntentId, amount = null, reason = 'requested_by_customer') => {
    try {
      const refundData = {
        payment_intent: paymentIntentId,
        reason: reason
      };
      
      if (amount) {
        refundData.amount = Math.round(amount * 100);
      }

      return await stripe.refunds.create(refundData);
    } catch (error) {
      console.error('Erreur création remboursement:', error);
      throw error;
    }
  },

  // Récupérer un remboursement
  retrieveRefund: async (refundId) => {
    try {
      return await stripe.refunds.retrieve(refundId);
    } catch (error) {
      console.error('Erreur récupération remboursement:', error);
      throw error;
    }
  },

  // Créer un Customer Stripe
  createCustomer: async (email, name, metadata = {}) => {
    try {
      return await stripe.customers.create({
        email,
        name,
        metadata: {
          ...metadata,
          platform: 'ventechaussure'
        }
      });
    } catch (error) {
      console.error('Erreur création Customer:', error);
      throw error;
    }
  },

  // Récupérer un Customer
  retrieveCustomer: async (customerId) => {
    try {
      return await stripe.customers.retrieve(customerId);
    } catch (error) {
      console.error('Erreur récupération Customer:', error);
      throw error;
    }
  },

  // Créer un SetupIntent pour sauvegarder les méthodes de paiement
  createSetupIntent: async (customerId) => {
    try {
      return await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card']
      });
    } catch (error) {
      console.error('Erreur création SetupIntent:', error);
      throw error;
    }
  },

  // Récupérer les méthodes de paiement d'un customer
  getPaymentMethods: async (customerId, type = 'card') => {
    try {
      return await stripe.paymentMethods.list({
        customer: customerId,
        type: type
      });
    } catch (error) {
      console.error('Erreur récupération méthodes de paiement:', error);
      throw error;
    }
  },

  // Supprimer une méthode de paiement
  detachPaymentMethod: async (paymentMethodId) => {
    try {
      return await stripe.paymentMethods.detach(paymentMethodId);
    } catch (error) {
      console.error('Erreur suppression méthode de paiement:', error);
      throw error;
    }
  }
};

// Gestion des webhooks Stripe
export const handleStripeWebhook = (rawBody, signature) => {
  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    return event;
  } catch (error) {
    console.error('Erreur webhook Stripe:', error);
    throw new Error('Webhook signature verification failed');
  }
};

// Types d'événements Stripe supportés
export const STRIPE_EVENTS = {
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_INTENT_PAYMENT_FAILED: 'payment_intent.payment_failed',
  PAYMENT_INTENT_CANCELED: 'payment_intent.canceled',
  PAYMENT_INTENT_REQUIRES_ACTION: 'payment_intent.requires_action',
  CHARGE_SUCCEEDED: 'charge.succeeded',
  CHARGE_FAILED: 'charge.failed',
  CHARGE_DISPUTE_CREATED: 'charge.dispute.created',
  REFUND_CREATED: 'charge.refund.created',
  REFUND_UPDATED: 'charge.refund.updated',
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
  PAYMENT_METHOD_ATTACHED: 'payment_method.attached',
  PAYMENT_METHOD_DETACHED: 'payment_method.detached'
};

// Calculer les frais Stripe
export const calculateStripeFees = (amount, currency = 'xof') => {
  // Frais Stripe : 1.4% + 0.25€ pour l'Europe, 2.9% + 0.30€ pour l'international
  // Pour XOF, on utilise les frais internationaux
  const percentage = 0.029; // 2.9%
  const fixedFee = 0.30; // 0.30€
  
  const percentageFee = amount * percentage;
  const totalFee = percentageFee + fixedFee;
  
  return {
    percentage: percentageFee,
    fixed: fixedFee,
    total: totalFee
  };
};

export default stripe;
