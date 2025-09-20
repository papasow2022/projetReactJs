import React from 'react';
import { Link } from 'react-router-dom';

// Mock des vendeurs (à remplacer par une source réelle si besoin)
const vendeursMock = [
  {
    id: '1',
    nom: 'Nike Store',
    logo: '/assets/vendeur/accueil.jpg',
    description: 'Boutique officielle Nike. Découvrez nos dernières collections et innovations sportives.'
  },
  {
    id: '2',
    nom: 'Adidas Store',
    logo: '/assets/vendeur/veste (2).jpg',
    description: 'Adidas, la référence du sport et du lifestyle. Produits officiels et exclusivités.'
  }
];

export default function ListeBoutiques() {
  return (
    <div className="container py-5">
      <h1 className="mb-4" style={{ color: '#2563eb', fontWeight: 700 }}>Nos boutiques partenaires</h1>
      <div className="row g-4">
        {vendeursMock.map(vendeur => (
          <div className="col-md-4" key={vendeur.id}>
            <div className="card h-100 shadow-sm">
              <img src={vendeur.logo} alt={vendeur.nom} className="card-img-top" style={{ height: 180, objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{vendeur.nom}</h5>
                <p className="card-text">{vendeur.description}</p>
                <Link to={`/boutique/${vendeur.id}`} className="btn btn-primary mt-auto" style={{ background: '#2563eb', border: 'none' }}>
                  Voir la boutique
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 