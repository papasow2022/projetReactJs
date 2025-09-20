const { MongoClient } = require('mongodb');

async function checkGucci() {
  const client = new MongoClient('mongodb://localhost:27017/papasow');
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('papasow');
    
    // Vérifier les produits Gucci
    const gucci = await db.collection('catalogue').find({brand: 'Gucci'}).toArray();
    console.log(`\n🔍 Produits Gucci trouvés: ${gucci.length}`);
    
    if (gucci.length > 0) {
      console.log('\n📋 Liste des produits Gucci:');
      gucci.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Genre: ${product.genre || 'N/A'}`);
        console.log(`   Catégorie: ${product.category || 'N/A'}`);
        console.log(`   Chemin: ${product.path}`);
        console.log('-'.repeat(40));
      });
    } else {
      console.log('❌ Aucun produit Gucci trouvé dans la collection catalogue');
    }
    
    // Vérifier toutes les collections
    const collections = await db.listCollections().toArray();
    console.log('\n📁 Collections disponibles:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion fermée');
  }
}

checkGucci();
