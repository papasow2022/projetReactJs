import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import useOrders from '../hooks/useOrders';

const CartIntegrationTest = () => {
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getCartTotal,
    getCartItemCount,
    syncCart,
    loadCart,
    isUserLoggedIn,
    cartId,
    isLoading
  } = useCart();

  const { 
    createOrder, 
    getOrders, 
    loading: ordersLoading 
  } = useOrders();

  const [testResults, setTestResults] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isRunningTest, setIsRunningTest] = useState(false);

  // Test de synchronisation du panier
  const testCartSync = async () => {
    setIsRunningTest(true);
    const results = [];

    try {
      // Test 1: Ajouter un produit de test
      const testProduct = {
        id: 'test-product-1',
        name: 'Produit de test',
        price: 10000,
        image: '/assets/categorie/arriver (1).png',
        category: 'homme',
        subcategory: 'homme'
      };

      results.push('🔄 Test 1: Ajout d\'un produit de test...');
      const addResult = await addToCart(testProduct, 2);
      if (addResult.success) {
        results.push('✅ Produit ajouté avec succès');
      } else {
        results.push(`❌ Erreur: ${addResult.message}`);
      }

      // Test 2: Vérifier la synchronisation
      results.push('🔄 Test 2: Synchronisation du panier...');
      await syncCart();
      results.push('✅ Synchronisation terminée');

      // Test 3: Mettre à jour la quantité
      results.push('🔄 Test 3: Mise à jour de la quantité...');
      await updateQuantity('test-product-1', 3);
      results.push('✅ Quantité mise à jour');

      // Test 4: Vérifier le total
      results.push('🔄 Test 4: Vérification du total...');
      const total = getCartTotal();
      const count = getCartItemCount();
      results.push(`✅ Total: ${total.toLocaleString()} GNF, Articles: ${count}`);

      // Test 5: Créer une commande de test
      if (isUserLoggedIn) {
        results.push('🔄 Test 5: Création d\'une commande de test...');
        try {
          const orderData = {
            paymentMethod: 'credit_card',
            shippingAddress: {
              fullName: 'Test User',
              address: '123 Test Street',
              city: 'Conakry',
              postalCode: '001',
              country: 'Guinée',
              phone: '+224123456789'
            },
            billingAddress: {
              fullName: 'Test User',
              address: '123 Test Street',
              city: 'Conakry',
              postalCode: '001',
              country: 'Guinée',
              phone: '+224123456789'
            },
            notes: 'Commande de test',
            discount: 0,
            shipping: 5000
          };

          const orderResult = await createOrder(orderData);
          if (orderResult.success) {
            results.push(`✅ Commande créée: ${orderResult.order.orderNumber}`);
          } else {
            results.push(`❌ Erreur commande: ${orderResult.error}`);
          }
        } catch (error) {
          results.push(`❌ Erreur commande: ${error.message}`);
        }
      } else {
        results.push('⚠️ Utilisateur non connecté - Test de commande ignoré');
      }

      // Test 6: Charger les commandes
      if (isUserLoggedIn) {
        results.push('🔄 Test 6: Chargement des commandes...');
        try {
          const ordersResult = await getOrders(5);
          if (ordersResult.success) {
            setOrders(ordersResult.orders);
            results.push(`✅ ${ordersResult.orders.length} commandes chargées`);
          } else {
            results.push(`❌ Erreur chargement commandes: ${ordersResult.error}`);
          }
        } catch (error) {
          results.push(`❌ Erreur chargement commandes: ${error.message}`);
        }
      }

    } catch (error) {
      results.push(`❌ Erreur générale: ${error.message}`);
    } finally {
      setIsRunningTest(false);
      setTestResults(results);
    }
  };

  // Charger les commandes au démarrage
  useEffect(() => {
    if (isUserLoggedIn) {
      loadOrders();
    }
  }, [isUserLoggedIn]);

  const loadOrders = async () => {
    try {
      const result = await getOrders(10);
      if (result.success) {
        setOrders(result.orders);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    }
  };

  const formatGNF = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' GNF';
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">
                <i className="bi bi-bug me-2"></i>
                Test d'intégration Panier - Base de données
              </h4>
            </div>
            <div className="card-body">
              {/* Informations de statut */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="alert alert-info">
                    <h6>Statut de connexion</h6>
                    <p className="mb-0">
                      <i className={`bi bi-${isUserLoggedIn ? 'check-circle text-success' : 'x-circle text-danger'} me-2`}></i>
                      {isUserLoggedIn ? 'Utilisateur connecté' : 'Utilisateur non connecté'}
                    </p>
                    {cartId && (
                      <p className="mb-0">
                        <i className="bi bi-database me-2"></i>
                        ID Panier: {cartId}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="alert alert-secondary">
                    <h6>État du panier</h6>
                    <p className="mb-0">
                      Articles: {getCartItemCount()} | Total: {formatGNF(getCartTotal())}
                    </p>
                  </div>
                </div>
              </div>

              {/* Boutons de test */}
              <div className="mb-4">
                <button 
                  className="btn btn-primary me-2"
                  onClick={testCartSync}
                  disabled={isRunningTest || isLoading}
                >
                  {isRunningTest ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Test en cours...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-play-circle me-2"></i>
                      Lancer le test complet
                    </>
                  )}
                </button>
                
                <button 
                  className="btn btn-outline-secondary me-2"
                  onClick={syncCart}
                  disabled={isLoading}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Synchroniser le panier
                </button>

                <button 
                  className="btn btn-outline-danger"
                  onClick={clearCart}
                >
                  <i className="bi bi-trash me-2"></i>
                  Vider le panier
                </button>
              </div>

              {/* Résultats des tests */}
              {testResults.length > 0 && (
                <div className="mb-4">
                  <h6>Résultats des tests</h6>
                  <div className="bg-light p-3 rounded" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {testResults.map((result, index) => (
                      <div key={index} className="mb-1">
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles du panier */}
              <div className="mb-4">
                <h6>Articles du panier ({cartItems.length})</h6>
                {cartItems.length === 0 ? (
                  <p className="text-muted">Aucun article dans le panier</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Produit</th>
                          <th>Prix</th>
                          <th>Quantité</th>
                          <th>Total</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  className="me-2 rounded"
                                />
                                <div>
                                  <div className="fw-bold">{item.name}</div>
                                  <small className="text-muted">
                                    {item.color && `Couleur: ${item.color}`}
                                    {item.color && item.size && ' | '}
                                    {item.size && `Taille: ${item.size}`}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>{formatGNF(item.price)}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <button 
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => updateQuantity(item.id || item.productId, item.qty - 1)}
                                  disabled={item.qty <= 1}
                                >
                                  <i className="bi bi-dash"></i>
                                </button>
                                <span className="mx-2">{item.qty}</span>
                                <button 
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => updateQuantity(item.id || item.productId, item.qty + 1)}
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </td>
                            <td>{formatGNF(item.price * item.qty)}</td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeFromCart(item.id || item.productId)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Commandes */}
              {isUserLoggedIn && (
                <div>
                  <h6>Commandes récentes ({orders.length})</h6>
                  {ordersLoading ? (
                    <div className="text-center">
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Chargement des commandes...
                    </div>
                  ) : orders.length === 0 ? (
                    <p className="text-muted">Aucune commande trouvée</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>N° Commande</th>
                            <th>Date</th>
                            <th>Statut</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order._id}>
                              <td>{order.orderNumber}</td>
                              <td>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                              <td>
                                <span className={`badge ${
                                  order.status === 'delivered' ? 'bg-success' :
                                  order.status === 'pending' ? 'bg-warning' :
                                  order.status === 'cancelled' ? 'bg-danger' :
                                  'bg-info'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td>{formatGNF(order.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartIntegrationTest;
