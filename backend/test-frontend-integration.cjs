const { MongoClient } = require('mongodb');

async function testFrontendIntegration() {
  const client = new MongoClient('mongodb://localhost:27017/papasow');
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('papasow');
    
    // 1. Vérifier un produit avant commande
    console.log('\n🔍 ÉTAPE 1: Vérification produit avant commande');
    const product = await db.collection('catalogue').findOne({ 
      name: { $regex: /chaussure/i },
      stock: { $gt: 0 }
    });
    
    if (!product) {
      console.log('❌ Aucun produit trouvé');
      return;
    }
    
    console.log('📦 Produit sélectionné:');
    console.log(`   Nom: ${product.name}`);
    console.log(`   Marque: ${product.brand}`);
    console.log(`   Catégorie: ${product.category}`);
    console.log(`   Prix: ${product.price} GNF`);
    console.log(`   Stock AVANT: ${product.stock}`);
    
    // 2. Créer une commande via l'API (simulation frontend)
    console.log('\n🛒 ÉTAPE 2: Création commande via API');
    const orderData = {
      customer: {
        firstName: "Client",
        lastName: "Test",
        email: "client.test@example.com",
        phone: "+224 987 654 321",
        address: {
          street: "Avenue de la Paix 789",
          city: "Conakry",
          postalCode: "001",
          country: "Guinée"
        }
      },
      items: [{
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.path,
        brand: product.brand,
        category: product.category,
        genre: product.category,
        color: product.color,
        size: '43'
      }],
      shipping: 0,
      tax: 0,
      notes: "Test frontend",
      source: "website"
    };
    
    const response = await fetch('http://localhost:4000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    
    if (!result.success) {
      console.log('❌ Erreur création commande:', result);
      return;
    }
    
    console.log('✅ Commande créée:', result.order.orderNumber);
    
    // 3. Vérifier le stock après commande
    console.log('\n📊 ÉTAPE 3: Vérification stock après commande');
    const updatedProduct = await db.collection('catalogue').findOne({ _id: product._id });
    console.log(`   Stock APRÈS: ${updatedProduct.stock}`);
    console.log(`   Réduction: ${product.stock - updatedProduct.stock} unité(s)`);
    
    // 4. Vérifier la commande enrichie
    console.log('\n📋 ÉTAPE 4: Vérification commande enrichie');
    const order = await db.collection('orders').findOne({ orderNumber: result.order.orderNumber });
    
    console.log('🎯 RÉSULTAT FINAL:');
    console.log('='.repeat(60));
    console.log(`📄 Commande: ${order.orderNumber}`);
    console.log(`👤 Client: ${order.customer.firstName} ${order.customer.lastName}`);
    console.log(`💰 Total: ${order.total} GNF`);
    
    order.items.forEach((item, index) => {
      console.log(`\n🛍️ Produit ${index + 1}:`);
      console.log(`   Nom: ${item.productName}`);
      console.log(`   Marque: ${item.brand}`);
      console.log(`   Catégorie: ${item.category} (devrait être "chaussure")`);
      console.log(`   Genre: ${item.genre} (devrait être "${product.category}")`);
      console.log(`   Couleur: ${item.color}`);
      console.log(`   Taille: ${item.size}`);
      console.log(`   Prix: ${item.price} GNF`);
      console.log(`   Quantité: ${item.quantity}`);
      console.log(`   Stock avant: ${item.stockBefore}`);
      console.log(`   Stock après: ${item.stockAfter}`);
      console.log(`   Stock restant: ${item.stockRemaining}`);
    });
    
    console.log('\n✅ Test d\'intégration frontend terminé !');
    
  } catch (error) {
    console.error('❌ Erreur test:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion fermée');
  }
}

testFrontendIntegration();
