import React from 'react';
import { useCart } from '../contexts/CartContext';

const CartSidebarTest = () => {
  const { addToCart, cartItems, clearCart } = useCart();

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
      await addToCart(product);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    }
  };

  const handleAddMultiple = async (product, quantity) => {
    for (let i = 0; i < quantity; i++) {
      await addToCart(product);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Test de l'affichage du sidebar du panier</h3>
      
      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h5>📋 Instructions de test :</h5>
            <ol>
              <li>Ajoutez des produits au panier pour tester l'affichage</li>
              <li>Vérifiez que tous les boutons sont visibles dans le sidebar</li>
              <li>Testez avec différents nombres d'articles</li>
              <li>Vérifiez que le footer reste visible même avec beaucoup d'articles</li>
            </ol>
          </div>
        </div>
      </div>

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
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Actions rapides :</h6>
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-danger"
                      onClick={clearCart}
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
            <h5>✅ Points à vérifier dans le sidebar :</h5>
            <ul>
              <li><strong>Header :</strong> Titre "Panier (X)" et bouton de fermeture</li>
              <li><strong>Articles :</strong> Images, noms, prix, contrôles de quantité</li>
              <li><strong>Footer :</strong> Total, bouton "Passer la commande", bouton "Voir le panier complet"</li>
              <li><strong>Scroll :</strong> Défilement fluide si beaucoup d'articles</li>
              <li><strong>Responsive :</strong> Affichage correct sur mobile</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebarTest; 