import connectMongo from '../lib/mongo.js';
import Order from '../models/Order.js';
import { emitOrderStatusUpdate } from '../socket.js';

/**
 * Script pour compléter le suivi d'une commande spécifique
 * Usage: node src/scripts/completeTrackingForOrder.js
 */

async function completeTrackingForOrder() {
  try {
    await connectMongo();
    console.log('🔌 Connexion à MongoDB établie');

    // ID de la commande à compléter
    const orderId = '68c7ced3b712e6f14ef8dc36';
    const orderNumber = 'CMD250915760';

    // Récupérer la commande
    const order = await Order.findById(orderId);
    
    if (!order) {
      console.error('❌ Commande non trouvée');
      return;
    }

    console.log(`📦 Commande trouvée: ${order.orderNumber}`);
    console.log(`👤 Client: ${order.customer.firstName} ${order.customer.lastName}`);
    console.log(`📅 Date de commande: ${order.orderDate}`);
    console.log(`📅 Date de livraison: ${order.deliveredDate}`);
    console.log(`🚚 Statut: ${order.status}`);

    // Vérifier si le suivi existe
    if (!order.tracking) {
      console.log('⚠️ Aucun suivi trouvé, initialisation...');
      
      // Initialiser le suivi
      await order.initializeTracking({
        carrier: 'DHL',
        trackingNumber: '123456',
        trackingUrl: 'https://www.dhl.com/tracking?trackingNumber=123456',
        estimatedDelivery: new Date('2025-09-15T16:00:00.000Z')
      });

      // Ajouter l'étape initiale
      await order.addTrackingStep({
        status: 'Suivi initialisé',
        description: 'Commande confiée à DHL',
        location: 'Entrepôt',
        source: 'admin',
        timestamp: new Date('2025-09-15T13:32:32.284Z')
      });
    }

    // Étapes de suivi à ajouter (dans l'ordre chronologique)
    const trackingSteps = [
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
        timestamp: new Date('2025-09-15T11:23:19.529Z') // Date de deliveredDate
      }
    ];

    console.log('\n🔄 Ajout des étapes de suivi manquantes...');

    // Ajouter chaque étape
    for (const step of trackingSteps) {
      try {
        await order.addTrackingStep(step);
        console.log(`✅ Étape ajoutée: ${step.status} - ${step.description}`);
        
        // Émettre la mise à jour via WebSocket pour notifier les admins
        emitOrderStatusUpdate(
          order._id.toString(),
          order.status,
          order.customer.email,
          {
            orderNumber: order.orderNumber,
            customer: order.customer,
            total: order.total,
            items: order.items,
            tracking: order.tracking
          }
        );
        console.log(`📡 Notification WebSocket émise pour l'étape: ${step.status}`);
      } catch (error) {
        console.error(`❌ Erreur ajout étape ${step.status}:`, error.message);
      }
    }

    // Mettre à jour l'URL de suivi et la date estimée
    if (order.tracking) {
      order.tracking.trackingUrl = 'https://www.dhl.com/tracking?trackingNumber=123456';
      order.tracking.estimatedDelivery = new Date('2025-09-15T16:00:00.000Z');
      await order.save();
      console.log('✅ URL de suivi et date estimée mises à jour');
    }

    // Récupérer la commande mise à jour pour afficher le résultat
    const updatedOrder = await Order.findById(orderId);
    
    console.log('\n📊 Résultat final:');
    console.log(`📦 Commande: ${updatedOrder.orderNumber}`);
    console.log(`🚚 Transporteur: ${updatedOrder.tracking.carrier}`);
    console.log(`🔢 Numéro de suivi: ${updatedOrder.tracking.trackingNumber}`);
    console.log(`🌐 URL de suivi: ${updatedOrder.tracking.trackingUrl}`);
    console.log(`📅 Livraison estimée: ${updatedOrder.tracking.estimatedDelivery}`);
    console.log(`📋 Nombre d'étapes: ${updatedOrder.tracking.steps.length}`);

    console.log('\n📝 Étapes de suivi:');
    updatedOrder.tracking.steps.forEach((step, index) => {
      console.log(`${index + 1}. ${step.status}`);
      console.log(`   📍 ${step.description}`);
      console.log(`   🏢 ${step.location}`);
      console.log(`   📅 ${step.timestamp.toLocaleString('fr-FR')}`);
      console.log(`   👤 Source: ${step.source}`);
      console.log('');
    });

    // Émission finale pour notifier tous les admins
    emitOrderStatusUpdate(
      order._id.toString(),
      order.status,
      order.customer.email,
      {
        orderNumber: order.orderNumber,
        customer: order.customer,
        total: order.total,
        items: order.items,
        tracking: order.tracking,
        message: 'Suivi complété - Toutes les étapes ajoutées'
      }
    );
    
    console.log('✅ Suivi complété avec succès !');
    console.log('📡 Notifications WebSocket envoyées aux admins connectés');

  } catch (error) {
    console.error('❌ Erreur lors de la complétion du suivi:', error);
  } finally {
    process.exit(0);
  }
}

// Exécuter le script
completeTrackingForOrder();
