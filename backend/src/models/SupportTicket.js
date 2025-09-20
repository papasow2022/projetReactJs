import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['customer', 'agent', 'system'] 
  },
  message: { type: String, required: true },
  author: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const SupportTicketSchema = new mongoose.Schema(
  {
    ticketId: { 
      type: String, 
      required: false, 
      unique: true, 
      index: true 
    },
    subject: { 
      type: String, 
      required: true, 
      trim: true 
    },
    user: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      trim: true, 
      lowercase: true 
    },
    telephone: { 
      type: String, 
      trim: true 
    },
    priority: { 
      type: String, 
      required: true, 
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    status: { 
      type: String, 
      required: true, 
      enum: ['open', 'pending', 'in_progress', 'resolved', 'closed'],
      default: 'open'
    },
    description: { 
      type: String, 
      required: true 
    },
    category: { 
      type: String, 
      required: true,
      enum: ['commande', 'retour', 'livraison', 'compte', 'paiement', 'autre']
    },
    conversations: [ConversationSchema],
    assignedTo: { 
      type: String, 
      trim: true 
    },
    tags: [String],
    attachments: [{
      filename: String,
      url: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    resolution: {
      summary: String,
      resolvedAt: Date,
      resolvedBy: String
    },
    satisfaction: {
      rating: { type: Number, min: 1, max: 5 },
      feedback: String,
      ratedAt: Date
    }
  },
  { 
    timestamps: true,
    collection: "support_tickets"
  }
);

// Index pour les recherches
SupportTicketSchema.index({ email: 1, status: 1 });
SupportTicketSchema.index({ priority: 1, status: 1 });
SupportTicketSchema.index({ category: 1 });
SupportTicketSchema.index({ createdAt: -1 });

// Middleware pour générer un ID de ticket unique
SupportTicketSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketId) {
    try {
      const count = await this.constructor.countDocuments();
      this.ticketId = `SUP-${(count + 1).toString().padStart(3, '0')}`;
    } catch (error) {
      // Fallback si la base de données n'est pas accessible
      this.ticketId = `SUP-${Date.now().toString().slice(-3)}`;
    }
  }
  next();
});

// Méthode pour ajouter une conversation
SupportTicketSchema.methods.addConversation = function(conversationData) {
  const newConversation = {
    id: this.conversations.length + 1,
    ...conversationData,
    timestamp: new Date()
  };
  
  this.conversations.push(newConversation);
  this.updatedAt = new Date();
  
  return this.save();
};

// Méthode pour mettre à jour le statut
SupportTicketSchema.methods.updateStatus = function(newStatus, updatedBy = null) {
  this.status = newStatus;
  this.updatedAt = new Date();
  
  if (newStatus === 'resolved' || newStatus === 'closed') {
    this.resolution = {
      resolvedAt: new Date(),
      resolvedBy: updatedBy || 'system'
    };
  }
  
  return this.save();
};

export default mongoose.models.SupportTicket || mongoose.model('SupportTicket', SupportTicketSchema);
