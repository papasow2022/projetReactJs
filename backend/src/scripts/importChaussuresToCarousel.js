import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import connectMongo from '../lib/mongo.js';
import CarouselImage from '../models/CarouselImage.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // Trouver la racine du projet: backend/../
  const projectRoot = path.resolve(__dirname, '../../..');
  const publicDir = path.join(projectRoot, 'public', 'chaussures');

  console.log('Recherche des images dans:', publicDir);

  // Extensions d'images supportées
  const patterns = [
    path.join(publicDir, '**', '*.jpg').replace(/\\/g, '/'),
    path.join(publicDir, '**', '*.jpeg').replace(/\\/g, '/'),
    path.join(publicDir, '**', '*.png').replace(/\\/g, '/'),
    path.join(publicDir, '**', '*.webp').replace(/\\/g, '/'),
  ];

  const filesSets = await Promise.all(patterns.map(p => glob(p, { nocase: true })));
  const files = Array.from(new Set(filesSets.flat())).sort();

  console.log(`Images détectées: ${files.length}`);

  if (files.length === 0) {
    console.warn('Aucun fichier image trouvé. Vérifiez le chemin public/chaussures.');
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
      await CarouselImage.updateOne(
        { path: webPath },
        {
          $setOnInsert: {
            alt: path.basename(abs),
            tags: deriveTags(webPath),
            source: 'public/chaussures',
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

  console.log(`Import terminé. Upserts: ${upserts}. Collection: carousel_d'image`);
  process.exit(0);
}

function deriveTags(webPath) {
  // Ex: /chaussures/homme/Nike/blanc/nike-air-max-270-blanc.jpg
  const parts = webPath.split('/').filter(Boolean);
  const tags = [];
  for (const p of parts) {
    const clean = p.replace(/[-_]/g, ' ').replace(/\.(jpg|jpeg|png|webp)$/i, '');
    if (clean && !/^(chaussures|images|assets)$/i.test(clean)) tags.push(clean.toLowerCase());
  }
  return Array.from(new Set(tags));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});