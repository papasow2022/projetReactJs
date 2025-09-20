import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

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

async function addEnfantImages() {
  try {
    console.log('👶 Ajout d\'images enfant...\n');
    
    // Connexion à MongoDB
    const mongoUri = 'mongodb://127.0.0.1:27017/projetReactJsa';
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion MongoDB réussie !');
    
    // Images enfant à ajouter
    const enfantImages = [
      {
        path: '/chaussures/enfant/chaussure-enfant-1.jpeg',
        alt: 'Baskets Enfant Colorées Sport',
        brand: 'Kids Sport',
        model: 'Baskets',
        color: 'Multicolore',
        category: 'enfant',
        tags: ['enfant', 'baskets', 'coloré', 'sport', 'confortable'],
        source: 'public/chaussures/enfant',
        active: true
      },
      {
        path: '/chaussures/enfant/chaussure-enfant-2.jpeg',
        alt: 'Chaussures Enfant École',
        brand: 'School',
        model: 'École',
        color: 'Noir',
        category: 'enfant',
        tags: ['enfant', 'école', 'noir', 'pratique', 'durable'],
        source: 'public/chaussures/enfant',
        active: true
      },
      {
        path: '/chaussures/enfant/chaussure-enfant-3.jpeg',
        alt: 'Sandales Enfant Été',
        brand: 'Summer',
        model: 'Sandales',
        color: 'Bleu',
        category: 'enfant',
        tags: ['enfant', 'sandales', 'été', 'bleu', 'léger'],
        source: 'public/chaussures/enfant',
        active: true
      },
      {
        path: '/chaussures/enfant/chaussure-enfant-4.jpeg',
        alt: 'Bottes Enfant Hiver',
        brand: 'Winter Kids',
        model: 'Bottes',
        color: 'Rouge',
        category: 'enfant',
        tags: ['enfant', 'bottes', 'hiver', 'rouge', 'chaud'],
        source: 'public/chaussures/enfant',
        active: true
      },
      {
        path: '/chaussures/enfant/chaussure-enfant-5.jpeg',
        alt: 'Chaussures Enfant Fille',
        brand: 'Girls',
        model: 'Fille',
        color: 'Rose',
        category: 'enfant',
        tags: ['enfant', 'fille', 'rose', 'mignon', 'élégant'],
        source: 'public/chaussures/enfant',
        active: true
      }
    ];
    
    let addedCount = 0;
    
    for (const imageData of enfantImages) {
      try {
        await EnfantImage.create(imageData);
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
    const totalCount = await EnfantImage.countDocuments();
    const activeCount = await EnfantImage.countDocuments({ active: true });
    
    console.log(`\n📊 Résumé:`);
    console.log(`   - Images ajoutées: ${addedCount}`);
    console.log(`   - Total dans la collection: ${totalCount}`);
    console.log(`   - Images actives: ${activeCount}`);
    
    // Test de l'API
    console.log(`\n🧪 Test de l'API /api/enfant/random...`);
    const count = await EnfantImage.countDocuments({ active: true });
    if (count > 0) {
      const randomIndex = Math.floor(Math.random() * count);
      const randomImage = await EnfantImage.findOne({ active: true })
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

addEnfantImages();
