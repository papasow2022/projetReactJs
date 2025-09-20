import mongoose from 'mongoose';
import connectMongo from '../lib/mongo.js';

const checkReturns = async () => {
  try {
    await connectMongo();
    console.log('🔍 Vérification des retours dans la base de données...');
    
    // Vérifier la collection returns
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📋 Collections disponibles:', collections.map(c => c.name));
    
    // Vérifier si la collection returns existe
    const returnsCollection = collections.find(c => c.name === 'returns');
    if (!returnsCollection) {
      console.log('❌ Collection "returns" n\'existe pas');
      return;
    }
    
    // Compter les retours
    const returnsCount = await db.collection('returns').countDocuments();
    console.log(`📊 Nombre de retours: ${returnsCount}`);
    
    if (returnsCount > 0) {
      const returns = await db.collection('returns').find({}).limit(5).toArray();
      console.log('📝 Premiers retours:');
      returns.forEach((ret, index) => {
        console.log(`${index + 1}. ${ret.returnNumber || 'N/A'} - ${ret.status || 'N/A'} - ${ret.customer?.email || 'N/A'}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

checkReturns();
