import React from 'react';

const formatGNF = (amount) => amount ? new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' GNF' : '0 GNF';

const CartSidebar = ({ isOpen, onClose, cartItems, onGoToCart, onUpdateQty, onRemoveItem }) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: isOpen ? 0 : '-400px',
        width: 360,
        height: '100vh',
        background: '#fff',
        boxShadow: '-2px 0 16px rgba(0,0,0,0.15)',
        zIndex: 2000,
        transition: 'right 0.3s',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="mb-0">Votre panier</h5>
        <button className="btn btn-link text-danger fs-4" onClick={onClose}>&times;</button>
      </div>
      {/* Sous-total tout en haut - affiché seulement s'il y a plusieurs articles */}
      {cartItems.length > 1 && (
        <div className="px-3 py-2 border-bottom bg-light">
          <span className="fw-bold">Sous-total ({cartItems.reduce((sum, item) => sum + item.qty, 0)} articles) : </span>
          <span className="fw-bold text-danger">{formatGNF(total)}</span>
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {cartItems.length === 0 ? (
          <div className="text-center text-muted mt-5">Votre panier est vide.</div>
        ) : (
          cartItems.map((item, idx) => (
            <div key={idx} className="d-flex align-items-center mb-3 border-bottom pb-2 position-relative">
              <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, marginRight: 12 }} />
              <div style={{ flex: 1 }}>
                <div className="fw-bold" style={{ fontSize: 15 }}>{item.name}</div>
                <div className="text-muted" style={{ fontSize: 13 }}>Taille : {item.size} | Couleur : {item.color}</div>
                <div className="d-flex align-items-center mt-1 gap-2">
                  <button className="btn btn-sm btn-outline-secondary px-2 py-0" style={{ fontSize: 18 }} onClick={() => onUpdateQty(idx, item.qty - 1)} disabled={item.qty <= 1}>-</button>
                  <span className="badge bg-light text-dark">{item.qty}</span>
                  <button className="btn btn-sm btn-outline-secondary px-2 py-0" style={{ fontSize: 18 }} onClick={() => onUpdateQty(idx, item.qty + 1)}>+</button>
                </div>
              </div>
              <div className="fw-bold text-danger ms-2">
                {cartItems.length === 1 ? formatGNF(item.price) : formatGNF(item.price * item.qty)}
              </div>
              <button className="btn btn-link text-danger position-absolute top-0 end-0" style={{ fontSize: 20 }} onClick={() => onRemoveItem(idx)} title="Supprimer">
                <i className="bi bi-trash"></i>
              </button>
            </div>
          ))
        )}
      </div>
      <div className="border-top p-3">
        <button className="btn btn-primary w-100 fw-bold" onClick={onGoToCart} disabled={cartItems.length === 0}>
          Aller au panier
        </button>
      </div>
    </div>
  );
};

export default CartSidebar; 