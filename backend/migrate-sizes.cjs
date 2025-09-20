const { MongoClient } = require('mongodb');

async function migrateSizes() {
  const client = new MongoClient('mongodb://localhost:27017/papasow');
  
  try {
    await client.connect();
    const db = client.db('papasow');
    
    console.log('🔄 Migration des tailles en cours...');
    
    // Récupérer tous les produits
    const products = await db.collection('catalogue').find({}).toArray();
    console.log(`📦 ${products.length} produits trouvés`);
    
    // Tailles par catégorie
    const sizesByCategory = {
      'homme': ['40', '41', '42', '43', '44', '45', '46'],
      'femme': ['36', '37', '38', '39', '40', '41', '42'],
      'enfant': ['28', '30', '32', '34', '36', '38']
    };
    
    let updated = 0;
    
    for (const product of products) {
      const category = product.category;
      const availableSizes = sizesByCategory[category] || ['40', '41', '42', '43', '44'];
      
      // Créer les tailles avec stock réparti
      const sizes = availableSizes.map(size => ({
        size: size,
        stock: Math.floor(product.stock / availableSizes.length) + (Math.random() > 0.5 ? 1 : 0),
        sku: `${product.brand}-${size}-${product.color}`.replace(/\s+/g, '-').toUpperCase(),
        active: true
      }));
      
      // Mettre à jour le produit
      await db.collection('catalogue').updateOne(
        { _id: product._id },
        {
          $set: {
            sizes: sizes,
            availableSizes: availableSizes,
            updatedAt: new Date()
          }
        }
      );
      
      updated++;
      console.log(`✅ ${product.name} - ${sizes.length} tailles ajoutées`);
    }
    
    console.log(`🎉 Migration terminée: ${updated} produits mis à jour`);
    
    // Vérifier un produit
    const sampleProduct = await db.collection('catalogue').findOne({name: 'Chaussure Homme Balanciaga balenciaga defender blanc'});
    if (sampleProduct) {
      console.log('\n📋 Exemple de produit mis à jour:');
      console.log('Nom:', sampleProduct.name);
      console.log('Stock total:', sampleProduct.stock);
      console.log('Tailles disponibles:');
      sampleProduct.sizes.forEach(s => {
        console.log(`  - Taille ${s.size}: ${s.stock} en stock (SKU: ${s.sku})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.close();
  }
}

migrateSizes();
