// Script d'initialisation de l'application

// Fonction pour initialiser les données de test des vendeurs
const initializeVendorTestData = () => {
  console.log('📊 Initialisation des données de test des vendeurs...');
  
  // Données de test pour les vendeurs
  const testVendors = {
    'VD-1703123456789': {
      id: 'VD-1703123456789',
      name: 'Boutique Mode Premium',
      email: 'contact@boutiquemode.com',
      phone: '+33 1 23 45 67 89',
      address: '123 Rue de la Mode, 75001 Paris',
      category: 'Mode',
      status: 'active',
      rating: 4.8,
      totalSales: 15420.50,
      createdAt: '2024-01-15T10:30:00Z',
      products: 45,
      orders: 128
    }
  };
  
  // Données de test pour les commandes
  const testOrders = {
    'VD-1703123456789': [
      {
        id: 'ORD-001',
        customerName: 'Marie Dupont',
        products: ['Chaussures Nike Air Max', 'Pantalon Levi\'s'],
        total: 189.99,
        status: 'livrée',
        date: '2024-01-20T14:30:00Z'
      },
      {
        id: 'ORD-002',
        customerName: 'Jean Martin',
        products: ['Veste en cuir'],
        total: 299.99,
        status: 'en cours',
        date: '2024-01-21T09:15:00Z'
      }
    ]
  };
  
  // Données de test pour les statistiques
  const testStats = {
    'VD-1703123456789': {
      totalRevenue: 15420.50,
      totalOrders: 128,
      averageOrderValue: 120.47,
      productsSold: 156,
      customerSatisfaction: 4.8,
      monthlyGrowth: 12.5
    }
  };
  
  // Sauvegarder les données dans localStorage
  localStorage.setItem('vendors', JSON.stringify(testVendors));
  localStorage.setItem('vendorOrders', JSON.stringify(testOrders));
  localStorage.setItem('vendorStats', JSON.stringify(testStats));
  
  console.log('✅ Données de test des vendeurs initialisées');
};

// Fonction d'initialisation principale
export const initializeApp = () => {
  console.log('🚀 Initialisation de l\'application...');
  
  try {
    // Vérifier si les données de test existent déjà
    const existingVendors = localStorage.getItem('vendors');
    const existingOrders = localStorage.getItem('vendorOrders');
    const existingStats = localStorage.getItem('vendorStats');
    const existingNotifications = localStorage.getItem('vendorNotifications');
    
    // Si aucune donnée n'existe, initialiser les données de test
    if (!existingVendors || !existingOrders || !existingStats || !existingNotifications) {
      console.log('📊 Initialisation des données de test...');
      initializeVendorTestData();
      console.log('✅ Données de test initialisées avec succès');
    } else {
      console.log('✅ Données existantes trouvées, pas d\'initialisation nécessaire');
    }
    
    // Initialiser d'autres composants si nécessaire
    initializeNotifications();
    initializeAnalytics();
    
    console.log('🎉 Application initialisée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  }
};

// Initialiser le système de notifications
const initializeNotifications = () => {
  console.log('🔔 Initialisation du système de notifications...');
  
  // Ajouter des notifications de test si aucune n'existe
  const existingNotifications = localStorage.getItem('vendorNotifications');
  if (!existingNotifications) {
    console.log('📝 Ajout de notifications de test...');
    
    const testNotifications = {
      'VD-1703123456789': [
        {
          id: Date.now(),
          type: 'welcome',
          title: 'Bienvenue sur la plateforme !',
          message: 'Votre compte vendeur a été activé avec succès.',
          createdAt: new Date().toISOString(),
          read: false
        }
      ]
    };
    
    localStorage.setItem('vendorNotifications', JSON.stringify(testNotifications));
  }
};

// Initialiser les analytics
const initializeAnalytics = () => {
  console.log('📊 Initialisation des analytics...');
  
  // Configuration des analytics si nécessaire
  const analyticsConfig = {
    enabled: true,
    trackingId: 'vendor-analytics-001',
    features: {
      realTimeTracking: true,
      performanceMonitoring: true,
      userBehavior: true
    }
  };
  
  localStorage.setItem('analyticsConfig', JSON.stringify(analyticsConfig));
};

// Fonction pour vérifier l'état de l'application
export const checkAppStatus = () => {
  console.log('🔍 Vérification de l\'état de l\'application...');
  
  const status = {
    vendors: false,
    orders: false,
    stats: false,
    notifications: false,
    analytics: false
  };
  
  try {
    // Vérifier les données des vendeurs
    const vendors = localStorage.getItem('vendors');
    status.vendors = !!vendors && Object.keys(JSON.parse(vendors || '{}')).length > 0;
    
    // Vérifier les commandes
    const orders = localStorage.getItem('vendorOrders');
    status.orders = !!orders && Object.keys(JSON.parse(orders || '{}')).length > 0;
    
    // Vérifier les statistiques
    const stats = localStorage.getItem('vendorStats');
    status.stats = !!stats && Object.keys(JSON.parse(stats || '{}')).length > 0;
    
    // Vérifier les notifications
    const notifications = localStorage.getItem('vendorNotifications');
    status.notifications = !!notifications && Object.keys(JSON.parse(notifications || '{}')).length > 0;
    
    // Vérifier la configuration analytics
    const analyticsConfig = localStorage.getItem('analyticsConfig');
    status.analytics = !!analyticsConfig;
    
    console.log('📋 État de l\'application:');
    console.log(`   - Vendeurs: ${status.vendors ? '✅' : '❌'}`);
    console.log(`   - Commandes: ${status.orders ? '✅' : '❌'}`);
    console.log(`   - Statistiques: ${status.stats ? '✅' : '❌'}`);
    console.log(`   - Notifications: ${status.notifications ? '✅' : '❌'}`);
    console.log(`   - Analytics: ${status.analytics ? '✅' : '❌'}`);
    
    return status;
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
    return status;
  }
};

// Fonction pour réinitialiser l'application
export const resetApp = () => {
  console.log('🔄 Réinitialisation de l\'application...');
  
  try {
    // Supprimer toutes les données
    localStorage.removeItem('vendors');
    localStorage.removeItem('vendorOrders');
    localStorage.removeItem('vendorStats');
    localStorage.removeItem('vendorNotifications');
    localStorage.removeItem('analyticsConfig');
    
    // Réinitialiser
    initializeApp();
    
    console.log('✅ Application réinitialisée avec succès');
    
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
  }
};

// Fonction pour obtenir des informations sur l'application
export const getAppInfo = () => {
  const info = {
    version: '1.0.0',
    name: 'E-commerce Vendor System',
    description: 'Système de gestion des vendeurs pour plateforme e-commerce',
    features: [
      'Gestion des vendeurs',
      'Gestion des commandes',
      'Analytics et statistiques',
      'Système de notifications',
      'Gestion des produits'
    ],
    status: checkAppStatus()
  };
  
  return info;
};

// Auto-initialisation si le script est chargé directement
if (typeof window !== 'undefined') {
  // Attendre que le DOM soit chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
  
  // Exposer les fonctions globalement pour la console
  window.initializeApp = initializeApp;
  window.checkAppStatus = checkAppStatus;
  window.resetApp = resetApp;
  window.getAppInfo = getAppInfo;
  
  console.log('🧪 Fonctions d\'initialisation disponibles dans la console:');
  console.log('   - initializeApp()');
  console.log('   - checkAppStatus()');
  console.log('   - resetApp()');
  console.log('   - getAppInfo()');
} 