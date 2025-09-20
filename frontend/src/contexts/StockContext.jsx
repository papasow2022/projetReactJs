import React, { createContext, useContext, useState, useCallback } from 'react';

const StockContext = createContext();

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};

export const StockProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  // Ajouter une notification
  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-supprimer après la durée spécifiée
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  // Supprimer une notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Vérifier les stocks faibles
  const checkLowStock = useCallback(async (category = null, threshold = 5) => {
    try {
      const url = category 
        ? `http://localhost:4000/api/stock-alerts/low-stock?category=${category}&threshold=${threshold}`
        : `http://localhost:4000/api/stock-alerts/low-stock?threshold=${threshold}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setLowStockProducts(data.lowStockProducts);
        return data;
      } else {
        throw new Error(data.message || 'Erreur lors de la vérification des stocks');
      }
    } catch (error) {
      console.error('Erreur vérification stocks faibles:', error);
      addNotification('Erreur lors de la vérification des stocks', 'error');
      return null;
    }
  }, [addNotification]);

  // Ajouter à la liste d'attente
  const addToWaitingList = useCallback(async (email, productId, productName, category, requestedQuantity = 1) => {
    try {
      const response = await fetch('http://localhost:4000/api/waiting-list/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          productId,
          productName,
          category,
          requestedQuantity
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        addNotification('Vous avez été ajouté à la liste d\'attente !', 'success');
        return data;
      } else {
        throw new Error(data.message || 'Erreur lors de l\'ajout à la liste d\'attente');
      }
    } catch (error) {
      console.error('Erreur ajout liste d\'attente:', error);
      addNotification(error.message, 'error');
      return null;
    }
  }, [addNotification]);

  // Récupérer la liste d'attente d'un utilisateur
  const getUserWaitingList = useCallback(async (email) => {
    try {
      const response = await fetch(`http://localhost:4000/api/waiting-list/user/${email}`);
      const data = await response.json();
      
      if (data.success) {
        setWaitingList(data.waitingEntries);
        return data;
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération de la liste d\'attente');
      }
    } catch (error) {
      console.error('Erreur récupération liste d\'attente:', error);
      addNotification('Erreur lors de la récupération de la liste d\'attente', 'error');
      return null;
    }
  }, [addNotification]);

  // Supprimer de la liste d'attente
  const removeFromWaitingList = useCallback(async (entryId, email) => {
    try {
      const response = await fetch(`http://localhost:4000/api/waiting-list/remove/${entryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (data.success) {
        addNotification('Vous avez été retiré de la liste d\'attente', 'success');
        // Mettre à jour la liste locale
        setWaitingList(prev => prev.filter(entry => entry.id !== entryId));
        return data;
      } else {
        throw new Error(data.message || 'Erreur lors de la suppression de la liste d\'attente');
      }
    } catch (error) {
      console.error('Erreur suppression liste d\'attente:', error);
      addNotification(error.message, 'error');
      return null;
    }
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    checkLowStock,
    lowStockProducts,
    addToWaitingList,
    getUserWaitingList,
    removeFromWaitingList,
    waitingList
  };

  return (
    <StockContext.Provider value={value}>
      {children}
    </StockContext.Provider>
  );
};

