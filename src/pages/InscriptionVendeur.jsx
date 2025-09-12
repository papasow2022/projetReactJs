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
  const [errors, setErrors] = useState({});
  
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
    // Identité boutique (public)
    nomBoutique: '',
    slugBoutique: '',
    descriptionBoutique: '',
    siteWeb: '',
    emailSupport: '',
    telephoneSupport: '',
    paysImmatriculation: '',
    numeroTaxe: '', // TVA/NIU/SIREN fiscal
    // Logistique (variables selon mode)
    handlingTimeJours: '',
    methodeExpeditionDefaut: '',
    transporteursPreferes: '',
    adresseEntrepot: '',
    villeEntrepot: '',
    codePostalEntrepot: '',
    paysEntrepot: '',
    
    // Documents
    pieceIdentite: null,
    registreCommerce: null,
    justificatifAdresse: null,
    portfolio: null,
    accordFournisseur: null,
    
    // Coordonnées bancaires (payout)
    titulaireCompte: '',
    iban: '',
    bic: '',
    banqueNom: '',
    banquePays: 'Guinée',
    justificatifRib: null,

    // Mobile Money (optionnel)
    payoutMethod: 'bank', // 'bank' | 'mobile'
    mmNumero: '',
    mmOperateur: '',
    mmJustificatif: null,

    // Conditions
    accepteConditions: false,
    acceptePolitique: false
  });

  const handleInputChange = async (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files && files[0];
      if (!file) {
        setFormData(prev => ({ ...prev, [name]: null }));
        return;
      }
      const maxBytes = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const isAllowedType = allowedTypes.includes(file.type) || /\.(pdf|jpg|jpeg|png)$/i.test(file.name || '');
      const isAllowedSize = file.size <= maxBytes;

      // Stocker erreurs par champ
      setErrors(prev => ({
        ...prev,
        [name]: !isAllowedType ? 'Format invalide. Autorisés: PDF, JPG, PNG.' : !isAllowedSize ? 'Fichier trop volumineux (max 5MB).' : ''
      }));

      if (!isAllowedType || !isAllowedSize) {
        // Ne pas accepter le fichier invalide
        setFormData(prev => ({ ...prev, [name]: null }));
        return;
      }
      // Lire le contenu pour prévisualisation admin (base64)
      try {
        const reader = new FileReader();
        const dataUrl = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        setFormData(prev => ({ ...prev, [name]: { name: file.name, type: file.type, size: file.size, dataUrl } }));
      } catch (err) {
        setFormData(prev => ({ ...prev, [name]: { name: file.name, type: file.type, size: file.size } }));
      }
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Revalidation documents avant envoi
    if (!isEtape4Valid()) {
      setEtapeActuelle(4);
      return;
    }
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
        dateNaissance: formData.dateNaissance,
        pays: formData.pays,
        adresse: formData.adresse,
        ville: formData.ville,
        codePostal: formData.codePostal,
        numeroTaxe: formData.numeroTaxe,
        entreprise: {
          nom: formData.nomEntreprise,
          type: formData.typeEntreprise,
          secteur: formData.secteurActivite,
          siret: formData.numeroSiret,
          paysImmatriculation: formData.paysImmatriculation,
          adresse: formData.adresseEntreprise,
          ville: formData.villeEntreprise,
          codePostal: formData.codePostalEntreprise
        }
      },
      documents: {
        pieceIdentite: formData.pieceIdentite || null,
        registreCommerce: formData.registreCommerce || null,
        justificatifAdresse: formData.justificatifAdresse || null,
        portfolio: formData.portfolio || null,
        accordFournisseur: formData.accordFournisseur || null,
        listeProduits: formData.listeProduits || null
      },
      payout: {
        method: formData.payoutMethod,
        titulaireCompte: formData.titulaireCompte,
        iban: formData.iban,
        bic: formData.bic,
        banqueNom: formData.banqueNom,
        banquePays: formData.banquePays,
        justificatifRib: formData.justificatifRib || null,
        mobileMoney: formData.payoutMethod === 'mobile' ? {
          numero: formData.mmNumero,
          operateur: formData.mmOperateur,
          justificatif: formData.mmJustificatif || null
        } : null
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

  // Fonction pour déterminer les champs requis selon le type de vendeur
  const getRequiredFieldsForVendorType = (type) => {
    const requirements = {
      individuel: {
        showCompanyFields: false,
        showTaxFields: false,
        showLogisticsFields: true,
        showSlug: false,
        showDescription: false,
        showSiteWeb: false,
        showTransporteursPreferes: true,
        requiredDocuments: ['pieceIdentite', 'justificatifAdresse']
      },
      professionnel: {
        showCompanyFields: true,
        showTaxFields: true,
        showLogisticsFields: true,
        showSlug: false,
        showDescription: false,
        showSiteWeb: false,
        showTransporteursPreferes: false,
        requiredDocuments: ['pieceIdentite', 'registreCommerce', 'justificatifAdresse']
      },
      artisan: {
        showCompanyFields: false,
        showTaxFields: false,
        showLogisticsFields: true,
        showSlug: true,
        showDescription: true,
        showSiteWeb: true,
        showTransporteursPreferes: true,
        requiredDocuments: ['pieceIdentite', 'portfolio', 'justificatifAdresse']
      },
      dropshipping: {
        showCompanyFields: false,
        showTaxFields: false,
        showLogisticsFields: false,
        showSlug: true,
        showDescription: true,
        showSiteWeb: true,
        showTransporteursPreferes: false,
        requiredDocuments: ['pieceIdentite', 'accordFournisseur', 'justificatifAdresse']
      },
      fbp: {
        showCompanyFields: true,
        showTaxFields: true,
        showLogisticsFields: false,
        showSlug: false,
        showDescription: false,
        showSiteWeb: false,
        showTransporteursPreferes: false,
        requiredDocuments: ['pieceIdentite', 'registreCommerce', 'justificatifAdresse']
      }
    };
    return requirements[type] || requirements.professionnel;
  };

  const vendorRequirements = getRequiredFieldsForVendorType(formData.typeVendeur);

  // Validation par étape
  const isEtape2Valid = () => {
    const required = ['prenom', 'nom', 'email', 'telephone', 'dateNaissance', 'pays', 'adresse', 'ville', 'codePostal'];
    return required.every((key) => Boolean(formData[key] && String(formData[key]).trim() !== ''));
  };

  const isEtape3Valid = () => {
    // Identité boutique minimale
    if (!formData.nomBoutique || String(formData.nomBoutique).trim() === '') return false;
    // Secteur
    if (!formData.secteurActivite || String(formData.secteurActivite).trim() === '') return false;

    // Entreprise (si requis)
    if (vendorRequirements.showCompanyFields) {
      const companyRequired = ['nomEntreprise', 'typeEntreprise', 'paysImmatriculation', 'numeroSiret', 'adresseEntreprise', 'villeEntreprise', 'codePostalEntreprise'];
      const ok = companyRequired.every((key) => Boolean(formData[key] && String(formData[key]).trim() !== ''));
      if (!ok) return false;
    }

    // Logistique FBM (si visible et FBM)
    if (formData.fulfillmentMode === 'fbm' && vendorRequirements.showLogisticsFields) {
      const fbmRequired = ['handlingTimeJours', 'methodeExpeditionDefaut', 'adresseEntrepot', 'villeEntrepot', 'codePostalEntrepot', 'paysEntrepot'];
      const ok = fbmRequired.every((key) => Boolean(formData[key] || formData[key] === 0));
      if (!ok) return false;
    }

    // Support
    const supportRequired = ['emailSupport', 'telephoneSupport'];
    if (!supportRequired.every((k) => Boolean(formData[k] && String(formData[k]).trim() !== ''))) return false;

    return true;
  };

  const isEtape4Valid = () => {
    // Documents conditionnels
    const docs = vendorRequirements.requiredDocuments;
    for (const d of docs) {
      if (!formData[d]) return false;
      // Vérifier erreurs de type/taille pour chaque doc requis
      if (errors[d]) return false;
    }
    // FBP: listeProduits
    if (formData.typeVendeur === 'fbp') {
      if (!formData.listeProduits) return false;
      if (errors.listeProduits) return false;
    }
    return true;
  };

  const isCurrentStepValid = () => {
    switch (etapeActuelle) {
      case 1:
        return Boolean(formData.typeVendeur) && Boolean(formData.fulfillmentMode);
      case 2:
        return isEtape2Valid();
      case 3:
        return isEtape3Valid();
      case 4:
        return isEtape4Valid();
      case 5:
        return Boolean(formData.accepteConditions && formData.acceptePolitique);
      default:
        return false;
    }
  };

  const renderEtape3 = () => (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">
          <i className="bi bi-building me-2"></i>
          Informations professionnelles
        </h4>
      </div>
      <div className="card-body">
        {/* Affichage du type de vendeur sélectionné */}
        <div className="alert alert-info mb-4">
          <BiInfoCircle className="me-2" />
          <strong>Type de vendeur sélectionné :</strong> {typesVendeur[formData.typeVendeur]?.nom}
          <br />
          <strong>Mode de gestion :</strong> {formData.fulfillmentMode === 'fbm' ? 'FBM (Vous gérez)' : 'FBP (Nous gérons)'}
        </div>

        <div className="row g-3">
          {/* Identité publique de la boutique - TOUJOURS AFFICHÉE */}
          <div className="col-12">
            <h6 className="fw-bold text-muted">Identité publique de la boutique</h6>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Nom public de la boutique *</label>
            <input
              type="text"
              className="form-control"
              name="nomBoutique"
              value={formData.nomBoutique}
              onChange={handleInputChange}
              required
            />
          </div>
          {vendorRequirements.showSlug && (
            <div className="col-md-6">
              <label className="form-label fw-bold">URL de la boutique (slug)</label>
              <input
                type="text"
                className="form-control"
                name="slugBoutique"
                value={formData.slugBoutique}
                onChange={handleInputChange}
                placeholder="ex: boutique-mamadou"
              />
            </div>
          )}
          {vendorRequirements.showDescription && (
            <div className="col-12">
              <label className="form-label fw-bold">Description de la boutique</label>
              <textarea
                className="form-control"
                name="descriptionBoutique"
                rows={3}
                value={formData.descriptionBoutique}
                onChange={handleInputChange}
                placeholder="Présentez rapidement votre boutique et vos engagements"
              />
            </div>
          )}

          {/* Champs entreprise - CONDITIONNELS selon le type */}
          {vendorRequirements.showCompanyFields && (
            <>
              <div className="col-12">
                <h6 className="fw-bold text-muted mt-2">Informations entreprise</h6>
              </div>
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
                <label className="form-label fw-bold">Pays d'immatriculation *</label>
                <input
                  type="text"
                  className="form-control"
                  name="paysImmatriculation"
                  value={formData.paysImmatriculation}
                  onChange={handleInputChange}
                  required
                />
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
            </>
          )}

          {/* Champs fiscaux - CONDITIONNELS */}
          {vendorRequirements.showTaxFields && (
            <div className="col-md-6">
              <label className="form-label fw-bold">Numéro fiscal (TVA/NIU)</label>
              <input
                type="text"
                className="form-control"
                name="numeroTaxe"
                value={formData.numeroTaxe}
                onChange={handleInputChange}
                placeholder="Ex: FR12345678901 / GN-XXXX"
              />
            </div>
          )}

          {/* Secteur d'activité - TOUJOURS AFFICHÉ */}
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

          {/* Contacts et présence - TOUJOURS AFFICHÉS */}
          <div className="col-12">
            <h6 className="fw-bold text-muted mt-2">Support & présence</h6>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Email support *</label>
            <input
              type="email"
              className="form-control"
              name="emailSupport"
              value={formData.emailSupport}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Téléphone service client *</label>
            <input
              type="text"
              className="form-control"
              name="telephoneSupport"
              value={formData.telephoneSupport}
              onChange={handleInputChange}
              required
            />
          </div>
          {vendorRequirements.showSiteWeb && (
            <div className="col-md-6">
              <label className="form-label fw-bold">Site web</label>
              <input
                type="url"
                className="form-control"
                name="siteWeb"
                value={formData.siteWeb}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>
          )}

          {/* Logistique conditionnelle - FBM ET selon le type */}
          {formData.fulfillmentMode === 'fbm' && vendorRequirements.showLogisticsFields && (
            <>
              <div className="col-12">
                <h6 className="fw-bold text-muted mt-2">Paramètres logistiques (FBM)</h6>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Délai de préparation (jours) *</label>
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  name="handlingTimeJours"
                  value={formData.handlingTimeJours}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Méthode d'expédition par défaut *</label>
                <input
                  type="text"
                  className="form-control"
                  name="methodeExpeditionDefaut"
                  value={formData.methodeExpeditionDefaut}
                  onChange={handleInputChange}
                  placeholder="Colis standard, Express..."
                  required
                />
              </div>
              {vendorRequirements.showTransporteursPreferes && (
                <div className="col-md-4">
                  <label className="form-label fw-bold">Transporteurs préférés</label>
                  <input
                    type="text"
                    className="form-control"
                    name="transporteursPreferes"
                    value={formData.transporteursPreferes}
                    onChange={handleInputChange}
                    placeholder="DHL, La Poste, UPS..."
                  />
                </div>
              )}
              <div className="col-12">
                <label className="form-label fw-bold">Adresse d'entrepôt / d'expédition *</label>
                <input
                  type="text"
                  className="form-control"
                  name="adresseEntrepot"
                  value={formData.adresseEntrepot}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Ville *</label>
                <input
                  type="text"
                  className="form-control"
                  name="villeEntrepot"
                  value={formData.villeEntrepot}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Code postal *</label>
                <input
                  type="text"
                  className="form-control"
                  name="codePostalEntrepot"
                  value={formData.codePostalEntrepot}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">Pays *</label>
                <input
                  type="text"
                  className="form-control"
                  name="paysEntrepot"
                  value={formData.paysEntrepot}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          {/* Message pour FBP */}
          {formData.fulfillmentMode === 'fbp' && (
            <div className="col-12">
              <div className="alert alert-success">
                <BiPackage className="me-2" />
                <strong>FBP sélectionné :</strong> Vous n'avez pas besoin de paramètres logistiques. 
                Vous enverrez vos produits à notre entrepôt et nous gérerons l'expédition.
              </div>
            </div>
          )}

          {/* Message pour Dropshipping */}
          {formData.typeVendeur === 'dropshipping' && (
            <div className="col-12">
              <div className="alert alert-warning">
                <BiCar className="me-2" />
                <strong>Dropshipping :</strong> Vous n'avez pas besoin de paramètres logistiques. 
                Vos fournisseurs expédient directement aux clients.
              </div>
            </div>
          )}

          {/* Coordonnées bancaires et Mobile Money */}
          <div className="col-12">
            <h6 className="fw-bold text-muted mt-2">Coordonnées de versement</h6>
          </div>
          {formData.payoutMethod === 'bank' && (
          <div className="col-md-6">
            <label className="form-label fw-bold">Titulaire du compte *</label>
            <input type="text" className="form-control" name="titulaireCompte" value={formData.titulaireCompte} onChange={handleInputChange} required />
          </div>
          )}
          {formData.payoutMethod === 'bank' && (
          <div className="col-md-6">
            <label className="form-label fw-bold">IBAN / RIB *</label>
            <input type="text" className="form-control" name="iban" value={formData.iban} onChange={handleInputChange} placeholder="Ex: FR76... ou RIB local" required />
          </div>
          )}
          {formData.payoutMethod === 'bank' && (
          <div className="col-md-6">
            <label className="form-label fw-bold">BIC / SWIFT *</label>
            <input type="text" className="form-control" name="bic" value={formData.bic} onChange={handleInputChange} placeholder="Ex: AGRIFRPP" required />
          </div>
          )}
          {formData.payoutMethod === 'bank' && (
          <div className="col-md-6">
            <label className="form-label fw-bold">Banque *</label>
            <input type="text" className="form-control" name="banqueNom" value={formData.banqueNom} onChange={handleInputChange} required />
          </div>
          )}
          {formData.payoutMethod === 'bank' && (
          <div className="col-md-6">
            <label className="form-label fw-bold">Pays de la banque *</label>
            <select className="form-select" name="banquePays" value={formData.banquePays} onChange={handleInputChange} required>
              <option value="Guinée">Guinée</option>
              <option value="Sénégal">Sénégal</option>
              <option value="Côte d'Ivoire">Côte d'Ivoire</option>
              <option value="Mali">Mali</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="France">France</option>
            </select>
          </div>
          )}
          {formData.payoutMethod === 'bank' && (
          <div className="col-md-6">
            <label className="form-label fw-bold">Justificatif (RIB/attestation) *</label>
            <input type="file" className="form-control" name="justificatifRib" onChange={handleInputChange} accept=".pdf,.jpg,.jpeg,.png" required />
            {errors.justificatifRib && <div className="text-danger small mt-1">{errors.justificatifRib}</div>}
          </div>
          )}

          <div className="col-12 mt-2">
            <div className="d-flex align-items-center gap-3">
              <div className="form-check">
                <input className="form-check-input" type="radio" name="payoutMethod" id="payoutBank" value="bank" checked={formData.payoutMethod === 'bank'} onChange={handleInputChange} />
                <label className="form-check-label" htmlFor="payoutBank">Virement bancaire</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="payoutMethod" id="payoutMobile" value="mobile" checked={formData.payoutMethod === 'mobile'} onChange={handleInputChange} />
                <label className="form-check-label" htmlFor="payoutMobile">Mobile Money</label>
              </div>
            </div>
          </div>

          {formData.payoutMethod === 'mobile' && (
            <>
              <div className="col-md-6">
                <label className="form-label fw-bold">Numéro Mobile Money</label>
                <input type="text" className="form-control" name="mmNumero" value={formData.mmNumero} onChange={handleInputChange} placeholder="Ex: +2246xxxxxxx" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Opérateur</label>
                <select className="form-select" name="mmOperateur" value={formData.mmOperateur} onChange={handleInputChange}>
                  <option value="">Sélectionner</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="MTN Mobile Money">MTN Mobile Money</option>
                  <option value="Moov">Moov</option>
                  <option value="Wave">Wave</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Justificatif Mobile Money</label>
                <input type="file" className="form-control" name="mmJustificatif" onChange={handleInputChange} accept=".pdf,.jpg,.jpeg,.png" />
                {errors.mmJustificatif && <div className="text-danger small mt-1">{errors.mmJustificatif}</div>}
              </div>
            </>
          )}
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
        
        <div className="alert alert-warning mb-4">
          <BiInfoCircle className="me-2" />
          <strong>Type de vendeur :</strong> {typesVendeur[formData.typeVendeur]?.nom}
          <br />
          <strong>Documents requis :</strong> {vendorRequirements.requiredDocuments.length} document(s) à fournir
        </div>
        
        <div className="row g-3">
          {/* Pièce d'identité - TOUJOURS REQUIS */}
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
            {errors.pieceIdentite && <div className="text-danger small mt-1">{errors.pieceIdentite}</div>}
            <small className="text-muted">Carte d'identité, passeport ou permis de conduire</small>
          </div>

          {/* Registre de commerce - CONDITIONNEL */}
          {vendorRequirements.requiredDocuments.includes('registreCommerce') && (
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
              {errors.registreCommerce && <div className="text-danger small mt-1">{errors.registreCommerce}</div>}
              <small className="text-muted">Extrait Kbis ou équivalent</small>
            </div>
          )}

          {/* Portfolio - CONDITIONNEL (Artisan) */}
          {vendorRequirements.requiredDocuments.includes('portfolio') && (
            <div className="col-md-6">
              <label className="form-label fw-bold">Portfolio de créations *</label>
              <input
                type="file"
                className="form-control"
                name="portfolio"
                onChange={handleInputChange}
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
              {errors.portfolio && <div className="text-danger small mt-1">{errors.portfolio}</div>}
              <small className="text-muted">Photos de vos créations artisanales</small>
            </div>
          )}

          {/* Accord fournisseur - CONDITIONNEL (Dropshipping) */}
          {vendorRequirements.requiredDocuments.includes('accordFournisseur') && (
            <div className="col-md-6">
              <label className="form-label fw-bold">Accord avec fournisseur *</label>
              <input
                type="file"
                className="form-control"
                name="accordFournisseur"
                onChange={handleInputChange}
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
              {errors.accordFournisseur && <div className="text-danger small mt-1">{errors.accordFournisseur}</div>}
              <small className="text-muted">Contrat ou accord avec votre fournisseur dropshipping</small>
            </div>
          )}

          {/* Justificatif d'adresse - TOUJOURS REQUIS */}
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
            {errors.justificatifAdresse && <div className="text-danger small mt-1">{errors.justificatifAdresse}</div>}
            <small className="text-muted">Facture récente (électricité, eau, téléphone)</small>
          </div>

          {/* Documents supplémentaires pour FBP */}
          {formData.typeVendeur === 'fbp' && (
            <div className="col-md-6">
              <label className="form-label fw-bold">Liste des produits à envoyer *</label>
              <input
                type="file"
                className="form-control"
                name="listeProduits"
                onChange={handleInputChange}
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
              {errors.listeProduits && <div className="text-danger small mt-1">{errors.listeProduits}</div>}
              <small className="text-muted">Catalogue ou liste des produits que vous souhaitez envoyer à notre entrepôt</small>
            </div>
          )}
        </div>

        {/* Résumé des documents requis */}
        <div className="mt-4">
          <h6 className="fw-bold">Résumé des documents requis :</h6>
          <ul className="list-unstyled">
            {vendorRequirements.requiredDocuments.map((doc, index) => {
              const docNames = {
                pieceIdentite: 'Pièce d\'identité',
                registreCommerce: 'Registre de commerce',
                portfolio: 'Portfolio de créations',
                accordFournisseur: 'Accord avec fournisseur',
                justificatifAdresse: 'Justificatif d\'adresse'
              };
              return (
                <li key={index} className="mb-1">
                  <BiCheckCircle className="me-2 text-success" size={16} />
                  {docNames[doc]}
                </li>
              );
            })}
            {formData.typeVendeur === 'fbp' && (
              <li className="mb-1">
                <BiCheckCircle className="me-2 text-success" size={16} />
                Liste des produits à envoyer
              </li>
            )}
          </ul>
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
            <h6 className="fw-bold">Type de compte</h6>
            <p className="small mb-0">Type: {typesVendeur[formData.typeVendeur]?.nom || formData.typeVendeur}</p>
            <p className="small">Mode de gestion: {formData.fulfillmentMode?.toUpperCase()}</p>
          </div>
          <div className="col-md-6">
            <h6 className="fw-bold">Identité boutique</h6>
            <p className="small mb-0">Nom public: {formData.nomBoutique || '-'}</p>
            {formData.slugBoutique && <p className="small mb-0">Slug: {formData.slugBoutique}</p>}
            {formData.descriptionBoutique && <p className="small">Description: {formData.descriptionBoutique}</p>}
          </div>
        </div>

        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <h6 className="fw-bold">Informations personnelles</h6>
            <p className="small mb-0">{formData.prenom} {formData.nom}</p>
            <p className="small mb-0">{formData.email}</p>
            <p className="small">{formData.telephone}</p>
          </div>
          <div className="col-md-6">
            <h6 className="fw-bold">Entreprise</h6>
            <p className="small mb-0">{formData.nomEntreprise || '-'}</p>
            <p className="small mb-0">{formData.typeEntreprise || '-'}</p>
            <p className="small mb-0">SIRET/RC: {formData.numeroSiret || '-'}</p>
            <p className="small mb-0">Pays d'immatriculation: {formData.paysImmatriculation || '-'}</p>
            <p className="small mb-0">{formData.adresseEntreprise || '-'}{formData.villeEntreprise ? `, ${formData.villeEntreprise}` : ''}{formData.codePostalEntreprise ? `, ${formData.codePostalEntreprise}` : ''}</p>
            <p className="small">Secteur: {formData.secteurActivite || '-'}</p>
          </div>
        </div>

        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <h6 className="fw-bold">Support & contact</h6>
            <p className="small mb-0">Email support: {formData.emailSupport || '-'}</p>
            <p className="small">Téléphone: {formData.telephoneSupport || '-'}</p>
          </div>
          {formData.fulfillmentMode === 'fbm' && (
            <div className="col-md-6">
              <h6 className="fw-bold">Logistique (FBM)</h6>
              <p className="small mb-0">Délai de préparation: {String(formData.handlingTimeJours || '').toString()} jour(s)</p>
              <p className="small mb-0">Méthode d'expédition: {formData.methodeExpeditionDefaut || '-'}</p>
              <p className="small">Entrepôt: {formData.adresseEntrepot || '-'}{formData.villeEntrepot ? `, ${formData.villeEntrepot}` : ''}{formData.codePostalEntrepot ? `, ${formData.codePostalEntrepot}` : ''}{formData.paysEntrepot ? `, ${formData.paysEntrepot}` : ''}</p>
            </div>
          )}
        </div>

        <div className="mt-2">
          <h6 className="fw-bold">Documents fournis</h6>
          <ul className="small mb-0">
            {vendorRequirements.requiredDocuments.map((doc) => {
              const labels = {
                pieceIdentite: "Pièce d'identité",
                registreCommerce: 'Registre de commerce',
                justificatifAdresse: "Justificatif d'adresse",
                portfolio: 'Portfolio de créations',
                accordFournisseur: 'Accord avec fournisseur'
              };
              const provided = !!formData[doc];
              return (
                <li key={doc}>
                  {labels[doc]}: {provided ? 'fourni' : 'manquant'}
                </li>
              );
            })}
          </ul>
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
                    disabled={!isCurrentStepValid()}
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