import React, { createContext, useContext, useState, useEffect } from 'react';
import useStock from '../hooks/useStock';
import { useStock as useStockNotifications } from './StockContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Hook pour gérer le stock
  const { checkStock, reserveStock, restoreStock, loading: stockLoading, error: stockError } = useStock();
  // Hook pour les notifications
  const { addNotification } = useStockNotifications();
  
  // États du panier
  const [cartItems, setCartItems] = useState([]);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [stockMessages, setStockMessages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsUserLoggedIn(!!(token && user));
  }, []);

  // Obtenir le token d'authentification
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Charger le panier depuis la base de données ou le localStorage
  const loadCart = async () => {
    if (isUserLoggedIn) {
      // Charger depuis la base de données
      try {
        const token = getAuthToken();
        const response = await fetch(`${baseUrl}/api/cart`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.cart) {
            setCartItems(data.cart.items || []);
            setCartId(data.cart._id);
            console.log('🛒 Panier chargé depuis la base de données:', data.cart.items.length, 'articles');
            return;
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier depuis la DB:', error);
      }
    }

    // Fallback: charger depuis localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCartItems(parsed);
          console.log('🛒 Panier chargé depuis localStorage:', parsed.length, 'articles');
        } catch (error) {
          console.error('Erreur lors du chargement du panier:', error);
          setCartItems([]);
        }
      }
    }
  };

  // Sauvegarder le panier
  const saveCart = async (items) => {
    if (isUserLoggedIn && cartId) {
      // Sauvegarder en base de données
      try {
        const token = getAuthToken();
        const response = await fetch(`${baseUrl}/api/cart/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ localItems: items })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCartId(data.cart._id);
            console.log('🛒 Panier sauvegardé en base de données');
            return;
          }
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde en DB:', error);
      }
    }

    // Fallback: sauvegarder en localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cart', JSON.stringify(items));
        console.log('🛒 Panier sauvegardé en localStorage');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    }
  };

  // Charger le panier au démarrage
  useEffect(() => {
    loadCart();
  }, [isUserLoggedIn]);

  // Sauvegarder le panier à chaque modification
  useEffect(() => {
    if (cartItems.length > 0) {
      saveCart(cartItems);
    }
  }, [cartItems, isUserLoggedIn]);

  const getReservedQty = (productId) => {
    return cartItems
      .filter(item => item.id === productId || item.productId === productId)
      .reduce((sum, item) => sum + (item.qty || 0), 0);
  };

  // Ajouter un produit au panier avec gestion de stock interconnectée
  const addToCart = async (product, quantity = 1) => {
    setIsAddingToCart(true);
    setStockMessages({});
    
    try {
      // Déterminer la catégorie du produit (priorité à subcategory)
      const category = product.subcategory || (product.category === 'Chaussures' ? 'homme' : product.category) || 'homme';
      
      // Déterminer un identifiant stock compatible
      const looksLikeObjectId = typeof product.id === 'string' && /^[a-f\d]{24}$/i.test(product.id);
      const looksLikePath = typeof product.id === 'string' && product.id.includes('/');
      const isSyntheticId = typeof product.id === 'string' && product.id.startsWith('synthetic-');
      const randomIdByCategory = category === 'femme' ? 'femme-random' : category === 'enfant' ? 'enfant-random' : 'homme-random';
      const stockProductId = (looksLikeObjectId || looksLikePath) && !isSyntheticId ? product.id : randomIdByCategory;

      // Pas de vérification du stock - simulation pure
      console.log('✅ Ajout au panier sans vérification du stock');

      // Pas de réservation du stock - simulation pure
      console.log('✅ Pas de réservation du stock');

      // Créer l'article pour le panier
      const newItem = {
        id: product.id,
        productId: product.id,
        name: product.nom || product.name,
        price: product.prix || product.price,
        image: product.image,
        color: product.color,
        size: product.size,
        qty: quantity,
        type: product.type || 'product',
        seller: product.vendeur || product.seller,
        stock: 8, // Stock simulé
        category: category,
        // Informations enrichies pour le backend
        brand: product.brand || product.marque,
        genre: product.genre || category
      };

      // Ajouter au panier local
      setCartItems(prevItems => {
        const uniqueId = `${product.id}-${product.color || 'default'}-${product.size || 'default'}`;
        const existingItem = prevItems.find(item => {
          const itemUniqueId = `${item.id || item.productId}-${item.color || 'default'}-${item.size || 'default'}`;
          return itemUniqueId === uniqueId;
        });
        
        if (existingItem) {
          return prevItems.map(item => {
            const itemUniqueId = `${item.id || item.productId}-${item.color || 'default'}-${item.size || 'default'}`;
            if (itemUniqueId !== uniqueId) return item;
            const maxAllowed = Math.max(1, Number(item.stock ?? 8));
            const nextQty = Math.min(item.qty + quantity, maxAllowed);
            return { ...item, qty: nextQty, stock: 8 };
          });
        } else {
          return [...prevItems, newItem];
        }
      });

      // Message de succès
      setStockMessages({
        [product.id]: {
          type: 'success',
          message: `Ajouté au panier ! Stock restant: 8`
        }
      });

      return { success: true, message: 'Produit ajouté au panier' };

    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      setStockMessages({
        [product.id]: {
          type: 'error',
          message: 'Erreur lors de l\'ajout au panier'
        }
      });
      return { success: false, error: 'add_failed', message: 'Erreur lors de l\'ajout au panier' };
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Supprimer un produit du panier
  const removeFromCart = async (productId) => {
    const item = cartItems.find(item => (item.id === productId || item.productId === productId));
    if (!item) return;

    try {
      // Restaurer le stock
      const category = item.category || 'homme';
      const isSyntheticId = typeof (item.id || item.productId) === 'string' && (item.id || item.productId).startsWith('synthetic-');
      const randomIdByCategory = category === 'femme' ? 'femme-random' : category === 'enfant' ? 'enfant-random' : 'homme-random';
      const stockProductId = !isSyntheticId ? (item.id || item.productId) : randomIdByCategory;
      await restoreStock(stockProductId, category, item.qty);
    } catch (error) {
      console.error('Erreur lors de la restauration du stock:', error);
    }

    // Supprimer du panier local
    setCartItems(prevItems => 
      prevItems.filter(item => (item.id !== productId && item.productId !== productId))
    );
  };

  // Mettre à jour la quantité d'un produit
  const updateQuantity = async (productId, newQuantity) => {
    const item = cartItems.find(item => (item.id === productId || item.productId === productId));
    if (!item) return;

    const delta = newQuantity - item.qty;
    if (delta === 0) return;

    const category = item.category || 'homme';
    const isSyntheticId = typeof (item.id || item.productId) === 'string' && (item.id || item.productId).startsWith('synthetic-');
    const randomIdByCategory = category === 'femme' ? 'femme-random' : category === 'enfant' ? 'enfant-random' : 'homme-random';
    const stockProductId = !isSyntheticId ? (item.id || item.productId) : randomIdByCategory;

    try {
      if (delta > 0) {
        // Vérifier et réserver le delta supplémentaire
        const check = await checkStock(stockProductId, category, delta);
        if (!check.canAdd) {
          const message = `❌ Stock insuffisant ! Vous demandez ${delta} exemplaire(s) mais seulement ${check.availableStock} sont disponibles. Veuillez réduire la quantité ou choisir un autre produit.`;
          setStockMessages(prev => ({ ...prev, [productId]: { type: 'error', message } }));
          addNotification(message, 'error');
          return;
        }
        const reserve = await reserveStock(stockProductId, category, delta);
        if (!reserve.success) {
          const message = reserve.message || 'Réservation impossible pour le stock demandé.';
          setStockMessages(prev => ({ ...prev, [productId]: { type: 'error', message } }));
          return;
        }
        // Mettre à jour le panier local et le stock restant connu
        setCartItems(prev => prev.map(i => (i === item ? { ...i, qty: newQuantity, stock: reserve.remainingStock } : i)));
        setStockMessages(prev => ({ ...prev, [productId]: { type: 'success', message: `Réservé: ${delta}. Stock restant: ${reserve.remainingStock}` } }));
      } else if (delta < 0) {
        // Restaurer le delta négatif
        const restore = await restoreStock(stockProductId, category, Math.abs(delta));
        // Mettre à jour localement
        setCartItems(prev => prev.map(i => (i === item ? { ...i, qty: newQuantity, stock: restore.currentStock ?? i.stock } : i)));
        setStockMessages(prev => ({ ...prev, [productId]: { type: 'info', message: `Quantité réduite. Stock actuel: ${restore.currentStock ?? ''}` } }));
      }
    } catch (e) {
      setStockMessages(prev => ({ ...prev, [productId]: { type: 'error', message: e.message || 'Erreur de stock.' } }));
    }
  };

  // Vider le panier
  const clearCart = async () => {
    // Restaurer tout le stock
    for (const item of cartItems) {
      try {
        const category = item.category || 'homme';
        const isSyntheticId = typeof (item.id || item.productId) === 'string' && (item.id || item.productId).startsWith('synthetic-');
        const randomIdByCategory = category === 'femme' ? 'femme-random' : category === 'enfant' ? 'enfant-random' : 'homme-random';
        const stockProductId = !isSyntheticId ? (item.id || item.productId) : randomIdByCategory;
        await restoreStock(stockProductId, category, item.qty);
      } catch (error) {
        console.error('Erreur lors de la restauration du stock:', error);
      }
    }

    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
  };

  // Sanitize: s'assurer qu'aucune ligne ne dépasse son stock (au rechargement par ex.)
  useEffect(() => {
    setCartItems(prev => prev.map(it => {
      const maxAllowed = Math.max(1, Number(it.stock ?? 1));
      const fixedQty = Math.min(Math.max(it.qty || 1, 1), maxAllowed);
      return fixedQty !== it.qty ? { ...it, qty: fixedQty } : it;
    }));
  }, []);

  // Calculer le total du panier
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  // Calculer le nombre total d'articles
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.qty, 0);
  };

  // Vérifier si un produit est dans le panier
  const isInCart = (productId) => {
    return cartItems.some(item => (item.id === productId || item.productId === productId));
  };

  // Obtenir la quantité d'un produit dans le panier
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => (item.id === productId || item.productId === productId));
    return item ? item.qty : 0;
  };

  // Synchroniser le panier avec la base de données
  const syncCart = async () => {
    if (!isUserLoggedIn) return;
    
    setIsLoading(true);
    try {
      await loadCart();
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cartItems,
    showCartSidebar,
    isAddingToCart,
    stockLoading,
    stockError,
    stockMessages,
    isLoading,
    cartId,
    isUserLoggedIn,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
    getItemQuantity,
    getReservedQty,
    setShowCartSidebar,
    checkStock,
    reserveStock,
    restoreStock,
    syncCart,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};