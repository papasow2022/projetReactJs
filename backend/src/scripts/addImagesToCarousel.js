import connectMongo from '../lib/mongo.js';
import CarouselImage from '../models/CarouselImage.js';
import dotenv from 'dotenv';

dotenv.config();

// Script pour ajouter des images spécifiques au carousel avec leurs noms
async function addImagesToCarousel() {
  try {
    await connectMongo();
    console.log('🎠 Ajout d\'images au carousel...\n');

    // Liste des images à ajouter avec leurs noms
    const imagesToAdd = [
      {
        path: '/chaussures/femme/chaussure-femme-1.jpeg',
        alt: 'Escarpins Louboutin Rouge',
        tags: ['femme', 'escarpins', 'rouge', 'louboutin'],
        source: 'public/chaussures/femme'
      },
      {
        path: '/chaussures/homme/chaussure-homme-1.jpg',
        alt: 'Chaussures de ville Homme',
        tags: ['homme', 'ville', 'cuir', 'noir'],
        source: 'public/chaussures/homme'
      },
      {
        path: '/chaussures/enfant/chaussure-enfant-1.jpeg',
        alt: 'Baskets Enfant Colorées',
        tags: ['enfant', 'baskets', 'coloré', 'sport'],
        source: 'public/chaussures/enfant'
      },
      {
        path: '/chaussures/femme/chaussure-femme-2.jpeg',
        alt: 'Bottines Femme Élégantes',
        tags: ['femme', 'bottines', 'élégant', 'marron'],
        source: 'public/chaussures/femme'
      },
      {
        path: '/chaussures/homme/chaussure-homme-2.jpg',
        alt: 'Sneakers Homme Modernes',
        tags: ['homme', 'sneakers', 'moderne', 'blanc'],
        source: 'public/chaussures/homme'
      }
    ];

    let addedCount = 0;
    let updatedCount = 0;

    for (const imageData of imagesToAdd) {
      try {
        const result = await CarouselImage.updateOne(
          { path: imageData.path },
          {
            $set: {
              alt: imageData.alt,
              tags: imageData.tags,
              source: imageData.source,
              active: true
            }
          },
          { upsert: true }
        );

        if (result.upsertedCount > 0) {
          console.log(`✅ Ajouté: ${imageData.path} - "${imageData.alt}"`);
          addedCount++;
        } else if (result.modifiedCount > 0) {
          console.log(`🔄 Mis à jour: ${imageData.path} - "${imageData.alt}"`);
          updatedCount++;
        } else {
          console.log(`ℹ️  Déjà présent: ${imageData.path} - "${imageData.alt}"`);
        }
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  Doublon ignoré: ${imageData.path}`);
        } else {
          console.error(`❌ Erreur pour ${imageData.path}:`, error.message);
        }
      }
    }

    console.log(`\n📊 Résumé:`);
    console.log(`   - Images ajoutées: ${addedCount}`);
    console.log(`   - Images mises à jour: ${updatedCount}`);
    console.log(`   - Total traité: ${imagesToAdd.length}`);

    // Vérifier le total d'images actives
    const activeCount = await CarouselImage.countDocuments({ active: true });
    console.log(`   - Images actives dans le carousel: ${activeCount}`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des images:', error.message);
  } finally {
    process.exit(0);
  }
}

// Fonction pour ajouter une image spécifique
async function addSingleImage(path, alt, tags = [], source = 'public/chaussures') {
  try {
    await connectMongo();
    
    const result = await CarouselImage.updateOne(
      { path: path },
      {
        $set: {
          alt: alt,
          tags: tags,
          source: source,
          active: true
        }
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log(`✅ Image ajoutée: ${path} - "${alt}"`);
    } else if (result.modifiedCount > 0) {
      console.log(`🔄 Image mise à jour: ${path} - "${alt}"`);
    } else {
      console.log(`ℹ️  Image déjà présente: ${path} - "${alt}"`);
    }

    return result;
  } catch (error) {
    console.error(`❌ Erreur pour ${path}:`, error.message);
    throw error;
  }
}

// Exécuter le script si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  addImagesToCarousel();
}

export { addImagesToCarousel, addSingleImage };
