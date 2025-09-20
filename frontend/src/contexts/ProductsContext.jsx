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
  const [loading, setLoading] = useState(false);
  const [channel] = useState(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try { return new BroadcastChannel('products_channel'); } catch { return null; }
    }
    return null;
  });

  useEffect(() => {
    loadAllProducts();
  }, []);

  // Ecouter les changements depuis d'autres onglets/pages et recharger automatiquement
  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'vendorsProducts') {
        loadAllProducts();
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', onStorage);
    }
    let onMessage;
    if (channel) {
      onMessage = (e) => {
        if (e?.data === 'vendorsProducts_updated') {
          loadAllProducts();
        }
      };
      channel.addEventListener('message', onMessage);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', onStorage);
      }
      if (channel && onMessage) {
        channel.removeEventListener('message', onMessage);
      }
    };
  }, [channel]);

  const loadAllProducts = async () => {
    setLoading(true);
    try {
      // 1) Produits backend (via API)
      let backendProducts = [];
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          backendProducts = await res.json();
        }
      } catch {}

      // 2) Récupérer les produits existants des vendeurs (local fallback)
      const vendorsProductsLocal = JSON.parse(localStorage.getItem('vendorsProducts') || '{}');
      const vendorLocalArray = [];
      Object.values(vendorsProductsLocal).forEach(vendorProducts => {
        if (Array.isArray(vendorProducts)) {
          vendorLocalArray.push(...vendorProducts);
        }
      });

      // 3) Ajouter les produits Christian Louboutin (garantir présence initiale)
      const christianLouboutinProducts = [
        {
          id: 'cl-escarpins-noir-001',
          name: 'Christian Louboutin Escarpins',
          image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins.jpeg',
          price: 1250000,
          brand: 'Christian Louboutin',
          category: 'Chaussures',
          subcategory: 'femme',
          status: 'approved',
          visible: true,
          rating: 4.8,
          reviewCount: 12,
          vendor: 'Boutique',
          vendorId: 'christian-louboutin',
          stock: 3,
          description: 'Escarpins Christian Louboutin en cuir noir avec semelle rouge signature.'
        },
        {
          id: 'cl-heels-classic-002',
          name: 'Christian Louboutin Heels - Classic',
          image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg',
          price: 1200000,
          brand: 'Christian Louboutin',
          category: 'Chaussures',
          subcategory: 'femme',
          status: 'approved',
          visible: true,
          rating: 4.7,
          reviewCount: 8,
          vendor: 'Boutique',
          vendorId: 'christian-louboutin',
          stock: 2,
          description: 'Talons hauts Christian Louboutin classiques en cuir noir.'
        },
        {
          id: 'cl-heels-collection-speciale-003',
          name: 'Christian Louboutin Heels - Collection Spéciale',
          image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg',
          price: 1180000,
          brand: 'Christian Louboutin',
          category: 'Chaussures',
          subcategory: 'femme',
          status: 'approved',
          visible: true,
          rating: 4.6,
          reviewCount: 5,
          vendor: 'Boutique',
          vendorId: 'christian-louboutin',
          stock: 1,
          description: 'Collection spéciale Christian Louboutin avec détails exclusifs.'
        },
        {
          id: 'cl-heels-edition-limitee-004',
          name: 'Christian Louboutin Heels - Édition Limitée',
          image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg',
          price: 1220000,
          brand: 'Christian Louboutin',
          category: 'Chaussures',
          subcategory: 'femme',
          status: 'approved',
          visible: true,
          rating: 4.9,
          reviewCount: 3,
          vendor: 'Boutique',
          vendorId: 'christian-louboutin',
          stock: 1,
          description: 'Édition limitée Christian Louboutin avec finitions exceptionnelles.'
        },
        {
          id: 'cl-heels-design-exclusif-005',
          name: 'Christian Louboutin Heels - Design Exclusif',
          image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg',
          price: 1190000,
          brand: 'Christian Louboutin',
          category: 'Chaussures',
          subcategory: 'femme',
          status: 'approved',
          visible: true,
          rating: 4.5,
          reviewCount: 7,
          vendor: 'Boutique',
          vendorId: 'christian-louboutin',
          stock: 2,
          description: 'Design exclusif Christian Louboutin avec motifs uniques.'
        },
        {
          id: 'cl-heels-collection-premium-006',
          name: 'Christian Louboutin Heels - Collection Premium',
          image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg',
          price: 1210000,
          brand: 'Christian Louboutin',
          category: 'Chaussures',
          subcategory: 'femme',
          status: 'approved',
          visible: true,
          rating: 4.8,
          reviewCount: 4,
          vendor: 'Boutique',
          vendorId: 'christian-louboutin',
          stock: 1,
          description: 'Collection premium Christian Louboutin avec matériaux de luxe.'
        }
      ];

      // 4) Fusionner (backend d'abord), puis local, puis seed CL
      const merged = [...backendProducts, ...vendorLocalArray, ...christianLouboutinProducts];

      setAllProducts(merged);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarde résiliente pour éviter le quota exceeded
  const trySaveVendorsProducts = (vendorsProducts) => {
    const save = (obj) => localStorage.setItem('vendorsProducts', JSON.stringify(obj));
    const sanitize = (obj, aggressive = false) => {
      const out = {};
      Object.keys(obj).forEach(vId => {
        const list = Array.isArray(obj[vId]) ? obj[vId] : [];
        let trimmed = list.map(p => {
          const np = { ...p };
          if (typeof np.image === 'string' && np.image.startsWith('data:')) {
            if (aggressive || np.image.length > 50000) np.image = null;
          }
          if (typeof np.description === 'string') {
            np.description = np.description.slice(0, aggressive ? 300 : 1000);
          }
          // Eviter des champs volumineux non essentiels
          if (np.images && Array.isArray(np.images)) {
            np.images = np.images.slice(0, aggressive ? 1 : 4);
          }
          return np;
        });
        if (aggressive && trimmed.length > 500) trimmed = trimmed.slice(-500);
        out[vId] = trimmed;
      });
      return out;
    };
    try {
      save(vendorsProducts);
      return { success: true };
    } catch (e1) {
      try {
        const light = sanitize(vendorsProducts, false);
        save(light);
        return { success: true, sanitized: true };
      } catch (e2) {
        try {
          const lighter = sanitize(vendorsProducts, true);
          save(lighter);
          return { success: true, sanitized: true, aggressive: true };
        } catch (e3) {
          console.error('Quota localStorage dépassé pour vendorsProducts:', e3);
          return { success: false, error: 'quota_exceeded' };
        }
      }
    }
  };

  const addProduct = async (product, vendorId) => {
    // Essayer d'abord l'API backend
    try {
      const resp = await fetch(`/api/vendors/${vendorId}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (resp.ok) {
        if (channel) channel.postMessage('vendorsProducts_updated');
        await loadAllProducts();
        return { success: true };
      }
    } catch {}

    // Fallback localStorage si backend indisponible
    try {
      const vendorsProducts = JSON.parse(localStorage.getItem('vendorsProducts') || '{}');
      if (!vendorsProducts[vendorId]) vendorsProducts[vendorId] = [];
      const enrichedProduct = {
        status: 'pending',
        rating: 0,
        sales: 0,
        submittedAt: new Date().toISOString(),
        vendorId: vendorId,
        vendor: product.sellerName || product.vendor || 'Vendeur',
        ...product,
      };
      vendorsProducts[vendorId].push(enrichedProduct);
      const res = trySaveVendorsProducts(vendorsProducts);
      if (!res.success) {
        return { success: false, error: 'Stockage local plein (quota). Réduisez la taille des images ou supprimez des anciens produits.' };
      }
      if (channel) channel.postMessage('vendorsProducts_updated');
      await loadAllProducts();
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      return { success: false, error: error.message };
    }
  };

  const getVendorProducts = (vendorId) => {
    try {
      const vendorsProducts = JSON.parse(localStorage.getItem('vendorsProducts') || '{}');
      return vendorsProducts[vendorId] || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des produits du vendeur:', error);
      return [];
    }
  };

  const searchProducts = (searchTerm, filters = {}) => {
    let filteredProducts = allProducts;

    // Recherche textuelle
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  // Utilitaire pour mettre à jour un produit côté storage vendeurs
  const mutateVendorProduct = (productId, mutateFn) => {
    const vendorsProducts = JSON.parse(localStorage.getItem('vendorsProducts') || '{}');
    let found = false;
    Object.keys(vendorsProducts).forEach((vid) => {
      const list = vendorsProducts[vid] || [];
      const idx = list.findIndex(p => p.id === productId);
      if (idx !== -1) {
        const current = list[idx];
        const updated = mutateFn(current, vid);
        if (updated === null) {
          // suppression
          list.splice(idx, 1);
        } else {
          list[idx] = { ...current, ...updated };
        }
        vendorsProducts[vid] = list;
        found = true;
      }
    });
    const res = trySaveVendorsProducts(vendorsProducts);
    if (channel) channel.postMessage('vendorsProducts_updated');
    return found;
  };

  const updateProductStatus = (productId, newStatus) => {
    try {
      const ok = mutateVendorProduct(productId, (current) => {
        if (newStatus === 'approved') {
          const slugBase = (current.slug || `${(current.name || 'produit').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`);
          const slug = `${slugBase}-${current.id}`;
          const publishedAt = current.publishedAt || new Date().toISOString();
          // isNew pendant 30 jours
          const isNew = true;
          return { status: 'approved', publishedAt, visible: true, slug, isNew };
        }
        if (newStatus === 'rejected') {
          return { status: 'rejected', visible: false };
        }
        return { status: newStatus };
      });
      if (!ok) return { success: false, error: 'Produit introuvable' };
      loadAllProducts();
      return { success: true };
    } catch (e) {
      console.error('Erreur updateProductStatus:', e);
      return { success: false, error: e.message };
    }
  };

  const deleteProduct = (productId) => {
    try {
      const ok = mutateVendorProduct(productId, () => null);
      if (!ok) return { success: false, error: 'Produit introuvable' };
      loadAllProducts();
      return { success: true };
    } catch (e) {
      console.error('Erreur deleteProduct:', e);
      return { success: false, error: e.message };
    }
  };

  const clearVendorProducts = (vendorId) => {
    try {
      const vendorsProducts = JSON.parse(localStorage.getItem('vendorsProducts') || '{}');
      if (vendorsProducts[vendorId]) {
        vendorsProducts[vendorId] = [];
        const res = trySaveVendorsProducts(vendorsProducts);
        if (!res.success) return { success: false, error: 'quota_exceeded' };
        if (channel) channel.postMessage('vendorsProducts_updated');
        loadAllProducts();
      }
      return { success: true };
    } catch (e) {
      console.error('Erreur clearVendorProducts:', e);
      return { success: false, error: e.message };
    }
  };

  const getAllProducts = () => {
    return allProducts;
  };

  const value = {
    products: allProducts,
    allProducts, // Ajout de allProducts directement
    approvedProducts: allProducts.filter(p => p.status === 'approved' && (p.visible ?? true)),
    newProducts: allProducts.filter(p => p.status === 'approved' && (p.visible ?? true) && (() => {
      const publishedAt = p.publishedAt ? new Date(p.publishedAt) : null;
      if (!publishedAt) return false;
      const days = (Date.now() - publishedAt.getTime()) / (1000*60*60*24);
      return days <= 30;
    })()),
    loading,
    addProduct,
    getVendorProducts,
    searchProducts,
    loadAllProducts,
    updateProductStatus,
    deleteProduct,
    clearVendorProducts,
    getAllProducts
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export { ProductsContext };