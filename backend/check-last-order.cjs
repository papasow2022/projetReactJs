const { MongoClient } = require('mongodb');

async function checkLastOrder() {
  const client = new MongoClient('mongodb://localhost:27017/papasow');
  
  try {
    await client.connect();
    const db = client.db('papasow');
    
    // Récupérer la dernière commande
    const order = await db.collection('orders').findOne({}, {sort: {createdAt: -1}});
    
    if (order) {
      console.log('📋 DERNIERE COMMANDE:');
      console.log('Numero:', order.orderNumber);
      console.log('Client:', order.customer.firstName, order.customer.lastName);
      console.log('Email:', order.customer.email);
      console.log('Telephone:', order.customer.phone);
      console.log('Adresse:', order.customer.address.street, order.customer.address.city, order.customer.address.country);
      console.log('Total:', order.total, 'GNF');
      console.log('Date:', order.createdAt);
      console.log('Status:', order.status);
      
      console.log('\n📦 PRODUITS:');
      order.items.forEach((item, i) => {
        console.log(`Produit ${i+1}:`);
        console.log('  Nom:', item.productName);
        console.log('  Marque:', item.brand);
        console.log('  Categorie:', item.category);
        console.log('  Genre:', item.genre);
        console.log('  Couleur:', item.color);
        console.log('  Taille:', item.size);
        console.log('  Prix unitaire:', item.price, 'GNF');
        console.log('  Quantite:', item.quantity);
        console.log('  Total:', item.total, 'GNF');
        console.log('  Stock avant:', item.stockBefore);
        console.log('  Stock apres:', item.stockAfter);
        console.log('  Stock restant:', item.stockRemaining);
        console.log('  SKU:', item.sku);
      });
      
      // Vérifier le stock actuel du produit
      if (order.items[0]) {
        const product = await db.collection('catalogue').findOne({_id: order.items[0].productId});
        if (product) {
          console.log('\n📊 STOCK ACTUEL DU PRODUIT:');
          console.log('Nom:', product.name);
          console.log('Stock total:', product.stock);
          console.log('Tailles avec stock:');
          if (product.sizes) {
            product.sizes.forEach(s => {
              if (s.stock > 0) {
                console.log(`  - Taille ${s.size}: ${s.stock} en stock`);
              }
            });
          }
        }
      }
      
    } else {
      console.log('❌ Aucune commande trouvée');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.close();
  }
}

checkLastOrder();
