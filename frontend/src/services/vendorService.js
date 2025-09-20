// Service API pour les vendeurs
const API_BASE_URL = '/api/vendor';

class VendorService {
  // Headers par défaut avec authentification
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
  }

  // Gestion du profil vendeur
  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updateProfile(profileData) {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData)
    });
    return response.json();
  }

  async createProfile(profileData) {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData)
    });
    return response.json();
  }

  // Statistiques et analytics
  async getStats(period = '30d') {
    const response = await fetch(`${API_BASE_URL}/stats?period=${period}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Gestion des produits
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products?${queryString}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getProduct(productId) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async createProduct(productData) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(productData)
    });
    return response.json();
  }

  async updateProduct(productId, productData) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(productData)
    });
    return response.json();
  }

  async deleteProduct(productId) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Gestion des commandes
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/orders?${queryString}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getOrder(orderId) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updateOrderStatus(orderId, status, note = '') {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, note })
    });
    return response.json();
  }

  // Gestion des stocks
  async updateInventory(productId, quantity, operation = 'set') {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/inventory`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ quantity, operation })
    });
    return response.json();
  }

  async getLowStockProducts() {
    const response = await fetch(`${API_BASE_URL}/products?status=active&lowStock=true`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Gestion des paiements
  async getPayments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/payments?${queryString}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getPaymentSummary(period = '30d') {
    const response = await fetch(`${API_BASE_URL}/payments/summary?period=${period}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Gestion des retours
  async getReturns(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/returns?${queryString}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async processReturn(returnId, action, note = '') {
    const response = await fetch(`${API_BASE_URL}/returns/${returnId}/process`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ action, note })
    });
    return response.json();
  }

  // Gestion des avis
  async getReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/reviews?${queryString}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async replyToReview(reviewId, reply) {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ reply })
    });
    return response.json();
  }

  // Gestion des promotions
  async getPromotions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/promotions?${queryString}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async createPromotion(promotionData) {
    const response = await fetch(`${API_BASE_URL}/promotions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(promotionData)
    });
    return response.json();
  }

  async updatePromotion(promotionId, promotionData) {
    const response = await fetch(`${API_BASE_URL}/promotions/${promotionId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(promotionData)
    });
    return response.json();
  }

  async deletePromotion(promotionId) {
    const response = await fetch(`${API_BASE_URL}/promotions/${promotionId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Gestion des documents
  async uploadDocument(documentData) {
    const formData = new FormData();
    formData.append('file', documentData.file);
    formData.append('type', documentData.type);
    formData.append('description', documentData.description || '');

    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    return response.json();
  }

  async getDocuments() {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Gestion des paramètres de boutique
  async getStoreSettings() {
    const response = await fetch(`${API_BASE_URL}/store/settings`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updateStoreSettings(settings) {
    const response = await fetch(`${API_BASE_URL}/store/settings`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(settings)
    });
    return response.json();
  }

  // Gestion des notifications
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/notifications?${queryString}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async markNotificationAsRead(notificationId) {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: this.getHeaders()
    });
    return response.json();
  }

  async markAllNotificationsAsRead() {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Gestion des performances
  async getPerformanceMetrics(period = '30d') {
    const response = await fetch(`${API_BASE_URL}/performance?period=${period}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Export de données
  async exportData(type, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/export/${type}?${queryString}`, {
      headers: this.getHeaders()
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${type}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return { success: true };
    }
    
    return response.json();
  }
}

export default new VendorService();
