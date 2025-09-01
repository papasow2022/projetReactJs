import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from '../contexts/ProductsContext';
import Footer from "../components/Footer";
import FemmeSpecificSection from "../components/FemmeSpecificSection";
import HommeSpecificSection from "../components/HommeSpecificSection";

import { useCart } from '../contexts/CartContext';


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
    if (clickedImage && products.length > 0) {
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
      
      setProductFromImage(foundProduct);
    }
  }, [clickedImage, products]);
  
  // Si pas de produit trouvé par image, utiliser le productId
  let product = productFromImage;
  
  // État pour gérer la marque sélectionnée
  const [selectedBrand, setSelectedBrand] = useState(null);
  
  // Fonction pour obtenir toutes les marques disponibles pour la section Femme
  const getAvailableBrands = () => {
    if (product?.subcategory !== 'femme') return [];
    
    const brands = [
      { id: 'CritianlouboutinNoire', name: 'Christian Louboutin', folder: 'CritianlouboutinNoire' },
      { id: 'Gucci', name: 'Gucci', folder: 'Gucci' },
      { id: 'PradaBeige', name: 'Prada', folder: 'PradaBeige' },
      { id: 'Zaranoire', name: 'Zara', folder: 'Zaranoire' },
      { id: 'Minelli', name: 'Minelli', folder: 'Minelli' },
      { id: 'Mango', name: 'Mango', folder: 'Mango' },
      { id: 'Jonak', name: 'Jonak', folder: 'Jonak' }
    ];
    
    return brands;
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
    return [];
  };
  
  // Fonction pour changer de marque
  const handleBrandChange = (brand) => {
    console.log('🔄 Changement de marque vers:', brand.name);
    setSelectedBrand(brand);
    setSelectedImageIdx(0); // Remettre l'image principale à la première position
    
    // Mettre à jour le produit affiché avec les informations de la nouvelle marque
    if (brand.folder === 'CritianlouboutinNoire') {
      // Créer un produit Christian Louboutin avec les nouvelles images
      const newProduct = {
        ...product,
        brand: 'Christian Louboutin',
        name: 'Christian Louboutin Collection',
        price: 2500000, // Prix Christian Louboutin
        rating: 4.8,
        reviewCount: 156
      };
      setSelectedGalleryProduct(newProduct);
    } else if (brand.folder === 'Gucci') {
      const newProduct = {
        ...product,
        brand: 'Gucci',
        name: 'Gucci Collection',
        price: 1800000, // Prix Gucci
        rating: 4.6,
        reviewCount: 89
      };
      setSelectedGalleryProduct(newProduct);
    } else if (brand.folder === 'PradaBeige') {
      const newProduct = {
        ...product,
        brand: 'Prada',
        name: 'Prada Collection',
        price: 2200000, // Prix Prada
        rating: 4.7,
        reviewCount: 134
      };
      setSelectedGalleryProduct(newProduct);
    } else if (brand.folder === 'Zaranoire') {
      const newProduct = {
        ...product,
        brand: 'Zara',
        name: 'Zara Collection',
        price: 450000, // Prix Zara
        rating: 4.3,
        reviewCount: 67
      };
      setSelectedGalleryProduct(newProduct);
    } else if (brand.folder === 'Minelli') {
      const newProduct = {
        ...product,
        brand: 'Minelli',
        name: 'Minelli Collection',
        price: 380000, // Prix Minelli
        rating: 4.4,
        reviewCount: 45
      };
      setSelectedGalleryProduct(newProduct);
    } else if (brand.folder === 'Mango') {
      const newProduct = {
        ...product,
        brand: 'Mango',
        name: 'Mango Collection',
        price: 320000, // Prix Mango
        rating: 4.2,
        reviewCount: 38
      };
      setSelectedGalleryProduct(newProduct);
    } else if (brand.folder === 'Jonak') {
      const newProduct = {
        ...product,
        brand: 'Jonak',
        name: 'Jonak Collection',
        price: 280000, // Prix Jonak
        rating: 4.1,
        reviewCount: 29
      };
      setSelectedGalleryProduct(newProduct);
    }
  };
  
  // Initialiser la marque sélectionnée pour les produits Femme
  useEffect(() => {
    if (product?.subcategory === 'femme') {
      // Déterminer la marque basée sur le produit
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
      }
      
      if (brandToSet) {
        setSelectedBrand(brandToSet);
        console.log('🎯 Marque initialisée:', brandToSet.name);
      }
    }
  }, [product]);
  if (!product) {
    product = products.find((p) => p.id === productId || p.slug === productId);
    console.log('🔍 Produit trouvé par ID:', product?.name || 'Aucun produit trouvé');
  }
  
  // Détecter automatiquement le genre du produit
  const isFemme = product?.subcategory === 'femme';
  const isHomme = product?.subcategory === 'homme';
  const isEnfant = product?.subcategory === 'enfant';
  const isBebe = product?.subcategory === 'bebe';
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
    
    return [
      { color: 'Blanc', price: product.price || 0, sizes: euSizes, images: [colorImages['Blanc']] },
      { color: 'Noir', price: (product.price || 0) + 10000, sizes: euSizes, images: [colorImages['Noir']] },
      { color: 'Vert olive', price: (product.price || 0) + 20000, sizes: euSizes, images: [colorImages['Vert olive']] }
    ];
  }, [product, allProducts]);

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
    
    // Pour les produits Femme avec une marque sélectionnée, afficher UNIQUEMENT les images de cette marque
    if (product?.subcategory === 'femme' && selectedBrand) {
      console.log('🔍 Affichage des images de la marque sélectionnée:', selectedBrand.name);
      
      // Récupérer UNIQUEMENT les images de la marque sélectionnée
      const brandImages = getBrandImages(selectedBrand.folder);
      console.log('📁 Images de la marque:', brandImages);
      
      // Si une image spécifique a été cliquée, la mettre en première position
      let finalImages = [...brandImages];
      if (clickedImage && finalImages.includes(clickedImage)) {
        console.log('🖼️ Image cliquée trouvée, mise en première position:', clickedImage);
        finalImages = finalImages.filter(img => img !== clickedImage);
        finalImages.unshift(clickedImage);
      }
      
      console.log('📸 Images finales de la galerie (marque uniquement):', finalImages);
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
  }, [productWithVariants, product, colorSiblings, clickedImage, selectedBrand]);

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
  const { addToCart, cartItems, setShowCartSidebar } = useCart();

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

  // Produits similaires (exemple simplifié)
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products.filter(p => 
      p.id !== product.id && 
      p.category === product.category && 
      p.subcategory === product.subcategory // Même genre (homme/femme/enfant/bebe)
    );
  }, [product, products]);
  
  // Bloc fréquemment achetés ensemble (exemple simplifié)
  const frequentlyBoughtTogether = useMemo(() => {
    if (!product || !similarProducts) return [];
    return [product, ...similarProducts.slice(0, 2)];
  }, [product, similarProducts]);
  
  // Sélection des produits à acheter ensemble
  const [selectedTogether, setSelectedTogether] = useState([]);
  
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
  }, [product, allProducts, selectedVariant]);
  
  // Log pour déboguer le mapping Christian Louboutin
  if (product?.brand === 'Christian Louboutin') {
    console.log('🔍 Mapping Christian Louboutin:', imageToProductMapping);
    console.log('📸 Images de la galerie:', galleryImages);
  }
  
  // Mettre à jour la sélection du produit quand la galerie change
  useEffect(() => {
    // Si on a des images pour cette couleur, sélectionner le premier produit
    const currentImages = product?.subcategory === 'femme' && selectedBrand ? galleryImages : dynamicGalleryImages;
    if (currentImages.length > 0 && imageToProductMapping[currentImages[0]]) {
      setSelectedGalleryProduct(imageToProductMapping[currentImages[0]]);
    }
  }, [dynamicGalleryImages, galleryImages, imageToProductMapping, product?.subcategory, selectedVariant, selectedBrand]);
  
  // Fonction pour gérer le clic sur une miniature
  const handleThumbnailClick = (index) => {
    console.log('🖱️ Clic sur miniature:', index);
    setSelectedImageIdx(index);
    
    // Récupérer le produit correspondant à cette image
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
      gift: giftReceipt
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
        gift: false
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

  // Produit à afficher (soit le produit sélectionné dans la galerie, soit le produit principal)
  const displayProduct = selectedGalleryProduct || product;

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
            {product?.subcategory === 'femme' && (
              <div className="mb-3">
                <label className="form-label fw-bold mb-2">Marques disponibles :</label>
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
            
            {/* Sélecteur de couleur (pour produits avec variantes) */}
            {product?.subcategory !== 'femme' && (
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
            <div className="d-flex gap-2 mt-3">
                              <button className="btn btn-warning fw-bold" style={{ fontSize: 17, color: '#232f3e' }} onClick={() => handleAddToCart(quantity)}>Ajouter au panier</button>
              <button className="btn btn-primary fw-bold" style={{ fontSize: 17, background: '#2563eb', border: 'none' }} onClick={handleBuyNow}>Acheter maintenant</button>
            </div>
            <div className="mt-4">
              <h5>Description du produit</h5>
              <p>{displayProduct?.description || 'Aucune description disponible pour ce produit.'}</p>
            </div>
            
            {/* Section spécifique au genre */}
            {isFemme && <FemmeSpecificSection product={product} />}
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
              <div className="mb-2" style={{ fontSize: 15 }}>
                <span>Livraison : <b>{displayProduct?.deliveryDate || 'Gratuite demain'}</b></span>
              </div>
                          <div className="mb-2" style={{ fontSize: 15 }}>
              <span>Vendu par <b>{displayProduct?.brand || 'Boutique'}</b></span>
              <span className="badge bg-primary ms-2">Vendeur vérifié</span>
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
                <h4>Description détaillée</h4>
                <p>{displayProduct?.description || 'Aucune description disponible pour ce produit.'}</p>
                <ul>
                  <li>Technologie Air Max pour un amorti optimal</li>
                  <li>Semelle extérieure en caoutchouc durable</li>
                  <li>Tige en mesh respirant</li>
                  <li>Doublure confortable</li>
                  <li>Poids léger : 320g</li>
                </ul>
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
                  <strong>Conseils d’entretien :</strong>
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

        {/* Carrousel produits similaires */}
        {similarProducts.length > 0 && (
          <div className="mt-5">
            <h4>Produits similaires</h4>
            <div className="d-flex overflow-auto gap-3 pb-2">
              {similarProducts.map((prod, idx) => (
                <div key={prod.id} className="card border-0 shadow-sm" style={{ minWidth: 180, maxWidth: 200 }}>
                  <img src={prod.variants ? prod.variants[0].images[0] : prod.image} alt={prod.name} style={{ height: 90, objectFit: 'contain', marginTop: 10 }} />
                  <div className="card-body p-2">
                    <div className="fw-bold" style={{ fontSize: 15 }}>{prod.name}</div>
                    <div className="text-danger fw-bold mb-2">{formatGNF(prod.variants ? prod.variants[0].price : prod.price)}</div>
                  </div>
                </div>
              ))}
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