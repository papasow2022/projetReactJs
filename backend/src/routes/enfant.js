import { Router } from 'express';
import connectMongo from '../lib/mongo.js';
import mongoose from 'mongoose';

const router = Router();

// Schéma pour les images enfant
const EnfantImageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true, unique: true },
    alt: { type: String, default: '' },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    color: { type: String, default: '' },
    category: { type: String, default: 'enfant' },
    tags: { type: [String], default: [] },
    source: { type: String, default: 'public/chaussures/enfant' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "enfant_images" }
);

const EnfantImage = mongoose.models.EnfantImage || mongoose.model('EnfantImage', EnfantImageSchema);

// Endpoint pour récupérer une image aléatoire
router.get('/random', async (req, res) => {
  try {
    await connectMongo();
    
    const count = await EnfantImage.countDocuments({ active: true });
    if (count === 0) {
      return res.status(404).json({ error: 'no_images_found' });
    }
    
    const randomIndex = Math.floor(Math.random() * count);
    const randomImage = await EnfantImage.findOne({ active: true })
      .skip(randomIndex)
      .select({ path: 1, alt: 1, brand: 1, model: 1, color: 1, _id: 0 })
      .lean();
    
    res.json(randomImage);
  } catch (err) {
    console.error('Erreur /api/enfant/random:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

// Endpoint pour récupérer toutes les images enfant
router.get('/', async (req, res) => {
  try {
    await connectMongo();
    
    const limit = Math.min(Number(req.query.limit || 50), 200);
    const onlyActive = req.query.active !== 'false';

    const query = onlyActive ? { active: true } : {};
    const items = await EnfantImage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select({ path: 1, alt: 1, brand: 1, model: 1, color: 1, _id: 0 })
      .lean();

    res.json({ items });
  } catch (err) {
    console.error('Erreur /api/enfant:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

export default router;