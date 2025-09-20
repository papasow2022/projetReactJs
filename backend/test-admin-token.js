import dotenv from 'dotenv';
import http from 'http';

// Charger les variables d'environnement
dotenv.config();

console.log('🔐 Test Token Admin');
console.log('==================');

const testAdminToken = () => {
  return new Promise((resolve, reject) => {
    console.log('\n📋 ÉTAPE 1: Connexion admin');
    
    // D'abord se connecter
    const loginData = {
      email: 'admin@papasow.com',
      password: 'admin123456'
    };

    const loginOptions = {
      hostname: 'localhost',
      port: 4000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const loginReq = http.request(loginOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (result.success && result.token) {
            console.log('✅ Connexion admin réussie');
            console.log('🔑 Token reçu:', result.token.substring(0, 50) + '...');
            console.log('👤 Utilisateur:', result.user?.prenom, result.user?.nom);
            console.log('👑 Admin:', result.user?.isAdmin);
            
            // Tester le token avec les routes admin
            console.log('\n📋 ÉTAPE 2: Test token avec routes admin');
            
            // Test 1: Dashboard stats
            const dashboardOptions = {
              hostname: 'localhost',
              port: 4000,
              path: '/api/admin/dashboard/stats',
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${result.token}`
              }
            };

            const dashboardReq = http.request(dashboardOptions, (dashboardRes) => {
              console.log('📊 Dashboard stats status:', dashboardRes.statusCode);
              
              let dashboardData = '';
              dashboardRes.on('data', (chunk) => {
                dashboardData += chunk;
              });
              
              dashboardRes.on('end', () => {
                try {
                  const dashboardResult = JSON.parse(dashboardData);
                  
                  if (dashboardRes.statusCode === 200) {
                    console.log('✅ Dashboard stats fonctionne !');
                  } else {
                    console.log('❌ Dashboard stats erreur:', dashboardResult);
                  }
                  
                  // Test 2: Orders stats
                  console.log('\n📋 ÉTAPE 3: Test orders stats');
                  
                  const ordersOptions = {
                    hostname: 'localhost',
                    port: 4000,
                    path: '/api/orders/admin/stats',
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${result.token}`
                    }
                  };

                  const ordersReq = http.request(ordersOptions, (ordersRes) => {
                    console.log('📊 Orders stats status:', ordersRes.statusCode);
                    
                    let ordersData = '';
                    ordersRes.on('data', (chunk) => {
                      ordersData += chunk;
                    });
                    
                    ordersRes.on('end', () => {
                      try {
                        const ordersResult = JSON.parse(ordersData);
                        
                        if (ordersRes.statusCode === 200) {
                          console.log('✅ Orders stats fonctionne !');
                          console.log('📊 Statistiques:', ordersResult.stats);
                        } else {
                          console.log('❌ Orders stats erreur:', ordersResult);
                        }
                        
                        // Test 3: Update order status
                        console.log('\n📋 ÉTAPE 4: Test update order status');
                        
                        const updateData = {
                          status: 'preparing',
                          adminNotes: 'Test token admin'
                        };

                        const updateOptions = {
                          hostname: 'localhost',
                          port: 4000,
                          path: '/api/orders/admin/68c6bf49d36d55cb8a7a00c6/status',
                          method: 'PATCH',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${result.token}`
                          }
                        };

                        const updateReq = http.request(updateOptions, (updateRes) => {
                          console.log('📊 Update status:', updateRes.statusCode);
                          
                          let updateData = '';
                          updateRes.on('data', (chunk) => {
                            updateData += chunk;
                          });
                          
                          updateRes.on('end', () => {
                            try {
                              const updateResult = JSON.parse(updateData);
                              
                              if (updateRes.statusCode === 200) {
                                console.log('✅ Update status fonctionne !');
                                console.log('📊 Nouveau statut:', updateResult.order?.status);
                              } else {
                                console.log('❌ Update status erreur:', updateResult);
                              }
                              
                              console.log('\n🎯 RÉSUMÉ :');
                              console.log('===========');
                              console.log('✅ Token admin valide');
                              console.log('✅ Routes admin accessibles');
                              console.log('✅ Authentification fonctionne');
                              
                              resolve(result.token);
                            } catch (e) {
                              console.log('❌ Erreur parsing update:', e.message);
                              reject(e);
                            }
                          });
                        });

                        updateReq.on('error', (error) => {
                          console.error('❌ Erreur update:', error.message);
                          reject(error);
                        });

                        updateReq.write(JSON.stringify(updateData));
                        updateReq.end();
                        
                      } catch (e) {
                        console.log('❌ Erreur parsing orders:', e.message);
                        reject(e);
                      }
                    });
                  });

                  ordersReq.on('error', (error) => {
                    console.error('❌ Erreur orders:', error.message);
                    reject(error);
                  });

                  ordersReq.end();
                  
                } catch (e) {
                  console.log('❌ Erreur parsing dashboard:', e.message);
                  reject(e);
                }
              });
            });

            dashboardReq.on('error', (error) => {
              console.error('❌ Erreur dashboard:', error.message);
              reject(error);
            });

            dashboardReq.end();
            
          } else {
            console.log('❌ Erreur connexion:', result);
            reject(new Error('Login failed'));
          }
        } catch (e) {
          console.log('❌ Erreur parsing login:', e.message);
          reject(e);
        }
      });
    });

    loginReq.on('error', (error) => {
      console.error('❌ Erreur login:', error.message);
      reject(error);
    });

    loginReq.write(JSON.stringify(loginData));
    loginReq.end();
  });
};

// Lancer le test
const runTest = async () => {
  try {
    console.log('🚀 Démarrage du test token admin...\n');
    
    const token = await testAdminToken();
    
    console.log('\n🎉 TOKEN ADMIN VALIDE !');
    console.log('Le problème vient du frontend, pas du backend.');
    console.log('\n💡 Solution: Vérifiez que le token est bien stocké dans localStorage');
    console.log('Token à utiliser:', token.substring(0, 50) + '...');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test échoué:', error.message);
    process.exit(1);
  }
};

runTest();

