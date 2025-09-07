// src/components/RealtimeMetrics.jsx
import React, { useState, useEffect } from 'react';
import { useRealtime } from '../contexts/RealtimeContext';
import { useThemeColors } from '../contexts/ThemeContext';
import { 
  BiTrendingUp, 
  BiTrendingDown, 
  BiRefresh,
  BiWifi,
  BiWifiOff,
  BiTime,
  BiUser,
  BiShoppingBag,
  BiDollar,
  BiBullseye
} from 'react-icons/bi';

const RealtimeMetrics = ({ compact = false }) => {
  const { 
    isConnected, 
    connectionStatus, 
    lastUpdate, 
    metrics, 
    realtimeData, 
    refreshData 
  } = useRealtime();
  const colors = useThemeColors();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatTime = (date) => {
    if (!date) return 'Jamais';
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return colors.success;
      case 'connecting': return colors.warning;
      case 'disconnected': return colors.danger;
      default: return colors.textSecondary;
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <BiWifi size={16} />;
      case 'connecting': return <BiTime size={16} />;
      case 'disconnected': return <BiWifiOff size={16} />;
      default: return <BiWifiOff size={16} />;
    }
  };

  const metricsData = [
    {
      label: 'Commandes',
      value: metrics.orders,
      icon: BiShoppingBag,
      color: colors.primary,
      trend: '+12%',
      trendUp: true
    },
    {
      label: 'Revenus',
      value: `€${metrics.revenue.toLocaleString()}`,
      icon: BiDollar,
      color: colors.success,
      trend: '+8%',
      trendUp: true
    },
    {
      label: 'Visiteurs',
      value: metrics.visitors,
      icon: BiUser,
      color: colors.info,
      trend: '+15%',
      trendUp: true
    },
    {
      label: 'Conversions',
      value: metrics.conversions,
      icon: BiBullseye,
      color: colors.warning,
      trend: '+5%',
      trendUp: true
    }
  ];

  if (compact) {
    return (
      <div className="d-flex align-items-center gap-3">
        {/* Statut de connexion */}
        <div className="d-flex align-items-center gap-2">
          <span style={{ color: getConnectionStatusColor() }}>
            {getConnectionIcon()}
          </span>
          <small style={{ color: colors.textSecondary }}>
            {connectionStatus === 'connected' ? 'En ligne' : 'Hors ligne'}
          </small>
        </div>

        {/* Dernière mise à jour */}
        <div className="d-flex align-items-center gap-2">
          <BiTime size={14} style={{ color: colors.textSecondary }} />
          <small style={{ color: colors.textSecondary }}>
            {formatTime(lastUpdate)}
          </small>
        </div>

        {/* Bouton de rafraîchissement */}
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: 'transparent'
          }}
        >
          <BiRefresh 
            size={14} 
            className={isRefreshing ? 'spinning' : ''}
            style={{ 
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
            }}
          />
        </button>
      </div>
    );
  }

  return (
    <div 
      className="card border-0 shadow-sm"
      style={{ 
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`
      }}
    >
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0" style={{ color: colors.text }}>
          Métriques en temps réel
        </h6>
        <div className="d-flex align-items-center gap-2">
          <span 
            className="badge"
            style={{ 
              backgroundColor: getConnectionStatusColor(),
              color: 'white'
            }}
          >
            {getConnectionIcon()}
            <span className="ms-1">
              {connectionStatus === 'connected' ? 'En ligne' : 'Hors ligne'}
            </span>
          </span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: 'transparent'
            }}
          >
            <BiRefresh 
              size={14} 
              className={isRefreshing ? 'spinning' : ''}
              style={{ 
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
              }}
            />
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Métriques principales */}
        <div className="row g-3 mb-4">
          {metricsData.map((metric, index) => (
            <div key={index} className="col-6 col-md-3">
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: `${metric.color}20`,
                    color: metric.color
                  }}
                >
                  <metric.icon size={20} />
                </div>
                <div>
                  <div 
                    className="fw-bold"
                    style={{ 
                      color: colors.text,
                      fontSize: '1.2rem'
                    }}
                  >
                    {metric.value}
                  </div>
                  <div 
                    className="small"
                    style={{ color: colors.textSecondary }}
                  >
                    {metric.label}
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    {metric.trendUp ? (
                      <BiTrendingUp size={12} style={{ color: colors.success }} />
                    ) : (
                      <BiTrendingDown size={12} style={{ color: colors.danger }} />
                    )}
                    <small 
                      style={{ 
                        color: metric.trendUp ? colors.success : colors.danger,
                        fontWeight: '500'
                      }}
                    >
                      {metric.trend}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Utilisateurs actifs */}
        <div className="row">
          <div className="col-12">
            <div 
              className="d-flex justify-content-between align-items-center p-3 rounded"
              style={{ backgroundColor: colors.surface }}
            >
              <div className="d-flex align-items-center gap-2">
                <BiUser size={20} style={{ color: colors.primary }} />
                <span style={{ color: colors.text, fontWeight: '500' }}>
                  Utilisateurs actifs
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div 
                  className="rounded-circle"
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: colors.success,
                    animation: 'pulse 2s infinite'
                  }}
                />
                <span 
                  className="fw-bold"
                  style={{ color: colors.text, fontSize: '1.1rem' }}
                >
                  {realtimeData.activeUsers}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dernière mise à jour */}
        <div className="text-center mt-3">
          <small style={{ color: colors.textSecondary }}>
            Dernière mise à jour : {formatTime(lastUpdate)}
          </small>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RealtimeMetrics;
import React, { useState, useEffect } from 'react';
import { useRealtime } from '../contexts/RealtimeContext';
import { useThemeColors } from '../contexts/ThemeContext';
import { 
  BiTrendingUp, 
  BiTrendingDown, 
  BiRefresh,
  BiWifi,
  BiWifiOff,
  BiTime,
  BiUser,
  BiShoppingBag,
  BiDollar,
  BiBullseye
} from 'react-icons/bi';

const RealtimeMetrics = ({ compact = false }) => {
  const { 
    isConnected, 
    connectionStatus, 
    lastUpdate, 
    metrics, 
    realtimeData, 
    refreshData 
  } = useRealtime();
  const colors = useThemeColors();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatTime = (date) => {
    if (!date) return 'Jamais';
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return colors.success;
      case 'connecting': return colors.warning;
      case 'disconnected': return colors.danger;
      default: return colors.textSecondary;
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <BiWifi size={16} />;
      case 'connecting': return <BiTime size={16} />;
      case 'disconnected': return <BiWifiOff size={16} />;
      default: return <BiWifiOff size={16} />;
    }
  };

  const metricsData = [
    {
      label: 'Commandes',
      value: metrics.orders,
      icon: BiShoppingBag,
      color: colors.primary,
      trend: '+12%',
      trendUp: true
    },
    {
      label: 'Revenus',
      value: `€${metrics.revenue.toLocaleString()}`,
      icon: BiDollar,
      color: colors.success,
      trend: '+8%',
      trendUp: true
    },
    {
      label: 'Visiteurs',
      value: metrics.visitors,
      icon: BiUser,
      color: colors.info,
      trend: '+15%',
      trendUp: true
    },
    {
      label: 'Conversions',
      value: metrics.conversions,
      icon: BiBullseye,
      color: colors.warning,
      trend: '+5%',
      trendUp: true
    }
  ];

  if (compact) {
    return (
      <div className="d-flex align-items-center gap-3">
        {/* Statut de connexion */}
        <div className="d-flex align-items-center gap-2">
          <span style={{ color: getConnectionStatusColor() }}>
            {getConnectionIcon()}
          </span>
          <small style={{ color: colors.textSecondary }}>
            {connectionStatus === 'connected' ? 'En ligne' : 'Hors ligne'}
          </small>
        </div>

        {/* Dernière mise à jour */}
        <div className="d-flex align-items-center gap-2">
          <BiTime size={14} style={{ color: colors.textSecondary }} />
          <small style={{ color: colors.textSecondary }}>
            {formatTime(lastUpdate)}
          </small>
        </div>

        {/* Bouton de rafraîchissement */}
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: 'transparent'
          }}
        >
          <BiRefresh 
            size={14} 
            className={isRefreshing ? 'spinning' : ''}
            style={{ 
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
            }}
          />
        </button>
      </div>
    );
  }

  return (
    <div 
      className="card border-0 shadow-sm"
      style={{ 
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`
      }}
    >
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0" style={{ color: colors.text }}>
          Métriques en temps réel
        </h6>
        <div className="d-flex align-items-center gap-2">
          <span 
            className="badge"
            style={{ 
              backgroundColor: getConnectionStatusColor(),
              color: 'white'
            }}
          >
            {getConnectionIcon()}
            <span className="ms-1">
              {connectionStatus === 'connected' ? 'En ligne' : 'Hors ligne'}
            </span>
          </span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: 'transparent'
            }}
          >
            <BiRefresh 
              size={14} 
              className={isRefreshing ? 'spinning' : ''}
              style={{ 
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
              }}
            />
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Métriques principales */}
        <div className="row g-3 mb-4">
          {metricsData.map((metric, index) => (
            <div key={index} className="col-6 col-md-3">
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: `${metric.color}20`,
                    color: metric.color
                  }}
                >
                  <metric.icon size={20} />
                </div>
                <div>
                  <div 
                    className="fw-bold"
                    style={{ 
                      color: colors.text,
                      fontSize: '1.2rem'
                    }}
                  >
                    {metric.value}
                  </div>
                  <div 
                    className="small"
                    style={{ color: colors.textSecondary }}
                  >
                    {metric.label}
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    {metric.trendUp ? (
                      <BiTrendingUp size={12} style={{ color: colors.success }} />
                    ) : (
                      <BiTrendingDown size={12} style={{ color: colors.danger }} />
                    )}
                    <small 
                      style={{ 
                        color: metric.trendUp ? colors.success : colors.danger,
                        fontWeight: '500'
                      }}
                    >
                      {metric.trend}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Utilisateurs actifs */}
        <div className="row">
          <div className="col-12">
            <div 
              className="d-flex justify-content-between align-items-center p-3 rounded"
              style={{ backgroundColor: colors.surface }}
            >
              <div className="d-flex align-items-center gap-2">
                <BiUser size={20} style={{ color: colors.primary }} />
                <span style={{ color: colors.text, fontWeight: '500' }}>
                  Utilisateurs actifs
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div 
                  className="rounded-circle"
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: colors.success,
                    animation: 'pulse 2s infinite'
                  }}
                />
                <span 
                  className="fw-bold"
                  style={{ color: colors.text, fontSize: '1.1rem' }}
                >
                  {realtimeData.activeUsers}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dernière mise à jour */}
        <div className="text-center mt-3">
          <small style={{ color: colors.textSecondary }}>
            Dernière mise à jour : {formatTime(lastUpdate)}
          </small>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        
        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RealtimeMetrics;
 
 
 
 
 
 
 
 
 