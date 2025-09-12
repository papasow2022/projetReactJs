import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAudit } from '../contexts/AuditContext';
import { useProducts } from '../contexts/ProductsContext';
import { useVendor } from '../contexts/VendorContext';
import { 
  BiUser, 
  BiPackage, 
  BiShoppingBag, 
  BiStar, 
  BiCreditCard, 
  BiTrendingUp,
  BiBarChart,
  BiSupport,
  BiCog,
  BiBell,
  BiCheckCircle,
  BiXCircle,
  BiInfoCircle,
  BiCalendar,
  BiDollar,
  BiGift,
  BiBrain,
  BiTime
} from 'react-icons/bi';

export default function AdminDashboard() {
  const { allProducts } = useProducts();
  const { vendors, lastUpdate } = useVendor();
  const [stats, setStats] = useState({
    totalVendors: 0,
    activeVendors: 0,
    pendingVendors: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalReviews: 0,
    pendingReviews: 0,
    totalCommissions: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const { addAuditEntry, entries } = useAudit();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [entries, vendors, allProducts]);

  // Mettre à jour les statistiques dynamiquement depuis les contextes
  useEffect(() => {
    // Statistiques des produits
    const totalProducts = Array.isArray(allProducts) ? allProducts.length : 0;
    const pendingProducts = Array.isArray(allProducts) ? allProducts.filter(p => p.status === 'pending').length : 0;
    
    // Statistiques des vendeurs
    const vendorList = Object.values(vendors || {});
    const totalVendors = vendorList.length;
    const activeVendors = vendorList.filter(v => v.status === 'approved' || !v.status).length; // Inclure les vendeurs sans statut
    const pendingVendors = vendorList.filter(v => v.status === 'pending').length;
    
    
    // Statistiques des commandes (depuis localStorage)
    const allOrders = [];
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.forEach(user => {
        const userOrders = JSON.parse(localStorage.getItem(`commandes_${user.email}`) || '[]');
        allOrders.push(...userOrders);
      });
    } catch (e) {
      console.error('Erreur chargement commandes:', e);
    }
    
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    setStats(prev => ({ 
      ...prev, 
      totalVendors,
      activeVendors,
      pendingVendors,
      totalProducts, 
      pendingProducts,
      totalOrders,
      totalRevenue
    }));
    
    // Mettre à jour les notifications
    setNotifications(prev => [
      { id: 1, message: `${pendingVendors} vendeurs en attente de validation`, type: pendingVendors > 0 ? 'warning' : 'info', time: 'Maintenant' },
      { id: 2, message: `${pendingProducts} produits en attente de modération`, type: pendingProducts > 0 ? 'warning' : 'info', time: 'Maintenant' },
      { id: 3, message: `${totalOrders} commandes totales`, type: 'info', time: 'Maintenant' }
    ]);
  }, [allProducts, vendors]);

  const loadUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };


  const loadDashboardData = () => {
    // Charger l'activité récente depuis l'audit
    const recentAuditEntries = entries.slice(0, 5).map(entry => {
      const timeAgo = new Date(entry.createdAt);
      const now = new Date();
      const diffHours = Math.floor((now - timeAgo) / (1000 * 60 * 60));
      const timeStr = diffHours < 1 ? 'Maintenant' : `${diffHours}h`;
      
      return {
        type: entry.subject?.type || 'system',
        message: typeof entry.details === 'object' && entry.details !== null 
          ? `${entry.details.productName || 'Produit'} - ${entry.details.vendor || 'Vendeur'}` 
          : entry.details || 'Action système',
        time: timeStr,
        status: entry.action.includes('approve') ? 'success' : 
                entry.action.includes('reject') ? 'warning' : 'info'
      };
    });
    
    setRecentActivity(recentAuditEntries);
  };

  const quickActions = [
    { title: 'Gérer les vendeurs', icon: BiUser, link: '/admin/vendors', color: 'primary', count: stats.totalVendors },
    { title: 'Modérer les produits', icon: BiPackage, link: '/admin/products', color: 'warning', count: stats.pendingProducts },
    { title: 'Gérer les commandes', icon: BiShoppingBag, link: '/admin/orders', color: 'success' },
    { title: 'Modérer les avis', icon: BiStar, link: '/admin/reviews', color: 'info', count: stats.pendingReviews },
    { title: 'Gérer les paiements', icon: BiCreditCard, link: '/admin/payments', color: 'secondary' },
    { title: 'Analytics', icon: BiBarChart, link: '/admin/analytics', color: 'dark' },
    { title: 'Analytics Avancés', icon: BiBarChart, link: '/admin/advanced-analytics', color: 'dark' },
    { title: 'Gestion Inventaire', icon: BiPackage, link: '/admin/inventory', color: 'info' },
    { title: 'Promotions & Coupons', icon: BiGift, link: '/admin/promotions', color: 'success' },
    { title: 'Gestion Logistique', icon: BiPackage, link: '/admin/logistics', color: 'info' },
    { title: 'IA & Recommandations', icon: BiBrain, link: '/admin/ai-recommendations', color: 'primary' },
    { title: 'Support client', icon: BiSupport, link: '/admin/support', color: 'danger' },
    { title: 'Configuration', icon: BiCog, link: '/admin/settings', color: 'light' },
    // Afficher "Gestion utilisateurs" seulement si l'utilisateur est superadmin
    ...(user?.roles?.includes('superadmin') ? [{ title: 'Gestion utilisateurs', icon: BiUser, link: '/admin/users', color: 'primary' }] : [])
  ];

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Admin - Tableau de bord</h1>
          <p className="text-muted mb-0">Vue d'ensemble de la plateforme Papasow</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <BiBell className="me-2" />
            Notifications ({notifications.length})
          </button>
          <button className="btn btn-primary">
            <BiTrendingUp className="me-2" />
            Rapport quotidien
          </button>
          {lastUpdate && (
            <small className="text-muted d-flex align-items-center">
              <BiTime className="me-1" />
              Dernière MAJ: {lastUpdate.toLocaleTimeString()}
            </small>
          )}
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <BiUser className="text-primary" style={{ fontSize: '2rem' }} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="card-title text-muted mb-1">Vendeurs</h6>
                  <h4 className="mb-0">{stats.totalVendors}</h4>
                  <small className="text-success">
                    <BiCheckCircle className="me-1" />
                    {stats.activeVendors} actifs
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <BiPackage className="text-warning" style={{ fontSize: '2rem' }} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="card-title text-muted mb-1">Produits</h6>
                  <h4 className="mb-0">{stats.totalProducts}</h4>
                  <small className="text-warning">
                    <BiInfoCircle className="me-1" />
                    {stats.pendingProducts} en attente
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <BiShoppingBag className="text-success" style={{ fontSize: '2rem' }} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="card-title text-muted mb-1">Commandes</h6>
                  <h4 className="mb-0">{stats.totalOrders}</h4>
                  <small className="text-success">
                    <BiTrendingUp className="me-1" />
                    +12% ce mois
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <BiDollar className="text-info" style={{ fontSize: '2rem' }} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="card-title text-muted mb-1">Revenus</h6>
                  <h4 className="mb-0">€{stats.totalRevenue.toLocaleString()}</h4>
                  <small className="text-info">
                    <BiTrendingUp className="me-1" />
                    Commission: €{stats.totalCommissions.toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Actions rapides */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Actions rapides</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {quickActions.map((action, index) => (
                  <div key={index} className="col-md-6 col-lg-4">
                    <Link to={action.link} className="text-decoration-none">
                      <div className={`card border-0 shadow-sm h-100 action-card action-${action.color}`}>
                        <div className="card-body text-center">
                          <div className="position-relative">
                            <action.icon className={`text-${action.color}`} style={{ fontSize: '2.5rem' }} />
                            {action.count && (
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {action.count}
                              </span>
                            )}
                          </div>
                          <h6 className="card-title mt-3 mb-2">{action.title}</h6>
                          <p className="card-text text-muted small mb-0">
                            {action.count ? (action.title === 'Gérer les vendeurs' ? `${action.count} vendeurs` : `${action.count} en attente`) : 'Gérer et surveiller'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activité récente et notifications */}
        <div className="col-lg-4">
          <div className="row g-4">
            {/* Activité récente */}
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h6 className="mb-0">Activité récente</h6>
                </div>
                <div className="card-body">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="d-flex align-items-start mb-3">
                      <div className="flex-shrink-0 me-3">
                        {activity.status === 'success' && <BiCheckCircle className="text-success" />}
                        {activity.status === 'warning' && <BiXCircle className="text-warning" />}
                        {activity.status === 'pending' && <BiInfoCircle className="text-info" />}
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1 small">{activity.message}</p>
                        <small className="text-muted">
                          <BiCalendar className="me-1" />
                          {activity.time}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h6 className="mb-0">Notifications importantes</h6>
                </div>
                <div className="card-body">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="d-flex align-items-start mb-3">
                      <div className="flex-shrink-0 me-3">
                        {notification.type === 'warning' && <BiXCircle className="text-warning" />}
                        {notification.type === 'info' && <BiInfoCircle className="text-info" />}
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1 small">{notification.message}</p>
                        <small className="text-muted">
                          <BiCalendar className="me-1" />
                          {notification.time}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .action-card {
          transition: transform 0.2s ease-in-out;
        }
        .action-card:hover {
          transform: translateY(-2px);
        }
        .action-primary { border-left: 4px solid #0d6efd !important; }
        .action-warning { border-left: 4px solid #ffc107 !important; }
        .action-success { border-left: 4px solid #198754 !important; }
        .action-info { border-left: 4px solid #0dcaf0 !important; }
        .action-secondary { border-left: 4px solid #6c757d !important; }
        .action-dark { border-left: 4px solid #212529 !important; }
        .action-danger { border-left: 4px solid #dc3545 !important; }
        .action-light { border-left: 4px solid #f8f9fa !important; }
      `}</style>
    </div>
  );
}

