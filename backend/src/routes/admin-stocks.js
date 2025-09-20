import { Router } from 'express';
import { connectMongo } from '../lib/mongo.js';
import Catalogue from '../models/Catalogue.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = Router();

// ===== ROUTES PROTÉGÉES ADMIN =====

// 1. Récupérer tous les produits avec leurs stocks
router.get('/products', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    console.log('📦 Récupération de tous les produits pour gestion des stocks...');
    
    const products = await Catalogue.find({})
      .select('name path brand category color price stock sizes createdAt updatedAt')
      .sort({ createdAt: -1 });
    
    console.log(`✅ ${products.length} produits récupérés`);
    
    res.json({
      success: true,
      products: products.map(product => ({
        _id: product._id,
        name: product.name,
        path: product.path,
        brand: product.brand,
        category: product.category,
        color: product.color,
        price: product.price,
        stock: product.stock,
        sizes: product.sizes || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }))
    });
  } catch (error) {
    console.error('❌ Erreur récupération produits:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la récupération des produits' 
    });
  }
});

// 2. Mettre à jour le stock total d'un produit
router.patch('/products/:productId/stock', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    const { productId } = req.params;
    const { newStock } = req.body;
    
    if (typeof newStock !== 'number' || newStock < 0) {
      return res.status(400).json({
        success: false,
        error: 'Stock invalide'
      });
    }
    
    console.log(`📦 Mise à jour stock total pour produit ${productId}: ${newStock}`);
    
    const product = await Catalogue.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }
    
    const oldStock = product.stock;
    
    const updateResult = await Catalogue.updateOne(
      { _id: productId },
      { 
        $set: { 
          stock: newStock,
          updatedAt: new Date()
        } 
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log(`✅ Stock total mis à jour: ${oldStock} → ${newStock}`);
      
      res.json({
        success: true,
        message: 'Stock total mis à jour',
        product: {
          _id: product._id,
          name: product.name,
          oldStock,
          newStock
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Échec de la mise à jour'
      });
    }
  } catch (error) {
    console.error('❌ Erreur mise à jour stock total:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la mise à jour du stock total' 
    });
  }
});

// 3. Mettre à jour le stock d'une taille spécifique
router.patch('/products/:productId/sizes/:size/stock', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    const { productId, size } = req.params;
    const { newStock } = req.body;
    
    if (typeof newStock !== 'number' || newStock < 0) {
      return res.status(400).json({
        success: false,
        error: 'Stock invalide'
      });
    }
    
    const sizeNumber = parseInt(size);
    if (isNaN(sizeNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Taille invalide'
      });
    }
    
    console.log(`📏 Mise à jour stock taille ${sizeNumber} pour produit ${productId}: ${newStock}`);
    
    const product = await Catalogue.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }
    
    // Trouver la taille dans le produit (comparer avec string car les tailles sont stockées comme strings)
    const sizeIndex = product.sizes.findIndex(s => s.size === sizeNumber.toString());
    if (sizeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Taille non trouvée'
      });
    }
    
    const oldStock = product.sizes[sizeIndex].stock;
    
    // Mettre à jour la taille spécifique
    const updatedSizes = [...product.sizes];
    updatedSizes[sizeIndex] = {
      ...updatedSizes[sizeIndex],
      stock: newStock
    };
    
    // Ne pas recalculer le stock total - respecter le choix de l'utilisateur
    const newTotalStock = product.stock;
    
    console.log(`🔍 DEBUG - Avant mise à jour:`, {
      sizeIndex,
      oldStock,
      newStock,
      updatedSizes: updatedSizes[sizeIndex],
      newTotalStock,
      oldTotalStock: product.stock,
      message: 'Stock total respecté (pas de recalcul)'
    });
    
    // Utiliser updateOne avec notation pointée pour les tableaux imbriqués
    const updateResult = await Catalogue.updateOne(
      { _id: productId },
      { 
        $set: { 
          [`sizes.${sizeIndex}.stock`]: newStock,
          stock: newTotalStock,
          updatedAt: new Date()
        } 
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log(`✅ Stock taille ${sizeNumber} mis à jour: ${oldStock} → ${newStock}`);
      console.log(`✅ Stock total respecté: ${product.stock} (pas de recalcul)`);
      
      res.json({
        success: true,
        message: `Stock taille ${sizeNumber} mis à jour`,
        product: {
          _id: product._id,
          name: product.name,
          size: sizeNumber,
          oldStock,
          newStock,
          oldTotalStock: product.stock,
          newTotalStock
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Échec de la mise à jour'
      });
    }
  } catch (error) {
    console.error('❌ Erreur mise à jour stock taille:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la mise à jour du stock de la taille' 
    });
  }
});

// 4. Modifier le stock total ET les tailles en même temps
router.patch('/products/:productId/stock-and-sizes', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    const { productId } = req.params;
    const { totalStock, sizes } = req.body;
    
    if (typeof totalStock !== 'number' || totalStock < 0) {
      return res.status(400).json({
        success: false,
        error: 'Stock total invalide'
      });
    }
    
    if (!Array.isArray(sizes)) {
      return res.status(400).json({
        success: false,
        error: 'Tailles invalides'
      });
    }
    
    console.log(`🔄 Mise à jour complète pour produit ${productId}:`);
    console.log(`📦 Stock total: ${totalStock}`);
    console.log(`📏 Tailles:`, sizes);
    
    const product = await Catalogue.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }
    
    const oldTotalStock = product.stock;
    const oldSizes = [...product.sizes];
    
    // Mettre à jour les tailles
    const updatedSizes = product.sizes.map(size => {
      const newSizeData = sizes.find(s => s.size === size.size);
      if (newSizeData) {
        return {
          ...size,
          stock: newSizeData.stock || 0
        };
      }
      return size;
    });
    
    // Vérifier que la somme des tailles correspond au stock total
    const calculatedTotal = updatedSizes.reduce((total, size) => total + size.stock, 0);
    
    if (calculatedTotal !== totalStock) {
      console.log(`⚠️ Attention: Somme des tailles (${calculatedTotal}) ≠ Stock total (${totalStock})`);
    }
    
    const updateResult = await Catalogue.updateOne(
      { _id: productId },
      { 
        $set: { 
          stock: totalStock,
          sizes: updatedSizes,
          updatedAt: new Date()
        } 
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log(`✅ Stock total mis à jour: ${oldTotalStock} → ${totalStock}`);
      console.log(`✅ Tailles mises à jour:`, updatedSizes.map(s => `${s.size}:${s.stock}`).join(', '));
      
      res.json({
        success: true,
        message: 'Stock total et tailles mis à jour',
        product: {
          _id: product._id,
          name: product.name,
          oldTotalStock,
          newTotalStock: totalStock,
          oldSizes: oldSizes.map(s => ({ size: s.size, stock: s.stock })),
          newSizes: updatedSizes.map(s => ({ size: s.size, stock: s.stock }))
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la mise à jour'
      });
    }
  } catch (error) {
    console.error('Erreur mise à jour complète:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

// 5. Ajouter du stock à une taille (incrémenter)
router.patch('/products/:productId/sizes/:size/add', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await connectMongo();
    
    const { productId, size } = req.params;
    const { quantity } = req.body;
    
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantité invalide'
      });
    }
    
    const sizeNumber = parseInt(size);
    if (isNaN(sizeNumber)) {
      return res.status(400).json({
        success: false,
        error: 'Taille invalide'
      });
    }
    
    console.log(`➕ Ajout de ${quantity} au stock taille ${sizeNumber} pour produit ${productId}`);
    
    const product = await Catalogue.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }
    
    const sizeIndex = product.sizes.findIndex(s => s.size === sizeNumber.toString());
    if (sizeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Taille non trouvée'
      });
    }
    
    const oldStock = product.sizes[sizeIndex].stock;
    const newStock = oldStock + quantity;
    
    const updatedSizes = [...product.sizes];
    updatedSizes[sizeIndex] = {
      ...updatedSizes[sizeIndex],
      stock: newStock
    };
    
    const newTotalStock = updatedSizes.reduce((total, size) => total + size.stock, 0);
    
    const updateResult = await Catalogue.updateOne(
      { _id: productId },
      { 
        $set: { 
          sizes: updatedSizes,
          stock: newTotalStock,
          updatedAt: new Date()
        } 
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log(`✅ Stock taille ${sizeNumber} augmenté: ${oldStock} → ${newStock}`);
      
      res.json({
        success: true,
        message: `${quantity} ajouté(s) au stock taille ${sizeNumber}`,
        product: {
          _id: product._id,
          name: product.name,
          size: sizeNumber,
          oldStock,
          newStock,
          added: quantity,
          newTotalStock
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Échec de la mise à jour'
      });
    }
  } catch (error) {
    console.error('❌ Erreur ajout stock:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de l\'ajout de stock' 
    });
  }
});

export default router;
