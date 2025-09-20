import React from 'react';
import { useStock } from '../contexts/StockContext';
import StockNotification from './StockNotification';

const NotificationManager = () => {
  const { notifications, removeNotification } = useStock();

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <StockNotification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationManager;

