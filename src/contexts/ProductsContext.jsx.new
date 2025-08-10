import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts doit être utilisé dans un ProductsProvider');
  }
  return context;
};

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
          name: 'Nike Air Max 270',
          price: 129.99,
          rating: 4.5,
          reviewCount: 1247,
          category: 'Chaussures',
          isNew: true,
          image: '/assets/categorie/chaussures/nike-air-max.png'
        },
        {
          id: 'shoe-2',
          name: 'Puma RS-X Reinvention',
          price: 109.99,
          rating: 4.2,
          reviewCount: 756,
          category: 'Chaussures',
          isNew: true,
          image: '/assets/categorie/chaussures/puma-rs-x.png'
        },
        {
          id: 'shoe-3',
          name: 'New Balance 574',
          price: 99.99,
          rating: 4.6,
          reviewCount: 1023,
          category: 'Chaussures',
          isNew: true,
          image: '/assets/categorie/chaussures/new-balance.png'
        },
        // Catégorie Électronique
        {
          id: 'elec-1',
          name: 'Samsung Galaxy S23 Ultra',
          price: 1199.99,
          rating: 4.7,
          reviewCount: 2345,
          category: 'Électronique',
          isNew: true,
          image: '/assets/categorie/electronique/samsung-s23.png'
        },
        {
          id: 'elec-2',
          name: 'Apple MacBook Air M2',
          price: 1199.99,
          rating: 4.6,
          reviewCount: 1567,
          category: 'Électronique',
          isNew: true,
          image: '/assets/categorie/electronique/macbook-air.png'
        },
        {
          id: 'elec-3',
          name: 'Sony WH-1000XM4',
          price: 349.99,
          rating: 4.8,
          reviewCount: 3456,
          category: 'Électronique',
          isNew: true,
          image: '/assets/categorie/electronique/sony-wh1000xm4.png'
        },
        // Catégorie Pantalons
        {
          id: 'pant-1',
          name: 'Levis 501 Original',
          price: 89.99,
          rating: 4.4,
          reviewCount: 856,
          category: 'Pantalons',
          isNew: true,
          image: '/assets/categorie/pantalons/levis-501.png'
        },
        {
          id: 'pant-2',
          name: 'Dockers Alpha Khaki',
          price: 69.99,
          rating: 4.3,
          reviewCount: 567,
          category: 'Pantalons',
          isNew: true,
          image: '/assets/categorie/pantalons/dockers-alpha.png'
        },
        // Catégorie Vestes
        {
          id: 'jack-1',
          name: 'The North Face Resolve',
          price: 129.99,
          rating: 4.6,
          reviewCount: 789,
          category: 'Vestes',
          isNew: true,
          image: '/assets/categorie/vestes/north-face-resolve.png'
        },
        // Catégorie Montres
        {
          id: 'watch-1',
          name: 'Seiko 5 Sports',
          price: 299.99,
          rating: 4.5,
          reviewCount: 432,
          category: 'Montres',
          isNew: true,
          image: '/assets/categorie/montres/seiko-5.png'
        },
        // Catégorie Accessoires
        {
          id: 'acc-1',
          name: 'Ray-Ban Wayfarer',
          price: 149.99,
          rating: 4.7,
          reviewCount: 678,
          category: 'Accessoires',
          isNew: true,
          image: '/assets/categorie/accessoires/rayban-wayfarer.png'
        }
      ];

      // Fusionner les produits existants avec les produits mockés
      setAllProducts([...allProductsArray, ...mockProducts]);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      setLoading(false);
    }
  };

  // Fonction pour ajouter un nouveau produit
  const addProduct = (product) => {
    setAllProducts(prevProducts => [...prevProducts, product]);
  };

  // Fonction pour obtenir les produits d'un vendeur
  const getVendorProducts = (vendorId) => {
    return allProducts.filter(product => product.sellerId === vendorId);
  };

  // Fonction pour rechercher des produits avec filtres
  const searchProducts = (query = '', filters = {}) => {
    let filteredProducts = [...allProducts];

    // Filtre par texte
    if (query) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category === filters.category
      );
    }

    // Filtre par prix
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => {
        const price = product.price;
        const minOk = filters.minPrice === undefined || price >= filters.minPrice;
        const maxOk = filters.maxPrice === undefined || price <= filters.maxPrice;
        return minOk && maxOk;
      });
    }

    return filteredProducts;
  };

  const value = {
    products: allProducts,
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
