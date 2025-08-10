import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useProducts } from '../contexts/ProductsContext';

const RecommendedProducts = () => {
  const { t } = useLanguage();
  const { allProducts } = useProducts();

  // Get 8 random products for recommendations
  const getRandomProducts = (count) => {
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const recommendedProducts = getRandomProducts(8);

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }

    return stars;
  };

  return (
    <section className="recommended-products py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1" style={{ color: '#232f3e' }}>{t('your_recommendations')}</h2>
            <p className="text-muted">{t('recommended_products')}</p>
          </div>
          <Link to="/catalogue" className="btn btn-outline-primary">
            {t('see_more')} <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="row g-4">
          {recommendedProducts.map((product) => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <div className="card h-100 product-card border-0 shadow-sm">
                <div className="position-relative">
                  <Link to={`/product/${product.id}`}>
                    <img 
                      src={product.image} 
                      className="card-img-top" 
                      alt={product.name} 
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  </Link>
                  {product.discount > 0 && (
                    <span className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded-pill">
                      -{product.discount}%
                    </span>
                  )}
                  {product.isNew && (
                    <span className="position-absolute top-0 end-0 bg-success text-white px-2 py-1 m-2 rounded-pill">
                      {t('new')}
                    </span>
                  )}
                </div>
                <div className="card-body">
                  <h5 className="card-title mb-1 text-truncate">
                    <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                      {t(product.name) || product.name}
                    </Link>
                  </h5>
                  <div className="mb-2 d-flex align-items-center">
                    <div className="me-2">{renderStars(product.rating || 4)}</div>
                    <small className="text-muted">({product.reviewCount || Math.floor(Math.random() * 100) + 5})</small>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="fw-bold" style={{ color: '#B12704' }}>
                        {product.price.toLocaleString('fr-FR')} €
                      </span>
                      {product.originalPrice && (
                        <small className="text-muted text-decoration-line-through ms-2">
                          {product.originalPrice.toLocaleString('fr-FR')} €
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white border-top-0 p-3">
                  <div className="d-grid">
                    <Link to={`/product/${product.id}`} className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-eye me-1"></i> {t('view_product')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 8px;
          overflow: hidden;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        .card-img-top {
          transition: transform 0.5s ease;
        }
        .product-card:hover .card-img-top {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
};

export default RecommendedProducts;