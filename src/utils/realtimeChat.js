// Système de chat en temps réel (simulation)
class RealtimeChat {
  constructor() {
    this.listeners = new Map();
    this.isConnected = false;
    this.intervalId = null;
    this.lastCheckTime = Date.now();
  }

  // Simuler une connexion WebSocket
  connect() {
    console.log('🔌 Connexion au chat temps réel...');
    this.isConnected = true;
    
    // Simuler la vérification de nouveaux messages toutes les 2 secondes
    this.intervalId = setInterval(() => {
      this.checkForNewMessages();
    }, 2000);
    
    return Promise.resolve();
  }

  // Déconnecter
  disconnect() {
    console.log('🔌 Déconnexion du chat temps réel');
    this.isConnected = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Vérifier les nouveaux messages
  checkForNewMessages() {
    if (!this.isConnected) return;

    // Récupérer tous les tickets
    const allTickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    
    // Vérifier s'il y a de nouveaux messages depuis la dernière vérification
    allTickets.forEach(ticket => {
      if (ticket.conversations) {
        ticket.conversations.forEach(conversation => {
          const messageTime = new Date(conversation.timestamp).getTime();
          if (messageTime > this.lastCheckTime) {
            // Nouveau message détecté !
            this.notifyListeners('newMessage', {
              ticketId: ticket.id,
              message: conversation,
              ticket: ticket
            });
          }
        });
      }
    });

    this.lastCheckTime = Date.now();
  }

  // S'abonner aux événements
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Se désabonner
  unsubscribe(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Notifier les écouteurs
  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Erreur dans le callback:', error);
        }
      });
    }
  }

  // Simuler l'envoi d'un message
  sendMessage(ticketId, message) {
    console.log('📤 Envoi de message temps réel:', { ticketId, message });
    
    // Simuler un délai d'envoi
    setTimeout(() => {
      this.notifyListeners('messageSent', {
        ticketId,
        message,
        success: true
      });
    }, 500);
  }

  // Simuler la frappe en cours
  startTyping(ticketId, userId) {
    this.notifyListeners('userTyping', {
      ticketId,
      userId,
      isTyping: true
    });
  }

  // Arrêter la frappe
  stopTyping(ticketId, userId) {
    this.notifyListeners('userTyping', {
      ticketId,
      userId,
      isTyping: false
    });
  }

  // Marquer un message comme lu
  markAsRead(ticketId, messageId) {
    this.notifyListeners('messageRead', {
      ticketId,
      messageId
    });
  }
}

// Instance globale
const realtimeChat = new RealtimeChat();

export default realtimeChat;