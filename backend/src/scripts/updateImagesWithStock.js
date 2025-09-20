import connectMongo from '../lib/mongo.js';
import mongoose from 'mongoose';

// Schémas pour les images
const HommeImageSchema = new mongoose.Schema({
  path: { type: String, required: true, index: true, unique: true },
  alt: { type: String, default: '' },
  brand: { type: String, default: '' },
  model: { type: String, default: '' },
  color: { type: String, default: '' },
  category: { type: String, default: 'homme' },
  tags: { type: [String], default: [] },
  source: { type: String, default: 'public/chaussures/homme' },
  active: { type: Boolean, default: true },
  stock: { type: Number, default: 5 },
  price: { type: Number, default: 250000 },
  name: { type: String, default: '' },
  description: { type: String, default: '' }
}, { timestamps: true, collection: "homme_images" });

const EnfantImageSchema = new mongoose.Schema({
  path: { type: String, required: true, index: true, unique: true },
  alt: { type: String, default: '' },
  brand: { type: String, default: '' },
  model: { type: String, default: '' },
  color: { type: String, default: '' },
  category: { type: String, default: 'enfant' },
  tags: { type: [String], default: [] },
  source: { type: String, default: 'public/chaussures/enfant' },
  active: { type: Boolean, default: true },
  stock: { type: Number, default: 5 },
  price: { type: Number, default: 200000 },
  name: { type: String, default: '' },
  description: { type: String, default: '' }
}, { timestamps: true, collection: "enfant_images" });

const HommeImage = mongoose.models.HommeImage || mongoose.model('HommeImage', HommeImageSchema);
const EnfantImage = mongoose.models.EnfantImage || mongoose.model('EnfantImage', EnfantImageSchema);

async function updateImagesWithStock() {
  try {
    await connectMongo();
    console.log('🔗 Connecté à MongoDB');

    // Mettre à jour les images homme
    console.log('\n👨 Mise à jour des images homme...');
    const hommeImages = await HommeImage.find({ stock: { $exists: false } });
    let hommeUpdated = 0;
    
    for (const image of hommeImages) {
      await HommeImage.updateOne(
        { _id: image._id },
        { 
          $set: { 
            stock: 5,
            price: 250000,
            name: `Chaussure Homme ${image.brand || 'Marque'} ${image.model || 'Modèle'}`,
            description: 'Chaussure de qualité pour homme'
          }
        }
      );
      hommeUpdated++;
    }
    console.log(`✅ ${hommeUpdated} images homme mises à jour`);

    // Mettre à jour les images enfant
    console.log('\n👶 Mise à jour des images enfant...');
    const enfantImages = await EnfantImage.find({ stock: { $exists: false } });
    let enfantUpdated = 0;
    
    for (const image of enfantImages) {
      await EnfantImage.updateOne(
        { _id: image._id },
        { 
          $set: { 
            stock: 5,
            price: 200000,
            name: `Chaussure Enfant ${image.brand || 'Marque'} ${image.model || 'Modèle'}`,
            description: 'Chaussure de qualité pour enfant'
          }
        }
      );
      enfantUpdated++;
    }
    console.log(`✅ ${enfantUpdated} images enfant mises à jour`);

    // Vérifier les résultats
    const hommeCount = await HommeImage.countDocuments({ stock: { $exists: true } });
    const enfantCount = await EnfantImage.countDocuments({ stock: { $exists: true } });
    
    console.log(`\n📊 Résultats finaux:`);
    console.log(`   - Images homme avec stock: ${hommeCount}`);
    console.log(`   - Images enfant avec stock: ${enfantCount}`);
    
    console.log('\n✅ Mise à jour terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
updateImagesWithStock();
