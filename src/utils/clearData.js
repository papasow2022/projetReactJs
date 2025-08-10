// Fonction pour nettoyer toutes les données du localStorage
export const clearAllData = () => {
  const keysToDelete = [];
  
  // Parcourir toutes les clés du localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.startsWith('commandes_') || 
      key.startsWith('retours_') || 
      key.startsWith('echanges_') || 
      key.startsWith('notifications_')
    )) {
      keysToDelete.push(key);
      localStorage.removeItem(key);
    }
  }
  
  console.log(`🧹 Nettoyage terminé: ${keysToDelete.length} clés supprimées`);
  return keysToDelete;
};

// Fonction pour nettoyer seulement les commandes
export const clearCommandes = () => {
  const keysToDelete = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('commandes_')) {
      keysToDelete.push(key);
      localStorage.removeItem(key);
    }
  }
  
  console.log(`📦 Commandes supprimées: ${keysToDelete.length} clés`);
  return keysToDelete;
};

// Fonction pour nettoyer retours et échanges
export const clearRetoursEchanges = () => {
  const keysToDelete = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('retours_') || key.startsWith('echanges_'))) {
      keysToDelete.push(key);
      localStorage.removeItem(key);
    }
  }
  
  console.log(`🔄 Retours/échanges supprimés: ${keysToDelete.length} clés`);
  return keysToDelete;
}; 