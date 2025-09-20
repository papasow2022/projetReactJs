import express from 'express';
import giftCardController from '../controllers/giftCardController.js';
import { body, param, query } from 'express-validator';
import auth from '../middleware/auth.js';

const router = express.Router();

// Validation pour la création d'une carte-cadeau
const createGiftCardValidation = [
  body('amount')
    .isNumeric()
    .withMessage('Le montant doit être un nombre')
    .isFloat({ min: 1, max: 10000 })
    .withMessage('Le montant doit être entre 1 et 10000'),
  body('sender.name')
    .notEmpty()
    .withMessage('Le nom de l\'expéditeur est requis'),
  body('sender.email')
    .isEmail()
    .withMessage('Email de l\'expéditeur invalide'),
  body('recipient.name')
    .notEmpty()
    .withMessage('Le nom du destinataire est requis'),
  body('recipient.email')
    .isEmail()
    .withMessage('Email du destinataire invalide'),
  body('currency')
    .optional()
    .isIn(['GNF', 'EUR', 'USD'])
    .withMessage('Devise non supportée'),
  body('expirationYears')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Années d\'expiration invalides'),
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Le message ne peut pas dépasser 500 caractères')
];

// Validation pour l'utilisation d'une carte-cadeau
const redeemGiftCardValidation = [
  body('code')
    .notEmpty()
    .withMessage('Le code de la carte-cadeau est requis')
    .matches(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/)
    .withMessage('Format de code invalide'),
  body('amount')
    .isNumeric()
    .withMessage('Le montant doit être un nombre')
    .isFloat({ min: 0.01 })
    .withMessage('Le montant doit être supérieur à 0'),
  body('orderId')
    .optional()
    .isString()
    .withMessage('ID de commande invalide')
];

// Validation pour la recharge
const rechargeGiftCardValidation = [
  body('code')
    .notEmpty()
    .withMessage('Le code de la carte-cadeau est requis')
    .matches(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/)
    .withMessage('Format de code invalide'),
  body('amount')
    .isNumeric()
    .withMessage('Le montant doit être un nombre')
    .isFloat({ min: 1 })
    .withMessage('Le montant doit être supérieur à 0'),
  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('La description ne peut pas dépasser 200 caractères'),
  body('paymentMethod')
    .optional()
    .isIn(['credit_card', 'bank_transfer', 'cash', 'other'])
    .withMessage('Méthode de paiement invalide')
];

// Validation des paramètres
const codeValidation = [
  param('code')
    .matches(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/)
    .withMessage('Format de code invalide')
];

const emailValidation = [
  param('email')
    .isEmail()
    .withMessage('Email invalide')
];

// Routes publiques
router.post('/create', createGiftCardValidation, giftCardController.createGiftCard);
router.post('/redeem', redeemGiftCardValidation, giftCardController.redeemGiftCard);
router.get('/balance/:code', codeValidation, giftCardController.checkBalance);
router.get('/history/:code', codeValidation, giftCardController.getGiftCardHistory);

// Routes protégées (nécessitent une authentification)
router.post('/recharge', auth, rechargeGiftCardValidation, giftCardController.rechargeGiftCard);
router.get('/user/:email', auth, emailValidation, giftCardController.getUserGiftCards);
router.get('/analytics', auth, giftCardController.getAnalytics);
router.put('/cancel/:code', auth, codeValidation, giftCardController.cancelGiftCard);

// Route pour tester la connexion
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API des cartes-cadeaux fonctionnelle',
    timestamp: new Date().toISOString()
  });
});

export default router;
