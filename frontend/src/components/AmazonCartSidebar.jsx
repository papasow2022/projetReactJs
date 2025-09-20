import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './AmazonCartSidebar.css';

const AmazonCartSidebar = () => {
  const { 
    cartItems, 
    showCartSidebar, 
    setShowCartSidebar, 
    removeFromCart, 
    updateQuantity,
    getCartTotal,
    getCartItemCount
  } = useCart();
  
  const navigate = useNavigate();

  const handleClose = () => {
    setShowCartSidebar(false);
  };

  const handleGoToCart = () => {
    setShowCartSidebar(false);
    navigate('/panier');
  };

  const handleCheckout = () => {
    setShowCartSidebar(false);
    navigate('/paiement');
  };

  if (!showCartSidebar) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style={{ zIndex: 1040 }}
        onClick={handleClose}
      ></div>
      
      {/* Sidebar */}
      <div 
        className="position-fixed top-0 end-0 h-100 bg-white shadow-lg amazon-cart-sidebar"
        style={{ 
          width: '400px', 
          zIndex: 1050,
          backgroundColor: '#ffffff',
          transform: showCartSidebar ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom sidebar-header">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-cart3 me-2"></i>
            Panier ({getCartItemCount()})
          </h5>
          <button 
            className="btn btn-link text-dark p-0"
            onClick={handleClose}
          >
            <i className="bi bi-x-lg fs-4"></i>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow-1 overflow-auto sidebar-content" style={{ minHeight: 0 }}>
                      {cartItems.length === 0 ? (
              <div className="cart-empty-state">
                <i className="bi bi-cart3"></i>
                <h6>Votre panier est vide</h6>
                <p>Ajoutez des produits pour commencer vos achats</p>
              </div>
          ) : (
            <div className="p-3">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.color || 'default'}-${item.size || 'default'}-${index}`} className="card mb-3 border-0 shadow-sm cart-item-card">
                  <div className="card-body p-3">
                    <div className="row">
                      <div className="col-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="img-fluid rounded cart-item-image"
                          style={{ height: '60px', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="col-9">
                        <h6 className="card-title mb-1 fw-bold" style={{ fontSize: '0.9rem' }}>
                          {item.name}
                        </h6>
                        {(item.color || item.size) && (
                          <p className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>
                            {item.color && `Couleur: ${item.color}`}
                            {item.color && item.size && ' | '}
                            {item.size && `Taille: ${item.size}`}
                          </p>
                        )}
                        {cartItems.length > 1 && (
                          <p className="text-danger fw-bold mb-1">
                            {item.price.toLocaleString('fr-FR')} GNF
                          </p>
                        )}
                        <div className="d-flex justify-content-between align-items-center">
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
                              onChange={(e) => {
                                const raw = parseInt(e.target.value, 10);
                                const min = 1;
                                const max = Math.max(1, Number(item.stock ?? 1));
                                const next = isNaN(raw) ? min : Math.min(Math.max(raw, min), max);
                                if (next !== item.qty) updateQuantity(item.id, next);
                              }}
                              min={1}
                              max={Math.max(1, Number(item.stock ?? 1))}
                              style={{ fontSize: '0.8rem' }}
                            />
                            <button 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => updateQuantity(item.id, item.qty + 1)}
                              disabled={Number(item.stock ?? 0) <= item.qty}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                          <button 
                            className="btn btn-link text-danger p-0"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-top p-3 mt-auto sidebar-footer">
          {cartItems.length > 0 ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">{cartItems.length === 1 ? 'Prix :' : 'Total :'}</span>
                <span className="fw-bold text-danger fs-5">
                  {getCartTotal().toLocaleString('fr-FR')} GNF
                </span>
              </div>
              
              <div className="d-grid gap-2 cart-action-buttons">
                <button 
                  className="btn btn-warning fw-bold"
                  onClick={handleCheckout}
                >
                  <i className="bi bi-credit-card me-2"></i>
                  Passer la commande
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={handleGoToCart}
                >
                  <i className="bi bi-cart me-2"></i>
                  Voir le panier complet
                </button>
              </div>
              
              <div className="mt-3 p-2 bg-light rounded shipping-info">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Livraison gratuite à partir de 50 000 GNF
                </small>
              </div>
            </>
          ) : (
            <div className="text-center">
              <button 
                className="btn btn-outline-secondary"
                onClick={handleClose}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Continuer les achats
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AmazonCartSidebar; 