const { MongoClient } = require('mongodb');

async function addGucciEnfantBlanc() {
  const client = new MongoClient('mongodb://localhost:27017/papasow');
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('papasow');
    
    // Images du dossier Gucci-Enfant-Blanc
    const gucciBlancImages = [
      {
        name: "Chaussure Enfant Gucci Ace Sneaker Blanc",
        brand: "Gucci",
        model: "Ace Sneaker",
        color: "Blanc",
        genre: "enfant",
        category: "chaussure",
        stock: 8,
        price: 180000,
        description: "Chaussure Gucci Ace Sneaker pour enfant en cuir blanc de luxe",
        alt: "Chaussure Gucci Ace Sneaker Enfant Blanc",
        tags: ["gucci", "enfant", "blanc", "luxe", "sneaker"],
        active: true,
        path: "/chaussures/enfant/Gucci-Enfant-Blanc/Designer Luxury Toddler Sneakers  _ GUCCI® US.jpeg",
        originalCollection: "manual"
      },
      {
        name: "Chaussure Enfant Gucci Interlocking G Blanc",
        brand: "Gucci",
        model: "Interlocking G",
        color: "Blanc",
        genre: "enfant",
        category: "chaussure",
        stock: 6,
        price: 200000,
        description: "Chaussure Gucci avec logo Interlocking G pour enfant",
        alt: "Chaussure Gucci Interlocking G Enfant Blanc",
        tags: ["gucci", "enfant", "blanc", "luxe", "interlocking"],
        active: true,
        path: "/chaussures/enfant/Gucci-Enfant-Blanc/Gucci - Children's sneaker with Interlocking G.jpeg",
        originalCollection: "manual"
      },
      {
        name: "Chaussure Enfant Gucci Toddler Ace Blanc",
        brand: "Gucci",
        model: "Toddler Ace",
        color: "Blanc",
        genre: "enfant",
        category: "chaussure",
        stock: 5,
        price: 175000,
        description: "Chaussure Gucci Toddler Ace en cuir blanc pour tout-petits",
        alt: "Chaussure Gucci Toddler Ace Enfant Blanc",
        tags: ["gucci", "enfant", "blanc", "luxe", "toddler"],
        active: true,
        path: "/chaussures/enfant/Gucci-Enfant-Blanc/Gucci - Toddler Ace sneaker.jpeg",
        originalCollection: "manual"
      },
      {
        name: "Chaussure Enfant Gucci Toddler Interlocking G Blanc",
        brand: "Gucci",
        model: "Toddler Interlocking G",
        color: "Blanc",
        genre: "enfant",
        category: "chaussure",
        stock: 7,
        price: 190000,
        description: "Chaussure Gucci Toddler avec logo Interlocking G pour tout-petits",
        alt: "Chaussure Gucci Toddler Interlocking G Enfant Blanc",
        tags: ["gucci", "enfant", "blanc", "luxe", "toddler", "interlocking"],
        active: true,
        path: "/chaussures/enfant/Gucci-Enfant-Blanc/Gucci - Toddler sneaker with Interlocking G (1).jpeg",
        originalCollection: "manual"
      },
      {
        name: "Chaussure Enfant Gucci Toddler Interlocking G Blanc 2",
        brand: "Gucci",
        model: "Toddler Interlocking G",
        color: "Blanc",
        genre: "enfant",
        category: "chaussure",
        stock: 4,
        price: 185000,
        description: "Chaussure Gucci Toddler avec logo Interlocking G pour tout-petits - Modèle 2",
        alt: "Chaussure Gucci Toddler Interlocking G Enfant Blanc 2",
        tags: ["gucci", "enfant", "blanc", "luxe", "toddler", "interlocking"],
        active: true,
        path: "/chaussures/enfant/Gucci-Enfant-Blanc/Gucci - Toddler sneaker with Interlocking G.jpeg",
        originalCollection: "manual"
      },
      {
        name: "Chaussure Enfant Gucci White Leather Blanc",
        brand: "Gucci",
        model: "White Leather",
        color: "Blanc",
        genre: "enfant",
        category: "chaussure",
        stock: 6,
        price: 195000,
        description: "Chaussure Gucci en cuir blanc pour garçons",
        alt: "Chaussure Gucci White Leather Enfant Blanc",
        tags: ["gucci", "enfant", "blanc", "luxe", "cuir"],
        active: true,
        path: "/chaussures/enfant/Gucci-Enfant-Blanc/Gucci White Leather Sneakers Boys _ SS23.jpeg",
        originalCollection: "manual"
      },
      {
        name: "Chaussure Enfant Gucci Zapatos Niños Blanc",
        brand: "Gucci",
        model: "Zapatos Niños",
        color: "Blanc",
        genre: "enfant",
        category: "chaussure",
        stock: 5,
        price: 170000,
        description: "Chaussure Gucci Zapatos Niños en cuir blanc pour enfants",
        alt: "Chaussure Gucci Zapatos Niños Enfant Blanc",
        tags: ["gucci", "enfant", "blanc", "luxe", "zapatos"],
        active: true,
        path: "/chaussures/enfant/Gucci-Enfant-Blanc/Zapatos niños (1).jpeg",
        originalCollection: "manual"
      },
      {
        name: "Chaussure Enfant Gucci Zapatos Niños Blanc 2",
        brand: "Gucci",
        model: "Zapatos Niños",
        color: "Blanc",
        genre: "enfant",
        category: "chaussure",
        stock: 4,
        price: 165000,
        description: "Chaussure Gucci Zapatos Niños en cuir blanc pour enfants - Modèle 2",
        alt: "Chaussure Gucci Zapatos Niños Enfant Blanc 2",
        tags: ["gucci", "enfant", "blanc", "luxe", "zapatos"],
        active: true,
        path: "/chaussures/enfant/Gucci-Enfant-Blanc/Zapatos niños.jpeg",
        originalCollection: "manual"
      }
    ];
    
    console.log(`\n🔍 ${gucciBlancImages.length} produits Gucci Blanc à ajouter:`);
    console.log('='.repeat(80));
    
    // Ajouter chaque produit
    for (const product of gucciBlancImages) {
      console.log(`\n📦 Ajout: ${product.name}`);
      console.log(`   Chemin: ${product.path}`);
      console.log(`   Prix: ${product.price} GNF`);
      console.log(`   Stock: ${product.stock}`);
      
      // Vérifier si le produit existe déjà
      const existing = await db.collection('catalogue').findOne({
        name: product.name,
        brand: product.brand,
        genre: product.genre
      });
      
      if (existing) {
        console.log(`   ⚠️  Produit déjà existant, ignoré`);
        continue;
      }
      
      // Ajouter le produit
      const result = await db.collection('catalogue').insertOne({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`   ✅ Produit ajouté avec l'ID: ${result.insertedId}`);
    }
    
    // Vérifier le résultat
    const totalEnfants = await db.collection('catalogue').find({category: 'enfant'}).countDocuments();
    const gucciEnfants = await db.collection('catalogue').find({
      category: 'enfant',
      brand: 'Gucci'
    }).countDocuments();
    
    console.log('\n📊 Résumé:');
    console.log(`   Total produits enfant: ${totalEnfants}`);
    console.log(`   Produits Gucci enfant: ${gucciEnfants}`);
    
    // Afficher quelques produits Gucci enfant
    const sampleGucci = await db.collection('catalogue').find({
      category: 'enfant',
      brand: 'Gucci'
    }).limit(3).toArray();
    
    console.log('\n🔍 Exemples de produits Gucci enfant ajoutés:');
    sampleGucci.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ${product.price} GNF`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion fermée');
  }
}

addGucciEnfantBlanc();
