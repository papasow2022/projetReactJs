import express from 'express';
import { body } from 'express-validator';
import { verifyToken, verifyVendor, verifyAdmin } from '../middleware/auth.js';
import {
  createVendor,
  getVendorProfile,
  updateVendorProfile,
  getVendorStats,
  getVendorOrders,
  updateOrderStatus,
  getVendorProducts,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
  approveVendor,
  rejectVendor,
  getPendingVendors
} from '../controllers/vendorController.js';

const router = express.Router();

// Middleware d'authentification pour toutes les routes
router.use(verifyToken);

// Validation pour la création de vendeur
const createVendorValidation = [
  body('businessName').notEmpty().withMessage('Le nom de l\'entreprise est requis'),
  body('businessType').isIn(['individual', 'company', 'corporation']).withMessage('Type d\'entreprise invalide'),
  body('taxId').notEmpty().withMessage('L\'identifiant fiscal est requis'),
  body('contactEmail').isEmail().withMessage('Email de contact invalide'),
  body('phone').notEmpty().withMessage('Le téléphone est requis'),
  body('businessAddress.street').notEmpty().withMessage('L\'adresse de l\'entreprise est requise'),
  body('businessAddress.city').notEmpty().withMessage('La ville est requise'),
  body('businessAddress.state').notEmpty().withMessage('L\'état/région est requis'),
  body('businessAddress.postalCode').notEmpty().withMessage('Le code postal est requis'),
  body('businessAddress.country').notEmpty().withMessage('Le pays est requis'),
  body('bankAccount.accountHolder').notEmpty().withMessage('Le titulaire du compte est requis'),
  body('bankAccount.accountNumber').notEmpty().withMessage('Le numéro de compte est requis'),
  body('bankAccount.bankName').notEmpty().withMessage('Le nom de la banque est requis'),
  body('bankAccount.routingNumber').notEmpty().withMessage('Le numéro de routage est requis')
];

// Validation pour la mise à jour du profil vendeur
const updateVendorValidation = [
  body('businessName').optional().notEmpty().withMessage('Le nom de l\'entreprise ne peut pas être vide'),
  body('contactEmail').optional().isEmail().withMessage('Email de contact invalide'),
  body('phone').optional().notEmpty().withMessage('Le téléphone ne peut pas être vide')
];

// Validation pour la création de produit
const createProductValidation = [
  body('name').notEmpty().withMessage('Le nom du produit est requis'),
  body('description').notEmpty().withMessage('La description est requise'),
  body('category').notEmpty().withMessage('La catégorie est requise'),
  body('subcategory').notEmpty().withMessage('La sous-catégorie est requise'),
  body('brand').notEmpty().withMessage('La marque est requise'),
  body('sku').notEmpty().withMessage('Le SKU est requis'),
  body('price').isNumeric().withMessage('Le prix doit être un nombre'),
  body('price').isFloat({ min: 0 }).withMessage('Le prix doit être positif')
];

// Validation pour la mise à jour de produit
const updateProductValidation = [
  body('name').optional().notEmpty().withMessage('Le nom du produit ne peut pas être vide'),
  body('price').optional().isNumeric().withMessage('Le prix doit être un nombre'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Le prix doit être positif')
];

// Routes du profil vendeur
router.post('/profile', createVendorValidation, createVendor);
router.get('/profile', verifyVendor, getVendorProfile);
router.put('/profile', verifyVendor, updateVendorValidation, updateVendorProfile);

// Routes des statistiques
router.get('/stats', verifyVendor, getVendorStats);

// Routes des commandes
router.get('/orders', verifyVendor, getVendorOrders);
router.put('/orders/:orderId/status', verifyVendor, updateOrderStatus);

// Routes des produits
router.get('/products', verifyVendor, getVendorProducts);
router.post('/products', verifyVendor, createProductValidation, createVendorProduct);
router.put('/products/:productId', verifyVendor, updateProductValidation, updateVendorProduct);
router.delete('/products/:productId', verifyVendor, deleteVendorProduct);

// Routes admin pour la gestion des vendeurs
router.get('/admin/pending', verifyAdmin, getPendingVendors);
router.put('/admin/:vendorId/approve', verifyAdmin, approveVendor);
router.put('/admin/:vendorId/reject', verifyAdmin, rejectVendor);

export default router;
