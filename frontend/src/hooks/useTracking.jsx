import { useState, useCallback } from 'react';

const useTracking = () => {
  const [tracking, setTracking] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Obtenir le token d'authentification
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Récupérer le suivi détaillé d'une commande (authentifié)
  const getOrderTracking = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${baseUrl}/api/tracking/orders/${orderId}/tracking`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération du suivi');
      }

      if (data.success && data.tracking) {
        setTracking(prev => ({ ...prev, [orderId]: data.tracking }));
        return data.tracking;
      } else {
        return null;
      }
    } catch (err) {
      console.error('❌ Erreur récupération suivi:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // Récupérer le suivi public (sans authentification)
  const getPublicTracking = useCallback(async (orderNumber, email) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}/api/tracking/public/orders/${orderNumber}/tracking?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération du suivi public');
      }

      if (data.success && data.tracking) {
        return data.tracking;
      } else {
        return null;
      }
    } catch (err) {
      console.error('❌ Erreur récupération suivi public:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // Récupérer le suivi de plusieurs commandes
  const getMultipleOrderTracking = useCallback(async (orderIds) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const promises = orderIds.map(orderId => 
        fetch(`${baseUrl}/api/tracking/orders/${orderId}/tracking`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(response => response.json())
      );

      const results = await Promise.all(promises);
      const trackingData = {};

      results.forEach((data, index) => {
        if (data.success && data.tracking) {
          trackingData[orderIds[index]] = data.tracking;
        }
      });

      setTracking(prev => ({ ...prev, ...trackingData }));
      return trackingData;
    } catch (err) {
      console.error('❌ Erreur récupération suivi multiple:', err);
      setError(err.message);
      return {};
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // Vérifier si une commande a un suivi
  const hasTracking = useCallback((orderId) => {
    return tracking[orderId] && tracking[orderId].steps && tracking[orderId].steps.length > 0;
  }, [tracking]);

  // Obtenir le suivi d'une commande spécifique
  const getTrackingForOrder = useCallback((orderId) => {
    return tracking[orderId] || null;
  }, [tracking]);

  // Nettoyer le cache de suivi
  const clearTracking = useCallback(() => {
    setTracking({});
    setError(null);
  }, []);

  return {
    tracking,
    loading,
    error,
    getOrderTracking,
    getPublicTracking,
    getMultipleOrderTracking,
    hasTracking,
    getTrackingForOrder,
    clearTracking
  };
};

export default useTracking;
