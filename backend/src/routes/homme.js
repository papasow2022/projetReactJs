import { Router } from 'express';
import connectMongo from '../lib/mongo.js';
import mongoose from 'mongoose';

const router = Router();

// Schéma pour les images homme
const HommeImageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true, unique: true },
    alt: { type: String, default: '' },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    color: { type: String, default: '' },
    category: { type: String, default: 'homme' },
    tags: { type: [String], default: [] },
    source: { type: String, default: 'public/chaussures/homme' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "homme_images" }
);

const HommeImage = mongoose.models.HommeImage || mongoose.model('HommeImage', HommeImageSchema);

// Endpoint pour récupérer une image aléatoire
router.get('/random', async (req, res) => {
  try {
    await connectMongo();
    
    const count = await HommeImage.countDocuments({ active: true });
    if (count === 0) {
      return res.status(404).json({ error: 'no_images_found' });
    }
    
    const randomIndex = Math.floor(Math.random() * count);
    const randomImage = await HommeImage.findOne({ active: true })
      .skip(randomIndex)
      .select({ path: 1, alt: 1, brand: 1, model: 1, color: 1, _id: 0 })
      .lean();
    
    res.json(randomImage);
  } catch (err) {
    console.error('Erreur /api/homme/random:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

export default router;