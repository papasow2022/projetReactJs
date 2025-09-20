import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Chaussures', 'Vêtements', 'Accessoires']
  },
  subcategory: {
    type: String,
    required: true,
    enum: ['homme', 'femme', 'enfant', 'bebe']
  },
  brand: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'rejected'],
    default: 'pending'
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendorName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  sales: {
    type: Number,
    default: 0
  },
  tags: [String],
  specifications: {
    type: Map,
    of: String
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    min: 0
  },
  saleStartDate: Date,
  saleEndDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour updatedAt
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index pour optimiser les requêtes
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ vendorId: 1 });
productSchema.index({ status: 1 });
productSchema.index({ createdAt: -1 });

// Méthode statique pour obtenir les statistiques des produits
productSchema.statics.getProductStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        pendingProducts: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        activeProducts: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        totalStock: { $sum: '$stock' }
      }
    }
  ]);
};

// Méthode statique pour obtenir les produits par vendeur
productSchema.statics.getProductsByVendor = function(vendorId) {
  return this.find({ vendorId })
    .sort({ createdAt: -1 })
    .select('-__v');
};

// Méthode statique pour rechercher des produits
productSchema.statics.searchProducts = function(query, filters = {}) {
  const searchQuery = {
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { brand: { $regex: query, $options: 'i' } }
    ],
    ...filters
  };

  return this.find(searchQuery)
    .sort({ createdAt: -1 })
    .select('-__v');
};

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;