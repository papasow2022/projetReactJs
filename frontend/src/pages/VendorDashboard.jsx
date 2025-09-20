import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
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
  BiImage,
  BiDownload,
  BiFilter,
  BiSearch,
  BiEdit,
  BiTrash,
  BiShow,
  BiPause,
  BiPlay
} from 'react-icons/bi';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { useThemeColors } from '../contexts/ThemeContext';
import VendorProductManager from '../components/VendorProductManager';
import VendorOrderManager from '../components/VendorOrderManager';
import VendorAnalytics from '../components/VendorAnalytics';
import VendorPayments from '../components/VendorPayments';

const VendorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const colors = useThemeColors();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Configuration des onglets Amazon Seller Central style
  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BiHome, color: 'primary' },
    { id: 'catalog', label: 'Catalogue', icon: BiPackage, color: 'info' },
    { id: 'inventory', label: 'Inventaire', icon: BiPackage, color: 'warning' },
    { id: 'pricing', label: 'Tarification', icon: BiDollar, color: 'success' },
    { id: 'orders', label: 'Commandes', icon: BiCalendar, color: 'primary' },
    { id: 'advertising', label: 'Publicité', icon: BiTrendingUp, color: 'danger' },
    { id: 'stores', label: 'Boutiques', icon: BiShoppingBag, color: 'secondary' },
    { id: 'growth', label: 'Croissance', icon: BiTrendingUp, color: 'success' },
    { id: 'reports', label: 'Rapports', icon: BiBarChart, color: 'info' },
    { id: 'payments', label: 'Paiements', icon: BiCreditCard, color: 'warning' },
    { id: 'performance', label: 'Performance', icon: BiStar, color: 'primary' },
    { id: 'apps', label: 'Applications', icon: BiCog, color: 'dark' }
  ];

  // Charger les données du vendeur
  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    try {
      setLoading(true);
      
      // Charger les statistiques
      const statsResponse = await fetch('/api/vendor/stats?period=30d', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Charger les commandes récentes
      const ordersResponse = await fetch('/api/vendor/orders?limit=5', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const ordersData = await ordersResponse.json();
      if (ordersData.success) {
        setRecentOrders(ordersData.orders);
      }

      // Charger les produits
      const productsResponse = await fetch('/api/vendor/products?limit=10', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const productsData = await productsResponse.json();
      if (productsData.success) {
        setProducts(productsData.products);
      }

      // Simuler des alertes
      setAlerts([
        { id: 1, type: 'warning', message: '3 produits en rupture de stock', action: 'Gérer les stocks' },
        { id: 2, type: 'info', message: '2 nouvelles commandes en attente', action: 'Voir les commandes' },
        { id: 3, type: 'success', message: 'Paiement de 1,234.50€ reçu', action: 'Voir les paiements' }
      ]);

    } catch (error) {
      console.error('Erreur chargement données vendeur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Composant de métrique
  const MetricCard = ({ title, value, change, icon: Icon, color = 'primary' }) => (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body className="d-flex align-items-center">
        <div className="flex-shrink-0 me-3">
          <div className={`bg-${color} bg-opacity-10 rounded-circle p-3`}>
            <Icon className={`text-${color}`} size={24} />
          </div>
        </div>
        <div className="flex-grow-1">
          <h6 className="text-muted mb-1">{title}</h6>
          <h4 className="mb-1">{value}</h4>
          {change && (
            <small className={`text-${change > 0 ? 'success' : 'danger'}`}>
              <BiTrendingUp className="me-1" size={12} />
              {Math.abs(change)}%
            </small>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  // Composant de commande récente
  const OrderCard = ({ order }) => (
    <div className="d-flex justify-content-between align-items-center p-3 border rounded mb-2">
      <div>
        <h6 className="mb-1">#{order.orderNumber}</h6>
        <small className="text-muted">{order.customer.name}</small>
      </div>
      <div className="text-end">
        <Badge bg={order.status === 'pending' ? 'warning' : order.status === 'shipped' ? 'info' : 'success'}>
          {order.status}
        </Badge>
        <div className="mt-1">
          <strong>{order.pricing.total.toLocaleString()}€</strong>
        </div>
      </div>
    </div>
  );

  // Composant de produit
  const ProductCard = ({ product }) => (
    <div className="d-flex align-items-center p-3 border rounded mb-2">
      <img 
        src={product.primaryImage || '/assets/images/placeholder.jpg'} 
        alt={product.name}
        className="rounded me-3"
        style={{ width: 60, height: 60, objectFit: 'cover' }}
      />
      <div className="flex-grow-1">
        <h6 className="mb-1">{product.name}</h6>
        <small className="text-muted">SKU: {product.sku}</small>
        <div className="mt-1">
          <Badge bg={product.status === 'active' ? 'success' : 'secondary'}>
            {product.status}
          </Badge>
          <span className="ms-2 text-muted">Stock: {product.inventory.available}</span>
        </div>
      </div>
      <div className="text-end">
        <strong>{product.price.toLocaleString()}€</strong>
        <div className="mt-1">
          <Button size="sm" variant="outline-primary" className="me-1">
            <BiEdit size={14} />
          </Button>
          <Button size="sm" variant="outline-danger">
            <BiTrash size={14} />
          </Button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="vendor-dashboard" style={{ backgroundColor: colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <div className="bg-white border-bottom py-3">
        <Container fluid>
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">Tableau de bord vendeur</h4>
              <small className="text-muted">Bienvenue, {user?.prenom} {user?.nom}</small>
            </Col>
            <Col auto>
              <div className="d-flex gap-2">
                <Button variant="outline-primary" size="sm">
                  <BiDownload className="me-1" />
                  Exporter
                </Button>
                <Button variant="primary" size="sm">
                  <BiPlus className="me-1" />
                  Nouveau produit
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid className="py-4">
        <Row>
          {/* Sidebar */}
          <Col md={3} lg={2}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <nav className="nav flex-column">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`nav-link text-start border-0 bg-transparent py-3 px-3 ${
                        activeTab === tab.id ? 'active' : ''
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        backgroundColor: activeTab === tab.id ? colors.primary + '20' : 'transparent',
                        color: activeTab === tab.id ? colors.primary : colors.text
                      }}
                    >
                      <tab.icon className="me-2" size={18} />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Contenu principal */}
          <Col md={9} lg={10}>
            {activeTab === 'overview' && (
              <div>
                {/* Alertes */}
                {alerts.length > 0 && (
                  <Row className="mb-4">
                    <Col>
                      {alerts.map(alert => (
                        <Alert key={alert.id} variant={alert.type} className="d-flex justify-content-between align-items-center">
                          <span>{alert.message}</span>
                          <Button variant="outline-primary" size="sm">
                            {alert.action}
                          </Button>
                        </Alert>
                      ))}
                    </Col>
                  </Row>
                )}

                {/* Métriques principales */}
                <Row className="mb-4">
                  <Col md={3}>
                    <MetricCard
                      title="Revenus (30j)"
                      value={stats?.orders?.totalRevenue ? `${stats.orders.totalRevenue.toLocaleString()}€` : '0€'}
                      change={12.5}
                      icon={BiDollar}
                      color="success"
                    />
                  </Col>
                  <Col md={3}>
                    <MetricCard
                      title="Commandes"
                      value={stats?.orders?.totalOrders || 0}
                      change={8.2}
                      icon={BiCalendar}
                      color="primary"
                    />
                  </Col>
                  <Col md={3}>
                    <MetricCard
                      title="Produits actifs"
                      value={stats?.products?.activeProducts || 0}
                      change={-2.1}
                      icon={BiPackage}
                      color="info"
                    />
                  </Col>
                  <Col md={3}>
                    <MetricCard
                      title="Note moyenne"
                      value={stats?.orders?.averageOrderValue ? `${stats.orders.averageOrderValue.toFixed(0)}€` : '0€'}
                      change={5.3}
                      icon={BiStar}
                      color="warning"
                    />
                  </Col>
                </Row>

                {/* Graphique des revenus */}
                <Row className="mb-4">
                  <Col>
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-white border-0">
                        <h6 className="mb-0">Revenus des 30 derniers jours</h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="text-center py-5">
                          <BiBarChart size={48} className="text-muted mb-3" />
                          <p className="text-muted">Graphique des revenus à implémenter</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  {/* Commandes récentes */}
                  <Col md={6}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Commandes récentes</h6>
                        <Button variant="outline-primary" size="sm">
                          Voir tout
                        </Button>
                      </Card.Header>
                      <Card.Body>
                        {recentOrders.length > 0 ? (
                          recentOrders.map(order => (
                            <OrderCard key={order._id} order={order} />
                          ))
                        ) : (
                          <div className="text-center py-3">
                            <BiCalendar size={32} className="text-muted mb-2" />
                            <p className="text-muted mb-0">Aucune commande récente</p>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Produits récents */}
                  <Col md={6}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Produits récents</h6>
                        <Button variant="outline-primary" size="sm">
                          Voir tout
                        </Button>
                      </Card.Header>
                      <Card.Body>
                        {products.length > 0 ? (
                          products.map(product => (
                            <ProductCard key={product._id} product={product} />
                          ))
                        ) : (
                          <div className="text-center py-3">
                            <BiPackage size={32} className="text-muted mb-2" />
                            <p className="text-muted mb-0">Aucun produit</p>
                            <Button variant="primary" size="sm" className="mt-2">
                              <BiPlus className="me-1" />
                              Ajouter un produit
                            </Button>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}

            {activeTab === 'catalog' && (
              <VendorProductManager />
            )}

            {activeTab === 'orders' && (
              <VendorOrderManager />
            )}

            {activeTab === 'reports' && (
              <VendorAnalytics />
            )}

            {activeTab === 'payments' && (
              <VendorPayments />
            )}

            {/* Autres onglets */}
            {!['overview', 'catalog', 'orders', 'reports', 'payments'].includes(activeTab) && (
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                  <BiCog size={48} className="text-muted mb-3" />
                  <h5>{tabs.find(t => t.id === activeTab)?.label}</h5>
                  <p className="text-muted">Cette section sera implémentée prochainement</p>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VendorDashboard;
