


import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { initializeSocket } from './socket.js';
import productsRouter from './routes/products.js';
import searchRouter from './routes/search.js';
import vendorsRouter from './routes/vendors.js';
import carouselRouter from './routes/carousel.js';
import hommeRouter from './routes/homme.js';
import enfantRouter from './routes/enfant.js';
import femmeRouter from './routes/femme.js';
import stockRouter from './routes/stock-working.js';
import stockUpdateRouter from './routes/stock-final.js';
import catalogueRouter from './routes/catalogue.js';
import catalogueV2Router from './routes/catalogue_v2.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';
import trackingRouter from './routes/tracking.js';
import returnsRouter from './routes/returns.js';
import authRouter from './routes/authRoutes.js';
import paymentsRouter from './routes/payments.js';
import stockAlertsRouter from './routes/stock-alerts.js';
import testAuthRouter from './routes/testAuth.js';
import waitingListRouter from './routes/waiting-list.js';
import adminStocksRouter from './routes/admin-stocks.js';
import supportRouter from './routes/support.js';
import adminRouter from './routes/admin.js';
import vendorRouter from './routes/vendorRoutes.js';
import giftCardsRouter from './routes/giftCards.js';
import adminNotificationsRouter from './routes/adminNotifications.js';
import healthRouter from './routes/health.js';

// Load environment variables from .env if present
dotenv.config();

// Connect to MongoDB avec configuration robuste
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow', {
  serverSelectionTimeoutMS: 5000, // Timeout après 5s
  socketTimeoutMS: 45000, // Timeout socket après 45s
  maxPoolSize: 10, // Maintenir jusqu'à 10 connexions socket
  heartbeatFrequencyMS: 10000, // Ping toutes les 10s
  retryWrites: true, // Réessayer les écritures en cas d'échec
  retryReads: true, // Réessayer les lectures en cas d'échec
})
.then(() => {
  console.log('✅ MongoDB connecté avec succès');
  console.log('🔗 URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow');
})
.catch(err => {
  console.error('❌ Erreur de connexion MongoDB:', err);
  console.error('🔄 Tentative de reconnexion dans 5 secondes...');
  setTimeout(() => {
    process.exit(1); // Redémarrer l'application
  }, 5000);
});

// Gestion des événements de connexion
mongoose.connection.on('connected', () => {
  console.log('🟢 MongoDB connecté');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Erreur MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 MongoDB déconnecté - tentative de reconnexion...');
});

// Gestion propre de la fermeture
process.on('SIGINT', async () => {
  console.log('🛑 Arrêt de l\'application...');
  await mongoose.connection.close();
  console.log('✅ Connexion MongoDB fermée');
  process.exit(0);
});

const app = express();

// Middleware
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
// Increase body limits to handle images/large payloads (prefer file uploads later)
const bodyLimit = process.env.BODY_LIMIT || '10mb';
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: bodyLimit }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRouter);
app.use('/api/test-auth', testAuthRouter);
app.use('/api/products', productsRouter);
app.use('/api/search', searchRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/carousel', carouselRouter);
app.use('/api/homme', hommeRouter);
app.use('/api/enfant', enfantRouter);
app.use('/api/femme', femmeRouter);
app.use('/api/stock', stockRouter);
app.use('/api/stock-update', stockUpdateRouter);
app.use('/api/catalogue', catalogueRouter);
app.use('/api/catalogue-v2', catalogueV2Router);
app.use('/api/stock-alerts', stockAlertsRouter);
app.use('/api/waiting-list', waitingListRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/tracking', trackingRouter);
app.use('/api/returns', returnsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/support', supportRouter);
app.use('/api/admin', adminRouter);
app.use('/api/admin', adminNotificationsRouter);
app.use('/api/admin/stocks', adminStocksRouter);
app.use('/api/vendor', vendorRouter);
app.use('/api/gift-cards', giftCardsRouter);
app.use('/api/health', healthRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error('🚨 ERREUR DÉTECTÉE:');
  console.error('📍 URL:', req.url);
  console.error('🔧 Méthode:', req.method);
  console.error('📋 Body:', req.body);
  console.error('❌ Erreur complète:', err);
  console.error('📚 Stack trace:', err.stack);
  
  res.status(500).json({ 
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server with WebSocket support
const PORT = process.env.PORT || 4000;
const server = createServer(app);

// Initialize WebSocket
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔌 WebSocket server initialized`);
});

export default app;
