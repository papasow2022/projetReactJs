import express from 'express';
import { body } from 'express-validator';
import { verifyToken } from '../controllers/authController.js';
import {
  createStripePayment,
  confirmStripePayment,
  createPayPalPayment,
  capturePayPalPayment,
  refundPayment,
  getUserPayments,
  getPaymentDetails,
  handleStripeWebhook,
  handlePayPalWebhook
} from '../controllers/paymentController.js';

const router = express.Router();

// Middleware pour les webhooks (pas d'authentification JWT)
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);
router.post('/webhooks/paypal', express.json(), handlePayPalWebhook);

// Routes protégées par authentification
router.use(verifyToken);

// Validation pour la création de paiement Stripe
const stripePaymentValidation = [
  body('orderId')
    .isMongoId()
    .withMessage('ID de commande invalide'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Le montant doit être supérieur à 0'),
  body('currency')
    .optional()
    .isIn(['XOF', 'USD', 'EUR'])
    .withMessage('Devise non supportée'),
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Les métadonnées doivent être un objet')
];

// Validation pour la confirmation de paiement Stripe
const stripeConfirmValidation = [
  body('paymentIntentId')
    .notEmpty()
    .withMessage('ID du PaymentIntent requis')
];

// Validation pour la création de paiement PayPal
const paypalPaymentValidation = [
  body('orderId')
    .isMongoId()
    .withMessage('ID de commande invalide'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Le montant doit être supérieur à 0'),
  body('currency')
    .optional()
    .isIn(['XOF', 'USD', 'EUR'])
    .withMessage('Devise non supportée'),
  body('items')
    .optional()
    .isArray()
    .withMessage('Les articles doivent être un tableau')
];

// Validation pour la capture de paiement PayPal
const paypalCaptureValidation = [
  body('orderId')
    .notEmpty()
    .withMessage('ID de commande PayPal requis')
];

// Validation pour le remboursement
const refundValidation = [
  body('paymentId')
    .isMongoId()
    .withMessage('ID de paiement invalide'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Le montant de remboursement doit être supérieur à 0'),
  body('reason')
    .optional()
    .isString()
    .withMessage('La raison doit être une chaîne de caractères')
];

// Routes Stripe
router.post('/stripe/create', stripePaymentValidation, createStripePayment);
router.post('/stripe/confirm', stripeConfirmValidation, confirmStripePayment);

// Routes PayPal
router.post('/paypal/create', paypalPaymentValidation, createPayPalPayment);
router.post('/paypal/capture', paypalCaptureValidation, capturePayPalPayment);

// Routes communes
router.post('/refund', refundValidation, refundPayment);

// Routes de consultation
router.get('/', getUserPayments);
router.get('/:paymentId', getPaymentDetails);

export default router;
