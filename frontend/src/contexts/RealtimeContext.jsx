// src/contexts/RealtimeContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNotifications } from './NotificationContext';

const RealtimeContext = createContext();

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

export const RealtimeProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [metrics, setMetrics] = useState({
    orders: 0,
    revenue: 0,
    visitors: 0,
    conversions: 0
  });
  const [realtimeData, setRealtimeData] = useState({
    activeUsers: 0,
    currentOrders: [],
    recentActivity: [],
    systemAlerts: []
  });
  
  const { addNotification } = useNotifications();
  const intervalRef = useRef(null);
  const reconnectIntervalRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  // Fonction pour mettre à jour les métriques
  const updateMetrics = useCallback(() => {
    setMetrics(prev => ({
      orders: prev.orders + Math.floor(Math.random() * 3),
      revenue: prev.revenue + Math.floor(Math.random() * 100),
      visitors: prev.visitors + Math.floor(Math.random() * 5),
      conversions: prev.conversions + Math.floor(Math.random() * 2)
    }));
  }, []);

  // Fonction pour mettre à jour les données en temps réel
  const updateRealtimeData = useCallback(() => {
    // Simuler des utilisateurs actifs
    const activeUsers = Math.floor(Math.random() * 50) + 10;
    
    // Simuler de nouvelles commandes
    const newOrder = Math.random() > 0.7 ? {
      id: `ORD-${Date.now()}`,
      customer: `Client ${Math.floor(Math.random() * 1000)}`,
      amount: Math.floor(Math.random() * 500) + 50,
      status: 'En cours',
      timestamp: new Date()
    } : null;

    // Simuler des activités récentes
    const activities = [
      'Nouveau produit ajouté',
      'Commande expédiée',
      'Avis client reçu',
      'Stock mis à jour',
      'Promotion créée'
    ];
    
    const newActivity = Math.random() > 0.8 ? {
      id: Date.now(),
      type: activities[Math.floor(Math.random() * activities.length)],
      timestamp: new Date(),
      user: `Utilisateur ${Math.floor(Math.random() * 100)}`
    } : null;

    // Simuler des alertes système
    const alerts = [
      'Stock faible détecté',
      'Paiement en attente',
      'Retour demandé',
      'Nouvelle inscription vendeur'
    ];
    
    const newAlert = Math.random() > 0.9 ? {
      id: Date.now(),
      type: 'warning',
      message: alerts[Math.floor(Math.random() * alerts.length)],
      timestamp: new Date(),
      priority: Math.random() > 0.5 ? 'high' : 'medium'
    } : null;

    setRealtimeData(prev => ({
      activeUsers,
      currentOrders: newOrder 
        ? [newOrder, ...prev.currentOrders.slice(0, 4)]
        : prev.currentOrders,
      recentActivity: newActivity
        ? [newActivity, ...prev.recentActivity.slice(0, 9)]
        : prev.recentActivity,
      systemAlerts: newAlert
        ? [newAlert, ...prev.systemAlerts.slice(0, 4)]
        : prev.systemAlerts
    }));

    // Ajouter des notifications pour les événements importants
    // DÉSACTIVÉ : Les notifications automatiques sont désactivées pour éviter le spam
    // Décommentez les lignes ci-dessous si vous voulez réactiver les notifications
    
    // if (newOrder) {
    //   addNotification({
    //     type: 'success',
    //     title: 'Nouvelle commande',
    //     message: `Commande ${newOrder.id} reçue - ${newOrder.amount}€`,
    //     duration: 5000
    //   });
    // }

    // if (newAlert) {
    //   addNotification({
    //     type: newAlert.priority === 'high' ? 'warning' : 'info',
    //     title: 'Alerte système',
    //     message: newAlert.message,
    //     duration: 7000
    //   });
    // }
  }, [addNotification]);

  // Fonction pour démarrer les mises à jour en temps réel
  const startRealtimeUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      updateMetrics();
      updateRealtimeData();
      setLastUpdate(new Date());
    }, 30000); // Mise à jour toutes les 30 secondes (réduit de 5s à 30s)
  }, [updateMetrics, updateRealtimeData]);

  // Fonction pour se connecter
  const connect = useCallback(() => {
    setConnectionStatus('connecting');
    
    // Simuler la connexion WebSocket
    setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('connected');
      setLastUpdate(new Date());
      reconnectAttemptsRef.current = 0;
      
      // Démarrer les mises à jour en temps réel
      startRealtimeUpdates();
    }, 1000);
  }, [startRealtimeUpdates]);

  // Fonction pour se déconnecter
  const disconnect = useCallback(() => {
    setIsConnected(false);
    setConnectionStatus('disconnected');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Fonction pour gérer la reconnexion
  const handleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current < 5) {
      reconnectAttemptsRef.current++;
      setTimeout(connect, 2000 * reconnectAttemptsRef.current);
    }
  }, [connect]);

  // Effet principal pour gérer la connexion
  useEffect(() => {
    // Démarrer la connexion
    connect();

    // Gérer la reconnexion automatique
    reconnectIntervalRef.current = setInterval(() => {
      if (!isConnected && reconnectAttemptsRef.current < 5) {
        handleReconnect();
      }
    }, 10000);

    // Nettoyage
    return () => {
      disconnect();
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);
      }
    };
  }, []); // Pas de dépendances pour éviter les boucles

  // Fonction pour forcer une mise à jour
  const refreshData = useCallback(() => {
    if (isConnected) {
      setLastUpdate(new Date());
      // Ici, vous pourriez envoyer une requête au serveur
    }
  }, [isConnected]);

  // Fonction pour envoyer des données en temps réel
  const sendRealtimeData = useCallback((type, data) => {
    if (isConnected) {
      // Ici, vous pourriez envoyer des données via WebSocket
      console.log('Envoi de données temps réel:', { type, data });
    }
  }, [isConnected]);

  // Fonction pour s'abonner à des événements spécifiques
  const subscribe = useCallback((eventType, callback) => {
    // Ici, vous pourriez gérer les abonnements WebSocket
    console.log('Abonnement à l\'événement:', eventType);
  }, []);

  // Fonction pour se désabonner d'événements
  const unsubscribe = useCallback((eventType) => {
    // Ici, vous pourriez gérer les désabonnements WebSocket
    console.log('Désabonnement de l\'événement:', eventType);
  }, []);

  const value = {
    isConnected,
    connectionStatus,
    lastUpdate,
    metrics,
    realtimeData,
    refreshData,
    sendRealtimeData,
    subscribe,
    unsubscribe
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};
 
 
 
 
 
 
 
 
 