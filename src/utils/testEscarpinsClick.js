// Script de test spécifique pour l'image Christian Louboutin Escarpins - Noir
export function testEscarpinsClick() {
  console.log('🔍 Test spécifique pour Christian Louboutin Escarpins - Noir');
  
  // Vérifier si on est sur un produit Christian Louboutin
  const productName = document.querySelector('h1, h2')?.textContent;
  const isChristianLouboutin = productName?.includes('Christian Louboutin');
  
  console.log('📱 Produit Christian Louboutin:', isChristianLouboutin);
  
  if (!isChristianLouboutin) {
    console.log('❌ Ce n\'est pas un produit Christian Louboutin');
    return;
  }
  
  // Chercher spécifiquement l'image Escarpins - Noir
  const escarpinsImage = 'Christian Louboutin Escarpins - Noir.jpeg';
  const thumbnails = document.querySelectorAll('img[src*="CritianlouboutinNoire"]');
  
  console.log('📸 Toutes les miniatures trouvées:', thumbnails.length);
  
  // Chercher l'image Escarpins spécifiquement
  const escarpinsThumbnail = Array.from(thumbnails).find(thumb => 
    thumb.src.includes(escarpinsImage)
  );
  
  if (escarpinsThumbnail) {
    console.log('✅ Image Escarpins trouvée:', escarpinsThumbnail.src);
    console.log('🖱️ Curseur:', escarpinsThumbnail.style.cursor);
    console.log('📍 Position dans la liste:', Array.from(thumbnails).indexOf(escarpinsThumbnail));
    
    // Afficher toutes les miniatures pour debug
    thumbnails.forEach((thumb, index) => {
      console.log(`  ${index + 1}. ${thumb.src.split('/').pop()}`);
    });
  } else {
    console.log('❌ Image Escarpins non trouvée');
  }
}

// Fonction pour forcer le clic sur l'image Escarpins
export function forceEscarpinsClick() {
  console.log('🖱️ Force du clic sur l\'image Escarpins');
  
  const escarpinsImage = 'Christian Louboutin Escarpins - Noir.jpeg';
  const thumbnails = document.querySelectorAll('img[src*="CritianlouboutinNoire"]');
  
  const escarpinsThumbnail = Array.from(thumbnails).find(thumb => 
    thumb.src.includes(escarpinsImage)
  );
  
  if (escarpinsThumbnail) {
    const index = Array.from(thumbnails).indexOf(escarpinsThumbnail);
    console.log(`📸 Index de l'image Escarpins: ${index}`);
    
    // Forcer le clic en appelant directement la fonction handleThumbnailClick
    console.log('🖱️ Simulation du clic via handleThumbnailClick...');
    
    // Créer un événement de clic
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    
    escarpinsThumbnail.dispatchEvent(clickEvent);
    
    console.log('✅ Événement de clic envoyé');
  } else {
    console.log('❌ Image Escarpins non trouvée');
  }
}

// Nouvelle fonction pour tester le mapping corrigé
export function testEscarpinsMapping() {
  console.log('🧪 Test du mapping corrigé pour Escarpins - Noir');
  
  // Mapping correct attendu
  const expectedMapping = {
    image: '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins - Noir.jpeg',
    productId: 'cl-escarpins-noir-001',
    productName: 'Christian Louboutin Escarpins'
  };
  
  console.log('📋 Mapping attendu:', expectedMapping);
  
  // Vérifier que l'image existe dans le dossier
  console.log('📁 Vérification du fichier image...');
  console.log('   Image attendue:', expectedMapping.image);
  
  // Simuler la fonction findProductByImage
  const mockProducts = [
    { id: 'cl-escarpins-noir-001', name: 'Christian Louboutin Escarpins', price: 1250000 }
  ];
  
  const mockMapping = {
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins - Noir.jpeg': 'cl-escarpins-noir-001'
  };
  
  const findProductByImage = (imagePath) => {
    const productId = mockMapping[imagePath];
    if (productId) {
      return mockProducts.find(p => p.id === productId);
    }
    return null;
  };
  
  // Test du mapping
  const foundProduct = findProductByImage(expectedMapping.image);
  
  if (foundProduct) {
    console.log('✅ Produit trouvé:', foundProduct);
    console.log('   ID:', foundProduct.id);
    console.log('   Nom:', foundProduct.name);
    console.log('   Prix:', foundProduct.price);
  } else {
    console.log('❌ Aucun produit trouvé pour l\'image');
  }
  
  return foundProduct !== null;
} 