import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../amazon-like.css';
import { useCommandes } from "../contexts/CommandesContext";

// SUPPRESSION de la variable commandesInitiales locale

const retours = [
  {
    id: "RET-2024-001",
    commandeId: "CMD-2024-004",
    date: "2024-01-07",
    statut: "remboursé",
    raison: "Taille incorrecte",
    montant: 149.99,
    produits: ["New Balance 574"]
  }
];

export default function Orders() {
  const { commandes = [], setCommandes } = useCommandes();
  // Debug : log des commandes
  console.log('Commandes du contexte :', commandes);
  const [activeTab, setActiveTab] = useState('historique');
  const [commandeSelectionnee, setCommandeSelectionnee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [avisForm, setAvisForm] = useState({ show: false, commandeId: null, produitIndex: null, note: 0, titre: '', commentaire: '', mode: 'ajout' });
  const [message, setMessage] = useState('');
  // const [erreur, setErreur] = useState(null); // On retire la gestion d'erreur ici

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

  // Ajout de la variable retours pour éviter une erreur si elle n’est pas définie
  const retours = []; // À remplacer par votre logique

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
                              <span className="fw-bold text-primary">
                                {commande.total ? commande.total.toFixed(2) : '0.00'} €
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            {commande.produits.map((produit, pIdx) => (
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
                                        Quantité: {produit.qte} • {produit.prix.toFixed(2)} €
                                      </p>
                                    </div>
                                  </div>
                                  {/* Boutons d'avis par produit */}
                                  {commande.statut === 'livrée' && (
                                    produit.avis ? (
                                      <button
                                        className="btn btn-outline-success btn-sm ms-2"
                                        onClick={() => setAvisForm({ show: true, commandeId: commande.id, produitIndex: pIdx, note: produit.avis.note, titre: produit.avis.titre, commentaire: produit.avis.commentaire, mode: 'modif' })}
                                      >
                                        <i className="bi bi-pencil me-1"></i>
                                        Modifier mon avis
                                      </button>
                                    ) : (
                                      <button
                                        className="btn btn-outline-warning btn-sm ms-2"
                                        onClick={() => setAvisForm({ show: true, commandeId: commande.id, produitIndex: pIdx, note: 0, titre: '', commentaire: '', mode: 'ajout' })}
                                      >
                                        <i className="bi bi-star me-1"></i>
                                        Laisser un avis
                                      </button>
                                    )
                                  )}
                                </div>
                                {/* Affichage résumé de l'avis */}
                                {produit.avis && (
                                  <div className="mt-2 p-2 bg-light rounded">
                                    <div className="d-flex align-items-center mb-1">
                                      {[...Array(5)].map((_, i) => (
                                        <i key={i} className={`bi ${i < produit.avis.note ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}></i>
                                      ))}
                                      <span className="fw-bold ms-2">{produit.avis.titre}</span>
                                    </div>
                                    <div className="text-muted small">{produit.avis.commentaire}</div>
                                  </div>
                                )}
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

        {message && (
          <div className="alert alert-success position-fixed top-0 end-0 m-4" style={{zIndex: 2000}}>{message}</div>
        )}

        {/* erreur && ( // On retire la gestion d'erreur ici */}
        {/*   <div className="alert alert-danger m-4">{erreur}</div> */}
        {/* ) */}

        <Footer />
    </div>
    </>
  );
}
