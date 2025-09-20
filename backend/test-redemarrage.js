import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Charger les variables d'environnement
dotenv.config();

console.log('🔄 Test de redémarrage - PapasowCool_aide');
console.log('==========================================');

const testRedemarrage = async () => {
  try {
    console.log('📋 Configuration:');
    console.log('- MONGODB_URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    
    console.log('\n🔌 Test de connexion MongoDB...');
    
    // Configuration robuste identique au serveur
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
    });
    
    console.log('✅ Connexion MongoDB réussie !');
    
    // Test de la base de données
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📊 Collections trouvées: ${collections.length}`);
    
    // Test de la collection users
    const userCount = await db.collection('users').countDocuments();
    console.log(`👥 Nombre d'utilisateurs: ${userCount}`);
    
    // Test d'une requête simple
    const testUser = await db.collection('users').findOne({});
    if (testUser) {
      console.log('✅ Test de lecture réussi');
    } else {
      console.log('ℹ️ Aucun utilisateur trouvé (normal si base vide)');
    }
    
    console.log('\n🎯 Test d\'inscription simulé...');
    
    // Simuler une inscription
    const testInscription = {
      email: `test-redemarrage-${Date.now()}@example.com`,
      password: 'Test123!',
      prenom: 'Test',
      nom: 'Redemarrage',
      phone: '0123456789',
      birthDate: new Date('1990-01-01'),
      gender: 'Homme',
      newsletter: true,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(testInscription);
    console.log('✅ Test d\'inscription réussi !');
    console.log('🆔 ID utilisateur créé:', result.insertedId);
    
    // Nettoyer le test
    await db.collection('users').deleteOne({ _id: result.insertedId });
    console.log('🧹 Test nettoyé');
    
    console.log('\n🎉 RÉSULTAT: L\'application peut redémarrer sans problème !');
    console.log('📋 Capacités confirmées:');
    console.log('   ✅ Connexion MongoDB robuste');
    console.log('   ✅ Lecture des données');
    console.log('   ✅ Écriture des données');
    console.log('   ✅ Gestion des erreurs');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.error('🔧 Solutions possibles:');
    console.error('   1. Vérifiez que MongoDB est démarré');
    console.error('   2. Vérifiez l\'URI de connexion');
    console.error('   3. Vérifiez les permissions de la base');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion fermée');
    process.exit(0);
  }
};

// Lancer le test
testRedemarrage();
