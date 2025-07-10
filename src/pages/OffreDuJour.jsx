import React, { useState, useEffect } from 'react';
import '../amazon-like.css';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const offres = [
  {
    id: 1,
    nom: "Nike Air Max 270",
    image: "/assets/categorie/arriver (1).png",
    prix: 129.99,
    ancienPrix: 159.99,
    reduction: 19,
    note: 4.5,
    stock: 8,
    categorie: "Chaussures",
    badge: "Offre du jour",
    description: "Chaussure running homme, confort et style, idéale pour le sport et la ville."
  },
  {
    id: 2,
    nom: "Adidas Ultraboost 22",
    image: "/assets/categorie/arriver (2).png",
    prix: 149.99,
    ancienPrix: 179.99,
    reduction: 17,
    note: 4.3,
    stock: 5,
    categorie: "Chaussures",
    badge: "-17%",
    description: "Performance et amorti maximal, chaussure running nouvelle génération."
  },
  {
    id: 3,
    nom: "Puma RS-X",
    image: "/assets/categorie/arriver (3).png",
    prix: 89.99,
    ancienPrix: 119.99,
    reduction: 25,
    note: 4.1,
    stock: 12,
    categorie: "Chaussures",
    badge: "-25%",
    description: "Sneaker rétro, look urbain, confort moderne pour tous les jours."
  },
  {
    id: 4,
    nom: "Veste légère Nike",
    image: "/assets/categorie/arriver (1).png",
    prix: 59.99,
    ancienPrix: 79.99,
    reduction: 25,
    note: 4.6,
    stock: 10,
    categorie: "Vestes",
    badge: "-25%",
    description: "Veste légère coupe-vent, idéale pour le sport ou la ville."
  },
  {
    id: 5,
    nom: "Sac à dos Adidas",
    image: "/assets/categorie/arriver (2).png",
    prix: 39.99,
    ancienPrix: 49.99,
    reduction: 20,
    note: 4.2,
    stock: 7,
    categorie: "Accessoires",
    badge: "-20%",
    description: "Sac à dos pratique pour le quotidien, compartiment ordinateur."
  }
];

const categories = ["Toutes", "Chaussures", "Vestes", "Accessoires"];

function getTimeLeft() {
  const now = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const diff = end - now;
  const h = Math.floor(diff / 1000 / 60 / 60);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { h, m, s };
}

export default function OffreDuJour() {
  const [filtreCat, setFiltreCat] = useState("Toutes");
  const [filtrePrix, setFiltrePrix] = useState([0, 200]);
  const [filtreNote, setFiltreNote] = useState(0);
  const [timer, setTimer] = useState(getTimeLeft());
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setTimer(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const offresFiltrees = offres.filter(o =>
    (filtreCat === "Toutes" || o.categorie === filtreCat) &&
    o.prix >= filtrePrix[0] && o.prix <= filtrePrix[1] &&
    o.note >= filtreNote
  );

  function handleAddToCart(produit) {
    const stored = localStorage.getItem('cart');
    let cart = stored ? JSON.parse(stored) : [];
    const idx = cart.findIndex(item => item.id === produit.id);
    if (idx !== -1) {
      cart[idx].qty = (cart[idx].qty || 1) + 1;
    } else {
      cart.push({ id: produit.id, name: produit.nom, price: produit.prix, image: produit.image, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  return (
    <>
      <Header />
      <div className="container-fluid py-4">
        <h1 className="mb-3 text-warning fw-bold" style={{fontSize: '2.2rem'}}>Offres du jour</h1>
        <div className="card mb-4 p-4 d-flex flex-column flex-md-row align-items-center justify-content-between bg-light shadow-sm">
          <div className="d-flex align-items-center gap-4">
            <img src={offres[0].image} alt={offres[0].nom} style={{width: 120, height: 120, objectFit: 'contain', borderRadius: 8, border: '1px solid #eee', background: '#fff'}} />
            <div>
              <h2 className="fw-bold mb-2" style={{fontSize: '1.5rem'}}>{offres[0].nom}</h2>
              <div className="mb-2">
                <span className="badge bg-danger me-2">{offres[0].badge}</span>
                <span className="text-danger fw-bold h4">€{offres[0].prix}</span>
                <span className="text-muted text-decoration-line-through ms-2">€{offres[0].ancienPrix}</span>
              </div>
              <p className="mb-1">{offres[0].description}</p>
              <span className="badge bg-warning text-dark">Stock : {offres[0].stock}</span>
            </div>
          </div>
          <div className="text-center mt-3 mt-md-0">
            <div className="mb-2 fw-bold">Se termine dans :</div>
            <div style={{fontSize: '2rem', fontWeight: 700, letterSpacing: 2}}>
              {String(timer.h).padStart(2, '0')}:{String(timer.m).padStart(2, '0')}:{String(timer.s).padStart(2, '0')}
            </div>
            <button className="btn btn-warning mt-2 px-4 py-2" onClick={() => navigate('/offres')}>J'en profite</button>
          </div>
        </div>
        <div className="row mb-3 g-3">
          <div className="col-md-3">
            <div className="card p-3 mb-3">
              <h6 className="fw-bold mb-3">Filtrer par catégorie</h6>
              <select className="form-select mb-2" value={filtreCat} onChange={e => setFiltreCat(e.target.value)}>
                {categories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
              <h6 className="fw-bold mt-3 mb-2">Prix</h6>
              <input type="range" min={0} max={200} value={filtrePrix[1]} onChange={e => setFiltrePrix([0, Number(e.target.value)])} className="form-range" />
              <div className="d-flex justify-content-between small">
                <span>0€</span><span>{filtrePrix[1]}€</span>
              </div>
              <h6 className="fw-bold mt-3 mb-2">Note minimale</h6>
              <select className="form-select" value={filtreNote} onChange={e => setFiltreNote(Number(e.target.value))}>
                <option value={0}>Toutes</option>
                <option value={3}>3 étoiles</option>
                <option value={4}>4 étoiles</option>
                <option value={4.5}>4.5 étoiles</option>
              </select>
            </div>
          </div>
          <div className="col-md-9">
            <div className="row g-3">
              {offresFiltrees.map(o => (
                <div className="col-md-4" key={o.id}>
                  <div className="card h-100 shadow-sm">
                    <img src={o.image} alt={o.nom} className="card-img-top p-3" style={{height: 180, objectFit: 'contain'}} />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold mb-2">{o.nom}</h5>
                      <div className="mb-2">
                        <span className="badge bg-danger me-2">{o.badge}</span>
                        <span className="text-danger fw-bold">€{o.prix}</span>
                        <span className="text-muted text-decoration-line-through ms-2">€{o.ancienPrix}</span>
                      </div>
                      <div className="mb-2">
                        <span className="badge bg-warning text-dark">Stock : {o.stock}</span>
                        <span className="ms-2">Note : {o.note} <i className="bi bi-star-fill text-warning"></i></span>
                      </div>
                      <p className="card-text small mb-2">{o.description}</p>
                      <button className="btn btn-warning mt-auto" onClick={() => handleAddToCart(o)}>Ajouter au panier</button>
                    </div>
                  </div>
                </div>
              ))}
              {offresFiltrees.length === 0 && (
                <div className="col-12 text-center text-muted py-5">Aucune offre ne correspond à vos filtres.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 