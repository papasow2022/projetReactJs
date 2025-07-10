import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function ShoppingCart() {
  const { t } = useLanguage();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Charger les articles du panier depuis localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const stored = localStorage.getItem('cart');
        if (stored) {
          const items = JSON.parse(stored);
          setCartItems(Array.isArray(items) ? items : []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        setCartItems([]);
      }
    };

    loadCart();
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  // Sauvegarder les articles du panier
  const saveCart = (items) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
      setCartItems(items);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du panier:', error);
    }
  };

  // Mettre à jour la quantité d'un article
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item.id === itemId ? { ...item, qty: newQuantity } : item
    );
    saveCart(updatedItems);
  };

  // Supprimer un article
  const removeItem = (itemId) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    saveCart(updatedItems);
  };

  // Appliquer un code promo
  const applyCoupon = () => {
    if (!couponCode.trim()) return;
    
    setIsLoading(true);
    // Simulation de validation du code promo
    setTimeout(() => {
      const validCoupons = {
        'WELCOME10': { discount: 10, type: 'percentage' },
        'SAVE20': { discount: 20, type: 'percentage' },
        'FREESHIP': { discount: 0, type: 'shipping' }
      };
      
      const coupon = validCoupons[couponCode.toUpperCase()];
      if (coupon) {
        setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
      }
      setIsLoading(false);
    }, 1000);
  };

  // Calculer les totaux
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = appliedCoupon?.type === 'percentage' ? (subtotal * appliedCoupon.discount / 100) : 0;
  const shipping = appliedCoupon?.type === 'shipping' ? 0 : (subtotal > 50 ? 0 : 5.99);
  const total = subtotal - discount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-4 shadow-lg border p-5 text-center">
        <div className="mb-4">
          <i className="bi bi-cart-x text-muted" style={{ fontSize: '64px' }}></i>
        </div>
        <h3 className="fw-bold mb-3" style={{ color: '#232f3e' }}>
          Votre panier est vide
        </h3>
        <p className="text-muted mb-4">
          Découvrez nos produits et commencez vos achats
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
          <i className="bi bi-arrow-left me-2"></i>
          Continuer les achats
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Liste des articles */}
        <div className="col-lg-8">
          <div className="bg-white rounded-4 shadow-lg border p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold mb-0" style={{ color: '#232f3e' }}>
                <i className="bi bi-cart3 me-2"></i>
                Panier ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
              </h2>
              <Link 
                to="/catalogue"
                className="btn btn-outline-primary fw-semibold"
                style={{ borderRadius: '8px' }}
              >
                <i className="bi bi-plus me-2"></i>
                Ajouter des articles
              </Link>
            </div>

            {/* Articles du panier */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="border rounded-3 p-3">
                  <div className="row align-items-center">
                    {/* Image du produit */}
                    <div className="col-md-2 col-4">
                      <img 
                        src={item.image || '/assets/images/placeholder.jpg'} 
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                      />
                    </div>
                    
                    {/* Informations du produit */}
                    <div className="col-md-4 col-8">
                      <h6 className="fw-bold mb-1" style={{ color: '#232f3e' }}>
                        {item.name}
                      </h6>
                      <p className="text-muted mb-1" style={{ fontSize: '14px' }}>
                        Référence: {item.id}
                      </p>
                      {item.size && (
                        <span className="badge bg-light text-dark me-2" style={{ fontSize: '12px' }}>
                          Taille: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="badge bg-light text-dark" style={{ fontSize: '12px' }}>
                          Couleur: {item.color}
                        </span>
                      )}
                    </div>
                    
                    {/* Quantité */}
                    <div className="col-md-2 col-6">
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          style={{ borderRadius: '4px 0 0 4px' }}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="number"
                          className="form-control text-center border-start-0 border-end-0"
                          value={item.qty}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          min="1"
                          style={{ width: '60px', fontSize: '14px' }}
                        />
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          style={{ borderRadius: '0 4px 4px 0' }}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                    
                    {/* Prix unitaire */}
                    <div className="col-md-2 col-3 text-center">
                      <span className="fw-semibold" style={{ color: '#232f3e' }}>
                        {item.price.toFixed(2)} €
                      </span>
                    </div>
                    
                    {/* Prix total */}
                    <div className="col-md-1 col-3 text-center">
                      <span className="fw-bold" style={{ color: '#e47911' }}>
                        {(item.price * item.qty).toFixed(2)} €
                      </span>
                    </div>
                    
                    {/* Bouton supprimer */}
                    <div className="col-md-1 col-12 text-end mt-2 mt-md-0">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeItem(item.id)}
                        style={{ borderRadius: '8px' }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code promo */}
          <div className="bg-white rounded-4 shadow-sm border p-4">
            <h5 className="fw-bold mb-3" style={{ color: '#232f3e' }}>
              <i className="bi bi-tag-fill text-success me-2"></i>
              Code promo
            </h5>
            <div className="row">
              <div className="col-md-8">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Entrez votre code promo"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ fontSize: '16px', padding: '12px 16px' }}
                  />
                  <button
                    className="btn btn-primary fw-semibold"
                    onClick={applyCoupon}
                    disabled={isLoading || !couponCode.trim()}
                    style={{ borderRadius: '0 8px 8px 0' }}
                  >
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      'Appliquer'
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {appliedCoupon && (
              <div className="mt-3 p-3 bg-success bg-opacity-10 rounded-3">
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
                {appliedCoupon.type === 'percentage' && (
                  <small className="text-muted">
                    Réduction de {appliedCoupon.discount}% appliquée
                  </small>
                )}
                {appliedCoupon.type === 'shipping' && (
                  <small className="text-muted">
                    Livraison gratuite appliquée
                  </small>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Résumé de la commande */}
        <div className="col-lg-4">
          <div className="bg-white rounded-4 shadow-lg border p-4 sticky-top" style={{ top: '20px' }}>
            <h4 className="fw-bold mb-4" style={{ color: '#232f3e' }}>
              <i className="bi bi-receipt me-2"></i>
              Résumé de la commande
            </h4>

            {/* Détails des prix */}
            <div className="space-y-2 mb-4">
              <div className="d-flex justify-content-between">
                <span className="text-muted">Sous-total ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})</span>
                <span className="fw-semibold">{subtotal.toFixed(2)} €</span>
              </div>
              
              {discount > 0 && (
                <div className="d-flex justify-content-between text-success">
                  <span>Réduction</span>
                  <span className="fw-semibold">-{discount.toFixed(2)} €</span>
                </div>
              )}
              
              <div className="d-flex justify-content-between">
                <span className="text-muted">Livraison</span>
                <span className="fw-semibold">
                  {shipping === 0 ? (
                    <span className="text-success">Gratuit</span>
                  ) : (
                    `${shipping.toFixed(2)} €`
                  )}
                </span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between">
                <span className="fw-bold" style={{ fontSize: '18px', color: '#232f3e' }}>
                  Total
                </span>
                <span className="fw-bold" style={{ fontSize: '18px', color: '#e47911' }}>
                  {total.toFixed(2)} €
                </span>
              </div>
            </div>

            {/* Informations de livraison */}
            <div className="bg-light rounded-3 p-3 mb-4">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-truck text-primary me-2"></i>
                <span className="fw-semibold" style={{ color: '#232f3e' }}>
                  Livraison estimée
                </span>
              </div>
              <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                Livraison gratuite dès 50€ d'achat
                <br />
                Délai de livraison: 2-4 jours ouvrés
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="d-grid gap-2">
              <Link 
                to="/paiement"
                className="btn fw-bold py-3"
                style={{
                  background: 'linear-gradient(135deg, #e47911 0%, #f0c14b 100%)',
                  border: 'none',
                  color: '#232f3e',
                  fontSize: '18px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(228, 121, 17, 0.3)'
                }}
              >
                <i className="bi bi-credit-card me-2"></i>
                Procéder au paiement
              </Link>
              
              <Link 
                to="/catalogue"
                className="btn btn-outline-primary fw-semibold py-2"
                style={{ borderRadius: '8px' }}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Continuer les achats
              </Link>
            </div>

            {/* Sécurité */}
            <div className="mt-4 pt-3 border-top">
              <div className="d-flex align-items-center text-muted" style={{ fontSize: '14px' }}>
                <i className="bi bi-shield-check text-success me-2"></i>
                Paiement sécurisé SSL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 