import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import connectMongo from '../lib/mongo.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function main() {
  // Trouver la racine du projet: backend/../
  const projectRoot = path.resolve(__dirname, '../../..');
  const hommeDir = path.join(projectRoot, 'public', 'chaussures', 'homme');

  console.log('Recherche des images dans:', hommeDir);

  // Extensions d'images supportées
  const patterns = [
    path.join(hommeDir, '**', '*.jpg').replace(/\\/g, '/'),
    path.join(hommeDir, '**', '*.jpeg').replace(/\\/g, '/'),
    path.join(hommeDir, '**', '*.png').replace(/\\/g, '/'),
    path.join(hommeDir, '**', '*.webp').replace(/\\/g, '/'),
  ];

  const filesSets = await Promise.all(patterns.map(p => glob(p, { nocase: true })));
  const files = Array.from(new Set(filesSets.flat())).sort();

  console.log(`Images détectées: ${files.length}`);

  if (files.length === 0) {
    console.warn('Aucun fichier image trouvé. Vérifiez le chemin public/chaussures/homme.');
  }

  await connectMongo();
  console.log('Connecté à MongoDB');

  let upserts = 0;
  for (const abs of files) {
    // Construire le chemin web relatif depuis /public
    const idx = abs.replace(/\\/g, '/').lastIndexOf('/public/');
    const relFromPublic = idx >= 0 ? abs.replace(/\\/g, '/').slice(idx + '/public/'.length) : abs;
    const webPath = '/' + relFromPublic.replace(/\\/g, '/');

    try {
      const { brand, model, color } = extractBrandModelColor(webPath);
      
      await HommeImage.updateOne(
        { path: webPath },
        {
          $setOnInsert: {
            alt: path.basename(abs),
            brand,
            model,
            color,
            category: 'homme',
            tags: deriveTags(webPath),
            source: 'public/chaussures/homme',
            active: true,
          },
        },
        { upsert: true }
      );
      upserts += 1;
    } catch (e) {
      if (e.code === 11000) continue; // déjà présent
      console.error('Erreur sur', webPath, e.message);
    }
  }

  console.log(`Import terminé. Upserts: ${upserts}. Collection: homme_images`);
  process.exit(0);
}

function extractBrandModelColor(webPath) {
  // Ex: /chaussures/homme/Nike/blanc/nike-air-max-270-blanc.jpg
  const parts = webPath.split('/').filter(Boolean);
  let brand = '';
  let model = '';
  let color = '';

  // Chercher la marque (après 'homme')
  const hommeIdx = parts.findIndex(p => p === 'homme');
  if (hommeIdx >= 0 && hommeIdx + 1 < parts.length) {
    brand = parts[hommeIdx + 1];
  }

  // Chercher la couleur (avant le nom du fichier)
  const filename = parts[parts.length - 1];
  const colorMap = [
    { tokens: ['noir', 'noire', 'black'], value: 'Noir' },
    { tokens: ['blanc', 'blanche', 'white'], value: 'Blanc' },
    { tokens: ['vert', 'olive', 'vertolive'], value: 'Vert olive' },
    { tokens: ['rose', 'pink'], value: 'Rose' },
    { tokens: ['rouge', 'red'], value: 'Rouge' },
    { tokens: ['bleu', 'blue'], value: 'Bleu' },
  ];

  const foundColor = colorMap.find(c => 
    c.tokens.some(t => webPath.toLowerCase().includes(t))
  )?.value || '';

  // Extraire le modèle du nom de fichier
  const noExt = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  model = noExt.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();

  return { brand, model, color: foundColor };
}

function deriveTags(webPath) {
  const parts = webPath.split('/').filter(Boolean);
  const tags = [];
  for (const p of parts) {
    const clean = p.replace(/[-_]/g, ' ').replace(/\.(jpg|jpeg|png|webp)$/i, '');
    if (clean && !/^(chaussures|images|assets|homme)$/i.test(clean)) {
      tags.push(clean.toLowerCase());
    }
  }
  return Array.from(new Set(tags));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});