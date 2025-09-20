import { Router } from 'express';
import connectMongo from '../lib/mongo.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import { verifyToken, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Middleware pour vérifier l'authentification sur les routes qui en ont besoin
// Note: verifyToken sera appliqué individuellement sur les routes qui nécessitent une authentification

// Obtenir le panier de l'utilisateur (avec ou sans authentification)
router.get('/', optionalAuth, async (req, res) => {
  try {
    await connectMongo();
    
    // Vérifier si l'utilisateur est authentifié
    const userId = req.user?._id;
    
    if (!userId) {
      // Retourner un panier vide pour les utilisateurs non connectés
      return res.json({
        success: true,
        cart: {
          _id: null,
          items: [],
          total: 0,
          itemCount: 0,
          lastUpdated: new Date()
        }
      });
    }
    
    let cart = await Cart.findOne({ userId, isActive: true });
    
    // Créer un panier vide si aucun panier n'existe
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        total: 0,
        itemCount: 0
      });
      await cart.save();
    }
    
    res.json({
      success: true,
      cart: {
        _id: cart._id,
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount,
        lastUpdated: cart.lastUpdated
      }
    });
    
  } catch (err) {
    console.error('Erreur GET /api/cart:', err);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la récupération du panier',
      success: false 
    });
  }
});

// Ajouter un article au panier
router.post('/add', async (req, res) => {
  try {
    await connectMongo();
    
    const userId = req.user._id;
    const { productId, name, price, image, color, size, qty, type, seller, stock, category } = req.body;
    
    if (!productId || !name || !price || !category) {
      return res.status(400).json({ 
        error: 'productId, name, price et category sont requis',
        success: false 
      });
    }
    
    // Trouver ou créer le panier
    let cart = await Cart.findOne({ userId, isActive: true });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        total: 0,
        itemCount: 0
      });
    }
    
    // Créer l'article à ajouter
    const cartItem = {
      productId,
      name,
      price,
      image,
      color: color || '',
      size: size || '',
      qty: qty || 1,
      type: type || 'product',
      seller: seller || '',
      stock: stock || 0,
      category
    };
    
    // Ajouter l'article au panier
    await cart.addItem(cartItem);
    
    res.json({
      success: true,
      message: 'Article ajouté au panier',
      cart: {
        _id: cart._id,
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount
      }
    });
    
  } catch (err) {
    console.error('Erreur POST /api/cart/add:', err);
    res.status(500).json({ 
      error: 'Erreur serveur lors de l\'ajout au panier',
      success: false 
    });
  }
});

// Mettre à jour la quantité d'un article
router.put('/update-quantity', async (req, res) => {
  try {
    await connectMongo();
    
    const userId = req.user._id;
    const { productId, quantity, color, size } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({ 
        error: 'productId et quantity sont requis',
        success: false 
      });
    }
    
    const cart = await Cart.findOne({ userId, isActive: true });
    if (!cart) {
      return res.status(404).json({ 
        error: 'Panier non trouvé',
        success: false 
      });
    }
    
    await cart.updateItemQuantity(productId, quantity, color || '', size || '');
    
    res.json({
      success: true,
      message: 'Quantité mise à jour',
      cart: {
        _id: cart._id,
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount
      }
    });
    
  } catch (err) {
    console.error('Erreur PUT /api/cart/update-quantity:', err);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la mise à jour',
      success: false 
    });
  }
});

// Supprimer un article du panier
router.delete('/remove', async (req, res) => {
  try {
    await connectMongo();
    
    const userId = req.user._id;
    const { productId, color, size } = req.body;
    
    if (!productId) {
      return res.status(400).json({ 
        error: 'productId est requis',
        success: false 
      });
    }
    
    const cart = await Cart.findOne({ userId, isActive: true });
    if (!cart) {
      return res.status(404).json({ 
        error: 'Panier non trouvé',
        success: false 
      });
    }
    
    await cart.removeItem(productId, color || '', size || '');
    
    res.json({
      success: true,
      message: 'Article supprimé du panier',
      cart: {
        _id: cart._id,
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount
      }
    });
    
  } catch (err) {
    console.error('Erreur DELETE /api/cart/remove:', err);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la suppression',
      success: false 
    });
  }
});

// Vider le panier
router.delete('/clear', async (req, res) => {
  try {
    await connectMongo();
    
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId, isActive: true });
    
    if (!cart) {
      return res.status(404).json({ 
        error: 'Panier non trouvé',
        success: false 
      });
    }
    
    await cart.clear();
    
    res.json({
      success: true,
      message: 'Panier vidé',
      cart: {
        _id: cart._id,
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount
      }
    });
    
  } catch (err) {
    console.error('Erreur DELETE /api/cart/clear:', err);
    res.status(500).json({ 
      error: 'Erreur serveur lors du vidage du panier',
      success: false 
    });
  }
});

// Synchroniser le panier local avec la base de données
router.post('/sync', async (req, res) => {
  try {
    await connectMongo();
    
    const userId = req.user._id;
    const { localItems } = req.body;
    
    if (!Array.isArray(localItems)) {
      return res.status(400).json({ 
        error: 'localItems doit être un tableau',
        success: false 
      });
    }
    
    // Trouver ou créer le panier
    let cart = await Cart.findOne({ userId, isActive: true });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        total: 0,
        itemCount: 0
      });
    }
    
    // Remplacer les articles du panier par ceux du localStorage
    cart.items = localItems.map(item => ({
      productId: item.id || item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      color: item.color || '',
      size: item.size || '',
      qty: item.qty || 1,
      type: item.type || 'product',
      seller: item.seller || '',
      stock: item.stock || 0,
      category: item.category || 'homme'
    }));
    
    await cart.save();
    
    res.json({
      success: true,
      message: 'Panier synchronisé',
      cart: {
        _id: cart._id,
        items: cart.items,
        total: cart.total,
        itemCount: cart.itemCount
      }
    });
    
  } catch (err) {
    console.error('Erreur POST /api/cart/sync:', err);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la synchronisation',
      success: false 
    });
  }
});

export default router;
