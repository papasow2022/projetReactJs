import connectMongo from '../lib/mongo.js';
import CarouselImage from '../models/CarouselImage.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkCarouselImages() {
  try {
    await connectMongo();
    console.log('🔍 Vérification des images dans la collection carousel_dImage...\n');

    // Compter le total d'images
    const totalCount = await CarouselImage.countDocuments();
    const activeCount = await CarouselImage.countDocuments({ active: true });
    
    console.log(`📊 Statistiques:`);
    console.log(`   - Total d'images: ${totalCount}`);
    console.log(`   - Images actives: ${activeCount}`);
    console.log(`   - Images inactives: ${totalCount - activeCount}\n`);

    // Récupérer toutes les images avec leurs détails
    const images = await CarouselImage.find({})
      .sort({ createdAt: -1 })
      .select({ path: 1, alt: 1, tags: 1, active: 1, createdAt: 1 })
      .lean();

    if (images.length === 0) {
      console.log('❌ Aucune image trouvée dans la collection carousel_dImage');
      return;
    }

    console.log('🖼️  Images dans la collection:');
    console.log('=' .repeat(80));
    
    images.forEach((img, index) => {
      const status = img.active ? '✅' : '❌';
      const date = new Date(img.createdAt).toLocaleDateString('fr-FR');
      console.log(`${index + 1}. ${status} ${img.path}`);
      console.log(`   Nom/Alt: "${img.alt}"`);
      console.log(`   Tags: [${img.tags.join(', ')}]`);
      console.log(`   Ajouté le: ${date}`);
      console.log('');
    });

    // Afficher les images actives qui seront affichées dans le carousel
    const activeImages = images.filter(img => img.active);
    console.log('🎠 Images qui s\'affichent dans le carousel:');
    console.log('=' .repeat(50));
    activeImages.slice(0, 10).forEach((img, index) => {
      console.log(`${index + 1}. ${img.path} - "${img.alt}"`);
    });

    if (activeImages.length > 10) {
      console.log(`... et ${activeImages.length - 10} autres images`);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  } finally {
    process.exit(0);
  }
}

checkCarouselImages();
