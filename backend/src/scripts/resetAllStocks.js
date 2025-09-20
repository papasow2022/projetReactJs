import mongoose from 'mongoose';
import connectMongo from '../lib/mongo.js';

// Schémas pour les images
const HommeImageSchema = new mongoose.Schema({
  path: { type: String, required: true, index: true, unique: true },
  alt: { type: String, default: '' },
  brand: { type: String, default: '' },
  model: { type: String, default: '' },
  color: { type: String, default: '' },
  category: { type: String, default: 'homme' },
  stock: { type: Number, default: 8 },
  price: { type: Number, default: 250000 },
  name: { type: String, default: '' },
  description: { type: String, default: '' }
});

const FemmeImageSchema = new mongoose.Schema({
  path: { type: String, required: true, index: true, unique: true },
  alt: { type: String, default: '' },
  brand: { type: String, default: '' },
  model: { type: String, default: '' },
  color: { type: String, default: '' },
  category: { type: String, default: 'femme' },
  stock: { type: Number, default: 8 },
  price: { type: Number, default: 250000 },
  name: { type: String, default: '' },
  description: { type: String, default: '' }
});

const EnfantImageSchema = new mongoose.Schema({
  path: { type: String, required: true, index: true, unique: true },
  alt: { type: String, default: '' },
  brand: { type: String, default: '' },
  model: { type: String, default: '' },
  color: { type: String, default: '' },
  category: { type: String, default: 'enfant' },
  stock: { type: Number, default: 8 },
  price: { type: Number, default: 200000 },
  name: { type: String, default: '' },
  description: { type: String, default: '' }
});

async function resetAllStocks() {
  try {
    await connectMongo();
    console.log('🔗 Connexion à MongoDB établie');

    // Modèles
    const HommeImage = mongoose.model('homme_images', HommeImageSchema);
    const FemmeImage = mongoose.model('femme_images', FemmeImageSchema);
    const EnfantImage = mongoose.model('enfant_images', EnfantImageSchema);

    // Remettre tous les stocks à 8
    console.log('🔄 Remise à zéro des stocks...');

    const hommeResult = await HommeImage.updateMany({}, { stock: 8 });
    console.log(`✅ Homme: ${hommeResult.modifiedCount} produits mis à jour`);

    const femmeResult = await FemmeImage.updateMany({}, { stock: 8 });
    console.log(`✅ Femme: ${femmeResult.modifiedCount} produits mis à jour`);

    const enfantResult = await EnfantImage.updateMany({}, { stock: 8 });
    console.log(`✅ Enfant: ${enfantResult.modifiedCount} produits mis à jour`);

    console.log('🎉 Tous les stocks ont été remis à 8 !');
    
    // Vérification
    const hommeCount = await HommeImage.countDocuments({ stock: 8 });
    const femmeCount = await FemmeImage.countDocuments({ stock: 8 });
    const enfantCount = await EnfantImage.countDocuments({ stock: 8 });
    
    console.log(`📊 Vérification:`);
    console.log(`   - Homme avec stock=8: ${hommeCount}`);
    console.log(`   - Femme avec stock=8: ${femmeCount}`);
    console.log(`   - Enfant avec stock=8: ${enfantCount}`);

  } catch (error) {
    console.error('❌ Erreur lors de la remise à zéro des stocks:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnexion de MongoDB');
  }
}

resetAllStocks();
