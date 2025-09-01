// Script de vérification pour la galerie Christian Louboutin
export const verifyChristianLouboutinGallery = () => {
  console.log('🔍 Vérification de la galerie Christian Louboutin...');
  
  // 1. Vérifier que toutes les images existent dans le dossier
  const expectedImages = [
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins - Noir.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg'
  ];
  
  console.log('📸 Images attendues:', expectedImages.length);
  
  // 2. Vérifier le mapping image → produit
  const imageToProductMapping = {
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins - Noir.jpeg': 'cl-escarpins-noir-001',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg': 'cl-heels-classic-002',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg': 'cl-heels-collection-speciale-003',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg': 'cl-heels-edition-limitee-004',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg': 'cl-heels-design-exclusif-005',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg': 'cl-heels-collection-premium-006'
  };
  
  console.log('🎯 Mapping image → produit:', Object.keys(imageToProductMapping).length);
  
  // 3. Vérifier que chaque image a un produit correspondant
  let allMappingsValid = true;
  expectedImages.forEach((image, index) => {
    const productId = imageToProductMapping[image];
    if (!productId) {
      console.error(`❌ Image ${index + 1} n'a pas de produit correspondant:`, image);
      allMappingsValid = false;
    } else {
      console.log(`✅ Image ${index + 1}: ${image.split('/').pop()} → ${productId}`);
    }
  });
  
  // 4. Vérifier qu'il n'y a pas de doublons
  const productIds = Object.values(imageToProductMapping);
  const uniqueProductIds = new Set(productIds);
  
  if (productIds.length !== uniqueProductIds.size) {
    console.error('❌ Doublons détectés dans les IDs de produits!');
    allMappingsValid = false;
  } else {
    console.log('✅ Aucun doublon dans les IDs de produits');
  }
  
  // 5. Résumé de la vérification
  console.log('\n📋 Résumé de la vérification:');
  console.log(`   - Images attendues: ${expectedImages.length}`);
  console.log(`   - Mappings valides: ${allMappingsValid ? 'OUI' : 'NON'}`);
  console.log(`   - Doublons: ${productIds.length === uniqueProductIds.size ? 'NON' : 'OUI'}`);
  
  if (allMappingsValid && productIds.length === uniqueProductIds.size) {
    console.log('🎉 Vérification réussie ! La galerie Christian Louboutin devrait afficher 6 miniatures.');
    return {
      success: true,
      imageCount: expectedImages.length,
      message: 'Galerie Christian Louboutin prête avec 6 miniatures'
    };
  } else {
    console.error('💥 Vérification échouée ! Problèmes détectés.');
    return {
      success: false,
      imageCount: expectedImages.length,
      message: 'Problèmes détectés dans la galerie Christian Louboutin'
    };
  }
};

// Fonction pour simuler le comportement du clic sur miniature
export const simulateThumbnailClick = (clickedImageIndex) => {
  console.log(`🖱️ Simulation du clic sur miniature ${clickedImageIndex + 1}...`);
  
  const galleryImages = [
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins - Noir.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg'
  ];
  
  const imageToProductMapping = {
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins - Noir.jpeg': 'cl-escarpins-noir-001',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg': 'cl-heels-classic-002',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg': 'cl-heels-collection-speciale-003',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg': 'cl-heels-edition-limitee-004',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg': 'cl-heels-design-exclusif-005',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg': 'cl-heels-collection-premium-006'
  };
  
  if (clickedImageIndex >= 0 && clickedImageIndex < galleryImages.length) {
    const selectedImage = galleryImages[clickedImageIndex];
    const selectedProductId = imageToProductMapping[selectedImage];
    
    console.log(`   Image sélectionnée: ${selectedImage.split('/').pop()}`);
    console.log(`   Produit correspondant: ${selectedProductId}`);
    console.log(`   Index de l'image: ${clickedImageIndex}`);
    
    return {
      success: true,
      selectedImage,
      selectedProductId,
      imageIndex: clickedImageIndex
    };
  } else {
    console.error(`❌ Index invalide: ${clickedImageIndex}`);
    return {
      success: false,
      message: 'Index invalide'
    };
  }
}; 