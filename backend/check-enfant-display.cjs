const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function checkEnfantDisplay() {
  const client = new MongoClient('mongodb://localhost:27017/papasow');
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('papasow');
    
    // Récupérer tous les produits enfant
    const enfants = await db.collection('catalogue').find({category: 'enfant'}).toArray();
    
    console.log(`\n🔍 ${enfants.length} produits enfant trouvés:`);
    console.log('='.repeat(80));
    
    let displayable = 0;
    let notDisplayable = 0;
    let errors = [];
    
    for (const product of enfants) {
      console.log(`\n📦 ${product.name}`);
      console.log(`   Chemin: ${product.path}`);
      console.log(`   Stock: ${product.stock || 0}`);
      console.log(`   Actif: ${product.active !== false ? 'Oui' : 'Non'}`);
      
      // Vérifier si l'image existe
      const fullPath = path.join(process.cwd(), 'public', product.path);
      const exists = fs.existsSync(fullPath);
      
      if (exists) {
        console.log(`   ✅ Image trouvée`);
        displayable++;
      } else {
        console.log(`   ❌ Image manquante`);
        notDisplayable++;
        errors.push({
          name: product.name,
          path: product.path,
          fullPath: fullPath
        });
      }
    }
    
    console.log('\n📊 Résumé:');
    console.log(`   ✅ Images affichables: ${displayable}`);
    console.log(`   ❌ Images manquantes: ${notDisplayable}`);
    console.log(`   📈 Taux d'affichage: ${((displayable / enfants.length) * 100).toFixed(1)}%`);
    
    if (errors.length > 0) {
      console.log('\n🚨 Images manquantes:');
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.name}`);
        console.log(`      Chemin: ${error.path}`);
        console.log(`      Fichier: ${error.fullPath}`);
      });
    }
    
    // Vérifier la structure des dossiers
    console.log('\n📁 Structure des dossiers:');
    const publicDir = path.join(process.cwd(), 'public');
    const chaussuresDir = path.join(publicDir, 'chaussures');
    const enfantDir = path.join(chaussuresDir, 'enfant');
    
    console.log(`   Public: ${fs.existsSync(publicDir) ? '✅' : '❌'}`);
    console.log(`   Chaussures: ${fs.existsSync(chaussuresDir) ? '✅' : '❌'}`);
    console.log(`   Enfant: ${fs.existsSync(enfantDir) ? '✅' : '❌'}`);
    
    if (fs.existsSync(enfantDir)) {
      const files = fs.readdirSync(enfantDir);
      console.log(`   Fichiers dans enfant/: ${files.length}`);
      files.slice(0, 5).forEach(file => console.log(`      - ${file}`));
      if (files.length > 5) console.log(`      ... et ${files.length - 5} autres`);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion fermée');
  }
}

checkEnfantDisplay();
