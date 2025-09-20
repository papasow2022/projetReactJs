import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const makeUserAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow');
    console.log('🔧 Rendre l\'utilisateur admin...');

    const userEmail = 'sowdian57@gmail.com';
    
    // Trouver l'utilisateur
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.log('❌ Utilisateur non trouvé!');
      await mongoose.disconnect();
      return;
    }

    console.log(`👤 Utilisateur trouvé: ${user.firstName} ${user.lastName}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - isAdmin actuel: ${user.isAdmin}`);
    console.log(`   - isVendor actuel: ${user.isVendor}`);

    // Rendre admin
    user.isAdmin = true;
    await user.save();

    console.log('✅ Utilisateur rendu admin avec succès!');
    console.log(`   - isAdmin maintenant: ${user.isAdmin}`);

  } catch (error) {
    console.error('❌ Erreur lors de la modification:', error);
  } finally {
    await mongoose.disconnect();
  }
};

makeUserAdmin();
