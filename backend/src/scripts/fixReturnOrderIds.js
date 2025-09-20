import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Return from '../models/Return.js';
import Order from '../models/Order.js';

dotenv.config();

const fixReturnOrderIds = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow');
    console.log('🔧 Correction des orderId manquants...');

    const returns = await Return.find({ orderId: { $exists: false } });
    console.log(`📊 Retours sans orderId: ${returns.length}`);

    for (const returnDoc of returns) {
      console.log(`\n🔍 Traitement du retour: ${returnDoc.returnNumber}`);
      console.log(`   - orderNumber: ${returnDoc.orderNumber}`);
      
      // Trouver la commande correspondante
      const order = await Order.findOne({ orderNumber: returnDoc.orderNumber });
      
      if (order) {
        console.log(`   ✅ Commande trouvée: ${order._id}`);
        
        // Mettre à jour le retour avec l'orderId
        returnDoc.orderId = order._id;
        await returnDoc.save();
        
        console.log(`   ✅ Retour mis à jour avec orderId: ${order._id}`);
      } else {
        console.log(`   ❌ Commande non trouvée pour: ${returnDoc.orderNumber}`);
      }
    }

    console.log('\n✅ Correction terminée!');

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  } finally {
    await mongoose.disconnect();
  }
};

fixReturnOrderIds();
