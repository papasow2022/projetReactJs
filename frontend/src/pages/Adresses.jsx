import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Card, Alert, Badge } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { BsHouse, BsBuilding, BsStar, BsStarFill, BsTrash, BsPencil, BsPlus, BsGeoAlt } from "react-icons/bs";

const addressTypes = {
  LIVRAISON: 'livraison',
  FACTURATION: 'facturation', 
  CADEAU: 'cadeau'
};

const placeTypes = {
  MAISON: 'maison',
  APPARTEMENT: 'appartement',
  BUREAU: 'bureau',
  ENTREPRISE: 'entreprise',
  MAGASIN: 'magasin',
  ECOLE: 'ecole',
  HOPITAL: 'hopital',
  HOTEL: 'hotel',
  RESIDENCE: 'residence',
  VILLA: 'villa',
  IMMEUBLE: 'immeuble',
  AUTRE: 'autre'
};

const defaultAdresses = [
  {
    id: 1,
    nom: "Ousmane Diallo",
    adresse: "Sabou",
    telephone: "666706273",
    ville: "Mamou",
    codePostal: "",
    pays: "La Guinée",
    type: addressTypes.LIVRAISON,
    placeType: placeTypes.MAISON,
    isDefault: true,
    instructions: "",
    nomDestinataire: "Ousmane Diallo"
  }
];

const Adresses = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [adresses, setAdresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ 
    nom: "", 
    adresse: "", 
    telephone: "", 
    ville: "", 
    codePostal: "", 
    pays: "La Guinée",
    type: addressTypes.LIVRAISON,
    placeType: placeTypes.MAISON,
    isDefault: false,
    instructions: "",
    nomDestinataire: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setError("Vous devez être connecté pour gérer vos adresses.");
      return;
    }

    // Charger les adresses de l'utilisateur connecté
    const userAddresses = localStorage.getItem(`adresses_${user.email}`);
    if (userAddresses) {
      setAdresses(JSON.parse(userAddresses));
    } else {
      // Adresse par défaut basée sur le profil utilisateur
      const defaultAddress = {
        id: Date.now(),
        nom: user.prenom && user.nom ? `${user.prenom} ${user.nom}` : "Ousmane Diallo",
        adresse: "Sabou",
        telephone: user.phone || "666706273",
        ville: "Mamou",
        codePostal: "",
        pays: "La Guinée",
        type: addressTypes.LIVRAISON,
        placeType: placeTypes.MAISON,
        isDefault: true,
        instructions: "",
        nomDestinataire: user.prenom && user.nom ? `${user.prenom} ${user.nom}` : "Ousmane Diallo"
      };
      setAdresses([defaultAddress]);
      saveAddresses([defaultAddress]);
    }
  }, [user, isAuthenticated]);

  const saveAddresses = (addressesToSave) => {
    if (user && user.email) {
      localStorage.setItem(`adresses_${user.email}`, JSON.stringify(addressesToSave));
    }
  };

  const handleShow = (idx = null) => {
    if (!isAuthenticated) {
      setError("Vous devez être connecté pour modifier vos adresses.");
      return;
    }

    setEditIndex(idx);
    if (idx !== null) {
      setForm(adresses[idx]);
    } else {
      setForm({ 
        nom: user ? `${user.prenom} ${user.nom}` : "Ousmane Diallo", 
        adresse: "Sabou", 
        telephone: user ? user.phone || "666706273" : "666706273", 
        ville: "Mamou", 
        codePostal: "", 
        pays: "La Guinée",
        type: addressTypes.LIVRAISON,
        placeType: placeTypes.MAISON,
        isDefault: false,
        instructions: "",
        nomDestinataire: user ? `${user.prenom} ${user.nom}` : "Ousmane Diallo"
      });
    }
    setShowModal(true);
    setError("");
  };

  const handleClose = () => {
    setShowModal(false);
    setEditIndex(null);
    setForm({ 
      nom: "", 
      adresse: "", 
      telephone: "", 
      ville: "", 
      codePostal: "", 
      pays: "La Guinée",
      type: addressTypes.LIVRAISON,
      placeType: placeTypes.MAISON,
      isDefault: false,
      instructions: "",
      nomDestinataire: ""
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError("Vous devez être connecté pour modifier vos adresses.");
      return;
    }

    try {
      let updatedAddresses = [...adresses];
      
      if (editIndex !== null) {
        // Modification d'une adresse existante
        updatedAddresses[editIndex] = { ...form, id: adresses[editIndex].id };
        setMessage("Adresse modifiée avec succès !");
      } else {
        // Ajout d'une nouvelle adresse
        const newAddress = { ...form, id: Date.now() };
        updatedAddresses.push(newAddress);
        setMessage("Adresse ajoutée avec succès !");
      }

      // Gérer l'adresse par défaut
      if (form.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === (editIndex !== null ? adresses[editIndex].id : form.id)
        }));
      }

      setAdresses(updatedAddresses);
      saveAddresses(updatedAddresses);
      handleClose();
      setError("");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setError("Erreur lors de la sauvegarde de l'adresse.");
      setMessage("");
    }
  };

  const handleDelete = (idx) => {
    if (!isAuthenticated) {
      setError("Vous devez être connecté pour supprimer vos adresses.");
      return;
    }

    if (window.confirm("Supprimer cette adresse ?")) {
      const updated = adresses.filter((_, i) => i !== idx);
      setAdresses(updated);
      saveAddresses(updated);
      setMessage("Adresse supprimée.");
      setError("");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSetDefault = (idx) => {
    if (!isAuthenticated) return;

    const updated = adresses.map((addr, i) => ({
      ...addr,
      isDefault: i === idx
    }));
    setAdresses(updated);
    saveAddresses(updated);
    setMessage("Adresse par défaut mise à jour !");
    setTimeout(() => setMessage(""), 3000);
  };

  const resetToDefaultAddress = () => {
    const defaultAddress = {
      id: Date.now(),
      nom: "Ousmane Diallo",
      adresse: "Sabou",
      telephone: "666706273",
      ville: "Mamou",
      codePostal: "",
      pays: "La Guinée",
      type: addressTypes.LIVRAISON,
      placeType: placeTypes.MAISON,
      isDefault: true,
      instructions: "",
      nomDestinataire: "Ousmane Diallo"
    };
    setAdresses([defaultAddress]);
    saveAddresses([defaultAddress]);
    setMessage("Adresse par défaut restaurée avec succès !");
    setTimeout(() => setMessage(""), 3000);
  };

  const getTypeBadge = (type) => {
    const badges = {
      [addressTypes.LIVRAISON]: { variant: 'primary', text: 'Livraison' },
      [addressTypes.FACTURATION]: { variant: 'success', text: 'Facturation' },
      [addressTypes.CADEAU]: { variant: 'warning', text: 'Cadeau' }
    };
    return badges[type] || badges[addressTypes.LIVRAISON];
  };

  const getPlaceIcon = (placeType) => {
    const icons = {
      [placeTypes.MAISON]: <BsHouse className="text-primary" />,
      [placeTypes.APPARTEMENT]: <BsBuilding className="text-info" />,
      [placeTypes.BUREAU]: <BsBuilding className="text-success" />,
      [placeTypes.ENTREPRISE]: <BsBuilding className="text-warning" />,
      [placeTypes.MAGASIN]: <BsBuilding className="text-danger" />,
      [placeTypes.ECOLE]: <BsBuilding className="text-primary" />,
      [placeTypes.HOPITAL]: <BsBuilding className="text-danger" />,
      [placeTypes.HOTEL]: <BsBuilding className="text-warning" />,
      [placeTypes.RESIDENCE]: <BsBuilding className="text-info" />,
      [placeTypes.VILLA]: <BsHouse className="text-success" />,
      [placeTypes.IMMEUBLE]: <BsBuilding className="text-secondary" />,
      [placeTypes.AUTRE]: <BsGeoAlt className="text-secondary" />
    };
    return icons[placeType] || icons[placeTypes.MAISON];
  };

  // Si l'utilisateur n'est pas connecté, afficher un message et un bouton de connexion
  if (!isAuthenticated) {
    return (
      <div className="container my-4" style={{maxWidth:700}}>
        <Card className="shadow-sm">
          <Card.Body className="text-center">
            <h2 className="mb-3">🔒 Accès restreint</h2>
            <p className="text-muted mb-4">
              Vous devez être connecté pour gérer vos adresses de livraison et de facturation.
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/connexion')}
              className="me-2"
            >
              Se connecter
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={() => navigate('/inscription')}
            >
              Créer un compte
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="container my-4" style={{maxWidth:900}}>
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-3">
            <BsGeoAlt className="me-2 text-primary" size={28}/>
            Mes adresses
          </h2>
          <p className="text-muted mb-4">
            Gérez vos adresses de livraison, de facturation et de cadeaux. Vous pouvez définir une adresse par défaut pour vos commandes.
          </p>
          
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
          {message && <Alert variant="success" className="mb-3">{message}</Alert>}
          
          <div className="d-flex gap-2 mb-4">
            <Button 
              variant="success" 
              className="d-flex align-items-center" 
              onClick={() => handleShow()}
            >
              <BsPlus className="me-2"/> Ajouter une adresse
            </Button>
            <Button 
              variant="outline-warning" 
              className="d-flex align-items-center" 
              onClick={resetToDefaultAddress}
            >
              <BsStar className="me-2"/> Restaurer l'adresse par défaut
            </Button>
          </div>
          
          <div className="row">
            {adresses.length === 0 && (
              <div className="col-12 text-center py-5">
                <BsGeoAlt size={48} className="text-muted mb-3"/>
                <h5 className="text-muted">Aucune adresse enregistrée</h5>
                <p className="text-muted">Ajoutez votre première adresse pour commencer à commander.</p>
              </div>
            )}
            
            {adresses.map((adr, idx) => (
              <div className="col-md-6 col-lg-4 mb-3" key={adr.id}>
                <Card className={`shadow-sm h-100 ${adr.isDefault ? 'border-primary' : ''}`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center">
                        {getPlaceIcon(adr.placeType)}
                        <span className="ms-2 fw-bold">Adresse de livraison</span>
                      </div>
                      <div className="d-flex gap-1">
                        <Badge bg={getTypeBadge(adr.type).variant} className="me-1">
                          {getTypeBadge(adr.type).text}
                        </Badge>
                        {adr.isDefault && (
                          <Badge bg="warning" text="dark">
                            <BsStarFill className="me-1"/> Par défaut
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Card.Text className="mb-3">
                      <div className="mb-1">
                        <strong>Nom complet :</strong> {adr.nom}
                      </div>
                      <div className="mb-1">
                        <strong>Adresse :</strong> {adr.adresse}
                      </div>
                      <div className="mb-1">
                        <strong>Ville :</strong> {adr.ville}{adr.codePostal && `, ${adr.codePostal}`}
                      </div>
                      <div className="mb-1">
                        <strong>Pays :</strong> {adr.pays}
                      </div>
                      <div className="mb-1">
                        <strong>Téléphone :</strong> {adr.telephone}
                      </div>
                      <div className="mb-1">
                        <strong>Type de lieu :</strong> {
                          adr.placeType === 'maison' ? 'Maison' : 
                          adr.placeType === 'bureau' ? 'Bureau' : 
                          adr.placeType === 'appartement' ? 'Appartement' :
                          adr.placeType === 'entreprise' ? 'Entreprise' :
                          adr.placeType === 'magasin' ? 'Magasin' :
                          adr.placeType === 'ecole' ? 'École/Université' :
                          adr.placeType === 'hopital' ? 'Hôpital/Clinique' :
                          adr.placeType === 'hotel' ? 'Hôtel' :
                          adr.placeType === 'residence' ? 'Résidence' :
                          adr.placeType === 'villa' ? 'Villa' :
                          adr.placeType === 'immeuble' ? 'Immeuble' : 'Autre'
                        }
                      </div>
                      {adr.instructions && (
                        <div className="text-muted small mt-2">
                          <strong>Instructions :</strong> {adr.instructions}
                        </div>
                      )}
                    </Card.Text>
                    
                    <div className="d-flex gap-2 flex-wrap">
                      {!adr.isDefault && (
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          onClick={() => handleSetDefault(idx)}
                          className="d-flex align-items-center"
                        >
                          <BsStar className="me-1"/> Définir par défaut
                        </Button>
                      )}
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => handleShow(idx)}
                        className="d-flex align-items-center"
                      >
                        <BsPencil className="me-1"/> Modifier
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => handleDelete(idx)}
                        className="d-flex align-items-center"
                      >
                        <BsTrash className="me-1"/> Supprimer
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Modal ajout/modif */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editIndex !== null ? "Modifier l'adresse" : "Ajouter une adresse"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nom complet *</Form.Label>
                  <Form.Control 
                    name="nom" 
                    value={form.nom} 
                    onChange={handleChange} 
                    required 
                    placeholder="Nom et prénom"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Label>Type d'adresse *</Form.Label>
                <Form.Select name="type" value={form.type} onChange={handleChange} required>
                  <option value={addressTypes.LIVRAISON}>Adresse de livraison</option>
                  <option value={addressTypes.FACTURATION}>Adresse de facturation</option>
                  <option value={addressTypes.CADEAU}>Adresse de cadeau</option>
                </Form.Select>
              </div>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>Adresse *</Form.Label>
              <Form.Control 
                name="adresse" 
                value={form.adresse} 
                onChange={handleChange} 
                required 
                placeholder="Numéro et nom de rue"
              />
            </Form.Group>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Ville *</Form.Label>
                  <Form.Control 
                    name="ville" 
                    value={form.ville} 
                    onChange={handleChange} 
                    required 
                    placeholder="Ville"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Code postal</Form.Label>
                  <Form.Control 
                    name="codePostal" 
                    value={form.codePostal} 
                    onChange={handleChange} 
                    placeholder="Code postal (optionnel)"
                  />
                </Form.Group>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Pays *</Form.Label>
                  <Form.Select name="pays" value={form.pays} onChange={handleChange} required>
                    <option value="La Guinée">La Guinée</option>
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Canada">Canada</option>
                    <option value="Guinee">Guinée</option>
                    <option value="Senegal">Sénégal</option>
                    <option value="Mali">Mali</option>
                    <option value="CoteIvoire">Côte d'Ivoire</option>
                    <option value="BurkinaFaso">Burkina Faso</option>
                    <option value="Niger">Niger</option>
                    <option value="Tchad">Tchad</option>
                    <option value="Cameroun">Cameroun</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Congo">Congo</option>
                    <option value="RDC">République Démocratique du Congo</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Burundi">Burundi</option>
                    <option value="Tanzanie">Tanzanie</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Ouganda">Ouganda</option>
                    <option value="Ethiopie">Éthiopie</option>
                    <option value="Somalie">Somalie</option>
                    <option value="Djibouti">Djibouti</option>
                    <option value="Erythree">Érythrée</option>
                    <option value="Soudan">Soudan</option>
                    <option value="SoudanSud">Soudan du Sud</option>
                    <option value="Egypte">Égypte</option>
                    <option value="Libye">Libye</option>
                    <option value="Tunisie">Tunisie</option>
                    <option value="Algerie">Algérie</option>
                    <option value="Maroc">Maroc</option>
                    <option value="Mauritanie">Mauritanie</option>
                    <option value="Gambie">Gambie</option>
                    <option value="GuineeBissau">Guinée-Bissau</option>
                    <option value="SierraLeone">Sierra Leone</option>
                    <option value="Liberia">Libéria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Togo">Togo</option>
                    <option value="Benin">Bénin</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="RCA">République Centrafricaine</option>
                    <option value="GuineeEquatoriale">Guinée Équatoriale</option>
                    <option value="SaoTome">São Tomé-et-Principe</option>
                    <option value="Angola">Angola</option>
                    <option value="Zambie">Zambie</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Namibie">Namibie</option>
                    <option value="AfriqueSud">Afrique du Sud</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Eswatini">Eswatini</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="Madagascar">Madagascar</option>
                    <option value="Comores">Comores</option>
                    <option value="Maurice">Maurice</option>
                    <option value="Seychelles">Seychelles</option>
                    <option value="Autre">Autre</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Téléphone *</Form.Label>
                  <Form.Control 
                    name="telephone" 
                    value={form.telephone} 
                    onChange={handleChange} 
                    required 
                    placeholder="0601020304"
                  />
                </Form.Group>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Label>Type de lieu</Form.Label>
                <Form.Select name="placeType" value={form.placeType} onChange={handleChange}>
                  <option value={placeTypes.MAISON}>Maison</option>
                  <option value={placeTypes.APPARTEMENT}>Appartement</option>
                  <option value={placeTypes.BUREAU}>Bureau</option>
                  <option value={placeTypes.ENTREPRISE}>Entreprise</option>
                  <option value={placeTypes.MAGASIN}>Magasin</option>
                  <option value={placeTypes.ECOLE}>École/Université</option>
                  <option value={placeTypes.HOPITAL}>Hôpital/Clinique</option>
                  <option value={placeTypes.HOTEL}>Hôtel</option>
                  <option value={placeTypes.RESIDENCE}>Résidence</option>
                  <option value={placeTypes.VILLA}>Villa</option>
                  <option value={placeTypes.IMMEUBLE}>Immeuble</option>
                  <option value={placeTypes.AUTRE}>Autre</option>
                </Form.Select>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="isDefault"
                    checked={form.isDefault}
                    onChange={(e) => setForm({...form, isDefault: e.target.checked})}
                    label="Définir comme adresse par défaut"
                  />
                </Form.Group>
              </div>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>Instructions de livraison (optionnel)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2}
                name="instructions" 
                value={form.instructions} 
                onChange={handleChange} 
                placeholder="Code, étage, instructions spéciales..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Annuler</Button>
            <Button variant="primary" type="submit">
              {editIndex !== null ? "Enregistrer" : "Ajouter"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Adresses; 