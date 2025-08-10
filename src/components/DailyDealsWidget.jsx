import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDailyDeals } from '../contexts/DailyDealsContext';
import { useLanguage } from "../contexts/LanguageContext";

const DailyDealsWidget = ({ variant = 'compact' }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { 
    dailyDeals, 
    featuredDeal, 
    getEndingSoonDeals 
  } = useDailyDeals();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const endingSoonDeals = getEndingSoonDeals(2); // Limiter à 2 offres

  if (!dailyDeals || dailyDeals.length === 0) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className="card border-warning border-2 shadow-sm">
        <div className="card-header bg-warning text-dark border-0 py-2">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-lightning me-1"></i>
              {t('daily_deals_title')}
            </h6>
            <button 
              className="btn btn-sm btn-outline-dark"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="card-body p-2">
            {featuredDeal && (
              <div className="mb-2">
                <div className="d-flex align-items-center">
                  <img 
                    src={featuredDeal.image} 
                    alt={featuredDeal.nom}
                    className="rounded me-2"
                    style={{width: '40px', height: '40px', objectFit: 'cover'}}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-bold small">{featuredDeal.nom}</div>
                    <div className="text-danger fw-bold">
                      {featuredDeal.prix.toLocaleString('fr-FR')} GNF
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-danger small">{featuredDeal.badge}</span>
                    <div className="text-muted small">
                      {featuredDeal.heuresRestantes}h restantes
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {endingSoonDeals.length > 0 && (
              <div className="mb-2">
                <small className="text-muted">{t('ending_soon')}:</small>
                {endingSoonDeals.map(deal => (
                  <div key={deal.id} className="d-flex align-items-center mt-1">
                    <img 
                      src={deal.image} 
                      alt={deal.nom}
                      className="rounded me-2"
                      style={{width: '30px', height: '30px', objectFit: 'cover'}}
                    />
                    <div className="flex-grow-1">
                      <div className="small">{deal.nom}</div>
                      <div className="text-danger small fw-bold">
                        {deal.prix.toLocaleString('fr-FR')} GNF
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-warning text-dark small">
                        {deal.heuresRestantes}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button 
              className="btn btn-warning btn-sm w-100"
              onClick={() => navigate('/offres-du-jour')}
            >
              <i className="bi bi-arrow-right me-1"></i>
              {t('view_all')}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Variante pour la sidebar
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-light border-0">
        <h6 className="fw-bold mb-0">
          <i className="bi bi-lightning text-warning me-2"></i>
          {t('daily_deals_title')}
        </h6>
      </div>
      <div className="card-body">
        {featuredDeal && (
          <div className="mb-3">
            <div className="position-relative">
              <img 
                src={featuredDeal.image} 
                alt={featuredDeal.nom}
                className="img-fluid rounded"
                style={{height: '120px', objectFit: 'cover', width: '100%'}}
              />
              <div className="position-absolute top-0 start-0 m-2">
                <span className="badge bg-danger">{featuredDeal.badge}</span>
              </div>
              <div className="position-absolute top-0 end-0 m-2">
                <span className="badge bg-dark">
                  {featuredDeal.heuresRestantes}h
                </span>
              </div>
            </div>
            <div className="mt-2">
              <h6 className="fw-bold mb-1">{featuredDeal.nom}</h6>
              <div className="mb-2">
                <span className="text-danger fw-bold">
                  {featuredDeal.prix.toLocaleString('fr-FR')} GNF
                </span>
                <span className="text-muted text-decoration-line-through ms-2">
                  {featuredDeal.ancienPrix.toLocaleString('fr-FR')} GNF
                </span>
              </div>
              <div className="progress mb-2" style={{height: '4px'}}>
                <div 
                  className="progress-bar bg-success" 
                  style={{width: `${(featuredDeal.stock / featuredDeal.stockInitial) * 100}%`}}
                ></div>
              </div>
              <small className="text-muted">
                {t('stock_left', {stock: featuredDeal.stock, total: featuredDeal.stockInitial})}
              </small>
            </div>
          </div>
        )}
        
        <button 
          className="btn btn-warning w-100"
          onClick={() => navigate('/offres-du-jour')}
        >
          <i className="bi bi-lightning me-2"></i>
          {t('view_all_offers')}
        </button>
      </div>
    </div>
  );
};

export default DailyDealsWidget; 