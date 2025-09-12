import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Button, Modal, Form, Card, Badge, Alert, Dropdown } from "react-bootstrap";
import { BsCreditCard2Front, BsFillCreditCard2BackFill, BsTrash, BsPencilSquare, BsPlusCircle, BsGeoAlt, BsHouse, BsBuilding, BsStar, BsStarFill, BsChevronDown } from "react-icons/bs";
import { useCommandes } from '../contexts/CommandesContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { redeemGiftCard } from '../utils/giftCards';
import { useCurrency } from '../contexts/CurrencyContext';

const defaultPaiements = [
  {
    id: 1,
    type: "Carte bancaire",
    titulaire: "Jean Dupont",
    numero: "**** **** **** 1234",
    expiration: "12/26",
    principal: true
  }
];

const Paiement = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { selectedCurrency, getCurrencySymbol } = useCurrency();
  const [paiements, setPaiements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ type: "Carte bancaire", titulaire: "", numero: "", expiration: "", principal: false });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Ajout : états pour achat immédiat
  const [buyNowItems, setBuyNowItems] = useState([]);
  
  // États pour les adresses sauvegardées
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    nom: "",
    adresse: "",
    telephone: "",
    ville: "",
    codePostal: "",
    pays: "France",
    type: "livraison",
    placeType: "maison",
    isDefault: false,
    instructions: ""
  });
  
  // Nouveaux états pour adresse, paiement et confirmation
  const [adresse, setAdresse] = useState({ nom: '', adresse: '', ville: '', telephone: '', codePostal: '', pays: 'France', placeType: 'maison' });
  const [modePaiement, setModePaiement] = useState('Carte bancaire');
  const [confirmation, setConfirmation] = useState('');
  const [commandeId, setCommandeId] = useState(null);
  const { commandes, setCommandes, saveUserCommandes } = useCommandes();
  const [produitsCommande, setProduitsCommande] = useState([]);
  
  // États pour carte cadeau
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardAmount, setGiftCardAmount] = useState(0);
  const [giftCardError, setGiftCardError] = useState('');

  // Charger les adresses sauvegardées de l'utilisateur
  useEffect(() => {
    if (isAuthenticated && user) {
      const userAddresses = localStorage.getItem(`adresses_${user.email}`);
      if (userAddresses) {
        const addresses = JSON.parse(userAddresses);
        setSavedAddresses(addresses);
        
                 // Trouver l'adresse par défaut
         const defaultAddress = addresses.find(addr => addr.isDefault);
         if (defaultAddress) {
           setSelectedAddressId(defaultAddress.id);
           setAdresse({
             nom: defaultAddress.nom,
             adresse: defaultAddress.adresse,
             ville: defaultAddress.ville,
             telephone: defaultAddress.telephone,
             codePostal: defaultAddress.codePostal,
             pays: defaultAddress.pays,
             placeType: defaultAddress.placeType || 'maison'
           });
         }
      }
    }
  }, [user, isAuthenticated]);

  // Charger les produits du panier
  useEffect(() => {
    console.log('Chargement des produits du panier...');
    const buyNow = localStorage.getItem('buyNow');
    
    console.log('BuyNow dans localStorage:', buyNow);
    console.log('CartItems du contexte:', cartItems);
    
    if (buyNow) {
      try {
        const buyNowParsed = JSON.parse(buyNow);
        console.log('BuyNow parsé:', buyNowParsed);
        setBuyNowItems(buyNowParsed);
      } catch (error) {
        console.error('Erreur parsing buyNow:', error);
        setBuyNowItems([]);
      }
    }
  }, []); // Suppression de la dépendance cartItems pour éviter la boucle infinie

  // Fonction pour sauvegarder les adresses
  const saveAddresses = (addressesToSave) => {
    if (user && user.email) {
      localStorage.setItem(`adresses_${user.email}`, JSON.stringify(addressesToSave));
    }
  };

  // Fonction pour sélectionner une adresse
  const handleSelectAddress = (addressId) => {
         const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
     if (selectedAddress) {
       setSelectedAddressId(addressId);
       setAdresse({
         nom: selectedAddress.nom,
         adresse: selectedAddress.adresse,
         ville: selectedAddress.ville,
         telephone: selectedAddress.telephone,
         codePostal: selectedAddress.codePostal,
         pays: selectedAddress.pays,
         placeType: selectedAddress.placeType || 'maison'
       });
     }
  };

  // Fonction pour ajouter une nouvelle adresse
  const handleAddNewAddress = () => {
    if (!isAuthenticated) {
      setError(t("must_be_logged_in_to_add_address"));
      return;
    }
    setNewAddressForm({
      nom: user ? `${user.prenom} ${user.nom}` : "",
      adresse: "",
      telephone: user ? user.phone || "" : "",
      ville: "",
      codePostal: "",
      pays: "France",
      type: "livraison",
      placeType: "maison",
      isDefault: false,
      instructions: ""
    });
    setShowAddressModal(true);
  };

  // Fonction pour sauvegarder une nouvelle adresse
  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    
    const newAddress = {
      ...newAddressForm,
      id: Date.now()
    };

    const updatedAddresses = [...savedAddresses, newAddress];
    setSavedAddresses(updatedAddresses);
    saveAddresses(updatedAddresses);
    
         // Sélectionner automatiquement la nouvelle adresse
     setSelectedAddressId(newAddress.id);
     setAdresse({
       nom: newAddress.nom,
       adresse: newAddress.adresse,
       ville: newAddress.ville,
       telephone: newAddress.telephone,
       codePostal: newAddress.codePostal,
       pays: newAddress.pays,
       placeType: newAddress.placeType || 'maison'
     });
    
    setShowAddressModal(false);
      setMessage(t("new_address_added_and_selected"));
    setTimeout(() => setMessage(""), 3000);
  };

  // Fonction pour valider la commande
  const handleValiderCommande = () => {
    console.log('Début validation commande...');
    console.log('Utilisateur connecté:', isAuthenticated);
    console.log('BuyNow items:', buyNowItems);
    console.log('Cart items:', cartItems);
    console.log('Adresse:', adresse);

    if (!isAuthenticated) {
      setError(t("must_be_logged_in_to_order"));
      return;
    }

    // Vérification produits
    if (buyNowItems.length === 0 && cartItems.length === 0) {
      setError(t("cart_empty_add_product"));
      return;
    }
    
    // Vérification adresse
    if (!adresse.nom || !adresse.adresse || !adresse.ville || !adresse.telephone) {
      setError(t("select_or_fill_address"));
      return;
    }
    
    try {
      // Générer un numéro de commande aléatoire
      const id = 'CMD' + Math.floor(100000 + Math.random() * 900000);
      console.log('ID commande généré:', id);
      
      const produits = (buyNowItems.length > 0 ? buyNowItems : cartItems).map(item => ({
        nom: item.name || item.nom,
        prix: item.price || item.prix,
        qte: item.qty || item.qte,
        image: item.image,
        color: item.color,
        size: item.size
      }));
      
      console.log('Produits mappés:', produits);
      setProduitsCommande(produits);
      
      // Nouvelle commande à ajouter
      const nouvelleCommande = {
        id,
        customer: user ? `${user.prenom} ${user.nom}` : 'Client',
        date: new Date().toISOString(),
        status: 'processing',
        statut: 'en cours',
        total: getTotal(),
        type: 'achat',
        modePaiement: modePaiement,
        adresse: { ...adresse },
        produits: produits,
        suivi: {
          transporteur: 'Chronopost',
          numero: 'CHR' + Math.floor(100000000 + Math.random() * 900000000),
          modeExpedition: 'Standard',
          dateLivraisonEstimee: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      };
      
      console.log('Nouvelle commande créée:', nouvelleCommande);
      
      const commandesMisAJour = [nouvelleCommande, ...commandes];
      setCommandes(commandesMisAJour);
      
      // Sauvegarder dans la clé spécifique à l'utilisateur
      if (user && user.email) {
        saveUserCommandes(user.email, commandesMisAJour);
        console.log('Commande sauvegardée pour:', user.email);
      }
      
      // Vider le panier approprié
      if (buyNowItems.length > 0) {
        localStorage.removeItem('buyNow');
        setBuyNowItems([]);
        console.log('Panier buyNow vidé');
      } else {
        clearCart(); // Utiliser la fonction du contexte
        console.log('Panier cart vidé via contexte');
      }
      
      // Afficher la confirmation
      setCommandeId(id);
      setConfirmation(t("order_validated_thank_you"));
      setError("");
      
      console.log('Commande validée avec succès!');
      
    } catch (error) {
      console.error('Erreur lors de la validation de la commande:', error);
      setError(t("order_validation_error"));
    }
  };

  const getTotal = () => {
    const items = buyNowItems.length > 0 ? buyNowItems : cartItems;
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    return Math.max(0, subtotal - giftCardAmount);
  };

  const getLivraisonEstimee = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return `${t("estimated_delivery")} ${date.toLocaleDateString('fr-FR')}`;
  };

  // Si l'utilisateur n'est pas connecté
  if (!isAuthenticated) {
    return (
      <div className="container my-4" style={{maxWidth:700}}>
        <Card className="shadow-sm">
          <Card.Body className="text-center">
            <h2 className="mb-3">🔒 {t("restricted_access")}</h2>
            <p className="text-muted mb-4">
              {t("must_be_logged_in_to_order")}
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/connexion')}
              className="me-2"
            >
              {t("login")}
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={() => navigate('/inscription')}
            >
              {t("create_account")}
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="container my-4" style={{maxWidth:800}}>
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      {message && <Alert variant="success" className="mb-3">{message}</Alert>}

      <div className="card shadow-sm">
        <div className="card-header">
          <h3 className="mb-0">
            <BsCreditCard2Front className="me-2 text-primary" />
            {t("finalize_order")}
          </h3>
        </div>
        <div className="card-body">
          {confirmation && commandeId ? (
            <div className="alert alert-success">
              <h4 className="mb-3">{t("thank_you_for_order")}</h4>
              <p className="mb-1"><b>{t("order_number")}</b> {commandeId}</p>
              <p className="mb-3 text-success">{getLivraisonEstimee()}</p>
              <hr />
              <h5 className="mt-3">{t("products_purchased")}</h5>
              {produitsCommande.length === 0 ? (
                <div>{t("no_product")}</div>
              ) : (
                <div>
                  {produitsCommande.map((item, idx) => (
                    <div key={idx} className="border rounded p-2 mb-2 d-flex align-items-center">
                      <img src={item.image} alt={item.name} style={{width:60, height:60, objectFit:'cover', marginRight:10}} />
                      <div>
                        <span className="fw-bold">{item.nom}</span> - {item.color} - {t("size")} {item.size} <br/>
                        {t("quantity")} : {item.qte} <br/>
                        {t("unit_price")} : {item.prix.toLocaleString('fr-FR')} GNF
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <hr />
              <h5 className="mt-3">{t("delivery_address")}</h5>
              <div className="mb-2">
                <div className="row">
                  <div className="col-md-6">
                    <strong>{t("full_name")}</strong><br />
                    {adresse.nom}<br /><br />
                    <strong>{t("address_type")}</strong><br />
                    {t("delivery_address_type")}<br /><br />
                    <strong>{t("address")}</strong><br />
                    {adresse.adresse}<br /><br />
                    <strong>{t("city")}</strong><br />
                    {adresse.ville}
                  </div>
                  <div className="col-md-6">
                    <strong>{t("country")}</strong><br />
                    {adresse.pays}<br /><br />
                    <strong>{t("phone")}</strong><br />
                    {adresse.telephone}<br /><br />
                    <strong>{t("place_type")}</strong><br />
                    {adresse.placeType === 'maison' ? 'Maison' : 
                     adresse.placeType === 'bureau' ? 'Bureau' : 
                     adresse.placeType === 'appartement' ? 'Appartement' :
                     adresse.placeType === 'entreprise' ? 'Entreprise' :
                     adresse.placeType === 'magasin' ? 'Magasin' :
                     adresse.placeType === 'ecole' ? 'École/Université' :
                     adresse.placeType === 'hopital' ? 'Hôpital/Clinique' :
                     adresse.placeType === 'hotel' ? 'Hôtel' :
                     adresse.placeType === 'residence' ? 'Résidence' :
                     adresse.placeType === 'villa' ? 'Villa' :
                     adresse.placeType === 'immeuble' ? 'Immeuble' : 'Autre'}
                  </div>
                </div>
              </div>
              <h5 className="mt-3">{t("payment_method")}</h5>
              <div className="mb-2">{modePaiement}</div>
              <h5 className="mt-3">{t("order_total")}</h5>
              <div className="mb-3 fw-bold" style={{fontSize:18}}>
                {produitsCommande.length === 0
                  ? 0
                  : produitsCommande.reduce((sum, item) => sum + (item.prix * item.qte), 0).toLocaleString('fr-FR')}
                {' '}GNF
              </div>
              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-outline-primary" onClick={() => navigate('/commandes')}>{t("view_my_orders")}</button>
                <button className="btn btn-primary" onClick={() => navigate('/')}>{t("back_to_home")}</button>
              </div>
            </div>
          ) : buyNowItems.length > 0 ? (
            <div>
              <p><b>Achat immédiat</b></p>
              {buyNowItems.map((item, idx) => (
                <div key={idx} className="border rounded p-2 mb-2 d-flex align-items-center">
                  <img src={item.image} alt={item.name} style={{width:60, height:60, objectFit:'cover', marginRight:10}} />
                  <div>
                    <span className="fw-bold">{item.name}</span> - {item.color} - Taille {item.size} <br/>
                    Quantité : {item.qty} <br/>
                    Prix : {item.price.toLocaleString('fr-FR')} GNF
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p><b>Panier classique</b></p>
              {/* Console log removed - use browser dev tools instead */}
              {cartItems.length === 0 ? (
                <div>
                  <div>Votre panier est vide.</div>
                  <div className="text-muted small mt-2">
                    Debug: {JSON.stringify(cartItems)}
                  </div>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="border rounded p-2 mb-2 d-flex align-items-center">
                    <img src={item.image} alt={item.name} style={{width:60, height:60, objectFit:'cover', marginRight:10}} />
                    <div>
                      <span className="fw-bold">{item.name}</span> - {item.color} - Taille {item.size} <br/>
                      Quantité : {item.qty} <br/>
                      Prix : {item.price.toLocaleString('fr-FR')} GNF
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Champs adresse et paiement + validation commande */}
      {!confirmation && (
        <div className="card mt-4 shadow-sm">
          <div className="card-header">
            <h4 className="mb-0">
              <BsGeoAlt className="me-2 text-primary" />
              Adresse de livraison
            </h4>
          </div>
          <div className="card-body">
            {/* Sélection d'adresse sauvegardée */}
            {savedAddresses.length > 0 && (
              <div className="mb-4">
                <h6 className="mb-3">Adresses sauvegardées</h6>
                <div className="row g-3">
                  {savedAddresses.map((savedAddr) => (
                    <div key={savedAddr.id} className="col-md-6">
                      <Card 
                        className={`cursor-pointer ${selectedAddressId === savedAddr.id ? 'border-primary' : 'border-light'}`}
                        onClick={() => handleSelectAddress(savedAddr.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card.Body className="p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="d-flex align-items-center">
                              {savedAddr.placeType === 'maison' ? <BsHouse className="text-primary me-2" /> : <BsBuilding className="text-success me-2" />}
                              <span className="fw-bold">Adresse de livraison</span>
                            </div>
                            <div className="d-flex gap-1">
                              <Badge bg="primary" className="me-1">{savedAddr.type}</Badge>
                              {savedAddr.isDefault && (
                                <Badge bg="warning" text="dark">
                                  <BsStarFill className="me-1"/> Par défaut
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 small">
                            <div className="mb-1">
                              <strong>Nom complet :</strong> {savedAddr.nom}
                            </div>
                            <div className="mb-1">
                              <strong>Adresse :</strong> {savedAddr.adresse}
                            </div>
                            <div className="mb-1">
                              <strong>Ville :</strong> {savedAddr.ville}{savedAddr.codePostal && `, ${savedAddr.codePostal}`}
                            </div>
                            <div className="mb-1">
                              <strong>Pays :</strong> {savedAddr.pays}
                            </div>
                            <div className="mb-1">
                              <strong>Téléphone :</strong> {savedAddr.telephone}
                            </div>
                            <div className="mb-1">
                              <strong>Type de lieu :</strong> {
                                savedAddr.placeType === 'maison' ? 'Maison' : 
                                savedAddr.placeType === 'bureau' ? 'Bureau' : 
                                savedAddr.placeType === 'appartement' ? 'Appartement' :
                                savedAddr.placeType === 'entreprise' ? 'Entreprise' :
                                savedAddr.placeType === 'magasin' ? 'Magasin' :
                                savedAddr.placeType === 'ecole' ? 'École/Université' :
                                savedAddr.placeType === 'hopital' ? 'Hôpital/Clinique' :
                                savedAddr.placeType === 'hotel' ? 'Hôtel' :
                                savedAddr.placeType === 'residence' ? 'Résidence' :
                                savedAddr.placeType === 'villa' ? 'Villa' :
                                savedAddr.placeType === 'immeuble' ? 'Immeuble' : 'Autre'
                              }
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline-primary" 
                  className="mt-3"
                  onClick={handleAddNewAddress}
                >
                  <BsPlusCircle className="me-2" />
                  Ajouter une nouvelle adresse
                </Button>
              </div>
            )}

            {/* Formulaire d'adresse manuelle */}
            <div className="mb-4">
              <h6 className="mb-3">
                {savedAddresses.length > 0 ? "Ou saisir une adresse manuellement" : "Adresse de livraison"}
              </h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Nom complet" 
                    value={adresse.nom} 
                    onChange={e => setAdresse({ ...adresse, nom: e.target.value })} 
                  />
              </div>
              <div className="col-md-6">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Téléphone" 
                    value={adresse.telephone} 
                    onChange={e => setAdresse({ ...adresse, telephone: e.target.value })} 
                  />
              </div>
              <div className="col-md-8">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Adresse complète" 
                    value={adresse.adresse} 
                    onChange={e => setAdresse({ ...adresse, adresse: e.target.value })} 
                  />
              </div>
              <div className="col-md-4">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ville" 
                    value={adresse.ville} 
                    onChange={e => setAdresse({ ...adresse, ville: e.target.value })} 
                  />
                </div>
                <div className="col-md-6">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Code postal" 
                    value={adresse.codePostal} 
                    onChange={e => setAdresse({ ...adresse, codePostal: e.target.value })} 
                  />
                </div>
                                 <div className="col-md-6">
                   <select 
                     className="form-select" 
                     value={adresse.pays} 
                     onChange={e => setAdresse({ ...adresse, pays: e.target.value })}
                   >
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
                   </select>
                 </div>
               </div>
                              <div className="row g-3">
                 <div className="col-md-6">
                   <label className="form-label">Type de lieu</label>
                   <select 
                     className="form-select" 
                     value={adresse.placeType} 
                     onChange={e => setAdresse({ ...adresse, placeType: e.target.value })}
                   >
                     <option value="maison">Maison</option>
                     <option value="appartement">Appartement</option>
                     <option value="bureau">Bureau</option>
                     <option value="entreprise">Entreprise</option>
                     <option value="magasin">Magasin</option>
                     <option value="ecole">École/Université</option>
                     <option value="hopital">Hôpital/Clinique</option>
                     <option value="hotel">Hôtel</option>
                     <option value="residence">Résidence</option>
                     <option value="villa">Villa</option>
                     <option value="immeuble">Immeuble</option>
                     <option value="autre">Autre</option>
                   </select>
                 </div>
               </div>
            </div>
            
            <h4 className="mt-4 mb-3">Mode de paiement</h4>
            <select className="form-select mb-4" value={modePaiement} onChange={e => setModePaiement(e.target.value)}>
              <option>Carte bancaire</option>
              <option>PayPal</option>
              <option>Carte cadeau</option>
            </select>
            
            {/* Section carte cadeau */}
            {modePaiement === 'Carte cadeau' && (
              <div className="card p-3 mb-4">
                <h5 className="mb-3">Utiliser une carte cadeau</h5>
                <div className="row g-3">
                  <div className="col-md-8">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Code de la carte cadeau (ex: ABCD-1234-EFGH-5678)"
                      value={giftCardCode}
                      onChange={e => setGiftCardCode(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <button 
                      type="button"
                      className="btn btn-outline-primary w-100"
                      onClick={() => {
                        if (!giftCardCode.trim()) {
                          setGiftCardError('Veuillez saisir un code');
                          return;
                        }
                        const result = redeemGiftCard(giftCardCode, getTotal());
                        if (result.ok) {
                          setGiftCardAmount(result.used);
                          setGiftCardError('');
                          setMessage(`Carte cadeau utilisée: ${result.used.toLocaleString('fr-FR')} GNF. Reste: ${result.remaining.toLocaleString('fr-FR')} GNF`);
                        } else {
                          if (result.reason === 'NOT_FOUND') {
                            setGiftCardError('Code invalide');
                          } else if (result.reason === 'INSUFFICIENT_BALANCE') {
                            setGiftCardError(`Solde insuffisant. Carte: ${result.cardBalance.toLocaleString('fr-FR')} GNF, Total: ${result.requiredAmount.toLocaleString('fr-FR')} GNF`);
                          } else {
                            setGiftCardError('Solde insuffisant');
                          }
                          setGiftCardAmount(0);
                        }
                      }}
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
                {giftCardError && <div className="text-danger mt-2">{giftCardError}</div>}
                {giftCardAmount > 0 && (
                  <div className="text-success mt-2">
                    Carte cadeau appliquée: -{giftCardAmount.toLocaleString('fr-FR')} GNF
                  </div>
                )}
              </div>
            )}
            
            <button
              className="btn btn-primary btn-lg fw-bold w-100"
              onClick={handleValiderCommande}
              disabled={buyNowItems.length === 0 && cartItems.length === 0}
            >
              Valider la commande
            </button>
          </div>
        </div>
      )}

      {/* Modal pour ajouter une nouvelle adresse */}
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une nouvelle adresse</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveNewAddress}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nom complet *</Form.Label>
                  <Form.Control 
                    name="nom" 
                    value={newAddressForm.nom} 
                    onChange={(e) => setNewAddressForm({...newAddressForm, nom: e.target.value})} 
                    required 
                    placeholder="Nom et prénom"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Label>Type d'adresse *</Form.Label>
                <Form.Select 
                  name="type" 
                  value={newAddressForm.type} 
                  onChange={(e) => setNewAddressForm({...newAddressForm, type: e.target.value})} 
                  required
                >
                  <option value="livraison">Adresse de livraison</option>
                  <option value="facturation">Adresse de facturation</option>
                  <option value="cadeau">Adresse de cadeau</option>
                </Form.Select>
              </div>
            </div>
            
            <Form.Group className="mb-3">
              <Form.Label>Adresse *</Form.Label>
              <Form.Control 
                name="adresse" 
                value={newAddressForm.adresse} 
                onChange={(e) => setNewAddressForm({...newAddressForm, adresse: e.target.value})} 
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
                    value={newAddressForm.ville} 
                    onChange={(e) => setNewAddressForm({...newAddressForm, ville: e.target.value})} 
                    required 
                    placeholder="Ville"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Code postal *</Form.Label>
                  <Form.Control 
                    name="codePostal" 
                    value={newAddressForm.codePostal} 
                    onChange={(e) => setNewAddressForm({...newAddressForm, codePostal: e.target.value})} 
                    required 
                    placeholder="Code postal"
                  />
                </Form.Group>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Pays *</Form.Label>
                                   <Form.Select 
                   name="pays" 
                   value={newAddressForm.pays} 
                   onChange={(e) => setNewAddressForm({...newAddressForm, pays: e.target.value})} 
                   required
                 >
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
                    value={newAddressForm.telephone} 
                    onChange={(e) => setNewAddressForm({...newAddressForm, telephone: e.target.value})} 
                    required 
                    placeholder="0601020304"
                  />
                </Form.Group>
              </div>
            </div>
            
            <div className="row">
                             <div className="col-md-6">
                 <Form.Label>Type de lieu</Form.Label>
                 <Form.Select 
                   name="placeType" 
                   value={newAddressForm.placeType} 
                   onChange={(e) => setNewAddressForm({...newAddressForm, placeType: e.target.value})}
                 >
                   <option value="maison">Maison</option>
                   <option value="appartement">Appartement</option>
                   <option value="bureau">Bureau</option>
                   <option value="entreprise">Entreprise</option>
                   <option value="magasin">Magasin</option>
                   <option value="ecole">École/Université</option>
                   <option value="hopital">Hôpital/Clinique</option>
                   <option value="hotel">Hôtel</option>
                   <option value="residence">Résidence</option>
                   <option value="villa">Villa</option>
                   <option value="immeuble">Immeuble</option>
                   <option value="autre">Autre</option>
                 </Form.Select>
               </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="isDefault"
                    checked={newAddressForm.isDefault}
                    onChange={(e) => setNewAddressForm({...newAddressForm, isDefault: e.target.checked})}
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
                value={newAddressForm.instructions} 
                onChange={(e) => setNewAddressForm({...newAddressForm, instructions: e.target.value})} 
                placeholder="Code, étage, instructions spéciales..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddressModal(false)}>Annuler</Button>
            <Button variant="primary" type="submit">Ajouter l'adresse</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Paiement; 