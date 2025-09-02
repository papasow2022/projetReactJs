import React from 'react';

const FemmeSpecificSection = ({ product }) => {
  const tips = Array.isArray(product?.tips) && product.tips.length > 0
    ? product.tips
    : [
        'Parfait avec une robe ou un jean',
        'Idéal pour les occasions spéciales',
        'Style élégant et féminin'
      ];

  const care = Array.isArray(product?.care) && product.care.length > 0
    ? product.care
    : [
        "Nettoyage doux recommandé",
        "Protection contre l'humidité",
        "Stockage dans un endroit sec"
      ];

  return (
    <div className="femme-specific-section mb-4">
      <div className="bg-light rounded-3 p-3 border-start border-4 border-pink">
        <h5 className="text-pink mb-3">
          <i className="bi bi-heart-fill me-2"></i>
          Style Femme - Conseils Mode
        </h5>
        
        <div className="row">
          <div className="col-md-6">
            <h6 className="fw-bold mb-2">Conseils de style :</h6>
            <ul className="list-unstyled small">
              {tips.map((t, idx) => (
                <li key={idx}><i className="bi bi-check-circle text-success me-2"></i>{t}</li>
              ))}
            </ul>
          </div>
          
          <div className="col-md-6">
            <h6 className="fw-bold mb-2">Entretien spécial :</h6>
            <ul className="list-unstyled small">
              {care.map((c, idx) => (
                <li key={idx}><i className="bi bi-star text-warning me-2"></i>{c}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {product?.brand && (
          <div className="mt-3 p-2 bg-white rounded border">
            <small className="text-muted">
              <i className="bi bi-tag me-1"></i>
              Marque premium : <strong>{product.brand}</strong>
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default FemmeSpecificSection; 