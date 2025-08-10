import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNotifications } from '../contexts/NotificationContext';

const CartPageTest = () => {
  const { addToCart, cartItems, clearCart } = useCart();
  const { addNotification } = useNotifications();

  const testProducts = [
    {
      id: 'test-1',
      nom: 'Nike Air Max 270',
      prix: 129.99,
      image: '/assets/categorie/arriver (1).png',
      vendeur: 'Nike Store',
      stock: 10,
      type: 'daily-deal',
      size: '42',
      color: 'Noir'
    },
    {
      id: 'test-2',
      nom: 'Adidas Ultraboost 22',
      prix: 149.99,
      image: '/assets/categorie/arriver (2).png',
      vendeur: 'Adidas Store',
      stock: 5,
      type: 'daily-deal',
      size: '41',
      color: 'Bleu'
    },
    {
      id: 'test-3',
      nom: 'Puma RS-X',
      prix: 89.99,
      image: '/assets/categorie/arriver (3).png',
      vendeur: 'Puma Store',
      stock: 15,
      type: 'daily-deal',
      size: '43',
      color: 'Blanc'
    },
    {
      id: 'test-4',
      nom: 'New Balance 574',
      prix: 79.99,
      image: '/assets/categorie/arriver (4).png',
      vendeur: 'New Balance Store',
      stock: 8,
      type: 'product',
      size: '40',
      color: 'Gris'
    }
  ];

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      addNotification(`${product.nom} ajouté au panier`, 'success');
    } catch (error) {
      addNotification('Erreur lors de l\'ajout au panier', 'error');
    }
  };

  const handleAddMultiple = async (product, quantity) => {
    for (let i = 0; i < quantity; i++) {
      await addToCart(product);
    }
    addNotification(`${quantity}x ${product.nom} ajouté(s) au panier`, 'success');
  };

  const handleClearCart = () => {
    clearCart();
    addNotification('Panier vidé', 'info');
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Test du système de panier complet Amazon-like</h3>
      
      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h5>📋 Instructions de test :</h5>
            <ol>
              <li>Ajoutez des produits au panier pour tester l'affichage</li>
              <li>Testez les codes promo : WELCOME10, SAVE20, FREESHIP, FLASH25</li>
              <li>Vérifiez la fonctionnalité "Sauvegarder pour plus tard"</li>
              <li>Testez la gestion des quantités</li>
              <li>Vérifiez les recommandations quand le panier est vide</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="row">
        {testProducts.map((product) => (
          <div key={product.id} className="col-md-6 col-lg-3 mb-3">
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
                <p className="text-muted small">Taille: {product.size} | Couleur: {product.color}</p>
                {product.type === 'daily-deal' && (
                  <span className="badge bg-warning text-dark mb-2">Offre du jour</span>
                )}
                
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-warning"
                    onClick={() => handleAddToCart(product)}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Ajouter 1
                  </button>
                  <button 
                    className="btn btn-outline-warning"
                    onClick={() => handleAddMultiple(product, 3)}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Ajouter 3
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Actions de test</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>État actuel du panier :</h6>
                  <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Nombre d'articles :</span>
                      <span className="badge bg-primary">{cartItems.length}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Total d'articles :</span>
                      <span className="badge bg-success">
                        {cartItems.reduce((sum, item) => sum + item.qty, 0)}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Total en GNF :</span>
                      <span className="badge bg-info">
                        {cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString('fr-FR')} GNF
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Actions rapides :</h6>
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-danger"
                      onClick={handleClearCart}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Vider le panier
                    </button>
                    <button 
                      className="btn btn-outline-info"
                      onClick={() => {
                        testProducts.forEach(product => handleAddMultiple(product, 2));
                      }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Ajouter 2 de chaque
                    </button>
                    <a 
                      href="/panier" 
                      className="btn btn-warning"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-cart me-2"></i>
                      Voir la page panier
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-success">
            <h5>✅ Fonctionnalités testées :</h5>
            <ul>
              <li><strong>Page panier moderne :</strong> Interface Amazon-like avec design responsive</li>
              <li><strong>Gestion des articles :</strong> Ajout, suppression, modification des quantités</li>
              <li><strong>Codes promo :</strong> WELCOME10, SAVE20, FREESHIP, FLASH25</li>
              <li><strong>Sauvegarder pour plus tard :</strong> Fonctionnalité wishlist intégrée</li>
              <li><strong>Recommandations :</strong> Suggestions quand le panier est vide</li>
              <li><strong>Résumé de commande :</strong> Calculs automatiques et sticky</li>
              <li><strong>Responsive design :</strong> Adaptation mobile/desktop</li>
              <li><strong>Animations :</strong> Transitions fluides et hover effects</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-warning">
            <h5>🎯 Codes promo de test :</h5>
            <div className="row">
              <div className="col-md-3">
                <strong>WELCOME10</strong> - 10% de réduction
              </div>
              <div className="col-md-3">
                <strong>SAVE20</strong> - 20% de réduction
              </div>
              <div className="col-md-3">
                <strong>FREESHIP</strong> - Livraison gratuite
              </div>
              <div className="col-md-3">
                <strong>FLASH25</strong> - 25% de réduction flash
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageTest; 