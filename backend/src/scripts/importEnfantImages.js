import mongoose from 'mongoose';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectMongo from '../lib/mongo.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Schéma pour les images enfant
const EnfantImageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true, unique: true },
    alt: { type: String, default: '' },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    color: { type: String, default: '' },
    category: { type: String, default: 'enfant' },
    tags: { type: [String], default: [] },
    source: { type: String, default: 'public/chaussures/enfant' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "enfant_images" }
);

const EnfantImage = mongoose.models.EnfantImage || mongoose.model('EnfantImage', EnfantImageSchema);

// Fonction pour extraire les informations de la marque et couleur depuis le chemin
function extractBrandAndColor(filePath) {
  // Exemple: public/chaussures/enfant/Guccienfantblanc/filename.jpeg
  const parts = filePath.split('/');
  const folderName = parts[3] || '';
  
  // Mapping des noms de dossiers vers des marques et couleurs
  const brandColorMap = {
    'Guccienfantblanc': { brand: 'Gucci', color: 'Blanc' },
    'Guccienfantnoire': { brand: 'Gucci', color: 'Noir' },
    'Guccimulticoloreenfant': { brand: 'Gucci', color: 'Multicolore' },
    'Jordannoireenfant': { brand: 'Jordan', color: 'Noir' },
    'Nikeenfantblanc': { brand: 'Nike', color: 'Blanc' },
    'Nikeenfantcouleurnoire': { brand: 'Nike', color: 'Noir' },
    'Nikeenfantrose': { brand: 'Nike', color: 'Rose' }
  };
  
  return brandColorMap[folderName] || { brand: 'Unknown', color: 'Unknown' };
}

// Fonction pour extraire le nom du modèle depuis le nom de fichier
function extractModel(filename) {
  // Enlever l'extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  // Nettoyer le nom du fichier
  let model = nameWithoutExt
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Si le nom est trop long, le tronquer
  if (model.length > 50) {
    model = model.substring(0, 47) + '...';
  }
  
  return model || 'Chaussure Enfant';
}

async function main() {
  // Trouver la racine du projet: backend/../../
  const projectRoot = path.resolve(__dirname, '../../../');
  const enfantDir = path.join(projectRoot, 'public', 'chaussures', 'enfant');

  console.log('Recherche des images dans:', enfantDir);

  // Extensions d'images supportées
  const patterns = [
    path.join(enfantDir, '**', '*.jpg').replace(/\\/g, '/'),
    path.join(enfantDir, '**', '*.jpeg').replace(/\\/g, '/'),
    path.join(enfantDir, '**', '*.png').replace(/\\/g, '/'),
    path.join(enfantDir, '**', '*.webp').replace(/\\/g, '/'),
  ];

  const filesSets = await Promise.all(patterns.map(p => glob(p, { nocase: true })));
  const files = Array.from(new Set(filesSets.flat())).sort();

  console.log(`Images détectées: ${files.length}`);

  if (files.length === 0) {
    console.warn('Aucun fichier image trouvé. Vérifiez le chemin public/chaussures/enfant.');
    return;
  }

  await connectMongo();
  console.log('Connecté à MongoDB');

  let upserts = 0;
  for (const abs of files) {
    try {
      // Convertir le chemin absolu en chemin relatif depuis la racine du projet
      const relativePath = path.relative(projectRoot, abs).replace(/\\/g, '/');
      
      // Extraire les informations de marque et couleur
      const { brand, color } = extractBrandAndColor(relativePath);
      
      // Extraire le nom du modèle
      const filename = path.basename(abs);
      const model = extractModel(filename);
      
      // Créer l'objet image
      const imageData = {
        path: `/${relativePath}`,
        alt: `${brand} ${model} - ${color}`,
        brand,
        model,
        color,
        category: 'enfant',
        tags: [brand.toLowerCase(), color.toLowerCase(), 'enfant', 'chaussures'],
        source: 'public/chaussures/enfant',
        active: true
      };

      // Upsert (insert ou update)
      const result = await EnfantImage.findOneAndUpdate(
        { path: imageData.path },
        imageData,
        { upsert: true, new: true }
      );

      if (result.isNew) {
        upserts++;
        console.log(`✅ Ajouté: ${imageData.path}`);
      } else {
        console.log(`🔄 Mis à jour: ${imageData.path}`);
      }
    } catch (err) {
      console.error(`❌ Erreur pour ${abs}:`, err.message);
    }
  }

  console.log(`\n🎉 Import terminé! ${upserts} nouvelles images ajoutées.`);
  console.log(`📊 Total d'images dans la collection: ${await EnfantImage.countDocuments()}`);
  
  process.exit(0);
}

main().catch(err => {
  console.error('Erreur fatale:', err);
  process.exit(1);
});