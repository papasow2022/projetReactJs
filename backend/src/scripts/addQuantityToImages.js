import mongoose from 'mongoose';
import connectMongo from '../lib/mongo.js';

// Schémas pour les images
const EnfantImageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true, unique: true },
    alt: { type: String, default: '' },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    color: { type: String, default: '' },
    category: { type: String, default: 'enfant' },
    tags: { type: [String], default: [] },
    source: { type: String, default: 'public/chaussures/enfant' },
    active: { type: Boolean, default: true },
    quantité: { type: Number, default: 5 }
  },
  { timestamps: true, collection: "enfant_images" }
);

const HommeImageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true, unique: true },
    alt: { type: String, default: '' },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    color: { type: String, default: '' },
    category: { type: String, default: 'homme' },
    tags: { type: [String], default: [] },
    source: { type: String, default: 'public/chaussures/homme' },
    active: { type: Boolean, default: true },
    quantité: { type: Number, default: 5 }
  },
  { timestamps: true, collection: "homme_images" }
);

const EnfantImage = mongoose.models.EnfantImage || mongoose.model('EnfantImage', EnfantImageSchema);
const HommeImage = mongoose.models.HommeImage || mongoose.model('HommeImage', HommeImageSchema);

async function addQuantityToImages() {
  try {
    await connectMongo();
    console.log('Connecté à MongoDB');
    
    let totalUpdated = 0;
    
    // Mettre à jour la collection enfant_images
    console.log('\n🏷️  Mise à jour de la collection enfant_images...');
    const enfantResult = await EnfantImage.updateMany(
      { quantité: { $exists: false } },
      { $set: { quantité: 5 } }
    );
    console.log(`✅ ${enfantResult.modifiedCount} images enfant mises à jour`);
    totalUpdated += enfantResult.modifiedCount;
    
    // Mettre à jour la collection homme_images
    console.log('\n🏷️  Mise à jour de la collection homme_images...');
    const hommeResult = await HommeImage.updateMany(
      { quantité: { $exists: false } },
      { $set: { quantité: 5 } }
    );
    console.log(`✅ ${hommeResult.modifiedCount} images homme mises à jour`);
    totalUpdated += hommeResult.modifiedCount;
    
    // Pour femme_images, on va créer une collection similaire
    console.log('\n🏷️  Création/mise à jour de la collection femme_images...');
    
    const FemmeImageSchema = new mongoose.Schema(
      {
        path: { type: String, required: true, index: true, unique: true },
        alt: { type: String, default: '' },
        brand: { type: String, default: '' },
        model: { type: String, default: '' },
        color: { type: String, default: '' },
        category: { type: String, default: 'femme' },
        tags: { type: [String], default: [] },
        source: { type: String, default: 'public/chaussures/femme' },
        active: { type: Boolean, default: true },
        quantité: { type: Number, default: 5 }
      },
      { timestamps: true, collection: "femme_images" }
    );
    
    const FemmeImage = mongoose.models.FemmeImage || mongoose.model('FemmeImage', FemmeImageSchema);
    
    // Créer des entrées pour les images femme existantes
    const femmeImages = [
      '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins.jpeg',
      '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg',
      '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg',
      '/chaussures/femme/Gucci/Designer High Heel Sandals _ Block Heel Sandals   _ GUCCI® International.jpeg',
      '/chaussures/femme/Gucci/Designer High Heel Sandals _ Block Heel Sandals   _ GUCCI® US.jpeg',
      '/chaussures/femme/Gucci/Gucci Leather Sandals - Noir.jpeg',
      '/chaussures/femme/Jonak/Chaussures Femme tendance _ Jonak.jpeg',
      '/chaussures/femme/Mango/Mango Strappy Sandals - Nude.jpeg',
      '/chaussures/femme/Minelli/Minelli Escarpins - Noir.jpeg',
      '/chaussures/femme/PradaBeige/Prada Ankle Strap Platform Sandals - Beige.jpeg',
      '/chaussures/femme/Zaranoire/Zara Classic Heels - Noir.jpeg'
    ];
    
    let femmeUpdated = 0;
    for (const imagePath of femmeImages) {
      const result = await FemmeImage.findOneAndUpdate(
        { path: imagePath },
        { 
          path: imagePath,
          brand: 'Collection Femme',
          model: 'Chaussure Femme',
          color: 'Mixte',
          category: 'femme',
          active: true,
          quantité: 5
        },
        { upsert: true, new: true }
      );
      if (result.isNew) {
        femmeUpdated++;
      }
    }
    console.log(`✅ ${femmeUpdated} images femme créées/mises à jour`);
    totalUpdated += femmeUpdated;
    
    console.log(`\n🎉 Mise à jour terminée!`);
    console.log(`📊 Total d'images mises à jour: ${totalUpdated}`);
    
    // Afficher quelques exemples
    console.log(`\n📋 Exemples avec quantité:`);
    
    const enfantSample = await EnfantImage.findOne({ active: true }).select({ brand: 1, model: 1, quantité: 1, _id: 0 }).lean();
    if (enfantSample) {
      console.log(`Enfant: ${enfantSample.brand} - ${enfantSample.model} (Quantité: ${enfantSample.quantité})`);
    }
    
    const hommeSample = await HommeImage.findOne({ active: true }).select({ brand: 1, model: 1, quantité: 1, _id: 0 }).lean();
    if (hommeSample) {
      console.log(`Homme: ${hommeSample.brand} - ${hommeSample.model} (Quantité: ${hommeSample.quantité})`);
    }
    
    const femmeSample = await FemmeImage.findOne({ active: true }).select({ brand: 1, model: 1, quantité: 1, _id: 0 }).lean();
    if (femmeSample) {
      console.log(`Femme: ${femmeSample.brand} - ${femmeSample.model} (Quantité: ${femmeSample.quantité})`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

addQuantityToImages();