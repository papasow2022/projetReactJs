import mongoose from 'mongoose';
import connectMongo from '../lib/mongo.js';

const createTestReturns = async () => {
  try {
    await connectMongo();
    console.log('🔧 Création des retours de test...');
    
    const db = mongoose.connection.db;
    
    // Créer les retours que le client voit
    const returns = [
      {
        returnNumber: 'RET-472906',
        orderNumber: 'CMD250914368',
        customer: {
          firstName: 'Mamadou Dian',
          lastName: 'Sow',
          email: 'sowdian57@gmail.com',
          phone: '611819930'
        },
        items: [{
          productId: '/chaussures/homme/Balanciaga/Blanc/balenciaga-defender-blanc.jpg',
          productName: 'Chaussure Homme Balanciaga balenciaga defender blanc',
          productImage: '/chaussures/homme/Balanciaga/Blanc/balenciaga-defender-blanc.jpg',
          price: 250000,
          quantity: 1,
          total: 250000,
          reason: 'defective',
          description: 'j\'ai pas aimé le produit',
          condition: 'used'
        }],
        returnReason: 'defective',
        returnDetails: 'j\'ai pas aimé le produit',
        status: 'requested',
        priority: 'normal',
        refund: {
          type: 'full',
          amount: 250000,
          method: 'original_payment'
        },
        requestedDate: new Date('2025-09-15T16:48:16.000Z'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        returnNumber: 'RET-380010',
        orderNumber: 'CMD250914662',
        customer: {
          firstName: 'Mamadou Dian',
          lastName: 'Sow',
          email: 'sowdian57@gmail.com',
          phone: '611819930'
        },
        items: [{
          productId: '/chaussures/homme/Balanciaga/Noir/balenciaga-defender-noir.jpg',
          productName: 'Chaussure Homme Balanciaga balenciaga defender noire',
          productImage: '/chaussures/homme/Balanciaga/Noir/balenciaga-defender-noir.jpg',
          price: 250000,
          quantity: 1,
          total: 250000,
          reason: 'defective',
          description: 'j\'ai pas aimé',
          condition: 'used'
        }],
        returnReason: 'defective',
        returnDetails: 'j\'ai pas aimé',
        status: 'requested',
        priority: 'normal',
        refund: {
          type: 'full',
          amount: 250000,
          method: 'original_payment'
        },
        requestedDate: new Date('2025-09-15T08:55:23.000Z'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insérer les retours
    const result = await db.collection('returns').insertMany(returns);
    console.log(`✅ ${result.insertedCount} retours créés avec succès !`);
    
    // Vérifier
    const count = await db.collection('returns').countDocuments();
    console.log(`📊 Total retours maintenant: ${count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

createTestReturns();
