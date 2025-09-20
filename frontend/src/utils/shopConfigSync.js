/**
 * Utilitaires pour synchroniser les données de configuration de boutique
 * entre le système VendorContext (shopSettings) et localStorage (vendorStores)
 */

/**
 * Synchronise les données de configuration de boutique
 * @param {string} vendorId - ID du vendeur
 * @param {object} shopSettings - Paramètres depuis VendorContext
 * @param {object} vendorStores - Paramètres depuis localStorage
 * @returns {object} - Données synchronisées
 */
export const syncShopConfig = (vendorId, shopSettings = {}, vendorStores = {}) => {
  try {
    // Récupérer la configuration depuis localStorage
    const stores = JSON.parse(localStorage.getItem('vendorStores') || '{}');
    const storeConfig = stores[vendorId] || {};
    
    // Priorité : shopSettings (VendorContext) puis localStorage (VendeurBoutique)
    const syncedConfig = {
      // Informations de base
      displayName: shopSettings.displayName || storeConfig.displayName || '',
      description: shopSettings.description || storeConfig.description || '',
      
      // Images
      logoImage: shopSettings.logoImage || storeConfig.logo || null,
      bannerImage: shopSettings.bannerImage || storeConfig.banner || null,
      
      // Contact
      shopEmail: shopSettings.shopEmail || storeConfig.storeContact?.email || '',
      phone: shopSettings.phone || storeConfig.storeContact?.phone || '',
      address: shopSettings.address || storeConfig.storeContact?.address || '',
      
      // Politique de retour
      returnPolicy: shopSettings.returnPolicy || storeConfig.returnPolicy || '',
      
      // Thème (depuis localStorage uniquement)
      theme: storeConfig.theme || { accent: '#ff9900', fond: '#f6f7fa', bouton: '#ffd814' }
    };
    
    return syncedConfig;
  } catch (error) {
    console.error('Erreur lors de la synchronisation des données de boutique:', error);
    return shopSettings;
  }
};

/**
 * Vérifie si une boutique est correctement configurée
 * @param {string} vendorId - ID du vendeur
 * @param {object} shopSettings - Paramètres depuis VendorContext
 * @returns {boolean} - True si la boutique est configurée
 */
export const isShopConfigured = (vendorId, shopSettings = {}) => {
  // Vérifier d'abord dans shopSettings (VendorContext)
  if (shopSettings.displayName && shopSettings.description) {
    return true;
  }
  
  // Vérifier ensuite dans localStorage (VendeurBoutique)
  try {
    const stores = JSON.parse(localStorage.getItem('vendorStores') || '{}');
    const storeConfig = stores[vendorId];
    return storeConfig && 
           storeConfig.created && 
           storeConfig.displayName && 
           storeConfig.description;
  } catch {
    return false;
  }
};

/**
 * Sauvegarde les données de configuration dans les deux systèmes
 * @param {string} vendorId - ID du vendeur
 * @param {object} configData - Données de configuration
 * @param {function} updateVendor - Fonction pour mettre à jour VendorContext
 */
export const saveShopConfig = async (vendorId, configData, updateVendor) => {
  try {
    // Sauvegarder dans VendorContext (shopSettings)
    const shopSettings = {
      displayName: configData.displayName,
      description: configData.description,
      logoImage: configData.logoImage,
      bannerImage: configData.bannerImage,
      shopEmail: configData.shopEmail,
      phone: configData.phone,
      address: configData.address,
      returnPolicy: configData.returnPolicy
    };
    
    if (updateVendor) {
      await updateVendor(vendorId, { shopSettings });
    }
    
    // Sauvegarder dans localStorage (vendorStores)
    const stores = JSON.parse(localStorage.getItem('vendorStores') || '{}');
    stores[vendorId] = {
      created: true,
      displayName: configData.displayName,
      description: configData.description,
      logo: configData.logoImage,
      banner: configData.bannerImage,
      storeContact: {
        email: configData.shopEmail,
        phone: configData.phone,
        address: configData.address
      },
      returnPolicy: configData.returnPolicy,
      theme: configData.theme || { accent: '#ff9900', fond: '#f6f7fa', bouton: '#ffd814' }
    };
    
    localStorage.setItem('vendorStores', JSON.stringify(stores));
    
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la configuration:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Récupère toutes les données de configuration d'une boutique
 * @param {string} vendorId - ID du vendeur
 * @param {object} shopSettings - Paramètres depuis VendorContext
 * @returns {object} - Toutes les données de configuration
 */
export const getShopConfig = (vendorId, shopSettings = {}) => {
  return syncShopConfig(vendorId, shopSettings);
};