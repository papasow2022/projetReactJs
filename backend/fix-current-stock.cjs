const { MongoClient } = require('mongodb');

async function fixCurrentStock() {
  const client = new MongoClient('mongodb://localhost:27017/papasow');
  
  try {
    await client.connect();
    const db = client.db('papasow');
    
    console.log('🔄 Correction du stock actuel...');
    
    // Récupérer le produit Balanciaga blanc
    const product = await db.collection('catalogue').findOne({name: 'Chaussure Homme Balanciaga balenciaga defender blanc'});
    
    if (product) {
      console.log('📦 Produit trouvé:', product.name);
      console.log('Stock total actuel:', product.stock);
      console.log('Tailles actuelles:');
      product.sizes.forEach(s => console.log(`  - Taille ${s.size}: ${s.stock} en stock`));
      
      // Calculer le stock total réel basé sur les tailles
      const realTotalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
      console.log('Stock total calculé:', realTotalStock);
      
      // Mettre à jour le stock total pour qu'il corresponde aux tailles
      await db.collection('catalogue').updateOne(
        { _id: product._id },
        {
          $set: {
            stock: realTotalStock,
            updatedAt: new Date()
          }
        }
      );
      
      console.log('✅ Stock total corrigé:', product.stock, '→', realTotalStock);
      
      // Vérifier la correction
      const updatedProduct = await db.collection('catalogue').findOne({_id: product._id});
      console.log('\n📊 VÉRIFICATION:');
      console.log('Stock total:', updatedProduct.stock);
      console.log('Tailles:');
      updatedProduct.sizes.forEach(s => {
        if (s.stock > 0) {
          console.log(`  - Taille ${s.size}: ${s.stock} en stock`);
        }
      });
      
    } else {
      console.log('❌ Produit non trouvé');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.close();
  }
}

fixCurrentStock();
