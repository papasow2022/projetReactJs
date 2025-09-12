import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { BiCheckCircle, BiRightArrow, BiLeftArrow, BiHome, BiCog, BiBookOpen, BiPackage, BiCart } from 'react-icons/bi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const etapesOnboarding = [
  {
    id: 'dashboard',
    titre: 'Tableau de bord',
    description: 'Découvrez votre espace vendeur et les métriques importantes',
    icone: BiHome,
    route: '/vendeur/dashboard',
    duree: '2-3 min',
    obligatoire: true
  },
  {
    id: 'configuration',
    titre: 'Paramètres de la boutique',
    description: 'Logo, bannières, politiques de retour, livraison et préférences',
    icone: BiCog,
    route: '/vendeur/configuration',
    duree: '5-7 min',
    obligatoire: false
  },
  {
    id: 'formation',
    titre: 'Centre de formation',
    description: 'Apprenez les bonnes pratiques pour réussir sur papasow',
    icone: BiBookOpen,
    route: '/vendeur/formation',
    duree: '10-15 min',
    obligatoire: false
  },
  {
    id: 'produits',
    titre: 'Gestion des produits',
    description: 'Ajoutez vos premiers produits et gérez votre catalogue',
    icone: BiPackage,
    route: '/vendeur/produits',
    duree: '8-10 min',
    obligatoire: true
  },
  {
    id: 'commandes',
    titre: 'Centre des commandes',
    description: 'Gérez vos commandes et suivez vos ventes',
    icone: BiCart,
    route: '/vendeur/commandes',
    duree: '3-5 min',
    obligatoire: false
  }
];

export default function OnboardingVendeur() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [etapesCompletees, setEtapesCompletees] = useState([]);
  const [etapeActuelle, setEtapeActuelle] = useState(0);
  const [progression, setProgression] = useState(0);

  useEffect(() => {
    // Simuler des étapes déjà complétées (pour les tests)
    const completees = localStorage.getItem('onboardingCompletees') 
      ? JSON.parse(localStorage.getItem('onboardingCompletees'))
      : [];
    setEtapesCompletees(completees);
    
    // Calculer la progression
    const progressionCalculee = (completees.length / etapesOnboarding.length) * 100;
    setProgression(progressionCalculee);
  }, []);

  const marquerCommeCompletee = (etapeId) => {
    const nouvellesCompletees = [...etapesCompletees, etapeId];
    setEtapesCompletees(nouvellesCompletees);
    localStorage.setItem('onboardingCompletees', JSON.stringify(nouvellesCompletees));
    
    const nouvelleProgression = (nouvellesCompletees.length / etapesOnboarding.length) * 100;
    setProgression(nouvelleProgression);
  };

  const allerAEtape = (index) => {
    setEtapeActuelle(index);
    navigate(etapesOnboarding[index].route);
  };

  const etapeSuivante = () => {
    if (etapeActuelle < etapesOnboarding.length - 1) {
      allerAEtape(etapeActuelle + 1);
    }
  };

  const etapePrecedente = () => {
    if (etapeActuelle > 0) {
      allerAEtape(etapeActuelle - 1);
    }
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

  return (
    <>
      <Header />
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}>
        <div className="container">
          {/* En-tête de bienvenue */}
          <div className="text-center mb-5">
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#28a745',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <BiCheckCircle style={{ fontSize: '2.5rem', color: 'white' }} />
            </div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: '#232f3e',
              marginBottom: '1rem'
            }}>
              Bienvenue sur papasow !
            </h1>
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Félicitations ! Votre compte vendeur a été créé avec succès. 
              Suivez ce guide pour configurer votre boutique et commencer à vendre.
            </p>
          </div>

          {/* Barre de progression */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Progression de l'onboarding</h5>
                <span className="badge bg-primary">{Math.round(progression)}%</span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: `${progression}%` }}
                ></div>
              </div>
              <small className="text-muted">
                {etapesCompletees.length} sur {etapesOnboarding.length} étapes complétées
              </small>
            </div>
          </div>

          {/* Étapes d'onboarding */}
          <div className="row g-4">
            {etapesOnboarding.map((etape, index) => {
              const IconComponent = etape.icone;
              const completee = estCompletee(etape.id);
              
              return (
                <div key={etape.id} className="col-md-6 col-lg-4">
                  <div className={`card h-100 ${completee ? 'border-success' : 'border-light'}`}>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: completee ? '#28a745' : '#e9ecef',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '1rem'
                        }}>
                          {completee ? (
                            <BiCheckCircle style={{ fontSize: '1.5rem', color: 'white' }} />
                          ) : (
                            <IconComponent style={{ fontSize: '1.5rem', color: '#6c757d' }} />
                          )}
                        </div>
                        <div>
                          <h6 className="mb-1 fw-bold">{etape.titre}</h6>
                          <small className="text-muted">{etape.duree}</small>
                        </div>
                      </div>
                      
                      <p className="card-text text-muted mb-3">
                        {etape.description}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <span className={`badge ${etape.obligatoire ? 'bg-danger' : 'bg-secondary'}`}>
                          {etape.obligatoire ? 'Obligatoire' : 'Recommandé'}
                        </span>
                        
                        {completee ? (
                          <span className="text-success">
                            <BiCheckCircle /> Terminé
                          </span>
                        ) : (
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => allerAEtape(index)}
                          >
                            Commencer <BiRightArrow />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="text-center mt-5">
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/vendeur/dashboard" className="btn btn-outline-secondary">
                <BiHome /> Aller au dashboard
              </Link>
              
              {progression === 100 ? (
                <button 
                  className="btn btn-success"
                  onClick={terminerOnboarding}
                >
                  <BiCheckCircle /> Terminer l'onboarding
                </button>
              ) : (
                <button 
                  className="btn btn-primary"
                  onClick={() => allerAEtape(0)}
                >
                  Commencer l'onboarding
                </button>
              )}
            </div>
            
            <p className="text-muted mt-3">
              Vous pouvez revenir à cette page à tout moment depuis votre dashboard
            </p>
          </div>

          {/* Conseils pour réussir */}
          <div className="card mt-5">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <BiBookOpen className="me-2" />
                Conseils pour réussir sur papasow
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>✅ Faites en priorité :</h6>
                  <ul className="list-unstyled">
                    <li>• Configurez vos informations bancaires</li>
                    <li>• Ajoutez vos premiers produits</li>
                    <li>• Suivez la formation vendeur</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>💡 Conseils :</h6>
                  <ul className="list-unstyled">
                    <li>• Prenez des photos de qualité</li>
                    <li>• Rédigez des descriptions détaillées</li>
                    <li>• Répondez rapidement aux clients</li>
                  </ul>
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