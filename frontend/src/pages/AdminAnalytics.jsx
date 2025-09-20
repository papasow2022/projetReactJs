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
  BiSearch
} from 'react-icons/bi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { exportToCsv } from '../utils/csvExport';
import { useProducts } from '../contexts/ProductsContext';
import { useVendor } from '../contexts/VendorContext';

export default function AdminAnalytics() {
  const { allProducts } = useProducts();
  const { vendors } = useVendor();
  const [analytics, setAnalytics] = useState({
    overview: {},
    sales: [],
    vendors: [],
    products: [],
    customers: [],
    categories: [],
    revenueChart: { labels: [], datasets: [] },
    salesChart: { labels: [], datasets: [] },
    categoryChart: { labels: [], datasets: [] }
  });
  const [timeRange, setTimeRange] = useState('30d');
  const [vendorFilter, setVendorFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, allProducts, vendors]);

  const loadAnalytics = () => {
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
      
      // Analyser les vendeurs
      const vendorAnalytics = vendorList.map(vendor => {
        const vendorProducts = productList.filter(p => p.vendorId === vendor.id);
        const vendorOrders = allOrders.filter(o => o.vendorId === vendor.id);
        const vendorRevenue = vendorOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        return {
          name: vendor.nomEntreprise || vendor.email,
          revenue: vendorRevenue,
          orders: vendorOrders.length,
          products: vendorProducts.length,
          rating: vendor.rating || 0
        };
      }).sort((a, b) => b.revenue - a.revenue);
      
      // Analyser les produits
      const productAnalytics = productList.map(product => {
        const productOrders = allOrders.filter(o => 
          o.items && o.items.some(item => item.name === product.nom)
        );
        const productRevenue = productOrders.reduce((sum, order) => {
          const item = order.items.find(item => item.name === product.nom);
          return sum + (item ? item.price * item.quantity : 0);
        }, 0);
        
        return {
          name: product.nom,
          sales: productOrders.length,
          revenue: productRevenue,
          rating: product.rating || 0
        };
      }).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
      
      // Analyser les catégories
      const categoryMap = {};
      productList.forEach(product => {
        const category = product.categorie || 'Autres';
        if (!categoryMap[category]) {
          categoryMap[category] = { revenue: 0, orders: 0, products: 0 };
        }
        categoryMap[category].products++;
        
        const categoryOrders = allOrders.filter(o => 
          o.items && o.items.some(item => item.name === product.nom)
        );
        categoryMap[category].orders += categoryOrders.length;
        categoryMap[category].revenue += categoryOrders.reduce((sum, order) => {
          const item = order.items.find(item => item.name === product.nom);
          return sum + (item ? item.price * item.quantity : 0);
        }, 0);
      });
      
      const categoryAnalytics = Object.entries(categoryMap).map(([name, data]) => ({
        name,
        revenue: data.revenue,
        orders: data.orders,
        products: data.products
      })).sort((a, b) => b.revenue - a.revenue);
      
      // Générer des données de ventes par jour (derniers 30 jours)
      const salesData = [];
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
          revenue: dayRevenue,
          orders: dayOrders.length
        });
      }
      
      const realAnalytics = {
        overview: {
          totalRevenue,
          totalOrders,
          totalVendors,
          totalProducts,
          totalCustomers,
          averageOrderValue,
          conversionRate: totalCustomers > 0 ? Math.round((totalOrders / totalCustomers) * 100) / 100 : 0,
          revenueGrowth: 0, // À calculer avec des données historiques
          ordersGrowth: 0,
          vendorsGrowth: 0,
          customersGrowth: 0
        },
        sales: salesData,
        vendors: vendorAnalytics,
        products: productAnalytics,
        customers: [
          { segment: 'Total clients', count: totalCustomers, percentage: 100 }
        ],
        categories: categoryAnalytics,
        revenueChart: {
          labels: salesData.map(day => new Date(day.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })),
          datasets: [{
            label: 'Revenus (€)',
            data: salesData.map(day => day.revenue),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1
          }]
        },
        salesChart: {
          labels: salesData.map(day => new Date(day.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })),
          datasets: [{
            label: 'Commandes',
            data: salesData.map(day => day.orders),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        categoryChart: {
          labels: categoryAnalytics.map(cat => cat.name),
          datasets: [{
            data: categoryAnalytics.map(cat => cat.revenue),
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
            ]
          }]
        }
      };

      setAnalytics(realAnalytics);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
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
          <input 
            className="form-control" 
            placeholder="Filtrer par vendeur" 
            value={vendorFilter} 
            onChange={(e) => setVendorFilter(e.target.value)}
            style={{ width: '200px' }}
          />
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="">Toutes les catégories</option>
            <option value="Chaussures">Chaussures</option>
            <option value="Vêtements">Vêtements</option>
            <option value="Électronique">Électronique</option>
            <option value="Accessoires">Accessoires</option>
            <option value="Montres">Montres</option>
          </select>
          <button className="btn btn-outline-primary" onClick={loadAnalytics}>
            <BiRefresh className="me-2" />
            Actualiser
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              const rows = analytics.sales.map(day => ({
                date: day.date,
                revenue: day.revenue,
                orders: day.orders
              }));
              exportToCsv('analytics_sales.csv', rows);
            }}
          >
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

      {/* Graphiques */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Évolution des revenus (30 derniers jours)</h5>
            </div>
            <div className="card-body">
              {analytics.revenueChart && analytics.revenueChart.labels ? (
                <Line 
                  data={analytics.revenueChart} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true
                      }
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
              ) : (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
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
              {analytics.categoryChart && analytics.categoryChart.labels ? (
                <Doughnut 
                  data={analytics.categoryChart} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              ) : (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Commandes par jour</h5>
            </div>
            <div className="card-body">
              {analytics.salesChart && analytics.salesChart.labels ? (
                <Bar 
                  data={analytics.salesChart} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              ) : (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              )}
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
                    {category.orders} commandes • {category.products} produits
                  </small>
                </div>
              ))}
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