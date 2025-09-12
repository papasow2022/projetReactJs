// Script de test pour vérifier les shopSettings
export const createTestShopSettings = () => {
  // Créer des images base64 de test (petites images colorées)
  const testLogo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwN2JmZiIvPgo8dGV4dCB4PSIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MPC90ZXh0Pgo8L3N2Zz4K';
  
  const testBanner = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMDdiZmYiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDA1NmIzIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHRleHQgeD0iMjAwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CQU5OSUVSRSBURVNUDC90ZXh0Pgo8L3N2Zz4K';

  return {
    displayName: 'cool_aide',
    description: 'Bienvenue dans ma boutique. We specialize in a wide range of items, from home goods to personal care, ensuring that there\'s something for everyone. Our commitment is to deliver value and satisfaction with every purchase.',
    shopEmail: 'sowdian57@gmail.com',
    phone: '611819930',
    address: 'Labé',
    logoImage: testLogo,
    bannerImage: testBanner
  };
};

// Fonction pour appliquer les shopSettings de test à un vendeur
export const applyTestShopSettings = (vendorId) => {
  try {
    const vendors = JSON.parse(localStorage.getItem('vendors') || '{}');
    if (vendors[vendorId]) {
      vendors[vendorId].shopSettings = createTestShopSettings();
      localStorage.setItem('vendors', JSON.stringify(vendors));
      console.log('Test shopSettings appliqués au vendeur:', vendorId);
      return true;
    } else {
      console.log('Vendeur non trouvé:', vendorId);
      return false;
    }
  } catch (error) {
    console.error('Erreur lors de l\'application des test shopSettings:', error);
    return false;
  }
};