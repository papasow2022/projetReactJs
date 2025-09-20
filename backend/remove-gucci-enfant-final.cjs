const { MongoClient } = require('mongodb');

async function removeGucciEnfantFinal() {
  const client = new MongoClient('mongodb://localhost:27017/papasow');
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('papasow');
    
    // Récupérer tous les produits Gucci enfant avant suppression
    const gucciEnfants = await db.collection('catalogue').find({
      $and: [
        { brand: 'Gucci' },
        { $or: [
          { category: 'enfant' },
          { genre: 'enfant' }
        ]}
      ]
    }).toArray();
    
    console.log(`\n🔍 ${gucciEnfants.length} produits Gucci enfant trouvés:`);
    console.log('='.repeat(80));
    
    // Afficher les produits qui vont être supprimés
    gucciEnfants.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Marque: ${product.brand}`);
      console.log(`   Genre: ${product.genre || 'N/A'}`);
      console.log(`   Catégorie: ${product.category || 'N/A'}`);
      console.log(`   Chemin: ${product.path}`);
      console.log(`   Prix: ${product.price} GNF`);
      console.log(`   Stock: ${product.stock}`);
      console.log('-'.repeat(40));
    });
    
    // Supprimer tous les produits Gucci enfant
    const result = await db.collection('catalogue').deleteMany({
      $and: [
        { brand: 'Gucci' },
        { $or: [
          { category: 'enfant' },
          { genre: 'enfant' }
        ]}
      ]
    });
    
    console.log(`\n🗑️ Suppression effectuée:`);
    console.log(`   ✅ ${result.deletedCount} produits Gucci enfant supprimés`);
    
    // Vérifier le résultat
    const remainingEnfants = await db.collection('catalogue').find({
      $or: [
        { category: 'enfant' },
        { genre: 'enfant' }
      ]
    }).countDocuments();
    
    const remainingGucci = await db.collection('catalogue').find({
      brand: 'Gucci'
    }).countDocuments();
    
    console.log(`\n📊 Vérification post-suppression:`);
    console.log(`   Enfant restants: ${remainingEnfants}`);
    console.log(`   Gucci restants: ${remainingGucci}`);
    
    // Afficher quelques produits enfant restants
    const sampleEnfants = await db.collection('catalogue').find({
      $or: [
        { category: 'enfant' },
        { genre: 'enfant' }
      ]
    }).limit(5).toArray();
    
    console.log(`\n🔍 Exemples de produits enfant restants:`);
    sampleEnfants.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} (${product.brand})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion fermée');
  }
}

removeGucciEnfantFinal();
