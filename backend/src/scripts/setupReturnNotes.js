import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Return from '../models/Return.js';

dotenv.config();

const setupReturnNotes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow');
    console.log('🔧 Configuration des 4 sections de notes...');
    
    const retour = await Return.findOne({ returnNumber: 'RET-472906' });
    if (retour) {
      // 1. Raison du retour
      retour.returnReason = 'defective';
      retour.returnDetails = 'j\'ai pas aimé le produit';
      
      // 2. Notes du client
      retour.customerNotes = 'Merci pour le traitement rapide de mon retour. J\'apprécie votre service client.';
      
      // 3. Notes admin
      retour.adminNotes = 'Produit remboursé avec succès - Client satisfait';
      
      // 4. Message envoyé au client
      retour.adminMessageToClient = 'Votre remboursement a été traité avec succès. Vous recevrez le montant sous 3-5 jours ouvrés.';
      
      await retour.save();
      
      console.log('✅ Configuration terminée:');
      console.log('1. Raison:', retour.returnReason, '-', retour.returnDetails);
      console.log('2. Notes du client:', retour.customerNotes);
      console.log('3. Notes admin:', retour.adminNotes);
      console.log('4. Message au client:', retour.adminMessageToClient);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
  }
};

setupReturnNotes();
