/**
 * Hook WebSocket pour les mises à jour en temps réel
 * Remplace le polling par des mises à jour instantanées
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import { useNotifications } from '../contexts/NotificationContext';

export const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Fonction de connexion
  const connect = useCallback(() => {
    if (socket?.connected) return;

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const newSocket = io(baseUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    // Événements de connexion
    newSocket.on('connect', () => {
      console.log('🔌 WebSocket connecté:', newSocket.id);
      setIsConnected(true);
      setConnectionError(null);
      reconnectAttemptsRef.current = 0;

      // Rejoindre les rooms appropriées
      if (user?.email) {
        newSocket.emit('join_order_updates', user.email);
        console.log('👤 Rejoint les mises à jour de commandes pour:', user.email);
      }
    });

    // Événements de déconnexion
    newSocket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket déconnecté:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        // Le serveur a forcé la déconnexion, reconnecter
        newSocket.connect();
      }
    });

    // Gestion des erreurs
    newSocket.on('connect_error', (error) => {
      console.error('❌ Erreur connexion WebSocket:', error);
      setConnectionError(error.message);
      setIsConnected(false);
      
      // Tentative de reconnexion
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        
        console.log(`🔄 Tentative de reconnexion ${reconnectAttemptsRef.current}/${maxReconnectAttempts} dans ${delay}ms`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      } else {
        console.error('❌ Nombre maximum de tentatives de reconnexion atteint');
        addNotification(
          'Connexion WebSocket échouée',
          'error',
          { details: 'Les mises à jour en temps réel ne sont pas disponibles' }
        );
      }
    });

    setSocket(newSocket);
  }, [user?.email, addNotification]);

  // Fonction de déconnexion
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  // Connexion automatique
  useEffect(() => {
    if (user?.email) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user?.email]); // SUPPRIMÉ connect et disconnect des dépendances

  // Nettoyage
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    socket,
    isConnected,
    connectionError,
    connect,
    disconnect
  };
};

// Hook spécialisé pour les mises à jour de commandes
export const useOrderWebSocket = (onOrderUpdate, onNewOrder) => {
  const { socket, isConnected } = useWebSocket();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Écouter les mises à jour de statut de commande
    const handleOrderStatusUpdate = (data) => {
      console.log('📡 Mise à jour de commande reçue:', data);
      
      if (onOrderUpdate) {
        onOrderUpdate(data);
      }

      // Notification si l'utilisateur n'est pas sur la page des commandes
      if (!window.location.pathname.includes('/commandes')) {
        addNotification(
          'Commande mise à jour',
          'info',
          {
            details: `Commande #${data.orderData?.orderNumber || data.orderId} : ${data.newStatus}`
          }
        );
      }
    };

    // Écouter les nouvelles commandes (pour les admins)
    const handleNewOrder = (data) => {
      console.log('📡 Nouvelle commande reçue:', data);
      
      if (onNewOrder) {
        onNewOrder(data);
      }

      // Notification pour les admins
      if (user?.role === 'admin') {
        addNotification(
          'Nouvelle commande',
          'success',
          {
            details: `Commande #${data.orderNumber} - ${data.customer.firstName} ${data.customer.lastName}`
          }
        );
      }
    };

    // Écouter les notifications générales
    const handleNotification = (data) => {
      console.log('📡 Notification reçue:', data);
      addNotification(data.message, data.type, { details: data.details });
    };

    // Enregistrer les écouteurs
    socket.on('order_status_updated', handleOrderStatusUpdate);
    socket.on('new_order_created', handleNewOrder);
    socket.on('notification', handleNotification);

    // Nettoyage
    return () => {
      socket.off('order_status_updated', handleOrderStatusUpdate);
      socket.off('new_order_created', handleNewOrder);
      socket.off('notification', handleNotification);
    };
  }, [socket, isConnected, onOrderUpdate, onNewOrder, user?.role, addNotification]);

  return {
    socket,
    isConnected
  };
};

// Hook pour les notifications push du navigateur
export const useBrowserNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('⚠️ Ce navigateur ne supporte pas les notifications');
      return false;
    }

    if (permission === 'granted') {
      return true;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, [permission]);

  const showNotification = useCallback((title, options = {}) => {
    if (permission !== 'granted') {
      console.warn('⚠️ Notifications non autorisées');
      return;
    }

    const notification = new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      ...options
    });

    // Fermer automatiquement après 5 secondes
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }, [permission]);

  return {
    permission,
    requestPermission,
    showNotification
  };
};
