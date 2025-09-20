import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../amazon-like.css';

const AdminStocks = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingSize, setEditingSize] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [saving, setSaving] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Récupérer tous les produits
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`${baseUrl}/api/admin/stocks/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la récupération des produits');
      }

      setProducts(data.products);
      setError(null);
    } catch (err) {
      console.error('Erreur récupération produits:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Mettre à jour le stock total d'un produit
  const updateTotalStock = async (productId, newStock) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseUrl}/api/admin/stocks/products/${productId}/stock`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newStock: parseInt(newStock) })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      // Mettre à jour l'état local
      setProducts(prev => prev.map(product => 
        product._id === productId 
          ? { ...product, stock: parseInt(newStock) }
          : product
      ));

      setEditingProduct(null);
      setNewStock('');
      alert(`✅ Stock total mis à jour: ${data.product.oldStock} → ${data.product.newStock}`);
    } catch (err) {
      console.error('Erreur mise à jour stock total:', err);
      alert(`❌ Erreur: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Mettre à jour le stock d'une taille spécifique
  const updateSizeStock = async (productId, size, newStock) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseUrl}/api/admin/stocks/products/${productId}/sizes/${size}/stock`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newStock: parseInt(newStock) })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      // Mettre à jour l'état local
      setProducts(prev => prev.map(product => 
        product._id === productId 
          ? { 
              ...product, 
              stock: data.product.newTotalStock,
              sizes: product.sizes.map(s => 
                s.size === size 
                  ? { ...s, stock: parseInt(newStock) }
                  : s
              )
            }
          : product
      ));

      setEditingSize(null);
      setNewStock('');
      alert(`✅ Stock taille ${size} mis à jour: ${data.product.oldStock} → ${data.product.newStock}`);
    } catch (err) {
      console.error('Erreur mise à jour stock taille:', err);
      alert(`❌ Erreur: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };


  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Rupture', class: 'text-danger' };
    if (stock <= 2) return { text: 'Stock faible', class: 'text-warning' };
    return { text: 'En stock', class: 'text-success' };
  };


  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Erreur</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchProducts}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>📦 Gestion des Stocks</h2>
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/admin/dashboard')}
            >
              ← Retour Dashboard Admin
            </button>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Produits ({products.length})</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Produit</th>
                      <th>Marque</th>
                      <th>Couleur</th>
                      <th>Stock Total</th>
                      <th>Tailles</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div>
                            <strong>{product.name}</strong>
                            <br />
                            <small className="text-muted">{product.path}</small>
                          </div>
                        </td>
                        <td>{product.brand}</td>
                        <td>{product.color}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {editingProduct === product._id ? (
                              <div className="d-flex align-items-center">
                                <input
                                  type="number"
                                  className="form-control form-control-sm me-2"
                                  style={{ width: '80px' }}
                                  value={newStock}
                                  onChange={(e) => setNewStock(e.target.value)}
                                  min="0"
                                />
                                <button
                                  className="btn btn-success btn-sm me-1"
                                  onClick={() => updateTotalStock(product._id, newStock)}
                                  disabled={saving}
                                >
                                  ✓
                                </button>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => {
                                    setEditingProduct(null);
                                    setNewStock('');
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div className="d-flex align-items-center">
                                <span className={`badge ${getStockStatus(product.stock).class}`}>
                                  {product.stock}
                                </span>
                                <button
                                  className="btn btn-outline-primary btn-sm ms-2"
                                  onClick={() => {
                                    setEditingProduct(product._id);
                                    setNewStock(product.stock);
                                  }}
                                >
                                  ✏️
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {product.sizes.map((size) => (
                              <div key={size.size} className="d-flex align-items-center">
                                <span className="badge bg-secondary me-1">
                                  {size.size}
                                </span>
                                {editingSize === `${product._id}-${size.size}` ? (
                                  <div className="d-flex align-items-center">
                                    <input
                                      type="number"
                                      className="form-control form-control-sm me-1"
                                      style={{ width: '60px' }}
                                      value={newStock}
                                      onChange={(e) => setNewStock(e.target.value)}
                                      min="0"
                                    />
                                    <button
                                      className="btn btn-success btn-sm me-1"
                                      onClick={() => updateSizeStock(product._id, size.size, newStock)}
                                      disabled={saving}
                                    >
                                      ✓
                                    </button>
                                    <button
                                      className="btn btn-secondary btn-sm"
                                      onClick={() => {
                                        setEditingSize(null);
                                        setNewStock('');
                                      }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <div className="d-flex align-items-center">
                                    <span className={`badge ${getStockStatus(size.stock).class}`}>
                                      {size.stock}
                                    </span>
                                    <button
                                      className="btn btn-outline-primary btn-sm ms-1"
                                      onClick={() => {
                                        setEditingSize(`${product._id}-${size.size}`);
                                        setNewStock(size.stock);
                                      }}
                                    >
                                      ✏️
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-outline-info btn-sm"
                              onClick={() => {
                                const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
                                alert(`Stock total calculé: ${totalStock}\nStock en DB: ${product.stock}`);
                              }}
                            >
                              🔍
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminStocks;
