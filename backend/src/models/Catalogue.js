import mongoose from 'mongoose';

const CatalogueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  genre: { type: String },
  color: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  path: { type: String },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Vérifier si le modèle existe déjà
const Catalogue = mongoose.models.Catalogue || mongoose.model('Catalogue', CatalogueSchema);

export default Catalogue;
