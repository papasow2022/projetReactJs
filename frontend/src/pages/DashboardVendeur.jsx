import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BiTrendingUp, 
  BiTrendingDown, 
  BiPackage, 
  BiDollar, 
  BiUser, 
  BiStar,
  BiCalendar,
  BiBarChart,
  BiCog,
  BiHelpCircle,
  BiBell,
  BiPlus,
  BiCreditCard,
  BiArrowBack,
  BiCheckCircle,
  BiInfoCircle,
  BiXCircle,
  BiHome,
  BiShoppingBag,
  BiMessage,
  BiGift,
  BiRefresh,
  BiImage
} from 'react-icons/bi';
import OnboardingNavigation from '../components/OnboardingNavigation';
import RealtimeMetricsSimple from '../components/RealtimeMetricsSimple';
import ThemeToggleSimple from '../components/ThemeToggleSimple';
import { useThemeColors } from '../contexts/ThemeContext';
import { useRealtime } from '../contexts/RealtimeContext';
import { MetricCard } from '../components/AdvancedCharts';
import { Line } from 'react-chartjs-2';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';

// Import des composants vendeur
import ConfigurationCompte from './ConfigurationCompte';
import CentreFormation from './CentreFormation';
import VendeurBoutique from './VendeurBoutique';
import GestionProduits from './GestionProduits';
import GestionCommandesVendeur from './GestionCommandesVendeur';
import AnalyticsVendeur from './AnalyticsVendeur';
import MessagerieVendeur from './MessagerieVendeur';
import GestionAvisVendeur from './GestionAvisVendeur';
import OutilsPromotionVendeur from './OutilsPromotionVendeur';
import GestionRetoursVendeur from './GestionRetoursVendeur';
import GestionPaiementsVendeur from './GestionPaiementsVendeur';
import OnboardingVendeur from './OnboardingVendeur';
import VendorShopConfig from './VendorShopConfig';
import InventoryManagement from './InventoryManagement';
import PricingManagement from './PricingManagement';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend, Filler);

const DashboardVendeur = () => {
  const colors = useThemeColors();
  const { user } = useAuth();
  const isFBM = (user?.fulfillmentMode || '').toLowerCase() === 'fbm';
  const { realtimeData } = useRealtime();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('7j');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Définition des onglets selon la logique Amazon Seller Central
  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BiHome, component: null },
    { id: 'catalog', label: 'Catalogue', icon: BiPackage, component: GestionProduits },
    { id: 'inventory', label: 'Inventaire', icon: BiPackage, component: InventoryManagement },
    { id: 'pricing', label: 'Tarification', icon: BiDollar, component: PricingManagement },
    { id: 'orders', label: 'Commandes', icon: BiCalendar, component: GestionCommandesVendeur },
    { id: 'advertising', label: 'Publicité', icon: BiTrendingUp, component: OutilsPromotionVendeur },
    { id: 'stores', label: 'Boutiques', icon: BiShoppingBag, component: VendorShopConfig },
    { id: 'growth', label: 'Croissance', icon: BiTrendingUp, component: null },
    { id: 'reports', label: 'Rapports', icon: BiBarChart, component: AnalyticsVendeur },
    { id: 'payments', label: 'Paiements', icon: BiCreditCard, component: GestionPaiementsVendeur },
    { id: 'performance', label: 'Performance', icon: BiStar, component: GestionAvisVendeur },
    { id: 'apps', label: 'Applications', icon: BiCog, component: null }
  ];

  // Détection de l'onglet actif basé sur l'URL (logique Amazon)
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/vendeur/dashboard')) {
      setActiveTab('dashboard');
    } else if (path.includes('/vendeur/catalog') || path.includes('/vendeur/produits')) {
      setActiveTab('catalog');
    } else if (path.includes('/vendeur/inventory') || path.includes('/vendeur/inventaire')) {
      setActiveTab('inventory');
    } else if (path.includes('/vendeur/pricing') || path.includes('/vendeur/tarification')) {
      setActiveTab('pricing');
    } else if (path.includes('/vendeur/orders') || path.includes('/vendeur/commandes')) {
      setActiveTab('orders');
    } else if (path.includes('/vendeur/advertising') || path.includes('/vendeur/publicite')) {
      setActiveTab('advertising');
    } else if (path.includes('/vendeur/stores') || path.includes('/vendeur/boutique')) {
      setActiveTab('stores');
    } else if (path.includes('/vendeur/growth') || path.includes('/vendeur/croissance')) {
      setActiveTab('growth');
    } else if (path.includes('/vendeur/reports') || path.includes('/vendeur/rapports') || path.includes('/vendeur/analytics')) {
      setActiveTab('reports');
    } else if (path.includes('/vendeur/payments') || path.includes('/vendeur/paiements')) {
      setActiveTab('payments');
    } else if (path.includes('/vendeur/performance') || path.includes('/vendeur/avis')) {
      setActiveTab('performance');
    } else if (path.includes('/vendeur/apps') || path.includes('/vendeur/applications')) {
      setActiveTab('apps');
    }
  }, [location.pathname]);

  // Widgets Amazon Seller Central
  const [keyMetrics] = useState({
    dailySales: '€245.50',
    openOrders: '3',
    buyerMessages: '2',
    totalBalance: '€1,234.75'
  });

  const [actionsWidget] = useState([
    { id: 1, type: 'urgent', message: 'Ajoutez votre méthode de paiement', action: 'Ajouter' },
    { id: 2, type: 'warning', message: 'Informations fiscales manquantes', action: 'Compléter' },
    { id: 3, type: 'info', message: 'Configurez votre boutique', action: 'Configurer' }
  ]);

  const [recommendationsWidget] = useState([
    { id: 1, title: 'Améliorez vos annonces', description: 'Activez la publicité pour augmenter vos ventes', action: 'Commencer' },
    { id: 2, title: 'Optimisez vos listes', description: 'Ajoutez des mots-clés pour améliorer la visibilité', action: 'Optimiser' },
    { id: 3, title: 'Rejoignez FBA', description: 'Utilisez Fulfillment by Amazon pour une livraison plus rapide', action: 'En savoir plus' }
  ]);

  const [newsWidget] = useState([
    { id: 1, title: 'Nouvelle politique de retour', date: '2 jours', type: 'policy' },
    { id: 2, title: 'Mise à jour des frais de vente', date: '1 semaine', type: 'fees' },
    { id: 3, title: 'Nouveaux outils d\'analyse', date: '2 semaines', type: 'features' }
  ]);

  const [metrics] = useState({
    ventes: { value: '€2,450', change: '+12.5%', trend: 'up' },
    commandes: { value: '24', change: '+8.3%', trend: 'up' },
    clients: { value: '18', change: '+15.2%', trend: 'up' },
    evaluation: { value: '4.8/5', change: '+0.2', trend: 'up' }
  });

  const [recentOrders] = useState([
    { id: 'ORD-2024-001', client: 'Marie Dupont', montant: '€89.99', statut: 'En préparation', date: 'Aujourd\'hui' },
    { id: 'ORD-2024-002', client: 'Jean Martin', montant: '€124.50', statut: 'Expédié', date: 'Hier' },
    { id: 'ORD-2024-003', client: 'Sophie Bernard', montant: '€67.25', statut: 'Livré', date: 'Il y a 2 jours' }
  ]);

  // FBM-only mock widgets
  const [fbmPerformance] = useState({
    lateShipmentRate: '0.8%',
    preFulfillmentCancelRate: '0.3%',
    validTrackingRate: '97.5%',
    onTimeDeliveryRate: '95.2%'
  });
  const [fbmPayments] = useState({
    nextPayout: '€540.20',
    nextPayoutDate: 'dans 5 jours',
    availableBalance: '€320.00',
    pendingBalance: '€1,080.00'
  });
  const [fbmMessages] = useState({ unread: 2, last24h: 3 });
  const [fbmReturns] = useState({ openReturns: 1, rmaRequired: 0 });
  const [fbmAlerts] = useState([
    { id: 'al-1', level: 'warning', text: 'Taux de suivi valide inférieur à 95% sur 7 jours' }
  ]);
  // FBM performance history (mock)
  const [fbmPerfHistory] = useState({
    last7: { odr: '0.3%', late: '0.8%', cancel: '0.4%', vtr: '97.5%' },
    last30: { odr: '0.5%', late: '1.2%', cancel: '0.6%', vtr: '96.8%' },
    last90: { odr: '0.6%', late: '1.5%', cancel: '0.7%', vtr: '96.2%' }
  });
  const fbmTargets = { odr: '< 1%', late: '< 4%', cancel: '< 2.5%', vtr: '> 95%' };

  const [quickActions] = useState([
    { title: 'Ajouter un produit', icon: BiPlus, link: '/vendeur/produits/ajouter', color: 'primary' },
    { title: 'Gérer les stocks', icon: BiPackage, link: '/vendeur/stocks', color: 'success' },
    { title: 'Voir les commandes', icon: BiCalendar, link: '/vendeur/commandes', color: 'info' },
    { title: 'Analytics', icon: BiBarChart, link: '/vendeur/analytics', color: 'warning' },
    { title: 'Messagerie', icon: BiBell, link: '/vendeur/messagerie', color: 'secondary' },
    { title: 'Gestion des avis', icon: BiStar, link: '/vendeur/avis', color: 'info' },
    { title: 'Promotions', icon: BiTrendingUp, link: '/vendeur/promotions', color: 'success' },
    { title: 'Gestion des retours', icon: BiArrowBack, link: '/vendeur/retours', color: 'warning' },
    { title: 'Gestion des paiements', icon: BiCreditCard, link: '/vendeur/paiements', color: 'primary' },
    { title: 'Configurer ma boutique', icon: BiCog, link: '/vendeur/boutique', color: '#007bff' }
  ]);


  // Fonction pour changer d'onglet
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Mettre à jour l'URL pour refléter l'onglet choisi
    switch (tabId) {
      case 'dashboard':
        navigate('/vendeur/dashboard');
        break;
      case 'catalog':
        navigate('/vendeur/produits');
        break;
      case 'inventory':
        navigate('/vendeur/inventaire');
        break;
      case 'pricing':
        navigate('/vendeur/tarification');
        break;
      case 'orders':
        navigate('/vendeur/commandes');
        break;
      case 'advertising':
        navigate('/vendeur/publicite');
        break;
      case 'stores':
        navigate('/vendeur/boutique');
        break;
      case 'growth':
        navigate('/vendeur/croissance');
        break;
      case 'reports':
        navigate('/vendeur/rapports');
        break;
      case 'payments':
        navigate('/vendeur/paiements');
        break;
      case 'performance':
        navigate('/vendeur/avis');
        break;
      case 'apps':
        navigate('/vendeur/applications');
        break;
      default:
        break;
    }
  };

  // Rendu du composant actif
  const renderActiveComponent = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    if (activeTabData && activeTabData.component) {
      const Component = activeTabData.component;
      return <Component />;
    }
    return null;
  };

  // Rendu du dashboard principal (style Amazon)
  const renderDashboard = () => {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Key Metrics Widget (Amazon style) */}
        <div style={{ 
          backgroundColor: '#ffffff',
          border: '1px solid #d5d9d9',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '400', color: '#232f3e' }}>
            Métriques clés
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#232f3e', marginBottom: '0.25rem' }}>
                {keyMetrics.dailySales}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#565959' }}>Ventes du jour</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#232f3e', marginBottom: '0.25rem' }}>
                {keyMetrics.openOrders}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#565959' }}>Commandes ouvertes</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#232f3e', marginBottom: '0.25rem' }}>
                {keyMetrics.buyerMessages}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#565959' }}>Messages clients</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#232f3e', marginBottom: '0.25rem' }}>
                {keyMetrics.totalBalance}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#565959' }}>Solde total</div>
            </div>
          </div>
        </div>

        {/* Widgets en grille */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {isFBM && (
          <div style={{ gridColumn: '1 / -1', backgroundColor: '#fffbea', border: '1px solid #fde68a', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {fbmAlerts.map(a => (
                <span key={a.id} style={{ backgroundColor: '#fffbeb', border: '1px solid #fed7aa', color: '#92400e', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.8rem' }}>
                  {a.text}
                </span>
              ))}
            </div>
          </div>
          )}
          
          {/* Actions Widget */}
          <div style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #d5d9d9',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '400', color: '#232f3e' }}>
              Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {actionsWidget.map((action) => (
                <div key={action.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: action.type === 'urgent' ? '#fef2f2' : action.type === 'warning' ? '#fffbeb' : '#f0f9ff',
                  borderRadius: '4px',
                  border: `1px solid ${action.type === 'urgent' ? '#fecaca' : action.type === 'warning' ? '#fed7aa' : '#bae6fd'}`
                }}>
                  <span style={{ fontSize: '0.9rem', color: '#232f3e' }}>{action.message}</span>
                  <button style={{
                    backgroundColor: '#ff9900',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }} onClick={() => {
                    const msg = (action.message || '').toLowerCase();
                    if (msg.includes('boutique')) {
                      handleTabChange('stores');
                    } else if (msg.includes('paiement')) {
                      handleTabChange('payments');
                    } else if (msg.includes('fiscales')) {
                      handleTabChange('reports');
                    }
                  }}>
                    {action.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Widget */}
          <div style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #d5d9d9',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '400', color: '#232f3e' }}>
              Recommandations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recommendationsWidget
                .filter((rec) => !(isFBM && (rec.title || '').toLowerCase().includes('fba')))
                .map((rec) => (
                <div key={rec.id} style={{
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  border: '1px solid #e9ecef'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '600', color: '#232f3e' }}>
                    {rec.title}
                  </h4>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: '#565959' }}>
                    {rec.description}
                  </p>
                  <button style={{
                    backgroundColor: 'transparent',
                    color: '#0066c0',
                    border: '1px solid #0066c0',
                    borderRadius: '4px',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}>
                    {rec.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* News Widget */}
          <div style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #d5d9d9',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '400', color: '#232f3e' }}>
              Actualités
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {newsWidget.map((news) => (
                <div key={news.id} style={{
                  padding: '0.75rem',
                  borderBottom: '1px solid #e9ecef'
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#232f3e', marginBottom: '0.25rem' }}>
                    {news.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#565959' }}>
                    {news.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isFBM && (
          <div style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #d5d9d9',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '400', color: '#232f3e' }}>
              Performance expédition (FBM)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#565959' }}>ODR (objectif {fbmTargets.odr})</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#232f3e' }}>{fbmPerfHistory.last30.odr}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#565959' }}>Retards expédition (objectif {fbmTargets.late})</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#232f3e' }}>{fbmPerfHistory.last30.late}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#565959' }}>Annulations avant expédition (objectif {fbmTargets.cancel})</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#232f3e' }}>{fbmPerfHistory.last30.cancel}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#565959' }}>Suivi valide (objectif {fbmTargets.vtr})</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#232f3e' }}>{fbmPerfHistory.last30.vtr}</div>
              </div>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#565959' }}>
              <div>7j: ODR {fbmPerfHistory.last7.odr} · Retards {fbmPerfHistory.last7.late} · Annulations {fbmPerfHistory.last7.cancel} · Suivi {fbmPerfHistory.last7.vtr}</div>
              <div>90j: ODR {fbmPerfHistory.last90.odr} · Retards {fbmPerfHistory.last90.late} · Annulations {fbmPerfHistory.last90.cancel} · Suivi {fbmPerfHistory.last90.vtr}</div>
            </div>
          </div>
          )}

          {isFBM && (
          <div style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #d5d9d9',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '400', color: '#232f3e' }}>
              Paramètres d'expédition (FBM)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#565959' }}>Handling Time défaut</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#232f3e' }}>2 jours</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#565959' }}>Modèles d'expédition actifs</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#232f3e' }}>Standard FR, Express FR</div>
              </div>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#565959' }}>
              Zones et tarifs paramétrés. Mode vacances: inactif.
            </div>
          </div>
          )}

          {isFBM && (
          <div style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #d5d9d9',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '400', color: '#232f3e' }}>
              Paiements (FBM)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#565959' }}>Prochain versement</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#232f3e' }}>{fbmPayments.nextPayout}</div>
                <div style={{ fontSize: '0.8rem', color: '#565959' }}>{fbmPayments.nextPayoutDate}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#565959' }}>Solde disponible</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#232f3e' }}>{fbmPayments.availableBalance}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#565959' }}>Solde en attente</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#232f3e' }}>{fbmPayments.pendingBalance}</div>
              </div>
            </div>
          </div>
          )}

          {isFBM && (
          <div style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #d5d9d9',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '400', color: '#232f3e' }}>
              Messagerie acheteurs (FBM)
            </h3>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#565959' }}>Non lus</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#232f3e' }}>{fbmMessages.unread}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#565959' }}>Dernières 24h</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#232f3e' }}>{fbmMessages.last24h}</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#565959' }}>SLA réponse &lt; 24h</div>
            </div>
          </div>
          )}

          {isFBM && (
          <div style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #d5d9d9',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '400', color: '#232f3e' }}>
              Retours (FBM)
            </h3>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#565959' }}>Retours ouverts</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#232f3e' }}>{fbmReturns.openReturns}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#565959' }}>RMA requis</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#232f3e' }}>{fbmReturns.rmaRequired}</div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#565959' }}>Motifs: défaut, taille, changement d'avis</div>
            </div>
          </div>
          )}

          {/* Commandes récentes */}
          <div style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #d5d9d9',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '400', color: '#232f3e' }}>
              Commandes récentes
            </h3>
            {isFBM && (
            <div style={{ marginBottom: '1rem' }}>
              <button style={{
                backgroundColor: 'transparent',
                color: '#0066c0',
                border: '1px solid #0066c0',
                borderRadius: '4px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }} onClick={() => {
                const rows = recentOrders.map(o => ({ id: o.id, client: o.client, montant: o.montant, statut: o.statut, date: o.date }));
                try {
                  const { exportToCsv } = require('../utils/csvExport');
                  exportToCsv('commandes_fbm.csv', rows);
                } catch (e) {
                  console.error(e);
                }
              }}>Exporter CSV</button>
            </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentOrders.map((order, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  border: '1px solid #e9ecef'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#232f3e', fontSize: '0.9rem' }}>{order.id}</div>
                    <div style={{ fontSize: '0.8rem', color: '#565959' }}>{order.client}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: '#232f3e', fontSize: '0.9rem' }}>{order.montant}</div>
                    <div style={{ fontSize: '0.8rem', color: '#565959' }}>{order.date}</div>
                  </div>
                  <div style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '500',
                    backgroundColor: order.statut === 'Livré' ? '#d4edda' : order.statut === 'Expédié' ? '#d1ecf1' : '#fff3cd',
                    color: order.statut === 'Livré' ? '#155724' : order.statut === 'Expédié' ? '#0c5460' : '#856404'
                  }}>
                    {order.statut}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="dashboard-vendeur" 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f3f3f3',
        color: '#232f3e',
        display: 'flex'
      }}
    >
      {/* Sidebar Amazon-style */}
      <div 
        style={{ 
          width: '280px',
          backgroundColor: '#232f3e',
          color: '#ffffff',
          position: 'fixed',
          height: '100vh',
          overflowY: 'hidden',
          zIndex: 1000
        }}
      >
        {/* Logo/Header */}
        <div style={{ padding: '1rem', borderBottom: '1px solid #37475a' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
            papasow Seller
          </h2>
        </div>

        {/* Navigation principale */}
        <nav style={{ padding: '1rem 0' }}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#37475a' : 'transparent',
                borderLeft: activeTab === tab.id ? '3px solid #ff9900' : '3px solid transparent',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = '#37475a';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <tab.icon style={{ fontSize: '1.1rem', color: activeTab === tab.id ? '#ff9900' : '#ffffff' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: activeTab === tab.id ? '600' : '400' }}>
                {tab.label}
              </span>
            </div>
          ))}
        </nav>

        {/* Widget Métriques juste après Applications */}
        <div style={{ padding: '0 1.5rem 1rem 1.5rem' }}>
          <RealtimeMetricsSimple compact={true} />
        </div>
      </div>

      {/* Contenu principal */}
      <div style={{ 
        marginLeft: '280px', 
        flex: 1,
        backgroundColor: '#f3f3f3',
        minHeight: '100vh'
      }}>
        {/* Header principal */}
        <div style={{ 
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #d5d9d9',
          padding: '1rem 2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.5rem', 
            fontWeight: '400', 
            color: '#232f3e' 
          }}>
            {tabs.find(tab => tab.id === activeTab)?.label || 'Tableau de bord'}
          </h1>
        </div>
            
        {/* Contenu */}
        <div style={{ padding: '2rem' }}>
          {activeTab === 'dashboard' ? renderDashboard() : renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardVendeur;