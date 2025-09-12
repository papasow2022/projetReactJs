import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProducts } from '../contexts/ProductsContext';
import Footer from "../components/Footer";
import FemmeSpecificSection from "../components/FemmeSpecificSection";
import HommeSpecificSection from "../components/HommeSpecificSection";

import { useCart } from '../contexts/CartContext';
import StockMessage from '../components/StockMessage';


const formatGNF = (amount) =>
  amount && !isNaN(amount)
    ? new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " GNF"
    : "0 GNF";

const renderStars = (rating) => {
  const stars = [];
  const safeRating = rating || 0;
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 !== 0;
  for (let i = 0; i < fullStars; i++) stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
  if (hasHalfStar) stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
  const emptyStars = 5 - Math.ceil(safeRating);
  for (let i = 0; i < emptyStars; i++) stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
  return stars;
};

export default function ProductDetail() {
  const { productId } = useParams();
  const { products, allProducts } = useProducts();
  const navigate = useNavigate();
  
  // Récupérer l'image cliquée depuis l'URL si elle existe
  const urlParams = new URLSearchParams(window.location.search);
  const clickedImage = urlParams.get('image');
  
  // État pour stocker le produit trouvé par image cliquée
  const [productFromImage, setProductFromImage] = useState(null);
  
  // Traitement des paramètres d'URL dans un useEffect pour éviter les re-renders infinis
  useEffect(() => {
    if (clickedImage && products && products.length > 0) {
      console.log('🖼️ Image cliquée reçue:', clickedImage);
      console.log('📦 Produits disponibles:', products.length);
      
      // Mapping des images Christian Louboutin vers leurs produits spécifiques
      const christianLouboutinImageMapping = {
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins.jpeg': 'cl-escarpins-noir-001',
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg': 'cl-heels-collection-speciale-003',
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg': 'cl-heels-edition-limitee-004',
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg': 'cl-heels-design-exclusif-005',
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg': 'cl-heels-collection-premium-006',
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg': 'cl-heels-classic-002'
      };
      
      let foundProduct = null;
      
      // Chercher le produit par imageId si c'est une image Christian Louboutin
      const productId = christianLouboutinImageMapping[clickedImage];
      if (productId) {
        foundProduct = products.find((p) => p.id === productId);
        console.log('🎯 Produit trouvé par imageId:', foundProduct?.name || 'Aucun produit trouvé');
        console.log('🆔 ID recherché:', productId);
      }
      
      // Si pas trouvé par imageId, essayer la correspondance directe
      if (!foundProduct) {
        foundProduct = products.find((p) => p.image === clickedImage);
        console.log('🔍 Produit trouvé par correspondance directe:', foundProduct?.name || 'Aucun produit trouvé');
      }
      
      // Si toujours pas trouvé, essayer une correspondance partielle
      if (!foundProduct) {
        console.log('❌ Aucune correspondance exacte trouvée');
        console.log('🔍 Recherche par correspondance partielle...');
        
        foundProduct = products.find((p) => p.image && p.image.includes(clickedImage.split('/').pop()));
        console.log('🔍 Produit trouvé par correspondance partielle:', foundProduct?.name || 'Aucun produit trouvé');
      }
      
      // IMPORTANT: Si on a trouvé un produit et qu'une image a été cliquée, 
      // modifier l'image principale du produit pour qu'elle corresponde à l'image cliquée
      if (foundProduct && clickedImage) {
        console.log('🔄 Modification de l\'image principale du produit');
        console.log('📸 Ancienne image principale:', foundProduct.image);
        console.log('📸 Nouvelle image principale:', clickedImage);
        
        // Créer une copie du produit avec la nouvelle image principale
        foundProduct = {
          ...foundProduct,
          image: clickedImage
        };
      }
      
      // Si toujours rien trouvé, créer un produit synthétique basé sur l'image cliquée
      if (!foundProduct && clickedImage) {
        const fileName = clickedImage.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Produit';
        const brandGuess = clickedImage.includes('/Gucci/')
          ? 'Gucci'
          : clickedImage.includes('/CritianlouboutinNoire/')
          ? 'Christian Louboutin'
          : clickedImage.includes('/Prada')
          ? 'Prada'
          : clickedImage.includes('/Zara')
          ? 'Zara'
          : clickedImage.includes('/Minelli')
          ? 'Minelli'
          : clickedImage.includes('/Mango')
          ? 'Mango'
          : undefined;
        foundProduct = {
          id: `synthetic-${Date.now()}`,
          slug: fileName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: fileName.replace(/[-_]/g, ' '),
          image: clickedImage,
          price: 250000, // valeur par défaut raisonnable en GNF
          stock: 5,
          status: 'approved',
          visible: true,
          isNew: false,
          category: 'Chaussures',
          subcategory: clickedImage.includes('/homme/') ? 'homme' : 'femme',
          brand: brandGuess,
          rating: 4.4,
          reviewCount: 0,
          vendor: 'Boutique',
          vendorId: 'synthetic',
        };
      }

      // Éviter les appels inutiles de setState
      setProductFromImage(prevProduct => {
        if (prevProduct?.id !== foundProduct?.id) {
          return foundProduct;
        }
        return prevProduct;
      });

      // Détecter la marque et forcer la sélection de la marque appropriée
      // Utiliser useCallback pour éviter les re-renders inutiles
      if (clickedImage.includes('/Gucci/')) {
        const gucciBrand = { id: 'Gucci', name: 'Gucci', folder: 'Gucci' };
        setSelectedBrand(prevBrand => {
          if (prevBrand?.id !== gucciBrand.id) {
            return gucciBrand;
          }
          return prevBrand;
        });
      } else if (clickedImage.includes('/Balanciaga/')) {
        const balenciagaBrand = { id: 'Balanciaga', name: 'Balenciaga', folder: 'Balanciaga' };
        setSelectedBrand(prevBrand => {
          if (prevBrand?.id !== balenciagaBrand.id) {
            return balenciagaBrand;
          }
          return prevBrand;
        });
      } else if (clickedImage.includes('/Nike/')) {
        const nikeBrand = { id: 'Nike', name: 'Nike', folder: 'Nike' };
        setSelectedBrand(prevBrand => {
          if (prevBrand?.id !== nikeBrand.id) {
            return nikeBrand;
          }
          return prevBrand;
        });
      } else if (clickedImage.includes('/Puma/')) {
        const pumaBrand = { id: 'Puma', name: 'Puma', folder: 'Puma' };
        setSelectedBrand(prevBrand => {
          if (prevBrand?.id !== pumaBrand.id) {
            return pumaBrand;
          }
          return prevBrand;
        });
      }
    }
  }, [clickedImage, products]);
  
  // Si pas de produit trouvé par image, utiliser le productId
  let product = productFromImage;
  
  // Si pas de produit trouvé par image ET que c'est un produit synthétique, créer le produit
  if (!product && productId === 'synthetic-homme' && clickedImage) {
    const fileName = clickedImage.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Produit';
    const brandGuess = clickedImage.includes('/Balanciaga/')
      ? 'Balenciaga'
      : clickedImage.includes('/Nike/')
      ? 'Nike'
      : clickedImage.includes('/Puma/')
      ? 'Puma'
      : clickedImage.includes('/Gucci/')
      ? 'Gucci'
      : undefined;
    
    product = {
      id: `synthetic-${Date.now()}`,
      slug: fileName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: fileName.replace(/[-_]/g, ' '),
      image: clickedImage,
      price: 250000,
      stock: 5,
      status: 'approved',
      visible: true,
      isNew: false,
      category: 'Chaussures',
      subcategory: 'homme',
      brand: brandGuess,
      rating: 4.4,
      reviewCount: 0,
      vendor: 'Boutique',
      vendorId: 'synthetic',
    };
    
    console.log('🔍 Produit synthétique créé:', product?.name);
  }
  
  // État pour gérer la marque sélectionnée
  const [selectedBrand, setSelectedBrand] = useState(null);
  
  // État pour gérer la couleur sélectionnée
  const [selectedColor, setSelectedColor] = useState(null);
  
  // Fonction pour détecter la marque depuis l'image
  const detectBrandFromImage = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.includes('/Nike/')) return { id: 'Nike', name: 'Nike', folder: 'Nike' };
    if (imagePath.includes('/Gucci/')) return { id: 'Gucci', name: 'Gucci', folder: 'Gucci' };
    if (imagePath.includes('/Balanciaga/')) return { id: 'Balanciaga', name: 'Balanciaga', folder: 'Balanciaga' };
    if (imagePath.includes('/Puma/')) return { id: 'Puma', name: 'Puma', folder: 'Puma' };
    
    return null;
  };
  
  // Fonction pour détecter la couleur depuis l'image
  const detectColorFromImage = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.includes('/blanc/')) return { id: 'blanc', name: 'Blanc', folder: 'blanc' };
    if (imagePath.includes('/noire/') || imagePath.includes('/noir/')) return { id: 'noir', name: 'Noir', folder: 'noire' };
    if (imagePath.includes('/vertolive/')) return { id: 'vertolive', name: 'Vert Olive', folder: 'vertolive' };
    if (imagePath.includes('/Guccirose/')) return { id: 'rose', name: 'Rose', folder: 'Guccirose' };
    if (imagePath.includes('/Guccinoire/')) return { id: 'noir', name: 'Noir', folder: 'Guccinoire' };
    if (imagePath.includes('/Blanc/')) return { id: 'blanc', name: 'Blanc', folder: 'Blanc' };
    if (imagePath.includes('/Noire/') || imagePath.includes('/Noir/')) return { id: 'noir', name: 'Noir', folder: 'Noire' };
    if (imagePath.includes('/Vertolive/')) return { id: 'vertolive', name: 'Vert Olive', folder: 'Vertolive' };
    
    return null;
  };
  
  // Fonction pour obtenir toutes les couleurs disponibles pour une marque
  const getAvailableColors = (brand) => {
    if (!brand) return [];
    
    const colorMap = {
      'Nike': [
        { id: 'blanc', name: 'Blanc', folder: 'blanc' },
        { id: 'noir', name: 'Noir', folder: 'noire' },
        { id: 'vertolive', name: 'Vert Olive', folder: 'vertolive' }
      ],
      'Gucci': [
        { id: 'blanc', name: 'Blanc', folder: 'Blanc' },
        { id: 'noir', name: 'Noir', folder: 'Guccinoire' },
        { id: 'rose', name: 'Rose', folder: 'Guccirose' }
      ],
      'Balanciaga': [
        { id: 'blanc', name: 'Blanc', folder: 'Blanc' },
        { id: 'noir', name: 'Noir', folder: 'Noire' },
        { id: 'vertolive', name: 'Vert Olive', folder: 'Vertolive' }
      ],
      'Puma': [
        { id: 'blanc', name: 'Blanc', folder: 'Blanc' },
        { id: 'noir', name: 'Noir', folder: 'Noir' },
        { id: 'vertolive', name: 'Vert Olive', folder: 'Vertolive' }
      ]
    };
    
    return colorMap[brand.id] || [];
  };
  
  // Fonction pour obtenir les images d'une couleur spécifique
  const getColorImages = (brand, color) => {
    if (!brand || !color) return [];
    
    // Simuler les images disponibles pour chaque couleur
    const imageMap = {
      'Nike': {
        'blanc': [
          '/chaussures/homme/Nike/blanc/nike-air-jordan-1-blanc.jpg',
          '/chaussures/homme/Nike/blanc/nike-air-max-270-blanc.jpg',
          '/chaussures/homme/Nike/blanc/nike-dunk-low-blanc.jpg'
        ],
        'noir': [
          '/chaussures/homme/Nike/noire/nike-air-jordan-1-noir.jpg',
          '/chaussures/homme/Nike/noire/nike-air-max-270-noir.jpg',
          '/chaussures/homme/Nike/noire/nike-dunk-low-noir.jpg'
        ],
        'vertolive': [
          '/chaussures/homme/Nike/vertolive/nike-air-jordan-1-vertolive.jpg',
          '/chaussures/homme/Nike/vertolive/nike-air-max-270-vertolive.jpg',
          '/chaussures/homme/Nike/vertolive/nike-dunk-low-vertolive.jpg'
        ]
      },
      'Gucci': {
        'blanc': [
          '/chaussures/homme/Gucci/Blanc/gucci-ace-blanc.jpg',
          '/chaussures/homme/Gucci/Blanc/gucci-rhyton-blanc.jpg',
          '/chaussures/homme/Gucci/Blanc/gucci-screener-blanc.jpg'
        ],
        'noir': [
          '/chaussures/homme/Gucci/Guccinoire/gucci-ace-guccinoire.jpg',
          '/chaussures/homme/Gucci/Guccinoire/gucci-rhyton-guccinoire.jpg',
          '/chaussures/homme/Gucci/Guccinoire/gucci-screener-guccinoire.jpg'
        ],
        'rose': [
          '/chaussures/homme/Gucci/Guccirose/gucci-ace-guccirose.jpg',
          '/chaussures/homme/Gucci/Guccirose/gucci-rhyton-guccirose.jpg',
          '/chaussures/homme/Gucci/Guccirose/gucci-screener-guccirose.jpg'
        ]
      },
      'Balanciaga': {
        'blanc': [
          '/chaussures/homme/Balanciaga/Blanc/balenciaga-defender-blanc.jpg',
          '/chaussures/homme/Balanciaga/Blanc/balenciaga-speed-blanc.jpg',
          '/chaussures/homme/Balanciaga/Blanc/balenciaga-track-blanc.jpg'
        ],
        'noir': [
          '/chaussures/homme/Balanciaga/Noire/balenciaga-defender-noire.jpg',
          '/chaussures/homme/Balanciaga/Noire/balenciaga-speed-noire.jpg',
          '/chaussures/homme/Balanciaga/Noire/balenciaga-track-noire.jpg'
        ],
        'vertolive': [
          '/chaussures/homme/Balanciaga/Vertolive/balenciaga-defender-vertolive.jpg',
          '/chaussures/homme/Balanciaga/Vertolive/balenciaga-speed-vertolive.jpg',
          '/chaussures/homme/Balanciaga/Vertolive/balenciaga-track-vertolive.jpg'
        ]
      },
      'Puma': {
        'blanc': [
          '/chaussures/homme/Puma/Blanc/puma-basket-classic-blanc.jpg',
          '/chaussures/homme/Puma/Blanc/puma-cali-sport-blanc.jpg',
          '/chaussures/homme/Puma/Blanc/puma-future-rider-blanc.jpg'
        ],
        'noir': [
          '/chaussures/homme/Puma/Noir/puma-cali-sport-noire.jpg',
          '/chaussures/homme/Puma/Noir/puma-future-rider-noire.jpg',
          '/chaussures/homme/Puma/Noir/puma-rs-x-noire.jpg'
        ],
        'vertolive': [
          '/chaussures/homme/Puma/Vertolive/puma-basket-classic-vertolive.jpg',
          '/chaussures/homme/Puma/Vertolive/puma-cali-sport-vertolive.jpg',
          '/chaussures/homme/Puma/Vertolive/puma-future-rider-vertolive.jpg'
        ]
      }
    };
    
    return imageMap[brand.id]?.[color.id] || [];
  };
  
  // Fonction pour gérer le changement de couleur
  const handleColorChange = (color) => {
    if (!selectedBrand || !color) return;
    
    console.log('🎨 Changement de couleur vers:', color.name);
    setSelectedColor(color);
    
    // Obtenir les images de la nouvelle couleur
    const colorImages = getColorImages(selectedBrand, color);
    if (colorImages.length > 0) {
      // Naviguer vers la première image de la nouvelle couleur
      const newImage = colorImages[0];
      const newProductId = `synthetic-${selectedBrand.id.toLowerCase()}-${color.id}`;
      
      console.log('🔄 Navigation vers nouvelle couleur:', newImage);
      navigate(`/product/${newProductId}?image=${encodeURIComponent(newImage)}`);
    }
  };
  
  // Obtenir les images de la couleur actuelle
  const currentColorImages = useMemo(() => {
    if (!selectedBrand || !selectedColor) return [];
    return getColorImages(selectedBrand, selectedColor);
  }, [selectedBrand, selectedColor]);
  
  // Obtenir les couleurs disponibles pour la marque actuelle
  const availableColors = useMemo(() => {
    if (!selectedBrand) return [];
    return getAvailableColors(selectedBrand);
  }, [selectedBrand]);
 
  // Construit un produit d'affichage cohérent pour une marque donnée (nom, prix, description, rating...)
  const buildBrandDisplayProduct = (brand) => {
    if (!brand) return null;
    const base = {
      ...product,
      subcategory: 'femme',
      category: product?.category || 'Chaussures',
      reviewCount: 0,
    };
    switch (brand.folder) {
      case 'CritianlouboutinNoire':
        return {
          ...base,
          brand: 'Christian Louboutin',
          name: 'Christian Louboutin Collection',
          price: 2500000,
          rating: 4.8,
          description: 'Escarpins Christian Louboutin, design exclusif et élégant.'
        };
      case 'Gucci':
        return {
          ...base,
          brand: 'Gucci',
          name: 'Gucci Collection',
          price: 1800000,
          rating: 4.6,
          description: 'Sélection Gucci femme, sandales design et finitions premium.'
        };
      case 'PradaBeige':
        return {
          ...base,
          brand: 'Prada',
          name: 'Prada Collection',
          price: 2200000,
          rating: 4.7,
          description: 'Collection Prada femme, plateformes élégantes en cuir haut de gamme.'
        };
      case 'Zaranoire':
        return {
          ...base,
          brand: 'Zara',
          name: 'Zara Collection',
          price: 450000,
          rating: 4.3,
          description: 'Sélection Zara femme, talons modernes et confortables.'
        };
      case 'Minelli':
        return {
          ...base,
          brand: 'Minelli',
          name: 'Minelli Collection',
          price: 380000,
          rating: 4.4,
          description: 'Minelli femme, escarpins et bottines au confort quotidien.'
        };
      case 'Mango':
        return {
          ...base,
          brand: 'Mango',
          name: 'Mango Collection',
          price: 320000,
          rating: 4.2,
          description: 'Mango femme, sandales fines au style minimal et chic.'
        };
      case 'Jonak':
        return {
          ...base,
          brand: 'Jonak',
          name: 'Jonak Collection',
          price: 280000,
          rating: 4.1,
          description: 'Jonak femme, bottines et escarpins tendance.'
        };
      // Marques Homme
      case 'Balanciaga':
        return {
          ...base,
          brand: 'Balenciaga',
          name: 'Balenciaga Collection Homme',
          price: 1800000,
          rating: 4.7,
          description: 'Collection Balenciaga homme, sneakers et chaussures de luxe au design avant-gardiste.',
          subcategory: 'homme'
        };
      case 'Nike':
        return {
          ...base,
          brand: 'Nike',
          name: 'Nike Collection Homme',
          price: 450000,
          rating: 4.5,
          description: 'Nike homme, baskets et sneakers pour le sport et le quotidien.',
          subcategory: 'homme'
        };
      case 'Puma':
        return {
          ...base,
          brand: 'Puma',
          name: 'Puma Collection Homme',
          price: 380000,
          rating: 4.3,
          description: 'Puma homme, chaussures de sport et lifestyle confortables.',
          subcategory: 'homme'
        };
      default:
        return base;
    }
  };

  // Conseils/entretien: defaults par marque + overrides par modèle (image)
  const getTipsCareForImage = (imagePath = '', brandName = '') => {
    const p = (imagePath || '').toLowerCase();
    const b = (brandName || '').toLowerCase();
    const tips = [];
    const care = [];

    // Defaults par marque (ADN)
    if (b.includes('louboutin')) {
      tips.push('Élancer la silhouette avec des coupes nettes');
      tips.push('Privilégier des accessoires minimalistes');
      care.push('Éviter les surfaces abrasives');
      care.push('Essuyer le cuir après usage');
    } else if (b.includes('gucci')) {
      tips.push('Jouer le chic urbain avec pièces structurées');
      tips.push('Accorder avec touches dorées discrètes');
      care.push('Nettoyage doux microfibre');
      care.push("Éviter l'humidité prolongée");
    } else if (b.includes('prada')) {
      tips.push('Contraster volumes avec lignes épurées');
      tips.push('Souligner le design architectural');
      care.push('Essuyer plateformes et vérifier semelles');
      care.push("Stocker à plat, à l'abri de la chaleur");
    } else if (b.includes('zara')) {
      tips.push('Composer des looks tendance et accessibles');
      tips.push('Miser sur des silhouettes épurées');
      care.push('Protéger brides et bouts pointus');
      care.push('Nettoyer régulièrement selon la matière');
    } else if (b.includes('minelli')) {
      tips.push('Cibler le confort chic du quotidien');
      tips.push('Associer à vestiaire business-casual');
      care.push('Utiliser embauchoirs');
      care.push('Nourrir le cuir périodiquement');
    } else if (b.includes('mango')) {
      tips.push('Minimalisme estival, teintes nude/pastel');
      tips.push('Favoriser lignes légères et accessoires fins');
      care.push('Nettoyage doux');
      care.push('Ranger en housse pour préserver les brides');
    } else if (b.includes('jonak')) {
      tips.push('Casual‑chic pour le quotidien');
      tips.push('Equilibrer avec pièces fluides');
      care.push('Spray protecteur adapté');
      care.push("Stocker à l'abri de la lumière");
    }

    // Overrides par modèle (type/mot‑clé image) + matériaux spécifiques
    if (p.includes('bottine') || p.includes('boot')) {
      tips.push('Jean skinny ou trench pour la mi‑saison');
      care.push('Imperméabiliser avant usage');
      if (p.includes('suede') || p.includes('daim')) {
        care.push("Brosser le suède à sec, éviter l'eau");
      }
    }
    if (p.includes('slingback')) {
      tips.push('Robe droite ou tailleur jupe pour une ligne nette');
      care.push("Protéger l'élastique de la bride");
    }
    if (p.includes('platform')) {
      tips.push('Jupe midi/pantalon droit pour équilibrer la hauteur');
      care.push("Essuyer la plateforme et contrôler l'usure");
      if (p.includes('metallic') || p.includes('gold')) {
        care.push('Éviter les rayures sur les finitions métalliques');
      }
    }
    if (p.includes('sandale') || p.includes('sandal')) {
      tips.push('Idéal avec robes fluides et tons lumineux');
      care.push('Éviter humidité prolongée');
      if (p.includes('strappy') || p.includes('brides')) {
        care.push('Vérifier la tension des brides avant sortie');
      }
    }
    if (p.includes('heel') || p.includes('escarpin') || p.includes('pointed')) {
      tips.push('Robe cocktail ou pantalon tailleur');
      care.push('Éviter chocs sur le bout/talon');
      if (p.includes('leather') || p.includes('cuir')) {
        care.push('Nourrir le cuir avec crème adaptée');
      }
      if (p.includes('rhinestone') || p.includes('strass')) {
        care.push('Nettoyer délicatement les strass avec pinceau doux');
      }
    }
    if (p.includes('ankle') || p.includes('cheville')) {
      tips.push('Mettre en valeur la cheville avec ourlets courts');
      care.push('Protéger la boucle de la bride cheville');
    }
    if (p.includes('nude') || p.includes('beige')) {
      tips.push('Harmoniser avec teintes chair ou pastel');
      care.push('Éviter les taches, nettoyer immédiatement');
    }
    if (p.includes('noir') || p.includes('black')) {
      tips.push('Contraster avec pièces claires pour un look sophistiqué');
      care.push('Protéger des rayures avec spray matifiant');
    }

    // Fallbacks si trop courts
    if (tips.length < 2) {
      tips.push('Composer avec basiques élégants');
    }
    if (care.length < 2) {
      care.push('Stocker au sec, loin de la chaleur');
    }
    return { tips, care };
  };

  // Dev-only: vérifie la cohérence tips/care pour toutes les images Femme
  const verifyAllFemmeCatalogConsistency = () => {
    try {
      const brands = getAvailableBrands();
      const issues = [];
      const keywordSets = {
        bottine: { tips: ['jean', 'trench', 'urbain'], care: ['imperméabilis', 'poussi', 'sécher'] },
        sandale: { tips: ['robe', 'tailleur', 'estiv'], care: ['microfibre', 'humidité', 'housse'] },
        platform: { tips: ['silhouette', 'pantalon', 'moderne'], care: ['plateforme', 'semelle'] },
        slingback: { tips: ['robe', 'tailleur', 'cérémonie'], care: ['élastique', 'embauchoir'] },
        escarpin: { tips: ['robe', 'pantalon', 'pochette'], care: ['patins', 'cuir'] }
      };
      const detectCategory = (p) => {
        const s = (p || '').toLowerCase();
        if (s.includes('bottine') || s.includes('boot')) return 'bottine';
        if (s.includes('sandal') || s.includes('sandale')) return 'sandale';
        if (s.includes('platform')) return 'platform';
        if (s.includes('slingback')) return 'slingback';
        return 'escarpin';
      };
      brands.forEach((b) => {
        const catalog = getBrandCatalog(b.folder);
        catalog.forEach((item) => {
          const expected = detectCategory(item.image);
          const kws = keywordSets[expected];
          const hasTips = Array.isArray(item.tips) && item.tips.length > 0;
          const hasCare = Array.isArray(item.care) && item.care.length > 0;
          if (!hasTips || !hasCare) {
            issues.push({ level: 'warn', brand: b.name, image: item.image, reason: 'tips/care manquants' });
            return;
          }
          const tipsText = item.tips.join(' ').toLowerCase();
          const careText = item.care.join(' ').toLowerCase();
          const tipsOk = kws.tips.some((kw) => tipsText.includes(kw));
          const careOk = kws.care.some((kw) => careText.includes(kw));
          if (!tipsOk || !careOk) {
            issues.push({ level: 'info', brand: b.name, image: item.image, expected, detail: { tipsOk, careOk } });
          }
        });
      });
      if (issues.length === 0) {
        console.log('✅ Vérification Femme: tous les tips/care semblent cohérents.');
      } else {
        console.groupCollapsed(`🔍 Vérification Femme: ${issues.length} éléments à revoir`);
        issues.forEach((it) => console.log(it));
        console.groupEnd();
      }
    } catch (e) {
      console.warn('⚠️ Vérification Femme échouée:', e);
    }
  };

  // Catalogue par marque: image -> { name, price, description, rating }
  const getBrandCatalog = (brandFolder) => {
    if (brandFolder === 'CritianlouboutinNoire') {
      return [
        {
          image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins.jpeg',
          name: 'Christian Louboutin Escarpins',
          price: 2500000,
          description: "Escarpins signature à la cambrure sensuelle, cuir lisse et ligne affûtée. Une pièce iconique qui élance la silhouette et signe un style haute couture.",
          rating: 4.8,
          tips: [
            'Élégant avec une robe cocktail ou un pantalon tailleur',
            'Accessoiriser avec une pochette minimaliste'
          ],
          care: [
            'Utiliser patins antidérapants si nécessaire',
            'Nourrir le cuir régulièrement'
          ]
        },
        {
          image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg',
          name: 'Christian Louboutin Heels Classic',
          price: 2450000,
          description: "Talons aiguilles iconiques à la finition glacée, silhouette intemporelle et allure élancée. Un essentiel du vestiaire habillé et des soirées.",
          rating: 4.7,
          tips: [
            'Classique avec tailleur pantalon ou jupe crayon',
            "Sublimer avec bijoux perle ou or fin"
          ],
          care: [
            'Utiliser patins antidérapants si nécessaire',
            "Hydrater le cuir pour conserver l'éclat"
          ]
        },
        {
          image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg',
          name: 'Christian Louboutin Collection Spéciale',
          price: 2600000,
          description: "Édition spéciale aux finitions joaillières, détails sophistiqués et éclat discret. Idéal pour rehausser une tenue de cérémonie.",
          rating: 4.9,
          tips: [
            'Mettre en valeur les détails avec robe midi satinée',
            'Choisir pochette métallisée discrète'
          ],
          care: [
            "Éviter contacts prolongés avec l'eau",
            'Ranger dans housse pour protéger les finitions'
          ]
        },
        {
          image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg',
          name: 'Christian Louboutin Édition Limitée',
          price: 2700000,
          description: "Série limitée confectionnée dans des matières d'exception. Présence raffinée, stabilité assumée et signature résolument couture.",
          rating: 5.0,
          tips: [
            'Idéal pour tenues formelles et soirées',
            "Accessoires minimalistes pour laisser la pièce s'exprimer"
          ],
          care: [
            'Protéger les semelles avec patins adaptés',
            'Éviter rayures en transport (housse séparée)'
          ]
        },
        {
          image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg',
          name: 'Christian Louboutin Design Exclusif',
          price: 2550000,
          description: "Design exclusif aux lignes sculpturales. Jeu d'angles et de courbes qui subliment la jambe avec une élégance assumée.",
          rating: 4.8,
          tips: [
            'Silhouette sculpturale avec robe colonne',
            'Palette neutre pour souligner le design'
          ],
          care: [
            'Essuyer après usage avec chiffon doux',
            'Éviter chocs sur talon et bout'
          ]
        },
        {
          image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg',
          name: 'Christian Louboutin Collection Premium',
          price: 2650000,
          description: "Version Premium alliant confort haute densité et équilibre parfait. Un porté souple qui n'altère jamais l'allure.",
          rating: 4.9,
          tips: [
            'Business chic avec blazer et pantalon droit',
            'Relever avec ceinture fine ou foulard soie'
          ],
          care: [
            'Nourrir le cuir régulièrement',
            'Remplacer les patins dès usure'
          ]
        }
      ];
    }
    if (brandFolder === 'Gucci') {
      return [
        {
          image: "/chaussures/femme/Gucci/Designer High Heel Sandals _ Block Heel Sandals   _ GUCCI® International.jpeg",
          name: 'Gucci Sandals International',
          price: 1800000,
          description: "Sandales à talon au minimalisme graphique, signature Gucci. Brides épurées et allure cosmopolite à la démarche fluide.",
          rating: 4.6,
          tips: [
            'Sublime avec une robe fluide ou un tailleur léger',
            'Parfait pour les occasions estivales',
            'Mettre en valeur avec des accessoires dorés'
          ],
          care: [
            'Nettoyage doux avec chiffon microfibre',
            "Éviter l'humidité prolongée",
            'Ranger dans sa housse pour préserver les brides'
          ]
        },
        {
          image: "/chaussures/femme/Gucci/Designer High Heel Sandals _ Block Heel Sandals   _ GUCCI® US.jpeg",
          name: 'Gucci Sandals US',
          price: 1820000,
          description: "Variation US au design élancé et aux proportions équilibrées. Un essentiel chic pour les silhouettes estivales.",
          rating: 4.6,
          tips: [
            'Sublime avec une robe fluide ou un tailleur léger',
            'Parfait pour les occasions estivales',
            'Mettre en valeur avec des accessoires dorés'
          ],
          care: [
            'Nettoyage doux avec chiffon microfibre',
            "Éviter l'humidité prolongée",
            'Ranger dans sa housse pour préserver les brides'
          ]
        },
        {
          image: '/chaussures/femme/Gucci/Gucci Leather Sandals - Noir.jpeg',
          name: 'Gucci Leather Sandals',
          price: 1850000,
          description: "Sandales en cuir lisse noir, lignes nettes et profil raffiné. Un classique contemporain pour les dress codes du soir.",
          rating: 4.7,
          tips: [
            'Sublime avec une robe fluide ou un tailleur léger',
            'Parfait pour les occasions estivales',
            'Mettre en valeur avec des accessoires dorés'
          ],
          care: [
            'Nettoyage doux avec chiffon microfibre',
            "Éviter l'humidité prolongée",
            'Ranger dans sa housse pour préserver les brides'
          ]
        },
        {
          image: '/chaussures/femme/Gucci/Gucci Sandals - Noir 3.jpeg',
          name: 'Gucci Sandals Noir',
          price: 1780000,
          description: "Sandales noires à l'élégance immédiate, équilibre entre finesse et maintien. Parfaites du déjeuner au dîner.",
          rating: 4.5,
          tips: [
            'Sublime avec une robe fluide ou un tailleur léger',
            'Parfait pour les occasions estivales',
            'Mettre en valeur avec des accessoires dorés'
          ],
          care: [
            'Nettoyage doux avec chiffon microfibre',
            "Éviter l'humidité prolongée",
            'Ranger dans sa housse pour préserver les brides'
          ]
        },
        {
          image: "\/chaussures\/femme\/Gucci\/Women's Designer Luxury High Heels Pumps _ GUCCI® US.jpeg",
          name: 'Gucci Luxury Heels',
          price: 1900000,
          description: "Escarpins de luxe à la courbe précise, port stable et silhouette allongée. Un investissement mode à la longévité certaine.",
          rating: 4.7,
          tips: [
            'Élégant avec une robe cocktail ou un pantalon tailleur',
            'Accessoiriser avec une pochette minimaliste'
          ],
          care: [
            'Utiliser patins antidérapants si nécessaire',
            'Nourrir le cuir régulièrement'
          ]
        }
      ];
    }
    if (brandFolder === 'PradaBeige') {
      return [
        {
          image: '/chaussures/femme/PradaBeige/Prada Ankle Strap Platform Sandals - Beige.jpeg',
          name: 'Prada Platform Sandals',
          price: 2200000,
          description: "Sandales plateformes au volume architectural, teinte beige apaisée. Un contraste moderne qui structure la silhouette.",
          rating: 4.7,
          tips: [
            'Équilibre silhouette avec pantalon droit ou jupe midi',
            'Look audacieux et moderne'
          ],
          care: [
            'Essuyer la plateforme après usage',
            'Vérifier régulièrement la semelle'
          ]
        },
        {
          image: '/chaussures/femme/PradaBeige/Prada Gold Platform Sandals - Beige.jpeg',
          name: 'Prada Gold Platform',
          price: 2250000,
          description: "Plateformes aux finitions dorées subtiles, éclat maîtrisé et esprit couture. Idéal pour capter la lumière avec retenue.",
          rating: 4.7,
          tips: [
            'Équilibre silhouette avec pantalon droit ou jupe midi',
            'Look audacieux et moderne'
          ],
          care: [
            'Essuyer la plateforme après usage',
            'Vérifier régulièrement la semelle'
          ]
        },
        {
          image: '/chaussures/femme/PradaBeige/Prada Leather Platform Sandals - Beige.jpeg',
          name: 'Prada Leather Platform',
          price: 2180000,
          description: "Plateformes en cuir souple, maintien ergonomique et lignes franches. Confort et hauteur pour un porté assuré.",
          rating: 4.6,
          tips: [
            'Équilibre silhouette avec pantalon droit ou jupe midi',
            'Look audacieux et moderne'
          ],
          care: [
            'Essuyer la plateforme après usage',
            'Vérifier régulièrement la semelle'
          ]
        },
        {
          image: '/chaussures/femme/PradaBeige/Prada Metallic Platform Sandals - Beige.jpeg',
          name: 'Prada Metallic Platform',
          price: 2230000,
          description: "Plateformes aux reflets métallisés, modernité affirmée et allure sculpturale. Une pièce statement sans excès.",
          rating: 4.7,
          tips: [
            'Équilibre silhouette avec pantalon droit ou jupe midi',
            'Look audacieux et moderne'
          ],
          care: [
            'Essuyer la plateforme après usage',
            'Vérifier régulièrement la semelle'
          ]
        },
        {
          image: '/chaussures/femme/PradaBeige/Prada Paige Platform Sandals - Beige.jpeg',
          name: 'Prada Paige Platform',
          price: 2210000,
          description: "Modèle Paige à la plateforme équilibrée, courbes harmonieuses et démarche stable. Une alternative sophistiquée au stiletto.",
          rating: 4.6,
          tips: [
            'Équilibre silhouette avec pantalon droit ou jupe midi',
            'Look audacieux et moderne'
          ],
          care: [
            'Essuyer la plateforme après usage',
            'Vérifier régulièrement la semelle'
          ]
        },
        {
          image: '/chaussures/femme/PradaBeige/Prada Sandales - Beige.jpeg',
          name: 'Prada Sandales Beige',
          price: 2100000,
          description: "Sandales beige essentielles, lignes épurées et douceur chromatique. Un basique chic aux multiples combinaisons.",
          rating: 4.5,
          tips: [
            'Sublime avec une robe fluide ou un tailleur léger',
            'Parfait pour les occasions estivales',
            'Mettre en valeur avec des accessoires dorés'
          ],
          care: [
            'Nettoyage doux avec chiffon microfibre',
            "Éviter l'humidité prolongée",
            'Ranger dans sa housse pour préserver les brides'
          ]
        },
        {
          image: '/chaussures/femme/PradaBeige/Prada Suede Sandals - Beige.jpeg',
          name: 'Prada Suede Sandals',
          price: 2150000,
          description: "Sandales en daim à la texture veloutée, toucher luxe et élégance feutrée. Idéales pour des tenues monochromes.",
          rating: 4.6,
          tips: [
            'Sublime avec une robe fluide ou un tailleur léger',
            'Parfait pour les occasions estivales',
            'Mettre en valeur avec des accessoires dorés'
          ],
          care: [
            'Nettoyage doux avec chiffon microfibre',
            "Éviter l'humidité prolongée",
            'Ranger dans sa housse pour préserver les brides'
          ]
        }
      ];
    }
    if (brandFolder === 'Zaranoire') {
      return [
        {
          image: '/chaussures/femme/Zaranoire/Zara Ankle Strap Heels - Noir.jpeg',
          name: 'Zara Ankle Strap Heels',
          price: 450000,
          description: "Talons à bride cheville au style épuré, silhouette affinée et maintien précis. Un indispensable urbain.",
          rating: 4.3,
          tips: [
            'Mettre en valeur la cheville avec une jupe midi',
            'Associer à un haut asymétrique pour allonger la silhouette'
          ],
          care: [
            "Protéger la bride et la boucle de l'humidité",
            'Ranger sur support pour éviter les plis des brides'
          ]
        },
        {
          image: '/chaussures/femme/Zaranoire/Zara Classic Heels - Noir.jpeg',
          name: 'Zara Classic Heels',
          price: 440000,
          description: "Escarpins classiques aux lignes nettes, polyvalents et féminins. Un intemporel pour le bureau comme pour le soir.",
          rating: 4.2,
          tips: [
            'Élégant avec une robe cocktail ou un pantalon tailleur',
            'Accessoiriser avec une pochette minimaliste'
          ],
          care: [
            'Utiliser patins antidérapants si nécessaire',
            'Nourrir le cuir régulièrement'
          ]
        },
        {
          image: '/chaussures/femme/Zaranoire/Zara High Heel Platform Slingback Shoes - Noir.jpeg',
          name: 'Zara Platform Slingback',
          price: 470000,
          description: "Plateformes slingback, équilibre de hauteur et de confort. Esprit graphique pour des looks assumés.",
          rating: 4.3,
          tips: [
            'Équilibre silhouette avec pantalon droit ou jupe midi',
            'Look audacieux et moderne'
          ],
          care: [
            'Essuyer la plateforme après usage',
            'Vérifier régulièrement la semelle'
          ]
        },
        {
          image: '/chaussures/femme/Zaranoire/Zara Pointed Toe Heels - Noir.jpeg',
          name: 'Zara Pointed Toe Heels',
          price: 455000,
          description: "Escarpins à bout pointu, profil allongeant et dessin affûté. Une signature de féminité contemporaine.",
          rating: 4.3,
          tips: [
            'Affiner la silhouette avec pantalon cigarette',
            'Souligner le bout pointu avec ourlets courts'
          ],
          care: [
            "Éviter les chocs sur l'extrémité du bout",
            'Utiliser embauchoirs pour préserver la pointe'
          ]
        },
        {
          image: '/chaussures/femme/Zaranoire/Zara Rhinestone Suede Heels - Noir.jpeg',
          name: 'Zara Rhinestone Suede',
          price: 465000,
          description: "Escarpins en suède ornés de strass, éclat maîtrisé et toucher velours. Une pièce festive au chic assuré.",
          rating: 4.4,
          tips: [
            'Parfait pour soirée avec robe noire sobre',
            'Laisser les strass briller, accessoires discrets'
          ],
          care: [
            'Brosser le suède à sec après usage',
            "Éviter l'eau, utiliser spray protecteur pour suède"
          ]
        },
        {
          image: '/chaussures/femme/Zaranoire/Zara Strappy Heels - Noir.jpeg',
          name: 'Zara Strappy Heels',
          price: 448000,
          description: "Talons à brides minimalistes, jeu de lignes fines et tenue précise. Idéal pour souligner la cheville.",
          rating: 4.2,
          tips: [
            'Idéal avec robe fluide et accessoires métalliques',
            'Jouer sur des teintes neutres pour un look épuré'
          ],
          care: [
            'Vérifier la tension des brides avant sortie',
            "Nettoyer les boucles pour éviter l'oxydation"
          ]
        }
      ];
    }
    if (brandFolder === 'Minelli') {
      return [
        {
          image: '/chaussures/femme/Minelli/Minelli Escarpins - Noir.jpeg',
          name: 'Minelli Escarpins',
          price: 380000,
          description: "Escarpins Minelli au confort étudié, lignes élégantes et talon mesuré. Une valeur sûre du quotidien chic.",
          rating: 4.4,
          tips: [
            'Élégant avec une robe cocktail ou un pantalon tailleur',
            'Accessoiriser avec une pochette minimaliste'
          ],
          care: [
            'Utiliser patins antidérapants si nécessaire',
            'Nourrir le cuir régulièrement'
          ]
        },
        {
          image: '/chaussures/femme/Minelli/Minelli Escarpins - Noir 2.jpeg',
          name: 'Minelli Escarpins 2',
          price: 385000,
          description: "Variante noire à la finition soignée, silhouette sobre et facile à porter. Un allié du vestiaire business.",
          rating: 4.4,
          tips: [
            'Associer à une veste tailleur structurée',
            'Jouer avec des bijoux argentés minimalistes'
          ],
          care: [
            'Utiliser des embauchoirs pour garder la forme',
            'Éviter les surfaces abrasives lors de la marche'
          ]
        },
        {
          image: '/chaussures/femme/Minelli/Minelli Escarpins - Noir 3.jpeg',
          name: 'Minelli Escarpins 3',
          price: 390000,
          description: "Variante noire rehaussée d'une cambrure subtile, allure élancée et attitude sûre.",
          rating: 4.4,
          tips: [
            'Look soirée avec robe midi ou combinaison chic',
            'Contraster avec une ceinture fine'
          ],
          care: [
            'Essuyer délicatement après chaque usage',
            'Protéger les talons avec embouts si besoin'
          ]
        },
        {
          image: '/chaussures/femme/Minelli/Minelli Tulin Bottines Talon - Noir.jpeg',
          name: 'Minelli Bottines Tulin',
          price: 420000,
          description: "Bottines Tulin à talon, tige élancée et ligne nette. Un basique citadin pour rythmer l'entre‑saison.",
          rating: 4.5,
          tips: [
            'Parfait avec un jean skinny ou un trench',
            "Idéal pour la mi-saison et l'hiver",
            'Style urbain chic'
          ],
          care: [
            'Imperméabiliser avant usage',
            'Brosser après exposition à la poussière',
            "Sécher à l'air libre, loin d'une source de chaleur"
          ]
        }
      ];
    }
    if (brandFolder === 'Mango') {
      return [
        {
          image: '/chaussures/femme/Mango/MANGO Ankle Strap Sandal in Nude at Nordstrom, Size 6_5Us.jpeg',
          name: 'Mango Ankle Strap Sandal',
          price: 320000,
          description: "Sandales nude à brides fines, teinte seconde peau et élégance discrète. Un essentiel lumineux.",
          rating: 4.2,
          tips: [
            'Élancer la jambe avec jupe fendue',
            'Associer à des tons nude ou pastel',
            'Accessoires dorés fins pour un rendu chic'
          ],
          care: [
            'Nettoyage doux avec chiffon microfibre',
            "Éviter l'humidité prolongée",
            'Ranger dans sa housse pour préserver les brides'
          ]
        },
        {
          image: '/chaussures/femme/Mango/Mango Strappy Sandals - Nude.jpeg',
          name: 'Mango Strappy Sandals',
          price: 318000,
          description: "Sandales à brides au tracé délicat, féminines et polyvalentes. Un choix facile pour l'été.",
          rating: 4.2,
          tips: [
            'Mettre en valeur les brides avec robe midi',
            'Parfait pour les looks de journée en été',
            "Boucles d'oreilles pendantes subtiles"
          ],
          care: [
            'Essuyer les brides après usage',
            "Éviter contact prolongé avec sable/sel",
            'Ranger avec séparateurs pour éviter frottements'
          ]
        },
        {
          image: '/chaussures/femme/Mango/Mango Strappy Sandals - Nude 2.jpeg',
          name: 'Mango Strappy Sandals 2',
          price: 319000,
          description: "Variante au dessin épuré, lignes allégées et équilibre naturel. Un complément de garde‑robe tout‑terrain.",
          rating: 4.2,
          tips: [
            'Look minimal avec tailleur short',
            "S'accorder à un sac seau clair",
            'Bracelets fins empilés'
          ],
          care: [
            'Nettoyer semelle immédiatement après usage',
            'Éviter chaleur directe pour sécher',
            'Housse respirante recommandée'
          ]
        },
        {
          image: '/chaussures/femme/Mango/Mango Strappy Sandals - Nude 3.jpeg',
          name: 'Mango Strappy Sandals 3',
          price: 321000,
          description: "Variante élancée à l'esthétique minimaliste, jeu de transparences et allure aérienne.",
          rating: 4.2,
          tips: [
            'Jouer la transparence avec matières légères',
            'Associer à veste lin oversize',
            'Collier ras-du-cou discret'
          ],
          care: [
            'Retirer poussière avec brosse douce',
            "Éviter parfums/solvants",
            'Stocker à plat pour éviter déformation'
          ]
        }
      ];
    }
    if (brandFolder === 'Jonak') {
      return [
        {
          image: '/chaussures/femme/Jonak/Chaussures Femme tendance _ Jonak.jpeg',
          name: 'Jonak Tendance',
          price: 280000,
          description: "Modèle Jonak à l'allure tendance, lignes souples et féminité immédiate. Parfait pour rehausser le quotidien.",
          rating: 4.1,
          tips: [
            'Casual chic avec jean droit et chemise fluide',
            'Rehausser avec blazer léger',
            'Accessoires minimalistes pour un look quotidien'
          ],
          care: [
            'Nettoyer avec chiffon doux après usage',
            'Utiliser spray protecteur adapté à la matière',
            "Stocker à l'abri de la lumière directe"
          ]
        },
        {
          image: '/chaussures/femme/Jonak/Chaussures Femme tendance _ Jonak (1).jpeg',
          name: 'Jonak Tendance 2',
          price: 282000,
          description: "Variante à l'équilibre casual‑chic, sobriété des lignes et confort durable.",
          rating: 4.1,
          tips: [
            'Élégant au quotidien avec robe chemise',
            'Associer à sac crossbody pour confort',
            'Jeux de textures (denim, coton, cuir)'
          ],
          care: [
            'Éliminer la poussière avec brosse douce',
            "Éviter l'humidité prolongée",
            'Ranger dans housse respirante'
          ]
        },
        {
          image: '/chaussures/femme/Jonak/Jonak Bottines Santiags Basama - Marron.jpeg',
          name: 'Jonak Santiags Basama',
          price: 300000,
          description: "Bottines santiags au caractère affirmé, pointe effilée et talon biseauté. Un accent western maîtrisé.",
          rating: 4.2,
          tips: [
            'Esprit western avec jean slim et veste en cuir',
            'Jouer le contraste avec robe bohème',
            'Accessoiriser avec ceinture à boucle'
          ],
          care: [
            'Imperméabiliser le cuir régulièrement',
            'Brosser les surpiqûres pour enlever la poussière',
            'Sécher loin de toute source de chaleur'
          ]
        },
        {
          image: '/chaussures/femme/Jonak/Jonak Bottines Western Cuir Basama - Marron.jpeg',
          name: 'Jonak Western Cuir',
          price: 305000,
          description: 'Bottines western Jonak en cuir.',
          rating: 4.2,
          tips: [
            'Cowgirl chic avec jupe midi et cardigan',
            'Superbe avec trench beige ou manteau laine',
            'Mettre en avant la tige avec ourlets courts'
          ],
          care: [
            'Nourrir le cuir pour éviter le craquèlement',
            'Dépoussiérer avec brosse douce après usage',
            'Conserver avec embauchoirs pour maintenir la forme'
          ]
        }
      ];
    }
    return [];
  };
  
  // Fonction pour obtenir toutes les marques disponibles pour la section Femme et Homme
  const getAvailableBrands = () => {
    if (product?.subcategory === 'femme') {
      return [
        { id: 'CritianlouboutinNoire', name: 'Christian Louboutin', folder: 'CritianlouboutinNoire' },
        { id: 'Gucci', name: 'Gucci', folder: 'Gucci' },
        { id: 'PradaBeige', name: 'Prada', folder: 'PradaBeige' },
        { id: 'Zaranoire', name: 'Zara', folder: 'Zaranoire' },
        { id: 'Minelli', name: 'Minelli', folder: 'Minelli' },
        { id: 'Mango', name: 'Mango', folder: 'Mango' },
        { id: 'Jonak', name: 'Jonak', folder: 'Jonak' }
      ];
    } else if (product?.subcategory === 'homme') {
      return [
        { id: 'Balanciaga', name: 'Balenciaga', folder: 'Balanciaga' },
        { id: 'Nike', name: 'Nike', folder: 'Nike' },
        { id: 'Puma', name: 'Puma', folder: 'Puma' },
        { id: 'Gucci', name: 'Gucci', folder: 'Gucci' }
      ];
    }
    return [];
  };
  
  // Fonction pour obtenir les images d'une marque spécifique
  const getBrandImages = (brandFolder) => {
    if (brandFolder === 'CritianlouboutinNoire') {
      return [
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins.jpeg',
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg',
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg',
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg',
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg',
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg'
      ];
    } else if (brandFolder === 'Gucci') {
      return [
        '/chaussures/femme/Gucci/Designer High Heel Sandals _ Block Heel Sandals   _ GUCCI® International.jpeg',
        '/chaussures/femme/Gucci/Designer High Heel Sandals _ Block Heel Sandals   _ GUCCI® US.jpeg',
        '/chaussures/femme/Gucci/Gucci Leather Sandals - Noir.jpeg',
        '/chaussures/femme/Gucci/Gucci Sandals - Noir 3.jpeg',
        '/chaussures/femme/Gucci/Women\'s Designer Luxury High Heels Pumps _ GUCCI® US.jpeg'
      ];
    } else if (brandFolder === 'PradaBeige') {
      return [
        '/chaussures/femme/PradaBeige/Prada Ankle Strap Platform Sandals - Beige.jpeg',
        '/chaussures/femme/PradaBeige/Prada Gold Platform Sandals - Beige.jpeg',
        '/chaussures/femme/PradaBeige/Prada Leather Platform Sandals - Beige.jpeg',
        '/chaussures/femme/PradaBeige/Prada Metallic Platform Sandals - Beige.jpeg',
        '/chaussures/femme/PradaBeige/Prada Paige Platform Sandals - Beige.jpeg',
        '/chaussures/femme/PradaBeige/Prada Sandales - Beige.jpeg',
        '/chaussures/femme/PradaBeige/Prada Suede Sandals - Beige.jpeg'
      ];
    } else if (brandFolder === 'Zaranoire') {
      return [
        '/chaussures/femme/Zaranoire/Zara Ankle Strap Heels - Noir.jpeg',
        '/chaussures/femme/Zaranoire/Zara Classic Heels - Noir.jpeg',
        '/chaussures/femme/Zaranoire/Zara High Heel Platform Slingback Shoes - Noir.jpeg',
        '/chaussures/femme/Zaranoire/Zara Pointed Toe Heels - Noir.jpeg',
        '/chaussures/femme/Zaranoire/Zara Rhinestone Suede Heels - Noir.jpeg',
        '/chaussures/femme/Zaranoire/Zara Strappy Heels - Noir.jpeg'
      ];
    } else if (brandFolder === 'Minelli') {
      return [
        '/chaussures/femme/Minelli/Minelli Escarpins - Noir.jpeg',
        '/chaussures/femme/Minelli/Minelli Escarpins - Noir 2.jpeg',
        '/chaussures/femme/Minelli/Minelli Escarpins - Noir 3.jpeg',
        '/chaussures/femme/Minelli/Minelli Tulin Bottines Talon - Noir.jpeg'
      ];
    } else if (brandFolder === 'Mango') {
      return [
        '/chaussures/femme/Mango/MANGO Ankle Strap Sandal in Nude at Nordstrom, Size 6_5Us.jpeg',
        '/chaussures/femme/Mango/Mango Strappy Sandals - Nude.jpeg',
        '/chaussures/femme/Mango/Mango Strappy Sandals - Nude 2.jpeg',
        '/chaussures/femme/Mango/Mango Strappy Sandals - Nude 3.jpeg'
      ];
    } else if (brandFolder === 'Jonak') {
      return [
        '/chaussures/femme/Jonak/Chaussures Femme tendance _ Jonak.jpeg',
        '/chaussures/femme/Jonak/Chaussures Femme tendance _ Jonak (1).jpeg',
        '/chaussures/femme/Jonak/Jonak Bottines Santiags Basama - Marron.jpeg',
        '/chaussures/femme/Jonak/Jonak Bottines Western Cuir Basama - Marron.jpeg'
      ];
    }
    // Marques Homme
    else if (brandFolder === 'Balanciaga') {
      return [
        '/chaussures/homme/Balanciaga/Blanc/balenciaga-defender-blanc.jpg',
        '/chaussures/homme/Balanciaga/Blanc/balenciaga-speed-blanc.jpg',
        '/chaussures/homme/Balanciaga/Blanc/balenciaga-triple-s-blanc.jpg',
        '/chaussures/homme/Balanciaga/Blanc/balenciaga-track-blanc.jpg',
        '/chaussures/homme/Balanciaga/Noire/balenciaga-defender-noire.jpg',
        '/chaussures/homme/Balanciaga/Noire/balenciaga-speed-noire.jpg',
        '/chaussures/homme/Balanciaga/Noire/balenciaga-triple-s-noire.jpg',
        '/chaussures/homme/Balanciaga/Noire/balenciaga-track-noire.jpg',
        '/chaussures/homme/Balanciaga/Vertolive/balenciaga-defender-vertolive.jpg',
        '/chaussures/homme/Balanciaga/Vertolive/balenciaga-speed-vertolive.jpg',
        '/chaussures/homme/Balanciaga/Vertolive/balenciaga-triple-s-vertolive.jpg',
        '/chaussures/homme/Balanciaga/Vertolive/balenciaga-track-vertolive.jpg'
      ];
    } else if (brandFolder === 'Nike') {
      return [
        '/chaussures/homme/Nike/blanc/nike-air-jordan-1-blanc.jpg',
        '/chaussures/homme/Nike/blanc/nike-air-max-270-blanc.jpg',
        '/chaussures/homme/Nike/blanc/nike-dunk-low-blanc.jpg',
        '/chaussures/homme/Nike/noire/nike-air-jordan-1-noir.jpg',
        '/chaussures/homme/Nike/noire/nike-air-max-270-noir.jpg',
        '/chaussures/homme/Nike/noire/nike-dunk-low-noir.jpg',
        '/chaussures/homme/Nike/vertolive/nike-air-jordan-1-vertolive.jpg',
        '/chaussures/homme/Nike/vertolive/nike-air-max-270-vertolive.jpg',
        '/chaussures/homme/Nike/vertolive/nike-dunk-low-vertolive.jpg'
      ];
    } else if (brandFolder === 'Puma') {
      return [
        '/chaussures/homme/Puma/Blanc/puma-basket-classic-blanc.jpg',
        '/chaussures/homme/Puma/Blanc/puma-cali-sport-blanc.jpg',
        '/chaussures/homme/Puma/Blanc/puma-future-rider-blanc.jpg',
        '/chaussures/homme/Puma/Noir/puma-cali-sport-noire.jpg',
        '/chaussures/homme/Puma/Noir/puma-future-rider-noire.jpg',
        '/chaussures/homme/Puma/Noir/puma-rs-x-noire.jpg',
        '/chaussures/homme/Puma/Vertolive/puma-basket-classic-vertolive.jpg',
        '/chaussures/homme/Puma/Vertolive/puma-cali-sport-vertolive.jpg',
        '/chaussures/homme/Puma/Vertolive/puma-future-rider-vertolive.jpg'
      ];
    }
    return [];
  };
  
  // Fonction pour détecter la couleur d'une image
  const getImageColor = (imagePath) => {
    if (!imagePath) return null;
    const path = imagePath.toLowerCase();
    if (path.includes('blanc')) return 'Blanc';
    if (path.includes('noir') || path.includes('noire')) return 'Noir';
    if (path.includes('vertolive')) return 'Vert olive';
    return null;
  };
  
  // Fonction pour obtenir les images d'une couleur spécifique
  const getImagesByColor = (color) => {
    if (!selectedBrand || !color) return [];
    const allBrandImages = getBrandImages(selectedBrand.folder);
    return allBrandImages.filter(img => getImageColor(img) === color);
  };
  
  // Fonction pour obtenir les détails d'un modèle spécifique
  const getModelDetails = (imagePath) => {
    if (!imagePath) return null;
    const path = imagePath.toLowerCase();
    
    // Détecter le modèle
    let model = '';
    let description = '';
    let price = 0;
    
    if (path.includes('defender')) {
      model = 'Defender';
      description = 'Sneakers Defender avec design futuriste et confort maximal. Parfait pour le style urbain.';
      price = 1800000;
    } else if (path.includes('speed')) {
      model = 'Speed';
      description = 'Baskets Speed légères et dynamiques. Idéales pour les déplacements quotidiens.';
      price = 1600000;
    } else if (path.includes('track')) {
      model = 'Track';
      description = 'Chaussures Track avec technologie avancée. Confort et performance garantis.';
      price = 1900000;
    } else if (path.includes('triple-s')) {
      model = 'Triple S';
      description = 'Modèle iconique Triple S avec semelle épaisse. Style streetwear authentique.';
      price = 2000000;
    }
    
    return { model, description, price };
  };

  // Fonction pour changer de marque
  const handleBrandChange = (brand) => {
    console.log('🔄 Changement de marque vers:', brand.name);
    setSelectedBrand(brand);
    setSelectedImageIdx(0); // Remettre l'image principale à la première position
    
    // Pour Christian Louboutin, chercher les vrais produits
    if (brand.name === 'Christian Louboutin') {
      const brandProducts = allProducts.filter(p => 
        p.brand === brand.name && 
        p.subcategory === 'femme' && 
        p.status === 'approved'
      );
      
      if (brandProducts.length > 0) {
        console.log('✅ Produits Christian Louboutin trouvés:', brandProducts.length);
        setSelectedGalleryProduct(brandProducts[0]);
        return;
      }
    }
    
    // Pour les autres marques (Gucci, Prada, Mango, Jonak, etc.), utiliser les produits synthétiques
    console.log('🔄 Utilisation du produit synthétique pour:', brand.name);
    const brandProduct = buildBrandDisplayProduct(brand);
    if (brandProduct) setSelectedGalleryProduct(brandProduct);
  };
  
  // Initialiser la marque sélectionnée et la couleur pour les produits Femme et Homme
  useEffect(() => {
    if (product?.subcategory === 'femme' || product?.subcategory === 'homme') {
      // Détecter la couleur de l'image cliquée
      if (clickedImage) {
        const imageColor = getImageColor(clickedImage);
        if (imageColor) {
          setSelectedColor(imageColor);
          console.log('🎨 Couleur détectée depuis l\'image cliquée:', imageColor);
        }
      }
      
      // Priorité à l'image cliquée (ex: Gucci) pour déterminer la marque
      if (clickedImage) {
        if (clickedImage.includes('/CritianlouboutinNoire/')) {
          setSelectedBrand({ id: 'CritianlouboutinNoire', name: 'Christian Louboutin', folder: 'CritianlouboutinNoire' });
          return;
        }
        if (clickedImage.includes('/Gucci/')) {
          setSelectedBrand({ id: 'Gucci', name: 'Gucci', folder: 'Gucci' });
          return;
        }
        if (clickedImage.includes('/PradaBeige/')) {
          setSelectedBrand({ id: 'PradaBeige', name: 'Prada', folder: 'PradaBeige' });
          return;
        }
        if (clickedImage.includes('/Zaranoire/')) {
          setSelectedBrand({ id: 'Zaranoire', name: 'Zara', folder: 'Zaranoire' });
          return;
        }
        if (clickedImage.includes('/Minelli/')) {
          setSelectedBrand({ id: 'Minelli', name: 'Minelli', folder: 'Minelli' });
          return;
        }
        if (clickedImage.includes('/Mango/')) {
          setSelectedBrand({ id: 'Mango', name: 'Mango', folder: 'Mango' });
          return;
        }
        if (clickedImage.includes('/Jonak/')) {
          setSelectedBrand({ id: 'Jonak', name: 'Jonak', folder: 'Jonak' });
          return;
        }
        // Marques Homme
        if (clickedImage.includes('/Balanciaga/')) {
          setSelectedBrand({ id: 'Balanciaga', name: 'Balenciaga', folder: 'Balanciaga' });
          return;
        }
        if (clickedImage.includes('/Nike/')) {
          setSelectedBrand({ id: 'Nike', name: 'Nike', folder: 'Nike' });
          return;
        }
        if (clickedImage.includes('/Puma/')) {
          setSelectedBrand({ id: 'Puma', name: 'Puma', folder: 'Puma' });
          return;
        }
      }

      // Sinon, déterminer la marque basée sur le produit
      let brandToSet = null;
      if (product?.brand === 'Christian Louboutin' || product?.image?.includes('CritianlouboutinNoire')) {
        brandToSet = { id: 'CritianlouboutinNoire', name: 'Christian Louboutin', folder: 'CritianlouboutinNoire' };
      } else if (product?.brand === 'Gucci' || product?.image?.includes('Gucci')) {
        brandToSet = { id: 'Gucci', name: 'Gucci', folder: 'Gucci' };
      } else if (product?.brand === 'Prada' || product?.image?.includes('PradaBeige')) {
        brandToSet = { id: 'PradaBeige', name: 'Prada', folder: 'PradaBeige' };
      } else if (product?.brand === 'Zara' || product?.image?.includes('Zaranoire')) {
        brandToSet = { id: 'Zaranoire', name: 'Zara', folder: 'Zaranoire' };
      } else if (product?.brand === 'Minelli' || product?.image?.includes('Minelli')) {
        brandToSet = { id: 'Minelli', name: 'Minelli', folder: 'Minelli' };
      } else if (product?.brand === 'Mango' || product?.image?.includes('Mango')) {
        brandToSet = { id: 'Mango', name: 'Mango', folder: 'Mango' };
      } else if (product?.brand === 'Jonak' || product?.image?.includes('Jonak')) {
        brandToSet = { id: 'Jonak', name: 'Jonak', folder: 'Jonak' };
      } else if (product?.brand === 'Balenciaga' || product?.image?.includes('Balanciaga')) {
        brandToSet = { id: 'Balanciaga', name: 'Balenciaga', folder: 'Balanciaga' };
      } else if (product?.brand === 'Nike' || product?.image?.includes('Nike')) {
        brandToSet = { id: 'Nike', name: 'Nike', folder: 'Nike' };
      } else if (product?.brand === 'Puma' || product?.image?.includes('Puma')) {
        brandToSet = { id: 'Puma', name: 'Puma', folder: 'Puma' };
      }
      
      if (brandToSet) {
        setSelectedBrand(brandToSet);
        console.log('🎯 Marque initialisée:', brandToSet.name);
        if (import.meta.env?.DEV) {
          setTimeout(() => verifyAllFemmeCatalogConsistency(), 0);
        }
      }
    }
  }, [clickedImage, product?.id, product?.subcategory]);
  if (!product) {
    product = products.find((p) => String(p.id) === String(productId) || p.slug === productId);
    if (!product && allProducts) {
      product = allProducts.find((p) => String(p.id) === String(productId) || p.slug === productId);
    }
    
    // Si toujours pas trouvé et que c'est un produit synthétique, utiliser productFromImage
    if (!product && productFromImage) {
      product = productFromImage;
      console.log('🔍 Utilisation du produit synthétique:', product?.name);
    }
    
    console.log('🔍 Produit trouvé par ID:', product?.name || 'Aucun produit trouvé');
  }
  
  // Détecter automatiquement le genre du produit
  const isFemme = product?.subcategory === 'femme';
  const isHomme = product?.subcategory === 'homme';
  const isEnfant = product?.subcategory === 'enfant';
  const isBebe = product?.subcategory === 'bebe';
  
  // Debug: Vérifier la détection de la sous-catégorie
  console.log('🔍 Détection du produit:');
  console.log('📦 Produit:', product?.name);
  console.log('🏷️ Subcategory:', product?.subcategory);
  console.log('👩 isFemme:', isFemme);
  console.log('👨 isHomme:', isHomme);
  console.log('🏪 selectedBrand:', selectedBrand);
  
  // Créer des variantes et tailles fallback (style Amazon) si le produit n'a pas de variantes
  const createFallbackVariants = useMemo(() => {
    if (!product) return [];
    const baseImage = product.image || '/assets/chaussure/blanc1.jpg';
    const euSizes = ['39', '40', '41', '42', '43', '44', '45'];
    
    // Essayer de trouver des images spécifiques à chaque couleur
    const brandName = product.brand?.toLowerCase();
    
    // Images par couleur basées sur les données du contexte
    const colorImages = {
      'Blanc': baseImage,
      'Noir': baseImage,
      'Vert olive': baseImage
    };
    
    // Si on a des produits dans allProducts, essayer de trouver les vraies images
    if (allProducts && brandName) {
      allProducts.forEach(p => {
        const productBrand = p.brand?.toLowerCase();
        const productImage = p.image?.toLowerCase();
        
        if (productBrand === brandName) {
          if (productImage.includes('blanc')) {
            colorImages['Blanc'] = p.image;
          } else if (productImage.includes('noir') || productImage.includes('noire') || productImage.includes('guccinoire')) {
            colorImages['Noir'] = p.image;
          } else if (productImage.includes('vertolive') || productImage.includes('guccirose')) {
            colorImages['Vert olive'] = p.image;
          }
        }
      });
    }
    
    // Si on a une marque sélectionnée (pour les marques statiques), utiliser les images de la galerie
    if (selectedBrand && selectedBrand.folder) {
      const brandImages = getBrandImages(selectedBrand.folder);
      brandImages.forEach(imagePath => {
        const imageLower = imagePath.toLowerCase();
        if (imageLower.includes('blanc')) {
          colorImages['Blanc'] = imagePath;
        } else if (imageLower.includes('noir') || imageLower.includes('noire')) {
          colorImages['Noir'] = imagePath;
        } else if (imageLower.includes('vertolive')) {
          colorImages['Vert olive'] = imagePath;
        }
      });
    }
    
    return [
      { color: 'Blanc', price: product.price || 0, sizes: euSizes, images: [colorImages['Blanc']] },
      { color: 'Noir', price: (product.price || 0) + 10000, sizes: euSizes, images: [colorImages['Noir']] },
      { color: 'Vert olive', price: (product.price || 0) + 20000, sizes: euSizes, images: [colorImages['Vert olive']] }
    ];
  }, [product, allProducts, selectedBrand]);

  // S'assurer que le produit a des variantes (fallback multi-couleurs + tailles EU sinon)
  const productWithVariants = useMemo(() => {
    if (!product) return null;
    return {
      ...product,
      variants: product.variants && product.variants.length > 0 ? product.variants : createFallbackVariants
    };
  }, [product, createFallbackVariants]);

  // Variantes sœurs par couleur (logique Amazon: même modèle, couleurs différentes)
  const colorSiblings = useMemo(() => {
    if (!product || !productWithVariants) return [];
    
    const deriveBaseSlug = (slugOrId) => {
      const value = slugOrId || '';
      if (!value.includes('-')) return value;
      return value.replace(/-[^-]+$/, '');
    };
    
    const prettifyColor = (token) => {
      const map = {
        blanc: 'Blanc',
        blanche: 'Blanc',
        noir: 'Noir',
        noire: 'Noir',
        vertolive: 'Vert olive',
        rouge: 'Rouge',
        bleu: 'Bleu',
        rose: 'Rose',
        guccinoire: 'Noir',
        guccirose: 'Rose'
      };
      return map[token?.toLowerCase()] || (token ? token.charAt(0).toUpperCase() + token.slice(1) : '');
    };
    
    const baseSlug = deriveBaseSlug(product.slug || product.id);
    
    // Trouver tous les produits similaires (même catégorie, même marque, même genre, même modèle de base)
    const colorSiblingsRaw = products.filter(p => {
      // Même catégorie, marque ET genre (subcategory)
      if (p.category !== product.category || p.brand !== product.brand || p.subcategory !== product.subcategory) return false;
      
      // Même modèle de base (slug commence par la même base)
      if ((p.slug || p.id || '').startsWith(baseSlug + '-')) return true;
      
      // Ou produit identique (même ID)
      if (p.id === product.id) return true;
      
      return false;
    });
    
    return colorSiblingsRaw
      .map(p => {
        const slugVal = p.slug || p.id || '';
        const colorToken = slugVal.includes('-') ? slugVal.split('-').pop() : '';
        
        // Récupérer toutes les images disponibles pour ce produit
        let productImages = [];
        if (p.image) productImages.push(p.image);
        if (p.images && Array.isArray(p.images)) productImages.push(...p.images);
        if (p.variants && Array.isArray(p.variants)) {
          p.variants.forEach(v => {
            if (v.images && Array.isArray(v.images)) {
              productImages.push(...v.images);
            }
          });
        }
        
        return {
          id: p.id,
          slug: slugVal,
          colorToken,
          colorLabel: prettifyColor(colorToken),
          image: productImages[0] || p.image, // Image principale
          allImages: productImages // Toutes les images disponibles
        };
      })
      // Éviter doublons de couleur
      .reduce((acc, item) => {
        if (!acc.some(x => x.colorToken === item.colorToken)) acc.push(item);
        return acc;
      }, []);
  }, [product, products, productWithVariants]);

  // Regrouper toutes les images disponibles pour cette couleur (toutes variantes du produit courant)
  const galleryImages = useMemo(() => {
    if (!productWithVariants) return [];
    
    // Pour les produits avec une marque sélectionnée (Femme ou Homme)
    if ((product?.subcategory === 'femme' || product?.subcategory === 'homme') && selectedBrand) {
      console.log('🔍 Affichage des images de la marque sélectionnée:', selectedBrand.name);
      
      let finalImages = [];
      
      // Si une couleur est sélectionnée, afficher seulement les images de cette couleur
      if (selectedColor) {
        finalImages = currentColorImages;
        console.log(`🎨 Images de la couleur "${selectedColor.name}":`, finalImages);
      } else {
        // Sinon, afficher toutes les images de la marque
        const catalog = getBrandCatalog(selectedBrand.folder);
        console.log('📁 Catalog pour', selectedBrand.folder, ':', catalog);
        console.log('📁 Catalog length:', catalog ? catalog.length : 0);
        
        if (catalog && catalog.length > 0) {
          finalImages = catalog.map(i => i.image);
          console.log('📁 Utilisation du catalog:', finalImages);
        } else {
          finalImages = getBrandImages(selectedBrand.folder);
          console.log('📁 Utilisation de getBrandImages:', finalImages);
        }
        
        // Si toujours pas d'images, forcer l'utilisation de getBrandImages
        if (finalImages.length === 0) {
          console.log('⚠️ Aucune image trouvée, forçage de getBrandImages');
          finalImages = getBrandImages(selectedBrand.folder);
          console.log('📁 Images après forçage:', finalImages);
        }
        console.log('📁 Toutes les images de la marque:', finalImages);
      }
      
      // Si une image spécifique a été cliquée, la mettre en première position
      if (clickedImage && finalImages.includes(clickedImage)) {
        console.log('🖼️ Image cliquée trouvée, mise en première position:', clickedImage);
        finalImages = finalImages.filter(img => img !== clickedImage);
        finalImages.unshift(clickedImage);
      }
      
      console.log('📸 Images finales de la galerie:', finalImages);
      return finalImages;
    }
    
    // Pour les autres produits, logique normale
    let allImages = [];
    
    // 1. Images du produit principal (si c'est la bonne couleur)
    if (product?.image) {
      allImages.push(product.image);
    }
    
    // 2. Images de la variante sélectionnée (couleur actuelle) - utiliser une valeur par défaut
    const currentVariant = productWithVariants?.variants?.[0];
    if (currentVariant?.images && Array.isArray(currentVariant.images)) {
      allImages.push(...currentVariant.images);
    }
    
    // 3. Images supplémentaires du produit (si elles existent et correspondent à la couleur)
    if (product?.images && Array.isArray(product.images)) {
      // Filtrer les images par couleur si possible
      allImages.push(...product.images);
    }
    
    // 4. Images des variantes sœurs de la MÊME couleur (pas toutes les couleurs)
    if (colorSiblings.length > 0) {
      colorSiblings.forEach(sibling => {
        // Vérifier si c'est la même couleur que celle sélectionnée
        if (sibling.colorLabel === currentVariant?.color) {
          if (sibling.allImages && Array.isArray(sibling.allImages)) {
            allImages.push(...sibling.allImages);
          } else if (sibling.image) {
            allImages.push(sibling.image);
          }
        }
      });
    }
    
    // Supprimer les doublons et filtrer les images valides
    let finalImages = Array.from(new Set(allImages)).filter(Boolean);
    
    // Si une image spécifique a été cliquée, la mettre en première position
    if (clickedImage && finalImages.includes(clickedImage)) {
      console.log('🖼️ Image cliquée trouvée, mise en première position:', clickedImage);
      finalImages = finalImages.filter(img => img !== clickedImage);
      finalImages.unshift(clickedImage);
    } else if (clickedImage) {
      console.log('⚠️ Image cliquée non trouvée dans la liste:', clickedImage);
      console.log('Images disponibles:', finalImages);
    }
    
    console.log('📸 Images finales de la galerie:', finalImages);
    
    return finalImages;
  }, [productWithVariants, product, colorSiblings, clickedImage, selectedBrand, selectedColor]);

  // Gestion des variantes
  const [selectedVariant, setSelectedVariant] = useState(() => {
    return productWithVariants?.variants?.[0] || null;
  });
  
  // Si une image spécifique a été cliquée, commencer par cette image
  const [selectedImageIdx, setSelectedImageIdx] = useState(() => {
    // Si une image cliquée existe, elle sera en première position (index 0)
    // Sinon, commencer par la première image (index 0)
    return 0;
  });
  const [selectedSize, setSelectedSize] = useState(() => {
    return selectedVariant?.sizes?.[0] || 'M';
  });
  
  // Produit sélectionné dans la galerie (pour changer les infos quand on clique sur une miniature)
  const [selectedGalleryProduct, setSelectedGalleryProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  // Questions/Réponses mock
  const [questions, setQuestions] = useState([
    { user: 'Fatou B.', question: 'Est-ce que la chaussure taille grand ?', date: '2024-01-21', answer: 'Elle taille normalement, prenez votre pointure habituelle.' },
    { user: 'Moussa K.', question: 'Est-elle imperméable ?', date: '2024-01-19', answer: 'Elle résiste à la pluie légère mais n\'est pas 100% imperméable.' }
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  // Panier et sidebar
  const { addToCart, cartItems, setShowCartSidebar, stockMessages } = useCart();

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });
  const addToWishlist = (item) => {
    const exists = wishlist.some(w => w.id === item.id && w.color === item.color && w.size === item.size);
    if (!exists) {
      const updated = [...wishlist, item];
      setWishlist(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      alert('Produit ajouté à votre liste de souhaits !');
    } else {
      alert('Ce produit est déjà dans votre liste de souhaits.');
    }
  };

  // Reçu cadeau
  const [giftReceipt, setGiftReceipt] = useState(false);
  const giftInfo = "Un reçu cadeau permet d'offrir ce produit sans afficher le prix dans le colis. Pratique pour les cadeaux !";

  // Quand on change de variante, on remet l'image principale à la première
  const handleVariantClick = (variant) => {
    console.log('Changement de variante vers:', variant.color);
    setSelectedVariant(variant);
    setSelectedImageIdx(0);
    setSelectedSize(variant?.sizes?.[0] || 'M');
    setSelectedGalleryProduct(null); // Réinitialiser la sélection de la galerie
  };

  // Produits similaires
  const similarProducts = useMemo(() => {
    if (!product) return [];
    
    // Pour les produits femme, afficher tous les produits femme disponibles
    if (product?.subcategory === 'femme') {
      const femmeProducts = allProducts.filter(p => 
        p.id !== product.id && 
        p.subcategory === 'femme' &&
        p.status === 'approved' &&
        p.visible === true
      );
      
      console.log(`👩 Produits femme disponibles: ${femmeProducts.length}`);
      console.log('👩 Détails des produits femme:', femmeProducts.map(p => ({ id: p.id, name: p.name, status: p.status, visible: p.visible })));
      return femmeProducts;
    }
    
    // Pour les produits homme, afficher tous les produits homme disponibles
    if (product?.subcategory === 'homme') {
      const hommeProducts = allProducts.filter(p => 
        p.id !== product.id && 
        p.subcategory === 'homme' &&
        p.status === 'approved' &&
        p.visible === true
      );
      
      console.log(`👨 Produits homme disponibles: ${hommeProducts.length}`);
      return hommeProducts;
    }
    
    // Pour les autres catégories, logique normale
    const similar = allProducts.filter(p => 
      p.id !== product.id && 
      p.category === product.category && 
      p.subcategory === product.subcategory &&
      p.status === 'approved' &&
      p.visible === true
    );
    
    return similar;
  }, [product, allProducts]);
  
  // Bloc fréquemment achetés ensemble (exemple simplifié)
  const frequentlyBoughtTogether = useMemo(() => {
    if (!product || !similarProducts) return [];
    return [product, ...similarProducts.slice(0, 2)];
  }, [product, similarProducts]);
  
  // Sélection des produits à acheter ensemble
  const [selectedTogether, setSelectedTogether] = useState([]);
  
  // Sélection des produits similaires (style Amazon)
  const [selectedSimilarProducts, setSelectedSimilarProducts] = useState([]);
  
  // Gestion des produits à acheter ensemble
  const handleToggleTogether = (productId) => {
    setSelectedTogether(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  // Gestion des produits similaires (style Amazon)
  const handleSimilarProductToggle = (productId) => {
    setSelectedSimilarProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  // Calcul du total des produits similaires sélectionnés
  const similarProductsTotal = useMemo(() => {
    return selectedSimilarProducts.reduce((total, productId) => {
      const product = similarProducts.find(p => p.id === productId);
      return total + (product?.price || 0);
    }, 0);
  }, [selectedSimilarProducts, similarProducts]);
  
  // Calcul des économies (exemple: 5% de réduction pour 2+ produits)
  const similarProductsSavings = useMemo(() => {
    if (selectedSimilarProducts.length < 2) return 0;
    const discount = 0.05; // 5% de réduction
    return similarProductsTotal * discount;
  }, [selectedSimilarProducts.length, similarProductsTotal]);
  
  // Ajouter tous les produits similaires sélectionnés au panier
  const handleAddSelectedSimilarProducts = () => {
    selectedSimilarProducts.forEach(productId => {
      const product = similarProducts.find(p => p.id === productId);
      if (product) {
        addToCart(product, 1);
        console.log(`🛒 Produit similaire ajouté au panier: ${product.name}`);
      }
    });
    
    // Afficher une notification de succès
    console.log(`✅ ${selectedSimilarProducts.length} produits similaires ajoutés au panier`);
    
    // Vider la sélection
    setSelectedSimilarProducts([]);
  };
  
  // Utilitaire: dériver l'étiquette de couleur depuis le slug/id du produit
  const deriveProductColorLabel = (p) => {
    const value = (p?.slug || p?.id || '').toLowerCase();
    const token = value.includes('-') ? value.split('-').pop() : value;
    const map = {
      blanc: 'Blanc',
      blanche: 'Blanc',
      noir: 'Noir',
      noire: 'Noir',
      vertolive: 'Vert olive',
      guccinoire: 'Noir',
      guccirose: 'Rose',
    };
    return map[token] || (token ? token.charAt(0).toUpperCase() + token.slice(1) : '');
  };

  // Mettre à jour les états quand les données changent
  useEffect(() => {
    if (productWithVariants?.variants?.length > 0) {
      const productColor = deriveProductColorLabel(product);
      const matchingVariant = productWithVariants.variants.find(v => v.color?.toLowerCase() === productColor.toLowerCase());
      const nextVariant = matchingVariant || productWithVariants.variants[0];
      setSelectedVariant(nextVariant);
      setSelectedSize(nextVariant?.sizes?.[0] || 'M');
      // Réinitialiser la sélection de la galerie quand on change de variante
      setSelectedImageIdx(0);
      setSelectedGalleryProduct(null);
    }
  }, [productWithVariants, product]);
  
  useEffect(() => {
    if (frequentlyBoughtTogether.length > 0) {
      setSelectedTogether(frequentlyBoughtTogether.map(p => p.id));
    }
  }, [frequentlyBoughtTogether]);
  
  // Réinitialiser la sélection quand on change de couleur
  useEffect(() => {
    setSelectedImageIdx(0);
    setSelectedGalleryProduct(null);
  }, [selectedVariant?.color]);
  
  // Fonction pour obtenir le nom du dossier de couleur selon la marque
  const getColorFolderName = (brand, color) => {
    const brandLower = brand?.toLowerCase();
    const colorLower = color?.toLowerCase();
    
    // Mapping spécifique par marque
    if (brandLower === 'nike') {
      if (colorLower === 'blanc') return 'blanc';
      if (colorLower === 'noir') return 'noire';
      if (colorLower === 'vert olive') return 'vertolive';
    } else if (brandLower === 'balenciaga') {
      if (colorLower === 'blanc') return 'Blanc';
      if (colorLower === 'noir') return 'Noire';
      if (colorLower === 'vert olive') return 'Vertolive';
    } else if (brandLower === 'puma') {
      if (colorLower === 'blanc') return 'Blanc';
      if (colorLower === 'noir') return 'Noir';
      if (colorLower === 'vert olive') return 'Vertolive';
    } else if (brandLower === 'gucci') {
      if (colorLower === 'blanc') return 'Blanc';
      if (colorLower === 'noir') return 'Guccinoire';
      if (colorLower === 'vert olive') return 'Guccirose';
    }
    
    // Fallback générique
    return colorLower;
  };

  // Créer une galerie dynamique basée sur la variante sélectionnée
  const dynamicGalleryImages = useMemo(() => {
    if (!selectedVariant || !product) return [];
    
    // Pour Christian Louboutin, ne pas utiliser cette logique de recherche par couleur
    if (product.brand === 'Christian Louboutin') {
      return [];
    }
    
    let variantImages = [];
    
    // D'abord, utiliser les images de la variante sélectionnée si elles existent
    if (selectedVariant.images && Array.isArray(selectedVariant.images)) {
      variantImages.push(...selectedVariant.images);
    }
    
    // Récupérer tous les produits de la même marque et couleur
    const brandName = product.brand?.toLowerCase();
    const colorName = selectedVariant.color?.toLowerCase();
    const colorFolderName = getColorFolderName(product.brand, selectedVariant.color);
    
    console.log('Recherche d\'images pour:', { brandName, colorName, colorFolderName, productName: product.name });
    
    if (brandName && colorName && allProducts) {
      // Trouver tous les produits de la même marque et couleur EXACTE
      const sameColorProducts = allProducts.filter(p => {
        const productBrand = p.brand?.toLowerCase();
        const productImage = p.image?.toLowerCase();
        
        // Vérifier que c'est la même marque
        if (productBrand !== brandName) return false;
        
        // Vérifier que l'image contient la couleur exacte selon les fichiers
        if (colorName === 'blanc' && productImage.includes('blanc')) return true;
        if (colorName === 'noir' && (productImage.includes('noir') || productImage.includes('noire') || productImage.includes('guccinoire'))) return true;
        if (colorName === 'vert olive' && (productImage.includes('vertolive') || productImage.includes('guccirose'))) return true;
        
        return false;
      });
      
      console.log('Produits trouvés pour cette couleur:', sameColorProducts.map(p => ({ name: p.name, image: p.image })));
      
      // Récupérer toutes les images de ces produits
      sameColorProducts.forEach(p => {
        if (p.image && !variantImages.includes(p.image)) {
          variantImages.push(p.image);
        }
        // Ajouter aussi les images supplémentaires si elles existent
        if (p.images && Array.isArray(p.images)) {
          p.images.forEach(img => {
            if (!variantImages.includes(img)) {
              variantImages.push(img);
            }
          });
        }
      });
      
      // Ajouter l'image principale du produit actuel si elle correspond à la couleur
      if (product.image && !variantImages.includes(product.image)) {
        const productImage = product.image.toLowerCase();
        const shouldInclude = 
          (colorName === 'blanc' && productImage.includes('blanc')) ||
          (colorName === 'noir' && (productImage.includes('noir') || productImage.includes('noire') || productImage.includes('guccinoire'))) ||
          (colorName === 'vert olive' && (productImage.includes('vertolive') || productImage.includes('guccirose')));
        
        if (shouldInclude) {
          variantImages.unshift(product.image);
        }
      }
      
      // Ajouter les images supplémentaires du produit actuel si elles correspondent à la couleur
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach(img => {
          if (!variantImages.includes(img)) {
            const productImage = img.toLowerCase();
            const shouldInclude = 
              (colorName === 'blanc' && productImage.includes('blanc')) ||
              (colorName === 'noir' && (productImage.includes('noir') || productImage.includes('noire') || productImage.includes('guccinoire'))) ||
              (colorName === 'vert olive' && (productImage.includes('vertolive') || productImage.includes('guccirose')));
            
            if (shouldInclude) {
              variantImages.push(img);
            }
          }
        });
      }
    }
    
    console.log('Images trouvées pour la couleur', colorName, ':', variantImages);
    
    // Si aucune image trouvée, essayer de trouver des produits avec des noms de couleurs similaires
    if (variantImages.length === 0 && brandName && colorName && allProducts) {
      console.log('Aucune image trouvée pour la couleur:', colorName, 'marque:', brandName);
      
      // Debug: afficher tous les produits de cette marque
      const allBrandProducts = allProducts.filter(p => p.brand?.toLowerCase() === brandName);
      console.log('Produits de la marque:', allBrandProducts.map(p => ({ name: p.name, image: p.image })));
    }
    
    return Array.from(new Set(variantImages)).filter(Boolean);
  }, [selectedVariant, product, allProducts]);
  
  // Créer un mapping des images vers les produits
  const imageToProductMapping = useMemo(() => {
    if (!product) return {};
    
    const mapping = {};

    // Cas 1: Produits Femme avec une marque sélectionnée
    if (product?.subcategory === 'femme' && selectedBrand) {
      const brandImages = getBrandImages(selectedBrand.folder) || [];
      const brandProduct = buildBrandDisplayProduct(selectedBrand);
      brandImages.forEach((img) => {
        mapping[img] = brandProduct;
      });
      return mapping;
    }
    
    // Mapping spécial pour Christian Louboutin
    if (product.brand === 'Christian Louboutin') {
      const christianLouboutinMapping = {
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins.jpeg': 'cl-escarpins-noir-001',
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg': 'cl-heels-classic-002',
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg': 'cl-heels-collection-speciale-003',
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg': 'cl-heels-edition-limitee-004',
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg': 'cl-heels-design-exclusif-005',
        '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg': 'cl-heels-collection-premium-006'
      };
      
      // Trouver les produits correspondants dans allProducts
      Object.entries(christianLouboutinMapping).forEach(([imagePath, productId]) => {
        const foundProduct = allProducts?.find(p => p.id === productId);
        console.log(`🔍 Recherche du produit ${productId} pour l'image ${imagePath.split('/').pop()}: ${foundProduct ? '✅ Trouvé' : '❌ Non trouvé'}`);
        if (foundProduct) {
          mapping[imagePath] = foundProduct;
          console.log(`✅ Mapping créé: ${imagePath.split('/').pop()} -> ${foundProduct.name}`);
        } else {
          console.log(`❌ Produit non trouvé: ${productId}`);
        }
      });
      
      return mapping;
    }
    
    // Mapping pour les autres marques (logique existante)
    const brandName = product.brand?.toLowerCase();
    const colorName = selectedVariant?.color?.toLowerCase();
    
    if (brandName && colorName && allProducts) {
      // Trouver tous les produits de la même marque et couleur EXACTE
      const sameColorProducts = allProducts.filter(p => {
        const productBrand = p.brand?.toLowerCase();
        const productImage = p.image?.toLowerCase();
        
        // Vérifier que c'est la même marque
        if (productBrand !== brandName) return false;
        
        // Vérifier que l'image contient la couleur exacte selon les fichiers
        if (colorName === 'blanc' && productImage.includes('blanc')) return true;
        if (colorName === 'noir' && (productImage.includes('noir') || productImage.includes('noire'))) return true; // Fichiers "noir" et "noire"
        if (colorName === 'vert olive' && productImage.includes('vertolive')) return true; // Fichiers "vertolive"
        if (colorName === 'guccinoire' && productImage.includes('guccinoire')) return true;
        if (colorName === 'guccirose' && productImage.includes('guccirose')) return true;
        
        return false;
      });
      
      // Créer le mapping image -> produit
      sameColorProducts.forEach(p => {
        if (p.image) {
          mapping[p.image] = p;
        }
      });
      
      // Ajouter le produit principal pour son image principale si elle correspond à la couleur
      if (product.image) {
        const productImage = product.image.toLowerCase();
        const shouldInclude = 
          (colorName === 'blanc' && productImage.includes('blanc')) ||
          (colorName === 'noir' && (productImage.includes('noir') || productImage.includes('noire'))) || // Fichiers "noir" et "noire"
          (colorName === 'vert olive' && productImage.includes('vertolive')) || // Fichiers "vertolive"
          (colorName === 'guccinoire' && productImage.includes('guccirose')) ||
          (colorName === 'guccirose' && productImage.includes('guccirose'));
        
        if (shouldInclude) {
          mapping[product.image] = product;
        }
      }
    }
    
    return mapping;
  }, [product, allProducts, selectedVariant, selectedBrand]);
  
  // Log pour déboguer le mapping Christian Louboutin
  if (product?.brand === 'Christian Louboutin') {
    console.log('🔍 Mapping Christian Louboutin:', imageToProductMapping);
    console.log('📸 Images de la galerie:', galleryImages);
  }
  
  // Mettre à jour la sélection du produit quand la galerie change
  useEffect(() => {
    // Pour les produits Femme avec marque sélectionnée, caler aussi le displayProduct sur la marque
    if (product?.subcategory === 'femme' && selectedBrand) {
      const brandProduct = buildBrandDisplayProduct(selectedBrand);
      if (brandProduct) setSelectedGalleryProduct(brandProduct);
      return;
    }
    // Sinon, tenter de déduire un produit depuis la première image
    const currentImages = dynamicGalleryImages;
    if (currentImages.length > 0 && imageToProductMapping[currentImages[0]]) {
      setSelectedGalleryProduct(imageToProductMapping[currentImages[0]]);
    }
  }, [dynamicGalleryImages.length, selectedBrand?.id, product?.subcategory]);
  
  // Fonction pour gérer le clic sur une miniature
  const handleThumbnailClick = (index) => {
    console.log('🖱️ Clic sur miniature:', index);
    setSelectedImageIdx(index);
    
    // Si produit Femme avec marque sélectionnée, on fixe directement le produit d'affichage à la marque
    if (product?.subcategory === 'femme' && selectedBrand) {
      const brandProduct = buildBrandDisplayProduct(selectedBrand);
      if (brandProduct) setSelectedGalleryProduct(brandProduct);
      return;
    }
    
    // Sinon, récupérer le produit correspondant à cette image via le mapping
    const currentImages = product?.subcategory === 'femme' && selectedBrand ? galleryImages : dynamicGalleryImages;
    const selectedImage = currentImages[index];
    console.log('📸 Image sélectionnée:', selectedImage);
    console.log('📸 Nom du fichier:', selectedImage?.split('/').pop());
    console.log('🗺️ Mapping disponible:', imageToProductMapping[selectedImage]);
    console.log('🗺️ Toutes les clés du mapping:', Object.keys(imageToProductMapping));
    
    if (selectedImage && imageToProductMapping[selectedImage]) {
      const selectedProduct = imageToProductMapping[selectedImage];
      console.log('✅ Produit trouvé:', selectedProduct.name, 'Prix:', selectedProduct.price);
      setSelectedGalleryProduct(selectedProduct);
    } else {
      console.error('❌ Aucun produit trouvé pour l\'image:', selectedImage);
      console.error('❌ Image non trouvée dans le mapping');
      
      // Vérifier si l'image existe dans le mapping avec une correspondance partielle
      const matchingKey = Object.keys(imageToProductMapping).find(key => 
        key.includes(selectedImage?.split('/').pop())
      );
      if (matchingKey) {
        console.log('🔍 Correspondance partielle trouvée:', matchingKey);
        const selectedProduct = imageToProductMapping[matchingKey];
        console.log('✅ Produit trouvé par correspondance partielle:', selectedProduct.name);
        setSelectedGalleryProduct(selectedProduct);
      }
    }
  };

  // Calculer le total des produits achetés ensemble
  const togetherTotal = useMemo(() => {
    if (!frequentlyBoughtTogether || !selectedTogether) return 0;
    return frequentlyBoughtTogether
    .filter(p => selectedTogether.includes(p.id))
    .reduce((sum, p) => sum + (p.variants ? p.variants[0].price : p.price || 0), 0);
  }, [frequentlyBoughtTogether, selectedTogether]);

  // Ajouter au panier (produit principal ou groupé)
  const handleAddToCart = async (qty = 1) => {
    const newItem = {
      id: product?.id,
      name: product?.name,
      price: selectedVariant?.price || 0,
      size: selectedSize,
      color: selectedVariant?.color || 'Standard',
      qty,
      image: selectedVariant?.images?.[selectedImageIdx] || product?.image, // image de la variante sélectionnée
      gift: giftReceipt,
      stock: product?.stock ?? 0,
      // Ajouter les informations de catégorisation pour le backend de stock
      subcategory: product?.subcategory,
      category: product?.category
    };
    
    const result = await addToCart(newItem, qty);
    if (result.success) {
      setShowCartSidebar(true);
    }
  };
  
  // Ajouter tous les produits sélectionnés ensemble
  const handleAddTogether = async () => {
    const items = frequentlyBoughtTogether.filter(p => selectedTogether.includes(p.id));
    
    for (const item of items) {
      const cartItem = {
        id: item.id,
        name: item.name,
        price: item.variants ? item.variants[0].price : item.price,
        size: item.variants ? item.variants[0].sizes[0] : 'M',
        color: item.variants ? item.variants[0].color : 'Standard',
        qty: 1,
        image: item.variants ? item.variants[0].images[0] : item.image,
        gift: false,
        stock: item.stock ?? product?.stock ?? 0
      };
      
      await addToCart(cartItem, 1);
    }
    
    setShowCartSidebar(true);
  };

  // Acheter maintenant (redirection vers le panier)
  const handleBuyNow = async () => {
    const result = await handleAddToCart(quantity);
    if (result) {
      navigate('/cart');
    }
  };

    // Créer un objet représentant le produit à acheter immédiatement
    const buyNowItem = {
    id: product?.id,
    name: product?.name,
    price: selectedVariant?.price || 0,
      size: selectedSize,
    color: selectedVariant?.color || 'Standard',
      qty: quantity,
    image: selectedVariant?.images?.[selectedImageIdx] || product?.image,
      gift: giftReceipt
  };

  // Avis clients mock
  const avisClients = [
    {
      user: 'Mariama D.',
      rating: 5,
      date: '2024-01-20',
      text: 'Superbes chaussures, très confortables et stylées !',
      photos: [selectedVariant?.images?.[0] || product?.image]
    },
    {
      user: 'Ibrahim K.',
      rating: 4,
      date: '2024-01-18',
      text: 'Bonne qualité, taille un peu grand. Livraison rapide.',
      photos: [selectedVariant?.images?.[1] || selectedVariant?.images?.[0] || product?.image]
    }
  ];

  // Pagination des avis
  const [avisPage, setAvisPage] = useState(1);
  const avisParPage = 5;
  const avisAffiches = avisClients.slice((avisPage - 1) * avisParPage, avisPage * avisParPage);
  const avisTotalPages = Math.ceil(avisClients.length / avisParPage);


  // Vérification du produit après tous les hooks
  if (!product || !productWithVariants) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: 80,
          fontSize: 22,
          color: "#dc3545",
        }}
      >
        Produit non trouvé
      </div>
    );
  }

  // Produit à afficher: priorité à la marque sélectionnée (UX demandé),
  // sinon produit sélectionné via galerie, sinon produit source
  // Si produit Femme et marque sélectionnée: afficher les métadonnées de l'image miniature active (catalogue)
  let displayProduct = selectedGalleryProduct || product;
  if (product?.subcategory === 'femme' && selectedBrand) {
    const catalog = getBrandCatalog(selectedBrand.folder);
    // IMPORTANT: utiliser l'ordre des images de la galerie (qui place l'image cliquée en premier)
    const orderedImages = galleryImages && galleryImages.length > 0
      ? galleryImages
      : ((catalog && catalog.length > 0) ? catalog.map(i => i.image) : getBrandImages(selectedBrand.folder));
    const currentImage = orderedImages[selectedImageIdx] || orderedImages[0];
    const meta = (catalog || []).find(i => i.image === currentImage);
    const base = buildBrandDisplayProduct(selectedBrand) || product;
    const tc = getTipsCareForImage(currentImage, base?.brand);
    const tips = (meta && meta.tips) ? meta.tips : tc.tips;
    const care = (meta && meta.care) ? meta.care : tc.care;
    if (meta) {
      displayProduct = { ...base, name: meta.name, price: meta.price, description: meta.description, rating: meta.rating, tips, care };
    } else {
      displayProduct = { ...base, tips, care };
    }
  }

  return (
    <>
      <div className="container py-5" style={{ maxWidth: 1300, paddingBottom: 0 }}>
        <div className="row g-4 align-items-start">
          {/* Galerie d'images à gauche */}
          <div className="col-md-4">
            <div className="d-flex flex-row flex-md-column gap-2 align-items-start">
              {/* Galerie verticale : images de la couleur sélectionnée */}
              <div className="d-flex flex-md-column flex-row gap-2 align-items-center">
                {(() => {
                  const imagesToShow = product?.subcategory === 'femme' && selectedBrand ? galleryImages : dynamicGalleryImages;
                  console.log('🔍 Images à afficher:', imagesToShow.length, 'pour la marque:', selectedBrand?.name || product?.brand);
                  return imagesToShow.map((img, idx) => (
                    <img
                      key={img}
                      src={img}
                      alt={(selectedVariant?.color || product?.name) + ' ' + (idx + 1)}
                      className={`rounded border ${selectedImageIdx === idx ? 'border-primary' : 'border-light'}`}
                      style={{ width: 56, height: 56, objectFit: 'cover', cursor: 'pointer', background: '#fff' }}
                      onClick={() => handleThumbnailClick(idx)}
                      onError={(e) => {
                        e.target.src = '/assets/chaussure/blanc1.jpg'; // Image de fallback
                      }}
                    />
                  ));
                })()}
              </div>
              {/* Image principale */}
              <div style={{ flex: 1, textAlign: 'center', position: 'relative', minWidth: 0 }}>
                <img
                  src={(product?.subcategory === 'femme' && selectedBrand ? galleryImages : dynamicGalleryImages)[selectedImageIdx] || (product?.subcategory === 'femme' && selectedBrand ? galleryImages : dynamicGalleryImages)[0] || product?.image}
                  alt={displayProduct?.name || product?.name}
                  className="img-fluid mb-2"
                  style={{ maxHeight: 340, objectFit: 'contain', borderRadius: 8, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
                  onError={(e) => {
                    e.target.src = '/assets/chaussure/blanc1.jpg'; // Image de fallback
                  }}
                />
              </div>
            </div>
          </div>
          {/* Infos produit au centre */}
          <div className="col-md-5">
            <h2 className="fw-bold mb-2" style={{ color: '#2563eb' }}>{displayProduct?.name}</h2>
            
            {/* Détails du modèle sélectionné */}
            {((product?.subcategory === 'femme' || product?.subcategory === 'homme') && selectedBrand && dynamicGalleryImages[selectedImageIdx]) && (() => {
              const currentImage = dynamicGalleryImages[selectedImageIdx];
              const modelDetails = getModelDetails(currentImage);
              return modelDetails ? (
                <div className="mb-3 p-3 bg-light rounded">
                  <h5 className="fw-bold mb-2" style={{ color: '#2563eb' }}>Modèle : {modelDetails.model}</h5>
                  <p className="mb-2 text-muted">{modelDetails.description}</p>
                  <div className="d-flex align-items-center">
                    <span className="fw-bold text-danger me-3" style={{ fontSize: 20 }}>{formatGNF(modelDetails.price)}</span>
                    <span className="badge bg-primary">Modèle exclusif</span>
                  </div>
                </div>
              ) : null;
            })()}
            
            <div className="mb-2 d-flex align-items-center" style={{ fontSize: 15 }}>
              {renderStars(displayProduct?.rating || 0)}
              <span className="ms-2 text-primary fw-bold">{displayProduct?.rating || 0}</span>
              <span className="ms-2 text-muted">({displayProduct?.reviewCount || 0} avis)</span>
            </div>
            <div className="mb-3">
              <span className="fw-bold text-danger" style={{ fontSize: 28 }}>{formatGNF(displayProduct?.price || selectedVariant?.price || 0)}</span>
              {displayProduct?.originalPrice && (
                <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: 18 }}>{formatGNF(displayProduct.originalPrice)}</span>
              )}
              {displayProduct?.discount && displayProduct.discount > 0 && (
                <span className="badge bg-success ms-2">-{displayProduct.discount}%</span>
              )}
            </div>
            <div className="mb-3">
              <span className="badge bg-info me-2">{displayProduct?.subcategory === 'femme' ? 'Femme' : displayProduct?.subcategory === 'homme' ? 'Homme' : displayProduct?.subcategory || 'Général'}</span>
              <span className="badge bg-success">{displayProduct?.category || 'Général'}</span>
            </div>
            <div className="mb-3">
              <span className="text-success fw-bold">{displayProduct?.availability || 'En stock'}</span>
              <span className="ms-3 text-info">{displayProduct?.deliveryDate || 'Livraison gratuite demain'}</span>
            </div>
            {/* Sélecteurs marque/taille/quantité */}
            {/* Sélecteur de marques (pour produits Femme) */}
            {(product?.subcategory === 'femme' || product?.brand === 'Christian Louboutin') && (
              <div className="mb-3">
                <label className="form-label fw-bold mb-2">Marques disponibles :</label>
                {console.log('✅ Section Marques disponibles affichée')}
                <div className="d-flex gap-2 flex-wrap">
                  {getAvailableBrands().map((brand) => (
                    <div
                      key={brand.id}
                      className={`border rounded p-2 ${selectedBrand?.id === brand.id ? 'border-primary border-3' : 'border-light'}`}
                      style={{ 
                        cursor: 'pointer', 
                        minWidth: 80,
                        backgroundColor: selectedBrand?.id === brand.id ? '#f8f9fa' : 'white'
                      }}
                      title={brand.name}
                      onClick={() => handleBrandChange(brand)}
                    >
                      <div className="text-center">
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600',
                          color: selectedBrand?.id === brand.id ? '#0d6efd' : '#333'
                        }}>
                          {brand.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sélecteur de couleur (pour produits Homme avec marque sélectionnée) */}
            {product?.subcategory === 'homme' && selectedBrand && availableColors.length > 0 && (
              <div className="mb-3">
                <label className="form-label fw-bold mb-2">Couleurs disponibles :</label>
                <div className="d-flex gap-2 flex-wrap">
                  {availableColors.map((color) => (
                    <div
                      key={color.id}
                      className={`border rounded p-2 ${selectedColor?.id === color.id ? 'border-primary border-3' : 'border-light'}`}
                      style={{ 
                        cursor: 'pointer', 
                        minWidth: 80,
                        backgroundColor: selectedColor?.id === color.id ? '#f8f9fa' : 'white'
                      }}
                      title={color.name}
                      onClick={() => handleColorChange(color)}
                    >
                      <div className="text-center">
                        <div style={{ 
                          fontSize: '12px', 
                          fontWeight: '600',
                          color: selectedColor?.id === color.id ? '#0d6efd' : '#333'
                        }}>
                          {color.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sélecteur de couleur (pour produits avec variantes) */}
            {product?.subcategory !== 'femme' && product?.subcategory !== 'homme' && (
              <div className="mb-3">
                <label className="form-label fw-bold mb-2">Couleur :</label>
                <div className="d-flex gap-2 flex-wrap">
                  {colorSiblings.length > 0 ? (
                    colorSiblings.map((s) => (
                      <div
                        key={s.slug}
                        className={`border rounded p-1 ${ (product?.id === s.id) ? 'border-primary border-3' : 'border-light'}`}
                        style={{ cursor: 'pointer', minWidth: 32 }}
                        title={s.colorLabel}
                        onClick={() => { if (product?.id !== s.id) navigate(`/product/${s.id}`); }}
                      >
                        <img
                          src={s.image}
                          alt={s.colorLabel}
                          className="rounded"
                          style={{ width: 32, height: 32, objectFit: 'cover' }}
                        />
                      </div>
                    ))
                  ) : (
                    productWithVariants?.variants?.map((variant) => (
                    <div
                      key={variant.color}
                        className={`border rounded p-1 ${selectedVariant?.color === variant.color ? 'border-primary border-3' : 'border-light'}`}
                      style={{ cursor: 'pointer', minWidth: 32 }}
                      onClick={() => handleVariantClick(variant)}
                        title={variant.color}
                      >
                        <div 
                          className="rounded d-flex align-items-center justify-content-center"
                          style={{ 
                            width: 32, 
                            height: 32, 
                            backgroundColor: variant.color === 'Blanc' ? '#ffffff' : 
                                           variant.color === 'Noir' ? '#000000' : 
                                           variant.color === 'Vert olive' ? '#6b8e23' : '#cccccc',
                            border: variant.color === 'Blanc' ? '1px solid #ddd' : 'none'
                          }}
                        >
                          <span style={{ 
                            fontSize: '10px', 
                            color: variant.color === 'Blanc' ? '#fff' : '#000',
                            fontWeight: 'bold'
                          }}>
                            {variant.color.charAt(0)}
                          </span>
                        </div>
                    </div>
                    ))
                  )}
                </div>
              </div>
            )}
            <div className="mb-2">
              <label className="form-label fw-bold mb-1">Taille :</label>
              <div className="d-flex gap-2 flex-wrap">
                {selectedVariant?.sizes.map((size) => (
                  <button
                    key={size}
                    className={`btn btn-sm ${selectedSize === size ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setSelectedSize(size)}
                    style={{ minWidth: 46, fontSize: 13, fontWeight: 600 }}
                    title={`Taille ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label fw-bold mb-1">Quantité :</label>
              <input type="number" min={1} max={10} value={quantity} onChange={e => setQuantity(Number(e.target.value))} style={{ width: 60 }} className="form-control d-inline-block ms-2" />
            </div>
            {product?.id && (
              <StockMessage productId={product.id} stockMessages={stockMessages} className="mb-2" />
            )}
            <div className="d-flex gap-2 mt-3">
                              <button className="btn btn-warning fw-bold" style={{ fontSize: 17, color: '#232f3e' }} onClick={() => handleAddToCart(quantity)}>Ajouter au panier</button>
              <button className="btn btn-primary fw-bold" style={{ fontSize: 17, background: '#2563eb', border: 'none' }} onClick={handleBuyNow}>Acheter maintenant</button>
            </div>
            <div className="mt-4">
              <h5>Description du produit</h5>
              <p>{displayProduct?.description || 'Aucune description disponible pour ce produit.'}</p>
            </div>
            
            {/* Section spécifique au genre */}
            {isFemme && <FemmeSpecificSection product={displayProduct} />}
            {isHomme && <HommeSpecificSection product={product} />}
          </div>
          {/* Colonne droite Amazon-like */}
          <div className="col-md-3">
            <div className="bg-light rounded-3 p-2 mb-4 d-flex align-items-center justify-content-between" style={{ border: '1px solid #e3e6e6' }}>
              <div>
                <i className="bi bi-geo-alt text-primary me-2"></i>
                <span className="fw-semibold">Livraison à</span>
                <span className="ms-2">Mamadou Dian - Marseille</span>
              </div>
              <button className="btn btn-link p-0" style={{ fontSize: 15 }}>Changer d'adresse</button>
            </div>
            <div className="card p-3 shadow-sm" style={{ borderRadius: 10, maxWidth: 340 }}>
              <div className="mb-2">
                <span className="fw-bold text-danger" style={{ fontSize: 26 }}>{formatGNF(displayProduct?.price || selectedVariant?.price || 0)}</span>
                {displayProduct?.originalPrice && (
                  <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: 16 }}>{formatGNF(displayProduct.originalPrice)}</span>
                )}
                {displayProduct?.discount && displayProduct.discount > 0 && (
                  <span className="badge bg-success ms-2">-{displayProduct.discount}%</span>
                )}
              </div>
              <div className="mb-2" style={{ fontSize: 15 }}>
                <span className="text-success fw-bold">{displayProduct?.availability || 'En stock'}</span>
              </div>
              {product?.id && (
                <StockMessage productId={product.id} stockMessages={stockMessages} />
              )}
              <div className="mb-2" style={{ fontSize: 15 }}>
                <span>Livraison : <b>{displayProduct?.deliveryDate || 'Gratuite demain'}</b></span>
              </div>
                          <div className="mb-2" style={{ fontSize: 15 }}>
                                                        <div>
              {(() => {
                const sellerName = product?.vendor || product?.sellerName || 'Boutique';
                const sellerNode = product?.vendorId
                  ? (<Link to={`/vendeur/${product.vendorId}`}><b>{sellerName}</b></Link>)
                  : (<b>{sellerName}</b>);
                return (<span>Vendu par {sellerNode}</span>);
              })()}
                              {(() => {
                                // Badges dynamiques selon la marque et le produit
                                if (displayProduct?.brand === 'Christian Louboutin' || displayProduct?.brand === 'Gucci' || displayProduct?.brand === 'Prada') {
                                  return <span className="badge bg-warning text-dark ms-2">Boutique officielle</span>;
                                } else if (displayProduct?.brand === 'Zara' || displayProduct?.brand === 'Mango' || displayProduct?.brand === 'Minelli') {
                                  return <span className="badge bg-success ms-2">Vendeur vérifié</span>;
                                } else if (displayProduct?.price > 1000000) {
                                  return <span className="badge bg-info ms-2">Premium</span>;
                                } else {
                                  return <span className="badge bg-primary ms-2">Vendeur vérifié</span>;
                                }
                              })()}
                            </div>
            </div>
              <div className="mb-2">
                <label className="form-label fw-bold mb-1">Quantité :</label>
                <select className="form-select d-inline-block ms-2" style={{ width: 80, display: 'inline-block' }} value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
                  {[...Array(10).keys()].map(i => <option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
              </div>
                              <button className="btn btn-warning w-100 mb-2" style={{ fontWeight: 'bold', fontSize: 17 }} onClick={() => handleAddToCart(quantity)}>Ajouter au panier</button>
              <button className="btn w-100 mb-2" style={{ background: '#ffa41c', color: '#232f3e', fontWeight: 'bold', fontSize: 17 }} onClick={handleBuyNow}>Acheter maintenant</button>
              <div className="mt-2 small text-muted">
                <div><i className="bi bi-shield-check text-info me-1"></i>Paiement sécurisé SSL</div>
                <div><i className="bi bi-arrow-counterclockwise text-success me-1"></i>Retours gratuits 30j</div>
                <div><i className="bi bi-truck text-primary me-1"></i>Livraison rapide</div>
              </div>
              <div className="form-check mt-2">
                <input className="form-check-input" type="checkbox" id="gift" checked={giftReceipt} onChange={() => setGiftReceipt(!giftReceipt)} />
                <label className="form-check-label" htmlFor="gift">Ajouter un reçu cadeau</label>
                {giftReceipt && (
                  <div className="mt-1 small text-muted">
                    <i className="bi bi-info-circle-fill text-info me-1"></i>
                    {giftInfo}
                  </div>
                )}
              </div>
              <button className="btn btn-outline-secondary w-100 mt-2" onClick={() => addToWishlist(displayProduct)}>Ajouter à la liste</button>
            </div>
          </div>
        </div>
        {/* Onglets Amazon-like */}
        <div className="mt-5">
          <ul className="nav nav-tabs mb-3" id="productTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button className={`nav-link${activeTab === 'description' ? ' active' : ''}`} onClick={() => setActiveTab('description')} type="button">Description</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className={`nav-link${activeTab === 'specs' ? ' active' : ''}`} onClick={() => setActiveTab('specs')} type="button">Caractéristiques</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className={`nav-link${activeTab === 'avis' ? ' active' : ''}`} onClick={() => setActiveTab('avis')} type="button">Avis clients</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className={`nav-link${activeTab === 'qa' ? ' active' : ''}`} onClick={() => setActiveTab('qa')} type="button">Questions/Réponses</button>
            </li>
          </ul>
          <div className="tab-content bg-white p-4 rounded shadow-sm mb-4">
            {activeTab === 'description' && (
              <div>
                <h4 className="mb-4 text-primary">Description détaillée</h4>
                
                {/* Description principale */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Présentation du produit</h6>
                  <p className="text-muted lh-base">
                    {displayProduct?.description || 'Aucune description disponible pour ce produit.'}
                  </p>
                </div>

                {/* Informations clés */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="fw-bold text-primary mb-2">
                          <i className="bi bi-star-fill me-2"></i>
                          Qualité & Finition
                        </h6>
                        <ul className="list-unstyled mb-0">
                          <li className="mb-1">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Matériaux premium sélectionnés
                          </li>
                          <li className="mb-1">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Finitions soignées et durables
                          </li>
                          <li className="mb-1">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Contrôle qualité rigoureux
                          </li>
                </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="fw-bold text-primary mb-2">
                          <i className="bi bi-heart-fill me-2"></i>
                          Confort & Style
                        </h6>
                        <ul className="list-unstyled mb-0">
                          <li className="mb-1">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Design ergonomique et confortable
                          </li>
                          <li className="mb-1">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Style moderne et intemporel
                          </li>
                          <li className="mb-1">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            Polyvalence d'utilisation
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conseils de style */}
                {Array.isArray(displayProduct?.tips) && displayProduct.tips.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold text-success mb-3">
                      <i className="bi bi-lightbulb-fill me-2"></i>
                      Conseils de style
                    </h6>
                    <div className="row">
                      {displayProduct.tips.map((tip, i) => (
                        <div key={`tip-${i}`} className="col-md-6 mb-2">
                          <div className="d-flex align-items-start">
                            <i className="bi bi-arrow-right-circle-fill text-success me-2 mt-1"></i>
                            <span className="text-muted">{tip}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conseils d'entretien */}
                {Array.isArray(displayProduct?.care) && displayProduct.care.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold text-info mb-3">
                      <i className="bi bi-shield-check-fill me-2"></i>
                      Conseils d'entretien
                    </h6>
                    <div className="row">
                      {displayProduct.care.map((care, i) => (
                        <div key={`care-${i}`} className="col-md-6 mb-2">
                          <div className="d-flex align-items-start">
                            <i className="bi bi-arrow-right-circle-fill text-info me-2 mt-1"></i>
                            <span className="text-muted">{care}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Caractéristiques techniques */}
                <div className="mb-4">
                  <h6 className="fw-bold text-dark mb-3">
                    <i className="bi bi-gear-fill me-2"></i>
                    Caractéristiques techniques
                  </h6>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <strong>Catégorie :</strong> 
                          <span className="text-muted ms-2">{displayProduct?.category || 'Non spécifiée'}</span>
                        </li>
                        <li className="mb-2">
                          <strong>Marque :</strong> 
                          <span className="text-muted ms-2">{displayProduct?.brand || 'Non spécifiée'}</span>
                        </li>
                        <li className="mb-2">
                          <strong>Note :</strong> 
                          <span className="text-muted ms-2">{displayProduct?.rating || 0}/5</span>
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <strong>Prix :</strong> 
                          <span className="text-muted ms-2">{formatGNF(displayProduct?.price || selectedVariant?.price || 0)}</span>
                        </li>
                        <li className="mb-2">
                          <strong>Disponibilité :</strong> 
                          <span className="text-success ms-2">En stock</span>
                        </li>
                        <li className="mb-2">
                          <strong>Livraison :</strong> 
                          <span className="text-muted ms-2">Gratuite</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                                 {/* Garantie et service */}
                 <div className="bg-primary bg-opacity-10 p-3 rounded">
                   <h6 className="fw-bold text-primary mb-2">
                     <i className="bi bi-shield-check me-2"></i>
                     Garantie et service client
                   </h6>
                   <div className="row text-muted">
                     <div className="col-md-4">
                       <i className="bi bi-arrow-return-left me-2"></i>
                       Retours gratuits sous 30 jours
                     </div>
                     <div className="col-md-4">
                       <i className="bi bi-tools me-2"></i>
                       Service après-vente disponible
                     </div>
                     <div className="col-md-4">
                       <i className="bi bi-headset me-2"></i>
                       Support client 24/7
                     </div>
                   </div>
                 </div>


              </div>
            )}
            {activeTab === 'specs' && (
              <div>
                <h4>Caractéristiques techniques</h4>
                <ul>
                  <li>Catégorie : {displayProduct?.category || 'Non spécifiée'}</li>
                  <li>Prix : {formatGNF(displayProduct?.price || selectedVariant?.price || 0)}</li>
                  <li>Note : {displayProduct?.rating || 0} / 5</li>
                </ul>
              </div>
            )}
            {activeTab === 'avis' && (
              <div>
                <h4>Avis clients</h4>
                {avisClients.length === 0 ? <div>Aucun avis pour ce produit.</div> : (
                  <div>
                    {avisAffiches.map((avis, idx) => (
                      <div key={idx} className="border-bottom pb-3 mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <span className="fw-bold me-2">{avis.user}</span>
                          {renderStars(avis.rating)}
                          <span className="ms-2 text-muted" style={{ fontSize: 13 }}>{avis.date}</span>
                        </div>
                        <div>{avis.text}</div>
                        {avis.photos && avis.photos.length > 0 && (
                          <div className="d-flex gap-2 mt-2">
                            {avis.photos.map((p, i) => <img key={i} src={p} alt="avis" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} />)}
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Pagination */}
                    {avisTotalPages > 1 && (
                      <div className="d-flex gap-2 justify-content-center align-items-center mt-3">
                        <button className="btn btn-sm btn-outline-primary" disabled={avisPage === 1} onClick={() => setAvisPage(avisPage - 1)}>Précédent</button>
                        <span>Page {avisPage} / {avisTotalPages}</span>
                        <button className="btn btn-sm btn-outline-primary" disabled={avisPage === avisTotalPages} onClick={() => setAvisPage(avisPage + 1)}>Suivant</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'qa' && (
              <div>
                <h4>Questions & Réponses</h4>
                <div className="mb-3">
                  <strong>Conseils d'entretien :</strong>
                  <ul>
                    <li>Nettoyez vos chaussures avec un chiffon doux et humide.</li>
                    <li>Évitez l'exposition prolongée au soleil pour préserver les couleurs.</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <strong>Questions des clients :</strong>
                  {questions.length === 0 ? <div className="text-muted">Aucune question pour ce produit.</div> : (
                    <ul className="list-group mb-3">
                      {questions.map((q, idx) => (
                        <li key={idx} className="list-group-item">
                          <div className="fw-bold mb-1">{q.user} <span className="text-muted" style={{ fontSize: 13 }}>({q.date})</span></div>
                          <div className="mb-1">Q : {q.question}</div>
                          {q.answer && <div className="text-success">R : {q.answer}</div>}
                        </li>
                      ))}
                    </ul>
                  )}
                  <form className="d-flex gap-2 mt-2" onSubmit={e => { e.preventDefault(); if (newQuestion.trim()) { setQuestions([{ user: 'Vous', question: newQuestion, date: new Date().toISOString().slice(0,10), answer: null }, ...questions]); setNewQuestion(''); } }}>
                    <input type="text" className="form-control" placeholder="Posez votre question..." style={{ maxWidth: 300 }} value={newQuestion} onChange={e => setNewQuestion(e.target.value)} />
                    <button className="btn btn-primary" type="submit">Envoyer</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conseil de pointure affiché ci-dessus, pas de modale nécessaire */}

        {/* Produits similaires - Style Amazon */}
        {similarProducts.length > 0 && (
          <div className="mt-5">
            <h4 className="mb-3">Produits similaires ({similarProducts.length})</h4>
            {console.log('🔍 Produits similaires à afficher:', similarProducts.map(p => ({ id: p.id, name: p.name })))}
            <div className="bg-white rounded shadow-sm p-4">
              <div className="row g-3">
                {similarProducts.slice(0, 4).map((prod, idx) => {
                  const isSelected = selectedSimilarProducts.includes(prod.id);
                return (
                    <div key={prod.id} className="col-lg-3 col-md-4 col-sm-6">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="position-relative">
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            className="card-img-top" 
                            style={{ height: 200, objectFit: 'contain', padding: '10px', cursor: 'pointer' }}
                            onClick={() => {
                              console.log('🖼️ Clic sur image produit:', prod.name);
                              const navigationUrl = `/product/${prod.id}`;
                              navigate(navigationUrl);
                            }}
                          />
                          <div className="position-absolute top-0 start-0 p-2">
                            <input 
                              type="checkbox" 
                              className="form-check-input" 
                              checked={isSelected}
                              onChange={() => handleSimilarProductToggle(prod.id)}
                              style={{ transform: 'scale(1.2)' }}
                            />
                          </div>
                        </div>
                        <div className="card-body d-flex flex-column">
                          <h6 className="card-title" style={{ fontSize: '14px', lineHeight: '1.3' }}>
                            {prod.name}
                          </h6>
                          <div className="mt-auto">
                            <div className="d-flex align-items-center mb-2">
                              <span className="text-danger fw-bold fs-5">{formatGNF(prod.price)}</span>
                              {prod.originalPrice && prod.originalPrice > prod.price && (
                                <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: '12px' }}>
                                  {formatGNF(prod.originalPrice)}
                                </span>
                              )}
                            </div>
                            <div className="d-flex gap-1">
                              <button 
                                className="btn btn-warning btn-sm w-100" 
                                style={{ fontSize: '12px' }}
                                onClick={() => {
                                  addToCart(prod, 1);
                                  console.log(`🛒 Produit ajouté au panier: ${prod.name}`);
                                }}
                              >
                                Ajouter au panier
                              </button>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                );
              })}
              </div>
              
              {/* Section d'achat groupé - Style Amazon */}
              {selectedSimilarProducts.length > 0 && (
                <div className="mt-4 p-3 bg-light rounded">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h6 className="mb-2">Produits sélectionnés ({selectedSimilarProducts.length})</h6>
                      <div className="d-flex align-items-center">
                        <span className="fw-bold text-success me-2">Total: {formatGNF(similarProductsTotal)}</span>
                        {similarProductsSavings > 0 && (
                          <span className="text-success small">
                            (Économie: {formatGNF(similarProductsSavings)})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 text-end">
                      <button 
                        className="btn btn-warning btn-lg me-2"
                        onClick={handleAddSelectedSimilarProducts}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        Tout ajouter au panier
                      </button>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setSelectedSimilarProducts([])}
                      >
                        Désélectionner tout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Bloc fréquemment achetés ensemble amélioré */}
        <div className="bg-white rounded shadow-sm p-3 my-4">
          <h5 className="fw-bold mb-3" style={{ color: '#2563eb' }}><i className="bi bi-plus-circle me-2 text-primary"></i>Fréquemment achetés ensemble</h5>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
            {frequentlyBoughtTogether.map((prod, idx) => (
              <div key={prod.id} className="card border-0 shadow-sm text-center p-2" style={{ minWidth: 140, maxWidth: 160, borderColor: '#2563eb' }}>
                <input type="checkbox" checked={selectedTogether.includes(prod.id)} onChange={() => handleToggleTogether(prod.id)} />
                <img src={prod.variants ? prod.variants[0].images[0] : prod.image} alt={prod.name} style={{ height: 70, objectFit: 'contain', marginBottom: 8 }} />
                <div className="fw-bold mb-1" style={{ fontSize: 14 }}>{prod.name}</div>
                <div className="text-danger fw-bold mb-1">{formatGNF(prod.variants ? prod.variants[0].price : prod.price)}</div>
              </div>
            ))}
            <div className="fw-bold ms-3" style={{ fontSize: 18, color: '#2563eb' }}>Total : {formatGNF(togetherTotal)}</div>
            <button className="btn btn-primary fw-bold ms-2" style={{ background: '#2563eb', border: 'none' }} onClick={handleAddTogether}>Tout ajouter au panier</button>
          </div>
        </div>
        {/* Bloc livraison/retours/paiement détaillé */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="bg-light rounded-3 p-3 mb-3">
              <i className="bi bi-truck text-primary me-2"></i>
              <span className="fw-semibold">Livraison estimée :</span>
              <span className="ms-2">Gratuite demain</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-light rounded-3 p-3 mb-3">
              <i className="bi bi-arrow-counterclockwise text-success me-2"></i>
              <span className="fw-semibold">Retours :</span>
              <span className="ms-2">Gratuits 30j</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-light rounded-3 p-3 mb-3">
              <i className="bi bi-shield-check text-info me-2"></i>
              <span className="fw-semibold">Paiement sécurisé</span>
            </div>
          </div>
        </div>
        {/* Section avis clients stylés avec pagination */}
        <div className="mt-5">
          <h4>Avis clients</h4>
          {avisClients.length === 0 ? <div>Aucun avis pour ce produit.</div> : (
            <div>
              {avisAffiches.map((avis, idx) => (
                <div key={idx} className="border-bottom pb-3 mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <span className="fw-bold me-2">{avis.user}</span>
                    {renderStars(avis.rating)}
                    <span className="ms-2 text-muted" style={{ fontSize: 13 }}>{avis.date}</span>
                  </div>
                  <div>{avis.text}</div>
                  {avis.photos && avis.photos.length > 0 && (
                    <div className="d-flex gap-2 mt-2">
                      {avis.photos.map((p, i) => <img key={i} src={p} alt="avis" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} />)}
                    </div>
                  )}
                </div>
              ))}
              {/* Pagination */}
              {avisTotalPages > 1 && (
                <div className="d-flex gap-2 justify-content-center align-items-center mt-3">
                  <button className="btn btn-sm btn-outline-primary" disabled={avisPage === 1} onClick={() => setAvisPage(avisPage - 1)}>Précédent</button>
                  <span>Page {avisPage} / {avisTotalPages}</span>
                  <button className="btn btn-sm btn-outline-primary" disabled={avisPage === avisTotalPages} onClick={() => setAvisPage(avisPage + 1)}>Suivant</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>   
  );
} 