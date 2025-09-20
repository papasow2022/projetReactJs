import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (!location.state) {
      navigate('/cart');
      return;
    }

    setOrderData(location.state);
  }, [location.state, navigate]);

  const handlePayPalPayment = async () => {
    setLoading(true);
    setPaymentStatus('processing');

    try {
      // Simulation du paiement PayPal
      // Dans un vrai projet, vous intégreriez l'API PayPal ici
      
      console.log('💳 Simulation paiement PayPal:', {
        orderNumber: orderData.order.orderNumber,
        total: orderData.order.total
      });

      // Simuler un délai de paiement
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simuler un paiement réussi
      const paymentSuccess = Math.random() > 0.1; // 90% de succès

      if (paymentSuccess) {
        // Mettre à jour le statut de paiement dans la base de données
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        
        const response = await fetch(`${baseUrl}/api/orders/${orderData.order.orderNumber}/payment`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'completed',
            transactionId: `TXN_${Date.now()}`,
            paypalOrderId: `PAYPAL_${Date.now()}`
          })
        });

        if (response.ok) {
          setPaymentStatus('success');
          
          // Vider le panier
          clearCart();
          
          // Rediriger vers la confirmation après 2 secondes
          setTimeout(() => {
            navigate('/order-confirmation', {
              state: {
                order: orderData.order,
                customer: orderData.customer
              }
            });
          }, 2000);
        } else {
          throw new Error('Erreur lors de la mise à jour du paiement');
        }
      } else {
        setPaymentStatus('failed');
      }

    } catch (error) {
      console.error('❌ Erreur paiement:', error);
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">
                <i className="bi bi-credit-card me-2"></i>
                Paiement sécurisé
              </h4>
            </div>
            <div className="card-body">
              {/* Informations de la commande */}
              <div className="alert alert-info">
                <h6><i className="bi bi-info-circle me-2"></i>Commande #{orderData.order.orderNumber}</h6>
                <p className="mb-0">Montant total: <strong>{new Intl.NumberFormat('fr-FR').format(orderData.order.total)} GNF</strong></p>
              </div>

              {/* Statut du paiement */}
              {paymentStatus === 'pending' && (
                <div className="text-center">
                  <div className="mb-4">
                    <i className="bi bi-paypal" style={{ fontSize: '4rem', color: '#0070ba' }}></i>
                    <h5 className="mt-3">Paiement via PayPal</h5>
                    <p className="text-muted">Cliquez sur le bouton ci-dessous pour procéder au paiement sécurisé</p>
                  </div>

                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handlePayPalPayment}
                    disabled={loading}
                  >
                    <i className="bi bi-paypal me-2"></i>
                    Payer avec PayPal
                  </button>

                  <div className="mt-3">
                    <small className="text-muted">
                      <i className="bi bi-shield-check me-1"></i>
                      Paiement 100% sécurisé
                    </small>
                  </div>
                </div>
              )}

              {paymentStatus === 'processing' && (
                <div className="text-center">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Traitement...</span>
                  </div>
                  <h5>Traitement du paiement...</h5>
                  <p className="text-muted">Veuillez patienter, nous traitons votre paiement.</p>
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="text-center">
                  <div className="mb-4">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                    <h5 className="mt-3 text-success">Paiement réussi !</h5>
                    <p className="text-muted">Votre commande a été confirmée. Redirection en cours...</p>
                  </div>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="text-center">
                  <div className="mb-4">
                    <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '4rem' }}></i>
                    <h5 className="mt-3 text-danger">Paiement échoué</h5>
                    <p className="text-muted">Une erreur s'est produite lors du paiement. Veuillez réessayer.</p>
                  </div>
                  
                  <div className="d-flex justify-content-center gap-3">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/checkout')}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Retour à la commande
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handlePayPalPayment}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Réessayer
                    </button>
                  </div>
                </div>
              )}

              {/* Informations de livraison */}
              <div className="mt-4">
                <h6><i className="bi bi-truck me-2"></i>Informations de livraison</h6>
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Nom:</strong> {orderData.customer.firstName} {orderData.customer.lastName}</p>
                    <p><strong>Email:</strong> {orderData.customer.email}</p>
                    <p><strong>Téléphone:</strong> {orderData.customer.phone}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Adresse:</strong></p>
                    <p>
                      {orderData.customer.address.street}<br />
                      {orderData.customer.address.city}, {orderData.customer.address.postalCode}<br />
                      {orderData.customer.address.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Produits commandés */}
              <div className="mt-4">
                <h6><i className="bi bi-box me-2"></i>Produits commandés</h6>
                <div className="list-group">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="list-group-item">
                      <div className="d-flex align-items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="me-3"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-0">{item.name}</h6>
                          <small className="text-muted">Quantité: {item.quantity}</small>
                        </div>
                        <div className="text-end">
                          <strong>{new Intl.NumberFormat('fr-FR').format(item.price * item.quantity)} GNF</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

