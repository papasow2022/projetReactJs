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

export function createGiftCard({ amount, message, sender, recipient, currency = 'EUR' }) {
  const code = generateGiftCardCode();
  const newCard = {
    code,
    amount: Number(amount) || 0,
    balance: Number(amount) || 0,
    currency: currency,
    message: message || '',
    sender: sender || '',
    recipient: recipient || '',
    createdAt: new Date().toISOString(),
    redeemed: false
  };
  const cards = getGiftCards();
  cards.push(newCard);
  saveGiftCards(cards);
  return newCard;
}

export function redeemGiftCard(code, totalAmount) {
  const cards = getGiftCards();
  const idx = cards.findIndex(c => c.code === code);
  if (idx === -1) return { ok: false, reason: 'NOT_FOUND' };
  const card = cards[idx];
  
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
  card.balance -= totalAmount;
  
  if (card.balance <= 0.01) {
    card.balance = 0;
    card.redeemed = true;
  }
  
  cards[idx] = card;
  saveGiftCards(cards);
  return { 
    ok: true, 
    used: totalAmount, 
    remaining: card.balance,
    cardCurrency: card.currency
  };
}