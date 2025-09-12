import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectMongo from '../lib/mongo.js';

dotenv.config();

const EnfantImageSchema = new mongoose.Schema({ quantité: Number }, { collection: 'enfant_images' });
const HommeImageSchema = new mongoose.Schema({ quantité: Number }, { collection: 'homme_images' });
const FemmeImageSchema = new mongoose.Schema({ quantité: Number }, { collection: 'femme_images' });

const EnfantImage = mongoose.models.__EnfantReset || mongoose.model('__EnfantReset', EnfantImageSchema);
const HommeImage = mongoose.models.__HommeReset || mongoose.model('__HommeReset', HommeImageSchema);
const FemmeImage = mongoose.models.__FemmeReset || mongoose.model('__FemmeReset', FemmeImageSchema);

async function main() {
  await connectMongo();
  console.log('Connecté à MongoDB');

  const ops = [];
  ops.push(EnfantImage.updateMany({}, { $set: { quantité: 5 } }));
  ops.push(HommeImage.updateMany({}, { $set: { quantité: 5 } }));
  ops.push(FemmeImage.updateMany({}, { $set: { quantité: 5 } }));

  const [u1, u2, u3] = await Promise.all(ops);
  console.log(`enfant_images: ${u1.modifiedCount} documents remis à 5`);
  console.log(`homme_images: ${u2.modifiedCount} documents remis à 5`);
  console.log(`femme_images: ${u3.modifiedCount} documents remis à 5`);

  // Afficher un échantillon
  const anyFemme = await FemmeImage.findOne();
  console.log('Exemple femme quantité:', anyFemme?.quantité);

  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });