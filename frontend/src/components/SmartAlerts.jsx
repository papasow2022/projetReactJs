// src/components/SmartAlerts.jsx
import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../contexts/ThemeContext';
import { 
  BiBell, 
  BiX, 
  BiCheck, 
  BiError, 
  BiInfoCircle, 
  BiShield, 
  BiTrendingUp,
  BiTrendingDown,
  BiTime,
  BiDollar,
  BiPackage,
  BiUser,
  BiStar
} from 'react-icons/bi';

const SmartAlerts = () => {
  const colors = useThemeColors();
  const [alerts, setAlerts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simuler des alertes intelligentes
    const mockAlerts = [
      {
        id: 1,
        type: 'success',
        priority: 'high',
        title: 'Commande importante reçue',
        message: 'Nouvelle commande de €450 - Client VIP',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        icon: BiDollar,
        action: 'Voir la commande',
        read: false,
        category: 'orders'
      },
      {
        id: 2,
        type: 'warning',
        priority: 'medium',
        title: 'Stock faible détecté',
        message: 'Nike Air Max - Seulement 3 unités restantes',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        icon: BiPackage,
        action: 'Réapprovisionner',
        read: false,
        category: 'inventory'
      },
      {
        id: 3,
        type: 'info',
        priority: 'low',
        title: 'Nouveau client inscrit',
        message: 'Marie Dupont s\'est inscrite sur votre boutique',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        icon: BiUser,
        action: 'Voir le profil',
        read: true,
        category: 'customers'
      },
      {
        id: 4,
        type: 'danger',
        priority: 'high',
        title: 'Paiement en échec',
        message: 'Commande #ORD-2024-001 - Paiement refusé',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        icon: BiError,
        action: 'Contacter le client',
        read: false,
        category: 'payments'
      },
      {
        id: 5,
        type: 'success',
        priority: 'medium',
        title: 'Avis 5 étoiles reçu',
        message: 'Excellent service ! - Client satisfait',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        icon: BiStar,
        action: 'Répondre',
        read: true,
        category: 'reviews'
      },
      {
        id: 6,
        type: 'info',
        priority: 'low',
        title: 'Tendance positive détectée',
        message: 'Ventes en hausse de 15% cette semaine',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: BiTrendingUp,
        action: 'Voir les analytics',
        read: true,
        category: 'analytics'
      }
    ];

    setAlerts(mockAlerts);
    setUnreadCount(mockAlerts.filter(alert => !alert.read).length);
  }, []);

  const getAlertIcon = (type) => {
    const iconMap = {
      success: BiCheck,
      warning: BiError,
      info: BiInfoCircle,
      danger: BiShield
    };
    return iconMap[type] || BiInfoCircle;
  };

  const getAlertColor = (type) => {
    const colorMap = {
      success: colors.success,
      warning: colors.warning,
      info: colors.info,
      danger: colors.danger
    };
    return colorMap[type] || colors.info;
  };

  const getPriorityColor = (priority) => {
    const priorityMap = {
      high: colors.danger,
      medium: colors.warning,
      low: colors.info
    };
    return priorityMap[priority] || colors.info;
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  const markAsRead = (alertId) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setAlerts(prev => 
      prev.map(alert => ({ ...alert, read: true }))
    );
    setUnreadCount(0);
  };

  const deleteAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getFilteredAlerts = () => {
    return alerts.sort((a, b) => {
      // Priorité d'abord, puis timestamp
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.timestamp - a.timestamp;
    });
  };

  return (
    <div className="position-relative">
      {/* Bouton de notification */}
      <button
        className="btn btn-outline-secondary position-relative"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          borderColor: colors.border,
          color: colors.text,
          backgroundColor: 'transparent'
        }}
      >
        <BiBell size={20} />
        {unreadCount > 0 && (
          <span 
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
            style={{
              backgroundColor: colors.danger,
              fontSize: '0.7rem',
              minWidth: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel des alertes */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 1040 }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div
            className="position-absolute end-0 mt-2"
            style={{
              width: '400px',
              maxHeight: '500px',
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              boxShadow: `0 4px 12px ${colors.shadow}`,
              zIndex: 1050,
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div 
              className="d-flex justify-content-between align-items-center p-3"
              style={{
                borderBottom: `1px solid ${colors.border}`,
                backgroundColor: colors.surface
              }}
            >
              <h6 className="mb-0" style={{ color: colors.text }}>
                Alertes intelligentes
              </h6>
              <div className="d-flex gap-2">
                {unreadCount > 0 && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={markAllAsRead}
                    style={{
                      borderColor: colors.primary,
                      color: colors.primary,
                      backgroundColor: 'transparent',
                      fontSize: '0.8rem'
                    }}
                  >
                    Tout marquer comme lu
                  </button>
                )}
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setIsOpen(false)}
                  style={{
                    borderColor: colors.border,
                    color: colors.text,
                    backgroundColor: 'transparent'
                  }}
                >
                  <BiX size={16} />
                </button>
              </div>
            </div>

            {/* Liste des alertes */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {getFilteredAlerts().length === 0 ? (
                <div className="text-center p-4">
                  <BiBell size={48} style={{ color: colors.textSecondary }} />
                  <p className="mt-2 mb-0" style={{ color: colors.textSecondary }}>
                    Aucune alerte
                  </p>
                </div>
              ) : (
                getFilteredAlerts().map(alert => {
                  const AlertIcon = getAlertIcon(alert.type);
                  const alertColor = getAlertColor(alert.type);
                  const priorityColor = getPriorityColor(alert.priority);

                  return (
                    <div
                      key={alert.id}
                      className={`p-3 border-bottom ${!alert.read ? 'fw-bold' : ''}`}
                      style={{
                        borderBottomColor: colors.border,
                        backgroundColor: !alert.read ? `${alertColor}10` : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.hover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = !alert.read ? `${alertColor}10` : 'transparent';
                      }}
                      onClick={() => markAsRead(alert.id)}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: `${alertColor}20`,
                            color: alertColor
                          }}
                        >
                          <AlertIcon size={16} />
                        </div>
                        
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 
                              className="mb-0"
                              style={{ 
                                color: colors.text,
                                fontSize: '0.9rem'
                              }}
                            >
                              {typeof alert.title === 'string' ? alert.title : JSON.stringify(alert.title)}
                            </h6>
                            <div className="d-flex align-items-center gap-1">
                              <span 
                                className="badge"
                                style={{
                                  backgroundColor: priorityColor,
                                  fontSize: '0.6rem',
                                  padding: '2px 6px'
                                }}
                              >
                                {alert.priority}
                              </span>
                              <button
                                className="btn btn-sm p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteAlert(alert.id);
                                }}
                                style={{
                                  color: colors.textSecondary,
                                  backgroundColor: 'transparent',
                                  border: 'none'
                                }}
                              >
                                <BiX size={14} />
                              </button>
                            </div>
                          </div>
                          
                          <p 
                            className="mb-2"
                            style={{ 
                              color: colors.textSecondary,
                              fontSize: '0.8rem',
                              lineHeight: '1.4'
                            }}
                          >
                            {typeof alert.message === 'string' ? alert.message : JSON.stringify(alert.message)}
                          </p>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <small style={{ color: colors.textSecondary }}>
                              <BiTime className="me-1" />
                              {formatTimestamp(alert.timestamp)}
                            </small>
                            
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Action spécifique à l'alerte
                                console.log('Action:', alert.action);
                              }}
                              style={{
                                borderColor: colors.primary,
                                color: colors.primary,
                                backgroundColor: 'transparent',
                                fontSize: '0.7rem',
                                padding: '2px 8px'
                              }}
                            >
                              {alert.action}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div 
              className="p-3 text-center"
              style={{
                borderTop: `1px solid ${colors.border}`,
                backgroundColor: colors.surface
              }}
            >
              <a 
                href="#all-alerts" 
                className="text-decoration-none"
                style={{ color: colors.primary }}
              >
                Voir toutes les alertes
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SmartAlerts;
 
 
 
 
 
 
 
 
 