// Utilitaire de diagnostic réseau pour identifier les problèmes "Failed to fetch"

export const networkDiagnostic = {
  // Tester la connectivité de base
  async testBasicConnectivity() {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${baseUrl}/api/health`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Connectivité de base OK:', data);
        return { success: true, data };
      } else {
        console.error('❌ Erreur HTTP:', response.status, response.statusText);
        return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
      }
    } catch (error) {
      console.error('❌ Erreur de connectivité:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Tester CORS
  async testCORS() {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${baseUrl}/api/health/cors`, {
        method: 'GET',
        headers: {
          'Origin': window.location.origin
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ CORS OK:', data);
        return { success: true, data };
      } else {
        console.error('❌ Erreur CORS:', response.status);
        return { success: false, error: `CORS Error: ${response.status}` };
      }
    } catch (error) {
      console.error('❌ Erreur CORS:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Tester l'authentification
  async testAuth() {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' })
      });
      
      // On s'attend à une erreur 401, ce qui est normal
      if (response.status === 401) {
        console.log('✅ Endpoint auth accessible (401 attendu)');
        return { success: true, message: 'Auth endpoint accessible' };
      } else {
        console.log('⚠️ Réponse auth inattendue:', response.status);
        return { success: true, message: `Auth endpoint accessible (status: ${response.status})` };
      }
    } catch (error) {
      console.error('❌ Erreur auth:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Diagnostic complet
  async runFullDiagnostic() {
    console.log('🔍 Démarrage du diagnostic réseau...');
    
    const results = {
      basicConnectivity: await this.testBasicConnectivity(),
      cors: await this.testCORS(),
      auth: await this.testAuth()
    };

    console.log('📊 Résultats du diagnostic:', results);

    // Analyser les résultats
    const allSuccess = Object.values(results).every(result => result.success);
    
    if (allSuccess) {
      console.log('✅ Tous les tests passent - Le problème "Failed to fetch" vient probablement d\'ailleurs');
      return {
        success: true,
        message: 'Réseau OK - Vérifiez la console pour plus de détails',
        results
      };
    } else {
      console.log('❌ Problèmes détectés');
      return {
        success: false,
        message: 'Problèmes réseau détectés',
        results
      };
    }
  },

  // Obtenir des suggestions de résolution
  getSuggestions(error) {
    const suggestions = [];

    if (error.includes('Failed to fetch')) {
      suggestions.push('1. Vérifiez que le serveur backend est démarré (npm run dev)');
      suggestions.push('2. Vérifiez que le port 4000 est libre');
      suggestions.push('3. Vérifiez les paramètres de firewall/antivirus');
      suggestions.push('4. Essayez de redémarrer le serveur backend');
    }

    if (error.includes('CORS')) {
      suggestions.push('1. Vérifiez la configuration CORS du serveur');
      suggestions.push('2. Vérifiez que VITE_API_URL est correct');
    }

    if (error.includes('401') || error.includes('403')) {
      suggestions.push('1. Vérifiez votre token d\'authentification');
      suggestions.push('2. Essayez de vous reconnecter');
    }

    if (error.includes('500')) {
      suggestions.push('1. Vérifiez les logs du serveur backend');
      suggestions.push('2. Vérifiez la connexion à la base de données');
    }

    return suggestions;
  }
};

// Fonction utilitaire pour wrapper les appels fetch avec gestion d'erreur
export const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Erreur fetch:', error.message);
    
    // Lancer le diagnostic si c'est une erreur de réseau
    if (error.message.includes('Failed to fetch')) {
      console.log('🔍 Lancement du diagnostic réseau...');
      await networkDiagnostic.runFullDiagnostic();
    }
    
    throw error;
  }
};

export default networkDiagnostic;

