export function generateGiftCardCode(length = 16) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  // Format XXXX-XXXX-XXXX-XXXX
  return code.match(/.{1,4}/g).join('-');
}

export function getGiftCards() {
  try {
    const raw = localStorage.getItem('giftCards');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveGiftCards(cards) {
  localStorage.setItem('giftCards', JSON.stringify(cards));
}

export function createGiftCard({ 
  amount, 
  message, 
  sender, 
  recipient, 
  currency = 'EUR',
  expirationYears = 10,
  design = 'default',
  deliveryDate = null,
  videoMessage = null
}) {
  const code = generateGiftCardCode();
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + expirationYears);
  
  const newCard = {
    code,
    amount: Number(amount) || 0,
    balance: Number(amount) || 0,
    currency: currency,
    message: message || '',
    sender: sender || '',
    recipient: recipient || '',
    createdAt: new Date().toISOString(),
    expiresAt: expirationDate.toISOString(),
    redeemed: false,
    design: design,
    deliveryDate: deliveryDate,
    videoMessage: videoMessage,
    personalized: !!(message || videoMessage),
    transactions: [{
      type: 'purchase',
      amount: Number(amount) || 0,
      date: new Date().toISOString(),
      description: 'Carte cadeau créée'
    }],
    rechargeHistory: []
  };
  const cards = getGiftCards();
  cards.push(newCard);
  saveGiftCards(cards);
  return newCard;
}

export function validateGiftCard(card) {
  const now = new Date();
  const expirationDate = new Date(card.expiresAt);
  
  if (card.redeemed) {
    return { valid: false, reason: 'ALREADY_REDEEMED' };
  }
  
  if (now > expirationDate) {
    return { valid: false, reason: 'EXPIRED' };
  }
  
  if (card.balance <= 0) {
    return { valid: false, reason: 'NO_BALANCE' };
  }
  
  return { valid: true };
}

export function redeemGiftCard(code, totalAmount, orderId = null) {
  const cards = getGiftCards();
  const idx = cards.findIndex(c => c.code === code);
  if (idx === -1) return { ok: false, reason: 'NOT_FOUND' };
  
  const card = cards[idx];
  
  // Validation de la carte
  const validation = validateGiftCard(card);
  if (!validation.valid) {
    return { 
      ok: false, 
      reason: validation.reason,
      cardBalance: card.balance,
      requiredAmount: totalAmount
    };
  }
  
  // Vérifier que le solde de la carte couvre le montant total
  if (card.balance < totalAmount) {
    return { 
      ok: false, 
      reason: 'INSUFFICIENT_BALANCE',
      cardBalance: card.balance,
      requiredAmount: totalAmount
    };
  }
  
  // Déduire le montant total du solde de la carte
  const usedAmount = Math.min(card.balance, totalAmount);
  card.balance -= usedAmount;
  
  // Ajouter la transaction à l'historique
  card.transactions.push({
    type: 'redemption',
    amount: usedAmount,
    date: new Date().toISOString(),
    orderId: orderId,
    description: `Utilisation de ${usedAmount.toLocaleString('fr-FR')} ${card.currency}`
  });
  
  if (card.balance <= 0.01) {
    card.balance = 0;
    card.redeemed = true;
  }
  
  cards[idx] = card;
  saveGiftCards(cards);
  return { 
    ok: true, 
    used: usedAmount, 
    remaining: card.balance,
    cardCurrency: card.currency
  };
}

// Fonction pour recharger une carte-cadeau
export function rechargeGiftCard(cardCode, amount, description = 'Recharge de solde') {
  const cards = getGiftCards();
  const card = cards.find(c => c.code === cardCode);
  
  if (!card) {
    return { success: false, reason: 'CARD_NOT_FOUND' };
  }
  
  const validation = validateGiftCard(card);
  if (!validation.valid && validation.reason !== 'NO_BALANCE') {
    return { success: false, reason: validation.reason };
  }
  
  card.balance += Number(amount);
  card.redeemed = false; // Réactiver la carte si elle était marquée comme utilisée
  
  // Ajouter à l'historique de recharge
  card.rechargeHistory.push({
    amount: Number(amount),
    date: new Date().toISOString(),
    description: description
  });
  
  // Ajouter à l'historique des transactions
  card.transactions.push({
    type: 'recharge',
    amount: Number(amount),
    date: new Date().toISOString(),
    description: description
  });
  
  saveGiftCards(cards);
  return { 
    success: true, 
    newBalance: card.balance,
    cardCurrency: card.currency
  };
}

// Fonction pour obtenir l'historique d'une carte
export function getGiftCardHistory(cardCode) {
  const cards = getGiftCards();
  const card = cards.find(c => c.code === cardCode);
  
  if (!card) {
    return { success: false, reason: 'CARD_NOT_FOUND' };
  }
  
  return {
    success: true,
    card: {
      code: card.code,
      amount: card.amount,
      balance: card.balance,
      currency: card.currency,
      createdAt: card.createdAt,
      expiresAt: card.expiresAt,
      redeemed: card.redeemed
    },
    transactions: card.transactions || [],
    rechargeHistory: card.rechargeHistory || []
  };
}

// Fonction pour vérifier le solde d'une carte
export function checkGiftCardBalance(cardCode) {
  const cards = getGiftCards();
  const card = cards.find(c => c.code === cardCode);
  
  if (!card) {
    return { success: false, reason: 'CARD_NOT_FOUND' };
  }
  
  const validation = validateGiftCard(card);
  if (!validation.valid) {
    return { 
      success: false, 
      reason: validation.reason,
      balance: card.balance,
      expiresAt: card.expiresAt
    };
  }
  
  return {
    success: true,
    balance: card.balance,
    currency: card.currency,
    expiresAt: card.expiresAt,
    daysUntilExpiration: Math.ceil((new Date(card.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
  };
}

// Fonction pour obtenir les analytics des cartes-cadeaux
export function getGiftCardAnalytics() {
  const cards = getGiftCards();
  
  const totalIssued = cards.length;
  const totalRedeemed = cards.filter(c => c.redeemed).length;
  const totalAmount = cards.reduce((sum, card) => sum + card.amount, 0);
  const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0);
  const totalUsed = totalAmount - totalBalance;
  
  // Montants les plus populaires
  const amountCounts = {};
  cards.forEach(card => {
    amountCounts[card.amount] = (amountCounts[card.amount] || 0) + 1;
  });
  const mostPopularAmount = Object.keys(amountCounts).reduce((a, b) => 
    amountCounts[a] > amountCounts[b] ? a : b, 0);
  
  return {
    totalIssued,
    totalRedeemed,
    totalAmount,
    totalUsed,
    totalBalance,
    averageValue: totalIssued > 0 ? totalAmount / totalIssued : 0,
    mostPopularAmount: Number(mostPopularAmount),
    redemptionRate: totalIssued > 0 ? (totalRedeemed / totalIssued) * 100 : 0,
    usageRate: totalAmount > 0 ? (totalUsed / totalAmount) * 100 : 0
  };
}

// Fonction pour envoyer une carte-cadeau par email (simulation)
export function sendGiftCardEmail(card, recipientEmail) {
  // Simulation d'envoi d'email
  console.log(`Envoi de la carte-cadeau ${card.code} à ${recipientEmail}`);
  
  // Dans un vrai système, vous feriez un appel API ici
  return {
    success: true,
    message: `Carte-cadeau envoyée à ${recipientEmail}`,
    deliveryMethod: 'email'
  };
}

// Fonction pour programmer l'envoi d'une carte-cadeau
export function scheduleGiftCardDelivery(card, deliveryDate, method = 'email', recipient = null) {
  const scheduledDelivery = {
    cardCode: card.code,
    deliveryDate: new Date(deliveryDate).toISOString(),
    method: method,
    recipient: recipient || card.recipient,
    scheduled: true,
    sent: false
  };
  
  // Stocker la livraison programmée
  const scheduled = JSON.parse(localStorage.getItem('scheduledGiftCards') || '[]');
  scheduled.push(scheduledDelivery);
  localStorage.setItem('scheduledGiftCards', JSON.stringify(scheduled));
  
  return {
    success: true,
    message: `Livraison programmée pour le ${new Date(deliveryDate).toLocaleDateString('fr-FR')}`
  };
}