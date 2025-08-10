import React, { useState, useEffect } from 'react';
import '../amazon-like.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useDailyDeals } from '../contexts/DailyDealsContext';
import DailyDealCard from '../components/DailyDealCard';

export default function OffresUrgentes() {
  const navigate = useNavigate();
  const { 
    dailyDeals, 
    loading, 
    error, 
    getEndingSoonDeals,
    addToCart
  } = useDailyDeals();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [sortBy, setSortBy] = useState('temps-restant');

  // Obtenir les offres qui se terminent bientôt
  const urgentDeals = getEndingSoonDeals(6);
  const sortedUrgentDeals = urgentDeals.sort((a, b) => a.heuresRestantes - b.heuresRestantes);

  if (loading) {
    return (
      <>
        <div className="container-fluid py-4">
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement des offres urgentes...</p>
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
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1 className="mb-0 text-danger fw-bold" style={{fontSize: '2.2rem'}}>
                <i className="bi bi-exclamation-triangle-fill me-3"></i>
                Offres Urgentes
              </h1>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/offres-du-jour')}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Retour aux offres du jour
              </button>
            </div>
            <p className="text-muted mb-0">
              ⏰ Ces offres se terminent dans moins de 6 heures ! Agissez vite pour ne pas les manquer.
            </p>
          </div>
        </div>

        {/* Alert d'urgence */}
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-clock-fill me-2"></i>
          <div>
            <strong>Urgence !</strong> {urgentDeals.length} offre{urgentDeals.length > 1 ? 's' : ''} se termine{urgentDeals.length > 1 ? 'nt' : ''} bientôt. 
            Ne tardez pas pour profiter de ces réductions exceptionnelles !
          </div>
        </div>

        {/* Barre d'outils */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h6 className="mb-0">
                  <i className="bi bi-clock me-2 text-danger"></i>
                  {urgentDeals.length} offre{urgentDeals.length > 1 ? 's' : ''} urgente{urgentDeals.length > 1 ? 's' : ''}
                </h6>
              </div>
              <div className="col-md-6 text-end">
                <div className="btn-group" role="group">
                  <button 
                    type="button" 
                    className={`btn btn-sm ${viewMode === 'grid' ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <i className="bi bi-grid-3x3-gap"></i>
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${viewMode === 'list' ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <i className="bi bi-list"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des offres urgentes */}
        {urgentDeals.length > 0 ? (
          <div className="row g-4">
            {sortedUrgentDeals.map((deal) => (
              <div 
                key={deal.id} 
                className={viewMode === 'grid' ? 'col-md-6 col-lg-4' : 'col-12'}
              >
                <DailyDealCard 
                  deal={deal} 
                  variant="ending-soon" 
                  showTimer={true}
                  showStock={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-clock-history text-muted" style={{fontSize: '4rem'}}></i>
            <h4 className="mt-3 text-muted">Aucune offre urgente pour le moment</h4>
            <p className="text-muted">Toutes les offres ont encore du temps !</p>
            <button 
              className="btn btn-warning"
              onClick={() => navigate('/offres-du-jour')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Voir toutes les offres
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
} 