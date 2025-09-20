const mongoose = require('mongoose');

async function checkStock() {
  try {
    await mongoose.connect('mongodb://localhost:27017/papasow');
    console.log('✅ Connecté à MongoDB');
    
    const db = mongoose.connection.db;
    const catalogue = db.collection('catalogue');
    
    const stockStats = await catalogue.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          productsWithStock: { $sum: { $cond: [{ $gt: ['$stock', 0] }, 1, 0] } },
          productsWithoutStock: { $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] } },
          activeProducts: { $sum: { $cond: [{ $eq: ['$active', true] }, 1, 0] } },
          inactiveProducts: { $sum: { $cond: [{ $eq: ['$active', false] }, 1, 0] } }
        }
      }
    ]).toArray();
    
    console.log('\n📊 Statistiques des produits:');
    console.log(JSON.stringify(stockStats[0], null, 2));
    
    // Vérifier quelques produits sans stock
    const productsWithoutStock = await catalogue.find({ stock: 0 }).limit(5).toArray();
    console.log('\n📦 Exemples de produits sans stock:');
    productsWithoutStock.forEach(product => {
      console.log(`- ${product.name}: stock=${product.stock}, active=${product.active}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkStock();
