import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function ProductComparison() {
  const { t } = useLanguage();
  const [comparisonItems, setComparisonItems] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Charger les produits de comparaison depuis localStorage
  useEffect(() => {
    const loadComparison = () => {
      try {
        const stored = localStorage.getItem('productComparison');
        if (stored) {
          const items = JSON.parse(stored);
          setComparisonItems(Array.isArray(items) ? items : []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la comparaison:', error);
        setComparisonItems([]);
      }
    };

    loadComparison();
    window.addEventListener('storage', loadComparison);
    return () => window.removeEventListener('storage', loadComparison);
  }, []);

  // Sauvegarder la comparaison
  const saveComparison = (items) => {
    try {
      localStorage.setItem('productComparison', JSON.stringify(items));
      setComparisonItems(items);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la comparaison:', error);
    }
  };

  // Supprimer un produit de la comparaison
  const removeFromComparison = (productId) => {
    const updatedItems = comparisonItems.filter(item => item.id !== productId);
    saveComparison(updatedItems);
  };

  // Vider toute la comparaison
  const clearComparison = () => {
    saveComparison([]);
  };

  // Ajouter au panier
  const addToCart = (product) => {
    try {
      const stored = localStorage.getItem('cart');
      const cart = stored ? JSON.parse(stored) : [];
      
      const existingItem = cart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cart.push({ ...product, qty: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Déclencher un événement pour mettre à jour le compteur du panier
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    }
  };

  if (comparisonItems.length === 0) {
    return (
      <div className="bg-white rounded-4 shadow-lg border p-5 text-center">
        <div className="mb-4">
          <i className="bi bi-bar-chart text-muted" style={{ fontSize: '64px' }}></i>
        </div>
        <h3 className="fw-bold mb-3" style={{ color: '#232f3e' }}>
          Aucun produit à comparer
        </h3>
        <p className="text-muted mb-4">
          Ajoutez des produits à votre comparaison pour les analyser côte à côte
        </p>
        <Link 
          to="/catalogue"
          className="btn fw-bold px-4 py-2"
          style={{
            background: 'linear-gradient(135deg, #e47911 0%, #f0c14b 100%)',
            border: 'none',
            color: '#232f3e',
            borderRadius: '8px'
          }}
        >
          <i className="bi bi-search me-2"></i>
          Parcourir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-4 shadow-lg border">
      {/* En-tête de la comparaison */}
      <div className="p-4 border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="fw-bold mb-1" style={{ color: '#232f3e' }}>
              <i className="bi bi-bar-chart me-2"></i>
              Comparaison de produits
            </h3>
            <p className="text-muted mb-0">
              {comparisonItems.length} produit{comparisonItems.length > 1 ? 's' : ''} à comparer
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ borderRadius: '8px' }}
            >
              <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'} me-1`}></i>
              {isExpanded ? 'Réduire' : 'Développer'}
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={clearComparison}
              style={{ borderRadius: '8px' }}
            >
              <i className="bi bi-trash me-1"></i>
              Vider
            </button>
          </div>
        </div>
      </div>

      {/* Tableau de comparaison */}
      <div className="overflow-x-auto">
        <table className="table table-borderless mb-0">
          <tbody>
            {/* Images des produits */}
            <tr>
              <td className="border-end" style={{ width: '200px', verticalAlign: 'top' }}>
                <div className="p-3">
                  <h6 className="fw-bold text-muted">Image</h6>
                </div>
              </td>
              {comparisonItems.map((product) => (
                <td key={product.id} className="border-end" style={{ width: '250px', verticalAlign: 'top' }}>
                  <div className="p-3 text-center">
                    <div className="position-relative mb-3">
                      <img 
                        src={product.image || '/assets/images/placeholder.jpg'} 
                        alt={product.name}
                        className="img-fluid rounded"
                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0"
                        onClick={() => removeFromComparison(product.id)}
                        style={{ borderRadius: '50%', width: '30px', height: '30px', padding: 0 }}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                    <h6 className="fw-bold mb-2" style={{ color: '#232f3e', fontSize: '14px' }}>
                      {product.name}
                    </h6>
                    <div className="d-flex justify-content-center align-items-center mb-2">
                      <div className="text-warning me-1">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`bi ${i < (product.rating || 0) ? 'bi-star-fill' : 'bi-star'}`}
                            style={{ fontSize: '12px' }}
                          ></i>
                        ))}
                      </div>
                      <small className="text-muted">({product.reviews || 0} avis)</small>
                    </div>
                  </div>
                </td>
              ))}
            </tr>

            {/* Prix */}
            <tr className="bg-light">
              <td className="border-end">
                <div className="p-3">
                  <h6 className="fw-bold text-muted">Prix</h6>
                </div>
              </td>
              {comparisonItems.map((product) => (
                <td key={product.id} className="border-end">
                  <div className="p-3 text-center">
                    <div className="fw-bold" style={{ color: '#e47911', fontSize: '18px' }}>
                      {product.price} €
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-muted text-decoration-line-through" style={{ fontSize: '14px' }}>
                        {product.originalPrice} €
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Marque */}
            <tr>
              <td className="border-end">
                <div className="p-3">
                  <h6 className="fw-bold text-muted">Marque</h6>
                </div>
              </td>
              {comparisonItems.map((product) => (
                <td key={product.id} className="border-end">
                  <div className="p-3 text-center">
                    <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold">
                      {product.brand || 'N/A'}
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Catégorie */}
            <tr className="bg-light">
              <td className="border-end">
                <div className="p-3">
                  <h6 className="fw-bold text-muted">Catégorie</h6>
                </div>
              </td>
              {comparisonItems.map((product) => (
                <td key={product.id} className="border-end">
                  <div className="p-3 text-center">
                    <span className="badge bg-secondary bg-opacity-10 text-secondary fw-semibold">
                      {product.category || 'N/A'}
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Disponibilité */}
            <tr>
              <td className="border-end">
                <div className="p-3">
                  <h6 className="fw-bold text-muted">Disponibilité</h6>
                </div>
              </td>
              {comparisonItems.map((product) => (
                <td key={product.id} className="border-end">
                  <div className="p-3 text-center">
                    {product.inStock ? (
                      <span className="badge bg-success bg-opacity-10 text-success fw-semibold">
                        <i className="bi bi-check-circle-fill me-1"></i>
                        En stock
                      </span>
                    ) : (
                      <span className="badge bg-danger bg-opacity-10 text-danger fw-semibold">
                        <i className="bi bi-x-circle-fill me-1"></i>
                        Rupture
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Livraison */}
            <tr className="bg-light">
              <td className="border-end">
                <div className="p-3">
                  <h6 className="fw-bold text-muted">Livraison</h6>
                </div>
              </td>
              {comparisonItems.map((product) => (
                <td key={product.id} className="border-end">
                  <div className="p-3 text-center">
                    {product.freeShipping ? (
                      <span className="text-success fw-semibold">
                        <i className="bi bi-truck me-1"></i>
                        Gratuit
                      </span>
                    ) : (
                      <span className="text-muted">
                        {product.shippingCost || '5.99'} €
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr>
              <td className="border-end">
                <div className="p-3">
                  <h6 className="fw-bold text-muted">Actions</h6>
                </div>
              </td>
              {comparisonItems.map((product) => (
                <td key={product.id} className="border-end">
                  <div className="p-3 text-center">
                    <div className="d-grid gap-2">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm fw-semibold"
                        onClick={() => addToCart(product)}
                        style={{ borderRadius: '8px' }}
                      >
                        <i className="bi bi-cart-plus me-1"></i>
                        Ajouter au panier
                      </button>
                      <Link 
                        to={`/product/${product.id}`}
                        className="btn btn-outline-primary btn-sm fw-semibold"
                        style={{ borderRadius: '8px' }}
                      >
                        <i className="bi bi-eye me-1"></i>
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </td>
              ))}
            </tr>

            {/* Détails supplémentaires (si développé) */}
            {isExpanded && (
              <>
                {/* Matériaux */}
                <tr className="bg-light">
                  <td className="border-end">
                    <div className="p-3">
                      <h6 className="fw-bold text-muted">Matériaux</h6>
                    </div>
                  </td>
                  {comparisonItems.map((product) => (
                    <td key={product.id} className="border-end">
                      <div className="p-3 text-center">
                        <small className="text-muted">
                          {product.materials || 'Non spécifié'}
                        </small>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Garantie */}
                <tr>
                  <td className="border-end">
                    <div className="p-3">
                      <h6 className="fw-bold text-muted">Garantie</h6>
                    </div>
                  </td>
                  {comparisonItems.map((product) => (
                    <td key={product.id} className="border-end">
                      <div className="p-3 text-center">
                        <small className="text-muted">
                          {product.warranty || '2 ans'}
                        </small>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Poids */}
                <tr className="bg-light">
                  <td className="border-end">
                    <div className="p-3">
                      <h6 className="fw-bold text-muted">Poids</h6>
                    </div>
                  </td>
                  {comparisonItems.map((product) => (
                    <td key={product.id} className="border-end">
                      <div className="p-3 text-center">
                        <small className="text-muted">
                          {product.weight || 'N/A'}
                        </small>
                      </div>
                    </td>
                  ))}
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Actions en bas */}
      <div className="p-4 border-top bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Comparez jusqu'à 4 produits simultanément
            </small>
          </div>
          <div className="d-flex gap-2">
            <Link 
              to="/catalogue"
              className="btn btn-outline-primary btn-sm fw-semibold"
              style={{ borderRadius: '8px' }}
            >
              <i className="bi bi-plus me-1"></i>
              Ajouter un produit
            </Link>
            <Link 
              to="/panier"
              className="btn fw-bold btn-sm"
              style={{
                background: 'linear-gradient(135deg, #e47911 0%, #f0c14b 100%)',
                border: 'none',
                color: '#232f3e',
                borderRadius: '8px'
              }}
            >
              <i className="bi bi-cart me-1"></i>
              Voir le panier
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 