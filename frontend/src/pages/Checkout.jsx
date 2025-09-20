import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../amazon-like.css';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'Guinée'
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });

  // Calculer le récapitulatif de la commande
  useEffect(() => {
    const subtotal = getCartTotal();
    const shipping = subtotal > 500000 ? 0 : 25000; // Livraison gratuite au-dessus de 500,000 GNF
    const tax = Math.round(subtotal * 0.15); // TVA 15%
    const total = subtotal + shipping + tax;

    setOrderSummary({
      subtotal,
      shipping,
      tax,
      total
    });
  }, [cartItems, getCartTotal]);

  // Rediriger si le panier est vide
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation des champs requis
    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
    if (!formData.email.trim()) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis';
    if (!formData.address.street.trim()) newErrors['address.street'] = 'Adresse requise';
    if (!formData.address.city.trim()) newErrors['address.city'] = 'Ville requise';
    if (!formData.address.postalCode.trim()) newErrors['address.postalCode'] = 'Code postal requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      
      // Créer la commande
      const orderData = {
        customer: formData,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.qty
        })),
        shipping: orderSummary.shipping,
        tax: orderSummary.tax,
        notes: 'Commande depuis le site web'
      };

      const response = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Commande créée:', result.order);
        
        // Rediriger vers la page de paiement PayPal
        navigate('/payment', {
          state: {
            order: result.order,
            customer: formData,
            items: cartItems,
            orderSummary
          }
        });
      } else {
        throw new Error(result.message || 'Erreur lors de la création de la commande');
      }

    } catch (error) {
      console.error('❌ Erreur création commande:', error);
      alert('Erreur lors de la création de la commande: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <h2>Votre panier est vide</h2>
          <p>Ajoutez des produits avant de passer commande.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/chaussures')}
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">
                <i className="bi bi-person me-2"></i>
                Informations de livraison
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">Prénom *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">Nom *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">Téléphone *</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="address.street" className="form-label">Adresse *</label>
                  <input
                    type="text"
                    className={`form-control ${errors['address.street'] ? 'is-invalid' : ''}`}
                    id="address.street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="Rue, numéro, quartier"
                    required
                  />
                  {errors['address.street'] && <div className="invalid-feedback">{errors['address.street']}</div>}
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="address.city" className="form-label">Ville *</label>
                    <input
                      type="text"
                      className={`form-control ${errors['address.city'] ? 'is-invalid' : ''}`}
                      id="address.city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      required
                    />
                    {errors['address.city'] && <div className="invalid-feedback">{errors['address.city']}</div>}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="address.postalCode" className="form-label">Code postal *</label>
                    <input
                      type="text"
                      className={`form-control ${errors['address.postalCode'] ? 'is-invalid' : ''}`}
                      id="address.postalCode"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                    {errors['address.postalCode'] && <div className="invalid-feedback">{errors['address.postalCode']}</div>}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="address.country" className="form-label">Pays</label>
                    <select
                      className="form-control"
                      id="address.country"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                    >
                      <option value="Guinée">Guinée</option>
                      <option value="Sénégal">Sénégal</option>
                      <option value="Mali">Mali</option>
                      <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/cart')}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Retour au panier
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Traitement...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-paypal me-2"></i>
                        Payer avec PayPal
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-cart-check me-2"></i>
                Récapitulatif de la commande
              </h5>
            </div>
            <div className="card-body">
              {/* Produits */}
              <div className="mb-3">
                {cartItems.map((item, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-0">{item.name}</h6>
                      <small className="text-muted">Quantité: {item.qty}</small>
                    </div>
                    <div className="text-end">
                      <strong>{new Intl.NumberFormat('fr-FR').format(item.price * item.qty)} GNF</strong>
                    </div>
                  </div>
                ))}
              </div>

              <hr />

              {/* Totaux */}
              <div className="d-flex justify-content-between mb-2">
                <span>Sous-total:</span>
                <span>{new Intl.NumberFormat('fr-FR').format(orderSummary.subtotal)} GNF</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Livraison:</span>
                <span>
                  {orderSummary.shipping === 0 ? (
                    <span className="text-success">Gratuite</span>
                  ) : (
                    `${new Intl.NumberFormat('fr-FR').format(orderSummary.shipping)} GNF`
                  )}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>TVA (15%):</span>
                <span>{new Intl.NumberFormat('fr-FR').format(orderSummary.tax)} GNF</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong className="text-primary">{new Intl.NumberFormat('fr-FR').format(orderSummary.total)} GNF</strong>
              </div>

              {orderSummary.shipping === 0 && (
                <div className="alert alert-success mt-3 mb-0">
                  <i className="bi bi-gift me-2"></i>
                  Livraison gratuite !
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

