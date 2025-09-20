import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4000/api';

// Fonction pour faire des requêtes
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error('Erreur API:', error.message);
    return { status: 500, data: { error: error.message } };
  }
}

async function effectuerCommandeComplete() {
  console.log('🛒 PROCESSUS COMPLET DE COMMANDE');
  console.log('================================\n');

  let token = '';
  let orderId = '';

  // 1. S'inscrire ou se connecter
  console.log('1️⃣ INSCRIPTION/CONNEXION');
  console.log('------------------------');
  
  const login = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'client@ventechaussure.com',
      password: 'motdepasse123'
    })
  });
  
  if (login.data.token) {
    token = login.data.token;
    console.log('✅ Connexion réussie');
  } else {
    // Créer un compte si la connexion échoue
    console.log('📝 Création d\'un nouveau compte...');
    const register = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'client@ventechaussure.com',
        password: 'motdepasse123',
        prenom: 'Jean',
        nom: 'Dupont',
        phone: '0123456789',
        birthDate: '1990-01-01',
        gender: 'Homme',
        newsletter: true
      })
    });
    
    if (register.data.success) {
      console.log('✅ Compte créé, vérifiez votre email pour le code de confirmation');
      console.log('🔑 Code de test (pour le développement):', register.data.debugCode || '123456');
      
      // Simuler la vérification email
      const verify = await apiRequest('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({
          email: 'client@ventechaussure.com',
          code: register.data.debugCode || '123456'
        })
      });
      
      if (verify.data.token) {
        token = verify.data.token;
        console.log('✅ Email vérifié, connexion réussie');
      } else {
        console.log('❌ Échec de la vérification email');
        return;
      }
    } else {
      console.log('❌ Échec de la création du compte');
      return;
    }
  }

  // 2. Créer une commande
  console.log('\n2️⃣ CRÉATION DE LA COMMANDE');
  console.log('---------------------------');
  
  const commandeData = {
    userId: '64a1b2c3d4e5f6789abcdef0', // ID utilisateur fictif
    items: [
      {
        productId: 'prod_123',
        name: 'Nike Air Max 270',
        price: 25000,
        image: '/images/nike-air-max-270.jpg',
        color: 'Noir',
        size: '42',
        qty: 1,
        seller: 'Nike Store',
        category: 'Chaussures'
      },
      {
        productId: 'prod_456',
        name: 'Adidas Ultraboost 22',
        price: 30000,
        image: '/images/adidas-ultraboost-22.jpg',
        color: 'Blanc',
        size: '41',
        qty: 1,
        seller: 'Adidas Store',
        category: 'Chaussures'
      }
    ],
    subtotal: 55000,
    discount: 5000,
    shipping: 2000,
    total: 52000,
    paymentMethod: 'stripe',
    paymentProvider: 'stripe',
    shippingAddress: {
      fullName: 'Jean Dupont',
      address: '123 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      phone: '0123456789'
    },
    billingAddress: {
      fullName: 'Jean Dupont',
      address: '123 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      phone: '0123456789'
    },
    notes: 'Livraison rapide souhaitée'
  };

  // Simuler la création de commande (vous devrez implémenter cette route)
  console.log('📦 Commande créée avec les articles:');
  commandeData.items.forEach((item, index) => {
    console.log(`   ${index + 1}. ${item.name} - ${item.price} XOF (Taille: ${item.size})`);
  });
  console.log(`   💰 Total: ${commandeData.total} XOF`);
  
  // Pour le test, on utilise un ID de commande fictif
  orderId = '64a1b2c3d4e5f6789abcdef0';
  console.log(`   🆔 ID Commande: ${orderId}`);

  // 3. Créer un paiement Stripe
  console.log('\n3️⃣ CRÉATION DU PAIEMENT STRIPE');
  console.log('--------------------------------');
  
  const stripePayment = await apiRequest('/payments/stripe/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      orderId: orderId,
      amount: commandeData.total,
      currency: 'XOF',
      metadata: {
        description: `Commande ${orderId}`,
        items: commandeData.items.length.toString()
      }
    })
  });
  
  if (stripePayment.data.success) {
    console.log('✅ Paiement Stripe créé avec succès');
    console.log(`   💳 Payment ID: ${stripePayment.data.payment.paymentId}`);
    console.log(`   🔑 Client Secret: ${stripePayment.data.stripe.clientSecret.substring(0, 30)}...`);
    console.log(`   💰 Montant: ${stripePayment.data.payment.amount} ${stripePayment.data.payment.currency}`);
    
    // 4. Simuler la confirmation du paiement
    console.log('\n4️⃣ CONFIRMATION DU PAIEMENT');
    console.log('-----------------------------');
    
    // Dans un vrai scénario, vous utiliseriez Stripe.js côté frontend
    // Ici on simule juste la confirmation
    console.log('💳 Simulation de la confirmation du paiement...');
    console.log('   (Dans votre frontend, utilisez Stripe.js pour confirmer)');
    
    // Simuler la confirmation après quelques secondes
    setTimeout(async () => {
      const confirmPayment = await apiRequest('/payments/stripe/confirm', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentIntentId: stripePayment.data.stripe.paymentIntentId
        })
      });
      
      if (confirmPayment.data.success) {
        console.log('✅ Paiement confirmé avec succès !');
        console.log(`   📊 Statut: ${confirmPayment.data.payment.status}`);
        
        // 5. Vérifier le statut de la commande
        console.log('\n5️⃣ VÉRIFICATION DE LA COMMANDE');
        console.log('--------------------------------');
        console.log('✅ Commande confirmée et en cours de traitement');
        console.log('📦 Votre commande sera expédiée sous 24-48h');
        console.log('📧 Vous recevrez un email de confirmation');
        
        // 6. Afficher l'historique des paiements
        console.log('\n6️⃣ HISTORIQUE DES PAIEMENTS');
        console.log('-----------------------------');
        
        const payments = await apiRequest('/payments', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (payments.data.success) {
          console.log(`📋 ${payments.data.payments.length} paiement(s) trouvé(s):`);
          payments.data.payments.forEach((payment, index) => {
            console.log(`   ${index + 1}. ${payment.paymentId} - ${payment.amount} ${payment.currency} (${payment.status})`);
          });
        }
        
      } else {
        console.log('❌ Échec de la confirmation du paiement');
        console.log('   Raison:', confirmPayment.data.message);
      }
    }, 2000);
    
  } else {
    console.log('❌ Erreur création paiement Stripe:', stripePayment.data.message);
  }

  // 7. Alternative : Paiement PayPal
  console.log('\n7️⃣ ALTERNATIVE : PAIEMENT PAYPAL');
  console.log('----------------------------------');
  
  const paypalPayment = await apiRequest('/payments/paypal/create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      orderId: orderId,
      amount: commandeData.total,
      currency: 'XOF',
      items: commandeData.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.qty
      }))
    })
  });
  
  if (paypalPayment.data.success) {
    console.log('✅ Paiement PayPal créé avec succès');
    console.log(`   💳 Payment ID: ${paypalPayment.data.payment.paymentId}`);
    console.log(`   🔗 URL PayPal: ${paypalPayment.data.paypal.approvalUrl}`);
    console.log('   (Dans votre frontend, redirigez vers cette URL)');
  } else {
    console.log('❌ Erreur création paiement PayPal:', paypalPayment.data.message);
  }

  console.log('\n🎉 PROCESSUS DE COMMANDE TERMINÉ !');
  console.log('===================================');
  console.log('📝 Résumé:');
  console.log(`   👤 Client: client@ventechaussure.com`);
  console.log(`   🆔 Commande: ${orderId}`);
  console.log(`   💰 Montant: ${commandeData.total} XOF`);
  console.log(`   💳 Paiement: Stripe + PayPal disponibles`);
  console.log(`   📦 Statut: En attente de confirmation`);
}

// Lancer le processus
effectuerCommandeComplete().catch(console.error);
