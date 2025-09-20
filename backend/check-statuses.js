const mongoose = require('mongoose');
const Order = require('./src/models/Order.js');

async function checkStatuses() {
  try {
    await mongoose.connect('mongodb://localhost:27017/papasow');
    console.log('✅ Connecté à MongoDB');
    
    const orders = await Order.find({}, 'orderNumber status').limit(10);
    console.log('\n📊 Statuts des commandes:');
    orders.forEach(order => {
      console.log(`- ${order.orderNumber}: ${order.status}`);
    });
    
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📈 Comptage par statut:');
    statusCounts.forEach(stat => {
      console.log(`- ${stat._id}: ${stat.count}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkStatuses();
