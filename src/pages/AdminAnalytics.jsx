import React, { useState, useEffect } from 'react';
import { 
  BiBarChart, 
  BiTrendingUp, 
  BiTrendingDown,
  BiDollar,
  BiUser,
  BiPackage,
  BiShoppingBag,
  BiStar,
  BiCalendar,
  BiRefresh,
  BiDownload
} from 'react-icons/bi';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    overview: {},
    sales: [],
    vendors: [],
    products: [],
    customers: []
  });
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = () => {
    setLoading(true);
    
    // Simuler des données de test
    const mockAnalytics = {
      overview: {
        totalRevenue: 125450.75,
        totalOrders: 3420,
        totalVendors: 45,
        totalProducts: 1250,
        totalCustomers: 2890,
        averageOrderValue: 36.68,
        conversionRate: 3.2,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3,
        vendorsGrowth: 15.2,
        customersGrowth: 18.7
      },
      sales: [
        { date: '2024-01-01', revenue: 1250.50, orders: 45 },
        { date: '2024-01-02', revenue: 1890.30, orders: 52 },
        { date: '2024-01-03', revenue: 1567.80, orders: 38 },
        { date: '2024-01-04', revenue: 2100.25, orders: 61 },
        { date: '2024-01-05', revenue: 1789.90, orders: 47 },
        { date: '2024-01-06', revenue: 2345.60, orders: 68 },
        { date: '2024-01-07', revenue: 1987.45, orders: 55 }
      ],
      vendors: [
        { name: 'Boutique Sport', revenue: 12500.50, orders: 245, products: 45, rating: 4.8 },
        { name: 'Mode & Style', revenue: 9870.30, orders: 189, products: 32, rating: 4.6 },
        { name: 'Tech Store', revenue: 15670.80, orders: 156, products: 28, rating: 4.9 },
        { name: 'Sport Plus', revenue: 7890.25, orders: 134, products: 25, rating: 4.4 },
        { name: 'Fashion Hub', revenue: 11200.90, orders: 198, products: 38, rating: 4.7 }
      ],
      products: [
        { name: 'Chaussures Nike Air Max', sales: 125, revenue: 11250.00, rating: 4.8 },
        { name: 'Sac à dos Adidas', sales: 98, revenue: 4459.00, rating: 4.6 },
        { name: 'Apple Watch Series 7', sales: 45, revenue: 13499.55, rating: 4.9 },
        { name: 'Veste Nike', sales: 87, revenue: 6525.00, rating: 4.4 },
        { name: 'Montre Apple Watch', sales: 32, revenue: 9599.68, rating: 4.7 }
      ],
      customers: [
        { segment: 'Nouveaux clients', count: 450, percentage: 15.6 },
        { segment: 'Clients récurrents', count: 1200, percentage: 41.5 },
        { segment: 'Clients VIP', count: 180, percentage: 6.2 },
        { segment: 'Clients inactifs', count: 1060, percentage: 36.7 }
      ]
    };

    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? (
      <BiTrendingUp className="text-success" />
    ) : (
      <BiTrendingDown className="text-danger" />
    );
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'text-success' : 'text-danger';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('fr-FR').format(number);
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Analytics de la plateforme</h1>
          <p className="text-muted mb-0">Vue d'ensemble des performances de Papasow</p>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="1y">1 an</option>
          </select>
          <button className="btn btn-outline-primary" onClick={loadAnalytics}>
            <BiRefresh className="me-2" />
            Actualiser
          </button>
          <button className="btn btn-primary">
            <BiDownload className="me-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Vue d'ensemble */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <BiDollar className="text-success" style={{ fontSize: '2rem' }} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="card-title text-muted mb-1">Revenus totaux</h6>
                  <h4 className="mb-1">{formatCurrency(analytics.overview.totalRevenue)}</h4>
                  <small className={getGrowthColor(analytics.overview.revenueGrowth)}>
                    {getGrowthIcon(analytics.overview.revenueGrowth)}
                    {analytics.overview.revenueGrowth > 0 ? '+' : ''}{analytics.overview.revenueGrowth}%
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
                  <BiShoppingBag className="text-primary" style={{ fontSize: '2rem' }} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="card-title text-muted mb-1">Commandes</h6>
                  <h4 className="mb-1">{formatNumber(analytics.overview.totalOrders)}</h4>
                  <small className={getGrowthColor(analytics.overview.ordersGrowth)}>
                    {getGrowthIcon(analytics.overview.ordersGrowth)}
                    {analytics.overview.ordersGrowth > 0 ? '+' : ''}{analytics.overview.ordersGrowth}%
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
                  <BiUser className="text-info" style={{ fontSize: '2rem' }} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="card-title text-muted mb-1">Vendeurs</h6>
                  <h4 className="mb-1">{formatNumber(analytics.overview.totalVendors)}</h4>
                  <small className={getGrowthColor(analytics.overview.vendorsGrowth)}>
                    {getGrowthIcon(analytics.overview.vendorsGrowth)}
                    {analytics.overview.vendorsGrowth > 0 ? '+' : ''}{analytics.overview.vendorsGrowth}%
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
                  <h4 className="mb-1">{formatNumber(analytics.overview.totalProducts)}</h4>
                  <small className="text-muted">
                    <BiBarChart className="me-1" />
                    {analytics.overview.totalProducts / analytics.overview.totalVendors} par vendeur
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métriques supplémentaires */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h6 className="card-title text-muted mb-2">Panier moyen</h6>
              <h3 className="text-primary mb-1">{formatCurrency(analytics.overview.averageOrderValue)}</h3>
              <small className="text-muted">Par commande</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h6 className="card-title text-muted mb-2">Taux de conversion</h6>
              <h3 className="text-success mb-1">{analytics.overview.conversionRate}%</h3>
              <small className="text-muted">Visiteurs → Clients</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h6 className="card-title text-muted mb-2">Clients totaux</h6>
              <h3 className="text-info mb-1">{formatNumber(analytics.overview.totalCustomers)}</h3>
              <small className={getGrowthColor(analytics.overview.customersGrowth)}>
                {getGrowthIcon(analytics.overview.customersGrowth)}
                {analytics.overview.customersGrowth > 0 ? '+' : ''}{analytics.overview.customersGrowth}%
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Top vendeurs */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Top vendeurs</h5>
            </div>
            <div className="card-body">
              {analytics.vendors.map((vendor, index) => (
                <div key={index} className="d-flex align-items-center mb-3">
                  <div className="flex-shrink-0 me-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                         style={{ width: '40px', height: '40px' }}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-medium">{vendor.name}</div>
                    <div className="small text-muted">
                      {formatCurrency(vendor.revenue)} • {vendor.orders} commandes • {vendor.products} produits
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="d-flex align-items-center">
                      <BiStar className="text-warning me-1" />
                      <span className="fw-medium">{vendor.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top produits */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Top produits</h5>
            </div>
            <div className="card-body">
              {analytics.products.map((product, index) => (
                <div key={index} className="d-flex align-items-center mb-3">
                  <div className="flex-shrink-0 me-3">
                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" 
                         style={{ width: '40px', height: '40px' }}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-medium">{product.name}</div>
                    <div className="small text-muted">
                      {product.sales} ventes • {formatCurrency(product.revenue)}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="d-flex align-items-center">
                      <BiStar className="text-warning me-1" />
                      <span className="fw-medium">{product.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Segmentation des clients */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Segmentation des clients</h5>
            </div>
            <div className="card-body">
              {analytics.customers.map((segment, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-medium">{segment.segment}</span>
                    <span className="text-muted">{segment.count} clients</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${segment.percentage}%` }}
                      aria-valuenow={segment.percentage}
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <small className="text-muted">{segment.percentage}%</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Évolution des ventes */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Évolution des ventes (7 derniers jours)</h5>
            </div>
            <div className="card-body">
              {analytics.sales.map((day, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <div className="fw-medium">
                      {new Date(day.date).toLocaleDateString('fr-FR', { 
                        weekday: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <small className="text-muted">{day.orders} commandes</small>
                  </div>
                  <div className="text-end">
                    <div className="fw-medium">{formatCurrency(day.revenue)}</div>
                    <div className="progress" style={{ width: '100px', height: '4px' }}>
                      <div 
                        className="progress-bar bg-primary" 
                        role="progressbar" 
                        style={{ 
                          width: `${(day.revenue / Math.max(...analytics.sales.map(s => s.revenue))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}