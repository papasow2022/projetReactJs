import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../amazon-like.css';
import { useCommandes } from "../contexts/CommandesContext";

// Importer les commandes simulées depuis Orders (ou dupliquer la structure ici pour la simulation)
const commandesInitiales = [
  {
    id: "CMD-2024-001",
    date: "2024-01-15",
    statut: "livrée",
    produits: [
      {
        nom: "Nike Air Max 270",
        prix: 129.99,
        qte: 1,
        image: "/assets/images/product1.jpg",
        avis: null
      },
      {
        nom: "Socks Nike",
        prix: 19.99,
        qte: 3,
        image: "/assets/images/product2.jpg",
        avis: null
      }
    ]
  },
  {
    id: "CMD-2024-003",
    date: "2024-01-05",
    statut: "livrée",
    produits: [
      {
        nom: "Adidas Ultraboost 22",
        prix: 179.99,
        qte: 1,
        image: "/assets/images/product4.jpg",
        avis: {
          note: 5,
          titre: "Super confort !",
          commentaire: "Très satisfait, je recommande."
        }
      }
    ]
  }
];

export default function Avis() {
  const { commandes, setCommandes } = useCommandes();
  const [avisForm, setAvisForm] = useState({ show: false, commandeId: null, produitIndex: null, note: 0, titre: '', commentaire: '', mode: 'ajout' });
  const [message, setMessage] = useState('');

  // Récupérer tous les avis donnés
  const avisList = [];
  commandes.forEach(cmd => {
    cmd.produits.forEach((prod, idx) => {
      if (prod.avis) {
        avisList.push({
          commandeId: cmd.id,
          date: cmd.date,
          produitIndex: idx,
          ...prod,
        });
      }
    });
  });

  return (
    <>
      <Header />
      <div className="container-fluid py-4">
        <h1 className="mb-4 text-warning fw-bold" style={{fontSize: '2.2rem'}}>
          <i className="bi bi-star-fill me-3"></i>
          Mes Avis par Produit
        </h1>

        {avisList.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-star display-1 text-muted mb-3"></i>
            <h4 className="text-muted">Vous n'avez encore donné aucun avis.</h4>
            <p className="text-muted">Laissez un avis sur vos produits livrés depuis la page Commandes.</p>
          </div>
        )}

        <div className="row g-4">
          {avisList.map((avis, idx) => (
            <div className="col-md-6" key={idx}>
              <div className="card border-0 shadow-sm mb-4 hover-shadow">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <img src={avis.image} alt={avis.nom} className="rounded me-3" style={{width: '70px', height: '70px', objectFit: 'cover'}} />
                    <div>
                      <h5 className="fw-bold mb-1">{avis.nom}</h5>
                      <div className="text-muted small">Commande {avis.commandeId} • {new Date(avis.date).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                  <div className="mb-2">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`bi ${i < avis.avis.note ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}></i>
                    ))}
                  </div>
                  <h6 className="fw-bold mb-2">{avis.avis.titre}</h6>
                  <p className="text-muted mb-3">{avis.avis.commentaire}</p>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => setAvisForm({ show: true, commandeId: avis.commandeId, produitIndex: avis.produitIndex, note: avis.avis.note, titre: avis.avis.titre, commentaire: avis.avis.commentaire, mode: 'modif' })}
                  >
                    <i className="bi bi-pencil me-1"></i>
                    Modifier mon avis
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Formulaire d'avis contextuel */}
        {avisForm.show && (
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div style={{
              background: "#fff",
              padding: 32,
              borderRadius: 10,
              minWidth: 350,
              maxWidth: "90vw",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)"
            }}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16}}>
                <h4 style={{margin: 0}}>Modifier mon avis</h4>
                <button
                  onClick={() => setAvisForm({ ...avisForm, show: false })}
                  style={{
                    background: "none", border: "none", fontSize: 28, cursor: "pointer", color: "#888"
                  }}
                  aria-label="Fermer"
                >×</button>
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
                setMessage('Avis modifié avec succès !');
                setTimeout(() => setMessage(''), 2500);
              }}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Note</label>
                  <div style={{display: "flex", gap: 4, marginBottom: 8}}>
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        type="button"
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: 32,
                          color: star <= avisForm.note ? "#ffc107" : "#ccc",
                          cursor: "pointer"
                        }}
                        onClick={() => setAvisForm({ ...avisForm, note: star })}
                        aria-label={`Donner la note de ${star} étoile${star > 1 ? 's' : ''}`}
                      >★</button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Titre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={avisForm.titre}
                    onChange={e => setAvisForm({ ...avisForm, titre: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Commentaire</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={avisForm.commentaire}
                    onChange={e => setAvisForm({ ...avisForm, commentaire: e.target.value })}
                    required
                  />
                </div>
                <div style={{display: "flex", gap: 8, justifyContent: "flex-end"}}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setAvisForm({ ...avisForm, show: false })}
                  >Annuler</button>
                  <button
                    type="submit"
                    className="btn btn-warning fw-bold"
                  >
                    <i className="bi bi-check me-1"></i>
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {message && (
          <div className="alert alert-success position-fixed top-0 end-0 m-4" style={{zIndex: 2000}}>{message}</div>
        )}
  </div>
      <Footer />
    </>
);
} 