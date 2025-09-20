import React, { useState, useEffect } from 'react';
import { 
  BiCheckCircle, 
  BiXCircle, 
  BiShow, 
  BiTime, 
  BiUser, 
  BiBuilding,
  BiMail,
  BiPhone,
  BiMapPin,
  BiCalendar,
  BiFileText,
  BiShield,
  BiCreditCard,
  BiTrendingUp
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
  Tabs,
  Tab
} from 'react-bootstrap';

const AdminVendorManagement = () => {
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  // Charger les vendeurs
  useEffect(() => {
    loadVendors();
  }, [activeTab]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/vendor/admin/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setVendors(data.vendors);
      }
    } catch (error) {
      console.error('Erreur chargement vendeurs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Approuver un vendeur
  const handleApprove = async (vendorId) => {
    if (window.confirm('Êtes-vous sûr de vouloir approuver ce vendeur ?')) {
      try {
        const response = await fetch(`/api/vendor/admin/${vendorId}/approve`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert('Vendeur approuvé avec succès ! Un email de confirmation a été envoyé.');
          loadVendors();
        } else {
          alert('Erreur: ' + data.message);
        }
      } catch (error) {
        console.error('Erreur approbation vendeur:', error);
        alert('Erreur lors de l\'approbation');
      }
    }
  };

  // Rejeter un vendeur
  const handleReject = async (vendorId) => {
    if (!rejectionReason.trim()) {
      alert('Veuillez indiquer la raison du rejet');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir rejeter ce vendeur ?')) {
      try {
        const response = await fetch(`/api/vendor/admin/${vendorId}/reject`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ reason: rejectionReason })
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert('Vendeur rejeté. Un email d\'information a été envoyé.');
          setShowModal(false);
          setRejectionReason('');
          loadVendors();
        } else {
          alert('Erreur: ' + data.message);
        }
      } catch (error) {
        console.error('Erreur rejet vendeur:', error);
        alert('Erreur lors du rejet');
      }
    }
  };

  // Ouvrir le modal de rejet
  const openRejectModal = (vendor) => {
    setSelectedVendor(vendor);
    setShowModal(true);
  };

  // Obtenir la couleur du badge selon le statut
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'active': return 'success';
      case 'rejected': return 'danger';
      case 'suspended': return 'secondary';
      default: return 'secondary';
    }
  };

  // Obtenir le texte du statut en français
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'active': return 'Actif';
      case 'rejected': return 'Rejeté';
      case 'suspended': return 'Suspendu';
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

  // Vérifier si un vendeur est prêt pour l'approbation
  const isVendorReady = (vendor) => {
    const verification = vendor.verificationStatus || {};
    return Object.values(verification).every(status => status === true);
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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Gestion des vendeurs</h4>
          <p className="text-muted mb-0">Approuvez ou rejetez les demandes d'inscription vendeur</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={loadVendors}>
            <BiTrendingUp className="me-1" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{vendors.length}</h3>
              <p className="mb-0">En attente</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">0</h3>
              <p className="mb-0">Approuvés</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-danger">0</h3>
              <p className="mb-0">Rejetés</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">0</h3>
              <p className="mb-0">Total</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tableau des vendeurs */}
      <Card>
        <Card.Header>
          <h6 className="mb-0">Demandes d'inscription vendeur</h6>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Entreprise</th>
                <th>Contact</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Vérifications</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(vendor => (
                <tr key={vendor._id}>
                  <td>
                    <div>
                      <div className="fw-medium">{vendor.businessName}</div>
                      <small className="text-muted">{vendor.taxId}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="d-flex align-items-center mb-1">
                        <BiMail className="me-2" size={14} />
                        <small>{vendor.contactEmail}</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <BiPhone className="me-2" size={14} />
                        <small>{vendor.phone}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg="info">
                      {vendor.businessType === 'individual' ? 'Individuel' : 
                       vendor.businessType === 'company' ? 'Société' : 'Corporation'}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusBadgeColor(vendor.status)}>
                      {getStatusText(vendor.status)}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Badge bg={vendor.verificationStatus?.identity ? 'success' : 'secondary'} size="sm">
                        <BiShield size={12} />
                      </Badge>
                      <Badge bg={vendor.verificationStatus?.bank ? 'success' : 'secondary'} size="sm">
                        <BiCreditCard size={12} />
                      </Badge>
                      <Badge bg={vendor.verificationStatus?.tax ? 'success' : 'secondary'} size="sm">
                        <BiFileText size={12} />
                      </Badge>
                    </div>
                  </td>
                  <td>
                    <small>{formatDate(vendor.createdAt)}</small>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setSelectedVendor(vendor);
                          setShowModal(true);
                        }}
                      >
                        <BiShow size={14} />
                      </Button>
                      {isVendorReady(vendor) ? (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleApprove(vendor._id)}
                        >
                          <BiCheckCircle size={14} />
                        </Button>
                      ) : (
                        <Button
                          variant="outline-warning"
                          size="sm"
                          disabled
                          title="Vérifications incomplètes"
                        >
                          <BiTime size={14} />
                        </Button>
                      )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => openRejectModal(vendor)}
                      >
                        <BiXCircle size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal de détails et rejet */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Détails du vendeur - {selectedVendor?.businessName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVendor && (
            <div>
              <Tabs defaultActiveKey="info" className="mb-3">
                <Tab eventKey="info" title="Informations générales">
                  <Row className="g-3">
                    <Col md={6}>
                      <h6>Informations de l'entreprise</h6>
                      <p><strong>Nom :</strong> {selectedVendor.businessName}</p>
                      <p><strong>Type :</strong> {selectedVendor.businessType}</p>
                      <p><strong>Tax ID :</strong> {selectedVendor.taxId}</p>
                      <p><strong>Site web :</strong> {selectedVendor.website || 'Non renseigné'}</p>
                    </Col>
                    <Col md={6}>
                      <h6>Contact</h6>
                      <p><strong>Email :</strong> {selectedVendor.contactEmail}</p>
                      <p><strong>Téléphone :</strong> {selectedVendor.phone}</p>
                      <p><strong>Date d'inscription :</strong> {formatDate(selectedVendor.createdAt)}</p>
                    </Col>
                  </Row>
                  
                  <Row className="g-3 mt-3">
                    <Col md={12}>
                      <h6>Adresse de l'entreprise</h6>
                      <p>
                        {selectedVendor.businessAddress?.street}<br />
                        {selectedVendor.businessAddress?.city}, {selectedVendor.businessAddress?.state} {selectedVendor.businessAddress?.postalCode}<br />
                        {selectedVendor.businessAddress?.country}
                      </p>
                    </Col>
                  </Row>
                </Tab>
                
                <Tab eventKey="verification" title="Vérifications">
                  <div className="mb-3">
                    <h6>Statut des vérifications</h6>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span>Identité</span>
                        <Badge bg={selectedVendor.verificationStatus?.identity ? 'success' : 'secondary'}>
                          {selectedVendor.verificationStatus?.identity ? 'Validée' : 'En attente'}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>Informations bancaires</span>
                        <Badge bg={selectedVendor.verificationStatus?.bank ? 'success' : 'secondary'}>
                          {selectedVendor.verificationStatus?.bank ? 'Validées' : 'En attente'}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>Informations fiscales</span>
                        <Badge bg={selectedVendor.verificationStatus?.tax ? 'success' : 'secondary'}>
                          {selectedVendor.verificationStatus?.tax ? 'Validées' : 'En attente'}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>Conformité</span>
                        <Badge bg={selectedVendor.verificationStatus?.compliance ? 'success' : 'secondary'}>
                          {selectedVendor.verificationStatus?.compliance ? 'Validée' : 'En attente'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Tab>
                
                <Tab eventKey="reject" title="Rejeter">
                  <Alert variant="warning">
                    <strong>Attention :</strong> Le rejet de cette demande enverra un email au vendeur avec les informations nécessaires pour corriger sa demande.
                  </Alert>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Raison du rejet *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Expliquez pourquoi cette demande est rejetée et quelles informations doivent être corrigées..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </Form.Group>
                  
                  <div className="d-flex gap-2">
                    <Button 
                      variant="danger" 
                      onClick={() => handleReject(selectedVendor._id)}
                      disabled={!rejectionReason.trim()}
                    >
                      <BiXCircle className="me-1" />
                      Rejeter la demande
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                      Annuler
                    </Button>
                  </div>
                </Tab>
              </Tabs>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminVendorManagement;
