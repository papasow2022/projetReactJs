import mongoose from 'mongoose';

const vendorProductSchema = new mongoose.Schema({
  // Référence au vendeur
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  
  // Informations de base du produit
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  
  // Catégorisation
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  upc: {
    type: String,
    unique: true,
    sparse: true
  },
  ean: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Prix et coûts
  price: {
    type: Number,
    required: true,
    min: 0
  },
  compareAtPrice: {
    type: Number,
    min: 0
  },
  cost: {
    type: Number,
    min: 0
  },
  margin: {
    type: Number,
    min: 0
  },
  
  // Gestion des stocks
  inventory: {
    quantity: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    trackInventory: { type: Boolean, default: true },
    allowBackorder: { type: Boolean, default: false }
  },
  
  // Images et médias
  images: [{
    url: { type: String, required: true },
    alt: String,
    isPrimary: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 }
  }],
  videos: [{
    url: String,
    thumbnail: String,
    duration: Number
  }],
  
  // Attributs et variantes
  attributes: [{
    name: String,
    value: String,
    type: {
      type: String,
      enum: ['text', 'number', 'color', 'size', 'material']
    }
  }],
  variants: [{
    sku: String,
    attributes: [{
      name: String,
      value: String
    }],
    price: Number,
    inventory: {
      quantity: Number,
      reserved: Number
    },
    images: [String]
  }],
  
  // SEO et marketing
  seo: {
    title: String,
    description: String,
    keywords: [String],
    slug: {
      type: String,
      unique: true,
      lowercase: true
    }
  },
  
  // Statut et visibilité
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'inactive', 'rejected'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Métriques de performance
  metrics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }
  },
  
  // Informations de livraison
  shipping: {
    weight: { type: Number, default: 0 },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, default: 'cm' }
    },
    shippingClass: String,
    freeShipping: { type: Boolean, default: false },
    handlingTime: { type: Number, default: 1 } // jours
  },
  
  // Taxes et conformité
  taxSettings: {
    taxable: { type: Boolean, default: true },
    taxClass: String,
    hscode: String
  },
  
  // Tags et organisation
  tags: [String],
  collections: [String],
  
  // Dates importantes
  publishedAt: Date,
  lastModified: { type: Date, default: Date.now },
  
  // Métadonnées
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour les recherches
vendorProductSchema.index({ name: 'text', description: 'text', brand: 'text' });
vendorProductSchema.index({ vendorId: 1, status: 1 });
vendorProductSchema.index({ category: 1, subcategory: 1 });
vendorProductSchema.index({ sku: 1 });
vendorProductSchema.index({ 'seo.slug': 1 });
vendorProductSchema.index({ 'metrics.rating': -1 });
vendorProductSchema.index({ 'metrics.revenue': -1 });

// Middleware pour calculer les métriques
vendorProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculer la marge
  if (this.price && this.cost) {
    this.margin = ((this.price - this.cost) / this.price) * 100;
  }
  
  // Calculer le stock disponible
  if (this.inventory.trackInventory) {
    this.inventory.available = Math.max(0, this.inventory.quantity - this.inventory.reserved);
  }
  
  next();
});

// Méthodes virtuelles
vendorProductSchema.virtual('isInStock').get(function() {
  return this.inventory.available > 0 || this.inventory.allowBackorder;
});

vendorProductSchema.virtual('isLowStock').get(function() {
  return this.inventory.available <= this.inventory.lowStockThreshold;
});

vendorProductSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0]?.url || '');
});

// Méthodes d'instance
vendorProductSchema.methods.updateInventory = function(quantity, operation = 'set') {
  if (operation === 'add') {
    this.inventory.quantity += quantity;
  } else if (operation === 'subtract') {
    this.inventory.quantity = Math.max(0, this.inventory.quantity - quantity);
  } else {
    this.inventory.quantity = quantity;
  }
  
  this.inventory.available = Math.max(0, this.inventory.quantity - this.inventory.reserved);
  return this.save();
};

vendorProductSchema.methods.reserveInventory = function(quantity) {
  if (this.inventory.available >= quantity) {
    this.inventory.reserved += quantity;
    this.inventory.available = Math.max(0, this.inventory.quantity - this.inventory.reserved);
    return this.save();
  }
  throw new Error('Stock insuffisant');
};

vendorProductSchema.methods.releaseInventory = function(quantity) {
  this.inventory.reserved = Math.max(0, this.inventory.reserved - quantity);
  this.inventory.available = Math.max(0, this.inventory.quantity - this.inventory.reserved);
  return this.save();
};

export default mongoose.model('VendorProduct', vendorProductSchema);
