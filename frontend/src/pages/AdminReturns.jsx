import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../amazon-like.css';

const AdminReturns = () => {
  const navigate = useNavigate();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: '',
    notes: '',
    refundType: 'full',
    refundAmount: 0,
    adminNotes: '',
    productCondition: 'used'
  });
  const [shippingForm, setShippingForm] = useState({
    carrier: '',
    trackingNumber: '',
    trackingUrl: '',
    shippingCost: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
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
    totalReturns: 0,
    byStatus: {},
    byPriority: {},
    totalRefundAmount: 0,
    avgProcessingTime: 0
  });

  // Charger les retours
  const fetchReturns = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn('⚠️ Token d\'authentification manquant - redirection vers la connexion');
        navigate('/connexion');
        return;
      }

      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });

      const response = await fetch(`${baseUrl}/api/returns/admin/all?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setReturns(data.returns);
        setPagination(data.pagination);
      } else {
        console.error('Erreur récupération retours:', data.message);
      }
    } catch (error) {
      console.error('Erreur récupération retours:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les statistiques
  const fetchStats = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseUrl}/api/returns/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erreur récupération stats:', error);
    }
  };

  // Mettre à jour le statut d'un retour
  const updateReturnStatus = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseUrl}/api/returns/admin/${selectedReturn._id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(statusForm)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Statut mis à jour avec succès !');
        setShowStatusModal(false);
        fetchReturns();
        fetchStats();
      } else {
        alert(`Erreur: ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Mettre à jour les informations de suivi
  const updateReturnShipping = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseUrl}/api/returns/admin/${selectedReturn._id}/shipping`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shippingForm)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Informations de suivi mises à jour !');
        setShowShippingModal(false);
        fetchReturns();
      } else {
        alert(`Erreur: ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur mise à jour suivi:', error);
      alert('Erreur lors de la mise à jour du suivi');
    }
  };

  // Obtenir la couleur du badge selon le statut
  const getStatusBadgeColor = (status) => {
    const colors = {
      'requested': 'bg-warning',
      'approved': 'bg-info',
      'shipped': 'bg-primary',
      'received': 'bg-secondary',
      'inspected': 'bg-dark',
      'approved_refund': 'bg-success',
      'rejected': 'bg-danger',
      'refund_processed': 'bg-success',
      'refund_completed': 'bg-success',
      'cancelled': 'bg-secondary'
    };
    return colors[status] || 'bg-secondary';
  };

  // Obtenir la couleur du badge selon la priorité
  const getPriorityBadgeColor = (priority) => {
    const colors = {
      'low': 'bg-secondary',
      'normal': 'bg-primary',
      'high': 'bg-warning',
      'urgent': 'bg-danger'
    };
    return colors[priority] || 'bg-secondary';
  };

  // Obtenir le texte du statut
  const getStatusText = (status) => {
    const texts = {
      'requested': 'Demandé',
      'approved': 'Approuvé',
      'shipped': 'Expédié',
      'received': 'Reçu',
      'inspected': 'Inspecté',
      'approved_refund': 'Remboursement approuvé',
      'rejected': 'Refusé',
      'refund_processed': 'Remboursement traité',
      'refund_completed': 'Remboursement terminé',
      'cancelled': 'Annulé'
    };
    return texts[status] || status;
  };

  // Obtenir le texte de la priorité
  const getPriorityText = (priority) => {
    const texts = {
      'low': 'Faible',
      'normal': 'Normale',
      'high': 'Élevée',
      'urgent': 'Urgente'
    };
    return texts[priority] || priority;
  };

  // Obtenir le texte du motif de retour
  const getReasonText = (reason) => {
    const texts = {
      'defective': 'Produit défectueux',
      'wrong_item': 'Mauvais article',
      'not_as_described': 'Pas comme décrit',
      'damaged_shipping': 'Endommagé pendant l\'expédition',
      'size_issue': 'Problème de taille',
      'color_issue': 'Problème de couleur',
      'changed_mind': 'Changement d\'avis',
      'duplicate_order': 'Commande en double',
      'other': 'Autre'
    };
    return texts[reason] || reason;
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

  // Obtenir le texte de l'état du produit
  const getConditionText = (condition) => {
    const texts = {
      'new': 'Neuf',
      'used': 'Usagé',
      'damaged': 'Endommagé',
      'defective': 'Défectueux'
    };
    return texts[condition] || condition;
  };

  // Obtenir le texte du type de remboursement
  const getRefundTypeText = (type) => {
    const texts = {
      'full': 'Complet',
      'partial': 'Partiel',
      'exchange': 'Échange'
    };
    return texts[type] || type;
  };

  // Gérer les filtres
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    fetchReturns();
    fetchStats();
  }, [filters, pagination.page]);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="bi bi-arrow-return-left me-2"></i>
              Gestion des Retours et Remboursements
            </h2>
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate('/admin/dashboard')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Retour au tableau de bord
            </button>
          </div>

          {/* Statistiques */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.totalReturns}</h4>
                      <p className="mb-0">Total Retours</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-arrow-return-left display-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{formatPrice(stats.totalRefundAmount)}</h4>
                      <p className="mb-0">Total Remboursements</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-currency-exchange display-4"></i>
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
                      <h4>{stats.avgProcessingTime.toFixed(1)}</h4>
                      <p className="mb-0">Jours Moy. Traitement</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-clock display-4"></i>
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
                      <h4>{stats.byStatus.requested || 0}</h4>
                      <p className="mb-0">En Attente</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-hourglass-split display-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="row mb-4">
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="requested">Demandé</option>
                <option value="approved">Approuvé</option>
                <option value="shipped">Expédié</option>
                <option value="received">Reçu</option>
                <option value="inspected">Inspecté</option>
                <option value="approved_refund">Remboursement approuvé</option>
                <option value="rejected">Refusé</option>
                <option value="refund_completed">Remboursement terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="">Toutes les priorités</option>
                <option value="low">Faible</option>
                <option value="normal">Normale</option>
                <option value="high">Élevée</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher par numéro, commande, client..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
            <div className="col-md-1">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setFilters({
                    status: '',
                    priority: '',
                    search: '',
                    startDate: '',
                    endDate: ''
                  });
                }}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          </div>

          {/* Liste des retours */}
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Numéro</th>
                    <th>Commande</th>
                    <th>Client</th>
                    <th>Statut</th>
                    <th>Priorité</th>
                    <th>Montant</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {returns.map((returnItem) => (
                    <tr key={returnItem._id}>
                      <td>
                        <strong>{returnItem.returnNumber}</strong>
                      </td>
                      <td>{returnItem.orderNumber}</td>
                      <td>
                        <div>
                          <div>{returnItem.customer.firstName} {returnItem.customer.lastName}</div>
                          <small className="text-muted">{returnItem.customer.email}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeColor(returnItem.status)}`}>
                          {getStatusText(returnItem.status)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getPriorityBadgeColor(returnItem.priority)}`}>
                          {getPriorityText(returnItem.priority)}
                        </span>
                      </td>
                      <td>{formatPrice(returnItem.refund.amount)}</td>
                      <td>{formatDate(returnItem.requestedDate)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setSelectedReturn(returnItem);
                              setShowReturnModal(true);
                            }}
                            title="Voir les détails"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => {
                              setSelectedReturn(returnItem);
                              setStatusForm({
                                status: returnItem.status,
                                notes: '',
                                refundType: returnItem.refund.type,
                                refundAmount: returnItem.refund.amount,
                                adminNotes: returnItem.adminNotes || '',
                                productCondition: returnItem.items?.[0]?.condition || 'used'
                              });
                              setShowStatusModal(true);
                            }}
                            title="Modifier le statut"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          {['approved', 'shipped'].includes(returnItem.status) && (
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => {
                                setSelectedReturn(returnItem);
                                setShippingForm({
                                  carrier: returnItem.returnShipping?.carrier || '',
                                  trackingNumber: returnItem.returnShipping?.trackingNumber || '',
                                  trackingUrl: returnItem.returnShipping?.trackingUrl || '',
                                  shippingCost: returnItem.returnShipping?.shippingCost || 0
                                });
                                setShowShippingModal(true);
                              }}
                              title="Gérer le suivi"
                            >
                              <i className="bi bi-truck"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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
                {[...Array(pagination.pages)].map((_, index) => (
                  <li key={index} className={`page-item ${pagination.page === index + 1 ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPagination(prev => ({ ...prev, page: index + 1 }))}
                    >
                      {index + 1}
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
        </div>
      </div>

      {/* Modal de détails du retour */}
      {showReturnModal && selectedReturn && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-arrow-return-left me-2"></i>
                  Détails du retour - {selectedReturn.returnNumber}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowReturnModal(false);
                    setSelectedReturn(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Informations générales</h6>
                    <p><strong>Numéro de retour :</strong> {selectedReturn.returnNumber}</p>
                    <p><strong>Commande :</strong> {selectedReturn.orderNumber}</p>
                    <p><strong>Statut :</strong> 
                      <span className={`badge ${getStatusBadgeColor(selectedReturn.status)} ms-2`}>
                        {getStatusText(selectedReturn.status)}
                      </span>
                    </p>
                    <p><strong>Priorité :</strong> 
                      <span className={`badge ${getPriorityBadgeColor(selectedReturn.priority)} ms-2`}>
                        {getPriorityText(selectedReturn.priority)}
                      </span>
                    </p>
                    <p><strong>Date de demande :</strong> {formatDate(selectedReturn.requestedDate)}</p>
                    {selectedReturn.completedDate && (
                      <p><strong>Date de completion :</strong> {formatDate(selectedReturn.completedDate)}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h6>Informations client</h6>
                    <p><strong>Nom :</strong> {selectedReturn.customer.firstName} {selectedReturn.customer.lastName}</p>
                    <p><strong>Email :</strong> {selectedReturn.customer.email}</p>
                    <p><strong>Téléphone :</strong> {selectedReturn.customer.phone}</p>
                  </div>
                </div>

                <hr />

                <h6>Raison du retour</h6>
                <p className="text-muted">
                  <strong>Motif principal :</strong> {selectedReturn.returnReason || 'Non spécifié'}<br/>
                  <strong>Description :</strong> {selectedReturn.returnDetails || selectedReturn.items?.[0]?.description || 'Aucune description'}
                </p>

                <hr />

                <h6>Articles retournés</h6>
                {selectedReturn.items.map((item, index) => (
                  <div key={index} className="d-flex align-items-center mb-3 p-3 border rounded">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="me-3"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.productName}</h6>
                      <p className="mb-1 text-muted">
                        <strong>Motif :</strong> {getReasonText(item.reason)}
                      </p>
                      {item.description && (
                        <p className="mb-1 text-muted">
                          <strong>Description :</strong> {item.description}
                        </p>
                      )}
                      <p className="mb-0">
                        <strong>Prix :</strong> {formatPrice(item.total)}
                        {item.condition && (
                          <> • <strong>État :</strong> {getConditionText(item.condition)}</>
                        )}
                      </p>
                    </div>
                  </div>
                ))}

                {selectedReturn.customerNotes && (
                  <>
                    <hr />
                    <h6>Notes du client</h6>
                    <p className="text-muted">{selectedReturn.customerNotes}</p>
                  </>
                )}

                {selectedReturn.adminNotes && (
                  <>
                    <hr />
                    <h6>Notes admin</h6>
                    <p className="text-muted">{selectedReturn.adminNotes}</p>
                  </>
                )}


                <hr />

                <h6>Remboursement</h6>
                <div className="row">
                  <div className="col-md-6">
                    {selectedReturn.refund.type && (
                      <p><strong>Type de remboursement :</strong> {getRefundTypeText(selectedReturn.refund.type)}</p>
                    )}
                    <p><strong>Montant :</strong> {formatPrice(selectedReturn.refund.amount)}</p>
                    {selectedReturn.refund.method && (
                      <p><strong>Méthode :</strong> {selectedReturn.refund.method}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    {selectedReturn.refund.processedDate && (
                      <p><strong>Date de traitement :</strong> {formatDate(selectedReturn.refund.processedDate)}</p>
                    )}
                    {selectedReturn.refund.completedDate && (
                      <p><strong>Date de completion :</strong> {formatDate(selectedReturn.refund.completedDate)}</p>
                    )}
                    {selectedReturn.refund.transactionId && (
                      <p><strong>ID Transaction :</strong> {selectedReturn.refund.transactionId}</p>
                    )}
                  </div>
                </div>

                {selectedReturn.returnShipping?.trackingNumber && (
                  <>
                    <hr />
                    <h6>Suivi du retour</h6>
                    <p><strong>Transporteur :</strong> {selectedReturn.returnShipping?.carrier}</p>
                    <p><strong>Numéro de suivi :</strong> {selectedReturn.returnShipping?.trackingNumber}</p>
                    {selectedReturn.returnShipping?.trackingUrl && (
                      <a 
                        href={selectedReturn.returnShipping?.trackingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="bi bi-box-arrow-up-right me-1"></i>Suivre le retour
                      </a>
                    )}
                  </>
                )}

                {selectedReturn.history && selectedReturn.history.length > 0 && (
                  <>
                    <hr />
                    <h6>Historique</h6>
                    <div className="timeline">
                      {selectedReturn.history.map((entry, index) => (
                        <div key={index} className="timeline-item d-flex mb-3">
                          <div className="timeline-marker me-3">
                            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{width: '30px', height: '30px'}}>
                              <i className="bi bi-check text-white"></i>
                            </div>
                          </div>
                          <div className="timeline-content flex-grow-1">
                            <h6 className="fw-bold mb-1">{entry.action}</h6>
                            <p className="text-muted mb-1">{entry.description}</p>
                            <small className="text-muted">
                              {formatDate(entry.timestamp)} • {entry.performedBy}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowReturnModal(false);
                    setSelectedReturn(null);
                  }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification du statut */}
      {showStatusModal && selectedReturn && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-pencil me-2"></i>
                  Modifier le statut - {selectedReturn.returnNumber}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowStatusModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nouveau statut *</label>
                      <select
                        className="form-select"
                        value={statusForm.status}
                        onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                        required
                      >
                        <option value="requested">Demandé</option>
                        <option value="approved">Approuvé</option>
                        <option value="shipped">Expédié</option>
                        <option value="received">Reçu</option>
                        <option value="inspected">Inspecté</option>
                        <option value="approved_refund">Remboursement approuvé</option>
                        <option value="rejected">Refusé</option>
                        <option value="refund_processed">Remboursement traité</option>
                        <option value="refund_completed">Remboursement terminé</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Type de remboursement</label>
                      <select
                        className="form-select"
                        value={statusForm.refundType}
                        onChange={(e) => setStatusForm(prev => ({ ...prev, refundType: e.target.value }))}
                      >
                        <option value="full">Remboursement complet</option>
                        <option value="partial">Remboursement partiel</option>
                        <option value="credit">Crédit magasin</option>
                        <option value="exchange">Échange</option>
                        <option value="none">Aucun remboursement</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Montant du remboursement</label>
                      <input
                        type="number"
                        className="form-control"
                        value={statusForm.refundAmount}
                        onChange={(e) => setStatusForm(prev => ({ ...prev, refundAmount: parseFloat(e.target.value) || 0 }))}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">État du produit (après inspection)</label>
                      <select
                        className="form-select"
                        value={statusForm.productCondition || 'used'}
                        onChange={(e) => setStatusForm(prev => ({ ...prev, productCondition: e.target.value }))}
                      >
                        <option value="new">Neuf</option>
                        <option value="used">Usagé</option>
                        <option value="damaged">Endommagé</option>
                        <option value="defective">Défectueux</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notes admin</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={statusForm.adminNotes}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, adminNotes: e.target.value }))}
                      placeholder="Notes internes..."
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={updateReturnStatus}
                >
                  <i className="bi bi-check me-2"></i>Mettre à jour
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowStatusModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestion du suivi */}
      {showShippingModal && selectedReturn && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-truck me-2"></i>
                  Gérer le suivi - {selectedReturn.returnNumber}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowShippingModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Transporteur</label>
                    <select
                      className="form-select"
                      value={shippingForm.carrier}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, carrier: e.target.value }))}
                    >
                      <option value="">Sélectionner un transporteur</option>
                      <option value="DHL">DHL</option>
                      <option value="FedEx">FedEx</option>
                      <option value="UPS">UPS</option>
                      <option value="Colissimo">Colissimo</option>
                      <option value="Chronopost">Chronopost</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Numéro de suivi</label>
                    <input
                      type="text"
                      className="form-control"
                      value={shippingForm.trackingNumber}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                      placeholder="Ex: 123456789"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">URL de suivi</label>
                    <input
                      type="url"
                      className="form-control"
                      value={shippingForm.trackingUrl}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, trackingUrl: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Coût d'expédition</label>
                    <input
                      type="number"
                      className="form-control"
                      value={shippingForm.shippingCost}
                      onChange={(e) => setShippingForm(prev => ({ ...prev, shippingCost: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={updateReturnShipping}
                >
                  <i className="bi bi-check me-2"></i>Mettre à jour
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowShippingModal(false)}
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

export default AdminReturns;
