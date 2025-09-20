// src/components/AIPredictions.jsx
import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../contexts/ThemeContext';
import { 
  BiBrain, 
  BiTrendingUp, 
  BiTrendingDown, 
  BiBullseye, 
  BiDollar, 
  BiPackage, 
  BiUser, 
  BiCalendar,
  BiRefresh,
  BiInfoCircle,
  BiCheckCircle,
  BiError
} from 'react-icons/bi';

const AIPredictions = ({ period = '7j' }) => {
  const colors = useThemeColors();
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confidence, setConfidence] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Simuler le chargement des prédictions IA
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setPredictions({
        sales: {
          current: 2450,
          predicted: 2890,
          change: 18.0,
          confidence: 87,
          trend: 'up'
        },
        orders: {
          current: 24,
          predicted: 31,
          change: 29.2,
          confidence: 82,
          trend: 'up'
        },
        customers: {
          current: 18,
          predicted: 25,
          change: 38.9,
          confidence: 75,
          trend: 'up'
        },
        inventory: {
          current: 156,
          predicted: 89,
          change: -42.9,
          confidence: 91,
          trend: 'down'
        },
        revenue: {
          current: 12500,
          predicted: 15200,
          change: 21.6,
          confidence: 85,
          trend: 'up'
        },
        seasonalTrends: [
          { month: 'Jan', predicted: 1200, actual: 1150 },
          { month: 'Fév', predicted: 1350, actual: 1420 },
          { month: 'Mar', predicted: 1580, actual: 1610 },
          { month: 'Avr', predicted: 1820, actual: 1780 },
          { month: 'Mai', predicted: 2100, actual: null },
          { month: 'Jun', predicted: 2350, actual: null }
        ],
        recommendations: [
          {
            type: 'success',
            title: 'Augmenter le stock Nike Air Max',
            description: 'Prédiction de +40% de ventes la semaine prochaine',
            impact: 'high',
            action: 'Commander 50 unités supplémentaires'
          },
          {
            type: 'warning',
            title: 'Réduire les prix Adidas Superstar',
            description: 'Concurrence forte détectée, risque de baisse des ventes',
            impact: 'medium',
            action: 'Appliquer une réduction de 15%'
          },
          {
            type: 'info',
            title: 'Lancer une campagne marketing',
            description: 'Période favorable identifiée pour les promotions',
            impact: 'high',
            action: 'Créer une campagne ciblée'
          }
        ]
      });
      
      setConfidence(85);
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [period]);

  const getTrendIcon = (trend) => {
    return trend === 'up' ? BiTrendingUp : BiTrendingDown;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? colors.success : colors.danger;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return colors.success;
    if (confidence >= 60) return colors.warning;
    return colors.danger;
  };

  const getRecommendationIcon = (type) => {
    const iconMap = {
      success: BiCheckCircle,
      warning: BiError,
      info: BiInfoCircle
    };
    return iconMap[type] || BiInfoCircle;
  };

  const getRecommendationColor = (type) => {
    const colorMap = {
      success: colors.success,
      warning: colors.warning,
      info: colors.info
    };
    return colorMap[type] || colors.info;
  };

  const refreshPredictions = () => {
    setIsLoading(true);
    setLastUpdate(new Date());
    // Simuler le rafraîchissement
    setTimeout(() => setIsLoading(false), 1500);
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
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <h6 style={{ color: colors.text }}>Analyse IA en cours...</h6>
          <p className="mb-0" style={{ color: colors.textSecondary }}>
            L'intelligence artificielle analyse vos données pour générer des prédictions
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
          <BiBrain className="me-2" style={{ color: colors.primary }} />
          Prédictions IA
        </h5>
        <div className="d-flex align-items-center gap-2">
          <div 
            className="badge"
            style={{
              backgroundColor: getConfidenceColor(confidence),
              color: 'white',
              fontSize: '0.8rem'
            }}
          >
            {confidence}% de confiance
          </div>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={refreshPredictions}
            disabled={isLoading}
            style={{
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: 'transparent'
            }}
          >
            <BiRefresh size={16} />
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Prédictions principales */}
        <div className="row g-3 mb-4">
          {predictions && Object.entries(predictions).filter(([key]) => 
            !['seasonalTrends', 'recommendations'].includes(key)
          ).map(([key, data]) => {
            const TrendIcon = getTrendIcon(data.trend);
            const trendColor = getTrendColor(data.trend);
            
            return (
              <div key={key} className="col-lg-4 col-md-6">
                <div 
                  className="p-3 rounded"
                  style={{ 
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0" style={{ color: colors.text, textTransform: 'capitalize' }}>
                      {key === 'sales' ? 'Ventes' : 
                       key === 'orders' ? 'Commandes' :
                       key === 'customers' ? 'Clients' :
                       key === 'inventory' ? 'Stock' : 'Revenus'}
                    </h6>
                    <div className="d-flex align-items-center gap-1">
                      <TrendIcon size={16} style={{ color: trendColor }} />
                      <span 
                        style={{ 
                          color: trendColor,
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}
                      >
                        +{data.change}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div 
                      className="fw-bold"
                      style={{ 
                        color: colors.text,
                        fontSize: '1.5rem'
                      }}
                    >
                      {key === 'sales' || key === 'revenue' ? `€${data.predicted.toLocaleString()}` : data.predicted}
                    </div>
                    <div 
                      className="small"
                      style={{ color: colors.textSecondary }}
                    >
                      Prédiction pour la période suivante
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div 
                      className="small"
                      style={{ color: colors.textSecondary }}
                    >
                      Actuel: {key === 'sales' || key === 'revenue' ? `€${data.current.toLocaleString()}` : data.current}
                    </div>
                    <div 
                      className="badge"
                      style={{
                        backgroundColor: getConfidenceColor(data.confidence),
                        color: 'white',
                        fontSize: '0.7rem'
                      }}
                    >
                      {data.confidence}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Graphique des tendances saisonnières */}
        {predictions?.seasonalTrends && (
          <div className="mb-4">
            <h6 className="mb-3" style={{ color: colors.text }}>
              <BiCalendar className="me-2" />
              Tendances saisonnières prédites
            </h6>
            <div className="row g-2">
              {predictions.seasonalTrends.map((trend, index) => (
                <div key={index} className="col-md-2 col-4">
                  <div 
                    className="p-2 rounded text-center"
                    style={{ 
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <div 
                      className="fw-bold"
                      style={{ 
                        color: colors.text,
                        fontSize: '0.9rem'
                      }}
                    >
                      {trend.month}
                    </div>
                    <div 
                      className="small"
                      style={{ color: colors.textSecondary }}
                    >
                      €{trend.predicted}
                    </div>
                    {trend.actual && (
                      <div 
                        className="small"
                        style={{ 
                          color: trend.actual > trend.predicted ? colors.success : colors.danger,
                          fontSize: '0.7rem'
                        }}
                      >
                        Réel: €{trend.actual}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommandations IA */}
        {predictions?.recommendations && (
          <div>
            <h6 className="mb-3" style={{ color: colors.text }}>
              <BiBullseye className="me-2" />
              Recommandations IA
            </h6>
            <div className="row g-3">
              {predictions.recommendations.map((rec, index) => {
                const RecIcon = getRecommendationIcon(rec.type);
                const recColor = getRecommendationColor(rec.type);
                
                return (
                  <div key={index} className="col-lg-4 col-md-6">
                    <div 
                      className="p-3 rounded"
                      style={{ 
                        backgroundColor: colors.surface,
                        border: `1px solid ${recColor}40`,
                        borderLeft: `4px solid ${recColor}`
                      }}
                    >
                      <div className="d-flex align-items-start gap-2 mb-2">
                        <RecIcon size={20} style={{ color: recColor }} />
                        <div className="flex-grow-1">
                          <h6 
                            className="mb-1"
                            style={{ 
                              color: colors.text,
                              fontSize: '0.9rem'
                            }}
                          >
                            {rec.title}
                          </h6>
                          <p 
                            className="mb-2 small"
                            style={{ 
                              color: colors.textSecondary,
                              fontSize: '0.8rem'
                            }}
                          >
                            {rec.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <span 
                          className="badge"
                          style={{
                            backgroundColor: rec.impact === 'high' ? colors.danger : 
                                           rec.impact === 'medium' ? colors.warning : colors.info,
                            color: 'white',
                            fontSize: '0.7rem'
                          }}
                        >
                          {rec.impact === 'high' ? 'Impact élevé' : 
                           rec.impact === 'medium' ? 'Impact moyen' : 'Impact faible'}
                        </span>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          style={{
                            borderColor: recColor,
                            color: recColor,
                            backgroundColor: 'transparent',
                            fontSize: '0.7rem'
                          }}
                        >
                          {rec.action}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer avec dernière mise à jour */}
        <div 
          className="mt-4 p-3 rounded text-center"
          style={{ backgroundColor: colors.surface }}
        >
          <small style={{ color: colors.textSecondary }}>
            <BiRefresh className="me-1" />
            Dernière mise à jour: {lastUpdate?.toLocaleTimeString('fr-FR')}
          </small>
        </div>
      </div>
    </div>
  );
};

export default AIPredictions;
import React, { useState, useEffect } from 'react';
import { useThemeColors } from '../contexts/ThemeContext';
import { 
  BiBrain, 
  BiTrendingUp, 
  BiTrendingDown, 
  BiBullseye, 
  BiDollar, 
  BiPackage, 
  BiUser, 
  BiCalendar,
  BiRefresh,
  BiInfoCircle,
  BiCheckCircle,
  BiError
} from 'react-icons/bi';

const AIPredictions = ({ period = '7j' }) => {
  const colors = useThemeColors();
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confidence, setConfidence] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Simuler le chargement des prédictions IA
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setPredictions({
        sales: {
          current: 2450,
          predicted: 2890,
          change: 18.0,
          confidence: 87,
          trend: 'up'
        },
        orders: {
          current: 24,
          predicted: 31,
          change: 29.2,
          confidence: 82,
          trend: 'up'
        },
        customers: {
          current: 18,
          predicted: 25,
          change: 38.9,
          confidence: 75,
          trend: 'up'
        },
        inventory: {
          current: 156,
          predicted: 89,
          change: -42.9,
          confidence: 91,
          trend: 'down'
        },
        revenue: {
          current: 12500,
          predicted: 15200,
          change: 21.6,
          confidence: 85,
          trend: 'up'
        },
        seasonalTrends: [
          { month: 'Jan', predicted: 1200, actual: 1150 },
          { month: 'Fév', predicted: 1350, actual: 1420 },
          { month: 'Mar', predicted: 1580, actual: 1610 },
          { month: 'Avr', predicted: 1820, actual: 1780 },
          { month: 'Mai', predicted: 2100, actual: null },
          { month: 'Jun', predicted: 2350, actual: null }
        ],
        recommendations: [
          {
            type: 'success',
            title: 'Augmenter le stock Nike Air Max',
            description: 'Prédiction de +40% de ventes la semaine prochaine',
            impact: 'high',
            action: 'Commander 50 unités supplémentaires'
          },
          {
            type: 'warning',
            title: 'Réduire les prix Adidas Superstar',
            description: 'Concurrence forte détectée, risque de baisse des ventes',
            impact: 'medium',
            action: 'Appliquer une réduction de 15%'
          },
          {
            type: 'info',
            title: 'Lancer une campagne marketing',
            description: 'Période favorable identifiée pour les promotions',
            impact: 'high',
            action: 'Créer une campagne ciblée'
          }
        ]
      });
      
      setConfidence(85);
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [period]);

  const getTrendIcon = (trend) => {
    return trend === 'up' ? BiTrendingUp : BiTrendingDown;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? colors.success : colors.danger;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return colors.success;
    if (confidence >= 60) return colors.warning;
    return colors.danger;
  };

  const getRecommendationIcon = (type) => {
    const iconMap = {
      success: BiCheckCircle,
      warning: BiError,
      info: BiInfoCircle
    };
    return iconMap[type] || BiInfoCircle;
  };

  const getRecommendationColor = (type) => {
    const colorMap = {
      success: colors.success,
      warning: colors.warning,
      info: colors.info
    };
    return colorMap[type] || colors.info;
  };

  const refreshPredictions = () => {
    setIsLoading(true);
    setLastUpdate(new Date());
    // Simuler le rafraîchissement
    setTimeout(() => setIsLoading(false), 1500);
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
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <h6 style={{ color: colors.text }}>Analyse IA en cours...</h6>
          <p className="mb-0" style={{ color: colors.textSecondary }}>
            L'intelligence artificielle analyse vos données pour générer des prédictions
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
          <BiBrain className="me-2" style={{ color: colors.primary }} />
          Prédictions IA
        </h5>
        <div className="d-flex align-items-center gap-2">
          <div 
            className="badge"
            style={{
              backgroundColor: getConfidenceColor(confidence),
              color: 'white',
              fontSize: '0.8rem'
            }}
          >
            {confidence}% de confiance
          </div>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={refreshPredictions}
            disabled={isLoading}
            style={{
              borderColor: colors.border,
              color: colors.text,
              backgroundColor: 'transparent'
            }}
          >
            <BiRefresh size={16} />
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Prédictions principales */}
        <div className="row g-3 mb-4">
          {predictions && Object.entries(predictions).filter(([key]) => 
            !['seasonalTrends', 'recommendations'].includes(key)
          ).map(([key, data]) => {
            const TrendIcon = getTrendIcon(data.trend);
            const trendColor = getTrendColor(data.trend);
            
            return (
              <div key={key} className="col-lg-4 col-md-6">
                <div 
                  className="p-3 rounded"
                  style={{ 
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0" style={{ color: colors.text, textTransform: 'capitalize' }}>
                      {key === 'sales' ? 'Ventes' : 
                       key === 'orders' ? 'Commandes' :
                       key === 'customers' ? 'Clients' :
                       key === 'inventory' ? 'Stock' : 'Revenus'}
                    </h6>
                    <div className="d-flex align-items-center gap-1">
                      <TrendIcon size={16} style={{ color: trendColor }} />
                      <span 
                        style={{ 
                          color: trendColor,
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}
                      >
                        +{data.change}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div 
                      className="fw-bold"
                      style={{ 
                        color: colors.text,
                        fontSize: '1.5rem'
                      }}
                    >
                      {key === 'sales' || key === 'revenue' ? `€${data.predicted.toLocaleString()}` : data.predicted}
                    </div>
                    <div 
                      className="small"
                      style={{ color: colors.textSecondary }}
                    >
                      Prédiction pour la période suivante
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div 
                      className="small"
                      style={{ color: colors.textSecondary }}
                    >
                      Actuel: {key === 'sales' || key === 'revenue' ? `€${data.current.toLocaleString()}` : data.current}
                    </div>
                    <div 
                      className="badge"
                      style={{
                        backgroundColor: getConfidenceColor(data.confidence),
                        color: 'white',
                        fontSize: '0.7rem'
                      }}
                    >
                      {data.confidence}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Graphique des tendances saisonnières */}
        {predictions?.seasonalTrends && (
          <div className="mb-4">
            <h6 className="mb-3" style={{ color: colors.text }}>
              <BiCalendar className="me-2" />
              Tendances saisonnières prédites
            </h6>
            <div className="row g-2">
              {predictions.seasonalTrends.map((trend, index) => (
                <div key={index} className="col-md-2 col-4">
                  <div 
                    className="p-2 rounded text-center"
                    style={{ 
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <div 
                      className="fw-bold"
                      style={{ 
                        color: colors.text,
                        fontSize: '0.9rem'
                      }}
                    >
                      {trend.month}
                    </div>
                    <div 
                      className="small"
                      style={{ color: colors.textSecondary }}
                    >
                      €{trend.predicted}
                    </div>
                    {trend.actual && (
                      <div 
                        className="small"
                        style={{ 
                          color: trend.actual > trend.predicted ? colors.success : colors.danger,
                          fontSize: '0.7rem'
                        }}
                      >
                        Réel: €{trend.actual}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommandations IA */}
        {predictions?.recommendations && (
          <div>
            <h6 className="mb-3" style={{ color: colors.text }}>
              <BiBullseye className="me-2" />
              Recommandations IA
            </h6>
            <div className="row g-3">
              {predictions.recommendations.map((rec, index) => {
                const RecIcon = getRecommendationIcon(rec.type);
                const recColor = getRecommendationColor(rec.type);
                
                return (
                  <div key={index} className="col-lg-4 col-md-6">
                    <div 
                      className="p-3 rounded"
                      style={{ 
                        backgroundColor: colors.surface,
                        border: `1px solid ${recColor}40`,
                        borderLeft: `4px solid ${recColor}`
                      }}
                    >
                      <div className="d-flex align-items-start gap-2 mb-2">
                        <RecIcon size={20} style={{ color: recColor }} />
                        <div className="flex-grow-1">
                          <h6 
                            className="mb-1"
                            style={{ 
                              color: colors.text,
                              fontSize: '0.9rem'
                            }}
                          >
                            {rec.title}
                          </h6>
                          <p 
                            className="mb-2 small"
                            style={{ 
                              color: colors.textSecondary,
                              fontSize: '0.8rem'
                            }}
                          >
                            {rec.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <span 
                          className="badge"
                          style={{
                            backgroundColor: rec.impact === 'high' ? colors.danger : 
                                           rec.impact === 'medium' ? colors.warning : colors.info,
                            color: 'white',
                            fontSize: '0.7rem'
                          }}
                        >
                          {rec.impact === 'high' ? 'Impact élevé' : 
                           rec.impact === 'medium' ? 'Impact moyen' : 'Impact faible'}
                        </span>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          style={{
                            borderColor: recColor,
                            color: recColor,
                            backgroundColor: 'transparent',
                            fontSize: '0.7rem'
                          }}
                        >
                          {rec.action}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer avec dernière mise à jour */}
        <div 
          className="mt-4 p-3 rounded text-center"
          style={{ backgroundColor: colors.surface }}
        >
          <small style={{ color: colors.textSecondary }}>
            <BiRefresh className="me-1" />
            Dernière mise à jour: {lastUpdate?.toLocaleTimeString('fr-FR')}
          </small>
        </div>
      </div>
    </div>
  );
};

export default AIPredictions;
 
 
 
 
 
 
 
 
 