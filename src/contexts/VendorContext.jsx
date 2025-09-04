import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = () => {
    try {
      // Charger les vendeurs depuis localStorage
      const storedVendors = JSON.parse(localStorage.getItem('vendors') || '{}');
      setVendors(storedVendors);

      // Charger les commandes des vendeurs
      const storedOrders = JSON.parse(localStorage.getItem('vendorOrders') || '{}');
      setVendorOrders(storedOrders);

      // Charger les statistiques des vendeurs
      const storedStats = JSON.parse(localStorage.getItem('vendorStats') || '{}');
      setVendorStats(storedStats);

      // Charger les notifications des vendeurs
      const storedNotifications = JSON.parse(localStorage.getItem('vendorNotifications') || '{}');
      setVendorNotifications(storedNotifications);

      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des vendeurs:', error);
      setLoading(false);
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
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du vendeur:', error);
      return { success: false, error: error.message };
    }
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

  // Fonction pour créer un vendeur de test validé
  const createTestVendor = (email) => {
    const vendorId = 'VD-TEST-' + Date.now();
    const testVendor = {
      id: vendorId,
      email: email,
      businessName: 'Boutique Test',
      contactName: 'Vendeur Test',
      phone: '+33123456789',
      address: {
        street: '123 Rue de Test',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      },
      status: 'active',
      createdAt: new Date().toISOString(),
      isVerified: true,
      rating: 4.5,
      totalSales: 1250.50,
      totalOrders: 45,
      totalProducts: 12,
      balance: 850.30,
      commission: 0.15,
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

    const updatedVendors = { ...vendors, [vendorId]: testVendor };
    setVendors(updatedVendors);
    localStorage.setItem('vendors', JSON.stringify(updatedVendors));

    // Initialiser les statistiques de test
    const testStats = {
      [vendorId]: {
        dailySales: [
          { date: '2024-01-01', amount: 125.50 },
          { date: '2024-01-02', amount: 89.30 },
          { date: '2024-01-03', amount: 156.80 }
        ],
        monthlySales: [
          { month: '2024-01', amount: 1250.50 },
          { month: '2023-12', amount: 980.20 }
        ],
        topProducts: [
          { id: '1', name: 'Produit Test 1', sales: 25 },
          { id: '2', name: 'Produit Test 2', sales: 18 }
        ],
        customerMetrics: {
          newCustomers: 12,
          returningCustomers: 8,
          averageOrderValue: 27.80
        },
        performance: {
          orderFulfillmentRate: 98.5,
          customerSatisfaction: 4.5,
          responseTime: 2.3
        }
      }
    };

    const updatedStats = { ...vendorStats, ...testStats };
    setVendorStats(updatedStats);
    localStorage.setItem('vendorStats', JSON.stringify(updatedStats));

    return testVendor;
  };

  const value = {
    vendors,
    currentVendor,
    vendorStats,
    vendorOrders,
    vendorNotifications,
    loading,
    createVendor,
    createTestVendor,
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
    setCurrentVendor
  };

  return (
    <VendorContext.Provider value={value}>
      {children}
    </VendorContext.Provider>
  );
};

export { VendorContext }; 