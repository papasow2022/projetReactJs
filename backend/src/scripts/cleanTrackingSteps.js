import connectMongo from '../lib/mongo.js';
import Order from '../models/Order.js';

/**
 * Script pour nettoyer les étapes de suivi dupliquées
 */

async function cleanTrackingSteps() {
  try {
    await connectMongo();
    console.log('🔌 Connexion à MongoDB établie');

    // ID de la commande à nettoyer
    const orderId = '68c7ced3b712e6f14ef8dc36';

    // Récupérer la commande
    const order = await Order.findById(orderId);
    
    if (!order) {
      console.error('❌ Commande non trouvée');
      return;
    }

    console.log(`📦 Commande trouvée: ${order.orderNumber}`);
    console.log(`📋 Nombre d'étapes actuelles: ${order.tracking.steps.length}`);

    // Nettoyer les étapes dupliquées - garder seulement les 4 étapes uniques
    const uniqueSteps = [
      {
        status: 'Suivi initialisé',
        description: 'Commande confiée à DHL',
        location: 'Entrepôt',
        source: 'admin',
        timestamp: new Date('2025-09-15T13:32:32.284Z')
      },
      {
        status: 'En transit',
        description: 'Colis en cours de transport vers le centre de tri',
        location: 'Centre de tri DHL Paris',
        source: 'admin',
        timestamp: new Date('2025-09-15T14:00:00.000Z')
      },
      {
        status: 'En cours de livraison',
        description: 'Colis en cours de livraison vers le destinataire',
        location: 'Marseille, France',
        source: 'admin',
        timestamp: new Date('2025-09-15T15:30:00.000Z')
      },
      {
        status: 'Livrée',
        description: 'Commande livrée avec succès au destinataire',
        location: 'Sabou, Marseille, France',
        source: 'admin',
        timestamp: new Date('2025-09-15T11:23:19.529Z')
      }
    ];

    // Remplacer les étapes par les étapes uniques
    order.tracking.steps = uniqueSteps;
    order.tracking.carrier = 'DHL'; // Corriger le transporteur
    order.tracking.trackingNumber = '123456';
    order.tracking.trackingUrl = 'https://www.dhl.com/tracking?trackingNumber=123456';
    order.tracking.estimatedDelivery = new Date('2025-09-15T16:00:00.000Z');

    await order.save();

    console.log(`✅ Étapes nettoyées: ${order.tracking.steps.length} étapes uniques`);
    console.log(`🚚 Transporteur: ${order.tracking.carrier}`);
    console.log(`🔢 Numéro de suivi: ${order.tracking.trackingNumber}`);

    console.log('\n📝 Étapes finales:');
    order.tracking.steps.forEach((step, index) => {
      console.log(`${index + 1}. ${step.status} - ${step.description}`);
    });

    console.log('\n✅ Collection nettoyée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    process.exit(0);
  }
}

// Exécuter le script
cleanTrackingSteps();
