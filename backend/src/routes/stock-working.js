import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

// Vérifier le stock disponible
router.post('/check', async (req, res) => {
  try {
    console.log('🔍 Requête de vérification de stock:', req.body);
    
    const { productId, category, quantity = 1 } = req.body;
    
    if (!productId || !category) {
      return res.status(400).json({ 
        error: 'productId et category sont requis',
        success: false 
      });
    }
    
    // Utiliser les collections existantes
    let collectionName;
    switch (category) {
      case 'enfant': collectionName = 'enfant_images'; break;
      case 'homme': collectionName = 'homme_images'; break;
      case 'femme': collectionName = 'femme_images'; break;
      default: 
        return res.status(400).json({ 
          error: 'Catégorie non supportée',
          success: false 
        });
    }
    
    // Récupérer un produit aléatoire de la collection
    const collection = mongoose.connection.db.collection(collectionName);
    const count = await collection.countDocuments({ active: true });
    
    if (count === 0) {
      return res.status(404).json({ 
        error: 'Aucun produit trouvé dans cette catégorie',
        success: false 
      });
    }
    
    const randomIndex = Math.floor(Math.random() * count);
    const products = await collection.find({ active: true }).skip(randomIndex).limit(1).toArray();
    const product = products[0];
    
    if (!product) {
      return res.status(404).json({ 
        error: 'Produit non trouvé',
        success: false 
      });
    }
    
    const availableStock = product.stock || 5;
    const canAdd = availableStock >= quantity;
    
    console.log('📊 Stock disponible:', availableStock, 'Demandé:', quantity, 'Peut ajouter:', canAdd);
    
    res.json({
      success: true,
      canAdd,
      availableStock,
      requestedQuantity: quantity,
      productId: product._id,
      message: canAdd ? 'Stock disponible' : 'Stock insuffisant'
    });
    
  } catch (err) {
    console.error('Erreur /api/stock/check:', err);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la vérification du stock',
      success: false 
    });
  }
});

// Réserver du stock
router.post('/reserve', async (req, res) => {
  try {
    const { productId, category, quantity = 1 } = req.body;
    
    let collectionName;
    switch (category) {
      case 'enfant': collectionName = 'enfant_images'; break;
      case 'homme': collectionName = 'homme_images'; break;
      case 'femme': collectionName = 'femme_images'; break;
      default: 
        return res.status(400).json({ 
          error: 'Catégorie non supportée',
          success: false 
        });
    }
    
    const collection = mongoose.connection.db.collection(collectionName);
    const count = await collection.countDocuments({ active: true });
    
    if (count === 0) {
      return res.status(404).json({ 
        error: 'Aucun produit trouvé dans cette catégorie',
        success: false 
      });
    }
    
    const randomIndex = Math.floor(Math.random() * count);
    const products = await collection.find({ active: true }).skip(randomIndex).limit(1).toArray();
    const product = products[0];
    
    if (!product) {
      return res.status(404).json({ 
        error: 'Produit non trouvé',
        success: false 
      });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({
        error: `Stock insuffisant. Disponible: ${product.stock}, Demandé: ${quantity}`,
        success: false,
        availableStock: product.stock
      });
    }
    
    // Déduire la quantité
    const updatedProduct = await collection.findOneAndUpdate(
      { _id: product._id },
      { $inc: { stock: -quantity } },
      { returnDocument: 'after' }
    );
    
    res.json({
      success: true,
      productId: product._id,
      reservedQuantity: quantity,
      remainingStock: updatedProduct.stock,
      message: `${quantity} exemplaire(s) réservé(s). Stock restant: ${updatedProduct.stock}`
    });
    
  } catch (err) {
    console.error('Erreur /api/stock/reserve:', err);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la réservation du stock',
      success: false 
    });
  }
});

// Restaurer du stock
router.post('/restore', async (req, res) => {
  try {
    const { productId, category, quantity = 1 } = req.body;
    
    let collectionName;
    switch (category) {
      case 'enfant': collectionName = 'enfant_images'; break;
      case 'homme': collectionName = 'homme_images'; break;
      case 'femme': collectionName = 'femme_images'; break;
      default: 
        return res.status(400).json({ 
          error: 'Catégorie non supportée',
          success: false 
        });
    }
    
    const collection = mongoose.connection.db.collection(collectionName);
    const count = await collection.countDocuments({ active: true });
    
    if (count === 0) {
      return res.status(404).json({ 
        error: 'Aucun produit trouvé dans cette catégorie',
        success: false 
      });
    }
    
    const randomIndex = Math.floor(Math.random() * count);
    const products = await collection.find({ active: true }).skip(randomIndex).limit(1).toArray();
    const product = products[0];
    
    if (!product) {
      return res.status(404).json({ 
        error: 'Produit non trouvé',
        success: false 
      });
    }
    
    // Restaurer la quantité
    const updatedProduct = await collection.findOneAndUpdate(
      { _id: product._id },
      { $inc: { stock: quantity } },
      { returnDocument: 'after' }
    );
    
    res.json({
      success: true,
      productId: product._id,
      restoredQuantity: quantity,
      currentStock: updatedProduct.stock,
      message: `${quantity} exemplaire(s) restauré(s). Stock actuel: ${updatedProduct.stock}`
    });
    
  } catch (err) {
    console.error('Erreur /api/stock/restore:', err);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la restauration du stock',
      success: false 
    });
  }
});

export default router;
