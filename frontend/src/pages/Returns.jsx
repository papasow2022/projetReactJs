import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../amazon-like.css';

const Returns = () => {
  const navigate = useNavigate();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnForm, setReturnForm] = useState({
    items: [],
    customerNotes: '',
    contactInfo: {
      preferredContact: 'email',
      timezone: 'Africa/Conakry'
    }
  });
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

  // Charger les retours de l'utilisateur
  const fetchReturns = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`${baseUrl}/api/returns/user?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setReturns(data.returns);
      } else {
        console.error('Erreur récupération retours:', data.message);
      }
    } catch (error) {
      console.error('Erreur récupération retours:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les commandes éligibles pour retour
  const fetchEligibleOrders = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseUrl}/api/orders/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Filtrer les commandes éligibles (livrées, pas de retour existant)
        const eligibleOrders = data.orders.filter(order => 
          order.status === 'delivered' && 
          !returns.some(ret => ret.orderNumber === order.orderNumber)
        );
        return eligibleOrders;
      }
      return [];
    } catch (error) {
      console.error('Erreur récupération commandes:', error);
      return [];
    }
  };

  // Créer une demande de retour
  const createReturnRequest = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseUrl}/api/returns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: selectedOrder._id,
          items: returnForm.items,
          customerNotes: returnForm.customerNotes,
          contactInfo: returnForm.contactInfo
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Demande de retour créée avec succès !');
        setShowRequestModal(false);
        setReturnForm({
          items: [],
          customerNotes: '',
          contactInfo: {
            preferredContact: 'email',
            timezone: 'Africa/Conakry'
          }
        });
        fetchReturns();
      } else {
        alert(`Erreur: ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur création retour:', error);
      alert('Erreur lors de la création de la demande de retour');
    }
  };

  // Annuler un retour
  const cancelReturn = async (returnId) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler ce retour ?')) return;
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseUrl}/api/returns/${returnId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Annulé par le client'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Retour annulé avec succès !');
        fetchReturns();
      } else {
        alert(`Erreur: ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur annulation retour:', error);
      alert('Erreur lors de l\'annulation du retour');
    }
  };

  // Ouvrir le modal de demande de retour
  const openRequestModal = async (order) => {
    setSelectedOrder(order);
    setReturnForm({
      items: order.items.map(item => ({
        ...item,
        reason: '',
        description: '',
        condition: 'new'
      })),
      customerNotes: '',
      contactInfo: {
        preferredContact: 'email',
        timezone: 'Africa/Conakry'
      }
    });
    setShowRequestModal(true);
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

  useEffect(() => {
    fetchReturns();
  }, [filters]);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="bi bi-arrow-return-left me-2"></i>
              Retours et Remboursements
            </h2>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/orders')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Retour aux commandes
            </button>
          </div>

          {/* Filtres */}
          <div className="row mb-4">
            <div className="col-md-6">
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
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
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher par numéro de retour ou commande..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>

          {/* Liste des retours */}
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : returns.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-arrow-return-left display-1 text-muted"></i>
              <h4 className="mt-3">Aucun retour trouvé</h4>
              <p className="text-muted">Vous n'avez pas encore de demandes de retour.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/orders')}
              >
                Voir mes commandes
              </button>
            </div>
          ) : (
            <div className="row">
              {returns.map((returnItem) => (
                <div key={returnItem._id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">
                        <i className="bi bi-arrow-return-left me-2"></i>
                        {returnItem.returnNumber}
                      </h6>
                      <span className={`badge ${getStatusBadgeColor(returnItem.status)}`}>
                        {getStatusText(returnItem.status)}
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <strong>Commande :</strong> {returnItem.orderNumber}
                      </div>
                      <div className="mb-2">
                        <strong>Articles :</strong> {returnItem.items.length}
                      </div>
                      <div className="mb-2">
                        <strong>Montant :</strong> {formatPrice(returnItem.refund.amount)}
                      </div>
                      <div className="mb-3">
                        <strong>Date :</strong> {formatDate(returnItem.requestedDate)}
                      </div>
                      
                      {/* Articles retournés */}
                      <div className="mb-3">
                        <h6>Articles :</h6>
                        {returnItem.items.map((item, index) => (
                          <div key={index} className="d-flex align-items-center mb-2">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="me-2"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow-1">
                              <div className="fw-bold">{item.productName}</div>
                              <small className="text-muted">
                                {getReasonText(item.reason)} • {formatPrice(item.total)}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setSelectedReturn(returnItem);
                            setShowReturnModal(true);
                          }}
                        >
                          <i className="bi bi-eye"></i> Détails
                        </button>
                        {['requested', 'approved'].includes(returnItem.status) && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => cancelReturn(returnItem._id)}
                          >
                            <i className="bi bi-x-circle"></i> Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails du retour */}
      {showReturnModal && selectedReturn && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
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
                    <p><strong>Date de demande :</strong> {formatDate(selectedReturn.requestedDate)}</p>
                    {selectedReturn.completedDate && (
                      <p><strong>Date de completion :</strong> {formatDate(selectedReturn.completedDate)}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h6>Remboursement</h6>
                    <p><strong>Type :</strong> {selectedReturn.refund.type}</p>
                    <p><strong>Montant :</strong> {formatPrice(selectedReturn.refund.amount)}</p>
                    <p><strong>Méthode :</strong> {selectedReturn.refund.method}</p>
                    {selectedReturn.refund.processedDate && (
                      <p><strong>Date de traitement :</strong> {formatDate(selectedReturn.refund.processedDate)}</p>
                    )}
                  </div>
                </div>

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

                {selectedReturn.returnShipping.trackingNumber && (
                  <>
                    <hr />
                    <h6>Suivi du retour</h6>
                    <p><strong>Transporteur :</strong> {selectedReturn.returnShipping.carrier}</p>
                    <p><strong>Numéro de suivi :</strong> {selectedReturn.returnShipping.trackingNumber}</p>
                    {selectedReturn.returnShipping.trackingUrl && (
                      <a 
                        href={selectedReturn.returnShipping.trackingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="bi bi-box-arrow-up-right me-1"></i>Suivre le retour
                      </a>
                    )}
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

      {/* Modal de demande de retour */}
      {showRequestModal && selectedOrder && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-plus-circle me-2"></i>
                  Demander un retour - {selectedOrder.orderNumber}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRequestModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <h6>Articles à retourner</h6>
                  {returnForm.items.map((item, index) => (
                    <div key={index} className="border rounded p-3 mb-3">
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="me-3"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{item.productName}</h6>
                          <p className="mb-0 text-muted">{formatPrice(item.total)}</p>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={item.selected || false}
                            onChange={(e) => {
                              const newItems = [...returnForm.items];
                              newItems[index].selected = e.target.checked;
                              setReturnForm(prev => ({ ...prev, items: newItems }));
                            }}
                          />
                          <label className="form-check-label">Retourner</label>
                        </div>
                      </div>
                      
                      {item.selected && (
                        <>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Motif du retour *</label>
                              <select
                                className="form-select"
                                value={item.reason}
                                onChange={(e) => {
                                  const newItems = [...returnForm.items];
                                  newItems[index].reason = e.target.value;
                                  setReturnForm(prev => ({ ...prev, items: newItems }));
                                }}
                                required
                              >
                                <option value="">Sélectionner un motif</option>
                                <option value="defective">Produit défectueux</option>
                                <option value="wrong_item">Mauvais article</option>
                                <option value="not_as_described">Pas comme décrit</option>
                                <option value="damaged_shipping">Endommagé pendant l'expédition</option>
                                <option value="size_issue">Problème de taille</option>
                                <option value="color_issue">Problème de couleur</option>
                                <option value="changed_mind">Changement d'avis</option>
                                <option value="duplicate_order">Commande en double</option>
                                <option value="other">Autre</option>
                              </select>
                            </div>
                            <div className="col-md-6 mb-3">
                              <label className="form-label">État du produit</label>
                              <select
                                className="form-select"
                                value={item.condition}
                                onChange={(e) => {
                                  const newItems = [...returnForm.items];
                                  newItems[index].condition = e.target.value;
                                  setReturnForm(prev => ({ ...prev, items: newItems }));
                                }}
                              >
                                <option value="new">Neuf</option>
                                <option value="used">Utilisé</option>
                                <option value="damaged">Endommagé</option>
                              </select>
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Description détaillée</label>
                            <textarea
                              className="form-control"
                              rows="2"
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...returnForm.items];
                                newItems[index].description = e.target.value;
                                setReturnForm(prev => ({ ...prev, items: newItems }));
                              }}
                              placeholder="Décrivez le problème en détail..."
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  <hr />

                  <div className="mb-3">
                    <label className="form-label">Notes supplémentaires</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={returnForm.customerNotes}
                      onChange={(e) => setReturnForm(prev => ({ ...prev, customerNotes: e.target.value }))}
                      placeholder="Ajoutez des informations supplémentaires..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Préférence de contact</label>
                    <select
                      className="form-select"
                      value={returnForm.contactInfo.preferredContact}
                      onChange={(e) => setReturnForm(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, preferredContact: e.target.value }
                      }))}
                    >
                      <option value="email">Email</option>
                      <option value="phone">Téléphone</option>
                      <option value="sms">SMS</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={createReturnRequest}
                  disabled={!returnForm.items.some(item => item.selected && item.reason)}
                >
                  <i className="bi bi-check me-2"></i>Créer la demande
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRequestModal(false)}
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

export default Returns;
