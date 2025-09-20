import { Router } from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = Router();

// Route de test pour la connexion admin
router.post('/test-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔍 Test connexion:', { email });

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    console.log('✅ Utilisateur trouvé:', {
      email: user.email,
      isAdmin: user.isAdmin,
      roles: user.roles
    });

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    console.log('✅ Mot de passe correct');

    // Générer un token JWT
    const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-papasow-admin-2024';
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '24h' });

    console.log('✅ Token généré');

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
        phone: user.phone,
        isAdmin: user.isAdmin,
        roles: user.roles,
        isVendor: user.isVendor,
        isVendorValidated: user.isVendorValidated
      }
    });

  } catch (error) {
    console.error('❌ Erreur test connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

export default router;

