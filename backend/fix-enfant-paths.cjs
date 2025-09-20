const { MongoClient } = require('mongodb');

async function fixEnfantPaths() {
  const client = new MongoClient('mongodb://localhost:27017/papasow');
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('papasow');
    
    // Récupérer tous les produits enfant
    const enfants = await db.collection('catalogue').find({category: 'enfant'}).toArray();
    
    console.log(`\n🔍 ${enfants.length} produits enfant trouvés:`);
    console.log('='.repeat(80));
    
    let fixedCount = 0;
    
    for (const product of enfants) {
      console.log(`\n📦 ${product.name}`);
      console.log(`   Ancien chemin: ${product.path}`);
      
      // Corriger le chemin
      let newPath = product.path;
      
      // Remplacer /public/ par /chaussures/
      if (newPath.startsWith('/public/')) {
        newPath = newPath.replace('/public/', '/chaussures/');
      }
      
      // S'assurer que le chemin commence par /chaussures/
      if (!newPath.startsWith('/chaussures/')) {
        newPath = '/chaussures' + newPath;
      }
      
      console.log(`   Nouveau chemin: ${newPath}`);
      
      // Mettre à jour dans la base de données
      await db.collection('catalogue').updateOne(
        { _id: product._id },
        { 
          $set: { 
            path: newPath,
            updatedAt: new Date()
          }
        }
      );
      
      console.log(`   ✅ Chemin corrigé`);
      fixedCount++;
    }
    
    console.log('\n📊 Résumé des corrections:');
    console.log(`   ✅ ${fixedCount} chemins corrigés`);
    
    // Vérifier le résultat
    const updatedEnfants = await db.collection('catalogue').find({category: 'enfant'}).limit(5).toArray();
    
    console.log('\n🔍 Vérification post-correction:');
    updatedEnfants.forEach(product => {
      console.log(`   ${product.name}: ${product.path}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion fermée');
  }
}

fixEnfantPaths();
