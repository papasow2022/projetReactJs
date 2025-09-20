const { MongoClient } = require('mongodb');

async function migrateOrdersEnriched() {
  const client = new MongoClient('mongodb://localhost:27017/papasow');
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('papasow');
    
    // Récupérer toutes les commandes existantes
    const orders = await db.collection('orders').find({}).toArray();
    
    console.log(`\n🔍 ${orders.length} commandes trouvées à migrer:`);
    console.log('='.repeat(80));
    
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const order of orders) {
      console.log(`\n📦 Migration commande: ${order.orderNumber}`);
      
      try {
        // Enrichir chaque item de la commande
        const enrichedItems = await Promise.all(
          order.items.map(async (item) => {
            try {
              // Chercher le produit dans le catalogue
              const product = await db.collection('catalogue').findOne({
                $or: [
                  { _id: item.productId },
                  { name: item.productName },
                  { path: item.productImage }
                ]
              });
              
              if (product) {
                console.log(`   ✅ Produit trouvé: ${product.name}`);
                
                return {
                  ...item,
                  // Ajouter les nouveaux champs
                  brand: product.brand || 'Marque inconnue',
                  category: product.category || 'chaussure',
                  genre: product.genre || product.category || 'homme',
                  color: product.color || 'Non spécifié',
                  size: 'N/A', // Par défaut pour les anciennes commandes
                  sku: product._id.toString(),
                  stockBefore: product.stock || 0,
                  stockAfter: product.stock || 0,
                  stockRemaining: product.stock || 0
                };
              } else {
                console.log(`   ⚠️  Produit non trouvé: ${item.productName}`);
                
                return {
                  ...item,
                  // Valeurs par défaut
                  brand: 'Marque inconnue',
                  category: 'chaussure',
                  genre: 'homme',
                  color: 'Non spécifié',
                  size: 'N/A',
                  sku: item.productId || 'unknown',
                  stockBefore: 0,
                  stockAfter: 0,
                  stockRemaining: 0
                };
              }
            } catch (error) {
              console.error(`   ❌ Erreur item ${item.productName}:`, error.message);
              
              return {
                ...item,
                brand: 'Marque inconnue',
                category: 'chaussure',
                genre: 'homme',
                color: 'Non spécifié',
                size: 'N/A',
                sku: item.productId || 'unknown',
                stockBefore: 0,
                stockAfter: 0,
                stockRemaining: 0
              };
            }
          })
        );
        
        // Mettre à jour la commande avec les items enrichis
        await db.collection('orders').updateOne(
          { _id: order._id },
          { 
            $set: { 
              items: enrichedItems,
              migratedAt: new Date()
            }
          }
        );
        
        console.log(`   ✅ Commande migrée avec succès`);
        migratedCount++;
        
      } catch (error) {
        console.error(`   ❌ Erreur migration commande ${order.orderNumber}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Résumé de la migration:');
    console.log(`   ✅ Commandes migrées: ${migratedCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);
    console.log(`   📈 Taux de succès: ${((migratedCount / orders.length) * 100).toFixed(1)}%`);
    
    // Vérifier quelques commandes migrées
    const sampleOrders = await db.collection('orders').find({ migratedAt: { $exists: true } }).limit(3).toArray();
    
    console.log('\n🔍 Exemples de commandes migrées:');
    sampleOrders.forEach((order, index) => {
      console.log(`\n   ${index + 1}. Commande ${order.orderNumber}:`);
      order.items.forEach((item, itemIndex) => {
        console.log(`      ${itemIndex + 1}. ${item.productName}`);
        console.log(`         Marque: ${item.brand}`);
        console.log(`         Catégorie: ${item.category}`);
        console.log(`         Genre: ${item.genre}`);
        console.log(`         Couleur: ${item.color}`);
        console.log(`         Taille: ${item.size}`);
        console.log(`         Stock restant: ${item.stockRemaining}`);
      });
    });
    
  } catch (error) {
    console.error('❌ Erreur migration:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion fermée');
  }
}

migrateOrdersEnriched();
