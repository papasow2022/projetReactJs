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

async function connectAndAddImages() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    
    // Connexion à MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/projetReactJsa';
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion MongoDB réussie !');
    
    // Vérifier les images existantes
    console.log('\n📊 Vérification des images existantes...');
    const existingCount = await CarouselImage.countDocuments();
    const activeCount = await CarouselImage.countDocuments({ active: true });
    
    console.log(`   - Total d'images: ${existingCount}`);
    console.log(`   - Images actives: ${activeCount}`);
    
    // Si pas d'images, en ajouter
    if (activeCount === 0) {
      console.log('\n📝 Aucune image active trouvée. Ajout d\'images de test...');
      
      const testImages = [
        {
          path: '/chaussures/femme/chaussure-femme-1.jpeg',
          alt: 'Escarpins Louboutin Rouge Signature',
          tags: ['femme', 'escarpins', 'rouge', 'louboutin'],
          source: 'public/chaussures/femme',
          active: true
        },
        {
          path: '/chaussures/homme/chaussure-homme-1.jpg',
          alt: 'Chaussures de ville Homme Cuir Noir',
          tags: ['homme', 'ville', 'cuir', 'noir'],
          source: 'public/chaussures/homme',
          active: true
        },
        {
          path: '/chaussures/enfant/chaussure-enfant-1.jpeg',
          alt: 'Baskets Enfant Colorées Sport',
          tags: ['enfant', 'baskets', 'coloré', 'sport'],
          source: 'public/chaussures/enfant',
          active: true
        },
        {
          path: '/chaussures/femme/chaussure-femme-2.jpeg',
          alt: 'Bottines Femme Élégantes Marron',
          tags: ['femme', 'bottines', 'élégant', 'marron'],
          source: 'public/chaussures/femme',
          active: true
        },
        {
          path: '/chaussures/homme/chaussure-homme-2.jpg',
          alt: 'Sneakers Homme Modernes Blanc',
          tags: ['homme', 'sneakers', 'moderne', 'blanc'],
          source: 'public/chaussures/homme',
          active: true
        }
      ];
      
      for (const imageData of testImages) {
        try {
          await CarouselImage.create(imageData);
          console.log(`✅ Ajouté: "${imageData.alt}"`);
        } catch (error) {
          if (error.code === 11000) {
            console.log(`ℹ️  Déjà présent: "${imageData.alt}"`);
          } else {
            console.error(`❌ Erreur pour "${imageData.alt}":`, error.message);
          }
        }
      }
    }
    
    // Afficher les images qui seront dans le carousel
    console.log('\n🎠 Images dans le carousel:');
    const carouselImages = await CarouselImage.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select({ path: 1, alt: 1, tags: 1 })
      .lean();
    
    carouselImages.forEach((img, index) => {
      console.log(`   ${index + 1}. "${img.alt}"`);
      console.log(`      Chemin: ${img.path}`);
      console.log(`      Tags: [${img.tags.join(', ')}]`);
    });
    
    // Test de l'API
    console.log('\n🧪 Test de l\'API carousel...');
    const apiResponse = {
      items: carouselImages.map(img => ({
        path: img.path,
        alt: img.alt,
        tags: img.tags
      }))
    };
    
    console.log('📡 Réponse API simulée:');
    console.log(JSON.stringify(apiResponse, null, 2));
    
    console.log('\n✅ Configuration terminée !');
    console.log('🎯 Le carousel devrait maintenant afficher ces images avec leurs noms.');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('💡 Vérifiez que MongoDB est démarré sur le port 27017');
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

connectAndAddImages();
