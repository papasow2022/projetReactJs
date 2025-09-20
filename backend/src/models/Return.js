import mongoose from 'mongoose';

const ReturnSchema = new mongoose.Schema({
  // Informations de base
  returnNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  // Référence à la commande
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  orderNumber: {
    type: String,
    required: true
  },
  
  // Informations client
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  
  // Produits retournés
  items: [{
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    reason: {
      type: String,
      enum: [
        'defective',           // Produit défectueux
        'wrong_item',          // Mauvais article
        'not_as_described',    // Pas comme décrit
        'damaged_shipping',    // Endommagé pendant l'expédition
        'size_issue',          // Problème de taille
        'color_issue',         // Problème de couleur
        'changed_mind',        // Changement d'avis
        'duplicate_order',     // Commande en double
        'other'                // Autre
      ],
      required: true
    },
    description: { type: String }, // Description détaillée du problème
    condition: {
      type: String,
      enum: ['new', 'used', 'damaged'],
      default: 'new'
    }
  }],
  
  // Statut du retour
  status: {
    type: String,
    enum: [
      'requested',           // Demande de retour
      'approved',            // Retour approuvé
      'shipped',             // Retour expédié
      'received',            // Retour reçu
      'inspected',           // Retour inspecté
      'approved_refund',     // Remboursement approuvé
      'rejected',            // Retour refusé
      'refund_processed',    // Remboursement traité
      'refund_completed',    // Remboursement terminé
      'cancelled'            // Retour annulé
    ],
    default: 'requested'
  },
  
  // Informations de remboursement
  refund: {
    type: {
      type: String,
      enum: ['full', 'partial', 'credit', 'exchange', 'none'],
      default: 'full'
    },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'GNF' },
    method: {
      type: String,
      enum: ['original_payment', 'bank_transfer', 'credit_note', 'exchange'],
      default: 'original_payment'
    },
    processedDate: { type: Date },
    completedDate: { type: Date },
    transactionId: { type: String }, // ID de transaction de remboursement
    notes: { type: String }
  },
  
  // Informations d'expédition retour
  returnShipping: {
    carrier: { type: String },
    trackingNumber: { type: String },
    trackingUrl: { type: String },
    shippingCost: { type: Number, default: 0 },
    shippedDate: { type: Date },
    receivedDate: { type: Date }
  },
  
  // Dates importantes
  requestedDate: { type: Date, default: Date.now },
  approvedDate: { type: Date },
  shippedDate: { type: Date },
  receivedDate: { type: Date },
  inspectedDate: { type: Date },
  completedDate: { type: Date },
  
  // Notes et commentaires
  customerNotes: { type: String },
  adminNotes: { type: String },
  inspectionNotes: { type: String },
  returnReason: { type: String },
  returnDetails: { type: String },
  adminMessageToClient: { type: String },
  
  // Informations de contact
  contactInfo: {
    preferredContact: {
      type: String,
      enum: ['email', 'phone', 'sms'],
      default: 'email'
    },
    timezone: { type: String, default: 'Africa/Conakry' }
  },
  
  // Métadonnées
  source: { type: String, default: 'website' },
  userAgent: { type: String },
  ipAddress: { type: String },
  
  // Priorité et urgence
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Tags pour classification
  tags: [{ type: String }],
  
  // Historique des actions
  history: [{
    action: { type: String, required: true },
    description: { type: String, required: true },
    performedBy: { type: String, required: true }, // admin, system, customer
    timestamp: { type: Date, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed }
  }]
}, {
  timestamps: true,
  collection: 'returns'
});

// Index pour les requêtes fréquentes
ReturnSchema.index({ orderNumber: 1, status: 1 });
ReturnSchema.index({ 'customer.email': 1, requestedDate: -1 });
ReturnSchema.index({ status: 1, priority: 1 });
ReturnSchema.index({ returnNumber: 1 });

// Méthodes du modèle
ReturnSchema.methods.addHistoryEntry = function(action, description, performedBy, metadata = {}) {
  this.history.push({
    action,
    description,
    performedBy,
    metadata
  });
  return this.save();
};

ReturnSchema.methods.updateStatus = function(newStatus, performedBy, notes = '') {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Mettre à jour les dates selon le statut
  const now = new Date();
  switch (newStatus) {
    case 'approved':
      this.approvedDate = now;
      break;
    case 'shipped':
      this.shippedDate = now;
      this.returnShipping.shippedDate = now;
      break;
    case 'received':
      this.receivedDate = now;
      this.returnShipping.receivedDate = now;
      break;
    case 'inspected':
      this.inspectedDate = now;
      break;
    case 'refund_completed':
      this.completedDate = now;
      this.refund.completedDate = now;
      break;
  }
  
  // Ajouter à l'historique SANS sauvegarder
  this.history.push({
    action: 'status_change',
    description: `Statut changé de "${oldStatus}" à "${newStatus}"${notes ? ` - ${notes}` : ''}`,
    performedBy,
    timestamp: now,
    metadata: { oldStatus, newStatus, notes }
  });
  
  return this.save();
};

// Génération automatique du numéro de retour
ReturnSchema.pre('save', async function(next) {
  if (this.isNew && !this.returnNumber) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    // Compter les retours du jour
    const count = await this.constructor.countDocuments({
      returnNumber: { $regex: `^RET${year}${month}${day}` }
    });
    
    this.returnNumber = `RET${year}${month}${day}${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

const Return = mongoose.model('Return', ReturnSchema);

export default Return;
