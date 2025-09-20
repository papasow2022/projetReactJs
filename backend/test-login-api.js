import fetch from 'node-fetch';

async function testLoginAPI() {
  try {
    console.log('🧪 Test de l\'API de connexion...');
    
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@papasow.com',
        password: 'admin123'
      })
    });

    console.log('📊 Status:', response.status);
    console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.text();
    console.log('📊 Response:', data);

    if (response.ok) {
      const jsonData = JSON.parse(data);
      console.log('✅ Connexion réussie:', {
        success: jsonData.success,
        user: jsonData.user ? {
          email: jsonData.user.email,
          isAdmin: jsonData.user.isAdmin,
          roles: jsonData.user.roles
        } : null
      });
    } else {
      console.log('❌ Erreur API:', response.status, response.statusText);
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testLoginAPI();

