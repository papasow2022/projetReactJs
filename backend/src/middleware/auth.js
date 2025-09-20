import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import connectMongo from '../lib/mongo.js';

export const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Token d\'authentification requis',
      success: false 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Récupérer les données complètes de l'utilisateur depuis la base de données
    await connectMongo();
    const user = await User.findById(decoded.userId).select('-password -emailVerificationCode');
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Utilisateur non trouvé',
        success: false 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur vérification token:', error);
    return res.status(401).json({ 
      error: 'Token invalide',
      success: false 
    });
  }
};

// Middleware optionnel pour l'authentification (ne bloque pas si pas de token)
export const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

export const verifyAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ 
      error: 'Accès administrateur requis',
      success: false 
    });
  }
  next();
};

export const verifyVendor = (req, res, next) => {
  if (!req.user || !req.user.isVendor) {
    return res.status(403).json({ 
      error: 'Accès vendeur requis',
      success: false 
    });
  }
  next();
};

// Export par défaut pour compatibilité
export default verifyToken;
