import React, { useState, useEffect } from 'react';
import { 
  BiGift, 
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
  BiHash,
  BiDollar,
  BiUser,
  BiPackage,
  BiBarChart,
  BiTrendingUp,
  BiCopy,
  BiCode
} from 'react-icons/bi';
import { exportToCsv } from '../utils/csvExport';

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [activeTab, setActiveTab] = useState('promotions');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Formulaire pour promotions/coupons
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'percentage', // percentage, fixed, free_shipping
    value: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    usageLimit: 0,
    usagePerCustomer: 1,
    startDate: '',
    endDate: '',
    categories: [],
    products: [],
    vendors: [],
    status: 'active',
    code: '', // Pour les coupons
    isPublic: true
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterData();
  }, [promotions, coupons, searchTerm, statusFilter, activeTab]);

  const loadData = () => {
    setLoading(true);
    
    // Charger les vraies données depuis localStorage
    try {
      const storedPromotions = JSON.parse(localStorage.getItem('promotions') || '[]');
      const storedCoupons = JSON.parse(localStorage.getItem('coupons') || '[]');
      
      setPromotions(storedPromotions);
      setCoupons(storedCoupons);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des promotions:', error);
      setPromotions([]);
      setCoupons([]);
      setLoading(false);
    }
  };

  const filterData = () => {
    const data = activeTab === 'promotions' ? promotions : coupons;
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (activeTab === 'promotions') {
      setFilteredPromotions(filtered);
    } else {
      setFilteredCoupons(filtered);
    }
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge bg-success">Actif</span>;
      case 'scheduled':
        return <span className="badge bg-info">Programmé</span>;
      case 'expired':
        return <span className="badge bg-secondary">Expiré</span>;
      case 'paused':
        return <span className="badge bg-warning">En pause</span>;
      case 'cancelled':
        return <span className="badge bg-danger">Annulé</span>;
      default:
        return <span className="badge bg-secondary">Inconnu</span>;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'percentage':
        return <BiHash className="text-primary" />;
      case 'fixed':
        return <BiDollar className="text-success" />;
      case 'free_shipping':
        return <BiPackage className="text-info" />;
      default:
        return <BiGift className="text-muted" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'percentage':
        return 'Pourcentage';
      case 'fixed':
        return 'Montant fixe';
      case 'free_shipping':
        return 'Livraison gratuite';
      default:
        return 'Inconnu';
    }
  };

  const getStats = () => {
    const activePromotions = promotions.filter(p => p.status === 'active').length;
    const activeCoupons = coupons.filter(c => c.status === 'active').length;
    const totalUsage = [...promotions, ...coupons].reduce((sum, item) => sum + item.usageCount, 0);
    const totalDiscount = [...promotions, ...coupons].reduce((sum, item) => sum + item.totalDiscount, 0);

    return { activePromotions, activeCoupons, totalUsage, totalDiscount };
  };

  const stats = getStats();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Afficher une notification de succès
      alert('Code copié dans le presse-papiers !');
    });
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Promotions et Coupons</h1>
          <p className="text-muted mb-0">Gestion des offres promotionnelles et codes de réduction</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => {
              const data = activeTab === 'promotions' ? filteredPromotions : filteredCoupons;
              const rows = data.map(item => ({
                id: item.id,
                name: item.name,
                code: item.code || '',
                type: getTypeLabel(item.type),
                value: item.value,
                status: item.status,
                usageCount: item.usageCount,
                totalDiscount: item.totalDiscount,
                startDate: item.startDate,
                endDate: item.endDate
              }));
              exportToCsv(`${activeTab}.csv`, rows);
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
            Créer {activeTab === 'promotions' ? 'Promotion' : 'Coupon'}
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-primary mb-1">{stats.activePromotions}</h4>
              <small className="text-muted">Promotions actives</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-success mb-1">{stats.activeCoupons}</h4>
              <small className="text-muted">Coupons actifs</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-info mb-1">{stats.totalUsage}</h4>
              <small className="text-muted">Utilisations totales</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-warning mb-1">€{stats.totalDiscount}</h4>
              <small className="text-muted">Réductions accordées</small>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'promotions' ? 'active' : ''}`}
            onClick={() => setActiveTab('promotions')}
          >
            <BiGift className="me-2" />
            Promotions ({promotions.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'coupons' ? 'active' : ''}`}
            onClick={() => setActiveTab('coupons')}
          >
                <BiCode className="me-2" />
            Coupons ({coupons.length})
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
                  placeholder={`Rechercher ${activeTab === 'promotions' ? 'une promotion' : 'un coupon'}...`}
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
                <option value="active">Actif</option>
                <option value="scheduled">Programmé</option>
                <option value="expired">Expiré</option>
                <option value="paused">En pause</option>
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

      {/* Liste des promotions/coupons */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0">
            {activeTab === 'promotions' ? 'Promotions' : 'Coupons'} 
            ({activeTab === 'promotions' ? filteredPromotions.length : filteredCoupons.length})
          </h5>
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
                    <th>Nom</th>
                    {activeTab === 'coupons' && <th>Code</th>}
                    <th>Type</th>
                    <th>Valeur</th>
                    <th>Statut</th>
                    <th>Utilisations</th>
                    <th>Réductions</th>
                    <th>Période</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === 'promotions' ? filteredPromotions : filteredCoupons).map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div>
                          <div className="fw-medium">{item.name}</div>
                          <small className="text-muted">{item.description}</small>
                        </div>
                      </td>
                      {activeTab === 'coupons' && (
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="badge bg-light text-dark me-2">{item.code}</span>
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => copyToClipboard(item.code)}
                              title="Copier le code"
                            >
                              <BiCopy />
                            </button>
                          </div>
                        </td>
                      )}
                      <td>
                        <div className="d-flex align-items-center">
                          {getTypeIcon(item.type)}
                          <span className="ms-2">{getTypeLabel(item.type)}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          {item.type === 'percentage' ? `${item.value}%` : 
                           item.type === 'fixed' ? `€${item.value}` : 
                           'Gratuit'}
                        </div>
                        {item.minOrderAmount > 0 && (
                          <small className="text-muted">Min: €{item.minOrderAmount}</small>
                        )}
                      </td>
                      <td>
                        {getStatusBadge(item.status)}
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">{item.usageCount}</div>
                          {item.usageLimit > 0 && (
                            <small className="text-muted">/ {item.usageLimit}</small>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="fw-medium">€{item.totalDiscount}</div>
                      </td>
                      <td>
                        <div>
                          <small className="text-muted">
                            <BiCalendar className="me-1" />
                            {new Date(item.startDate).toLocaleDateString()}
                          </small><br/>
                          <small className="text-muted">
                            au {new Date(item.endDate).toLocaleDateString()}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-primary" title="Modifier">
                            <BiEdit />
                          </button>
                          <button className="btn btn-sm btn-outline-info" title="Statistiques">
                            <BiBarChart />
                          </button>
                          <button className="btn btn-sm btn-outline-danger" title="Supprimer">
                            <BiTrash />
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

      {/* Modal d'ajout/modification */}
      {showAddModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingItem ? 'Modifier' : 'Créer'} {activeTab === 'promotions' ? 'Promotion' : 'Coupon'}
                </h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                }} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nom</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  {activeTab === 'coupons' && (
                    <div className="col-md-6">
                      <label className="form-label">Code</label>
                      <div className="input-group">
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.code}
                          onChange={(e) => setFormData({...formData, code: e.target.value})}
                        />
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => setFormData({...formData, code: generateCouponCode()})}
                        >
                          Générer
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Type</label>
                    <select 
                      className="form-select"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="percentage">Pourcentage</option>
                      <option value="fixed">Montant fixe</option>
                      <option value="free_shipping">Livraison gratuite</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Valeur</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value)})}
                      disabled={formData.type === 'free_shipping'}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Montant minimum</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({...formData, minOrderAmount: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date de début</label>
                    <input 
                      type="datetime-local" 
                      className="form-control" 
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date de fin</label>
                    <input 
                      type="datetime-local" 
                      className="form-control" 
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Limite d'utilisation</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Utilisations par client</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.usagePerCustomer}
                      onChange={(e) => setFormData({...formData, usagePerCustomer: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                  }}
                >
                  Annuler
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    // Logique de sauvegarde
                    const newItem = {
                      id: editingItem ? editingItem.id : `${activeTab === 'promotions' ? 'PROM' : 'COUP'}-${Date.now()}`,
                      ...formData,
                      usageCount: 0,
                      totalDiscount: 0,
                      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString()
                    };

                    if (activeTab === 'promotions') {
                      setPromotions(prev => 
                        editingItem 
                          ? prev.map(p => p.id === editingItem.id ? newItem : p)
                          : [...prev, newItem]
                      );
                    } else {
                      setCoupons(prev => 
                        editingItem 
                          ? prev.map(c => c.id === editingItem.id ? newItem : c)
                          : [...prev, newItem]
                      );
                    }

                    setShowAddModal(false);
                    setEditingItem(null);
                    setFormData({
                      name: '', description: '', type: 'percentage', value: 0,
                      minOrderAmount: 0, maxDiscount: 0, usageLimit: 0, usagePerCustomer: 1,
                      startDate: '', endDate: '', categories: [], products: [], vendors: [],
                      status: 'active', code: '', isPublic: true
                    });
                  }}
                >
                  {editingItem ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}