import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
  qty: {
    type: Number,
    required: true,
    min: 1
  },
  type: {
    type: String,
    default: 'product'
  },
  seller: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true
  }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0
  },
  itemCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: "carts"
});

// Index pour optimiser les requêtes
cartSchema.index({ userId: 1, isActive: 1 });
cartSchema.index({ lastUpdated: 1 });

// Middleware pour calculer le total et le nombre d'articles
cartSchema.pre('save', function(next) {
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  this.itemCount = this.items.reduce((count, item) => count + item.qty, 0);
  this.lastUpdated = new Date();
  next();
});

// Méthode pour ajouter un article au panier
cartSchema.methods.addItem = function(item) {
  const existingItemIndex = this.items.findIndex(cartItem => 
    cartItem.productId === item.productId && 
    cartItem.color === item.color && 
    cartItem.size === item.size
  );

  if (existingItemIndex > -1) {
    // Mettre à jour la quantité si l'article existe déjà
    this.items[existingItemIndex].qty += item.qty;
  } else {
    // Ajouter un nouvel article
    this.items.push(item);
  }
  
  return this.save();
};

// Méthode pour supprimer un article du panier
cartSchema.methods.removeItem = function(productId, color = '', size = '') {
  this.items = this.items.filter(item => 
    !(item.productId === productId && 
      item.color === color && 
      item.size === size)
  );
  return this.save();
};

// Méthode pour mettre à jour la quantité d'un article
cartSchema.methods.updateItemQuantity = function(productId, quantity, color = '', size = '') {
  const item = this.items.find(item => 
    item.productId === productId && 
    item.color === color && 
    item.size === size
  );
  
  if (item) {
    item.qty = Math.max(1, quantity);
  }
  
  return this.save();
};

// Méthode pour vider le panier
cartSchema.methods.clear = function() {
  this.items = [];
  return this.save();
};

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
