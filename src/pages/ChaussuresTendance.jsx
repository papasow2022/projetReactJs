import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from "../contexts/LanguageContext";

const formatGNF = (amount) => amount ? new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' GNF' : '0 GNF';

// Exemple de produits (à adapter selon tes vraies images et données)
const chaussures = [
  {
    id: 'nike-air-max-270',
    name: 'Nike Air Max 270',
    price: 1299900,
    image: '/assets/chaussure/nike-air-max-270.jpg',
    rating: 4.5,
    reviewCount: 1247
  },
  {
    id: 'adidas-ultraboost-22',
    name: 'Adidas Ultraboost 22',
    price: 1499900,
    image: '/assets/chaussure/adidas-ultraboost-22.jpg',
    rating: 4.3,
    reviewCount: 892
  },
  {
    id: 'puma-rs-x',
    name: 'Puma RS-X',
    price: 899900,
    image: '/assets/chaussure/puma-rs-x.jpg',
    rating: 4.1,
    reviewCount: 567
  },
  {
    id: 'new-balance-574',
    name: 'New Balance 574',
    price: 799900,
    image: '/assets/chaussure/new-balance-574.jpg',
    rating: 4.4,
    reviewCount: 1234
  },
  // Ajoute d'autres produits ici...
];

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  for (let i = 0; i < fullStars; i++) stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
  if (hasHalfStar) stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
  return stars;
};

export default function ChaussuresTendance() {
  return (
    <div className="container py-5" style={{ maxWidth: 1300 }}>
      <h2 className="fw-bold mb-4" style={{ color: '#232f3e' }}>Chaussures tendance pour tous</h2>
      <div className="row g-4">
        {chaussures.map((prod) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={prod.id}>
            <Link to={`/product/${prod.id}`} className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 hover-shadow" style={{ transition: 'box-shadow 0.2s' }}>
                <img src={prod.image} alt={prod.name} className="card-img-top" style={{ height: 220, objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-2" style={{ color: '#232f3e', fontSize: 18 }}>{prod.name}</h5>
                  <div className="mb-1">
                    {renderStars(prod.rating)}
                    <span className="ms-2 text-muted" style={{ fontSize: 14 }}>({prod.reviewCount})</span>
                  </div>
                  <div className="fw-bold" style={{ color: '#e47911', fontSize: 18 }}>{formatGNF(prod.price)}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 