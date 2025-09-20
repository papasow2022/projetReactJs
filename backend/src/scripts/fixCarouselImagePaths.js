import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Schéma pour les images carousel
const CarouselImageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true, unique: true },
    alt: { type: String, default: '' },
    tags: { type: [String], default: [] },
    source: { type: String, default: 'public/chaussures' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "carousel_dImage" }
);

const CarouselImage = mongoose.models.CarouselImage || mongoose.model('CarouselImage', CarouselImageSchema);

async function fixCarouselImagePaths() {
  try {
    console.log('🔧 CORRECTION DES CHEMINS D\'IMAGES DU CAROUSEL...\n');
    
    // Connexion à la base de données papasow
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow';
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion MongoDB réussie !');
    
    // Chemin vers le dossier public des images
    const publicPath = path.join(process.cwd(), '..', 'frontend', 'public', 'chaussures');
    console.log(`📁 Dossier public: ${publicPath}`);
    
    // Vérifier si le dossier existe
    if (!fs.existsSync(publicPath)) {
      console.error('❌ Dossier public/chaussures non trouvé !');
      return;
    }
    
    // Récupérer toutes les images de la base de données
    const allImages = await CarouselImage.find({ active: true }).lean();
    console.log(`📊 Images à vérifier: ${allImages.length}`);
    
    let fixedCount = 0;
    let notFoundCount = 0;
    let alreadyCorrectCount = 0;
    
    console.log('\n🔍 VÉRIFICATION DES CHEMINS...\n');
    
    for (const image of allImages) {
      const dbPath = image.path;
      const fileName = path.basename(dbPath);
      const relativePath = dbPath.replace('/chaussures/', '');
      const fullPath = path.join(publicPath, relativePath);
      
      // Vérifier si le fichier existe
      if (fs.existsSync(fullPath)) {
        console.log(`✅ OK: ${fileName}`);
        alreadyCorrectCount++;
        continue;
      }
      
      // Chercher le fichier dans le dossier parent
      const parentDir = path.dirname(fullPath);
      const parentDirName = path.basename(parentDir);
      
      if (fs.existsSync(parentDir)) {
        const files = fs.readdirSync(parentDir);
        const matchingFile = files.find(file => 
          file.toLowerCase().includes(fileName.toLowerCase().split('.')[0]) ||
          fileName.toLowerCase().includes(file.split('.')[0].toLowerCase())
        );
        
        if (matchingFile) {
          const newPath = dbPath.replace(fileName, matchingFile);
          const newFullPath = path.join(publicPath, newPath.replace('/chaussures/', ''));
          
          if (fs.existsSync(newFullPath)) {
            // Mettre à jour le chemin dans la base de données
            await CarouselImage.updateOne(
              { _id: image._id },
              { 
                $set: { 
                  path: newPath,
                  alt: matchingFile.replace(/\.[^/.]+$/, '') // Nom sans extension
                }
              }
            );
            
            console.log(`🔧 CORRIGÉ: ${fileName} → ${matchingFile}`);
            fixedCount++;
          } else {
            console.log(`❌ NON TROUVÉ: ${fileName}`);
            notFoundCount++;
          }
        } else {
          console.log(`❌ NON TROUVÉ: ${fileName}`);
          notFoundCount++;
        }
      } else {
        console.log(`❌ DOSSIER INEXISTANT: ${parentDirName}`);
        notFoundCount++;
      }
    }
    
    console.log('\n📊 RÉSUMÉ DE LA CORRECTION:');
    console.log('=' .repeat(50));
    console.log(`✅ Chemins déjà corrects: ${alreadyCorrectCount}`);
    console.log(`🔧 Chemins corrigés: ${fixedCount}`);
    console.log(`❌ Images non trouvées: ${notFoundCount}`);
    console.log(`📊 Total traité: ${allImages.length}`);
    
    // Vérifier le résultat final
    console.log('\n🧪 TEST DE L\'API CAROUSEL...');
    const testImages = await CarouselImage.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select({ path: 1, alt: 1, tags: 1, _id: 0 })
      .lean();
    
    console.log('📡 Premières images du carousel:');
    testImages.forEach((img, index) => {
      console.log(`   ${index + 1}. "${img.alt}"`);
      console.log(`      Chemin: ${img.path}`);
    });
    
    console.log('\n✅ CORRECTION TERMINÉE !');
    console.log('🎯 Le carousel devrait maintenant afficher les vraies images.');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixCarouselImagePaths();