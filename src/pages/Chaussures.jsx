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
        const safeGenre = Array.isArray(parsed.genre) ? parsed.genre : [];
        return {
          genre: safeGenre,
          marques: Array.isArray(parsed.marques) ? parsed.marques : [],
          prixMax: typeof parsed.prixMax === 'number' ? parsed.prixMax : 1000000
        };
      }
    } catch (e) {}
    return {
      genre: [],
      marques: [],
      prixMax: 1000000
    };
  });

  const { products: contextProducts, approvedProducts, loading } = useProducts();
  
  const sourceProducts = (approvedProducts && approvedProducts.length > 0) ? approvedProducts : contextProducts;
  const allProducts = sourceProducts.filter(p => {
    const cat = (p.category || '').toString().toLowerCase();
    return cat.includes('chaussure');
  });

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
    `/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins.jpeg`,
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

  // Catalogue HOMME basé sur public/chaussures/homme/**
  const hommeImagePaths = [
    '/chaussures/homme/Balanciaga/Blanc/balenciaga-defender-blanc.jpg',
    '/chaussures/homme/Balanciaga/Blanc/balenciaga-speed-blanc.jpg',
    '/chaussures/homme/Balanciaga/Blanc/balenciaga-track-blanc.jpg',
    '/chaussures/homme/Balanciaga/Noire/balenciaga-defender-noire.jpg',
    '/chaussures/homme/Balanciaga/Noire/balenciaga-speed-noire.jpg',
    '/chaussures/homme/Balanciaga/Noire/balenciaga-track-noire.jpg',
    '/chaussures/homme/Balanciaga/Vertolive/balenciaga-defender-vertolive.jpg',
    '/chaussures/homme/Balanciaga/Vertolive/balenciaga-speed-vertolive.jpg',
    '/chaussures/homme/Balanciaga/Vertolive/balenciaga-track-vertolive.jpg',
    '/chaussures/homme/Gucci/Blanc/gucci-ace-blanc.jpg',
    '/chaussures/homme/Gucci/Blanc/gucci-rhyton-blanc.jpg',
    '/chaussures/homme/Gucci/Blanc/gucci-screener-blanc.jpg',
    '/chaussures/homme/Gucci/Guccinoire/gucci-ace-guccinoire.jpg',
    '/chaussures/homme/Gucci/Guccinoire/gucci-rhyton-guccinoire.jpg',
    '/chaussures/homme/Gucci/Guccinoire/gucci-screener-guccinoire.jpg',
    '/chaussures/homme/Gucci/Guccirose/gucci-ace-guccirose.jpg',
    '/chaussures/homme/Gucci/Guccirose/gucci-rhyton-guccirose.jpg',
    '/chaussures/homme/Gucci/Guccirose/gucci-screener-guccirose.jpg',
    '/chaussures/homme/Nike/blanc/nike-air-jordan-1-blanc.jpg',
    '/chaussures/homme/Nike/blanc/nike-air-max-270-blanc.jpg',
    '/chaussures/homme/Nike/blanc/nike-dunk-low-blanc.jpg',
    '/chaussures/homme/Nike/noire/nike-air-jordan-1-noir.jpg',
    '/chaussures/homme/Nike/noire/nike-air-max-270-noir.jpg',
    '/chaussures/homme/Nike/noire/nike-dunk-low-noir.jpg',
    '/chaussures/homme/Nike/vertolive/nike-air-jordan-1-vertolive.jpg',
    '/chaussures/homme/Nike/vertolive/nike-air-max-270-vertolive.jpg',
    '/chaussures/homme/Nike/vertolive/nike-dunk-low-vertolive.jpg',
    '/chaussures/homme/Puma/Blanc/puma-basket-classic-blanc.jpg',
    '/chaussures/homme/Puma/Blanc/puma-cali-sport-blanc.jpg',
    '/chaussures/homme/Puma/Blanc/puma-future-rider-blanc.jpg',
    '/chaussures/homme/Puma/Noir/puma-cali-sport-noire.jpg',
    '/chaussures/homme/Puma/Noir/puma-future-rider-noire.jpg',
    '/chaussures/homme/Puma/Noir/puma-rs-x-noire.jpg',
    '/chaussures/homme/Puma/Vertolive/puma-basket-classic-vertolive.jpg',
    '/chaussures/homme/Puma/Vertolive/puma-cali-sport-vertolive.jpg',
    '/chaussures/homme/Puma/Vertolive/puma-future-rider-vertolive.jpg',
  ];

  const buildHommeImagesMeta = (paths) => {
    return paths.map((p) => {
      const parts = p.split('/');
      const brandFolder = parts[3] || '';
      const fileWithExt = parts[5] || parts[4] || '';
      const fileName = fileWithExt.replace(/\.[^/.]+$/, '');
      return { src: p, brand: brandFolder, fileName };
    });
  };

  const hommeImages = buildHommeImagesMeta(hommeImagePaths);

  const handleHommeClick = (imagePath) => {
    console.log('🚀 Clic sur produit homme:', imagePath);
    navigate(`/product/synthetic-homme?image=${encodeURIComponent(imagePath)}`);
  };

  // Mapping des images Christian Louboutin vers leurs produits spécifiques
  const christianLouboutinImageMapping = {
            '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins.jpeg': 'cl-escarpins-noir-001',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg': 'cl-heels-collection-speciale-003',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg': 'cl-heels-edition-limitee-004',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg': 'cl-heels-design-exclusif-005',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg': 'cl-heels-collection-premium-006',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg': 'cl-heels-classic-002'
  };

  // Fonction pour trouver le produit exact correspondant à une image
  const findProductByImage = (imagePath) => {
    const productId = christianLouboutinImageMapping[imagePath];
    console.log('🔍 Recherche du produit pour l\'image:', imagePath);
    console.log('🆔 ID recherché:', productId);
    console.log('📦 allProducts disponibles:', allProducts.length);
    console.log('📦 contextProducts disponibles:', contextProducts.length);
    
    if (productId) {
      // Chercher d'abord dans contextProducts (qui contient les produits Christian Louboutin)
      let product = contextProducts.find(p => p.id === productId);
      console.log('🔍 Produit trouvé dans contextProducts:', product ? product.name : 'Aucun');
      
      if (!product) {
        product = allProducts.find(p => p.id === productId);
        console.log('🔍 Produit trouvé dans allProducts:', product ? product.name : 'Aucun');
      }
      return product;
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
      console.log('🏷️ Subcategory:', product.subcategory);
      navigate(`/product/${product.id}?image=${encodeURIComponent(imagePath)}`);
    } else {
      console.log('⚠️ Produit non trouvé pour l\'image:', imagePath);
      // Utiliser le produit de fallback par défaut
      navigate(`/product/cl-escarpins-noir-001?image=${encodeURIComponent(imagePath)}`);
    }
  };

  // Fonction pour gérer le clic sur une image Gucci (redirige vers la page détail avec l'image cliquée)
  const handleGucciClick = (imagePath) => {
    const fallbackProductId = 'cl-escarpins-noir-001';
    navigate(`/product/${fallbackProductId}?image=${encodeURIComponent(imagePath)}`);
  };

  // Fonction pour gérer le clic sur une image Jonak (redirige vers la page détail avec l'image cliquée)
  const handleJonakClick = (imagePath) => {
    const jonakProductId = 'jonak-bottines-western-marron';
    navigate(`/product/${jonakProductId}?image=${encodeURIComponent(imagePath)}`);
  };

  // Fonction pour gérer le clic sur une image Mango (redirige vers la page détail avec l'image cliquée)
  const handleMangoClick = (imagePath) => {
    const fallbackProductId = 'cl-escarpins-noir-001';
    navigate(`/product/${fallbackProductId}?image=${encodeURIComponent(imagePath)}`);
  };

  // Fonction pour gérer le clic sur une image Minelli (redirige vers la page détail avec l'image cliquée)
  const handleMinelliClick = (imagePath) => {
    const fallbackProductId = 'cl-escarpins-noir-001';
    navigate(`/product/${fallbackProductId}?image=${encodeURIComponent(imagePath)}`);
      };
   
    // Fonction pour gérer le clic sur une image Zara (redirige vers la page détail avec l'image cliquée)
    const handleZaraClick = (imagePath) => {
      const fallbackProductId = 'cl-escarpins-noir-001';
      navigate(`/product/${fallbackProductId}?image=${encodeURIComponent(imagePath)}`);
    };

    // Fonction pour gérer le clic sur une image Prada (redirige vers la page détail avec l'image cliquée)
    const handlePradaClick = (imagePath) => {
      const fallbackProductId = 'cl-escarpins-noir-001';
      navigate(`/product/${fallbackProductId}?image=${encodeURIComponent(imagePath)}`);
    };
   
    // Chemins des images pour chaque section


  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    // Ici vous pourriez naviguer vers une page de sous-catégorie
    console.log(`Sous-catégorie sélectionnée: ${subcategoryId}`);
  };

  const handleProductClick = (product) => {
    console.log('🚀 Clic sur produit:', product.name, product.id);
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

  const handleGenreAll = () => {
    setActiveFilters(prev => ({
      ...prev,
      genre: []
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

  // Jeu de données à afficher: pour Homme, on utilise le catalogue d'images public
  const displayProducts = activeFilters.genre[0] === 'homme'
    ? hommeImages
        .filter(img => {
          if (activeFilters.marques.length === 0) return true;
          return activeFilters.marques.some(selectedBrand => {
            // Mapping des marques pour correspondre aux dossiers d'images
            const brandMapping = {
              'Balenciaga': 'Balanciaga',
              'Gucci': 'Gucci', 
              'Nike': 'Nike',
              'Puma': 'Puma'
            };
            const mappedBrand = brandMapping[selectedBrand] || selectedBrand;
            return img.brand.toLowerCase() === mappedBrand.toLowerCase();
          });
        })
        .map(img => ({
          id: img.src,
          name: img.fileName,
          image: img.src,
          brand: img.brand,
          price: 0
        }))
    : filteredProducts;

  // Si aucun produit avec une marque filtrée, on supprime la marque pour afficher les résultats
  useEffect(() => {
    if (allProducts.length > 0 && filteredProducts.length === 0 && activeFilters.marques.length > 0) {
      setActiveFilters(prev => ({ ...prev, marques: [] }));
    }
  }, [allProducts.length, filteredProducts.length, activeFilters.marques.length]);

  // Debug: Afficher les produits filtrés
  console.log('Produits filtrés:', filteredProducts.length);
  console.log('Filtres actifs:', activeFilters);
  console.log('Tous les produits:', allProducts.length);

  const isAllSelected = activeFilters.genre.length === 0; 

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
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`filter-tout`}
                  checked={activeFilters.genre.length === 0}
                  onChange={handleGenreAll}
                  style={{ accentColor: '#febd69' }}
                />
                <label className="form-check-label" htmlFor={`filter-tout`} style={{ fontSize: '0.9rem' }}>
                  Tout
                </label>
              </div>
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
             {(isAllSelected || activeFilters.genre.length > 0 || activeFilters.marques.length > 0 || activeFilters.prixMax < 1000000) && (
                <div className="active-filters mb-3" style={{
                  backgroundColor: '#f0f8ff',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #b3d9ff'
                }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0066cc' }}>🔍 Filtres actifs :</span>
                    <button 
                      onClick={() => setActiveFilters({ genre: [], marques: [], prixMax: 1000000 })}
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
                    {isAllSelected && (
                      <span style={{
                        backgroundColor: '#e6f3ff',
                        color: '#0066cc',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        Tout
                      </span>
                    )}
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
             {isAllSelected || activeFilters.genre.length > 0 || activeFilters.marques.length > 0 ? (
               // Page filtrée - affichage spécifique selon les filtres
               <div className="filtered-page">
                 {/* En-tête de la page filtrée */}
                 <div className="filtered-header mb-4">
                   <h2 style={{ fontSize: '1.8rem', color: '#232f3e', marginBottom: '15px' }}>
                    {isAllSelected && activeFilters.marques.length === 0 ? 'Toutes les chaussures' : (
                      activeFilters.genre.length > 0 && activeFilters.marques.length > 0 
                      ? `Chaussures ${subcategories.find(s => s.id === activeFilters.genre[0])?.label} ${activeFilters.marques[0]}`
                      : activeFilters.genre.length > 0 
                        ? `Chaussures ${subcategories.find(s => s.id === activeFilters.genre[0])?.label}`
                        : `Chaussures ${activeFilters.marques[0]}`
                    )}
                   </h2>
                   {/* Compteur affiché uniquement pour la liste produits; la galerie Femme n'utilise pas le compteur */}
                   {!(activeFilters.genre[0] === 'femme') && (
                     <p style={{ fontSize: '1rem', color: '#666', marginBottom: '20px' }}>
                       {activeFilters.genre[0] === 'homme' ? displayProducts.length : filteredProducts.length} produits trouvés
                     </p>
                   )}
                 </div>

                 {/* Si FEMME (avec ou sans marque): afficher les cartes produits comme Homme */}
                 {activeFilters.genre[0] === 'femme' ? (
                   <div>
                     <div className="row g-4">
                       {femmeImages
                         .filter(img => {
                           if (activeFilters.marques.length === 0) return true;
                           return activeFilters.marques.some(selectedBrand => {
                             const folderForBrand = getFolderFromBrand(selectedBrand);
                             return img.folder === folderForBrand;
                           });
                         })
                         .map((img, idx) => {
                           // Vérifier si c'est une image Christian Louboutin ou Gucci
                           const isChristianLouboutin = img.folder === 'CritianlouboutinNoire';
                           const isGucci = img.folder === 'Gucci';
                           const isJonak = img.folder === 'Jonak';
                           const isMango = img.folder === 'Mango';
                           const isMinelli = img.folder === 'Minelli';
                           const isZara = img.folder === 'Zaranoire';
                           const isPrada = img.folder === 'PradaBeige';
                           const product = isChristianLouboutin ? findProductByImage(img.src) : null;
                           
                           return (
                             <div key={`${img.src}-${idx}`} className="col-md-6 col-lg-4">
                               <div className="product-card" 
                                 onClick={
                                   isChristianLouboutin
                                     ? () => handleChristianLouboutinClick(img.src)
                                     : (isGucci ? () => handleGucciClick(img.src) : (isJonak ? () => handleJonakClick(img.src) : (isMango ? () => handleMangoClick(img.src) : (isMinelli ? () => handleMinelliClick(img.src) : (isZara ? () => handleZaraClick(img.src) : (isPrada ? () => handlePradaClick(img.src) : undefined))))))
                                 }
                                 style={{
                                   backgroundColor: 'white',
                                   border: '1px solid #e9ecef',
                                   borderRadius: '8px',
                                   padding: '20px',
                                   height: '100%',
                                   transition: 'all 0.2s ease',
                                   cursor: (isChristianLouboutin || isGucci || isJonak || isMango || isMinelli || isZara || isPrada) ? 'pointer' : 'default'
                                 }}
                                 onMouseEnter={(isChristianLouboutin || isGucci || isJonak || isMango || isMinelli || isZara || isPrada) ? (e) => {
                                   e.target.style.transform = 'translateY(-2px)';
                                   e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                 } : undefined}
                                 onMouseLeave={(isChristianLouboutin || isGucci || isJonak || isMango || isMinelli || isZara || isPrada) ? (e) => {
                                   e.target.style.transform = 'translateY(0)';
                                   e.target.style.boxShadow = 'none';
                                 } : undefined}
                               >
                                 <div className="text-center mb-3">
                                   <img
                                     src={img.src}
                                     alt={`${img.brand} ${img.fileName}`}
                                     style={{
                                       width: '100%',
                                       height: '250px',
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
                                     {img.brand}
                                   </div>
                                 </div>
                                 <h5 style={{ fontSize: '1.1rem', color: '#232f3e', marginBottom: '10px', textAlign: 'center' }}>
                                   {img.fileName}
                                 </h5>
                                 <div className="text-center mb-3">
                                   <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                     {img.brand}
                                   </span>
                                 </div>
                                 <div className="d-flex justify-content-between align-items-center">
                                   {isChristianLouboutin && product ? (
                                     <>
                                       <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#232f3e' }}>
                                         {(() => {
                                           const catalog = [
                                             { image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins.jpeg', price: 2500000 },
                                             { image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg', price: 2450000 },
                                             { image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg', price: 2600000 },
                                             { image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg', price: 2700000 },
                                             { image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg', price: 2550000 },
                                             { image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg', price: 2650000 }
                                           ];
                                           const match = catalog.find(i => i.image === img.src);
                                           const price = (match?.price ?? product.price) || 0;
                                           return price.toLocaleString();
                                         })()} GNF
                                       </span>
                                       <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                         ★ {product.rating} ({product.reviewCount})
                                       </span>
                                     </>
                                   ) : isGucci ? (
                                     <>
                                       <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#232f3e' }}>
                                         {(() => {
                                           const gucciCatalog = [
                                             { image: '/chaussures/femme/Gucci/Designer High Heel Sandals _ Block Heel Sandals   _ GUCCI® International.jpeg', price: 1800000, rating: 4.6, reviewCount: 210 },
                                             { image: '/chaussures/femme/Gucci/Designer High Heel Sandals _ Block Heel Sandals   _ GUCCI® US.jpeg', price: 1820000, rating: 4.6, reviewCount: 195 },
                                             { image: '/chaussures/femme/Gucci/Gucci Leather Sandals - Noir.jpeg', price: 1850000, rating: 4.7, reviewCount: 238 },
                                             { image: '/chaussures/femme/Gucci/Gucci Sandals - Noir 3.jpeg', price: 1780000, rating: 4.5, reviewCount: 168 },
                                             { image: "/chaussures/femme/Gucci/Women's Designer Luxury High Heels Pumps _ GUCCI® US.jpeg", price: 1900000, rating: 4.7, reviewCount: 256 }
                                           ];
                                           const match = gucciCatalog.find(i => i.image === img.src);
                                           const price = match?.price || 0;
                                           return price.toLocaleString();
                                         })()} GNF
                                       </span>
                                       <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                         {(() => {
                                           const gucciCatalog = [
                                             { image: '/chaussures/femme/Gucci/Designer High Heel Sandals _ Block Heel Sandals   _ GUCCI® International.jpeg', price: 1800000, rating: 4.6, reviewCount: 210 },
                                             { image: '/chaussures/femme/Gucci/Designer High Heel Sandals _ Block Heel Sandals   _ GUCCI® US.jpeg', price: 1820000, rating: 4.6, reviewCount: 195 },
                                             { image: '/chaussures/femme/Gucci/Gucci Leather Sandals - Noir.jpeg', price: 1850000, rating: 4.7, reviewCount: 238 },
                                             { image: '/chaussures/femme/Gucci/Gucci Sandals - Noir 3.jpeg', price: 1780000, rating: 4.5, reviewCount: 168 },
                                             { image: "/chaussures/femme/Gucci/Women's Designer Luxury High Heels Pumps _ GUCCI® US.jpeg", price: 1900000, rating: 4.7, reviewCount: 256 }
                                           ];
                                           const match = gucciCatalog.find(i => i.image === img.src);
                                           const rating = match?.rating || 4.6;
                                           const reviews = match?.reviewCount || 200;
                                           return `★ ${rating} (${reviews})`;
                                         })()}
                                       </span>
                                     </>
                                                                     ) : isJonak ? (
                                    <>
                                      <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#232f3e' }}>
                                        {(() => {
                                          const jonakCatalog = [
                                            { image: '/chaussures/femme/Jonak/Chaussures Femme tendance _ Jonak.jpeg', price: 280000, rating: 4.1, reviewCount: 120 },
                                            { image: '/chaussures/femme/Jonak/Chaussures Femme tendance _ Jonak (1).jpeg', price: 282000, rating: 4.1, reviewCount: 110 },
                                            { image: '/chaussures/femme/Jonak/Jonak Bottines Santiags Basama - Marron.jpeg', price: 300000, rating: 4.2, reviewCount: 98 },
                                            { image: '/chaussures/femme/Jonak/Jonak Bottines Western Cuir Basama - Marron.jpeg', price: 305000, rating: 4.2, reviewCount: 101 }
                                          ];
                                          const match = jonakCatalog.find(i => i.image === img.src);
                                          const price = match?.price || 0;
                                          return price.toLocaleString();
                                        })()} GNF
                                      </span>
                                      <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                        {(() => {
                                          const jonakCatalog = [
                                            { image: '/chaussures/femme/Jonak/Chaussures Femme tendance _ Jonak.jpeg', price: 280000, rating: 4.1, reviewCount: 120 },
                                            { image: '/chaussures/femme/Jonak/Chaussures Femme tendance _ Jonak (1).jpeg', price: 282000, rating: 4.1, reviewCount: 110 },
                                            { image: '/chaussures/femme/Jonak/Jonak Bottines Santiags Basama - Marron.jpeg', price: 300000, rating: 4.2, reviewCount: 98 },
                                            { image: '/chaussures/femme/Jonak/Jonak Bottines Western Cuir Basama - Marron.jpeg', price: 305000, rating: 4.2, reviewCount: 101 }
                                          ];
                                          const match = jonakCatalog.find(i => i.image === img.src);
                                          const rating = match?.rating || 4.1;
                                          const reviews = match?.reviewCount || 100;
                                          return `★ ${rating} (${reviews})`;
                                        })()}
                                      </span>
                                    </>
                                  ) : isMango ? (
                                    <>
                                      <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#232f3e' }}>
                                        {(() => {
                                          const mangoCatalog = [
                                            { image: '/chaussures/femme/Mango/MANGO Ankle Strap Sandal in Nude at Nordstrom, Size 6_5Us.jpeg', price: 320000, rating: 4.2, reviewCount: 145 },
                                            { image: '/chaussures/femme/Mango/Mango Strappy Sandals - Nude.jpeg', price: 318000, rating: 4.2, reviewCount: 132 },
                                            { image: '/chaussures/femme/Mango/Mango Strappy Sandals - Nude 2.jpeg', price: 319000, rating: 4.2, reviewCount: 128 },
                                            { image: '/chaussures/femme/Mango/Mango Strappy Sandals - Nude 3.jpeg', price: 321000, rating: 4.2, reviewCount: 140 }
                                          ];
                                          const match = mangoCatalog.find(i => i.image === img.src);
                                          const price = match?.price || 0;
                                          return price.toLocaleString();
                                        })()} GNF
                                      </span>
                                      <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                        {(() => {
                                          const mangoCatalog = [
                                            { image: '/chaussures/femme/Mango/MANGO Ankle Strap Sandal in Nude at Nordstrom, Size 6_5Us.jpeg', price: 320000, rating: 4.2, reviewCount: 145 },
                                            { image: '/chaussures/femme/Mango/Mango Strappy Sandals - Nude.jpeg', price: 318000, rating: 4.2, reviewCount: 132 },
                                            { image: '/chaussures/femme/Mango/Mango Strappy Sandals - Nude 2.jpeg', price: 319000, rating: 4.2, reviewCount: 128 },
                                            { image: '/chaussures/femme/Mango/Mango Strappy Sandals - Nude 3.jpeg', price: 321000, rating: 4.2, reviewCount: 140 }
                                          ];
                                          const match = mangoCatalog.find(i => i.image === img.src);
                                          const rating = match?.rating || 4.2;
                                          const reviews = match?.reviewCount || 130;
                                          return `★ ${rating} (${reviews})`;
                                        })()}
                                      </span>
                                    </>
                                  ) : isMinelli ? (
                                    <>
                                      <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#232f3e' }}>
                                        {(() => {
                                          const minelliCatalog = [
                                            { image: '/chaussures/femme/Minelli/Minelli Escarpins - Noir.jpeg', price: 380000, rating: 4.4, reviewCount: 165 },
                                            { image: '/chaussures/femme/Minelli/Minelli Escarpins - Noir 2.jpeg', price: 385000, rating: 4.4, reviewCount: 158 },
                                            { image: '/chaussures/femme/Minelli/Minelli Escarpins - Noir 3.jpeg', price: 390000, rating: 4.4, reviewCount: 172 },
                                            { image: '/chaussures/femme/Minelli/Minelli Tulin Bottines Talon - Noir.jpeg', price: 420000, rating: 4.5, reviewCount: 189 }
                                          ];
                                          const match = minelliCatalog.find(i => i.image === img.src);
                                          const price = match?.price || 0;
                                          return price.toLocaleString();
                                        })()} GNF
                                      </span>
                                      <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                        {(() => {
                                          const minelliCatalog = [
                                            { image: '/chaussures/femme/Minelli/Minelli Escarpins - Noir.jpeg', price: 380000, rating: 4.4, reviewCount: 165 },
                                            { image: '/chaussures/femme/Minelli/Minelli Escarpins - Noir 2.jpeg', price: 385000, rating: 4.4, reviewCount: 158 },
                                            { image: '/chaussures/femme/Minelli/Minelli Escarpins - Noir 3.jpeg', price: 390000, rating: 4.4, reviewCount: 172 },
                                            { image: '/chaussures/femme/Minelli/Minelli Tulin Bottines Talon - Noir.jpeg', price: 420000, rating: 4.5, reviewCount: 189 }
                                          ];
                                          const match = minelliCatalog.find(i => i.image === img.src);
                                          const rating = match?.rating || 4.4;
                                          const reviews = match?.reviewCount || 160;
                                          return `★ ${rating} (${reviews})`;
                                        })()}
                                      </span>
                                    </>
                                                                    ) : isZara ? (
                                    <>
                                      <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#232f3e' }}>
                                        {(() => {
                                          const zaraCatalog = [
                                            { image: '/chaussures/femme/Zaranoire/Zara Ankle Strap Heels - Noir.jpeg', price: 450000, rating: 4.3, reviewCount: 185 },
                                            { image: '/chaussures/femme/Zaranoire/Zara Classic Heels - Noir.jpeg', price: 440000, rating: 4.2, reviewCount: 172 },
                                            { image: '/chaussures/femme/Zaranoire/Zara High Heel Platform Slingback Shoes - Noir.jpeg', price: 470000, rating: 4.3, reviewCount: 198 },
                                            { image: '/chaussures/femme/Zaranoire/Zara Pointed Toe Heels - Noir.jpeg', price: 455000, rating: 4.3, reviewCount: 165 },
                                            { image: '/chaussures/femme/Zaranoire/Zara Rhinestone Suede Heels - Noir.jpeg', price: 465000, rating: 4.4, reviewCount: 189 },
                                            { image: '/chaussures/femme/Zaranoire/Zara Strappy Heels - Noir.jpeg', price: 448000, rating: 4.2, reviewCount: 176 }
                                          ];
                                          const match = zaraCatalog.find(i => i.image === img.src);
                                          const price = match?.price || 0;
                                          return price.toLocaleString();
                                        })()} GNF
                                      </span>
                                      <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                        {(() => {
                                          const zaraCatalog = [
                                            { image: '/chaussures/femme/Zaranoire/Zara Ankle Strap Heels - Noir.jpeg', price: 450000, rating: 4.3, reviewCount: 185 },
                                            { image: '/chaussures/femme/Zaranoire/Zara Classic Heels - Noir.jpeg', price: 440000, rating: 4.2, reviewCount: 172 },
                                            { image: '/chaussures/femme/Zaranoire/Zara High Heel Platform Slingback Shoes - Noir.jpeg', price: 470000, rating: 4.3, reviewCount: 198 },
                                            { image: '/chaussures/femme/Zaranoire/Zara Pointed Toe Heels - Noir.jpeg', price: 455000, rating: 4.3, reviewCount: 165 },
                                            { image: '/chaussures/femme/Zaranoire/Zara Rhinestone Suede Heels - Noir.jpeg', price: 465000, rating: 4.4, reviewCount: 189 },
                                            { image: '/chaussures/femme/Zaranoire/Zara Strappy Heels - Noir.jpeg', price: 448000, rating: 4.2, reviewCount: 176 }
                                          ];
                                          const match = zaraCatalog.find(i => i.image === img.src);
                                          const rating = match?.rating || 4.3;
                                          const reviews = match?.reviewCount || 180;
                                          return `★ ${rating} (${reviews})`;
                                        })()}
                                      </span>
                                    </>
                                  ) : isPrada ? (
                                    <>
                                      <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#232f3e' }}>
                                        {(() => {
                                          const pradaCatalog = [
                                            { image: '/chaussures/femme/PradaBeige/Prada Ankle Strap Platform Sandals - Beige.jpeg', price: 2200000, rating: 4.7, reviewCount: 245 },
                                            { image: '/chaussures/femme/PradaBeige/Prada Gold Platform Sandals - Beige.jpeg', price: 2250000, rating: 4.7, reviewCount: 238 },
                                            { image: '/chaussures/femme/PradaBeige/Prada Leather Platform Sandals - Beige.jpeg', price: 2180000, rating: 4.6, reviewCount: 256 },
                                            { image: '/chaussures/femme/PradaBeige/Prada Metallic Platform Sandals - Beige.jpeg', price: 2230000, rating: 4.7, reviewCount: 267 },
                                            { image: '/chaussures/femme/PradaBeige/Prada Paige Platform Sandals - Beige.jpeg', price: 2210000, rating: 4.6, reviewCount: 234 },
                                            { image: '/chaussures/femme/PradaBeige/Prada Sandales - Beige.jpeg', price: 2100000, rating: 4.5, reviewCount: 289 },
                                            { image: '/chaussures/femme/PradaBeige/Prada Suede Sandals - Beige.jpeg', price: 2150000, rating: 4.6, reviewCount: 278 }
                                          ];
                                          const match = pradaCatalog.find(i => i.image === img.src);
                                          const price = match?.price || 0;
                                          return price.toLocaleString();
                                        })()} GNF
                                      </span>
                                      <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                        {(() => {
                                          const pradaCatalog = [
                                            { image: '/chaussures/femme/PradaBeige/Prada Ankle Strap Platform Sandals - Beige.jpeg', price: 2200000, rating: 4.7, reviewCount: 245 },
                                            { image: '/chaussures/femme/PradaBeige/Prada Gold Platform Sandals - Beige.jpeg', price: 2250000, rating: 4.7, reviewCount: 238 },
                                            { image: '/chaussures/femme/PradaBeige/Prada Leather Platform Sandals - Beige.jpeg', price: 2180000, rating: 4.6, reviewCount: 256 },
                                            { image: '/chaussures/femme/PradaBeige/Prada Metallic Platform Sandals - Beige.jpeg', price: 2230000, rating: 4.7, reviewCount: 267 },
                                            { image: '/chaussures/femme/PradaBeige/Prada Paige Platform Sandals - Beige.jpeg', price: 2210000, rating: 4.6, reviewCount: 234 },
                                            { image: '/chaussures/femme/PradaBeige/Prada Sandales - Beige.jpeg', price: 2100000, rating: 4.5, reviewCount: 289 },
                                            { image: '/chaussures/femme/PradaBeige/Prada Suede Sandals - Beige.jpeg', price: 2150000, rating: 4.6, reviewCount: 278 }
                                          ];
                                          const match = pradaCatalog.find(i => i.image === img.src);
                                          const rating = match?.rating || 4.6;
                                          const reviews = match?.reviewCount || 250;
                                          return `★ ${rating} (${reviews})`;
                                        })()}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#232f3e' }}>
                                        Prix sur demande
                                      </span>
                                      <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                        ★ 4.5+ (N/A)
                                      </span>
                                    </>
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
                    {(activeFilters.genre[0] === 'homme' ? displayProducts.length === 0 : filteredProducts.length === 0) ? (
                      <div className="text-center py-5" style={{ color: '#666' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8 }}>Aucun produit trouvé</div>
                        <div style={{ fontSize: '0.95rem' }}>Aucun produit ne correspond à cette sélection.</div>
                      </div>
                    ) : (
                     <div className="row g-4">
                       {(activeFilters.genre[0] === 'homme' ? displayProducts : filteredProducts).map(product => (
                          <div key={product.id} className="col-md-6 col-lg-4">
                            <div className="product-card" 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('🖱️ Clic détecté sur produit:', product.name || product.id);
                                if (activeFilters.genre[0] === 'homme') {
                                  handleHommeClick(product.image);
                                } else {
                                  handleProductClick(product);
                                }
                              }}
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
                              e.target.style.borderColor = '#007bff';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                              e.target.style.borderColor = '#e9ecef';
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