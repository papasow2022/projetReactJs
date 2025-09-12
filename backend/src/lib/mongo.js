import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export async function connectMongo() {
  if (isConnected) return mongoose.connection;

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/projetReactJsa';
  const dbName = process.env.MONGODB_DB || undefined; // optionnel

  await mongoose.connect(mongoUri, {
    dbName,
  });

  isConnected = true;
  return mongoose.connection;
}

export default connectMongo; 