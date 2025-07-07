import React, { useState } from 'react';
import ProductPageAmazonLike from '../components/ProductPageAmazonLike';
import '../amazon-like.css';

const mockCategories = [
  'Cuir', 'Affaire', 'Sac', 'Extensible', 'Sport', 'Voyage', 'Randonnée', 'Business', 'École', 'Week-end'
];
const mockColors = [
  '#000000', '#8B4513', '#FFD700', '#FFFFFF', '#808080', '#0000FF', '#FF0000', '#008000', '#FFA500', '#800080', '#FFC0CB', '#A52A2A'
];
const mockThemes = ['Sportif', 'Animaux', 'Vacances', 'Esthétique', 'Technologie', 'Nature'];
const mockPopularIdeas = [
  { label: 'Sneakers tendance', icon: 'bi bi-lightning' },
  { label: 'Vestes légères', icon: 'bi bi-cloud-sun' },
  { label: 'Accessoires du moment', icon: 'bi bi-bag' },
  { label: 'Nouveautés', icon: 'bi bi-stars' },
  { label: 'Promos', icon: 'bi bi-percent' },
  { label: 'Meilleures ventes', icon: 'bi bi-trophy' }
];
const mockBestSellers = [
  { id: 1, name: 'Nike Air Max 270', price: 129.99, image: '/assets/categorie/arriver (1).png', rating: 4.5 },
  { id: 2, name: 'Adidas Ultraboost 22', price: 149.99, image: '/assets/categorie/arriver (2).png', rating: 4.3 },
  { id: 3, name: 'Puma RS-X', price: 89.99, image: '/assets/categorie/arriver (3).png', rating: 4.1 },
  { id: 4, name: 'New Balance 574', price: 79.99, image: '/assets/categorie/arriver (4).png', rating: 4.4 },
  { id: 5, name: 'Veste légère Nike', price: 59.99, image: '/assets/categorie/arriver (1).png', rating: 4.6 },
  { id: 6, name: 'Sac à dos Adidas', price: 39.99, image: '/assets/categorie/arriver (2).png', rating: 4.2 }
];
const mockCommitments = [
  { icon: 'bi bi-truck', title: 'Livraison rapide', desc: 'Expédition sous 24h' },
  { icon: 'bi bi-arrow-repeat', title: 'Retours gratuits', desc: 'Sous 30 jours' },
  { icon: 'bi bi-shield-lock', title: 'Paiement sécurisé', desc: 'SSL & 3D Secure' },
  { icon: 'bi bi-people', title: 'Service client', desc: '7j/7, 8h-20h' }
];

const mockSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', 'S', 'M', 'L', 'XL'];

// Base de données des produits avec détails complets
const productsDatabase = {
  1: {
    id: 1,
    name: 'Nike Air Max 270',
    brand: 'Nike',
    price: 129.99,
    originalPrice: 159.99,
    discount: 19,
    rating: 4.5,
    reviewCount: 1247,
    availability: 'En stock',
    deliveryDate: 'Livraison gratuite demain',
    seller: 'Nike Store',
    isPrime: true,
    promo: true,
    isNew: true,
    isExclusive: false,
    color: '#000000',
    delivery: 'Demain',
    stock: 8,
    sizes: ['40', '41', '42', '43', '44'],
    description: 'Chaussure running homme, confort et style, idéale pour le sport et la ville.',
    colors: [
      { name: "Noir/Blanc", code: "#000000", image: "/assets/categorie/arriver (1).png" },
      { name: "Bleu Marine", code: "#000080", image: "/assets/categorie/arriver (2).png" },
      { name: "Gris", code: "#808080", image: "/assets/categorie/arriver (3).png" }
    ],
    images: [
      "/assets/categorie/arriver (1).png",
      "/assets/categorie/arriver (2).png",
      "/assets/categorie/arriver (3).png",
      "/assets/categorie/arriver (4).png"
    ],
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
  2: {
    id: 2,
    name: 'Adidas Ultraboost 22',
    brand: 'Adidas',
    price: 149.99,
    originalPrice: 179.99,
    discount: 17,
    rating: 4.3,
    reviewCount: 892,
    availability: 'En stock',
    deliveryDate: 'Livraison gratuite demain',
    seller: 'Adidas Store',
    isPrime: true,
    promo: false,
    isNew: false,
    isExclusive: true,
    color: '#FFFFFF',
    delivery: 'Après-demain',
    stock: 5,
    sizes: ['38', '39', '40', '41', '42', '43'],
    description: 'Performance et amorti maximal, chaussure running nouvelle génération.',
    colors: [
      { name: "Blanc/Noir", code: "#FFFFFF", image: "/assets/categorie/arriver (2).png" },
      { name: "Bleu", code: "#0066CC", image: "/assets/categorie/arriver (3).png" },
      { name: "Rouge", code: "#CC0000", image: "/assets/categorie/arriver (4).png" }
    ],
    images: [
      "/assets/categorie/arriver (2).png",
      "/assets/categorie/arriver (3).png",
      "/assets/categorie/arriver (4).png",
      "/assets/categorie/arriver (1).png"
    ],
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
  3: {
    id: 3,
    name: 'Puma RS-X',
    brand: 'Puma',
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    rating: 4.1,
    reviewCount: 567,
    availability: 'En stock',
    deliveryDate: 'Livraison gratuite demain',
    seller: 'Puma Store',
    isPrime: false,
    promo: true,
    isNew: false,
    isExclusive: false,
    color: '#FF0000',
    delivery: 'Demain',
    stock: 12,
    sizes: ['36', '37', '38', '39', '40', '41'],
    description: 'Sneaker rétro, look urbain, confort moderne pour tous les jours.',
    colors: [
      { name: "Blanc/Gris", code: "#CCCCCC", image: "/assets/categorie/arriver (3).png" },
      { name: "Noir/Rouge", code: "#000000", image: "/assets/categorie/arriver (4).png" },
      { name: "Bleu", code: "#0066CC", image: "/assets/categorie/arriver (1).png" }
    ],
    images: [
      "/assets/categorie/arriver (3).png",
      "/assets/categorie/arriver (4).png",
      "/assets/categorie/arriver (1).png",
      "/assets/categorie/arriver (2).png"
    ],
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
  4: {
    id: 4,
    name: 'New Balance 574',
    brand: 'New Balance',
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    rating: 4.4,
    reviewCount: 1234,
    availability: 'En stock',
    deliveryDate: 'Livraison gratuite demain',
    seller: 'New Balance Store',
    isPrime: true,
    promo: false,
    isNew: true,
    isExclusive: true,
    color: '#008000',
    delivery: 'Après-demain',
    stock: 3,
    sizes: ['42', '43', '44', '45'],
    description: 'Classique intemporel, chaussure lifestyle, confort exceptionnel.',
    colors: [
      { name: "Gris/Blanc", code: "#808080", image: "/assets/categorie/arriver (4).png" },
      { name: "Bleu Marine", code: "#000080", image: "/assets/categorie/arriver (1).png" },
      { name: "Vert", code: "#006600", image: "/assets/categorie/arriver (2).png" }
    ],
    images: [
      "/assets/categorie/arriver (4).png",
      "/assets/categorie/arriver (1).png",
      "/assets/categorie/arriver (2).png",
      "/assets/categorie/arriver (3).png"
    ],
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
  },
  5: {
    id: 5,
    name: 'Veste légère Nike',
    brand: 'Nike',
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    rating: 4.6,
    reviewCount: 321,
    availability: 'En stock',
    deliveryDate: 'Livraison gratuite demain',
    seller: 'Nike Store',
    isPrime: false,
    promo: true,
    isNew: false,
    isExclusive: false,
    color: '#808080',
    delivery: 'Demain',
    stock: 10,
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Veste légère coupe-vent, idéale pour le sport ou la ville.',
    colors: [
      { name: "Gris", code: "#808080", image: "/assets/categorie/arriver (1).png" },
      { name: "Noir", code: "#000000", image: "/assets/categorie/arriver (2).png" },
      { name: "Bleu", code: "#0066CC", image: "/assets/categorie/arriver (3).png" }
    ],
    images: [
      "/assets/categorie/arriver (1).png",
      "/assets/categorie/arriver (2).png",
      "/assets/categorie/arriver (3).png",
      "/assets/categorie/arriver (4).png"
    ],
    features: [
      "Matériau léger et respirant",
      "Protection contre le vent",
      "Fermeture éclair",
      "Poches zippées",
      "Design sportif"
    ],
    specifications: {
      "Marque": "Nike",
      "Modèle": "Veste légère",
      "Type": "Sport",
      "Matériau": "Polyester",
      "Poids": "280g",
      "Fermeture": "Zipper"
    }
  },
  6: {
    id: 6,
    name: 'Sac à dos Adidas',
    brand: 'Adidas',
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    rating: 4.2,
    reviewCount: 210,
    availability: 'En stock',
    deliveryDate: 'Livraison gratuite demain',
    seller: 'Adidas Store',
    isPrime: true,
    promo: false,
    isNew: true,
    isExclusive: false,
    color: '#0000FF',
    delivery: 'Après-demain',
    stock: 7,
    sizes: [],
    description: 'Sac à dos pratique pour le quotidien, compartiment ordinateur.',
    colors: [
      { name: "Bleu", code: "#0000FF", image: "/assets/categorie/arriver (2).png" },
      { name: "Noir", code: "#000000", image: "/assets/categorie/arriver (3).png" },
      { name: "Gris", code: "#808080", image: "/assets/categorie/arriver (4).png" }
    ],
    images: [
      "/assets/categorie/arriver (2).png",
      "/assets/categorie/arriver (3).png",
      "/assets/categorie/arriver (4).png",
      "/assets/categorie/arriver (1).png"
    ],
    features: [
      "Compartiment ordinateur 15 pouces",
      "Poches multiples organisées",
      "Matériau résistant à l'eau",
      "Sangles ajustables",
      "Design moderne"
    ],
    specifications: {
      "Marque": "Adidas",
      "Modèle": "Sac à dos",
      "Type": "Accessoire",
      "Matériau": "Polyester",
      "Capacité": "25L",
      "Fermeture": "Zipper"
    }
  }
};

// Liste des produits pour la grille (version simplifiée)
const mockProducts = Object.values(productsDatabase).map(product => ({
  id: product.id,
  name: product.name,
  price: product.price,
  oldPrice: product.originalPrice,
  image: product.images[0],
  rating: product.rating,
  reviews: product.reviewCount,
  prime: product.isPrime,
  promo: product.promo,
  color: product.color,
  delivery: product.delivery,
  stock: product.stock,
  sizes: product.sizes,
  isNew: product.isNew,
  isExclusive: product.isExclusive,
  description: product.description
}));

const sortOptions = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'price-asc', label: 'Prix : du plus bas au plus élevé' },
  { value: 'price-desc', label: 'Prix : du plus élevé au plus bas' },
  { value: 'rating', label: 'Avis clients' },
  { value: 'new', label: 'Nouveautés' }
];

const totalResults = 100000;

// Ajout du style global pour les animations
const style = `
.card.product-card {
  transition: box-shadow 0.3s, transform 0.3s;
}
.card.product-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  transform: translateY(-6px) scale(1.03);
  z-index: 2;
}
.btn-animate {
  transition: transform 0.15s cubic-bezier(.34,1.56,.64,1), background 0.2s;
}
.btn-animate:active {
  transform: scale(1.12);
  background: #ffc107 !important;
  color: #222 !important;
}
.badge-animated {
  animation: badgePop 0.5s cubic-bezier(.34,1.56,.64,1);
}
@keyframes badgePop {
  0% { transform: scale(0.7); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.heart-animate {
  animation: heartPop 0.4s cubic-bezier(.34,1.56,.64,1);
}
@keyframes heartPop {
  0% { transform: scale(0.7); }
  60% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
.heart-hover:hover {
  color: #e63946 !important;
  filter: drop-shadow(0 2px 6px #e63946aa);
}
.compare-check-animate {
  animation: compareHighlight 0.4s cubic-bezier(.34,1.56,.64,1);
}
@keyframes compareHighlight {
  0% { box-shadow: 0 0 0 0 #0d6efd44; }
  60% { box-shadow: 0 0 0 8px #0d6efd22; }
  100% { box-shadow: 0 0 0 0 #0d6efd00; }
}
.compare-popup-animate {
  animation: compareSlideIn 0.5s cubic-bezier(.34,1.56,.64,1);
}
@keyframes compareSlideIn {
  0% { transform: translateY(40px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
.cart-float-animate {
  animation: cartSlideIn 0.5s cubic-bezier(.34,1.56,.64,1);
}
@keyframes cartSlideIn {
  0% { transform: translateX(80px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}
.pulse {
  animation: pulseAnim 0.5s;
}
@keyframes pulseAnim {
  0% { transform: scale(1); }
  40% { transform: scale(1.12); }
  100% { transform: scale(1); }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('catalogue-animations')) {
  const s = document.createElement('style');
  s.id = 'catalogue-animations';
  s.innerHTML = style;
  document.head.appendChild(s);
}

const Catalogue = () => {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [cart, setCart] = useState([
    { id: 1, name: 'Nike Air Max 270', price: 129.99, image: '/assets/categorie/arriver (1).png', qty: 2 },
    { id: 6, name: 'Sac à dos Adidas', price: 39.99, image: '/assets/categorie/arriver (2).png', qty: 1 }
  ]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showExclusiveOnly, setShowExclusiveOnly] = useState(false);
  const [lastFav, setLastFav] = useState(null);
  const [lastCompare, setLastCompare] = useState(null);
  const [cartFloatAnim, setCartFloatAnim] = useState(false);
  const [pulseSubtotal, setPulseSubtotal] = useState(false);
  const [sort, setSort] = useState('relevance');
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState([10, 500]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [bestSellerIndex, setBestSellerIndex] = useState(0);
  
  // Nouveaux états pour la vue détaillée
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  
  const productsPerPage = 6;
  
  // Filtrage produits selon la taille sélectionnée et les badges
  const filteredProducts = mockProducts.filter(p => {
    if (selectedSizes.length > 0 && !p.sizes.some(size => selectedSizes.includes(size))) return false;
    if (showNewOnly && !p.isNew) return false;
    if (showExclusiveOnly && !p.isExclusive) return false;
    return true;
  });
  const paginatedProducts = filteredProducts.slice((page - 1) * productsPerPage, page * productsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Slider best-sellers (affiche 4 produits à la fois)
  const visibleBestSellers = mockBestSellers.slice(0, 4);
  const canGoPrev = false;
  const canGoNext = false;
  
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  
  const handleToggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
    setLastFav(productId);
    setTimeout(() => setLastFav(null), 400);
  };
  
  const handleToggleCompare = (productId) => {
    setCompareList((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : prev.length < 3 ? [...prev, productId] : prev
    );
    setLastCompare(productId);
    setTimeout(() => setLastCompare(null), 400);
  };
  
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        setPulseSubtotal(true);
        setTimeout(() => setPulseSubtotal(false), 500);
        return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      setCartFloatAnim(true);
      setTimeout(() => setCartFloatAnim(false), 500);
      setPulseSubtotal(true);
      setTimeout(() => setPulseSubtotal(false), 500);
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 }];
    });
  };
  
  const handleCartQty = (id, delta) => {
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };
  
  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Fonctions pour la vue détaillée
  const handleProductClick = (productId) => {
    const product = productsDatabase[productId];
    if (product) {
      setSelectedProduct(product);
      setShowProductDetail(true);
      setSelectedImageIndex(0);
      setSelectedSize('');
      setSelectedColor('');
      setQuantity(1);
      setActiveTab('description');
    }
  };

  const handleBackToCatalogue = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
  };

  const handleAddToCartFromDetail = () => {
    if (!selectedProduct) return;
    
    if (selectedProduct.sizes.length > 0 && !selectedSize) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    
    if (selectedProduct.colors.length > 1 && !selectedColor) {
      alert('Veuillez sélectionner une couleur');
      return;
    }

    const existingItem = cart.find(item => 
      item.id === selectedProduct.id && 
      item.size === selectedSize && 
      item.color === selectedColor
    );

    if (existingItem) {
      setCart(cart.map(item => 
        item.id === selectedProduct.id && 
        item.size === selectedSize && 
        item.color === selectedColor
          ? { ...item, qty: item.qty + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.images[0],
        qty: quantity,
        size: selectedSize,
        color: selectedColor
      }]);
    }

    setCartFloatAnim(true);
    setTimeout(() => setCartFloatAnim(false), 1000);
  };

  const handleImageChange = (index) => {
    setSelectedImageIndex(index);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    // Changer l'image principale selon la couleur
    const colorIndex = selectedProduct.colors.findIndex(c => c.name === color);
    if (colorIndex !== -1) {
      setSelectedImageIndex(colorIndex);
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Affichage temporaire du rendu Amazon-like pour test */}
      <ProductPageAmazonLike />
    </div>
  );
};

export default Catalogue; 