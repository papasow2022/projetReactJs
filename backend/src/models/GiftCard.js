import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['purchase', 'redemption', 'recharge', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  orderId: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

const rechargeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: 'Recharge de solde'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'bank_transfer', 'cash', 'other'],
    default: 'credit_card'
  },
  transactionId: {
    type: String,
    default: null
  }
});

const giftCardSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  balance: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'GNF'
  },
  message: {
    type: String,
    maxlength: 500,
    default: ''
  },
  sender: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ''
    }
  },
  recipient: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ''
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  redeemed: {
    type: Boolean,
    default: false
  },
  design: {
    type: String,
    default: 'default',
    enum: ['default', 'birthday', 'christmas', 'valentine', 'custom']
  },
  deliveryDate: {
    type: Date,
    default: null
  },
  videoMessage: {
    type: String,
    default: null
  },
  personalized: {
    type: Boolean,
    default: false
  },
  transactions: [transactionSchema],
  rechargeHistory: [rechargeSchema],
  status: {
    type: String,
    enum: ['active', 'expired', 'redeemed', 'cancelled', 'suspended'],
    default: 'active'
  },
  lastUsedAt: {
    type: Date,
    default: null
  },
  usageCount: {
    type: Number,
    default: 0
  },
  security: {
    ipAddress: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    },
    fraudScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    suspiciousActivity: {
      type: Boolean,
      default: false
    }
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
giftCardSchema.index({ code: 1 });
giftCardSchema.index({ 'sender.email': 1 });
giftCardSchema.index({ 'recipient.email': 1 });
giftCardSchema.index({ status: 1 });
giftCardSchema.index({ expiresAt: 1 });
giftCardSchema.index({ createdAt: -1 });

// Méthodes virtuelles
giftCardSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

giftCardSchema.virtual('daysUntilExpiration').get(function() {
  const now = new Date();
  const expiration = new Date(this.expiresAt);
  const diffTime = expiration - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

giftCardSchema.virtual('totalUsed').get(function() {
  return this.amount - this.balance;
});

// Méthodes d'instance
giftCardSchema.methods.validateCard = function() {
  const now = new Date();
  
  if (this.redeemed) {
    return { valid: false, reason: 'ALREADY_REDEEMED' };
  }
  
  if (now > this.expiresAt) {
    return { valid: false, reason: 'EXPIRED' };
  }
  
  if (this.balance <= 0) {
    return { valid: false, reason: 'NO_BALANCE' };
  }
  
  if (this.status !== 'active') {
    return { valid: false, reason: 'INACTIVE' };
  }
  
  return { valid: true };
};

giftCardSchema.methods.redeem = function(amount, orderId = null) {
  const validation = this.validateCard();
  if (!validation.valid) {
    return { success: false, reason: validation.reason };
  }
  
  if (this.balance < amount) {
    return { 
      success: false, 
      reason: 'INSUFFICIENT_BALANCE',
      cardBalance: this.balance,
      requiredAmount: amount
    };
  }
  
  const usedAmount = Math.min(this.balance, amount);
  this.balance -= usedAmount;
  this.lastUsedAt = new Date();
  this.usageCount += 1;
  
  // Ajouter la transaction
  this.transactions.push({
    type: 'redemption',
    amount: usedAmount,
    orderId: orderId,
    description: `Utilisation de ${usedAmount.toLocaleString('fr-FR')} ${this.currency}`
  });
  
  if (this.balance <= 0.01) {
    this.balance = 0;
    this.redeemed = true;
    this.status = 'redeemed';
  }
  
  return {
    success: true,
    used: usedAmount,
    remaining: this.balance,
    cardCurrency: this.currency
  };
};

giftCardSchema.methods.recharge = function(amount, description = 'Recharge de solde', paymentMethod = 'credit_card', transactionId = null) {
  if (this.status !== 'active') {
    return { success: false, reason: 'CARD_NOT_ACTIVE' };
  }
  
  this.balance += Number(amount);
  this.redeemed = false;
  this.status = 'active';
  
  // Ajouter à l'historique de recharge
  this.rechargeHistory.push({
    amount: Number(amount),
    description: description,
    paymentMethod: paymentMethod,
    transactionId: transactionId
  });
  
  // Ajouter à l'historique des transactions
  this.transactions.push({
    type: 'recharge',
    amount: Number(amount),
    description: description
  });
  
  return {
    success: true,
    newBalance: this.balance,
    cardCurrency: this.currency
  };
};

// Méthodes statiques
giftCardSchema.statics.generateCode = function(length = 16) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code.match(/.{1,4}/g).join('-');
};

giftCardSchema.statics.getAnalytics = async function() {
  const pipeline = [
    {
      $group: {
        _id: null,
        totalIssued: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        totalBalance: { $sum: '$balance' },
        totalRedeemed: { $sum: { $cond: ['$redeemed', 1, 0] } },
        averageValue: { $avg: '$amount' }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  const analytics = result[0] || {
    totalIssued: 0,
    totalAmount: 0,
    totalBalance: 0,
    totalRedeemed: 0,
    averageValue: 0
  };
  
  analytics.totalUsed = analytics.totalAmount - analytics.totalBalance;
  analytics.redemptionRate = analytics.totalIssued > 0 ? (analytics.totalRedeemed / analytics.totalIssued) * 100 : 0;
  analytics.usageRate = analytics.totalAmount > 0 ? (analytics.totalUsed / analytics.totalAmount) * 100 : 0;
  
  return analytics;
};

// Middleware pre-save
giftCardSchema.pre('save', function(next) {
  // Mettre à jour le statut si la carte est expirée
  if (this.isExpired && this.status === 'active') {
    this.status = 'expired';
  }
  
  // Calculer le score de fraude basé sur l'activité
  if (this.usageCount > 10) {
    this.security.fraudScore += 20;
  }
  
  if (this.security.fraudScore > 70) {
    this.security.suspiciousActivity = true;
  }
  
  next();
});

export default mongoose.model('GiftCard', giftCardSchema);
