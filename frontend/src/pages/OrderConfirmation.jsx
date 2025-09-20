import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (!location.state) {
      navigate('/');
      return;
    }

    setOrderData(location.state);
  }, [location.state, navigate]);

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
          {/* Message de confirmation */}
          <div className="card border-success">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">
                <i className="bi bi-check-circle-fill me-2"></i>
                Commande confirmée !
              </h4>
            </div>
            <div className="card-body">
              <div className="alert alert-success">
                <h5>Merci pour votre commande !</h5>
                <p className="mb-0">
                  Votre commande <strong>#{orderData.order.orderNumber}</strong> a été confirmée et sera traitée dans les plus brefs délais.
                </p>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <h6><i className="bi bi-info-circle me-2"></i>Informations de la commande</h6>
                  <ul className="list-unstyled">
                    <li><strong>Numéro de commande:</strong> {orderData.order.orderNumber}</li>
                    <li><strong>Date:</strong> {new Date(orderData.order.orderDate).toLocaleDateString('fr-FR')}</li>
                    <li><strong>Statut:</strong> <span className="badge bg-primary">Confirmée</span></li>
                    <li><strong>Total:</strong> {new Intl.NumberFormat('fr-FR').format(orderData.order.total)} GNF</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6><i className="bi bi-person me-2"></i>Informations client</h6>
                  <ul className="list-unstyled">
                    <li><strong>Nom:</strong> {orderData.customer.firstName} {orderData.customer.lastName}</li>
                    <li><strong>Email:</strong> {orderData.customer.email}</li>
                    <li><strong>Téléphone:</strong> {orderData.customer.phone}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Adresse de livraison */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-truck me-2"></i>
                Adresse de livraison
              </h5>
            </div>
            <div className="card-body">
              <address>
                <strong>{orderData.customer.firstName} {orderData.customer.lastName}</strong><br />
                {orderData.customer.address.street}<br />
                {orderData.customer.address.city}, {orderData.customer.address.postalCode}<br />
                {orderData.customer.address.country}
              </address>
            </div>
          </div>

          {/* Produits commandés */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-box me-2"></i>
                Produits commandés
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Prix unitaire</th>
                      <th>Quantité</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="me-3"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div>
                              <h6 className="mb-0">{item.name}</h6>
                            </div>
                          </div>
                        </td>
                        <td>{new Intl.NumberFormat('fr-FR').format(item.price)} GNF</td>
                        <td>{item.quantity}</td>
                        <td><strong>{new Intl.NumberFormat('fr-FR').format(item.price * item.quantity)} GNF</strong></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan="3">Total</th>
                      <th>{new Intl.NumberFormat('fr-FR').format(orderData.order.total)} GNF</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Prochaines étapes */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-clock me-2"></i>
                Prochaines étapes
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-center">
                  <div className="mb-3">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h6>Commande confirmée</h6>
                  <p className="text-muted small">Votre commande a été reçue et confirmée</p>
                </div>
                <div className="col-md-4 text-center">
                  <div className="mb-3">
                    <i className="bi bi-clock text-warning" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h6>Préparation</h6>
                  <p className="text-muted small">Nous préparons votre commande (1-2 jours)</p>
                </div>
                <div className="col-md-4 text-center">
                  <div className="mb-3">
                    <i className="bi bi-truck text-info" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h6>Livraison</h6>
                  <p className="text-muted small">Livraison à votre adresse (2-3 jours)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="text-center mt-4">
            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/chaussures')}
              >
                <i className="bi bi-shop me-2"></i>
                Continuer mes achats
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer me-2"></i>
                Imprimer la commande
              </button>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="card mt-4">
            <div className="card-body text-center">
              <h6><i className="bi bi-telephone me-2"></i>Besoin d'aide ?</h6>
              <p className="mb-0">
                Si vous avez des questions concernant votre commande, n'hésitez pas à nous contacter :
              </p>
              <p className="mb-0">
                <strong>Email:</strong> support@papasow.com | 
                <strong> Téléphone:</strong> +224 XXX XX XX XX
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

