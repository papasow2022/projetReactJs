import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const testAdminAuth = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow');
    console.log('🔍 Test de l\'authentification admin...');

    // Vérifier les utilisateurs admin
    const adminUsers = await User.find({ isAdmin: true });
    console.log(`📊 Nombre d'utilisateurs admin: ${adminUsers.length}`);

    if (adminUsers.length > 0) {
      console.log('👑 Utilisateurs admin trouvés:');
      adminUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
        console.log(`   - isAdmin: ${user.isAdmin}`);
        console.log(`   - isVendor: ${user.isVendor}`);
        console.log(`   - ID: ${user._id}`);
      });
    } else {
      console.log('❌ Aucun utilisateur admin trouvé!');
    }

    // Vérifier l'utilisateur spécifique
    const testUser = await User.findOne({ email: 'sowdian57@gmail.com' });
    if (testUser) {
      console.log('\n🔍 Utilisateur test (sowdian57@gmail.com):');
      console.log(`   - isAdmin: ${testUser.isAdmin}`);
      console.log(`   - isVendor: ${testUser.isVendor}`);
      console.log(`   - ID: ${testUser._id}`);
    } else {
      console.log('\n❌ Utilisateur test non trouvé!');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test admin:', error);
  } finally {
    await mongoose.disconnect();
  }
};

testAdminAuth();
