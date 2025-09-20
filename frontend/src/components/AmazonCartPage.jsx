import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useNotifications } from '../contexts/NotificationContext';
import './AmazonCartPage.css';

const AmazonCartPage = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCartItemCount,
    clearCart 
  } = useCart();
  
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isLoadingCoupon, setIsLoadingCoupon] = useState(false);
  const [savedForLater, setSavedForLater] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Charger les recommandations
  useEffect(() => {
    // Simuler des recommandations basées sur le panier
    const mockRecommendations = [
      {
        id: 'rec-1',
        name: 'Nike Air Max 270',
        price: 129.99,
        image: '/assets/categorie/arriver (1).png',
        rating: 4.5,
        reviewCount: 1247,
        badge: 'Populaire'
      },
      {
        id: 'rec-2',
        name: 'Adidas Ultraboost 22',
        price: 149.99,
        image: '/assets/categorie/arriver (2).png',
        rating: 4.3,
        reviewCount: 892,
        badge: 'Nouveau'
      },
      {
        id: 'rec-3',
        name: 'Puma RS-X',
        price: 89.99,
        image: '/assets/categorie/arriver (3).png',
        rating: 4.1,
        reviewCount: 567,
        badge: 'Promo'
      }
    ];
    setRecommendations(mockRecommendations);
  }, []);

  // Appliquer un code promo
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsLoadingCoupon(true);
    try {
      // Simuler une validation de code promo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const validCoupons = {
        'WELCOME10': { discount: 10, type: 'percentage', description: '10% de réduction' },
        'SAVE20': { discount: 20, type: 'percentage', description: '20% de réduction' },
        'FREESHIP': { discount: 0, type: 'shipping', description: 'Livraison gratuite' },
        'FLASH25': { discount: 25, type: 'percentage', description: '25% de réduction flash' }
      };
      
      const coupon = validCoupons[couponCode.toUpperCase()];
      if (coupon) {
        setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
        addNotification(`Code ${couponCode.toUpperCase()} appliqué !`, 'success');
      } else {
        addNotification('Code promo invalide', 'error');
      }
    } catch (error) {
      addNotification('Erreur lors de l\'application du code', 'error');
    } finally {
      setIsLoadingCoupon(false);
    }
  };

  // Sauvegarder pour plus tard
  const saveForLater = (item) => {
    setSavedForLater(prev => [...prev, item]);
    removeFromCart(item.id);
    addNotification(`${item.name} sauvegardé pour plus tard`, 'success');
  };

  // Déplacer vers le panier
  const moveToCart = (item) => {
    // Ici on utiliserait addToCart du contexte
    setSavedForLater(prev => prev.filter(i => i.id !== item.id));
    addNotification(`${item.name} déplacé vers le panier`, 'success');
  };

  // Calculer les totaux
  const subtotal = getCartTotal();
  const discount = appliedCoupon?.type === 'percentage' ? (subtotal * appliedCoupon.discount / 100) : 0;
  const shipping = appliedCoupon?.type === 'shipping' ? 0 : (subtotal > 50000 ? 0 : 5000);
  const total = subtotal - discount + shipping;

  const formatGNF = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' GNF';
  };

  // Rendre les étoiles
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className={`bi bi-star${i < Math.floor(rating) ? '-fill' : ''}${i === Math.floor(rating) && rating % 1 > 0 ? '-half' : ''}`}
        style={{ color: i < rating ? '#ffc107' : '#e4e5e9' }}
      ></i>
    ));
  };

  if (cartItems.length === 0) {
    return (
      <div className="amazon-cart-page">
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-12">
              <div className="empty-cart-container">
                <div className="empty-cart-content">
                  <div className="empty-cart-icon">
                    <i className="bi bi-cart3"></i>
                  </div>
                  <h2 className="empty-cart-title">Votre panier Amazon est vide</h2>
                  <p className="empty-cart-subtitle">
                    Consultez les recommandations ci-dessous ou continuez vos achats
                  </p>
                  
                  <div className="empty-cart-actions">
                    <Link to="/catalogue" className="btn btn-warning btn-lg">
                      <i className="bi bi-arrow-left me-2"></i>
                      Continuer les achats
                    </Link>
                    <Link to="/offres-du-jour" className="btn btn-outline-secondary btn-lg">
                      <i className="bi bi-lightning me-2"></i>
                      Voir les offres du jour
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recommandations */}
              {recommendations.length > 0 && (
                <div className="recommendations-section">
                  <h3 className="recommendations-title">
                    <i className="bi bi-lightbulb me-2"></i>
                    Recommandations pour vous
                  </h3>
                  <div className="row">
                    {recommendations.map((item) => (
                      <div key={item.id} className="col-md-4 col-lg-3 mb-3">
                        <div className="recommendation-card">
                          <div className="recommendation-image">
                            <img src={item.image} alt={item.name} />
                            {item.badge && (
                              <span className="recommendation-badge">{item.badge}</span>
                            )}
                          </div>
                          <div className="recommendation-content">
                            <h6 className="recommendation-name">{item.name}</h6>
                            <div className="recommendation-rating">
                              {renderStars(item.rating)}
                              <span className="recommendation-review-count">
                                ({item.reviewCount})
                              </span>
                            </div>
                            <div className="recommendation-price">
                              <span className="price-current">{formatGNF(item.price)}</span>
                            </div>
                            <button className="btn btn-warning btn-sm w-100">
                              <i className="bi bi-cart-plus me-2"></i>
                              Ajouter au panier
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="amazon-cart-page">
      <div className="container-fluid py-4">
        <div className="row">
          {/* Colonne principale */}
          <div className="col-lg-8">
            {/* En-tête du panier */}
            <div className="cart-header">
              <h1 className="cart-title">
                <i className="bi bi-cart3 me-2"></i>
                Panier ({getCartItemCount()} article{getCartItemCount() > 1 ? 's' : ''})
              </h1>
              <div className="cart-actions">
                <button 
                  className="btn btn-link text-decoration-none"
                  onClick={() => clearCart()}
                >
                  <i className="bi bi-trash me-1"></i>
                  Vider le panier
                </button>
                <Link to="/catalogue" className="btn btn-link text-decoration-none">
                  <i className="bi bi-plus me-1"></i>
                  Ajouter des articles
                </Link>
              </div>
            </div>

            {/* Articles du panier */}
            <div className="cart-items-section">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="cart-item-details">
                    <div className="cart-item-info">
                      <h5 className="cart-item-name">{item.name}</h5>
                      <div className="cart-item-meta">
                        <span className="cart-item-seller">Vendu par {item.seller || 'Amazon'}</span>
                        {item.type === 'daily-deal' && (
                          <span className="cart-item-badge">Offre du jour</span>
                        )}
                      </div>
                      <div className="cart-item-variants">
                        {item.size && <span className="variant-tag">Taille: {item.size}</span>}
                        {item.color && <span className="variant-tag">Couleur: {item.color}</span>}
                      </div>
                    </div>
                    
                    <div className="cart-item-price">
                      <span className="price-current">{formatGNF(item.price)}</span>
                    </div>
                    
                    <div className="cart-item-quantity">
                      <div className="quantity-controls">
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          disabled={item.qty <= 1}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input 
                          type="number" 
                          className="form-control text-center"
                          value={item.qty}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          min="1"
                        />
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="cart-item-total">
                      <span className="total-amount">{formatGNF(item.price * item.qty)}</span>
                    </div>
                    
                    <div className="cart-item-actions">
                      <button 
                        className="btn btn-link btn-sm"
                        onClick={() => saveForLater(item)}
                      >
                        <i className="bi bi-bookmark me-1"></i>
                        Sauvegarder
                      </button>
                      <button 
                        className="btn btn-link btn-sm text-danger"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Code promo */}
            <div className="coupon-section">
              <h4 className="coupon-title">
                <i className="bi bi-tag-fill text-success me-2"></i>
                Code promo
              </h4>
              <div className="coupon-form">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Entrez votre code promo"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    className="btn btn-warning"
                    onClick={applyCoupon}
                    disabled={isLoadingCoupon || !couponCode.trim()}
                  >
                    {isLoadingCoupon ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      'Appliquer'
                    )}
                  </button>
                </div>
                
                {appliedCoupon && (
                  <div className="coupon-applied">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        <span className="fw-semibold text-success">
                          Code {appliedCoupon.code} appliqué
                        </span>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setAppliedCoupon(null)}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                    <small className="text-muted">{appliedCoupon.description}</small>
                  </div>
                )}
              </div>
            </div>

            {/* Sauvegardé pour plus tard */}
            {savedForLater.length > 0 && (
              <div className="saved-for-later-section">
                <h4 className="saved-title">
                  <i className="bi bi-bookmark me-2"></i>
                  Sauvegardé pour plus tard ({savedForLater.length})
                </h4>
                <div className="saved-items">
                  {savedForLater.map((item) => (
                    <div key={item.id} className="saved-item">
                      <div className="saved-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="saved-item-details">
                        <h6 className="saved-item-name">{item.name}</h6>
                        <div className="saved-item-price">{formatGNF(item.price)}</div>
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => moveToCart(item)}
                        >
                          <i className="bi bi-cart-plus me-1"></i>
                          Déplacer vers le panier
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colonne latérale - Résumé */}
          <div className="col-lg-4">
            <div className="cart-summary">
              <h4 className="summary-title">
                <i className="bi bi-receipt me-2"></i>
                Résumé de la commande
              </h4>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Sous-total ({getCartItemCount()} article{getCartItemCount() > 1 ? 's' : ''})</span>
                  <span>{formatGNF(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="summary-row text-success">
                    <span>Réduction</span>
                    <span>-{formatGNF(discount)}</span>
                  </div>
                )}
                
                <div className="summary-row">
                  <span>Livraison</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-success">Gratuit</span>
                    ) : (
                      formatGNF(shipping)
                    )}
                  </span>
                </div>
                
                <hr />
                
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>{formatGNF(total)}</span>
                </div>
              </div>

              {/* Informations de livraison */}
              <div className="shipping-info">
                <div className="shipping-header">
                  <i className="bi bi-truck text-primary me-2"></i>
                  <span className="fw-semibold">Livraison estimée</span>
                </div>
                <p className="shipping-details">
                  Livraison gratuite dès 50 000 GNF d'achat
                  <br />
                  Délai de livraison: 2-4 jours ouvrés
                </p>
              </div>

              {/* Boutons d'action */}
              <div className="summary-actions">
                <button 
                  className="btn btn-warning btn-lg w-100 mb-2"
                  onClick={() => navigate('/checkout')}
                >
                  <i className="bi bi-credit-card me-2"></i>
                  Passer la commande
                </button>
                
                <Link 
                  to="/catalogue"
                  className="btn btn-outline-secondary w-100"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Continuer les achats
                </Link>
              </div>

              {/* Sécurité */}
              <div className="security-info">
                <div className="d-flex align-items-center">
                  <i className="bi bi-shield-check text-success me-2"></i>
                  <span className="text-muted">Paiement sécurisé SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmazonCartPage; 