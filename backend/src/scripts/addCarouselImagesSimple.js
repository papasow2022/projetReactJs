import connectMongo from '../lib/mongo.js';
import CarouselImage from '../models/CarouselImage.js';
import dotenv from 'dotenv';

dotenv.config();

// Script simple pour ajouter des images au carousel
async function addCarouselImagesSimple() {
  try {
    console.log('🎠 Ajout d\'images au carousel...\n');
    
    // Essayer de se connecter à MongoDB
    try {
      await connectMongo();
      console.log('✅ Connexion à MongoDB réussie');
    } catch (error) {
      console.log('❌ Erreur de connexion MongoDB:', error.message);
      console.log('💡 Vérifiez que MongoDB est démarré et que la configuration est correcte');
      return;
    }

    // Images à ajouter avec leurs noms
    const imagesToAdd = [
      {
        path: '/chaussures/femme/chaussure-femme-1.jpeg',
        alt: 'Escarpins Louboutin Rouge Signature',
        tags: ['femme', 'escarpins', 'rouge', 'louboutin'],
        source: 'public/chaussures/femme'
      },
      {
        path: '/chaussures/homme/chaussure-homme-1.jpg',
        alt: 'Chaussures de ville Homme Cuir Noir',
        tags: ['homme', 'ville', 'cuir', 'noir'],
        source: 'public/chaussures/homme'
      },
      {
        path: '/chaussures/enfant/chaussure-enfant-1.jpeg',
        alt: 'Baskets Enfant Colorées Sport',
        tags: ['enfant', 'baskets', 'coloré', 'sport'],
        source: 'public/chaussures/enfant'
      },
      {
        path: '/chaussures/femme/chaussure-femme-2.jpeg',
        alt: 'Bottines Femme Élégantes Marron',
        tags: ['femme', 'bottines', 'élégant', 'marron'],
        source: 'public/chaussures/femme'
      },
      {
        path: '/chaussures/homme/chaussure-homme-2.jpg',
        alt: 'Sneakers Homme Modernes Blanc',
        tags: ['homme', 'sneakers', 'moderne', 'blanc'],
        source: 'public/chaussures/homme'
      }
    ];

    let addedCount = 0;
    let updatedCount = 0;

    console.log('📝 Ajout des images...\n');

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
          console.log(`✅ Ajouté: "${imageData.alt}"`);
          console.log(`   Chemin: ${imageData.path}`);
          addedCount++;
        } else if (result.modifiedCount > 0) {
          console.log(`🔄 Mis à jour: "${imageData.alt}"`);
          console.log(`   Chemin: ${imageData.path}`);
          updatedCount++;
        } else {
          console.log(`ℹ️  Déjà présent: "${imageData.alt}"`);
        }
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  Doublon ignoré: "${imageData.alt}"`);
        } else {
          console.error(`❌ Erreur pour "${imageData.alt}":`, error.message);
        }
      }
    }

    // Vérifier le résultat
    const totalCount = await CarouselImage.countDocuments();
    const activeCount = await CarouselImage.countDocuments({ active: true });

    console.log(`\n📊 Résumé:`);
    console.log(`   - Images ajoutées: ${addedCount}`);
    console.log(`   - Images mises à jour: ${updatedCount}`);
    console.log(`   - Total dans la collection: ${totalCount}`);
    console.log(`   - Images actives: ${activeCount}`);

    // Afficher les images qui seront dans le carousel
    console.log(`\n🎠 Images dans le carousel:`);
    const activeImages = await CarouselImage.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select({ path: 1, alt: 1 })
      .lean();

    activeImages.forEach((img, index) => {
      console.log(`   ${index + 1}. "${img.alt}" (${img.path})`);
    });

    console.log('\n✅ Script terminé avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des images:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

addCarouselImagesSimple();
