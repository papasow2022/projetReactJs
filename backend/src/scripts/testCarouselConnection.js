import connectMongo from '../lib/mongo.js';
import CarouselImage from '../models/CarouselImage.js';
import dotenv from 'dotenv';

dotenv.config();

// Script de test pour vérifier la connexion carousel et ajouter des images de test
async function testCarouselConnection() {
  try {
    await connectMongo();
    console.log('🧪 Test de connexion au carousel...\n');

    // 1. Vérifier la connexion à la base de données
    console.log('1️⃣ Test de connexion à MongoDB...');
    const db = connectMongo.connection.db;
    const collections = await db.listCollections({ name: 'carousel_dImage' }).toArray();
    
    if (collections.length > 0) {
      console.log('✅ Collection carousel_dImage trouvée');
    } else {
      console.log('❌ Collection carousel_dImage non trouvée');
      return;
    }

    // 2. Compter les images existantes
    console.log('\n2️⃣ Vérification des images existantes...');
    const totalCount = await CarouselImage.countDocuments();
    const activeCount = await CarouselImage.countDocuments({ active: true });
    console.log(`   - Total: ${totalCount} images`);
    console.log(`   - Actives: ${activeCount} images`);

    // 3. Ajouter des images de test avec des noms spécifiques
    console.log('\n3️⃣ Ajout d\'images de test...');
    
    const testImages = [
      {
        path: '/chaussures/femme/chaussure-femme-1.jpeg',
        alt: 'Escarpins Louboutin Rouge Signature',
        tags: ['femme', 'escarpins', 'rouge', 'louboutin', 'signature'],
        source: 'public/chaussures/femme'
      },
      {
        path: '/chaussures/homme/chaussure-homme-1.jpg',
        alt: 'Chaussures de ville Homme Cuir Noir',
        tags: ['homme', 'ville', 'cuir', 'noir', 'élégant'],
        source: 'public/chaussures/homme'
      },
      {
        path: '/chaussures/enfant/chaussure-enfant-1.jpeg',
        alt: 'Baskets Enfant Colorées Sport',
        tags: ['enfant', 'baskets', 'coloré', 'sport', 'confortable'],
        source: 'public/chaussures/enfant'
      },
      {
        path: '/chaussures/femme/chaussure-femme-2.jpeg',
        alt: 'Bottines Femme Élégantes Marron',
        tags: ['femme', 'bottines', 'élégant', 'marron', 'cuir'],
        source: 'public/chaussures/femme'
      },
      {
        path: '/chaussures/homme/chaussure-homme-2.jpg',
        alt: 'Sneakers Homme Modernes Blanc',
        tags: ['homme', 'sneakers', 'moderne', 'blanc', 'casual'],
        source: 'public/chaussures/homme'
      }
    ];

    let addedCount = 0;
    for (const imageData of testImages) {
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
          console.log(`   ✅ Ajouté: "${imageData.alt}"`);
          addedCount++;
        } else if (result.modifiedCount > 0) {
          console.log(`   🔄 Mis à jour: "${imageData.alt}"`);
        } else {
          console.log(`   ℹ️  Déjà présent: "${imageData.alt}"`);
        }
      } catch (error) {
        console.error(`   ❌ Erreur pour "${imageData.alt}":`, error.message);
      }
    }

    // 4. Vérifier les images qui seront affichées dans le carousel
    console.log('\n4️⃣ Images qui s\'affichent dans le carousel:');
    const activeImages = await CarouselImage.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select({ path: 1, alt: 1, tags: 1 })
      .lean();

    activeImages.forEach((img, index) => {
      console.log(`   ${index + 1}. "${img.alt}" (${img.path})`);
    });

    // 5. Test de l'API
    console.log('\n5️⃣ Test de l\'API carousel...');
    const apiImages = await CarouselImage.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select({ path: 1, alt: 1, tags: 1, _id: 0 })
      .lean();

    console.log(`   📡 API retournera ${apiImages.length} images:`);
    apiImages.forEach((img, index) => {
      console.log(`      ${index + 1}. path: "${img.path}", alt: "${img.alt}"`);
    });

    console.log('\n✅ Test terminé avec succès !');
    console.log(`📊 Résumé: ${addedCount} nouvelles images ajoutées`);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  } finally {
    process.exit(0);
  }
}

testCarouselConnection();
