import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useVendor } from '../contexts/VendorContext';
import { useProducts } from '../contexts/ProductsContext';
import { 
  BiArrowBack, 
  BiSearch, 
  BiFilter,
  BiPackage,
  BiCar,
  BiCheckCircle,
  BiXCircle,
  BiTime,
  BiDollar,
  BiUser,
  BiCalendar,
  BiPrinter,
  BiDownload,
  BiRefresh
} from 'react-icons/bi';

const GestionCommandesVendeur = () => {
  const { user } = useAuth();
  const { 
    getVendorOrders, 
    updateVendorOrder, 
    getVendorStats,
    calculateVendorRevenue 
  } = useVendor();
  const { getVendorProducts } = useProducts();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [stats, setStats] = useState({});

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [dateFilter, setDateFilter] = useState('tous');
  const [sortBy, setSortBy] = useState('date');

  const statusOptions = [
    { value: 'tous', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente', color: 'warning' },
    { value: 'confirmed', label: 'Confirmée', color: 'info' },
    { value: 'preparing', label: 'En préparation', color: 'primary' },
    { value: 'shipped', label: 'Expédiée', color: 'success' },
    { value: 'delivered', label: 'Livrée', color: 'success' },
    { value: 'cancelled', label: 'Annulée', color: 'danger' },
    { value: 'returned', label: 'Retournée', color: 'secondary' }
  ];

  const dateOptions = [
    { value: 'tous', label: 'Toutes les dates' },
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'quarter', label: 'Ce trimestre' }
  ];

  // Charger les commandes
  useEffect(() => {
    if (user?.vendorId) {
      loadOrders();
      loadStats();
    }
  }, [user]);

  const loadOrders = () => {
    setLoading(true);
    const vendorOrders = getVendorOrders(user.vendorId);
    setOrders(vendorOrders);
    setFilteredOrders(vendorOrders);
    setLoading(false);
  };

  const loadStats = () => {
    const vendorStats = getVendorStats(user.vendorId);
    setStats(vendorStats);
  };

  // Filtrer et trier les commandes
  useEffect(() => {
    let filtered = [...orders];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'tous') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filtre par date
    if (dateFilter !== 'tous') {
      const now = new Date();
      const orderDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(order => 
            new Date(order.createdAt).toDateString() === now.toDateString()
          );
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(order => 
            new Date(order.createdAt) >= weekAgo
          );
          break;
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
          filtered = filtered.filter(order => 
            new Date(order.createdAt) >= monthAgo
          );
          break;
        case 'quarter':
          const quarterAgo = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          filtered = filtered.filter(order => 
            new Date(order.createdAt) >= quarterAgo
          );
          break;
      }
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'amount':
          return b.total - a.total;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter, sortBy]);

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const result = await updateVendorOrder(user.vendorId, orderId, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      if (result.success) {
        loadOrders();
        // Mettre à jour la commande sélectionnée si elle est ouverte
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  // Obtenir la couleur du statut
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'secondary';
  };

  // Obtenir le label du statut
  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.label : status;
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

  // Formater le montant
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Calculer les statistiques
  const calculateStats = () => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length;
    const completedOrders = filteredOrders.filter(order => 
      ['delivered', 'shipped'].includes(order.status)
    ).length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    };
  };

  const currentStats = calculateStats();

  // Exporter les commandes
  const exportOrders = () => {
    const csvContent = [
      ['ID Commande', 'Client', 'Email', 'Montant', 'Statut', 'Date'],
      ...filteredOrders.map(order => [
        order.id,
        order.customerName || 'N/A',
        order.customerEmail || 'N/A',
        order.total || 0,
        getStatusLabel(order.status),
        formatDate(order.createdAt)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commandes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to="/dashboard-vendeur" className="btn btn-outline-secondary me-3">
            <BiArrowBack /> Retour au dashboard
          </Link>
          <h2 className="mb-0">Gestion des Commandes</h2>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={loadOrders}>
            <BiRefresh /> Actualiser
          </button>
          <button className="btn btn-success" onClick={exportOrders}>
            <BiDownload /> Exporter
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
                  <h6 className="card-title">Total Commandes</h6>
                  <h3 className="mb-0">{currentStats.totalOrders}</h3>
                </div>
                <div className="align-self-center">
                  <BiPackage size={30} />
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
                  <h6 className="card-title">Chiffre d'Affaires</h6>
                  <h3 className="mb-0">{formatAmount(currentStats.totalRevenue)}</h3>
                </div>
                <div className="align-self-center">
                  <BiDollar size={30} />
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
                  <h6 className="card-title">En Attente</h6>
                  <h3 className="mb-0">{currentStats.pendingOrders}</h3>
                </div>
                <div className="align-self-center">
                  <BiTime size={30} />
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
                  <h6 className="card-title">Panier Moyen</h6>
                  <h3 className="mb-0">{formatAmount(currentStats.averageOrderValue)}</h3>
                </div>
                <div className="align-self-center">
                  <BiUser size={30} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
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
            <div className="col-md-2">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                {dateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Trier par date</option>
                <option value="amount">Trier par montant</option>
                <option value="status">Trier par statut</option>
              </select>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('tous');
                  setDateFilter('tous');
                  setSortBy('date');
                }}
              >
                <BiFilter /> Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Commandes ({filteredOrders.length})</h5>
        </div>
        <div className="card-body p-0">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-5">
              <BiPackage size={50} className="text-muted mb-3" />
              <h5 className="text-muted">Aucune commande trouvée</h5>
              <p className="text-muted">Aucune commande ne correspond à vos critères de recherche.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID Commande</th>
                    <th>Client</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.id}</strong>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">{order.customerName || 'N/A'}</div>
                          <small className="text-muted">{order.customerEmail || 'N/A'}</small>
                        </div>
                      </td>
                      <td>
                        <strong className="text-success">{formatAmount(order.total || 0)}</strong>
                      </td>
                      <td>
                        <span className={`badge bg-${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div>{formatDate(order.createdAt)}</div>
                          <small className="text-muted">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                          >
                            Voir détails
                          </button>
                          {order.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              >
                                Confirmer
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              >
                                Annuler
                              </button>
                            </>
                          )}
                          {order.status === 'confirmed' && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                            >
                              Préparer
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button
                              className="btn btn-sm btn-info"
                              onClick={() => updateOrderStatus(order.id, 'shipped')}
                            >
                              Expédier
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
        </div>
      </div>

      {/* Modal de détails de commande */}
      {showOrderModal && selectedOrder && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Détails de la commande {selectedOrder.id}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowOrderModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Informations client</h6>
                    <p><strong>Nom:</strong> {selectedOrder.customerName || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedOrder.customerEmail || 'N/A'}</p>
                    <p><strong>Téléphone:</strong> {selectedOrder.customerPhone || 'N/A'}</p>
                    <p><strong>Adresse:</strong> {selectedOrder.shippingAddress || 'N/A'}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Informations commande</h6>
                    <p><strong>Statut:</strong> 
                      <span className={`badge bg-${getStatusColor(selectedOrder.status)} ms-2`}>
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                    </p>
                    <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    <p><strong>Montant:</strong> {formatAmount(selectedOrder.total || 0)}</p>
                    <p><strong>Méthode de paiement:</strong> {selectedOrder.paymentMethod || 'N/A'}</p>
                  </div>
                </div>
                
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div className="mt-4">
                    <h6>Produits commandés</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Produit</th>
                            <th>Prix</th>
                            <th>Quantité</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.name}</td>
                              <td>{formatAmount(item.price)}</td>
                              <td>{item.quantity}</td>
                              <td>{formatAmount(item.price * item.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowOrderModal(false)}
                >
                  Fermer
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    // Imprimer la commande
                    window.print();
                  }}
                >
                  <BiPrinter /> Imprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay pour le modal */}
      {showOrderModal && (
        <div 
          className="modal-backdrop fade show"
          onClick={() => setShowOrderModal(false)}
        ></div>
      )}
    </div>
  );
};

export default GestionCommandesVendeur; 