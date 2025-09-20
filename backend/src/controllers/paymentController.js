import Payment from '../models/Payment.js';
import Transaction from '../models/Transaction.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { stripeUtils, calculateStripeFees, STRIPE_EVENTS } from '../lib/stripe.js';
import { paypalUtils, calculatePayPalFees, PAYPAL_EVENTS } from '../lib/paypal.js';
import { validationResult } from 'express-validator';
import crypto from 'crypto';

// Générer un ID de paiement unique
const generatePaymentId = () => {
  return `PAY_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

// Générer un ID de transaction unique
const generateTransactionId = () => {
  return `TXN_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

// Créer un paiement Stripe
export const createStripePayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { orderId, amount, currency = 'XOF', metadata = {} } = req.body;
    const userId = req.user._id;

    // Vérifier que la commande existe et appartient à l'utilisateur
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Vérifier que la commande n'a pas déjà un paiement en cours
    const existingPayment = await Payment.findOne({ orderId, status: { $in: ['pending', 'processing'] } });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Un paiement est déjà en cours pour cette commande'
      });
    }

    // Créer le PaymentIntent Stripe
    const paymentIntent = await stripeUtils.createPaymentIntent(amount, currency, {
      orderId: orderId.toString(),
      userId: userId.toString(),
      ...metadata
    });

    // Calculer les frais
    const fees = calculateStripeFees(amount, currency);

    // Créer l'enregistrement de paiement
    const payment = new Payment({
      orderId,
      userId,
      paymentId: generatePaymentId(),
      provider: 'stripe',
      method: 'card',
      amount,
      currency,
      status: 'pending',
      providerTransactionId: paymentIntent.id,
      providerResponse: paymentIntent,
      fees: {
        provider: fees.total,
        platform: 0,
        total: fees.total
      },
      metadata: {
        ...metadata,
        stripe_payment_intent_id: paymentIntent.id
      }
    });

    await payment.save();

    // Créer la transaction
    const transaction = new Transaction({
      paymentId: payment._id,
      orderId,
      userId,
      transactionId: generateTransactionId(),
      provider: 'stripe',
      type: 'payment',
      amount,
      currency,
      status: 'pending',
      providerTransactionId: paymentIntent.id,
      providerResponse: paymentIntent,
      fees: {
        provider: fees.total,
        platform: 0,
        total: fees.total
      },
      netAmount: amount - fees.total,
      description: `Paiement Stripe pour commande ${order.orderNumber}`
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'Paiement créé avec succès',
      payment: {
        id: payment._id,
        paymentId: payment.paymentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status
      },
      stripe: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });

  } catch (error) {
    console.error('Erreur création paiement Stripe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du paiement'
    });
  }
};

// Confirmer un paiement Stripe
export const confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user._id;

    // Récupérer le paiement
    const payment = await Payment.findOne({ 
      providerTransactionId: paymentIntentId,
      userId 
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    // Récupérer le PaymentIntent depuis Stripe
    const paymentIntent = await stripeUtils.retrievePaymentIntent(paymentIntentId);

    // Mettre à jour le statut du paiement
    if (paymentIntent.status === 'succeeded') {
      payment.status = 'completed';
      payment.providerStatus = paymentIntent.status;
      await payment.save();

      // Mettre à jour la commande
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        await order.save();
      }

      // Mettre à jour la transaction
      const transaction = await Transaction.findOne({ paymentId: payment._id });
      if (transaction) {
        transaction.status = 'completed';
        transaction.processedAt = new Date();
        await transaction.save();
      }

      res.json({
        success: true,
        message: 'Paiement confirmé avec succès',
        payment: {
          id: payment._id,
          status: payment.status,
          amount: payment.amount
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Le paiement n\'a pas encore été confirmé',
        status: paymentIntent.status
      });
    }

  } catch (error) {
    console.error('Erreur confirmation paiement Stripe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la confirmation du paiement'
    });
  }
};

// Créer un paiement PayPal
export const createPayPalPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { orderId, amount, currency = 'XOF', items = [] } = req.body;
    const userId = req.user._id;

    // Vérifier que la commande existe
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Vérifier qu'il n'y a pas déjà un paiement en cours
    const existingPayment = await Payment.findOne({ orderId, status: { $in: ['pending', 'processing'] } });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Un paiement est déjà en cours pour cette commande'
      });
    }

    // Créer la commande PayPal
    const paypalOrder = await paypalUtils.createOrder(amount, currency, items, {
      orderId: orderId.toString(),
      userId: userId.toString()
    });

    // Calculer les frais
    const fees = calculatePayPalFees(amount, currency);

    // Créer l'enregistrement de paiement
    const payment = new Payment({
      orderId,
      userId,
      paymentId: generatePaymentId(),
      provider: 'paypal',
      method: 'paypal',
      amount,
      currency,
      status: 'pending',
      providerTransactionId: paypalOrder.id,
      providerResponse: paypalOrder,
      fees: {
        provider: fees.total,
        platform: 0,
        total: fees.total
      },
      metadata: {
        paypal_order_id: paypalOrder.id
      }
    });

    await payment.save();

    // Créer la transaction
    const transaction = new Transaction({
      paymentId: payment._id,
      orderId,
      userId,
      transactionId: generateTransactionId(),
      provider: 'paypal',
      type: 'payment',
      amount,
      currency,
      status: 'pending',
      providerTransactionId: paypalOrder.id,
      providerResponse: paypalOrder,
      fees: {
        provider: fees.total,
        platform: 0,
        total: fees.total
      },
      netAmount: amount - fees.total,
      description: `Paiement PayPal pour commande ${order.orderNumber}`
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'Paiement PayPal créé avec succès',
      payment: {
        id: payment._id,
        paymentId: payment.paymentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status
      },
      paypal: {
        orderId: paypalOrder.id,
        approvalUrl: paypalOrder.links.find(link => link.rel === 'approve')?.href
      }
    });

  } catch (error) {
    console.error('Erreur création paiement PayPal:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du paiement'
    });
  }
};

// Capturer un paiement PayPal
export const capturePayPalPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user._id;

    // Récupérer le paiement
    const payment = await Payment.findOne({ 
      providerTransactionId: orderId,
      userId 
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    // Capturer la commande PayPal
    const captureResult = await paypalUtils.captureOrder(orderId);

    if (captureResult.status === 'COMPLETED') {
      // Mettre à jour le paiement
      payment.status = 'completed';
      payment.providerStatus = captureResult.status;
      payment.providerResponse = captureResult;
      await payment.save();

      // Mettre à jour la commande
      const order = await Order.findById(payment.orderId);
      if (order) {
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        await order.save();
      }

      // Mettre à jour la transaction
      const transaction = await Transaction.findOne({ paymentId: payment._id });
      if (transaction) {
        transaction.status = 'completed';
        transaction.processedAt = new Date();
        await transaction.save();
      }

      res.json({
        success: true,
        message: 'Paiement PayPal capturé avec succès',
        payment: {
          id: payment._id,
          status: payment.status,
          amount: payment.amount
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'La capture du paiement a échoué',
        status: captureResult.status
      });
    }

  } catch (error) {
    console.error('Erreur capture paiement PayPal:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la capture du paiement'
    });
  }
};

// Rembourser un paiement
export const refundPayment = async (req, res) => {
  try {
    const { paymentId, amount, reason = 'requested_by_customer' } = req.body;
    const userId = req.user._id;

    // Récupérer le paiement
    const payment = await Payment.findOne({ _id: paymentId, userId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Seuls les paiements complétés peuvent être remboursés'
      });
    }

    const refundAmount = amount || payment.amount;

    let refundResult;
    if (payment.provider === 'stripe') {
      refundResult = await stripeUtils.createRefund(
        payment.providerTransactionId,
        refundAmount,
        reason
      );
    } else if (payment.provider === 'paypal') {
      // Pour PayPal, on a besoin du capture_id
      const captureId = payment.providerResponse.purchase_units?.[0]?.payments?.captures?.[0]?.id;
      if (!captureId) {
        return res.status(400).json({
          success: false,
          message: 'Impossible de trouver l\'ID de capture pour le remboursement'
        });
      }
      refundResult = await paypalUtils.createRefund(captureId, refundAmount, reason);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Type de paiement non supporté pour le remboursement'
      });
    }

    // Ajouter le remboursement au paiement
    await payment.addRefund({
      refundId: refundResult.id,
      amount: refundAmount,
      reason: reason,
      status: refundResult.status || 'succeeded'
    });

    // Mettre à jour le statut du paiement
    const totalRefunded = payment.getTotalRefunded();
    if (totalRefunded >= payment.amount) {
      payment.status = 'refunded';
    } else {
      payment.status = 'partially_refunded';
    }
    await payment.save();

    res.json({
      success: true,
      message: 'Remboursement initié avec succès',
      refund: {
        id: refundResult.id,
        amount: refundAmount,
        status: refundResult.status || 'succeeded'
      }
    });

  } catch (error) {
    console.error('Erreur remboursement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du remboursement'
    });
  }
};

// Obtenir l'historique des paiements d'un utilisateur
export const getUserPayments = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status, provider } = req.query;

    const query = { userId };
    if (status) query.status = status;
    if (provider) query.provider = provider;

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('orderId', 'orderNumber total status')
      .select('-providerResponse -webhookEvents');

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      payments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Erreur récupération paiements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des paiements'
    });
  }
};

// Obtenir les détails d'un paiement
export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user._id;

    const payment = await Payment.findOne({ _id: paymentId, userId })
      .populate('orderId', 'orderNumber total status items')
      .populate('userId', 'prenom nom email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    res.json({
      success: true,
      payment
    });

  } catch (error) {
    console.error('Erreur récupération détails paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des détails'
    });
  }
};

// Webhook Stripe
export const handleStripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const rawBody = req.body;

    const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);

    // Enregistrer l'événement webhook
    const webhookEvent = {
      eventId: event.id,
      eventType: event.type,
      processed: false,
      receivedAt: new Date()
    };

    // Traiter l'événement selon son type
    switch (event.type) {
      case STRIPE_EVENTS.PAYMENT_INTENT_SUCCEEDED:
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case STRIPE_EVENTS.PAYMENT_INTENT_PAYMENT_FAILED:
        await handlePaymentIntentFailed(event.data.object);
        break;
      case STRIPE_EVENTS.CHARGE_DISPUTE_CREATED:
        await handleChargeDisputeCreated(event.data.object);
        break;
      default:
        console.log(`Événement Stripe non géré: ${event.type}`);
    }

    webhookEvent.processed = true;

    res.json({ received: true });

  } catch (error) {
    console.error('Erreur webhook Stripe:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
};

// Webhook PayPal
export const handlePayPalWebhook = async (req, res) => {
  try {
    const headers = req.headers;
    const body = req.body;

    const isValid = await paypalUtils.verifyWebhook(
      headers,
      body,
      process.env.PAYPAL_WEBHOOK_ID
    );

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event = body;
    console.log('Événement PayPal reçu:', event.event_type);

    // Traiter l'événement selon son type
    switch (event.event_type) {
      case PAYPAL_EVENTS.PAYMENT_CAPTURE_COMPLETED:
        await handlePayPalPaymentCompleted(event.resource);
        break;
      case PAYPAL_EVENTS.PAYMENT_CAPTURE_DENIED:
        await handlePayPalPaymentDenied(event.resource);
        break;
      default:
        console.log(`Événement PayPal non géré: ${event.event_type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Erreur webhook PayPal:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
};

// Gestionnaires d'événements Stripe
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  const payment = await Payment.findOne({ providerTransactionId: paymentIntent.id });
  if (payment) {
    payment.status = 'completed';
    payment.providerStatus = paymentIntent.status;
    await payment.save();

    // Mettre à jour la commande
    const order = await Order.findById(payment.orderId);
    if (order) {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      await order.save();
    }
  }
};

const handlePaymentIntentFailed = async (paymentIntent) => {
  const payment = await Payment.findOne({ providerTransactionId: paymentIntent.id });
  if (payment) {
    payment.status = 'failed';
    payment.providerStatus = paymentIntent.status;
    payment.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
    await payment.save();
  }
};

const handleChargeDisputeCreated = async (dispute) => {
  console.log('Dispute créé:', dispute.id);
  // Implémenter la logique de gestion des disputes
};

// Gestionnaires d'événements PayPal
const handlePayPalPaymentCompleted = async (capture) => {
  const payment = await Payment.findOne({ 
    'providerResponse.id': capture.supplementary_data?.related_ids?.order_id 
  });
  
  if (payment) {
    payment.status = 'completed';
    payment.providerStatus = capture.status;
    await payment.save();

    // Mettre à jour la commande
    const order = await Order.findById(payment.orderId);
    if (order) {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      await order.save();
    }
  }
};

const handlePayPalPaymentDenied = async (capture) => {
  const payment = await Payment.findOne({ 
    'providerResponse.id': capture.supplementary_data?.related_ids?.order_id 
  });
  
  if (payment) {
    payment.status = 'failed';
    payment.providerStatus = capture.status;
    payment.failureReason = 'Payment denied by PayPal';
    await payment.save();
  }
};
