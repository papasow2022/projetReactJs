import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

// Schémas simplifiés
const EnfantImageSchema = new mongoose.Schema({
  path: { type: String, required: true },
  stock: { type: Number, default: 5 },
  active: { type: Boolean, default: true }
}, { timestamps: true, collection: "enfant_images" });

const HommeImageSchema = new mongoose.Schema({
  path: { type: String, required: true },
  stock: { type: Number, default: 5 },
  active: { type: Boolean, default: true }
}, { timestamps: true, collection: "homme_images" });

const FemmeImageSchema = new mongoose.Schema({
  path: { type: String, required: true },
  stock: { type: Number, default: 5 },
  active: { type: Boolean, default: true }
}, { timestamps: true, collection: "femme_images" });

const EnfantImage = mongoose.models.EnfantImage || mongoose.model('EnfantImage', EnfantImageSchema);
const HommeImage = mongoose.models.HommeImage || mongoose.model('HommeImage', HommeImageSchema);
const FemmeImage = mongoose.models.FemmeImage || mongoose.model('FemmeImage', FemmeImageSchema);

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
    
    // Récupérer un produit aléatoire de la catégorie
    let Model;
    switch (category) {
      case 'enfant': Model = EnfantImage; break;
      case 'homme': Model = HommeImage; break;
      case 'femme': Model = FemmeImage; break;
      default: 
        return res.status(400).json({ 
          error: 'Catégorie non supportée',
          success: false 
        });
    }
    
    // Récupérer un produit aléatoire
    const count = await Model.countDocuments({ active: true });
    if (count === 0) {
      return res.status(404).json({ 
        error: 'Aucun produit trouvé dans cette catégorie',
        success: false 
      });
    }
    
    const randomIndex = Math.floor(Math.random() * count);
    const product = await Model.findOne({ active: true }).skip(randomIndex);
    
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
    
    let Model;
    switch (category) {
      case 'enfant': Model = EnfantImage; break;
      case 'homme': Model = HommeImage; break;
      case 'femme': Model = FemmeImage; break;
      default: 
        return res.status(400).json({ 
          error: 'Catégorie non supportée',
          success: false 
        });
    }
    
    // Récupérer un produit aléatoire
    const count = await Model.countDocuments({ active: true });
    if (count === 0) {
      return res.status(404).json({ 
        error: 'Aucun produit trouvé dans cette catégorie',
        success: false 
      });
    }
    
    const randomIndex = Math.floor(Math.random() * count);
    const product = await Model.findOne({ active: true }).skip(randomIndex);
    
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
    const updatedProduct = await Model.findByIdAndUpdate(
      product._id,
      { $inc: { stock: -quantity } },
      { new: true }
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

export default router;
