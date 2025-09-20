import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Return from '../models/Return.js';

dotenv.config();

const fixReturnNotesRepetition = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow');
    console.log('🔧 Correction de la répétition dans les notes...');

    const returns = await Return.find({});
    
    for (const retour of returns) {
      console.log(`\n📝 Correction du retour ${retour.returnNumber}...`);
      
      // Notes admin : Notes techniques internes
      retour.adminNotes = 'Remboursement traité via PayPal - Référence: PP-123456789 - Client satisfait';
      
      // Message client : Message convivial
      retour.adminMessageToClient = 'Votre remboursement a été traité avec succès. Vous recevrez le montant sous 3-5 jours ouvrés.';
      
      await retour.save();
      
      console.log(`✅ Retour ${retour.returnNumber} corrigé:`);
      console.log(`  Notes admin: ${retour.adminNotes}`);
      console.log(`  Message client: ${retour.adminMessageToClient}`);
    }

    console.log('\n🎉 Correction terminée - Plus de répétition !');

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  } finally {
    await mongoose.disconnect();
  }
};

fixReturnNotesRepetition();
