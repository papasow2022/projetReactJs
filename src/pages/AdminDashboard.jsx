import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  BiDollar
} from 'react-icons/bi';

export default function AdminDashboard() {
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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Simuler des données de test
    setStats({
      totalVendors: 45,
      activeVendors: 38,
      pendingVendors: 7,
      totalProducts: 1250,
      pendingProducts: 23,
      totalOrders: 3420,
      totalRevenue: 125450.75,
      totalReviews: 2890,
      pendingReviews: 12,
      totalCommissions: 18767.61
    });

    setRecentActivity([
      { type: 'vendor', message: 'Nouveau vendeur en attente de validation', time: '2h', status: 'pending' },
      { type: 'product', message: 'Produit signalé par un utilisateur', time: '4h', status: 'warning' },
      { type: 'order', message: 'Commande importante reçue', time: '6h', status: 'success' },
      { type: 'review', message: 'Avis inapproprié signalé', time: '8h', status: 'warning' }
    ]);

    setNotifications([
      { id: 1, message: '7 vendeurs en attente de validation', type: 'warning', time: '2h' },
      { id: 2, message: '23 produits en attente de modération', type: 'info', time: '4h' },
      { id: 3, message: '12 avis en attente de modération', type: 'info', time: '6h' }
    ]);
  };

  const quickActions = [
    { title: 'Gérer les vendeurs', icon: BiUser, link: '/admin/vendors', color: 'primary', count: stats.pendingVendors },
    { title: 'Modérer les produits', icon: BiPackage, link: '/admin/products', color: 'warning', count: stats.pendingProducts },
    { title: 'Gérer les commandes', icon: BiShoppingBag, link: '/admin/orders', color: 'success' },
    { title: 'Modérer les avis', icon: BiStar, link: '/admin/reviews', color: 'info', count: stats.pendingReviews },
    { title: 'Gérer les paiements', icon: BiCreditCard, link: '/admin/payments', color: 'secondary' },
    { title: 'Analytics', icon: BiBarChart, link: '/admin/analytics', color: 'dark' },
    { title: 'Support client', icon: BiSupport, link: '/admin/support', color: 'danger' },
    { title: 'Configuration', icon: BiCog, link: '/admin/settings', color: 'light' }
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
                            {action.count ? `${action.count} en attente` : 'Gérer et surveiller'}
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

      <style jsx>{`
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

