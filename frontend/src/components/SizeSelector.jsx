import React, { useState, useEffect } from 'react';
import { Badge } from 'react-bootstrap';

const SizeSelector = ({ 
  product, 
  selectedSize, 
  onSizeChange, 
  disabled = false 
}) => {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (product && product.sizes) {
      setSizes(product.sizes);
      setLoading(false);
    } else {
      // Fallback pour les produits sans tailles
      setSizes([]);
      setLoading(false);
    }
  }, [product]);

  const getSizeStatus = (size) => {
    if (size.stock === 0) return 'out-of-stock';
    if (size.stock <= 2) return 'low-stock';
    return 'in-stock';
  };

  const getSizeBadgeVariant = (size) => {
    const status = getSizeStatus(size);
    switch (status) {
      case 'out-of-stock': return 'secondary';
      case 'low-stock': return 'warning';
      default: return 'primary';
    }
  };

  const getSizeText = (size) => {
    const status = getSizeStatus(size);
    switch (status) {
      case 'out-of-stock': return 'Rupture';
      case 'low-stock': return `${size.stock} restant${size.stock > 1 ? 's' : ''}`;
      default: return 'En stock';
    }
  };

  if (loading) {
    return <div className="text-muted">Chargement des tailles...</div>;
  }

  if (!sizes || sizes.length === 0) {
    return (
      <div className="text-muted">
        <Badge bg="info">Taille unique</Badge>
      </div>
    );
  }

  return (
    <div className="size-selector">
      <h6 className="mb-3">Choisir la taille :</h6>
      <div className="d-flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size.size;
          const isDisabled = size.stock === 0 || disabled;
          const status = getSizeStatus(size);
          
          return (
            <button
              key={size.size}
              className={`btn btn-outline-primary position-relative ${
                isSelected ? 'active' : ''
              } ${isDisabled ? 'disabled' : ''}`}
              style={{
                minWidth: '60px',
                height: '50px',
                border: isSelected ? '2px solid #0d6efd' : '1px solid #dee2e6',
                backgroundColor: isSelected ? '#e7f1ff' : 'white',
                opacity: isDisabled ? 0.5 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                // Forcer la visibilité de tous les éléments
                const sizeElement = e.target.querySelector('.size-number');
                const stockElement = e.target.querySelector('.stock-text');
                if (sizeElement) sizeElement.style.opacity = '1';
                if (stockElement) stockElement.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                // Forcer la visibilité de tous les éléments
                const sizeElement = e.target.querySelector('.size-number');
                const stockElement = e.target.querySelector('.stock-text');
                if (sizeElement) sizeElement.style.opacity = '1';
                if (stockElement) stockElement.style.opacity = '1';
              }}
              onClick={() => !isDisabled && onSizeChange(size.size)}
              disabled={isDisabled}
            >
              <div className="fw-bold" style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>{size.size}</div>
              <div className="small" style={{ fontSize: '11px', color: '#6c757d' }}>
                {getSizeText(size)}
              </div>
              
              {/* Indicateur de statut */}
              {status === 'out-of-stock' && (
                <div className="position-absolute top-0 end-0">
                  <Badge bg="danger" className="rounded-circle" style={{ fontSize: '8px' }}>
                    ✕
                  </Badge>
                </div>
              )}
              
              {status === 'low-stock' && (
                <div className="position-absolute top-0 end-0">
                  <Badge bg="warning" className="rounded-circle" style={{ fontSize: '8px' }}>
                    !
                  </Badge>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Légende */}
      <div className="mt-3 small text-muted">
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-1">
            <div className="bg-primary rounded" style={{ width: '12px', height: '12px' }}></div>
            <span>En stock</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <div className="bg-warning rounded" style={{ width: '12px', height: '12px' }}></div>
            <span>Stock faible</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <div className="bg-secondary rounded" style={{ width: '12px', height: '12px' }}></div>
            <span>Rupture</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeSelector;
