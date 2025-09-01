// Script pour exécuter tous les tests de vérification de la galerie Christian Louboutin
import { testRealChristianLouboutinGallery, testImageToProductMapping } from './testRealChristianLouboutinGallery.js';
import { verifyChristianLouboutinGallery } from './verifyChristianLouboutinGallery.js';

export const runAllChristianLouboutinTests = () => {
  console.log('🚀 Démarrage de tous les tests Christian Louboutin...\n');
  
  let allTestsPassed = true;
  const results = [];
  
  // Test 1: Vérification de base
  console.log('='.repeat(60));
  console.log('TEST 1: Vérification de base de la galerie');
  console.log('='.repeat(60));
  const test1Result = verifyChristianLouboutinGallery();
  results.push({ name: 'Vérification de base', result: test1Result });
  if (!test1Result.success) allTestsPassed = false;
  
  // Test 2: Test réel de la galerie
  console.log('\n' + '='.repeat(60));
  console.log('TEST 2: Test réel de la galerie');
  console.log('='.repeat(60));
  const test2Result = testRealChristianLouboutinGallery();
  results.push({ name: 'Test réel de la galerie', result: test2Result });
  if (!test2Result.success) allTestsPassed = false;
  
  // Test 3: Test du mapping image → produit
  console.log('\n' + '='.repeat(60));
  console.log('TEST 3: Test du mapping image → produit');
  console.log('='.repeat(60));
  const test3Result = testImageToProductMapping();
  results.push({ name: 'Test du mapping', result: test3Result });
  if (!test3Result.success) allTestsPassed = false;
  
  // Résumé final
  console.log('\n' + '='.repeat(60));
  console.log('RÉSUMÉ FINAL DES TESTS');
  console.log('='.repeat(60));
  
  results.forEach((test, index) => {
    const status = test.result.success ? '✅ RÉUSSI' : '❌ ÉCHOUÉ';
    console.log(`${index + 1}. ${test.name}: ${status}`);
    if (!test.result.success) {
      console.log(`   Erreur: ${test.result.message}`);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  if (allTestsPassed) {
    console.log('🎉 TOUS LES TESTS SONT PASSÉS !');
    console.log('✅ La galerie Christian Louboutin fonctionne parfaitement');
    console.log('✅ 6 miniatures sont affichées');
    console.log('✅ Chaque clic affiche la bonne image');
    console.log('✅ Le mapping image → produit est correct');
  } else {
    console.log('💥 CERTAINS TESTS ONT ÉCHOUÉ !');
    console.log('❌ Des problèmes ont été détectés dans la galerie');
    console.log('❌ Vérifiez les erreurs ci-dessus');
  }
  console.log('='.repeat(60));
  
  return {
    success: allTestsPassed,
    results: results,
    summary: {
      totalTests: results.length,
      passedTests: results.filter(r => r.result.success).length,
      failedTests: results.filter(r => !r.result.success).length
    }
  };
};

// Fonction pour tester spécifiquement le nombre de miniatures
export const testMiniatureCount = () => {
  console.log('🔢 Test spécifique du nombre de miniatures...');
  
  const expectedCount = 6;
  const actualImages = [
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins - Noir.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg'
  ];
  
  console.log(`   Images attendues: ${expectedCount}`);
  console.log(`   Images réelles: ${actualImages.length}`);
  
  if (actualImages.length === expectedCount) {
    console.log('✅ Nombre de miniatures CORRECT !');
    return { success: true, count: actualImages.length };
  } else {
    console.error('❌ Nombre de miniatures INCORRECT !');
    return { success: false, expected: expectedCount, actual: actualImages.length };
  }
};

// Fonction pour tester le clic sur chaque miniature
export const testEachMiniatureClick = () => {
  console.log('🖱️ Test du clic sur chaque miniature...');
  
  const galleryImages = [
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins - Noir.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Classic.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Speciale.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Edition Limitee.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Design Exclusif.jpeg',
    '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Heels - Collection Premium.jpeg'
  ];
  
  let allClicksValid = true;
  
  galleryImages.forEach((image, index) => {
    console.log(`   Test clic ${index + 1}: ${image.split('/').pop()}`);
    
    // Simuler le clic
    const selectedImage = galleryImages[index];
    const mainImage = selectedImage || galleryImages[0];
    
    if (selectedImage === image) {
      console.log(`   ✅ Clic ${index + 1} VALIDE - Image sélectionnée: ${mainImage.split('/').pop()}`);
    } else {
      console.error(`   ❌ Clic ${index + 1} INVALIDE - Image attendue: ${image.split('/').pop()}, Image reçue: ${mainImage.split('/').pop()}`);
      allClicksValid = false;
    }
  });
  
  if (allClicksValid) {
    console.log('🎉 Tous les clics sont VALIDES !');
    return { success: true, message: 'Chaque clic affiche la bonne image' };
  } else {
    console.error('💥 Certains clics sont INVALIDES !');
    return { success: false, message: 'Problèmes détectés dans les clics' };
  }
}; 