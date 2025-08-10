import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Ajouter un produit au panier (logique Amazon)
  const addToCart = async (product, quantity = 1) => {
    setIsAddingToCart(true);
    
    try {
      // Simuler un délai pour l'effet visuel
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCartItems(prevItems => {
        // Créer un identifiant unique basé sur l'ID + couleur + taille
        const uniqueId = `${product.id}-${product.color || 'default'}-${product.size || 'default'}`;
        
        const existingItem = prevItems.find(item => {
          const itemUniqueId = `${item.id}-${item.color || 'default'}-${item.size || 'default'}`;
          return itemUniqueId === uniqueId;
        });
        
        if (existingItem) {
          // Mettre à jour la quantité si le produit avec la même variante existe déjà
          return prevItems.map(item => {
            const itemUniqueId = `${item.id}-${item.color || 'default'}-${item.size || 'default'}`;
            return itemUniqueId === uniqueId
              ? { ...item, qty: item.qty + quantity }
              : item;
          });
        } else {
          // Ajouter un nouveau produit avec sa variante
          const newItem = {
            id: product.id,
            name: product.nom || product.name,
            price: product.prix || product.price,
            image: product.image,
            color: product.color,
            size: product.size,
            qty: quantity,
            type: product.type || 'product',
            seller: product.vendeur || product.seller,
            stock: product.stock || 999
          };
          return [...prevItems, newItem];
        }
      });

      // Ouvrir automatiquement le sidebar du panier (comme Amazon)
      setShowCartSidebar(true);
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      return { success: false, error: error.message };
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Supprimer un produit du panier
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Mettre à jour la quantité d'un produit
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, qty: newQuantity }
          : item
      )
    );
  };

  // Vider le panier
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

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
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
    getItemQuantity,
    setShowCartSidebar
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 