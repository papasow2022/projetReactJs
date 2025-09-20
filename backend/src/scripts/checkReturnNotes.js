import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Return from '../models/Return.js';

dotenv.config();

const checkReturnNotes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow');
    console.log('🔍 Vérification des notes de retour...');

    const returns = await Return.find({});

    returns.forEach((returnDoc, index) => {
      console.log(`\n=== RETOUR ${index + 1} (${returnDoc.returnNumber}) ===`);
      console.log(`Description: ${returnDoc.items[0]?.description}`);
      console.log(`returnReason: ${returnDoc.returnReason}`);
      console.log(`returnDetails: ${returnDoc.returnDetails}`);
      console.log(`adminNotes: ${returnDoc.adminNotes}`);
      console.log(`customerNotes: ${returnDoc.customerNotes}`);
      console.log(`adminMessageToClient: ${returnDoc.adminMessageToClient}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification des notes de retour:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkReturnNotes();
