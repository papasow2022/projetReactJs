import React, { useState, useEffect } from 'react';
import { useStock } from '../contexts/StockContext';

const AdminStockDashboard = () => {
  const { checkLowStock, lowStockProducts, addNotification } = useStock();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [threshold, setThreshold] = useState(5);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);

  useEffect(() => {
    loadStockData();
  }, [selectedCategory, threshold]);

  const loadStockData = async () => {
    setLoading(true);
    try {
      const category = selectedCategory === 'all' ? null : selectedCategory;
      await checkLowStock(category, threshold);
      
      // Charger les produits en rupture de stock
      const response = await fetch('http://localhost:4000/api/stock-alerts/out-of-stock');
      const data = await response.json();
      if (data.success) {
        setOutOfStockProducts(data.outOfStockProducts);
      }
    } catch (error) {
      console.error('Erreur chargement données stock:', error);
      addNotification('Erreur lors du chargement des données de stock', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, category, newQuantity) => {
    try {
      const response = await fetch(`http://localhost:4000/api/stock-alerts/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          newQuantity
        })
      });
      
      const data = await response.json();
      if (data.success) {
        addNotification(`Stock mis à jour: ${newQuantity} exemplaires`, 'success');
        loadStockData(); // Recharger les données
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Erreur mise à jour stock:', error);
      addNotification('Erreur lors de la mise à jour du stock', 'error');
    }
  };

  const notifyWaitingList = async (productId, availableQuantity) => {
    try {
      const response = await fetch(`http://localhost:4000/api/waiting-list/notify/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          availableQuantity
        })
      });
      
      const data = await response.json();
      if (data.success) {
        addNotification(`${data.notified} client(s) notifié(s)`, 'success');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Erreur notification liste d\'attente:', error);
      addNotification('Erreur lors de la notification', 'error');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>📊 Gestion des Stocks</h2>
            <button 
              className="btn btn-primary"
              onClick={loadStockData}
              disabled={loading}
            >
              {loading ? '⏳ Chargement...' : '🔄 Actualiser'}
            </button>
          </div>

          {/* Filtres */}
          <div className="row mb-4">
            <div className="col-md-4">
              <label className="form-label">Catégorie</label>
              <select 
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Toutes les catégories</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
                <option value="enfant">Enfant</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Seuil d'alerte</label>
              <input
                type="number"
                className="form-control"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                min="1"
                max="50"
              />
            </div>
          </div>

          {/* Statistiques */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <h5 className="card-title">⚠️ Stock Faible</h5>
                  <h3>{lowStockProducts.length}</h3>
                  <small>Produits avec moins de {threshold} exemplaires</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-danger text-white">
                <div className="card-body">
                  <h5 className="card-title">❌ Rupture</h5>
                  <h3>{outOfStockProducts.length}</h3>
                  <small>Produits en rupture de stock</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <h5 className="card-title">📋 Listes d'attente</h5>
                  <h3>-</h3>
                  <small>Clients en attente</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">✅ En Stock</h5>
                  <h3>-</h3>
                  <small>Produits disponibles</small>
                </div>
              </div>
            </div>
          </div>

          {/* Tableau des stocks faibles */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">⚠️ Produits en Stock Faible</h5>
            </div>
            <div className="card-body">
              {lowStockProducts.length === 0 ? (
                <p className="text-muted text-center">Aucun produit en stock faible</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Catégorie</th>
                        <th>Stock Actuel</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.map((product) => (
                        <tr key={`${product.category}-${product._id}`}>
                          <td>
                            <div>
                              <strong>{product.name}</strong><br/>
                              <small className="text-muted">{product.path}</small>
                            </div>
                          </td>
                          <td>
                            <span className={`badge bg-${product.category === 'homme' ? 'primary' : product.category === 'femme' ? 'pink' : 'success'}`}>
                              {product.category}
                            </span>
                          </td>
                          <td>
                            <span className={`badge bg-${product.quantité <= 0 ? 'danger' : 'warning'}`}>
                              {product.quantité} exemplaires
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                style={{ width: '80px' }}
                                min="0"
                                max="1000"
                                placeholder="Nouveau stock"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    const newQuantity = parseInt(e.target.value);
                                    if (!isNaN(newQuantity) && newQuantity >= 0) {
                                      updateStock(product._id, product.category, newQuantity);
                                      if (newQuantity > 0) {
                                        notifyWaitingList(product._id, newQuantity);
                                      }
                                    }
                                  }
                                }}
                              />
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => {
                                  const input = document.querySelector(`input[placeholder="Nouveau stock"]`);
                                  if (input) {
                                    const newQuantity = parseInt(input.value);
                                    if (!isNaN(newQuantity) && newQuantity >= 0) {
                                      updateStock(product._id, product.category, newQuantity);
                                      if (newQuantity > 0) {
                                        notifyWaitingList(product._id, newQuantity);
                                      }
                                    }
                                  }
                                }}
                              >
                                ✅ Mettre à jour
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

          {/* Tableau des ruptures de stock */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">❌ Produits en Rupture de Stock</h5>
            </div>
            <div className="card-body">
              {outOfStockProducts.length === 0 ? (
                <p className="text-muted text-center">Aucun produit en rupture de stock</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Catégorie</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outOfStockProducts.map((product) => (
                        <tr key={`${product.category}-${product._id}`}>
                          <td>
                            <div>
                              <strong>{product.name}</strong><br/>
                              <small className="text-muted">{product.path}</small>
                            </div>
                          </td>
                          <td>
                            <span className={`badge bg-${product.category === 'homme' ? 'primary' : product.category === 'femme' ? 'pink' : 'success'}`}>
                              {product.category}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-danger">
                              {product.quantité} exemplaires
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                style={{ width: '80px' }}
                                min="1"
                                max="1000"
                                placeholder="Nouveau stock"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    const newQuantity = parseInt(e.target.value);
                                    if (!isNaN(newQuantity) && newQuantity > 0) {
                                      updateStock(product._id, product.category, newQuantity);
                                      notifyWaitingList(product._id, newQuantity);
                                    }
                                  }
                                }}
                              />
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => {
                                  const input = document.querySelector(`input[placeholder="Nouveau stock"]`);
                                  if (input) {
                                    const newQuantity = parseInt(input.value);
                                    if (!isNaN(newQuantity) && newQuantity > 0) {
                                      updateStock(product._id, product.category, newQuantity);
                                      notifyWaitingList(product._id, newQuantity);
                                    }
                                  }
                                }}
                              >
                                📦 Réapprovisionner
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
      </div>
    </div>
  );
};

export default AdminStockDashboard;

