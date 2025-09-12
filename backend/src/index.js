import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import productsRouter from './routes/products.js';
import searchRouter from './routes/search.js';
import vendorsRouter from './routes/vendors.js';
import carouselRouter from './routes/carousel.js';
import hommeRouter from './routes/homme.js';
import enfantRouter from './routes/enfant.js';
import stockRouter from './routes/stock.js';

// Load environment variables from .env if present
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
// Increase body limits to handle images/large payloads (prefer file uploads later)
const bodyLimit = process.env.BODY_LIMIT || '10mb';
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: bodyLimit }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/products', productsRouter);
app.use('/api/search', searchRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/carousel', carouselRouter);
app.use('/api/homme', hommeRouter);
app.use('/api/enfant', enfantRouter);
app.use('/api/stock', stockRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
