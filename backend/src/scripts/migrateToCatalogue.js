import connectMongo from '../lib/mongo.js';
import mongoose from 'mongoose';

// Schéma pour la collection catalogue
const CatalogueSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true, index: true },
    model: { type: String, required: true },
    color: { type: String, required: true, index: true },
    category: { type: String, required: true, enum: ['homme', 'femme', 'enfant'], index: true },
    stock: { type: Number, required: true, default: 8, min: 0 },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    alt: { type: String, default: '' },
    tags: { type: [String], default: [] },
    active: { type: Boolean, default: true, index: true },
    originalCollection: { type: String, enum: ['homme_images', 'femme_images', 'enfant_images'] }
  },
  { 
    timestamps: true, 
    collection: "catalogue" 
  }
);

const Catalogue = mongoose.models.Catalogue || mongoose.model('Catalogue', CatalogueSchema);

// Schémas pour les collections existantes
const HommeImageSchema = new mongoose.Schema({}, { collection: "homme_images" });
const FemmeImageSchema = new mongoose.Schema({}, { collection: "femme_images" });
const EnfantImageSchema = new mongoose.Schema({}, { collection: "enfant_images" });

const HommeImage = mongoose.models.HommeImage || mongoose.model('HommeImage', HommeImageSchema);
const FemmeImage = mongoose.models.FemmeImage || mongoose.model('FemmeImage', FemmeImageSchema);
const EnfantImage = mongoose.models.EnfantImage || mongoose.model('EnfantImage', EnfantImageSchema);

async function migrateToCatalogue() {
  try {
    console.log('🚀 Début de la migration vers la collection catalogue...');
    
    await connectMongo();
    
    // Vider la collection catalogue si elle existe
    await Catalogue.deleteMany({});
    console.log('🧹 Collection catalogue vidée');
    
    let totalMigrated = 0;
    
    // 1. Migrer les produits homme
    console.log('👨 Migration des produits homme...');
    const hommeProducts = await HommeImage.find({ active: true }).lean();
    
    for (const product of hommeProducts) {
      const catalogueProduct = {
        path: product.path,
        name: product.name || `Chaussure Homme ${product.brand} ${product.model}`,
        brand: product.brand || 'Inconnu',
        model: product.model || 'Modèle',
        color: product.color || 'Non spécifié',
        category: 'homme',
        stock: product.stock || 8,
        price: product.price || 250000,
        description: product.description || 'Chaussure de qualité pour homme',
        alt: product.alt || product.name || 'Chaussure Homme',
        tags: product.tags || [],
        active: product.active !== false,
        originalCollection: 'homme_images'
      };
      
      await Catalogue.create(catalogueProduct);
      totalMigrated++;
    }
    console.log(`✅ ${hommeProducts.length} produits homme migrés`);
    
    // 2. Migrer les produits femme
    console.log('👩 Migration des produits femme...');
    const femmeProducts = await FemmeImage.find({ active: true }).lean();
    
    for (const product of femmeProducts) {
      const catalogueProduct = {
        path: product.path,
        name: product.name || `Chaussure Femme ${product.brand} ${product.model}`,
        brand: product.brand || 'Inconnu',
        model: product.model || 'Modèle',
        color: product.color || 'Non spécifié',
        category: 'femme',
        stock: product.stock || 8,
        price: product.price || 300000,
        description: product.description || 'Chaussure de qualité pour femme',
        alt: product.alt || product.name || 'Chaussure Femme',
        tags: product.tags || [],
        active: product.active !== false,
        originalCollection: 'femme_images'
      };
      
      await Catalogue.create(catalogueProduct);
      totalMigrated++;
    }
    console.log(`✅ ${femmeProducts.length} produits femme migrés`);
    
    // 3. Migrer les produits enfant
    console.log('👶 Migration des produits enfant...');
    const enfantProducts = await EnfantImage.find({ active: true }).lean();
    
    for (const product of enfantProducts) {
      const catalogueProduct = {
        path: product.path,
        name: product.name || `Chaussure Enfant ${product.brand} ${product.model}`,
        brand: product.brand || 'Inconnu',
        model: product.model || 'Modèle',
        color: product.color || 'Non spécifié',
        category: 'enfant',
        stock: product.stock || 8,
        price: product.price || 150000,
        description: product.description || 'Chaussure de qualité pour enfant',
        alt: product.alt || product.name || 'Chaussure Enfant',
        tags: product.tags || [],
        active: product.active !== false,
        originalCollection: 'enfant_images'
      };
      
      await Catalogue.create(catalogueProduct);
      totalMigrated++;
    }
    console.log(`✅ ${enfantProducts.length} produits enfant migrés`);
    
    // 4. Créer les index pour optimiser les performances
    console.log('📊 Création des index...');
    await Catalogue.collection.createIndex({ category: 1, brand: 1, color: 1 });
    await Catalogue.collection.createIndex({ category: 1, active: 1 });
    await Catalogue.collection.createIndex({ stock: 1, active: 1 });
    await Catalogue.collection.createIndex({ path: 1 }, { unique: true });
    
    console.log('🎉 Migration terminée avec succès !');
    console.log(`📈 Total des produits migrés : ${totalMigrated}`);
    
    // Statistiques finales
    const stats = await Catalogue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);
    
    console.log('\n📊 Statistiques par catégorie :');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} produits, stock total: ${stat.totalStock}, prix moyen: ${Math.round(stat.avgPrice)} GNF`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion MongoDB fermée');
  }
}

// Exécuter la migration
migrateToCatalogue();
