// Script de test pour vérifier la correspondance entre images femme et produits
export const testFemmeProductsCorrespondence = (allProducts) => {
  console.log('🔍 Test de correspondance des produits femme...');
  
  // Images disponibles pour femme
  const femmeImagePaths = [
    '/chaussures/femme/Zaranoire/Zara Ankle Strap Heels - Noir.jpeg',
    '/chaussures/femme/Zaranoire/Zara Classic Heels - Noir.jpeg',
    '/chaussures/femme/Minelli/Minelli Escarpins - Noir.jpeg',
    '/chaussures/femme/Minelli/Minelli Tulin Bottines Talon - Noir.jpeg',
    '/chaussures/femme/Mango/Mango Strappy Sandals - Nude.jpeg',
    '/chaussures/femme/Jonak/Jonak Bottines Western Cuir Basama - Marron.jpeg',
    '/chaussures/femme/PradaBeige/Prada Leather Platform Sandals - Beige.jpeg',
    '/chaussures/femme/Gucci/Gucci Leather Sandals - Noir.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Noir.jpeg'
  ];

  // Fonction de test
  const findProductForImage = (imagePath) => {
    const parts = imagePath.split('/');
    const folder = parts[3];
    const fileName = parts[4];
    
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

  // Tester chaque image
  const results = femmeImagePaths.map(imagePath => {
    const product = findProductForImage(imagePath);
    const parts = imagePath.split('/');
    const folder = parts[3];
    const fileName = parts[4];
    
    return {
      image: fileName,
      folder: folder,
      hasProduct: !!product,
      productName: product ? product.name : 'Aucun produit trouvé',
      productId: product ? product.id : null
    };
  });

  // Afficher les résultats
  console.log('📊 Résultats de la correspondance :');
  results.forEach(result => {
    const status = result.hasProduct ? '✅' : '❌';
    console.log(`${status} ${result.image} → ${result.productName}`);
  });

  const totalImages = results.length;
  const matchedImages = results.filter(r => r.hasProduct).length;
  const matchRate = ((matchedImages / totalImages) * 100).toFixed(1);

  console.log(`\n📈 Statistiques :`);
  console.log(`- Images testées : ${totalImages}`);
  console.log(`- Images avec produit : ${matchedImages}`);
  console.log(`- Taux de correspondance : ${matchRate}%`);

  return results;
}; 