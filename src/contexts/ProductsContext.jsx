export { ProductsContext };
import React, { createContext, useContext, useState, useEffect } from 'react';

// Création du contexte
const ProductsContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts doit être utilisé dans un ProductsProvider');
  }
  return context;
};

// Provider du contexte
export const ProductsProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    try {
      // Récupérer les produits existants
      const vendorsProducts = JSON.parse(localStorage.getItem('vendorsProducts') || '{}');
      const allProductsArray = [];

      // Convertir l'objet en tableau
      Object.values(vendorsProducts).forEach(vendorProducts => {
        if (Array.isArray(vendorProducts)) {
          allProductsArray.push(...vendorProducts);
        }
      });

      // Produits mockés (toujours présents)
      const mockProducts = [
        // Catégorie Chaussures
        {
          id: 'shoe-1',
          name: 'Nike Air Max 270 - Amorti Dynamique Performance Running',
          brand: 'Nike',
          price: 129.99,
          originalPrice: 159.99,
          discount: 19,
          rating: 4.5,
          reviewCount: 1247,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'nike-store',
            name: 'Nike Store',
            rating: 4.8,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Chaussures',
          subcategory: 'homme',
          specificType: 'sport',
          image: '/assets/categorie/chaussures/nike-air-max.png'
        },
        {
          id: 'shoe-2',
          name: 'Puma RS-X Reinvention - Style Urbain Tendance',
          brand: 'Puma',
          price: 109.99,
          originalPrice: 139.99,
          discount: 21,
          rating: 4.2,
          reviewCount: 756,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'puma-store',
            name: 'Puma Store',
            rating: 4.6,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Chaussures',
          subcategory: 'femme',
          specificType: 'casual',
          image: '/assets/categorie/chaussures/puma-rs-x.png'
        },
        {
          id: 'shoe-3',
          name: 'New Balance 574 - Élégance Urbaine Confort Quotidien',
          brand: 'New Balance',
          price: 99.99,
          originalPrice: 119.99,
          discount: 17,
          rating: 4.6,
          reviewCount: 1023,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'new-balance-store',
            name: 'New Balance Store',
            rating: 4.7,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Chaussures',
          subcategory: 'enfant',
          specificType: 'ville',
          image: '/assets/categorie/chaussures/new-balance.png'
        },
        {
          id: 'shoe-4',
          name: 'Adidas Ultraboost - Confort Dynamique Technologie Boost',
          brand: 'Adidas',
          price: 149.99,
          originalPrice: 179.99,
          discount: 17,
          rating: 4.8,
          reviewCount: 1523,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'adidas-store',
            name: 'Adidas Store',
            rating: 4.9,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Chaussures',
          subcategory: 'homme',
          specificType: 'bottes',
          image: '/assets/categorie/chaussures/new-balance.png'
        },
        {
          id: 'shoe-5',
          name: 'Clarks Desert - Confort Quotidien Cuir Premium',
          brand: 'Clarks',
          price: 119.99,
          originalPrice: 139.99,
          discount: 14,
          rating: 4.6,
          reviewCount: 876,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'clarks-store',
            name: 'Clarks Store',
            rating: 4.7,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Chaussures',
          subcategory: 'femme',
          specificType: 'ville',
          image: '/assets/categorie/chaussures/new-balance.png'
        },
        {
          id: 'shoe-6',
          name: 'Dr. Martens Kids - Style Intemporel Résistant',
          brand: 'Dr. Martens',
          price: 89.99,
          originalPrice: 109.99,
          discount: 18,
          rating: 4.5,
          reviewCount: 654,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'drmartens-store',
            name: 'Dr. Martens Store',
            rating: 4.6,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Chaussures',
          subcategory: 'enfant',
          specificType: 'bottes',
          image: '/assets/categorie/chaussures/new-balance.png'
        },
        {
          id: 'shoe-7',
          name: 'Baskets Femme Running - Légères et Respirantes',
          brand: 'SportyWoman',
          price: 89.99,
          originalPrice: 119.99,
          discount: 25,
          rating: 4.8,
          reviewCount: 845,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'sportywoman-store',
            name: 'SportyWoman Store',
            rating: 4.7,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Chaussures',
          subcategory: 'femme',
          specificType: 'sport',
          image: '/assets/categorie/chaussures/nike-air-max.png'
        },
        {
          id: 'shoe-8',
          name: 'Baskets Enfant Velcro - Semelle Lumineuse LED',
          brand: 'FunKids',
          price: 39.99,
          originalPrice: 54.99,
          discount: 27,
          rating: 4.9,
          reviewCount: 723,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'funkids-store',
            name: 'FunKids Store',
            rating: 4.8,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Chaussures',
          subcategory: 'enfant',
          specificType: 'sport',
          image: '/assets/categorie/chaussures/puma-rs-x.png'
        },
        {
          id: 'shoe-9',
          name: 'Chaussons Bébé Premier Pas - Cuir Souple Antidérapant',
          brand: 'BabyStep',
          price: 29.99,
          originalPrice: 39.99,
          discount: 25,
          rating: 4.9,
          reviewCount: 512,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'babystep-store',
            name: 'BabyStep Store',
            rating: 4.8,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Chaussures',
          subcategory: 'bebe',
          specificType: 'premiers-pas',
          image: '/assets/categorie/chaussures/new-balance.png'
        },
       
        // Catégorie Électronique
        {
          id: 'elec-1',
          name: 'Samsung Galaxy S23 - Smartphone Ultra Premium 256Go',
          brand: 'Samsung',
          price: 1199.99,
          originalPrice: 1299.99,
          discount: 8,
          rating: 4.7,
          reviewCount: 2345,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'samsung-store',
            name: 'Samsung Store',
            rating: 4.9,
            isVerified: true
          },
          isPrime: true,
          promo: false,
          isNew: true,
          category: 'Électronique',
          image: '/assets/categorie/electronique/samsung-s23.png'
        },
        {
          id: 'elec-2',
          name: 'Apple MacBook Air M2 - Ultrabook Haute Performance',
          brand: 'Apple',
          price: 1499.99,
          originalPrice: 1599.99,
          discount: 6,
          rating: 4.8,
          reviewCount: 1800,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'apple-store',
            name: 'Apple Store',
            rating: 4.8,
            isVerified: true
          },
          isPrime: true,
          promo: false,
          isNew: true,
          category: 'Électronique',
          image: '/assets/categorie/electronique/macbook-air-m2.png'
        },
        {
          id: 'elec-3',
          name: 'Sony Headphones WH-1000XM5 - Réduction de Bruit Premium',
          brand: 'Sony',
          price: 349.99,
          originalPrice: 399.99,
          discount: 13,
          rating: 4.8,
          reviewCount: 3456,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'sony-store',
            name: 'Sony Store',
            rating: 4.8,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Électronique',
          image: '/assets/categorie/electronique/sony-headphones.png'
        },
        {
          id: 'elec-4',
          name: 'Tablette iPad Pro 12.9 - Écran Retina XDR',
          brand: 'Apple',
          price: 1299.99,
          originalPrice: 1399.99,
          discount: 7,
          rating: 4.9,
          reviewCount: 1245,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'apple-store',
            name: 'Apple Store',
            rating: 4.9,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Électronique',
          image: '/assets/categorie/electronique/macbook-air-m2.png'
        },
        {
          id: 'elec-7',
          name: 'Téléviseur OLED 4K - Smart TV 65 pouces',
          brand: 'LG',
          price: 1499.99,
          originalPrice: 1799.99,
          discount: 17,
          rating: 4.8,
          reviewCount: 1876,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'lg-store',
            name: 'LG Store',
            rating: 4.7,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Électronique',
          image: '/assets/categorie/electronique/samsung-s23.png'
        },
        {
          id: 'elec-8',
          name: 'Appareil Photo Hybride - Capteur Plein Format',
          brand: 'Canon',
          price: 1299.99,
          originalPrice: 1499.99,
          discount: 13,
          rating: 4.7,
          reviewCount: 1245,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'canon-store',
            name: 'Canon Store',
            rating: 4.8,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Électronique',
          image: '/assets/categorie/electronique/macbook-air-m2.png'
        },
        {
          id: 'elec-5',
          name: 'Montre Connectée Enfant - GPS et Appels',
          brand: 'KidSmart',
          price: 89.99,
          originalPrice: 119.99,
          discount: 25,
          rating: 4.6,
          reviewCount: 823,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'kidsmart-store',
            name: 'KidSmart Store',
            rating: 4.5,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Électronique',
          image: '/assets/categorie/electronique/samsung-s23.png'
        },
        {
          id: 'elec-6',
          name: 'Veilleuse Musicale Bébé - Sons Apaisants et Projection',
          brand: 'BabyDream',
          price: 39.99,
          originalPrice: 49.99,
          discount: 20,
          rating: 4.8,
          reviewCount: 1245,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'babydream-store',
            name: 'BabyDream Store',
            rating: 4.7,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Électronique',
          image: '/assets/categorie/electronique/sony-headphones.png'
        },
        // Catégorie Montres
        {
          id: 'watch-baby',
          name: 'Montre Éducative Bébé - Apprentissage des Heures',
          brand: 'BabyTime',
          price: 24.99,
          originalPrice: 34.99,
          discount: 29,
          rating: 4.7,
          reviewCount: 189,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'babytime-store',
            name: 'BabyTime Store',
            rating: 4.6,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Montres',
          subcategory: 'bebe',
          specificType: 'educative',
          image: '/assets/categorie/montres/montre1.png'
        },
        {
          id: 'watch-1',
          name: 'Montre Chronographe Luxury - Élégance Intemporelle',
          brand: 'LuxWatch',
          price: 299.99,
          originalPrice: 399.99,
          discount: 25,
          rating: 4.7,
          reviewCount: 856,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'luxwatch-store',
            name: 'LuxWatch Store',
            rating: 4.8,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Montres',
          subcategory: 'homme',
          specificType: 'luxe',
          image: '/assets/categorie/montres/montre1.png'
        },
        {
          id: 'watch-2',
          name: 'Montre Connectée Smart Pro - Technologie Avancée',
          brand: 'TechWatch',
          price: 199.99,
          originalPrice: 249.99,
          discount: 20,
          rating: 4.6,
          reviewCount: 1123,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'techwatch-store',
            name: 'TechWatch Store',
            rating: 4.7,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Montres',
          subcategory: 'femme',
          specificType: 'connectee',
          image: '/assets/categorie/montres/montre1.png'
        },
        {
          id: 'watch-3',
          name: 'Montre Classic Edition - Design Coloré pour Enfants',
          brand: 'TimePiece',
          price: 159.99,
          originalPrice: 199.99,
          discount: 20,
          rating: 4.5,
          reviewCount: 734,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'timepiece-store',
            name: 'TimePiece Store',
            rating: 4.6,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Montres',
          subcategory: 'enfant',
          specificType: 'analogique',
          image: '/assets/categorie/montres/montre1.png'
        },
        {
          id: 'watch-4',
          name: 'Montre Sport Aqua - Étanche 100m',
          brand: 'SportTime',
          price: 129.99,
          originalPrice: 169.99,
          discount: 24,
          rating: 4.4,
          reviewCount: 534,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'sporttime-store',
            name: 'SportTime Store',
            rating: 4.5,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Montres',
          subcategory: 'homme',
          specificType: 'sport',
          image: '/assets/categorie/montres/montre1.png'
        },
        {
          id: 'watch-5',
          name: 'Montre Diamant Prestige - Collection Haute Joaillerie',
          brand: 'DiamondTime',
          price: 499.99,
          originalPrice: 699.99,
          discount: 29,
          rating: 4.9,
          reviewCount: 423,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'diamondtime-store',
            name: 'DiamondTime Store',
            rating: 4.9,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Montres',
          subcategory: 'femme',
          specificType: 'luxe',
          image: '/assets/categorie/montres/montre1.png'
        },
        {
          id: 'watch-6',
          name: 'Montre Éducative Junior - Apprendre l\'heure en s\'amusant',
          brand: 'KidTime',
          price: 49.99,
          originalPrice: 69.99,
          discount: 29,
          rating: 4.7,
          reviewCount: 612,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'kidtime-store',
            name: 'KidTime Store',
            rating: 4.8,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Montres',
          subcategory: 'enfant',
          specificType: 'connectee',
          image: '/assets/categorie/montres/montre1.png'
        },
        // Catégorie Pantalons
        {
          id: 'pant-baby',
          name: 'Ensemble Bébé 3 Pièces - Coton Bio Doux',
          brand: 'BabyComfort',
          price: 34.99,
          originalPrice: 44.99,
          discount: 22,
          rating: 4.9,
          reviewCount: 378,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'babycomfort-store',
            name: 'BabyComfort Store',
            rating: 4.8,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Pantalons',
          subcategory: 'bebe',
          specificType: 'ensemble',
          image: '/assets/categorie/pantalons/levis-501.png'
        },
        {
          id: 'pant-1',
          name: 'Jean Slim Fit Premium - Coupe Moderne Homme',
          brand: 'DenimCo',
          price: 79.99,
          originalPrice: 99.99,
          discount: 20,
          rating: 4.5,
          reviewCount: 1245,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'denimco-store',
            name: 'DenimCo Store',
            rating: 4.7,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Pantalons',
          subcategory: 'homme',
          specificType: 'jean',
          image: '/assets/categorie/pantalons/pantalon1.png'
        },
        {
          id: 'pant-2',
          name: 'Pantalon Chino Casual - Élégance Décontractée',
          brand: 'UrbanStyle',
          price: 59.99,
          originalPrice: 79.99,
          discount: 25,
          rating: 4.4,
          reviewCount: 876,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'urbanstyle-store',
            name: 'UrbanStyle Store',
            rating: 4.6,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Pantalons',
          subcategory: 'homme',
          specificType: 'chino',
          image: '/assets/categorie/pantalons/pantalon1.png'
        },
        {
          id: 'pant-3',
          name: 'Pantalon Cargo Confort - Poches Multiples Pratiques',
          brand: 'ComfortWear',
          price: 69.99,
          originalPrice: 89.99,
          discount: 22,
          rating: 4.3,
          reviewCount: 567,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'comfortwear-store',
            name: 'ComfortWear Store',
            rating: 4.5,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Pantalons',
          subcategory: 'homme',
          specificType: 'cargo',
          image: '/assets/categorie/pantalons/pantalon1.png'
        },
        {
          id: 'pant-4',
          name: 'Legging Performance - Compression Optimale Sport',
          brand: 'ActiveWear',
          price: 39.99,
          originalPrice: 59.99,
          discount: 33,
          rating: 4.7,
          reviewCount: 1567,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'activewear-store',
            name: 'ActiveWear Store',
            rating: 4.9,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Pantalons',
          subcategory: 'femme',
          specificType: 'legging',
          image: '/assets/categorie/pantalons/pantalon1.png'
        },
        {
          id: 'pant-5',
          name: 'Jean Délavé Enfant - Résistant aux Genoux',
          brand: 'KidsDenim',
          price: 34.99,
          originalPrice: 49.99,
          discount: 30,
          rating: 4.8,
          reviewCount: 723,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'kidsdenim-store',
            name: 'KidsDenim Store',
            rating: 4.7,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Pantalons',
          subcategory: 'enfant',
          specificType: 'jean',
          image: '/assets/categorie/pantalons/pantalon1.png'
        },
        {
          id: 'pant-6',
          name: 'Jogging Enfant Douillet - Idéal pour l\'École',
          brand: 'KidComfort',
          price: 29.99,
          originalPrice: 39.99,
          discount: 25,
          rating: 4.6,
          reviewCount: 512,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'kidcomfort-store',
            name: 'KidComfort Store',
            rating: 4.5,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Pantalons',
          subcategory: 'enfant',
          specificType: 'jogging',
          image: '/assets/categorie/pantalons/pantalon1.png'
        },
        // Catégorie Vestes
        {
          id: 'jacket-baby',
          name: 'Doudoune Légère Bébé - Capuche Amovible',
          brand: 'BabyWarm',
          price: 39.99,
          originalPrice: 59.99,
          discount: 33,
          rating: 4.8,
          reviewCount: 256,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'babywarm-store',
            name: 'BabyWarm Store',
            rating: 4.7,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Vestes',
          subcategory: 'bebe',
          specificType: 'doudoune',
          image: '/assets/categorie/vestes/north-face.png'
        },
        {
          id: 'jacket-1',
          name: 'Veste en Cuir Classic - Finition Premium',
          brand: 'LeatherPro',
          price: 199.99,
          originalPrice: 249.99,
          discount: 20,
          rating: 4.8,
          reviewCount: 756,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'leatherpro-store',
            name: 'LeatherPro Store',
            rating: 4.9,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Vestes',
          subcategory: 'homme',
          specificType: 'cuir',
          image: '/assets/categorie/vestes/veste1.png'
        },
        {
          id: 'jacket-2',
          name: 'Veste Bomber Tendance - Style Urbain Moderne',
          brand: 'UrbanStyle',
          price: 129.99,
          originalPrice: 159.99,
          discount: 19,
          rating: 4.6,
          reviewCount: 543,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'urbanstyle-store',
            name: 'UrbanStyle Store',
            rating: 4.7,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Vestes',
          subcategory: 'femme',
          specificType: 'bomber',
          image: '/assets/categorie/vestes/veste1.png'
        },
        {
          id: 'jacket-3',
          name: 'Veste Jean Vintage - Délavage Authentique',
          brand: 'DenimCo',
          price: 89.99,
          originalPrice: 119.99,
          discount: 25,
          rating: 4.7,
          reviewCount: 438,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'denimco-store',
            name: 'DenimCo Store',
            rating: 4.8,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Vestes',
          subcategory: 'homme',
          specificType: 'jean',
          image: '/assets/categorie/vestes/veste1.png'
        },
        {
          id: 'jacket-4',
          name: 'Doudoune Hiver Ultra-Chaude - Protection Grand Froid',
          brand: 'WinterStyle',
          price: 179.99,
          originalPrice: 219.99,
          discount: 18,
          rating: 4.9,
          reviewCount: 723,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'winterstyle-store',
            name: 'WinterStyle Store',
            rating: 4.8,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Vestes',
          subcategory: 'enfant',
          specificType: 'doudoune',
          image: '/assets/categorie/vestes/veste1.png'
        },
        {
          id: 'jacket-5',
          name: 'Veste Imperméable Enfant - Capuche Détachable',
          brand: 'KidsOutdoor',
          price: 59.99,
          originalPrice: 79.99,
          discount: 25,
          rating: 4.7,
          reviewCount: 512,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'kidsoutdoor-store',
            name: 'KidsOutdoor Store',
            rating: 4.6,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Vestes',
          subcategory: 'enfant',
          specificType: 'impermeable',
          image: '/assets/categorie/vestes/veste1.png'
        },
        {
          id: 'jacket-6',
          name: 'Veste Légère Femme - Coupe-Vent Respirante',
          brand: 'ActiveWear',
          price: 69.99,
          originalPrice: 89.99,
          discount: 22,
          rating: 4.5,
          reviewCount: 487,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'activewear-store',
            name: 'ActiveWear Store',
            rating: 4.7,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Vestes',
          subcategory: 'femme',
          specificType: 'sport',
          image: '/assets/categorie/vestes/veste1.png'
        },
        // Catégorie Accessoires
        {
          id: 'acc-baby',
          name: 'Bavoir Imperméable Bébé - Lot de 3 Motifs Animaux',
          brand: 'BabyClean',
          price: 14.99,
          originalPrice: 19.99,
          discount: 25,
          rating: 4.9,
          reviewCount: 423,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'babyclean-store',
            name: 'BabyClean Store',
            rating: 4.8,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Accessoires',
          image: '/assets/categorie/accessoires/louis-vuitton.png'
        },
        {
          id: 'acc-1',
          name: 'Sac à Dos Premium - Compartiment Ordinateur Portable',
          brand: 'BagMaster',
          price: 79.99,
          originalPrice: 99.99,
          discount: 20,
          rating: 4.7,
          reviewCount: 923,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'bagmaster-store',
            name: 'BagMaster Store',
            rating: 4.8,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Accessoires',
          image: '/assets/categorie/accessoires/louis-vuitton.png'
        },
        {
          id: 'acc-2',
          name: 'Ceinture Cuir Luxe - Finition Artisanale Italienne',
          brand: 'LeatherPro',
          price: 49.99,
          originalPrice: 69.99,
          discount: 29,
          rating: 4.6,
          reviewCount: 567,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'leatherpro-store',
            name: 'LeatherPro Store',
            rating: 4.9,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Accessoires',
          image: '/assets/categorie/accessoires/arriver (2).png'
        },
        {
          id: 'acc-3',
          name: 'Portefeuille Classic - Cuir Véritable Multi-Compartiments',
          brand: 'WalletCraft',
          price: 39.99,
          originalPrice: 49.99,
          discount: 20,
          rating: 4.5,
          reviewCount: 345,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'walletcraft-store',
            name: 'WalletCraft Store',
            rating: 4.7,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Accessoires',
          image: '/assets/categorie/accessoires/arriver (2).png'
        },
        {
          id: 'acc-4',
          name: 'Écharpe Cachemire Luxe - Tissage Écossais Traditionnel',
          brand: 'LuxTextile',
          price: 59.99,
          originalPrice: 79.99,
          discount: 25,
          rating: 4.8,
          reviewCount: 512,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'luxtextile-store',
            name: 'LuxTextile Store',
            rating: 4.7,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Accessoires',
          image: '/assets/categorie/accessoires/arriver (2).png'
        },
        {
          id: 'acc-5',
          name: 'Bonnet Enfant Coloré - Doublure Polaire Chaude',
          brand: 'KidsStyle',
          price: 19.99,
          originalPrice: 29.99,
          discount: 33,
          rating: 4.9,
          reviewCount: 623,
          availability: 'En stock',
          deliveryDate: 'Livraison gratuite demain',
          seller: {
            id: 'kidsstyle-store',
            name: 'KidsStyle Store',
            rating: 4.8,
            isVerified: true
          },
          isPrime: true,
          promo: true,
          isNew: true,
          category: 'Accessoires',
          image: '/assets/categorie/accessoires/arriver (2).png'
        }
      ];

      // Fusionner les produits existants avec les produits mockés
      setAllProducts([...allProductsArray, ...mockProducts]);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ajouter un nouveau produit
  const addProduct = (product, vendorId) => {
    try {
      const vendorsProducts = JSON.parse(localStorage.getItem('vendorsProducts') || '{}');
      
      if (!vendorsProducts[vendorId]) {
        vendorsProducts[vendorId] = [];
      }

      // Générer un slug propre à partir du nom si non fourni
      const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Ajouter l'ID du vendeur au produit
      const productWithVendor = {
        ...product,
        seller: {
          id: vendorId,
          name: product.sellerName || 'Vendeur',
          rating: 5.0,
          isVerified: false
        },
        // Champs SEO par défaut si non fournis
        seoKeywords: product.seoKeywords || [],
        seoTitle: product.seoTitle || product.name,
        seoDescription: product.seoDescription || product.description || '',
        slug: product.slug || generateSlug(product.name)
      };

      vendorsProducts[vendorId].push(productWithVendor);
      localStorage.setItem('vendorsProducts', JSON.stringify(vendorsProducts));
      
      // Recharger tous les produits
      loadAllProducts();
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      return { success: false, error: error.message };
    }
  };

  // Fonction pour obtenir les produits d'un vendeur
  const getVendorProducts = (vendorId) => {
    try {
      const vendorsProducts = JSON.parse(localStorage.getItem('vendorsProducts') || '{}');
      return vendorsProducts[vendorId] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des produits du vendeur:', error);
      return [];
    }
  };

  // Fonction pour rechercher des produits avec filtres
  const searchProducts = (query = '', filters = {}) => {
    let filteredProducts = [...allProducts];

    // Recherche par nom/brand
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
        (product.description && product.description.toLowerCase().includes(searchTerm))
      );
    }

    // Filtres
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category === filters.category
      );
    }

    if (filters.priceRange) {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max
      );
    }

    if (filters.seller) {
      filteredProducts = filteredProducts.filter(product =>
        product.seller.id === filters.seller
      );
    }

    return filteredProducts;
  };

  const value = {
    products: allProducts,
    allProducts, // Ajout de allProducts directement
    loading,
    addProduct,
    getVendorProducts,
    searchProducts,
    loadAllProducts
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
