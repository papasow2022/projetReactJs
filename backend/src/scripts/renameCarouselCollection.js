import connectMongo from '../lib/mongo.js';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const connection = await connectMongo();
  const db = connection.db;
  
  const oldCollection = "carousel_d'image";
  const newCollection = "carousel_dImage";
  
  try {
    // Vérifier si l'ancienne collection existe
    const collections = await db.listCollections({ name: oldCollection }).toArray();
    
    if (collections.length === 0) {
      console.log(`Collection "${oldCollection}" n'existe pas. Rien à migrer.`);
      process.exit(0);
    }
    
    // Vérifier si la nouvelle collection existe déjà
    const newCollections = await db.listCollections({ name: newCollection }).toArray();
    if (newCollections.length > 0) {
      console.log(`Collection "${newCollection}" existe déjà. Suppression avant migration...`);
      await db.collection(newCollection).drop();
    }
    
    // Renommer la collection
    await db.collection(oldCollection).rename(newCollection);
    console.log(`✅ Collection renommée: "${oldCollection}" → "${newCollection}"`);
    
    // Vérifier le nombre de documents
    const count = await db.collection(newCollection).countDocuments();
    console.log(`📊 Documents dans "${newCollection}": ${count}`);
    
  } catch (error) {
    console.error('❌ Erreur lors du renommage:', error.message);
    process.exit(1);
  }
  
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});