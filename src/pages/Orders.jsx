import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../amazon-like.css';

// Données simulées pour les commandes
const commandes = [
  {
    id: "CMD-2024-001",
    date: "2024-01-15",
    statut: "livrée",
    total: 189.98,
    avisDonne: false, // Nouveau champ pour tracker si un avis a été donné
    produits: [
      { nom: "Nike Air Max 270", prix: 129.99, qte: 1, image: "/assets/images/product1.jpg" },
      { nom: "Socks Nike", prix: 19.99, qte: 3, image: "/assets/images/product2.jpg" }
    ],
    adresse: "123 Rue de la Paix, 75001 Paris",
    suivi: {
      numero: "1Z999AA1234567890",
      transporteur: "Colissimo",
      etapes: [
        { date: "2024-01-15", statut: "Commande confirmée", description: "Votre commande a été confirmée" },
        { date: "2024-01-16", statut: "En préparation", description: "Votre commande est en cours de préparation" },
        { date: "2024-01-17", statut: "Expédiée", description: "Votre commande a été expédiée" },
        { date: "2024-01-18", statut: "En transit", description: "Votre commande est en cours de livraison" },
        { date: "2024-01-19", statut: "Livrée", description: "Votre commande a été livrée" }
      ]
    }
  },
  {
    id: "CMD-2024-002",
    date: "2024-01-10",
    statut: "en cours",
    total: 89.99,
    avisDonne: false,
    produits: [
      { nom: "Puma RS-X", prix: 89.99, qte: 1, image: "/assets/images/product3.jpg" }
    ],
    adresse: "456 Avenue des Champs, 75008 Paris",
    suivi: {
      numero: "1Z999AA1234567891",
      transporteur: "Chronopost",
      etapes: [
        { date: "2024-01-10", statut: "Commande confirmée", description: "Votre commande a été confirmée" },
        { date: "2024-01-11", statut: "En préparation", description: "Votre commande est en cours de préparation" },
        { date: "2024-01-12", statut: "Expédiée", description: "Votre commande a été expédiée" },
        { date: "2024-01-13", statut: "En transit", description: "Votre commande est en cours de livraison" }
      ]
    }
  },
  {
    id: "CMD-2024-003",
    date: "2024-01-05",
    statut: "livrée",
    total: 179.99,
    avisDonne: true, // Cette commande a déjà un avis
    produits: [
      { nom: "Adidas Ultraboost 22", prix: 179.99, qte: 1, image: "/assets/images/product4.jpg" }
    ],
    adresse: "789 Boulevard Saint-Germain, 75006 Paris",
    suivi: {
      numero: "1Z999AA1234567892",
      transporteur: "DHL",
      etapes: [
        { date: "2024-01-05", statut: "Commande confirmée", description: "Votre commande a été confirmée" },
        { date: "2024-01-06", statut: "Livrée", description: "Votre commande a été livrée" }
      ]
    }
  },
  {
    id: "CMD-2024-004",
    date: "2024-01-03",
    statut: "retournée",
    total: 149.99,
    avisDonne: false,
    produits: [
      { nom: "New Balance 574", prix: 149.99, qte: 1, image: "/assets/images/product5.jpg" }
    ],
    adresse: "321 Rue de Rivoli, 75001 Paris",
    suivi: {
      numero: "1Z999AA1234567893",
      transporteur: "DHL",
      etapes: [
        { date: "2024-01-03", statut: "Commande confirmée", description: "Votre commande a été confirmée" },
        { date: "2024-01-04", statut: "Livrée", description: "Votre commande a été livrée" },
        { date: "2024-01-05", statut: "Retour demandé", description: "Retour demandé par le client" },
        { date: "2024-01-06", statut: "Retournée", description: "Commande retournée et remboursée" }
      ]
    },
    retour: {
      raison: "Taille incorrecte",
      remboursement: 149.99,
      dateRemboursement: "2024-01-07"
    }
  }
];

const retours = [
  {
    id: "RET-2024-001",
    commandeId: "CMD-2024-003",
    date: "2024-01-07",
    statut: "remboursé",
    raison: "Taille incorrecte",
    montant: 179.99,
    produits: ["Adidas Ultraboost 22"]
  }
];

export default function Orders() {
  const [activeTab, setActiveTab] = useState('historique');
  const [commandeSelectionnee, setCommandeSelectionnee] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      <Header />
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
                    {commandes.map((commande) => (
                      <div key={commande.id} className="card border-0 shadow-sm mb-4 hover-shadow">
                        <div className="card-header bg-light border-0">
                          <div className="row align-items-center">
                            <div className="col-md-6">
                              <h6 className="fw-bold mb-0">
                                <i className="bi bi-box-seam me-2 text-primary"></i>
                                Commande {commande.id}
                              </h6>
                              <small className="text-muted">
                                <i className="bi bi-calendar me-1"></i>
                                {new Date(commande.date).toLocaleDateString('fr-FR')}
                              </small>
                            </div>
                            <div className="col-md-6 text-end">
                              <span className={`badge bg-${getStatutColor(commande.statut)} me-2`}>
                                <i className={`bi ${getStatutIcon(commande.statut)} me-1`}></i>
                                {commande.statut}
                              </span>
                              <span className="fw-bold text-primary">{commande.total.toFixed(2)} €</span>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            {commande.produits.map((produit, index) => (
                              <div key={index} className="col-md-6 mb-3">
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
                                      Quantité: {produit.qte} • {produit.prix.toFixed(2)} €
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="row mt-3">
                            <div className="col-12">
                              <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => {
                                  setCommandeSelectionnee(commande);
                                  setShowModal(true);
                                }}
                              >
                                <i className="bi bi-eye me-1"></i>
                                Voir les détails
                              </button>
                                                             {commande.statut === 'livrée' && !commande.avisDonne && (
                                 <button 
                                   className="btn btn-outline-warning btn-sm ms-2"
                                   onClick={() => {
                                     // Rediriger vers la page d'avis avec l'ID de la commande
                                     window.location.href = `/avis?commande=${commande.id}`;
                                   }}
                                 >
                                   <i className="bi bi-star me-1"></i>
                                   Laisser un avis
                                 </button>
                               )}
                               {commande.statut === 'livrée' && commande.avisDonne && (
                                 <button 
                                   className="btn btn-outline-success btn-sm ms-2"
                                   onClick={() => {
                                     // Rediriger vers la page d'avis pour modifier
                                     window.location.href = `/avis?commande=${commande.id}&modifier=true`;
                                   }}
                                 >
                                   <i className="bi bi-pencil me-1"></i>
                                   Modifier mon avis
                                 </button>
                               )}
                            </div>
                          </div>
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
                    {commandes.filter(c => c.statut === 'en cours').map((commande) => (
                      <div key={commande.id} className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-warning text-dark border-0">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <h6 className="fw-bold mb-0">
                                <i className="bi bi-truck me-2"></i>
                                Suivi de la commande {commande.id}
                              </h6>
                              <small>
                                Transporteur: {commande.suivi.transporteur} • 
                                Numéro: {commande.suivi.numero}
                              </small>
                            </div>
                            <div className="col-md-4 text-end">
                              <span className="badge bg-warning text-dark">
                                <i className="bi bi-clock me-1"></i>
                                En cours de livraison
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="timeline">
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
                                    {new Date(etape.date).toLocaleDateString('fr-FR')}
                                  </small>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    {commandes.filter(c => c.statut === 'en cours').length === 0 && (
                      <div className="text-center py-5">
                        <i className="bi bi-truck display-1 text-muted mb-3"></i>
                        <h4 className="text-muted">Aucune livraison en cours</h4>
                        <p className="text-muted">Vous n'avez actuellement aucune commande en cours de livraison.</p>
                      </div>
                    )}
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
                    {retours.map((retour) => (
                      <div key={retour.id} className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-info text-white border-0">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <h6 className="fw-bold mb-0">
                                <i className="bi bi-arrow-return-left me-2"></i>
                                Retour {retour.id}
                              </h6>
                              <small>Commande: {retour.commandeId}</small>
                            </div>
                            <div className="col-md-4 text-end">
                              <span className="badge bg-success">
                                <i className="bi bi-check-circle me-1"></i>
                                {retour.statut}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <h6 className="fw-bold">Détails du retour</h6>
                              <p className="text-muted mb-2">
                                <strong>Raison:</strong> {retour.raison}
                              </p>
                              <p className="text-muted mb-2">
                                <strong>Date de retour:</strong> {new Date(retour.date).toLocaleDateString('fr-FR')}
                              </p>
                              <p className="text-muted mb-0">
                                <strong>Produits:</strong> {retour.produits.join(', ')}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <h6 className="fw-bold">Remboursement</h6>
                              <div className="bg-light p-3 rounded">
                                <div className="d-flex justify-content-between align-items-center">
                                  <span>Montant remboursé:</span>
                                  <span className="fw-bold text-success">{retour.montant.toFixed(2)} €</span>
                                </div>
                                <small className="text-muted">
                                  Remboursement effectué le {new Date(retour.date).toLocaleDateString('fr-FR')}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {retours.length === 0 && (
                      <div className="text-center py-5">
                        <i className="bi bi-arrow-return-left display-1 text-muted mb-3"></i>
                        <h4 className="text-muted">Aucun retour</h4>
                        <p className="text-muted">Vous n'avez effectué aucun retour pour le moment.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour les détails de commande */}
      {showModal && commandeSelectionnee && (
        <div className="modal fade show" style={{display: 'block'}} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
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
              <div className="modal-body">
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
                    <p className="text-muted mb-0">{commandeSelectionnee.adresse}</p>
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
              <div className="modal-footer">
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
        </div>
      )}

      {/* Overlay pour le modal */}
      {showModal && (
        <div 
          className="modal-backdrop fade show" 
          onClick={() => setShowModal(false)}
        ></div>
      )}

      <Footer />
    </>
  );
} 