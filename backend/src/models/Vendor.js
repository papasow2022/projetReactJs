import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  // Informations de base
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  businessType: {
    type: String,
    enum: ['individual', 'company', 'corporation'],
    required: true
  },
  taxId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Informations de contact
  contactEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  website: {
    type: String,
    default: ''
  },
  
  // Adresses
  businessAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  
  // Informations bancaires
  bankAccount: {
    accountHolder: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bankName: { type: String, required: true },
    routingNumber: { type: String, required: true },
    iban: { type: String, default: '' },
    swift: { type: String, default: '' }
  },
  
  // Statut et validation
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'rejected'],
    default: 'pending'
  },
  verificationStatus: {
    identity: { type: Boolean, default: false },
    business: { type: Boolean, default: false },
    bank: { type: Boolean, default: false },
    tax: { type: Boolean, default: false }
  },
  
  // Métriques de performance
  performance: {
    orderDefectRate: { type: Number, default: 0 },
    lateShipmentRate: { type: Number, default: 0 },
    cancellationRate: { type: Number, default: 0 },
    validTrackingRate: { type: Number, default: 0 },
    customerServiceRating: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 }
  },
  
  // Paramètres de la boutique
  storeSettings: {
    displayName: { type: String, default: '' },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    banner: { type: String, default: '' },
    theme: {
      primaryColor: { type: String, default: '#007bff' },
      secondaryColor: { type: String, default: '#6c757d' },
      accentColor: { type: String, default: '#28a745' }
    },
    policies: {
      shipping: { type: String, default: '' },
      returns: { type: String, default: '' },
      privacy: { type: String, default: '' }
    }
  },
  
  // Configuration des frais
  feeStructure: {
    commissionRate: { type: Number, default: 15 }, // 15% par défaut
    fixedFee: { type: Number, default: 0 },
    paymentProcessingFee: { type: Number, default: 2.9 }
  },
  
  // Paramètres de livraison
  shippingSettings: {
    freeShippingThreshold: { type: Number, default: 0 },
    defaultShippingTime: { type: Number, default: 3 }, // jours
    shippingMethods: [{
      name: String,
      cost: Number,
      deliveryTime: Number,
      isActive: { type: Boolean, default: true }
    }]
  },
  
  // Notifications et alertes
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
    orderUpdates: { type: Boolean, default: true },
    paymentUpdates: { type: Boolean, default: true },
    performanceAlerts: { type: Boolean, default: true }
  },
  
  // Documents et fichiers
  documents: [{
    type: {
      type: String,
      enum: ['business_license', 'tax_certificate', 'bank_statement', 'identity', 'other']
    },
    fileName: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }],
  
  // Métadonnées
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastLogin: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour les recherches fréquentes
vendorSchema.index({ businessName: 'text', contactEmail: 'text' });
vendorSchema.index({ status: 1 });
vendorSchema.index({ 'performance.totalRevenue': -1 });

// Middleware pour mettre à jour updatedAt
vendorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Méthodes virtuelles
vendorSchema.virtual('fullAddress').get(function() {
  const addr = this.businessAddress;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`;
});

vendorSchema.virtual('isVerified').get(function() {
  return Object.values(this.verificationStatus).every(status => status === true);
});

// Méthodes d'instance
vendorSchema.methods.updatePerformance = function(metrics) {
  this.performance = { ...this.performance, ...metrics };
  return this.save();
};

vendorSchema.methods.addDocument = function(documentData) {
  this.documents.push(documentData);
  return this.save();
};

export default mongoose.model('Vendor', vendorSchema);
