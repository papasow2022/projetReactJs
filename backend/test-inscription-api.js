import dotenv from 'dotenv';
import https from 'https';
import http from 'http';

// Charger les variables d'environnement
dotenv.config();

console.log('🧪 Test API d\'inscription - PapasowCool_aide');
console.log('============================================');

const testInscription = () => {
  return new Promise((resolve, reject) => {
    const testUser = {
      email: 'test@example.com',
      password: 'Test123!',
      prenom: 'Test',
      nom: 'User',
      phone: '0123456789',
      birthDate: '1990-01-01',
      gender: 'Homme',
      newsletter: true
    };

    console.log('📤 Données de test:', testUser);
    console.log('🌐 URL API:', 'http://localhost:4000/api/auth/register');
    
    const postData = JSON.stringify(testUser);
    
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      console.log('📊 Status:', res.statusCode);
      console.log('📊 Status Text:', res.statusMessage);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('📋 Réponse:', JSON.stringify(result, null, 2));
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('✅ Test d\'inscription réussi !');
          } else {
            console.log('❌ Test d\'inscription échoué !');
          }
          resolve(result);
        } catch (parseError) {
          console.error('❌ Erreur parsing JSON:', parseError.message);
          console.log('📋 Réponse brute:', data);
          reject(parseError);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Erreur lors du test:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
};

// Lancer le test
testInscription();
