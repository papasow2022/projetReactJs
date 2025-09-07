import React, { useState, useEffect } from 'react';
import { useAudit } from '../contexts/AuditContext';
import { 
  BiShoppingBag, 
  BiSearch, 
  BiFilter, 
  BiInfoCircle, 
  BiCheckCircle, 
  BiXCircle, 
  BiUser,
  BiCalendar,
  BiDollar,
  BiPackage,
  BiRefresh
} from 'react-icons/bi';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const { addAuditEntry } = useAudit();

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = () => {
    setLoading(true);
    // Simuler des données de test
    const mockOrders = [
      {
        id: 'ORD-2024-001',
        customer: 'Marie Dupont',
        customerEmail: 'marie.dupont@email.com',
        vendor: 'Boutique Sport',
        vendorId: 'VD-001',
        total: 89.99,
        status: 'pending',
        paymentStatus: 'paid',
        shippingStatus: 'not_shipped',
        createdAt: '2024-01-15T10:30:00Z',
        items: [
          { name: 'Chaussures Nike Air Max', quantity: 1, price: 89.99 }
        ],
        shippingAddress: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        }
      },
      {
        id: 'ORD-2024-002',
        customer: 'Jean Martin',
        customerEmail: 'jean.martin@email.com',
        vendor: 'Mode & Style',
        vendorId: 'VD-002',
        total: 124.50,
        status: 'processing',
        paymentStatus: 'paid',
        shippingStatus: 'shipped',
        createdAt: '2024-01-14T15:20:00Z',
        items: [
          { name: 'Sac à dos Adidas', quantity: 1, price: 45.50 },
          { name: 'T-shirt Nike', quantity: 2, price: 39.50 }
        ],
        shippingAddress: {
          street: '456 Avenue des Champs',
          city: 'Lyon',
          postalCode: '69001',
          country: 'France'
        }
      },
      {
        id: 'ORD-2024-003',
        customer: 'Sophie Bernard',
        customerEmail: 'sophie.bernard@email.com',
        vendor: 'Tech Store',
        vendorId: 'VD-003',
        total: 299.99,
        status: 'shipped',
        paymentStatus: 'paid',
        shippingStatus: 'delivered',
        createdAt: '2024-01-13T09:15:00Z',
        items: [
          { name: 'Apple Watch Series 7', quantity: 1, price: 299.99 }
        ],
        shippingAddress: {
          street: '789 Boulevard Saint-Germain',
          city: 'Marseille',
          postalCode: '13001',
          country: 'France'
        }
      },
      {
        id: 'ORD-2024-004',
        customer: 'Pierre Durand',
        customerEmail: 'pierre.durand@email.com',
        vendor: 'Sport Plus',
        vendorId: 'VD-004',
        total: 75.00,
        status: 'cancelled',
        paymentStatus: 'refunded',
        shippingStatus: 'cancelled',
        createdAt: '2024-01-12T14:45:00Z',
        items: [
          { name: 'Veste Nike', quantity: 1, price: 75.00 }
        ],
        shippingAddress: {
          street: '321 Rue de Rivoli',
          city: 'Toulouse',
          postalCode: '31000',
          country: 'France'
        }
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.vendor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    // Enregistrer dans l'audit
    addAuditEntry('order_status_updated', { type: 'order', id: orderId }, { 
      orderId: orderId,
      oldStatus: order?.status || 'inconnu',
      newStatus: newStatus,
      customer: order?.customer || 'Client inconnu'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-warning">En attente</span>;
      case 'processing':
        return <span className="badge bg-info">En cours</span>;
      case 'shipped':
        return <span className="badge bg-primary">Expédié</span>;
      case 'delivered':
        return <span className="badge bg-success">Livré</span>;
      case 'cancelled':
        return <span className="badge bg-danger">Annulé</span>;
      default:
        return <span className="badge bg-secondary">Inconnu</span>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="badge bg-success">Payé</span>;
      case 'pending':
        return <span className="badge bg-warning">En attente</span>;
      case 'refunded':
        return <span className="badge bg-info">Remboursé</span>;
      case 'failed':
        return <span className="badge bg-danger">Échoué</span>;
      default:
        return <span className="badge bg-secondary">Inconnu</span>;
    }
  };

  const getShippingStatusBadge = (status) => {
    switch (status) {
      case 'not_shipped':
        return <span className="badge bg-secondary">Non expédié</span>;
      case 'shipped':
        return <span className="badge bg-primary">Expédié</span>;
      case 'delivered':
        return <span className="badge bg-success">Livré</span>;
      case 'cancelled':
        return <span className="badge bg-danger">Annulé</span>;
      default:
        return <span className="badge bg-secondary">Inconnu</span>;
    }
  };

  const getStatusCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };
  };

  const counts = getStatusCounts();
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Gestion des commandes</h1>
          <p className="text-muted mb-0">Suivi et gestion de toutes les commandes</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={loadOrders}>
            <BiRefresh className="me-2" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="row g-3 mb-4">
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-primary mb-1">{counts.all}</h4>
              <small className="text-muted">Total</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-warning mb-1">{counts.pending}</h4>
              <small className="text-muted">En attente</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-info mb-1">{counts.processing}</h4>
              <small className="text-muted">En cours</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-primary mb-1">{counts.shipped}</h4>
              <small className="text-muted">Expédiés</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-success mb-1">{counts.delivered}</h4>
              <small className="text-muted">Livrés</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-danger mb-1">{counts.cancelled}</h4>
              <small className="text-muted">Annulés</small>
            </div>
          </div>
        </div>
      </div>

      {/* Revenus */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <BiDollar className="text-success" style={{ fontSize: '2rem' }} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="card-title text-muted mb-1">Revenus totaux</h6>
                  <h4 className="mb-0">€{totalRevenue.toLocaleString()}</h4>
                  <small className="text-success">
                    <BiCheckCircle className="me-1" />
                    Commandes validées
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <BiShoppingBag className="text-primary" style={{ fontSize: '2rem' }} />
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="card-title text-muted mb-1">Panier moyen</h6>
                  <h4 className="mb-0">€{(totalRevenue / Math.max(counts.all - counts.cancelled, 1)).toFixed(2)}</h4>
                  <small className="text-primary">
                    <BiPackage className="me-1" />
                    Par commande
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <BiSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher une commande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="processing">En cours</option>
                <option value="shipped">Expédié</option>
                <option value="delivered">Livré</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-secondary w-100">
                <BiFilter className="me-2" />
                Plus de filtres
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0">Commandes ({filteredOrders.length})</h5>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Commande</th>
                    <th>Client</th>
                    <th>Vendeur</th>
                    <th>Total</th>
                    <th>Statut</th>
                    <th>Paiement</th>
                    <th>Livraison</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <div>
                          <div className="fw-medium">{order.id}</div>
                          <small className="text-muted">{order.items.length} article(s)</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">{order.customer}</div>
                          <small className="text-muted">{order.customerEmail}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">{order.vendor}</div>
                          <small className="text-muted">{order.vendorId}</small>
                        </div>
                      </td>
                      <td>
                        <span className="fw-medium">€{order.total}</span>
                      </td>
                      <td>
                        {getStatusBadge(order.status)}
                      </td>
                      <td>
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </td>
                      <td>
                        {getShippingStatusBadge(order.shippingStatus)}
                      </td>
                      <td>
                        <small className="text-muted">
                          <BiCalendar className="me-1" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-primary" title="Voir détails">
                            <BiInfoCircle />
                          </button>
                          {order.status === 'pending' && (
                            <>
                              <button 
                                className="btn btn-sm btn-success" 
                                title="Confirmer"
                                onClick={() => updateOrderStatus(order.id, 'processing')}
                              >
                                <BiCheckCircle />
                              </button>
                              <button 
                                className="btn btn-sm btn-danger" 
                                title="Annuler"
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              >
                                <BiXCircle />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}