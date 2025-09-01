// Script de debug pour tester le comportement de la section femme
export const debugFemmeBehavior = (allProducts) => {
  console.log('🔍 Debug du comportement femme...');
  
  // Test des produits femme disponibles
  const femmeProducts = allProducts.filter(p => p.subcategory === 'femme');
  console.log('📦 Produits femme disponibles:', femmeProducts.length);
  femmeProducts.forEach(product => {
    console.log(`  - ${product.brand}: ${product.name} (${product.id})`);
  });

  // Test de la fonction findProductForImage
  const testImages = [
    '/chaussures/femme/Zaranoire/Zara Ankle Strap Heels - Noir.jpeg',
    '/chaussures/femme/Minelli/Minelli Escarpins - Noir.jpeg',
    '/chaussures/femme/Mango/Mango Strappy Sandals - Nude.jpeg'
  ];

  const findProductForImage = (imagePath) => {
    const parts = imagePath.split('/');
    const folder = parts[3];
    
    const normalizeBrandFromFolder = (folderName) => {
      const map = {
        'Zaranoire': 'Zara',
        'CritianlouboutinNoire': 'Christian Louboutin',
        'PradaBeige': 'Prada',
        'Minelli': 'Minelli',
        'Mango': 'Mango',
        'Jonak': 'Jonak',
        'Gucci': 'Gucci'
      };
      return map[folderName] || folderName;
    };
    
    const brand = normalizeBrandFromFolder(folder);
    
    // 1. Chercher d'abord une correspondance exacte
    let correspondingProduct = allProducts.find(product => 
      product.subcategory === 'femme' && 
      product.image === imagePath
    );
    
    // 2. Si pas de correspondance exacte, chercher par marque
    if (!correspondingProduct) {
      correspondingProduct = allProducts.find(product => 
        product.subcategory === 'femme' && 
        product.brand === brand
      );
    }
    
    return correspondingProduct;
  };

  console.log('\n🧪 Test de correspondance images → produits :');
  testImages.forEach(imagePath => {
    const product = findProductForImage(imagePath);
    const parts = imagePath.split('/');
    const fileName = parts[4];
    
    if (product) {
      console.log(`✅ ${fileName} → ${product.name} (${product.id})`);
    } else {
      console.log(`❌ ${fileName} → Aucun produit trouvé`);
    }
  });

  console.log('\n🎯 Comportement attendu :');
  console.log('- Si produit trouvé → Navigation vers /product/[ID]');
  console.log('- Si pas de produit → Filtrage par marque');
  
  return {
    femmeProductsCount: femmeProducts.length,
    testResults: testImages.map(imagePath => ({
      image: imagePath.split('/').pop(),
      hasProduct: !!findProductForImage(imagePath),
      product: findProductForImage(imagePath)
    }))
  };
}; 