import { safeFetch } from '../utils/networkDiagnostic.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Fonction utilitaire pour faire des requêtes authentifiées
const authenticatedRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await safeFetch(`${API_BASE_URL}${endpoint}`, config);
    return await response.json();
  } catch (error) {
    console.error('❌ Erreur requête authentifiée:', error.message);
    throw error;
  }
};

// Service pour les statistiques du dashboard admin
export const adminService = {
  // Obtenir les statistiques générales du dashboard
  async getDashboardStats() {
    try {
      const data = await authenticatedRequest('/admin/dashboard/stats');
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  // Obtenir les statistiques détaillées par période
  async getDetailedStats(period = '30d') {
    try {
      const data = await authenticatedRequest(`/admin/dashboard/stats/detailed?period=${period}`);
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques détaillées:', error);
      throw error;
    }
  },

  // Obtenir la liste des utilisateurs
  async getUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.role) queryParams.append('role', params.role);
      if (params.status) queryParams.append('status', params.status);

      const queryString = queryParams.toString();
      const endpoint = `/admin/users${queryString ? `?${queryString}` : ''}`;
      
      const data = await authenticatedRequest(endpoint);
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  // Mettre à jour le rôle d'un utilisateur
  async updateUserRole(userId, roleData) {
    try {
      const data = await authenticatedRequest(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify(roleData),
      });
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      throw error;
    }
  },

  // Obtenir les statistiques des commandes
  async getOrderStats() {
    try {
      const data = await authenticatedRequest('/orders/stats/overview');
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des commandes:', error);
      throw error;
    }
  },

  // Obtenir les statistiques du support
  async getSupportStats() {
    try {
      const data = await authenticatedRequest('/support/stats');
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques du support:', error);
      throw error;
    }
  }
};

export default adminService;
