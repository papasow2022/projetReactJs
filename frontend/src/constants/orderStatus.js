/**
 * Constantes centralisées pour les statuts de commande - Frontend
 * Ce fichier assure la cohérence avec le backend
 */

// Statuts en anglais (correspondent au backend)
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  READY: 'ready',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
  REFUNDED: 'refunded'
};

// Labels en français (pour l'affichage)
export const STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'En attente',
  [ORDER_STATUS.CONFIRMED]: 'Confirmée',
  [ORDER_STATUS.PROCESSING]: 'En préparation',
  [ORDER_STATUS.READY]: 'Prête',
  [ORDER_STATUS.SHIPPED]: 'Expédiée',
  [ORDER_STATUS.DELIVERED]: 'Livrée',
  [ORDER_STATUS.CANCELLED]: 'Annulée',
  [ORDER_STATUS.RETURNED]: 'Retournée',
  [ORDER_STATUS.REFUNDED]: 'Remboursée'
};

// Couleurs Bootstrap pour l'affichage
export const STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.CONFIRMED]: 'info',
  [ORDER_STATUS.PROCESSING]: 'primary',
  [ORDER_STATUS.READY]: 'info',
  [ORDER_STATUS.SHIPPED]: 'primary',
  [ORDER_STATUS.DELIVERED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'danger',
  [ORDER_STATUS.RETURNED]: 'danger',
  [ORDER_STATUS.REFUNDED]: 'info'
};

// Icônes Bootstrap Icons
export const STATUS_ICONS = {
  [ORDER_STATUS.PENDING]: 'bi-clock',
  [ORDER_STATUS.CONFIRMED]: 'bi-check-circle',
  [ORDER_STATUS.PROCESSING]: 'bi-gear',
  [ORDER_STATUS.READY]: 'bi-box-seam',
  [ORDER_STATUS.SHIPPED]: 'bi-truck',
  [ORDER_STATUS.DELIVERED]: 'bi-check-circle-fill',
  [ORDER_STATUS.CANCELLED]: 'bi-x-circle',
  [ORDER_STATUS.RETURNED]: 'bi-arrow-return-left',
  [ORDER_STATUS.REFUNDED]: 'bi-cash-coin'
};

// Fonction utilitaire pour obtenir le label d'un statut
export const getStatusLabel = (status) => {
  return STATUS_LABELS[status] || status;
};

// Fonction utilitaire pour obtenir la couleur d'un statut
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'secondary';
};

// Fonction utilitaire pour obtenir l'icône d'un statut
export const getStatusIcon = (status) => {
  return STATUS_ICONS[status] || 'bi-question-circle';
};

// Fonction utilitaire pour vérifier si un statut est final
export const isFinalStatus = (status) => {
  return [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED].includes(status);
};

// Fonction utilitaire pour vérifier si un statut permet les retours
export const allowsReturns = (status) => {
  return [ORDER_STATUS.DELIVERED].includes(status);
};
