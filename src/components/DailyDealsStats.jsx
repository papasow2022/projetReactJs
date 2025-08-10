import React from 'react';
import { useDailyDeals } from '../contexts/DailyDealsContext';
import { useLanguage } from "../contexts/LanguageContext";
import { debugStats, validateStats } from '../utils/debugStats';
import './DailyDealsStats.css';

const DailyDealsStats = ({ onFilterChange }) => {
  const { t } = useLanguage();
  const { getDealsStats, getEndingSoonDeals, getOutOfStockDeals, getExpiredDeals } = useDailyDeals();
  const stats = getDealsStats();
  const endingSoon = getEndingSoonDeals();
  const outOfStock = getOutOfStockDeals();
  const expiredDeals = getExpiredDeals();

  // Vérification que les stats sont bien calculées
  debugStats(stats, 'DailyDealsStats');
  
  // Validation des statistiques
  const errors = validateStats(stats);
  if (errors.length > 0) {
    console.error('Erreurs dans les statistiques:', errors);
  }

  const statCards = [
    {
      title: t("active_offers"),
      value: stats.activeDeals || 0,
      total: stats.totalDeals || 0,
      icon: 'bi-lightning',
      color: 'success',
      description: t("ongoing_offers")
    },
    {
      title: t("expired_deals"),
      value: stats.expiredDeals || 0,
      icon: 'bi-clock-history',
      color: 'secondary',
      description: t("ended_offers")
    },
    {
      title: t("average_reduction"),
      value: stats.avgReduction || 0,
      icon: 'bi-graph-down',
      color: 'danger',
      description: t("average_savings"),
      showPercent: true
    },
    {
      title: t("ending_soon"),
      value: endingSoon.length || 0,
      icon: 'bi-clock',
      color: 'warning',
      description: t("within_hours")
    }
  ];

  return (
    <div className="row g-3 mb-4">
      {statCards.map((stat, index) => (
        <div key={index} className="col-md-3 col-sm-6">
          <div className={`card border-0 shadow-sm bg-${stat.color} bg-opacity-10 stats-card`}>
            <div className="card-body text-center">
              <div className={`text-${stat.color} mb-2`}>
                <i className={`bi ${stat.icon} fs-1 stats-icon`}></i>
              </div>
              <h3 className="fw-bold mb-1 stats-value">
                {stat.value}
                {stat.showPercent && '%'}
                {stat.total && (
                  <small className="text-muted ms-1">/ {stat.total}</small>
                )}
              </h3>
              <h6 className="text-muted mb-1">{stat.title}</h6>
              <small className="text-muted">{stat.description}</small>
            </div>
          </div>
        </div>
      ))}
      
      {/* Alertes spéciales */}
      {endingSoon.length > 0 && (
        <div className="col-12">
          <div className="alert alert-warning d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>
              <strong>{t('attention')}</strong> {endingSoon.length} {t('offer', {count: endingSoon.length})} {t('ending_soon_alert', {count: endingSoon.length})}
              <button 
                className="alert-link ms-2 border-0 bg-transparent text-decoration-underline"
                onClick={() => window.location.href = '/offres-urgentes'}
                style={{ cursor: 'pointer' }}
              >
                {t('view_offers')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {outOfStock.length > 0 && (
        <div className="col-12">
          <div className="alert alert-info d-flex align-items-center" role="alert">
            <i className="bi bi-info-circle-fill me-2"></i>
            <div>
              <strong>{t('info')}</strong> {outOfStock.length} {t('offer', {count: outOfStock.length})} {t('out_of_stock_alert', {count: outOfStock.length})}
              <button 
                className="alert-link ms-2 border-0 bg-transparent text-decoration-underline"
                onClick={() => onFilterChange && onFilterChange({ stock: true })}
                style={{ cursor: 'pointer' }}
              >
                {t('view_offers')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {expiredDeals.length > 0 && (
        <div className="col-12">
          <div className="alert alert-secondary d-flex align-items-center" role="alert">
            <i className="bi bi-clock-history me-2"></i>
            <div>
              <strong>{t('expired_deals')} :</strong> {expiredDeals.length} {t('offer', {count: expiredDeals.length})} {t('expired_deals_alert', {count: expiredDeals.length})}
              <button 
                className="alert-link ms-2 border-0 bg-transparent text-decoration-underline"
                onClick={() => onFilterChange && onFilterChange({ status: 'Expirées' })}
                style={{ cursor: 'pointer' }}
              >
                {t('view_expired_deals')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyDealsStats; 