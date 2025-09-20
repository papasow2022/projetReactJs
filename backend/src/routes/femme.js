import { Router } from 'express';
import connectMongo from '../lib/mongo.js';
import mongoose from 'mongoose';

const router = Router();

// Schéma pour les images femme
const FemmeImageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true, unique: true },
    alt: { type: String, default: '' },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    color: { type: String, default: '' },
    category: { type: String, default: 'femme' },
    tags: { type: [String], default: [] },
    source: { type: String, default: 'public/chaussures/femme' },
    active: { type: Boolean, default: true },
    // Ajout des informations de stock
    stock: { type: Number, default: 5 },
    price: { type: Number, default: 300000 },
    name: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  { timestamps: true, collection: "femme_images" }
);

const FemmeImage = mongoose.models.FemmeImage || mongoose.model('FemmeImage', FemmeImageSchema);

// Endpoint pour récupérer une image aléatoire
router.get('/random', async (req, res) => {
  try {
    await connectMongo();
    
    const count = await FemmeImage.countDocuments({ active: true });
    if (count === 0) {
      return res.status(404).json({ error: 'no_images_found' });
    }
    
    const randomIndex = Math.floor(Math.random() * count);
    const randomImage = await FemmeImage.findOne({ active: true })
      .skip(randomIndex)
      .select({ path: 1, alt: 1, brand: 1, model: 1, color: 1, stock: 1, price: 1, name: 1, description: 1, _id: 0 })
      .lean();
    
    res.json(randomImage);
  } catch (err) {
    console.error('Erreur /api/femme/random:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// Endpoint pour récupérer toutes les images femme avec stock
router.get('/', async (req, res) => {
  try {
    await connectMongo();
    
    const images = await FemmeImage.find({ active: true })
      .select({ path: 1, alt: 1, brand: 1, model: 1, color: 1, stock: 1, price: 1, name: 1, description: 1, _id: 1 })
      .lean();
    
    res.json(images);
  } catch (err) {
    console.error('Erreur /api/femme:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

export default router;
