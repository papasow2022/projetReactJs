import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../amazon-like.css';
import { useOrdersPolling } from '../hooks/useOrderPolling';
import { useOrderWebSocket } from '../hooks/useWebSocket';
import { ORDER_STATUS, getStatusLabel } from '../constants/orderStatus';

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    carrier: '',
    trackingNumber: '',
    trackingUrl: '',
    estimatedDelivery: ''
  });
  const [stepForm, setStepForm] = useState({
    status: '',
    description: '',
    location: ''
  });
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    byStatus: []
  });

  // Polling automatique des commandes (mise à jour toutes les 10 secondes pour l'admin) - FALLBACK
  const { 
    orders: realTimeOrders, 
    loading: pollingLoading, 
    error: pollingError,
    refreshOrders 
  } = useOrdersPolling(10000);

  // WebSocket pour les mises à jour en temps réel
  const { isConnected: wsConnected } = useOrderWebSocket(
    // Callback pour les mises à jour de commandes
    (data) => {
      console.log('🔄 Mise à jour WebSocket admin reçue:', data);
      
      // Mettre à jour la commande spécifique avec toutes les données
      setOrders(prev => prev.map(order => 
        order._id === data.orderId
          ? { 
              ...order, 
              status: data.newStatus,
              tracking: data.tracking || order.tracking,
              ...data
            }
          : order
      ));
      
      // Si c'est la commande sélectionnée, la mettre à jour aussi
      if (selectedOrder && selectedOrder._id === data.orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          status: data.newStatus,
          tracking: data.tracking || prev.tracking,
          ...data
        }));
      }
    },
    // Callback pour les nouvelles commandes
    (data) => {
      console.log('🆕 Nouvelle commande WebSocket admin reçue:', data);
      
      // Ajouter la nouvelle commande en haut de la liste
      setOrders(prev => [data, ...prev]);
      
      // Recharger les stats
      fetchStats();
    }
  );

  // Charger les commandes
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });

      // Récupérer le token d'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${baseUrl}/api/orders/admin/all?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();

      if (result.success) {
        setOrders(result.orders);
        setPagination(result.pagination);
      } else {
        throw new Error(result.message || 'Erreur lors du chargement des commandes');
      }
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
      alert('Erreur lors du chargement des commandes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les statistiques
  const fetchStats = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      
      // Récupérer le token d'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${baseUrl}/api/orders/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();

      if (result.success) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('❌ Erreur chargement stats:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [pagination.page, filters]);

  // Mise à jour automatique avec les données du polling
  useEffect(() => {
    if (realTimeOrders && realTimeOrders.length > 0) {
      console.log('🔄 Mise à jour automatique des commandes admin:', realTimeOrders.length);
      
      // Mettre à jour la liste des commandes avec les nouvelles données
      setOrders(realTimeOrders);
      
      // Recharger les stats pour avoir les données à jour
      fetchStats();
    }
  }, [realTimeOrders]);

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      
      // Récupérer le token d'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }
      
      const response = await fetch(`${baseUrl}/api/orders/admin/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (result.success) {
        // Mettre à jour la liste des commandes
    setOrders(prev => prev.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus }
            : order
        ));
        
        // Fermer le modal
        setSelectedOrder(null);
        
        // Recharger les stats
        fetchStats();
        
        alert('Statut mis à jour avec succès !');
      } else {
        throw new Error(result.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour: ' + error.message);
    }
  };

  // Initialiser le suivi d'une commande
  const initializeTracking = async (orderId) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseUrl}/api/tracking/admin/orders/${orderId}/tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(trackingForm)
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Suivi initialisé:', result);
        
        // Mettre à jour la commande
        setOrders(prev => prev.map(order => 
          order._id === orderId 
            ? { ...order, tracking: result.tracking }
            : order
        ));
        
        // Fermer le modal et réinitialiser le formulaire
        setShowTrackingModal(false);
        setTrackingForm({
          carrier: '',
          trackingNumber: '',
          trackingUrl: '',
          estimatedDelivery: ''
        });
        
        alert('Suivi initialisé avec succès !');
      } else {
        console.error('❌ Erreur initialisation suivi:', result);
        alert(`Erreur: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Erreur initialisation suivi:', error);
      alert('Erreur lors de l\'initialisation du suivi');
    }
  };

  // Ajouter une étape de suivi
  const addTrackingStep = async (orderId) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseUrl}/api/tracking/admin/orders/${orderId}/tracking/steps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(stepForm)
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Étape ajoutée:', result);
        
        // Mettre à jour la commande
        setOrders(prev => prev.map(order => 
          order._id === orderId 
            ? { ...order, tracking: result.tracking }
            : order
        ));
        
        // Fermer le modal et réinitialiser le formulaire
        setShowAddStepModal(false);
        setStepForm({
          status: '',
          description: '',
          location: ''
        });
        
        alert('Étape de suivi ajoutée avec succès !');
      } else {
        console.error('❌ Erreur ajout étape:', result);
        alert(`Erreur: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Erreur ajout étape:', error);
      alert('Erreur lors de l\'ajout de l\'étape');
    }
  };

  // Gérer les filtres
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Obtenir la couleur du badge selon le statut
  const getStatusBadgeColor = (status) => {
    const colors = {
      [ORDER_STATUS.PENDING]: 'bg-warning',
      [ORDER_STATUS.CONFIRMED]: 'bg-info',
      [ORDER_STATUS.PROCESSING]: 'bg-primary',
      [ORDER_STATUS.READY]: 'bg-success',
      [ORDER_STATUS.SHIPPED]: 'bg-dark',
      [ORDER_STATUS.DELIVERED]: 'bg-success',
      [ORDER_STATUS.CANCELLED]: 'bg-danger'
    };
    return colors[status] || 'bg-secondary';
  };

  // Obtenir le texte du statut
  const getStatusText = (status) => {
    return getStatusLabel(status);
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

  // Formater le prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' GNF';
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
      <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="bi bi-box-seam me-2"></i>
              Gestion des commandes
            </h2>
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={() => navigate('/admin/returns')}
                title="Gérer les retours et remboursements"
              >
                <i className="bi bi-arrow-return-left me-1"></i>
                Retours
              </button>
              {/* Indicateur WebSocket */}
              <div className="d-flex align-items-center">
                {wsConnected ? (
                  <div className="d-flex align-items-center text-success">
                    <div className="rounded-circle bg-success me-2" style={{width: '8px', height: '8px'}}></div>
                    <small>Temps réel</small>
                  </div>
                ) : (
                  <div className="d-flex align-items-center text-warning">
                    <div className="rounded-circle bg-warning me-2" style={{width: '8px', height: '8px'}}></div>
                    <small>Polling</small>
                  </div>
                )}
              </div>

              {/* Indicateur de mise à jour automatique */}
              {pollingLoading && (
                <div className="d-flex align-items-center text-success">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                  <small>Mise à jour...</small>
                </div>
              )}
              
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={refreshOrders}
                title="Actualiser les commandes"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
              
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate('/admin')}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Retour au tableau de bord
              </button>
            </div>
      </div>

      {/* Statistiques */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.totalOrders}</h4>
                      <p className="mb-0">Total commandes</p>
            </div>
                    <i className="bi bi-box-seam" style={{ fontSize: '2rem' }}></i>
            </div>
          </div>
        </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{formatPrice(stats.totalRevenue)}</h4>
                      <p className="mb-0">Chiffre d'affaires</p>
          </div>
                    <i className="bi bi-currency-dollar" style={{ fontSize: '2rem' }}></i>
            </div>
          </div>
        </div>
      </div>
            <div className="col-md-3">
              <div className="card bg-warning text-white">
            <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>
                        {stats.byStatus.find(s => s._id === 'En attente')?.count || 0}
                      </h4>
                      <p className="mb-0">En attente</p>
                    </div>
                    <i className="bi bi-clock" style={{ fontSize: '2rem' }}></i>
                </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>
                        {stats.byStatus.find(s => s._id === 'En préparation')?.count || 0}
                      </h4>
                      <p className="mb-0">En préparation</p>
          </div>
                    <i className="bi bi-gear" style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
          <div className="card mb-4">
        <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <label className="form-label">Statut</label>
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">Tous les statuts</option>
                    <option value="En attente">En attente</option>
                    <option value="Confirmée">Confirmée</option>
                    <option value="En préparation">En préparation</option>
                    <option value={ORDER_STATUS.READY}>{getStatusLabel(ORDER_STATUS.READY)}</option>
                    <option value="Expédiée">Expédiée</option>
                    <option value="Livrée">Livrée</option>
                    <option value="Annulée">Annulée</option>
                    <option value="Retournée">Retournée</option>
                    <option value="Remboursée">Remboursée</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Recherche</label>
                <input
                  type="text"
                  className="form-control"
                    placeholder="Numéro, nom, email..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
            </div>
            <div className="col-md-3">
                  <label className="form-label">Date début</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
            </div>
            <div className="col-md-3">
                  <label className="form-label">Date fin</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des commandes */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Liste des commandes</h5>
        </div>
            <div className="card-body">
          {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">Aucune commande trouvée</p>
                </div>
          ) : (
                <>
            <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                  <tr>
                    <th>Commande</th>
                    <th>Client</th>
                          <th>Date</th>
                    <th>Total</th>
                    <th>Statut</th>
                    <th>Paiement</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                        {orders.map((order) => (
                          <tr key={order._id}>
                      <td>
                              <strong>#{order.orderNumber}</strong>
                      </td>
                      <td>
                        <div>
                                <div>{order.customer.firstName} {order.customer.lastName}</div>
                                <small className="text-muted">{order.customer.email}</small>
                        </div>
                      </td>
                            <td>{formatDate(order.orderDate)}</td>
                            <td>{formatPrice(order.total)}</td>
                            <td>
                              <span className={`badge ${getStatusBadgeColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                      </td>
                      <td>
                              <span className={`badge ${
                                order.payment.status === 'Complété' ? 'bg-success' : 
                                order.payment.status === 'En attente' ? 'bg-warning' : 'bg-danger'
                              }`}>
                                {order.payment.status === 'Complété' ? 'Payé' : 
                                 order.payment.status === 'En attente' ? 'En attente' : 'Échoué'}
                              </span>
                      </td>
                      <td>
                              <button 
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-warning"
                                title="Gérer le suivi"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowTrackingModal(true);
                                }}
                              >
                                <i className="bi bi-truck"></i>
                              </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <nav className="mt-4">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                          >
                            Précédent
                          </button>
                        </li>
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                          <li key={page} className={`page-item ${pagination.page === page ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setPagination(prev => ({ ...prev, page }))}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page === pagination.pages}
                          >
                            Suivant
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de détail de commande */}
      {selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Commande #{selectedOrder.orderNumber}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Informations client</h6>
                    <p><strong>Nom:</strong> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                    <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                    <p><strong>Téléphone:</strong> {selectedOrder.customer.phone}</p>
                    <p><strong>Adresse:</strong><br />
                      {selectedOrder.customer.address.street}<br />
                      {selectedOrder.customer.address.city}, {selectedOrder.customer.address.postalCode}<br />
                      {selectedOrder.customer.address.country}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6>Informations commande</h6>
                    <p><strong>Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
                    <p><strong>Statut:</strong> 
                      <span className={`badge ${getStatusBadgeColor(selectedOrder.status)} ms-2`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </p>
                    <p><strong>Paiement:</strong> 
                      <span className={`badge ${
                        selectedOrder.payment.status === 'completed' ? 'bg-success' : 'bg-warning'
                      } ms-2`}>
                        {selectedOrder.payment.status === 'completed' ? 'Payé' : 'En attente'}
                      </span>
                    </p>
                    <p><strong>Total:</strong> {formatPrice(selectedOrder.total)}</p>
                  </div>
                </div>

                <hr />

                <h6>Produits commandés</h6>
                <div className="table-responsive">
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Produit</th>
                          <th>Détails</th>
                        <th>Prix</th>
                        <th>Quantité</th>
                          <th>Stock</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="me-2"
                                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                                <div>
                                  <div className="fw-bold">{item.productName}</div>
                                  <small className="text-muted">SKU: {item.sku}</small>
                                </div>
                            </div>
                          </td>
                            <td>
                              <div className="small">
                                <div><strong>Marque:</strong> {item.brand || 'N/A'}</div>
                                <div><strong>Catégorie:</strong> {item.category || 'N/A'}</div>
                                <div><strong>Genre:</strong> {item.genre || 'N/A'}</div>
                                <div><strong>Couleur:</strong> {item.color || 'N/A'}</div>
                                <div><strong>Taille:</strong> {item.size || 'N/A'}</div>
                              </div>
                            </td>
                            <td>
                              <div className="fw-bold">{formatPrice(item.price)}</div>
                            </td>
                            <td>
                              <span className="badge bg-primary">{item.quantity}</span>
                            </td>
                            <td>
                              <div className="small">
                                <div><strong>Avant:</strong> {item.stockBefore || 0}</div>
                                <div><strong>Après:</strong> {item.stockAfter || 0}</div>
                                <div className={`fw-bold ${(item.stockRemaining || 0) < 5 ? 'text-danger' : 'text-success'}`}>
                                  <strong>Restant:</strong> {item.stockRemaining || 0}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="fw-bold text-success">{formatPrice(item.total)}</div>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>

                <hr />

                <h6>Changer le statut</h6>
                <div className="d-flex gap-2 flex-wrap">
                    <button
                      className={`btn btn-sm ${
                      selectedOrder.status === 'En attente' ? 'btn-primary' : 'btn-outline-primary'
                      }`}
                    onClick={() => updateOrderStatus(selectedOrder._id, 'En attente')}
                    >
                    En attente
                    </button>
                  <button
                    className={`btn btn-sm ${
                      selectedOrder.status === 'Confirmée' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => updateOrderStatus(selectedOrder._id, 'Confirmée')}
                  >
                    Confirmée
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedOrder.status === 'En préparation' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => updateOrderStatus(selectedOrder._id, 'En préparation')}
                  >
                    En préparation
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedOrder.status === 'Prête' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => updateOrderStatus(selectedOrder._id, 'Prête')}
                  >
                    Prête
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedOrder.status === 'Expédiée' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => updateOrderStatus(selectedOrder._id, 'Expédiée')}
                  >
                    Expédiée
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedOrder.status === 'Livrée' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => updateOrderStatus(selectedOrder._id, 'Livrée')}
                  >
                    Livrée
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedOrder.status === 'Annulée' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => updateOrderStatus(selectedOrder._id, 'Annulée')}
                  >
                    Annulée
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedOrder.status === 'Retournée' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => updateOrderStatus(selectedOrder._id, 'Retournée')}
                  >
                    Retournée
                  </button>
                  <button
                    className={`btn btn-sm ${
                      selectedOrder.status === 'Remboursée' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => updateOrderStatus(selectedOrder._id, 'Remboursée')}
                  >
                    Remboursée
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestion du suivi */}
      {showTrackingModal && selectedOrder && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-truck me-2"></i>
                  Gestion du suivi - Commande #{selectedOrder.orderNumber}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowTrackingModal(false);
                    setSelectedOrder(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {selectedOrder.tracking ? (
                  <div>
                    {/* Suivi existant */}
                    <div className="alert alert-success">
                      <h6><i className="bi bi-check-circle me-2"></i>Suivi initialisé</h6>
                      <p className="mb-0">
                        <strong>Transporteur:</strong> {selectedOrder.tracking.carrier}<br/>
                        <strong>Numéro:</strong> {selectedOrder.tracking.trackingNumber}<br/>
                        {selectedOrder.tracking.estimatedDelivery && (
                          <><strong>Livraison prévue:</strong> {new Date(selectedOrder.tracking.estimatedDelivery).toLocaleDateString('fr-FR')}</>
                        )}
                      </p>
                    </div>

                    {/* Étapes existantes */}
                    {selectedOrder.tracking.steps && selectedOrder.tracking.steps.length > 0 && (
                      <div className="mb-4">
                        <h6>
                          <i className="bi bi-list-ol me-2"></i>
                          Étapes du suivi ({selectedOrder.tracking.steps.length})
                        </h6>
                        <div className="timeline">
                          {selectedOrder.tracking.steps
                            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                            .map((step, index) => (
                            <div key={index} className="timeline-item d-flex mb-3">
                              <div className="timeline-marker me-3">
                                <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                                  step.status.toLowerCase().includes('livré') ? 'bg-success' :
                                  step.status.toLowerCase().includes('transit') ? 'bg-warning' :
                                  step.status.toLowerCase().includes('initialisé') ? 'bg-info' :
                                  'bg-primary'
                                }`} style={{width: '30px', height: '30px'}}>
                                  <i className={`bi ${
                                    step.status.toLowerCase().includes('livré') ? 'bi-check-circle' :
                                    step.status.toLowerCase().includes('transit') ? 'bi-truck' :
                                    step.status.toLowerCase().includes('initialisé') ? 'bi-play-circle' :
                                    'bi-check'
                                  } text-white`}></i>
                                </div>
                              </div>
                              <div className="timeline-content flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start">
                                <h6 className="fw-bold mb-1">{step.status}</h6>
                                  <span className={`badge ${
                                    step.source === 'admin' ? 'bg-primary' :
                                    step.source === 'system' ? 'bg-secondary' :
                                    'bg-info'
                                  }`}>
                                    {step.source}
                                  </span>
                                </div>
                                <p className="text-muted mb-1">{step.description}</p>
                                <small className="text-muted">
                                  <i className="bi bi-clock me-1"></i>
                                  {new Date(step.timestamp).toLocaleDateString('fr-FR')} à {new Date(step.timestamp).toLocaleTimeString('fr-FR')}
                                  {step.location && (
                                    <>
                                      <br />
                                      <i className="bi bi-geo-alt me-1"></i>
                                      {step.location}
                                    </>
                                  )}
                                </small>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bouton pour ajouter une étape */}
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowAddStepModal(true)}
                    >
                      <i className="bi bi-plus me-2"></i>Ajouter une étape
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Formulaire d'initialisation du suivi */}
                    <div className="alert alert-info">
                      <h6><i className="bi bi-info-circle me-2"></i>Initialiser le suivi</h6>
                      <p className="mb-0">Ajoutez les informations de transporteur pour cette commande.</p>
                    </div>

                    <form>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Transporteur *</label>
                          <select
                            className="form-select"
                            value={trackingForm.carrier}
                            onChange={(e) => setTrackingForm(prev => ({ ...prev, carrier: e.target.value }))}
                            required
                          >
                            <option value="">Sélectionner un transporteur</option>
                            <option value="Colissimo">Colissimo</option>
                            <option value="Chronopost">Chronopost</option>
                            <option value="DHL">DHL</option>
                            <option value="UPS">UPS</option>
                            <option value="FedEx">FedEx</option>
                            <option value="Autre">Autre</option>
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Numéro de suivi *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={trackingForm.trackingNumber}
                            onChange={(e) => setTrackingForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                            placeholder="Ex: 123456789"
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">URL de suivi</label>
                          <input
                            type="url"
                            className="form-control"
                            value={trackingForm.trackingUrl}
                            onChange={(e) => setTrackingForm(prev => ({ ...prev, trackingUrl: e.target.value }))}
                            placeholder="https://..."
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Date de livraison estimée</label>
                          <input
                            type="date"
                            className="form-control"
                            value={trackingForm.estimatedDelivery}
                            onChange={(e) => setTrackingForm(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {!selectedOrder.tracking && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => initializeTracking(selectedOrder._id)}
                    disabled={!trackingForm.carrier || !trackingForm.trackingNumber}
                  >
                    <i className="bi bi-check me-2"></i>Initialiser le suivi
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowTrackingModal(false);
                    setSelectedOrder(null);
                  }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour ajouter une étape */}
      {showAddStepModal && selectedOrder && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-plus-circle me-2"></i>
                  Ajouter une étape de suivi
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddStepModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Statut *</label>
                    <select
                      className="form-select"
                      value={stepForm.status}
                      onChange={(e) => setStepForm(prev => ({ ...prev, status: e.target.value }))}
                      required
                    >
                      <option value="">Sélectionner un statut</option>
                      <option value="Suivi initialisé">Suivi initialisé</option>
                      <option value="En transit">En transit</option>
                      <option value="En cours de livraison">En cours de livraison</option>
                      <option value="Livré">Livré</option>
                      <option value="Problème de livraison">Problème de livraison</option>
                      <option value="Retourné">Retourné</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={stepForm.description}
                      onChange={(e) => setStepForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez l'étape de suivi..."
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Localisation</label>
                    <select
                      className="form-select"
                      value={stepForm.location}
                      onChange={(e) => setStepForm(prev => ({ ...prev, location: e.target.value }))}
                    >
                      <option value="">Sélectionner une localisation</option>
                      
                      {/* Centres de tri et entrepôts */}
                      <optgroup label="🏢 Centres de Tri & Entrepôts">
                        <option value="Entrepôt">Entrepôt</option>
                        <option value="Hub DHL Conakry">Hub DHL Conakry</option>
                        <option value="Hub FedEx Dakar">Hub FedEx Dakar</option>
                        <option value="Hub UPS Abidjan">Hub UPS Abidjan</option>
                        <option value="Centre de tri Paris">Centre de tri Paris</option>
                        <option value="Centre de tri Marseille">Centre de tri Marseille</option>
                      </optgroup>

                      {/* Guinée */}
                      <optgroup label="🇬🇳 Guinée">
                        <option value="Conakry - Kaloum">Conakry - Kaloum</option>
                        <option value="Conakry - Dixinn">Conakry - Dixinn</option>
                        <option value="Conakry - Matam">Conakry - Matam</option>
                        <option value="Conakry - Ratoma">Conakry - Ratoma</option>
                        <option value="Conakry - Matoto">Conakry - Matoto</option>
                        <option value="Kankan - Centre">Kankan - Centre</option>
                        <option value="Kankan - Commune">Kankan - Commune</option>
                        <option value="Labé - Centre">Labé - Centre</option>
                        <option value="Labé - Commune">Labé - Commune</option>
                        <option value="Nzérékoré - Centre">Nzérékoré - Centre</option>
                        <option value="Nzérékoré - Commune">Nzérékoré - Commune</option>
                        <option value="Kindia - Centre">Kindia - Centre</option>
                        <option value="Mamou - Centre">Mamou - Centre</option>
                      </optgroup>

                      {/* Sénégal */}
                      <optgroup label="🇸🇳 Sénégal">
                        <option value="Dakar - Plateau">Dakar - Plateau</option>
                        <option value="Dakar - Médina">Dakar - Médina</option>
                        <option value="Dakar - Fann">Dakar - Fann</option>
                        <option value="Dakar - Ouakam">Dakar - Ouakam</option>
                        <option value="Dakar - Parcelles">Dakar - Parcelles</option>
                        <option value="Thiès - Centre">Thiès - Centre</option>
                        <option value="Saint-Louis - Centre">Saint-Louis - Centre</option>
                        <option value="Kaolack - Centre">Kaolack - Centre</option>
                        <option value="Ziguinchor - Centre">Ziguinchor - Centre</option>
                      </optgroup>

                      {/* Côte d'Ivoire */}
                      <optgroup label="🇨🇮 Côte d'Ivoire">
                        <option value="Abidjan - Plateau">Abidjan - Plateau</option>
                        <option value="Abidjan - Cocody">Abidjan - Cocody</option>
                        <option value="Abidjan - Yopougon">Abidjan - Yopougon</option>
                        <option value="Abidjan - Adjamé">Abidjan - Adjamé</option>
                        <option value="Abidjan - Marcory">Abidjan - Marcory</option>
                        <option value="Bouaké - Centre">Bouaké - Centre</option>
                        <option value="Yamoussoukro - Centre">Yamoussoukro - Centre</option>
                        <option value="San-Pédro - Centre">San-Pédro - Centre</option>
                        <option value="Korhogo - Centre">Korhogo - Centre</option>
                      </optgroup>

                      {/* Mali */}
                      <optgroup label="🇲🇱 Mali">
                        <option value="Bamako - Commune I">Bamako - Commune I</option>
                        <option value="Bamako - Commune II">Bamako - Commune II</option>
                        <option value="Bamako - Commune III">Bamako - Commune III</option>
                        <option value="Bamako - Commune IV">Bamako - Commune IV</option>
                        <option value="Bamako - Commune V">Bamako - Commune V</option>
                        <option value="Bamako - Commune VI">Bamako - Commune VI</option>
                        <option value="Sikasso - Centre">Sikasso - Centre</option>
                        <option value="Ségou - Centre">Ségou - Centre</option>
                        <option value="Mopti - Centre">Mopti - Centre</option>
                        <option value="Tombouctou - Centre">Tombouctou - Centre</option>
                      </optgroup>

                      {/* Burkina Faso */}
                      <optgroup label="🇧🇫 Burkina Faso">
                        <option value="Ouagadougou - Centre">Ouagadougou - Centre</option>
                        <option value="Ouagadougou - Commune">Ouagadougou - Commune</option>
                        <option value="Bobo-Dioulasso - Centre">Bobo-Dioulasso - Centre</option>
                        <option value="Bobo-Dioulasso - Commune">Bobo-Dioulasso - Commune</option>
                        <option value="Koudougou - Centre">Koudougou - Centre</option>
                        <option value="Ouahigouya - Centre">Ouahigouya - Centre</option>
                      </optgroup>

                      {/* Statuts génériques */}
                      <optgroup label="🚚 Statuts de Livraison">
                        <option value="En cours de livraison">En cours de livraison</option>
                        <option value="En transit international">En transit international</option>
                        <option value="En transit national">En transit national</option>
                        <option value="En attente de récupération">En attente de récupération</option>
                        <option value="Retourné à l'expéditeur">Retourné à l'expéditeur</option>
                      </optgroup>

                      {/* Autre */}
                      <optgroup label="📍 Autre">
                        <option value="Autre">Autre (préciser dans la description)</option>
                      </optgroup>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => addTrackingStep(selectedOrder._id)}
                  disabled={!stepForm.status || !stepForm.description}
                >
                  <i className="bi bi-check me-2"></i>Ajouter l'étape
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddStepModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;