import mongoose from 'mongoose';
import { ORDER_STATUS } from '../constants/orderStatus.js';

const vendorOrderSchema = new mongoose.Schema({
  // Références
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Informations de la commande
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING
  },
  
  // Informations du client
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String
  },
  
  // Adresses
  shippingAddress: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: String,
    instructions: String
  },
  
  billingAddress: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  
  // Produits de la commande
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VendorProduct',
      required: true
    },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    variant: {
      attributes: [{
        name: String,
        value: String
      }]
    },
    image: String
  }],
  
  // Calculs financiers
  pricing: {
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 }
  },
  
  // Frais et commissions
  fees: {
    platformCommission: { type: Number, default: 0 },
    paymentProcessing: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    totalFees: { type: Number, default: 0 }
  },
  
  // Paiement
  payment: {
    method: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: { type: Number, default: 0 }
  },
  
  // Livraison
  shipping: {
    method: String,
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    shippedAt: Date,
    notes: String
  },
  
  // Dates importantes
  orderDate: { type: Date, default: Date.now },
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  
  // Notes et communications
  notes: {
    customer: String,
    vendor: String,
    internal: String
  },
  
  // Historique des statuts
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Retours et remboursements
  returns: [{
    returnId: String,
    reason: String,
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'received', 'refunded']
    },
    requestedAt: { type: Date, default: Date.now },
    processedAt: Date,
    refundAmount: Number,
    items: [{
      productId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      reason: String
    }]
  }],
  
  // Métadonnées
  source: {
    type: String,
    enum: ['web', 'mobile', 'api', 'admin'],
    default: 'web'
  },
  ipAddress: String,
  userAgent: String,
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index pour les recherches
vendorOrderSchema.index({ vendorId: 1, status: 1 });
vendorOrderSchema.index({ orderNumber: 1 });
vendorOrderSchema.index({ 'customer.email': 1 });
vendorOrderSchema.index({ orderDate: -1 });
vendorOrderSchema.index({ 'shipping.trackingNumber': 1 });

// Middleware pour mettre à jour updatedAt et calculer les totaux
vendorOrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculer le total des items
  this.pricing.subtotal = this.items.reduce((sum, item) => 
    sum + (item.unitPrice * item.quantity), 0
  );
  
  // Calculer le total final
  this.pricing.total = this.pricing.subtotal + 
    this.pricing.shipping + 
    this.pricing.tax - 
    this.pricing.discount;
  
  // Calculer les frais totaux
  this.fees.totalFees = this.fees.platformCommission + 
    this.fees.paymentProcessing + 
    this.fees.shippingFee;
  
  next();
});

// Méthodes virtuelles
vendorOrderSchema.virtual('isPaid').get(function() {
  return this.payment.status === 'paid';
});

vendorOrderSchema.virtual('canBeCancelled').get(function() {
  return ['pending', 'confirmed', 'processing'].includes(this.status);
});

vendorOrderSchema.virtual('canBeShipped').get(function() {
  return ['confirmed', 'processing'].includes(this.status);
});

// Méthodes d'instance
vendorOrderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note,
    updatedBy
  });
  
  // Mettre à jour les dates spécifiques
  const now = new Date();
  switch (newStatus) {
    case 'confirmed':
      this.confirmedAt = now;
      break;
    case 'shipped':
      this.shippedAt = now;
      this.shipping.shippedAt = now;
      break;
    case 'delivered':
      this.deliveredAt = now;
      this.shipping.actualDelivery = now;
      break;
    case 'cancelled':
      this.cancelledAt = now;
      break;
  }
  
  return this.save();
};

vendorOrderSchema.methods.addReturn = function(returnData) {
  this.returns.push(returnData);
  return this.save();
};

vendorOrderSchema.methods.calculateVendorEarnings = function() {
  return this.pricing.total - this.fees.totalFees;
};

export default mongoose.model('VendorOrder', vendorOrderSchema);
