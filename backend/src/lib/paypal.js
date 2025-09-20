import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configuration PayPal
const environment = process.env.PAYPAL_ENVIRONMENT === 'production' 
  ? new paypal.core.LiveEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    )
  : new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    );

const client = new paypal.core.PayPalHttpClient(environment);

// Méthodes utilitaires PayPal
export const paypalUtils = {
  // Créer une commande PayPal
  createOrder: async (amount, currency = 'XOF', items = [], metadata = {}) => {
    try {
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: currency,
                value: amount.toFixed(2)
              }
            }
          },
          items: items.map(item => ({
            name: item.name,
            unit_amount: {
              currency_code: currency,
              value: item.price.toFixed(2)
            },
            quantity: item.quantity.toString(),
            category: 'PHYSICAL_GOODS'
          })),
          custom_id: metadata.orderId || '',
          description: metadata.description || 'Commande VenteChaussure'
        }],
        application_context: {
          brand_name: 'VenteChaussure',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.FRONTEND_URL}/payment/success`,
          cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
        }
      });

      const response = await client.execute(request);
      return response.result;
    } catch (error) {
      console.error('Erreur création commande PayPal:', error);
      throw error;
    }
  },

  // Capturer une commande PayPal
  captureOrder: async (orderId) => {
    try {
      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});
      
      const response = await client.execute(request);
      return response.result;
    } catch (error) {
      console.error('Erreur capture commande PayPal:', error);
      throw error;
    }
  },

  // Récupérer une commande PayPal
  getOrder: async (orderId) => {
    try {
      const request = new paypal.orders.OrdersGetRequest(orderId);
      const response = await client.execute(request);
      return response.result;
    } catch (error) {
      console.error('Erreur récupération commande PayPal:', error);
      throw error;
    }
  },

  // Annuler une commande PayPal
  cancelOrder: async (orderId) => {
    try {
      const request = new paypal.orders.OrdersCancelRequest(orderId);
      request.requestBody({
        reason: 'CANCELLED_BY_BUYER'
      });
      
      const response = await client.execute(request);
      return response.result;
    } catch (error) {
      console.error('Erreur annulation commande PayPal:', error);
      throw error;
    }
  },

  // Créer un remboursement
  createRefund: async (captureId, amount = null, reason = 'REFUND') => {
    try {
      const request = new paypal.payments.CapturesRefundRequest(captureId);
      
      const refundData = {
        amount: amount ? {
          currency_code: 'XOF',
          value: amount.toFixed(2)
        } : undefined,
        note_to_payer: reason
      };

      request.requestBody(refundData);
      const response = await client.execute(request);
      return response.result;
    } catch (error) {
      console.error('Erreur création remboursement PayPal:', error);
      throw error;
    }
  },

  // Récupérer un remboursement
  getRefund: async (refundId) => {
    try {
      const request = new paypal.payments.RefundsGetRequest(refundId);
      const response = await client.execute(request);
      return response.result;
    } catch (error) {
      console.error('Erreur récupération remboursement PayPal:', error);
      throw error;
    }
  },

  // Créer un webhook
  createWebhook: async (webhookUrl, eventTypes) => {
    try {
      const request = new paypal.notifications.WebhooksCreateRequest();
      request.requestBody({
        url: webhookUrl,
        event_types: eventTypes.map(type => ({ name: type }))
      });

      const response = await client.execute(request);
      return response.result;
    } catch (error) {
      console.error('Erreur création webhook PayPal:', error);
      throw error;
    }
  },

  // Vérifier un webhook
  verifyWebhook: async (headers, body, webhookId) => {
    try {
      const request = new paypal.notifications.WebhooksVerifyRequest();
      request.requestBody({
        auth_algo: headers['paypal-auth-algo'],
        cert_id: headers['paypal-cert-id'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: webhookId,
        webhook_event: body
      });

      const response = await client.execute(request);
      return response.result.verification_status === 'SUCCESS';
    } catch (error) {
      console.error('Erreur vérification webhook PayPal:', error);
      return false;
    }
  }
};

// Types d'événements PayPal supportés
export const PAYPAL_EVENTS = {
  PAYMENT_CAPTURE_COMPLETED: 'PAYMENT.CAPTURE.COMPLETED',
  PAYMENT_CAPTURE_DENIED: 'PAYMENT.CAPTURE.DENIED',
  PAYMENT_CAPTURE_PENDING: 'PAYMENT.CAPTURE.PENDING',
  PAYMENT_CAPTURE_REFUNDED: 'PAYMENT.CAPTURE.REFUNDED',
  PAYMENT_CAPTURE_REVERSED: 'PAYMENT.CAPTURE.REVERSED',
  CHECKOUT_ORDER_APPROVED: 'CHECKOUT.ORDER.APPROVED',
  CHECKOUT_ORDER_COMPLETED: 'CHECKOUT.ORDER.COMPLETED',
  CHECKOUT_ORDER_PROCESSED: 'CHECKOUT.ORDER.PROCESSED',
  PAYMENT_AUTHORIZATION_CREATED: 'PAYMENT.AUTHORIZATION.CREATED',
  PAYMENT_AUTHORIZATION_VOIDED: 'PAYMENT.AUTHORIZATION.VOIDED'
};

// Calculer les frais PayPal
export const calculatePayPalFees = (amount, currency = 'XOF') => {
  // Frais PayPal : 3.4% + 0.35€ pour les paiements en ligne
  const percentage = 0.034; // 3.4%
  const fixedFee = 0.35; // 0.35€
  
  const percentageFee = amount * percentage;
  const totalFee = percentageFee + fixedFee;
  
  return {
    percentage: percentageFee,
    fixed: fixedFee,
    total: totalFee
  };
};

export default client;
