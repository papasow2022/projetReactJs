import React, { useState, useEffect } from 'react';
import { exportToCsv } from '../utils/csvExport';
import { Link } from 'react-router-dom';
import { useAudit } from '../contexts/AuditContext';
import { useProducts } from '../contexts/ProductsContext';
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
  const { allProducts, updateProductStatus, deleteProduct: ctxDeleteProduct } = useProducts();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const { addAuditEntry } = useAudit();

  useEffect(() => {
    setProducts(allProducts || []);
  }, [allProducts]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, statusFilter, vendorFilter, dateFrom, dateTo]);

  const loadProducts = () => {
    setLoading(true);
    setProducts(allProducts || []);
    setLoading(false);
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

  const approveProduct = async (productId) => {
    try {
      console.log('[Admin] Approve click', productId);
      const product = products.find(p => p.id === productId);
      const res = await updateProductStatus(productId, 'approved');
      if (res?.success) {
        loadProducts();
        addAuditEntry('product_approved', { type: 'product', id: productId }, { 
          productName: product?.name || 'Produit inconnu',
          vendor: product?.vendor || 'Vendeur inconnu'
        });
      } else {
        alert('Echec approbation: ' + (res?.error || 'inconnu'));
      }
    } catch (e) {
      console.error(e);
      alert('Erreur approbation: ' + e.message);
    }
  };

  const rejectProduct = async (productId) => {
    try {
      console.log('[Admin] Reject click', productId);
      const product = products.find(p => p.id === productId);
      const res = await updateProductStatus(productId, 'rejected');
      if (res?.success) {
        loadProducts();
        addAuditEntry('product_rejected', { type: 'product', id: productId }, { 
          productName: product?.name || 'Produit inconnu',
          vendor: product?.vendor || 'Vendeur inconnu'
        });
      } else {
        alert('Echec rejet: ' + (res?.error || 'inconnu'));
      }
    } catch (e) {
      console.error(e);
      alert('Erreur rejet: ' + e.message);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      if (!window.confirm('Supprimer ce produit ?')) return;
      console.log('[Admin] Delete click', productId);
      const product = products.find(p => p.id === productId);
      const res = await ctxDeleteProduct(productId);
      if (res?.success) {
        loadProducts();
        addAuditEntry('product_deleted', { type: 'product', id: productId }, { 
          productName: product?.name || 'Produit inconnu',
          vendor: product?.vendor || 'Vendeur inconnu'
        });
      } else {
        alert('Echec suppression: ' + (res?.error || 'inconnu'));
      }
    } catch (e) {
      console.error(e);
      alert('Erreur suppression: ' + e.message);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const isAllSelected = filteredProducts.length > 0 && selectedIds.length === filteredProducts.length;
  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedIds([]);
    else setSelectedIds(filteredProducts.map(p => p.id));
  };
  const approveSelected = async () => {
    try {
      for (const id of selectedIds) {
        await updateProductStatus(id, 'approved');
        const product = products.find(p => p.id === id);
        addAuditEntry('product_approved_bulk', { type: 'product', id }, { 
          productName: product?.name || 'Produit inconnu',
          vendor: product?.vendor || 'Vendeur inconnu'
        });
      }
      setSelectedIds([]);
      loadProducts();
    } catch (e) {
      console.error(e);
      alert('Erreur approbation en masse: ' + e.message);
    }
  };
  const rejectSelected = async () => {
    try {
      for (const id of selectedIds) {
        await updateProductStatus(id, 'rejected');
        const product = products.find(p => p.id === id);
        addAuditEntry('product_rejected_bulk', { type: 'product', id }, { 
          productName: product?.name || 'Produit inconnu',
          vendor: product?.vendor || 'Vendeur inconnu'
        });
      }
      setSelectedIds([]);
      loadProducts();
    } catch (e) {
      console.error(e);
      alert('Erreur rejet en masse: ' + e.message);
    }
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
                          <div className="fw-medium">{product.vendor || product.sellerName || 'N/A'}</div>
                          <small className="text-muted">{product.vendorId || product.id}</small>
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
                          {product.submittedAt ? new Date(product.submittedAt).toLocaleDateString() : 'N/A'}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button type="button" className="btn btn-sm btn-outline-primary" title="Voir" onClick={() => setViewProduct(product)}>
                            <BiInfoCircle />
                          </button>
                          {product.status === 'pending' && (
                            <>
                              <button 
                                type="button"
                                className="btn btn-sm btn-success" 
                                title="Approuver"
                                onClick={() => approveProduct(product.id)}
                              >
                                <BiCheckCircle />
                              </button>
                              <button 
                                type="button"
                                className="btn btn-sm btn-danger" 
                                title="Rejeter"
                                onClick={() => rejectProduct(product.id)}
                              >
                                <BiXCircle />
                              </button>
                            </>
                          )}
                          <button 
                            type="button"
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
      {viewProduct && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Détails du produit</h5>
                <button type="button" className="btn-close" onClick={() => setViewProduct(null)} />
              </div>
              <div className="modal-body">
                <p><strong>Nom:</strong> {viewProduct.name}</p>
                <p><strong>Vendeur:</strong> {viewProduct.vendor || viewProduct.sellerName}</p>
                <p><strong>Catégorie:</strong> {viewProduct.category}</p>
                <p><strong>Prix:</strong> €{viewProduct.price}</p>
                <p><strong>Statut:</strong> {viewProduct.status}</p>
                <p><strong>Date:</strong> {viewProduct.submittedAt ? new Date(viewProduct.submittedAt).toLocaleString() : 'N/A'}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setViewProduct(null)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}