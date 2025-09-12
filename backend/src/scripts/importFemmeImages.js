import mongoose from 'mongoose';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectMongo from '../lib/mongo.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Schéma pour les images femme
const FemmeImageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true, unique: true },
    alt: { type: String, default: '' },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    color: { type: String, default: '' },
    category: { type: String, default: 'femme' },
    tags: { type: [String], default: [] },
    source: { type: String, default: 'public/chaussures/femme' },
    active: { type: Boolean, default: true },
    quantité: { type: Number, default: 5 }
  },
  { timestamps: true, collection: 'femme_images' }
);

const FemmeImage = mongoose.models.FemmeImage || mongoose.model('FemmeImage', FemmeImageSchema);

function mapBrandFromFolder(folder) {
  const map = {
    CritianlouboutinNoire: 'Christian Louboutin',
    Gucci: 'Gucci',
    Jonak: 'Jonak',
    Mango: 'Mango',
    Minelli: 'Minelli',
    PradaBeige: 'Prada',
    Zaranoire: 'Zara'
  };
  return map[folder] || folder;
}

function extractMetaFromPath(relPath) {
  // relPath like public/chaussures/femme/<folder>/<file>
  const parts = relPath.replace(/\\/g, '/').split('/');
  const folder = parts[3] || '';
  const fileName = parts[4] || '';
  const brand = mapBrandFromFolder(folder);
  // Infer color roughly from folder or filename keywords
  const lower = (folder + ' ' + fileName).toLowerCase();
  const color = lower.includes('noir') || lower.includes('black') ? 'Noir' :
                lower.includes('beige') ? 'Beige' :
                lower.includes('nude') ? 'Nude' : 'Mixte';
  const model = fileName.replace(/\.[^/.]+$/, '').replace(/[\-_]/g, ' ').trim();
  return { brand, color, model };
}

async function main() {
  // project root: backend/../../
  const projectRoot = path.resolve(__dirname, '../../../');
  const femmeDir = path.join(projectRoot, 'public', 'chaussures', 'femme');

  console.log('Recherche des images FEMME dans:', femmeDir);

  const patterns = [
    path.join(femmeDir, '**', '*.jpg').replace(/\\/g, '/'),
    path.join(femmeDir, '**', '*.jpeg').replace(/\\/g, '/'),
    path.join(femmeDir, '**', '*.png').replace(/\\/g, '/'),
    path.join(femmeDir, '**', '*.webp').replace(/\\/g, '/'),
  ];

  const filesSets = await Promise.all(patterns.map(p => glob(p, { nocase: true })));
  const files = Array.from(new Set(filesSets.flat())).sort();

  console.log(`Images détectées (femme): ${files.length}`);
  if (files.length === 0) {
    console.warn('Aucun fichier image FEMME trouvé.');
    return;
  }

  await connectMongo();
  console.log('Connecté à MongoDB');

  let upserts = 0;
  for (const abs of files) {
    try {
      const relativePath = path.relative(projectRoot, abs).replace(/\\/g, '/');
      const { brand, color, model } = extractMetaFromPath(relativePath);
      const doc = {
        path: `/${relativePath}`,
        alt: `${brand} ${model} - ${color}`,
        brand,
        model,
        color,
        category: 'femme',
        tags: [brand.toLowerCase(), color.toLowerCase(), 'femme', 'chaussures'],
        source: 'public/chaussures/femme',
        active: true,
        quantité: 5
      };

      const res = await FemmeImage.findOneAndUpdate(
        { path: doc.path },
        doc,
        { upsert: true, new: true }
      );
      if (res) upserts++;
      console.log(`✅ Importé/mis à jour: ${doc.path}`);
    } catch (e) {
      console.error(`❌ Erreur import ${abs}:`, e.message);
    }
  }

  const total = await FemmeImage.countDocuments();
  console.log(`\n🎉 Import FEMME terminé. Upserts: ${upserts}. Total en base: ${total}`);
  process.exit(0);
}

main().catch(err => {
  console.error('Erreur fatale import FEMME:', err);
  process.exit(1);
});