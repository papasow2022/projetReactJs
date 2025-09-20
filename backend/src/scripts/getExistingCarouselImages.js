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

async function getExistingCarouselImages() {
  try {
    console.log('🔍 Récupération des images existantes de carousel_dImage...\n');
    
    // Connexion à MongoDB
    const mongoUri = 'mongodb://127.0.0.1:27017/projetReactJsa';
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion MongoDB réussie !');
    
    // Récupérer toutes les images de la collection carousel_dImage
    const allImages = await CarouselImage.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`📊 Total d'images trouvées: ${allImages.length}`);
    
    if (allImages.length === 0) {
      console.log('❌ Aucune image trouvée dans la collection carousel_dImage');
      return;
    }
    
    // Afficher toutes les images
    console.log('\n🎠 Images dans la collection carousel_dImage:');
    console.log('=' .repeat(80));
    
    allImages.forEach((img, index) => {
      const date = new Date(img.createdAt).toLocaleString('fr-FR');
      const status = img.active ? '✅' : '❌';
      console.log(`${index + 1}. ${status} "${img.alt}"`);
      console.log(`   Chemin: ${img.path}`);
      console.log(`   Tags: [${img.tags.join(', ')}]`);
      console.log(`   Créé le: ${date}`);
      console.log('');
    });
    
    // Filtrer les images actives
    const activeImages = allImages.filter(img => img.active);
    console.log(`\n🎯 Images actives (${activeImages.length}):`);
    activeImages.forEach((img, index) => {
      console.log(`   ${index + 1}. "${img.alt}" - ${img.path}`);
    });
    
    // Test de l'API
    console.log(`\n🧪 Test de l'API carousel...`);
    const apiResponse = {
      items: activeImages.map(img => ({
        path: img.path,
        alt: img.alt,
        tags: img.tags
      }))
    };
    
    console.log('📡 Réponse API:');
    console.log(JSON.stringify(apiResponse, null, 2));
    
    console.log('\n✅ Récupération terminée !');
    console.log('🎯 Ces images devraient s\'afficher dans le carousel.');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

getExistingCarouselImages();

