import React, { useState, useEffect } from 'react';
import { 
  BiTrendingUp, 
  BiTrendingDown, 
  BiDollar, 
  BiPackage, 
  BiCalendar,
  BiBarChart,
  BiPieChart,
  BiDownload,
  BiRefresh,
  BiFilter,
  BiShow
} from 'react-icons/bi';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Badge, 
  Form,
  Spinner,
  Dropdown,
  Alert
} from 'react-bootstrap';

const VendorAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('30d');
  const [chartData, setChartData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Charger les données analytics
  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Charger les statistiques
      const statsResponse = await fetch(`/api/vendor/stats?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.stats);
        setChartData(statsData.stats.monthlyRevenue);
      }

      // Simuler des données pour les produits les plus vendus
      setTopProducts([
        { name: 'Chaussures Nike Air Max', sku: 'NIKE-AM-001', sales: 45, revenue: 22500, growth: 12.5 },
        { name: 'Pantalon Zara Classique', sku: 'ZARA-P-002', sales: 32, revenue: 12800, growth: -3.2 },
        { name: 'Veste Adidas Sport', sku: 'ADIDAS-V-003', sales: 28, revenue: 19600, growth: 8.7 },
        { name: 'Sac à dos Puma', sku: 'PUMA-S-004', sales: 24, revenue: 7200, growth: 15.3 },
        { name: 'Montre Casio Digital', sku: 'CASIO-M-005', sales: 18, revenue: 5400, growth: -5.1 }
      ]);

      // Simuler des activités récentes
      setRecentActivity([
        { type: 'order', message: 'Nouvelle commande #ORD-001', time: 'Il y a 2 heures', amount: 125.50 },
        { type: 'product', message: 'Produit "Chaussures Nike" approuvé', time: 'Il y a 4 heures', amount: null },
        { type: 'payment', message: 'Paiement reçu de 1,234.50€', time: 'Il y a 6 heures', amount: 1234.50 },
        { type: 'review', message: 'Nouvel avis 5 étoiles reçu', time: 'Il y a 8 heures', amount: null },
        { type: 'return', message: 'Retour demandé pour #ORD-002', time: 'Il y a 12 heures', amount: -89.99 }
      ]);

    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Composant de métrique avec tendance
  const MetricCard = ({ title, value, change, icon: Icon, color = 'primary', subtitle }) => (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className={`bg-${color} bg-opacity-10 rounded-circle p-3`}>
            <Icon className={`text-${color}`} size={24} />
          </div>
          {change !== undefined && (
            <div className={`d-flex align-items-center ${change >= 0 ? 'text-success' : 'text-danger'}`}>
              {change >= 0 ? <BiTrendingUp size={16} /> : <BiTrendingDown size={16} />}
              <span className="ms-1 fw-bold">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <h4 className="mb-1">{value}</h4>
        <h6 className="text-muted mb-0">{title}</h6>
        {subtitle && <small className="text-muted">{subtitle}</small>}
      </Card.Body>
    </Card>
  );

  // Composant de graphique simple
  const SimpleChart = ({ data, title, type = 'line' }) => (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Header className="bg-white border-0">
        <h6 className="mb-0">{title}</h6>
      </Card.Header>
      <Card.Body>
        {data && data.length > 0 ? (
          <div className="text-center py-4">
            <BiBarChart size={48} className="text-muted mb-3" />
            <p className="text-muted">Graphique {type} à implémenter</p>
            <small className="text-muted">
              {data.length} points de données disponibles
            </small>
          </div>
        ) : (
          <div className="text-center py-4">
            <BiBarChart size={48} className="text-muted mb-3" />
            <p className="text-muted">Aucune donnée disponible</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header avec contrôles */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Analytics et rapports</h4>
          <p className="text-muted mb-0">Analysez vos performances et vos ventes</p>
        </div>
        <div className="d-flex gap-2">
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              <BiFilter className="me-1" />
              Période: {period === '7d' ? '7 jours' : period === '30d' ? '30 jours' : period === '90d' ? '90 jours' : '1 an'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setPeriod('7d')}>7 derniers jours</Dropdown.Item>
              <Dropdown.Item onClick={() => setPeriod('30d')}>30 derniers jours</Dropdown.Item>
              <Dropdown.Item onClick={() => setPeriod('90d')}>90 derniers jours</Dropdown.Item>
              <Dropdown.Item onClick={() => setPeriod('1y')}>1 an</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="outline-secondary" size="sm" onClick={loadAnalytics}>
            <BiRefresh className="me-1" />
            Actualiser
          </Button>
          <Button variant="outline-primary" size="sm">
            <BiDownload className="me-1" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <Row className="mb-4">
        <Col md={3}>
          <MetricCard
            title="Revenus totaux"
            value={stats?.orders?.totalRevenue ? `${stats.orders.totalRevenue.toLocaleString()}€` : '0€'}
            change={12.5}
            icon={BiDollar}
            color="success"
            subtitle={`${stats?.orders?.totalOrders || 0} commandes`}
          />
        </Col>
        <Col md={3}>
          <MetricCard
            title="Commandes"
            value={stats?.orders?.totalOrders || 0}
            change={8.2}
            icon={BiCalendar}
            color="primary"
            subtitle={`${stats?.orders?.averageOrderValue?.toFixed(0) || 0}€ en moyenne`}
          />
        </Col>
        <Col md={3}>
          <MetricCard
            title="Produits actifs"
            value={stats?.products?.activeProducts || 0}
            change={-2.1}
            icon={BiPackage}
            color="info"
            subtitle={`${stats?.products?.totalProducts || 0} au total`}
          />
        </Col>
        <Col md={3}>
          <MetricCard
            title="Taux de conversion"
            value="3.2%"
            change={5.3}
            icon={BiTrendingUp}
            color="warning"
            subtitle="Visiteurs vers clients"
          />
        </Col>
      </Row>

      {/* Graphiques */}
      <Row className="mb-4">
        <Col md={8}>
          <SimpleChart
            data={chartData}
            title="Évolution des revenus"
            type="line"
          />
        </Col>
        <Col md={4}>
          <SimpleChart
            data={stats?.ordersByStatus}
            title="Commandes par statut"
            type="pie"
          />
        </Col>
      </Row>

      <Row>
        {/* Produits les plus vendus */}
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Produits les plus vendus</h6>
              <Button variant="outline-primary" size="sm">
                <BiShow className="me-1" />
                Voir tout
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Produit</th>
                    <th>Ventes</th>
                    <th>Revenus</th>
                    <th>Croissance</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <div>
                          <div className="fw-medium">{product.name}</div>
                          <small className="text-muted">{product.sku}</small>
                        </div>
                      </td>
                      <td>
                        <Badge bg="primary">{product.sales}</Badge>
                      </td>
                      <td>
                        <strong>{product.revenue.toLocaleString()}€</strong>
                      </td>
                      <td>
                        <div className={`d-flex align-items-center ${product.growth >= 0 ? 'text-success' : 'text-danger'}`}>
                          {product.growth >= 0 ? <BiTrendingUp size={14} /> : <BiTrendingDown size={14} />}
                          <span className="ms-1">{Math.abs(product.growth)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Activité récente */}
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0">
              <h6 className="mb-0">Activité récente</h6>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="p-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <div className={`bg-${activity.type === 'order' ? 'primary' : activity.type === 'product' ? 'success' : activity.type === 'payment' ? 'success' : activity.type === 'review' ? 'warning' : 'danger'} bg-opacity-10 rounded-circle p-2 me-3`}>
                      {activity.type === 'order' && <BiPackage size={16} className={`text-${activity.type === 'order' ? 'primary' : 'success'}`} />}
                      {activity.type === 'product' && <BiPackage size={16} className="text-success" />}
                      {activity.type === 'payment' && <BiDollar size={16} className="text-success" />}
                      {activity.type === 'review' && <BiTrendingUp size={16} className="text-warning" />}
                      {activity.type === 'return' && <BiTrendingDown size={16} className="text-danger" />}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-medium">{activity.message}</div>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                    {activity.amount && (
                      <div className={`fw-bold ${activity.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                        {activity.amount >= 0 ? '+' : ''}{activity.amount.toLocaleString()}€
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Alertes et recommandations */}
      <Row className="mt-4">
        <Col>
          <Alert variant="info" className="d-flex align-items-center">
            <BiBarChart className="me-3" size={24} />
            <div>
              <strong>Conseil d'optimisation :</strong> Vos produits Nike Air Max ont une croissance de 12.5%. 
              Considérez augmenter votre stock et vos investissements publicitaires sur cette gamme.
            </div>
          </Alert>
        </Col>
      </Row>
    </div>
  );
};

export default VendorAnalytics;
