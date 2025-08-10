import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLanguage } from "../contexts/LanguageContext";
import Header from '../components/Header';
import Footer from '../components/Footer';

const etapes = [
  { numero: 1, titre: 'Informations personnelles', statut: 'active' },
  { numero: 2, titre: 'Informations professionnelles', statut: 'pending' },
  { numero: 3, titre: 'Documents requis', statut: 'pending' },
  { numero: 4, titre: 'Validation', statut: 'pending' }
];

export default function InscriptionVendeur() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [etapeActuelle, setEtapeActuelle] = useState(1);
  const [formData, setFormData] = useState({
    // Informations personnelles
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: 'Guinée',
    
    // Informations professionnelles
    nomEntreprise: '',
    typeEntreprise: '',
    secteurActivite: '',
    numeroSiret: '',
    adresseEntreprise: '',
    villeEntreprise: '',
    codePostalEntreprise: '',
    
    // Documents
    pieceIdentite: null,
    registreCommerce: null,
    justificatifAdresse: null,
    
    // Conditions
    accepteConditions: false,
    acceptePolitique: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation de traitement
    console.log('Données du formulaire vendeur:', formData);
    
    // Mettre à jour le statut utilisateur pour devenir vendeur
    if (user) {
      updateUser({
        isVendor: true,
        isVendorValidated: false,
        vendorId: 'VD-' + Date.now(),
        vendorStatus: 'pending'
      });
    }
    
    // Redirection vers la page de confirmation
    navigate('/confirmation-vendeur', { 
      state: { 
        numeroDemande: 'VD-' + Date.now(),
        email: formData.email 
      } 
    });
  };

  const renderEtape1 = () => (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">
          <i className="bi bi-person-circle me-2"></i>
          Informations personnelles
        </h4>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Prénom *</label>
            <input
              type="text"
              className="form-control"
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Nom *</label>
            <input
              type="text"
              className="form-control"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Email *</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Téléphone *</label>
            <input
              type="tel"
              className="form-control"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Date de naissance *</label>
            <input
              type="date"
              className="form-control"
              name="dateNaissance"
              value={formData.dateNaissance}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Pays *</label>
            <select
              className="form-select"
              name="pays"
              value={formData.pays}
              onChange={handleInputChange}
              required
            >
              <option value="Guinée">Guinée</option>
              <option value="Sénégal">Sénégal</option>
              <option value="Côte d'Ivoire">Côte d'Ivoire</option>
              <option value="Mali">Mali</option>
              <option value="Burkina Faso">Burkina Faso</option>
            </select>
          </div>
          <div className="col-12">
            <label className="form-label fw-bold">Adresse *</label>
            <input
              type="text"
              className="form-control"
              name="adresse"
              value={formData.adresse}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Ville *</label>
            <input
              type="text"
              className="form-control"
              name="ville"
              value={formData.ville}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Code postal *</label>
            <input
              type="text"
              className="form-control"
              name="codePostal"
              value={formData.codePostal}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEtape2 = () => (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">
          <i className="bi bi-building me-2"></i>
          Informations professionnelles
        </h4>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Nom de l'entreprise *</label>
            <input
              type="text"
              className="form-control"
              name="nomEntreprise"
              value={formData.nomEntreprise}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Type d'entreprise *</label>
            <select
              className="form-select"
              name="typeEntreprise"
              value={formData.typeEntreprise}
              onChange={handleInputChange}
              required
            >
              <option value="">Sélectionner</option>
              <option value="EI">Entreprise Individuelle</option>
              <option value="SARL">SARL</option>
              <option value="SA">SA</option>
              <option value="EURL">EURL</option>
              <option value="Auto-entrepreneur">Auto-entrepreneur</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Secteur d'activité *</label>
            <select
              className="form-select"
              name="secteurActivite"
              value={formData.secteurActivite}
              onChange={handleInputChange}
              required
            >
              <option value="">Sélectionner</option>
              <option value="mode">Mode et Accessoires</option>
              <option value="electronique">Électronique</option>
              <option value="maison">Maison et Jardin</option>
              <option value="sport">Sport et Loisirs</option>
              <option value="beaute">Beauté et Santé</option>
              <option value="livres">Livres et Médias</option>
              <option value="alimentation">Alimentation</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Numéro SIRET/RC *</label>
            <input
              type="text"
              className="form-control"
              name="numeroSiret"
              value={formData.numeroSiret}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label fw-bold">Adresse de l'entreprise *</label>
            <input
              type="text"
              className="form-control"
              name="adresseEntreprise"
              value={formData.adresseEntreprise}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Ville de l'entreprise *</label>
            <input
              type="text"
              className="form-control"
              name="villeEntreprise"
              value={formData.villeEntreprise}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Code postal de l'entreprise *</label>
            <input
              type="text"
              className="form-control"
              name="codePostalEntreprise"
              value={formData.codePostalEntreprise}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEtape3 = () => (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">
          <i className="bi bi-file-earmark-text me-2"></i>
          Documents requis
        </h4>
      </div>
      <div className="card-body">
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Important :</strong> Tous les documents doivent être au format PDF, JPG ou PNG et ne pas dépasser 5MB.
        </div>
        
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Pièce d'identité *</label>
            <input
              type="file"
              className="form-control"
              name="pieceIdentite"
              onChange={handleInputChange}
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
            <small className="text-muted">Carte d'identité, passeport ou permis de conduire</small>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Registre de commerce *</label>
            <input
              type="file"
              className="form-control"
              name="registreCommerce"
              onChange={handleInputChange}
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
            <small className="text-muted">Extrait Kbis ou équivalent</small>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Justificatif d'adresse *</label>
            <input
              type="file"
              className="form-control"
              name="justificatifAdresse"
              onChange={handleInputChange}
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
            <small className="text-muted">Facture récente (électricité, eau, téléphone)</small>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEtape4 = () => (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">
          <i className="bi bi-check-circle me-2"></i>
          Validation et conditions
        </h4>
      </div>
      <div className="card-body">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <strong>Récapitulatif :</strong> Veuillez vérifier toutes les informations avant de soumettre votre demande.
        </div>
        
        <div className="row g-3">
          <div className="col-md-6">
            <h6 className="fw-bold">Informations personnelles</h6>
            <p className="small">
              {formData.prenom} {formData.nom}<br/>
              {formData.email}<br/>
              {formData.telephone}
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="fw-bold">Informations professionnelles</h6>
            <p className="small">
              {formData.nomEntreprise}<br/>
              {formData.typeEntreprise}<br/>
              {formData.secteurActivite}
            </p>
          </div>
        </div>
        
        <hr/>
        
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="accepteConditions"
            checked={formData.accepteConditions}
            onChange={handleInputChange}
            required
          />
          <label className="form-check-label">
            J'accepte les <Link to="/conditions-vente" className="text-primary">conditions générales de vente</Link> *
          </label>
        </div>
        
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="acceptePolitique"
            checked={formData.acceptePolitique}
            onChange={handleInputChange}
            required
          />
          <label className="form-check-label">
            J'accepte la <Link to="/politique-confidentialite" className="text-primary">politique de confidentialité</Link> *
          </label>
        </div>
      </div>
    </div>
  );

  const renderEtape = () => {
    switch(etapeActuelle) {
      case 1: return renderEtape1();
      case 2: return renderEtape2();
      case 3: return renderEtape3();
      case 4: return renderEtape4();
      default: return renderEtape1();
    }
  };

  const nextEtape = () => {
    if (etapeActuelle < 4) {
      setEtapeActuelle(etapeActuelle + 1);
    }
  };

  const prevEtape = () => {
    if (etapeActuelle > 1) {
      setEtapeActuelle(etapeActuelle - 1);
    }
  };

  return (
    <>
      <Header />
      <div className="container-fluid py-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="text-center mb-4">
              <h1 className="mb-3 text-primary fw-bold">
                <i className="bi bi-shop me-3"></i>
                Devenir vendeur sur papasow
              </h1>
              <p className="lead text-muted">Rejoignez notre marketplace et développez votre activité</p>
            </div>

            {/* Indicateur d'étapes */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  {etapes.map((etape, index) => (
                    <div key={index} className="col-3 text-center">
                      <div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${
                        etape.numero <= etapeActuelle ? 'bg-primary text-white' : 'bg-light text-muted'
                      }`} style={{width: 40, height: 40}}>
                        {etape.numero}
                      </div>
                      <small className={`fw-bold ${etape.numero <= etapeActuelle ? 'text-primary' : 'text-muted'}`}>
                        {etape.titre}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit}>
              {renderEtape()}
              
              {/* Boutons de navigation */}
              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={prevEtape}
                  disabled={etapeActuelle === 1}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Précédent
                </button>
                
                {etapeActuelle < 4 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={nextEtape}
                  >
                    Suivant
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={!formData.accepteConditions || !formData.acceptePolitique}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Soumettre ma demande
                  </button>
                )}
              </div>
            </form>

            {/* Informations supplémentaires */}
            <div className="mt-5">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <i className="bi bi-clock text-primary fs-1 mb-3"></i>
                      <h5>Validation rapide</h5>
                      <p className="small text-muted">Traitement de votre demande sous 48h</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <i className="bi bi-headset text-primary fs-1 mb-3"></i>
                      <h5>Support dédié</h5>
                      <p className="small text-muted">Accompagnement personnalisé</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <i className="bi bi-graph-up text-primary fs-1 mb-3"></i>
                      <h5>Croissance garantie</h5>
                      <p className="small text-muted">Accédez à des milliers de clients</p>
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