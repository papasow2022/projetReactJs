import React, { useState, useEffect } from 'react';
import { 
  BiPlus, 
  BiEdit, 
  BiTrash, 
  BiShow, 
  BiPause, 
  BiPlay, 
  BiSearch, 
  BiFilter,
  BiDownload,
  BiUpload,
  BiImage,
  BiPackage,
  BiDollar,
  BiStar,
  BiCalendar,
  BiCheckCircle,
  BiXCircle
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
  Pagination
} from 'react-bootstrap';

const VendorProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    subcategory: '',
    brand: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    cost: '',
    inventory: {
      quantity: 0,
      lowStockThreshold: 10,
      trackInventory: true,
      allowBackorder: false
    },
    images: [],
    status: 'draft',
    visibility: 'public',
    tags: [],
    seo: {
      title: '',
      description: '',
      keywords: []
    }
  });

  // Charger les produits
  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm, statusFilter, categoryFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(categoryFilter !== 'all' && { category: categoryFilter })
      });

      const response = await fetch(`/api/vendor/products?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gérer l'ouverture du modal
  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        price: product.price?.toString() || '',
        compareAtPrice: product.compareAtPrice?.toString() || '',
        cost: product.cost?.toString() || '',
        tags: product.tags || [],
        'seo.keywords': product.seo?.keywords || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        category: '',
        subcategory: '',
        brand: '',
        sku: '',
        price: '',
        compareAtPrice: '',
        cost: '',
        inventory: {
          quantity: 0,
          lowStockThreshold: 10,
          trackInventory: true,
          allowBackorder: false
        },
        images: [],
        status: 'draft',
        visibility: 'public',
        tags: [],
        seo: {
          title: '',
          description: '',
          keywords: []
        }
      });
    }
    setShowModal(true);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct 
        ? `/api/vendor/products/${editingProduct._id}`
        : '/api/vendor/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
          cost: formData.cost ? parseFloat(formData.cost) : null
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowModal(false);
        loadProducts();
      } else {
        alert('Erreur: ' + data.message);
      }
    } catch (error) {
      console.error('Erreur sauvegarde produit:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  // Supprimer un produit
  const handleDelete = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const response = await fetch(`/api/vendor/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          loadProducts();
        } else {
          alert('Erreur: ' + data.message);
        }
      } catch (error) {
        console.error('Erreur suppression produit:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  // Changer le statut d'un produit
  const handleStatusChange = async (productId, newStatus) => {
    try {
      const response = await fetch(`/api/vendor/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        loadProducts();
      } else {
        alert('Erreur: ' + data.message);
      }
    } catch (error) {
      console.error('Erreur changement statut:', error);
      alert('Erreur lors du changement de statut');
    }
  };

  // Obtenir la couleur du badge selon le statut
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'secondary';
      case 'pending': return 'warning';
      case 'inactive': return 'danger';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  // Obtenir le texte du statut en français
  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'draft': return 'Brouillon';
      case 'pending': return 'En attente';
      case 'inactive': return 'Inactif';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
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
          <h4 className="mb-1">Gestion des produits</h4>
          <p className="text-muted mb-0">Gérez votre catalogue de produits</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm">
            <BiDownload className="me-1" />
            Exporter
          </Button>
          <Button variant="outline-secondary" size="sm">
            <BiUpload className="me-1" />
            Importer
          </Button>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <BiPlus className="me-1" />
            Nouveau produit
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
                  placeholder="Rechercher un produit..."
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
                <option value="active">Actif</option>
                <option value="draft">Brouillon</option>
                <option value="pending">En attente</option>
                <option value="inactive">Inactif</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Toutes les catégories</option>
                <option value="chaussures">Chaussures</option>
                <option value="pantalons">Pantalons</option>
                <option value="vestes">Vestes</option>
                <option value="accessoires">Accessoires</option>
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

      {/* Tableau des produits */}
      <Card>
        <Card.Body className="p-0">
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>Produit</th>
                <th>SKU</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Statut</th>
                <th>Performance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={product.primaryImage || '/assets/images/placeholder.jpg'}
                        alt={product.name}
                        className="rounded me-3"
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                      />
                      <div>
                        <h6 className="mb-1">{product.name}</h6>
                        <small className="text-muted">{product.brand}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code>{product.sku}</code>
                  </td>
                  <td>
                    <div>
                      <strong>{product.price.toLocaleString()}€</strong>
                      {product.compareAtPrice && (
                        <div>
                          <small className="text-muted text-decoration-line-through">
                            {product.compareAtPrice.toLocaleString()}€
                          </small>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      <span className={product.inventory.available <= product.inventory.lowStockThreshold ? 'text-danger' : ''}>
                        {product.inventory.available}
                      </span>
                      {product.inventory.trackInventory && (
                        <small className="text-muted d-block">
                          / {product.inventory.quantity}
                        </small>
                      )}
                    </div>
                  </td>
                  <td>
                    <Badge bg={getStatusBadgeColor(product.status)}>
                      {getStatusText(product.status)}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <BiStar className="text-warning me-1" size={14} />
                      <span className="me-2">{product.metrics.rating.toFixed(1)}</span>
                      <small className="text-muted">({product.metrics.reviewCount})</small>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleOpenModal(product)}
                      >
                        <BiEdit size={14} />
                      </Button>
                      <Button
                        variant="outline-info"
                        size="sm"
                      >
                        <BiShow size={14} />
                      </Button>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => handleStatusChange(
                          product._id, 
                          product.status === 'active' ? 'inactive' : 'active'
                        )}
                      >
                        {product.status === 'active' ? <BiPause size={14} /> : <BiPlay size={14} />}
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(product._id)}
                      >
                        <BiTrash size={14} />
                      </Button>
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

      {/* Modal de création/édition */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nom du produit *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>SKU *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Marque *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Catégorie *</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="chaussures">Chaussures</option>
                    <option value="pantalons">Pantalons</option>
                    <option value="vestes">Vestes</option>
                    <option value="accessoires">Accessoires</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Prix *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Prix de comparaison</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({...formData, compareAtPrice: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Quantité en stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.inventory.quantity}
                    onChange={(e) => setFormData({
                      ...formData, 
                      inventory: {...formData.inventory, quantity: parseInt(e.target.value)}
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Seuil de stock bas</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.inventory.lowStockThreshold}
                    onChange={(e) => setFormData({
                      ...formData, 
                      inventory: {...formData.inventory, lowStockThreshold: parseInt(e.target.value)}
                    })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {editingProduct ? 'Mettre à jour' : 'Créer'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default VendorProductManager;
