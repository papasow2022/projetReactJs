import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow');
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

// Créer un utilisateur admin
const createAdminUser = async () => {
  try {
    await connectDB();

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: 'admin@papasow.com' });
    if (existingAdmin) {
      console.log('⚠️  L\'utilisateur admin existe déjà');
      console.log('📧 Email:', existingAdmin.email);
      console.log('🔑 Rôles:', existingAdmin.roles);
      console.log('👤 Admin:', existingAdmin.isAdmin);
      return;
    }

    // Créer l'utilisateur admin
    const adminUser = new User({
      email: 'admin@papasow.com',
      password: 'admin123456', // Le mot de passe sera hashé automatiquement
      prenom: 'Admin',
      nom: 'Papasow',
      phone: '+221 77 123 45 67',
      birthDate: new Date('1990-01-01'),
      gender: 'Homme',
      newsletter: true,
      isEmailVerified: true,
      isAdmin: true,
      roles: ['superadmin'],
      isVendor: false,
      isVendorValidated: false,
      vendorStatus: 'none'
    });

    await adminUser.save();

    console.log('🎉 Utilisateur admin créé avec succès !');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Mot de passe: admin123456');
    console.log('👤 Rôles:', adminUser.roles);
    console.log('🔐 Admin:', adminUser.isAdmin);

    // Créer aussi un modérateur
    const moderatorUser = new User({
      email: 'moderator@papasow.com',
      password: 'moderator123456',
      prenom: 'Moderator',
      nom: 'Test',
      phone: '+221 77 123 45 68',
      birthDate: new Date('1990-01-01'),
      gender: 'Femme',
      newsletter: true,
      isEmailVerified: true,
      isAdmin: true,
      roles: ['moderator'],
      isVendor: false,
      isVendorValidated: false,
      vendorStatus: 'none'
    });

    await moderatorUser.save();

    console.log('🎉 Utilisateur modérateur créé avec succès !');
    console.log('📧 Email:', moderatorUser.email);
    console.log('🔑 Mot de passe: moderator123456');
    console.log('👤 Rôles:', moderatorUser.roles);

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnexion de MongoDB');
    process.exit(0);
  }
};

// Exécuter le script
createAdminUser();

