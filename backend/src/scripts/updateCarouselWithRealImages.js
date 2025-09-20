import mongoose from 'mongoose';
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

async function updateCarouselWithRealImages() {
  try {
    console.log('🖼️  Mise à jour du carousel avec de vraies images...\n');
    
    // Connexion à MongoDB
    const mongoUri = 'mongodb://127.0.0.1:27017/projetReactJsa';
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion MongoDB réussie !');
    
    // Vider la collection existante
    await CarouselImage.deleteMany({});
    console.log('🗑️  Collection carousel_dImage vidée');
    
    // Images réelles avec leurs vrais chemins
    const realImages = [
      // Images femme
      {
        path: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin - So Kate 120mm Black Patent Leather Pumps.jpeg',
        alt: 'Escarpins Christian Louboutin So Kate Noir',
        tags: ['femme', 'escarpins', 'louboutin', 'noir', 'luxe'],
        source: 'public/chaussures/femme',
        active: true
      },
      {
        path: '/chaussures/femme/Gucci/Gucci - Women\'s Ace sneaker with Web stripe.jpeg',
        alt: 'Sneakers Gucci Femme avec Web Stripe',
        tags: ['femme', 'sneakers', 'gucci', 'web stripe', 'luxe'],
        source: 'public/chaussures/femme',
        active: true
      },
      {
        path: '/chaussures/femme/PradaBeige/Prada - Women\'s Cloudbust Thunder Sneaker.jpeg',
        alt: 'Sneakers Prada Cloudbust Thunder Beige',
        tags: ['femme', 'sneakers', 'prada', 'beige', 'cloudbust'],
        source: 'public/chaussures/femme',
        active: true
      },
      
      // Images homme
      {
        path: '/chaussures/homme/Balanciaga/Balenciaga - Triple S Sneaker.jpeg',
        alt: 'Sneakers Balenciaga Triple S',
        tags: ['homme', 'sneakers', 'balenciaga', 'triple s', 'luxe'],
        source: 'public/chaussures/homme',
        active: true
      },
      {
        path: '/chaussures/homme/Gucci/Gucci - Men\'s Ace sneaker with Web stripe.jpeg',
        alt: 'Sneakers Gucci Homme avec Web Stripe',
        tags: ['homme', 'sneakers', 'gucci', 'web stripe', 'luxe'],
        source: 'public/chaussures/homme',
        active: true
      },
      {
        path: '/chaussures/homme/Nike/Nike Air Jordan 1 Retro High OG.jpeg',
        alt: 'Nike Air Jordan 1 Retro High OG',
        tags: ['homme', 'sneakers', 'nike', 'jordan', 'retro'],
        source: 'public/chaussures/homme',
        active: true
      },
      {
        path: '/chaussures/homme/Puma/Puma Suede Classic.jpeg',
        alt: 'Puma Suede Classic Vintage',
        tags: ['homme', 'sneakers', 'puma', 'suede', 'classic'],
        source: 'public/chaussures/homme',
        active: true
      },
      
      // Images enfant
      {
        path: '/chaussures/enfant/Gucci-Enfant-Blanc/Gucci - Toddler Ace sneaker.jpeg',
        alt: 'Sneakers Gucci Enfant Blanc',
        tags: ['enfant', 'sneakers', 'gucci', 'blanc', 'toddler'],
        source: 'public/chaussures/enfant',
        active: true
      },
      {
        path: '/chaussures/enfant/Jordannoireenfant/Jordan True Flight Baby_Toddler Shoes.jpeg',
        alt: 'Jordan True Flight Enfant Noir',
        tags: ['enfant', 'sneakers', 'jordan', 'noir', 'basketball'],
        source: 'public/chaussures/enfant',
        active: true
      },
      {
        path: '/chaussures/enfant/Nikeenfantblanc/Nike Sportswear FORCE 1 EASYON UNISEX.jpeg',
        alt: 'Nike Air Force 1 Enfant Blanc',
        tags: ['enfant', 'sneakers', 'nike', 'air force', 'blanc'],
        source: 'public/chaussures/enfant',
        active: true
      }
    ];
    
    let addedCount = 0;
    
    console.log('📝 Ajout des vraies images...\n');
    
    for (const imageData of realImages) {
      try {
        await CarouselImage.create(imageData);
        console.log(`✅ Ajouté: "${imageData.alt}"`);
        console.log(`   Chemin: ${imageData.path}`);
        addedCount++;
      } catch (error) {
        console.error(`❌ Erreur pour "${imageData.alt}":`, error.message);
      }
    }
    
    // Vérifier le résultat
    const totalCount = await CarouselImage.countDocuments();
    const activeCount = await CarouselImage.countDocuments({ active: true });
    
    console.log(`\n📊 Résumé:`);
    console.log(`   - Images ajoutées: ${addedCount}`);
    console.log(`   - Total dans la collection: ${totalCount}`);
    console.log(`   - Images actives: ${activeCount}`);
    
    // Afficher les images qui seront dans le carousel
    console.log(`\n🎠 Images dans le carousel:`);
    const carouselImages = await CarouselImage.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select({ path: 1, alt: 1, tags: 1 })
      .lean();
    
    carouselImages.forEach((img, index) => {
      console.log(`   ${index + 1}. "${img.alt}"`);
      console.log(`      Chemin: ${img.path}`);
    });
    
    console.log('\n✅ Mise à jour terminée !');
    console.log('🎯 Le carousel devrait maintenant afficher les vraies images avec leurs noms.');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateCarouselWithRealImages();
