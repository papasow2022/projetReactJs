import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Création du contexte
const VendorContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useVendor = () => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error('useVendor doit être utilisé dans un VendorProvider');
  }
  return context;
};

// Provider du contexte
export const VendorProvider = ({ children }) => {
  const [vendors, setVendors] = useState({});
  const [currentVendor, setCurrentVendor] = useState(null);
  const [vendorStats, setVendorStats] = useState({});
  const [vendorOrders, setVendorOrders] = useState([]);
  const [vendorNotifications, setVendorNotifications] = useState([]);
  const [vendorHistory, setVendorHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Fonction pour charger les vendeurs depuis localStorage
  const loadVendors = useCallback(() => {
    try {
      // Charger les vendeurs depuis localStorage
      const storedVendors = JSON.parse(localStorage.getItem('vendors') || '{}');
      // Nettoyer automatiquement les vendeurs simulés (VD-TEST-*)
      const cleaned = Object.fromEntries(
        Object.entries(storedVendors).filter(([id]) => !String(id).startsWith('VD-TEST-'))
      );
      if (Object.keys(cleaned).length !== Object.keys(storedVendors).length) {
        localStorage.setItem('vendors', JSON.stringify(cleaned));
      }
      setVendors(cleaned);
      setLastUpdate(new Date());

      // Charger les commandes des vendeurs
      const storedOrders = JSON.parse(localStorage.getItem('vendorOrders') || '{}');
      setVendorOrders(storedOrders);

      // Charger les statistiques des vendeurs
      const storedStats = JSON.parse(localStorage.getItem('vendorStats') || '{}');
      setVendorStats(storedStats);

      // Charger les notifications des vendeurs
      const storedNotifications = JSON.parse(localStorage.getItem('vendorNotifications') || '{}');
      setVendorNotifications(storedNotifications);

      // Charger l'historique des vendeurs
      const storedHistory = JSON.parse(localStorage.getItem('vendorHistory') || '{}');
      setVendorHistory(storedHistory);

      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des vendeurs:', error);
      setLoading(false);
    }
  }, []); // Pas de dépendances car les fonctions setState sont stables

  useEffect(() => {
    loadVendors();
    
    // Écouteur pour les changements de localStorage (entre onglets)
    const handleStorageChange = (e) => {
      if (e.key === 'vendors') {
        loadVendors();
      }
    };

    // Écouteur pour les messages entre onglets
    const channel = new BroadcastChannel('vendor-updates');
    const handleMessage = (e) => {
      if (e.data === 'vendors_updated') {
        loadVendors();
      }
    };

    // Polling intelligent pour vérifier les changements
    const pollInterval = setInterval(() => {
      try {
        const currentVendors = JSON.parse(localStorage.getItem('vendors') || '{}');
        const currentKeys = Object.keys(currentVendors).sort();
        
        // Charger les vendeurs actuels depuis le state pour comparaison
        const storedVendors = JSON.parse(localStorage.getItem('vendors') || '{}');
        const cleaned = Object.fromEntries(
          Object.entries(storedVendors).filter(([id]) => !String(id).startsWith('VD-TEST-'))
        );
        const stateKeys = Object.keys(cleaned).sort();
        
        // Vérifier si les clés ont changé (nouveaux vendeurs, suppressions)
        if (JSON.stringify(currentKeys) !== JSON.stringify(stateKeys)) {
          loadVendors();
        }
      } catch (error) {
        console.error('Erreur lors du polling des vendeurs:', error);
      }
    }, 5000); // Vérification toutes les 5 secondes

    // Ajouter les écouteurs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      channel.addEventListener('message', handleMessage);
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
        channel.removeEventListener('message', handleMessage);
        channel.close();
      }
      clearInterval(pollInterval);
    };
  }, [loadVendors]); // loadVendors est maintenant stable grâce à useCallback

  // Fonction pour notifier les changements aux autres onglets
  const notifyVendorUpdate = () => {
    try {
      const channel = new BroadcastChannel('vendor-updates');
      channel.postMessage('vendors_updated');
      channel.close();
    } catch (error) {
      console.error('Erreur lors de la notification de mise à jour:', error);
    }
  };


  // Fonction pour créer un nouveau vendeur
  const createVendor = (vendorData) => {
    try {
      const vendorId = 'VD-' + Date.now();
      const newVendor = {
        id: vendorId,
        ...vendorData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        isVerified: false,
        verification: {
          kyc: { status: 'pending', updatedAt: null, actor: null, notes: null },
          bank: { status: 'pending', updatedAt: null, actor: null, notes: null },
          tax: { status: 'pending', updatedAt: null, actor: null, notes: null },
          compliance: { status: 'pending', updatedAt: null, actor: null, notes: null }
        },
        rating: 0,
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        balance: 0,
        commission: 0.15, // 15% de commission par défaut
        settings: {
          autoAcceptOrders: true,
          notifications: {
            newOrder: true,
            lowStock: true,
            negativeReview: true,
            paymentReceived: true
          },
          shipping: {
            freeShippingThreshold: 50,
            defaultShippingCost: 5.99
          }
        }
      };

      const updatedVendors = { ...vendors, [vendorId]: newVendor };
      setVendors(updatedVendors);
      localStorage.setItem('vendors', JSON.stringify(updatedVendors));
      
      // Notifier les autres onglets du changement
      notifyVendorUpdate();

      // Initialiser les statistiques
      const newStats = {
        [vendorId]: {
          dailySales: [],
          monthlySales: [],
          topProducts: [],
          customerMetrics: {
            newCustomers: 0,
            returningCustomers: 0,
            averageOrderValue: 0
          },
          performance: {
            orderFulfillmentRate: 100,
            averageResponseTime: 0,
            returnRate: 0
          }
        }
      };

      const updatedStats = { ...vendorStats, ...newStats };
      setVendorStats(updatedStats);
      localStorage.setItem('vendorStats', JSON.stringify(updatedStats));

      return { success: true, vendorId };
    } catch (error) {
      console.error('Erreur lors de la création du vendeur:', error);
      return { success: false, error: error.message };
    }
  };

  // Fonction pour mettre à jour un vendeur
  const updateVendor = (vendorId, updates) => {
    try {
      const updatedVendors = {
        ...vendors,
        [vendorId]: { ...vendors[vendorId], ...updates }
      };
      setVendors(updatedVendors);
      localStorage.setItem('vendors', JSON.stringify(updatedVendors));
      
      // Notifier les autres onglets du changement
      notifyVendorUpdate();
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du vendeur:', error);
      return { success: false, error: error.message };
    }
  };

  // Mise à jour d'une étape de vérification
  const updateVendorVerificationStep = (vendorId, step, status, notes = null) => {
    try {
      const vendor = vendors[vendorId];
      if (!vendor) return { success: false, error: 'Vendor not found' };
      const actor = (() => {
        try {
          const storedUser = localStorage.getItem('user');
          const currentUser = storedUser ? JSON.parse(storedUser) : null;
          return currentUser?.email || 'admin@unknown.com';
        } catch (_) { return 'admin@unknown.com'; }
      })();
      const newVerification = {
        ...(vendor.verification || {}),
        [step]: { status, updatedAt: new Date().toISOString(), actor, notes }
      };
      return updateVendor(vendorId, { verification: newVerification });
    } catch (error) {
      console.error('Erreur updateVendorVerificationStep:', error);
      return { success: false, error: error.message };
    }
  };

  // Historique des actions sur vendeurs
  const addVendorHistory = (vendorId, action, details = {}) => {
    try {
      const historyForVendor = vendorHistory[vendorId] || [];
      const entry = {
        id: 'VH-' + Date.now(),
        vendorId,
        action, // e.g., 'approved', 'rejected', 'suspended', 'unsuspended', 'rated'
        details,
        createdAt: new Date().toISOString()
      };
      const updatedHistory = { ...vendorHistory, [vendorId]: [entry, ...historyForVendor] };
      setVendorHistory(updatedHistory);
      localStorage.setItem('vendorHistory', JSON.stringify(updatedHistory));
      return entry;
    } catch (error) {
      console.error('Erreur lors de l\'ajout à l\'historique vendeur:', error);
      return null;
    }
  };

  const getVendorHistory = (vendorId) => {
    return vendorHistory[vendorId] || [];
  };

  // Notation vendeur (agrégée)
  const rateVendor = (vendorId, ratingValue) => {
    try {
      const vendor = vendors[vendorId];
      if (!vendor) return { success: false, error: 'Vendor not found' };
      const currentRating = Number(vendor.rating || 0);
      const ratingCount = Number(vendor.ratingCount || 0);
      const newCount = ratingCount + 1;
      const newRating = ((currentRating * ratingCount) + Number(ratingValue)) / newCount;
      const result = updateVendor(vendorId, { rating: Number(newRating.toFixed(2)), ratingCount: newCount });
      if (result.success) addVendorHistory(vendorId, 'rated', { ratingValue });
      return result;
    } catch (error) {
      console.error('Erreur lors de la notation du vendeur:', error);
      return { success: false, error: error.message };
    }
  };

  // Suspension / Réactivation
  const suspendVendor = (vendorId, reason, untilIsoString = null) => {
    try {
      const result = updateVendor(vendorId, { status: 'suspended', suspension: { isSuspended: true, reason, until: untilIsoString } });
      if (result.success) {
        addVendorHistory(vendorId, 'suspended', { reason, until: untilIsoString });
        // Enregistrer dans l'audit
        const vendor = vendors[vendorId];
        if (vendor) {
          // Récupérer l'utilisateur connecté pour l'audit
          const storedUser = localStorage.getItem('user');
          const currentUser = storedUser ? JSON.parse(storedUser) : null;
          const actor = currentUser?.email || 'admin@unknown.com';
          
          const auditEntry = {
            id: 'AUD-' + Date.now(),
            action: 'vendor_suspended',
            subject: { type: 'vendor', id: vendorId },
            details: `Vendeur "${vendor.businessName || vendor.informations?.email}" suspendu - ${reason}`,
            actor: actor,
            createdAt: new Date().toISOString()
          };
          
          // Ajouter à l'audit
          const existingAudit = JSON.parse(localStorage.getItem('adminAuditLog') || '[]');
          const updatedAudit = [auditEntry, ...existingAudit].slice(0, 500);
          localStorage.setItem('adminAuditLog', JSON.stringify(updatedAudit));
        }
      }
      return result;
    } catch (error) {
      console.error('Erreur lors de la suspension du vendeur:', error);
      return { success: false, error: error.message };
    }
  };

  const unsuspendVendor = (vendorId) => {
    try {
      const result = updateVendor(vendorId, { status: 'approved', suspension: { isSuspended: false, reason: null, until: null } });
      if (result.success) {
        addVendorHistory(vendorId, 'unsuspended', {});
        // Enregistrer dans l'audit
        const vendor = vendors[vendorId];
        if (vendor) {
          // Récupérer l'utilisateur connecté pour l'audit
          const storedUser = localStorage.getItem('user');
          const currentUser = storedUser ? JSON.parse(storedUser) : null;
          const actor = currentUser?.email || 'admin@unknown.com';
          
          const auditEntry = {
            id: 'AUD-' + Date.now(),
            action: 'vendor_unsuspended',
            subject: { type: 'vendor', id: vendorId },
            details: `Vendeur "${vendor.businessName || vendor.informations?.email}" réactivé`,
            actor: actor,
            createdAt: new Date().toISOString()
          };
          
          // Ajouter à l'audit
          const existingAudit = JSON.parse(localStorage.getItem('adminAuditLog') || '[]');
          const updatedAudit = [auditEntry, ...existingAudit].slice(0, 500);
          localStorage.setItem('adminAuditLog', JSON.stringify(updatedAudit));
        }
      }
      return result;
    } catch (error) {
      console.error('Erreur lors de la réactivation du vendeur:', error);
      return { success: false, error: error.message };
    }
  };

  // Actions de masse
  const bulkApproveVendors = (vendorIds = []) => {
    vendorIds.forEach((id) => {
      updateVendor(id, { status: 'approved', isVerified: true });
      addVendorHistory(id, 'approved', {});
    });
    return { success: true };
  };

  const bulkRejectVendors = (vendorIds = [], reason = 'Non conforme') => {
    vendorIds.forEach((id) => {
      updateVendor(id, { status: 'rejected', isVerified: false, rejectionReason: reason });
      addVendorHistory(id, 'rejected', { reason });
    });
    return { success: true };
  };

  // Fonction pour obtenir un vendeur
  const getVendor = (vendorId) => {
    return vendors[vendorId] || null;
  };

  // Fonction pour obtenir les statistiques d'un vendeur
  const getVendorStats = (vendorId) => {
    return vendorStats[vendorId] || {
      dailySales: [],
      monthlySales: [],
      topProducts: [],
      customerMetrics: {
        newCustomers: 0,
        returningCustomers: 0,
        averageOrderValue: 0
      },
      performance: {
        orderFulfillmentRate: 100,
        averageResponseTime: 0,
        returnRate: 0
      }
    };
  };

  // Fonction pour ajouter une commande
  const addVendorOrder = (vendorId, order) => {
    try {
      const vendorOrdersList = vendorOrders[vendorId] || [];
      const newOrder = {
        id: 'ORD-' + Date.now(),
        ...order,
        vendorId,
        createdAt: new Date().toISOString(),
        status: 'pending',
        paymentStatus: 'pending'
      };

      const updatedOrders = {
        ...vendorOrders,
        [vendorId]: [...vendorOrdersList, newOrder]
      };
      setVendorOrders(updatedOrders);
      localStorage.setItem('vendorOrders', JSON.stringify(updatedOrders));

      // Mettre à jour les statistiques
      updateVendorStats(vendorId, newOrder);

      // Ajouter une notification
      addVendorNotification(vendorId, {
        type: 'newOrder',
        title: 'Nouvelle commande reçue',
        message: `Commande #${newOrder.id} pour ${order.customerName}`,
        orderId: newOrder.id
      });

      return { success: true, orderId: newOrder.id };
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la commande:', error);
      return { success: false, error: error.message };
    }
  };

  // Fonction pour mettre à jour une commande
  const updateVendorOrder = (vendorId, orderId, updates) => {
    try {
      const vendorOrdersList = vendorOrders[vendorId] || [];
      const updatedOrdersList = vendorOrdersList.map(order =>
        order.id === orderId ? { ...order, ...updates } : order
      );

      const updatedOrders = {
        ...vendorOrders,
        [vendorId]: updatedOrdersList
      };
      setVendorOrders(updatedOrders);
      localStorage.setItem('vendorOrders', JSON.stringify(updatedOrders));

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
      return { success: false, error: error.message };
    }
  };

  // Fonction pour obtenir les commandes d'un vendeur
  const getVendorOrders = (vendorId, filters = {}) => {
    let orders = vendorOrders[vendorId] || [];

    // Appliquer les filtres
    if (filters.status) {
      orders = orders.filter(order => order.status === filters.status);
    }
    if (filters.dateFrom) {
      orders = orders.filter(order => new Date(order.createdAt) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      orders = orders.filter(order => new Date(order.createdAt) <= new Date(filters.dateTo));
    }

    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Fonction pour mettre à jour les statistiques
  const updateVendorStats = (vendorId, order) => {
    try {
      const currentStats = vendorStats[vendorId] || {
        dailySales: [],
        monthlySales: [],
        topProducts: [],
        customerMetrics: {
          newCustomers: 0,
          returningCustomers: 0,
          averageOrderValue: 0
        },
        performance: {
          orderFulfillmentRate: 100,
          averageResponseTime: 0,
          returnRate: 0
        }
      };

      // Mettre à jour les ventes quotidiennes
      const today = new Date().toISOString().split('T')[0];
      const dailySales = currentStats.dailySales || [];
      const todaySale = dailySales.find(sale => sale.date === today);
      
      if (todaySale) {
        todaySale.amount += order.total;
        todaySale.orders += 1;
      } else {
        dailySales.push({
          date: today,
          amount: order.total,
          orders: 1
        });
      }

      // Mettre à jour les métriques clients
      const customerMetrics = currentStats.customerMetrics;
      customerMetrics.averageOrderValue = 
        (customerMetrics.averageOrderValue * customerMetrics.newCustomers + order.total) / 
        (customerMetrics.newCustomers + 1);
      customerMetrics.newCustomers += 1;

      const updatedStats = {
        ...vendorStats,
        [vendorId]: {
          ...currentStats,
          dailySales,
          customerMetrics
        }
      };

      setVendorStats(updatedStats);
      localStorage.setItem('vendorStats', JSON.stringify(updatedStats));
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statistiques:', error);
    }
  };

  // Fonction pour ajouter une notification
  const addVendorNotification = (vendorId, notification) => {
    try {
      const vendorNotificationsList = vendorNotifications[vendorId] || [];
      const newNotification = {
        id: Date.now(),
        ...notification,
        createdAt: new Date().toISOString(),
        read: false
      };

      const updatedNotifications = {
        ...vendorNotifications,
        [vendorId]: [newNotification, ...vendorNotificationsList].slice(0, 50) // Garder seulement les 50 dernières
      };
      setVendorNotifications(updatedNotifications);
      localStorage.setItem('vendorNotifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la notification:', error);
    }
  };

  // Fonction pour marquer une notification comme lue
  const markNotificationAsRead = (vendorId, notificationId) => {
    try {
      const vendorNotificationsList = vendorNotifications[vendorId] || [];
      const updatedNotificationsList = vendorNotificationsList.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );

      const updatedNotifications = {
        ...vendorNotifications,
        [vendorId]: updatedNotificationsList
      };
      setVendorNotifications(updatedNotifications);
      localStorage.setItem('vendorNotifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  // Fonction pour obtenir les notifications d'un vendeur
  const getVendorNotifications = (vendorId, unreadOnly = false) => {
    const notifications = vendorNotifications[vendorId] || [];
    return unreadOnly ? notifications.filter(n => !n.read) : notifications;
  };

  // Fonction pour calculer les revenus
  const calculateVendorRevenue = (vendorId, period = 'month') => {
    const orders = getVendorOrders(vendorId);
    const now = new Date();
    let filteredOrders = [];

    switch (period) {
      case 'day':
        filteredOrders = orders.filter(order => 
          new Date(order.createdAt).toDateString() === now.toDateString()
        );
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredOrders = orders.filter(order => 
          new Date(order.createdAt) >= weekAgo
        );
        break;
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
        filteredOrders = orders.filter(order => 
          new Date(order.createdAt) >= monthAgo
        );
        break;
      default:
        filteredOrders = orders;
    }

    return filteredOrders.reduce((total, order) => total + (order.total || 0), 0);
  };

  // Fonction de nettoyage des vendeurs simulés (optionnel)
  const purgeSimulatedVendors = () => {
    try {
      const filtered = Object.fromEntries(Object.entries(vendors).filter(([id]) => !String(id).startsWith('VD-TEST-')));
      setVendors(filtered);
      localStorage.setItem('vendors', JSON.stringify(filtered));
      
      // Notifier les autres onglets du changement
      notifyVendorUpdate();
    } catch (error) {
      console.error('Erreur purgeSimulatedVendors:', error);
    }
  };


  const value = {
    vendors,
    currentVendor,
    vendorStats,
    vendorOrders,
    vendorNotifications,
    vendorHistory,
    loading,
    lastUpdate,
    createVendor,
    purgeSimulatedVendors,
    updateVendor,
    getVendor,
    getVendorStats,
    addVendorOrder,
    updateVendorOrder,
    getVendorOrders,
    addVendorNotification,
    markNotificationAsRead,
    getVendorNotifications,
    calculateVendorRevenue,
    setCurrentVendor,
    // new APIs
    addVendorHistory,
    getVendorHistory,
    rateVendor,
    suspendVendor,
    unsuspendVendor,
    bulkApproveVendors,
    bulkRejectVendors,
    updateVendorVerificationStep
  };

  return (
    <VendorContext.Provider value={value}>
      {children}
    </VendorContext.Provider>
  );
};

export { VendorContext }; 