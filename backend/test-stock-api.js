import fetch from 'node-fetch';

async function testStockAPI() {
  try {
    console.log('🧪 Test de l\'API stock/check...');
    
    const response = await fetch('http://localhost:4000/api/stock/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: 'homme-random',
        category: 'homme',
        quantity: 1
      })
    });
    
    console.log('📊 Status:', response.status);
    console.log('📊 Headers:', response.headers);
    
    const data = await response.text();
    console.log('📊 Response:', data);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testStockAPI();
