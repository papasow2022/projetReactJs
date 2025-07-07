import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import Header from "../../components/Header";

function Homme() {
  const { t } = useLanguage();
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Données des produits
  const products = [
    {
      id: 1,
      name: "Sneakers Nike Air Max",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.5,
      reviews: 1247,
      image: "/assets/categorie/arriver (1).png",
      brand: "Nike",
      inStock: true,
      fastDelivery: true,
      prime: true
    },
    {
      id: 2,
      name: "Chaussures de sport Adidas",
      price: 74.99,
      originalPrice: 99.99,
      rating: 4.3,
      reviews: 892,
      image: "/assets/categorie/arriver (2).png",
      brand: "Adidas",
      inStock: true,
      fastDelivery: false,
      prime: true
    },
    {
      id: 3,
      name: "Baskets Puma RS-X",
      price: 65.50,
      originalPrice: 85.00,
      rating: 4.7,
      reviews: 1563,
      image: "/assets/categorie/arriver (3).png",
      brand: "Puma",
      inStock: true,
      fastDelivery: true,
      prime: false
    },
    {
      id: 4,
      name: "Chaussures casual Converse",
      price: 55.00,
      originalPrice: 55.00,
      rating: 4.2,
      reviews: 2341,
      image: "/assets/categorie/arriver (4).png",
      brand: "Converse",
      inStock: false,
      fastDelivery: false,
      prime: true
    },
    {
      id: 5,
      name: "Sneakers New Balance",
      price: 79.99,
      originalPrice: 109.99,
      rating: 4.6,
      reviews: 987,
      image: "/assets/categorie/arriver (1).png",
      brand: "New Balance",
      inStock: true,
      fastDelivery: true,
      prime: true
    },
    {
      id: 6,
      name: "Chaussures de running Asics",
      price: 94.99,
      originalPrice: 119.99,
      rating: 4.4,
      reviews: 756,
      image: "/assets/categorie/arriver (2).png",
      brand: "Asics",
      inStock: true,
      fastDelivery: false,
      prime: false
    }
  ];

  const brands = ["Nike", "Adidas", "Puma", "Converse", "New Balance", "Asics", "Reebok", "Under Armour"];

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const filteredProducts = products.filter(product => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      if (max && product.price > max) return false;
      if (min && product.price < min) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "reviews":
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

  return (
    <>
      <Header />
      <div className="container-fluid" style={{ backgroundColor: "#f6f6f6", minHeight: "100vh" }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="py-2 px-3">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="/" className="text-decoration-none">{t("all")}</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">{t("shoes")}</li>
            <li className="breadcrumb-item active" aria-current="page">{t("man")}</li>
          </ol>
        </nav>

        <div className="row">
          {/* Filtres latéraux */}
          <div className="col-lg-3 col-md-4">
            <div className="bg-white p-3 mb-3">
              <h5 className="fw-bold mb-3">{t("filters")}</h5>
              
              {/* Marques */}
              <div className="mb-4">
                <h6 className="fw-bold mb-2">{t("brands")}</h6>
                {brands.map(brand => (
                  <div key={brand} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                    />
                    <label className="form-check-label" htmlFor={`brand-${brand}`}>
                      {brand}
                    </label>
                  </div>
                ))}
              </div>

              {/* Prix */}
              <div className="mb-4">
                <h6 className="fw-bold mb-2">{t("price")}</h6>
                <select 
                  className="form-select form-select-sm"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="all">{t("all_prices")}</option>
                  <option value="0-25">{t("under")} 25€</option>
                  <option value="25-50">25€ - 50€</option>
                  <option value="50-75">50€ - 75€</option>
                  <option value="75-100">75€ - 100€</option>
                  <option value="100-999">{t("over")} 100€</option>
                </select>
              </div>

              {/* Disponibilité */}
              <div className="mb-4">
                <h6 className="fw-bold mb-2">{t("availability")}</h6>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="inStock" defaultChecked />
                  <label className="form-check-label" htmlFor="inStock">
                    {t("in_stock")}
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="prime" defaultChecked />
                  <label className="form-check-label" htmlFor="prime">
                    {t("prime")}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="col-lg-9 col-md-8">
            {/* En-tête avec tri et nombre de résultats */}
            <div className="bg-white p-3 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted">
                    {sortedProducts.length} {t("results_for")} "{t("man_shoes")}"
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <label className="me-2">{t("sort_by")}:</label>
                  <select 
                    className="form-select form-select-sm"
                    style={{ width: "auto" }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">{t("featured")}</option>
                    <option value="price-low">{t("price_low_to_high")}</option>
                    <option value="price-high">{t("price_high_to_low")}</option>
                    <option value="rating">{t("customer_reviews")}</option>
                    <option value="reviews">{t("newest_arrivals")}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grille de produits */}
            <div className="row g-3">
              {sortedProducts.map(product => (
                <div key={product.id} className="col-xl-3 col-lg-4 col-md-6">
                  <div className="bg-white p-3 h-100" style={{ border: "1px solid #e3e6e6" }}>
                    {/* Image du produit */}
                    <div className="text-center mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="img-fluid"
                        style={{ maxHeight: "200px", objectFit: "contain" }}
                      />
                    </div>

                    {/* Informations du produit */}
                    <div>
                      <h6 className="fw-bold mb-1" style={{ fontSize: "14px" }}>
                        {product.name}
                      </h6>
                      
                      {/* Prix */}
                      <div className="mb-2">
                        <span className="fw-bold text-danger" style={{ fontSize: "18px" }}>
                          {product.price.toFixed(2)}€
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-muted text-decoration-line-through ms-2">
                            {product.originalPrice.toFixed(2)}€
                          </span>
                        )}
                      </div>

                      {/* Note et avis */}
                      <div className="mb-2">
                        <span className="text-warning">{"★".repeat(Math.floor(product.rating))}</span>
                        <span className="text-muted ms-1">
                          {product.rating} ({product.reviews.toLocaleString()})
                        </span>
                      </div>

                      {/* Badges */}
                      <div className="mb-2">
                        {product.prime && (
                          <span className="badge bg-warning text-dark me-1">{t("prime")}</span>
                        )}
                        {product.fastDelivery && (
                          <span className="badge bg-success me-1">{t("fast_delivery")}</span>
                        )}
                        {!product.inStock && (
                          <span className="badge bg-danger">{t("out_of_stock")}</span>
                        )}
                      </div>

                      {/* Bouton d'action */}
                      <button 
                        className="btn btn-warning w-100"
                        disabled={!product.inStock}
                      >
                        {product.inStock ? t("add_to_cart") : t("out_of_stock")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="bg-white p-3 mt-3">
              <nav aria-label="Pagination">
                <ul className="pagination justify-content-center mb-0">
                  <li className="page-item disabled">
                    <span className="page-link">{t("previous")}</span>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">1</span>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">2</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">3</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">{t("next")}</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Homme;
