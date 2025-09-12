import mongoose from 'mongoose';
import connectMongo from '../lib/mongo.js';

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

// Mapping des vrais noms de modèles par marque et couleur
const modelNames = {
  'Gucci': {
    'Blanc': [
      'Gucci Ace Sneaker Toddler Blanc',
      'Gucci Web Sneaker Toddler Blanc',
      'Gucci Leather Sneaker Toddler Blanc',
      'Gucci Interlocking G Toddler Blanc',
      'Gucci Luxury Toddler Sneaker Blanc',
      'Gucci Ace Sneaker Enfant Blanc',
      'Gucci Web Sneaker Enfant Blanc',
      'Gucci Leather Sneaker Enfant Blanc'
    ],
    'Noir': [
      'Gucci Ace Sneaker Toddler Noir',
      'Gucci Web Sneaker Toddler Noir',
      'Gucci Leather Loafer Toddler Noir',
      'Gucci Interlocking G Toddler Noir',
      'Gucci Luxury Toddler Sneaker Noir',
      'Gucci Ace Sneaker Enfant Noir',
      'Gucci Web Sneaker Enfant Noir',
      'Gucci Leather Sneaker Enfant Noir'
    ],
    'Multicolore': [
      'Gucci Ace Sneaker Enfant Multicolore',
      'Gucci Web Sneaker Enfant Multicolore',
      'Gucci GG Leather Sneaker Enfant Multicolore',
      'Gucci Teen Ace Sneaker Multicolore',
      'Gucci Luxury Toddler Sneaker Multicolore',
      'Gucci Ace Sneaker Toddler Multicolore',
      'Gucci Web Sneaker Toddler Multicolore',
      'Gucci Interlocking G Enfant Multicolore',
      'Gucci Leather Sneaker Enfant Multicolore'
    ]
  },
  'Nike': {
    'Blanc': [
      'Nike Air Force 1 Infant Blanc',
      'Nike Force 1 EasyOn Toddler Blanc',
      'Nike Sportswear Force 1 Toddler Blanc',
      'Nike Air Max 95 Mini Blanc',
      'Nike Dunk Low Toddler Blanc',
      'Nike Air Force 1 Toddler Blanc',
      'Nike Sportswear Toddler Blanc',
      'Nike Force 1 Toddler Blanc'
    ],
    'Noir': [
      'Nike Air Force 1 Toddler Noir',
      'Nike Air Max 270 Toddler Noir',
      'Nike Dunk Low Toddler Noir',
      'Nike Force 1 06 Toddler Noir',
      'Nike Sportswear Toddler Noir',
      'Nike Air Max 95 Toddler Noir',
      'Nike Force 1 Toddler Noir',
      'Nike Air Force 1 Infant Noir'
    ],
    'Rose': [
      'Nike Air Force 1 Toddler Rose',
      'Nike Dunk Low Toddler Rose',
      'Nike Air Max 95 Mini Rose',
      'Nike Sportswear Toddler Rose',
      'Nike Force 1 Toddler Rose',
      'Nike Air Force 1 Infant Rose',
      'Nike Sportswear Force 1 Toddler Rose',
      'Nike Air Max 270 Toddler Rose',
      'Nike Dunk Low Infant Rose'
    ]
  },
  'Jordan': {
    'Noir': [
      'Jordan True Flight Baby Noir',
      'Jordan True Flight Toddler Noir',
      'Jordan Jumpman Pro Basketball Toddler Noir',
      'Jordan Retro 13 Toddler Rouge-Noir',
      'Jordan Ace Toddler Noir',
      'Jordan True Flight Enfant Noir',
      'Jordan Jumpman Pro Basketball Enfant Noir',
      'Jordan Retro 13 Enfant Rouge-Noir',
      'Jordan Ace Enfant Noir',
      'Jordan True Flight Baby Rouge-Noir',
      'Jordan Jumpman Pro Basketball Baby Noir'
    ]
  }
};

async function updateModelNames() {
  try {
    await connectMongo();
    console.log('Connecté à MongoDB');
    
    let totalUpdated = 0;
    let totalSkipped = 0;
    
    // Parcourir chaque marque
    for (const [brand, colors] of Object.entries(modelNames)) {
      console.log(`\n🏷️  Traitement de la marque: ${brand}`);
      
      // Parcourir chaque couleur pour cette marque
      for (const [color, models] of Object.entries(colors)) {
        console.log(`   📦 Couleur: ${color} (${models.length} modèles disponibles)`);
        
        // Récupérer toutes les images de cette marque et couleur
        const images = await EnfantImage.find({ 
          brand: brand, 
          color: color, 
          active: true 
        }).sort({ createdAt: 1 }); // Trier par date de création pour avoir un ordre cohérent
        
        console.log(`   📊 ${images.length} images trouvées`);
        
        // Mettre à jour chaque image avec un nom de modèle
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const modelIndex = i % models.length; // Utiliser modulo pour répéter les modèles si nécessaire
          const newModelName = models[modelIndex];
          
          // Mettre à jour le modèle et l'alt
          const updateResult = await EnfantImage.updateOne(
            { _id: image._id },
            { 
              $set: { 
                model: newModelName,
                alt: `${brand} ${newModelName} - ${color}`
              }
            }
          );
          
          if (updateResult.modifiedCount > 0) {
            console.log(`   ✅ ${image.path.split('/').pop()} → ${newModelName}`);
            totalUpdated++;
          } else {
            console.log(`   ⏭️  ${image.path.split('/').pop()} (déjà à jour)`);
            totalSkipped++;
          }
        }
      }
    }
    
    console.log(`\n🎉 Mise à jour terminée!`);
    console.log(`✅ ${totalUpdated} images mises à jour`);
    console.log(`⏭️  ${totalSkipped} images déjà à jour`);
    
    // Afficher quelques exemples des résultats
    console.log(`\n📋 Exemples des nouveaux noms:`);
    const samples = await EnfantImage.find({ active: true })
      .limit(10)
      .select({ brand: 1, model: 1, color: 1, _id: 0 })
      .lean();
    
    samples.forEach((img, index) => {
      console.log(`${index + 1}. ${img.brand} - ${img.model} (${img.color})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

updateModelNames();