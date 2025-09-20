import express from 'express';
import mongoose from 'mongoose';
import { connectMongo } from '../lib/mongo.js';

const router = express.Router();

// Modèles pour les différentes catégories
const getModelByCategory = (category) => {
  switch (category.toLowerCase()) {
    case 'homme':
      return mongoose.model('HommeImage');
    case 'femme':
      return mongoose.model('FemmeImage');
    case 'enfant':
      return mongoose.model('EnfantImage');
    default:
      throw new Error('Catégorie non supportée');
  }
};

// Vérifier les stocks faibles (moins de 5 exemplaires)
router.get('/low-stock', async (req, res) => {
  try {
    await connectMongo();
    
    const { category, threshold = 5 } = req.query;
    const lowStockProducts = [];
    
    if (category) {
      // Vérifier une catégorie spécifique
      const Model = getModelByCategory(category);
      const products = await Model.find({ 
        active: true, 
        quantité: { $lte: parseInt(threshold) } 
      }).select('name path quantité category');
      
      lowStockProducts.push(...products.map(p => ({
        ...p.toObject(),
        category: category
      })));
    } else {
      // Vérifier toutes les catégories
      const categories = ['homme', 'femme', 'enfant'];
      
      for (const cat of categories) {
        try {
          const Model = getModelByCategory(cat);
          const products = await Model.find({ 
            active: true, 
            quantité: { $lte: parseInt(threshold) } 
          }).select('name path quantité');
          
          lowStockProducts.push(...products.map(p => ({
            ...p.toObject(),
            category: cat
          })));
        } catch (err) {
          console.error(`Erreur pour la catégorie ${cat}:`, err.message);
        }
      }
    }
    
    res.json({
      success: true,
      lowStockProducts,
      total: lowStockProducts.length,
      threshold: parseInt(threshold),
      message: `${lowStockProducts.length} produit(s) en stock faible`
    });
    
  } catch (err) {
    console.error('❌ Erreur /api/stock-alerts/low-stock:', err);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la vérification des stocks faibles',
      success: false 
    });
  }
});

// Vérifier les produits en rupture de stock
router.get('/out-of-stock', async (req, res) => {
  try {
    await connectMongo();
    
    const outOfStockProducts = [];
    const categories = ['homme', 'femme', 'enfant'];
    
    for (const cat of categories) {
      try {
        const Model = getModelByCategory(cat);
        const products = await Model.find({ 
          active: true, 
          quantité: { $lte: 0 } 
        }).select('name path quantité');
        
        outOfStockProducts.push(...products.map(p => ({
          ...p.toObject(),
          category: cat
        })));
      } catch (err) {
        console.error(`Erreur pour la catégorie ${cat}:`, err.message);
      }
    }
    
    res.json({
      success: true,
      outOfStockProducts,
      total: outOfStockProducts.length,
      message: `${outOfStockProducts.length} produit(s) en rupture de stock`
    });
    
  } catch (err) {
    console.error('❌ Erreur /api/stock-alerts/out-of-stock:', err);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la vérification des ruptures de stock',
      success: false 
    });
  }
});

// Mettre à jour le stock d'un produit
router.put('/update/:productId', async (req, res) => {
  try {
    await connectMongo();
    
    const { productId } = req.params;
    const { category, newQuantity } = req.body;
    
    if (!category || newQuantity === undefined) {
      return res.status(400).json({ 
        error: 'category et newQuantity sont requis',
        success: false 
      });
    }
    
    const Model = getModelByCategory(category);
    const product = await Model.findByIdAndUpdate(
      productId,
      { quantité: newQuantity },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ 
        error: 'Produit non trouvé',
        success: false 
      });
    }
    
    res.json({
      success: true,
      product: {
        id: product._id,
        name: product.name,
        path: product.path,
        quantité: product.quantité,
        category
      },
      message: `Stock mis à jour: ${newQuantity} exemplaires`
    });
    
  } catch (err) {
    console.error('❌ Erreur /api/stock-alerts/update:', err);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la mise à jour du stock',
      success: false 
    });
  }
});

export default router;

