import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Inscription() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birthDate: "",
    gender: "",
    newsletter: true,
    terms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
        if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
        if (!formData.email.trim()) {
          newErrors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Format d'email invalide";
        }
        break;
      case 2:
        if (!formData.password) {
          newErrors.password = "Le mot de passe est requis";
        } else if (formData.password.length < 8) {
          newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password = "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre";
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        }
        break;
      case 3:
        if (!formData.phone.trim()) newErrors.phone = "Le numéro de téléphone est requis";
        if (!formData.birthDate) newErrors.birthDate = "La date de naissance est requise";
        if (!formData.gender) newErrors.gender = "Veuillez sélectionner votre genre";
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(currentStep) && formData.terms) {
      setIsLoading(true);
      
      // Simulation d'inscription
      setTimeout(() => {
        setIsLoading(false);
        console.log("Inscription:", formData);
        // Ici on redirigerait vers la page de confirmation
      }, 2000);
    } else if (!formData.terms) {
      setErrors(prev => ({ ...prev, terms: "Vous devez accepter les conditions d'utilisation" }));
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const labels = ["Très faible", "Faible", "Moyen", "Bon", "Très bon"];
    const colors = ["#dc3545", "#fd7e14", "#ffc107", "#28a745", "#20c997"];
    
    return {
      strength: Math.min(strength, 5),
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || ""
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
          <div className="col-12 col-md-8 col-lg-6">
            {/* Carte principale d'inscription */}
            <div className="bg-white rounded-4 shadow-lg border" style={{ 
              padding: '40px 30px',
              marginTop: '20px'
            }}>
              {/* Logo et titre */}
              <div className="text-center mb-4">
                <div className="mb-3">
                  <i className="bi bi-person-plus-fill text-primary" style={{ fontSize: '48px' }}></i>
                </div>
                <h1 className="fw-bold" style={{ fontSize: '28px', color: '#232f3e' }}>
                  Créer votre compte
                </h1>
                <p className="text-muted" style={{ fontSize: '16px' }}>
                  Rejoignez VenteChaussure et profitez de nos offres exclusives
                </p>
              </div>

              {/* Indicateur de progression */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="d-flex align-items-center">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: currentStep >= step ? '#e47911' : '#dee2e6',
                          color: currentStep >= step ? 'white' : '#6c757d',
                          fontSize: '16px'
                        }}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div 
                          className="mx-2"
                          style={{
                            width: '60px',
                            height: '3px',
                            backgroundColor: currentStep > step ? '#e47911' : '#dee2e6'
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <span className="text-muted" style={{ fontSize: '14px' }}>Informations personnelles</span>
                  <span className="text-muted" style={{ fontSize: '14px' }}>Sécurité</span>
                  <span className="text-muted" style={{ fontSize: '14px' }}>Finalisation</span>
                </div>
              </div>

              {/* Formulaire par étapes */}
              <form onSubmit={handleSubmit}>
                {/* Étape 1: Informations personnelles */}
                {currentStep === 1 && (
                  <div className="animate__animated animate__fadeIn">
                    <h4 className="fw-bold mb-4" style={{ color: '#232f3e' }}>
                      <i className="bi bi-person me-2"></i>
                      Vos informations personnelles
                    </h4>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="firstName" className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                          Prénom *
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Votre prénom"
                          style={{ fontSize: '16px', padding: '12px 16px' }}
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label htmlFor="lastName" className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                          Nom *
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Votre nom"
                          style={{ fontSize: '16px', padding: '12px 16px' }}
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                        Adresse e-mail *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          className={`form-control border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="votre@email.com"
                          style={{ fontSize: '16px', padding: '12px 16px' }}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn fw-bold px-4 py-2"
                        onClick={nextStep}
                        style={{
                          background: 'linear-gradient(135deg, #e47911 0%, #f0c14b 100%)',
                          border: 'none',
                          color: '#232f3e',
                          borderRadius: '8px'
                        }}
                      >
                        Suivant <i className="bi bi-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* Étape 2: Sécurité */}
                {currentStep === 2 && (
                  <div className="animate__animated animate__fadeIn">
                    <h4 className="fw-bold mb-4" style={{ color: '#232f3e' }}>
                      <i className="bi bi-shield-lock me-2"></i>
                      Sécurisez votre compte
                    </h4>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                        Mot de passe *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-lock text-muted"></i>
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control border-start-0 ${errors.password ? 'is-invalid' : ''}`}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Créez un mot de passe sécurisé"
                          style={{ fontSize: '16px', padding: '12px 16px' }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary border-start-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      </div>
                      
                      {/* Indicateur de force du mot de passe */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="d-flex align-items-center mb-1">
                            <div className="flex-grow-1 me-2">
                              <div className="progress" style={{ height: '6px' }}>
                                <div 
                                  className="progress-bar" 
                                  style={{ 
                                    width: `${(passwordStrength.strength / 5) * 100}%`,
                                    backgroundColor: passwordStrength.color
                                  }}
                                ></div>
                              </div>
                            </div>
                            <small className="fw-semibold" style={{ color: passwordStrength.color }}>
                              {passwordStrength.label}
                            </small>
                          </div>
                          <small className="text-muted">
                            Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre
                          </small>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                        Confirmer le mot de passe *
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-lock-fill text-muted"></i>
                        </span>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className={`form-control border-start-0 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirmez votre mot de passe"
                          style={{ fontSize: '16px', padding: '12px 16px' }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary border-start-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-4 py-2"
                        onClick={prevStep}
                        style={{ borderRadius: '8px' }}
                      >
                        <i className="bi bi-arrow-left me-2"></i> Précédent
                      </button>
                      <button
                        type="button"
                        className="btn fw-bold px-4 py-2"
                        onClick={nextStep}
                        style={{
                          background: 'linear-gradient(135deg, #e47911 0%, #f0c14b 100%)',
                          border: 'none',
                          color: '#232f3e',
                          borderRadius: '8px'
                        }}
                      >
                        Suivant <i className="bi bi-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* Étape 3: Finalisation */}
                {currentStep === 3 && (
                  <div className="animate__animated animate__fadeIn">
                    <h4 className="fw-bold mb-4" style={{ color: '#232f3e' }}>
                      <i className="bi bi-check-circle me-2"></i>
                      Finalisez votre inscription
                    </h4>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="phone" className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                          Numéro de téléphone *
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-telephone text-muted"></i>
                          </span>
                          <input
                            type="tel"
                            className={`form-control border-start-0 ${errors.phone ? 'is-invalid' : ''}`}
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+33 6 12 34 56 78"
                            style={{ fontSize: '16px', padding: '12px 16px' }}
                          />
                          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        </div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label htmlFor="birthDate" className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                          Date de naissance *
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
                          id="birthDate"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          style={{ fontSize: '16px', padding: '12px 16px' }}
                        />
                        {errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                        Genre *
                      </label>
                      <div className="d-flex gap-3">
                        {['Homme', 'Femme', 'Autre'].map((gender) => (
                          <div key={gender} className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gender"
                              id={gender}
                              value={gender}
                              checked={formData.gender === gender}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label" htmlFor={gender}>
                              {gender}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.gender && <div className="text-danger mt-1" style={{ fontSize: '14px' }}>{errors.gender}</div>}
                    </div>

                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="newsletter"
                          name="newsletter"
                          checked={formData.newsletter}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="newsletter">
                          Je souhaite recevoir les offres et nouveautés par email
                        </label>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                          type="checkbox"
                          id="terms"
                          name="terms"
                          checked={formData.terms}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="terms">
                          J'accepte les{' '}
                          <Link to="/conditions" className="text-decoration-none" style={{ color: '#e47911' }}>
                            Conditions d'utilisation
                          </Link>{' '}
                          et la{' '}
                          <Link to="/confidentialite" className="text-decoration-none" style={{ color: '#e47911' }}>
                            Politique de confidentialité
                          </Link>
                          *
                        </label>
                        {errors.terms && <div className="invalid-feedback">{errors.terms}</div>}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-4 py-2"
                        onClick={prevStep}
                        style={{ borderRadius: '8px' }}
                      >
                        <i className="bi bi-arrow-left me-2"></i> Précédent
                      </button>
                      <button
                        type="submit"
                        className="btn fw-bold px-4 py-2"
                        disabled={isLoading}
                        style={{
                          background: 'linear-gradient(135deg, #e47911 0%, #f0c14b 100%)',
                          border: 'none',
                          color: '#232f3e',
                          borderRadius: '8px',
                          minWidth: '120px'
                        }}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Création...
                          </>
                        ) : (
                          'Créer mon compte'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>

              {/* Lien vers la connexion */}
              <div className="text-center mt-4 pt-4 border-top">
                <p className="text-muted mb-0">
                  Vous avez déjà un compte ?{' '}
                  <Link 
                    to="/connexion" 
                    className="text-decoration-none fw-bold"
                    style={{ color: '#e47911' }}
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>

            {/* Avantages de l'inscription */}
            <div className="bg-white rounded-4 shadow-sm border mt-4" style={{ padding: '24px' }}>
              <h5 className="fw-bold mb-3" style={{ color: '#232f3e' }}>
                <i className="bi bi-star-fill text-warning me-2"></i>
                Avantages de votre compte
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2 text-muted">
                      <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '12px' }}></i>
                      Commandes rapides et sécurisées
                    </li>
                    <li className="mb-2 text-muted">
                      <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '12px' }}></i>
                      Suivi des commandes en temps réel
                    </li>
                    <li className="text-muted">
                      <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '12px' }}></i>
                      Offres exclusives et réductions
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2 text-muted">
                      <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '12px' }}></i>
                      Historique des achats
                    </li>
                    <li className="mb-2 text-muted">
                      <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '12px' }}></i>
                      Liste de souhaits personnalisée
                    </li>
                    <li className="text-muted">
                      <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '12px' }}></i>
                      Service client prioritaire
                    </li>
                  </ul>
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