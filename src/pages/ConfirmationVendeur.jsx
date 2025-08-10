import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLanguage } from "../contexts/LanguageContext";
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ConfirmationVendeur() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { numeroDemande, email } = location.state || { 
    numeroDemande: 'VD-' + Date.now(), 
    email: 'exemple@email.com' 
  };

  // Fonction pour simuler la validation du vendeur (pour les tests)
  const simulateValidation = () => {
    if (user) {
      updateUser({
        isVendorValidated: true,
        vendorStatus: 'validated'
      });
      alert('Vendeur validé ! Vous allez être redirigé vers l\'onboarding.');
      navigate('/vendeur/onboarding');
    }
  };

  const prochainesEtapes = [
    {
      icon: 'bi bi-envelope-check',
      titre: 'Email de confirmation',
      description: 'Vous recevrez un email de confirmation dans les prochaines minutes avec tous les détails de votre demande.',
      delai: '5-10 minutes'
    },
    {
      icon: 'bi bi-clock',
      titre: 'Vérification des documents',
      description: 'Notre équipe va examiner vos documents et informations. Cette étape prend généralement 24-48h.',
      delai: '24-48h'
    },
    {
      icon: 'bi bi-check-circle',
      titre: 'Validation de votre compte',
      description: 'Une fois validé, vous recevrez un email avec vos identifiants pour accéder à votre espace vendeur.',
      delai: '48-72h'
    },
    {
      icon: 'bi bi-shop',
      titre: 'Accès à votre espace vendeur',
      description: 'Vous pourrez alors commencer à ajouter vos produits et configurer votre boutique.',
      delai: 'Immédiat après validation'
    }
  ];

  const informationsImportantes = [
    'Gardez votre numéro de demande en lieu sûr',
    'Vérifiez régulièrement votre boîte email',
    'Assurez-vous que vos documents sont lisibles et complets',
    'En cas de question, contactez notre support vendeur'
  ];

  return (
    <>
      <Header />
      <div className="container-fluid py-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            {/* Message de confirmation principal */}
            <div className="card border-success mb-4">
              <div className="card-body text-center p-5">
                <div className="bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{width: 80, height: 80}}>
                  <i className="bi bi-check-lg text-white fs-1"></i>
                </div>
                <h1 className="text-success fw-bold mb-3">Demande soumise avec succès !</h1>
                <p className="lead text-muted mb-4">
                  Votre demande pour devenir vendeur sur papasow a été enregistrée. 
                  Nous vous tiendrons informé de l'avancement de votre dossier.
                </p>
                
                {/* Numéro de demande */}
                <div className="bg-light rounded p-4 mb-4">
                  <h5 className="fw-bold text-primary mb-2">Numéro de demande</h5>
                  <div className="fs-3 fw-bold text-primary">{numeroDemande}</div>
                  <small className="text-muted">Conservez ce numéro pour tout contact avec notre équipe</small>
                </div>

                {/* Email de confirmation */}
                <div className="alert alert-info">
                  <i className="bi bi-envelope me-2"></i>
                  <strong>Email de confirmation :</strong> {email}
                </div>
              </div>
            </div>

            {/* Prochaines étapes */}
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                  <i className="bi bi-list-check me-2"></i>
                  Prochaines étapes
                </h4>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  {prochainesEtapes.map((etape, index) => (
                    <div key={index} className="col-12 col-md-6">
                      <div className="d-flex align-items-start gap-3">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: 50, height: 50, flexShrink: 0}}>
                          <i className={`${etape.icon} text-white fs-5`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-2">{etape.titre}</h6>
                          <p className="small text-muted mb-2">{etape.description}</p>
                          <span className="badge bg-secondary">{etape.delai}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Informations importantes */}
            <div className="card mb-4">
              <div className="card-header bg-warning text-dark">
                <h4 className="mb-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Informations importantes
                </h4>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  {informationsImportantes.map((info, index) => (
                    <li key={index} className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      {info}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="card mb-4">
              <div className="card-header bg-info text-white">
                <h4 className="mb-0">
                  <i className="bi bi-lightning me-2"></i>
                  Actions rapides
                </h4>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <Link to="/vendeur/onboarding" className="btn btn-primary w-100">
                      <i className="bi bi-rocket me-2"></i>
                      Commencer l'onboarding
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link to="/vendeur/dashboard" className="btn btn-outline-success w-100">
                      <i className="bi bi-shop me-2"></i>
                      Accéder au Dashboard vendeur
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link to="/support-vendeur" className="btn btn-outline-primary w-100">
                      <i className="bi bi-headset me-2"></i>
                      Contacter le support vendeur
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link to="/" className="btn btn-outline-secondary w-100">
                      <i className="bi bi-house me-2"></i>
                      Retour à l'accueil
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <button className="btn btn-outline-info w-100" onClick={() => window.print()}>
                      <i className="bi bi-printer me-2"></i>
                      Imprimer cette page
                    </button>
                  </div>
                  {/* Bouton de test pour simuler la validation */}
                  <div className="col-12">
                    <button 
                      className="btn btn-warning w-100" 
                      onClick={simulateValidation}
                      style={{ marginTop: '1rem' }}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      🧪 TEST : Simuler la validation du vendeur
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ rapide */}
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-question-circle me-2"></i>
                  Questions fréquentes
                </h5>
              </div>
              <div className="card-body">
                <div className="accordion" id="faqConfirmation">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                        Combien de temps dure la validation ?
                      </button>
                    </h2>
                    <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqConfirmation">
                      <div className="accordion-body">
                        La validation prend généralement 24 à 48 heures ouvrables. Nous vous enverrons un email dès que votre compte sera validé.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                        Que faire si je n'ai pas reçu l'email de confirmation ?
                      </button>
                    </h2>
                    <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqConfirmation">
                      <div className="accordion-body">
                        Vérifiez vos spams et dossiers indésirables. Si vous n'avez toujours rien reçu après 30 minutes, contactez notre support vendeur.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                        Puis-je modifier ma demande ?
                      </button>
                    </h2>
                    <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqConfirmation">
                      <div className="accordion-body">
                        Une fois soumise, la demande ne peut plus être modifiée. En cas d'erreur, contactez notre support vendeur avec votre numéro de demande.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 