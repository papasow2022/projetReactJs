const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function fixGucciImages() {
  const client = new MongoClient('mongodb://localhost:27017/papasow');
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('papasow');
    
    // Récupérer tous les produits Gucci
    const gucciProducts = await db.collection('catalogue').find({
      brand: { $regex: /gucci/i }
    }).toArray();
    
    console.log(`\n🔍 ${gucciProducts.length} produits Gucci trouvés:`);
    console.log('='.repeat(80));
    
    let fixedCount = 0;
    let errors = [];
    
    for (const product of gucciProducts) {
      console.log(`\n📦 Traitement: ${product.name}`);
      console.log(`   Ancien chemin: ${product.path}`);
      
      // Nettoyer le chemin
      const cleanPath = cleanImagePath(product.path);
      console.log(`   Nouveau chemin: ${cleanPath}`);
      
      // Vérifier si le fichier existe
      const fullPath = path.join(process.cwd(), 'public', cleanPath);
      const exists = fs.existsSync(fullPath);
      
      if (exists) {
        // Mettre à jour dans la base de données
        await db.collection('catalogue').updateOne(
          { _id: product._id },
          { 
            $set: { 
              path: cleanPath,
              updatedAt: new Date()
            }
          }
        );
        
        console.log(`   ✅ Chemin corrigé et fichier trouvé`);
        fixedCount++;
      } else {
        // Chercher des alternatives
        const alternativePath = findAlternativePath(cleanPath);
        if (alternativePath) {
          await db.collection('catalogue').updateOne(
            { _id: product._id },
            { 
              $set: { 
                path: alternativePath,
                updatedAt: new Date()
              }
            }
          );
          console.log(`   🔄 Chemin alternatif trouvé: ${alternativePath}`);
          fixedCount++;
        } else {
          console.log(`   ❌ Aucune image trouvée pour ce produit`);
          errors.push({
            name: product.name,
            originalPath: product.path,
            cleanedPath: cleanPath
          });
        }
      }
    }
    
    console.log('\n📊 Résumé des corrections:');
    console.log(`   ✅ ${fixedCount} produits corrigés`);
    console.log(`   ❌ ${errors.length} produits avec erreurs`);
    
    if (errors.length > 0) {
      console.log('\n🚨 Produits avec erreurs:');
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.name}`);
        console.log(`      Ancien: ${error.originalPath}`);
        console.log(`      Nettoyé: ${error.cleanedPath}`);
      });
    }
    
    // Vérifier le résultat
    const updatedGucci = await db.collection('catalogue').find({
      brand: { $regex: /gucci/i }
    }).toArray();
    
    console.log('\n🔍 Vérification post-correction:');
    updatedGucci.forEach(product => {
      console.log(`   ${product.name}: ${product.path}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion fermée');
  }
}

// Fonction pour nettoyer les chemins d'images
function cleanImagePath(originalPath) {
  if (!originalPath) return null;
  
  let cleaned = originalPath
    // Supprimer les espaces multiples
    .replace(/\s+/g, '-')
    // Supprimer les caractères spéciaux
    .replace(/[^a-zA-Z0-9\-_./]/g, '')
    // Remplacer les espaces par des tirets
    .replace(/\s/g, '-')
    // Supprimer les tirets multiples
    .replace(/-+/g, '-')
    // Supprimer les tirets en début/fin
    .replace(/^-+|-+$/g, '');
  
  // S'assurer que le chemin commence par /
  if (!cleaned.startsWith('/')) {
    cleaned = '/' + cleaned;
  }
  
  // S'assurer que le chemin se termine par .jpg ou .jpeg
  if (!cleaned.match(/\.(jpg|jpeg|png|webp)$/i)) {
    cleaned += '.jpg';
  }
  
  return cleaned;
}

// Fonction pour trouver des chemins alternatifs
function findAlternativePath(cleanedPath) {
  const baseDir = path.join(process.cwd(), 'public');
  const possiblePaths = [
    cleanedPath,
    cleanedPath.replace('.jpg', '.jpeg'),
    cleanedPath.replace('.jpeg', '.jpg'),
    cleanedPath.replace('.jpg', '.png'),
    cleanedPath.replace('.png', '.jpg')
  ];
  
  for (const testPath of possiblePaths) {
    const fullPath = path.join(baseDir, testPath);
    if (fs.existsSync(fullPath)) {
      return testPath;
    }
  }
  
  return null;
}

fixGucciImages();
