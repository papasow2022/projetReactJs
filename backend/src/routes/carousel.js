import { Router } from 'express';
import connectMongo from '../lib/mongo.js';
import CarouselImage from '../models/CarouselImage.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    await connectMongo();
    const limit = Math.min(Number(req.query.limit || 20), 200);
    const onlyActive = req.query.active !== 'false';

    const query = onlyActive ? { active: true } : {};
    const items = await CarouselImage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select({ path: 1, alt: 1, tags: 1, _id: 0 })
      .lean();

    res.json({ items });
  } catch (err) {
    console.error('Erreur /api/carousel:', err);
    res.status(500).json({ error: 'server_error' });
  }
});

export default router;