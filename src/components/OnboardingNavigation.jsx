import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiLeftArrow, BiRightArrow, BiCheckCircle, BiHome } from 'react-icons/bi';
import { useProducts } from '../contexts/ProductsContext';
import { useAuth } from '../hooks/useAuth.jsx';

const etapesOnboarding = [
  { id: 'dashboard', titre: 'Dashboard', route: '/vendeur/dashboard' },
  { id: 'configuration', titre: 'Configuration', route: '/vendeur/configuration' },
  { id: 'formation', titre: 'Formation', route: '/vendeur/formation' },
  { id: 'produits', titre: 'Produits', route: '/vendeur/produits' },
  { id: 'commandes', titre: 'Commandes', route: '/vendeur/commandes' }
];

export default function OnboardingNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { allProducts } = useProducts();
  const { user } = useAuth();
  const [etapesCompletees, setEtapesCompletees] = useState([]);
  const [etapeActuelle, setEtapeActuelle] = useState(0);
  const vendorProductCount = (allProducts || []).filter(p => user?.vendorId && p.vendorId === user.vendorId).length;

  useEffect(() => {
    // Récupérer les étapes complétées
    const completees = localStorage.getItem('onboardingCompletees') 
      ? JSON.parse(localStorage.getItem('onboardingCompletees'))
      : [];
    setEtapesCompletees(completees);

    // Trouver l'étape actuelle
    const indexActuel = etapesOnboarding.findIndex(etape => 
      location.pathname.startsWith(etape.route)
    );
    setEtapeActuelle(indexActuel >= 0 ? indexActuel : 0);
  }, [location.pathname]);

  const marquerCommeCompletee = () => {
    const etapeActuelleId = etapesOnboarding[etapeActuelle]?.id;
    if (etapeActuelleId && !etapesCompletees.includes(etapeActuelleId)) {
      const nouvellesCompletees = [...etapesCompletees, etapeActuelleId];
      setEtapesCompletees(nouvellesCompletees);
      localStorage.setItem('onboardingCompletees', JSON.stringify(nouvellesCompletees));
    }
  };

  const etapeSuivante = () => {
    marquerCommeCompletee();
    if (etapeActuelle < etapesOnboarding.length - 1) {
      navigate(etapesOnboarding[etapeActuelle + 1].route);
    } else {
      // Terminer l'onboarding
      localStorage.setItem('onboardingTermine', 'true');
      navigate('/vendeur/dashboard');
    }
  };

  const etapePrecedente = () => {
    if (etapeActuelle > 0) {
      navigate(etapesOnboarding[etapeActuelle - 1].route);
    }
  };

  const allerAEtape = (index) => {
    navigate(etapesOnboarding[index].route);
  };

  const terminerOnboarding = () => {
    // Marquer toutes les étapes comme complétées
    const toutesCompletees = etapesOnboarding.map(etape => etape.id);
    setEtapesCompletees(toutesCompletees);
    localStorage.setItem('onboardingCompletees', JSON.stringify(toutesCompletees));
    localStorage.setItem('onboardingTermine', 'true');
    navigate('/vendeur/dashboard');
  };

  const estCompletee = (etapeId) => etapesCompletees.includes(etapeId);
  const progression = (etapesCompletees.length / etapesOnboarding.length) * 100;

  // Ne pas afficher si l'onboarding est terminé
  if (localStorage.getItem('onboardingTermine') === 'true') {
    return null;
  }

  return (
    <div className="card mb-4 border-primary">
      <div className="card-header bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <BiHome className="me-2" />
            Onboarding vendeur - Étape {etapeActuelle + 1} sur {etapesOnboarding.length}
          </h6>
          <span className="badge bg-light text-primary">
            {Math.round(progression)}% complété
          </span>
        </div>
      </div>
      
      <div className="card-body">
        {/* Barre de progression */}
        <div className="progress mb-3" style={{ height: '8px' }}>
          <div 
            className="progress-bar bg-success" 
            style={{ width: `${progression}%` }}
          ></div>
        </div>

        {/* Étapes */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          {etapesOnboarding.map((etape, index) => {
            const completee = estCompletee(etape.id);
            const active = index === etapeActuelle;
            
            return (
              <div 
                key={etape.id}
                className={`d-flex flex-column align-items-center ${active ? 'text-primary' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => allerAEtape(index)}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: completee ? '#28a745' : active ? '#007bff' : '#e9ecef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.5rem',
                  position: 'relative'
                }}>
                  {completee ? (
                    <BiCheckCircle style={{ color: 'white', fontSize: '1.2rem' }} />
                  ) : (
                    <span style={{ 
                      color: active ? 'white' : '#6c757d',
                      fontWeight: 'bold'
                    }}>
                      {etape.id === 'produits' ? vendorProductCount : (index + 1)}
                    </span>
                  )}
                  {/* Badge supprimé pour éviter l'effet "exposant" */}
                </div>
                <small className={`text-center ${active ? 'fw-bold' : ''}`}>
                  {etape.titre}
                </small>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="d-flex justify-content-between align-items-center">
          <button 
            className="btn btn-outline-secondary"
            onClick={etapePrecedente}
            disabled={etapeActuelle === 0}
          >
            <BiLeftArrow /> Précédent
          </button>

          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/vendeur/onboarding')}
            >
              <BiHome /> Vue d'ensemble
            </button>
            
            {etapeActuelle === etapesOnboarding.length - 1 ? (
              <button 
                className="btn btn-success"
                onClick={terminerOnboarding}
              >
                <BiCheckCircle /> Terminer l'onboarding
              </button>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={etapeSuivante}
              >
                Suivant <BiRightArrow />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 