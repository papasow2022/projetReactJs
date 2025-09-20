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

async function analyzeCorrectDatabase() {
  try {
    console.log('🔍 ANALYSE DE LA BONNE BASE DE DONNÉES (papasow)...\n');
    
    // Connexion à la bonne base de données selon le .env
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow';
    console.log(`🔌 Connexion à: ${mongoUri}`);
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion MongoDB réussie !');
    
    // 1. Lister toutes les collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\n📚 COLLECTIONS DISPONIBLES:');
    console.log('=' .repeat(50));
    collections.forEach((col, index) => {
      console.log(`${index + 1}. ${col.name}`);
    });
    
    // 2. Chercher la collection carousel_dImage
    const carouselCollection = collections.find(col => col.name === 'carousel_dImage');
    
    if (!carouselCollection) {
      console.log('\n❌ Collection carousel_dImage NON TROUVÉE dans la base papasow');
      console.log('🔍 Recherche de collections similaires...');
      
      const similarCollections = collections.filter(col => 
        col.name.toLowerCase().includes('carousel') || 
        col.name.toLowerCase().includes('image')
      );
      
      if (similarCollections.length > 0) {
        console.log('\n📋 Collections similaires trouvées:');
        similarCollections.forEach(col => {
          console.log(`   - ${col.name}`);
        });
      }
      
      return;
    }
    
    console.log('\n✅ Collection carousel_dImage TROUVÉE !');
    
    // 3. Compter les documents
    const totalCount = await CarouselImage.countDocuments();
    const activeCount = await CarouselImage.countDocuments({ active: true });
    const inactiveCount = await CarouselImage.countDocuments({ active: false });
    
    console.log('\n📊 STATISTIQUES DE LA COLLECTION carousel_dImage:');
    console.log('=' .repeat(60));
    console.log(`   - Total d'images: ${totalCount}`);
    console.log(`   - Images actives: ${activeCount}`);
    console.log(`   - Images inactives: ${inactiveCount}`);
    
    if (totalCount === 0) {
      console.log('\n❌ Aucune image trouvée dans carousel_dImage');
      return;
    }
    
    // 4. Récupérer toutes les images
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
    
    // 5. Images actives uniquement
    const activeImages = allImages.filter(img => img.active);
    console.log(`\n🎯 IMAGES ACTIVES (${activeImages.length}):`);
    console.log('=' .repeat(50));
    
    activeImages.forEach((img, index) => {
      console.log(`${index + 1}. "${img.alt}"`);
      console.log(`   Chemin: ${img.path}`);
    });
    
    // 6. Test de l'API carousel
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
    
    console.log('\n✅ ANALYSE TERMINÉE !');
    console.log('🎯 Cette collection contient les images qui devraient s\'afficher dans le carousel.');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

analyzeCorrectDatabase();
