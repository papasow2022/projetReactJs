import React, { createContext, useContext, useState } from 'react';
import './NotificationContext.css';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications doit être utilisé dans un NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      message,
      type,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="notification-content">
            <div className="notification-icon">
              {notification.type === 'success' && <i className="bi bi-check-circle-fill"></i>}
              {notification.type === 'error' && <i className="bi bi-x-circle-fill"></i>}
              {notification.type === 'warning' && <i className="bi bi-exclamation-triangle-fill"></i>}
              {notification.type === 'info' && <i className="bi bi-info-circle-fill"></i>}
            </div>
            <div className="notification-message">
              {typeof notification.message === 'string' ? notification.message : JSON.stringify(notification.message)}
            </div>
            <button
              className="notification-close"
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
          <div className="notification-progress"></div>
        </div>
      ))}
    </div>
  );
};

export default NotificationProvider; 