// Utilitaire de débogage pour les statistiques
export const debugStats = (stats, componentName = 'Unknown') => {
  console.group(`🔍 Debug Stats - ${componentName}`);
  console.log('Stats complètes:', stats);
  console.log('Type de stats:', typeof stats);
  console.log('Stats est un objet:', stats && typeof stats === 'object');
  
  if (stats && typeof stats === 'object') {
    console.log('Propriétés disponibles:', Object.keys(stats));
    console.log('activeDeals:', stats.activeDeals);
    console.log('totalDeals:', stats.totalDeals);
    console.log('expiredDeals:', stats.expiredDeals);
    console.log('avgReduction:', stats.avgReduction);
    console.log('lowStockDeals:', stats.lowStockDeals);
  }
  
  console.groupEnd();
};

export const debugDailyDeals = (deals, componentName = 'Unknown') => {
  console.group(`🔍 Debug Daily Deals - ${componentName}`);
  console.log('Nombre total d\'offres:', deals.length);
  console.log('Offres avec réduction:', deals.filter(d => d.reduction > 0).length);
  console.log('Offres actives:', deals.filter(d => d.heuresRestantes > 0).length);
  console.log('Offres expirées:', deals.filter(d => d.heuresRestantes <= 0).length);
  
  if (deals.length > 0) {
    console.log('Première offre:', deals[0]);
    console.log('Exemple de réduction:', deals[0].reduction);
  }
  
  console.groupEnd();
};

export const validateStats = (stats) => {
  const errors = [];
  
  if (!stats) {
    errors.push('Stats est null ou undefined');
    return errors;
  }
  
  if (typeof stats !== 'object') {
    errors.push('Stats n\'est pas un objet');
    return errors;
  }
  
  const requiredFields = ['totalDeals', 'activeDeals', 'expiredDeals', 'avgReduction'];
  
  requiredFields.forEach(field => {
    if (stats[field] === undefined) {
      errors.push(`Champ manquant: ${field}`);
    } else if (typeof stats[field] !== 'number') {
      errors.push(`Champ ${field} n'est pas un nombre: ${typeof stats[field]}`);
    }
  });
  
  return errors;
}; 