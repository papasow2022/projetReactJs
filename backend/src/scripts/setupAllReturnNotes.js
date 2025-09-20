import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Return from '../models/Return.js';

dotenv.config();

const setupAllReturnNotes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow');
    console.log('🔧 Configuration des notes pour tous les retours...');

    const returns = await Return.find({});
    
    for (const retour of returns) {
      console.log(`\n📝 Configuration du retour ${retour.returnNumber}...`);
      
      // 1. Raison du retour
      retour.returnReason = 'defective';
      retour.returnDetails = retour.items[0]?.description || 'Produit défectueux';
      
      // 2. Notes du client
      if (!retour.customerNotes) {
        retour.customerNotes = 'Merci pour le traitement rapide de mon retour. J\'apprécie votre service client.';
      }
      
      // 3. Notes admin
      if (!retour.adminNotes) {
        retour.adminNotes = 'Produit remboursé avec succès - Client satisfait';
      }
      
      // 4. Message envoyé au client
      if (!retour.adminMessageToClient) {
        retour.adminMessageToClient = 'Votre remboursement a été traité avec succès. Vous recevrez le montant sous 3-5 jours ouvrés.';
      }
      
      await retour.save();
      
      console.log(`✅ Retour ${retour.returnNumber} configuré:`);
      console.log(`  1. Raison: ${retour.returnReason} - ${retour.returnDetails}`);
      console.log(`  2. Notes client: ${retour.customerNotes}`);
      console.log(`  3. Notes admin: ${retour.adminNotes}`);
      console.log(`  4. Message client: ${retour.adminMessageToClient}`);
    }

    console.log('\n🎉 Configuration terminée pour tous les retours !');

  } catch (error) {
    console.error('❌ Erreur lors de la configuration des notes:', error);
  } finally {
    await mongoose.disconnect();
  }
};

setupAllReturnNotes();
