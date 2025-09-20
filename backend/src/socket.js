/**
 * Serveur WebSocket pour les mises à jour en temps réel
 * Utilise Socket.io pour la communication bidirectionnelle
 */

import { Server } from 'socket.io';

// Instance globale du serveur WebSocket
let io = null;

/**
 * Initialise le serveur WebSocket
 * @param {Object} server - Serveur HTTP/HTTPS
 * @returns {Object} Instance Socket.io
 */
export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Gestion des connexions
  io.on('connection', (socket) => {
    console.log(`🔌 Client connecté: ${socket.id}`);

    // Rejoindre une room pour les mises à jour de commandes
    socket.on('join_order_updates', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 Utilisateur ${userId} rejoint les mises à jour de commandes`);
    });

    // Rejoindre une room pour les admins
    socket.on('join_admin_updates', (adminId) => {
      socket.join(`admin_${adminId}`);
      console.log(`👨‍💼 Admin ${adminId} rejoint les mises à jour admin`);
    });

    // Gestion de la déconnexion
    socket.on('disconnect', () => {
      console.log(`🔌 Client déconnecté: ${socket.id}`);
    });

    // Gestion des erreurs
    socket.on('error', (error) => {
      console.error('❌ Erreur WebSocket:', error);
    });
  });

  console.log('🚀 Serveur WebSocket initialisé');
  return io;
};

/**
 * Émet une mise à jour de statut de commande
 * @param {string} orderId - ID de la commande
 * @param {string} newStatus - Nouveau statut
 * @param {string} customerId - ID du client
 * @param {Object} orderData - Données complètes de la commande
 */
export const emitOrderStatusUpdate = (orderId, newStatus, customerId, orderData = null) => {
  if (!io) {
    console.warn('⚠️ Serveur WebSocket non initialisé');
    return;
  }

  const updateData = {
    orderId,
    newStatus,
    customerId,
    timestamp: new Date().toISOString(),
    orderData
  };

  // Notifier le client spécifique
  io.to(`user_${customerId}`).emit('order_status_updated', updateData);
  
  // Notifier tous les admins
  io.emit('admin_order_updated', updateData);

  console.log(`📡 Mise à jour de commande émise: ${orderId} → ${newStatus}`);
};

/**
 * Émet une nouvelle commande pour les admins
 * @param {Object} orderData - Données de la nouvelle commande
 */
export const emitNewOrder = (orderData) => {
  if (!io) {
    console.warn('⚠️ Serveur WebSocket non initialisé');
    return;
  }

  const newOrderData = {
    ...orderData,
    timestamp: new Date().toISOString()
  };

  // Notifier tous les admins
  io.emit('new_order_created', newOrderData);

  console.log(`📡 Nouvelle commande émise: ${orderData.orderNumber}`);
};

/**
 * Émet une notification générale
 * @param {string} type - Type de notification
 * @param {string} message - Message de notification
 * @param {string} targetUserId - ID utilisateur cible (optionnel)
 */
export const emitNotification = (type, message, targetUserId = null) => {
  if (!io) {
    console.warn('⚠️ Serveur WebSocket non initialisé');
    return;
  }

  const notificationData = {
    type,
    message,
    timestamp: new Date().toISOString()
  };

  if (targetUserId) {
    // Notification ciblée
    io.to(`user_${targetUserId}`).emit('notification', notificationData);
  } else {
    // Notification générale
    io.emit('notification', notificationData);
  }

  console.log(`📡 Notification émise: ${type} - ${message}`);
};

/**
 * Obtient l'instance du serveur WebSocket
 * @returns {Object|null} Instance Socket.io
 */
export const getSocketInstance = () => {
  return io;
};

/**
 * Obtient le nombre de clients connectés
 * @returns {number} Nombre de clients connectés
 */
export const getConnectedClients = () => {
  return io ? io.engine.clientsCount : 0;
};

export default {
  initializeSocket,
  emitOrderStatusUpdate,
  emitNewOrder,
  emitNotification,
  getSocketInstance,
  getConnectedClients
};
