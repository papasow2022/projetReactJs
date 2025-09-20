import { Router } from 'express';

const router = Router();

// Route de santé pour vérifier que le serveur fonctionne
router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Serveur backend opérationnel',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Route de test CORS
router.get('/cors', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CORS fonctionne correctement',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

export default router;

