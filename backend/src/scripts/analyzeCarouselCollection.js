import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Schéma pour les images carousel
const CarouselImageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true, unique: true },
    alt: { type: String, default: '' },
    tags: { type: [String], default: [] },
    source: { type: String, default: 'public/chaussures' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "carousel_dImage" }
);

const CarouselImage = mongoose.models.CarouselImage || mongoose.model('CarouselImage', CarouselImageSchema);

async function analyzeCarouselCollection() {
  try {
    console.log('🔍 ANALYSE COMPLÈTE DE LA COLLECTION carousel_dImage...\n');
    
    // Connexion à MongoDB
    const mongoUri = 'mongodb://127.0.0.1:27017/projetReactJsa';
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion MongoDB réussie !');
    
    // 1. Compter le total d'images
    const totalCount = await CarouselImage.countDocuments();
    const activeCount = await CarouselImage.countDocuments({ active: true });
    const inactiveCount = await CarouselImage.countDocuments({ active: false });
    
    console.log('📊 STATISTIQUES DE LA COLLECTION:');
    console.log('=' .repeat(50));
    console.log(`   - Total d'images: ${totalCount}`);
    console.log(`   - Images actives: ${activeCount}`);
    console.log(`   - Images inactives: ${inactiveCount}`);
    
    // 2. Récupérer toutes les images avec détails
    const allImages = await CarouselImage.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('\n🎠 DÉTAIL DE TOUTES LES IMAGES:');
    console.log('=' .repeat(80));
    
    allImages.forEach((img, index) => {
      const date = new Date(img.createdAt).toLocaleString('fr-FR');
      const status = img.active ? '✅ ACTIVE' : '❌ INACTIVE';
      console.log(`\n${index + 1}. ${status}`);
      console.log(`   📝 Nom: "${img.alt}"`);
      console.log(`   📁 Chemin: ${img.path}`);
      console.log(`   🏷️  Tags: [${img.tags.join(', ')}]`);
      console.log(`   📅 Créé le: ${date}`);
      console.log(`   🆔 ID: ${img._id}`);
    });
    
    // 3. Images actives uniquement
    const activeImages = allImages.filter(img => img.active);
    console.log(`\n🎯 IMAGES ACTIVES (${activeImages.length}):`);
    console.log('=' .repeat(50));
    
    activeImages.forEach((img, index) => {
      console.log(`${index + 1}. "${img.alt}"`);
      console.log(`   Chemin: ${img.path}`);
    });
    
    // 4. Test de l'API carousel
    console.log(`\n🧪 TEST DE L'API CAROUSEL:`);
    console.log('=' .repeat(50));
    
    const apiResponse = {
      items: activeImages.map(img => ({
        path: img.path,
        alt: img.alt,
        tags: img.tags
      }))
    };
    
    console.log('📡 Réponse API (format JSON):');
    console.log(JSON.stringify(apiResponse, null, 2));
    
    // 5. Vérification des chemins d'images
    console.log(`\n🔍 VÉRIFICATION DES CHEMINS D'IMAGES:`);
    console.log('=' .repeat(50));
    
    const pathAnalysis = {};
    activeImages.forEach(img => {
      const category = img.path.split('/')[2]; // homme, femme, enfant
      if (!pathAnalysis[category]) {
        pathAnalysis[category] = [];
      }
      pathAnalysis[category].push({
        name: img.alt,
        path: img.path
      });
    });
    
    Object.keys(pathAnalysis).forEach(category => {
      console.log(`\n📂 ${category.toUpperCase()} (${pathAnalysis[category].length} images):`);
      pathAnalysis[category].forEach(img => {
        console.log(`   - "${img.name}"`);
        console.log(`     ${img.path}`);
      });
    });
    
    console.log('\n✅ ANALYSE TERMINÉE !');
    console.log('🎯 Cette collection contient les images qui devraient s\'afficher dans le carousel.');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

analyzeCarouselCollection();

