import React from 'react';

const FemmeSpecificSection = ({ product }) => {
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
              <li><i className="bi bi-check-circle text-success me-2"></i>Parfait avec une robe ou un jean</li>
              <li><i className="bi bi-check-circle text-success me-2"></i>Idéal pour les occasions spéciales</li>
              <li><i className="bi bi-check-circle text-success me-2"></i>Style élégant et féminin</li>
            </ul>
          </div>
          
          <div className="col-md-6">
            <h6 className="fw-bold mb-2">Entretien spécial :</h6>
            <ul className="list-unstyled small">
              <li><i className="bi bi-star text-warning me-2"></i>Nettoyage doux recommandé</li>
              <li><i className="bi bi-star text-warning me-2"></i>Protection contre l'humidité</li>
              <li><i className="bi bi-star text-warning me-2"></i>Stockage dans un endroit sec</li>
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