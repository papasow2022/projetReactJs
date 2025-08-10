import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNotifications } from '../contexts/NotificationContext';

const CartTest = () => {
  const { addToCart, cartItems, getCartItemCount, getCartTotal } = useCart();
  const { addNotification } = useNotifications();

  const testProducts = [
    {
      id: 'test-1',
      nom: 'Nike Air Max 270',
      prix: 129.99,
      image: '/assets/categorie/arriver (1).png',
      vendeur: 'Nike Store',
      stock: 10,
      type: 'daily-deal'
    },
    {
      id: 'test-2',
      nom: 'Adidas Ultraboost 22',
      prix: 149.99,
      image: '/assets/categorie/arriver (2).png',
      vendeur: 'Adidas Store',
      stock: 5,
      type: 'daily-deal'
    },
    {
      id: 'test-3',
      nom: 'Puma RS-X',
      prix: 89.99,
      image: '/assets/categorie/arriver (3).png',
      vendeur: 'Puma Store',
      stock: 15,
      type: 'daily-deal'
    }
  ];

  const handleAddToCart = async (product) => {
    try {
      const result = await addToCart(product);
      if (result.success) {
        addNotification(
          `${product.nom} ajouté au panier`,
          'success',
          { 
            details: `Prix: ${product.prix.toLocaleString('fr-FR')} GNF`,
            action: 'Voir le panier'
          }
        );
      } else {
        addNotification('Erreur lors de l\'ajout au panier', 'error');
      }
    } catch (error) {
      addNotification('Erreur lors de l\'ajout au panier', 'error');
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Test de l'ajout au panier (Logique Amazon)</h3>
      
      <div className="row">
        {testProducts.map((product) => (
          <div key={product.id} className="col-md-4 mb-3">
            <div className="card h-100">
              <img 
                src={product.image} 
                alt={product.nom}
                className="card-img-top p-3"
                style={{ height: 200, objectFit: 'contain' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.nom}</h5>
                <p className="text-danger fw-bold">{product.prix.toLocaleString('fr-FR')} GNF</p>
                <p className="text-muted small">Vendu par {product.vendeur}</p>
                <p className="text-muted small">Stock: {product.stock}</p>
                <button 
                  className="btn btn-warning w-100"
                  onClick={() => handleAddToCart(product)}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>État du panier</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <strong>Nombre d'articles:</strong> {getCartItemCount()}
                </div>
                <div className="col-md-4">
                  <strong>Total:</strong> {getCartTotal().toLocaleString('fr-FR')} GNF
                </div>
                <div className="col-md-4">
                  <strong>Articles dans le panier:</strong> {cartItems.length}
                </div>
              </div>
              
              {cartItems.length > 0 && (
                <div className="mt-3">
                  <h6>Articles dans le panier:</h6>
                  <ul className="list-group">
                    {cartItems.map((item) => (
                      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{item.name}</strong>
                          <br />
                          <small className="text-muted">{item.price.toLocaleString('fr-FR')} GNF</small>
                        </div>
                        <span className="badge bg-primary rounded-pill">Qty: {item.qty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h5>✅ Fonctionnalités testées :</h5>
            <ul>
              <li>Ajout au panier avec animation</li>
              <li>Ouverture automatique du sidebar</li>
              <li>Gestion des quantités</li>
              <li>Notifications de succès/erreur</li>
              <li>Persistance dans localStorage</li>
              <li>Compteur d'articles dans le header</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTest; 