// src/components/PerformanceMetrics.jsx
import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../contexts/ThemeContext';
import { 
  BiTrendingUp, 
  BiTrendingDown, 
  BiBullseye,
  BiTime,
  BiDollar,
  BiUser,
  BiShoppingBag,
  BiStar,
  BiRefresh,
  BiDownload,
  BiFilter
} from 'react-icons/bi';

const PerformanceMetrics = ({ period = '7j' }) => {
  const colors = useThemeColors();
  const [metrics, setMetrics] = useState({
    conversionRate: 0,
    averageOrderValue: 0,
    customerLifetimeValue: 0,
    cartAbandonmentRate: 0,
    returnCustomerRate: 0,
    inventoryTurnover: 0,
    profitMargin: 0,
    revenuePerVisitor: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('conversionRate');

  useEffect(() => {
    // Simuler le chargement des données
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setMetrics({
        conversionRate: 3.2,
        averageOrderValue: 89.50,
        customerLifetimeValue: 245.80,
        cartAbandonmentRate: 68.5,
        returnCustomerRate: 42.3,
        inventoryTurnover: 4.2,
        profitMargin: 28.7,
        revenuePerVisitor: 2.85
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [period]);

  const performanceData = [
    {
      key: 'conversionRate',
      title: 'Taux de conversion',
      value: `${metrics.conversionRate}%`,
      change: '+0.3%',
      trend: 'up',
      icon: BiBullseye,
      color: 'success',
      description: 'Pourcentage de visiteurs qui effectuent un achat',
      target: 5.0,
      current: metrics.conversionRate
    },
    {
      key: 'averageOrderValue',
      title: 'Panier moyen',
      value: `€${metrics.averageOrderValue}`,
      change: '+€5.20',
      trend: 'up',
      icon: BiDollar,
      color: 'primary',
      description: 'Montant moyen par commande',
      target: 100.0,
      current: metrics.averageOrderValue
    },
    {
      key: 'customerLifetimeValue',
      title: 'Valeur vie client',
      value: `€${metrics.customerLifetimeValue}`,
      change: '+€12.40',
      trend: 'up',
      icon: BiUser,
      color: 'info',
      description: 'Valeur totale d\'un client sur sa durée de vie',
      target: 300.0,
      current: metrics.customerLifetimeValue
    },
    {
      key: 'cartAbandonmentRate',
      title: 'Taux d\'abandon panier',
      value: `${metrics.cartAbandonmentRate}%`,
      change: '-2.1%',
      trend: 'down',
      icon: BiShoppingBag,
      color: 'warning',
      description: 'Pourcentage de paniers abandonnés',
      target: 60.0,
      current: metrics.cartAbandonmentRate
    },
    {
      key: 'returnCustomerRate',
      title: 'Taux de clients récurrents',
      value: `${metrics.returnCustomerRate}%`,
      change: '+3.2%',
      trend: 'up',
      icon: BiStar,
      color: 'success',
      description: 'Pourcentage de clients qui reviennent',
      target: 50.0,
      current: metrics.returnCustomerRate
    },
    {
      key: 'inventoryTurnover',
      title: 'Rotation des stocks',
      value: `${metrics.inventoryTurnover}x`,
      change: '+0.3x',
      trend: 'up',
      icon: BiRefresh,
      color: 'info',
      description: 'Nombre de fois que le stock est renouvelé',
      target: 6.0,
      current: metrics.inventoryTurnover
    },
    {
      key: 'profitMargin',
      title: 'Marge bénéficiaire',
      value: `${metrics.profitMargin}%`,
      change: '+1.2%',
      trend: 'up',
      icon: BiTrendingUp,
      color: 'success',
      description: 'Pourcentage de profit sur les ventes',
      target: 35.0,
      current: metrics.profitMargin
    },
    {
      key: 'revenuePerVisitor',
      title: 'Revenus par visiteur',
      value: `€${metrics.revenuePerVisitor}`,
      change: '+€0.15',
      trend: 'up',
      icon: BiBullseye,
      color: 'primary',
      description: 'Revenus générés par visiteur unique',
      target: 4.0,
      current: metrics.revenuePerVisitor
    }
  ];

  const getColorValue = (color) => {
    const colorMap = {
      success: colors.success,
      primary: colors.primary,
      info: colors.info,
      warning: colors.warning,
      danger: colors.danger
    };
    return colorMap[color] || colors.primary;
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const exportMetrics = () => {
    const csvContent = [
      ['Métrique', 'Valeur actuelle', 'Changement', 'Objectif', 'Progression'],
      ...performanceData.map(metric => [
        metric.title,
        metric.value,
        metric.change,
        metric.target,
        `${getProgressPercentage(metric.current, metric.target).toFixed(1)}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance_metrics_${period}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div 
        className="card border-0 shadow-sm"
        style={{ 
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`
        }}
      >
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3 mb-0" style={{ color: colors.textSecondary }}>
            Chargement des métriques de performance...
          </p>
        </div>
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
        <h5 className="mb-0" style={{ color: colors.text }}>
          <BiBullseye className="me-2" />
          Métriques de Performance
        </h5>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            style={{
              backgroundColor: colors.input,
              borderColor: colors.border,
              color: colors.text,
              width: 'auto'
            }}
          >
            <option value="">Toutes les métriques</option>
            {performanceData.map(metric => (
              <option key={metric.key} value={metric.key}>
                {metric.title}
              </option>
            ))}
          </select>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={exportMetrics}
            style={{
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: 'transparent'
            }}
          >
            <BiDownload className="me-1" />
            Exporter
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="row g-3">
          {performanceData
            .filter(metric => !selectedMetric || metric.key === selectedMetric)
            .map((metric, index) => (
            <div key={metric.key} className="col-lg-6 col-xl-4">
              <div 
                className="p-3 rounded"
                style={{ 
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.hover;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${colors.shadow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.surface;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: `${getColorValue(metric.color)}20`,
                      color: getColorValue(metric.color)
                    }}
                  >
                    <metric.icon size={20} />
                  </div>
                  <div className="text-end">
                    <div 
                      className="fw-bold"
                      style={{ 
                        color: colors.text,
                        fontSize: '1.2rem'
                      }}
                    >
                      {metric.value}
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      {metric.trend === 'up' ? (
                        <BiTrendingUp size={14} style={{ color: colors.success }} />
                      ) : (
                        <BiTrendingDown size={14} style={{ color: colors.danger }} />
                      )}
                      <small 
                        style={{ 
                          color: metric.trend === 'up' ? colors.success : colors.danger,
                          fontWeight: '500'
                        }}
                      >
                        {metric.change}
                      </small>
                    </div>
                  </div>
                </div>

                <h6 
                  className="mb-2"
                  style={{ 
                    color: colors.text,
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  {metric.title}
                </h6>

                <p 
                  className="small mb-3"
                  style={{ 
                    color: colors.textSecondary,
                    fontSize: '0.8rem',
                    lineHeight: '1.4'
                  }}
                >
                  {metric.description}
                </p>

                {/* Barre de progression vers l'objectif */}
                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small style={{ color: colors.textSecondary }}>
                      Progression vers l'objectif
                    </small>
                    <small 
                      style={{ 
                        color: colors.textSecondary,
                        fontWeight: '500'
                      }}
                    >
                      {getProgressPercentage(metric.current, metric.target).toFixed(1)}%
                    </small>
                  </div>
                  <div 
                    className="progress"
                    style={{ height: '6px' }}
                  >
                    <div 
                      className="progress-bar"
                      style={{
                        width: `${getProgressPercentage(metric.current, metric.target)}%`,
                        backgroundColor: getColorValue(metric.color),
                        transition: 'width 0.6s ease'
                      }}
                    />
                  </div>
                  <div className="d-flex justify-content-between mt-1">
                    <small style={{ color: colors.textSecondary }}>
                      Actuel: {metric.value}
                    </small>
                    <small style={{ color: colors.textSecondary }}>
                      Objectif: {metric.target}{metric.value.includes('€') ? '€' : metric.value.includes('%') ? '%' : 'x'}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé des performances */}
        <div className="mt-4 p-3 rounded" style={{ backgroundColor: colors.surface }}>
          <h6 className="mb-3" style={{ color: colors.text }}>
            <BiFilter className="me-2" />
            Résumé des performances
          </h6>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="text-center">
                <div 
                  className="fw-bold"
                  style={{ 
                    color: colors.success,
                    fontSize: '1.5rem'
                  }}
                >
                  {performanceData.filter(m => m.trend === 'up').length}
                </div>
                <small style={{ color: colors.textSecondary }}>
                  Métriques en progression
                </small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div 
                  className="fw-bold"
                  style={{ 
                    color: colors.primary,
                    fontSize: '1.5rem'
                  }}
                >
                  {performanceData.filter(m => getProgressPercentage(m.current, m.target) >= 80).length}
                </div>
                <small style={{ color: colors.textSecondary }}>
                  Objectifs atteints (≥80%)
                </small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div 
                  className="fw-bold"
                  style={{ 
                    color: colors.warning,
                    fontSize: '1.5rem'
                  }}
                >
                  {performanceData.filter(m => getProgressPercentage(m.current, m.target) < 50).length}
                </div>
                <small style={{ color: colors.textSecondary }}>
                  Nécessitent attention
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../contexts/ThemeContext';
import { 
  BiTrendingUp, 
  BiTrendingDown, 
  BiBullseye,
  BiTime,
  BiDollar,
  BiUser,
  BiShoppingBag,
  BiStar,
  BiRefresh,
  BiDownload,
  BiFilter
} from 'react-icons/bi';

const PerformanceMetrics = ({ period = '7j' }) => {
  const colors = useThemeColors();
  const [metrics, setMetrics] = useState({
    conversionRate: 0,
    averageOrderValue: 0,
    customerLifetimeValue: 0,
    cartAbandonmentRate: 0,
    returnCustomerRate: 0,
    inventoryTurnover: 0,
    profitMargin: 0,
    revenuePerVisitor: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('conversionRate');

  useEffect(() => {
    // Simuler le chargement des données
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setMetrics({
        conversionRate: 3.2,
        averageOrderValue: 89.50,
        customerLifetimeValue: 245.80,
        cartAbandonmentRate: 68.5,
        returnCustomerRate: 42.3,
        inventoryTurnover: 4.2,
        profitMargin: 28.7,
        revenuePerVisitor: 2.85
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [period]);

  const performanceData = [
    {
      key: 'conversionRate',
      title: 'Taux de conversion',
      value: `${metrics.conversionRate}%`,
      change: '+0.3%',
      trend: 'up',
      icon: BiBullseye,
      color: 'success',
      description: 'Pourcentage de visiteurs qui effectuent un achat',
      target: 5.0,
      current: metrics.conversionRate
    },
    {
      key: 'averageOrderValue',
      title: 'Panier moyen',
      value: `€${metrics.averageOrderValue}`,
      change: '+€5.20',
      trend: 'up',
      icon: BiDollar,
      color: 'primary',
      description: 'Montant moyen par commande',
      target: 100.0,
      current: metrics.averageOrderValue
    },
    {
      key: 'customerLifetimeValue',
      title: 'Valeur vie client',
      value: `€${metrics.customerLifetimeValue}`,
      change: '+€12.40',
      trend: 'up',
      icon: BiUser,
      color: 'info',
      description: 'Valeur totale d\'un client sur sa durée de vie',
      target: 300.0,
      current: metrics.customerLifetimeValue
    },
    {
      key: 'cartAbandonmentRate',
      title: 'Taux d\'abandon panier',
      value: `${metrics.cartAbandonmentRate}%`,
      change: '-2.1%',
      trend: 'down',
      icon: BiShoppingBag,
      color: 'warning',
      description: 'Pourcentage de paniers abandonnés',
      target: 60.0,
      current: metrics.cartAbandonmentRate
    },
    {
      key: 'returnCustomerRate',
      title: 'Taux de clients récurrents',
      value: `${metrics.returnCustomerRate}%`,
      change: '+3.2%',
      trend: 'up',
      icon: BiStar,
      color: 'success',
      description: 'Pourcentage de clients qui reviennent',
      target: 50.0,
      current: metrics.returnCustomerRate
    },
    {
      key: 'inventoryTurnover',
      title: 'Rotation des stocks',
      value: `${metrics.inventoryTurnover}x`,
      change: '+0.3x',
      trend: 'up',
      icon: BiRefresh,
      color: 'info',
      description: 'Nombre de fois que le stock est renouvelé',
      target: 6.0,
      current: metrics.inventoryTurnover
    },
    {
      key: 'profitMargin',
      title: 'Marge bénéficiaire',
      value: `${metrics.profitMargin}%`,
      change: '+1.2%',
      trend: 'up',
      icon: BiTrendingUp,
      color: 'success',
      description: 'Pourcentage de profit sur les ventes',
      target: 35.0,
      current: metrics.profitMargin
    },
    {
      key: 'revenuePerVisitor',
      title: 'Revenus par visiteur',
      value: `€${metrics.revenuePerVisitor}`,
      change: '+€0.15',
      trend: 'up',
      icon: BiBullseye,
      color: 'primary',
      description: 'Revenus générés par visiteur unique',
      target: 4.0,
      current: metrics.revenuePerVisitor
    }
  ];

  const getColorValue = (color) => {
    const colorMap = {
      success: colors.success,
      primary: colors.primary,
      info: colors.info,
      warning: colors.warning,
      danger: colors.danger
    };
    return colorMap[color] || colors.primary;
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const exportMetrics = () => {
    const csvContent = [
      ['Métrique', 'Valeur actuelle', 'Changement', 'Objectif', 'Progression'],
      ...performanceData.map(metric => [
        metric.title,
        metric.value,
        metric.change,
        metric.target,
        `${getProgressPercentage(metric.current, metric.target).toFixed(1)}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance_metrics_${period}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div 
        className="card border-0 shadow-sm"
        style={{ 
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`
        }}
      >
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3 mb-0" style={{ color: colors.textSecondary }}>
            Chargement des métriques de performance...
          </p>
        </div>
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
        <h5 className="mb-0" style={{ color: colors.text }}>
          <BiBullseye className="me-2" />
          Métriques de Performance
        </h5>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            style={{
              backgroundColor: colors.input,
              borderColor: colors.border,
              color: colors.text,
              width: 'auto'
            }}
          >
            <option value="">Toutes les métriques</option>
            {performanceData.map(metric => (
              <option key={metric.key} value={metric.key}>
                {metric.title}
              </option>
            ))}
          </select>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={exportMetrics}
            style={{
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: 'transparent'
            }}
          >
            <BiDownload className="me-1" />
            Exporter
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="row g-3">
          {performanceData
            .filter(metric => !selectedMetric || metric.key === selectedMetric)
            .map((metric, index) => (
            <div key={metric.key} className="col-lg-6 col-xl-4">
              <div 
                className="p-3 rounded"
                style={{ 
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.hover;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${colors.shadow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.surface;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: `${getColorValue(metric.color)}20`,
                      color: getColorValue(metric.color)
                    }}
                  >
                    <metric.icon size={20} />
                  </div>
                  <div className="text-end">
                    <div 
                      className="fw-bold"
                      style={{ 
                        color: colors.text,
                        fontSize: '1.2rem'
                      }}
                    >
                      {metric.value}
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      {metric.trend === 'up' ? (
                        <BiTrendingUp size={14} style={{ color: colors.success }} />
                      ) : (
                        <BiTrendingDown size={14} style={{ color: colors.danger }} />
                      )}
                      <small 
                        style={{ 
                          color: metric.trend === 'up' ? colors.success : colors.danger,
                          fontWeight: '500'
                        }}
                      >
                        {metric.change}
                      </small>
                    </div>
                  </div>
                </div>

                <h6 
                  className="mb-2"
                  style={{ 
                    color: colors.text,
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  {metric.title}
                </h6>

                <p 
                  className="small mb-3"
                  style={{ 
                    color: colors.textSecondary,
                    fontSize: '0.8rem',
                    lineHeight: '1.4'
                  }}
                >
                  {metric.description}
                </p>

                {/* Barre de progression vers l'objectif */}
                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small style={{ color: colors.textSecondary }}>
                      Progression vers l'objectif
                    </small>
                    <small 
                      style={{ 
                        color: colors.textSecondary,
                        fontWeight: '500'
                      }}
                    >
                      {getProgressPercentage(metric.current, metric.target).toFixed(1)}%
                    </small>
                  </div>
                  <div 
                    className="progress"
                    style={{ height: '6px' }}
                  >
                    <div 
                      className="progress-bar"
                      style={{
                        width: `${getProgressPercentage(metric.current, metric.target)}%`,
                        backgroundColor: getColorValue(metric.color),
                        transition: 'width 0.6s ease'
                      }}
                    />
                  </div>
                  <div className="d-flex justify-content-between mt-1">
                    <small style={{ color: colors.textSecondary }}>
                      Actuel: {metric.value}
                    </small>
                    <small style={{ color: colors.textSecondary }}>
                      Objectif: {metric.target}{metric.value.includes('€') ? '€' : metric.value.includes('%') ? '%' : 'x'}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé des performances */}
        <div className="mt-4 p-3 rounded" style={{ backgroundColor: colors.surface }}>
          <h6 className="mb-3" style={{ color: colors.text }}>
            <BiFilter className="me-2" />
            Résumé des performances
          </h6>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="text-center">
                <div 
                  className="fw-bold"
                  style={{ 
                    color: colors.success,
                    fontSize: '1.5rem'
                  }}
                >
                  {performanceData.filter(m => m.trend === 'up').length}
                </div>
                <small style={{ color: colors.textSecondary }}>
                  Métriques en progression
                </small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div 
                  className="fw-bold"
                  style={{ 
                    color: colors.primary,
                    fontSize: '1.5rem'
                  }}
                >
                  {performanceData.filter(m => getProgressPercentage(m.current, m.target) >= 80).length}
                </div>
                <small style={{ color: colors.textSecondary }}>
                  Objectifs atteints (≥80%)
                </small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div 
                  className="fw-bold"
                  style={{ 
                    color: colors.warning,
                    fontSize: '1.5rem'
                  }}
                >
                  {performanceData.filter(m => getProgressPercentage(m.current, m.target) < 50).length}
                </div>
                <small style={{ color: colors.textSecondary }}>
                  Nécessitent attention
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
 
 
 
 
 
 
 
 
 