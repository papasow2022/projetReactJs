import mongoose from 'mongoose';
import connectMongo from '../lib/mongo.js';

// Schéma pour les images enfant
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
    active: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "enfant_images" }
);

const EnfantImage = mongoose.models.EnfantImage || mongoose.model('EnfantImage', EnfantImageSchema);

async function countImages() {
  try {
    await connectMongo();
    console.log('Connecté à MongoDB');
    
    const totalCount = await EnfantImage.countDocuments();
    const activeCount = await EnfantImage.countDocuments({ active: true });
    
    console.log(`📊 Total d'images dans la collection enfant_images: ${totalCount}`);
    console.log(`✅ Images actives: ${activeCount}`);
    console.log(`❌ Images inactives: ${totalCount - activeCount}`);
    
    // Afficher quelques exemples
    const samples = await EnfantImage.find({ active: true })
      .limit(5)
      .select({ path: 1, brand: 1, color: 1, model: 1, _id: 0 })
      .lean();
    
    console.log('\n📋 Exemples d\'images:');
    samples.forEach((img, index) => {
      console.log(`${index + 1}. ${img.brand} - ${img.color} - ${img.model}`);
      console.log(`   Chemin: ${img.path}`);
    });
    
    // Compter par marque
    const brandCounts = await EnfantImage.aggregate([
      { $match: { active: true } },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n🏷️  Répartition par marque:');
    brandCounts.forEach(brand => {
      console.log(`   ${brand._id}: ${brand.count} images`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

countImages();