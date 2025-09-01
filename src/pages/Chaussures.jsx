import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductsContext, useProducts } from '../contexts/ProductsContext';
import { testFemmeProductsCorrespondence } from '../utils/testFemmeProducts';
import { debugFemmeBehavior } from '../utils/debugFemmeBehavior';
import { testChristianLouboutinMapping } from '../utils/testChristianLouboutinMapping';
import '../amazon-like.css';

const Chaussures = () => {
  const navigate = useNavigate();
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [activeFilters, setActiveFilters] = useState(() => {
    try {
      const saved = localStorage.getItem('chaussuresActiveFilters');
      if (saved) {
        const parsed = JSON.parse(saved);
        const safeGenre = Array.isArray(parsed.genre) && parsed.genre.length > 0 ? parsed.genre : ['homme'];
        return {
          genre: safeGenre,
          marques: Array.isArray(parsed.marques) ? parsed.marques : [],
          prixMax: typeof parsed.prixMax === 'number' ? parsed.prixMax : 1000000
        };
      }
    } catch (e) {}
    return {
      genre: ['homme'],
      marques: [],
      prixMax: 1000000
    };
  });

  const { products: contextProducts, loading } = useProducts();
  
  const allProducts = contextProducts.filter(p => p.category === 'Chaussures');

  useEffect(() => {
    try {
      localStorage.setItem('chaussuresActiveFilters', JSON.stringify(activeFilters));
    } catch (e) {}
  }, [activeFilters]);

  // Test de correspondance des produits femme au chargement
  useEffect(() => {
    if (allProducts.length > 0) {
      testFemmeProductsCorrespondence(allProducts);
      debugFemmeBehavior(allProducts);
      testChristianLouboutinMapping(); // Test du mapping Christian Louboutin
    }
  }, [allProducts]);

  const subcategories = [
    {
      id: 'homme',
      label: 'Homme',
      icon: 'bi-person',
      description: 'Chaussures pour hommes',
      image: '/chaussures/homme/category-homme.jpg',
      count: '2,847 produits'
    },
    {
      id: 'femme',
      label: 'Femme',
      icon: 'bi-person',
      description: 'Chaussures pour femmes',
      image: '/chaussures/femme/category-femme.jpg',
      count: '3,124 produits'
    },
    {
      id: 'enfant',
      label: 'Enfant',
      icon: 'bi-person',
      description: 'Chaussures pour enfants',
      image: '/chaussures/enfant/category-enfant.jpg',
      count: '1,956 produits'
    },
    {
      id: 'bebe',
      label: 'Bébé',
      icon: 'bi-heart',
      description: 'Chaussures pour bébés',
      image: '/chaussures/bebe/category-bebe.jpg',
      count: '892 produits'
    }
  ];

  // Marques populaires par genre
  const popularBrandsByGenre = {
    homme: ['Nike', 'Puma', 'Balenciaga', 'Gucci'],
    femme: ['Zara', 'Minelli', 'Mango', 'Jonak', 'Prada', 'Christian Louboutin', 'Gucci'],
    enfant: ['Nike', 'Puma', 'Adidas', 'Converse'],
    bebe: ['Nike', 'Puma', 'Adidas', 'Converse']
  };

  // Marques populaires actuelles selon le genre sélectionné
  const currentPopularBrands = activeFilters.genre.length > 0 
    ? popularBrandsByGenre[activeFilters.genre[0]] || popularBrandsByGenre.homme
    : popularBrandsByGenre.homme;

  // Liste exhaustive des images disponibles pour FEMME sous public/chaussures/femme
  const femmeImagePaths = [
    // CritianlouboutinNoire
    `/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins - Noir.jpeg`,
    `/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg`,
    `/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg`,
    `/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg`,
    `/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg`,
    `/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg`,
    // Gucci
    `/chaussures/femme/Gucci/Designer High Heel Sandals _ Block Heel Sandals   _ GUCCI® International.jpeg`,
    `/chaussures/femme/Gucci/Designer High Heel Sandals _ Block Heel Sandals   _ GUCCI® US.jpeg`,
    `/chaussures/femme/Gucci/Gucci Leather Sandals - Noir.jpeg`,
    `/chaussures/femme/Gucci/Gucci Sandals - Noir 3.jpeg`,
    `/chaussures/femme/Gucci/Women's Designer Luxury High Heels Pumps _ GUCCI® US.jpeg`,
    // Jonak
    `/chaussures/femme/Jonak/Chaussures Femme tendance _ Jonak (1).jpeg`,
    `/chaussures/femme/Jonak/Chaussures Femme tendance _ Jonak.jpeg`,
    `/chaussures/femme/Jonak/Jonak Bottines Santiags Basama - Marron.jpeg`,
    `/chaussures/femme/Jonak/Jonak Bottines Western Cuir Basama - Marron.jpeg`,
    // Mango
    `/chaussures/femme/Mango/MANGO Ankle Strap Sandal in Nude at Nordstrom, Size 6_5Us.jpeg`,
    `/chaussures/femme/Mango/Mango Strappy Sandals - Nude 2.jpeg`,
    `/chaussures/femme/Mango/Mango Strappy Sandals - Nude 3.jpeg`,
    `/chaussures/femme/Mango/Mango Strappy Sandals - Nude.jpeg`,
    // Minelli
    `/chaussures/femme/Minelli/Minelli Escarpins - Noir 2.jpeg`,
    `/chaussures/femme/Minelli/Minelli Escarpins - Noir 3.jpeg`,
    `/chaussures/femme/Minelli/Minelli Escarpins - Noir.jpeg`,
    `/chaussures/femme/Minelli/Minelli Tulin Bottines Talon - Noir.jpeg`,
    // Prada Beige
    `/chaussures/femme/PradaBeige/Prada Ankle Strap Platform Sandals - Beige.jpeg`,
    `/chaussures/femme/PradaBeige/Prada Gold Platform Sandals - Beige.jpeg`,
    `/chaussures/femme/PradaBeige/Prada Leather Platform Sandals - Beige.jpeg`,
    `/chaussures/femme/PradaBeige/Prada Metallic Platform Sandals - Beige.jpeg`,
    `/chaussures/femme/PradaBeige/Prada Paige Platform Sandals - Beige.jpeg`,
    `/chaussures/femme/PradaBeige/Prada Sandales - Beige.jpeg`,
    `/chaussures/femme/PradaBeige/Prada Suede Sandals - Beige.jpeg`,
    // Zara noire
    `/chaussures/femme/Zaranoire/Zara Ankle Strap Heels - Noir.jpeg`,
    `/chaussures/femme/Zaranoire/Zara Classic Heels - Noir.jpeg`,
    `/chaussures/femme/Zaranoire/Zara High Heel Platform Slingback Shoes - Noir.jpeg`,
    `/chaussures/femme/Zaranoire/Zara Pointed Toe Heels - Noir.jpeg`,
    `/chaussures/femme/Zaranoire/Zara Rhinestone Suede Heels - Noir.jpeg`,
    `/chaussures/femme/Zaranoire/Zara Strappy Heels - Noir.jpeg`,
  ];

  // Helpers pour extraire marque/dossier et nom de fichier depuis le chemin
  const normalizeBrandFromFolder = (folderName) => {
    const map = {
      'Zaranoire': 'Zara',
      'CritianlouboutinNoire': 'Christian Louboutin',
      'PradaBeige': 'Prada',
      'Minelli': 'Minelli',
      'Mango': 'Mango',
      'Jonak': 'Jonak',
      'Gucci': 'Gucci'
    };
    return map[folderName] || folderName;
  };

  // Fonction inverse pour mapper la marque vers le dossier
  const getFolderFromBrand = (brandName) => {
    const reverseMap = {
      'Zara': 'Zaranoire',
      'Christian Louboutin': 'CritianlouboutinNoire',
      'Prada': 'PradaBeige',
      'Minelli': 'Minelli',
      'Mango': 'Mango',
      'Jonak': 'Jonak',
      'Gucci': 'Gucci'
    };
    return reverseMap[brandName] || brandName;
  };

  const buildFemmeImagesMeta = (paths) => {
    return paths.map((p) => {
      // p = /chaussures/femme/<folder>/<file>
      const parts = p.split('/');
      const folder = parts[3] || '';
      const fileWithExt = parts[4] || '';
      const fileName = fileWithExt.replace(/\.[^/.]+$/, '');
      const brand = normalizeBrandFromFolder(folder);
      return { src: p, folder, brand, fileName };
    });
  };

  const femmeImages = buildFemmeImagesMeta(femmeImagePaths);

  // Mapping des images Christian Louboutin vers leurs produits spécifiques
  const christianLouboutinImageMapping = {
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins - Noir.jpeg': 'cl-escarpins-noir-001',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg': 'cl-heels-collection-speciale-003',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg': 'cl-heels-edition-limitee-004',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg': 'cl-heels-design-exclusif-005',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg': 'cl-heels-collection-premium-006',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg': 'cl-heels-classic-002'
  };

  // Fonction pour trouver le produit exact correspondant à une image
  const findProductByImage = (imagePath) => {
    const productId = christianLouboutinImageMapping[imagePath];
    if (productId) {
      return contextProducts.find(p => p.id === productId);
    }
    return null;
  };

  // Fonction pour gérer le clic sur une image Christian Louboutin
  const handleChristianLouboutinClick = (imagePath) => {
    const product = findProductByImage(imagePath);
    if (product) {
      console.log('🎯 Produit trouvé pour image:', imagePath);
      console.log('📦 Produit:', product.name);
      console.log('🆔 ID du produit:', product.id);
      navigate(`/product/${product.id}?image=${encodeURIComponent(imagePath)}`);
    } else {
      console.error('❌ Aucun produit trouvé pour l\'image:', imagePath);
    }
  };

  // Chemins des images pour chaque section


  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    // Ici vous pourriez naviguer vers une page de sous-catégorie
    console.log(`Sous-catégorie sélectionnée: ${subcategoryId}`);
  };

  const handleProductClick = (product) => {
    // Naviguer vers la page de détail du produit
    navigate(`/product/${product.id}`);
  };

  const handleGenreFilter = (genre) => {
    setActiveFilters(prev => ({
      ...prev,
      // Sélection unique: toujours remplacer par l'option choisie
      genre: [genre]
    }));
  };

  const handleBrandFilter = (brand) => {
    setActiveFilters(prev => ({
      ...prev,
      // Sélection unique: toujours remplacer par l'option choisie
      marques: prev.marques.includes(brand) ? [] : [brand]
    }));
  };

  const handlePriceFilter = (price) => {
    setActiveFilters(prev => ({
      ...prev,
      prixMax: price
    }));
  };

  // Filtrer les produits selon les critères sélectionnés
  const filteredProducts = allProducts.filter(product => {
    // Filtre par genre
    if (activeFilters.genre.length > 0 && !activeFilters.genre.includes(product.subcategory)) {
      return false;
    }
    
    // Filtre par marque
    if (activeFilters.marques.length > 0 && !activeFilters.marques.includes(product.brand)) {
      return false;
    }
    
    // Filtre par prix
    if (product.price > activeFilters.prixMax) {
      return false;
    }
    
    return true;
  });

  // Debug: Afficher les produits filtrés
  console.log('Produits filtrés:', filteredProducts.length);
  console.log('Filtres actifs:', activeFilters);
  console.log('Tous les produits:', allProducts.length);

  // Obtenir les images de la sous-catégorie sélectionnée
  const getSubcategoryImages = (subcategoryId) => {
    return allProducts
      .filter(product => product.subcategory === subcategoryId)
      .slice(0, 4) // Limiter à 4 images
      .map(product => product.image);
  };

  // Obtenir les images générales (toutes les sous-catégories)
  const getGeneralImages = () => {
    return [
      '/chaussures/homme/category-homme.jpg',
      '/chaussures/femme/category-femme.jpg',
      '/chaussures/enfant/category-enfant.jpg',
      '/chaussures/bebe/category-bebe.jpg'
    ];
  };

  // Afficher un indicateur de chargement si les produits ne sont pas encore chargés
  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chaussures-page">
      
      {/* Breadcrumb */}
      <div className="breadcrumb-container" style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '12px 0',
        borderBottom: '1px solid #e9ecef'
      }}>
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0" style={{ fontSize: '0.9rem' }}>
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-muted">Accueil</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Chaussures
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-fluid" style={{ padding: '0' }}>
        <div className="row">
          {/* Sidebar gauche - Filtres */}
          <div className="col-md-3" style={{ 
            backgroundColor: '#f8f9fa', 
            minHeight: 'calc(100vh - 200px)',
            padding: '20px',
            borderRight: '1px solid #e9ecef'
          }}>
            <h5 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#232f3e' }}>
              Filtres
            </h5>
            
            {/* Filtre par genre */}
            <div className="filter-section mb-4">
              <h6 style={{ fontSize: '1rem', marginBottom: '15px', color: '#232f3e' }}>
                Genre
              </h6>
                             {subcategories.map(subcat => (
                 <div key={subcat.id} className="form-check mb-2">
                   <input
                     className="form-check-input"
                     type="checkbox"
                     id={`filter-${subcat.id}`}
                     checked={activeFilters.genre.includes(subcat.id)}
                     onChange={() => handleGenreFilter(subcat.id)}
                     style={{ accentColor: '#febd69' }}
                   />
                   <label className="form-check-label" htmlFor={`filter-${subcat.id}`} style={{ fontSize: '0.9rem' }}>
                     {subcat.label}
                   </label>
                 </div>
               ))}
            </div>

            {/* Filtre par marque */}
            <div className="filter-section mb-4">
              <h6 style={{ fontSize: '1rem', marginBottom: '15px', color: '#232f3e' }}>
                Marques populaires
              </h6>
                             {currentPopularBrands.slice(0, 6).map(brand => (
                 <div key={brand} className="form-check mb-2">
                   <input
                     className="form-check-input"
                     type="checkbox"
                     id={`brand-${brand}`}
                     checked={activeFilters.marques.includes(brand)}
                     onChange={() => handleBrandFilter(brand)}
                     style={{ accentColor: '#febd69' }}
                   />
                   <label className="form-check-label" htmlFor={`brand-${brand}`} style={{ fontSize: '0.9rem' }}>
                     {brand}
                   </label>
                 </div>
               ))}
            </div>

            {/* Filtre par prix */}
            <div className="filter-section mb-4">
              <h6 style={{ fontSize: '1rem', marginBottom: '15px', color: '#232f3e' }}>
                Fourchette de prix
              </h6>
              <div className="mb-2">
                                   <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="1000000"
                    value={activeFilters.prixMax}
                    onChange={(e) => handlePriceFilter(parseInt(e.target.value))}
                    style={{ accentColor: '#febd69' }}
                  />
                                  <div className="d-flex justify-content-between" style={{ fontSize: '0.8rem', color: '#666' }}>
                   <span>0 GNF</span>
                   <span>{activeFilters.prixMax.toLocaleString()} GNF</span>
                   <span>1,000,000 GNF+</span>
                  </div>
               </div>
             </div>
           </div>

           {/* Contenu principal */}
           <div className="col-md-9" style={{ padding: '20px' }}>
                          {/* Filtres actifs */}
             {(activeFilters.genre.length > 0 || activeFilters.marques.length > 0 || activeFilters.prixMax < 1000000) && (
                <div className="active-filters mb-3" style={{
                  backgroundColor: '#f0f8ff',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #b3d9ff'
                }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0066cc' }}>🔍 Filtres actifs :</span>
                    <button 
                      onClick={() => setActiveFilters({ genre: ['homme'], marques: [], prixMax: 1000000 })}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #0066cc',
                        color: '#0066cc',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#0066cc';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#0066cc';
                      }}
                      title="Effacer tous les filtres">
                      Effacer tout
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {activeFilters.genre.map(genre => (
                      <span key={genre} style={{
                        backgroundColor: '#e6f3ff',
                        color: '#0066cc',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleGenreFilter(genre)}
                      title="Cliquer pour retirer ce filtre">
                        {subcategories.find(s => s.id === genre)?.label}
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>×</span>
                      </span>
                    ))}
                    {activeFilters.marques.map(brand => (
                      <span key={brand} style={{
                        backgroundColor: '#fff0f0',
                        color: '#cc0000',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleBrandFilter(brand)}
                      title="Cliquer pour retirer ce filtre">
                        {brand}
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>×</span>
                      </span>
                    ))}
                   {activeFilters.prixMax < 1000000 && (
                      <span style={{
                        backgroundColor: '#f0fff0',
                        color: '#006600',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                      onClick={() => handlePriceFilter(1000000)}
                      title="Cliquer pour retirer ce filtre">
                        Max: {activeFilters.prixMax.toLocaleString()} GNF
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>×</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

             {/* En-tête de la catégorie */}
             <div className="category-header mb-4">
              <h1 style={{ fontSize: '2rem', color: '#232f3e', marginBottom: '10px' }}>
                Chaussures
              </h1>
              <p className="text-muted" style={{ fontSize: '1rem', marginBottom: '20px' }}>
                Découvrez notre large sélection de chaussures pour toute la famille
              </p>
              
              {/* Statistiques */}
              <div className="category-stats d-flex gap-4 mb-4">
                <div className="stat-item">
                  <span className="fw-bold" style={{ color: '#232f3e' }}>8,819</span>
                  <span className="text-muted ms-1">produits</span>
                </div>
                <div className="stat-item">
                  <span className="fw-bold" style={{ color: '#232f3e' }}>50+</span>
                  <span className="text-muted ms-1">marques</span>
                </div>
                <div className="stat-item">
                  <span className="fw-bold" style={{ color: '#232f3e' }}>Livraison</span>
                  <span className="text-muted ms-1">gratuite</span>
                </div>
              </div>
            </div>

                                      {/* Contenu conditionnel selon les filtres */}
             {activeFilters.genre.length > 0 || activeFilters.marques.length > 0 ? (
               // Page filtrée - affichage spécifique selon les filtres
               <div className="filtered-page">
                 {/* En-tête de la page filtrée */}
                 <div className="filtered-header mb-4">
                   <h2 style={{ fontSize: '1.8rem', color: '#232f3e', marginBottom: '15px' }}>
                     {activeFilters.genre.length > 0 && activeFilters.marques.length > 0 
                       ? `Chaussures ${subcategories.find(s => s.id === activeFilters.genre[0])?.label} ${activeFilters.marques[0]}`
                       : activeFilters.genre.length > 0 
                         ? `Chaussures ${subcategories.find(s => s.id === activeFilters.genre[0])?.label}`
                         : `Chaussures ${activeFilters.marques[0]}`
                     }
                   </h2>
                   {/* Compteur affiché uniquement pour la liste produits; la galerie Femme n'utilise pas le compteur */}
                   {!(activeFilters.genre[0] === 'femme') && (
                     <p style={{ fontSize: '1rem', color: '#666', marginBottom: '20px' }}>
                       {filteredProducts.length} produits trouvés
                     </p>
                   )}
                 </div>

                 {/* Si FEMME (avec ou sans marque): afficher la galerie d'images */}
                 {activeFilters.genre[0] === 'femme' ? (
                   <div>
                     {/* Message informatif */}


                     <div className="row g-3">
                                            {femmeImages
                       .filter(img => {
                         if (activeFilters.marques.length === 0) return true;
                         return activeFilters.marques.some(selectedBrand => {
                           const folderForBrand = getFolderFromBrand(selectedBrand);
                           return img.folder === folderForBrand;
                         });
                       })
                       .map((img, idx) => {
                         // Vérifier si c'est une image Christian Louboutin
                         const isChristianLouboutin = img.folder === 'CritianlouboutinNoire';
                         const product = isChristianLouboutin ? findProductByImage(img.src) : null;
                         
                         return (
                           <div key={`${img.src}-${idx}`} className="col-6 col-md-4 col-lg-3">
                             <div 
                               onClick={isChristianLouboutin ? () => handleChristianLouboutinClick(img.src) : undefined}
                               style={{
                                 backgroundColor: 'white',
                                 border: '1px solid #e9ecef',
                                 borderRadius: '8px',
                                 padding: '10px',
                                 height: '100%',
                                 transition: 'all 0.2s ease',
                                 cursor: isChristianLouboutin ? 'pointer' : 'default'
                               }}
                               onMouseEnter={isChristianLouboutin ? (e) => {
                                 e.target.style.transform = 'translateY(-2px)';
                                 e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                               } : undefined}
                               onMouseLeave={isChristianLouboutin ? (e) => {
                                 e.target.style.transform = 'translateY(0)';
                                 e.target.style.boxShadow = 'none';
                               } : undefined}
                             >
                               <div className="text-center">
                                 <img
                                   src={img.src}
                                   alt={`Femme ${idx + 1}`}
                                   style={{
                                     width: '100%',
                                     height: '280px',
                                     objectFit: 'contain',
                                     borderRadius: '6px',
                                     backgroundColor: '#f8f9fa',
                                     border: '1px solid #e9ecef'
                                   }}
                                   onError={(e) => {
                                     e.target.style.display = 'none';
                                   }}
                                                                   />
                               </div>
                               <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#333' }}>
                                 <div style={{ fontWeight: 600 }}>{img.brand}</div>
                                 <div style={{ color: '#666', wordBreak: 'break-word', fontSize: '0.75rem', lineHeight: '1.2' }}>{img.fileName}</div>
                                 {isChristianLouboutin && product && (
                                   <div style={{ 
                                     color: '#febd69', 
                                     fontSize: '0.7rem', 
                                     fontWeight: '600',
                                     marginTop: '4px'
                                   }}>
                                     {product.price.toLocaleString()} GNF
                                   </div>
                                 )}
                               </div>
                             </div>
                           </div>
                         );
                       })}
                   </div>
                 </div>
                 ) : (
                   // Sinon, afficher la grille de produits filtrés classique
                   <div className="filtered-products-grid">
                     {filteredProducts.length === 0 ? (
                       <div className="text-center py-5" style={{ color: '#666' }}>
                         <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>Aucun produit trouvé</div>
                         <div style={{ fontSize: '0.95rem' }}>Aucun produit ne correspond à cette sélection.</div>
                       </div>
                     ) : (
                      <div className="row g-4">
                        {filteredProducts.map(product => (
                          <div key={product.id} className="col-md-6 col-lg-4">
                            <div className="product-card" 
                              onClick={() => handleProductClick(product)}
                              style={{
                              backgroundColor: 'white',
                              border: '1px solid #e9ecef',
                              borderRadius: '8px',
                              padding: '20px',
                              height: '100%',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }}>
                              <div className="text-center mb-3">
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  style={{
                                    width: '100%',
                                    height: '250px',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                    backgroundColor: '#f8f9fa',
                                    border: '1px solid #e9ecef'
                                  }}
                                  onError={(e) => {
                                    // Fallback si l'image n'existe pas
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <div style={{
                                  width: '100%',
                                  height: '250px',
                                  backgroundColor: '#f8f9fa',
                                  borderRadius: '8px',
                                  display: 'none',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#666',
                                  fontSize: '1.2rem',
                                  fontWeight: '600',
                                  border: '1px solid #e9ecef'
                                }}>
                                  {product.brand}
                                </div>
                              </div>
                              <h5 style={{ fontSize: '1.1rem', color: '#232f3e', marginBottom: '10px', textAlign: 'center' }}>
                                {product.name}
                              </h5>
                              <div className="text-center mb-3">
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                  {subcategories.find(s => s.id === product.subcategory)?.label}
                                </span>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#232f3e' }}>
                                  {product.price.toLocaleString()} GNF
                                </span>
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                  ★ {product.rating} ({product.reviews})
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                     )}
                   </div>
                 )}
               </div>
             ) : (
               // Page normale - sous-catégories avec aperçu des produits
               <div className="subcategories-grid mb-5">
                 <h3 style={{ fontSize: '1.5rem', color: '#232f3e', marginBottom: '20px' }}>
                   Par genre
                 </h3>
                 <div className="row g-4">
                   {subcategories.map(subcat => (
                     <div key={subcat.id} className="col-md-6 col-lg-3">
                       <div 
                         className="subcategory-card"
                         onClick={() => handleSubcategoryClick(subcat.id)}
                         style={{
                           backgroundColor: 'white',
                           border: '1px solid #e9ecef',
                           borderRadius: '8px',
                           padding: '15px',
                           cursor: 'pointer',
                           transition: 'all 0.2s ease',
                           height: '100%'
                         }}
                         onMouseEnter={(e) => {
                           e.target.style.transform = 'translateY(-2px)';
                           e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                         }}
                         onMouseLeave={(e) => {
                           e.target.style.transform = 'translateY(0)';
                           e.target.style.boxShadow = 'none';
                         }}
                       >
                         <div className="text-center mb-3">
                           <img 
                             src={subcat.image} 
                             alt={subcat.label}
                             style={{
                               width: '100%',
                               height: '150px',
                               objectFit: 'contain',
                               borderRadius: '8px',
                               backgroundColor: '#f8f9fa',
                               border: '1px solid #e9ecef'
                             }}
                             onError={(e) => {
                               e.target.style.display = 'none';
                               e.target.nextSibling.style.display = 'flex';
                             }}
                           />
                           <div style={{
                             width: '100%',
                             height: '150px',
                             backgroundColor: '#f8f9fa',
                             borderRadius: '8px',
                             display: 'none',
                             alignItems: 'center',
                             justifyContent: 'center',
                             color: '#666',
                             fontSize: '1rem',
                             fontWeight: '500',
                             border: '1px solid #e9ecef'
                           }}>
                             {subcat.label}
                           </div>
                         </div>
                         <h5 style={{ 
                           fontSize: '1.1rem', 
                           color: '#232f3e', 
                           marginBottom: '8px',
                           textAlign: 'center'
                         }}>
                           {subcat.label}
                         </h5>
                         <p style={{ 
                           fontSize: '0.85rem', 
                           color: '#666', 
                           marginBottom: '10px',
                           textAlign: 'center'
                         }}>
                           {subcat.description}
                         </p>
                         <div className="text-center">
                           <span style={{ 
                             fontSize: '0.8rem', 
                             color: '#febd69',
                             fontWeight: '500'
                           }}>
                             {subcat.count}
                           </span>
                         </div>
                         
                                                   {/* Aperçu des produits de cette sous-catégorie */}
                          <div className="subcategory-preview mt-3">
                            <h6 style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px', textAlign: 'center' }}>
                              Aperçu des produits
                            </h6>
                            <div className="row g-1">
                              {getGeneralImages().map((image, index) => (
                                <div key={index} className="col-3">
                                  <img 
                                    src={image} 
                                    alt={`Aperçu ${index + 1}`}
                                    style={{
                                      width: '100%',
                                      height: '40px',
                                      objectFit: 'cover',
                                      borderRadius: '4px',
                                      border: '1px solid #e9ecef'
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default Chaussures; 