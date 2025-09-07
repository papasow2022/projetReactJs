import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { BiBell, BiCheck, BiX } from 'react-icons/bi';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getTypeClass = (type) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'error': return 'text-danger';
      case 'warning': return 'text-warning';
      default: return 'text-info';
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="position-relative">
      <button 
        className="btn btn-outline-secondary position-relative"
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ border: 'none', background: 'transparent' }}
      >
        <BiBell style={{ fontSize: '1.5rem' }} />
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="position-absolute top-100 end-0 mt-2 bg-white border rounded shadow-lg" style={{ width: '350px', maxHeight: '400px', overflowY: 'auto', zIndex: 1000 }}>
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Notifications</h6>
            <div>
              {unreadCount > 0 && (
                <button 
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={markAllAsRead}
                >
                  <BiCheck /> Tout marquer comme lu
                </button>
              )}
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowDropdown(false)}
              >
                <BiX />
              </button>
            </div>
          </div>

          <div className="p-0">
            {notifications.length === 0 ? (
              <div className="p-3 text-center text-muted">
                Aucune notification
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 border-bottom ${!notification.read ? 'bg-light' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-1">
                        <span className="me-2">{getTypeIcon(notification.type)}</span>
                        <span className={`fw-bold ${getTypeClass(notification.type)}`}>
                          {typeof notification.message === 'string' ? notification.message : JSON.stringify(notification.message)}
                        </span>
                      </div>
                      <small className="text-muted">
                        {new Date(notification.timestamp).toLocaleString('fr-FR')}
                      </small>
                      {notification.data.details && (
                        <div className="mt-1 small text-muted">
                          {typeof notification.data.details === 'string' ? notification.data.details : JSON.stringify(notification.data.details)}
                        </div>
                      )}
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                    >
                      <BiX />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Overlay pour fermer le dropdown en cliquant ailleurs */}
      {showDropdown && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 999 }}
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell; 