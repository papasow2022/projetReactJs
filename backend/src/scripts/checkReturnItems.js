import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Return from '../models/Return.js';

dotenv.config();

const checkReturnItems = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow');
    console.log('🔍 Vérification des items des retours...');

    const returns = await Return.find({});

    returns.forEach((returnDoc, index) => {
      console.log(`\n=== RETOUR ${index + 1} (${returnDoc.returnNumber}) ===`);
      returnDoc.items.forEach((item, itemIndex) => {
        console.log(`  Article ${itemIndex + 1}:`);
        console.log(`    Nom: ${item.productName}`);
        console.log(`    Prix: ${item.total}`);
        console.log(`    État: ${item.condition}`);
        console.log(`    Raison: ${item.reason}`);
      });
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification des items:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkReturnItems();
