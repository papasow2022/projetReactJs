import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BiStore, 
  BiUser, 
  BiPalette, 
  BiCar, 
  BiShield, 
  BiTrendingUp,
  BiCheckCircle,
  BiXCircle,
  BiInfoCircle,
  BiCalculator,
  BiGlobe,

  BiCreditCard,
  BiBarChart
} from 'react-icons/bi';
import VendorRevenueCalculator from '../components/VendorRevenueCalculator';

const typesVendeur = [
  {
    id: 'individuel',
    titre: 'Vendeur Individuel',
    sousTitre: 'Pour les particuliers',
    icon: BiUser,
    description: 'Vendez vos produits occasionnellement ou en complément de revenus',
    avantages: [
      'Inscription gratuite',
      'Commission de 8% par vente',
      'Gestion simple des commandes',
      'Support client inclus'
    ],
    limitations: [
      'Maximum 40 produits',
      'Pas de fonctionnalités avancées',
      'Statistiques limitées'
    ],
    frais: {
      inscription: 'Gratuit',
      commission: '8%',
      mensuel: 'Aucun'
    },
    couleur: 'primary',
    recommande: false
  },
  {
    id: 'professionnel',
    titre: 'Vendeur Professionnel',
    sousTitre: 'Pour les entreprises',
    icon: BiStore,
    description: 'Solution complète pour développer votre activité e-commerce',
    avantages: [
      'Nombre illimité de produits',
      'Outils de marketing avancés',
      'Statistiques détaillées',
      'Support prioritaire',
      'API d\'intégration',
      'Gestion des stocks avancée'
    ],
    limitations: [
      'Frais mensuels obligatoires',
      'Documents d\'entreprise requis'
    ],
    frais: {
      inscription: 'Gratuit',
      commission: '5%',
      mensuel: '29€/mois'
    },
    couleur: 'success',
    recommande: true
  },
  {
    id: 'artisan',
    titre: 'Vendeur Artisan',
    sousTitre: 'Pour les créateurs',
    icon: BiPalette,
    description: 'Plateforme dédiée aux produits artisanaux et créatifs',
    avantages: [
      'Badge "Artisan" sur vos produits',
      'Commission réduite (6%)',
      'Promotion spéciale artisanat',
      'Communauté d\'artisans',
      'Formation dédiée'
    ],
    limitations: [
      'Produits artisanaux uniquement',
      'Validation manuelle requise'
    ],
    frais: {
      inscription: 'Gratuit',
      commission: '6%',
      mensuel: 'Aucun'
    },
    couleur: 'warning',
    recommande: false
  },
  {
    id: 'dropshipping',
    titre: 'Vendeur Dropshipping',
    sousTitre: 'Sans stock',
    icon: BiCar,
    description: 'Vendez sans gérer les stocks ni la logistique',
    avantages: [
      'Pas de stock à gérer',
      'Livraison gérée par le fournisseur',
      'Investissement minimal',
      'Scalabilité rapide'
    ],
    limitations: [
      'Marge réduite',
      'Moins de contrôle qualité',
      'Délais de livraison variables'
    ],
    frais: {
      inscription: 'Gratuit',
      commission: '10%',
      mensuel: 'Aucun'
    },
    couleur: 'info',
    recommande: false
  }
];



export default function Vendeur() {
  const [selectedType, setSelectedType] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <>
      <VendorRevenueCalculator 
        isOpen={showCalculator} 
        onClose={() => setShowCalculator(false)} 
      />
    <div style={{ background: '#f6f7fa', minHeight: '100vh', paddingBottom: 40 }}>
      {/* Bannière d'accroche */}
      <section style={{ background: 'linear-gradient(135deg, #232f3e 0%, #37475a 100%)', color: '#fff', padding: '48px 0 32px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, marginBottom: 12 }}>Devenez Vendeur sur Papasow</h1>
        <p style={{ fontSize: 20, marginBottom: 28 }}>Choisissez le type de compte qui correspond à votre activité</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowCalculator(true)}
            style={{ background: '#ffd814', color: '#232f3e', fontWeight: 700, fontSize: 16, padding: '12px 24px', borderRadius: 8, border: 'none', cursor: 'pointer' }}
          >
            <BiCalculator style={{ marginRight: 8 }} />
            Calculer mes revenus
          </button>
          <Link to="/inscription-vendeur" style={{ background: '#e47911', color: '#fff', fontWeight: 700, fontSize: 16, padding: '12px 24px', borderRadius: 8, textDecoration: 'none' }}>
            Commencer maintenant
        </Link>
        </div>
      </section>

      {/* Types de vendeur */}
      <section style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, color: '#232f3e', marginBottom: 40 }}>
          Choisissez votre type de compte
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {typesVendeur.map((type) => (
            <div 
              key={type.id}
              style={{ 
                background: '#fff', 
                borderRadius: 12, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                padding: 32,
                border: selectedType === type.id ? `3px solid var(--bs-${type.couleur})` : '1px solid #e0e0e0',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setSelectedType(type.id)}
            >
              {type.recommande && (
                <div style={{ 
                  position: 'absolute', 
                  top: -12, 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  background: '#28a745',
                  color: 'white',
                  padding: '4px 16px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  RECOMMANDÉ
          </div>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <type.icon size={48} style={{ color: `var(--bs-${type.couleur})`, marginBottom: 16 }} />
                <h3 style={{ fontSize: 24, fontWeight: 800, color: '#232f3e', marginBottom: 8 }}>{type.titre}</h3>
                <p style={{ color: '#666', fontSize: 16 }}>{type.sousTitre}</p>
              </div>

              <p style={{ color: '#555', marginBottom: 24, lineHeight: 1.6 }}>{type.description}</p>

              {/* Frais */}
              <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 24 }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Frais</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <span style={{ color: '#666' }}>Inscription:</span>
                    <span style={{ fontWeight: 700, marginLeft: 8 }}>{type.frais.inscription}</span>
                  </div>
                  <div>
                    <span style={{ color: '#666' }}>Commission:</span>
                    <span style={{ fontWeight: 700, marginLeft: 8 }}>{type.frais.commission}</span>
                  </div>
                  <div>
                    <span style={{ color: '#666' }}>Mensuel:</span>
                    <span style={{ fontWeight: 700, marginLeft: 8 }}>{type.frais.mensuel}</span>
                  </div>
                </div>
              </div>

      {/* Avantages */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Avantages</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {type.avantages.map((avantage, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <BiCheckCircle style={{ color: '#28a745', marginRight: 8 }} />
                      <span style={{ fontSize: 14 }}>{avantage}</span>
                    </li>
                  ))}
                </ul>
          </div>

              {/* Limitations */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Limitations</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {type.limitations.map((limitation, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <BiXCircle style={{ color: '#dc3545', marginRight: 8 }} />
                      <span style={{ fontSize: 14 }}>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                to={`/inscription-vendeur?type=${type.id}`}
                style={{ 
                  display: 'block',
                  background: `var(--bs-${type.couleur})`, 
                  color: 'white', 
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontWeight: 700,
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Choisir ce type
              </Link>
            </div>
          ))}
        </div>
      </section>



      {/* Statistiques */}
      <section style={{ background: '#fff', margin: '40px 0', padding: '40px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, color: '#232f3e', marginBottom: 40 }}>
            Pourquoi vendre sur Papasow ?
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
            <div style={{ textAlign: 'center' }}>
              <BiGlobe size={48} style={{ color: '#e47911', marginBottom: 16 }} />
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>15 Pays</h3>
              <p style={{ color: '#666' }}>Accédez à un marché international</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <BiTrendingUp size={48} style={{ color: '#e47911', marginBottom: 16 }} />
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>+120%</h3>
              <p style={{ color: '#666' }}>Croissance annuelle moyenne</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <BiShield size={48} style={{ color: '#e47911', marginBottom: 16 }} />
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>100% Sécurisé</h3>
              <p style={{ color: '#666' }}>Paiements et données protégés</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <BiBarChart size={48} style={{ color: '#e47911', marginBottom: 16 }} />
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Outils Avancés</h3>
              <p style={{ color: '#666' }}>Analytics et marketing intégrés</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#232f3e', marginBottom: 16 }}>
          Prêt à commencer ?
        </h2>
        <p style={{ fontSize: 18, color: '#666', marginBottom: 32 }}>
          Rejoignez des milliers de vendeurs qui font confiance à Papasow
        </p>
        <Link 
          to="/inscription-vendeur"
          style={{ 
            background: '#e47911', 
            color: 'white', 
            fontWeight: 700, 
            fontSize: 18, 
            padding: '16px 32px', 
            borderRadius: 8, 
            textDecoration: 'none',
            display: 'inline-block'
          }}
                 >
           Commencer maintenant
        </Link>
      </section>
      </div>
     </>
  );
} 