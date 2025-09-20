import mongoose from 'mongoose';
import connectMongo from '../lib/mongo.js';

async function checkFemmeImages() {
  try {
    await connectMongo();
    console.log('🔗 Connecté à MongoDB');
    
    const db = mongoose.connection.db;
    
    // Vérifier si la collection femme_images existe
    const collections = await db.listCollections().toArray();
    const femmeCollection = collections.find(coll => coll.name === 'femme_images');
    
    if (femmeCollection) {
      console.log('✅ Collection femme_images trouvée !');
      
      // Compter les documents
      const count = await db.collection('femme_images').countDocuments();
      console.log(`📊 Nombre de documents: ${count}`);
      
      if (count > 0) {
        // Vérifier la structure d'un document
        const sample = await db.collection('femme_images').findOne({});
        console.log('📋 Structure du document:');
        console.log(JSON.stringify(sample, null, 2));
        
        // Vérifier les champs de stock
        const fields = Object.keys(sample);
        const stockFields = fields.filter(field => 
          field.toLowerCase().includes('stock') || 
          field.toLowerCase().includes('quantity') || 
          field.toLowerCase().includes('qty')
        );
        
        if (stockFields.length > 0) {
          console.log(`✅ Champs de stock trouvés: ${stockFields.join(', ')}`);
        } else {
          console.log('❌ Aucun champ de stock trouvé');
        }
      }
    } else {
      console.log('❌ Collection femme_images non trouvée');
      console.log('📋 Collections disponibles:');
      collections.forEach(coll => console.log(`   - ${coll.name}`));
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkFemmeImages();
