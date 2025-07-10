import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MotDePasseOublie() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("Veuillez saisir votre adresse e-mail");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez saisir une adresse e-mail valide");
      return;
    }

    setIsLoading(true);
    
    // Simulation d'envoi d'email
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      console.log("Email de récupération envoyé à:", email);
    }, 2000);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
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
            {/* Carte principale */}
            <div className="bg-white rounded-4 shadow-lg border" style={{ 
              padding: '40px 30px',
              marginTop: '20px'
            }}>
              {/* Logo et titre */}
              <div className="text-center mb-4">
                <div className="mb-3">
                  <i className="bi bi-key-fill text-primary" style={{ fontSize: '48px' }}></i>
                </div>
                <h1 className="fw-bold" style={{ fontSize: '28px', color: '#232f3e' }}>
                  Mot de passe oublié ?
                </h1>
                <p className="text-muted" style={{ fontSize: '16px' }}>
                  Nous vous aiderons à récupérer votre compte
                </p>
              </div>

              {!isSubmitted ? (
                <>
                  {/* Instructions */}
                  <div className="bg-light rounded-3 p-3 mb-4">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-info-circle-fill text-primary me-2 mt-1" style={{ fontSize: '18px' }}></i>
                      <div>
                        <p className="mb-1 fw-semibold" style={{ color: '#232f3e' }}>
                          Comment ça fonctionne ?
                        </p>
                        <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>
                          Saisissez votre adresse e-mail et nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Formulaire */}
                  <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                        Adresse e-mail
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          className={`form-control border-start-0 ${error ? 'is-invalid' : ''}`}
                          id="email"
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="votre@email.com"
                          required
                          style={{ 
                            borderColor: '#dee2e6',
                            fontSize: '16px',
                            padding: '12px 16px'
                          }}
                        />
                      </div>
                      {error && <div className="text-danger mt-2" style={{ fontSize: '14px' }}>{error}</div>}
                    </div>

                    {/* Bouton d'envoi */}
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
                          Envoi en cours...
                        </>
                      ) : (
                        'Envoyer le lien de récupération'
                      )}
                    </button>
                  </form>

                  {/* Liens utiles */}
                  <div className="text-center">
                    <p className="text-muted mb-2">
                      Vous vous souvenez de votre mot de passe ?{' '}
                      <Link 
                        to="/connexion" 
                        className="text-decoration-none fw-bold"
                        style={{ color: '#e47911' }}
                      >
                        Se connecter
                      </Link>
                    </p>
                    <p className="text-muted mb-0">
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
                </>
              ) : (
                <>
                  {/* Confirmation d'envoi */}
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                           style={{ width: '80px', height: '80px' }}>
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '40px' }}></i>
                      </div>
                      <h3 className="fw-bold mb-3" style={{ color: '#232f3e' }}>
                        Email envoyé !
                      </h3>
                      <p className="text-muted mb-4" style={{ fontSize: '16px' }}>
                        Nous avons envoyé un lien de récupération à{' '}
                        <span className="fw-semibold" style={{ color: '#232f3e' }}>{email}</span>
                      </p>
                    </div>

                    {/* Instructions de suivi */}
                    <div className="bg-light rounded-3 p-4 mb-4">
                      <h5 className="fw-bold mb-3" style={{ color: '#232f3e' }}>
                        <i className="bi bi-envelope-open me-2"></i>
                        Prochaines étapes
                      </h5>
                      <ol className="text-start text-muted mb-0" style={{ fontSize: '14px' }}>
                        <li className="mb-2">Vérifiez votre boîte de réception</li>
                        <li className="mb-2">Cliquez sur le lien dans l'email reçu</li>
                        <li className="mb-2">Créez un nouveau mot de passe sécurisé</li>
                        <li>Connectez-vous avec vos nouvelles informations</li>
                      </ol>
                    </div>

                    {/* Actions */}
                    <div className="d-grid gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-primary py-2 fw-semibold"
                        onClick={() => {
                          setIsSubmitted(false);
                          setEmail("");
                        }}
                        style={{ borderRadius: '8px' }}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Essayer avec un autre email
                      </button>
                      <Link 
                        to="/connexion"
                        className="btn fw-bold py-2"
                        style={{
                          background: 'linear-gradient(135deg, #e47911 0%, #f0c14b 100%)',
                          border: 'none',
                          color: '#232f3e',
                          borderRadius: '8px'
                        }}
                      >
                        Retour à la connexion
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Informations de sécurité */}
            <div className="bg-white rounded-4 shadow-sm border mt-4" style={{ padding: '24px' }}>
              <h5 className="fw-bold mb-3" style={{ color: '#232f3e' }}>
                <i className="bi bi-shield-check text-success me-2"></i>
                Sécurité et confidentialité
              </h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-2 text-muted">
                  <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '12px' }}></i>
                  Le lien expire automatiquement après 1 heure
                </li>
                <li className="mb-2 text-muted">
                  <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '12px' }}></i>
                  Utilisez uniquement sur votre appareil personnel
                </li>
                <li className="text-muted">
                  <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '12px' }}></i>
                  Ne partagez jamais ce lien avec d'autres personnes
                </li>
              </ul>
            </div>

            {/* Aide supplémentaire */}
            <div className="bg-white rounded-4 shadow-sm border mt-4" style={{ padding: '24px' }}>
              <h5 className="fw-bold mb-3" style={{ color: '#232f3e' }}>
                <i className="bi bi-question-circle text-primary me-2"></i>
                Besoin d'aide ?
              </h5>
              <div className="d-grid gap-2">
                <Link 
                  to="/service-client"
                  className="btn btn-outline-secondary py-2 fw-semibold"
                  style={{ borderRadius: '8px', fontSize: '14px' }}
                >
                  <i className="bi bi-headset me-2"></i>
                  Contacter le service client
                </Link>
                <a 
                  href="mailto:support@ventechaussure.com"
                  className="btn btn-outline-primary py-2 fw-semibold"
                  style={{ borderRadius: '8px', fontSize: '14px' }}
                >
                  <i className="bi bi-envelope me-2"></i>
                  support@ventechaussure.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
} 