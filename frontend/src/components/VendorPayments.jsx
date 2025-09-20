import React, { useState, useEffect } from 'react';
import { 
  BiDollar, 
  BiCalendar,
  BiDownload,
  BiRefresh,
  BiFilter,
  BiShow,
  BiCheckCircle,
  BiTime,
  BiErrorCircle,
  BiTrendingUp,
  BiCreditCard,
  BiBuilding
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
  Alert,
  ProgressBar
} from 'react-bootstrap';

const VendorPayments = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [period, setPeriod] = useState('30d');
  const [statusFilter, setStatusFilter] = useState('all');

  // Charger les données de paiement
  useEffect(() => {
    loadPayments();
  }, [period, statusFilter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      
      // Simuler des données de paiement
      const mockPayments = [
        {
          id: 'PAY-001',
          date: '2024-01-15',
          amount: 1234.50,
          status: 'completed',
          method: 'bank_transfer',
          description: 'Paiement mensuel - Janvier 2024',
          orders: 15,
          fees: 185.18,
          netAmount: 1049.32
        },
        {
          id: 'PAY-002',
          date: '2024-01-08',
          amount: 856.75,
          status: 'completed',
          method: 'bank_transfer',
          description: 'Paiement hebdomadaire',
          orders: 8,
          fees: 128.51,
          netAmount: 728.24
        },
        {
          id: 'PAY-003',
          date: '2024-01-01',
          amount: 2100.00,
          status: 'pending',
          method: 'bank_transfer',
          description: 'Paiement mensuel - Décembre 2023',
          orders: 25,
          fees: 315.00,
          netAmount: 1785.00
        },
        {
          id: 'PAY-004',
          date: '2023-12-25',
          amount: 567.25,
          status: 'processing',
          method: 'bank_transfer',
          description: 'Paiement de Noël',
          orders: 6,
          fees: 85.09,
          netAmount: 482.16
        },
        {
          id: 'PAY-005',
          date: '2023-12-18',
          amount: 1456.80,
          status: 'completed',
          method: 'bank_transfer',
          description: 'Paiement hebdomadaire',
          orders: 18,
          fees: 218.52,
          netAmount: 1238.28
        }
      ];

      setPayments(mockPayments);

      // Résumé des paiements
      setSummary({
        totalEarnings: 6215.30,
        pendingAmount: 1785.00,
        processingAmount: 482.16,
        completedAmount: 3948.14,
        nextPayout: '2024-01-22',
        averagePayout: 1243.06,
        totalFees: 932.30,
        netEarnings: 5283.00
      });

    } catch (error) {
      console.error('Erreur chargement paiements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtenir la couleur du badge selon le statut
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'failed': return 'danger';
      case 'cancelled': return 'secondary';
      default: return 'secondary';
    }
  };

  // Obtenir le texte du statut en français
  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'pending': return 'En attente';
      case 'processing': return 'En cours';
      case 'failed': return 'Échoué';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  // Obtenir l'icône de la méthode de paiement
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'bank_transfer': return <BiBuilding size={16} />;
      case 'credit_card': return <BiCreditCard size={16} />;
      default: return <BiDollar size={16} />;
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
          <h4 className="mb-1">Gestion des paiements</h4>
          <p className="text-muted mb-0">Suivez vos gains et vos paiements</p>
        </div>
        <div className="d-flex gap-2">
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">Tous les statuts</option>
            <option value="completed">Terminé</option>
            <option value="pending">En attente</option>
            <option value="processing">En cours</option>
            <option value="failed">Échoué</option>
          </Form.Select>
          <Button variant="outline-secondary" size="sm" onClick={loadPayments}>
            <BiRefresh className="me-1" />
            Actualiser
          </Button>
          <Button variant="outline-primary" size="sm">
            <BiDownload className="me-1" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Résumé des paiements */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                <BiDollar className="text-success" size={24} />
              </div>
              <h4 className="text-success mb-1">{summary?.totalEarnings.toLocaleString()}€</h4>
              <h6 className="text-muted mb-0">Gains totaux</h6>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                <BiTime className="text-warning" size={24} />
              </div>
              <h4 className="text-warning mb-1">{summary?.pendingAmount.toLocaleString()}€</h4>
              <h6 className="text-muted mb-0">En attente</h6>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="bg-info bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                <BiTrendingUp className="text-info" size={24} />
              </div>
              <h4 className="text-info mb-1">{summary?.averagePayout.toLocaleString()}€</h4>
              <h6 className="text-muted mb-0">Paiement moyen</h6>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                <BiCalendar className="text-primary" size={24} />
              </div>
              <h4 className="text-primary mb-1">{formatDate(summary?.nextPayout)}</h4>
              <h6 className="text-muted mb-0">Prochain paiement</h6>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Informations sur les frais */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h6 className="mb-0">Détail des frais</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Commission plateforme (15%)</span>
                <span className="fw-bold">{summary?.totalFees.toLocaleString()}€</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Gains nets</span>
                <span className="fw-bold text-success">{summary?.netEarnings.toLocaleString()}€</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Total brut</span>
                <span className="fw-bold">{summary?.totalEarnings.toLocaleString()}€</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h6 className="mb-0">Prochain paiement</h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Montant en attente</span>
                  <span>{summary?.pendingAmount.toLocaleString()}€</span>
                </div>
                <ProgressBar 
                  now={75} 
                  variant="success" 
                  style={{ height: '8px' }}
                />
                <small className="text-muted">75% du seuil de paiement atteint</small>
              </div>
              <Alert variant="info" className="mb-0">
                <BiInfoCircle className="me-2" />
                Paiement automatique programmé pour le {formatDate(summary?.nextPayout)}
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Historique des paiements */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0">
          <h6 className="mb-0">Historique des paiements</h6>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>ID Paiement</th>
                <th>Date</th>
                <th>Montant brut</th>
                <th>Frais</th>
                <th>Montant net</th>
                <th>Commandes</th>
                <th>Statut</th>
                <th>Méthode</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td>
                    <code>{payment.id}</code>
                  </td>
                  <td>{formatDate(payment.date)}</td>
                  <td>
                    <strong>{payment.amount.toLocaleString()}€</strong>
                  </td>
                  <td>
                    <span className="text-danger">-{payment.fees.toLocaleString()}€</span>
                  </td>
                  <td>
                    <strong className="text-success">{payment.netAmount.toLocaleString()}€</strong>
                  </td>
                  <td>
                    <Badge bg="primary">{payment.orders}</Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusBadgeColor(payment.status)}>
                      {getStatusText(payment.status)}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      {getPaymentMethodIcon(payment.method)}
                      <span className="ms-2">
                        {payment.method === 'bank_transfer' ? 'Virement' : 'Carte'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button variant="outline-primary" size="sm">
                        <BiShow size={14} />
                      </Button>
                      {payment.status === 'completed' && (
                        <Button variant="outline-success" size="sm">
                          <BiDownload size={14} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Informations sur les paiements */}
      <Row className="mt-4">
        <Col>
          <Alert variant="light" className="d-flex align-items-start">
            <BiInfoCircle className="me-3 mt-1" size={20} />
            <div>
              <h6 className="mb-2">Informations sur les paiements</h6>
              <ul className="mb-0 small">
                <li>Les paiements sont effectués automatiquement tous les 7 jours</li>
                <li>Le seuil minimum de paiement est de 50€</li>
                <li>Les frais de commission sont de 15% sur chaque vente</li>
                <li>Les paiements en attente incluent les commandes en cours de traitement</li>
                <li>Vous recevrez un email de confirmation à chaque paiement</li>
              </ul>
            </div>
          </Alert>
        </Col>
      </Row>
    </div>
  );
};

export default VendorPayments;
