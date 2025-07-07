import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ProductDetail = () => {
  const { t } = useLanguage();
  const { productId } = useParams();
  const location = useLocation();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  
  // Breadcrumbs dynamiques Amazon-style
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { name: 'Accueil', path: '/', icon: 'bi-house-door' }
    ];
    
    // Ajouter le contexte de navigation selon l'origine
    if (location.state?.fromCatalogue) {
      breadcrumbs.push(
        { name: 'Catalogue', path: '/catalogue', icon: 'bi-grid' },
        { name: 'Tous les produits', path: '/catalogue', icon: 'bi-collection' }
      );
    } else if (location.state?.fromHome) {
      breadcrumbs.push(
        { name: 'Page d\'accueil', path: '/', icon: 'bi-house' },
        { name: 'Produits populaires', path: '/', icon: 'bi-star' }
      );
    } else {
      // Breadcrumbs par défaut basés sur la catégorie du produit
      breadcrumbs.push(
        { name: 'Chaussures', path: '/categorie/homme', icon: 'bi-bag' },
        { name: product?.brand || 'Marque', path: '#', icon: 'bi-tag' }
      );
    }
    
    return breadcrumbs;
  };

  // Base de données des produits avec leurs vraies images
  const productsDatabase = {
    // Chaussures
    "nike-air-max-270": {
      id: "nike-air-max-270",
      name: "Nike Air Max 270 - Chaussures de Running",
      brand: "Nike",
      price: 129.99,
      originalPrice: 159.99,
      discount: 19,
      rating: 4.5,
      reviewCount: 1247,
      availability: "En stock",
      deliveryDate: "Livraison gratuite demain",
      seller: "Nike Store",
      isPrime: true,
      colors: [
        { name: "Noir/Blanc", code: "#000000", image: "/assets/categorie/arriver (1).png" },
        { name: "Bleu Marine", code: "#000080", image: "/assets/categorie/arriver (2).png" },
        { name: "Gris", code: "#808080", image: "/assets/categorie/arriver (3).png" }
      ],
      sizes: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
      images: [
        "/assets/categorie/arriver (1).png",
        "/assets/categorie/arriver (2).png",
        "/assets/categorie/arriver (3).png",
        "/assets/categorie/arriver (4).png"
      ],
      description: "Les Nike Air Max 270 offrent un amorti exceptionnel grâce à la technologie Air Max. Idéales pour la course à pied et le sport quotidien, ces chaussures allient confort et style.",
      features: [
        "Technologie Air Max pour un amorti optimal",
        "Semelle extérieure en caoutchouc durable",
        "Tige en mesh respirant",
        "Doublure confortable",
        "Poids léger : 320g"
      ],
      specifications: {
        "Marque": "Nike",
        "Modèle": "Air Max 270",
        "Type": "Running",
        "Matériau": "Mesh, Caoutchouc",
        "Poids": "320g",
        "Hauteur de la tige": "Basse",
        "Fermeture": "Lacets"
      }
    },
    "adidas-ultraboost-22": {
      id: "adidas-ultraboost-22",
      name: "Adidas Ultraboost 22 - Chaussures de Running",
      brand: "Adidas",
      price: 149.99,
      originalPrice: 179.99,
      discount: 17,
      rating: 4.3,
      reviewCount: 892,
      availability: "En stock",
      deliveryDate: "Livraison gratuite demain",
      seller: "Adidas Store",
      isPrime: true,
      colors: [
        { name: "Blanc/Noir", code: "#FFFFFF", image: "/assets/categorie/arriver (2).png" },
        { name: "Bleu", code: "#0066CC", image: "/assets/categorie/arriver (3).png" },
        { name: "Rouge", code: "#CC0000", image: "/assets/categorie/arriver (4).png" }
      ],
      sizes: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
      images: [
        "/assets/categorie/arriver (2).png",
        "/assets/categorie/arriver (3).png",
        "/assets/categorie/arriver (4).png",
        "/assets/categorie/arriver (1).png"
      ],
      description: "Les Adidas Ultraboost 22 offrent une performance exceptionnelle avec la technologie Boost. Parfaites pour la course longue distance et le confort quotidien.",
      features: [
        "Technologie Boost pour un amorti maximal",
        "Tige Primeknit adaptative",
        "Semelle Continental™",
        "Design responsive",
        "Poids léger : 310g"
      ],
      specifications: {
        "Marque": "Adidas",
        "Modèle": "Ultraboost 22",
        "Type": "Running",
        "Matériau": "Primeknit, Boost",
        "Poids": "310g",
        "Hauteur de la tige": "Basse",
        "Fermeture": "Lacets"
      }
    },
    "puma-rs-x": {
      id: "puma-rs-x",
      name: "Puma RS-X - Chaussures de Sport",
      brand: "Puma",
      price: 89.99,
      originalPrice: 119.99,
      discount: 25,
      rating: 4.1,
      reviewCount: 567,
      availability: "En stock",
      deliveryDate: "Livraison gratuite demain",
      seller: "Puma Store",
      isPrime: true,
      colors: [
        { name: "Blanc/Gris", code: "#CCCCCC", image: "/assets/categorie/arriver (3).png" },
        { name: "Noir/Rouge", code: "#000000", image: "/assets/categorie/arriver (4).png" },
        { name: "Bleu", code: "#0066CC", image: "/assets/categorie/arriver (1).png" }
      ],
      sizes: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
      images: [
        "/assets/categorie/arriver (3).png",
        "/assets/categorie/arriver (4).png",
        "/assets/categorie/arriver (1).png",
        "/assets/categorie/arriver (2).png"
      ],
      description: "Les Puma RS-X combinent style rétro et confort moderne. Parfaites pour le sport et le style urbain.",
      features: [
        "Design rétro inspiré des années 80",
        "Amorti RS (Running System)",
        "Tige en mesh et cuir",
        "Semelle en caoutchouc durable",
        "Style polyvalent"
      ],
      specifications: {
        "Marque": "Puma",
        "Modèle": "RS-X",
        "Type": "Lifestyle",
        "Matériau": "Mesh, Cuir",
        "Poids": "350g",
        "Hauteur de la tige": "Basse",
        "Fermeture": "Lacets"
      }
    },
    "new-balance-574": {
      id: "new-balance-574",
      name: "New Balance 574 - Chaussures Classiques",
      brand: "New Balance",
      price: 79.99,
      originalPrice: 99.99,
      discount: 20,
      rating: 4.4,
      reviewCount: 1234,
      availability: "En stock",
      deliveryDate: "Livraison gratuite demain",
      seller: "New Balance Store",
      isPrime: true,
      colors: [
        { name: "Gris/Blanc", code: "#808080", image: "/assets/categorie/arriver (4).png" },
        { name: "Bleu Marine", code: "#000080", image: "/assets/categorie/arriver (1).png" },
        { name: "Vert", code: "#006600", image: "/assets/categorie/arriver (2).png" }
      ],
      sizes: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
      images: [
        "/assets/categorie/arriver (4).png",
        "/assets/categorie/arriver (1).png",
        "/assets/categorie/arriver (2).png",
        "/assets/categorie/arriver (3).png"
      ],
      description: "Les New Balance 574 sont des chaussures classiques intemporelles. Confortables et durables, elles sont parfaites pour tous les jours.",
      features: [
        "Design classique intemporel",
        "Amorti ENCAP",
        "Tige en mesh et cuir",
        "Semelle en caoutchouc",
        "Confort exceptionnel"
      ],
      specifications: {
        "Marque": "New Balance",
        "Modèle": "574",
        "Type": "Lifestyle",
        "Matériau": "Mesh, Cuir",
        "Poids": "340g",
        "Hauteur de la tige": "Basse",
        "Fermeture": "Lacets"
      }
    }
  };

  // Récupérer le produit selon l'ID
  const product = productsDatabase[productId] || {
    id: productId,
    name: "Produit non trouvé",
    brand: "Marque inconnue",
    price: 0,
    originalPrice: 0,
    discount: 0,
    rating: 0,
    reviewCount: 0,
    availability: "Non disponible",
    deliveryDate: "Livraison non disponible",
    seller: "Vendeur inconnu",
    isPrime: false,
    colors: [],
    sizes: [],
    images: ["/assets/categorie/arriver (1).png"],
    description: "Ce produit n'est pas disponible.",
    features: [],
    specifications: {}
  };

  // Produits similaires
  const similarProducts = [
    {
      id: 2,
      name: "Adidas Ultraboost 22",
      price: 149.99,
      image: "/assets/categorie/arriver (2).png",
      rating: 4.3
    },
    {
      id: 3,
      name: "Puma RS-X",
      price: 89.99,
      image: "/assets/categorie/arriver (3).png",
      rating: 4.1
    },
    {
      id: 4,
      name: "New Balance 574",
      price: 79.99,
      image: "/assets/categorie/arriver (4).png",
      rating: 4.4
    }
  ];

  // Produits fréquemment achetés ensemble
  const frequentlyBoughtTogether = [
    {
      id: 5,
      name: "Chaussettes de sport Nike",
      price: 12.99,
      image: "/assets/categorie/arriver (1).png"
    },
    {
      id: 6,
      name: "Spray imperméabilisant",
      price: 8.99,
      image: "/assets/categorie/arriver (2).png"
    }
  ];

  const completeYourLook = [
    { id: 'sac-cuir', name: 'Sac à main en cuir', price: 59.99, image: '/assets/categorie/arriver (2).png' },
    { id: 'ceinture-classique', name: 'Ceinture classique', price: 19.99, image: '/assets/categorie/arriver (3).png' },
    { id: 'casquette-sport', name: 'Casquette sport', price: 14.99, image: '/assets/categorie/arriver (4).png' }
  ];

  // Ajoutons une logique simple pour détecter un accessoire
  const isAccessory = product.name.toLowerCase().includes('sac') || product.name.toLowerCase().includes('ceinture') || product.name.toLowerCase().includes('casquette');
  const [engraving, setEngraving] = useState('');
  const [selectedLaceColor, setSelectedLaceColor] = useState('noir');
  const laceColors = ['noir', 'blanc', 'rouge', 'bleu', 'vert'];

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert(t('please_select_size_color'));
      return;
    }

    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      image: product.images[0]
    };

    setCartItems([...cartItems, newItem]);
    setShowCartPreview(true);
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      alert(t('please_select_size_color'));
      return;
    }
    console.log('Achat direct');
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleCartItemQuantityChange = (itemIndex, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[itemIndex].quantity = newQuantity;
      setCartItems(updatedCartItems);
    } else if (newQuantity === 0) {
      // Supprimer l'article si la quantité est 0
      const updatedCartItems = cartItems.filter((_, index) => index !== itemIndex);
      setCartItems(updatedCartItems);
      if (updatedCartItems.length === 0) {
        setShowCartPreview(false);
      }
    }
  };

  const handleRemoveFromCart = (itemIndex, itemName) => {
    if (window.confirm(`Voulez-vous retirer "${itemName}" de votre panier ?`)) {
      const updatedCartItems = cartItems.filter((_, index) => index !== itemIndex);
      setCartItems(updatedCartItems);
      if (updatedCartItems.length === 0) {
        setShowCartPreview(false);
      }
      
      // Afficher un message de confirmation
      const messageDiv = document.createElement('div');
      messageDiv.className = 'alert alert-success position-fixed';
      messageDiv.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border: none;
        border-radius: 8px;
        padding: 12px 16px;
        font-size: 14px;
        animation: slideInRight 0.3s ease-out;
      `;
      messageDiv.innerHTML = `
        <div class="d-flex align-items-center">
          <i class="bi bi-check-circle-fill text-success me-2"></i>
          <span>Ce produit a été retiré de votre panier</span>
        </div>
      `;
      
      // Ajouter l'animation CSS
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(messageDiv);
      
      // Supprimer le message après 3 secondes
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.parentNode.removeChild(messageDiv);
        }
      }, 3000);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
    }

    return stars;
  };

  const mockPhotoReviews = [
    {
      user: 'Sophie L.',
      rating: 5,
      date: '2024-01-20',
      text: 'Superbes chaussures, très confortables et stylées !',
      photos: ['/assets/categorie/arriver (1).png', '/assets/categorie/arriver (2).png']
    },
    {
      user: 'Amadou D.',
      rating: 4,
      date: '2024-01-18',
      text: 'Bonne qualité, taille un peu grand. Livraison rapide.',
      photos: ['/assets/categorie/arriver (3).png']
    }
  ];
  const entretienConseils = [
    'Nettoyez vos chaussures avec un chiffon doux et humide.',
    'Évitez l\'exposition prolongée au soleil pour préserver les couleurs.',
    'Rangez vos accessoires dans un endroit sec.',
    'Pour les vêtements, privilégiez un lavage à basse température.'
  ];

  return (
    <div className="container-fluid py-4">
      <style>
        {`
          .product-card {
            transition: box-shadow 0.3s, transform 0.3s;
          }
          .product-card:hover {
            box-shadow: 0 8px 32px rgba(0,0,0,0.18);
            transform: translateY(-6px) scale(1.03);
            z-index: 2;
          }
          .hover-primary:hover {
            color: #007bff !important;
          }
        `}
      </style>
      {/* Breadcrumbs dynamiques Amazon-style */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          {getBreadcrumbs().map((crumb, index) => (
            <li key={index} className={`breadcrumb-item ${index === getBreadcrumbs().length - 1 ? 'active' : ''}`}>
              {index === getBreadcrumbs().length - 1 ? (
                <span className="text-dark fw-bold">
                  <i className={`${crumb.icon} me-1`}></i>
                  {crumb.name}
                </span>
              ) : (
                <Link to={crumb.path} className="text-decoration-none text-muted hover-primary">
                  <i className={`${crumb.icon} me-1`}></i>
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Boutons retour contextuels - Amazon-style */}
      {location.state?.fromCatalogue && (
        <div className="mb-3">
          <Link 
            to="/catalogue" 
            className="btn btn-outline-secondary btn-sm"
            style={{ fontSize: '14px' }}
          >
            <i className="bi bi-arrow-left me-1"></i>
            ← Retour aux résultats de recherche
          </Link>
        </div>
      )}
      
      {location.state?.fromHome && (
        <div className="mb-3">
          <Link 
            to="/" 
            className="btn btn-outline-secondary btn-sm"
            style={{ fontSize: '14px' }}
          >
            <i className="bi bi-arrow-left me-1"></i>
            ← Retour à la page d'accueil
          </Link>
        </div>
      )}

      <div className="row">
        {/* Galerie d'images avancée - Amazon-style */}
        <div className="col-lg-6">
          <div className="product-images">
            {/* Image principale avec zoom */}
            <div className="main-image mb-3 position-relative">
              <div 
                className="image-container"
                onMouseEnter={() => setShowImageZoom(true)}
                onMouseLeave={() => setShowImageZoom(false)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomPosition({ x, y });
                }}
                style={{ cursor: 'zoom-in' }}
              >
                <img 
                  src={product.images[selectedImageIndex]} 
                  alt={product.name}
                  className="img-fluid border rounded"
                  style={{ 
                    maxHeight: '500px', 
                    width: '100%',
                    objectFit: 'contain'
                  }}
                />
                
                {/* Zoom overlay */}
                {showImageZoom && (
                  <div 
                    className="zoom-overlay position-absolute"
                    style={{
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: `url(${product.images[selectedImageIndex]})`,
                      backgroundSize: '300%',
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      pointerEvents: 'none',
                      zIndex: 10
                    }}
                  />
                )}
              </div>
              
              {/* Badge vidéo si disponible */}
              <div className="position-absolute top-0 end-0 m-2">
                <button className="btn btn-light btn-sm rounded-circle">
                  <i className="bi bi-play-fill"></i>
                </button>
              </div>
            </div>

            {/* Miniatures avec navigation */}
            <div className="thumbnail-images mb-3">
              <div className="d-flex gap-2 overflow-auto">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`thumbnail-item ${selectedImageIndex === index ? 'selected' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                    style={{ 
                      cursor: 'pointer',
                      border: selectedImageIndex === index ? '2px solid #007bff' : '1px solid #dee2e6',
                      borderRadius: '4px',
                      padding: '2px'
                    }}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - Vue ${index + 1}`}
                      className="img-fluid"
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        objectFit: 'cover',
                        borderRadius: '2px'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Boutons de navigation des images */}
            <div className="image-navigation d-flex justify-content-between align-items-center">
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                disabled={selectedImageIndex === 0}
              >
                <i className="bi bi-chevron-left"></i> Précédent
              </button>
              <span className="text-muted">
                {selectedImageIndex + 1} sur {product.images.length}
              </span>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSelectedImageIndex(Math.min(product.images.length - 1, selectedImageIndex + 1))}
                disabled={selectedImageIndex === product.images.length - 1}
              >
                Suivant <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>


        {/* Informations du produit - Amazon-style */}
        <div className="col-lg-6">
          <div className="product-info">
            {/* Titre et marque */}
            <h1 className="h2 mb-2">{product.name}</h1>
            <p className="text-muted mb-2">
              Marque: <a href="#" className="text-decoration-none text-primary">{product.brand}</a>
            </p>

            {/* Avis et notation */}
            <div className="d-flex align-items-center mb-3">
              <div className="d-flex me-2">
                {renderStars(product.rating)}
              </div>
              <a href="#reviews" className="text-decoration-none me-2 text-primary">
                {product.rating} sur 5
              </a>
              <span className="text-muted">({product.reviewCount.toLocaleString()} avis)</span>
              <span className="text-muted ms-2">•</span>
              <a href="#questions" className="text-decoration-none text-primary ms-2">
                {Math.floor(product.reviewCount * 0.3)} questions posées
              </a>
            </div>

            {/* Prix et promotions */}
            <div className="price-section mb-3">
              <div className="d-flex align-items-center flex-wrap">
                <span className="h3 text-danger me-2">€{product.price}</span>
                <span className="text-muted text-decoration-line-through me-2">€{product.originalPrice}</span>
                <span className="badge bg-danger me-2">{product.discount}% de réduction</span>
                <span className="badge bg-success">Économisez €{(product.originalPrice - product.price).toFixed(2)}</span>
              </div>
              <div className="mt-2">
                <small className="text-success">
                  <i className="bi bi-truck me-1"></i>
                  Livraison GRATUITE
                </small>
                <small className="text-muted ms-3">
                  <i className="bi bi-arrow-return-left me-1"></i>
                  Retours gratuits
                </small>
              </div>
            </div>

            {/* Disponibilité et livraison Amazon-style */}
            <div className="delivery-info mb-3">
              <div className="alert alert-light border">
                <div className="d-flex align-items-start">
                  <i className="bi bi-truck text-success me-2 mt-1"></i>
                  <div>
                    <strong className="text-success">{product.availability}</strong><br />
                    <span className="text-muted">{product.deliveryDate}</span><br />
                    <small className="text-primary">
                      <i className="bi bi-clock me-1"></i>
                      Commandez dans les 2h pour une livraison demain
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendeur et garantie */}
            <div className="seller-warranty mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    Vendu par: <a href="#" className="text-decoration-none text-primary">{product.seller}</a>
                    {product.isPrime && <span className="badge bg-warning ms-2">Prime</span>}
                  </small>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-shield-check text-success me-1"></i>
                  <small className="text-success">Garantie 2 ans</small>
                </div>
              </div>
            </div>



            {/* Sélection de couleur - Amazon-style */}
            <div className="color-selection mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label fw-bold mb-0">{t('color')}:</label>
                <small className="text-muted">Sélectionnez une couleur</small>
              </div>
              <div className="d-flex gap-2">
                {product.colors.map((color) => (
                  <div 
                    key={color.name}
                    className={`color-option ${selectedColor === color.name ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color.name)}
                    style={{ 
                      cursor: 'pointer',
                      border: selectedColor === color.name ? '3px solid #007bff' : '2px solid #dee2e6',
                      borderRadius: '8px',
                      padding: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img 
                      src={color.image} 
                      alt={color.name}
                      className="mb-2"
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                    <div className="text-center">
                      <small className="fw-bold">{color.name}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sélection de taille - Amazon-style */}
            <div className="size-selection mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label fw-bold mb-0">{t('size')}:</label>
                <div className="d-flex align-items-center">
                  <small className="text-muted me-2">Guide des tailles</small>
                  <a href="#" className="text-decoration-none text-primary">
                    <i className="bi bi-rulers"></i>
                  </a>
                </div>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`btn ${selectedSize === size ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setSelectedSize(size)}
                    style={{ 
                      minWidth: '60px',
                      height: '40px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Livraison gratuite et retours gratuits pour les tailles
                </small>
              </div>
            </div>

            {/* Quantité - Amazon-style */}
            <div className="quantity-selection mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label fw-bold mb-0">{t('quantity')}:</label>
                <small className="text-muted">En stock</small>
              </div>
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  style={{ width: '40px', height: '40px' }}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  min="1"
                  max="10"
                  className="form-control mx-2"
                  style={{ 
                    width: '80px', 
                    textAlign: 'center',
                    height: '40px',
                    fontSize: '16px'
                  }}
                />
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                  style={{ width: '40px', height: '40px' }}
                >
                  +
                </button>
              </div>
              <div className="mt-2">
                <small className="text-success">
                  <i className="bi bi-check-circle me-1"></i>
                  {quantity} article{quantity > 1 ? 's' : ''} en stock
                </small>
              </div>
            </div>

            {/* Boutons d'action - Amazon-style */}
            <div className="action-buttons mb-4">
              <button 
                className="btn btn-warning btn-lg w-100 mb-3"
                onClick={handleAddToCart}
                style={{ 
                  height: '50px',
                  fontSize: '18px',
                  fontWeight: '600',
                  backgroundColor: '#ffd814',
                  borderColor: '#fcd200',
                  color: '#000'
                }}
              >
                <i className="bi bi-cart-plus me-2"></i>
                {t('add_to_cart')}
              </button>
              <button 
                className="btn btn-danger btn-lg w-100 mb-3"
                onClick={handleBuyNow}
                style={{ 
                  height: '50px',
                  fontSize: '18px',
                  fontWeight: '600',
                  backgroundColor: '#ff6b35',
                  borderColor: '#ff6b35'
                }}
              >
                <i className="bi bi-lightning me-2"></i>
                {t('buy_now')}
              </button>
              
              {/* Boutons secondaires */}
              <div className="d-flex gap-2 mb-3">
                <button className="btn btn-outline-secondary flex-fill" style={{ height: '40px' }}>
                  <i className="bi bi-heart me-1"></i>
                  {t('add_to_wishlist')}
                </button>
                <button className="btn btn-outline-secondary flex-fill" style={{ height: '40px' }}>
                  <i className="bi bi-share me-1"></i>
                  {t('share')}
                </button>
              </div>

              {/* Sécurité et garantie */}
              <div className="security-info p-3 border rounded bg-light">
                <div className="row text-center">
                  <div className="col-4">
                    <i className="bi bi-shield-check text-success mb-1" style={{ fontSize: '24px' }}></i>
                    <div><small className="fw-bold">Garantie 2 ans</small></div>
                  </div>
                  <div className="col-4">
                    <i className="bi bi-arrow-return-left text-primary mb-1" style={{ fontSize: '24px' }}></i>
                    <div><small className="fw-bold">Retours gratuits</small></div>
                  </div>
                  <div className="col-4">
                    <i className="bi bi-truck text-success mb-1" style={{ fontSize: '24px' }}></i>
                    <div><small className="fw-bold">Livraison gratuite</small></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations de livraison détaillées - Amazon-style */}
            <div className="delivery-details mb-4">
              <div className="card border-0 bg-light">
                <div className="card-body">
                  <h6 className="card-title mb-3">
                    <i className="bi bi-truck me-2 text-primary"></i>
                    Options de livraison
                  </h6>
                  
                  <div className="delivery-options">
                    <div className="delivery-option d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                      <div>
                        <strong className="text-success">Livraison GRATUITE</strong>
                        <div className="text-muted">Demain, 15 janvier</div>
                        <small className="text-primary">Commandez dans les 2h</small>
                      </div>
                      <span className="badge bg-success">Prime</span>
                    </div>
                    
                    <div className="delivery-option d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                      <div>
                        <strong>Livraison standard</strong>
                        <div className="text-muted">16-18 janvier</div>
                        <small className="text-muted">€4.99</small>
                      </div>
                      <span className="badge bg-secondary">Standard</span>
                    </div>
                    
                    <div className="delivery-option d-flex justify-content-between align-items-center p-2 border rounded">
                      <div>
                        <strong>Livraison express</strong>
                        <div className="text-muted">Aujourd'hui, 14 janvier</div>
                        <small className="text-muted">€9.99</small>
                      </div>
                      <span className="badge bg-warning">Express</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <small className="text-muted">
                      <i className="bi bi-map-pin me-1"></i>
                      Livraison à Paris, France
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Protection acheteur - Amazon-style */}
            <div className="buyer-protection mb-4">
              <div className="card border-0 bg-light">
                <div className="card-body">
                  <h6 className="card-title mb-3">
                    <i className="bi bi-shield-check me-2 text-success"></i>
                    Protection acheteur
                  </h6>
                  
                  <div className="protection-features">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      <small>Garantie constructeur 2 ans</small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      <small>Retours gratuits sous 30 jours</small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      <small>Assurance livraison incluse</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      <small>Support client 24/7</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aperçu des avis - Amazon-style */}
      <div className="row mt-5">
        <div className="col">
          <div className="reviews-preview card border-0 shadow-sm">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="reviews-summary text-center">
                    <h4 className="text-warning mb-2">{product.rating}/5</h4>
                    <div className="stars mb-2">
                      {renderStars(product.rating)}
                    </div>
                    <p className="text-muted mb-3">
                      Basé sur {product.reviewCount.toLocaleString()} avis
                    </p>
                    
                    {/* Barres de progression des étoiles */}
                    <div className="rating-bars">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const percentage = Math.floor(Math.random() * 40) + 20; // Simulation
                        return (
                          <div key={stars} className="d-flex align-items-center mb-1">
                            <small className="me-2">{stars}★</small>
                            <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                              <div 
                                className="progress-bar bg-warning" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <small className="text-muted">{percentage}%</small>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="col-md-8">
                  <div className="reviews-filters">
                    <h5 className="mb-3">Avis clients</h5>
                    
                    {/* Filtres rapides */}
                    <div className="filter-buttons mb-3">
                      <button className="btn btn-outline-primary btn-sm me-2 mb-2">
                        <i className="bi bi-star-fill me-1"></i>
                        Tous les avis
                      </button>
                      <button className="btn btn-outline-secondary btn-sm me-2 mb-2">
                        <i className="bi bi-star-fill me-1"></i>
                        5 étoiles
                      </button>
                      <button className="btn btn-outline-secondary btn-sm me-2 mb-2">
                        <i className="bi bi-star-fill me-1"></i>
                        4 étoiles
                      </button>
                      <button className="btn btn-outline-secondary btn-sm me-2 mb-2">
                        <i className="bi bi-star-fill me-1"></i>
                        3 étoiles
                      </button>
                      <button className="btn btn-outline-secondary btn-sm me-2 mb-2">
                        <i className="bi bi-image me-1"></i>
                        Avec photos
                      </button>
                      <button className="btn btn-outline-secondary btn-sm me-2 mb-2">
                        <i className="bi bi-check-circle me-1"></i>
                        Avis vérifiés
                      </button>
                    </div>

                    {/* Tri */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <small className="text-muted">
                        Affichage de 1-3 sur {product.reviewCount} avis
                      </small>
                      <select className="form-select form-select-sm" style={{ width: 'auto' }}>
                        <option>Trier par : Pertinence</option>
                        <option>Plus récents</option>
                        <option>Plus anciens</option>
                        <option>Note la plus haute</option>
                        <option>Note la plus basse</option>
                      </select>
                    </div>

                    {/* Avis récents */}
                    <div className="recent-reviews">
                      <div className="review-item border-bottom pb-3 mb-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <strong>Thomas M.</strong>
                            <div className="d-flex align-items-center mt-1">
                              {renderStars(5)}
                              <small className="text-muted ms-2">Avis vérifié</small>
                            </div>
                          </div>
                          <small className="text-muted">Il y a 2 jours</small>
                        </div>
                        <h6 className="mb-2">Excellent confort et qualité</h6>
                        <p className="mb-2">
                          Ces chaussures sont vraiment confortables. J'ai fait plusieurs courses avec et elles tiennent parfaitement. 
                          La qualité est au rendez-vous et elles sont très légères.
                        </p>
                        <div className="review-images d-flex gap-2">
                          <img 
                            src="/assets/categorie/arriver (1).png" 
                            alt="Photo avis"
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                          <img 
                            src="/assets/categorie/arriver (2).png" 
                            alt="Photo avis"
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        </div>
                      </div>

                      <div className="review-item border-bottom pb-3 mb-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <strong>Marie L.</strong>
                            <div className="d-flex align-items-center mt-1">
                              {renderStars(4)}
                              <small className="text-muted ms-2">Avis vérifié</small>
                            </div>
                          </div>
                          <small className="text-muted">Il y a 1 semaine</small>
                        </div>
                        <h6 className="mb-2">Très satisfaite</h6>
                        <p className="mb-2">
                          Belle chaussure, confortable pour la course. Le design est moderne et la livraison était rapide.
                          Je recommande !
                        </p>
                      </div>

                      <div className="review-item pb-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <strong>Pierre D.</strong>
                            <div className="d-flex align-items-center mt-1">
                              {renderStars(5)}
                              <small className="text-muted ms-2">Avis vérifié</small>
                            </div>
                          </div>
                          <small className="text-muted">Il y a 2 semaines</small>
                        </div>
                        <h6 className="mb-2">Parfait pour le sport</h6>
                        <p className="mb-2">
                          Utilise ces chaussures pour la musculation et la course. Très bon amorti et respirabilité excellente.
                          Prix correct pour la qualité.
                        </p>
                      </div>
                    </div>

                    {/* Bouton voir tous les avis */}
                    <div className="text-center mt-4">
                      <button className="btn btn-outline-primary">
                        Voir tous les {product.reviewCount.toLocaleString()} avis
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets détaillés - Amazon-style */}
      <div className="row mt-5">
        <div className="col">
          <ul className="nav nav-tabs" id="productTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                <i className="bi bi-file-text me-1"></i>
                {t('description')}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'specifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('specifications')}
              >
                <i className="bi bi-list-check me-1"></i>
                {t('specifications')}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                <i className="bi bi-star me-1"></i>
                {t('reviews')} ({product.reviewCount})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'questions' ? 'active' : ''}`}
                onClick={() => setActiveTab('questions')}
              >
                <i className="bi bi-question-circle me-1"></i>
                {t('questions_answers')}
              </button>
            </li>
          </ul>

          <div className="tab-content p-3 border border-top-0">
            {activeTab === 'description' && (
              <div>
                <h4 className="mb-4">
                  <i className="bi bi-file-text me-2 text-primary"></i>
                  {t('product_description')}
                </h4>
                
                <div className="row">
                  <div className="col-md-8">
                    <p className="lead mb-4">{product.description}</p>
                    
                    <h5 className="mb-3">
                      <i className="bi bi-star me-2 text-warning"></i>
                      {t('key_features')}
                    </h5>
                    <ul className="list-unstyled">
                      {product.features.map((feature, index) => (
                        <li key={index} className="mb-2">
                          <i className="bi bi-check-circle text-success me-2"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <h5 className="mt-4 mb-3">
                      <i className="bi bi-info-circle me-2 text-info"></i>
                      Informations importantes
                    </h5>
                    <div className="alert alert-info">
                      <ul className="mb-0">
                        <li>Livraison gratuite pour les commandes supérieures à €25</li>
                        <li>Retours gratuits sous 30 jours</li>
                        <li>Garantie constructeur 2 ans</li>
                        <li>Support client disponible 24/7</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="card-title">
                          <i className="bi bi-award me-2 text-warning"></i>
                          Certifications
                        </h6>
                        <ul className="list-unstyled">
                          <li className="mb-2">
                            <i className="bi bi-check text-success me-2"></i>
                            ISO 9001
                          </li>
                          <li className="mb-2">
                            <i className="bi bi-check text-success me-2"></i>
                            Certifié écologique
                          </li>
                          <li className="mb-2">
                            <i className="bi bi-check text-success me-2"></i>
                            Testé en laboratoire
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <h5 className="mb-3"><i className="bi bi-stars me-2 text-primary"></i>Complétez votre look</h5>
                  <div className="row">
                    {completeYourLook.map((item) => (
                      <div key={item.id} className="col-md-4 mb-3">
                        <div className="card h-100 shadow-sm">
                          <img src={item.image} alt={item.name} className="card-img-top" style={{ height: 100, objectFit: 'cover' }} />
                          <div className="card-body">
                            <h6 className="card-title mb-2">{item.name}</h6>
                            <div className="fw-bold text-danger mb-2">€{item.price}</div>
                            <div className="d-flex gap-2">
                              <button className="btn btn-outline-primary btn-sm flex-fill"><i className="bi bi-eye me-1"></i>Voir</button>
                              <button className="btn btn-warning btn-sm flex-fill"><i className="bi bi-cart-plus me-1"></i>Ajouter</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {activeTab === 'description' && isAccessory && (
                  <div className="mt-4">
                    <div className="card bg-light border-0 mb-3">
                      <div className="card-body">
                        <h6 className="mb-3"><i className="bi bi-pencil me-2 text-primary"></i>Personnalisez votre accessoire</h6>
                        <div className="mb-3">
                          <label className="form-label">Gravure (prénom, mot, etc.)</label>
                          <input type="text" className="form-control" value={engraving} onChange={e => setEngraving(e.target.value)} maxLength={20} placeholder="Ex : Prénom, message..." />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Couleur du lacet</label>
                          <div className="d-flex gap-2">
                            {laceColors.map(color => (
                              <button key={color} className={`btn btn-sm ${selectedLaceColor === color ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setSelectedLaceColor(color)}>{color.charAt(0).toUpperCase() + color.slice(1)}</button>
                            ))}
                          </div>
                        </div>
                        <div className="alert alert-info mt-3">
                          <strong>Prévisualisation :</strong> {engraving ? `"${engraving}"` : 'Aucune gravure'} | Couleur lacet : {selectedLaceColor}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div>
                <h4 className="mb-4">
                  <i className="bi bi-list-check me-2 text-primary"></i>
                  {t('technical_specifications')}
                </h4>
                
                <div className="row">
                  <div className="col-md-8">
                    <div className="card">
                      <div className="card-body">
                        <h6 className="card-title mb-3">Caractéristiques techniques</h6>
                        <div className="table-responsive">
                          <table className="table table-striped">
                            <tbody>
                              {Object.entries(product.specifications).map(([key, value]) => (
                                <tr key={key}>
                                  <td className="fw-bold">{key}</td>
                                  <td>{value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="card-title">
                          <i className="bi bi-rulers me-2 text-primary"></i>
                          Guide des tailles
                        </h6>
                        <p className="small text-muted">
                          Utilisez notre guide interactif pour trouver votre taille parfaite.
                        </p>
                        <button className="btn btn-outline-primary btn-sm">
                          <i className="bi bi-rulers me-1"></i>
                          Guide des tailles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4>
                    <i className="bi bi-star me-2 text-warning"></i>
                    {t('customer_reviews')}
                  </h4>
                  <button className="btn btn-outline-primary">
                    <i className="bi bi-pencil me-1"></i>
                    {t('write_review')}
                  </button>
                </div>
                
                {/* Résumé des avis */}
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-3 text-center">
                        <h3 className="text-warning mb-0">{product.rating}/5</h3>
                        <div className="mb-2">{renderStars(product.rating)}</div>
                        <small className="text-muted">{product.reviewCount} avis</small>
                      </div>
                      <div className="col-md-9">
                        <div className="rating-bars">
                          {[5, 4, 3, 2, 1].map((stars) => {
                            const percentage = Math.floor(Math.random() * 40) + 20;
                            return (
                              <div key={stars} className="d-flex align-items-center mb-1">
                                <small className="me-2" style={{ width: '30px' }}>{stars}★</small>
                                <div className="progress flex-grow-1 me-2" style={{ height: '12px' }}>
                                  <div 
                                    className="progress-bar bg-warning" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <small className="text-muted" style={{ width: '40px' }}>{percentage}%</small>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Avis détaillés */}
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <div>
                        <strong>Jean D.</strong>
                        <div className="d-flex align-items-center mt-1">
                          {renderStars(5)}
                          <small className="text-muted ms-2">Avis vérifié</small>
                          <span className="badge bg-success ms-2">Achat vérifié</span>
                        </div>
                      </div>
                      <small className="text-muted">2024-01-15</small>
                    </div>
                    <h6>Excellent confort</h6>
                    <p className="mb-2">Très confortables pour la course, je recommande ! L'amorti est parfait et elles sont très légères.</p>
                    <div className="d-flex gap-2">
                      <img 
                        src="/assets/categorie/arriver (1).png" 
                        alt="Photo avis"
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <div>
                        <strong>Marie L.</strong>
                        <div className="d-flex align-items-center mt-1">
                          {renderStars(4)}
                          <small className="text-muted ms-2">Avis vérifié</small>
                        </div>
                      </div>
                      <small className="text-muted">2024-01-10</small>
                    </div>
                    <h6>Belles chaussures</h6>
                    <p className="mb-0">Design moderne et confortable, parfait pour le sport. La livraison était rapide.</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h5 className="mb-3"><i className="bi bi-images me-2 text-primary"></i>Photos des clients</h5>
                  <div className="row">
                    {mockPhotoReviews.map((review, idx) => (
                      <div key={idx} className="col-md-6 mb-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-2">
                              <strong>{review.user}</strong>
                              <span className="ms-2">{renderStars(review.rating)}</span>
                              <small className="text-muted ms-2">{review.date}</small>
                            </div>
                            <p className="mb-2">{review.text}</p>
                            <div className="d-flex gap-2">
                              {review.photos.map((photo, i) => (
                                <img key={i} src={photo} alt="Avis client" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="card bg-light border-0">
                    <div className="card-body">
                      <h6 className="mb-2"><i className="bi bi-lightbulb me-2 text-warning"></i>Conseils d'entretien & Astuces mode</h6>
                      <ul className="mb-0">
                        {entretienConseils.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'questions' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4>
                    <i className="bi bi-question-circle me-2 text-primary"></i>
                    {t('questions_answers')}
                  </h4>
                  <button className="btn btn-outline-primary">
                    <i className="bi bi-plus-circle me-1"></i>
                    {t('ask_question')}
                  </button>
                </div>
                
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="text-primary mb-0">Ces chaussures sont-elles adaptées pour la course sur route ?</h6>
                      <span className="badge bg-success">Répondu</span>
                    </div>
                    <p className="mb-2">Oui, ces chaussures sont parfaitement adaptées pour la course sur route grâce à leur amorti optimal et leur semelle en caoutchouc durable.</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">Répondu le 2024-01-12</small>
                      <div>
                        <button className="btn btn-link btn-sm text-muted">
                          <i className="bi bi-hand-thumbs-up me-1"></i>
                          Utile (12)
                        </button>
                        <button className="btn btn-link btn-sm text-muted">
                          <i className="bi bi-hand-thumbs-down me-1"></i>
                          Pas utile (2)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="text-primary mb-0">Quelle est la différence entre ce modèle et l'ancien ?</h6>
                      <span className="badge bg-success">Répondu</span>
                    </div>
                    <p className="mb-2">Ce nouveau modèle offre un amorti amélioré de 15% et une respirabilité accrue grâce à la technologie de mesh avancée.</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">Répondu le 2024-01-08</small>
                      <div>
                        <button className="btn btn-link btn-sm text-muted">
                          <i className="bi bi-hand-thumbs-up me-1"></i>
                          Utile (8)
                        </button>
                        <button className="btn btn-link btn-sm text-muted">
                          <i className="bi bi-hand-thumbs-down me-1"></i>
                          Pas utile (1)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Produits similaires */}
      <div className="row mt-5">
        <div className="col">
          <h4 className="mb-4">
            <i className="bi bi-arrow-repeat me-2 text-primary"></i>
            {t('similar_products')}
          </h4>
          <div className="row">
            {similarProducts.map((product) => (
              <div key={product.id} className="col-md-3 col-sm-6 mb-3">
                <div className="card h-100 shadow-sm">
                  <div className="position-relative">
                    <img src={product.image} className="card-img-top" alt={product.name} />
                    <div className="position-absolute top-0 end-0 m-2">
                      <button className="btn btn-light btn-sm rounded-circle">
                        <i className="bi bi-heart"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h6 className="card-title">{product.name}</h6>
                    <div className="d-flex align-items-center mb-2">
                      {renderStars(product.rating)}
                      <small className="text-muted ms-1">({product.rating})</small>
                    </div>
                    <p className="card-text fw-bold text-danger mb-2">€{product.price}</p>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-primary btn-sm flex-fill">
                        <i className="bi bi-eye me-1"></i>
                        {t('view_product')}
                      </button>
                      <button className="btn btn-warning btn-sm">
                        <i className="bi bi-cart-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Produits fréquemment achetés ensemble */}
      <div className="row mt-5">
        <div className="col">
          <h4 className="mb-4">
            <i className="bi bi-bag-plus me-2 text-success"></i>
            {t('frequently_bought_together')}
          </h4>
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center">
                    <div className="position-relative me-3">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <span className="position-absolute top-0 start-0 bg-primary text-white rounded-circle" 
                            style={{ width: '24px', height: '24px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        1
                      </span>
                    </div>
                    <span className="me-3 text-muted">+</span>
                    {frequentlyBoughtTogether.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <div className="position-relative me-2">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                          />
                          <span className="position-absolute top-0 start-0 bg-success text-white rounded-circle" 
                                style={{ width: '20px', height: '20px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {index + 2}
                          </span>
                        </div>
                        {index < frequentlyBoughtTogether.length - 1 && <span className="me-2 text-muted">+</span>}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="mt-2">
                    <small className="text-muted">
                      Les clients achètent souvent ces articles ensemble
                    </small>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <div className="mb-2">
                    <span className="text-decoration-line-through text-muted me-2">
                      €{(product.price + frequentlyBoughtTogether.reduce((sum, item) => sum + item.price, 0)).toFixed(2)}
                    </span>
                    <span className="fw-bold text-danger fs-5">
                      €{(product.price + frequentlyBoughtTogether.reduce((sum, item) => sum + item.price, 0) - 15).toFixed(2)}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="badge bg-success">Économisez €15.00</span>
                  </div>
                  <button className="btn btn-warning btn-lg w-100">
                    <i className="bi bi-cart-plus me-2"></i>
                    {t('add_all_to_cart')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section "Produits similaires" - Amazon-style */}
      <div className="row mt-5">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">
              <i className="bi bi-arrow-repeat me-2 text-primary"></i>
              Produits similaires
            </h4>
            <Link to="/catalogue" className="text-decoration-none text-primary">
              Voir tous les produits similaires <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="row">
            {[
              { id: 7, name: "Nike Air Zoom", price: 139.99, originalPrice: 159.99, image: "/assets/categorie/arriver (3).png", rating: 4.2, reviews: 456, isPrime: true, isNew: false },
              { id: 8, name: "Adidas Cloudfoam", price: 89.99, originalPrice: 109.99, image: "/assets/categorie/arriver (4).png", rating: 4.0, reviews: 234, isPrime: false, isNew: true },
              { id: 9, name: "Puma Ignite", price: 109.99, originalPrice: 129.99, image: "/assets/categorie/arriver (1).png", rating: 4.3, reviews: 789, isPrime: true, isNew: false },
              { id: 10, name: "Asics Gel-Nimbus", price: 159.99, originalPrice: 179.99, image: "/assets/categorie/arriver (2).png", rating: 4.6, reviews: 1234, isPrime: true, isNew: false }
            ].map((product) => (
              <div key={product.id} className="col-md-3 col-sm-6 mb-3">
                <div className="card h-100 shadow-sm product-card">
                  <div className="position-relative">
                    <Link to={`/product/${product.id}`} state={{ fromCatalogue: true }}>
                      <img src={product.image} className="card-img-top" alt={product.name} style={{ height: 200, objectFit: 'cover' }} />
                    </Link>
                    {product.isPrime && <span className="badge bg-warning position-absolute top-0 start-0 m-2">Prime</span>}
                    {product.isNew && <span className="badge bg-info position-absolute top-0 end-0 m-2">Nouveau</span>}
                    <div className="position-absolute top-0 end-0 m-2">
                      <button className="btn btn-light btn-sm rounded-circle">
                        <i className="bi bi-heart"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <Link to={`/product/${product.id}`} state={{ fromCatalogue: true }} className="text-decoration-none">
                      <h6 className="card-title text-dark">{product.name}</h6>
                    </Link>
                    <div className="d-flex align-items-center mb-2">
                      {renderStars(product.rating)}
                      <small className="text-muted ms-1">({product.reviews})</small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <span className="fw-bold text-danger me-2">€{product.price}</span>
                      <span className="text-muted text-decoration-line-through">€{product.originalPrice}</span>
                    </div>
                    <div className="d-flex gap-2">
                      <Link to={`/product/${product.id}`} state={{ fromCatalogue: true }} className="btn btn-outline-primary btn-sm flex-fill">
                        <i className="bi bi-eye me-1"></i>
                        Voir
                      </Link>
                      <button className="btn btn-warning btn-sm">
                        <i className="bi bi-cart-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section "Les clients ont aussi regardé" - Amazon-style */}
      <div className="row mt-5">
        <div className="col">
          <h4 className="mb-4">
            <i className="bi bi-eye me-2 text-info"></i>
            Les clients ont aussi regardé
          </h4>
          <div className="row">
            {[
              { id: 11, name: "Nike Air Force 1", price: 99.99, image: "/assets/categorie/arriver (2).png", rating: 4.4 },
              { id: 12, name: "Adidas Stan Smith", price: 79.99, image: "/assets/categorie/arriver (3).png", rating: 4.1 },
              { id: 13, name: "Converse Chuck Taylor", price: 59.99, image: "/assets/categorie/arriver (4).png", rating: 4.3 },
              { id: 14, name: "Vans Old Skool", price: 69.99, image: "/assets/categorie/arriver (1).png", rating: 4.2 }
            ].map((product) => (
              <div key={product.id} className="col-md-3 col-sm-6 mb-3">
                <div className="card h-100 shadow-sm product-card">
                  <div className="position-relative">
                    <Link to={`/product/${product.id}`} state={{ fromCatalogue: true }}>
                      <img src={product.image} className="card-img-top" alt={product.name} style={{ height: 200, objectFit: 'cover' }} />
                    </Link>
                    <div className="position-absolute top-0 end-0 m-2">
                      <button className="btn btn-light btn-sm rounded-circle">
                        <i className="bi bi-heart"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <Link to={`/product/${product.id}`} state={{ fromCatalogue: true }} className="text-decoration-none">
                      <h6 className="card-title text-dark">{product.name}</h6>
                    </Link>
                    <div className="d-flex align-items-center mb-2">
                      {renderStars(product.rating)}
                      <small className="text-muted ms-1">({product.rating})</small>
                    </div>
                    <p className="card-text fw-bold text-danger mb-2">€{product.price}</p>
                    <div className="d-flex gap-2">
                      <Link to={`/product/${product.id}`} state={{ fromCatalogue: true }} className="btn btn-outline-primary btn-sm flex-fill">
                        <i className="bi bi-eye me-1"></i>
                        Voir
                      </Link>
                      <button className="btn btn-warning btn-sm">
                        <i className="bi bi-cart-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aperçu du panier */}
      {showCartPreview && (
        <div className="cart-preview position-fixed top-0 end-0 h-100 bg-white border-start shadow-lg" 
             style={{ width: '400px', zIndex: 1050, overflowY: 'auto' }}>
          <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{t('cart_preview')}</h5>
              <button className="btn btn-link" onClick={() => setShowCartPreview(false)}>
                ×
              </button>
            </div>
            
            <div className="cart-items mb-3">
              {cartItems.map((item, index) => (
                <div key={index} className="d-flex align-items-center mb-2 p-2 border rounded position-relative">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="me-2"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <small className="fw-bold">{item.name}</small>
                    <div className="text-muted">
                      <small>{t('size')}: {item.size} | {t('color')}: {item.color}</small>
                    </div>
                    <small>€{item.price}</small>
                  </div>
                  <div className="d-flex align-items-center me-2">
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleCartItemQuantityChange(index, item.quantity - 1)}
                      style={{ width: '30px', height: '30px', padding: 0, fontSize: '12px' }}
                    >
                      -
                    </button>
                    <span className="mx-2" style={{ minWidth: '20px', textAlign: 'center', fontSize: '14px' }}>
                      {item.quantity}
                    </span>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleCartItemQuantityChange(index, item.quantity + 1)}
                      style={{ width: '30px', height: '30px', padding: 0, fontSize: '12px' }}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="btn btn-link text-muted p-0"
                    onClick={() => handleRemoveFromCart(index, item.name)}
                    style={{ fontSize: '16px', lineHeight: 1 }}
                    title="Supprimer du panier"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-summary border-top pt-3">
              <div className="d-flex justify-content-between mb-2">
                <span>{t('subtotal')}:</span>
                <span>€{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>{t('shipping')}:</span>
                <span className="text-success">{t('free')}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold mb-3">
                <span>{t('total')}:</span>
                <span>€{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
              </div>
              
              <button className="btn btn-warning w-100 mb-2">
                {t('proceed_to_checkout')}
              </button>
              <button className="btn btn-outline-secondary w-100">
                {t('view_cart')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail; 