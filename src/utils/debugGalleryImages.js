// Script de débogage pour vérifier les images de la galerie
export function debugGalleryImages() {
  console.log('🔍 Débogage des images de la galerie Christian Louboutin');
  
  // Vérifier si on est sur un produit Christian Louboutin
  const productName = document.querySelector('h1, h2')?.textContent;
  const isChristianLouboutin = productName?.includes('Christian Louboutin');
  
  console.log('📱 Produit Christian Louboutin:', isChristianLouboutin);
  
  if (!isChristianLouboutin) {
    console.log('❌ Ce n\'est pas un produit Christian Louboutin');
    return;
  }
  
  // Vérifier les miniatures affichées
  const thumbnails = document.querySelectorAll('img[src*="CritianlouboutinNoire"]');
  console.log('📸 Miniatures affichées:', thumbnails.length);
  
  thumbnails.forEach((thumb, index) => {
    console.log(`📸 Miniature ${index + 1}: ${thumb.src.split('/').pop()}`);
  });
  
  // Vérifier l'image principale
  const mainImage = document.querySelector('img[src*="CritianlouboutinNoire"]');
  if (mainImage) {
    console.log('🖼️ Image principale:', mainImage.src.split('/').pop());
  }
  
  // Liste des images attendues
  const expectedImages = [
    'Christian Louboutin Escarpins - Noir.jpeg',
    'Christian Louboutin Heels - Classic.jpeg',
    'Christian Louboutin Heels - Collection Speciale.jpeg',
    'Christian Louboutin Heels - Edition Limitee.jpeg',
    'Christian Louboutin Heels - Design Exclusif.jpeg',
    'Christian Louboutin Heels - Collection Premium.jpeg'
  ];
  
  console.log('\n📋 Vérification des images attendues:');
  expectedImages.forEach((expectedImage, index) => {
    const found = Array.from(thumbnails).some(thumb => 
      thumb.src.includes(expectedImage)
    );
    console.log(`📸 Image ${index + 1}: ${found ? '✅' : '❌'} ${expectedImage}`);
  });
  
  // Vérifier les clics
  console.log('\n🖱️ Test de clicabilité:');
  thumbnails.forEach((thumb, index) => {
    const hasClickHandler = thumb.onclick || thumb.getAttribute('onclick');
    const hasParentClickHandler = thumb.parentElement?.onclick || thumb.parentElement?.getAttribute('onclick');
    const isClickable = hasClickHandler || hasParentClickHandler || thumb.style.cursor === 'pointer';
    
    console.log(`📸 Miniature ${index + 1}: ${isClickable ? '✅' : '❌'} Cliquable`);
  });
  
  return {
    thumbnailsCount: thumbnails.length,
    expectedCount: expectedImages.length,
    isChristianLouboutin: isChristianLouboutin
  };
}

// Fonction pour simuler un clic et vérifier le changement
export function testThumbnailClick(thumbnailIndex = 0) {
  console.log(`🖱️ Test de clic sur la miniature ${thumbnailIndex}`);
  
  const thumbnails = document.querySelectorAll('img[src*="CritianlouboutinNoire"]');
  
  if (thumbnailIndex >= thumbnails.length) {
    console.log('❌ Index invalide');
    return;
  }
  
  const thumbnail = thumbnails[thumbnailIndex];
  console.log('📸 Clic sur:', thumbnail.src.split('/').pop());
  
  // État avant le clic
  const beforeState = {
    mainImage: document.querySelector('img[src*="CritianlouboutinNoire"]')?.src,
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
      mainImage: document.querySelector('img[src*="CritianlouboutinNoire"]')?.src,
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
      console.log('⚠️ Cette miniature ne semble pas cliquable !');
    }
  }, 300);
} 