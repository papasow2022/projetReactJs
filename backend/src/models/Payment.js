import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  paymentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  provider: {
    type: String,
    enum: ['stripe', 'paypal', 'mobile_money', 'bank_transfer'],
    required: true
  },
  method: {
    type: String,
    enum: ['card', 'paypal', 'mobile_money', 'bank_transfer', 'cash_on_delivery'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'XOF',
    enum: ['XOF', 'USD', 'EUR']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending',
    index: true
  },
  providerStatus: {
    type: String,
    default: ''
  },
  providerTransactionId: {
    type: String,
    default: ''
  },
  providerResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  failureReason: {
    type: String,
    default: ''
  },
  refunds: [{
    refundId: String,
    amount: Number,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'cancelled']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  webhookEvents: [{
    eventId: String,
    eventType: String,
    processed: {
      type: Boolean,
      default: false
    },
    receivedAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: "payments"
});

// Index pour optimiser les requêtes
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ provider: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });

// Méthode pour mettre à jour le statut
paymentSchema.methods.updateStatus = function(newStatus, providerStatus = '', failureReason = '') {
  this.status = newStatus;
  if (providerStatus) this.providerStatus = providerStatus;
  if (failureReason) this.failureReason = failureReason;
  return this.save();
};

// Méthode pour ajouter un remboursement
paymentSchema.methods.addRefund = function(refundData) {
  this.refunds.push({
    refundId: refundData.refundId,
    amount: refundData.amount,
    reason: refundData.reason,
    status: refundData.status || 'pending'
  });
  return this.save();
};

// Méthode pour calculer le montant total des remboursements
paymentSchema.methods.getTotalRefunded = function() {
  return this.refunds
    .filter(refund => refund.status === 'succeeded')
    .reduce((total, refund) => total + refund.amount, 0);
};

// Méthode statique pour obtenir les statistiques de paiement
paymentSchema.statics.getPaymentStats = function(userId = null, startDate = null, endDate = null) {
  const match = { status: 'completed' };
  if (userId) match.userId = userId;
  if (startDate && endDate) {
    match.createdAt = { $gte: startDate, $lte: endDate };
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$provider',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        averageAmount: { $avg: '$amount' }
      }
    }
  ]);
};

// Méthode statique pour obtenir les paiements en échec
paymentSchema.statics.getFailedPayments = function(userId = null, limit = 50) {
  const match = { status: 'failed' };
  if (userId) match.userId = userId;
  
  return this.find(match)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('orderId', 'orderNumber total')
    .populate('userId', 'prenom nom email');
};

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export default Payment;
