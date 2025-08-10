import React, { useState, useEffect } from 'react';
import '../amazon-like.css';
import { useCommandes } from "../contexts/CommandesContext";
import { Modal, Button, Form } from 'react-bootstrap';
import { useNotifications } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

// Pas de données de test hardcodées - chaque utilisateur a ses propres données

export default function Orders() {
  const { commandes = [], setCommandes, loadUserCommandes } = useCommandes();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  // Debug : log des commandes
  console.log('Commandes du contexte :', commandes);
  console.log('Commandes avec suivi :', commandes.filter(c => c.suivi && c.suivi.etapes && c.suivi.etapes.length > 0));
  console.log('Commandes livrées :', commandes.filter(c => c.statut === 'livrée'));
  const [activeTab, setActiveTab] = useState('historique');
  const [commandeSelectionnee, setCommandeSelectionnee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [avisForm, setAvisForm] = useState({ show: false, commandeId: null, produitIndex: null, note: 0, titre: '', commentaire: '', mode: 'ajout' });
  const [message, setMessage] = useState('');
  // const [erreur, setErreur] = useState(null); // On retire la gestion d'erreur ici
  const [showRetourModal, setShowRetourModal] = useState(false);
  const [retourCommande, setRetourCommande] = useState(null);
  const [retourProduits, setRetourProduits] = useState([]);
  const [retourRaison, setRetourRaison] = useState('');
  const [retourAutre, setRetourAutre] = useState('');
  const [retourCommentaire, setRetourCommentaire] = useState('');
  const [retourType, setRetourType] = useState('Remboursement');
  const [retours, setRetours] = useState([]);
  const [echanges, setEchanges] = useState([]);

  const raisonsRetour = [
    'Produit défectueux',
    'Mauvaise taille/couleur',
    'Produit non conforme à la description',
    'Changement d\'avis',
    'Autre'
  ];

  const handleOpenRetourModal = (commande) => {
    setRetourCommande(commande);
    setRetourProduits([]);
    setRetourRaison('');
    setRetourAutre('');
    setRetourCommentaire('');
    setRetourType('Remboursement');
    setShowRetourModal(true);
  };
  const handleCloseRetourModal = () => {
    setShowRetourModal(false);
    setRetourCommande(null);
  };
  const handleToggleProduit = (idx) => {
    setRetourProduits(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };
  const handleValiderRetour = (e) => {
    e.preventDefault();
    
    // Validation : s'assurer qu'au moins un produit est sélectionné
    if (retourProduits.length === 0) {
      setMessage('Veuillez sélectionner au moins un produit à retourner.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    // Validation : s'assurer qu'une raison est sélectionnée
    if (!retourRaison || (retourRaison === 'Autre' && !retourAutre.trim())) {
      setMessage('Veuillez sélectionner une raison pour le retour.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    const now = new Date();
    const retour = {
      id: 'RET-' + Math.floor(100000 + Math.random() * 900000),
      commandeId: retourCommande.id,
      dateAchat: retourCommande.date,
      dateDemande: now.toISOString(),
      produits: retourProduits.map(idx => retourCommande.produits[idx]),
      raison: retourRaison === 'Autre' ? retourAutre : retourRaison,
      commentaire: retourCommentaire,
      type: retourType,
      statut: 'En attente de validation'
    };
    const newRetours = [retour, ...retours];
    setRetours(newRetours);
    if (user && user.email) {
      const userKeyRetours = `retours_${user.email}`;
      localStorage.setItem(userKeyRetours, JSON.stringify(newRetours));
    }
    setShowRetourModal(false);
    setRetourCommande(null);
    setMessage('Votre demande de retour a été enregistrée.');
    
    // Notification de succès
    addNotification(
      'Demande de retour enregistrée avec succès',
      'success',
      {
        details: `Retour #${retour.id} - En attente de validation par le vendeur`
      }
    );
    
    setTimeout(() => setMessage(''), 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Charger les commandes, retours et échanges isolés par utilisateur
  useEffect(() => {
    if (user && user.email) {
      console.log('Chargement des commandes pour:', user.email);
      // Charger les commandes de l'utilisateur
      loadUserCommandes(user.email);
      
      // Charger les retours et échanges
      const userKeyRetours = `retours_${user.email}`;
      const userKeyEchanges = `echanges_${user.email}`;
      
      const storedRetours = localStorage.getItem(userKeyRetours);
      const storedEchanges = localStorage.getItem(userKeyEchanges);
      
      if (storedRetours) {
        setRetours(JSON.parse(storedRetours));
      }
      if (storedEchanges) {
        setEchanges(JSON.parse(storedEchanges));
      }
    }
  }, [user]);

  // Détecter l'ancre dans l'URL au chargement
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['historique', 'suivi', 'retours'].includes(hash)) {
      setActiveTab(hash);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  // Synchronisation du statut avec le suivi - une seule fois au chargement
  useEffect(() => {
    if (commandes.length > 0 && user && user.email) {
      const commandesMisAJour = commandes.map(cmd => {
        if (cmd.suivi && cmd.suivi.etapes && cmd.suivi.etapes.length > 0) {
          const lastEtape = cmd.suivi.etapes[cmd.suivi.etapes.length - 1];
          if (lastEtape.statut && lastEtape.statut.trim().toLowerCase().includes('livrée')) {
            return { ...cmd, statut: 'livrée', status: 'livrée' };
          } else if (lastEtape.statut && lastEtape.statut.trim().toLowerCase().includes('expédiée')) {
            return { ...cmd, statut: 'expédiée', status: 'expédiée' };
          } else if (lastEtape.statut && lastEtape.statut.trim().toLowerCase().includes('préparation')) {
            return { ...cmd, statut: 'en cours', status: 'en cours' };
          }
        }
        return cmd;
      });
      
      // Vérifier s'il y a des changements
      const hasChanges = commandesMisAJour.some((cmd, index) => 
        cmd.statut !== commandes[index].statut || cmd.status !== commandes[index].status
      );
      
      if (hasChanges) {
        setCommandes(commandesMisAJour);
        // Sauvegarder les changements dans le localStorage
        const userKey = `commandes_${user.email}`;
        localStorage.setItem(userKey, JSON.stringify(commandesMisAJour));
      }
    }
  }, [user]); // Seulement quand l'utilisateur change

    // Recharger les données au rafraîchissement de la page
  useEffect(() => {
    if (user && user.email) {
      // Recharger les commandes
      loadUserCommandes(user.email);
      
      // Recharger les retours et échanges
      const userKeyRetours = `retours_${user.email}`;
      const userKeyEchanges = `echanges_${user.email}`;
      
      const storedRetours = localStorage.getItem(userKeyRetours);
      const storedEchanges = localStorage.getItem(userKeyEchanges);
      
      if (storedRetours) {
        setRetours(JSON.parse(storedRetours));
      }
      if (storedEchanges) {
        setEchanges(JSON.parse(storedEchanges));
      }
    }
  }, [user]);

  // Recharger automatiquement quand le localStorage change
  useEffect(() => {
    const handleStorageChange = () => {
      if (user && user.email) {
        loadUserCommandes(user.email);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  // Obtenir le statut coloré
  const getStatutColor = (statut) => {
    switch (statut) {
      case 'livrée': return 'success';
      case 'en cours': return 'warning';
      case 'retournée': return 'danger';
      case 'remboursé': return 'info';
      default: return 'secondary';
    }
  };

  // Obtenir l'icône du statut
  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'livrée': return 'bi-check-circle-fill';
      case 'en cours': return 'bi-truck';
      case 'retournée': return 'bi-arrow-return-left';
      case 'remboursé': return 'bi-cash-coin';
      default: return 'bi-clock';
    }
  };

  return (
    <>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4 text-warning fw-bold" style={{fontSize: '2.2rem'}}>
              <i className="bi bi-box-seam me-3"></i>
              Mes Commandes
            </h1>

            {/* Navigation par onglets */}
            <ul className="nav nav-tabs mb-4" id="ordersTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'historique' ? 'active' : ''}`}
                  id="historique-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#historique"
                  type="button"
                  role="tab"
                  onClick={() => handleTabClick('historique')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-clock-history me-2"></i>
                  Historique des commandes
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'suivi' ? 'active' : ''}`}
                  id="suivi-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#suivi"
                  type="button"
                  role="tab"
                  onClick={() => handleTabClick('suivi')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-truck me-2"></i>
                  Suivi des livraisons
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'retours' ? 'active' : ''}`}
                  id="retours-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#retours"
                  type="button"
                  role="tab"
                  onClick={() => handleTabClick('retours')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-arrow-return-left me-2"></i>
                  Retours et remboursements
                </button>
              </li>
            </ul>

            {/* Contenu des onglets */}
            <div className="tab-content" id="ordersTabContent">
              
              {/* Section Historique des commandes */}
              <div 
                className={`tab-pane fade ${activeTab === 'historique' ? 'show active' : ''}`}
                id="historique"
                role="tabpanel"
                aria-labelledby="historique-tab"
              >
                <div className="row">
                  <div className="col-12">
                    {commandes.length === 0 && (
                      <div className="text-center py-5">
                        <i className="bi bi-box-seam display-1 text-muted mb-3"></i>
                        <h4 className="text-muted">Aucune commande trouvée</h4>
                        <p className="text-muted">Vous n'avez passé aucune commande pour le moment.</p>
                      </div>
                    )}
                    {commandes.map((commande, cIdx) => (
                      <div key={commande.id} className="card border-0 shadow-sm mb-4 hover-shadow">
                        <div className="card-header bg-light border-0">
                          <div className="row align-items-center">
                            <div className="col-md-6">
                              <h6 className="fw-bold mb-0">
                                <i className="bi bi-box-seam me-2 text-primary"></i>
                                Commande {commande.id}
                              </h6>
                              {commande.adresse?.nom && (
                                <div className="text-muted" style={{fontSize: '1rem', fontWeight: 500}}>
                                  Client : {commande.adresse.nom}
                                </div>
                              )}
                              <small className="text-muted">
                                <i className="bi bi-calendar me-1"></i>
                                {formatDate(commande.date)}
                              </small>
                            </div>
                            <div className="col-md-6 text-end">
                              <span className={`badge bg-${getStatutColor(commande.statut)} me-2`}>
                                <i className={`bi ${getStatutIcon(commande.statut)} me-1`}></i>
                                {commande.statut}
                              </span>
                              <span className="fw-bold text-primary">
                                {commande.total ? commande.total.toLocaleString('fr-FR') : '0'} GNF
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            {/* Produits normaux */}
                            {(commande.produits || []).map((produit, pIdx) => (
                              <div key={pIdx} className="col-md-6 mb-3">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center">
                                    <img 
                                      src={produit.image} 
                                      alt={produit.nom}
                                      className="rounded me-3"
                                      style={{width: '60px', height: '60px', objectFit: 'cover'}}
                                    />
                                    <div className="flex-grow-1">
                                      <h6 className="fw-bold mb-1">{produit.nom}</h6>
                                      <p className="text-muted mb-0">
                                        Quantité: {produit.qte} • {produit.prix.toLocaleString('fr-FR')} GNF<br/>
                                        {produit.couleur && <span>Couleur: {produit.couleur} </span>}
                                        {produit.taille && <span>Taille: {produit.taille}</span>}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {/* Produits d'échange */}
                            {commande.type === 'echange' && commande.produitEchange && (
                              <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center">
                                    <img 
                                      src={commande.produitEchange.image} 
                                      alt={commande.produitEchange.nom}
                                      className="rounded me-3"
                                      style={{width: '60px', height: '60px', objectFit: 'cover'}}
                                    />
                                    <div className="flex-grow-1">
                                      <h6 className="fw-bold mb-1 text-success">
                                        <i className="bi bi-arrow-repeat me-1"></i>
                                        {commande.produitEchange.nom}
                                      </h6>
                                      <p className="text-muted mb-0">
                                        Quantité: {commande.produitEchange.qte} • {commande.produitEchange.prix.toLocaleString('fr-FR')} GNF<br/>
                                        {commande.produitEchange.couleur && <span>Couleur: {commande.produitEchange.couleur} </span>}
                                        {commande.produitEchange.taille && <span>Taille: {commande.produitEchange.taille}</span>}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Adresse et paiement */}
                          <div className="mt-2">
                            <b>Adresse de livraison :</b><br/>
                            {commande.adresse ? (
                              <span>
                                <strong>Nom complet :</strong> {commande.adresse.nom}<br/>
                                <strong>Adresse :</strong> {commande.adresse.adresse}<br/>
                                <strong>Ville :</strong> {commande.adresse.ville}<br/>
                                <strong>Téléphone :</strong> {commande.adresse.telephone}<br/>
                                <strong>Type de lieu :</strong> {
                                  commande.adresse.placeType === 'maison' ? 'Maison' : 
                                  commande.adresse.placeType === 'bureau' ? 'Bureau' : 
                                  commande.adresse.placeType === 'appartement' ? 'Appartement' :
                                  commande.adresse.placeType === 'entreprise' ? 'Entreprise' :
                                  commande.adresse.placeType === 'magasin' ? 'Magasin' :
                                  commande.adresse.placeType === 'ecole' ? 'École/Université' :
                                  commande.adresse.placeType === 'hopital' ? 'Hôpital/Clinique' :
                                  commande.adresse.placeType === 'hotel' ? 'Hôtel' :
                                  commande.adresse.placeType === 'residence' ? 'Résidence' :
                                  commande.adresse.placeType === 'villa' ? 'Villa' :
                                  commande.adresse.placeType === 'immeuble' ? 'Immeuble' : 'Autre'
                                }
                              </span>
                            ) : <span className="text-muted">Non renseignée</span>}
                          </div>
                          <div className="mt-2">
                            <b>Mode de paiement :</b> {commande.modePaiement || commande.paiement || <span className="text-muted">Non renseigné</span>}
                          </div>
                          {commande.statut === 'livrée' && (
                            <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => handleOpenRetourModal(commande)}>
                              Demander un retour
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                </div>
              </div>

              {/* Section Suivi des livraisons */}
              <div 
                className={`tab-pane fade ${activeTab === 'suivi' ? 'show active' : ''}`}
                id="suivi"
                role="tabpanel"
                aria-labelledby="suivi-tab"
              >
                <div className="row">
                  <div className="col-12">
                    {(() => {
                      const commandesAvecSuivi = commandes.filter(c => c.suivi && c.suivi.etapes && c.suivi.etapes.length > 0);
                      if (commandesAvecSuivi.length === 0) {
                        return (
                          <div className="text-center py-5">
                            <i className="bi bi-truck display-1 text-muted mb-3"></i>
                            <h4 className="text-muted">Aucun suivi de livraison</h4>
                            <p className="text-muted">Le vendeur n'a pas encore ajouté de suivi pour vos commandes.</p>
                          </div>
                        );
                      }
                      return commandesAvecSuivi.map((commande) => (
                      <div key={commande.id} className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-warning text-dark border-0">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <h6 className="fw-bold mb-0">
                                <i className="bi bi-truck me-2"></i>
                                Suivi de la commande {commande.id}
                              </h6>
                              {commande.suivi && (commande.suivi.transporteur || commande.suivi.numero) ? (
                                <small>
                                  {commande.suivi.transporteur && <>Transporteur : {commande.suivi.transporteur} </>}
                                  {commande.suivi.numero && <>• Numéro : {commande.suivi.numero}</>}
                                </small>
                              ) : null}
                            </div>
                            <div className="col-md-4 text-end">
                              {(
                                commande.statut === "livrée" ||
                                (commande.suivi && commande.suivi.etapes && commande.suivi.etapes.length > 0 &&
                                  commande.suivi.etapes[commande.suivi.etapes.length - 1].statut.toLowerCase().includes("livrée"))
                              ) ? (
                                <span className="badge bg-success">
                                  <i className="bi bi-check-circle me-1"></i>
                                  Livrée
                                </span>
                              ) : (
                                <span className="badge bg-warning text-dark">
                                  <i className="bi bi-clock me-1"></i>
                                  En cours de livraison
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          {/* Produits de la commande */}
                          <div className="mb-4">
                            <h6 className="mb-3"><i className="bi bi-box-seam me-2"></i>Produits commandés :</h6>
                            <div className="row">
                              {/* Produits normaux */}
                              {(commande.produits || []).map((produit, pIdx) => (
                                <div key={pIdx} className="col-md-6 mb-3">
                                  <div className="d-flex align-items-center">
                                    <img 
                                      src={produit.image} 
                                      alt={produit.nom}
                                      className="rounded me-3"
                                      style={{width: '60px', height: '60px', objectFit: 'cover'}}
                                    />
                                    <div className="flex-grow-1">
                                      <h6 className="fw-bold mb-1">{produit.nom}</h6>
                                      <p className="text-muted mb-0">
                                        Quantité: {produit.qte} • {produit.prix.toLocaleString('fr-FR')} GNF<br/>
                                        {produit.couleur && <span>Couleur: {produit.couleur} </span>}
                                        {produit.taille && <span>Taille: {produit.taille}</span>}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {/* Produits d'échange */}
                              {commande.type === 'echange' && commande.produitEchange && (
                                <div className="col-md-6 mb-3">
                                  <div className="d-flex align-items-center">
                                    <img 
                                      src={commande.produitEchange.image} 
                                      alt={commande.produitEchange.nom}
                                      className="rounded me-3"
                                      style={{width: '60px', height: '60px', objectFit: 'cover'}}
                                    />
                                    <div className="flex-grow-1">
                                      <h6 className="fw-bold mb-1 text-success">
                                        <i className="bi bi-arrow-repeat me-1"></i>
                                        {commande.produitEchange.nom}
                                      </h6>
                                      <p className="text-muted mb-0">
                                        Quantité: {commande.produitEchange.qte} • {commande.produitEchange.prix.toLocaleString('fr-FR')} GNF<br/>
                                        {commande.produitEchange.couleur && <span>Couleur: {commande.produitEchange.couleur} </span>}
                                        {commande.produitEchange.taille && <span>Taille: {commande.produitEchange.taille}</span>}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Informations générales du suivi */}
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <div className="mb-2">
                                <strong>Transporteur :</strong> {commande.suivi.transporteur || 'Non spécifié'}
                              </div>
                              <div className="mb-2">
                                <strong>Numéro de suivi :</strong> {commande.suivi.numero || 'Non spécifié'}
                              </div>
                            </div>
                            <div className="col-md-6">


                            </div>
                          </div>

                          {/* Étapes du suivi */}
                          {commande.suivi && commande.suivi.etapes && commande.suivi.etapes.length > 0 ? (
                            <div className="timeline">
                              <h6 className="mb-3"><i className="bi bi-list-ul me-2"></i>Étapes du suivi :</h6>
                              {commande.suivi.etapes.map((etape, index) => (
                                <div key={index} className="timeline-item d-flex mb-3">
                                  <div className="timeline-marker me-3">
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center ${index === commande.suivi.etapes.length - 1 ? 'bg-success' : 'bg-secondary'}`} style={{width: '30px', height: '30px'}}>
                                      <i className={`bi ${index === commande.suivi.etapes.length - 1 ? 'bi-check text-white' : 'bi-circle text-white'}`}></i>
                                    </div>
                                  </div>
                                  <div className="timeline-content flex-grow-1">
                                    <h6 className="fw-bold mb-1">{etape.statut}</h6>
                                    <p className="text-muted mb-1">{etape.description}</p>
                                    <small className="text-muted">
                                      {etape.date ? new Date(etape.date).toLocaleDateString('fr-FR') : ''}
                                      {etape.heure && ` à ${etape.heure}`}
                                    </small>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="alert alert-info">
                              <i className="bi bi-info-circle me-2"></i>
                              Aucune étape de suivi disponible pour le moment. Le vendeur mettra à jour le suivi bientôt.
                            </div>
                          )}
                          {commande.suivi && (commande.suivi.modeExpedition || commande.suivi.dateLivraisonEstimee) && (
                            <div className="mb-2">
                              {commande.suivi.modeExpedition && (
                                <span><b>Mode d'expédition :</b> {commande.suivi.modeExpedition}</span>
                              )}
                              {commande.suivi.dateLivraisonEstimee && (
                                <span className="ms-3"><b>Date estimée :</b> {new Date(commande.suivi.dateLivraisonEstimee).toLocaleDateString('fr-FR')}</span>
                              )}
                              {commande.suivi.heureLivraisonEstimee && (
                                <span className="ms-3"><b>Heure estimée :</b> {commande.suivi.heureLivraisonEstimee}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              {/* Section Retours et remboursements */}
              <div 
                className={`tab-pane fade ${activeTab === 'retours' ? 'show active' : ''}`}
                id="retours"
                role="tabpanel"
                aria-labelledby="retours-tab"
              >
                <div className="row">
                  <div className="col-12">
                    {activeTab === 'retours' && (
                      <div className="row">
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Retours et remboursements</h5>
                            <Button variant="outline-info" size="sm" onClick={() => navigate('/echanges')}>
                              <i className="bi bi-package me-1"></i>
                              Voir mes échanges
                            </Button>
                          </div>
                          {retours.length === 0 ? (
                            <div className="text-center py-4">
                              <i className="bi bi-arrow-return-left display-4 text-muted"></i>
                              <h5 className="mt-3 text-muted">Aucun retour</h5>
                              <p className="text-muted">Vous n'avez pas encore effectué de demande de retour.</p>
                            </div>
                          ) : (
                            retours.map(retour => (
                              <div key={retour.id} className="card mb-3">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                  <h6 className="mb-0">Retour #{retour.id}</h6>
                                  <span className={`badge bg-${retour.statut === 'En attente de validation' ? 'warning' : retour.statut === 'Accepté' ? 'success' : retour.statut === 'Refusé' ? 'danger' : retour.statut === 'Remboursé' ? 'info' : retour.statut === 'En attente de validation client' ? 'warning' : retour.statut === 'Échange validé' ? 'success' : retour.statut === 'Échange refusé' ? 'danger' : 'primary'}`}>
                                    {retour.statut}
                                  </span>
                                </div>
                                <div className="card-body">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <p><strong>Commande :</strong> #{retour.commandeId}</p>
                                      <p><strong>Date de demande :</strong> {formatDate(retour.dateDemande)}</p>
                                      <p><strong>Type :</strong> {retour.type}</p>
                                      <p><strong>Raison :</strong> {retour.raison}</p>
                                    </div>
                                    <div className="col-md-6">
                                      <p><strong>Produits :</strong></p>
                                      <ul className="list-unstyled">
                                        {retour.produits.map((produit, index) => (
                                          <li key={index} className="d-flex align-items-center mb-2">
                                            <img 
                                              src={produit.image || '/assets/placeholder-product.svg'} 
                                              alt={produit.nom || produit.name} 
                                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                              className="me-2"
                                            />
                                            <div>
                                              <div>{produit.nom || produit.name}</div>
                                              <small className="text-muted">{produit.prix?.toLocaleString('fr-FR')} GNF</small>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                      {retour.commentaire && (
                                        <p><strong>Commentaire :</strong> {retour.commentaire}</p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Affichage des détails d'échange si le retour a été échangé */}
                                  {(retour.statut === 'Échangé' || retour.statut === 'Échange validé' || retour.statut === 'Échange refusé') && retour.echangeId && (
                                    <div className="mt-3 p-3 bg-light rounded">
                                      <h6 className={`${retour.statut === 'Échange validé' ? 'text-success' : retour.statut === 'Échange refusé' ? 'text-danger' : 'text-success'}`}>
                                        <i className="bi bi-check-circle me-2"></i>
                                        {retour.statut === 'Échange validé' ? 'Échange validé' : retour.statut === 'Échange refusé' ? 'Échange refusé' : 'Échange effectué'} - #{retour.echangeId}
                                      </h6>
                                      {(() => {
                                        const echange = echanges.find(e => e.id === retour.echangeId);
                                        if (echange) {
                                          return (
                                            <div className="row mt-2">
                                              <div className="col-md-6">
                                                <small className="text-muted">Produit retourné :</small>
                                                <div className="d-flex align-items-center mt-1">
                                                  <img 
                                                    src={echange.produitRetourne?.image || '/assets/placeholder-product.svg'} 
                                                    alt="Produit retourné" 
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    className="me-2"
                                                  />
                                                  <div className="fw-bold">{echange.produitRetourne?.nom || 'Produit'}</div>
                                                </div>
                                              </div>
                                              <div className="col-md-6">
                                                <small className="text-muted">Produit échangé :</small>
                                                <div className="d-flex align-items-center mt-1">
                                                  <img 
                                                    src={echange.produitEchange?.image || '/assets/placeholder-product.svg'} 
                                                    alt="Produit échangé" 
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    className="me-2"
                                                  />
                                                  <div className="fw-bold text-success">{echange.produitEchange?.nom || 'Produit'}</div>
                                                </div>
                                                <small className="text-muted">
                                                  Quantité : {echange.produitEchange?.quantite || 1}
                                                </small>
                                              </div>
                                              {echange.commentaire && (
                                                <div className="col-12 mt-2">
                                                  <small className="text-muted">Commentaire vendeur :</small>
                                                  <div className="fst-italic">{echange.commentaire}</div>
                                                </div>
                                              )}
                                              {retour.statut === 'Échange validé' && (
                                                <div className="col-12 mt-2">
                                                  <div className="alert alert-success mb-0">
                                                    <i className="bi bi-check-circle me-2"></i>
                                                    <strong>Échange validé !</strong> Le produit a été ajouté à vos commandes.
                                                  </div>
                                                </div>
                                              )}
                                              {retour.statut === 'Échange refusé' && (
                                                <div className="col-12 mt-2">
                                                  <div className="alert alert-danger mb-0">
                                                    <i className="bi bi-x-circle me-2"></i>
                                                    <strong>Échange refusé !</strong> Un nouveau retour a été créé automatiquement.
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        }
                                        return null;
                                      })()}
                                    </div>
                                  )}
                                  
                                  {/* Bouton de validation si l'échange est en attente */}
                                  {retour.statut === 'En attente de validation client' && retour.echangeId && (
                                    <div className="mt-3 p-3 bg-warning bg-opacity-10 rounded">
                                      <h6 className="text-warning">
                                        <i className="bi bi-clock me-2"></i>
                                        Échange en attente de validation
                                      </h6>
                                      <p className="mb-2">Vous avez reçu le produit d'échange. Veuillez le valider.</p>
                                      <Button 
                                        variant="primary" 
                                        size="sm"
                                        onClick={() => navigate(`/validation-echange/${retour.echangeId}`)}
                                      >
                                        <i className="bi bi-check-circle me-1"></i>
                                        Valider l'échange
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal pour les détails de commande */}
        {showModal && commandeSelectionnee && (
          <>
            <div className="modal-backdrop-custom" onClick={() => setShowModal(false)}></div>
            <div className="modal-custom">
              <div className="modal-box" style={{maxWidth: 700, width: '95vw'}}>
                <div className="modal-header" style={{borderBottom: '1px solid #eee', padding: '18px 24px 10px 24px'}}>
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-box-seam me-2"></i>
                    Détails de la commande {commandeSelectionnee.id}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body" style={{padding: '18px 24px'}}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <h6 className="fw-bold">Informations de commande</h6>
                      <p className="text-muted mb-1">
                        <strong>Date:</strong> {new Date(commandeSelectionnee.date).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-muted mb-1">
                        <strong>Statut:</strong> 
                        <span className={`badge bg-${getStatutColor(commandeSelectionnee.statut)} ms-2`}>
                          {commandeSelectionnee.statut}
                        </span>
                      </p>
                      <p className="text-muted mb-0">
                        <strong>Total:</strong> {commandeSelectionnee.total.toFixed(2)} €
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold">Adresse de livraison</h6>
                      <div className="text-muted mb-0">
                        <div className="row">
                          <div className="col-md-6">
                            <strong>Nom complet :</strong><br />
                            {commandeSelectionnee.adresse.nom || commandeSelectionnee.customer}<br /><br />
                            <strong>Type d'adresse :</strong><br />
                            Adresse de livraison<br /><br />
                            <strong>Adresse :</strong><br />
                            {commandeSelectionnee.adresse.adresse || commandeSelectionnee.adresse}<br /><br />
                            <strong>Ville :</strong><br />
                            {commandeSelectionnee.adresse.ville}
                          </div>
                          <div className="col-md-6">
                            <strong>Pays :</strong><br />
                            {commandeSelectionnee.adresse.pays || 'Non spécifié'}<br /><br />
                            <strong>Téléphone :</strong><br />
                            {commandeSelectionnee.adresse.telephone}<br /><br />
                            <strong>Type de lieu :</strong><br />
                            {commandeSelectionnee.adresse.placeType === 'maison' ? 'Maison' : 
                             commandeSelectionnee.adresse.placeType === 'bureau' ? 'Bureau' : 
                             commandeSelectionnee.adresse.placeType === 'appartement' ? 'Appartement' :
                             commandeSelectionnee.adresse.placeType === 'entreprise' ? 'Entreprise' :
                             commandeSelectionnee.adresse.placeType === 'magasin' ? 'Magasin' :
                             commandeSelectionnee.adresse.placeType === 'ecole' ? 'École/Université' :
                             commandeSelectionnee.adresse.placeType === 'hopital' ? 'Hôpital/Clinique' :
                             commandeSelectionnee.adresse.placeType === 'hotel' ? 'Hôtel' :
                             commandeSelectionnee.adresse.placeType === 'residence' ? 'Résidence' :
                             commandeSelectionnee.adresse.placeType === 'villa' ? 'Villa' :
                             commandeSelectionnee.adresse.placeType === 'immeuble' ? 'Immeuble' : 'Non spécifié'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h6 className="fw-bold mb-3">Produits commandés</h6>
                  {commandeSelectionnee.produits.map((produit, index) => (
                    <div key={index} className="d-flex align-items-center mb-3 p-3 bg-light rounded">
                      <img 
                        src={produit.image} 
                        alt={produit.nom}
                        className="rounded me-3"
                        style={{width: '60px', height: '60px', objectFit: 'cover'}}
                      />
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">{produit.nom}</h6>
                        <p className="text-muted mb-0">
                          Quantité: {produit.qte} • Prix unitaire: {produit.prix.toFixed(2)} €
                        </p>
                      </div>
                      <div className="text-end">
                        <span className="fw-bold">{(produit.prix * produit.qte).toFixed(2)} €</span>
                      </div>
                    </div>
                  ))}
                  {commandeSelectionnee.retour && (
                    <div className="mt-3 p-3 bg-warning bg-opacity-10 rounded">
                      <h6 className="fw-bold text-warning">
                        <i className="bi bi-arrow-return-left me-2"></i>
                        Informations de retour
                      </h6>
                      <p className="text-muted mb-1">
                        <strong>Raison:</strong> {commandeSelectionnee.retour.raison}
                      </p>
                      <p className="text-muted mb-1">
                        <strong>Remboursement:</strong> {commandeSelectionnee.retour.remboursement.toFixed(2)} €
                      </p>
                      <p className="text-muted mb-0">
                        <strong>Date de remboursement:</strong> {new Date(commandeSelectionnee.retour.dateRemboursement).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>
                <div className="modal-footer" style={{borderTop: '1px solid #eee', padding: '12px 24px', display: 'flex', justifyContent: 'flex-end', gap: 8}}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowModal(false)}
                  >
                    Fermer
                  </button>
                  {commandeSelectionnee.statut === 'livrée' && !commandeSelectionnee.avisDonne && (
                    <button 
                      className="btn btn-warning"
                      onClick={() => {
                        setShowModal(false);
                        window.location.href = `/avis?commande=${commandeSelectionnee.id}`;
                      }}
                    >
                      <i className="bi bi-star me-1"></i>
                      Laisser un avis
                    </button>
                  )}
                  {commandeSelectionnee.statut === 'livrée' && commandeSelectionnee.avisDonne && (
                    <button 
                      className="btn btn-success"
                      onClick={() => {
                        setShowModal(false);
                        window.location.href = `/avis?commande=${commandeSelectionnee.id}&modifier=true`;
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Modifier mon avis
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Overlay pour le modal */}
        {showModal && (
          <div 
            className="modal-backdrop fade show" 
            onClick={() => setShowModal(false)}
          ></div>
        )}

        {/* Formulaire d'avis contextuel */}
        {avisForm.show && (
          <>
            <div className="modal-backdrop-custom" onClick={() => setAvisForm({ ...avisForm, show: false })}></div>
            <div className="modal-custom" tabIndex="-1">
              <div className="modal-box">
                <div className="modal-header" style={{borderBottom: '1px solid #eee', padding: '18px 24px 10px 24px'}}>
                  <h5 className="modal-title fw-bold">
                    {avisForm.mode === 'ajout' ? 'Laisser un avis' : 'Modifier mon avis'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setAvisForm({ ...avisForm, show: false })}></button>
                </div>
                <form onSubmit={e => {
                  e.preventDefault();
                  setCommandes(prev => prev.map(cmd =>
                    cmd.id === avisForm.commandeId
                      ? {
                          ...cmd,
                          produits: cmd.produits.map((prod, idx) =>
                            idx === avisForm.produitIndex
                              ? { ...prod, avis: { note: avisForm.note, titre: avisForm.titre, commentaire: avisForm.commentaire } }
                              : prod
                          )
                        }
                      : cmd
                  ));
                  setAvisForm({ ...avisForm, show: false });
                  setMessage(avisForm.mode === 'ajout' ? 'Avis ajouté avec succès !' : 'Avis modifié avec succès !');
                  setTimeout(() => setMessage(''), 2500);
                }}>
                  <div className="modal-body" style={{padding: '18px 24px'}}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Note</label>
                      <div className="d-flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <button
                            key={star}
                            type="button"
                            className="btn btn-link p-0"
                            style={{fontSize: '2rem'}}
                            onClick={() => setAvisForm({ ...avisForm, note: star })}
                          >
                            <i className={`bi ${star <= avisForm.note ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}></i>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Titre</label>
                      <input type="text" className="form-control" value={avisForm.titre} onChange={e => setAvisForm({ ...avisForm, titre: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Commentaire</label>
                      <textarea className="form-control" rows="4" value={avisForm.commentaire} onChange={e => setAvisForm({ ...avisForm, commentaire: e.target.value })} required></textarea>
                    </div>
                  </div>
                  <div className="modal-footer" style={{borderTop: '1px solid #eee', padding: '12px 24px', display: 'flex', justifyContent: 'flex-end', gap: 8}}>
                    <button type="button" className="btn btn-secondary" onClick={() => setAvisForm({ ...avisForm, show: false })}>Annuler</button>
                    <button type="submit" className="btn btn-warning fw-bold">
                      <i className="bi bi-check me-1"></i>
                      {avisForm.mode === 'ajout' ? 'Publier l\'avis' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {/* Modal de demande de retour */}
        {showRetourModal && retourCommande && (
          <Modal show={showRetourModal} onHide={handleCloseRetourModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Demande de retour/remboursement</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleValiderRetour}>
              {message && (
                <div className="alert alert-danger m-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {message}
                </div>
              )}
              <Modal.Body>
                <div className="mb-2">
                  <b>Commande n° :</b> {retourCommande.id}<br/>
                  <b>Date d'achat :</b> {new Date(retourCommande.date).toLocaleDateString('fr-FR')}
                </div>
                <div className="mb-3">
                  <b>Type de retour :</b><br/>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="typeRetour" id="type-remboursement" value="Remboursement" checked={retourType === 'Remboursement'} onChange={() => setRetourType('Remboursement')} />
                    <label className="form-check-label" htmlFor="type-remboursement">Remboursement</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="typeRetour" id="type-echange" value="Échange" checked={retourType === 'Échange'} onChange={() => setRetourType('Échange')} />
                    <label className="form-check-label" htmlFor="type-echange">Échange</label>
                  </div>
                </div>
                <div className="mb-3">
                  <b>Produits à retourner :</b> <span className="text-danger">*</span>
                  <div className="text-muted small mb-2">Sélectionnez au moins un produit à retourner</div>
                  {(retourCommande.produits || []).map((prod, idx) => (
                    <div key={idx} className="form-check">
                      <input className="form-check-input" type="checkbox" id={`retour-prod-${idx}`} checked={retourProduits.includes(idx)} onChange={() => handleToggleProduit(idx)} />
                      <label className="form-check-label" htmlFor={`retour-prod-${idx}`}>
                        <strong>{prod.nom}</strong> - Quantité : {prod.qte} - Prix : {prod.prix?.toLocaleString('fr-FR')} GNF
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mb-3">
                  <b>Raison du retour :</b> <span className="text-danger">*</span>
                  <div className="text-muted small mb-2">Sélectionnez une raison pour le retour</div>
                  {raisonsRetour.map((raison, idx) => (
                    <div key={idx} className="form-check">
                      <input className="form-check-input" type="radio" name="raison" id={`raison-${idx}`} value={raison} checked={retourRaison === raison} onChange={() => setRetourRaison(raison)} />
                      <label className="form-check-label" htmlFor={`raison-${idx}`}>{raison}</label>
                    </div>
                  ))}
                  {retourRaison === 'Autre' && (
                    <div className="mt-2">
                      <label className="form-label">Autre raison <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" value={retourAutre} onChange={e => setRetourAutre(e.target.value)} required />
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Commentaire (optionnel)</label>
                  <textarea className="form-control" rows="3" value={retourCommentaire} onChange={e => setRetourCommentaire(e.target.value)}></textarea>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseRetourModal}>
                  Annuler
                </Button>
                <Button variant="warning" type="submit">
                  <i className="bi bi-check me-1"></i>
                  Enregistrer le retour
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        )}

        {/* Correction de la fin du fichier pour fermer correctement les balises et le composant */}
        {message && (
          <div className="alert alert-success position-fixed top-0 end-0 m-4" style={{zIndex: 2000}}>{message}</div>
        )}
      </div>
    </>
  );
}