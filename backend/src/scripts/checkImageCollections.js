import mongoose from 'mongoose';
import connectMongo from '../lib/mongo.js';

async function checkImageCollections() {
  try {
    await connectMongo();
    console.log('🔗 Connecté à MongoDB');
    
    const db = mongoose.connection.db;
    
    const collections = ['homme_images', 'femme_images', 'enfant_images'];
    
    for (const collName of collections) {
      console.log(`\n📁 Collection: ${collName}`);
      
      const count = await db.collection(collName).countDocuments();
      console.log(`   📊 Nombre de documents: ${count}`);
      
      if (count > 0) {
        const sample = await db.collection(collName).findOne({});
        console.log('   📋 Champs disponibles:');
        Object.keys(sample).forEach(field => {
          if (['path', 'name', 'price', 'stock', 'brand', 'model', 'description'].includes(field)) {
            console.log(`      ✅ ${field}: ${sample[field]}`);
          } else {
            console.log(`      ℹ️  ${field}: ${sample[field]}`);
          }
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkImageCollections();
