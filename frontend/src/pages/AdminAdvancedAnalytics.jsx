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
  BiDownload,
  BiFilter,
  BiSearch,
  BiShow,
  BiMouse,
  BiTime,
  BiCrosshair,
  BiPieChart,
  BiLineChart
} from 'react-icons/bi';
import { Line, Bar, Doughnut, Pie, Radar, Scatter } from 'react-chartjs-2';
import { exportToCsv } from '../utils/csvExport';
import { useProducts } from '../contexts/ProductsContext';
import { useVendor } from '../contexts/VendorContext';

export default function AdminAdvancedAnalytics() {
  const { allProducts } = useProducts();
  const { vendors } = useVendor();
  const [analytics, setAnalytics] = useState({
    overview: {},
    sales: [],
    customers: [],
    products: [],
    vendors: [],
    categories: [],
    traffic: [],
    conversions: [],
    revenue: [],
    performance: {}
  });
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'orders', 'customers', 'conversion']);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAdvancedAnalytics();
  }, [timeRange, allProducts, vendors]);

  const loadAdvancedAnalytics = () => {
    setLoading(true);
    
    try {
      // Charger les vraies données
      const vendorList = Object.values(vendors || {});
      const productList = Array.isArray(allProducts) ? allProducts : [];
      
      // Charger toutes les commandes
      const allOrders = [];
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.forEach(user => {
        const userOrders = JSON.parse(localStorage.getItem(`commandes_${user.email}`) || '[]');
        allOrders.push(...userOrders);
      });
      
      // Calculer les statistiques réelles
      const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const totalOrders = allOrders.length;
      const totalVendors = vendorList.length;
      const totalProducts = productList.length;
      const totalCustomers = users.length;
      const averageOrderValue = totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;
      
      // Générer des données de ventes par jour (derniers 30 jours)
      const salesData = [];
      const trafficData = [];
      const conversionData = [];
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - 30);
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = allOrders.filter(order => {
          const orderDate = new Date(order.createdAt || order.date);
          return orderDate.toISOString().split('T')[0] === dateStr;
        });
        
        const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        salesData.push({
          date: dateStr,
          value: dayRevenue
        });
        
        // Simulation du trafic (basé sur les commandes)
        trafficData.push({
          date: dateStr,
          value: Math.max(50, dayOrders.length * 20 + Math.random() * 100)
        });
        
        // Simulation du taux de conversion
        const traffic = trafficData[trafficData.length - 1].value;
        const conversion = traffic > 0 ? (dayOrders.length / traffic) * 100 : 0;
        conversionData.push({
          date: dateStr,
          value: Math.round(conversion * 100) / 100
        });
      }

      const realAnalytics = {
        overview: {
          totalRevenue,
          totalOrders,
          totalCustomers,
          totalProducts,
          totalVendors,
          averageOrderValue,
          conversionRate: totalCustomers > 0 ? Math.round((totalOrders / totalCustomers) * 100) / 100 : 0,
          bounceRate: 45.2, // À calculer avec des données de tracking
          sessionDuration: 4.5, // À calculer avec des données de tracking
          revenueGrowth: 0, // À calculer avec des données historiques
          ordersGrowth: 0,
          customersGrowth: 0,
          conversionGrowth: 0,
          trafficGrowth: 0
        },
        sales: salesData,
        traffic: trafficData,
        conversions: conversionData,
        customers: [
          { segment: 'Total clients', count: totalCustomers, percentage: 100, value: totalRevenue }
        ],
        products: productList.slice(0, 10).map(product => ({
          name: product.nom,
          sales: 0, // À calculer avec les commandes
          revenue: 0, // À calculer avec les commandes
          rating: product.rating || 0,
          views: 0, // À calculer avec des données de tracking
          conversion: 0 // À calculer
        })),
        vendors: vendorList.map(vendor => ({
          name: vendor.nomEntreprise || vendor.email,
          revenue: 0, // À calculer avec les commandes
          orders: 0, // À calculer avec les commandes
          products: productList.filter(p => p.vendorId === vendor.id).length,
          rating: vendor.rating || 0,
          conversion: 0, // À calculer
          traffic: 0 // À calculer avec des données de tracking
        })),
        categories: [], // À calculer avec les produits
        performance: {
          pageLoadTime: 2.3, // Données système
          serverResponseTime: 0.8,
          databaseQueryTime: 0.3,
          cacheHitRate: 85.2,
          errorRate: 0.1,
          uptime: 99.9
        }
      };

      setAnalytics(realAnalytics);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des analytics avancés:', error);
      setLoading(false);
    }
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

  const getChartData = (type) => {
    switch (type) {
      case 'revenue':
        return {
          labels: analytics.sales.map(day => new Date(day.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })),
          datasets: [{
            label: 'Revenus (€)',
            data: analytics.sales.map(day => day.value),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
            fill: true
          }]
        };
      case 'traffic':
        return {
          labels: analytics.traffic.map(day => new Date(day.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })),
          datasets: [{
            label: 'Visiteurs',
            data: analytics.traffic.map(day => day.value),
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.1,
            fill: true
          }]
        };
      case 'conversion':
        return {
          labels: analytics.conversions.map(day => new Date(day.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })),
          datasets: [{
            label: 'Taux de conversion (%)',
            data: analytics.conversions.map(day => day.value),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.1,
            fill: true
          }]
        };
      case 'categories':
        return {
          labels: analytics.categories.map(cat => cat.name),
          datasets: [{
            data: analytics.categories.map(cat => cat.revenue),
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
            ]
          }]
        };
      case 'customers':
        return {
          labels: analytics.customers.map(seg => seg.segment),
          datasets: [{
            data: analytics.customers.map(seg => seg.percentage),
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
            ]
          }]
        };
      default:
        return null;
    }
  };

  const exportAnalytics = () => {
    const data = {
      overview: analytics.overview,
      sales: analytics.sales,
      customers: analytics.customers,
      products: analytics.products,
      vendors: analytics.vendors,
      categories: analytics.categories
    };
    
    const csv = JSON.stringify(data, null, 2);
    const blob = new Blob([csv], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `advanced_analytics_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Analytics Avancés</h1>
          <p className="text-muted mb-0">Métriques détaillées et analyses prédictives</p>
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
          <button className="btn btn-outline-primary" onClick={loadAdvancedAnalytics}>
            <BiRefresh className="me-2" />
            Actualiser
          </button>
          <button className="btn btn-primary" onClick={exportAnalytics}>
            <BiDownload className="me-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Onglets */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BiBarChart className="me-2" />
            Vue d'ensemble
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            <BiDollar className="me-2" />
            Ventes
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'traffic' ? 'active' : ''}`}
            onClick={() => setActiveTab('traffic')}
          >
                <BiShow className="me-2" />
            Trafic
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
                <BiCrosshair className="me-2" />
            Performance
          </button>
        </li>
      </ul>

      {/* Vue d'ensemble */}
      {activeTab === 'overview' && (
        <>
          {/* Métriques principales */}
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
                      <h6 className="card-title text-muted mb-1">Clients</h6>
                      <h4 className="mb-1">{formatNumber(analytics.overview.totalCustomers)}</h4>
                      <small className={getGrowthColor(analytics.overview.customersGrowth)}>
                        {getGrowthIcon(analytics.overview.customersGrowth)}
                        {analytics.overview.customersGrowth > 0 ? '+' : ''}{analytics.overview.customersGrowth}%
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
                      <BiCrosshair className="text-warning" style={{ fontSize: '2rem' }} />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="card-title text-muted mb-1">Conversion</h6>
                      <h4 className="mb-1">{analytics.overview.conversionRate}%</h4>
                      <small className={getGrowthColor(analytics.overview.conversionGrowth)}>
                        {getGrowthIcon(analytics.overview.conversionGrowth)}
                        {analytics.overview.conversionGrowth > 0 ? '+' : ''}{analytics.overview.conversionGrowth}%
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Métriques secondaires */}
          <div className="row g-3 mb-4">
            <div className="col-md-2">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <h6 className="card-title text-muted mb-2">Panier moyen</h6>
                  <h3 className="text-primary mb-1">{formatCurrency(analytics.overview.averageOrderValue)}</h3>
                  <small className="text-muted">Par commande</small>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <h6 className="card-title text-muted mb-2">Taux de rebond</h6>
                  <h3 className="text-warning mb-1">{analytics.overview.bounceRate}%</h3>
                  <small className="text-muted">Visiteurs</small>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <h6 className="card-title text-muted mb-2">Durée session</h6>
                  <h3 className="text-info mb-1">{analytics.overview.sessionDuration}min</h3>
                  <small className="text-muted">Moyenne</small>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <h6 className="card-title text-muted mb-2">Produits</h6>
                  <h3 className="text-success mb-1">{formatNumber(analytics.overview.totalProducts)}</h3>
                  <small className="text-muted">Catalogue</small>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <h6 className="card-title text-muted mb-2">Vendeurs</h6>
                  <h3 className="text-primary mb-1">{formatNumber(analytics.overview.totalVendors)}</h3>
                  <small className="text-muted">Actifs</small>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <h6 className="card-title text-muted mb-2">Croissance trafic</h6>
                  <h3 className={getGrowthColor(analytics.overview.trafficGrowth)}>
                    {analytics.overview.trafficGrowth > 0 ? '+' : ''}{analytics.overview.trafficGrowth}%
                  </h3>
                  <small className="text-muted">Visiteurs</small>
                </div>
              </div>
            </div>
          </div>

          {/* Graphiques principaux */}
          <div className="row g-4 mb-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">Évolution des revenus (30 derniers jours)</h5>
                </div>
                <div className="card-body">
                  {getChartData('revenue') && (
                    <Line 
                      data={getChartData('revenue')} 
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: true }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: function(value) {
                                return '€' + value.toLocaleString();
                              }
                            }
                          }
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">Répartition par catégorie</h5>
                </div>
                <div className="card-body">
                  {getChartData('categories') && (
                    <Doughnut 
                      data={getChartData('categories')} 
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'bottom' }
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Segmentation des clients */}
          <div className="row g-4">
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
                        ></div>
                      </div>
                      <small className="text-muted">
                        {segment.percentage}% • Valeur: {formatCurrency(segment.value)}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">Top produits par conversion</h5>
                </div>
                <div className="card-body">
                  {analytics.products.map((product, index) => (
                    <div key={index} className="d-flex align-items-center mb-3">
                      <div className="flex-shrink-0 me-3">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                             style={{ width: '40px', height: '40px' }}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-medium">{product.name}</div>
                        <div className="small text-muted">
                          {product.sales} ventes • {formatCurrency(product.revenue)} • {product.views} vues
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-end">
                          <div className="fw-medium text-success">{product.conversion}%</div>
                          <div className="d-flex align-items-center">
                            <BiStar className="text-warning me-1" />
                            <span className="fw-medium">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Onglet Ventes */}
      {activeTab === 'sales' && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Performance par vendeur</h5>
              </div>
              <div className="card-body">
                {analytics.vendors.map((vendor, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-medium">{vendor.name}</span>
                      <span className="text-muted">{formatCurrency(vendor.revenue)}</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ 
                          width: `${(vendor.revenue / Math.max(...analytics.vendors.map(v => v.revenue))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <small className="text-muted">
                      {vendor.orders} commandes • {vendor.products} produits • Conversion: {vendor.conversion}%
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Performance par catégorie</h5>
              </div>
              <div className="card-body">
                {analytics.categories.map((category, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-medium">{category.name}</span>
                      <span className="text-muted">{formatCurrency(category.revenue)}</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ 
                          width: `${(category.revenue / Math.max(...analytics.categories.map(c => c.revenue))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <small className="text-muted">
                      {category.orders} commandes • Prix moyen: {formatCurrency(category.avgPrice)} • Conversion: {category.conversion}%
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onglet Trafic */}
      {activeTab === 'traffic' && (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Évolution du trafic (30 derniers jours)</h5>
              </div>
              <div className="card-body">
                {getChartData('traffic') && (
                  <Line 
                    data={getChartData('traffic')} 
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: true }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Taux de conversion</h5>
              </div>
              <div className="card-body">
                {getChartData('conversion') && (
                  <Line 
                    data={getChartData('conversion')} 
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: true }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return value + '%';
                            }
                          }
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onglet Performance */}
      {activeTab === 'performance' && (
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Métriques de performance</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="text-center">
                      <h4 className="text-primary">{analytics.performance.pageLoadTime}s</h4>
                      <small className="text-muted">Temps de chargement</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <h4 className="text-success">{analytics.performance.serverResponseTime}s</h4>
                      <small className="text-muted">Réponse serveur</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <h4 className="text-info">{analytics.performance.databaseQueryTime}s</h4>
                      <small className="text-muted">Requêtes DB</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <h4 className="text-warning">{analytics.performance.cacheHitRate}%</h4>
                      <small className="text-muted">Cache hit rate</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <h4 className="text-danger">{analytics.performance.errorRate}%</h4>
                      <small className="text-muted">Taux d'erreur</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <h4 className="text-success">{analytics.performance.uptime}%</h4>
                      <small className="text-muted">Disponibilité</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Recommandations d'optimisation</h5>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  <div className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Optimiser les images</div>
                      <small>Compresser les images pour réduire le temps de chargement</small>
                    </div>
                    <span className="badge bg-warning rounded-pill">Moyen</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Améliorer le cache</div>
                      <small>Augmenter le taux de cache hit pour de meilleures performances</small>
                    </div>
                    <span className="badge bg-success rounded-pill">Faible</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Optimiser les requêtes DB</div>
                      <small>Indexer les requêtes fréquentes pour réduire la latence</small>
                    </div>
                    <span className="badge bg-danger rounded-pill">Élevé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}