import fetch from 'node-fetch';

async function testStatsAPI() {
  try {
    console.log('🧪 Test de l\'API stats...');
    
    // URL de l'API
    const baseUrl = 'http://localhost:4000';
    const url = `${baseUrl}/api/orders/admin/stats`;
    
    // Token d'admin (vous devrez le remplacer par un vrai token)
    const token = 'your-admin-token-here';
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    console.log('📊 Résultat de l\'API stats:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success && result.stats.byStatus) {
      console.log('\n📈 Statistiques par statut:');
      result.stats.byStatus.forEach(stat => {
        console.log(`- ${stat._id}: ${stat.count} commandes`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

testStatsAPI();
