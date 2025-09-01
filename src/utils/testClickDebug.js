// Script de test pour vérifier les clics sur les miniatures Christian Louboutin
export function testClickDebug() {
  console.log('🧪 Test de débogage des clics sur miniatures Christian Louboutin');
  
  // Vérifier que la page est bien chargée
  const productDetail = document.querySelector('[data-testid="product-detail"]') || document.querySelector('.product-detail');
  if (!productDetail) {
    console.log('❌ Page de détail produit non trouvée');
    return;
  }
  
  // Vérifier la présence des miniatures
  const thumbnails = document.querySelectorAll('.thumbnail-image, .product-thumbnail, img[src*="CritianlouboutinNoire"]');
  console.log('📸 Miniatures trouvées:', thumbnails.length);
  
  if (thumbnails.length === 0) {
    console.log('❌ Aucune miniature trouvée');
    return;
  }
  
  // Liste des images Christian Louboutin attendues
  const expectedImages = [
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins - Noir.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg'
  ];
  
  console.log('📋 Images attendues:', expectedImages.length);
  
  // Vérifier chaque image attendue
  expectedImages.forEach((expectedImage, index) => {
    const found = Array.from(thumbnails).some(thumb => thumb.src.includes(expectedImage.split('/').pop()));
    console.log(`📸 Image ${index + 1}: ${found ? '✅' : '❌'} ${expectedImage.split('/').pop()}`);
  });
  
  // Vérifier que les miniatures sont cliquables
  thumbnails.forEach((thumbnail, index) => {
    console.log(`📸 Miniature ${index + 1}:`, thumbnail.src.split('/').pop());
    
    // Vérifier si l'élément a un gestionnaire de clic
    const hasClickHandler = thumbnail.onclick || thumbnail.getAttribute('onclick');
    const hasParentClickHandler = thumbnail.parentElement?.onclick || thumbnail.parentElement?.getAttribute('onclick');
    const isClickable = hasClickHandler || hasParentClickHandler || thumbnail.style.cursor === 'pointer';
    
    console.log(`🖱️ Cliquable: ${isClickable ? '✅' : '❌'}`);
  });
  
  console.log('✅ Test terminé');
}

// Fonction pour simuler un clic sur une miniature
export function simulateClick(thumbnailIndex = 0) {
  console.log(`🖱️ Simulation de clic sur la miniature ${thumbnailIndex}`);
  
  const thumbnails = document.querySelectorAll('.thumbnail-image, .product-thumbnail, img[src*="CritianlouboutinNoire"]');
  
  if (thumbnailIndex >= thumbnails.length) {
    console.log('❌ Index de miniature invalide');
    return;
  }
  
  const thumbnail = thumbnails[thumbnailIndex];
  console.log('📸 Clic sur:', thumbnail.src.split('/').pop());
  
  // Simuler le clic
  thumbnail.click();
  
  // Vérifier le changement après un délai
  setTimeout(() => {
    const mainImage = document.querySelector('.main-product-image, .product-main-image, img[src*="CritianlouboutinNoire"]');
    if (mainImage) {
      console.log('🖼️ Image principale après clic:', mainImage.src.split('/').pop());
    }
  }, 100);
}

// Fonction pour tester toutes les miniatures une par une
export function testAllThumbnails() {
  console.log('🧪 Test de toutes les miniatures Christian Louboutin');
  
  const thumbnails = document.querySelectorAll('.thumbnail-image, .product-thumbnail, img[src*="CritianlouboutinNoire"]');
  
  if (thumbnails.length === 0) {
    console.log('❌ Aucune miniature trouvée');
    return;
  }
  
  console.log(`📸 Test de ${thumbnails.length} miniatures`);
  
  // Tester chaque miniature
  thumbnails.forEach((thumbnail, index) => {
    setTimeout(() => {
      console.log(`\n🖱️ Test de la miniature ${index + 1}: ${thumbnail.src.split('/').pop()}`);
      
      // État avant le clic
      const beforeState = {
        mainImage: document.querySelector('.main-product-image, .product-main-image, img[src*="CritianlouboutinNoire"]')?.src,
        productName: document.querySelector('h1, h2')?.textContent,
        price: document.querySelector('.text-danger, .price')?.textContent
      };
      
      console.log('📸 Avant clic:', {
        mainImage: beforeState.mainImage?.split('/').pop(),
        productName: beforeState.productName,
        price: beforeState.price
      });
      
      // Simuler le clic
      thumbnail.click();
      
      // Vérifier après le clic
      setTimeout(() => {
        const afterState = {
          mainImage: document.querySelector('.main-product-image, .product-main-image, img[src*="CritianlouboutinNoire"]')?.src,
          productName: document.querySelector('h1, h2')?.textContent,
          price: document.querySelector('.text-danger, .price')?.textContent
        };
        
        console.log('📸 Après clic:', {
          mainImage: afterState.mainImage?.split('/').pop(),
          productName: afterState.productName,
          price: afterState.price
        });
        
        const changed = beforeState.mainImage !== afterState.mainImage || 
                       beforeState.productName !== afterState.productName ||
                       beforeState.price !== afterState.price;
        
        console.log(`🔄 Changement détecté: ${changed ? '✅ OUI' : '❌ NON'}`);
        
        if (!changed) {
          console.log('⚠️ Cette miniature pourrait ne pas être cliquable !');
        }
      }, 200);
    }, index * 500); // Délai entre chaque test
  });
} 