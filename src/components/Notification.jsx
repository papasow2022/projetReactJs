import React, { useState, useEffect } from 'react';

const Notification = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose, 
  show = false 
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-exclamation-triangle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'info':
      default:
        return 'bi-info-circle-fill';
    }
  };

  const getAlertClass = () => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-danger';
      case 'warning':
        return 'alert-warning';
      case 'info':
      default:
        return 'alert-info';
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`alert ${getAlertClass()} alert-dismissible fade show position-fixed`}
      style={{
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        borderRadius: '8px'
      }}
      role="alert"
    >
      <div className="d-flex align-items-center">
        <i className={`bi ${getIcon()} me-2`} style={{ fontSize: '18px' }}></i>
        <div className="flex-grow-1">{message}</div>
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
          aria-label="Fermer"
        ></button>
      </div>
    </div>
  );
};

export default Notification; 