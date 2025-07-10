import React, { useState } from 'react';
import '../amazon-like.css';
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
    livraison: "Prime",
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
    livraison: "Prime",
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
    livraison: "Standard",
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
    livraison: "Prime",
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
    livraison: "Standard",
    badge: "-20%",
    description: "Sac à dos pratique pour le quotidien, compartiment ordinateur."
  }
];

const categories = ["Toutes", "Chaussures", "Vestes", "Accessoires"];
const tris = [
  { value: 'pertinence', label: 'Pertinence' },
  { value: 'prix-asc', label: 'Prix croissant' },
  { value: 'prix-desc', label: 'Prix décroissant' },
  { value: 'note', label: 'Meilleures notes' }
];

export default function OffresAmazonLike() {
  const [filtreCat, setFiltreCat] = useState("Toutes");
  const [filtrePrix, setFiltrePrix] = useState([0, 200]);
  const [filtreRemise, setFiltreRemise] = useState(0);
  const [filtreLivraison, setFiltreLivraison] = useState('Toutes');
  const [filtreNote, setFiltreNote] = useState(0);
  const [tri, setTri] = useState('pertinence');

  let offresFiltrees = offres.filter(o =>
    (filtreCat === "Toutes" || o.categorie === filtreCat) &&
    o.prix >= filtrePrix[0] && o.prix <= filtrePrix[1] &&
    o.reduction >= filtreRemise &&
    (filtreLivraison === 'Toutes' || o.livraison === filtreLivraison) &&
    o.note >= filtreNote
  );

  if (tri === 'prix-asc') offresFiltrees = offresFiltrees.sort((a, b) => a.prix - b.prix);
  if (tri === 'prix-desc') offresFiltrees = offresFiltrees.sort((a, b) => b.prix - a.prix);
  if (tri === 'note') offresFiltrees = offresFiltrees.sort((a, b) => b.note - a.note);

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
        <h1 className="mb-3 text-warning fw-bold" style={{fontSize: '2.2rem'}}>Toutes les offres du jour</h1>
        <div className="row mb-3 g-3">
          <div className="col-md-3">
            <div className="card p-3 mb-3">
              <h6 className="fw-bold mb-3">Catégorie</h6>
              <select className="form-select mb-2" value={filtreCat} onChange={e => setFiltreCat(e.target.value)}>
                {categories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
              <h6 className="fw-bold mt-3 mb-2">Prix</h6>
              <input type="range" min={0} max={200} value={filtrePrix[1]} onChange={e => setFiltrePrix([0, Number(e.target.value)])} className="form-range" />
              <div className="d-flex justify-content-between small">
                <span>0€</span><span>{filtrePrix[1]}€</span>
              </div>
              <h6 className="fw-bold mt-3 mb-2">Remise minimale</h6>
              <select className="form-select" value={filtreRemise} onChange={e => setFiltreRemise(Number(e.target.value))}>
                <option value={0}>Toutes</option>
                <option value={10}>10% et plus</option>
                <option value={20}>20% et plus</option>
                <option value={30}>30% et plus</option>
              </select>
              <h6 className="fw-bold mt-3 mb-2">Livraison</h6>
              <select className="form-select" value={filtreLivraison} onChange={e => setFiltreLivraison(e.target.value)}>
                <option value="Toutes">Toutes</option>
                <option value="Prime">Prime</option>
                <option value="Standard">Standard</option>
              </select>
              <h6 className="fw-bold mt-3 mb-2">Note minimale</h6>
              <select className="form-select" value={filtreNote} onChange={e => setFiltreNote(Number(e.target.value))}>
                <option value={0}>Toutes</option>
                <option value={3}>3 étoiles</option>
                <option value={4}>4 étoiles</option>
                <option value={4.5}>4.5 étoiles</option>
              </select>
              <h6 className="fw-bold mt-3 mb-2">Trier par</h6>
              <select className="form-select" value={tri} onChange={e => setTri(e.target.value)}>
                {tris.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
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
                        {o.livraison === 'Prime' && <span className="badge bg-primary ms-2">Prime</span>}
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