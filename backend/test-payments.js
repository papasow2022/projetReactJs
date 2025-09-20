import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { stripeUtils, calculateStripeFees } from './src/lib/stripe.js';
import { paypalUtils, calculatePayPalFees } from './src/lib/paypal.js';

dotenv.config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow')
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

async function testStripe() {
  console.log('\n🧪 Test Stripe...');
  
  try {
    // Test de création d'un PaymentIntent
    const amount = 10000; // 100.00 XOF
    const paymentIntent = await stripeUtils.createPaymentIntent(amount, 'xof', {
      test: true,
      orderId: 'test-order-123'
    });
    
    console.log('✅ PaymentIntent créé:', paymentIntent.id);
    console.log('💰 Montant:', paymentIntent.amount / 100, 'XOF');
    console.log('🔑 Client Secret:', paymentIntent.client_secret);
    
    // Test de calcul des frais
    const fees = calculateStripeFees(amount, 'xof');
    console.log('💸 Frais Stripe:', fees);
    
  } catch (error) {
    console.error('❌ Erreur Stripe:', error.message);
  }
}

async function testPayPal() {
  console.log('\n🧪 Test PayPal...');
  
  try {
    // Test de création d'une commande
    const amount = 10000; // 100.00 XOF
    const items = [
      {
        name: 'Test Product',
        price: amount,
        quantity: 1
      }
    ];
    
    const order = await paypalUtils.createOrder(amount, 'XOF', items, {
      test: true,
      orderId: 'test-order-123'
    });
    
    console.log('✅ Commande PayPal créée:', order.id);
    console.log('💰 Montant:', order.purchase_units[0].amount.value, 'XOF');
    console.log('🔗 URL d\'approbation:', order.links.find(l => l.rel === 'approve')?.href);
    
    // Test de calcul des frais
    const fees = calculatePayPalFees(amount, 'XOF');
    console.log('💸 Frais PayPal:', fees);
    
  } catch (error) {
    console.error('❌ Erreur PayPal:', error.message);
  }
}

async function testDatabaseModels() {
  console.log('\n🧪 Test des modèles de base de données...');
  
  try {
    const Payment = (await import('./src/models/Payment.js')).default;
    const Transaction = (await import('./src/models/Transaction.js')).default;
    
    // Test de création d'un paiement
    const payment = new Payment({
      orderId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      paymentId: 'PAY_TEST_123',
      provider: 'stripe',
      method: 'card',
      amount: 10000,
      currency: 'XOF',
      status: 'pending',
      providerTransactionId: 'pi_test_123',
      fees: {
        provider: 290,
        platform: 0,
        total: 290
      }
    });
    
    console.log('✅ Modèle Payment créé:', payment.paymentId);
    console.log('💰 Montant:', payment.amount, payment.currency);
    console.log('💸 Frais:', payment.fees?.total || 0);
    
    // Test de création d'une transaction
    const transaction = new Transaction({
      paymentId: payment._id,
      orderId: payment.orderId,
      userId: payment.userId,
      transactionId: 'TXN_TEST_123',
      provider: 'stripe',
      type: 'payment',
      amount: 10000,
      currency: 'XOF',
      status: 'pending',
      providerTransactionId: 'pi_test_123',
      fees: {
        provider: 290,
        platform: 0,
        total: 290
      },
      netAmount: 9710
    });
    
    console.log('✅ Modèle Transaction créé:', transaction.transactionId);
    console.log('💰 Montant net:', transaction.netAmount);
    
  } catch (error) {
    console.error('❌ Erreur modèles:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Démarrage des tests de paiement...\n');
  
  // Vérifier les variables d'environnement
  console.log('🔧 Configuration:');
  console.log('- Stripe Secret Key:', process.env.STRIPE_SECRET_KEY ? '✅ Configuré' : '❌ Manquant');
  console.log('- PayPal Client ID:', process.env.PAYPAL_CLIENT_ID ? '✅ Configuré' : '❌ Manquant');
  console.log('- MongoDB URI:', process.env.MONGODB_URI ? '✅ Configuré' : '❌ Manquant');
  
  await testDatabaseModels();
  
  if (process.env.STRIPE_SECRET_KEY) {
    await testStripe();
  } else {
    console.log('\n⚠️  Test Stripe ignoré (STRIPE_SECRET_KEY manquant)');
  }
  
  if (process.env.PAYPAL_CLIENT_ID) {
    await testPayPal();
  } else {
    console.log('\n⚠️  Test PayPal ignoré (PAYPAL_CLIENT_ID manquant)');
  }
  
  console.log('\n✅ Tests terminés!');
  process.exit(0);
}

runTests().catch(console.error);
