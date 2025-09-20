import { Router } from 'express';
import connectMongo from '../lib/mongo.js';
import mongoose from 'mongoose';

const router = Router();

// Schéma unifié pour tous les produits
const CatalogueSchema = new mongoose.Schema(
  {
    // Identifiants
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    path: { type: String, required: true, index: true, unique: true },
    
    // Informations produit
    name: { type: String, required: true },
    brand: { type: String, required: true, index: true },
    model: { type: String, required: true },
    color: { type: String, required: true, index: true },
    category: { type: String, required: true, enum: ['homme', 'femme', 'enfant'], index: true },
    
    // Stock et prix
    stock: { type: Number, required: true, default: 8, min: 0 },
    price: { type: Number, required: true, min: 0 },
    
    // Gestion des tailles
    sizes: [{
      size: { type: String, required: true }, // "40", "41", "42", etc.
      stock: { type: Number, default: 0, min: 0 },
      sku: { type: String }, // SKU unique par taille
      active: { type: Boolean, default: true }
    }],
    
    // Tailles disponibles (pour compatibilité)
    availableSizes: { type: [String], default: [] },
    
    // Métadonnées
    description: { type: String, default: '' },
    alt: { type: String, default: '' },
    tags: { type: [String], default: [] },
    active: { type: Boolean, default: true, index: true },
    
    // Source originale
    originalCollection: { type: String, enum: ['homme_images', 'femme_images', 'enfant_images'] }
  },
  { 
    timestamps: true, 
    collection: "catalogue" 
  }
);

// Index composés pour des requêtes rapides
CatalogueSchema.index({ category: 1, brand: 1, color: 1 });
CatalogueSchema.index({ category: 1, active: 1 });
CatalogueSchema.index({ stock: 1, active: 1 });

const Catalogue = mongoose.models.Catalogue || mongoose.model('Catalogue', CatalogueSchema);

// ===== ENDPOINTS =====

// 0. Test simple
router.get('/test', (req, res) => {
  res.json({ message: 'API catalogue fonctionne !', timestamp: new Date() });
});

// 0.1. Test réservation simple
router.post('/test-reserve', (req, res) => {
  res.json({ 
    message: 'Test réservation OK !', 
    body: req.body,
    timestamp: new Date() 
  });
});

// 1. Récupérer tous les produits actifs
router.get('/', async (req, res) => {
  try {
    await connectMongo();
    
    const { category, brand, color, inStock } = req.query;
    
    // Construire le filtre
    const filter = { active: true };
    
    // Gestion spéciale pour la catégorie enfant (ancienne et nouvelle structure)
    if (category === 'enfant') {
      filter.$or = [
        { category: 'enfant' },           // Ancienne structure
        { genre: 'enfant' }               // Nouvelle structure
      ];
    } else if (category) {
      filter.category = category;
    }
    
    if (brand) filter.brand = brand;
    if (color) filter.color = color;
    if (inStock === 'true') filter.stock = { $gt: 0 };
    
    const products = await Catalogue.find(filter)
      .select({ 
        _id: 1, path: 1, name: 1, brand: 1, model: 1, color: 1, 
        category: 1, genre: 1, stock: 1, price: 1, description: 1, alt: 1,
        sizes: 1, availableSizes: 1
      })
      .sort({ category: 1, brand: 1, name: 1 })
      .lean();
    
    res.json(products);
  } catch (err) {
    console.error('❌ Erreur /api/catalogue:', err);
    res.status(500).json({ error: 'server_error', message: err.message });
  }
});

// 2. Récupérer un produit par ID
router.get('/:id', async (req, res) => {
  try {
    await connectMongo();
    
    const productId = req.params.id;
    
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'invalid_product_id' });
    }
    
    const product = await Catalogue.findById(productId)
      .select({ 
        _id: 1, path: 1, name: 1, brand: 1, model: 1, color: 1, 
        category: 1, stock: 1, price: 1, description: 1, alt: 1 
      })
      .lean();
    
    if (!product) {
      return res.status(404).json({ error: 'product_not_found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error('❌ Erreur /api/catalogue/:id:', err);
    res.status(500).json({ error: 'server_error', message: err.message });
  }
});

// 3. Vérifier le stock d'un produit
router.get('/:id/stock', async (req, res) => {
  try {
    await connectMongo();
    
    const productId = req.params.id;
    
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'invalid_product_id' });
    }
    
    const product = await Catalogue.findById(productId)
      .select({ _id: 1, name: 1, stock: 1, active: 1 })
      .lean();
    
    if (!product) {
      return res.status(404).json({ error: 'product_not_found' });
    }
    
    if (!product.active) {
      return res.status(400).json({ error: 'product_inactive' });
    }
    
    res.json({
      productId: product._id,
      name: product.name,
      stock: product.stock,
      available: product.stock > 0
    });
  } catch (err) {
    console.error('❌ Erreur /api/catalogue/:id/stock:', err);
    res.status(500).json({ error: 'server_error', message: err.message });
  }
});

// 4. Réserver du stock (diminuer) - VERSION ULTRA SIMPLE
router.post('/:id/reserve', async (req, res) => {
  try {
    await connectMongo();
    
    const { quantity = 1 } = req.body;
    const productId = req.params.id;
    
    // Validation simple
    if (quantity <= 0) {
      return res.status(400).json({ error: 'invalid_quantity' });
    }
    
    // Trouver le produit
    const product = await Catalogue.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'product_not_found' });
    }
    
    // Vérifier le stock
    if (product.stock < quantity) {
      return res.status(400).json({ 
        error: 'insufficient_stock',
        message: `Stock insuffisant. Disponible: ${product.stock}, Demandé: ${quantity}`
      });
    }
    
    // Diminuer le stock
    const newStock = product.stock - quantity;
    await Catalogue.findByIdAndUpdate(productId, { stock: newStock });
    
    // Réponse de succès
    res.json({
      success: true,
      productId: product._id,
      name: product.name,
      reservedQuantity: quantity,
      remainingStock: newStock,
      message: `${quantity} exemplaire(s) réservé(s)`
    });
    
  } catch (err) {
    console.error('❌ Erreur réservation:', err);
    res.status(500).json({ error: 'server_error', message: err.message });
  }
});

// 5. Restaurer du stock (augmenter)
router.post('/:id/restore', async (req, res) => {
  try {
    await connectMongo();
    
    const { quantity = 1 } = req.body;
    const productId = req.params.id;
    
    if (quantity <= 0) {
      return res.status(400).json({ error: 'invalid_quantity' });
    }
    
    const result = await Catalogue.findOneAndUpdate(
      { _id: productId, active: true },
      { $inc: { stock: quantity } },
      { 
        new: true,
        select: { _id: 1, name: 1, stock: 1 }
      }
    );
    
    if (!result) {
      return res.status(404).json({ error: 'product_not_found' });
    }
    
    res.json({
      success: true,
      productId: result._id,
      name: result.name,
      restoredQuantity: quantity,
      currentStock: result.stock,
      message: `${quantity} exemplaire(s) restauré(s)`
    });
  } catch (err) {
    console.error('❌ Erreur /api/catalogue/:id/restore:', err);
    res.status(500).json({ error: 'server_error', message: err.message });
  }
});

// 6. Mettre à jour le stock directement
router.put('/:id/stock', async (req, res) => {
  try {
    await connectMongo();
    
    const { stock } = req.body;
    const productId = req.params.id;
    
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: 'invalid_stock' });
    }
    
    const result = await Catalogue.findOneAndUpdate(
      { _id: productId, active: true },
      { stock },
      { 
        new: true,
        select: { _id: 1, name: 1, stock: 1 }
      }
    );
    
    if (!result) {
      return res.status(404).json({ error: 'product_not_found' });
    }
    
    res.json({
      success: true,
      productId: result._id,
      name: result.name,
      newStock: result.stock,
      message: 'Stock mis à jour'
    });
  } catch (err) {
    console.error('❌ Erreur /api/catalogue/:id/stock:', err);
    res.status(500).json({ error: 'server_error', message: err.message });
  }
});

export default router;
