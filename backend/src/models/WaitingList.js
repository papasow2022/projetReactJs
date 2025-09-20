import mongoose from 'mongoose';

const waitingListSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['homme', 'femme', 'enfant']
  },
  requestedQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['waiting', 'notified', 'fulfilled', 'cancelled'],
    default: 'waiting'
  },
  priority: {
    type: Number,
    default: 0 // Plus le nombre est élevé, plus la priorité est haute
  },
  notifiedAt: {
    type: Date,
    default: null
  },
  fulfilledAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour optimiser les requêtes
waitingListSchema.index({ productId: 1, status: 1 });
waitingListSchema.index({ email: 1 });
waitingListSchema.index({ createdAt: 1 });

// Middleware pour mettre à jour updatedAt
waitingListSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('WaitingList', waitingListSchema);

