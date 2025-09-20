import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

// Hook pour vérifier automatiquement les mises à jour de commandes
export const useOrderPolling = (orderId, interval = 10000) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const { token } = useAuth();

  // Fonction pour récupérer une commande
  const fetchOrder = async (id) => {
    if (!id || !token) return null;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:4000/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setOrder(data.order);
        return data.order;
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération de la commande');
      }
    } catch (err) {
      console.error('❌ Erreur récupération commande:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Démarrer le polling
  const startPolling = (id) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Récupérer immédiatement
    fetchOrder(id);

    // Puis toutes les X secondes
    intervalRef.current = setInterval(() => {
      fetchOrder(id);
    }, interval);
  };

  // Arrêter le polling
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Effet pour démarrer/arrêter le polling
  useEffect(() => {
    if (orderId && token) {
      startPolling(orderId);
    } else {
      stopPolling();
    }

    // Nettoyage
    return () => {
      stopPolling();
    };
  }, [orderId, token, interval]);

  // Fonction pour forcer une mise à jour
  const refreshOrder = () => {
    if (orderId) {
      fetchOrder(orderId);
    }
  };

  return {
    order,
    loading,
    error,
    refreshOrder,
    startPolling,
    stopPolling
  };
};

// Hook pour vérifier toutes les commandes d'un utilisateur
export const useOrdersPolling = (interval = 15000) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const { token } = useAuth();

  // Fonction pour récupérer toutes les commandes
  const fetchOrders = async () => {
    if (!token) return [];

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:4000/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders || []);
        return data.orders || [];
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération des commandes');
      }
    } catch (err) {
      console.error('❌ Erreur récupération commandes:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Démarrer le polling
  const startPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Récupérer immédiatement
    fetchOrders();

    // Puis toutes les X secondes
    intervalRef.current = setInterval(() => {
      fetchOrders();
    }, interval);
  };

  // Arrêter le polling
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Effet pour démarrer/arrêter le polling
  useEffect(() => {
    if (token) {
      startPolling();
    } else {
      stopPolling();
    }

    // Nettoyage
    return () => {
      stopPolling();
    };
  }, [token, interval]);

  // Fonction pour forcer une mise à jour
  const refreshOrders = () => {
    fetchOrders();
  };

  return {
    orders,
    loading,
    error,
    refreshOrders,
    startPolling,
    stopPolling
  };
};
