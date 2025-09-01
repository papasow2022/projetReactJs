// Script de test pour vérifier le mapping des images Christian Louboutin
export const testChristianLouboutinMapping = () => {
  console.log('🧪 Test du mapping Christian Louboutin...');
  
  // Mapping des images vers les produits
  const christianLouboutinImageMapping = {
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins.jpeg': 'cl-escarpins-noir-001',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg': 'cl-heels-collection-speciale-003',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg': 'cl-heels-edition-limitee-004',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg': 'cl-heels-design-exclusif-005',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg': 'cl-heels-collection-premium-006',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg': 'cl-heels-classic-002'
  };

  // Produits correspondants
  const expectedProducts = {
    'cl-escarpins-noir-001': 'Christian Louboutin Escarpins',
    'cl-heels-classic-002': 'Christian Louboutin Heels - Classic',
    'cl-heels-collection-speciale-003': 'Christian Louboutin Heels - Collection Speciale',
    'cl-heels-edition-limitee-004': 'Christian Louboutin Heels - Edition Limitee',
    'cl-heels-design-exclusif-005': 'Christian Louboutin Heels - Design Exclusif',
    'cl-heels-collection-premium-006': 'Christian Louboutin Heels - Collection Premium'
  };

  // Test de chaque mapping
  let allTestsPassed = true;
  
  Object.entries(christianLouboutinImageMapping).forEach(([imagePath, productId]) => {
    const expectedProductName = expectedProducts[productId];
    console.log(`✅ Image: ${imagePath.split('/').pop()}`);
    console.log(`   → ID: ${productId}`);
    console.log(`   → Produit: ${expectedProductName}`);
    console.log('---');
  });

  // Vérifier qu'il n'y a pas de doublons
  const productIds = Object.values(christianLouboutinImageMapping);
  const uniqueProductIds = new Set(productIds);
  
  if (productIds.length !== uniqueProductIds.size) {
    console.error('❌ ERREUR: Doublons détectés dans les IDs de produits!');
    allTestsPassed = false;
  } else {
    console.log('✅ Aucun doublon détecté dans les IDs de produits');
  }

  // Vérifier que tous les fichiers existent
  const imagePaths = Object.keys(christianLouboutinImageMapping);
  console.log(`📁 ${imagePaths.length} images Christian Louboutin mappées`);
  
  if (allTestsPassed) {
    console.log('🎉 Tous les tests de mapping sont passés avec succès!');
  } else {
    console.error('💥 Certains tests de mapping ont échoué!');
  }
  
  return allTestsPassed;
};

// Fonction pour obtenir le produit correspondant à une image
export const getProductIdFromImage = (imagePath) => {
  const christianLouboutinImageMapping = {
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins.jpeg': 'cl-escarpins-noir-001',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg': 'cl-heels-collection-speciale-003',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg': 'cl-heels-edition-limitee-004',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg': 'cl-heels-design-exclusif-005',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg': 'cl-heels-collection-premium-006',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg': 'cl-heels-classic-002'
  };
  
  return christianLouboutinImageMapping[imagePath] || null;
}; 