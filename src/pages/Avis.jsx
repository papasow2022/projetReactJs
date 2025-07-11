import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../amazon-like.css';

// Données simulées pour les avis
const avisUtilisateur = [
  {
    id: 1,
    produit: {
      nom: "Nike Air Max 270",
      image: "/assets/images/product1.jpg",
      prix: "129.99 €",
      categorie: "Chaussures de sport"
    },
    note: 5,
    titre: "Excellent confort et style",
    commentaire: "Ces chaussures sont parfaites pour le sport quotidien. Le confort est exceptionnel et le design est moderne. Je recommande vivement !",
    date: "2024-01-15",
    statut: "publié",
    likes: 12,
    reponses: 2
  },
  {
    id: 2,
    produit: {
      nom: "Adidas Ultraboost 22",
      image: "/assets/images/product2.jpg",
      prix: "179.99 €",
      categorie: "Chaussures de running"
    },
    note: 4,
    titre: "Très bonnes chaussures",
    commentaire: "Qualité excellente, amorti parfait. Seul bémol : le prix un peu élevé. Sinon, je suis très satisfait de mon achat.",
    date: "2024-01-10",
    statut: "publié",
    likes: 8,
    reponses: 1
  },
  {
    id: 3,
    produit: {
      nom: "Puma RS-X",
      image: "/assets/images/product3.jpg",
      prix: "89.99 €",
      categorie: "Chaussures lifestyle"
    },
    note: 3,
    titre: "Correct mais pas exceptionnel",
    commentaire: "Le design est sympa mais le confort pourrait être meilleur. Prix correct pour la qualité proposée.",
    date: "2024-01-05",
    statut: "en attente",
    likes: 3,
    reponses: 0
  }
];

const statistiques = {
  totalAvis: 15,
  moyenneGlobale: 4.2,
  repartitionNotes: {
    5: 8,
    4: 4,
    3: 2,
    2: 1,
    1: 0
  },
  avisVerifies: 12,
  avisAvecPhotos: 7
};

export default function Avis() {
  const [avis, setAvis] = useState(avisUtilisateur);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [triPar, setTriPar] = useState('date');
  const [avisSelectionne, setAvisSelectionne] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commandeId, setCommandeId] = useState(null);
  const [modeModification, setModeModification] = useState(false);
  const [showAvisForm, setShowAvisForm] = useState(false);

  // Détecter les paramètres d'URL au chargement
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const commande = urlParams.get('commande');
    const modifier = urlParams.get('modifier');
    
    if (commande) {
      setCommandeId(commande);
      setModeModification(modifier === 'true');
      setShowAvisForm(true);
    }
  }, []);

  // Filtrer les avis selon le statut
  const avisFiltres = avis.filter(avis => {
    if (filtreStatut === 'tous') return true;
    return avis.statut === filtreStatut;
  });

  // Trier les avis
  const avisTries = [...avisFiltres].sort((a, b) => {
    switch (triPar) {
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'note':
        return b.note - a.note;
      case 'likes':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  // Calculer la note moyenne
  const noteMoyenne = avis.length > 0 
    ? (avis.reduce((sum, a) => sum + a.note, 0) / avis.length).toFixed(1)
    : 0;

  // Supprimer un avis
  const supprimerAvis = (id) => {
    setAvis(avis.filter(a => a.id !== id));
    setShowModal(false);
  };

  // Modifier un avis
  const modifierAvis = (avisModifie) => {
    setAvis(avis.map(a => a.id === avisModifie.id ? avisModifie : a));
    setShowModal(false);
  };

  // Rendu des étoiles
  const renderStars = (note) => {
    return [...Array(5)].map((_, i) => (
      <i 
        key={i} 
        className={`bi ${i < note ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
        style={{fontSize: '1.1rem'}}
      ></i>
    ));
  };

  return (
    <>
      <Header />
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4 text-warning fw-bold" style={{fontSize: '2.2rem'}}>
              <i className="bi bi-star-fill me-3"></i>
              Mes Avis et Évaluations
            </h1>

            {/* Formulaire d'avis pour une commande spécifique */}
            {showAvisForm && commandeId && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-warning text-dark border-0">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-star me-2"></i>
                    {modeModification ? 'Modifier votre avis' : 'Laisser un avis'}
                  </h5>
                  <small>Commande {commandeId}</small>
                </div>
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-md-8">
                      <form>
                        <div className="mb-3">
                          <label className="form-label fw-bold">Note globale</label>
                          <div className="d-flex gap-1">
                            {[1,2,3,4,5].map(star => (
                              <button
                                key={star}
                                type="button"
                                className="btn btn-link p-0"
                                style={{fontSize: '2rem'}}
                              >
                                <i className="bi bi-star-fill text-warning"></i>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label fw-bold">Titre de votre avis</label>
                          <input 
                            type="text" 
                            className="form-control"
                            placeholder="Résumez votre expérience..."
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label fw-bold">Votre commentaire</label>
                          <textarea 
                            className="form-control" 
                            rows="4"
                            placeholder="Partagez votre expérience avec ce produit..."
                          ></textarea>
                        </div>
                        
                        <div className="d-flex gap-2">
                          <button type="submit" className="btn btn-warning fw-bold">
                            <i className="bi bi-check me-1"></i>
                            {modeModification ? 'Modifier l\'avis' : 'Publier l\'avis'}
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setShowAvisForm(false);
                              setCommandeId(null);
                              // Nettoyer l'URL
                              window.history.replaceState({}, document.title, window.location.pathname);
                            }}
                          >
                            Annuler
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="col-md-4">
                      <div className="bg-light p-3 rounded">
                        <h6 className="fw-bold mb-2">Conseils pour un bon avis :</h6>
                        <ul className="small text-muted mb-0">
                          <li>Décrivez votre expérience d'utilisation</li>
                          <li>Mentionnez les points forts et faibles</li>
                          <li>Parlez de la qualité et du rapport qualité/prix</li>
                          <li>Soyez honnête et constructif</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistiques générales */}
            <div className="row g-4 mb-5">
              <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: 60, height: 60}}>
                      <i className="bi bi-star-fill text-white fs-2"></i>
                    </div>
                    <h3 className="fw-bold text-primary mb-1">{noteMoyenne}</h3>
                    <p className="text-muted mb-0">Note moyenne</p>
                    {renderStars(Math.round(noteMoyenne))}
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: 60, height: 60}}>
                      <i className="bi bi-chat-quote-fill text-white fs-2"></i>
                    </div>
                    <h3 className="fw-bold text-success mb-1">{statistiques.totalAvis}</h3>
                    <p className="text-muted mb-0">Total des avis</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: 60, height: 60}}>
                      <i className="bi bi-check-circle-fill text-dark fs-2"></i>
                    </div>
                    <h3 className="fw-bold text-warning mb-1">{statistiques.avisVerifies}</h3>
                    <p className="text-muted mb-0">Avis vérifiés</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-info rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: 60, height: 60}}>
                      <i className="bi bi-heart-fill text-white fs-2"></i>
                    </div>
                    <h3 className="fw-bold text-info mb-1">{avis.reduce((sum, a) => sum + a.likes, 0)}</h3>
                    <p className="text-muted mb-0">Likes reçus</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtres et tri */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-3">
                  <label className="fw-bold mb-0">Filtrer par :</label>
                  <select 
                    className="form-select" 
                    style={{width: 'auto'}}
                    value={filtreStatut}
                    onChange={(e) => setFiltreStatut(e.target.value)}
                  >
                    <option value="tous">Tous les avis</option>
                    <option value="publié">Avis publiés</option>
                    <option value="en attente">En attente</option>
                    <option value="rejeté">Rejetés</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-3 justify-content-end">
                  <label className="fw-bold mb-0">Trier par :</label>
                  <select 
                    className="form-select" 
                    style={{width: 'auto'}}
                    value={triPar}
                    onChange={(e) => setTriPar(e.target.value)}
                  >
                    <option value="date">Date</option>
                    <option value="note">Note</option>
                    <option value="likes">Popularité</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Liste des avis */}
            <div className="row">
              <div className="col-12">
                {avisTries.length > 0 ? (
                  avisTries.map((avisItem) => (
                    <div key={avisItem.id} className="card border-0 shadow-sm mb-4 hover-shadow">
                      <div className="card-body p-4">
                        <div className="row">
                          {/* Image du produit */}
                          <div className="col-md-2">
                            <img 
                              src={avisItem.produit.image} 
                              alt={avisItem.produit.nom}
                              className="img-fluid rounded"
                              style={{width: '100%', maxWidth: '100px'}}
                            />
                          </div>
                          
                          {/* Contenu de l'avis */}
                          <div className="col-md-8">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h5 className="fw-bold mb-1">{avisItem.produit.nom}</h5>
                              <span className={`badge ${avisItem.statut === 'publié' ? 'bg-success' : avisItem.statut === 'en attente' ? 'bg-warning' : 'bg-danger'}`}>
                                {avisItem.statut}
                              </span>
                            </div>
                            
                            <p className="text-muted small mb-2">{avisItem.produit.categorie} • {avisItem.produit.prix}</p>
                            
                            <div className="mb-2">
                              {renderStars(avisItem.note)}
                            </div>
                            
                            <h6 className="fw-bold mb-2">{avisItem.titre}</h6>
                            <p className="text-muted mb-3">{avisItem.commentaire}</p>
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center gap-3">
                                <span className="text-muted small">
                                  <i className="bi bi-calendar me-1"></i>
                                  {new Date(avisItem.date).toLocaleDateString('fr-FR')}
                                </span>
                                <span className="text-muted small">
                                  <i className="bi bi-heart me-1"></i>
                                  {avisItem.likes} likes
                                </span>
                                <span className="text-muted small">
                                  <i className="bi bi-chat me-1"></i>
                                  {avisItem.reponses} réponses
                                </span>
                              </div>
                              
                              <div className="btn-group">
                                <button 
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => {
                                    setAvisSelectionne(avisItem);
                                    setShowModal(true);
                                  }}
                                >
                                  <i className="bi bi-pencil me-1"></i>
                                  Modifier
                                </button>
                                <button 
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => {
                                    setAvisSelectionne(avisItem);
                                    setShowModal(true);
                                  }}
                                >
                                  <i className="bi bi-trash me-1"></i>
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-star display-1 text-muted mb-3"></i>
                    <h4 className="text-muted">Aucun avis trouvé</h4>
                    <p className="text-muted">Vous n'avez pas encore publié d'avis ou aucun avis ne correspond à vos critères.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour modifier/supprimer */}
      {showModal && avisSelectionne && (
        <div className="modal fade show" style={{display: 'block'}} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-pencil-square me-2"></i>
                  Modifier l'avis
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-3">
                    <img 
                      src={avisSelectionne.produit.image} 
                      alt={avisSelectionne.produit.nom}
                      className="img-fluid rounded"
                    />
                  </div>
                  <div className="col-md-9">
                    <h6 className="fw-bold">{avisSelectionne.produit.nom}</h6>
                    <p className="text-muted small">{avisSelectionne.produit.categorie}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Note</label>
                  <div className="d-flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => setAvisSelectionne({...avisSelectionne, note: star})}
                      >
                        <i className={`bi ${star <= avisSelectionne.note ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`} style={{fontSize: '1.5rem'}}></i>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Titre de l'avis</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={avisSelectionne.titre}
                    onChange={(e) => setAvisSelectionne({...avisSelectionne, titre: e.target.value})}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Commentaire</label>
                  <textarea 
                    className="form-control" 
                    rows="4"
                    value={avisSelectionne.commentaire}
                    onChange={(e) => setAvisSelectionne({...avisSelectionne, commentaire: e.target.value})}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger me-2"
                  onClick={() => supprimerAvis(avisSelectionne.id)}
                >
                  <i className="bi bi-trash me-1"></i>
                  Supprimer
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => modifierAvis(avisSelectionne)}
                >
                  <i className="bi bi-check me-1"></i>
                  Enregistrer
                </button>
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