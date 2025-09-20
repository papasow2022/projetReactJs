import React, { createContext, useContext, useState, useEffect } from 'react';
import { BiBell, BiCheckCircle, BiXCircle, BiError, BiInfoCircle } from 'react-icons/bi';

const NotificationSystemContext = createContext();

export const useNotificationSystem = () => {
  const context = useContext(NotificationSystemContext);
  if (!context) {
    throw new Error('useNotificationSystem must be used within a NotificationSystemProvider');
  }
  return context;
};

export const NotificationSystemProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    sms: false,
    lowStock: true,
    outOfStock: true,
    newOrder: true,
    paymentIssue: true,
    vendorApproval: true,
    reviewModeration: true,
    systemAlerts: true,
    newTicket: true,
    ticketReply: true
  });

  // Types de notifications supportés
  const notificationTypes = {
    LOW_STOCK: {
      id: 'low_stock',
      name: 'Stock faible',
        icon: BiError,
      color: 'warning',
      priority: 'medium'
    },
    OUT_OF_STOCK: {
      id: 'out_of_stock',
      name: 'Rupture de stock',
      icon: BiXCircle,
      color: 'danger',
      priority: 'high'
    },
    NEW_ORDER: {
      id: 'new_order',
      name: 'Nouvelle commande',
      icon: BiCheckCircle,
      color: 'success',
      priority: 'medium'
    },
    PAYMENT_ISSUE: {
      id: 'payment_issue',
      name: 'Problème de paiement',
      icon: BiXCircle,
      color: 'danger',
      priority: 'high'
    },
    NEW_TICKET: {
      id: 'new_ticket',
      name: 'Nouveau ticket de support',
      icon: BiBell,
      color: 'info',
      priority: 'medium'
    },
    TICKET_REPLY: {
      id: 'ticket_reply',
      name: 'Réponse au ticket',
      icon: BiInfoCircle,
      color: 'primary',
      priority: 'medium'
    },
    VENDOR_APPROVAL: {
      id: 'vendor_approval',
      name: 'Demande vendeur',
      icon: BiInfoCircle,
      color: 'info',
      priority: 'medium'
    },
    REVIEW_MODERATION: {
      id: 'review_moderation',
      name: 'Avis à modérer',
        icon: BiError,
      color: 'warning',
      priority: 'low'
    },
    SYSTEM_ALERT: {
      id: 'system_alert',
      name: 'Alerte système',
      icon: BiBell,
      color: 'primary',
      priority: 'high'
    },
    HIGH_SALES_VELOCITY: {
      id: 'high_sales_velocity',
      name: 'Vente rapide',
      icon: BiCheckCircle,
      color: 'success',
      priority: 'low'
    },
    FRAUD_DETECTED: {
      id: 'fraud_detected',
      name: 'Fraude détectée',
      icon: BiXCircle,
      color: 'danger',
      priority: 'critical'
    },
    PERFORMANCE_ISSUE: {
      id: 'performance_issue',
      name: 'Problème de performance',
        icon: BiError,
      color: 'warning',
      priority: 'medium'
    }
  };

  // Créer une notification
  const createNotification = (type, data) => {
    const notificationType = notificationTypes[type];
    if (!notificationType) return;

    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type,
      title: notificationType.name,
      message: data.message || '',
      data: data,
      timestamp: new Date().toISOString(),
      read: false,
      priority: notificationType.priority,
      color: notificationType.color,
      icon: notificationType.icon,
      actions: data.actions || [],
      category: data.category || 'general'
    };

    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Notification push si activée
    if (settings.push && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/favicon.ico',
              tag: notification.id
            });
          }
        });
      }
    }

    // Auto-suppression après 7 jours
    setTimeout(() => {
      removeNotification(notification.id);
    }, 7 * 24 * 60 * 60 * 1000);

    return notification;
  };

  // Marquer comme lu
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Marquer toutes comme lues
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  // Supprimer une notification
  const removeNotification = (notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return prev.filter(notif => notif.id !== notificationId);
    });
  };

  // Supprimer toutes les notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Filtrer les notifications
  const getFilteredNotifications = (filters = {}) => {
    let filtered = notifications;

    if (filters.type) {
      filtered = filtered.filter(notif => notif.type === filters.type);
    }

    if (filters.priority) {
      filtered = filtered.filter(notif => notif.priority === filters.priority);
    }

    if (filters.read !== undefined) {
      filtered = filtered.filter(notif => notif.read === filters.read);
    }

    if (filters.category) {
      filtered = filtered.filter(notif => notif.category === filters.category);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(notif => 
        new Date(notif.timestamp) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(notif => 
        new Date(notif.timestamp) <= new Date(filters.dateTo)
      );
    }

    return filtered;
  };

  // Mettre à jour les paramètres
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    localStorage.setItem('notificationSettings', JSON.stringify({ ...settings, ...newSettings }));
  };

  // Actions rapides pour les notifications
  const executeAction = (notificationId, actionId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification || !notification.actions) return;

    const action = notification.actions.find(a => a.id === actionId);
    if (!action) return;

    // Exécuter l'action
    if (action.handler) {
      action.handler(notification.data);
    }

    // Marquer comme lu si l'action le demande
    if (action.markAsRead) {
      markAsRead(notificationId);
    }
  };

  // Système d'alertes intelligentes
  const createSmartAlert = (type, data) => {
    const alert = createNotification(type, {
      ...data,
      smart: true,
      category: 'smart_alert'
    });

    // Actions automatiques selon le type
    switch (type) {
      case 'LOW_STOCK':
        alert.actions = [
          {
            id: 'reorder',
            label: 'Commander',
            handler: (data) => {
              console.log('Commande automatique pour:', data.productId);
              // Logique de commande automatique
            },
            markAsRead: true
          },
          {
            id: 'ignore',
            label: 'Ignorer',
            handler: () => {},
            markAsRead: true
          }
        ];
        break;

      case 'FRAUD_DETECTED':
        alert.actions = [
          {
            id: 'block',
            label: 'Bloquer',
            handler: (data) => {
              console.log('Blocage automatique pour:', data.userId);
              // Logique de blocage
            },
            markAsRead: true
          },
          {
            id: 'investigate',
            label: 'Investiguer',
            handler: (data) => {
              console.log('Investigation pour:', data.userId);
              // Logique d'investigation
            },
            markAsRead: false
          }
        ];
        break;
    }

    return alert;
  };

  // Surveillance en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      // Vérifier les stocks faibles
      if (settings.lowStock) {
        // Simulation de vérification de stock
        const lowStockItems = []; // Récupérer depuis l'inventaire
        lowStockItems.forEach(item => {
          createSmartAlert('LOW_STOCK', {
            productId: item.id,
            productName: item.name,
            currentStock: item.currentStock,
            minStock: item.minStock,
            message: `Stock faible pour ${item.name}: ${item.currentStock} unités restantes`
          });
        });
      }

      // Vérifier les ruptures de stock
      if (settings.outOfStock) {
        const outOfStockItems = []; // Récupérer depuis l'inventaire
        outOfStockItems.forEach(item => {
          createSmartAlert('OUT_OF_STOCK', {
            productId: item.id,
            productName: item.name,
            message: `Rupture de stock pour ${item.name}`
          });
        });
      }
    }, 60000); // Vérification toutes les minutes

    return () => clearInterval(interval);
  }, [settings]);

  // Charger les paramètres sauvegardés
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const value = {
    notifications,
    unreadCount,
    settings,
    notificationTypes,
    createNotification,
    createSmartAlert,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getFilteredNotifications,
    updateSettings,
    executeAction
  };

  return (
    <NotificationSystemContext.Provider value={value}>
      {children}
    </NotificationSystemContext.Provider>
  );
};