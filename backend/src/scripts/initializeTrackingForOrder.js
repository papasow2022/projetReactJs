import connectMongo from '../lib/mongo.js';
import Order from '../models/Order.js';
import { emitOrderStatusUpdate } from '../socket.js';

/**
 * Script pour initialiser le suivi d'une commande avec les informations de base
 */

async function initializeTrackingForOrder() {
  try {
    await connectMongo();
    console.log('🔌 Connexion à MongoDB établie');

    // ID de la commande à initialiser
    const orderId = '68c7ced3b712e6f14ef8dc36';

    // Récupérer la commande
    const order = await Order.findById(orderId);
    
    if (!order) {
      console.error('❌ Commande non trouvée');
      return;
    }

    console.log(`📦 Commande trouvée: ${order.orderNumber}`);
    console.log(`📋 État actuel du suivi:`, {
      carrier: order.tracking?.carrier || 'Non spécifié',
      trackingNumber: order.tracking?.trackingNumber || 'Non spécifié',
      steps: order.tracking?.steps?.length || 0
    });

    // Vérifier si le suivi existe déjà
    if (!order.tracking) {
      console.log('❌ Aucun suivi trouvé pour cette commande');
      return;
    }

    // Initialiser les informations de base du suivi
    if (!order.tracking.carrier || !order.tracking.trackingNumber) {
      console.log('🔧 Initialisation des informations de suivi...');
      
      // Mettre à jour les informations de base
      order.tracking.carrier = 'DHL';
      order.tracking.trackingNumber = 'DHL123456789';
      order.tracking.trackingUrl = 'https://www.dhl.com/fr-fr/home/tracking.html?trackingNumber=DHL123456789';
      order.tracking.estimatedDelivery = new Date('2025-09-20T00:00:00.000Z');
      
      // Sauvegarder les modifications
      await order.save();
      
      console.log('✅ Informations de suivi initialisées:', {
        carrier: order.tracking.carrier,
        trackingNumber: order.tracking.trackingNumber,
        trackingUrl: order.tracking.trackingUrl,
        estimatedDelivery: order.tracking.estimatedDelivery
      });

      // Émettre la mise à jour via WebSocket
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
          message: 'Suivi initialisé avec informations complètes'
        }
      );

      console.log('📡 Notification WebSocket envoyée');
    } else {
      console.log('✅ Le suivi est déjà initialisé avec les informations de base');
    }

    console.log('✅ Initialisation terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    process.exit(0);
  }
}

// Exécuter le script
initializeTrackingForOrder();
