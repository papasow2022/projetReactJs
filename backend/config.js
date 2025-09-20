export default {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-papasow-admin-2024',
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development'
};

