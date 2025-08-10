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
  BiPlus
} from 'react-icons/bi';
import OnboardingNavigation from '../components/OnboardingNavigation';
import { Line } from 'react-chartjs-2';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const DashboardVendeur = () => {
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
    { title: 'Analytics', icon: BiBarChart, link: '/vendeur/analytics', color: 'warning' }
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
    <div className="dashboard-vendeur" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', padding: '1rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '600', color: '#232f3e' }}>
                Dashboard Vendeur
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                Bienvenue sur votre espace vendeur papasow
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <BiBell style={{ fontSize: '1.5rem', color: '#666', cursor: 'pointer' }} />
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: '#e74c3c',
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
              <Link to="/vendeur/parametres" style={{ textDecoration: 'none' }}>
                <BiCog style={{ fontSize: '1.5rem', color: '#666', cursor: 'pointer' }} />
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

        {/* Métriques principales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <BiDollar style={{ fontSize: '2rem', color: '#28a745' }} />
              <span style={{ 
                color: metrics.ventes.trend === 'up' ? '#28a745' : '#dc3545',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                {metrics.ventes.change}
              </span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '600' }}>
              {metrics.ventes.value}
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Ventes totales</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <BiPackage style={{ fontSize: '2rem', color: '#007bff' }} />
              <span style={{ 
                color: metrics.commandes.trend === 'up' ? '#28a745' : '#dc3545',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                {metrics.commandes.change}
              </span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '600' }}>
              {metrics.commandes.value}
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Commandes</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <BiUser style={{ fontSize: '2rem', color: '#ffc107' }} />
              <span style={{ 
                color: metrics.clients.trend === 'up' ? '#28a745' : '#dc3545',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                {metrics.clients.change}
              </span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '600' }}>
              {metrics.clients.value}
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Nouveaux clients</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <BiStar style={{ fontSize: '2rem', color: '#fd7e14' }} />
              <span style={{ 
                color: metrics.evaluation.trend === 'up' ? '#28a745' : '#dc3545',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                {metrics.evaluation.change}
              </span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '600' }}>
              {metrics.evaluation.value}
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Évaluation moyenne</p>
          </div>
          {/* Nouvelle métrique : Trafic */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <BiBarChart style={{ fontSize: '2rem', color: '#17a2b8' }} />
              <span style={{ color: '#17a2b8', fontSize: '0.9rem', fontWeight: '500' }}>+15%</span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '600' }}>{analytics.trafic.reduce((a, b) => a + b, 0)}</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Visites (7j)</p>
          </div>
          {/* Nouvelle métrique : Taux de clics */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <BiTrendingUp style={{ fontSize: '2rem', color: '#6610f2' }} />
              <span style={{ color: '#6610f2', fontSize: '0.9rem', fontWeight: '500' }}>+8%</span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '600' }}>{Math.round((analytics.clics.reduce((a, b) => a + b, 0) / analytics.trafic.reduce((a, b) => a + b, 0)) * 100)}%</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Taux de clics</p>
          </div>
          {/* Nouvelle métrique : Taux de conversion */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <BiTrendingDown style={{ fontSize: '2rem', color: '#e83e8c' }} />
              <span style={{ color: '#e83e8c', fontSize: '0.9rem', fontWeight: '500' }}>+2%</span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '600' }}>{Math.round((analytics.conversions.reduce((a, b) => a + b, 0) / analytics.clics.reduce((a, b) => a + b, 0)) * 100)}%</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Taux de conversion</p>
          </div>
          {/* Nouvelle métrique : Panier moyen */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <BiDollar style={{ fontSize: '2rem', color: '#20c997' }} />
              <span style={{ color: '#20c997', fontSize: '0.9rem', fontWeight: '500' }}>+1.5%</span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '600' }}>€{analytics.panierMoyen}</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Panier moyen</p>
          </div>
        </div>

        {/* Graphiques d'évolution */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h4 style={{ marginBottom: '1rem' }}>Évolution du trafic</h4>
            <Line data={{
              labels: analytics.labels,
              datasets: [{
                label: 'Visites',
                data: analytics.trafic,
                borderColor: '#17a2b8',
                backgroundColor: 'rgba(23,162,184,0.1)',
                tension: 0.4
              }]
            }} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h4 style={{ marginBottom: '1rem' }}>Évolution des ventes</h4>
            <Line data={{
              labels: analytics.labels,
              datasets: [{
                label: 'Conversions',
                data: analytics.conversions,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40,167,69,0.1)',
                tension: 0.4
              }]
            }} options={{ responsive: true, plugins: { legend: { display: false } } }} />
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
                    {notification.type === 'warning' && <BiWarning style={{ fontSize: '1.2rem', color: '#ffc107' }} />}
                    <div>
                      <p style={{ margin: 0, fontWeight: '500' }}>{notification.message}</p>
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