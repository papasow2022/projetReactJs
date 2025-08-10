import React, { useState, useEffect } from 'react';
import '../amazon-like.css';
import { useNavigate } from 'react-router-dom';

import Footer from '../components/Footer';
import { useDailyDeals } from '../contexts/DailyDealsContext';
import DailyDealCard from '../components/DailyDealCard';
import DailyDealsFilters from '../components/DailyDealsFilters';
import DailyDealsStats from '../components/DailyDealsStats';
import { useLanguage } from '../contexts/LanguageContext';

export default function OffreDuJour() {
  const navigate = useNavigate();
  const { 
    dailyDeals, 
    featuredDeal, 
    loading, 
    error, 
    filterDeals, 
    sortDeals,
    getEndingSoonDeals,
    getPopularDeals
  } = useDailyDeals();

  const { t } = useLanguage();

  const [filters, setFilters] = useState({
    status: 'Toutes',
    categorie: 'Toutes',
    prixMin: 0,
    prixMax: 1000,
    reductionMin: 0,
    noteMin: 0,
    livraison: 'Toutes',
    stock: false
  });
  const [sortBy, setSortBy] = useState('pertinence');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [showAllOffers, setShowAllOffers] = useState(false);

  // Fonction pour gérer les filtres automatiques depuis les stats
  const handleAutoFilter = (filterParams) => {
    // Afficher la section des offres si elle n'est pas visible
    if (!showAllOffers) {
      setShowAllOffers(true);
    }
    
    // Appliquer les filtres automatiques
    const newFilters = { ...filters };
    
    if (filterParams.status) {
      newFilters.status = filterParams.status;
    }
    if (filterParams.stock !== undefined) {
      newFilters.stock = filterParams.stock;
    }
    if (filterParams.tempsRestant === 'ending-soon') {
      // Pour les offres qui se terminent bientôt
      newFilters.endingSoon = true;
      setSortBy('temps-restant');
    }
    
    setFilters(newFilters);
  };

  // Filtrer et trier les offres (exclure l'offre vedette)
  const allDealsExceptFeatured = dailyDeals.filter(deal => deal.id !== featuredDeal?.id);
  const filteredDeals = filterDeals(filters);
  const filteredDealsExceptFeatured = filteredDeals.filter(deal => deal.id !== featuredDeal?.id);
  const sortedDeals = sortDeals(filteredDealsExceptFeatured, sortBy);
  const endingSoonDeals = getEndingSoonDeals();
  const popularDeals = getPopularDeals();

  // Timer pour l'offre vedette
  const [featuredTimer, setFeaturedTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (featuredDeal) {
      const calculateTimeLeft = () => {
        const now = new Date();
        const end = new Date();
        end.setHours(now.getHours() + featuredDeal.heuresRestantes, 59, 59, 999);
        const diff = end - now;
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setFeaturedTimer({ hours, minutes, seconds });
        }
      };

      calculateTimeLeft();
      const interval = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(interval);
    }
  }, [featuredDeal]);

  if (loading) {
    return (
      <>
        <div className="container-fluid py-4">
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement des offres du jour...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="container-fluid py-4">
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="container-fluid py-4">
        {/* En-tête principal */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="mb-3 text-warning fw-bold" style={{fontSize: '2.2rem'}}>
              <i className="bi bi-lightning me-3"></i>
              {t('daily_deals_title')}
            </h1>
            <p className="text-muted mb-0">
              {t('discover_best_deals')}
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <DailyDealsStats onFilterChange={handleAutoFilter} />

        {/* Section Offre vedette */}
        {featuredDeal && (
          <div className="card mb-4 border-warning border-3 shadow-lg">
            <div className="card-header bg-warning text-dark border-0">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h4 className="fw-bold mb-0">
                    <i className="bi bi-star-fill me-2"></i>
                    {t('featured_deal_of_day')}
                  </h4>
                  <p className="mb-0 mt-1">{t('most_popular_time_limited')}</p>
                </div>
                <div className="col-md-4 text-end">
                  <div className="bg-dark text-white p-3 rounded">
                    <div className="text-center">
                      <div className="fw-bold mb-1">{t('ends_in')}</div>
                      <div style={{fontSize: '1.5rem', fontWeight: 700, letterSpacing: 2}}>
                        {String(featuredTimer.hours).padStart(2, '0')}:{String(featuredTimer.minutes).padStart(2, '0')}:{String(featuredTimer.seconds).padStart(2, '0')}
                      </div>
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
                        {t('save_amount', { amount: (featuredDeal.ancienPrix - featuredDeal.prix).toLocaleString('fr-FR') })}
                      </h5>
                      <div className="progress mb-2" style={{height: '8px'}}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{width: `${(featuredDeal.stock / featuredDeal.stockInitial) * 100}%`}}
                        ></div>
                      </div>
                      <small className="text-muted">
                        {t('stock_left', { stock: featuredDeal.stock, total: featuredDeal.stockInitial })}
                      </small>
                    </div>
                    <button 
                      className="btn btn-warning btn-lg fw-bold"
                      onClick={() => setShowAllOffers(true)}
                    >
                      <i className="bi bi-arrow-right me-2"></i>
                      {t('view_other_deals')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Toutes les autres offres - Affichée seulement après clic sur le bouton */}
        {showAllOffers && (
          <div className="row g-4">
            {/* Filtres */}
            <div className="col-lg-3">
              <DailyDealsFilters 
                filters={filters}
                onFiltersChange={setFilters}
                onSortChange={setSortBy}
                sortBy={sortBy}
              />
            </div>

            {/* Contenu principal */}
            <div className="col-lg-9">
              {/* Barre d'outils */}
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h6 className="mb-0">
                        {t('other_deals_found', { count: sortedDeals.length })}
                      </h6>
                    </div>
                    <div className="col-md-6 text-end">
                      <div className="btn-group" role="group">
                        <button 
                          type="button" 
                          className={`btn btn-outline-secondary ${viewMode === 'grid' ? 'active' : ''}`}
                          onClick={() => setViewMode('grid')}
                        >
                          <i className="bi bi-grid"></i>
                        </button>
                        <button 
                          type="button" 
                          className={`btn btn-outline-secondary ${viewMode === 'list' ? 'active' : ''}`}
                          onClick={() => setViewMode('list')}
                        >
                          <i className="bi bi-list"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grille des offres */}
              {sortedDeals.length > 0 ? (
                <div className={`row g-3 ${viewMode === 'list' ? 'flex-column' : ''}`}>
                  {sortedDeals.map(deal => (
                    <div key={deal.id} className={viewMode === 'list' ? 'col-12' : 'col-md-6 col-lg-4'}>
                      <DailyDealCard 
                        deal={deal} 
                        variant={deal.heuresRestantes <= 6 ? 'ending-soon' : 'default'}
                        showTimer={true}
                        showStock={true}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-search display-1 text-muted mb-3"></i>
                  <h4 className="text-muted">{t('no_other_deal_found')}</h4>
                  <p className="text-muted mb-4">
                    {t('no_other_deal_criteria')}
                  </p>
                  <button 
                    className="btn btn-warning"
                    onClick={() => setFilters({
                      categorie: 'Toutes',
                      prixMin: 0,
                      prixMax: 1000,
                      reductionMin: 0,
                      noteMin: 0,
                      livraison: 'Toutes',
                      stock: false
                    })}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    {t('reset_filters')}
                  </button>
                </div>
              )}

              {/* Pagination (optionnel) */}
              {sortedDeals.length > 12 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li className="page-item disabled">
                      <span className="page-link">{t('previous')}</span>
                    </li>
                    <li className="page-item active">
                      <span className="page-link">1</span>
                    </li>
                    <li className="page-item">
                      <span className="page-link">2</span>
                    </li>
                    <li className="page-item">
                      <span className="page-link">3</span>
                    </li>
                    <li className="page-item">
                      <span className="page-link">{t('next')}</span>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        )}

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
      <Footer />
    </>
  );
} 