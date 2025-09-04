import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLanguage } from "../contexts/LanguageContext";
import { useVendor } from '../contexts/VendorContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  BiUser, 
  BiStore, 
  BiPalette, 
  BiCar, 
  BiPackage,
  BiCheckCircle, 
  BiXCircle,
  BiInfoCircle,
  BiShield,
  BiCreditCard,
  BiGlobe
} from 'react-icons/bi';

const typesVendeur = {
  individuel: {
    nom: 'Vendeur Individuel',
    icon: BiUser,
    description: 'Pour les particuliers qui vendent occasionnellement',
    commission: '8%',
    fraisMensuels: 'Aucun',
    limitations: ['Maximum 40 produits', 'Fonctionnalités limitées'],
    documents: ['Pièce d\'identité', 'Justificatif d\'adresse']
  },
  professionnel: {
    nom: 'Vendeur Professionnel',
    icon: BiStore,
    description: 'Pour les entreprises et commerçants',
    commission: '5%',
    fraisMensuels: '29€/mois',
    limitations: ['Documents d\'entreprise requis'],
    documents: ['Pièce d\'identité', 'Registre de commerce', 'Justificatif d\'adresse']
  },
  artisan: {
    nom: 'Vendeur Artisan',
    icon: BiPalette,
    description: 'Pour les créateurs et artisans',
    commission: '6%',
    fraisMensuels: 'Aucun',
    limitations: ['Produits artisanaux uniquement', 'Validation manuelle'],
    documents: ['Pièce d\'identité', 'Portfolio de créations', 'Justificatif d\'adresse']
  },
  dropshipping: {
    nom: 'Vendeur Dropshipping',
    icon: BiCar,
    description: 'Pour vendre sans stock',
    commission: '10%',
    fraisMensuels: 'Aucun',
    limitations: ['Marge réduite', 'Moins de contrôle qualité'],
    documents: ['Pièce d\'identité', 'Accord avec fournisseur', 'Justificatif d\'adresse']
  },
  fbp: {
    nom: 'Fulfillment by Papasow',
    icon: BiPackage,
    description: 'Envoyez vos produits, nous gérons la logistique',
    commission: '12%',
    fraisMensuels: 'Frais de stockage selon volume',
    limitations: ['Frais de stockage', 'Processus d\'envoi initial'],
    documents: ['Pièce d\'identité', 'Justificatif d\'adresse', 'Liste des produits à envoyer'],
    badge: 'POPULAIRE'
  }
};

const etapes = [
  { numero: 1, titre: 'Type de compte', statut: 'active' },
  { numero: 2, titre: 'Informations personnelles', statut: 'pending' },
  { numero: 3, titre: 'Informations professionnelles', statut: 'pending' },
  { numero: 4, titre: 'Documents requis', statut: 'pending' },
  { numero: 5, titre: 'Validation', statut: 'pending' }
];

export default function InscriptionVendeur() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, updateUser } = useAuth();
  const { createVendor } = useVendor();
  const [etapeActuelle, setEtapeActuelle] = useState(1);
  const [typeVendeur, setTypeVendeur] = useState(searchParams.get('type') || 'professionnel');
  
  const [formData, setFormData] = useState({
    // Type de compte
    typeVendeur: searchParams.get('type') || 'professionnel',
    // Mode de fulfillment (gestion des commandes/expédition)
    fulfillmentMode: 'fbm', // 'fbm' (le vendeur gère) ou 'fbp' (le site gère)
    
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
    portfolio: null,
    accordFournisseur: null,
    
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
    
    // Créer l'entité vendeur (mock) et récupérer un vendorId
    const creation = createVendor({
      typeVendeur: formData.typeVendeur,
      fulfillmentMode: formData.fulfillmentMode,
      informations: {
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        pays: formData.pays,
        adresse: formData.adresse,
        ville: formData.ville,
        codePostal: formData.codePostal,
        entreprise: {
          nom: formData.nomEntreprise,
          type: formData.typeEntreprise,
          secteur: formData.secteurActivite,
          siret: formData.numeroSiret,
          adresse: formData.adresseEntreprise,
          ville: formData.villeEntreprise,
          codePostal: formData.codePostalEntreprise
        }
      },
      documents: {
        pieceIdentite: !!formData.pieceIdentite,
        registreCommerce: !!formData.registreCommerce,
        justificatifAdresse: !!formData.justificatifAdresse,
        portfolio: !!formData.portfolio,
        accordFournisseur: !!formData.accordFournisseur
      }
    });

    const vendorId = creation?.vendorId || ('VD-' + Date.now());

    // Mettre à jour le statut utilisateur pour devenir vendeur (en attente de validation)
    if (user) {
      updateUser({
        isVendor: true,
        isVendorValidated: false,
        vendorId,
        vendorStatus: 'pending',
        fulfillmentMode: formData.fulfillmentMode
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
          <BiStore className="me-2" />
          Choisissez votre type de compte vendeur
        </h4>
      </div>
      <div className="card-body">
        <p className="text-muted mb-4">
          Sélectionnez le type de compte qui correspond le mieux à votre activité. 
          Vous pourrez modifier ce choix plus tard.
        </p>
        
        <div className="row g-4">
          {Object.entries(typesVendeur).map(([key, type]) => (
            <div key={key} className="col-md-6">
              <div 
                className={`card h-100 ${typeVendeur === key ? 'border-primary' : 'border-light'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setTypeVendeur(key);
                  setFormData(prev => ({ ...prev, typeVendeur: key }));
                }}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <type.icon size={32} className={`me-3 ${typeVendeur === key ? 'text-primary' : 'text-muted'}`} />
                    <div>
                      <h5 className="card-title mb-1">{type.nom}</h5>
                      <small className="text-muted">{type.description}</small>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Commission:</span>
                      <strong className="text-primary">{type.commission}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Frais mensuels:</span>
                      <strong>{type.fraisMensuels}</strong>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-muted">Limitations:</h6>
                    <ul className="list-unstyled">
                      {type.limitations.map((limitation, index) => (
                        <li key={index} className="small text-muted">
                          <BiXCircle className="me-1 text-danger" size={14} />
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {typeVendeur === key && (
                    <div className="alert alert-primary mb-0">
                      <BiCheckCircle className="me-2" />
                      <strong>Compte sélectionné</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sélection du mode de fulfillment */}
        <div className="mt-4">
          <h5 className="fw-bold mb-2">Mode de gestion des commandes</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <div className={`border rounded p-3 h-100 ${formData.fulfillmentMode === 'fbm' ? 'border-primary' : 'border-light'}`} style={{ cursor: 'pointer' }} onClick={() => setFormData(prev => ({ ...prev, fulfillmentMode: 'fbm' }))}>
                <div className="d-flex align-items-start">
                  <input type="radio" className="form-check-input me-2 mt-1" name="fulfillmentMode" checked={formData.fulfillmentMode === 'fbm'} onChange={() => setFormData(prev => ({ ...prev, fulfillmentMode: 'fbm' }))} />
                  <div>
                    <div className="fw-bold">FBM — Le vendeur gère (préparation et expédition)</div>
                    <small className="text-muted">Vous préparez et expédiez les commandes. Vous contrôlez la logistique.</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className={`border rounded p-3 h-100 ${formData.fulfillmentMode === 'fbp' ? 'border-primary' : 'border-light'}`} style={{ cursor: 'pointer' }} onClick={() => setFormData(prev => ({ ...prev, fulfillmentMode: 'fbp' }))}>
                <div className="d-flex align-items-start">
                  <input type="radio" className="form-check-input me-2 mt-1" name="fulfillmentMode" checked={formData.fulfillmentMode === 'fbp'} onChange={() => setFormData(prev => ({ ...prev, fulfillmentMode: 'fbp' }))} />
                  <div>
                    <div className="fw-bold">FBP — Le site gère (stockage et expédition)</div>
                    <small className="text-muted">Vous envoyez le stock à notre entrepôt. Nous expédions aux clients.</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEtape2 = () => (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">
          <BiUser className="me-2" />
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

  const renderEtape3 = () => (
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

  const renderEtape4 = () => (
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

  const renderEtape5 = () => (
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
      case 5: return renderEtape5();
      default: return renderEtape1();
    }
  };

  const nextEtape = () => {
    if (etapeActuelle < 5) {
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
                    <div key={index} className="col text-center">
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
                
                {etapeActuelle < 5 ? (
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