import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

// Schémas pour les images
const HommeImageSchema = new mongoose.Schema({
  path: { type: String, required: true, index: true, unique: true },
  alt: { type: String, default: '' },
  brand: { type: String, default: '' },
  model: { type: String, default: '' },
  color: { type: String, default: '' },
  category: { type: String, default: 'homme' },
  stock: { type: Number, default: 8 },
  price: { type: Number, default: 250000 },
  name: { type: String, default: '' },
  description: { type: String, default: '' }
});

const FemmeImageSchema = new mongoose.Schema({
  path: { type: String, required: true, index: true, unique: true },
  alt: { type: String, default: '' },
  brand: { type: String, default: '' },
  model: { type: String, default: '' },
  color: { type: String, default: '' },
  category: { type: String, default: 'femme' },
  stock: { type: Number, default: 8 },
  price: { type: Number, default: 250000 },
  name: { type: String, default: '' },
  description: { type: String, default: '' }
});

const EnfantImageSchema = new mongoose.Schema({
  path: { type: String, required: true, index: true, unique: true },
  alt: { type: String, default: '' },
  brand: { type: String, default: '' },
  model: { type: String, default: '' },
  color: { type: String, default: '' },
  category: { type: String, default: 'enfant' },
  stock: { type: Number, default: 8 },
  price: { type: Number, default: 200000 },
  name: { type: String, default: '' },
  description: { type: String, default: '' }
});

// Utiliser les modèles existants
const getModelByCategory = (category) => {
  try {
    switch (category) {
      case 'homme':
        return mongoose.models.homme_images || mongoose.model('homme_images', HommeImageSchema);
      case 'femme':
        return mongoose.models.femme_images || mongoose.model('femme_images', FemmeImageSchema);
      case 'enfant':
        return mongoose.models.enfant_images || mongoose.model('enfant_images', EnfantImageSchema);
      default:
        return mongoose.models.homme_images || mongoose.model('homme_images', HommeImageSchema);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du modèle:', error);
    throw error;
  }
};

// Diminuer le stock d'un produit
router.post('/decrease', async (req, res) => {
  try {
    const { productId, category, quantity = 1 } = req.body;
    
    console.log('📉 Diminution du stock:', { productId, category, quantity });
    
    if (!productId || !category) {
      return res.status(400).json({ 
        success: false, 
        error: 'productId et category sont requis' 
      });
    }

    const Model = getModelByCategory(category);
    
    // Trouver le produit par son path
    const product = await Model.findOne({ 
      path: productId 
    });
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Produit non trouvé' 
      });
    }

    // Vérifier si le stock est suffisant
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Stock insuffisant',
        availableStock: product.stock,
        requestedQuantity: quantity
      });
    }

    // Diminuer le stock
    const oldStock = product.stock;
    product.stock = Math.max(0, product.stock - quantity);
    await product.save();

    console.log('✅ Stock diminué:', { 
      productId, 
      oldStock, 
      newStock: product.stock,
      quantity: quantity
    });

    res.json({
      success: true,
      productId: productId,
      newStock: product.stock,
      quantityDecreased: quantity,
      message: `Stock diminué de ${quantity}. Nouveau stock: ${product.stock}`
    });

  } catch (error) {
    console.error('❌ Erreur diminution stock:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la diminution du stock',
      details: error.message
    });
  }
});

// Augmenter le stock d'un produit (pour restaurer)
router.post('/increase', async (req, res) => {
  try {
    const { productId, category, quantity = 1 } = req.body;
    
    console.log('📈 Augmentation du stock:', { productId, category, quantity });
    
    if (!productId || !category) {
      return res.status(400).json({ 
        success: false, 
        error: 'productId et category sont requis' 
      });
    }

    const Model = getModelByCategory(category);
    
    // Trouver le produit par son path
    const product = await Model.findOne({ 
      path: productId 
    });
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Produit non trouvé' 
      });
    }

    // Augmenter le stock
    const oldStock = product.stock;
    product.stock = product.stock + quantity;
    await product.save();

    console.log('✅ Stock augmenté:', { 
      productId, 
      oldStock, 
      newStock: product.stock,
      quantity: quantity
    });

    res.json({
      success: true,
      productId: productId,
      newStock: product.stock,
      quantityIncreased: quantity,
      message: `Stock augmenté de ${quantity}. Nouveau stock: ${product.stock}`
    });

  } catch (error) {
    console.error('❌ Erreur augmentation stock:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de l\'augmentation du stock',
      details: error.message
    });
  }
});

export default router;
