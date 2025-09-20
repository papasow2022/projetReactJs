import mongoose from 'mongoose';

async function testConnection() {
  try {
    console.log('🔌 Test de connexion MongoDB...');
    
    const mongoUri = 'mongodb://127.0.0.1:27017/projetReactJsa';
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion MongoDB réussie !');
    
    // Test de la collection carousel_dImage
    const db = mongoose.connection.db;
    const collections = await db.listCollections({ name: 'carousel_dImage' }).toArray();
    
    if (collections.length > 0) {
      console.log('✅ Collection carousel_dImage trouvée');
      
      const count = await db.collection('carousel_dImage').countDocuments();
      console.log(`📊 Nombre d'images: ${count}`);
      
      // Récupérer quelques images
      const images = await db.collection('carousel_dImage')
        .find({ active: true })
        .limit(3)
        .toArray();
      
      console.log('🎠 Exemples d\'images:');
      images.forEach((img, index) => {
        console.log(`   ${index + 1}. "${img.alt}" (${img.path})`);
      });
      
    } else {
      console.log('❌ Collection carousel_dImage non trouvée');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testConnection();
