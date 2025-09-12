import React, { useState, useEffect } from 'react';
import { 
  BiPackage, 
  BiSearch, 
  BiFilter, 
  BiPlus,
  BiEdit,
  BiTrash,
  BiError,
  BiCheckCircle,
  BiXCircle,
  BiRefresh,
  BiDownload,
  BiTrendingUp,
  BiTrendingDown,
  BiCalendar,
  BiBarChart,
  BiBell
} from 'react-icons/bi';
import { exportToCsv } from '../utils/csvExport';

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Formulaire pour ajouter/modifier un produit
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    vendor: '',
    currentStock: 0,
    minStock: 5,
    maxStock: 100,
    cost: 0,
    price: 0,
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    location: '',
    status: 'active'
  });

  useEffect(() => {
    loadInventory();
    loadAlerts();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, statusFilter, categoryFilter, vendorFilter]);

  const loadInventory = () => {
    setLoading(true);
    // Charger les vraies données depuis localStorage
    try {
      const storedInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
      const storedAlerts = JSON.parse(localStorage.getItem('inventoryAlerts') || '[]');
      
      setInventory(storedInventory);
      setAlerts(storedAlerts);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'inventaire:', error);
      setInventory([]);
      setAlerts([]);
      setLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = inventory;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vendor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (vendorFilter) {
      filtered = filtered.filter(item => item.vendor.toLowerCase().includes(vendorFilter.toLowerCase()));
    }

    setFilteredInventory(filtered);
  };

  const updateStock = (productId, newStock) => {
    setInventory(prev => prev.map(item => 
      item.id === productId 
        ? { 
            ...item, 
            currentStock: newStock,
            availableStock: newStock - item.reservedStock,
            lastUpdated: new Date().toISOString(),
            status: getStockStatus(newStock, item.minStock)
          } 
        : item
    ));
  };

  const getStockStatus = (current, minimum) => {
    if (current === 0) return 'out_of_stock';
    if (current <= minimum) return 'low_stock';
    return 'active';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge bg-success">En stock</span>;
      case 'low_stock':
        return <span className="badge bg-warning">Stock faible</span>;
      case 'out_of_stock':
        return <span className="badge bg-danger">Rupture</span>;
      case 'inactive':
        return <span className="badge bg-secondary">Inactif</span>;
      default:
        return <span className="badge bg-secondary">Inconnu</span>;
    }
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <BiXCircle className="text-danger" />;
      case 'warning':
        return <BiError className="text-warning" />;
      case 'info':
        return <BiCheckCircle className="text-info" />;
      default:
        return <BiBell className="text-muted" />;
    }
  };

  const getStockStats = () => {
    const total = inventory.length;
    const active = inventory.filter(i => i.status === 'active').length;
    const lowStock = inventory.filter(i => i.status === 'low_stock').length;
    const outOfStock = inventory.filter(i => i.status === 'out_of_stock').length;
    const totalValue = inventory.reduce((sum, item) => sum + item.stockValue, 0);
    const totalUnits = inventory.reduce((sum, item) => sum + item.currentStock, 0);

    return { total, active, lowStock, outOfStock, totalValue, totalUnits };
  };

  const stats = getStockStats();

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Gestion de l'inventaire</h1>
          <p className="text-muted mb-0">Suivi des stocks en temps réel et alertes automatiques</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => {
              const rows = filteredInventory.map(item => ({
                id: item.id,
                name: item.name,
                sku: item.sku,
                category: item.category,
                vendor: item.vendor,
                currentStock: item.currentStock,
                minStock: item.minStock,
                maxStock: item.maxStock,
                cost: item.cost,
                price: item.price,
                status: item.status,
                stockValue: item.stockValue
              }));
              exportToCsv('inventory.csv', rows);
            }}
          >
            <BiDownload className="me-2" />
            Export CSV
          </button>
          <button className="btn btn-outline-primary" onClick={loadInventory}>
            <BiRefresh className="me-2" />
            Actualiser
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <BiPlus className="me-2" />
            Ajouter produit
          </button>
        </div>
      </div>

      {/* Alertes en temps réel */}
      {alerts.length > 0 && (
        <div className="row g-3 mb-4">
          {alerts.map(alert => (
            <div key={alert.id} className="col-md-4">
              <div className={`card border-0 shadow-sm border-start border-${alert.severity === 'critical' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'info'} border-4`}>
                <div className="card-body">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      {getAlertIcon(alert.severity)}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="card-title mb-1">{alert.productName}</h6>
                      <p className="card-text small mb-1">{alert.message}</p>
                      <small className="text-muted">
                        <BiCalendar className="me-1" />
                        {new Date(alert.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistiques */}
      <div className="row g-3 mb-4">
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-primary mb-1">{stats.total}</h4>
              <small className="text-muted">Total produits</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-success mb-1">{stats.active}</h4>
              <small className="text-muted">En stock</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-warning mb-1">{stats.lowStock}</h4>
              <small className="text-muted">Stock faible</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-danger mb-1">{stats.outOfStock}</h4>
              <small className="text-muted">Rupture</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-info mb-1">{stats.totalUnits}</h4>
              <small className="text-muted">Unités totales</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-primary mb-1">€{stats.totalValue.toLocaleString()}</h4>
              <small className="text-muted">Valeur stock</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card border-0 shadow-sm mb-4">
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
                  placeholder="Rechercher un produit..."
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
                <option value="all">Tous les statuts</option>
                <option value="active">En stock</option>
                <option value="low_stock">Stock faible</option>
                <option value="out_of_stock">Rupture</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Toutes catégories</option>
                <option value="Chaussures">Chaussures</option>
                <option value="Vêtements">Vêtements</option>
                <option value="Électronique">Électronique</option>
                <option value="Accessoires">Accessoires</option>
              </select>
            </div>
            <div className="col-md-2">
              <input
                className="form-control"
                placeholder="Filtrer par vendeur"
                value={vendorFilter}
                onChange={(e) => setVendorFilter(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100">
                <BiFilter className="me-2" />
                Plus de filtres
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0">Inventaire ({filteredInventory.length})</h5>
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
                    <th>Produit</th>
                    <th>SKU</th>
                    <th>Vendeur</th>
                    <th>Stock actuel</th>
                    <th>Stock min/max</th>
                    <th>Statut</th>
                    <th>Valeur</th>
                    <th>Vélocité</th>
                    <th>Localisation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div>
                          <div className="fw-medium">{item.name}</div>
                          <small className="text-muted">{item.category}</small>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{item.sku}</span>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">{item.vendor}</div>
                          <small className="text-muted">{item.vendorId}</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="fw-medium me-2">{item.currentStock}</span>
                          <div className="progress" style={{ width: '60px', height: '8px' }}>
                            <div 
                              className={`progress-bar ${
                                item.status === 'out_of_stock' ? 'bg-danger' :
                                item.status === 'low_stock' ? 'bg-warning' : 'bg-success'
                              }`}
                              style={{ 
                                width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        <small className="text-muted">
                          Disponible: {item.availableStock} | Réservé: {item.reservedStock}
                        </small>
                      </td>
                      <td>
                        <div>
                          <small className="text-muted">Min: {item.minStock}</small><br/>
                          <small className="text-muted">Max: {item.maxStock}</small>
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(item.status)}
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">€{item.stockValue.toFixed(2)}</div>
                          <small className="text-muted">€{item.cost} × {item.currentStock}</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="fw-medium me-1">{item.salesVelocity}</span>
                          <BiTrendingUp className="text-success" />
                          <small className="text-muted ms-1">/sem</small>
                        </div>
                        <small className="text-muted">Rotation: {item.turnoverRate}/mois</small>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{item.location}</span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button 
                            className="btn btn-sm btn-outline-primary" 
                            title="Modifier stock"
                            onClick={() => {
                              const newStock = prompt(`Nouveau stock pour ${item.name}:`, item.currentStock);
                              if (newStock !== null && !isNaN(newStock)) {
                                updateStock(item.id, parseInt(newStock));
                              }
                            }}
                          >
                            <BiEdit />
                          </button>
                          <button className="btn btn-sm btn-outline-info" title="Détails">
                            <BiBarChart />
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

      {/* Modal d'ajout de produit */}
      {showAddModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ajouter un produit à l'inventaire</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nom du produit</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">SKU</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Catégorie</label>
                    <select 
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Chaussures">Chaussures</option>
                      <option value="Vêtements">Vêtements</option>
                      <option value="Électronique">Électronique</option>
                      <option value="Accessoires">Accessoires</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Vendeur</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.vendor}
                      onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Stock actuel</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.currentStock}
                      onChange={(e) => setFormData({...formData, currentStock: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Stock minimum</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.minStock}
                      onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Stock maximum</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.maxStock}
                      onChange={(e) => setFormData({...formData, maxStock: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Coût</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="form-control" 
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Prix de vente</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="form-control" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Localisation</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Ex: A1-B2-C3"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Annuler
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    // Logique d'ajout du produit
                    const newProduct = {
                      id: `INV-${Date.now()}`,
                      ...formData,
                      reservedStock: 0,
                      availableStock: formData.currentStock,
                      lastUpdated: new Date().toISOString(),
                      salesVelocity: 0,
                      turnoverRate: 0,
                      stockValue: formData.cost * formData.currentStock,
                      status: getStockStatus(formData.currentStock, formData.minStock)
                    };
                    setInventory(prev => [...prev, newProduct]);
                    setShowAddModal(false);
                    setFormData({
                      name: '', sku: '', category: '', vendor: '',
                      currentStock: 0, minStock: 5, maxStock: 100,
                      cost: 0, price: 0, weight: 0,
                      dimensions: { length: 0, width: 0, height: 0 },
                      location: '', status: 'active'
                    });
                  }}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}