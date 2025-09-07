import React, { useState, useEffect } from 'react';
import {
  BiSearch,
  BiFilter,
  BiRefresh,
  BiUser,
  BiCalendar,
  BiMessage,
  BiCheckCircle,
  BiXCircle,
  BiInfoCircle,
  BiPlus,
  BiEdit,
  BiTrash,
  BiSave,
  BiX,
  BiShow,
  BiArchive,
  BiLock,
  BiLockOpen
} from 'react-icons/bi';
import { getTickets, updateTicket, addConversation, deleteTicket, initializeTestTickets } from '../utils/ticketStorage';
import realtimeChat from '../utils/realtimeChat';

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // États pour la gestion des tickets
  const [editingTicket, setEditingTicket] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  
  // Formulaire d'édition
  const [formData, setFormData] = useState({
    subject: '',
    user: '',
    email: '',
    priority: 'medium',
    status: 'open',
    description: '',
    category: 'general'
  });

  // Formulaire de réponse
  const [responseData, setResponseData] = useState({
    message: '',
    isInternal: false,
    template: ''
  });

  // États pour le chat temps réel
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [newMessageNotification, setNewMessageNotification] = useState(null);

  useEffect(() => { 
    initializeTestTickets(); // Initialiser les tickets de test si nécessaire
    loadTickets(); 
  }, []);

  // Écouter les nouveaux tickets créés par l'agent IA
  useEffect(() => {
    const handleNewTicketFromAI = (event) => {
      console.log('🎫 Admin - Nouveau ticket reçu de l\'IA:', event.detail);
      
      // Actualiser la liste des tickets
      loadTickets();
      
      // Afficher une notification
      setNewMessageNotification({
        ticketId: event.detail.ticket.id,
        message: `Nouveau ticket créé par l'IA: ${event.detail.ticket.subject}`,
        ticket: event.detail.ticket
      });
      
      // Masquer la notification après 5 secondes
      setTimeout(() => {
        setNewMessageNotification(null);
      }, 5000);
    };

    // S'abonner à l'événement
    window.addEventListener('newTicketFromAI', handleNewTicketFromAI);

    // Nettoyage
    return () => {
      window.removeEventListener('newTicketFromAI', handleNewTicketFromAI);
    };
  }, []);

  // Gestion du chat temps réel
  useEffect(() => {
    // Se connecter au chat temps réel
    realtimeChat.connect().then(() => {
      setIsRealtimeConnected(true);
      console.log('✅ Admin - Chat temps réel connecté');
    });

    // Écouter les nouveaux messages
    const handleNewMessage = (data) => {
      console.log('📨 Admin - Nouveau message reçu:', data);
      
      // Mettre à jour les tickets
      loadTickets();
      
      // Afficher une notification
      setNewMessageNotification({
        ticketId: data.ticketId,
        message: data.message,
        ticket: data.ticket
      });
      
      // Masquer la notification après 5 secondes
      setTimeout(() => {
        setNewMessageNotification(null);
      }, 5000);
    };

    // Écouter les indicateurs de frappe
    const handleTyping = (data) => {
      setTypingUsers(prev => ({
        ...prev,
        [data.ticketId]: data.isTyping ? data.userId : null
      }));
    };

    // S'abonner aux événements
    realtimeChat.subscribe('newMessage', handleNewMessage);
    realtimeChat.subscribe('userTyping', handleTyping);

    // Nettoyage à la déconnexion
    return () => {
      realtimeChat.unsubscribe('newMessage', handleNewMessage);
      realtimeChat.unsubscribe('userTyping', handleTyping);
      realtimeChat.disconnect();
      setIsRealtimeConnected(false);
    };
  }, []);

  // Gestion de la frappe
  const handleTyping = (ticketId) => {
    realtimeChat.startTyping(ticketId, 'agent');
    
    // Arrêter la frappe après 3 secondes d'inactivité
    setTimeout(() => {
      realtimeChat.stopTyping(ticketId, 'agent');
    }, 3000);
  };

  const loadTickets = () => {
    setLoading(true);
    // Charger les tickets depuis le stockage
    const storedTickets = getTickets();
    setTimeout(() => { 
      setTickets(storedTickets); 
      setLoading(false); 
    }, 300);
  };

  // Fonctions de gestion des tickets

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket.id);
    setFormData({
      subject: ticket.subject,
      user: ticket.user,
      email: ticket.email,
      priority: ticket.priority,
      status: ticket.status,
      description: ticket.description,
      category: ticket.category
    });
  };

  const handleUpdateTicket = () => {
    const updatedTicket = updateTicket(editingTicket, formData);
    if (updatedTicket) {
      setTickets(tickets.map(ticket => 
        ticket.id === editingTicket ? updatedTicket : ticket
      ));
    }
    setEditingTicket(null);
    resetForm();
  };

  const handleDeleteTicket = (ticketId) => {
    const remainingTickets = deleteTicket(ticketId);
    setTickets(remainingTickets);
    setShowDeleteModal(null);
  };

  const handleTicketAction = (ticketId, action) => {
    let newStatus;
    switch (action) {
      case 'close':
        newStatus = 'closed';
        break;
      case 'reopen':
        newStatus = 'open';
        break;
      case 'archive':
        newStatus = 'archived';
        break;
      case 'lock':
        newStatus = 'locked';
        break;
      case 'unlock':
        newStatus = 'open';
        break;
    }
    
    const updatedTicket = updateTicket(ticketId, { status: newStatus });
    if (updatedTicket) {
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? updatedTicket : ticket
      ));
    }
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      user: '',
      email: '',
      priority: 'medium',
      status: 'open',
      description: '',
      category: 'general'
    });
  };

  const cancelEdit = () => {
    setEditingTicket(null);
    resetForm();
  };

  // Fonctions de gestion des réponses
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  const handleSendResponse = () => {
    if (!responseData.message.trim()) {
      alert('Veuillez saisir un message avant d\'envoyer');
      return;
    }

    const newConversation = {
      type: responseData.isInternal ? 'internal' : 'agent',
      message: responseData.message,
      author: 'Agent Support'
    };

    // Ajouter la conversation au ticket via le système de stockage
    const updatedTicket = addConversation(selectedTicket.id, newConversation);
    
      if (updatedTicket) {
        // Mettre à jour l'état local
        setTickets(tickets.map(ticket => 
          ticket.id === selectedTicket.id ? updatedTicket : ticket
        ));
        
        setSelectedTicket(updatedTicket);
        
        // Envoyer via le chat temps réel
        realtimeChat.sendMessage(selectedTicket.id, newConversation);
      }

    setResponseData({ message: '', isInternal: false, template: '' });
  };

  const handleTemplateSelect = (template) => {
    const templates = {
      greeting: 'Bonjour,\n\nMerci de nous avoir contactés. Nous avons bien reçu votre demande et nous allons la traiter dans les plus brefs délais.\n\nCordialement,\nL\'équipe support',
      followup: 'Bonjour,\n\nNous faisons un suivi de votre demande. Avez-vous besoin d\'informations supplémentaires ?\n\nCordialement,\nL\'équipe support',
      resolution: 'Bonjour,\n\nVotre problème a été résolu. N\'hésitez pas à nous contacter si vous avez d\'autres questions.\n\nCordialement,\nL\'équipe support',
      escalation: 'Bonjour,\n\nVotre demande nécessite une attention particulière. Elle a été transmise à notre équipe spécialisée qui vous contactera prochainement.\n\nCordialement,\nL\'équipe support'
    };
    
    setResponseData({
      ...responseData,
      message: templates[template] || '',
      template: template
    });
  };

  const closeTicketDetails = () => {
    setShowTicketDetails(false);
    setSelectedTicket(null);
    setResponseData({
      message: '',
      isInternal: false,
      template: ''
    });
  };

  const filtered = tickets.filter(t => {
    const matchesSearch = `${t.id} ${t.subject} ${t.user} ${t.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const badge = (status) => {
    const statusMap = {
      'open': { text: 'Ouvert', class: 'bg-danger' },
      'pending': { text: 'En attente', class: 'bg-warning' },
      'closed': { text: 'Fermé', class: 'bg-success' },
      'archived': { text: 'Archivé', class: 'bg-secondary' },
      'locked': { text: 'Verrouillé', class: 'bg-dark' }
    };
    const statusInfo = statusMap[status] || { text: 'Inconnu', class: 'bg-secondary' };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const priorityBadge = (priority) => {
    const priorityMap = {
      'high': { text: 'Haute', class: 'bg-danger' },
      'medium': { text: 'Moyenne', class: 'bg-warning' },
      'low': { text: 'Basse', class: 'bg-secondary' }
    };
    const priorityInfo = priorityMap[priority] || { text: 'Moyenne', class: 'bg-warning' };
    return <span className={`badge ${priorityInfo.class}`}>{priorityInfo.text}</span>;
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">
            Support client
            {isRealtimeConnected && (
              <span className="badge bg-success ms-2" title="Chat temps réel actif">
                <i className="bi bi-wifi me-1"></i>
                Temps réel
              </span>
            )}
          </h1>
          <p className="text-muted mb-0">Gestion des tickets et demandes</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={loadTickets}><BiRefresh className="me-2"/>Actualiser</button>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text"><BiSearch/></span>
                <input className="form-control" placeholder="Rechercher un ticket..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
                <option value="all">Tous les statuts</option>
                <option value="open">Ouverts</option>
                <option value="pending">En attente</option>
                <option value="closed">Fermés</option>
                <option value="archived">Archivés</option>
                <option value="locked">Verrouillés</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-secondary w-100"><BiFilter className="me-2"/>Plus de filtres</button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire d'édition */}
      {editingTicket && (
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-header bg-white border-0">
            <h5 className="mb-0">
              Modifier le ticket
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Objet *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Objet du ticket"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Catégorie</label>
                <select 
                  className="form-select" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="general">Général</option>
                  <option value="shipping">Livraison</option>
                  <option value="payment">Paiement</option>
                  <option value="return">Retour</option>
                  <option value="technical">Technique</option>
                  <option value="billing">Facturation</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Nom du client *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.user}
                  onChange={(e) => setFormData({...formData, user: e.target.value})}
                  placeholder="Nom complet"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Email *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Priorité</label>
                <select 
                  className="form-select" 
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Statut</label>
                <select 
                  className="form-select" 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="open">Ouvert</option>
                  <option value="pending">En attente</option>
                  <option value="closed">Fermé</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Description *</label>
                <textarea 
                  className="form-control" 
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description détaillée du problème"
                />
              </div>
              <div className="col-12">
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-primary" 
                    onClick={handleUpdateTicket}
                    disabled={!formData.subject || !formData.user || !formData.email || !formData.description}
                  >
                    <BiSave className="me-2"/>
                    Mettre à jour
                  </button>
                  <button className="btn btn-outline-secondary" onClick={cancelEdit}>
                    <BiX className="me-2"/>Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0"><h5 className="mb-0">Tickets ({filtered.length})</h5></div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Chargement...</span></div></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Ticket</th>
                    <th>Utilisateur</th>
                    <th>Objet</th>
                    <th>Priorité</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id}>
                      <td className="align-middle">
                        <strong>{t.id}</strong>
                        <br/>
                        <small className="text-muted">{t.category}</small>
                      </td>
                      <td className="align-middle">
                        {t.user} 
                        <br/>
                        <small className="text-muted">({t.email})</small>
                      </td>
                      <td className="align-middle">
                        <div className="fw-bold">{t.subject}</div>
                        <small className="text-muted">{t.description?.substring(0, 50)}...</small>
                      </td>
                      <td className="align-middle">{priorityBadge(t.priority)}</td>
                      <td className="align-middle">{badge(t.status)}</td>
                      <td className="align-middle">
                        <div>
                          <small className="text-muted">
                            <BiCalendar className="me-1" />
                            {new Date(t.createdAt).toLocaleDateString()}
                          </small>
                          {t.updatedAt !== t.createdAt && (
                            <>
                              <br/>
                              <small className="text-info">
                                Modifié: {new Date(t.updatedAt).toLocaleDateString()}
                              </small>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-sm btn-outline-info" 
                            onClick={() => handleViewTicket(t)}
                            title="Voir les détails"
                          >
                            <BiShow />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-primary" 
                            onClick={() => handleEditTicket(t)}
                            title="Modifier"
                          >
                            <BiEdit />
                          </button>
                          
                          {t.status === 'open' && (
                            <button 
                              className="btn btn-sm btn-outline-success" 
                              onClick={() => handleTicketAction(t.id, 'close')}
                              title="Fermer"
                            >
                              <BiCheckCircle />
                            </button>
                          )}
                          
                          {t.status === 'closed' && (
                            <button 
                              className="btn btn-sm btn-outline-warning" 
                              onClick={() => handleTicketAction(t.id, 'reopen')}
                              title="Réouvrir"
                            >
                              <BiLockOpen />
                            </button>
                          )}
                          
                          {t.status !== 'archived' && (
                            <button 
                              className="btn btn-sm btn-outline-secondary" 
                              onClick={() => handleTicketAction(t.id, 'archive')}
                              title="Archiver"
                            >
                              <BiArchive />
                            </button>
                          )}
                          
                          {t.status !== 'locked' && (
                            <button 
                              className="btn btn-sm btn-outline-dark" 
                              onClick={() => handleTicketAction(t.id, 'lock')}
                              title="Verrouiller"
                            >
                              <BiLock />
                            </button>
                          )}
                          
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => setShowDeleteModal(t.id)}
                            title="Supprimer"
                          >
                            <BiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails du ticket avec messagerie */}
      {showTicketDetails && selectedTicket && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className="modal-dialog modal-xl" style={{maxWidth: '90vw'}}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Ticket {selectedTicket.id} - {selectedTicket.subject}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeTicketDetails}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* Informations du ticket */}
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">Informations du ticket</h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <strong>Client:</strong><br/>
                          {selectedTicket.user}<br/>
                          <small className="text-muted">{selectedTicket.email}</small>
                        </div>
                        <div className="mb-3">
                          <strong>Priorité:</strong> {priorityBadge(selectedTicket.priority)}
                        </div>
                        <div className="mb-3">
                          <strong>Statut:</strong> {badge(selectedTicket.status)}
                        </div>
                        <div className="mb-3">
                          <strong>Catégorie:</strong><br/>
                          <span className="badge bg-secondary">{selectedTicket.category}</span>
                        </div>
                        <div className="mb-3">
                          <strong>Créé le:</strong><br/>
                          <small>{new Date(selectedTicket.createdAt).toLocaleString()}</small>
                        </div>
                        {selectedTicket.updatedAt && selectedTicket.updatedAt !== selectedTicket.createdAt && (
                          <div className="mb-3">
                            <strong>Modifié le:</strong><br/>
                            <small>{new Date(selectedTicket.updatedAt).toLocaleString()}</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Conversation */}
                  <div className="col-md-8">
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">Conversation</h6>
                      </div>
                      <div className="card-body" style={{height: '400px', overflowY: 'auto'}}>
                        {selectedTicket.conversations && selectedTicket.conversations.length > 0 ? (
                          selectedTicket.conversations.map((msg, index) => (
                            <div key={index} className={`mb-3 ${msg.type === 'customer' ? 'text-end' : msg.type === 'internal' ? 'text-center' : ''}`}>
                              <div className={`d-inline-block p-3 rounded ${msg.type === 'customer' ? 'bg-primary text-white' : msg.type === 'internal' ? 'bg-warning text-dark' : 'bg-light'}`} style={{maxWidth: '80%'}}>
                                <div className="fw-bold small">
                                  {msg.author}
                                  {msg.type === 'internal' && ' (Note interne)'}
                                </div>
                                <div className="mt-1" style={{whiteSpace: 'pre-wrap'}}>
                                  {msg.message}
                                </div>
                                <div className="small mt-2 opacity-75">
                                  {new Date(msg.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted py-4">
                            <BiMessage className="fs-1 mb-2" />
                            <p>Aucune conversation pour ce ticket</p>
                            <small>Envoyez la première réponse ci-dessous</small>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Formulaire de réponse */}
                    <div className="card mt-3">
                      <div className="card-header">
                        <h6 className="mb-0">Répondre</h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label">Templates de réponse</label>
                          <div className="btn-group w-100" role="group">
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleTemplateSelect('greeting')}
                            >
                              Accueil
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleTemplateSelect('followup')}
                            >
                              Suivi
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleTemplateSelect('resolution')}
                            >
                              Résolution
                            </button>
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleTemplateSelect('escalation')}
                            >
                              Escalade
                            </button>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label">Message</label>
                          <textarea 
                            className="form-control" 
                            rows="4"
                            value={responseData.message}
                            onChange={(e) => setResponseData({...responseData, message: e.target.value})}
                            placeholder="Tapez votre réponse..."
                          />
                        </div>

                        <div className="mb-3">
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="internalNote"
                              checked={responseData.isInternal}
                              onChange={(e) => setResponseData({...responseData, isInternal: e.target.checked})}
                            />
                            <label className="form-check-label" htmlFor="internalNote">
                              Note interne (visible uniquement par l'équipe)
                            </label>
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-primary"
                            onClick={handleSendResponse}
                            disabled={!responseData.message.trim()}
                          >
                            <BiMessage className="me-2"/>
                            Envoyer la réponse
                          </button>
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => setResponseData({...responseData, message: '', template: ''})}
                          >
                            Effacer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeTicketDetails}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmer la suppression</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Êtes-vous sûr de vouloir supprimer le ticket <strong>{showDeleteModal}</strong> ?</p>
                <p className="text-danger small">Cette action est irréversible.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(null)}
                >
                  Annuler
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => handleDeleteTicket(showDeleteModal)}
                >
                  <BiTrash className="me-2"/>Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-muted small mt-3 d-flex align-items-center">
        <BiInfoCircle className="me-2"/>Interface de support avec gestion complète des tickets.
      </div>
    </div>
  );
}


