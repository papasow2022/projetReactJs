// Service pour communiquer avec l'API de support
const API_BASE_URL = 'http://localhost:4000/api/support';

class SupportService {
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
      console.error('Erreur SupportService:', error);
      throw error;
    }
  }

  // Récupérer tous les tickets
  async getTickets(params = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const endpoint = queryParams.toString() 
      ? `/tickets?${queryParams.toString()}` 
      : '/tickets';

    return this.request(endpoint);
  }

  // Récupérer un ticket spécifique
  async getTicket(ticketId) {
    return this.request(`/tickets/${ticketId}`);
  }

  // Créer un nouveau ticket
  async createTicket(ticketData) {
    return this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  // Mettre à jour un ticket
  async updateTicket(ticketId, updateData) {
    return this.request(`/tickets/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Ajouter une conversation à un ticket
  async addConversation(ticketId, conversationData) {
    return this.request(`/tickets/${ticketId}/conversations`, {
      method: 'POST',
      body: JSON.stringify(conversationData),
    });
  }

  // Récupérer les statistiques
  async getStats() {
    return this.request('/stats');
  }

  // Supprimer un ticket
  async deleteTicket(ticketId) {
    return this.request(`/tickets/${ticketId}`, {
      method: 'DELETE',
    });
  }

  // Récupérer les tickets par email (pour un utilisateur spécifique)
  async getTicketsByEmail(email, params = {}) {
    return this.getTickets({ email, ...params });
  }

  // Récupérer les tickets ouverts
  async getOpenTickets(params = {}) {
    return this.getTickets({ status: 'open', ...params });
  }

  // Récupérer les tickets par priorité
  async getTicketsByPriority(priority, params = {}) {
    return this.getTickets({ priority, ...params });
  }

  // Récupérer les tickets par catégorie
  async getTicketsByCategory(category, params = {}) {
    return this.getTickets({ category, ...params });
  }

  // Rechercher des tickets
  async searchTickets(query, params = {}) {
    // Note: Cette fonctionnalité nécessiterait une implémentation côté backend
    // Pour l'instant, on filtre côté frontend
    const allTickets = await this.getTickets(params);
    
    if (!query) return allTickets;

    const filteredTickets = allTickets.data.tickets.filter(ticket => 
      ticket.subject.toLowerCase().includes(query.toLowerCase()) ||
      ticket.description.toLowerCase().includes(query.toLowerCase()) ||
      ticket.user.toLowerCase().includes(query.toLowerCase())
    );

    return {
      ...allTickets,
      data: {
        ...allTickets.data,
        tickets: filteredTickets
      }
    };
  }
}

// Instance singleton
const supportService = new SupportService();

export default supportService;





