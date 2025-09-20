import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
    index: true
  },
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
  transactionId: {
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
  type: {
    type: String,
    enum: ['payment', 'refund', 'chargeback', 'dispute'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'XOF'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  providerTransactionId: {
    type: String,
    required: true
  },
  providerResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  fees: {
    provider: {
      type: Number,
      default: 0
    },
    platform: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  netAmount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  processedAt: {
    type: Date
  },
  failureReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  collection: "transactions"
});

// Index pour optimiser les requêtes
transactionSchema.index({ userId: 1, status: 1 });
transactionSchema.index({ orderId: 1 });
transactionSchema.index({ paymentId: 1 });
transactionSchema.index({ provider: 1, type: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ providerTransactionId: 1 });

// Middleware pour calculer le montant net
transactionSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('fees')) {
    this.fees.total = this.fees.provider + this.fees.platform;
    this.netAmount = this.amount - this.fees.total;
  }
  next();
});

// Méthode pour marquer comme traité
transactionSchema.methods.markAsProcessed = function() {
  this.status = 'completed';
  this.processedAt = new Date();
  return this.save();
};

// Méthode pour marquer comme échoué
transactionSchema.methods.markAsFailed = function(reason) {
  this.status = 'failed';
  this.failureReason = reason;
  return this.save();
};

// Méthode statique pour obtenir les statistiques de transaction
transactionSchema.statics.getTransactionStats = function(userId = null, startDate = null, endDate = null) {
  const match = {};
  if (userId) match.userId = userId;
  if (startDate && endDate) {
    match.createdAt = { $gte: startDate, $lte: endDate };
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          provider: '$provider',
          type: '$type',
          status: '$status'
        },
        totalAmount: { $sum: '$amount' },
        totalNetAmount: { $sum: '$netAmount' },
        totalFees: { $sum: '$fees.total' },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Méthode statique pour obtenir les transactions d'un utilisateur
transactionSchema.statics.getUserTransactions = function(userId, limit = 50, skip = 0) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('orderId', 'orderNumber total')
    .populate('paymentId', 'paymentId provider method');
};

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction;
