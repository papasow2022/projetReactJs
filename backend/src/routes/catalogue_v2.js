import { Router } from 'express';
import connectMongo from '../lib/mongo.js';
import mongoose from 'mongoose';

const router = Router();

// Nouveau schéma unifié pour tous les produits (v2)
const CatalogueV2Schema = new mongoose.Schema(
  {
    // Identifiants
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    
    // Informations produit
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true, index: true },
    model: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true, index: true },
    
    // Classification (nouvelle structure)
    genre: { 
      type: String, 
      required: true, 
      enum: ['homme', 'femme', 'enfant'], 
      index: true 
    },
    category: { 
      type: String, 
      required: true, 
      enum: ['chaussure', 'pantalon', 'veste', 'accessoire', 'electronique'], 
      index: true 
    },
    
    // Stock et prix
    stock: { type: Number, required: true, default: 8, min: 0 },
    price: { type: Number, required: true, min: 0 },
    
    // Métadonnées
    description: { type: String, default: '', trim: true },
    alt: { type: String, default: '', trim: true },
    tags: { type: [String], default: [] },
    active: { type: Boolean, default: true, index: true },
    
    // Gestion des images (flexible)
    path: { type: String, trim: true }, // Chemin local si manuel
    image_url: { type: String, trim: true }, // Lien API si externe
    
    // Source originale
    originalCollection: { 
      type: String, 
      enum: ['manual', 'api', 'migrated'], 
      default: 'manual' 
    },
    
    // Métadonnées de migration
    migratedFrom: { type: String }, // Référence à l'ancien ID
    migrationDate: { type: Date }
  },
  { 
    timestamps: true, 
    collection: "catalogue_v2" 
  }
);

// Index composés pour des requêtes rapides
CatalogueV2Schema.index({ genre: 1, category: 1 });
CatalogueV2Schema.index({ genre: 1, active: 1 });
CatalogueV2Schema.index({ category: 1, active: 1 });
CatalogueV2Schema.index({ brand: 1, genre: 1, category: 1 });
CatalogueV2Schema.index({ stock: 1, active: 1 });

// Validation personnalisée : au moins une image doit être présente
CatalogueV2Schema.pre('save', function(next) {
  if (!this.path && !this.image_url) {
    return next(new Error('Au moins un chemin d\'image (path ou image_url) doit être fourni'));
  }
  next();
});

const CatalogueV2 = mongoose.models.CatalogueV2 || mongoose.model('CatalogueV2', CatalogueV2Schema);

// ===== ENDPOINTS =====

// 0. Test simple
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Catalogue V2 API fonctionne !', 
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// 1. Récupérer tous les produits (avec filtres)
router.get('/', async (req, res) => {
  try {
    await connectMongo();
    
    const { 
      genre, 
      category, 
      brand, 
      color, 
      active = 'true',
      page = 1,
      limit = 50,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Construction du filtre
    const filter = {};
    
    if (genre) filter.genre = genre;
    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (color) filter.color = new RegExp(color, 'i');
    if (active !== 'all') filter.active = active === 'true';

    // Options de pagination et tri
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = { [sort]: sortOrder };

    // Requête avec pagination
    const [products, total] = await Promise.all([
      CatalogueV2.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      CatalogueV2.countDocuments(filter)
    ]);

    // Statistiques par genre et catégorie
    const stats = await CatalogueV2.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          byGenre: {
            $push: {
              genre: '$genre',
              category: '$category',
              stock: '$stock',
              price: '$price'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalProducts: 1,
          totalStock: 1,
          totalValue: 1,
          genreStats: {
            $reduce: {
              input: '$byGenre',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      {
                        $cond: [
                          { $ne: [{ $getField: { field: 'genre', input: '$$this' } }, null] },
                          [
                            {
                              k: { $getField: { field: 'genre', input: '$$this' } },
                              v: {
                                $add: [
                                  { $ifNull: [{ $getField: { field: 'stock', input: '$$this' } }, 0] },
                                  1
                                ]
                              }
                            }
                          ],
                          []
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        stats: stats[0] || {
          totalProducts: 0,
          totalStock: 0,
          totalValue: 0,
          genreStats: {}
        },
        filters: {
          genre,
          category,
          brand,
          color,
          active
        }
      }
    });

  } catch (error) {
    console.error('❌ Erreur récupération catalogue V2:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du catalogue',
      details: error.message
    });
  }
});

// 2. Récupérer un produit par ID
router.get('/:id', async (req, res) => {
  try {
    await connectMongo();
    
    const product = await CatalogueV2.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('❌ Erreur récupération produit V2:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du produit',
      details: error.message
    });
  }
});

// 3. Créer un nouveau produit
router.post('/', async (req, res) => {
  try {
    await connectMongo();
    
    const productData = {
      ...req.body,
      originalCollection: 'manual'
    };

    const product = new CatalogueV2(productData);
    await product.save();

    res.status(201).json({
      success: true,
      data: product,
      message: 'Produit créé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur création produit V2:', error);
    res.status(400).json({
      success: false,
      error: 'Erreur lors de la création du produit',
      details: error.message
    });
  }
});

// 4. Mettre à jour un produit
router.put('/:id', async (req, res) => {
  try {
    await connectMongo();
    
    const product = await CatalogueV2.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Produit mis à jour avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur mise à jour produit V2:', error);
    res.status(400).json({
      success: false,
      error: 'Erreur lors de la mise à jour du produit',
      details: error.message
    });
  }
});

// 5. Supprimer un produit (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await connectMongo();
    
    const product = await CatalogueV2.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Produit désactivé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur suppression produit V2:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression du produit',
      details: error.message
    });
  }
});

// 6. Statistiques détaillées
router.get('/stats/overview', async (req, res) => {
  try {
    await connectMongo();
    
    const stats = await CatalogueV2.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: ['$active', 1, 0] }
          },
          totalStock: { $sum: '$stock' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          avgPrice: { $avg: '$price' },
          avgStock: { $avg: '$stock' }
        }
      }
    ]);

    const genreStats = await CatalogueV2.aggregate([
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 },
          stock: { $sum: '$stock' },
          value: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      }
    ]);

    const categoryStats = await CatalogueV2.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          stock: { $sum: '$stock' },
          value: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalProducts: 0,
          activeProducts: 0,
          totalStock: 0,
          totalValue: 0,
          avgPrice: 0,
          avgStock: 0
        },
        byGenre: genreStats,
        byCategory: categoryStats
      }
    });

  } catch (error) {
    console.error('❌ Erreur statistiques V2:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques',
      details: error.message
    });
  }
});

export default router;
