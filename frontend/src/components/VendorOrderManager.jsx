import React, { useState, useEffect } from 'react';
import { 
  BiSearch, 
  BiFilter,
  BiDownload,
  BiShow,
  BiCheckCircle,
  BiXCircle,
  BiCar,
  BiPackage,
  BiCalendar,
  BiDollar,
  BiUser,
  BiPhone,
  BiMapPin,
  BiEdit,
  BiRefresh
} from 'react-icons/bi';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Badge, 
  Modal, 
  Form, 
  Alert,
  Spinner,
  InputGroup,
  Dropdown,
  Pagination,
  Accordion
} from 'react-bootstrap';

const VendorOrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    note: ''
  });

  // Charger les commandes
  useEffect(() => {
    loadOrders();
  }, [currentPage, searchTerm, statusFilter, dateFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`/api/vendor/orders?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir le modal de détails
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Mettre à jour le statut d'une commande
  const handleStatusUpdate = async () => {
    if (!selectedOrder || !statusUpdate.status) return;

    try {
      const response = await fetch(`/api/vendor/orders/${selectedOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(statusUpdate)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowModal(false);
        setStatusUpdate({ status: '', note: '' });
        loadOrders();
      } else {
        alert('Erreur: ' + data.message);
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Obtenir la couleur du badge selon le statut
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'processing': return 'primary';
      case 'shipped': return 'success';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      case 'returned': return 'warning';
      case 'refunded': return 'secondary';
      default: return 'secondary';
    }
  };

  // Obtenir le texte du statut en français
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'processing': return 'En préparation';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      case 'returned': return 'Retournée';
      case 'refunded': return 'Remboursée';
      default: return status;
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      {/* Header avec actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Gestion des commandes</h4>
          <p className="text-muted mb-0">Suivez et gérez vos commandes</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm">
            <BiDownload className="me-1" />
            Exporter
          </Button>
          <Button variant="outline-primary" size="sm" onClick={loadOrders}>
            <BiRefresh className="me-1" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <BiSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Rechercher une commande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="processing">En préparation</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button variant="outline-primary" className="w-100">
                <BiFilter className="me-1" />
                Filtrer
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tableau des commandes */}
      <Card>
        <Card.Body className="p-0">
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>Commande</th>
                <th>Client</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Livraison</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>
                    <div>
                      <strong>#{order.orderNumber}</strong>
                      <div className="text-muted small">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="fw-medium">{order.customer.name}</div>
                      <small className="text-muted">{order.customer.email}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div>{formatDate(order.orderDate)}</div>
                      {order.shippedAt && (
                        <small className="text-muted">
                          Expédiée: {formatDate(order.shippedAt)}
                        </small>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>{order.pricing.total.toLocaleString()}€</strong>
                      <div className="text-muted small">
                        Frais: {order.fees.totalFees.toLocaleString()}€
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg={getStatusBadgeColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </td>
                  <td>
                    {order.shipping.trackingNumber ? (
                      <div>
                        <div className="small">{order.shipping.carrier}</div>
                        <code className="small">{order.shipping.trackingNumber}</code>
                      </div>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        <BiShow size={14} />
                      </Button>
                      {['pending', 'confirmed', 'processing'].includes(order.status) && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setStatusUpdate({ status: 'shipped', note: '' });
                            setShowModal(true);
                          }}
                        >
                          <BiCar size={14} />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </Pagination>
        </div>
      )}

      {/* Modal de détails de commande */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            Commande #{selectedOrder?.orderNumber}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              {/* Informations générales */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">Informations client</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="mb-2">
                        <strong>{selectedOrder.customer.name}</strong>
                      </div>
                      <div className="mb-2">
                        <BiUser className="me-2" />
                        {selectedOrder.customer.email}
                      </div>
                      {selectedOrder.customer.phone && (
                        <div className="mb-2">
                          <BiPhone className="me-2" />
                          {selectedOrder.customer.phone}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">Adresse de livraison</h6>
                    </Card.Header>
                    <Card.Body>
                      <div>
                        <BiMapPin className="me-2" />
                        {selectedOrder.shippingAddress.street}<br />
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}<br />
                        {selectedOrder.shippingAddress.country}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Articles de la commande */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">Articles commandés</h6>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>SKU</th>
                        <th>Quantité</th>
                        <th>Prix unitaire</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="rounded me-3"
                                  style={{ width: 40, height: 40, objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                <div className="fw-medium">{item.name}</div>
                                {item.variant && item.variant.attributes.length > 0 && (
                                  <small className="text-muted">
                                    {item.variant.attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ')}
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <code>{item.sku}</code>
                          </td>
                          <td>{item.quantity}</td>
                          <td>{item.unitPrice.toLocaleString()}€</td>
                          <td>{item.totalPrice.toLocaleString()}€</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              {/* Résumé financier */}
              <Row className="mb-4">
                <Col md={6}>
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">Résumé financier</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Sous-total:</span>
                        <span>{selectedOrder.pricing.subtotal.toLocaleString()}€</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Livraison:</span>
                        <span>{selectedOrder.pricing.shipping.toLocaleString()}€</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Taxes:</span>
                        <span>{selectedOrder.pricing.tax.toLocaleString()}€</span>
                      </div>
                      {selectedOrder.pricing.discount > 0 && (
                        <div className="d-flex justify-content-between mb-2 text-success">
                          <span>Remise:</span>
                          <span>-{selectedOrder.pricing.discount.toLocaleString()}€</span>
                        </div>
                      )}
                      <hr />
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span>{selectedOrder.pricing.total.toLocaleString()}€</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header>
                      <h6 className="mb-0">Frais et commissions</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Commission plateforme:</span>
                        <span>{selectedOrder.fees.platformCommission.toLocaleString()}€</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Traitement paiement:</span>
                        <span>{selectedOrder.fees.paymentProcessing.toLocaleString()}€</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Frais livraison:</span>
                        <span>{selectedOrder.fees.shippingFee.toLocaleString()}€</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total frais:</span>
                        <span>{selectedOrder.fees.totalFees.toLocaleString()}€</span>
                      </div>
                      <div className="d-flex justify-content-between fw-bold text-success">
                        <span>Vos gains:</span>
                        <span>{(selectedOrder.pricing.total - selectedOrder.fees.totalFees).toLocaleString()}€</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Mise à jour du statut */}
              <Card>
                <Card.Header>
                  <h6 className="mb-0">Mise à jour du statut</h6>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Nouveau statut</Form.Label>
                        <Form.Select
                          value={statusUpdate.status}
                          onChange={(e) => setStatusUpdate({...statusUpdate, status: e.target.value})}
                        >
                          <option value="">Sélectionner un statut</option>
                          <option value="confirmed">Confirmée</option>
                          <option value="processing">En préparation</option>
                          <option value="shipped">Expédiée</option>
                          <option value="delivered">Livrée</option>
                          <option value="cancelled">Annulée</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Note (optionnelle)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ajouter une note..."
                          value={statusUpdate.note}
                          onChange={(e) => setStatusUpdate({...statusUpdate, note: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
          {statusUpdate.status && (
            <Button variant="primary" onClick={handleStatusUpdate}>
              Mettre à jour le statut
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VendorOrderManager;
