import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmailVerificationModal = ({ 
  isOpen, 
  onClose, 
  email, 
  onVerificationSuccess,
  onResendCode 
}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes en secondes
  const navigate = useNavigate();

  // Timer pour l'expiration du code
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

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
  }, [isOpen, timeLeft]);

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
        
        // Appeler la fonction de succès
        if (onVerificationSuccess) {
          onVerificationSuccess(data.user, data.token);
        }
        
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
        if (onResendCode) {
          onResendCode();
        }
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

  const handleClose = () => {
    setCode('');
    setError('');
    setSuccess('');
    setTimeLeft(900);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-0 pb-0">
            <div className="w-100 text-center">
              <div className="mb-3">
                <i className="bi bi-envelope-check-fill text-primary" style={{ fontSize: '48px' }}></i>
              </div>
              <h4 className="modal-title fw-bold" style={{ color: '#232f3e' }}>
                Vérification de votre email
              </h4>
            </div>
          </div>
          
          <div className="modal-body pt-0">
            <div className="text-center mb-4">
              <div className="alert alert-success mb-3">
                <i className="bi bi-check-circle-fill me-2"></i>
                <strong>Votre compte a été créé !</strong> Vérifiez votre email pour finaliser l'inscription.
              </div>
              
              <p className="text-muted mb-2">
                <strong>📧 Code de confirmation envoyé à :</strong>
              </p>
              <p className="fw-bold text-primary mb-3">{email}</p>
              
              <div className="alert alert-info mb-3">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Instructions :</strong> Vérifiez votre boîte de réception (et les spams) pour trouver l'email avec le code à 6 chiffres, puis saisissez-le ci-dessous.
              </div>
              
              {timeLeft > 0 && (
                <div className="alert alert-warning d-inline-block mb-3">
                  <i className="bi bi-clock me-2"></i>
                  Code valide pendant : <strong>{formatTime(timeLeft)}</strong>
                </div>
              )}
              
              {timeLeft === 0 && (
                <div className="alert alert-danger d-inline-block mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Le code a expiré. Demandez un nouveau code.
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="verificationCode" className="form-label fw-semibold" style={{ color: '#232f3e' }}>
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
                    fontSize: '24px',
                    letterSpacing: '8px',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '2px solid #dee2e6'
                  }}
                  disabled={isLoading}
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>

              {success && (
                <div className="alert alert-success text-center">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {success}
                </div>
              )}

              <div className="d-grid gap-2 mb-3">
                <button
                  type="submit"
                  className="btn fw-bold py-3"
                  disabled={isLoading || code.length !== 6 || timeLeft === 0}
                  style={{
                    background: 'linear-gradient(135deg, #e47911 0%, #f0c14b 100%)',
                    border: 'none',
                    color: '#232f3e',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Vérification...
                    </>
                  ) : (
                    'Vérifier le code'
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-muted mb-2">Vous n'avez pas reçu le code ?</p>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleResendCode}
                  disabled={isResending}
                  style={{ borderRadius: '8px' }}
                >
                  {isResending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Envoi...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Renvoyer le code
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="modal-footer border-0 pt-0">
            <div className="w-100 text-center">
              <button
                type="button"
                className="btn btn-link text-muted"
                onClick={handleClose}
                style={{ textDecoration: 'none' }}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Retour à l'inscription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;