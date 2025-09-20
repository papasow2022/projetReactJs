import { Router } from 'express';
import connectMongo from '../lib/mongo.js';
import mongoose from 'mongoose';

const router = Router();

// Schémas pour les images avec stock
const EnfantImageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true, unique: true },
    alt: { type: String, default: '' },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    color: { type: String, default: '' },
    category: { type: String, default: 'enfant' },
    tags: { type: [String], default: [] },
    source: { type: String, default: 'public/chaussures/enfant' },
    active: { type: Boolean, default: true },
    stock: { type: Number, default: 5 }
  },
  { timestamps: true, collection: "enfant_images" }
);

const HommeImageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true, unique: true },
    alt: { type: String, default: '' },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    color: { type: String, default: '' },
    category: { type: String, default: 'homme' },
    tags: { type: [String], default: [] },
    source: { type: String, default: 'public/chaussures/homme' },
    active: { type: Boolean, default: true },
    stock: { type: Number, default: 5 }
  },
  { timestamps: true, collection: "homme_images" }
);

const FemmeImageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true, unique: true },
    alt: { type: String, default: '' },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    color: { type: String, default: '' },
    category: { type: String, default: 'femme' },
    tags: { type: [String], default: [] },
    source: { type: String, default: 'public/chaussures/femme' },
    active: { type: Boolean, default: true },
    stock: { type: Number, default: 5 }
  },
  { timestamps: true, collection: "femme_images" }
);

const EnfantImage = mongoose.models.EnfantImage || mongoose.model('EnfantImage', EnfantImageSchema);
const HommeImage = mongoose.models.HommeImage || mongoose.model('HommeImage', HommeImageSchema);
const FemmeImage = mongoose.models.FemmeImage || mongoose.model('FemmeImage', FemmeImageSchema);

// Fonction pour obtenir le bon modèle selon la catégorie
function getModelByCategory(category) {
  switch (category) {
    case 'enfant': return EnfantImage;
    case 'homme': return HommeImage;
    case 'femme': return FemmeImage;
    default: throw new Error('Catégorie non supportée');
  }
}

// Vérifier le stock disponible
router.post('/check', async (req, res) => {
  try {
    console.log('🔍 Requête de vérification de stock:', req.body);
    
    const { productId, category, quantity = 1 } = req.body;
    
    if (!productId || !category) {
      console.log('❌ Paramètres manquants:', { productId, category });
      return res.status(400).json({ 
        error: 'productId et category sont requis',
        success: false 
      });
    }
    
    console.log('📦 Recherche dans la catégorie:', category);
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
    console.log('📊 Modèle utilisé:', Model.modelName);
    
    // Pour les produits aléatoires du frontend ou les IDs synthétiques, récupérer un produit aléatoire
    let product;
    if (productId.includes('-random') || productId.includes('synthetic-')) {
      console.log('🎲 Produit aléatoire/synthétique détecté, récupération d\'un produit aléatoire...');
      const count = await Model.countDocuments({ active: true });
      if (count === 0) {
        return res.status(404).json({ 
          error: 'Aucun produit trouvé dans cette catégorie',
          success: false 
        });
      }
      const randomIndex = Math.floor(Math.random() * count);
      product = await Model.findOne({ active: true }).skip(randomIndex);
    } else {
      // Vérifier si productId est un ObjectId valide
      const isValidObjectId = mongoose.Types.ObjectId.isValid(productId);
      
      let query = { active: true };
      if (isValidObjectId) {
        query = { 
          $or: [
            { _id: productId },
            { path: productId }
          ],
          active: true 
        };
      } else {
        // Si ce n'est pas un ObjectId valide, chercher seulement par path
        query = { 
          path: productId,
          active: true 
        };
      }
      
      product = await Model.findOne(query);
    }
    
    console.log('🔍 Produit trouvé:', product ? 'Oui' : 'Non');

    if (!product) {
      // Fallback: tenter un produit aléatoire de la catégorie
      console.log('⚠️ Aucun produit correspondant, tentative avec un produit aléatoire…');
      const count = await Model.countDocuments({ active: true });
      if (count > 0) {
        const randomIndex = Math.floor(Math.random() * count);
        product = await Model.findOne({ active: true }).skip(randomIndex);
      }
    }

    if (!product) {
      console.log('❌ Produit non trouvé pour:', { productId, category });
      return res.status(404).json({ 
        error: 'Produit non trouvé',
        success: false 
      });
    }
    
    const availableStock = product.stock || product.quantité || 0;
    const canAdd = availableStock >= quantity;
    
    console.log('📊 Stock disponible:', availableStock, 'Demandé:', quantity, 'Peut ajouter:', canAdd);
    
    res.json({
      success: true,
      productId: product._id,
      availableStock,
      requestedQuantity: quantity,
      canAdd,
      message: canAdd 
        ? `Stock disponible: ${availableStock} exemplaires`
        : `Stock insuffisant. Disponible: ${availableStock}, Demandé: ${quantity}`
    });
    
  } catch (err) {
    console.error('❌ Erreur /api/stock/check:', err);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la vérification du stock',
      success: false,
      details: err.message
    });
  }
});

// Réserver du stock (déduire la quantité)
router.post('/reserve', async (req, res) => {
  try {
    
    const { productId, category, quantity = 1 } = req.body;
    
    if (!productId || !category) {
      return res.status(400).json({ 
        error: 'productId et category sont requis',
        success: false 
      });
    }
    
    const Model = getModelByCategory(category);
    
    // Vérifier d'abord le stock disponible
    let product;
    if (productId.includes('-random')) {
      const count = await Model.countDocuments({ active: true });
      if (count === 0) {
        return res.status(404).json({ 
          error: 'Aucun produit trouvé dans cette catégorie',
          success: false 
        });
      }
      const randomIndex = Math.floor(Math.random() * count);
      product = await Model.findOne({ active: true }).skip(randomIndex);
    } else {
      // Vérifier si productId est un ObjectId valide
      const isValidObjectId = mongoose.Types.ObjectId.isValid(productId);
      
      let query = { active: true };
      if (isValidObjectId) {
        query = { 
          $or: [
            { _id: productId },
            { path: productId }
          ],
          active: true 
        };
      } else {
        // Si ce n'est pas un ObjectId valide, chercher seulement par path
        query = { 
          path: productId,
          active: true 
        };
      }
      
      product = await Model.findOne(query);
    }
    
    if (!product) {
      // Fallback: tenter un produit aléatoire de la catégorie
      const count = await Model.countDocuments({ active: true });
      if (count > 0) {
        const randomIndex = Math.floor(Math.random() * count);
        product = await Model.findOne({ active: true }).skip(randomIndex);
      }
    }

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

// Restaurer du stock (annuler une commande)
router.post('/restore', async (req, res) => {
  try {
    
    const { productId, category, quantity = 1 } = req.body;
    
    if (!productId || !category) {
      return res.status(400).json({ 
        error: 'productId et category sont requis',
        success: false 
      });
    }
    
    const Model = getModelByCategory(category);
    
    let updatedProduct;
    if (productId.includes('-random')) {
      // Pour les produits aléatoires, on ne peut pas restaurer un produit spécifique
      // On retourne un succès sans modification
      return res.json({
        success: true,
        productId: productId,
        restoredQuantity: quantity,
        message: `Stock restauré virtuellement pour produit aléatoire: ${quantity} exemplaires`
      });
    } else {
      // Vérifier si productId est un ObjectId valide
      const isValidObjectId = mongoose.Types.ObjectId.isValid(productId);
      
      let query = { active: true };
      if (isValidObjectId) {
        query = { 
          $or: [
            { _id: productId },
            { path: productId }
          ],
          active: true 
        };
      } else {
        // Si ce n'est pas un ObjectId valide, chercher seulement par path
        query = { 
          path: productId,
          active: true 
        };
      }
      
      updatedProduct = await Model.findOneAndUpdate(
        query,
        { $inc: { stock: quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        // Fallback: restaurer sur un produit aléatoire actif de la catégorie
        const count = await Model.countDocuments({ active: true });
        if (count > 0) {
          const randomIndex = Math.floor(Math.random() * count);
          const randomProduct = await Model.findOne({ active: true }).skip(randomIndex);
          if (randomProduct) {
            updatedProduct = await Model.findByIdAndUpdate(
              randomProduct._id,
              { $inc: { stock: quantity } },
              { new: true }
            );
          }
        }
      }
    }
    
    if (!updatedProduct) {
      return res.status(404).json({ 
        error: 'Produit non trouvé',
        success: false 
      });
    }
    
    res.json({
      success: true,
      productId: updatedProduct._id,
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

// Obtenir le stock d'un produit
router.get('/:category/:productId', async (req, res) => {
  try {
    
    const { category, productId } = req.params;
    
    const Model = getModelByCategory(category);
    const product = await Model.findOne({ 
      $or: [
        { _id: productId },
        { path: productId }
      ],
      active: true 
    }).select({ stock: 1, brand: 1, model: 1, color: 1, _id: 1 });
    
    if (!product) {
      return res.status(404).json({ 
        error: 'Produit non trouvé',
        success: false 
      });
    }
    
    res.json({
      success: true,
      productId: product._id,
      brand: product.brand,
      model: product.model,
      color: product.color,
      stock: product.stock
    });
    
  } catch (err) {
    console.error('Erreur /api/stock/:category/:productId:', err);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la récupération du stock',
      success: false 
    });
  }
});

export default router;