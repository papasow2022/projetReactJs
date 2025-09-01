// Script de test pour vérifier les clics sur les miniatures Christian Louboutin
export function testClickDebug() {
  console.log('🧪 Test de débogage des clics sur miniatures');
  
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
  
  // Vérifier que les miniatures sont cliquables
  thumbnails.forEach((thumbnail, index) => {
    console.log(`📸 Miniature ${index + 1}:`, thumbnail.src);
    
    // Vérifier si l'élément a un gestionnaire de clic
    const hasClickHandler = thumbnail.onclick || thumbnail.getAttribute('onclick');
    console.log(`🖱️ Gestionnaire de clic présent:`, !!hasClickHandler);
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
  console.log('📸 Clic sur:', thumbnail.src);
  
  // Simuler le clic
  thumbnail.click();
  
  // Vérifier le changement après un délai
  setTimeout(() => {
    const mainImage = document.querySelector('.main-product-image, .product-main-image, img[src*="CritianlouboutinNoire"]');
    if (mainImage) {
      console.log('🖼️ Image principale après clic:', mainImage.src);
    }
  }, 100);
} 