import mongoose from 'mongoose';
import { ORDER_STATUS } from '../constants/orderStatus.js';

const OrderSchema = new mongoose.Schema({
  // Informations de la commande
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  
  // Informations client
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: 'Guinée' }
    }
  },

  // Produits commandés (ENRICHI)
  items: [{
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    
    // Informations produit détaillées
    brand: { type: String, default: 'Marque inconnue' },
    category: { type: String, default: 'chaussure' },
    genre: { type: String, default: 'homme' },
    color: { type: String, default: 'Non spécifié' },
    size: { type: String, default: 'N/A' },
    sku: { type: String, default: 'unknown' },
    
    // Prix et quantité
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true },
    
    // Gestion du stock
    stockBefore: { type: Number, default: 0 },
    stockAfter: { type: Number, default: 0 },
    stockRemaining: { type: Number, default: 0 }
  }],

  // Totaux
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true, default: 0 },
  tax: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true },

  // Paiement
  payment: {
    method: { type: String, required: true, default: 'paypal' },
    status: { 
      type: String, 
      enum: ['En attente', 'Complété', 'Échoué', 'Remboursé'], 
      default: 'En attente' 
    },
    transactionId: { type: String },
    paypalOrderId: { type: String }
  },

  // Statut de la commande
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING,
    index: true
  },

  // Dates importantes
  orderDate: { type: Date, default: Date.now, index: true },
  confirmedDate: { type: Date },
  shippedDate: { type: Date },
  deliveredDate: { type: Date },

  // Notes
  notes: { type: String },
  adminNotes: { type: String },

  // Suivi de livraison
  tracking: {
    carrier: { type: String }, // "Colissimo", "Chronopost", "DHL", etc.
    trackingNumber: { type: String },
    trackingUrl: { type: String },
    estimatedDelivery: { type: Date },
    actualDelivery: { type: Date },
    steps: [{
      status: { type: String, required: true }, // "En transit", "Livré", etc.
      description: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      location: { type: String }, // "Centre de tri Paris", "En cours de livraison"
      source: { 
        type: String, 
        enum: ['admin', 'system', 'carrier'], 
        default: 'admin' 
      }
    }]
  },

  // Métadonnées
  source: { type: String, default: 'website' },
  userAgent: { type: String },
  ipAddress: { type: String }
}, {
  timestamps: true,
  collection: 'orders'
});

// Index pour les requêtes fréquentes
OrderSchema.index({ 'customer.email': 1, orderDate: -1 });
OrderSchema.index({ status: 1, orderDate: -1 });
OrderSchema.index({ 'payment.status': 1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ 'tracking.trackingNumber': 1 });
OrderSchema.index({ 'tracking.carrier': 1 });

// Méthode pour générer un numéro de commande unique
OrderSchema.statics.generateOrderNumber = function() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `CMD${year}${month}${day}${random}`;
};

// Méthode pour calculer le total
OrderSchema.methods.calculateTotal = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.total = this.subtotal + this.shipping + this.tax;
  return this.total;
};

// Méthode pour mettre à jour le statut
OrderSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  switch (newStatus) {
    case ORDER_STATUS.CONFIRMED:
      this.confirmedDate = new Date();
      break;
    case ORDER_STATUS.SHIPPED:
      this.shippedDate = new Date();
      break;
    case ORDER_STATUS.DELIVERED:
      this.deliveredDate = new Date();
      break;
  }
  
  return this.save();
};

// Méthode pour ajouter une étape de suivi
OrderSchema.methods.addTrackingStep = function(stepData) {
  if (!this.tracking) {
    this.tracking = { steps: [] };
  }
  
  const step = {
    status: stepData.status,
    description: stepData.description,
    timestamp: stepData.timestamp || new Date(),
    location: stepData.location,
    source: stepData.source || 'admin'
  };
  
  this.tracking.steps.push(step);
  return this.save();
};

// Méthode pour initialiser le suivi
OrderSchema.methods.initializeTracking = function(trackingData) {
  this.tracking = {
    carrier: trackingData.carrier,
    trackingNumber: trackingData.trackingNumber,
    trackingUrl: trackingData.trackingUrl,
    estimatedDelivery: trackingData.estimatedDelivery,
    steps: []
  };
  
  return this.save();
};

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;