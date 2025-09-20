import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Return from '../models/Return.js';

dotenv.config();

const checkReturnStructure = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow');
    console.log('🔍 Vérification de la structure des retours...');

    const returns = await Return.find({});
    console.log(`📊 Nombre de retours: ${returns.length}`);

    if (returns.length > 0) {
      const firstReturn = returns[0];
      console.log('\n📋 Structure du premier retour:');
      console.log(`   - _id: ${firstReturn._id}`);
      console.log(`   - returnNumber: ${firstReturn.returnNumber}`);
      console.log(`   - orderId: ${firstReturn.orderId}`);
      console.log(`   - orderNumber: ${firstReturn.orderNumber}`);
      console.log(`   - status: ${firstReturn.status}`);
      console.log(`   - customer.email: ${firstReturn.customer?.email}`);
      
      // Vérifier les champs requis
      console.log('\n🔍 Vérification des champs requis:');
      console.log(`   - orderId présent: ${!!firstReturn.orderId}`);
      console.log(`   - orderNumber présent: ${!!firstReturn.orderNumber}`);
      console.log(`   - customer présent: ${!!firstReturn.customer}`);
      console.log(`   - status présent: ${!!firstReturn.status}`);
      
      // Vérifier la structure complète
      console.log('\n📄 Structure complète:');
      console.log(JSON.stringify(firstReturn.toObject(), null, 2));
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkReturnStructure();
