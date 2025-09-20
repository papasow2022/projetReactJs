import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLanguage } from "../contexts/LanguageContext";
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ConfirmationVendeur() {
  const location = useLocation();
  const { user } = useAuth();
  const isValidated = user?.vendorStatus === 'validated';
  // Aligné avec un flux type Amazon: pas d'actions d'onboarding avant validation
  const { numeroDemande, email } = location.state || { 
    numeroDemande: 'VD-' + Date.now(), 
    email: 'exemple@email.com' 
  };
  const vendorStatus = (user && user.vendorStatus) || 'pending';
  const steps = (user && user.vendorId && JSON.parse(localStorage.getItem('vendors') || '{}')[user.vendorId]?.verification) || null;

  //

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

            {/* Statut de vérification */}
            <div className="card mb-4">
              <div className="card-header bg-secondary text-white">
                <h4 className="mb-0">
                  <i className="bi bi-shield-check me-2"></i>
                  Statut de vérification
                </h4>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-start gap-3">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border" style={{width: 46, height: 46, flexShrink: 0}}>
                        <i className={`bi ${(steps?.kyc?.status === 'approved' || isValidated) ? 'bi-check-circle-fill text-success' : steps?.kyc?.status === 'rejected' ? 'bi-x-circle-fill text-danger' : 'bi-hourglass-split text-warning'} fs-5`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">Vérification d'identité (KYC)</h6>
                        <p className="small text-muted mb-1">Contrôle de vos informations personnelles et documents d'identité.</p>
                        <span className={`badge ${steps?.kyc?.status === 'approved' ? 'bg-success' : steps?.kyc?.status === 'rejected' ? 'bg-danger' : steps?.kyc?.status === 'needs_more_info' ? 'bg-warning text-dark' : isValidated ? 'bg-success' : 'bg-warning text-dark'}`}>{steps?.kyc?.status === 'approved' ? 'Validé' : steps?.kyc?.status === 'rejected' ? 'Refusé' : steps?.kyc?.status === 'needs_more_info' ? 'À compléter' : isValidated ? 'Validé' : 'En cours'}</span>
                        {steps?.kyc?.status === 'needs_more_info' && steps?.kyc?.notes && (
                          <div className="small text-muted mt-1">Note: {steps.kyc.notes}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-start gap-3">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border" style={{width: 46, height: 46, flexShrink: 0}}>
                        <i className={`bi ${(steps?.bank?.status === 'approved' || isValidated) ? 'bi-check-circle-fill text-success' : steps?.bank?.status === 'rejected' ? 'bi-x-circle-fill text-danger' : 'bi-hourglass-split text-warning'} fs-5`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">Vérification bancaire</h6>
                        <p className="small text-muted mb-1">Validation de votre moyen de paiement et compte bancaire.</p>
                        <span className={`badge ${steps?.bank?.status === 'approved' ? 'bg-success' : steps?.bank?.status === 'rejected' ? 'bg-danger' : steps?.bank?.status === 'needs_more_info' ? 'bg-warning text-dark' : isValidated ? 'bg-success' : 'bg-warning text-dark'}`}>{steps?.bank?.status === 'approved' ? 'Validé' : steps?.bank?.status === 'rejected' ? 'Refusé' : steps?.bank?.status === 'needs_more_info' ? 'À compléter' : isValidated ? 'Validé' : 'En cours'}</span>
                        {steps?.bank?.status === 'needs_more_info' && steps?.bank?.notes && (
                          <div className="small text-muted mt-1">Note: {steps.bank.notes}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-start gap-3">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border" style={{width: 46, height: 46, flexShrink: 0}}>
                        <i className={`bi ${(steps?.tax?.status === 'approved' || isValidated) ? 'bi-check-circle-fill text-success' : steps?.tax?.status === 'rejected' ? 'bi-x-circle-fill text-danger' : 'bi-hourglass-split text-warning'} fs-5`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">Documents fiscaux (TVA si applicable)</h6>
                        <p className="small text-muted mb-1">Contrôle des informations fiscales et d'immatriculation.</p>
                        <span className={`badge ${steps?.tax?.status === 'approved' ? 'bg-success' : steps?.tax?.status === 'rejected' ? 'bg-danger' : steps?.tax?.status === 'needs_more_info' ? 'bg-warning text-dark' : isValidated ? 'bg-success' : 'bg-warning text-dark'}`}>{steps?.tax?.status === 'approved' ? 'Validé' : steps?.tax?.status === 'rejected' ? 'Refusé' : steps?.tax?.status === 'needs_more_info' ? 'À compléter' : isValidated ? 'Validé' : 'En cours'}</span>
                        {steps?.tax?.status === 'needs_more_info' && steps?.tax?.notes && (
                          <div className="small text-muted mt-1">Note: {steps.tax.notes}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-start gap-3">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border" style={{width: 46, height: 46, flexShrink: 0}}>
                        <i className={`bi ${(steps?.compliance?.status === 'approved' || isValidated) ? 'bi-check-circle-fill text-success' : steps?.compliance?.status === 'rejected' ? 'bi-x-circle-fill text-danger' : 'bi-hourglass-split text-warning'} fs-5`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">Revue de conformité</h6>
                        <p className="small text-muted mb-1">Examen final de votre dossier par notre équipe.</p>
                        <span className={`badge ${steps?.compliance?.status === 'approved' ? 'bg-success' : steps?.compliance?.status === 'rejected' ? 'bg-danger' : steps?.compliance?.status === 'needs_more_info' ? 'bg-warning text-dark' : isValidated ? 'bg-success' : 'bg-warning text-dark'}`}>{steps?.compliance?.status === 'approved' ? 'Validé' : steps?.compliance?.status === 'rejected' ? 'Refusé' : steps?.compliance?.status === 'needs_more_info' ? 'À compléter' : isValidated ? 'Validé' : 'En cours'}</span>
                        {steps?.compliance?.status === 'needs_more_info' && steps?.compliance?.notes && (
                          <div className="small text-muted mt-1">Note: {steps.compliance.notes}</div>
                        )}
                      </div>
                    </div>
                  </div>
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

            {/* Actions rapides (alignées Amazon) */}
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
                    <Link to="/support-vendeur" className="btn btn-outline-primary w-100">
                      <i className="bi bi-headset me-2"></i>
                      Consulter l'aide vendeur
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link to="/" className="btn btn-outline-secondary w-100">
                      <i className="bi bi-house me-2"></i>
                      Retour à l'accueil
                    </Link>
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