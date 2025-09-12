import React, { useState, useEffect, useRef } from 'react';
import { useNotificationSystem } from '../contexts/NotificationSystemContext';
import { 
  BiBell, 
  BiCheckCircle, 
  BiXCircle, 
  BiError, 
  BiInfoCircle,
  BiFilter,
  BiSearch,
  BiCog,
  BiTrash,
  BiRefresh,
  BiDownload
} from 'react-icons/bi';

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    settings,
    notificationTypes,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    getFilteredNotifications,
    updateSettings,
    executeAction
  } = useNotificationSystem();

  const [showCenter, setShowCenter] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const centerRef = useRef(null);
  const [filters, setFilters] = useState({
    type: '',
    priority: '',
    read: undefined,
    category: '',
    dateFrom: '',
    dateTo: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Fermer le centre de notifications en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (centerRef.current && !centerRef.current.contains(event.target)) {
        setShowCenter(false);
      }
    };

    if (showCenter) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCenter]);

  const filteredNotifications = getFilteredNotifications(filters).filter(notif =>
    !searchTerm || 
    notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notif.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'secondary';
      default: return 'light';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'critical': return 'Critique';
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return 'Normale';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}j`;
    return time.toLocaleDateString();
  };

  const exportNotifications = () => {
    const data = filteredNotifications.map(notif => ({
      id: notif.id,
      type: notif.type,
      title: notif.title,
      message: notif.message,
      priority: notif.priority,
      read: notif.read ? 'Oui' : 'Non',
      timestamp: new Date(notif.timestamp).toLocaleString(),
      category: notif.category
    }));

    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notifications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Bouton de notification dans la barre de navigation */}
      <div className="position-relative">
        <button 
          className="btn position-relative"
          onClick={() => setShowCenter(!showCenter)}
          style={{ 
            backgroundColor: 'transparent', 
            border: '1px solid white', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = '#007bff';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = 'white';
          }}
        >
          <BiBell className="me-2" style={{ color: 'white' }} />
          <span style={{ color: 'white' }}>Notifications</span>
          {unreadCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Centre de notifications */}
        {showCenter && (
          <div ref={centerRef} className="position-absolute top-100 end-0 mt-2 bg-white border rounded shadow-lg" 
               style={{ width: '500px', maxHeight: '600px', zIndex: 1050 }}>
            
            {/* Header */}
            <div className="p-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  Centre de notifications
                  {unreadCount > 0 && (
                    <span className="badge bg-primary ms-2">{unreadCount}</span>
                  )}
                </h6>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setShowCenter(false)}
                    title="Fermer"
                  >
                    <BiXCircle />
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setShowSettings(!showSettings)}
                    title="Paramètres"
                  >
                    <BiCog />
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={exportNotifications}
                    title="Exporter"
                  >
                    <BiDownload />
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={clearAllNotifications}
                    title="Tout supprimer"
                  >
                    <BiTrash />
                  </button>
                </div>
              </div>

              {/* Filtres rapides */}
              <div className="mt-3">
                <div className="d-flex gap-2 flex-wrap">
                  <button 
                    className={`btn btn-sm ${filters.read === undefined ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilters({...filters, read: undefined})}
                  >
                    Toutes
                  </button>
                  <button 
                    className={`btn btn-sm ${filters.read === false ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => setFilters({...filters, read: false})}
                  >
                    Non lues ({notifications.filter(n => !n.read).length})
                  </button>
                  <button 
                    className={`btn btn-sm ${filters.priority === 'critical' ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => setFilters({...filters, priority: filters.priority === 'critical' ? '' : 'critical'})}
                  >
                    Critiques
                  </button>
                </div>
              </div>

              {/* Recherche */}
              <div className="mt-3">
                <div className="input-group input-group-sm">
                  <span className="input-group-text">
                    <BiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Liste des notifications */}
            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
              {filteredNotifications.length === 0 ? (
                <div className="p-4 text-center text-muted">
                  <BiBell className="mb-2" style={{ fontSize: '2rem' }} />
                  <p className="mb-0">Aucune notification</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div 
                      key={notification.id}
                      className={`p-3 border-bottom ${!notification.read ? 'bg-light' : ''}`}
                    >
                      <div className="d-flex align-items-start">
                        <div className="flex-shrink-0 me-3">
                          <IconComponent 
                            className={`text-${notification.color}`}
                            style={{ fontSize: '1.2rem' }}
                          />
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="mb-0">{notification.title}</h6>
                            <div className="d-flex gap-1">
                              <span className={`badge bg-${getPriorityColor(notification.priority)}`}>
                                {getPriorityLabel(notification.priority)}
                              </span>
                              <small className="text-muted">
                                {formatTimeAgo(notification.timestamp)}
                              </small>
                            </div>
                          </div>
                          <p className="mb-2 small">{notification.message}</p>
                          
                          {/* Actions */}
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="d-flex gap-2 mb-2">
                              {notification.actions.map((action) => (
                                <button
                                  key={action.id}
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => executeAction(notification.id, action.id)}
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Actions de gestion */}
                          <div className="d-flex gap-2">
                            {!notification.read && (
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <BiCheckCircle className="me-1" />
                                Marquer lu
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeNotification(notification.id)}
                            >
                              <BiXCircle className="me-1" />
                              Supprimer
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
            {notifications.length > 0 && (
              <div className="p-3 border-top bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    {filteredNotifications.length} notification(s)
                  </small>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={markAllAsRead}
                    disabled={notifications.every(n => n.read)}
                  >
                    Tout marquer comme lu
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal des paramètres */}
      {showSettings && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Paramètres de notifications</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowSettings(false)}
                />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <h6>Types de notifications</h6>
                    {Object.entries(notificationTypes).map(([key, type]) => (
                      <div key={key} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`setting_${key}`}
                          checked={settings[key.toLowerCase()] || false}
                          onChange={(e) => updateSettings({ [key.toLowerCase()]: e.target.checked })}
                        />
                        <label className="form-check-label" htmlFor={`setting_${key}`}>
                          <type.icon className={`text-${type.color} me-2`} />
                          {type.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="col-12">
                    <h6>Méthodes de notification</h6>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="email_notifications"
                        checked={settings.email}
                        onChange={(e) => updateSettings({ email: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="email_notifications">
                        Email
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="push_notifications"
                        checked={settings.push}
                        onChange={(e) => updateSettings({ push: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="push_notifications">
                        Notifications push
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="sms_notifications"
                        checked={settings.sms}
                        onChange={(e) => updateSettings({ sms: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="sms_notifications">
                        SMS
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowSettings(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}