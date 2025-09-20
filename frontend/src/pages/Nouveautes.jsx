import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../amazon-like.css';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { useProducts } from '../contexts/ProductsContext';
import CategoryFilters from '../components/CategoryFilters';

const Nouveautes = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { allProducts, loading, error } = useProducts();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    categorie: 'Toutes',
    subcategorie: 'Toutes',
    prixMin: 0,
    prixMax: 1000,
    dateMin: 0, // Jours depuis l'ajout
    noteMin: 0,
    livraison: 'Toutes',
  });
  
  // Référence pour les nouveaux produits (moins de 30 jours)
  const [newProducts, setNewProducts] = useState([]);
  // Référence pour les produits en vedette
  const [featuredProducts, setFeaturedProducts] = useState([]);
  // Référence pour les collections
  const [collections, setCollections] = useState([]);
  // États pour les sous-catégories sélectionnées pour chaque collection
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  // États pour les types spécifiques sélectionnés pour chaque collection
  const [selectedSpecificTypes, setSelectedSpecificTypes] = useState({});

  useEffect(() => {
    if (!loading && allProducts && allProducts.length > 0) {
      // Filtrer les nouveaux produits (isNew ou ajoutés récemment)
      const newProds = allProducts.filter(product => product.isNew);
      setNewProducts(newProds);

      // Sélectionner quelques produits en vedette parmi les nouveautés
      const featured = newProds
        .filter(product => product.rating >= 4.0)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setFeaturedProducts(featured);

      // Créer des collections par catégorie
      const cats = {};
      newProds.forEach(product => {
        const category = product.category || 'Autres';
        if (!cats[category]) {
          cats[category] = [];
          // Initialiser l'état de sous-catégorie pour cette catégorie
          setSelectedSubcategories(prev => ({
            ...prev,
            [category]: 'all'
          }));
          // Initialiser l'état de type spécifique pour cette catégorie
          setSelectedSpecificTypes(prev => ({
            ...prev,
            [category]: 'all'
          }));
        }
        cats[category].push(product);
      });
      
      // Convertir en tableau pour l'affichage
      const collectionsArray = Object.entries(cats)
        .map(([name, products]) => {
          // Créer des sous-catégories pour chaque collection
          const subcategories = {
            homme: products.filter(p => p.subcategory === 'homme'),
            femme: products.filter(p => p.subcategory === 'femme'),
            enfant: products.filter(p => p.subcategory === 'enfant'),
            bebe: products.filter(p => p.subcategory === 'bebe')
          };
          
          // Créer des types spécifiques pour chaque collection
          const specificTypes = {};
          products.forEach(product => {
            if (product.specificType) {
              if (!specificTypes[product.specificType]) {
                specificTypes[product.specificType] = [];
              }
              specificTypes[product.specificType].push(product);
            }
          });
          
          return {
            name,
            products: products.slice(0, 8), // Limiter à 8 produits par collection
            subcategories,
            specificTypes,
            hasSubcategories: Object.values(subcategories).some(arr => arr.length > 0),
            hasSpecificTypes: Object.keys(specificTypes).length > 0
          };
        })
        .filter(collection => collection.products.length > 0);
      
      setCollections(collectionsArray);
    }
  }, [loading, allProducts]);

  // Fonction pour trier les produits
  const sortProducts = (products) => {
    if (!products) return [];
    
    switch(sortBy) {
      case 'newest':
        return [...products].sort((a, b) => (b.id || 0) - (a.id || 0));
      case 'price_asc':
        return [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price_desc':
        return [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'rating':
        return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return products;
    }
  };

  // Filtrer les produits selon les critères
  const filteredProducts = allProducts.filter(product => {
    // Filtre par catégorie
    if (filters.categorie !== 'Toutes' && product.category !== filters.categorie) {
      return false;
    }
    
    // Filtre par sous-catégorie
    if (filters.subcategorie !== 'Toutes' && product.subcategory !== filters.subcategorie) {
      return false;
    }
    
    // Filtre par prix
    if (product.price < filters.prixMin || product.price > filters.prixMax) {
      return false;
    }
    
    // Filtre par note minimale
    if (product.rating < filters.noteMin) {
      return false;
    }
    
    // Filtre par type de livraison
    if (filters.livraison === 'Prime' && !product.isPrime) {
      return false;
    }
    
    return true;
  });

  // Appliquer le tri aux produits filtrés
  const sortedProducts = sortProducts(filteredProducts);

  // Fonction pour naviguer vers la page détail du produit
  const handleProductClick = (productId) => {
    console.log('🚀 Clic sur produit Nouveautés:', productId);
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <>
        <div className="container-fluid py-4">
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-3">Chargement des nouveautés...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="container-fluid py-4">
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="container-fluid py-4">
        {/* En-tête principal */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="mb-3 text-primary fw-bold" style={{fontSize: '2.2rem'}}>
              <i className="bi bi-stars me-3"></i>
              {t('new_arrivals')}
            </h1>
            <p className="text-muted mb-0">
              {t('discover_new_products')}
            </p>
          </div>
        </div>

        {/* Bannière des nouveautés */}
        <div className="card mb-4 border-primary border-3 shadow-lg">
          <div className="card-header bg-primary text-white border-0">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h4 className="fw-bold mb-0">
                  <i className="bi bi-star-fill me-2"></i>
                  {t('featured_new_arrivals')}
                </h4>
                <p className="mb-0 mt-1">{t('most_popular_new_products')}</p>
              </div>
              <div className="col-md-4 text-end">
                <div className="bg-white text-primary p-3 rounded">
                  <div className="text-center">
                    <div className="fw-bold mb-1">{t('new_collection')}</div>
                    <div style={{fontSize: '1.5rem', fontWeight: 700}}>
                      {t('spring_summer_2023')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              {featuredProducts.length > 0 ? (
                featuredProducts.map(product => (
                  <div key={product.id} className="col-md-4 mb-3">
                    <div className="card h-100 border-0 shadow-sm product-card" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🖱️ Clic détecté sur produit featured:', product.name, product.id);
                        handleProductClick(product.id);
                      }}>
                      <div className="position-relative">
                        <img 
                          src={product.image || product.images?.[0] || '/assets/placeholder.png'} 
                          className="card-img-top p-3" 
                          alt={product.name}
                          style={{ height: 200, objectFit: 'contain' }}
                        />
                        <div className="position-absolute top-0 start-0 m-2">
                          <span className="badge bg-primary">{t('new')}</span>
                          {product.isPrime && <span className="badge bg-info ms-1">Prime</span>}
                        </div>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title fw-bold">{product.name}</h5>
                        <div className="d-flex align-items-center mb-2">
                          <div className="me-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <i 
                                key={i} 
                                className={`bi ${i < Math.floor(product.rating) ? 'bi-star-fill' : i < product.rating ? 'bi-star-half' : 'bi-star'}`}
                                style={{ color: '#ffc107' }}
                              ></i>
                            ))}
                          </div>
                          <small className="text-muted">{product.rating} ({product.reviewCount || 0})</small>
                        </div>
                        <div className="mb-2">
                          <span className="fw-bold text-danger">{(product.price * 9000).toLocaleString('fr-FR')} GNF</span>
                          {product.originalPrice && (
                            <span className="text-muted text-decoration-line-through ms-2">
                              {(product.originalPrice * 9000).toLocaleString('fr-FR')} GNF
                            </span>
                          )}
                        </div>
                        <p className="card-text small text-muted">
                          {product.description?.substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-4">
                  <i className="bi bi-exclamation-circle display-4 text-muted"></i>
                  <p className="mt-3">Aucun produit en vedette disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collections par catégorie */}
        {collections.map(collection => {
          const selectedSubcategory = selectedSubcategories[collection.name] || 'all';
          const selectedSpecificType = selectedSpecificTypes[collection.name] || 'all';
          
          // Filtrer les produits selon la sous-catégorie et le type spécifique sélectionnés
          let displayProducts;
          
          // D'abord filtrer par sous-catégorie
          if (selectedSubcategory === 'all') {
            displayProducts = collection.products;
          } else {
            displayProducts = collection.subcategories[selectedSubcategory] || [];
          }
          
          // Ensuite filtrer par type spécifique si nécessaire
          if (selectedSpecificType !== 'all') {
            displayProducts = displayProducts.filter(product => product.specificType === selectedSpecificType);
          }
          
          // Limiter à 8 produits pour l'affichage
          if (displayProducts.length > 8) {
            displayProducts = displayProducts.slice(0, 8);
          }
          
          return (
            <div key={collection.name} className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">{collection.name}</h3>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setFilters({...filters, categorie: collection.name});
                  }}
                >
                  {t('see_all')}
                </button>
              </div>
              
              {/* Onglets de sous-catégories si la collection en a */}
              {collection.hasSubcategories && (
                <div className="mb-3">
                  {/* Filtres de sous-catégories */}
                  <div className="d-flex mb-2 border-bottom">
                    <button 
                      className={`btn btn-sm ${selectedSubcategory === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setSelectedSubcategories({...selectedSubcategories, [collection.name]: 'all'})}
                      style={{ marginRight: '5px', borderRadius: '4px 4px 0 0' }}
                    >
                      {t('all')}
                    </button>
                    {collection.subcategories.homme.length > 0 && (
                      <button 
                        className={`btn btn-sm ${selectedSubcategory === 'homme' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedSubcategories({...selectedSubcategories, [collection.name]: 'homme'})}
                        style={{ marginRight: '5px', borderRadius: '4px 4px 0 0' }}
                      >
                        {t('men')}
                      </button>
                    )}
                    {collection.subcategories.femme.length > 0 && (
                      <button 
                        className={`btn btn-sm ${selectedSubcategory === 'femme' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedSubcategories({...selectedSubcategories, [collection.name]: 'femme'})}
                        style={{ marginRight: '5px', borderRadius: '4px 4px 0 0' }}
                      >
                        {t('women')}
                      </button>
                    )}
                    {collection.subcategories.enfant.length > 0 && (
                      <button 
                        className={`btn btn-sm ${selectedSubcategory === 'enfant' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedSubcategories({...selectedSubcategories, [collection.name]: 'enfant'})}
                        style={{ marginRight: '5px', borderRadius: '4px 4px 0 0' }}
                      >
                        {t('children')}
                      </button>
                    )}
                    {collection.subcategories.bebe.length > 0 && (
                      <button 
                        className={`btn btn-sm ${selectedSubcategory === 'bebe' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedSubcategories({...selectedSubcategories, [collection.name]: 'bebe'})}
                        style={{ borderRadius: '4px 4px 0 0' }}
                      >
                        {t('baby')}
                      </button>
                    )}
                  </div>
                  
                  {/* Filtres de types spécifiques */}
                  {collection.hasSpecificTypes && (
                    <div className="d-flex flex-wrap mb-2">
                      <small className="text-muted me-2 d-flex align-items-center">
                        <i className="bi bi-funnel me-1"></i> Type:
                      </small>
                      <button 
                        className={`btn btn-sm ${selectedSpecificTypes[collection.name] === 'all' ? 'btn-info' : 'btn-outline-info'}`}
                        onClick={() => setSelectedSpecificTypes({...selectedSpecificTypes, [collection.name]: 'all'})}
                        style={{ marginRight: '5px', fontSize: '0.7rem' }}
                      >
                        {t('all_types')}
                      </button>
                      {Object.keys(collection.specificTypes).map(type => (
                        <button 
                          key={type}
                          className={`btn btn-sm ${selectedSpecificTypes[collection.name] === type ? 'btn-info' : 'btn-outline-info'}`}
                          onClick={() => setSelectedSpecificTypes({...selectedSpecificTypes, [collection.name]: type})}
                          style={{ marginRight: '5px', fontSize: '0.7rem' }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="row g-3">
                {displayProducts.length > 0 ? (
                  displayProducts.map(product => (
                    <div key={product.id} className="col-6 col-md-3 col-lg-2">
                      <div 
                        className="card h-100 border-0 shadow-sm product-card" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('🖱️ Clic détecté sur produit grid:', product.name, product.id);
                          handleProductClick(product.id);
                        }}
                      >
                        <div className="position-relative">
                          <img 
                            src={product.image || product.images?.[0] || '/assets/placeholder.png'} 
                            className="card-img-top p-2" 
                            alt={product.name}
                            style={{ height: 150, objectFit: 'contain' }}
                          />
                          <div className="position-absolute top-0 start-0 m-1">
                            <span className="badge bg-primary" style={{fontSize: '0.7rem'}}>{t('new')}</span>
                            {product.subcategory && (
                              <span className="badge bg-secondary ms-1" style={{fontSize: '0.7rem'}}>
                                {t(product.subcategory)}
                              </span>
                            )}
                            {product.specificType && (
                              <span className="badge bg-info ms-1" style={{fontSize: '0.7rem'}}>
                                {product.specificType}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="card-body p-2">
                          <h6 className="card-title fw-bold" style={{fontSize: '0.9rem'}}>{product.name}</h6>
                          <div className="d-flex align-items-center mb-1" style={{fontSize: '0.7rem'}}>
                            <div className="me-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <i 
                                  key={i} 
                                  className={`bi ${i < Math.floor(product.rating) ? 'bi-star-fill' : i < product.rating ? 'bi-star-half' : 'bi-star'}`}
                                  style={{ color: '#ffc107', fontSize: '0.7rem' }}
                                ></i>
                              ))}
                            </div>
                            <small className="text-muted">{product.rating}</small>
                          </div>
                          <div style={{fontSize: '0.9rem'}}>
                            <span className="fw-bold text-danger">{(product.price * 9000).toLocaleString('fr-FR')} GNF</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-3">
                    <p className="text-muted">{t('no_products_found')}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Tous les nouveaux produits avec filtres */}
        <div className="row mt-5">
          <div className="col-12">
            <h2 className="fw-bold mb-4">{t('all_new_products')}</h2>
          </div>
        </div>

        <div className="row g-4">
          {/* Filtres */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0 fw-bold">{t('filters')}</h5>
              </div>
              <div className="card-body">
                {/* Catégories */}
                <div className="mb-4">
                  <CategoryFilters
                    selectedCategory={filters.categorie}
                    collections={collections}
                    onCategoryChange={(category) => {
                      setFilters({...filters, categorie: category, subcategorie: 'Toutes'});
                    }}
                  />
                </div>
                
                {/* Sous-catégories */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">{t('subcategories')}</h6>
                  <select 
                    className="form-select" 
                    value={filters.subcategorie}
                    onChange={(e) => setFilters({...filters, subcategorie: e.target.value})}
                  >
                    <option value="Toutes">{t('all')}</option>
                    <option value="homme">{t('men')}</option>
                    <option value="femme">{t('women')}</option>
                    <option value="enfant">{t('children')}</option>
                    <option value="bebe">{t('baby')}</option>
                  </select>
                </div>

                {/* Prix */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">{t('price')}</h6>
                  <div className="row g-2">
                    <div className="col-6">
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Min" 
                        value={filters.prixMin}
                        onChange={(e) => setFilters({...filters, prixMin: Number(e.target.value)})}
                      />
                    </div>
                    <div className="col-6">
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Max" 
                        value={filters.prixMax}
                        onChange={(e) => setFilters({...filters, prixMax: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>

                {/* Note minimale */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">{t('minimum_rating')}</h6>
                  <div className="d-flex align-items-center">
                    <input 
                      type="range" 
                      className="form-range me-2" 
                      min="0" 
                      max="5" 
                      step="0.5" 
                      value={filters.noteMin}
                      onChange={(e) => setFilters({...filters, noteMin: Number(e.target.value)})}
                    />
                    <span>{filters.noteMin} ★</span>
                  </div>
                </div>

                {/* Livraison */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">{t('shipping')}</h6>
                  <select 
                    className="form-select" 
                    value={filters.livraison}
                    onChange={(e) => setFilters({...filters, livraison: e.target.value})}
                  >
                    <option value="Toutes">{t('all_shipping_options')}</option>
                    <option value="Prime">Prime</option>
                  </select>
                </div>

                {/* Bouton réinitialiser */}
                <button 
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setFilters({
                    categorie: 'Toutes',
                    prixMin: 0,
                    prixMax: 1000,
                    dateMin: 0,
                    noteMin: 0,
                    livraison: 'Toutes',
                  })}
                >
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  {t('reset_filters')}
                </button>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="col-lg-9">
            {/* Barre d'outils */}
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h6 className="mb-0">
                      {t('products_found', { count: sortedProducts.length })}
                    </h6>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-md-end align-items-center">
                      <div className="me-3">
                        <select 
                          className="form-select form-select-sm" 
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          <option value="newest">{t('newest_first')}</option>
                          <option value="price_asc">{t('price_ascending')}</option>
                          <option value="price_desc">{t('price_descending')}</option>
                          <option value="rating">{t('best_rated')}</option>
                        </select>
                      </div>
                      <div className="btn-group" role="group">
                        <button 
                          type="button" 
                          className={`btn btn-outline-secondary ${viewMode === 'grid' ? 'active' : ''}`}
                          onClick={() => setViewMode('grid')}
                        >
                          <i className="bi bi-grid"></i>
                        </button>
                        <button 
                          type="button" 
                          className={`btn btn-outline-secondary ${viewMode === 'list' ? 'active' : ''}`}
                          onClick={() => setViewMode('list')}
                        >
                          <i className="bi bi-list"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grille des produits */}
            {sortedProducts.length > 0 ? (
              <div className={`row g-3 ${viewMode === 'list' ? 'flex-column' : ''}`}>
                {sortedProducts.map(product => (
                  <div key={product.id} className={viewMode === 'list' ? 'col-12' : 'col-md-6 col-lg-4'}>
                    <div 
                      className={`card h-100 border-0 shadow-sm product-card ${viewMode === 'list' ? 'flex-row' : ''}`} 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🖱️ Clic détecté sur produit Nouveautés:', product.name, product.id);
                        handleProductClick(product.id);
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        e.target.style.borderColor = '#007bff';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                        e.target.style.borderColor = 'transparent';
                      }}
                    >
                      <div className={viewMode === 'list' ? 'col-4' : ''}>
                        <img 
                          src={product.image || product.images?.[0] || '/assets/placeholder.png'} 
                          className="card-img-top p-3" 
                          alt={product.name}
                          style={{ height: viewMode === 'list' ? '100%' : 200, objectFit: 'contain' }}
                        />
                      </div>
                      <div className={`card-body ${viewMode === 'list' ? 'col-8' : ''}`}>
                        <h5 className="card-title fw-bold">{product.name}</h5>
                        <div className="d-flex align-items-center mb-2">
                          <div className="me-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <i 
                                key={i} 
                                className={`bi ${i < Math.floor(product.rating) ? 'bi-star-fill' : i < product.rating ? 'bi-star-half' : 'bi-star'}`}
                                style={{ color: '#ffc107' }}
                              ></i>
                            ))}
                          </div>
                          <small className="text-muted">{product.rating} ({product.reviewCount || 0})</small>
                        </div>
                        <div className="mb-2">
                          <span className="fw-bold text-danger">{product.price.toLocaleString('fr-FR')} €</span>
                          {product.originalPrice && (
                            <span className="text-muted text-decoration-line-through ms-2">
                              {product.originalPrice.toLocaleString('fr-FR')} €
                            </span>
                          )}
                        </div>
                        {viewMode === 'list' && (
                          <p className="card-text small text-muted">
                            {product.description?.substring(0, 150)}...
                          </p>
                        )}
                        <div className="mt-auto">
                          <div className="d-flex align-items-center">
                            {product.isPrime && (
                              <span className="badge bg-info me-2">Prime</span>
                            )}
                            <small className="text-success">
                              <i className="bi bi-check-circle-fill me-1"></i>
                              {t('in_stock')}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-search display-1 text-muted mb-3"></i>
                <h4 className="text-muted">{t('no_products_found')}</h4>
                <p className="text-muted mb-4">
                  {t('no_products_criteria')}
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setFilters({
                    categorie: 'Toutes',
                    prixMin: 0,
                    prixMax: 1000,
                    dateMin: 0,
                    noteMin: 0,
                    livraison: 'Toutes',
                  })}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  {t('reset_filters')}
                </button>
              </div>
            )}

            {/* Pagination (optionnel) */}
            {sortedProducts.length > 12 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className="page-item disabled">
                    <span className="page-link">{t('previous')}</span>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">1</span>
                  </li>
                  <li className="page-item">
                    <span className="page-link">2</span>
                  </li>
                  <li className="page-item">
                    <span className="page-link">3</span>
                  </li>
                  <li className="page-item">
                    <span className="page-link">{t('next')}</span>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>

        {/* Section d'informations supplémentaires */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-info-circle text-primary me-2"></i>
                  {t('about_new_arrivals')}
                </h5>
                <div className="row">
                  <div className="col-md-4">
                    <h6 className="fw-bold">🆕 {t('latest_products')}</h6>
                    <p className="text-muted small">
                      {t('latest_products_desc')}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <h6 className="fw-bold">🔍 {t('exclusive_items')}</h6>
                    <p className="text-muted small">
                      {t('exclusive_items_desc')}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <h6 className="fw-bold">🚚 {t('fast_shipping')}</h6>
                    <p className="text-muted small">
                      {t('fast_shipping_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Nouveautes;