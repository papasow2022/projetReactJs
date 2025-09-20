const { MongoClient } = require('mongodb');

async function listEnfantImages() {
  const client = new MongoClient('mongodb://localhost:27017/papasow');
  
  try {
    await client.connect();
    const db = client.db('papasow');
    
    const enfants = await db.collection('catalogue').find({
      $or: [
        { category: 'enfant' },           // Ancienne structure
        { genre: 'enfant' }               // Nouvelle structure
      ]
    }).toArray();
    
    console.log(`Images de la catégorie enfant (${enfants.length}):`);
    console.log('='.repeat(60));
    
    enfants.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Chemin: ${product.path}`);
      console.log(`   Marque: ${product.brand}`);
      console.log(`   Prix: ${product.price} GNF`);
      console.log(`   Stock: ${product.stock}`);
      console.log('-'.repeat(40));
    });
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await client.close();
  }
}

listEnfantImages();
