import mongoose from 'mongoose';
import User from './src/models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

async function testAdminLogin() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow');
    console.log('✅ MongoDB connecté');

    console.log('🔍 Recherche du compte admin...');
    const admin = await User.findOne({ email: 'admin@papasow.com' });
    
    if (!admin) {
      console.log('❌ Compte admin non trouvé');
      return;
    }

    console.log('✅ Compte admin trouvé:', {
      email: admin.email,
      isAdmin: admin.isAdmin,
      roles: admin.roles,
      isEmailVerified: admin.isEmailVerified
    });

    console.log('🔐 Test du mot de passe...');
    const isPasswordValid = await admin.comparePassword('admin123');
    
    if (!isPasswordValid) {
      console.log('❌ Mot de passe incorrect');
      return;
    }

    console.log('✅ Mot de passe correct');

    // Générer un token JWT
    const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-papasow-admin-2024';
    const token = jwt.sign({ userId: admin._id }, secret, { expiresIn: '24h' });

    console.log('🎫 Token généré:', token.substring(0, 50) + '...');

    // Simuler la réponse de l'API
    const apiResponse = {
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: admin._id,
        email: admin.email,
        prenom: admin.prenom,
        nom: admin.nom,
        phone: admin.phone,
        isAdmin: admin.isAdmin,
        roles: admin.roles,
        isVendor: admin.isVendor,
        isVendorValidated: admin.isVendorValidated
      }
    };

    console.log('✅ Réponse API simulée:', {
      success: apiResponse.success,
      user: {
        email: apiResponse.user.email,
        isAdmin: apiResponse.user.isAdmin,
        roles: apiResponse.user.roles
      }
    });

    console.log('\n🎯 IDENTIFIANTS ADMIN :');
    console.log('Email: admin@papasow.com');
    console.log('Mot de passe: admin123');
    console.log('Token:', token);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnexion de MongoDB');
  }
}

testAdminLogin();

