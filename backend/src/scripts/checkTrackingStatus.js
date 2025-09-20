import connectMongo from '../lib/mongo.js';
import Order from '../models/Order.js';

/**
 * Script pour vérifier l'état du suivi d'une commande
 */

async function checkTrackingStatus() {
  try {
    await connectMongo();
    console.log('🔌 Connexion à MongoDB établie');

    // ID de la commande à vérifier
    const orderId = '68c7ced3b712e6f14ef8dc36';
    const orderNumber = 'CMD250915760';

    // Récupérer la commande
    const order = await Order.findById(orderId);
    
    if (!order) {
      console.error('❌ Commande non trouvée');
      return;
    }

    console.log(`\n📦 COMMANDE: ${order.orderNumber}`);
    console.log(`👤 CLIENT: ${order.customer.firstName} ${order.customer.lastName}`);
    console.log(`📧 EMAIL: ${order.customer.email}`);
    console.log(`📅 DATE COMMANDE: ${order.orderDate.toLocaleString('fr-FR')}`);
    console.log(`📅 DATE LIVRAISON: ${order.deliveredDate ? order.deliveredDate.toLocaleString('fr-FR') : 'Non définie'}`);
    console.log(`🚚 STATUT: ${order.status}`);

    if (order.tracking) {
      console.log(`\n🚚 INFORMATIONS DE SUIVI:`);
      console.log(`   Transporteur: ${order.tracking.carrier}`);
      console.log(`   Numéro de suivi: ${order.tracking.trackingNumber}`);
      console.log(`   URL de suivi: ${order.tracking.trackingUrl || 'Non définie'}`);
      console.log(`   Livraison estimée: ${order.tracking.estimatedDelivery ? order.tracking.estimatedDelivery.toLocaleString('fr-FR') : 'Non définie'}`);
      console.log(`   Nombre d'étapes: ${order.tracking.steps ? order.tracking.steps.length : 0}`);

      if (order.tracking.steps && order.tracking.steps.length > 0) {
        console.log(`\n📝 ÉTAPES DE SUIVI:`);
        order.tracking.steps.forEach((step, index) => {
          console.log(`\n   ${index + 1}. ${step.status}`);
          console.log(`      📍 Description: ${step.description}`);
          console.log(`      🏢 Localisation: ${step.location}`);
          console.log(`      📅 Date/Heure: ${step.timestamp.toLocaleString('fr-FR')}`);
          console.log(`      👤 Source: ${step.source}`);
        });

        // Vérifier si toutes les étapes sont présentes
        const expectedSteps = [
          'Suivi initialisé',
          'En transit', 
          'En cours de livraison',
          'Livrée'
        ];

        const currentSteps = order.tracking.steps.map(step => step.status);
        const missingSteps = expectedSteps.filter(step => !currentSteps.includes(step));
        const extraSteps = currentSteps.filter(step => !expectedSteps.includes(step));

        console.log(`\n✅ VÉRIFICATION DES ÉTAPES:`);
        console.log(`   Étapes attendues: ${expectedSteps.length}`);
        console.log(`   Étapes présentes: ${currentSteps.length}`);
        
        if (missingSteps.length === 0 && extraSteps.length === 0) {
          console.log(`   🎉 TOUTES LES ÉTAPES SONT PRÉSENTES !`);
        } else {
          if (missingSteps.length > 0) {
            console.log(`   ❌ Étapes manquantes: ${missingSteps.join(', ')}`);
          }
          if (extraSteps.length > 0) {
            console.log(`   ⚠️ Étapes supplémentaires: ${extraSteps.join(', ')}`);
          }
        }

        // Vérifier la cohérence des dates
        console.log(`\n📅 VÉRIFICATION DES DATES:`);
        const stepsWithDates = order.tracking.steps.filter(step => step.timestamp);
        if (stepsWithDates.length > 1) {
          const sortedSteps = stepsWithDates.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          console.log(`   Première étape: ${sortedSteps[0].status} - ${sortedSteps[0].timestamp.toLocaleString('fr-FR')}`);
          console.log(`   Dernière étape: ${sortedSteps[sortedSteps.length - 1].status} - ${sortedSteps[sortedSteps.length - 1].timestamp.toLocaleString('fr-FR')}`);
        }

      } else {
        console.log(`\n❌ AUCUNE ÉTAPE DE SUIVI TROUVÉE`);
      }
    } else {
      console.log(`\n❌ AUCUN SUIVI TROUVÉ POUR CETTE COMMANDE`);
    }

    console.log(`\n✅ Vérification terminée !`);

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    process.exit(0);
  }
}

// Exécuter le script
checkTrackingStatus();
