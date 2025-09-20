import mongoose from 'mongoose';
import connectMongo from '../lib/mongo.js';

// Schéma pour les images femme
const FemmeImageSchema = new mongoose.Schema({
  path: { type: String, required: true, index: true, unique: true },
  alt: { type: String, default: '' },
  brand: { type: String, default: '' },
  model: { type: String, default: '' },
  color: { type: String, default: '' },
  category: { type: String, default: 'femme' },
  tags: { type: [String], default: [] },
  source: { type: String, default: 'public/chaussures/femme' },
  active: { type: Boolean, default: true },
  stock: { type: Number, default: 5 },
  price: { type: Number, default: 300000 },
  name: { type: String, default: '' },
  description: { type: String, default: '' }
}, { timestamps: true, collection: "femme_images" });

const FemmeImage = mongoose.models.FemmeImage || mongoose.model('FemmeImage', FemmeImageSchema);

async function updateFemmeImagesWithStock() {
  try {
    await connectMongo();
    console.log('🔗 Connecté à MongoDB');

    // Mettre à jour les images femme
    console.log('\n👩 Mise à jour des images femme...');
    const femmeImages = await FemmeImage.find({ stock: { $exists: false } });
    let femmeUpdated = 0;
    
    for (const image of femmeImages) {
      await FemmeImage.updateOne(
        { _id: image._id },
        { 
          $set: { 
            stock: 5,
            price: 300000,
            name: `Chaussure Femme ${image.brand || 'Marque'} ${image.model || 'Modèle'}`,
            description: 'Chaussure de qualité pour femme',
            alt: image.alt || image.filename || 'Chaussure Femme',
            model: image.model || 'Modèle',
            color: image.color || 'Mixte',
            category: 'femme',
            tags: [],
            source: 'public/chaussures/femme',
            active: true
          }
        }
      );
      femmeUpdated++;
    }
    console.log(`✅ ${femmeUpdated} images femme mises à jour`);

    // Vérifier les résultats
    const femmeCount = await FemmeImage.countDocuments({ stock: { $exists: true } });
    
    console.log(`\n📊 Résultats finaux:`);
    console.log(`   - Images femme avec stock: ${femmeCount}`);
    
    console.log('\n✅ Mise à jour terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
updateFemmeImagesWithStock();
