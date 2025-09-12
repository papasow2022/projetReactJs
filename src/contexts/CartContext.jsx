import React, { createContext, useContext, useState, useEffect } from 'react';
import useStock from '../hooks/useStock';

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
  
  // Initialiser directement avec les données du localStorage
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          console.log('🛒 Panier chargé au démarrage:', parsed.length, 'articles');
          return parsed;
        } catch (error) {
          console.error('Erreur lors du chargement du panier:', error);
          return [];
        }
      }
    }
    console.log('🛒 Aucun panier trouvé dans localStorage, initialisation vide');
    return [];
  });
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [stockMessages, setStockMessages] = useState({});

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        console.log('🛒 Panier sauvegardé:', cartItems.length, 'articles');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du panier:', error);
      }
    }
  }, [cartItems]);

  const getReservedQty = (productId) => {
    return cartItems
      .filter(item => item.id === productId)
      .reduce((sum, item) => sum + (item.qty || 0), 0);
  };

  // Ajouter un produit au panier avec gestion de stock interconnectée
  const addToCart = async (product, quantity = 1) => {
    setIsAddingToCart(true);
    setStockMessages({});
    
    try {
      // Déterminer la catégorie du produit
      const category = product.subcategory || product.category || 'homme';
      
      // Déterminer un identifiant stock compatible
      const looksLikeObjectId = typeof product.id === 'string' && /^[a-f\d]{24}$/i.test(product.id);
      const looksLikePath = typeof product.id === 'string' && product.id.includes('/');
      const randomIdByCategory = category === 'femme' ? 'femme-random' : category === 'enfant' ? 'enfant-random' : 'homme-random';
      const stockProductId = looksLikeObjectId || looksLikePath ? product.id : randomIdByCategory;

      // Vérifier le stock disponible via l'API
      const stockCheck = await checkStock(stockProductId, category, quantity);
      
      if (!stockCheck.canAdd) {
        const available = typeof stockCheck.availableStock === 'number' ? stockCheck.availableStock : undefined;
        const outMsg = stockCheck.message 
          || (available === 0
                ? 'Ce produit est actuellement en rupture de stock.'
                : available > 0
                  ? `Stock insuffisant. Il reste seulement ${available} exemplaire(s).`
                  : 'Impossible d\'ajouter ce produit pour le moment.');
        setStockMessages({
          [product.id]: {
            type: 'error',
            message: outMsg
          }
        });
        return { success: false, error: 'out_of_stock', message: outMsg };
      }

      // Réserver le stock via l'API
      const stockReservation = await reserveStock(stockProductId, category, quantity);
      
      if (!stockReservation.success) {
        const resMsg = stockReservation.message || 'Réservation de stock impossible. Veuillez réessayer.';
        setStockMessages({
          [product.id]: {
            type: 'error',
            message: resMsg
          }
        });
        return { success: false, error: 'reservation_failed', message: resMsg };
      }

      // Ajouter au panier local (cap à la quantité autorisée)
      setCartItems(prevItems => {
        const uniqueId = `${product.id}-${product.color || 'default'}-${product.size || 'default'}`;
        const existingItem = prevItems.find(item => {
          const itemUniqueId = `${item.id}-${item.color || 'default'}-${item.size || 'default'}`;
          return itemUniqueId === uniqueId;
        });
        
        if (existingItem) {
          return prevItems.map(item => {
            const itemUniqueId = `${item.id}-${item.color || 'default'}-${item.size || 'default'}`;
            if (itemUniqueId !== uniqueId) return item;
            const maxAllowed = Math.max(1, Number(stockReservation.remainingStock ?? item.stock ?? 1));
            const nextQty = Math.min(item.qty + quantity, maxAllowed);
            return { ...item, qty: nextQty, stock: stockReservation.remainingStock };
          });
        } else {
          const newItem = {
            id: product.id,
            name: product.nom || product.name,
            price: product.prix || product.price,
            image: product.image,
            color: product.color,
            size: product.size,
            qty: Math.min(quantity, Math.max(1, Number(stockReservation.remainingStock ?? 1))),
            type: product.type || 'product',
            seller: product.vendeur || product.seller,
            stock: stockReservation.remainingStock,
            category: category
          };
          return [...prevItems, newItem];
        }
      });

      // Message de succès
      setStockMessages({
        [product.id]: {
          type: 'success',
          message: stockReservation.message || 'Ajouté au panier. Stock réservé avec succès.'
        }
      });

      setShowCartSidebar(true);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      return { success: false, error: error.message };
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Supprimer un produit du panier avec restauration du stock
  const removeFromCart = async (productId, variant = {}) => {
    try {
      // Trouver l'item à supprimer pour récupérer la quantité et la catégorie
      const itemToRemove = cartItems.find(item => {
        if (item.id !== productId) return false;
        if (variant && (variant.color || variant.size)) {
          return (variant.color ? item.color === variant.color : true) &&
                 (variant.size ? item.size === variant.size : true);
        }
        return true;
      });

      if (itemToRemove && itemToRemove.category) {
        // Restaurer le stock via l'API
        await restoreStock(productId, itemToRemove.category, itemToRemove.qty);
        console.log(`Stock restauré: ${itemToRemove.qty} exemplaires pour ${productId}`);
      }

      // Supprimer du panier local
      setCartItems(prevItems => prevItems.filter(item => {
        if (item.id !== productId) return true;
        if (variant && (variant.color || variant.size)) {
          return !(
            (variant.color ? item.color === variant.color : true) &&
            (variant.size ? item.size === variant.size : true)
          );
        }
        return false;
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      // Supprimer quand même du panier local même en cas d'erreur API
      setCartItems(prevItems => prevItems.filter(item => {
        if (item.id !== productId) return true;
        if (variant && (variant.color || variant.size)) {
          return !(
            (variant.color ? item.color === variant.color : true) &&
            (variant.size ? item.size === variant.size : true)
          );
        }
        return false;
      }));
    }
  };

  // Mettre à jour la quantité d'un produit (réservation/restauration en delta)
  const updateQuantity = async (productId, newQuantity, variant = {}) => {
    // Récupérer l'item concerné
    const item = cartItems.find(i => {
      if (i.id !== productId) return false;
      if (variant && (variant.color || variant.size)) {
        return (variant.color ? i.color === variant.color : true) &&
               (variant.size ? i.size === variant.size : true);
      }
      return true;
    });

    if (!item) return;

    if (newQuantity <= 0) {
      await removeFromCart(productId, variant);
      return;
    }

    const category = item.category || 'homme';
    const looksLikeObjectId = typeof item.id === 'string' && /^[a-f\d]{24}$/i.test(item.id);
    const looksLikePath = typeof item.id === 'string' && item.id.includes('/');
    const randomIdByCategory = category === 'femme' ? 'femme-random' : category === 'enfant' ? 'enfant-random' : 'homme-random';
    const stockProductId = looksLikeObjectId || looksLikePath ? item.id : randomIdByCategory;

    const currentQty = item.qty || 0;
    const delta = newQuantity - currentQty;

    try {
      if (delta > 0) {
        // Vérifier et réserver le delta supplémentaire
        const check = await checkStock(stockProductId, category, delta);
        if (!check.canAdd) {
          const message = `La quantité définie pour ce produit est insuffisante. Veuillez patienter ou choisir un autre produit. (Disponible: ${check.availableStock})`;
          setStockMessages(prev => ({ ...prev, [productId]: { type: 'error', message } }));
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
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
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
    return cartItems.some(item => item.id === productId);
  };

  // Obtenir la quantité d'un produit dans le panier
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.qty : 0;
  };

  const value = {
    cartItems,
    showCartSidebar,
    isAddingToCart,
    stockLoading,
    stockError,
    stockMessages,
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
    restoreStock
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 