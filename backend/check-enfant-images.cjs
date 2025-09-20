const { MongoClient } = require('mongodb');

async function checkEnfantImages() {
  const client = new MongoClient('mongodb://localhost:27017/papasow');
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('papasow');
    
    // Récupérer tous les produits enfants
    const enfants = await db.collection('catalogue').find({category: 'enfant'}).toArray();
    
    console.log(`\n🔍 ${enfants.length} produits enfants trouvés:`);
    console.log('='.repeat(80));
    
    enfants.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name || 'Sans nom'}`);
      console.log(`   Chemin: ${product.path}`);
      console.log(`   Stock: ${product.stock || 0}`);
      console.log(`   Actif: ${product.active !== false ? 'Oui' : 'Non'}`);
      console.log(`   Alt: ${product.alt || 'N/A'}`);
      console.log('-'.repeat(40));
    });
    
    // Vérifier les chemins problématiques
    console.log('\n🚨 Analyse des chemins:');
    const problemPaths = enfants.filter(p => 
      !p.path || 
      p.path.includes(' ') || 
      p.path.length < 10 ||
      !p.path.startsWith('/')
    );
    
    if (problemPaths.length > 0) {
      console.log(`❌ ${problemPaths.length} chemins problématiques:`);
      problemPaths.forEach(p => {
        console.log(`   - ${p.name}: "${p.path}"`);
      });
    } else {
      console.log('✅ Tous les chemins semblent corrects');
    }
    
    // Comparer avec les autres catégories
    const homme = await db.collection('catalogue').find({category: 'homme'}).count();
    const femme = await db.collection('catalogue').find({category: 'femme'}).count();
    
    console.log('\n📊 Comparaison des catégories:');
    console.log(`   Homme: ${homme} produits`);
    console.log(`   Femme: ${femme} produits`);
    console.log(`   Enfant: ${enfants.length} produits`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion fermée');
  }
}

checkEnfantImages();
