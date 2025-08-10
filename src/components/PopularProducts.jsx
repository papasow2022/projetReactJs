import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const popularProducts = [
  {
    id: "nike-air-max-270-popular",
    image: "/assets/categorie/arriver (1).png",
    name: "nike_air_max_270",
    price: "129.99 €",
    originalPrice: "159.99 €",
    discount: "19%",
    rating: 4.8,
    reviews: 1247,
    sold: 2341,
    badge: "best_seller"
  },
  {
    id: "adidas-ultraboost-22-popular",
    image: "/assets/categorie/arriver (2).png",
    name: "adidas_ultraboost_22",
    price: "149.99 €",
    originalPrice: "189.99 €",
    discount: "21%",
    rating: 4.9,
    reviews: 892,
    sold: 1876,
    badge: "trending"
  },
  {
    id: "puma-rs-x-popular",
    image: "/assets/categorie/arriver (3).png",
    name: "puma_rs_x",
    price: "89.99 €",
    originalPrice: "119.99 €",
    discount: "25%",
    rating: 4.7,
    reviews: 567,
    sold: 1234,
    badge: "hot"
  },
  {
    id: "new-balance-574-popular",
    image: "/assets/categorie/arriver (4).png",
    name: "new_balance_574",
    price: "79.99 €",
    originalPrice: "99.99 €",
    discount: "20%",
    rating: 4.6,
    reviews: 445,
    sold: 987,
    badge: "popular"
  },
  {
    id: "levis-501-jeans-popular",
    image: "/assets/categorie/arriver (2).png",
    name: "levis_501_jeans",
    price: "89.99 €",
    originalPrice: "129.99 €",
    discount: "31%",
    rating: 4.8,
    reviews: 678,
    sold: 1456,
    badge: "best_seller"
  },
  {
    id: "calvin-klein-chinos-popular",
    image: "/assets/categorie/arriver (3).png",
    name: "calvin_klein_chinos",
    price: "69.99 €",
    originalPrice: "89.99 €",
    discount: "22%",
    rating: 4.5,
    reviews: 334,
    sold: 789,
    badge: "trending"
  }
];

export default function PopularProducts() {
  const { t } = useLanguage();

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className={`bi bi-star${i < rating ? '-fill' : ''} text-warning`}
        style={{ fontSize: '12px' }}
      ></i>
    ));
  };

  const getBadgeColor = (badge) => {
    const colors = {
      'best_seller': 'bg-success',
      'trending': 'bg-primary',
      'hot': 'bg-danger',
      'popular': 'bg-warning'
    };
    return colors[badge] || 'bg-secondary';
  };

  return (
    <section className="py-5" style={{ backgroundColor: "#ffffff" }}>
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="fw-bold mb-3" style={{ color: "#232f3e" }}>
              <i className="bi bi-fire me-2 text-danger"></i>
              {t('popular_products')}
            </h2>
            <p className="text-muted" style={{ fontSize: "18px" }}>
              {t('popular_products_subtitle')}
            </p>
          </div>
        </div>

        <div className="row g-4">
          {popularProducts.map((product) => (
            <div key={product.id} className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm" style={{ transition: "all 0.3s ease" }}
                   onMouseOver={(e) => {
                     e.currentTarget.style.transform = "translateY(-5px)";
                     e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                   }}
                   onMouseOut={(e) => {
                     e.currentTarget.style.transform = "translateY(0)";
                     e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                   }}>
                
                {/* Badge */}
                <div className="position-absolute top-0 start-0 m-2">
                  <span className={`badge ${getBadgeColor(product.badge)} text-white px-2 py-1`}>
                    {t(product.badge)}
                  </span>
                </div>

                {/* Image */}
                <div className="position-relative">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={t(product.name)}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  
                  {/* Discount badge */}
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge bg-danger text-white px-2 py-1">
                      -{product.discount}
                    </span>
                  </div>
                </div>

                <div className="card-body d-flex flex-column">
                  {/* Product info */}
                  <h6 className="card-title fw-bold mb-2" style={{ color: "#232f3e" }}>
                    {t(product.name)}
                  </h6>
                  
                  {/* Rating */}
                  <div className="d-flex align-items-center mb-2">
                    <div className="me-2">
                      {renderStars(product.rating)}
                    </div>
                    <small className="text-muted">
                      {product.rating} ({product.reviews} {t('reviews')})
                    </small>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <span className="fw-bold text-primary fs-5">{product.price}</span>
                    <span className="text-muted text-decoration-line-through ms-2">
                      {product.originalPrice}
                    </span>
                  </div>

                  {/* Sold count */}
                  <div className="mb-3">
                    <small className="text-success">
                      <i className="bi bi-check-circle me-1"></i>
                      {product.sold} {t('sold')}
                    </small>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-auto">
                    <div className="row g-2">
                      <div className="col-8">
                        <Link 
                          to={`/product/${product.id}`}
                          className="btn btn-primary w-100"
                          style={{ fontSize: "14px" }}
                        >
                          <i className="bi bi-eye me-1"></i>
                          {t('view_product')}
                        </Link>
                      </div>
                      <div className="col-4">
                        <button 
                          className="btn btn-outline-primary w-100"
                          style={{ fontSize: "14px" }}
                          title={t('add_to_wishlist')}
                        >
                          <i className="bi bi-heart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-5">
          <Link 
            to="/catalogue" 
            className="btn btn-outline-primary btn-lg px-5"
            style={{ 
              fontSize: "18px",
              borderRadius: "8px",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,123,255,0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <i className="bi bi-arrow-right me-2"></i>
            {t('view_all_popular_products')}
          </Link>
        </div>
      </div>
    </section>
  );
} 