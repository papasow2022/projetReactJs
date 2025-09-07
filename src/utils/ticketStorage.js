// Système de stockage des tickets
const TICKETS_STORAGE_KEY = 'support_tickets';
const TICKET_COUNTER_KEY = 'ticket_counter';

// Générer un ID unique pour les tickets
export const generateTicketId = () => {
  const counter = parseInt(localStorage.getItem(TICKET_COUNTER_KEY) || '0') + 1;
  localStorage.setItem(TICKET_COUNTER_KEY, counter.toString());
  return `SUP-${counter.toString().padStart(3, '0')}`;
};

// Sauvegarder un ticket
export const saveTicket = (ticket) => {
  const tickets = getTickets();
  const newTicket = {
    ...ticket,
    id: ticket.id || generateTicketId(),
    createdAt: ticket.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    conversations: ticket.conversations || [
      {
        id: 1,
        type: 'customer',
        message: ticket.description,
        author: ticket.user,
        timestamp: new Date().toISOString()
      }
    ]
  };
  
  tickets.push(newTicket);
  localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  return newTicket;
};

// Récupérer tous les tickets
export const getTickets = () => {
  const stored = localStorage.getItem(TICKETS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Mettre à jour un ticket
export const updateTicket = (ticketId, updates) => {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === ticketId);
  
  if (index !== -1) {
    tickets[index] = {
      ...tickets[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
    return tickets[index];
  }
  return null;
};

// Ajouter une conversation à un ticket
export const addConversation = (ticketId, conversation) => {
  const tickets = getTickets();
  const index = tickets.findIndex(t => t.id === ticketId);
  
  if (index !== -1) {
    if (!tickets[index].conversations) {
      tickets[index].conversations = [];
    }
    
    const newConversation = {
      id: tickets[index].conversations.length + 1,
      ...conversation,
      timestamp: new Date().toISOString()
    };
    
    tickets[index].conversations.push(newConversation);
    tickets[index].updatedAt = new Date().toISOString();
    
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
    return tickets[index];
  }
  return null;
};

// Supprimer un ticket
export const deleteTicket = (ticketId) => {
  const tickets = getTickets();
  const filteredTickets = tickets.filter(t => t.id !== ticketId);
  localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(filteredTickets));
  return filteredTickets;
};

// Initialiser avec des données de test si aucun ticket n'existe
export const initializeTestTickets = () => {
  const existingTickets = getTickets();
  if (existingTickets.length === 0) {
    const testTickets = [
      {
        id: 'SUP-001',
        subject: 'Ma commande n\'arrive pas',
        user: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        priority: 'high',
        status: 'open',
        description: 'J\'ai commandé des chaussures il y a 5 jours mais je ne les ai toujours pas reçues. Pouvez-vous vérifier le statut de ma commande ?',
        category: 'livraison',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        conversations: [
          {
            id: 1,
            type: 'customer',
            message: 'J\'ai commandé des chaussures il y a 5 jours mais je ne les ai toujours pas reçues. Pouvez-vous vérifier le statut de ma commande ?',
            author: 'Jean Dupont',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: 'SUP-002',
        subject: 'Problème de retour',
        user: 'Marie Martin',
        email: 'marie.martin@email.com',
        priority: 'medium',
        status: 'pending',
        description: 'Je souhaite retourner un produit mais je ne trouve pas l\'étiquette de retour. Comment procéder ?',
        category: 'retour',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        conversations: [
          {
            id: 1,
            type: 'customer',
            message: 'Je souhaite retourner un produit mais je ne trouve pas l\'étiquette de retour. Comment procéder ?',
            author: 'Marie Martin',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            type: 'agent',
            message: 'Bonjour Marie, je vais vous envoyer une nouvelle étiquette de retour par email. Vous devriez la recevoir dans les prochaines minutes.',
            author: 'Agent Support',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: 'SUP-003',
        subject: 'Question sur la taille',
        user: 'Pierre Durand',
        email: 'pierre.durand@email.com',
        priority: 'low',
        status: 'closed',
        description: 'Quelle taille me conseillez-vous pour des chaussures Nike Air Max ? Je fais du 42 normalement.',
        category: 'commande',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        conversations: [
          {
            id: 1,
            type: 'customer',
            message: 'Quelle taille me conseillez-vous pour des chaussures Nike Air Max ? Je fais du 42 normalement.',
            author: 'Pierre Durand',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            type: 'agent',
            message: 'Bonjour Pierre, pour les Nike Air Max, je vous conseille de prendre votre taille habituelle 42. Ces chaussures ont une coupe standard.',
            author: 'Agent Support',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            type: 'customer',
            message: 'Parfait, merci pour votre conseil !',
            author: 'Pierre Durand',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    ];
    
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(testTickets));
    localStorage.setItem(TICKET_COUNTER_KEY, '3');
  }
};