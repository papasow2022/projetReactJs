import React, { useState } from 'react';
import { useLanguage } from "../contexts/LanguageContext";

const DailyDealsFilters = ({ filters, onFiltersChange, onSortChange, sortBy }) => {
  const { t } = useLanguage();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const categories = [
    t("all_categories"),
    t("watches"),
    t("jackets"),
    t("shoes"),
    t("pants"),
    t("accessories"),
    t("electronics")
  ];
  const sortOptions = [
    { value: 'pertinence', label: t("relevance") },
    { value: 'prix-asc', label: t("price_ascending") },
    { value: 'prix-desc', label: t("price_descending") },
    { value: 'reduction-desc', label: t("biggest_discounts") },
    { value: 'note-desc', label: t("best_rated") },
    { value: 'temps-restant', label: t("ending_soon") },
    { value: 'stock', label: t("limited_stock") }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handlePriceRangeChange = (min, max) => {
    onFiltersChange({
      ...filters,
      prixMin: min,
      prixMax: max
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: 'Toutes',
      categorie: 'Toutes',
      prixMin: 0,
      prixMax: 1000,
      reductionMin: 0,
      noteMin: 0,
      livraison: 'Toutes',
      stock: false
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status !== 'Toutes') count++;
    if (filters.categorie !== 'Toutes') count++;
    if (filters.prixMin > 0 || filters.prixMax < 1000) count++;
    if (filters.reductionMin > 0) count++;
    if (filters.noteMin > 0) count++;
    if (filters.livraison !== 'Toutes') count++;
    if (filters.stock) count++;
    return count;
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-light border-0">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="fw-bold mb-0">
            <i className="bi bi-funnel me-2"></i>
            Filtres et tri
          </h6>
          <div className="d-flex gap-2">
            {getActiveFiltersCount() > 0 && (
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={clearFilters}
              >
                <i className="bi bi-x-circle me-1"></i>
                Effacer ({getActiveFiltersCount()})
              </button>
            )}
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <i className={`bi bi-chevron-${showAdvancedFilters ? 'up' : 'down'} me-1`}></i>
              {showAdvancedFilters ? 'Moins' : 'Plus'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="card-body">
        {/* Tri principal */}
        <div className="mb-3">
          <label className="form-label fw-bold">Trier par</label>
          <select 
            className="form-select" 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtres de base */}
        <div className="mb-3">
          <label className="form-label fw-bold">Statut de l'offre</label>
          <select 
            className="form-select" 
            value={filters.status || 'Toutes'} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="Toutes">Toutes les offres</option>
            <option value="Actives">Offres actives</option>
            <option value="Expirées">Offres expirées</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Catégorie</label>
          <select 
            className="form-select" 
            value={filters.categorie} 
            onChange={(e) => handleFilterChange('categorie', e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Filtre de prix */}
        <div className="mb-3">
          <label className="form-label fw-bold">
            Prix (GNF)
            <span className="text-muted ms-2">
              {filters.prixMin.toLocaleString('fr-FR')} - {filters.prixMax.toLocaleString('fr-FR')}
            </span>
          </label>
          <div className="row g-2">
            <div className="col-6">
              <input 
                type="number" 
                className="form-control" 
                placeholder="Min"
                value={filters.prixMin}
                onChange={(e) => handlePriceRangeChange(Number(e.target.value), filters.prixMax)}
              />
            </div>
            <div className="col-6">
              <input 
                type="number" 
                className="form-control" 
                placeholder="Max"
                value={filters.prixMax}
                onChange={(e) => handlePriceRangeChange(filters.prixMin, Number(e.target.value))}
              />
            </div>
          </div>
          <input 
            type="range" 
            className="form-range mt-2" 
            min="0" 
            max="1000" 
            step="10"
            value={filters.prixMax}
            onChange={(e) => handlePriceRangeChange(filters.prixMin, Number(e.target.value))}
          />
        </div>

        {/* Filtres avancés */}
        {showAdvancedFilters && (
          <>
            {/* Réduction minimale */}
            <div className="mb-3">
              <label className="form-label fw-bold">Réduction minimale</label>
              <select 
                className="form-select" 
                value={filters.reductionMin} 
                onChange={(e) => handleFilterChange('reductionMin', Number(e.target.value))}
              >
                <option value={0}>Toutes les réductions</option>
                <option value={10}>10% et plus</option>
                <option value={20}>20% et plus</option>
                <option value={30}>30% et plus</option>
                <option value={50}>50% et plus</option>
              </select>
            </div>

            {/* Note minimale */}
            <div className="mb-3">
              <label className="form-label fw-bold">Note minimale</label>
              <select 
                className="form-select" 
                value={filters.noteMin} 
                onChange={(e) => handleFilterChange('noteMin', Number(e.target.value))}
              >
                <option value={0}>Toutes les notes</option>
                <option value={3}>3 étoiles et plus</option>
                <option value={4}>4 étoiles et plus</option>
                <option value={4.5}>4.5 étoiles et plus</option>
              </select>
            </div>

            {/* Type de livraison */}
            <div className="mb-3">
              <label className="form-label fw-bold">Livraison</label>
              <select 
                className="form-select" 
                value={filters.livraison} 
                onChange={(e) => handleFilterChange('livraison', e.target.value)}
              >
                <option value="Toutes">Tous les types</option>
                <option value="Prime">Prime uniquement</option>
                <option value="Standard">Standard uniquement</option>
              </select>
            </div>

            {/* Stock */}
            <div className="mb-3">
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="stockFilter"
                  checked={filters.stock}
                  onChange={(e) => handleFilterChange('stock', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="stockFilter">
                  En stock uniquement
                </label>
              </div>
            </div>

            {/* Filtres rapides */}
            <div className="mb-3">
              <label className="form-label fw-bold">Filtres rapides</label>
              <div className="d-flex flex-wrap gap-2">
                <button 
                  className={`btn btn-sm ${filters.prixMax <= 50 ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => handlePriceRangeChange(0, 50)}
                >
                  Moins de 50 GNF
                </button>
                <button 
                  className={`btn btn-sm ${filters.reductionMin >= 50 ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => handleFilterChange('reductionMin', 50)}
                >
                  -50% et plus
                </button>
                <button 
                  className={`btn btn-sm ${filters.noteMin >= 4.5 ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => handleFilterChange('noteMin', 4.5)}
                >
                  4.5★ et plus
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DailyDealsFilters; 