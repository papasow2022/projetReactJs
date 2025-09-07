import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  BiXCircle
} from 'react-icons/bi';
import OnboardingNavigation from '../components/OnboardingNavigation';
import RealtimeMetricsSimple from '../components/RealtimeMetricsSimple';
import ThemeToggleSimple from '../components/ThemeToggleSimple';
import { useThemeColors } from '../contexts/ThemeContext';
import { useRealtime } from '../contexts/RealtimeContext';
import { 
  RevenueChart, 
  ConversionFunnelChart, 
  ProductPerformanceChart, 
  MetricsRadarChart,
  MetricCard 
} from '../components/AdvancedCharts';
import PerformanceMetricsSimple from '../components/PerformanceMetricsSimple';
import AIPredictionsSimple from '../components/AIPredictionsSimple';
import OrderWorkflowSimple from '../components/OrderWorkflowSimple';
import MarketingToolsSimple from '../components/MarketingToolsSimple';
import ExternalIntegrationsSimple from '../components/ExternalIntegrationsSimple';
import { Line } from 'react-chartjs-2';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const DashboardVendeur = () => {
  const colors = useThemeColors();
  const { realtimeData } = useRealtime();
  const [selectedPeriod, setSelectedPeriod] = useState('7j');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'Votre compte a été validé avec succès', time: '2h' },
    { id: 2, type: 'info', message: 'Nouvelle commande reçue #ORD-2024-001', time: '4h' },
    { id: 3, type: 'warning', message: 'Stock faible pour "Chaussures Nike Air Max"', time: '6h' }
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

  const [quickActions] = useState([
    { title: 'Ajouter un produit', icon: BiPlus, link: '/vendeur/produits/ajouter', color: 'primary' },
    { title: 'Gérer les stocks', icon: BiPackage, link: '/vendeur/stocks', color: 'success' },
    { title: 'Voir les commandes', icon: BiCalendar, link: '/vendeur/commandes', color: 'info' },
    { title: 'Analytics', icon: BiBarChart, link: '/vendeur/analytics', color: 'warning' },
    { title: 'Messagerie', icon: BiBell, link: '/vendeur/messagerie', color: 'secondary' },
    { title: 'Gestion des avis', icon: BiStar, link: '/vendeur/avis', color: 'info' },
    { title: 'Promotions', icon: BiTrendingUp, link: '/vendeur/promotions', color: 'success' },
    { title: 'Gestion des retours', icon: BiArrowBack, link: '/vendeur/retours', color: 'warning' },
    { title: 'Gestion des paiements', icon: BiCreditCard, link: '/vendeur/paiements', color: 'primary' }
  ]);

  // MOCK DATA pour analytics avancés
  const analytics = {
    trafic: [120, 150, 180, 200, 170, 210, 250],
    clics: [40, 60, 80, 90, 70, 100, 120],
    conversions: [10, 15, 20, 18, 16, 22, 25],
    panierMoyen: 52.3,
    produitsVus: [
      { name: 'Nike Air Max', vues: 120 },
      { name: 'Adidas Superstar', vues: 98 },
      { name: 'Puma RS-X', vues: 75 },
      { name: 'Veste Nike', vues: 60 },
      { name: 'Sac Adidas', vues: 55 }
    ],
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  };

  // MOCK analytics détaillés
  const avisDetails = [
    { user: 'Fatou', note: 5, commentaire: 'Service impeccable, vendeur très réactif !', date: '2024-04-10', motifRetour: null },
    { user: 'Moussa', note: 4, commentaire: 'Livraison rapide, produits conformes.', date: '2024-03-22', motifRetour: null },
    { user: 'Yann', note: 2, commentaire: 'Produit trop petit, retour effectué.', date: '2024-03-15', motifRetour: 'Taille' },
    { user: 'Sophie', note: 3, commentaire: 'Déçu par la couleur, retour.', date: '2024-03-10', motifRetour: 'Couleur' }
  ];
  const tauxRetour = Math.round((avisDetails.filter(a => a.motifRetour).length / avisDetails.length) * 100);
  const tauxSatisfaction = Math.round((avisDetails.filter(a => a.note >= 4).length / avisDetails.length) * 100);
  const motifsRetour = avisDetails.filter(a => a.motifRetour).reduce((acc, a) => {
    acc[a.motifRetour] = (acc[a.motifRetour] || 0) + 1;
    return acc;
  }, {});

  // Ajout d'une alerte de stock bas (mock)
  useEffect(() => {
    // Supposons que getVendorProducts est accessible ici ou via props/context
    const vendorProducts = (window.getVendorProductsMock && user?.vendorId) ? window.getVendorProductsMock(user.vendorId) : [];
    const lowStock = vendorProducts.filter(p => p.stock > 0 && p.stock < 5);
    if (lowStock.length > 0) {
      setNotifications(prev => [
        ...prev,
        { id: Date.now(), type: 'warning', message: `Stock faible pour ${lowStock[0].name}`, time: 'Maintenant' }
      ]);
    }
  }, []);

  // Notification en temps réel (mock)
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(prev => [
        ...prev,
        { id: Date.now(), type: 'info', message: 'Nouvelle commande reçue #ORD-2024-NEW', time: 'Maintenant' }
      ]);
    }, 5000); // Simule une nouvelle commande après 5s
    return () => clearTimeout(timer);
  }, []);

  // Fonction d'export CSV (mock)
  const exportCSV = () => {
    const rows = [
      ['Client', 'Note', 'Commentaire', 'Date', 'Motif retour'],
      ...avisDetails.map(a => [a.user, a.note, a.commentaire, a.date, a.motifRetour || '-'])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(';')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'avis_vendeur.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="dashboard-vendeur" 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: colors.background,
        color: colors.text,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Header */}
      <div 
        style={{ 
          backgroundColor: colors.card, 
          borderBottom: `1px solid ${colors.border}`, 
          padding: '1rem 0',
          boxShadow: `0 2px 4px ${colors.shadow}`
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '1.8rem', 
                fontWeight: '600', 
                color: colors.text 
              }}>
                Dashboard Vendeur
              </h1>
              <p style={{ 
                margin: '0.5rem 0 0 0', 
                color: colors.textSecondary, 
                fontSize: '0.9rem' 
              }}>
                Bienvenue sur votre espace vendeur papasow
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {/* Métriques temps réel compactes */}
              <RealtimeMetricsSimple compact={true} />
              
              {/* Sélecteur de thème */}
              <ThemeToggleSimple variant="dropdown" size="sm" />
              
              {/* Notifications */}
              <div style={{ position: 'relative' }}>
                <BiBell style={{ 
                  fontSize: '1.5rem', 
                  color: colors.textSecondary, 
                  cursor: 'pointer' 
                }} />
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: colors.danger,
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {notifications.length}
                </span>
              </div>
              
              {/* Paramètres */}
              <Link to="/vendeur/parametres" style={{ textDecoration: 'none' }}>
                <BiCog style={{ 
                  fontSize: '1.5rem', 
                  color: colors.textSecondary, 
                  cursor: 'pointer' 
                }} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 0' }}>
        {/* Navigation d'onboarding */}
        <OnboardingNavigation />
        
        {/* Période de sélection */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ color: '#666', fontWeight: '500' }}>Période :</span>
            {['7j', '30j', '90j', '1an'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                style={{
                  padding: '0.5rem 1rem',
                  border: selectedPeriod === period ? '2px solid #232f3e' : '1px solid #ddd',
                  backgroundColor: selectedPeriod === period ? '#232f3e' : 'white',
                  color: selectedPeriod === period ? 'white' : '#666',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Métriques principales avec nouvelles cartes animées */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-md-6">
            <MetricCard
              title="Ventes totales"
              value={metrics.ventes.value}
              change={metrics.ventes.change}
              icon={<BiDollar size={24} />}
              color="success"
              trend={metrics.ventes.trend}
            />
          </div>
          <div className="col-lg-3 col-md-6">
            <MetricCard
              title="Commandes"
              value={metrics.commandes.value}
              change={metrics.commandes.change}
              icon={<BiPackage size={24} />}
              color="primary"
              trend={metrics.commandes.trend}
            />
          </div>
          <div className="col-lg-3 col-md-6">
            <MetricCard
              title="Nouveaux clients"
              value={metrics.clients.value}
              change={metrics.clients.change}
              icon={<BiUser size={24} />}
              color="warning"
              trend={metrics.clients.trend}
            />
          </div>
          <div className="col-lg-3 col-md-6">
            <MetricCard
              title="Évaluation moyenne"
              value={metrics.evaluation.value}
              change={metrics.evaluation.change}
              icon={<BiStar size={24} />}
              color="info"
              trend={metrics.evaluation.trend}
            />
          </div>
        </div>

        {/* Métriques temps réel complètes */}
        <div className="row mb-4">
          <div className="col-12">
            <RealtimeMetricsSimple />
          </div>
        </div>

        {/* Métriques de performance avancées */}
        <div className="row mb-4">
          <div className="col-12">
            <PerformanceMetricsSimple period={selectedPeriod} />
          </div>
        </div>

        {/* Prédictions IA */}
        <div className="row mb-4">
          <div className="col-12">
            <AIPredictionsSimple period={selectedPeriod} />
          </div>
        </div>

        {/* Workflow des commandes */}
        <div className="row mb-4">
          <div className="col-12">
            <OrderWorkflowSimple />
          </div>
        </div>

        {/* Outils de marketing */}
        <div className="row mb-4">
          <div className="col-12">
            <MarketingToolsSimple />
          </div>
        </div>

        {/* Intégrations externes */}
        <div className="row mb-4">
          <div className="col-12">
            <ExternalIntegrationsSimple />
          </div>
        </div>

        {/* Graphiques avancés */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div 
              className="card border-0 shadow-sm"
              style={{ 
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="card-body">
                <h4 style={{ color: colors.text, marginBottom: '1.5rem' }}>
                  Évolution des revenus avec prédictions IA
                </h4>
                <RevenueChart 
                  data={{
                    labels: analytics.labels,
                    revenue: analytics.trafic.map(v => v * 50) // Simuler des revenus
                  }}
                  predictions={analytics.trafic.slice(-3).map(v => v * 60)} // Prédictions IA
                  period={selectedPeriod}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div 
              className="card border-0 shadow-sm"
              style={{ 
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="card-body">
                <h4 style={{ color: colors.text, marginBottom: '1.5rem' }}>
                  Entonnoir de conversion
                </h4>
                <ConversionFunnelChart 
                  data={{
                    labels: ['Visiteurs', 'Pages vues', 'Ajouts panier', 'Commandes', 'Paiements'],
                    values: [1000, 750, 300, 150, 120]
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div 
              className="card border-0 shadow-sm"
              style={{ 
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="card-body">
                <h4 style={{ color: colors.text, marginBottom: '1.5rem' }}>
                  Performance des produits
                </h4>
                <ProductPerformanceChart 
                  data={{
                    labels: ['Nike Air Max', 'Adidas Superstar', 'Puma RS-X', 'Veste Nike', 'Sac Adidas'],
                    sales: [120, 98, 75, 60, 55],
                    views: [450, 380, 320, 280, 250]
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div 
              className="card border-0 shadow-sm"
              style={{ 
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="card-body">
                <h4 style={{ color: colors.text, marginBottom: '1.5rem' }}>
                  Métriques de performance
                </h4>
                <MetricsRadarChart 
                  data={{
                    labels: ['Performance', 'Qualité', 'Service', 'Prix', 'Innovation'],
                    current: [85, 90, 78, 82, 75],
                    targets: [90, 95, 85, 88, 80]
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Produits les plus vus */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Produits les plus vus</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {analytics.produitsVus.map((prod, idx) => (
              <li key={prod.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 8 }}>
                <span style={{ fontWeight: '600', width: 30, color: '#232f3e' }}>{idx + 1}.</span>
                <span style={{ flex: 1 }}>{prod.name}</span>
                <span style={{ color: '#17a2b8', fontWeight: '500' }}>{prod.vues} vues</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Analytics détaillés */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Analytics détaillés</h4>
            <button className="btn btn-outline-dark btn-sm" onClick={exportCSV}><i className="bi bi-download me-2"></i>Exporter les données</button>
          </div>
          <div className="mb-2">Taux de retour : <b>{tauxRetour}%</b></div>
          <div className="mb-2">Taux de satisfaction client : <b>{tauxSatisfaction}%</b></div>
          <div className="mb-2">Motifs de retour :
            <ul>
              {Object.entries(motifsRetour).map(([motif, count]) => (
                <li key={motif}>{motif} : {count}</li>
              ))}
            </ul>
          </div>
          <div className="mb-2">Avis clients :</div>
          <table className="table table-sm">
            <thead><tr><th>Client</th><th>Note</th><th>Commentaire</th><th>Date</th><th>Motif retour</th></tr></thead>
            <tbody>
              {avisDetails.map((a, i) => (
                <tr key={i}><td>{a.user}</td><td>{a.note}</td><td>{a.commentaire}</td><td>{a.date}</td><td>{a.motifRetour || '-'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Commandes récentes */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>Commandes récentes</h3>
              <Link to="/vendeur/commandes" style={{ 
                color: '#007bff', 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Voir toutes →
              </Link>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentOrders.map(order => (
                <div key={order.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{order.id}</div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>{order.client}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: '#28a745' }}>{order.montant}</div>
                    <div style={{ 
                      fontSize: '0.8rem', 
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: order.statut === 'En préparation' ? '#fff3cd' : 
                                      order.statut === 'Expédié' ? '#d1ecf1' : '#d4edda',
                      color: order.statut === 'En préparation' ? '#856404' : 
                             order.statut === 'Expédié' ? '#0c5460' : '#155724'
                    }}>
                      {order.statut}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions rapides et notifications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Actions rapides */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600' }}>Actions rapides</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {quickActions.map((action, index) => (
                  <Link 
                    key={index}
                    to={action.link} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem',
                      padding: '0.75rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      color: '#333',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    <action.icon style={{ fontSize: '1.2rem', color: action.color ? (action.color.startsWith('#') ? action.color : undefined) : '#232f3e' }} />
                    <span>{action.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600' }}>Notifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {notifications.map(notification => (
                  <div 
                    key={notification.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      backgroundColor: notification.type === 'success' ? '#d4edda' : 
                                         notification.type === 'info' ? '#e1f5fe' : 
                                         notification.type === 'warning' ? '#fff3cd' : '#f8d7da',
                      color: notification.type === 'success' ? '#155724' : 
                             notification.type === 'info' ? '#0c5460' : 
                             notification.type === 'warning' ? '#856404' : '#721c24'
                    }}
                  >
                    {notification.type === 'success' && <BiCheckCircle style={{ fontSize: '1.2rem', color: '#28a745' }} />}
                    {notification.type === 'info' && <BiInfoCircle style={{ fontSize: '1.2rem', color: '#17a2b8' }} />}
                    {notification.type === 'warning' && <BiXCircle style={{ fontSize: '1.2rem', color: '#ffc107' }} />}
                    <div>
                      <p style={{ margin: 0, fontWeight: '500' }}>{typeof notification.message === 'string' ? notification.message : JSON.stringify(notification.message)}</p>
                      <small style={{ color: '#666' }}>{notification.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardVendeur;