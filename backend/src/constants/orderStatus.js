/**
 * Constantes centralisées pour les statuts de commande
 * Ce fichier assure la cohérence entre backend et frontend
 */

// Statuts en anglais (pour la base de données et l'API)
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

// Ordre des statuts (pour l'affichage chronologique)
export const STATUS_ORDER = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.READY,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED
];

// Statuts qui permettent la transition vers le suivant
export const STATUS_TRANSITIONS = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.READY, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.READY]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.RETURNED],
  [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.RETURNED, ORDER_STATUS.REFUNDED],
  [ORDER_STATUS.RETURNED]: [ORDER_STATUS.REFUNDED],
  [ORDER_STATUS.REFUNDED]: [],
  [ORDER_STATUS.CANCELLED]: []
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

// Fonction utilitaire pour vérifier si une transition est valide
export const isValidTransition = (fromStatus, toStatus) => {
  return STATUS_TRANSITIONS[fromStatus]?.includes(toStatus) || false;
};

// Fonction utilitaire pour obtenir les statuts suivants possibles
export const getNextPossibleStatuses = (currentStatus) => {
  return STATUS_TRANSITIONS[currentStatus] || [];
};
