import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { usePromotions } from '../contexts/PromotionsContext';
import { useProducts } from '../contexts/ProductsContext';
import { 
  BiArrowBack, 
  BiPlus, 
  BiEdit, 
  BiTrash, 
  BiCopy,
  BiToggleLeft,
  BiToggleRight,
  BiSearch, 
  BiFilter,
  BiGift,
  BiDollar,
  BiCalendar,
  BiUser,
  BiTrendingUp,
  BiRefresh,
  BiArchive
} from 'react-icons/bi';

const OutilsPromotionVendeur = () => {
  const { user } = useAuth();
  const { 
    getVendorPromotions, 
    getVendorCoupons,
    getPromotionStats,
    createPromotion,
    createCoupon,
    updatePromotion,
    updateCoupon,
    deletePromotion,
    deleteCoupon,
    togglePromotionStatus,
    toggleCouponStatus,
    duplicatePromotion,
    duplicateCoupon
  } = usePromotions();
  const { getVendorProducts } = useProducts();

  const [activeTab, setActiveTab] = useState('promotions');
  const [promotions, setPromotions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState({
    totalPromotions: 0,
    activePromotions: 0,
    totalCoupons: 0,
    activeCoupons: 0,
    totalDiscount: 0,
    totalUsage: 0,
    conversionRate: 0
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  const vendorProducts = getVendorProducts(user?.vendorId || '');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    const vendorPromotions = getVendorPromotions(user?.vendorId || '');
    const vendorCoupons = getVendorCoupons(user?.vendorId || '');
    const vendorStats = getPromotionStats(user?.vendorId || '');
    
    setPromotions(vendorPromotions);
    setCoupons(vendorCoupons);
    // Assurer que les stats ont des valeurs par défaut
    setStats({
      totalPromotions: vendorStats?.totalPromotions || 0,
      activePromotions: vendorStats?.activePromotions || 0,
      totalCoupons: vendorStats?.totalCoupons || 0,
      activeCoupons: vendorStats?.activeCoupons || 0,
      totalDiscount: vendorStats?.totalDiscount || 0,
      totalUsage: vendorStats?.totalUsage || 0,
      conversionRate: vendorStats?.conversionRate || 0
    });
  };

  const filteredItems = (activeTab === 'promotions' ? promotions : coupons).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePromotion = async (promotionData) => {
    setLoading(true);
    const result = await createPromotion({
      ...promotionData,
      vendorId: user?.vendorId
    });
    
    if (result.success) {
      loadData();
      setShowCreateModal(false);
      alert('Promotion créée avec succès !');
    } else {
      alert('Erreur lors de la création de la promotion');
    }
    setLoading(false);
  };

  const handleCreateCoupon = async (couponData) => {
    setLoading(true);
    const result = await createCoupon({
      ...couponData,
      vendorId: user?.vendorId
    });
    
    if (result.success) {
      loadData();
      setShowCreateModal(false);
      alert('Coupon créé avec succès !');
    } else {
      alert('Erreur lors de la création du coupon');
    }
    setLoading(false);
  };

  const handleToggleStatus = async (itemId, type) => {
    setLoading(true);
    const result = type === 'promotion' 
      ? await togglePromotionStatus(itemId)
      : await toggleCouponStatus(itemId);
    
    if (result.success) {
      loadData();
    } else {
      alert('Erreur lors de la mise à jour');
    }
    setLoading(false);
  };

  const handleDelete = async (itemId, type) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      setLoading(true);
      const result = type === 'promotion' 
        ? await deletePromotion(itemId)
        : await deleteCoupon(itemId);
      
      if (result.success) {
        loadData();
        alert('Élément supprimé avec succès');
      } else {
        alert('Erreur lors de la suppression');
      }
      setLoading(false);
    }
  };

  const handleDuplicate = async (itemId, type) => {
    setLoading(true);
    const result = type === 'promotion' 
      ? await duplicatePromotion(itemId)
      : await duplicateCoupon(itemId);
    
    if (result.success) {
      loadData();
      alert('Élément dupliqué avec succès');
    } else {
      alert('Erreur lors de la duplication');
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { bg: '#d4edda', color: '#155724' };
      case 'inactive': return { bg: '#f8d7da', color: '#721c24' };
      case 'archived': return { bg: '#e2e3e5', color: '#383d41' };
      default: return { bg: '#e9ecef', color: '#495057' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'archived': return 'Archivé';
      default: return status;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', padding: '1rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/vendeur/dashboard" style={{ textDecoration: 'none', color: '#666' }}>
              <BiArrowBack style={{ fontSize: '1.5rem' }} />
            </Link>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '600', color: '#232f3e' }}>
                Outils de Promotion
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                Gérez vos promotions et coupons
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 0' }}>
        {/* Statistiques */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiGift style={{ fontSize: '2rem', color: '#007bff' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {stats.totalPromotions}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Promotions</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <BiDollar style={{ fontSize: '2rem', color: '#28a745' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {stats.totalCoupons}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Coupons</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiUser style={{ fontSize: '2rem', color: '#ffc107' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {stats.totalUsage}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Utilisations</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiDollar style={{ fontSize: '2rem', color: '#dc3545' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  €{stats.totalDiscount.toFixed(2)}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Réductions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '2rem',
          backgroundColor: 'white',
          padding: '0.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <button
            onClick={() => setActiveTab('promotions')}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              border: 'none',
              backgroundColor: activeTab === 'promotions' ? '#007bff' : 'transparent',
              color: activeTab === 'promotions' ? 'white' : '#666',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <BiGift />
            Promotions
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              border: 'none',
              backgroundColor: activeTab === 'coupons' ? '#007bff' : 'transparent',
              color: activeTab === 'coupons' ? 'white' : '#666',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
                            <BiDollar />
            Coupons
          </button>
        </div>

        {/* Actions et filtres */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <BiPlus />
              Créer {activeTab === 'promotions' ? 'une promotion' : 'un coupon'}
            </button>
            
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <BiSearch style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#666' 
              }} />
              <input
                type="text"
                placeholder={`Rechercher ${activeTab === 'promotions' ? 'des promotions' : 'des coupons'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                minWidth: '120px'
              }}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
              <option value="archived">Archivés</option>
            </select>
            
            <button
              onClick={loadData}
              style={{
                padding: '0.75rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <BiRefresh />
            </button>
          </div>
        </div>

        {/* Liste des éléments */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e0e0e0' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600' }}>
              {activeTab === 'promotions' ? 'Promotions' : 'Coupons'} ({filteredItems.length})
            </h2>
          </div>
          
          <div style={{ padding: '1.5rem' }}>
            {filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                <BiGift size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3>Aucun élément trouvé</h3>
                <p>Aucun {activeTab === 'promotions' ? 'promotion' : 'coupon'} ne correspond à vos critères de recherche.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {filteredItems.map(item => (
                  <div key={item.id} style={{ 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px', 
                    padding: '1.5rem' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
                            {item.name}
                          </h3>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            ...getStatusColor(item.status)
                          }}>
                            {getStatusLabel(item.status)}
                          </span>
                        </div>
                        <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                          {item.description}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleToggleStatus(item.id, activeTab.slice(0, -1))}
                          disabled={loading}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: item.status === 'active' ? '#dc3545' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1
                          }}
                        >
                          {item.status === 'active' ? <BiToggleLeft /> : <BiToggleRight />}
                        </button>
                        <button
                          onClick={() => handleDuplicate(item.id, activeTab.slice(0, -1))}
                          disabled={loading}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1
                          }}
                        >
                          <BiCopy />
                        </button>
                        <button
                          onClick={() => setEditingItem(item)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <BiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, activeTab.slice(0, -1))}
                          disabled={loading}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1
                          }}
                        >
                          <BiTrash />
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
                      <div>
                        <span style={{ color: '#666' }}>Type:</span>
                        <span style={{ fontWeight: '500', marginLeft: '0.5rem' }}>
                          {item.type === 'percentage' ? 'Pourcentage' : 'Montant fixe'}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#666' }}>Valeur:</span>
                        <span style={{ fontWeight: '500', marginLeft: '0.5rem' }}>
                          {item.type === 'percentage' ? `${item.value}%` : `€${item.value}`}
                        </span>
                      </div>
                      {item.expiresAt && (
                        <div>
                          <span style={{ color: '#666' }}>Expire le:</span>
                          <span style={{ fontWeight: '500', marginLeft: '0.5rem' }}>
                            {formatDate(item.expiresAt)}
                          </span>
                        </div>
                      )}
                      <div>
                        <span style={{ color: '#666' }}>Utilisations:</span>
                        <span style={{ fontWeight: '500', marginLeft: '0.5rem' }}>
                          {item.usageCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de création */}
      {showCreateModal && (
        <CreatePromotionModal
          type={activeTab}
          onClose={() => setShowCreateModal(false)}
          onSubmit={activeTab === 'promotions' ? handleCreatePromotion : handleCreateCoupon}
          loading={loading}
          products={vendorProducts}
        />
      )}
    </div>
  );
};

// Composant modal pour créer des promotions/coupons
const CreatePromotionModal = ({ type, onClose, onSubmit, loading, products }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    maxDiscount: '',
    expiresAt: '',
    maxUsage: '',
    applicableProducts: [],
    code: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>
          Créer {type === 'promotions' ? 'une promotion' : 'un coupon'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Nom *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  resize: 'vertical'
                }}
              />
            </div>

            {type === 'coupons' && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Code du coupon *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  required
                  placeholder="Ex: SAVE20"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Type de réduction *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="percentage">Pourcentage</option>
                  <option value="fixed">Montant fixe</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Valeur *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  required
                  placeholder={formData.type === 'percentage' ? '20' : '10.00'}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Montant minimum (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.minOrderAmount}
                  onChange={(e) => handleInputChange('minOrderAmount', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              {formData.type === 'percentage' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Réduction max (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.maxDiscount}
                    onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Date d'expiration
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Usage maximum
                </label>
                <input
                  type="number"
                  value={formData.maxUsage}
                  onChange={(e) => handleInputChange('maxUsage', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutilsPromotionVendeur;