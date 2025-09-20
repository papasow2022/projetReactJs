import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useVendor } from '../contexts/VendorContext';
import { useProducts } from '../contexts/ProductsContext';
import { 
  BiArrowBack, 
  BiTrendingUp, 
  BiTrendingDown,
  BiDollar,
  BiPackage,
  BiUser,
  BiStar,
  BiCalendar,
  BiBarChart,
  BiPieChart,
  BiDownload,
  BiRefresh
} from 'react-icons/bi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsVendeur = () => {
  const { user } = useAuth();
  const { 
    getVendorStats, 
    getVendorOrders, 
    calculateVendorRevenue 
  } = useVendor();
  const { getVendorProducts } = useProducts();

  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const periods = [
    { value: 'week', label: '7 jours' },
    { value: 'month', label: '30 jours' },
    { value: 'quarter', label: '3 mois' },
    { value: 'year', label: '12 mois' }
  ];

  const metrics = [
    { value: 'revenue', label: 'Chiffre d\'affaires', icon: BiDollar, color: 'success' },
    { value: 'orders', label: 'Commandes', icon: BiPackage, color: 'primary' },
    { value: 'customers', label: 'Clients', icon: BiUser, color: 'info' },
    { value: 'average', label: 'Panier moyen', icon: BiTrendingUp, color: 'warning' }
  ];

  // Charger les données
  useEffect(() => {
    if (user?.vendorId) {
      loadData();
    }
  }, [user, selectedPeriod]);

  const loadData = () => {
    setLoading(true);
    
    const vendorStats = getVendorStats(user.vendorId);
    const vendorOrders = getVendorOrders(user.vendorId);
    const vendorProducts = getVendorProducts(user.vendorId);

    setStats(vendorStats);
    setOrders(vendorOrders);
    setProducts(vendorProducts);
    setLoading(false);
  };

  // Calculer les données pour les graphiques
  const calculateChartData = () => {
    const now = new Date();
    const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : selectedPeriod === 'quarter' ? 90 : 365;
    const labels = [];
    const revenueData = [];
    const ordersData = [];
    const customersData = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      labels.push(date.toLocaleDateString('fr-FR', { 
        month: 'short', 
        day: 'numeric' 
      }));

      // Filtrer les commandes pour cette date
      const dayOrders = orders.filter(order => 
        new Date(order.createdAt).toISOString().split('T')[0] === dateStr
      );

      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      const dayCustomers = new Set(dayOrders.map(order => order.customerEmail)).size;

      revenueData.push(dayRevenue);
      ordersData.push(dayOrders.length);
      customersData.push(dayCustomers);
    }

    return { labels, revenueData, ordersData, customersData };
  };

  // Données pour le graphique de revenus
  const getRevenueChartData = () => {
    const { labels, revenueData } = calculateChartData();
    
    return {
      labels,
      datasets: [
        {
          label: 'Chiffre d\'affaires (€)',
          data: revenueData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  // Données pour le graphique des commandes
  const getOrdersChartData = () => {
    const { labels, ordersData } = calculateChartData();
    
    return {
      labels,
      datasets: [
        {
          label: 'Nombre de commandes',
          data: ordersData,
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }
      ]
    };
  };

  // Données pour le graphique des clients
  const getCustomersChartData = () => {
    const { labels, customersData } = calculateChartData();
    
    return {
      labels,
      datasets: [
        {
          label: 'Nouveaux clients',
          data: customersData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4
        }
      ]
    };
  };

  // Données pour le graphique des catégories
  const getCategoryChartData = () => {
    const categoryStats = {};
    
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          const category = item.category || 'Autre';
          categoryStats[category] = (categoryStats[category] || 0) + (item.price * item.quantity);
        });
      }
    });

    const labels = Object.keys(categoryStats);
    const data = Object.values(categoryStats);
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#fff'
        }
      ]
    };
  };

  // Calculer les métriques principales
  const calculateMainMetrics = () => {
    const periodOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : selectedPeriod === 'quarter' ? 90 : 365;
      return orderDate >= new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    });

    const totalRevenue = periodOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = periodOrders.length;
    const uniqueCustomers = new Set(periodOrders.map(order => order.customerEmail)).size;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculer la croissance par rapport à la période précédente
    const previousPeriodOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : selectedPeriod === 'quarter' ? 90 : 365;
      const previousStart = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000);
      const previousEnd = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      return orderDate >= previousStart && orderDate < previousEnd;
    });

    const previousRevenue = previousPeriodOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      uniqueCustomers,
      averageOrderValue,
      revenueGrowth
    };
  };

  // Obtenir les produits les plus vendus
  const getTopProducts = () => {
    const productStats = {};
    
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          if (!productStats[item.name]) {
            productStats[item.name] = {
              name: item.name,
              quantity: 0,
              revenue: 0
            };
          }
          productStats[item.name].quantity += item.quantity;
          productStats[item.name].revenue += item.price * item.quantity;
        });
      }
    });

    return Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  // Formater les montants
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Formater les pourcentages
  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const mainMetrics = calculateMainMetrics();
  const topProducts = getTopProducts();

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to="/dashboard-vendeur" className="btn btn-outline-secondary me-3">
            <BiArrowBack /> Retour au dashboard
          </Link>
          <h2 className="mb-0">Analytics & Performance</h2>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{ width: 'auto' }}
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          <button className="btn btn-outline-primary" onClick={loadData}>
            <BiRefresh /> Actualiser
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Chiffre d'Affaires</h6>
                  <h3 className="mb-0">{formatAmount(mainMetrics.totalRevenue)}</h3>
                  <small className={mainMetrics.revenueGrowth >= 0 ? 'text-light' : 'text-warning'}>
                    {formatPercentage(mainMetrics.revenueGrowth)} vs période précédente
                  </small>
                </div>
                <div className="align-self-center">
                  <BiDollar size={30} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Commandes</h6>
                  <h3 className="mb-0">{mainMetrics.totalOrders}</h3>
                  <small className="text-light">
                    {mainMetrics.averageOrderValue > 0 ? formatAmount(mainMetrics.averageOrderValue) : '0€'} en moyenne
                  </small>
                </div>
                <div className="align-self-center">
                  <BiPackage size={30} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Clients Uniques</h6>
                  <h3 className="mb-0">{mainMetrics.uniqueCustomers}</h3>
                  <small className="text-light">
                    {mainMetrics.totalOrders > 0 ? (mainMetrics.totalOrders / mainMetrics.uniqueCustomers).toFixed(1) : 0} commandes/client
                  </small>
                </div>
                <div className="align-self-center">
                  <BiUser size={30} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Panier Moyen</h6>
                  <h3 className="mb-0">{formatAmount(mainMetrics.averageOrderValue)}</h3>
                  <small className="text-light">
                    {mainMetrics.totalOrders} commandes totales
                  </small>
                </div>
                <div className="align-self-center">
                  <BiTrendingUp size={30} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Évolution du chiffre d'affaires</h5>
            </div>
            <div className="card-body">
              <Line 
                data={getRevenueChartData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return formatAmount(value);
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Répartition par catégorie</h5>
            </div>
            <div className="card-body">
              <Doughnut 
                data={getCategoryChartData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Évolution des commandes</h5>
            </div>
            <div className="card-body">
              <Bar 
                data={getOrdersChartData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Nouveaux clients</h5>
            </div>
            <div className="card-body">
              <Line 
                data={getCustomersChartData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Produits les plus vendus */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Produits les plus vendus</h5>
        </div>
        <div className="card-body">
          {topProducts.length === 0 ? (
            <div className="text-center py-4">
              <BiPackage size={50} className="text-muted mb-3" />
              <h6 className="text-muted">Aucune donnée de vente disponible</h6>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Quantité vendue</th>
                    <th>Chiffre d'affaires</th>
                    <th>% du CA total</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="badge bg-primary me-2">#{index + 1}</span>
                          <span className="fw-bold">{product.name}</span>
                        </div>
                      </td>
                      <td>{product.quantity}</td>
                      <td className="text-success fw-bold">{formatAmount(product.revenue)}</td>
                      <td>
                        {mainMetrics.totalRevenue > 0 
                          ? ((product.revenue / mainMetrics.totalRevenue) * 100).toFixed(1) 
                          : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Métriques de performance */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Métriques de performance</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <div className="text-center">
                    <h4 className="text-primary mb-1">100%</h4>
                    <small className="text-muted">Taux de satisfaction</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center">
                    <h4 className="text-success mb-1">24h</h4>
                    <small className="text-muted">Temps de réponse moyen</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Objectifs</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <div className="text-center">
                    <h4 className="text-warning mb-1">85%</h4>
                    <small className="text-muted">Taux de conversion</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center">
                    <h4 className="text-info mb-1">4.8/5</h4>
                    <small className="text-muted">Note moyenne</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsVendeur; 