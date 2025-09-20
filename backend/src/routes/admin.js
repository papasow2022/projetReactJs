import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { 
  getDashboardStats, 
  getUsers, 
  updateUserRole, 
  getDetailedStats 
} from '../controllers/adminController.js';

const router = express.Router();

// Middleware d'authentification pour toutes les routes admin
router.use(verifyToken);

// Middleware pour vérifier les permissions admin
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Accès administrateur requis'
    });
  }
  next();
};

// Middleware pour vérifier les permissions superadmin
const requireSuperAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin || !req.user.roles?.includes('superadmin')) {
    return res.status(403).json({
      success: false,
      message: 'Accès superadministrateur requis'
    });
  }
  next();
};

// Routes du dashboard admin
router.get('/dashboard/stats', requireAdmin, getDashboardStats);
router.get('/dashboard/stats/detailed', requireAdmin, getDetailedStats);

// Routes de gestion des utilisateurs (superadmin uniquement)
router.get('/users', requireSuperAdmin, getUsers);
router.put('/users/:userId/role', requireSuperAdmin, updateUserRole);

export default router;

