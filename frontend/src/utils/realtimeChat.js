// Système de chat en temps réel avec WebSocket
class RealtimeChat {
  constructor() {
    this.listeners = new Map();
    this.isConnected = false;
    this.socket = null;
    this.intervalId = null;
    this.lastCheckTime = Date.now();
    this.useWebSocket = true; // Toggle entre WebSocket et simulation
  }

  // Connexion WebSocket ou simulation
  connect() {
    console.log('🔌 Connexion au chat temps réel...');
    
    if (this.useWebSocket) {
      return this.connectWebSocket();
    } else {
      return this.connectSimulation();
    }
  }

  // Connexion WebSocket réelle
  connectWebSocket() {
    try {
      this.socket = new WebSocket('ws://localhost:4000');
      
      this.socket.onopen = () => {
        console.log('✅ WebSocket connecté');
        this.isConnected = true;
        this.notifyListeners('connected', { connected: true });
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(data);
        } catch (error) {
          console.error('Erreur parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('❌ WebSocket déconnecté');
        this.isConnected = false;
        this.notifyListeners('disconnected', { connected: false });
        
        // Tentative de reconnexion après 3 secondes
        setTimeout(() => {
          if (!this.isConnected) {
            this.connectWebSocket();
          }
        }, 3000);
      };

      this.socket.onerror = (error) => {
        console.error('❌ Erreur WebSocket:', error);
        this.isConnected = false;
      };

      return Promise.resolve();
    } catch (error) {
      console.error('❌ Erreur connexion WebSocket:', error);
      // Fallback vers simulation
      return this.connectSimulation();
    }
  }

  // Connexion simulation (fallback)
  connectSimulation() {
    console.log('🔄 Utilisation du mode simulation');
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
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Gérer les messages WebSocket
  handleWebSocketMessage(data) {
    switch (data.type) {
      case 'newMessage':
        this.notifyListeners('newMessage', data);
        break;
      case 'userTyping':
        this.notifyListeners('userTyping', data);
        break;
      case 'messageRead':
        this.notifyListeners('messageRead', data);
        break;
      case 'ticketUpdate':
        this.notifyListeners('ticketUpdate', data);
        break;
      default:
        console.log('Message WebSocket non géré:', data);
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

  // Envoyer un message via WebSocket ou simulation
  sendMessage(ticketId, message) {
    console.log('📤 Envoi de message temps réel:', { ticketId, message });
    
    if (this.useWebSocket && this.socket && this.socket.readyState === WebSocket.OPEN) {
      // Envoyer via WebSocket
      this.socket.send(JSON.stringify({
        type: 'sendMessage',
        ticketId,
        message
      }));
    } else {
      // Fallback simulation
      setTimeout(() => {
        this.notifyListeners('messageSent', {
          ticketId,
          message,
          success: true
        });
      }, 500);
    }
  }

  // Gérer la frappe en cours
  startTyping(ticketId, userId) {
    if (this.useWebSocket && this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'startTyping',
        ticketId,
        userId
      }));
    } else {
      this.notifyListeners('userTyping', {
        ticketId,
        userId,
        isTyping: true
      });
    }
  }

  // Arrêter la frappe
  stopTyping(ticketId, userId) {
    if (this.useWebSocket && this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'stopTyping',
        ticketId,
        userId
      }));
    } else {
      this.notifyListeners('userTyping', {
        ticketId,
        userId,
        isTyping: false
      });
    }
  }

  // Marquer un message comme lu
  markAsRead(ticketId, messageId) {
    if (this.useWebSocket && this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'markAsRead',
        ticketId,
        messageId
      }));
    } else {
      this.notifyListeners('messageRead', {
        ticketId,
        messageId
      });
    }
  }

  // Toggle entre WebSocket et simulation
  toggleMode() {
    this.useWebSocket = !this.useWebSocket;
    console.log(`🔄 Mode changé vers: ${this.useWebSocket ? 'WebSocket' : 'Simulation'}`);
    
    if (this.isConnected) {
      this.disconnect();
      this.connect();
    }
    
    return this.useWebSocket;
  }
}

// Instance globale
const realtimeChat = new RealtimeChat();

export default realtimeChat;