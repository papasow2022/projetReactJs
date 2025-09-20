/**
 * Script de test pour vérifier la mise à jour en temps réel
 * entre la page admin et la page utilisateur
 */

import { ORDER_STATUS } from '../constants/orderStatus.js';

console.log('🧪 Test de mise à jour en temps réel\n');

console.log('📋 Scénario de test :');
console.log('1. Ouvrir la page /commandes dans un onglet');
console.log('2. Ouvrir la page /admin/orders dans un autre onglet');
console.log('3. Changer le statut d\'une commande depuis l\'admin');
console.log('4. Vérifier que le changement apparaît automatiquement sur /commandes\n');

console.log('⚙️ Configuration du polling :');
console.log('- Page utilisateur (/commandes) : 15 secondes');
console.log('- Page admin (/admin/orders) : 10 secondes\n');

console.log('🔄 Statuts disponibles pour les tests :');
Object.entries(ORDER_STATUS).forEach(([key, value]) => {
  console.log(`- ${key}: ${value}`);
});

console.log('\n✅ Instructions :');
console.log('1. Démarrez le serveur backend : npm start');
console.log('2. Démarrez le serveur frontend : npm run dev');
console.log('3. Connectez-vous en tant qu\'admin');
console.log('4. Allez sur /admin/orders');
console.log('5. Changez le statut d\'une commande');
console.log('6. Allez sur /commandes dans un autre onglet');
console.log('7. Attendez maximum 15 secondes pour voir la mise à jour\n');

console.log('🎯 Résultat attendu :');
console.log('Le statut de la commande doit se mettre à jour automatiquement');
console.log('sur la page /commandes sans rafraîchissement de page !');
