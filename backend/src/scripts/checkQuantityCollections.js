import mongoose from 'mongoose';
import connectMongo from '../lib/mongo.js';

async function checkCollections() {
  try {
    await connectMongo();
    console.log('🔗 Connecté à MongoDB');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\n📊 COLLECTIONS AVEC CHAMPS DE QUANTITÉ/STOCK :\n');
    
    for (const collection of collections) {
      const collName = collection.name;
      console.log(`📁 Collection: ${collName}`);
      
      try {
        const sample = await db.collection(collName).findOne({});
        if (sample) {
          const fields = Object.keys(sample);
          const quantityFields = fields.filter(field => 
            field.toLowerCase().includes('quantity') || 
            field.toLowerCase().includes('qty') || 
            field.toLowerCase().includes('stock') ||
            (typeof sample[field] === 'object' && sample[field] && 
             (sample[field].quantity || sample[field].qty || sample[field].stock))
          );
          
          if (quantityFields.length > 0) {
            console.log(`   ✅ Champs de quantité/stock: ${quantityFields.join(', ')}`);
            quantityFields.forEach(field => {
              if (typeof sample[field] === 'object' && sample[field]) {
                const subFields = Object.keys(sample[field]).filter(subField => 
                  subField.toLowerCase().includes('quantity') || 
                  subField.toLowerCase().includes('qty') || 
                  subField.toLowerCase().includes('stock')
                );
                if (subFields.length > 0) {
                  console.log(`      └─ ${field}: {${subFields.join(', ')}}`);
                }
              }
            });
          } else {
            console.log('   ❌ Aucun champ de quantité/stock');
          }
        } else {
          console.log('   ⚠️  Collection vide');
        }
      } catch (err) {
        console.log(`   ❌ Erreur: ${err.message}`);
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkCollections();
