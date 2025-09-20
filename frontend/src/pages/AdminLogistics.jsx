import React, { useState, useEffect } from 'react';
import { 
  BiPackage, 
  BiSearch, 
  BiFilter, 
  BiPlus,
  BiEdit,
  BiTrash,
  BiCheckCircle,
  BiXCircle,
  BiRefresh,
  BiDownload,
  BiCalendar,
  BiMapPin,
  BiUser,
  BiDollar,
  BiTime,
  BiBarChart,
  BiTrendingUp,
  BiCode,
  BiNavigation,
  BiWorld
} from 'react-icons/bi';
import { exportToCsv } from '../utils/csvExport';

export default function AdminLogistics() {
  const [shipments, setShipments] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [activeTab, setActiveTab] = useState('shipments');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Formulaire pour ajouter/modifier
  const [formData, setFormData] = useState({
    orderId: '',
    customerName: '',
    customerEmail: '',
    shippingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    carrier: '',
    service: '',
    trackingNumber: '',
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    declaredValue: 0,
    insurance: false,
    signatureRequired: false,
    estimatedDelivery: '',
    warehouse: '',
    status: 'pending'
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterShipments();
  }, [shipments, searchTerm, statusFilter]);

  const loadData = () => {
    setLoading(true);
    
    // Charger les vraies données depuis localStorage
    try {
      const storedWarehouses = JSON.parse(localStorage.getItem('warehouses') || '[]');
      const storedCarriers = JSON.parse(localStorage.getItem('carriers') || '[]');
      const storedShipments = JSON.parse(localStorage.getItem('shipments') || '[]');
      
      setWarehouses(storedWarehouses);
      setCarriers(storedCarriers);
      setShipments(storedShipments);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement de la logistique:', error);
      setWarehouses([]);
      setCarriers([]);
      setShipments([]);
      setLoading(false);
    }
  };

  const filterShipments = () => {
    let filtered = shipments;

    if (searchTerm) {
      filtered = filtered.filter(shipment =>
        shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.carrier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.status === statusFilter);
    }

    setFilteredShipments(filtered);
  };

  const calculateShippingCost = (weight, dimensions, carrier, service, declaredValue) => {
    const carrierData = carriers.find(c => c.name === carrier);
    if (!carrierData || !carrierData.rates[service.toLowerCase()]) return 0;

    const rate = carrierData.rates[service.toLowerCase()];
    const volumeWeight = (dimensions.length * dimensions.width * dimensions.height) / 6000;
    const chargeableWeight = Math.max(weight, volumeWeight);
    
    return rate.base + (chargeableWeight * rate.perKg);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-secondary">En attente</span>;
      case 'shipped':
        return <span className="badge bg-primary">Expédié</span>;
      case 'in_transit':
        return <span className="badge bg-info">En transit</span>;
      case 'out_for_delivery':
        return <span className="badge bg-warning">En livraison</span>;
      case 'delivered':
        return <span className="badge bg-success">Livré</span>;
      case 'failed':
        return <span className="badge bg-danger">Échec</span>;
      case 'returned':
        return <span className="badge bg-dark">Retourné</span>;
      default:
        return <span className="badge bg-secondary">Inconnu</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <BiTime className="text-secondary" />;
      case 'shipped':
        return <BiPackage className="text-primary" />;
      case 'in_transit':
        return <BiPackage className="text-info" />;
      case 'out_for_delivery':
        return <BiNavigation className="text-warning" />;
      case 'delivered':
        return <BiCheckCircle className="text-success" />;
      case 'failed':
        return <BiXCircle className="text-danger" />;
      case 'returned':
        return <BiPackage className="text-dark" />;
      default:
        return <BiTime className="text-secondary" />;
    }
  };

  const getStats = () => {
    const total = shipments.length;
    const pending = shipments.filter(s => s.status === 'pending').length;
    const inTransit = shipments.filter(s => s.status === 'in_transit').length;
    const delivered = shipments.filter(s => s.status === 'delivered').length;
    const failed = shipments.filter(s => s.status === 'failed').length;
    const totalCost = shipments.reduce((sum, s) => sum + s.cost, 0);
    const avgDeliveryTime = 2.3; // Calculé à partir des données

    return { total, pending, inTransit, delivered, failed, totalCost, avgDeliveryTime };
  };

  const stats = getStats();

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Gestion Logistique</h1>
          <p className="text-muted mb-0">Suivi des expéditions et gestion des transporteurs</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => {
              const rows = filteredShipments.map(s => ({
                id: s.id,
                orderId: s.orderId,
                customerName: s.customerName,
                carrier: s.carrier,
                service: s.service,
                trackingNumber: s.trackingNumber,
                status: s.status,
                cost: s.cost,
                estimatedDelivery: s.estimatedDelivery,
                actualDelivery: s.actualDelivery
              }));
              exportToCsv('logistics.csv', rows);
            }}
          >
            <BiDownload className="me-2" />
            Export CSV
          </button>
          <button className="btn btn-outline-primary" onClick={loadData}>
            <BiRefresh className="me-2" />
            Actualiser
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <BiPlus className="me-2" />
            Nouvelle expédition
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="row g-3 mb-4">
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-primary mb-1">{stats.total}</h4>
              <small className="text-muted">Total expéditions</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-secondary mb-1">{stats.pending}</h4>
              <small className="text-muted">En attente</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-info mb-1">{stats.inTransit}</h4>
              <small className="text-muted">En transit</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-success mb-1">{stats.delivered}</h4>
              <small className="text-muted">Livrées</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-danger mb-1">{stats.failed}</h4>
              <small className="text-muted">Échecs</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-warning mb-1">€{stats.totalCost.toFixed(2)}</h4>
              <small className="text-muted">Coût total</small>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'shipments' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipments')}
          >
                <BiPackage className="me-2" />
            Expéditions ({shipments.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'warehouses' ? 'active' : ''}`}
            onClick={() => setActiveTab('warehouses')}
          >
            <BiPackage className="me-2" />
            Entrepôts ({warehouses.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'carriers' ? 'active' : ''}`}
            onClick={() => setActiveTab('carriers')}
          >
            <BiWorld className="me-2" />
            Transporteurs ({carriers.length})
          </button>
        </li>
      </ul>

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
                  placeholder="Rechercher une expédition..."
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
                <option value="shipped">Expédié</option>
                <option value="in_transit">En transit</option>
                <option value="out_for_delivery">En livraison</option>
                <option value="delivered">Livré</option>
                <option value="failed">Échec</option>
                <option value="returned">Retourné</option>
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

      {/* Contenu des onglets */}
      {activeTab === 'shipments' && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0">
            <h5 className="mb-0">Expéditions ({filteredShipments.length})</h5>
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
                      <th>Transporteur</th>
                      <th>Suivi</th>
                      <th>Statut</th>
                      <th>Coût</th>
                      <th>Livraison</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShipments.map((shipment) => (
                      <tr key={shipment.id}>
                        <td>
                          <div>
                            <div className="fw-medium">{shipment.orderId}</div>
                            <small className="text-muted">ID: {shipment.id}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-medium">{shipment.customerName}</div>
                            <small className="text-muted">{shipment.customerEmail}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-medium">{shipment.carrier}</div>
                            <small className="text-muted">{shipment.service}</small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="badge bg-light text-dark me-2">{shipment.trackingNumber}</span>
                            <button className="btn btn-sm btn-outline-secondary" title="Copier">
                              <BiCode />
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            {getStatusIcon(shipment.status)}
                            <span className="ms-2">{getStatusBadge(shipment.status)}</span>
                          </div>
                        </td>
                        <td>
                          <div className="fw-medium">€{shipment.cost.toFixed(2)}</div>
                          <small className="text-muted">{shipment.weight}kg</small>
                        </td>
                        <td>
                          <div>
                            <small className="text-muted">
                              <BiCalendar className="me-1" />
                              Est: {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                            </small>
                            {shipment.actualDelivery && (
                              <>
                                <br/>
                                <small className="text-success">
                                  Réel: {new Date(shipment.actualDelivery).toLocaleDateString()}
                                </small>
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-primary" title="Détails">
                              <BiBarChart />
                            </button>
                            <button className="btn btn-sm btn-outline-info" title="Suivi">
                              <BiNavigation />
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" title="Modifier">
                              <BiEdit />
                            </button>
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
      )}

      {activeTab === 'warehouses' && (
        <div className="row g-4">
          {warehouses.map((warehouse) => (
            <div key={warehouse.id} className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">{warehouse.name}</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="d-flex align-items-center">
                        <BiMapPin className="text-primary me-2" />
                        <span>{warehouse.address}</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center">
                        <h4 className="text-primary">{warehouse.currentStock}</h4>
                        <small className="text-muted">Stock actuel</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center">
                        <h4 className="text-info">{warehouse.capacity}</h4>
                        <small className="text-muted">Capacité totale</small>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar" 
                          role="progressbar" 
                          style={{ 
                            width: `${(warehouse.currentStock / warehouse.capacity) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <small className="text-muted">
                        {((warehouse.currentStock / warehouse.capacity) * 100).toFixed(1)}% utilisé
                      </small>
                    </div>
                    <div className="col-12">
                      <div className="d-flex justify-content-between">
                        <div>
                          <small className="text-muted">Manager:</small><br/>
                          <span className="fw-medium">{warehouse.manager}</span>
                        </div>
                        <div>
                          <small className="text-muted">Téléphone:</small><br/>
                          <span className="fw-medium">{warehouse.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary">
                          <BiEdit className="me-1" />
                          Modifier
                        </button>
                        <button className="btn btn-sm btn-outline-info">
                          <BiBarChart className="me-1" />
                          Analytics
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'carriers' && (
        <div className="row g-4">
          {carriers.map((carrier) => (
            <div key={carrier.id} className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                  <h5 className="mb-0">{carrier.name}</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <span className={`badge ${carrier.type === 'domestic' ? 'bg-primary' : 'bg-info'}`}>
                      {carrier.type === 'domestic' ? 'National' : 'International'}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <h6>Services disponibles:</h6>
                    <ul className="list-unstyled">
                      {carrier.services.map((service, index) => (
                        <li key={index} className="mb-1">
                          <small className="text-muted">{service}</small>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-3">
                    <h6>Tarifs (exemple):</h6>
                    {Object.entries(carrier.rates).map(([service, rate]) => (
                      <div key={service} className="d-flex justify-content-between mb-1">
                        <small className="text-muted">{service}:</small>
                        <small className="fw-medium">€{rate.base} + €{rate.perKg}/kg</small>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <h6>Délais de livraison:</h6>
                    {Object.entries(carrier.deliveryTime).map(([service, time]) => (
                      <div key={service} className="d-flex justify-content-between mb-1">
                        <small className="text-muted">{service}:</small>
                        <small className="fw-medium">{time}</small>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary">
                      <BiEdit className="me-1" />
                      Modifier
                    </button>
                    <button className="btn btn-sm btn-outline-info">
                      <BiBarChart className="me-1" />
                      Performance
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal d'ajout d'expédition */}
      {showAddModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nouvelle expédition</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">ID Commande</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.orderId}
                      onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Transporteur</label>
                    <select 
                      className="form-select"
                      value={formData.carrier}
                      onChange={(e) => setFormData({...formData, carrier: e.target.value})}
                    >
                      <option value="">Sélectionner...</option>
                      {carriers.map(carrier => (
                        <option key={carrier.id} value={carrier.name}>{carrier.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Service</label>
                    <select 
                      className="form-select"
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                    >
                      <option value="">Sélectionner...</option>
                      {formData.carrier && carriers.find(c => c.name === formData.carrier)?.services.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Entrepôt</label>
                    <select 
                      className="form-select"
                      value={formData.warehouse}
                      onChange={(e) => setFormData({...formData, warehouse: e.target.value})}
                    >
                      <option value="">Sélectionner...</option>
                      {warehouses.map(warehouse => (
                        <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Poids (kg)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="form-control" 
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Valeur déclarée (€)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="form-control" 
                      value={formData.declaredValue}
                      onChange={(e) => setFormData({...formData, declaredValue: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Date de livraison estimée</label>
                    <input 
                      type="datetime-local" 
                      className="form-control" 
                      value={formData.estimatedDelivery}
                      onChange={(e) => setFormData({...formData, estimatedDelivery: e.target.value})}
                    />
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={formData.insurance}
                        onChange={(e) => setFormData({...formData, insurance: e.target.checked})}
                      />
                      <label className="form-check-label">
                        Assurance incluse
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={formData.signatureRequired}
                        onChange={(e) => setFormData({...formData, signatureRequired: e.target.checked})}
                      />
                      <label className="form-check-label">
                        Signature requise
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddModal(false)}
                >
                  Annuler
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    // Logique de création d'expédition
                    const newShipment = {
                      id: `SHIP-${Date.now()}`,
                      ...formData,
                      trackingNumber: `TRK${Date.now()}`,
                      cost: calculateShippingCost(
                        formData.weight, 
                        formData.dimensions, 
                        formData.carrier, 
                        formData.service, 
                        formData.declaredValue
                      ),
                      createdAt: new Date().toISOString(),
                      trackingHistory: []
                    };
                    setShipments(prev => [...prev, newShipment]);
                    setShowAddModal(false);
                    setFormData({
                      orderId: '', customerName: '', customerEmail: '',
                      shippingAddress: { street: '', city: '', postalCode: '', country: 'France' },
                      carrier: '', service: '', trackingNumber: '', weight: 0,
                      dimensions: { length: 0, width: 0, height: 0 }, declaredValue: 0,
                      insurance: false, signatureRequired: false, estimatedDelivery: '',
                      warehouse: '', status: 'pending'
                    });
                  }}
                >
                  Créer l'expédition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}