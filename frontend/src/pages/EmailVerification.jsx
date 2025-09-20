import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function EmailVerification() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes en secondes
  const [email, setEmail] = useState('');

  // Récupérer l'email depuis l'URL ou le state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const emailFromUrl = urlParams.get('email');
    const emailFromState = location.state?.email;
    
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    } else if (emailFromState) {
      setEmail(emailFromState);
    } else {
      // Si pas d'email, rediriger vers l'inscription
      navigate('/inscription');
    }
  }, [location, navigate]);

  // Timer pour l'expiration du code
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Formater le temps restant
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError('Veuillez entrer un code à 6 chiffres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Email vérifié avec succès !');
        
        // Stocker les informations de l'utilisateur
        const userData = {
          ...data.user,
          isLoggedIn: true,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
        
        // Rediriger vers l'accueil après 2 secondes
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.message || 'Code de confirmation invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:4000/api/auth/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Nouveau code envoyé !');
        setTimeLeft(900); // Reset timer
        setCode(''); // Clear current code
      } else {
        setError(data.message || 'Erreur lors du renvoi du code');
      }
    } catch (error) {
      console.error('Erreur lors du renvoi:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToRegistration = () => {
    navigate('/inscription');
  };

  return (
    <div className="container-fluid" style={{ 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      minHeight: '100vh',
      paddingTop: '40px',
      paddingBottom: '40px'
    }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          {/* Carte principale de vérification */}
          <div className="bg-white rounded-4 shadow-lg border" style={{ 
            padding: '50px 40px',
            marginTop: '20px'
          }}>
            {/* Logo et titre */}
            <div className="text-center mb-5">
              <div className="mb-4">
                <i className="bi bi-envelope-check-fill text-primary" style={{ fontSize: '64px' }}></i>
              </div>
              <h1 className="fw-bold mb-3" style={{ fontSize: '32px', color: '#232f3e' }}>
                Vérification de votre email
              </h1>
              <p className="text-muted" style={{ fontSize: '18px' }}>
                Finalisez votre inscription en vérifiant votre adresse email
              </p>
            </div>

            {/* Message de succès */}
            <div className="text-center mb-4">
              <div className="alert alert-success mb-4" style={{ borderRadius: '12px' }}>
                <i className="bi bi-check-circle-fill me-2"></i>
                <strong>Votre compte a été créé avec succès !</strong>
                <br />
                <small>Vérifiez votre email pour finaliser l'inscription.</small>
              </div>
              
              <p className="text-muted mb-2">
                <strong>📧 Code de confirmation envoyé à :</strong>
              </p>
              <p className="fw-bold text-primary mb-4" style={{ fontSize: '18px' }}>{email}</p>
              
              <div className="alert alert-info mb-4" style={{ borderRadius: '12px' }}>
                <i className="bi bi-info-circle me-2"></i>
                <strong>Instructions :</strong> Vérifiez votre boîte de réception (et les spams) pour trouver l'email avec le code à 6 chiffres, puis saisissez-le ci-dessous.
              </div>
              
              {timeLeft > 0 && (
                <div className="alert alert-warning d-inline-block mb-4" style={{ borderRadius: '12px' }}>
                  <i className="bi bi-clock me-2"></i>
                  Code valide pendant : <strong>{formatTime(timeLeft)}</strong>
                </div>
              )}
              
              {timeLeft === 0 && (
                <div className="alert alert-danger d-inline-block mb-4" style={{ borderRadius: '12px' }}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Le code a expiré. Demandez un nouveau code.
                </div>
              )}
            </div>

            {/* Formulaire de vérification */}
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="verificationCode" className="form-label fw-semibold mb-3" style={{ color: '#232f3e', fontSize: '18px' }}>
                  Code de confirmation
                </label>
                <input
                  type="text"
                  className={`form-control text-center ${error ? 'is-invalid' : ''}`}
                  id="verificationCode"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="000000"
                  maxLength="6"
                  style={{ 
                    fontSize: '32px',
                    letterSpacing: '12px',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '3px solid #dee2e6',
                    fontWeight: 'bold'
                  }}
                  disabled={isLoading}
                />
                {error && <div className="invalid-feedback text-center mt-2" style={{ fontSize: '16px' }}>{error}</div>}
              </div>

              {success && (
                <div className="alert alert-success text-center mb-4" style={{ borderRadius: '12px' }}>
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <strong>{success}</strong>
                </div>
              )}

              <div className="d-grid gap-3 mb-4">
                <button
                  type="submit"
                  className="btn fw-bold py-4"
                  disabled={isLoading || code.length !== 6 || timeLeft === 0}
                  style={{
                    background: 'linear-gradient(135deg, #e47911 0%, #f0c14b 100%)',
                    border: 'none',
                    color: '#232f3e',
                    borderRadius: '12px',
                    fontSize: '18px',
                    boxShadow: '0 4px 15px rgba(228, 121, 17, 0.3)'
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Vérification en cours...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check me-2"></i>
                      Vérifier le code
                    </>
                  )}
                </button>
              </div>

              <div className="text-center mb-4">
                <p className="text-muted mb-3" style={{ fontSize: '16px' }}>Vous n'avez pas reçu le code ?</p>
                <button
                  type="button"
                  className="btn btn-outline-primary py-3 px-4"
                  onClick={handleResendCode}
                  disabled={isResending}
                  style={{ borderRadius: '12px', fontSize: '16px' }}
                >
                  {isResending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Renvoyer le code
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link text-muted"
                  onClick={handleBackToRegistration}
                  style={{ textDecoration: 'none', fontSize: '16px' }}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Retour à l'inscription
                </button>
              </div>
            </form>
          </div>

          {/* Informations supplémentaires */}
          <div className="text-center mt-4">
            <div className="bg-white rounded-3 p-4 shadow-sm">
              <h6 className="fw-bold mb-3" style={{ color: '#232f3e' }}>
                <i className="bi bi-question-circle me-2"></i>
                Besoin d'aide ?
              </h6>
              <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                Si vous ne trouvez pas l'email, vérifiez votre dossier spam ou contactez notre support client.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
