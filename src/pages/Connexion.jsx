import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Connexion() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'une connexion
    setTimeout(() => {
      setIsLoading(false);
      console.log("Tentative de connexion:", formData);
    }, 2000);
  };

  return (
    <>
      <Header />
      
      <div className="container-fluid" style={{ 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        minHeight: '100vh',
        paddingTop: '20px',
        paddingBottom: '40px'
      }}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            {/* Carte principale de connexion */}
            <div className="bg-white rounded-4 shadow-lg border" style={{ 
              padding: '40px 30px',
              marginTop: '20px'
            }}>
              {/* Logo et titre */}
              <div className="text-center mb-4">
                <div className="mb-3">
                  <i className="bi bi-bag-heart-fill text-primary" style={{ fontSize: '48px' }}></i>
                </div>
                <h1 className="fw-bold" style={{ fontSize: '28px', color: '#232f3e' }}>
                  Connexion
                </h1>
                <p className="text-muted" style={{ fontSize: '16px' }}>
                  Connectez-vous à votre compte VenteChaussure
                </p>
              </div>

              {/* Formulaire de connexion */}
              <form onSubmit={handleSubmit} className="mb-4">
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                    Adresse e-mail
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                      required
                      style={{ 
                        borderColor: '#dee2e6',
                        fontSize: '16px',
                        padding: '12px 16px'
                      }}
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                    Mot de passe
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control border-start-0"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Votre mot de passe"
                      required
                      style={{ 
                        borderColor: '#dee2e6',
                        fontSize: '16px',
                        padding: '12px 16px'
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary border-start-0"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ borderColor: '#dee2e6' }}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Options supplémentaires */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      style={{ borderColor: '#232f3e' }}
                    />
                    <label className="form-check-label text-muted" htmlFor="rememberMe">
                      Se souvenir de moi
                    </label>
                  </div>
                  <Link 
                    to="/mot-de-passe-oublie" 
                    className="text-decoration-none fw-semibold"
                    style={{ color: '#e47911' }}
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* Bouton de connexion */}
                <button
                  type="submit"
                  className="btn w-100 fw-bold py-3 mb-3"
                  disabled={isLoading}
                  style={{
                    background: 'linear-gradient(135deg, #e47911 0%, #f0c14b 100%)',
                    border: 'none',
                    color: '#232f3e',
                    fontSize: '18px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(228, 121, 17, 0.3)'
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Connexion en cours...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </button>

                {/* Conditions d'utilisation */}
                <p className="text-center text-muted" style={{ fontSize: '14px' }}>
                  En continuant, vous acceptez nos{' '}
                  <Link to="/conditions" className="text-decoration-none" style={{ color: '#e47911' }}>
                    Conditions d'utilisation
                  </Link>{' '}
                  et notre{' '}
                  <Link to="/confidentialite" className="text-decoration-none" style={{ color: '#e47911' }}>
                    Politique de confidentialité
                  </Link>
                </p>
              </form>

              {/* Séparateur */}
              <div className="text-center mb-4">
                <div className="position-relative">
                  <hr className="text-muted" />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted" style={{ fontSize: '14px' }}>
                    ou
                  </span>
                </div>
              </div>

              {/* Connexion avec Google */}
              <button
                type="button"
                className="btn btn-outline-dark w-100 py-3 mb-3 fw-semibold"
                style={{ 
                  borderColor: '#dee2e6',
                  fontSize: '16px',
                  borderRadius: '8px'
                }}
              >
                <i className="bi bi-google me-2"></i>
                Continuer avec Google
              </button>

              {/* Connexion avec Facebook */}
              <button
                type="button"
                className="btn btn-outline-primary w-100 py-3 mb-4 fw-semibold"
                style={{ 
                  borderColor: '#dee2e6',
                  fontSize: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#1877f2',
                  color: 'white'
                }}
              >
                <i className="bi bi-facebook me-2"></i>
                Continuer avec Facebook
              </button>

              {/* Lien vers l'inscription */}
              <div className="text-center">
                <p className="text-muted mb-2">
                  Nouveau client ?{' '}
                  <Link 
                    to="/inscription" 
                    className="text-decoration-none fw-bold"
                    style={{ color: '#e47911' }}
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="bg-white rounded-4 shadow-sm border mt-4" style={{ padding: '24px' }}>
              <h5 className="fw-bold mb-3" style={{ color: '#232f3e' }}>
                <i className="bi bi-shield-check text-success me-2"></i>
                Sécurité garantie
              </h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-2 text-muted">
                  <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '12px' }}></i>
                  Connexion sécurisée SSL
                </li>
                <li className="mb-2 text-muted">
                  <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '12px' }}></i>
                  Protection des données personnelles
                </li>
                <li className="text-muted">
                  <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '12px' }}></i>
                  Authentification à deux facteurs disponible
                </li>
              </ul>
            </div>
          </div>
        </div>
  </div>

      <Footer />
    </>
);
} 