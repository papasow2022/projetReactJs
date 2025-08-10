import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function AdvancedSearch({ onSearch, onFiltersChange }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    priceRange: "",
    size: "",
    color: "",
    rating: "",
    availability: "",
    sortBy: "relevance"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Options de filtres
  const categories = [
    { value: "", label: "Toutes les catégories" },
    { value: "chaussures", label: "Chaussures" },
    { value: "pantalons", label: "Pantalons" },
    { value: "vestes", label: "Vestes" },
    { value: "accessoires", label: "Accessoires" }
  ];

  const brands = [
    { value: "", label: "Toutes les marques" },
    { value: "nike", label: "Nike" },
    { value: "adidas", label: "Adidas" },
    { value: "puma", label: "Puma" },
    { value: "new-balance", label: "New Balance" },
    { value: "converse", label: "Converse" },
    { value: "vans", label: "Vans" }
  ];

  const priceRanges = [
    { value: "", label: "Tous les prix" },
    { value: "0-50", label: "Moins de 50€" },
    { value: "50-100", label: "50€ - 100€" },
    { value: "100-200", label: "100€ - 200€" },
    { value: "200+", label: "Plus de 200€" }
  ];

  const sizes = [
    { value: "", label: "Toutes les tailles" },
    { value: "36", label: "36" },
    { value: "37", label: "37" },
    { value: "38", label: "38" },
    { value: "39", label: "39" },
    { value: "40", label: "40" },
    { value: "41", label: "41" },
    { value: "42", label: "42" },
    { value: "43", label: "43" },
    { value: "44", label: "44" },
    { value: "45", label: "45" }
  ];

  const colors = [
    { value: "", label: "Toutes les couleurs" },
    { value: "noir", label: "Noir" },
    { value: "blanc", label: "Blanc" },
    { value: "rouge", label: "Rouge" },
    { value: "bleu", label: "Bleu" },
    { value: "vert", label: "Vert" },
    { value: "jaune", label: "Jaune" },
    { value: "gris", label: "Gris" },
    { value: "marron", label: "Marron" }
  ];

  const ratings = [
    { value: "", label: "Toutes les notes" },
    { value: "4", label: "4 étoiles et plus" },
    { value: "3", label: "3 étoiles et plus" },
    { value: "2", label: "2 étoiles et plus" }
  ];

  const availability = [
    { value: "", label: "Tous les produits" },
    { value: "in-stock", label: "En stock" },
    { value: "fast-delivery", label: "Livraison rapide" },
    { value: "prime", label: "Prime" }
  ];

  const sortOptions = [
    { value: "relevance", label: "Pertinence" },
    { value: "price-low", label: "Prix croissant" },
    { value: "price-high", label: "Prix décroissant" },
    { value: "rating", label: "Meilleures notes" },
    { value: "newest", label: "Plus récents" },
    { value: "popular", label: "Plus populaires" }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation de recherche
    setTimeout(() => {
      setIsLoading(false);
      if (onSearch) {
        onSearch({ query: searchQuery, filters });
      }
    }, 1000);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: "",
      brand: "",
      priceRange: "",
      size: "",
      color: "",
      rating: "",
      availability: "",
      sortBy: "relevance"
    };
    setFilters(clearedFilters);
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "" && value !== "relevance");

  return (
    <div className="bg-white rounded-4 shadow-lg border p-4 mb-4">
      {/* Barre de recherche principale */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <span className="input-group-text bg-light border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Rechercher des produits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              fontSize: '16px',
              padding: '12px 16px',
              borderColor: '#dee2e6'
            }}
          />
          <button
            type="submit"
            className="btn btn-primary fw-semibold"
            disabled={isLoading}
            style={{ 
              borderRadius: '0 8px 8px 0',
              padding: '12px 24px'
            }}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status"></span>
            ) : (
              <>
                <i className="bi bi-search me-2"></i>
                Rechercher
              </>
            )}
          </button>
        </div>
      </form>

      {/* Bouton pour afficher/masquer les filtres */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary fw-semibold"
          onClick={() => setShowFilters(!showFilters)}
          style={{ borderRadius: '8px' }}
        >
          <i className={`bi ${showFilters ? 'bi-chevron-up' : 'bi-chevron-down'} me-2`}></i>
          {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        </button>
        
        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={clearFilters}
            style={{ borderRadius: '8px' }}
          >
            <i className="bi bi-x-circle me-1"></i>
            Effacer les filtres
          </button>
        )}
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="border-top pt-4">
          <div className="row">
            {/* Catégorie */}
            <div className="col-md-6 col-lg-3 mb-3">
              <label className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                <i className="bi bi-tags me-1"></i>
                Catégorie
              </label>
              <select
                className="form-select"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                style={{ fontSize: '14px' }}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Marque */}
            <div className="col-md-6 col-lg-3 mb-3">
              <label className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                <i className="bi bi-award me-1"></i>
                Marque
              </label>
              <select
                className="form-select"
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                style={{ fontSize: '14px' }}
              >
                {brands.map(brand => (
                  <option key={brand.value} value={brand.value}>
                    {brand.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Fourchette de prix */}
            <div className="col-md-6 col-lg-3 mb-3">
              <label className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                <i className="bi bi-currency-euro me-1"></i>
                Prix
              </label>
              <select
                className="form-select"
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                style={{ fontSize: '14px' }}
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Taille */}
            <div className="col-md-6 col-lg-3 mb-3">
              <label className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                <i className="bi bi-rulers me-1"></i>
                Taille
              </label>
              <select
                className="form-select"
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                style={{ fontSize: '14px' }}
              >
                {sizes.map(size => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Couleur */}
            <div className="col-md-6 col-lg-3 mb-3">
              <label className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                <i className="bi bi-palette me-1"></i>
                Couleur
              </label>
              <select
                className="form-select"
                value={filters.color}
                onChange={(e) => handleFilterChange('color', e.target.value)}
                style={{ fontSize: '14px' }}
              >
                {colors.map(color => (
                  <option key={color.value} value={color.value}>
                    {color.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div className="col-md-6 col-lg-3 mb-3">
              <label className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                <i className="bi bi-star me-1"></i>
                Note minimum
              </label>
              <select
                className="form-select"
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                style={{ fontSize: '14px' }}
              >
                {ratings.map(rating => (
                  <option key={rating.value} value={rating.value}>
                    {rating.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Disponibilité */}
            <div className="col-md-6 col-lg-3 mb-3">
              <label className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                <i className="bi bi-box-seam me-1"></i>
                Disponibilité
              </label>
              <select
                className="form-select"
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                style={{ fontSize: '14px' }}
              >
                {availability.map(avail => (
                  <option key={avail.value} value={avail.value}>
                    {avail.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tri */}
            <div className="col-md-6 col-lg-3 mb-3">
              <label className="form-label fw-semibold" style={{ color: '#232f3e' }}>
                <i className="bi bi-sort-down me-1"></i>
                Trier par
              </label>
              <select
                className="form-select"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                style={{ fontSize: '14px' }}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtres actifs */}
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-top">
              <h6 className="fw-semibold mb-2" style={{ color: '#232f3e' }}>
                Filtres actifs :
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (value && value !== "relevance") {
                    const label = getFilterLabel(key, value);
                    return (
                      <span
                        key={key}
                        className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2"
                        style={{ fontSize: '12px' }}
                      >
                        {label}
                        <button
                          type="button"
                          className="btn-close btn-close-sm ms-2"
                          onClick={() => handleFilterChange(key, "")}
                          style={{ fontSize: '8px' }}
                        ></button>
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  function getFilterLabel(key, value) {
    const allOptions = {
      category: categories,
      brand: brands,
      priceRange: priceRanges,
      size: sizes,
      color: colors,
      rating: ratings,
      availability: availability,
      sortBy: sortOptions
    };
    
    const option = allOptions[key]?.find(opt => opt.value === value);
    return option ? option.label : value;
  }
} 