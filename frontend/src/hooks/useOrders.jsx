import { useState, useCallback } from 'react';

const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Obtenir le token d'authentification
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Créer une commande
  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la commande');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // Obtenir les commandes de l'utilisateur
  const getOrders = useCallback(async (limit = 10, skip = 0, status = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      let url = `${baseUrl}/api/orders/user?limit=${limit}&skip=${skip}`;
      if (status) {
        url += `&status=${status}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération des commandes');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // Obtenir une commande spécifique
  const getOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${baseUrl}/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération de la commande');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = useCallback(async (orderId, status, trackingNumber = null, estimatedDelivery = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${baseUrl}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          trackingNumber,
          estimatedDelivery
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour du statut');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // Annuler une commande
  const cancelOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${baseUrl}/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'annulation de la commande');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // Obtenir les statistiques des commandes
  const getOrderStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${baseUrl}/api/orders/stats/overview`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération des statistiques');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  return {
    loading,
    error,
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder,
    getOrderStats
  };
};

export default useOrders;
