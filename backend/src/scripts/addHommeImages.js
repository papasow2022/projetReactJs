import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Schéma pour les images homme
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
    active: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "homme_images" }
);

const HommeImage = mongoose.models.HommeImage || mongoose.model('HommeImage', HommeImageSchema);

async function addHommeImages() {
  try {
    console.log('👨 Ajout d\'images homme...\n');
    
    // Connexion à MongoDB
    const mongoUri = 'mongodb://127.0.0.1:27017/projetReactJsa';
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion MongoDB réussie !');
    
    // Images homme à ajouter
    const hommeImages = [
      {
        path: '/chaussures/homme/chaussure-homme-1.jpg',
        alt: 'Chaussures de ville Homme Cuir Noir',
        brand: 'Classic',
        model: 'Ville',
        color: 'Noir',
        category: 'homme',
        tags: ['homme', 'ville', 'cuir', 'noir', 'élégant'],
        source: 'public/chaussures/homme',
        active: true
      },
      {
        path: '/chaussures/homme/chaussure-homme-2.jpg',
        alt: 'Sneakers Homme Modernes Blanc',
        brand: 'Sport',
        model: 'Sneakers',
        color: 'Blanc',
        category: 'homme',
        tags: ['homme', 'sneakers', 'moderne', 'blanc', 'sport'],
        source: 'public/chaussures/homme',
        active: true
      },
      {
        path: '/chaussures/homme/chaussure-homme-3.jpg',
        alt: 'Baskets Homme Confortables',
        brand: 'Comfort',
        model: 'Baskets',
        color: 'Gris',
        category: 'homme',
        tags: ['homme', 'baskets', 'confort', 'gris', 'casual'],
        source: 'public/chaussures/homme',
        active: true
      },
      {
        path: '/chaussures/homme/chaussure-homme-4.jpg',
        alt: 'Chaussures de sport Homme',
        brand: 'Athletic',
        model: 'Running',
        color: 'Bleu',
        category: 'homme',
        tags: ['homme', 'sport', 'running', 'bleu', 'performance'],
        source: 'public/chaussures/homme',
        active: true
      },
      {
        path: '/chaussures/homme/chaussure-homme-5.jpg',
        alt: 'Bottes Homme Hiver',
        brand: 'Winter',
        model: 'Boots',
        color: 'Marron',
        category: 'homme',
        tags: ['homme', 'bottes', 'hiver', 'marron', 'chaud'],
        source: 'public/chaussures/homme',
        active: true
      }
    ];
    
    let addedCount = 0;
    
    for (const imageData of hommeImages) {
      try {
        await HommeImage.create(imageData);
        console.log(`✅ Ajouté: "${imageData.alt}"`);
        addedCount++;
      } catch (error) {
        if (error.code === 11000) {
          console.log(`ℹ️  Déjà présent: "${imageData.alt}"`);
        } else {
          console.error(`❌ Erreur pour "${imageData.alt}":`, error.message);
        }
      }
    }
    
    // Vérifier le résultat
    const totalCount = await HommeImage.countDocuments();
    const activeCount = await HommeImage.countDocuments({ active: true });
    
    console.log(`\n📊 Résumé:`);
    console.log(`   - Images ajoutées: ${addedCount}`);
    console.log(`   - Total dans la collection: ${totalCount}`);
    console.log(`   - Images actives: ${activeCount}`);
    
    // Test de l'API
    console.log(`\n🧪 Test de l'API /api/homme/random...`);
    const count = await HommeImage.countDocuments({ active: true });
    if (count > 0) {
      const randomIndex = Math.floor(Math.random() * count);
      const randomImage = await HommeImage.findOne({ active: true })
        .skip(randomIndex)
        .select({ path: 1, alt: 1, brand: 1, model: 1, color: 1, _id: 0 })
        .lean();
      
      console.log('📡 Image aléatoire générée:');
      console.log(JSON.stringify(randomImage, null, 2));
    }
    
    console.log('\n✅ Script terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

addHommeImages();
