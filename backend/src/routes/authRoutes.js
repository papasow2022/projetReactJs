import express from 'express';
import { body } from 'express-validator';
import {
  register,
  verifyEmail,
  resendVerificationCode,
  login,
  verifyToken
} from '../controllers/authController.js';

const router = express.Router();

// Validation pour l'inscription
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
  body('prenom')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Le prénom doit contenir au moins 2 caractères'),
  body('nom')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Le nom doit contenir au moins 2 caractères'),
  body('phone')
    .trim()
    .isLength({ min: 9, max: 15 })
    .withMessage('Numéro de téléphone invalide'),
  body('birthDate')
    .isISO8601()
    .withMessage('Date de naissance invalide'),
  body('gender')
    .isIn(['Homme', 'Femme', 'Autre'])
    .withMessage('Genre invalide'),
  body('newsletter')
    .optional()
    .isBoolean()
    .withMessage('Newsletter doit être un booléen')
];

// Validation pour la connexion
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis')
];

// Validation pour la vérification d'email
const verifyEmailValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('code')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('Code de confirmation invalide')
];

// Validation pour le renvoi de code
const resendCodeValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/verify-email', verifyEmailValidation, verifyEmail);
router.post('/resend-code', resendCodeValidation, resendVerificationCode);
router.post('/login', loginValidation, login);

// Route protégée pour tester le token
router.get('/me', verifyToken, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      prenom: req.user.prenom,
      nom: req.user.nom,
      phone: req.user.phone,
      birthDate: req.user.birthDate,
      gender: req.user.gender,
      newsletter: req.user.newsletter,
      isEmailVerified: req.user.isEmailVerified,
      isAdmin: req.user.isAdmin,
      roles: req.user.roles,
      isVendor: req.user.isVendor,
      isVendorValidated: req.user.isVendorValidated,
      vendorStatus: req.user.vendorStatus
    }
  });
});

export default router;
