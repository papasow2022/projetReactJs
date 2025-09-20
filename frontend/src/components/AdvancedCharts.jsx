import React from 'react';
import { useThemeColors } from '../contexts/ThemeContext';

// Composant MetricCard pour afficher les métriques
export const MetricCard = ({ title, value, change, icon: Icon, color = 'primary' }) => {
  const colors = useThemeColors();
  
  return (
    <div 
      className="card h-100"
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px'
      }}
    >
      <div className="card-body d-flex align-items-center">
        <div 
          className="rounded-circle d-flex align-items-center justify-content-center me-3"
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: colors.primary + '20',
            color: colors.primary
          }}
        >
          {Icon && <Icon size={24} />}
        </div>
        <div className="flex-grow-1">
          <h6 className="card-title mb-1" style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>
            {title}
          </h6>
          <h4 className="mb-0" style={{ color: colors.text, fontWeight: '600' }}>
            {value}
          </h4>
          {change && (
            <small 
              className={`d-flex align-items-center mt-1 ${
                change.startsWith('+') ? 'text-success' : 'text-danger'
              }`}
            >
              {change}
            </small>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant RevenueChart pour les graphiques de revenus
export const RevenueChart = ({ data = [], title = "Revenus" }) => {
  const colors = useThemeColors();
  
  // Données simulées si aucune donnée n'est fournie
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', revenue: 12000 },
    { month: 'Fév', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Avr', revenue: 22000 },
    { month: 'Mai', revenue: 19000 },
    { month: 'Juin', revenue: 25000 }
  ];

  return (
    <div 
      className="card h-100"
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px'
      }}
    >
      <div className="card-header" style={{ backgroundColor: 'transparent', borderBottom: `1px solid ${colors.border}` }}>
        <h5 className="card-title mb-0" style={{ color: colors.text }}>
          {title}
        </h5>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 style={{ color: colors.text, margin: 0 }}>
              {chartData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()} €
            </h3>
            <small style={{ color: colors.textSecondary }}>
              Total sur {chartData.length} mois
            </small>
          </div>
        </div>
        
        {/* Graphique simple en barres */}
        <div style={{ height: '200px', position: 'relative' }}>
          {chartData.map((item, index) => {
            const maxRevenue = Math.max(...chartData.map(d => d.revenue));
            const height = (item.revenue / maxRevenue) * 100;
            
            return (
              <div key={index} className="d-flex flex-column align-items-center" style={{ flex: 1 }}>
                <div 
                  style={{
                    width: '100%',
                    height: `${height}%`,
                    backgroundColor: colors.primary,
                    borderRadius: '4px 4px 0 0',
                    minHeight: '20px',
                    marginBottom: '8px'
                  }}
                />
                <small style={{ color: colors.textSecondary, fontSize: '0.75rem' }}>
                  {item.month}
                </small>
                <small style={{ color: colors.text, fontSize: '0.7rem', fontWeight: '500' }}>
                  {item.revenue.toLocaleString()}€
                </small>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Composant ConversionFunnelChart pour l'entonnoir de conversion
export const ConversionFunnelChart = ({ data = [], title = "Entonnoir de Conversion" }) => {
  const colors = useThemeColors();
  
  const funnelData = data.length > 0 ? data : [
    { stage: 'Visiteurs', count: 10000, percentage: 100 },
    { stage: 'Intéressés', count: 2500, percentage: 25 },
    { stage: 'Prospects', count: 500, percentage: 5 },
    { stage: 'Clients', count: 100, percentage: 1 }
  ];

  return (
    <div 
      className="card h-100"
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px'
      }}
    >
      <div className="card-header" style={{ backgroundColor: 'transparent', borderBottom: `1px solid ${colors.border}` }}>
        <h5 className="card-title mb-0" style={{ color: colors.text }}>
          {title}
        </h5>
      </div>
      <div className="card-body">
        <div className="d-flex flex-column gap-3">
          {funnelData.map((stage, index) => (
            <div key={index} className="d-flex align-items-center">
              <div 
                className="rounded"
                style={{
                  width: `${stage.percentage}%`,
                  height: '40px',
                  backgroundColor: colors.primary,
                  opacity: 1 - (index * 0.2),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  minWidth: '120px'
                }}
              >
                {stage.stage}
              </div>
              <div className="ms-3">
                <div style={{ color: colors.text, fontWeight: '600' }}>
                  {stage.count.toLocaleString()}
                </div>
                <small style={{ color: colors.textSecondary }}>
                  {stage.percentage}%
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Composant ProductPerformanceChart pour les performances des produits
export const ProductPerformanceChart = ({ data = [], title = "Performance des Produits" }) => {
  const colors = useThemeColors();
  
  const productData = data.length > 0 ? data : [
    { name: 'Chaussures Nike', sales: 150, revenue: 4500 },
    { name: 'Escarpins Louboutin', sales: 80, revenue: 12000 },
    { name: 'Baskets Adidas', sales: 120, revenue: 3600 },
    { name: 'Bottes Timberland', sales: 60, revenue: 4200 }
  ];

  return (
    <div 
      className="card h-100"
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px'
      }}
    >
      <div className="card-header" style={{ backgroundColor: 'transparent', borderBottom: `1px solid ${colors.border}` }}>
        <h5 className="card-title mb-0" style={{ color: colors.text }}>
          {title}
        </h5>
      </div>
      <div className="card-body">
        <div className="d-flex flex-column gap-3">
          {productData.map((product, index) => (
            <div key={index} className="d-flex justify-content-between align-items-center">
              <div>
                <div style={{ color: colors.text, fontWeight: '500' }}>
                  {product.name}
                </div>
                <small style={{ color: colors.textSecondary }}>
                  {product.sales} ventes
                </small>
              </div>
              <div className="text-end">
                <div style={{ color: colors.text, fontWeight: '600' }}>
                  {product.revenue.toLocaleString()} €
                </div>
                <small style={{ color: colors.textSecondary }}>
                  {Math.round(product.revenue / product.sales)} €/vente
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Composant MetricsRadarChart pour le radar des métriques
export const MetricsRadarChart = ({ data = [], title = "Métriques Clés" }) => {
  const colors = useThemeColors();
  
  const metricsData = data.length > 0 ? data : [
    { metric: 'Satisfaction', value: 85, max: 100 },
    { metric: 'Performance', value: 78, max: 100 },
    { metric: 'Qualité', value: 92, max: 100 },
    { metric: 'Innovation', value: 65, max: 100 },
    { metric: 'Support', value: 88, max: 100 }
  ];

  return (
    <div 
      className="card h-100"
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px'
      }}
    >
      <div className="card-header" style={{ backgroundColor: 'transparent', borderBottom: `1px solid ${colors.border}` }}>
        <h5 className="card-title mb-0" style={{ color: colors.text }}>
          {title}
        </h5>
      </div>
      <div className="card-body">
        <div className="d-flex flex-column gap-3">
          {metricsData.map((metric, index) => (
            <div key={index}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span style={{ color: colors.text, fontSize: '0.875rem' }}>
                  {metric.metric}
                </span>
                <span style={{ color: colors.text, fontWeight: '600', fontSize: '0.875rem' }}>
                  {metric.value}%
                </span>
              </div>
              <div 
                className="progress"
                style={{ height: '8px', backgroundColor: colors.border }}
              >
                <div 
                  className="progress-bar"
                  style={{
                    width: `${(metric.value / metric.max) * 100}%`,
                    backgroundColor: colors.primary,
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};