const { MongoClient } = require('mongodb');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow';
const DB_NAME = 'papasow';
const SOURCE_COLLECTION = 'catalogue';
const TARGET_COLLECTION = 'catalogue_v2';

// Mapping des catégories existantes vers le nouveau format
const categoryMapping = {
  'homme': { genre: 'homme', category: 'chaussure' },
  'femme': { genre: 'femme', category: 'chaussure' },
  'enfant': { genre: 'enfant', category: 'chaussure' }
};

// Fonction de migration
async function migrateCatalogue() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🚀 Début de la migration catalogue V2...');
    
    // Connexion à MongoDB
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db(DB_NAME);
    const sourceCollection = db.collection(SOURCE_COLLECTION);
    const targetCollection = db.collection(TARGET_COLLECTION);
    
    // Vérifier si la collection source existe
    const sourceExists = await sourceCollection.countDocuments() > 0;
    if (!sourceExists) {
      console.log('❌ Aucune donnée trouvée dans la collection source');
      return;
    }
    
    console.log(`📊 Collection source: ${await sourceCollection.countDocuments()} documents`);
    
    // Récupérer tous les produits de la collection source
    const sourceProducts = await sourceCollection.find({}).toArray();
    console.log(`📥 ${sourceProducts.length} produits récupérés`);
    
    // Transformer les données
    const transformedProducts = sourceProducts.map(product => {
      const mapping = categoryMapping[product.category];
      
      if (!mapping) {
        console.warn(`⚠️  Catégorie non mappée: ${product.category} pour le produit ${product.name}`);
        return null;
      }
      
      return {
        // Informations de base
        name: product.name || 'Produit sans nom',
        brand: product.brand || 'Marque inconnue',
        model: product.model || 'Modèle inconnu',
        color: product.color || 'Couleur inconnue',
        
        // Nouvelle classification
        genre: mapping.genre,
        category: mapping.category,
        
        // Stock et prix
        stock: product.stock || 8,
        price: product.price || 0,
        
        // Métadonnées
        description: product.description || '',
        alt: product.alt || product.name || 'Produit',
        tags: product.tags || [],
        active: product.active !== false, // Par défaut actif
        
        // Gestion des images
        path: product.path || null,
        image_url: null, // Pas d'URL externe pour les produits existants
        
        // Métadonnées de migration
        originalCollection: 'migrated',
        migratedFrom: product._id.toString(),
        migrationDate: new Date(),
        
        // Timestamps
        createdAt: product.createdAt || new Date(),
        updatedAt: new Date()
      };
    }).filter(Boolean); // Supprimer les produits null
    
    console.log(`🔄 ${transformedProducts.length} produits transformés`);
    
    // Vérifier s'il y a des doublons potentiels
    const existingProducts = await targetCollection.find({}).toArray();
    console.log(`📋 Collection cible: ${existingProducts.length} produits existants`);
    
    // Insérer les nouveaux produits
    if (transformedProducts.length > 0) {
      const result = await targetCollection.insertMany(transformedProducts, { ordered: false });
      console.log(`✅ ${result.insertedCount} produits migrés avec succès`);
      
      if (result.insertedCount !== transformedProducts.length) {
        console.log(`⚠️  ${transformedProducts.length - result.insertedCount} produits non insérés (doublons possibles)`);
      }
    }
    
    // Statistiques finales
    const finalCount = await targetCollection.countDocuments();
    console.log(`📊 Collection finale: ${finalCount} produits`);
    
    // Statistiques par genre et catégorie
    const genreStats = await targetCollection.aggregate([
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
    
    const categoryStats = await targetCollection.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
    
    console.log('\n📈 Statistiques par genre:');
    genreStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} produits, ${stat.totalStock} en stock`);
    });
    
    console.log('\n📈 Statistiques par catégorie:');
    categoryStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} produits, ${stat.totalStock} en stock`);
    });
    
    console.log('\n🎉 Migration terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Connexion fermée');
  }
}

// Fonction de vérification post-migration
async function verifyMigration() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    
    const sourceCount = await db.collection(SOURCE_COLLECTION).countDocuments();
    const targetCount = await db.collection(TARGET_COLLECTION).countDocuments();
    
    console.log('\n🔍 Vérification post-migration:');
    console.log(`  Source (${SOURCE_COLLECTION}): ${sourceCount} produits`);
    console.log(`  Cible (${TARGET_COLLECTION}): ${targetCount} produits`);
    
    // Vérifier quelques produits migrés
    const sampleProducts = await db.collection(TARGET_COLLECTION)
      .find({ originalCollection: 'migrated' })
      .limit(3)
      .toArray();
    
    console.log('\n📋 Exemples de produits migrés:');
    sampleProducts.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} (${product.genre}/${product.category}) - ${product.stock} en stock`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await client.close();
  }
}

// Exécution du script
if (require.main === module) {
  migrateCatalogue()
    .then(() => verifyMigration())
    .then(() => {
      console.log('\n✅ Script de migration terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Échec de la migration:', error);
      process.exit(1);
    });
}

module.exports = { migrateCatalogue, verifyMigration };
