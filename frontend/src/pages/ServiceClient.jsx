import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import '../amazon-like.css';
import { saveTicket, getTickets, addConversation } from '../utils/ticketStorage';
import realtimeChat from '../utils/realtimeChat';
import AIChatWidget from '../components/AIChatWidget';
import supportService from '../services/supportService';
import notificationService from '../services/notificationService';
import supportNotificationService from '../services/supportNotificationService';
import { useNotificationSystem } from '../contexts/NotificationSystemContext';

const sujetsPopulaires = [
  { icon: 'bi bi-box-seam', titre: 'Suivre ma commande', desc: 'Consultez le statut de vos commandes et livraisons.', lien: '/commandes' },
  { icon: 'bi bi-arrow-repeat', titre: 'Retourner un article', desc: 'Démarrez une procédure de retour ou d\'échange.', lien: '/commandes#retours' },
  { icon: 'bi bi-cash-coin', titre: 'Remboursements', desc: 'Vérifiez le statut de vos remboursements.', lien: '/commandes#remboursements' },
  { icon: 'bi bi-truck', titre: 'Problème de livraison', desc: 'Signalez un retard ou un colis non reçu.', lien: '/commandes#livraison' },
  { icon: 'bi bi-credit-card', titre: 'Paiement', desc: 'Gérez vos moyens de paiement et factures.', lien: '/paiement' },
  { icon: 'bi bi-person', titre: 'Mon compte', desc: 'Modifiez vos informations personnelles et adresses.', lien: '/profil' },
];

const baseConnaissances = [
  {
    categorie: 'Commandes',
    articles: [
      { titre: 'Comment suivre ma commande ?', contenu: 'Rendez-vous dans votre espace client, section "Mes commandes" pour voir le statut en temps réel de vos commandes.' },
      { titre: 'Comment annuler une commande ?', contenu: 'Vous pouvez annuler une commande tant qu\'elle n\'a pas été expédiée, depuis votre espace client.' },
      { titre: 'Modifier l\'adresse de livraison', contenu: 'Vous pouvez modifier votre adresse de livraison tant que la commande n\'est pas expédiée.' },
      { titre: 'Problème avec ma commande', contenu: 'Contactez notre service client pour toute question concernant votre commande.' }
    ]
  },
  {
    categorie: 'Retours & Remboursements',
    articles: [
      { titre: 'Comment retourner un article ?', contenu: 'Cliquez sur "Retourner un article" dans votre espace client et suivez les instructions.' },
      { titre: 'Délai de remboursement', contenu: 'Le remboursement est effectué sous 3 à 5 jours après réception du retour.' },
      { titre: 'Articles non remboursables', contenu: 'Certains articles comme les produits personnalisés ne peuvent pas être retournés.' },
      { titre: 'Échange d\'article', contenu: 'Vous pouvez demander un échange en contactant notre service client.' }
    ]
  },
  {
    categorie: 'Livraison',
    articles: [
      { titre: 'Délais de livraison', contenu: 'Les délais varient selon votre localisation et le mode de livraison choisi.' },
      { titre: 'Colis en retard', contenu: 'Vérifiez le suivi et contactez le service client si le retard dépasse les délais annoncés.' },
      { titre: 'Colis non reçu', contenu: 'Si votre colis n\'arrive pas, contactez immédiatement notre service client.' },
      { titre: 'Livraison à l\'étranger', contenu: 'Nous livrons dans 15 pays. Les frais de douane peuvent s\'appliquer.' }
    ]
  },
  {
    categorie: 'Compte & Paiement',
    articles: [
      { titre: 'Changer mon mot de passe', contenu: 'Allez dans "Mon compte" puis "Sécurité" pour modifier votre mot de passe.' },
      { titre: 'Ajouter une carte bancaire', contenu: 'Rendez-vous dans "Paiement" puis "Ajouter un moyen de paiement".' },
      { titre: 'Paiement sécurisé', contenu: 'Tous nos paiements sont sécurisés par cryptage SSL.' },
      { titre: 'Factures et reçus', contenu: 'Vos factures sont disponibles dans votre espace client.' }
    ]
  }
];

const problemesCourants = [
  { probleme: 'Ma commande n\'arrive pas', solution: 'Vérifiez le suivi de livraison et contactez-nous si nécessaire.' },
  { probleme: 'Je ne peux pas me connecter', solution: 'Vérifiez vos identifiants ou utilisez la récupération de mot de passe.' },
  { probleme: 'Paiement refusé', solution: 'Vérifiez les informations de votre carte ou essayez un autre moyen de paiement.' },
  { probleme: 'Article défectueux', solution: 'Contactez-nous immédiatement pour organiser un retour et remboursement.' },
  { probleme: 'Erreur sur le site', solution: 'Actualisez la page ou contactez notre support technique.' },
];

const videosTutoriales = [
  { titre: 'Comment passer une commande', url: '#', duree: '2:30', description: 'Guide complet pour commander sur papasow' },
  { titre: 'Gérer mon compte', url: '#', duree: '3:15', description: 'Modifier vos informations personnelles' },
  { titre: 'Retourner un article', url: '#', duree: '1:45', description: 'Procédure de retour étape par étape' },
  { titre: 'Suivre ma livraison', url: '#', duree: '2:00', description: 'Comment suivre vos commandes' },
];

const contactMethods = [
  {
    icon: 'bi bi-telephone-fill',
    title: 'Téléphone',
    desc: 'Service client disponible 7j/7',
    contact: '611819930',
    availability: 'Lun-Ven: 8h-20h | Sam-Dim: 9h-18h',
    color: 'primary',
    action: 'Appeler maintenant'
  },
  {
    icon: 'bi bi-envelope-fill',
    title: 'Email',
    desc: 'Réponse sous 24h',
    contact: 'sowdian57@gmail.com',
    availability: 'Réponse garantie sous 24h',
    color: 'success',
    action: 'Envoyer un email'
  },
  {
    icon: 'bi bi-chat-dots-fill',
    title: 'Chat en ligne',
    desc: 'Assistance immédiate',
    contact: 'Chat disponible',
    availability: 'Lun-Ven: 9h-19h | Sam: 9h-17h',
    color: 'warning',
    action: 'Démarrer le chat'
  },
  {
    icon: 'bi bi-whatsapp',
    title: 'WhatsApp',
    desc: 'Support via WhatsApp',
    contact: '666706273',
    availability: 'Lun-Ven: 9h-18h',
    color: 'success',
    action: 'WhatsApp'
  }
];

export default function ServiceClient() {
  const [search, setSearch] = useState('');
  const [faqOpen, setFaqOpen] = useState(null);
  const [activeTab, setActiveTab] = useState('centre-aide');
  const notificationSystem = useNotificationSystem();
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // États pour le formulaire de contact
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // États pour les conversations
  const [userTickets, setUserTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  
  // États pour l'API
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [useApi, setUseApi] = useState(true); // Toggle entre API et localStorage
  
  // États pour le chat temps réel
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [newMessageNotification, setNewMessageNotification] = useState(null);
  
  // État pour le chat IA
  const [showAIChat, setShowAIChat] = useState(false);
  
  // État pour les notifications
  const [notifications, setNotifications] = useState([]);
  const [notificationStats, setNotificationStats] = useState({
    orders: { total: 0, pending: 0, today: 0 },
    tickets: { total: 0, open: 0, today: 0 }
  });

  // Détecter l'ancre dans l'URL au chargement
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['centre-aide', 'contact', 'faq', 'base-connaissances'].includes(hash)) {
      setActiveTab(hash);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  // Initialiser le service de notifications de support
  useEffect(() => {
    supportNotificationService.setNotificationSystem(notificationSystem);
  }, [notificationSystem]);

  // Fonction de recherche
  const handleSearch = (query) => {
    setSearch(query);
    if (query.length > 2) {
      const results = [];
      baseConnaissances.forEach(cat => {
        cat.articles.forEach(article => {
          if (article.titre.toLowerCase().includes(query.toLowerCase()) ||
              article.contenu.toLowerCase().includes(query.toLowerCase())) {
            results.push({ ...article, categorie: cat.categorie });
          }
        });
      });
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    setShowSearchResults(false);
  };

  // Gestion du formulaire de contact
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);

    try {
      // Créer le ticket
      const ticket = {
        subject: formData.sujet,
        user: `${formData.prenom} ${formData.nom}`,
        email: formData.email,
        priority: getPriorityFromSubject(formData.sujet),
        status: 'open',
        description: formData.message,
        category: getCategoryFromSubject(formData.sujet),
        telephone: formData.telephone
      };

      let savedTicket;
      
      if (useApi) {
        // Utiliser l'API backend
        const response = await supportService.createTicket(ticket);
        savedTicket = response.data;
        console.log('✅ Ticket créé via API:', savedTicket);
        
        // Notifier l'admin du nouveau ticket
        supportNotificationService.notifyAdminNewTicket(savedTicket);
      } else {
        // Utiliser le localStorage (fallback)
        savedTicket = saveTicket(ticket);
        console.log('✅ Ticket créé via localStorage:', savedTicket);
        
        // Notifier l'admin du nouveau ticket (simulation)
        supportNotificationService.notifyAdminNewTicket(savedTicket);
      }
      
      // Réinitialiser le formulaire
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
      });
      
      setSubmitSuccess(true);
      
      // Recharger les conversations si on est sur l'onglet
      if (activeTab === 'mes-conversations') {
        loadUserTickets();
      }
      
      // Masquer le message de succès après 5 secondes
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Erreur lors de la création du ticket:', error);
      setApiError(error.message);
      
      // Fallback vers localStorage si l'API échoue
      if (useApi) {
        console.log('🔄 Fallback vers localStorage...');
        try {
          const fallbackTicket = saveTicket(ticket);
          setSubmitSuccess(true);
          setApiError(null);
        } catch (fallbackError) {
          console.error('Erreur fallback:', fallbackError);
          alert('Une erreur est survenue. Veuillez réessayer.');
        }
      } else {
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Déterminer la priorité basée sur le sujet
  const getPriorityFromSubject = (sujet) => {
    const highPrioritySubjects = ['livraison', 'paiement'];
    const mediumPrioritySubjects = ['retour', 'commande'];
    
    const sujetLower = sujet.toLowerCase();
    
    if (highPrioritySubjects.some(keyword => sujetLower.includes(keyword))) {
      return 'high';
    } else if (mediumPrioritySubjects.some(keyword => sujetLower.includes(keyword))) {
      return 'medium';
    } else {
      return 'low';
    }
  };

  // Déterminer la catégorie basée sur le sujet
  const getCategoryFromSubject = (sujet) => {
    const sujetLower = sujet.toLowerCase();
    
    if (sujetLower.includes('commande') || sujetLower.includes('order')) {
      return 'commande';
    } else if (sujetLower.includes('retour') || sujetLower.includes('return')) {
      return 'retour';
    } else if (sujetLower.includes('livraison') || sujetLower.includes('delivery') || sujetLower.includes('shipping')) {
      return 'livraison';
    } else if (sujetLower.includes('compte') || sujetLower.includes('account') || sujetLower.includes('profil')) {
      return 'compte';
    } else if (sujetLower.includes('paiement') || sujetLower.includes('payment') || sujetLower.includes('facture')) {
      return 'paiement';
    } else {
      return 'autre';
    }
  };

  // Charger les tickets de l'utilisateur
  const loadUserTickets = async () => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      if (useApi) {
        // Utiliser l'API backend
        const response = await supportService.getTickets({
          sortBy: 'createdAt',
          sortOrder: 'desc',
          limit: 50
        });
        
        const tickets = response.data.tickets || [];
        setUserTickets(tickets);
        console.log('✅ Tickets chargés via API:', tickets.length);
      } else {
        // Utiliser le localStorage (fallback)
        const allTickets = getTickets();
        // Pour la démo, on affiche TOUS les tickets récents
        // En réalité, on filtrerait par l'email de l'utilisateur connecté
        const recentTickets = allTickets.filter(ticket => {
          // Afficher les tickets des 7 derniers jours
          const ticketDate = new Date(ticket.createdAt);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return ticketDate > weekAgo;
        });
        setUserTickets(recentTickets);
        console.log('✅ Tickets chargés via localStorage:', recentTickets.length);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tickets:', error);
      setApiError(error.message);
      
      // Fallback vers localStorage si l'API échoue
      if (useApi) {
        console.log('🔄 Fallback vers localStorage...');
        try {
          const allTickets = getTickets();
          const recentTickets = allTickets.filter(ticket => {
            const ticketDate = new Date(ticket.createdAt);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return ticketDate > weekAgo;
          });
          setUserTickets(recentTickets);
          setApiError(null);
        } catch (fallbackError) {
          console.error('Erreur fallback:', fallbackError);
          setUserTickets([]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les notifications
  const loadNotifications = async () => {
    try {
      if (useApi) {
        const response = await notificationService.getAdminNotifications();
        setNotifications(response.notifications || []);
        setNotificationStats(response.stats || {
          orders: { total: 0, pending: 0, today: 0 },
          tickets: { total: 0, open: 0, today: 0 }
        });
        console.log('✅ Notifications chargées via API:', response.notifications?.length || 0);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des notifications:', error);
    }
  };

  // Ouvrir les détails d'un ticket
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  // Envoyer une réponse
  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      alert('Veuillez saisir un message');
      return;
    }

    setIsReplying(true);
    setApiError(null);
    
    try {
      const newConversation = {
        type: 'customer',
        message: replyMessage,
        author: selectedTicket.user
      };

      let updatedTicket;
      
      if (useApi) {
        // Utiliser l'API backend
        const response = await supportService.addConversation(selectedTicket._id || selectedTicket.id, newConversation);
        updatedTicket = response.data;
        console.log('✅ Conversation ajoutée via API:', updatedTicket);
      } else {
        // Utiliser le localStorage (fallback)
        updatedTicket = addConversation(selectedTicket.id, newConversation);
        console.log('✅ Conversation ajoutée via localStorage:', updatedTicket);
      }
      
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
        setUserTickets(userTickets.map(ticket => 
          (ticket._id || ticket.id) === (selectedTicket._id || selectedTicket.id) ? updatedTicket : ticket
        ));
        
        // Envoyer via le chat temps réel
        realtimeChat.sendMessage(selectedTicket.id, newConversation);
        
        setReplyMessage('');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      setApiError(error.message);
      
      // Fallback vers localStorage si l'API échoue
      if (useApi) {
        console.log('🔄 Fallback vers localStorage...');
        try {
          const updatedTicket = addConversation(selectedTicket.id, newConversation);
          if (updatedTicket) {
            setSelectedTicket(updatedTicket);
            setUserTickets(userTickets.map(ticket => 
              ticket.id === selectedTicket.id ? updatedTicket : ticket
            ));
            setReplyMessage('');
            setApiError(null);
          }
        } catch (fallbackError) {
          console.error('Erreur fallback:', fallbackError);
          alert('Une erreur est survenue. Veuillez réessayer.');
        }
      } else {
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setIsReplying(false);
    }
  };

  // Charger les tickets quand on change d'onglet
  useEffect(() => {
    if (activeTab === 'mes-conversations') {
      loadUserTickets();
    }
    // Charger les notifications au chargement de la page
    loadNotifications();
  }, [activeTab]);

  // Gestion du chat temps réel
  useEffect(() => {
    // Se connecter au chat temps réel
    realtimeChat.connect().then(() => {
      setIsRealtimeConnected(true);
      console.log('✅ Chat temps réel connecté');
    });

    // Écouter les nouveaux messages
    const handleNewMessage = (data) => {
      console.log('📨 Nouveau message reçu:', data);
      
      // Mettre à jour les tickets
      loadUserTickets();
      
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
    realtimeChat.startTyping(ticketId, 'client');
    
    // Arrêter la frappe après 3 secondes d'inactivité
    setTimeout(() => {
      realtimeChat.stopTyping(ticketId, 'client');
    }, 3000);
  };

  return (
    <>
      <div className="container-fluid py-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        <div className="row">
          <div className="col-12">
            <div className="text-center mb-5">
              <h1 className="mb-3 text-warning fw-bold" style={{fontSize: '2.5rem'}}>
                <i className="bi bi-headset me-3"></i>
                Service Client
              </h1>
              <p className="lead text-muted">Nous sommes là pour vous aider 24h/24 et 7j/7</p>
              
              {/* Indicateur de statut API */}
              <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className={`badge ${useApi ? 'bg-success' : 'bg-secondary'}`}>
                    <i className={`bi ${useApi ? 'bi-cloud-check' : 'bi-hdd'}`}></i>
                    {useApi ? 'API Backend' : 'Local Storage'}
                  </div>
                  {isLoading && (
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Chargement...</span>
                    </div>
                  )}
                </div>
                
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setUseApi(!useApi)}
                  disabled={isLoading}
                >
                  <i className={`bi ${useApi ? 'bi-hdd' : 'bi-cloud-check'}`}></i>
                  Basculer vers {useApi ? 'Local Storage' : 'API Backend'}
                </button>
              </div>
              
              {/* Message d'erreur API */}
              {apiError && (
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Erreur API:</strong> {apiError}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setApiError(null)}
                  ></button>
                </div>
              )}
            </div>
            
            {/* Barre de recherche principale */}
            <div className="row justify-content-center mb-5">
              <div className="col-12 col-lg-8">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Rechercher dans l'aide..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ borderRadius: '25px', paddingLeft: '50px', border: '2px solid #e47911' }}
                  />
                  <i className="bi bi-search position-absolute" style={{ left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#e47911' }}></i>
                  
                  {/* Résultats de recherche */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="position-absolute w-100 bg-white border rounded shadow-lg" style={{ top: '100%', zIndex: 1000, maxHeight: '400px', overflowY: 'auto' }}>
                      {searchResults.map((result, index) => (
                        <div key={index} className="p-3 border-bottom hover-bg-light" style={{ cursor: 'pointer' }}>
                          <div className="fw-bold text-primary">{result.titre}</div>
                          <div className="small text-muted">{result.categorie}</div>
                          <div className="small">{result.contenu.substring(0, 100)}...</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation par onglets */}
            <ul className="nav nav-tabs mb-4 justify-content-center" id="serviceClientTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'centre-aide' ? 'active' : ''}`}
                  onClick={() => handleTabClick('centre-aide')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-question-circle me-2"></i>
                  Centre d'aide
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'base-connaissances' ? 'active' : ''}`}
                  onClick={() => handleTabClick('base-connaissances')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-book me-2"></i>
                  Base de connaissances
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'mes-conversations' ? 'active' : ''}`}
                  onClick={() => handleTabClick('mes-conversations')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-chat-dots me-2"></i>
                  Mes conversations
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                  onClick={() => handleTabClick('contact')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-headset me-2"></i>
                  Contact
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`}
                  onClick={() => handleTabClick('faq')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-chat-quote me-2"></i>
                  FAQ
                </button>
              </li>
            </ul>

            {/* Contenu des onglets */}
            <div className="tab-content" id="serviceClientTabContent">
              
              {/* Section Centre d'aide */}
              <div className={`tab-pane fade ${activeTab === 'centre-aide' ? 'show active' : ''}`}>
                <div className="row g-4">
                  {sujetsPopulaires.map((s, i) => (
                    <div className="col-12 col-md-4" key={i}>
                      <div className="card h-100 shadow-sm border-0 hover-shadow" style={{ transition: 'transform 0.2s' }}>
                        <div className="card-body d-flex flex-row align-items-center gap-3 p-4">
                          <div className={`bg-${s.icon.includes('box') ? 'primary' : s.icon.includes('arrow') ? 'warning' : s.icon.includes('cash') ? 'success' : s.icon.includes('truck') ? 'info' : s.icon.includes('credit') ? 'danger' : 'secondary'} rounded-circle d-flex align-items-center justify-content-center`} style={{width: 60, height: 60}}>
                            <i className={s.icon + " text-white fs-3"}></i>
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="fw-bold mb-2" style={{fontSize: '1.1rem'}}>{s.titre}</h5>
                            <p className="text-muted mb-0 small">{s.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Problèmes courants */}
                <div className="mt-5">
                  <h3 className="mb-4 text-center">
                    <i className="bi bi-exclamation-triangle me-2 text-warning"></i>
                    Problèmes courants
                  </h3>
                  <div className="row g-3">
                    {problemesCourants.map((p, i) => (
                      <div className="col-12 col-md-6" key={i}>
                        <div className="card border-warning">
                          <div className="card-body">
                            <h6 className="card-title text-warning fw-bold">{p.probleme}</h6>
                            <p className="card-text small">{p.solution}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vidéos tutorielles */}
                <div className="mt-5">
                  <h3 className="mb-4 text-center">
                    <i className="bi bi-play-circle me-2 text-primary"></i>
                    Vidéos tutorielles
                  </h3>
                  <div className="row g-4">
                    {videosTutoriales.map((v, i) => (
                      <div className="col-12 col-md-6 col-lg-3" key={i}>
                        <div className="card h-100">
                          <div className="card-body text-center">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: 60, height: 60}}>
                              <i className="bi bi-play-fill text-white fs-4"></i>
                            </div>
                            <h6 className="fw-bold">{v.titre}</h6>
                            <p className="small text-muted">{v.description}</p>
                            <span className="badge bg-secondary">{v.duree}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section Base de connaissances */}
              <div className={`tab-pane fade ${activeTab === 'base-connaissances' ? 'show active' : ''}`}>
                <div className="row">
                  {baseConnaissances.map((categorie, index) => (
                    <div className="col-12 col-lg-6 mb-4" key={index}>
                      <div className="card h-100">
                        <div className="card-header bg-primary text-white">
                          <h5 className="mb-0">
                            <i className="bi bi-folder me-2"></i>
                            {categorie.categorie}
                          </h5>
                        </div>
                        <div className="card-body">
                          <div className="list-group list-group-flush">
                            {categorie.articles.map((article, artIndex) => (
                              <div key={artIndex} className="list-group-item border-0 px-0">
                                <h6 className="fw-bold text-primary mb-2">{article.titre}</h6>
                                <p className="small text-muted mb-0">{article.contenu}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Mes conversations */}
              <div className={`tab-pane fade ${activeTab === 'mes-conversations' ? 'show active' : ''}`}>
                <div className="row">
                  <div className="col-12">
                    <div className="text-center mb-4">
                      <h3 className="text-primary fw-bold">
                        <i className="bi bi-chat-dots me-2"></i>
                        Mes conversations
                        {isRealtimeConnected && (
                          <span className="badge bg-success ms-2" title="Chat temps réel actif">
                            <i className="bi bi-wifi me-1"></i>
                            Temps réel
                          </span>
                        )}
                        {notifications.length > 0 && (
                          <span className="badge bg-warning ms-2" title={`${notifications.length} notifications`}>
                            <i className="bi bi-bell me-1"></i>
                            {notifications.length}
                          </span>
                        )}
                      </h3>
                      <p className="text-muted">Consultez l'historique de vos échanges avec notre équipe support</p>
                    </div>

                    {/* Notification de nouveau message */}
                    {newMessageNotification && (
                      <div className="alert alert-info alert-dismissible fade show" role="alert">
                        <i className="bi bi-bell me-2"></i>
                        <strong>Nouveau message !</strong> Vous avez reçu une réponse sur le ticket {newMessageNotification.ticketId}
                        <button 
                          type="button" 
                          className="btn-close" 
                          onClick={() => setNewMessageNotification(null)}
                        ></button>
                      </div>
                    )}

                    {isLoading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary mb-3" role="status">
                          <span className="visually-hidden">Chargement...</span>
                        </div>
                        <p className="text-muted">Chargement de vos conversations...</p>
                      </div>
                    ) : userTickets.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="bi bi-chat-dots text-muted" style={{fontSize: '4rem'}}></i>
                        <h4 className="text-muted mt-3">Aucune conversation</h4>
                        <p className="text-muted">Vous n'avez pas encore de conversation avec notre équipe support.</p>
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleTabClick('contact')}
                        >
                          <i className="bi bi-plus me-2"></i>
                          Créer une nouvelle demande
                        </button>
                      </div>
                    ) : (
                      <div className="row g-3">
                        {userTickets.map(ticket => (
                          <div key={ticket.id} className="col-12">
                            <div className="card border-0 shadow-sm">
                              <div className="card-body">
                                <div className="row align-items-center">
                                  <div className="col-md-8">
                                    <div className="d-flex align-items-center mb-2">
                                      <h5 className="mb-0 me-3">{ticket.subject}</h5>
                                      <span className={`badge ${
                                        ticket.priority === 'high' ? 'bg-danger' :
                                        ticket.priority === 'medium' ? 'bg-warning' : 'bg-info'
                                      }`}>
                                        {ticket.priority === 'high' ? 'Haute' :
                                         ticket.priority === 'medium' ? 'Moyenne' : 'Basse'}
                                      </span>
                                    </div>
                                    <p className="text-muted mb-2">{ticket.description}</p>
                                    <small className="text-muted">
                                      <i className="bi bi-calendar me-1"></i>
                                      Créé le {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                                    </small>
                                  </div>
                                  <div className="col-md-4 text-end">
                                    <div className="mb-2">
                                      <span className={`badge ${
                                        ticket.status === 'open' ? 'bg-success' :
                                        ticket.status === 'pending' ? 'bg-warning' :
                                        ticket.status === 'closed' ? 'bg-secondary' : 'bg-info'
                                      }`}>
                                        {ticket.status === 'open' ? 'Ouvert' :
                                         ticket.status === 'pending' ? 'En cours' :
                                         ticket.status === 'closed' ? 'Fermé' : ticket.status}
                                      </span>
                                    </div>
                                    <div className="mb-2">
                                      <small className="text-muted">
                                        {ticket.conversations?.length || 0} message(s)
                                      </small>
                                    </div>
                                    <button 
                                      className="btn btn-outline-primary btn-sm"
                                      onClick={() => handleViewTicket(ticket)}
                                    >
                                      <i className="bi bi-eye me-1"></i>
                                      Voir la conversation
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section Contact service client */}
              <div className={`tab-pane fade ${activeTab === 'contact' ? 'show active' : ''}`}>
                <div className="row g-4 mb-5">
                  {contactMethods.map((method, i) => (
                    <div className="col-12 col-md-6 col-lg-3" key={i}>
                      <div className="card h-100 shadow-sm border-0 hover-shadow">
                        <div className="card-body text-center p-4">
                          <div className={`bg-${method.color} rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3`} style={{width: 70, height: 70}}>
                            <i className={method.icon + " text-white fs-2"}></i>
                          </div>
                          <h5 className="fw-bold mb-2">{method.title}</h5>
                          <p className="text-muted small mb-2">{method.desc}</p>
                          <div className="fw-bold text-primary mb-2">{method.contact}</div>
                          <div className="text-muted small mb-3">{method.availability}</div>
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                              if (method.title === 'Chat en ligne') {
                                setShowAIChat(true);
                              } else if (method.title === 'Téléphone') {
                                window.open(`tel:${method.contact}`, '_self');
                              } else if (method.title === 'Email') {
                                window.open(`mailto:${method.contact}?subject=Demande de support Papasow`, '_blank');
                              } else if (method.title === 'WhatsApp') {
                                window.open(`https://wa.me/${method.contact}?text=Bonjour, j'ai besoin d'aide avec mon compte Papasow`, '_blank');
                              }
                            }}
                          >
                            {method.action}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Formulaire de contact amélioré */}
                <div className="row">
                  <div className="col-12 col-lg-8 mx-auto">
                    <div className="card shadow-sm border-0">
                      <div className="card-header bg-primary text-white">
                        <h4 className="mb-0 fw-bold">
                          <i className="bi bi-envelope me-2"></i>
                          Nous contacter
                        </h4>
                      </div>
                      <div className="card-body p-4">
                        {submitSuccess && (
                          <div className="alert alert-success alert-dismissible fade show" role="alert">
                            <i className="bi bi-check-circle me-2"></i>
                            <strong>Message envoyé avec succès !</strong> Votre demande a été transmise à notre équipe. 
                            Vous recevrez une réponse dans les plus brefs délais.
                            <button type="button" className="btn-close" onClick={() => setSubmitSuccess(false)}></button>
                          </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Prénom *</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleInputChange}
                                required 
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Nom *</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                name="nom"
                                value={formData.nom}
                                onChange={handleInputChange}
                                required 
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Email *</label>
                              <input 
                                type="email" 
                                className="form-control" 
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required 
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Téléphone</label>
                              <input 
                                type="tel" 
                                className="form-control" 
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label fw-bold">Sujet *</label>
                              <select 
                                className="form-select" 
                                name="sujet"
                                value={formData.sujet}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Choisir un sujet</option>
                                <option value="commande">Question sur ma commande</option>
                                <option value="retour">Retour/Remboursement</option>
                                <option value="livraison">Problème de livraison</option>
                                <option value="compte">Problème de compte</option>
                                <option value="paiement">Problème de paiement</option>
                                <option value="autre">Autre</option>
                              </select>
                            </div>
                            <div className="col-12">
                              <label className="form-label fw-bold">Message *</label>
                              <textarea 
                                className="form-control" 
                                rows="5" 
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required 
                                placeholder="Décrivez votre problème en détail..."
                              ></textarea>
                            </div>
                            <div className="col-12">
                              <button 
                                type="submit" 
                                className="btn btn-primary btn-lg w-100"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Envoi en cours...
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-send me-2"></i>
                                    Envoyer le message
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section FAQ */}
              <div className={`tab-pane fade ${activeTab === 'faq' ? 'show active' : ''}`}>
                <div className="row">
                  <div className="col-12 col-lg-8 mx-auto">
                    <div className="accordion" id="faqAccordion">
                      {baseConnaissances.map((categorie, catIndex) => (
                        <div key={catIndex} className="accordion-item">
                          <h2 className="accordion-header">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${catIndex}`}>
                              <i className="bi bi-question-circle me-2 text-primary"></i>
                              {categorie.categorie}
                            </button>
                          </h2>
                          <div id={`collapse${catIndex}`} className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                            <div className="accordion-body">
                              {categorie.articles.map((article, artIndex) => (
                                <div key={artIndex} className="mb-3">
                                  <h6 className="fw-bold text-primary">{article.titre}</h6>
                                  <p className="small">{article.contenu}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de détails de conversation */}
      {showTicketDetails && selectedTicket && (
        <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-chat-dots me-2"></i>
                  {selectedTicket.subject}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowTicketDetails(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Informations du ticket */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <strong>Ticket :</strong> {selectedTicket.id}<br/>
                    <strong>Statut :</strong> 
                    <span className={`badge ms-2 ${
                      selectedTicket.status === 'open' ? 'bg-success' :
                      selectedTicket.status === 'pending' ? 'bg-warning' :
                      selectedTicket.status === 'closed' ? 'bg-secondary' : 'bg-info'
                    }`}>
                      {selectedTicket.status === 'open' ? 'Ouvert' :
                       selectedTicket.status === 'pending' ? 'En cours' :
                       selectedTicket.status === 'closed' ? 'Fermé' : selectedTicket.status}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <strong>Priorité :</strong>
                    <span className={`badge ms-2 ${
                      selectedTicket.priority === 'high' ? 'bg-danger' :
                      selectedTicket.priority === 'medium' ? 'bg-warning' : 'bg-info'
                    }`}>
                      {selectedTicket.priority === 'high' ? 'Haute' :
                       selectedTicket.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </span><br/>
                    <strong>Créé le :</strong> {new Date(selectedTicket.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                {/* Conversation */}
                <div className="border rounded p-3 mb-3" style={{maxHeight: '400px', overflowY: 'auto'}}>
                  <h6 className="mb-3">
                    <i className="bi bi-chat-text me-2"></i>
                    Conversation
                  </h6>
                  {selectedTicket.conversations && selectedTicket.conversations.length > 0 ? (
                    selectedTicket.conversations.map((msg, index) => (
                      <div key={index} className={`mb-3 p-3 rounded ${
                        msg.type === 'customer' ? 'bg-light border-start border-primary border-3' :
                        msg.type === 'agent' ? 'bg-primary text-white' :
                        'bg-warning text-dark'
                      }`}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <strong>
                            {msg.type === 'customer' ? 'Vous' :
                             msg.type === 'agent' ? 'Agent Support' :
                             'Note interne'}
                          </strong>
                          <small className="opacity-75">
                            {new Date(msg.timestamp).toLocaleString('fr-FR')}
                          </small>
                        </div>
                        <p className="mb-0">{msg.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-center py-3">Aucune conversation disponible</p>
                  )}
                </div>

                {/* Formulaire de réponse */}
                {selectedTicket.status !== 'closed' && (
                  <div className="border rounded p-3">
                    <h6 className="mb-3">
                      <i className="bi bi-reply me-2"></i>
                      Répondre
                    </h6>
                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Tapez votre message..."
                        value={replyMessage}
                        onChange={(e) => {
                          setReplyMessage(e.target.value);
                          handleTyping(selectedTicket.id);
                        }}
                      />
                    </div>
                    
                    {/* Indicateur de frappe */}
                    {typingUsers[selectedTicket.id] && (
                      <div className="mb-2">
                        <small className="text-muted">
                          <i className="bi bi-pencil me-1"></i>
                          {typingUsers[selectedTicket.id] === 'agent' ? 'Agent Support' : 'Vous'} est en train d'écrire...
                        </small>
                      </div>
                    )}
                    <div className="d-flex justify-content-end gap-2">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setShowTicketDetails(false)}
                      >
                        Fermer
                      </button>
                      <button 
                        className="btn btn-primary"
                        onClick={handleSendReply}
                        disabled={isReplying || !replyMessage.trim()}
                      >
                        {isReplying ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Envoi...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send me-2"></i>
                            Envoyer
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      
      {/* Widget de chat IA */}
      {showAIChat && <AIChatWidget onClose={() => setShowAIChat(false)} />}
    </>
  );
} 