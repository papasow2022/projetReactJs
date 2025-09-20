import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  nom: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Homme', 'Femme', 'Autre']
  },
  newsletter: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationCode: {
    type: String,
    default: null
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  },
  // Propriétés admin
  isAdmin: {
    type: Boolean,
    default: false
  },
  roles: [{
    type: String,
    enum: ['superadmin', 'moderator', 'finance', 'support', 'viewer']
  }],
  // Propriétés vendeur
  isVendor: {
    type: Boolean,
    default: false
  },
  isVendorValidated: {
    type: Boolean,
    default: false
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    default: null
  },
  vendorStatus: {
    type: String,
    enum: ['none', 'pending', 'validated', 'rejected'],
    default: 'none'
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour hasher le mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware pour mettre à jour updatedAt
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour générer un code de vérification
userSchema.methods.generateVerificationCode = function() {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 chiffres
  this.emailVerificationCode = code;
  this.emailVerificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  return code;
};

// Méthode pour vérifier le code
userSchema.methods.verifyCode = function(code) {
  if (!this.emailVerificationCode || !this.emailVerificationExpires) {
    return false;
  }
  
  if (new Date() > this.emailVerificationExpires) {
    return false;
  }
  
  return this.emailVerificationCode === code;
};

// Méthode pour nettoyer le code après vérification
userSchema.methods.clearVerificationCode = function() {
  this.emailVerificationCode = null;
  this.emailVerificationExpires = null;
  this.isEmailVerified = true;
};

// Index pour optimiser les requêtes
userSchema.index({ email: 1 });
userSchema.index({ emailVerificationCode: 1 });

export default mongoose.model('User', userSchema);
