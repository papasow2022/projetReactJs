import React, { useState, useEffect } from 'react';
import { exportToCsv } from '../utils/csvExport';
import { Link } from 'react-router-dom';
import { useAudit } from '../contexts/AuditContext';
import { 
  BiPackage, 
  BiSearch, 
  BiFilter, 
  BiCheckCircle, 
  BiXCircle, 
  BiInfoCircle, 
  BiEdit,
  BiTrash,
  BiUser,
  BiCalendar,
  BiTag
} from 'react-icons/bi';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { addAuditEntry } = useAudit();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, statusFilter, vendorFilter, dateFrom, dateTo]);

  const loadProducts = () => {
    setLoading(true);
    // Simuler des données de test
    const mockProducts = [
      {
        id: 'PROD-001',
        name: 'Chaussures Nike Air Max',
        vendor: 'Boutique Sport',
        vendorId: 'VD-001',
        category: 'Chaussures',
        price: 89.99,
        status: 'pending',
        submittedAt: '2024-01-15T10:30:00Z',
        images: ['product1.jpg'],
        description: 'Chaussures de sport Nike Air Max en excellent état',
        reported: false,
        reportReason: null
      },
      {
        id: 'PROD-002',
        name: 'Sac à dos Adidas',
        vendor: 'Mode & Style',
        vendorId: 'VD-002',
        category: 'Accessoires',
        price: 45.50,
        status: 'approved',
        submittedAt: '2024-01-14T15:20:00Z',
        images: ['product2.jpg'],
        description: 'Sac à dos Adidas noir, parfait pour le sport',
        reported: false,
        reportReason: null
      },
      {
        id: 'PROD-003',
        name: 'Montre Apple Watch',
        vendor: 'Tech Store',
        vendorId: 'VD-003',
        category: 'Électronique',
        price: 299.99,
        status: 'rejected',
        submittedAt: '2024-01-13T09:15:00Z',
        images: ['product3.jpg'],
        description: 'Apple Watch Series 7, état neuf',
        reported: true,
        reportReason: 'Prix suspect'
      },
      {
        id: 'PROD-004',
        name: 'Veste Nike',
        vendor: 'Sport Plus',
        vendorId: 'VD-004',
        category: 'Vêtements',
        price: 75.00,
        status: 'pending',
        submittedAt: '2024-01-12T14:45:00Z',
        images: ['product4.jpg'],
        description: 'Veste Nike bleue, taille M',
        reported: false,
        reportReason: null
      }
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  };

  const filterProducts = () => {
    let filtered = products;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    // Filtre par vendeur
    if (vendorFilter) {
      const q = vendorFilter.toLowerCase();
      filtered = filtered.filter(p => `${p.vendor} ${p.vendorId}`.toLowerCase().includes(q));
    }

    // Filtre par date
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      filtered = filtered.filter(p => new Date(p.submittedAt).getTime() >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime();
      filtered = filtered.filter(p => new Date(p.submittedAt).getTime() <= to);
    }

    setFilteredProducts(filtered);
  };

  const approveProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, status: 'approved' } : p
    ));
    // Enregistrer dans l'audit
    addAuditEntry('product_approved', { type: 'product', id: productId }, { 
      productName: product?.name || 'Produit inconnu',
      vendor: product?.vendor || 'Vendeur inconnu'
    });
  };

  const rejectProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, status: 'rejected' } : p
    ));
    // Enregistrer dans l'audit
    addAuditEntry('product_rejected', { type: 'product', id: productId }, { 
      productName: product?.name || 'Produit inconnu',
      vendor: product?.vendor || 'Vendeur inconnu'
    });
  };

  const deleteProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    // Enregistrer dans l'audit
    addAuditEntry('product_deleted', { type: 'product', id: productId }, { 
      productName: product?.name || 'Produit inconnu',
      vendor: product?.vendor || 'Vendeur inconnu'
    });
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const isAllSelected = filteredProducts.length > 0 && selectedIds.length === filteredProducts.length;
  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedIds([]);
    else setSelectedIds(filteredProducts.map(p => p.id));
  };
  const approveSelected = () => {
    setProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status: 'approved' } : p));
    // Enregistrer dans l'audit
    selectedIds.forEach(id => {
      const product = products.find(p => p.id === id);
      addAuditEntry('product_approved_bulk', { type: 'product', id }, { 
        productName: product?.name || 'Produit inconnu',
        vendor: product?.vendor || 'Vendeur inconnu'
      });
    });
    setSelectedIds([]);
  };
  const rejectSelected = () => {
    setProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status: 'rejected' } : p));
    // Enregistrer dans l'audit
    selectedIds.forEach(id => {
      const product = products.find(p => p.id === id);
      addAuditEntry('product_rejected_bulk', { type: 'product', id }, { 
        productName: product?.name || 'Produit inconnu',
        vendor: product?.vendor || 'Vendeur inconnu'
      });
    });
    setSelectedIds([]);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="badge bg-success">Approuvé</span>;
      case 'rejected':
        return <span className="badge bg-danger">Rejeté</span>;
      case 'pending':
        return <span className="badge bg-warning">En attente</span>;
      default:
        return <span className="badge bg-secondary">Inconnu</span>;
    }
  };

  const getStatusCounts = () => {
    return {
      all: products.length,
      pending: products.filter(p => p.status === 'pending').length,
      approved: products.filter(p => p.status === 'approved').length,
      rejected: products.filter(p => p.status === 'rejected').length,
      reported: products.filter(p => p.reported).length
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Modération des produits</h1>
          <p className="text-muted mb-0">Gérer et valider les produits des vendeurs</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              const rows = filteredProducts.map(p => ({
                id: p.id,
                name: p.name,
                vendor: p.vendor,
                vendorId: p.vendorId,
                category: p.category,
                price: p.price,
                status: p.status,
                submittedAt: p.submittedAt,
                reported: p.reported,
                reportReason: p.reportReason
              }));
              exportToCsv('admin_products.csv', rows);
            }}
          >
            Export CSV
          </button>
          <button className="btn btn-outline-primary" onClick={loadProducts}>
            <BiPackage className="me-2" />
            Actualiser
          </button>
          <button className="btn btn-success" disabled={selectedIds.length===0} onClick={approveSelected}>Approuver la sélection</button>
          <button className="btn btn-danger" disabled={selectedIds.length===0} onClick={rejectSelected}>Rejeter la sélection</button>
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
              <h4 className="text-success mb-1">{counts.approved}</h4>
              <small className="text-muted">Approuvés</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-danger mb-1">{counts.rejected}</h4>
              <small className="text-muted">Rejetés</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-warning mb-1">{counts.reported}</h4>
              <small className="text-muted">Signalés</small>
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
                  placeholder="Rechercher un produit..."
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
                <option value="approved">Approuvés</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Filtrer par vendeur ou ID vendeur" value={vendorFilter} onChange={(e)=>setVendorFilter(e.target.value)} />
            </div>
            <div className="col-md-3">
              <div className="d-flex gap-2">
                <input type="date" className="form-control" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
                <input type="date" className="form-control" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0">Produits ({filteredProducts.length})</h5>
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
                    <th>
                      <input type="checkbox" checked={filteredProducts.length>0 && selectedIds.length===filteredProducts.length} onChange={toggleSelectAll} />
                    </th>
                    <th>Produit</th>
                    <th>Vendeur</th>
                    <th>Catégorie</th>
                    <th>Prix</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="align-middle">
                        <input type="checkbox" checked={selectedIds.includes(product.id)} onChange={()=>toggleSelect(product.id)} />
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0 me-3">
                            <div className="bg-light rounded" style={{ width: '50px', height: '50px' }}>
                              <BiPackage className="w-100 h-100 text-muted" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{product.name}</h6>
                            <small className="text-muted">ID: {product.id}</small>
                            {product.reported && (
                              <div className="mt-1">
                                <BiXCircle className="text-warning me-1" />
                                <small className="text-warning">Signalé: {product.reportReason}</small>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">{product.vendor}</div>
                          <small className="text-muted">{product.vendorId}</small>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">
                          <BiTag className="me-1" />
                          {product.category}
                        </span>
                      </td>
                      <td>
                        <span className="fw-medium">€{product.price}</span>
                      </td>
                      <td>
                        {getStatusBadge(product.status)}
                      </td>
                      <td>
                        <small className="text-muted">
                          <BiCalendar className="me-1" />
                          {new Date(product.submittedAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-primary" title="Voir">
                            <BiInfoCircle />
                          </button>
                          {product.status === 'pending' && (
                            <>
                              <button 
                                className="btn btn-sm btn-success" 
                                title="Approuver"
                                onClick={() => approveProduct(product.id)}
                              >
                                <BiCheckCircle />
                              </button>
                              <button 
                                className="btn btn-sm btn-danger" 
                                title="Rejeter"
                                onClick={() => rejectProduct(product.id)}
                              >
                                <BiXCircle />
                              </button>
                            </>
                          )}
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            title="Supprimer"
                            onClick={() => deleteProduct(product.id)}
                          >
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
    </div>
  );
}