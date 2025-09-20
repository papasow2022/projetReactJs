// Service pour gérer les notifications
const API_BASE_URL = 'http://localhost:4000/api';

class NotificationService {
  // Méthode générique pour faire des requêtes
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur HTTP: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Erreur NotificationService:', error);
      throw error;
    }
  }

  // Récupérer les notifications admin
  async getAdminNotifications() {
    return this.request('/admin/notifications');
  }

  // Marquer une notification comme lue
  async markNotificationAsRead(notificationId) {
    return this.request(`/admin/notifications/${notificationId}/read`, {
      method: 'PATCH'
    });
  }

  // Récupérer les notifications client (pour les tickets)
  async getClientNotifications(email) {
    // Pour l'instant, on utilise les tickets comme notifications
    // Vous pouvez étendre cela pour un système de notifications dédié
    return this.request(`/support/tickets?email=${email}&sortBy=createdAt&sortOrder=desc&limit=10`);
  }

  // Créer une notification client
  async createClientNotification(notificationData) {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData)
    });
  }

  // Marquer une notification client comme lue
  async markClientNotificationAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PATCH'
    });
  }

  // Récupérer les statistiques de notifications
  async getNotificationStats() {
    try {
      const response = await this.getAdminNotifications();
      return response.stats;
    } catch (error) {
      console.error('Erreur récupération stats notifications:', error);
      return {
        orders: { total: 0, pending: 0, today: 0 },
        tickets: { total: 0, open: 0, today: 0 }
      };
    }
  }
}

// Instance singleton
const notificationService = new NotificationService();

export default notificationService;
