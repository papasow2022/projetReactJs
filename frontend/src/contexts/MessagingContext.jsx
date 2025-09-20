import React, { createContext, useContext, useState, useEffect } from 'react';

const MessagingContext = createContext();

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging doit être utilisé dans un MessagingProvider');
  }
  return context;
};

export const MessagingProvider = ({ children }) => {
  const [conversations, setConversations] = useState({});
  const [messages, setMessages] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessagingData();
  }, []);

  const loadMessagingData = () => {
    try {
      const storedConversations = JSON.parse(localStorage.getItem('conversations') || '{}');
      const storedMessages = JSON.parse(localStorage.getItem('messages') || '{}');
      
      setConversations(storedConversations);
      setMessages(storedMessages);
      
      // Calculer les messages non lus
      const totalUnread = Object.values(storedMessages).reduce((count, conversationMessages) => {
        return count + conversationMessages.filter(msg => !msg.read).length;
      }, 0);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  };

  // Créer ou récupérer une conversation
  const getOrCreateConversation = (customerId, vendorId, orderId = null) => {
    const conversationId = `${customerId}-${vendorId}${orderId ? `-${orderId}` : ''}`;
    
    if (!conversations[conversationId]) {
      const newConversation = {
        id: conversationId,
        customerId,
        vendorId,
        orderId,
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        status: 'active',
        subject: orderId ? `Commande #${orderId}` : 'Question générale'
      };
      
      const updatedConversations = { ...conversations, [conversationId]: newConversation };
      setConversations(updatedConversations);
      localStorage.setItem('conversations', JSON.stringify(updatedConversations));
      
      // Initialiser les messages pour cette conversation
      if (!messages[conversationId]) {
        const updatedMessages = { ...messages, [conversationId]: [] };
        setMessages(updatedMessages);
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
      }
    }
    
    return conversationId;
  };

  // Envoyer un message
  const sendMessage = (conversationId, senderId, senderType, content, attachments = []) => {
    const message = {
      id: Date.now(),
      conversationId,
      senderId,
      senderType, // 'customer' ou 'vendor'
      content,
      attachments,
      timestamp: new Date().toISOString(),
      read: false
    };

    const conversationMessages = messages[conversationId] || [];
    const updatedMessages = {
      ...messages,
      [conversationId]: [...conversationMessages, message]
    };

    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));

    // Mettre à jour la conversation
    const updatedConversations = {
      ...conversations,
      [conversationId]: {
        ...conversations[conversationId],
        lastMessageAt: new Date().toISOString(),
        lastMessage: content.substring(0, 100) + (content.length > 100 ? '...' : '')
      }
    };

    setConversations(updatedConversations);
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));

    return { success: true, message };
  };

  // Marquer les messages comme lus
  const markAsRead = (conversationId, userId) => {
    if (messages[conversationId]) {
      const updatedMessages = {
        ...messages,
        [conversationId]: messages[conversationId].map(msg => 
          msg.senderId !== userId ? { ...msg, read: true } : msg
        )
      };

      setMessages(updatedMessages);
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
      
      // Recalculer les messages non lus
      const totalUnread = Object.values(updatedMessages).reduce((count, conversationMessages) => {
        return count + conversationMessages.filter(msg => !msg.read).length;
      }, 0);
      setUnreadCount(totalUnread);
    }
  };

  // Obtenir les conversations d'un vendeur
  const getVendorConversations = (vendorId) => {
    return Object.values(conversations).filter(conv => conv.vendorId === vendorId);
  };

  // Obtenir les conversations d'un client
  const getCustomerConversations = (customerId) => {
    return Object.values(conversations).filter(conv => conv.customerId === customerId);
  };

  // Obtenir les messages d'une conversation
  const getConversationMessages = (conversationId) => {
    return messages[conversationId] || [];
  };

  // Archiver une conversation
  const archiveConversation = (conversationId) => {
    const updatedConversations = {
      ...conversations,
      [conversationId]: {
        ...conversations[conversationId],
        status: 'archived'
      }
    };

    setConversations(updatedConversations);
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));
  };

  // Supprimer une conversation
  const deleteConversation = (conversationId) => {
    const updatedConversations = { ...conversations };
    const updatedMessages = { ...messages };
    
    delete updatedConversations[conversationId];
    delete updatedMessages[conversationId];
    
    setConversations(updatedConversations);
    setMessages(updatedMessages);
    
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  // Rechercher dans les messages
  const searchMessages = (query, userId, userType) => {
    const userConversations = userType === 'vendor' 
      ? getVendorConversations(userId)
      : getCustomerConversations(userId);

    const results = [];
    
    userConversations.forEach(conversation => {
      const conversationMessages = getConversationMessages(conversation.id);
      const matchingMessages = conversationMessages.filter(msg => 
        msg.content.toLowerCase().includes(query.toLowerCase())
      );
      
      if (matchingMessages.length > 0) {
        results.push({
          conversation,
          messages: matchingMessages
        });
      }
    });

    return results;
  };

  const value = {
    conversations,
    messages,
    unreadCount,
    loading,
    sendMessage,
    markAsRead,
    getOrCreateConversation,
    getVendorConversations,
    getCustomerConversations,
    getConversationMessages,
    archiveConversation,
    deleteConversation,
    searchMessages
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

export { MessagingContext };
export default MessagingContext;