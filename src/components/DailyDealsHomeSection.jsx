import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDailyDeals } from '../contexts/DailyDealsContext';
import { useLanguage } from "../contexts/LanguageContext";
import DailyDealCard from './DailyDealCard';

const DailyDealsHomeSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { 
    dailyDeals, 
    featuredDeal, 
    getEndingSoonDeals,
    getPopularDeals 
  } = useDailyDeals();
  
  const [activeTab, setActiveTab] = useState('featured');
  const endingSoonDeals = getEndingSoonDeals(3); // Limiter à 3 offres
  const popularDeals = getPopularDeals(3); // Limiter à 3 offres

  if (!dailyDeals || dailyDeals.length === 0) {
    return null;
  }

  return (
    <section className="py-5 bg-light">
      <div className="container">
        {/* En-tête de la section */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="fw-bold mb-3" style={{fontSize: '2rem'}}>
              <i className="bi bi-lightning text-warning me-3"></i>
              {t("daily_deals_title")}
            </h2>
            <p className="text-muted mb-4">
              {t("discover_best_deals")}
            </p>
            
            {/* Navigation par onglets */}
            <ul className="nav nav-pills justify-content-center mb-4">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'featured' ? 'active' : ''}`}
                  onClick={() => setActiveTab('featured')}
                >
                  <i className="bi bi-star me-1"></i>
                  {t("featured_deal")}
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'ending-soon' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ending-soon')}
                >
                                    <i className="bi bi-clock me-1"></i>
                  {t("ending_soon")}
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'popular' ? 'active' : ''}`}
                  onClick={() => setActiveTab('popular')}
                >
                  <i className="bi bi-heart me-1"></i>
                  {t("popular_deals")}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="row">
          {/* Offre vedette */}
          {activeTab === 'featured' && featuredDeal && (
            <div className="col-12">
              <div className="card border-warning border-3 shadow-lg">
                <div className="card-header bg-warning text-dark border-0">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h4 className="fw-bold mb-0">
                        <i className="bi bi-star-fill me-2"></i>
                        Offre vedette du jour
                      </h4>
                      <p className="mb-0 mt-1">L'offre la plus populaire avec le temps le plus limité</p>
                    </div>
                    <div className="col-md-4 text-end">
                      <div className="bg-dark text-white p-2 rounded">
                        <small>Se termine dans</small>
                        <div className="fw-bold">
                          {featuredDeal.heuresRestantes}h restantes
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <DailyDealCard deal={featuredDeal} variant="featured" />
                    </div>
                    <div className="col-md-4">
                      <div className="h-100 d-flex flex-column justify-content-center">
                        <div className="text-center mb-4">
                          <h5 className="fw-bold text-success mb-2">
                            {t('save_amount', {amount: (featuredDeal.ancienPrix - featuredDeal.prix).toLocaleString('fr-FR')})}
                          </h5>
                          <div className="progress mb-2" style={{height: '8px'}}>
                            <div 
                              className="progress-bar bg-success" 
                              style={{width: `${(featuredDeal.stock / featuredDeal.stockInitial) * 100}%`}}
                            ></div>
                          </div>
                          <small className="text-muted">
                            {t('stock_left', {stock: featuredDeal.stock, total: featuredDeal.stockInitial})}
                          </small>
                        </div>
                        <button 
                          className="btn btn-warning btn-lg fw-bold"
                          onClick={() => navigate('/offres-du-jour')}
                        >
                          <i className="bi bi-arrow-right me-2"></i>
                          {t('view_all_offers')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Offres qui se terminent bientôt */}
          {activeTab === 'ending-soon' && (
            <div className="col-12">
              <div className="row g-3">
                {endingSoonDeals.length > 0 ? (
                  endingSoonDeals.map(deal => (
                    <div key={deal.id} className="col-md-4">
                      <DailyDealCard 
                        deal={deal} 
                        variant="ending-soon"
                        showTimer={true}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <i className="bi bi-clock display-4 text-muted mb-3"></i>
                    <h5 className="text-muted">{t('no_ending_soon_offers')}</h5>
                    <p className="text-muted">{t('all_offers_have_time')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Offres populaires */}
          {activeTab === 'popular' && (
            <div className="col-12">
              <div className="row g-3">
                {popularDeals.length > 0 ? (
                  popularDeals.map(deal => (
                    <div key={deal.id} className="col-md-4">
                      <DailyDealCard deal={deal} />
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <i className="bi bi-heart display-4 text-muted mb-3"></i>
                    <h5 className="text-muted">{t('no_popular_offers')}</h5>
                    <p className="text-muted">{t('reviews_coming_soon')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bouton pour voir toutes les offres */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <button 
              className="btn btn-outline-warning btn-lg"
              onClick={() => navigate('/offres-du-jour')}
            >
              <i className="bi bi-lightning me-2"></i>
              {t('view_all_daily_deals')}
            </button>
          </div>
        </div>

        {/* Section d'informations supplémentaires */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-info-circle text-primary me-2"></i>
                  {t('about_daily_deals')}
                </h5>
                <div className="row">
                  <div className="col-md-4">
                    <h6 className="fw-bold">⏰ {t('limited_offers')}</h6>
                    <p className="text-muted small">
                      {t('limited_offers_desc')}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <h6 className="fw-bold">📦 {t('fast_delivery')}</h6>
                    <p className="text-muted small">
                      {t('fast_delivery_desc')}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <h6 className="fw-bold">🔄 {t('easy_returns')}</h6>
                    <p className="text-muted small">
                      {t('easy_returns_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyDealsHomeSection; 