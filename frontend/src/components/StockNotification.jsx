import React, { useState, useEffect } from 'react';

const StockNotification = ({ message, type, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return '📦';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'error':
        return 'bg-danger';
      case 'info':
        return 'bg-info';
      default:
        return 'bg-primary';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-white';
      case 'warning':
        return 'text-dark';
      case 'error':
        return 'text-white';
      case 'info':
        return 'text-white';
      default:
        return 'text-white';
    }
  };

  return (
    <div 
      className={`alert ${getBgColor()} ${getTextColor()} alert-dismissible fade ${isLeaving ? 'fade-out' : 'fade-in'} position-fixed`}
      style={{
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '320px',
        maxWidth: '400px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        border: 'none',
        borderRadius: '12px',
        transform: isLeaving ? 'translateX(100%)' : 'translateX(0)',
        transition: 'all 0.3s ease-in-out',
        opacity: isLeaving ? 0 : 1
      }}
      role="alert"
    >
      <div className="d-flex align-items-start">
        <span className="me-3" style={{ fontSize: '20px', marginTop: '2px' }}>
          {getIcon()}
        </span>
        <div className="flex-grow-1">
          <div className="fw-bold mb-1" style={{ fontSize: '16px' }}>
            {type === 'success' ? 'Succès' : 
             type === 'warning' ? 'Attention' : 
             type === 'error' ? 'Erreur' : 'Information'}
          </div>
          <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
            {message}
          </div>
        </div>
        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={handleClose}
          aria-label="Close"
          style={{ marginTop: '-5px' }}
        ></button>
      </div>
    </div>
  );
};

export default StockNotification;
