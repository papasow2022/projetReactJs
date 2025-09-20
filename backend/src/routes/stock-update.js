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
  stock: { type: Number, default: 5 },
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
  stock: { type: Number, default: 5 },
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
  stock: { type: Number, default: 5 },
  price: { type: Number, default: 200000 },
  name: { type: String, default: '' },
  description: { type: String, default: '' }
});

// Fonction pour obtenir le modèle selon la catégorie
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
    return mongoose.models.homme_images || mongoose.model('homme_images', HommeImageSchema);
  }
};

// Mettre à jour le stock d'un produit
router.post('/update', async (req, res) => {
  try {
    const { productId, category, newStock } = req.body;
    
    console.log('🔄 Mise à jour du stock:', { productId, category, newStock });
    
    if (!productId || !category || newStock === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'productId, category et newStock sont requis' 
      });
    }

    const Model = getModelByCategory(category);
    
    // Trouver le produit par son path (productId contient le path)
    const product = await Model.findOne({ 
      path: productId 
    });
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: 'Produit non trouvé' 
      });
    }

    // Mettre à jour le stock
    product.stock = Math.max(0, newStock);
    await product.save();

    console.log('✅ Stock mis à jour:', { 
      productId, 
      oldStock: product.stock, 
      newStock: newStock 
    });

    res.json({
      success: true,
      productId: productId,
      newStock: product.stock,
      message: `Stock mis à jour à ${product.stock}`
    });

  } catch (error) {
    console.error('❌ Erreur mise à jour stock:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la mise à jour du stock' 
    });
  }
});

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
    product.stock = Math.max(0, product.stock - quantity);
    await product.save();

    console.log('✅ Stock diminué:', { 
      productId, 
      oldStock: product.stock + quantity, 
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
      error: 'Erreur lors de la diminution du stock' 
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
    product.stock = product.stock + quantity;
    await product.save();

    console.log('✅ Stock augmenté:', { 
      productId, 
      oldStock: product.stock - quantity, 
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
      error: 'Erreur lors de l\'augmentation du stock' 
    });
  }
});

export default router;
