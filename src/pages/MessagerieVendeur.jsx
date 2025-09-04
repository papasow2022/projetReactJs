import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useMessaging } from '../contexts/MessagingContext';
import { 
  BiArrowBack, 
  BiSearch, 
  BiSend,
  BiPaperclip,
  BiArchive,
  BiTrash,
  BiUser,
  BiTime,
  BiCheck,
  BiCheckDouble,
  BiFilter,
  BiRefresh
} from 'react-icons/bi';

const MessagerieVendeur = () => {
  const { user } = useAuth();
  const { 
    conversations, 
    messages, 
    unreadCount,
    sendMessage, 
    markAsRead, 
    getVendorConversations, 
    getConversationMessages,
    archiveConversation,
    deleteConversation,
    searchMessages
  } = useMessaging();

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const vendorConversations = getVendorConversations(user?.vendorId || '');
  const filteredConversations = vendorConversations.filter(conv => {
    if (filterStatus === 'all') return conv.status === 'active';
    if (filterStatus === 'archived') return conv.status === 'archived';
    if (filterStatus === 'unread') {
      const conversationMessages = getConversationMessages(conv.id);
      return conversationMessages.some(msg => !msg.read && msg.senderType === 'customer');
    }
    return true;
  });

  const selectedMessages = selectedConversation ? getConversationMessages(selectedConversation.id) : [];

  useEffect(() => {
    if (selectedConversation) {
      markAsRead(selectedConversation.id, user?.id);
    }
  }, [selectedConversation, user?.id, markAsRead]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      sendMessage(
        selectedConversation.id,
        user?.id,
        'vendor',
        newMessage.trim()
      );
      setNewMessage('');
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const results = searchMessages(searchTerm, user?.vendorId, 'vendor');
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 168) { // 7 jours
      return `${Math.floor(diffInHours / 24)}j`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  const getUnreadCount = (conversationId) => {
    const conversationMessages = getConversationMessages(conversationId);
    return conversationMessages.filter(msg => !msg.read && msg.senderType === 'customer').length;
  };

  const getLastMessage = (conversationId) => {
    const conversationMessages = getConversationMessages(conversationId);
    return conversationMessages[conversationMessages.length - 1];
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', padding: '1rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/vendeur/dashboard" style={{ textDecoration: 'none', color: '#666' }}>
              <BiArrowBack style={{ fontSize: '1.5rem' }} />
            </Link>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '600', color: '#232f3e' }}>
                Messagerie
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                Communiquez avec vos clients
                {unreadCount > 0 && (
                  <span style={{ 
                    marginLeft: '0.5rem', 
                    backgroundColor: '#e74c3c', 
                    color: 'white', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem' 
                  }}>
                    {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', height: '70vh' }}>
          {/* Liste des conversations */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Barre de recherche et filtres */}
            <div style={{ padding: '1rem', borderBottom: '1px solid #e0e0e0' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <BiSearch style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#666' 
                  }} />
                  <input
                    type="text"
                    placeholder="Rechercher dans les messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <BiSearch />
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="all">Toutes</option>
                  <option value="unread">Non lues</option>
                  <option value="archived">Archivées</option>
                </select>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <BiRefresh />
                </button>
              </div>
            </div>

            {/* Liste des conversations */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {showSearchResults ? (
                <div style={{ padding: '1rem' }}>
                  <h4>Résultats de recherche</h4>
                  {searchResults.length === 0 ? (
                    <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                      Aucun résultat trouvé
                    </p>
                  ) : (
                    searchResults.map(({ conversation, messages: matchingMessages }) => (
                      <div
                        key={conversation.id}
                        onClick={() => {
                          setSelectedConversation(conversation);
                          setShowSearchResults(false);
                        }}
                        style={{
                          padding: '1rem',
                          borderBottom: '1px solid #f0f0f0',
                          cursor: 'pointer',
                          backgroundColor: selectedConversation?.id === conversation.id ? '#f8f9fa' : 'white'
                        }}
                      >
                        <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                          {conversation.subject}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          {matchingMessages.length} message{matchingMessages.length > 1 ? 's' : ''} trouvé{matchingMessages.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                filteredConversations.map(conversation => {
                  const unreadCount = getUnreadCount(conversation.id);
                  const lastMessage = getLastMessage(conversation.id);
                  
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      style={{
                        padding: '1rem',
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        backgroundColor: selectedConversation?.id === conversation.id ? '#f8f9fa' : 'white',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                          {conversation.subject}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {unreadCount > 0 && (
                            <span style={{
                              backgroundColor: '#e74c3c',
                              color: 'white',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: '600'
                            }}>
                              {unreadCount}
                            </span>
                          )}
                          <span style={{ fontSize: '0.7rem', color: '#666' }}>
                            {formatTime(conversation.lastMessageAt)}
                          </span>
                        </div>
                      </div>
                      
                      {lastMessage && (
                        <div style={{ 
                          fontSize: '0.8rem', 
                          color: '#666',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span style={{ fontWeight: '500' }}>
                            {lastMessage.senderType === 'customer' ? 'Client' : 'Vous'}:
                          </span>
                          <span style={{ 
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {lastMessage.content}
                          </span>
                          {lastMessage.senderType === 'vendor' && (
                            lastMessage.read ? <BiCheckDouble style={{ color: '#007bff' }} /> : <BiCheck />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Zone de conversation */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {selectedConversation ? (
              <>
                {/* Header de la conversation */}
                <div style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid #e0e0e0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
                      {selectedConversation.subject}
                    </h3>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.8rem' }}>
                      Conversation avec le client
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => archiveConversation(selectedConversation.id)}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <BiArchive />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
                          deleteConversation(selectedConversation.id);
                          setSelectedConversation(null);
                        }
                      }}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <BiTrash />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {selectedMessages.map(message => (
                    <div
                      key={message.id}
                      style={{
                        display: 'flex',
                        justifyContent: message.senderType === 'vendor' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{
                        maxWidth: '70%',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        backgroundColor: message.senderType === 'vendor' ? '#007bff' : '#f1f3f4',
                        color: message.senderType === 'vendor' ? 'white' : '#333',
                        position: 'relative'
                      }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          {message.content}
                        </div>
                        <div style={{ 
                          fontSize: '0.7rem', 
                          opacity: 0.7,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          {formatTime(message.timestamp)}
                          {message.senderType === 'vendor' && (
                            message.read ? <BiCheckDouble /> : <BiCheck />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Zone de saisie */}
                <div style={{ 
                  padding: '1rem', 
                  borderTop: '1px solid #e0e0e0',
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  <button
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <BiPaperclip />
                  </button>
                  <input
                    type="text"
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: newMessage.trim() ? '#28a745' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: newMessage.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <BiSend />
                  </button>
                </div>
              </>
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: '#666',
                textAlign: 'center'
              }}>
                <div>
                  <BiUser size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <h3>Sélectionnez une conversation</h3>
                  <p>Choisissez une conversation dans la liste pour commencer à échanger avec vos clients.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagerieVendeur;