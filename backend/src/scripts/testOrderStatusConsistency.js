/**
 * Script de test pour vérifier la cohérence des statuts de commande
 * entre backend et frontend
 */

import { ORDER_STATUS, STATUS_LABELS, STATUS_COLORS, STATUS_ICONS } from '../constants/orderStatus.js';

console.log('🧪 Test de cohérence des statuts de commande\n');

// Test 1: Vérifier que tous les statuts ont des labels
console.log('📋 Test 1: Vérification des labels');
Object.values(ORDER_STATUS).forEach(status => {
  const label = STATUS_LABELS[status];
  if (!label) {
    console.error(`❌ Statut "${status}" n'a pas de label`);
  } else {
    console.log(`✅ ${status} → ${label}`);
  }
});

// Test 2: Vérifier que tous les statuts ont des couleurs
console.log('\n🎨 Test 2: Vérification des couleurs');
Object.values(ORDER_STATUS).forEach(status => {
  const color = STATUS_COLORS[status];
  if (!color) {
    console.error(`❌ Statut "${status}" n'a pas de couleur`);
  } else {
    console.log(`✅ ${status} → ${color}`);
  }
});

// Test 3: Vérifier que tous les statuts ont des icônes
console.log('\n🔍 Test 3: Vérification des icônes');
Object.values(ORDER_STATUS).forEach(status => {
  const icon = STATUS_ICONS[status];
  if (!icon) {
    console.error(`❌ Statut "${status}" n'a pas d'icône`);
  } else {
    console.log(`✅ ${status} → ${icon}`);
  }
});

// Test 4: Vérifier la cohérence avec l'ancien mapping
console.log('\n🔄 Test 4: Comparaison avec l\'ancien mapping');
const oldMapping = {
  'pending': 'en cours',
  'confirmed': 'en cours',
  'preparing': 'en cours',
  'ready': 'en cours',
  'shipped': 'expédiée',
  'delivered': 'livrée',
  'cancelled': 'annulée'
};

Object.entries(oldMapping).forEach(([oldStatus, oldLabel]) => {
  const newLabel = STATUS_LABELS[oldStatus];
  if (newLabel !== oldLabel) {
    console.log(`🔄 ${oldStatus}: "${oldLabel}" → "${newLabel}"`);
  }
});

console.log('\n✅ Tests terminés !');
