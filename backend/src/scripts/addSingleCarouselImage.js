import connectMongo from '../lib/mongo.js';
import CarouselImage from '../models/CarouselImage.js';
import dotenv from 'dotenv';

dotenv.config();

// Script pour ajouter une seule image au carousel avec son nom
async function addSingleCarouselImage() {
  try {
    await connectMongo();
    
    // Récupérer les arguments de la ligne de commande
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.log('❌ Usage: node addSingleCarouselImage.js <chemin_image> <nom_image> [tags]');
      console.log('📝 Exemple: node addSingleCarouselImage.js "/chaussures/femme/escarpin.jpg" "Escarpins Louboutin Rouge" "femme,escarpins,rouge"');
      process.exit(1);
    }

    const imagePath = args[0];
    const imageName = args[1];
    const tagsString = args[2] || '';
    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];

    console.log('🎠 Ajout d\'une image au carousel...\n');
    console.log(`📁 Chemin: ${imagePath}`);
    console.log(`🏷️  Nom: "${imageName}"`);
    console.log(`🔖 Tags: [${tags.join(', ')}]`);

    const result = await CarouselImage.updateOne(
      { path: imagePath },
      {
        $set: {
          alt: imageName,
          tags: tags,
          source: 'public/chaussures',
          active: true
        }
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log('\n✅ Image ajoutée avec succès !');
    } else if (result.modifiedCount > 0) {
      console.log('\n🔄 Image mise à jour avec succès !');
    } else {
      console.log('\nℹ️  Image déjà présente (aucun changement)');
    }

    // Vérifier le total d'images actives
    const activeCount = await CarouselImage.countDocuments({ active: true });
    console.log(`📊 Total d'images actives dans le carousel: ${activeCount}`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout de l\'image:', error.message);
  } finally {
    process.exit(0);
  }
}

addSingleCarouselImage();
