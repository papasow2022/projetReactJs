import React, { useState, useEffect } from 'react';
import '../amazon-like.css';
import { useCommandes } from "../contexts/CommandesContext";
import { Modal, Button, Form } from 'react-bootstrap';
import { useNotifications } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import useOrders from '../hooks/useOrders';
import { useOrdersPolling } from '../hooks/useOrderPolling';
import { useOrderWebSocket, useBrowserNotifications } from '../hooks/useWebSocket';
import useTracking from '../hooks/useTracking';
import { getStatusLabel, getStatusColor, getStatusIcon } from '../constants/orderStatus';

// Pas de données de test hardcodées - chaque utilisateur a ses propres données

export default function Orders() {
  const { commandes = [], setCommandes, loadUserCommandes } = useCommandes();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getOrders, loading: ordersLoading, error: ordersError } = useOrders();
  const { 
    tracking, 
    loading: trackingLoading, 
    error: trackingError, 
    getOrderTracking, 
    getPublicTracking, 
    getMultipleOrderTracking,
    hasTracking,
    getTrackingForOrder 
  } = useTracking();
  
  // Polling automatique des commandes (mise à jour toutes les 15 secondes) - FALLBACK
  const { 
    orders: realTimeOrders, 
    loading: pollingLoading, 
    error: pollingError,
    refreshOrders 
  } = useOrdersPolling(15000);

  // WebSocket pour les mises à jour en temps réel
  const { isConnected: wsConnected } = useOrderWebSocket(
    // Callback pour les mises à jour de commandes
    (data) => {
      console.log('🔄 Mise à jour WebSocket reçue:', data);
      
      // Mettre à jour la commande spécifique
      setCommandes(prev => prev.map(cmd => 
        cmd.id === data.orderId || cmd._id === data.orderId
          ? { 
              ...cmd, 
              statut: getStatusLabel(data.newStatus),
              status: data.newStatus 
            }
          : cmd
      ));
    },
    // Callback pour les nouvelles commandes (non utilisé ici)
    null
  );

  // Notifications push du navigateur
  const { requestPermission, showNotification } = useBrowserNotifications();
  // Debug : log des commandes (désactivé pour éviter les boucles)
  // console.log('Commandes du contexte :', commandes);
  // console.log('Commandes avec suivi :', commandes.filter(c => c.suivi && c.suivi.etapes && c.suivi.etapes.length > 0));
  // console.log('Commandes livrées :', commandes.filter(c => c.statut === 'livrée'));
  const [activeTab, setActiveTab] = useState('historique');
  const [commandeSelectionnee, setCommandeSelectionnee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [avisForm, setAvisForm] = useState({ show: false, commandeId: null, produitIndex: null, note: 0, titre: '', commentaire: '', mode: 'ajout' });
  const [message, setMessage] = useState('');
  // const [erreur, setErreur] = useState(null); // On retire la gestion d'erreur ici
  const [showRetourModal, setShowRetourModal] = useState(false);
  const [retourCommande, setRetourCommande] = useState(null);
  const [retourProduits, setRetourProduits] = useState([]);
  const [retourRaison, setRetourRaison] = useState('');
  const [retourAutre, setRetourAutre] = useState('');
  const [retourCommentaire, setRetourCommentaire] = useState('');
  const [retourType, setRetourType] = useState('Remboursement');
  const [retours, setRetours] = useState([]);
  const [echanges, setEchanges] = useState([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [clientNote, setClientNote] = useState('');
  
  // États pour le suivi
  const [trackingDetails, setTrackingDetails] = useState({});
  const [showPublicTrackingModal, setShowPublicTrackingModal] = useState(false);
  const [publicTrackingForm, setPublicTrackingForm] = useState({ orderNumber: '', email: '' });
  const [publicTrackingResult, setPublicTrackingResult] = useState(null);

  const raisonsRetour = [
    'Produit défectueux',
    'Mauvaise taille/couleur',
    'Produit non conforme à la description',
    'Changement d\'avis',
    'Autre'
  ];

  const handleOpenRetourModal = (commande) => {
    setRetourCommande(commande);
    setRetourProduits([]);
    setRetourRaison('');
    setRetourAutre('');
    setRetourCommentaire('');
    setRetourType('Remboursement');
    setShowRetourModal(true);
  };
  const handleCloseRetourModal = () => {
    setShowRetourModal(false);
    setRetourCommande(null);
  };
  const handleToggleProduit = (idx) => {
    setRetourProduits(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };
  const handleValiderRetour = (e) => {
    e.preventDefault();
    
    // Validation : s'assurer qu'au moins un produit est sélectionné
    if (retourProduits.length === 0) {
      setMessage('Veuillez sélectionner au moins un produit à retourner.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    // Validation : s'assurer qu'une raison est sélectionnée
    if (!retourRaison || (retourRaison === 'Autre' && !retourAutre.trim())) {
      setMessage('Veuillez sélectionner une raison pour le retour.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    const now = new Date();
    const retour = {
      id: 'RET-' + Math.floor(100000 + Math.random() * 900000),
      commandeId: retourCommande.id,
      dateAchat: retourCommande.date,
      dateDemande: now.toISOString(),
      produits: retourProduits.map(idx => retourCommande.produits[idx]),
      raison: retourRaison === 'Autre' ? retourAutre : retourRaison,
      commentaire: retourCommentaire,
      type: retourType,
      statut: 'En attente de validation'
    };
    const newRetours = [retour, ...retours];
    setRetours(newRetours);
    if (user && user.email) {
      const userKeyRetours = `retours_${user.email}`;
      localStorage.setItem(userKeyRetours, JSON.stringify(newRetours));
    }
    setShowRetourModal(false);
    setRetourCommande(null);
    setMessage('Votre demande de retour a été enregistrée.');
    
    // Notification de succès
    addNotification(
      'Demande de retour enregistrée avec succès',
      'success',
      {
        details: `Retour #${retour.id} - En attente de validation par le vendeur`
      }
    );
    
    setTimeout(() => setMessage(''), 3000);
  };

  // Fonctions pour gérer le suivi
  const loadTrackingForOrder = async (orderId) => {
    try {
      const trackingData = await getOrderTracking(orderId);
      if (trackingData) {
        setTrackingDetails(prev => ({
          ...prev,
          [orderId]: trackingData
        }));
      }
    } catch (error) {
      console.error('Erreur chargement suivi:', error);
      addNotification(
        'Erreur lors du chargement du suivi',
        'error'
      );
    }
  };

  const loadAllTrackingData = async () => {
    if (commandes.length === 0) return;
    
    try {
      // Récupérer les IDs des commandes qui ont un suivi backend
      const orderIds = commandes
        .filter(cmd => cmd._id || cmd.id)
        .map(cmd => cmd._id || cmd.id);
      
      if (orderIds.length > 0) {
        const trackingData = await getMultipleOrderTracking(orderIds);
        setTrackingDetails(prev => ({ ...prev, ...trackingData }));
      }
    } catch (error) {
      console.error('Erreur chargement suivi multiple:', error);
    }
  };

  const handlePublicTracking = async (e) => {
    e.preventDefault();
    try {
      const result = await getPublicTracking(publicTrackingForm.orderNumber, publicTrackingForm.email);
      setPublicTrackingResult(result);
      if (result) {
        addNotification(
          'Suivi public récupéré avec succès',
          'success'
        );
      } else {
        addNotification(
          'Aucun suivi trouvé pour cette commande',
          'warning'
        );
      }
    } catch (error) {
      console.error('Erreur suivi public:', error);
      addNotification(
        'Erreur lors de la récupération du suivi public',
        'error'
      );
    }
  };

  const openPublicTrackingModal = () => {
    setShowPublicTrackingModal(true);
    setPublicTrackingForm({ orderNumber: '', email: '' });
    setPublicTrackingResult(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Convertir le statut backend vers le statut frontend
  const getReturnStatusText = (status) => {
    const statusMap = {
      'requested': 'En attente de validation',
      'approved': 'Approuvé',
      'shipped': 'Expédié',
      'received': 'Reçu',
      'inspected': 'Inspecté',
      'approved_refund': 'Remboursement approuvé',
      'rejected': 'Refusé',
      'refund_processed': 'Remboursement traité',
      'refund_completed': 'Remboursement terminé',
      'cancelled': 'Annulé'
    };
    return statusMap[status] || status;
  };

  // Charger les retours depuis le backend
  const loadReturnsFromBackend = async () => {
    if (!user) return;
    
    try {
      console.log('🔄 Chargement des retours depuis le backend...');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.warn('⚠️ Token d\'authentification manquant');
        return;
      }
      
      const response = await fetch(`${baseUrl}/api/returns/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.returns) {
          console.log('✅ Retours chargés depuis le backend:', data.returns.length);
          
          // Convertir le format backend vers le format frontend
          const convertedReturns = data.returns.map(retour => {
            console.log('🔄 Formatage retour:', {
              returnNumber: retour.returnNumber,
              requestedDate: retour.requestedDate,
              returnReason: retour.returnReason,
              returnDetails: retour.returnDetails
            });
            
            return {
            id: retour.returnNumber,
            _id: retour._id, // ID MongoDB pour les requêtes API
            numero: retour.returnNumber,
            commande: retour.orderNumber,
            date: new Date(retour.requestedDate).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            type: 'Remboursement',
            raison: retour.returnDetails || retour.returnReason || (retour.items && retour.items[0] && retour.items[0].description) || 'Non spécifiée',
            commentaire: retour.returnDetails,
            commentaireInitial: retour.returnDetails, // Commentaire initial de la demande
            notesAdmin: retour.adminNotes,
            notesClient: retour.customerNotes,
            statut: getReturnStatusText(retour.status),
            produits: (retour.items || []).map(item => ({
              nom: item.productName,
              name: item.productName,
              image: item.productImage ? `${item.productImage}` : '/assets/placeholder-product.svg',
              prix: item.price,
              qte: item.quantity
            })),
            montant: retour.refund?.amount || 0
            };
          });
          
          setRetours(convertedReturns);
          
          // Sauvegarder dans localStorage pour compatibilité
          const userKeyRetours = `retours_${user.email}`;
          localStorage.setItem(userKeyRetours, JSON.stringify(convertedReturns));
        }
      } else {
        console.error('❌ Erreur chargement retours:', response.status);
      }
    } catch (error) {
      console.error('❌ Erreur chargement retours:', error);
    }
  };

  // Fonction pour sauvegarder la note du client
  const handleSaveClientNote = async () => {
    if (!selectedReturn || !clientNote.trim()) return;
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseUrl}/api/returns/${selectedReturn._id}/customer-note`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customerNotes: clientNote })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Note sauvegardée avec succès !');
        setShowNoteModal(false);
        loadReturnsFromBackend(); // Recharger les retours
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Erreur lors de la sauvegarde de la note');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la note:', error);
      setMessage('Erreur lors de la sauvegarde de la note');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Charger les commandes depuis le backend
  const loadOrdersFromBackend = async () => {
    if (!user) return;
    
    try {
      console.log('🔄 Chargement des commandes depuis le backend...');
      const response = await getOrders(50, 0); // Récupérer les 50 dernières commandes
      
      if (response.success && response.orders) {
        // Convertir le format backend vers le format frontend
        const backendOrders = response.orders.map(order => ({
          id: order.orderNumber,
          _id: order._id,
          customer: `${order.customer.firstName} ${order.customer.lastName}`,
          date: order.orderDate,
          status: order.status,
          statut: getStatusLabel(order.status),
          total: order.total,
          type: 'achat',
          modePaiement: order.payment?.method || 'paypal',
          adresse: {
            nom: `${order.customer.firstName} ${order.customer.lastName}`,
            adresse: order.customer.address.street,
            ville: order.customer.address.city,
            telephone: order.customer.phone,
            pays: order.customer.address.country || 'Guinée'
          },
          produits: order.items.map(item => ({
            nom: item.productName,
            prix: item.price,
            qte: item.quantity,
            image: item.productImage,
            total: item.total,
            // Informations enrichies
            marque: item.brand,
            categorie: item.category,
            genre: item.genre,
            couleur: item.color,
            taille: item.size
          })),
          // Inclure le suivi backend s'il existe, sinon générer un suivi par défaut
          tracking: order.tracking || null,
          suivi: order.tracking ? {
            transporteur: order.tracking.carrier,
            numero: order.tracking.trackingNumber,
            modeExpedition: 'Standard',
            dateLivraisonEstimee: order.tracking.estimatedDelivery ? new Date(order.tracking.estimatedDelivery).toISOString().split('T')[0] : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            etapes: order.tracking.steps || generateTrackingSteps(order.status)
          } : null // Ne pas générer de suivi fictif si aucun suivi backend
        }));
        
        console.log('✅ Commandes chargées depuis le backend:', backendOrders.length);
        setCommandes(backendOrders);
        
        // Sauvegarder aussi dans localStorage pour compatibilité
        if (user.email) {
          const userKey = `commandes_${user.email}`;
          localStorage.setItem(userKey, JSON.stringify(backendOrders));
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement commandes backend:', error);
      // Fallback vers localStorage si le backend échoue
      if (user && user.email) {
        loadUserCommandes(user.email);
      }
    }
  };

  // Convertir le statut backend vers le format frontend
  const getStatusText = (status) => {
    return getStatusLabel(status);
  };

  // Générer les étapes de suivi basées sur le statut
  const generateTrackingSteps = (status) => {
    const steps = [
      { statut: 'Commande reçue', description: 'Votre commande a été reçue et est en cours de traitement', date: new Date().toISOString().split('T')[0] }
    ];

    if (['confirmed', 'preparing', 'ready', 'shipped', 'delivered'].includes(status)) {
      steps.push({ statut: 'Commande confirmée', description: 'Votre commande a été confirmée et est en préparation', date: new Date().toISOString().split('T')[0] });
    }

    if (['ready', 'shipped', 'delivered'].includes(status)) {
      steps.push({ statut: 'Commande prête', description: 'Votre commande est prête à être expédiée', date: new Date().toISOString().split('T')[0] });
    }

    if (['shipped', 'delivered'].includes(status)) {
      steps.push({ statut: 'Commande expédiée', description: 'Votre commande a été expédiée et est en transit', date: new Date().toISOString().split('T')[0] });
    }

    if (status === 'delivered') {
      steps.push({ statut: 'Commande livrée', description: 'Votre commande a été livrée avec succès', date: new Date().toISOString().split('T')[0] });
    }

    return steps;
  };

  // Fusionner les commandes du polling avec celles du contexte
  useEffect(() => {
    if (realTimeOrders && realTimeOrders.length > 0) {
      console.log('🔄 Mise à jour automatique des commandes:', realTimeOrders.length);
      
      // Convertir les commandes du backend au format du contexte
      const convertedOrders = realTimeOrders.map(order => ({
        id: order._id,
        numero: order.orderNumber,
        date: order.orderDate,
        statut: getStatusLabel(order.status),
        total: order.total,
        items: order.items || [],
        client: order.customer,
        paiement: order.payment,
        suivi: {
          etapes: generateTrackingSteps(order.status),
          statutActuel: order.status
        }
      }));
      
      // Mettre à jour le contexte avec les nouvelles données
      setCommandes(convertedOrders);
      
      // Sauvegarder dans localStorage pour compatibilité
      if (user && user.email) {
        const userKey = `commandes_${user.email}`;
        localStorage.setItem(userKey, JSON.stringify(convertedOrders));
      }
    }
  }, [realTimeOrders, user]); // SUPPRIMÉ setCommandes des dépendances

  // Charger les commandes, retours et échanges isolés par utilisateur
  useEffect(() => {
    if (user && user.email) {
      console.log('🔄 CHARGEMENT COMMANDES POUR:', user.email);
      console.log('🔄 TOKEN DISPONIBLE:', !!localStorage.getItem('token'));
      
      // Charger depuis le backend en priorité
      loadOrdersFromBackend();
      loadReturnsFromBackend(); // NOUVEAU: Charger les retours depuis l'API
      
      // Charger les échanges depuis localStorage (pas d'API pour l'instant)
      const userKeyEchanges = `echanges_${user.email}`;
      const storedEchanges = localStorage.getItem(userKeyEchanges);
      
      if (storedEchanges) {
        setEchanges(JSON.parse(storedEchanges));
      }
    }
  }, [user]);

  // Détecter l'ancre dans l'URL au chargement
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['historique', 'suivi', 'retours'].includes(hash)) {
      setActiveTab(hash);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  // Synchronisation du statut avec le suivi - une seule fois au chargement
  useEffect(() => {
    if (commandes.length > 0 && user && user.email) {
      const commandesMisAJour = commandes.map(cmd => {
        if (cmd.suivi && cmd.suivi.etapes && cmd.suivi.etapes.length > 0) {
          const lastEtape = cmd.suivi.etapes[cmd.suivi.etapes.length - 1];
          if (lastEtape.statut && lastEtape.statut.trim().toLowerCase().includes('livrée')) {
            return { ...cmd, statut: getStatusLabel('delivered'), status: 'delivered' };
          } else if (lastEtape.statut && lastEtape.statut.trim().toLowerCase().includes('expédiée')) {
            return { ...cmd, statut: getStatusLabel('shipped'), status: 'shipped' };
          } else if (lastEtape.statut && lastEtape.statut.trim().toLowerCase().includes('préparation')) {
            return { ...cmd, statut: getStatusLabel('processing'), status: 'processing' };
          }
        }
        return cmd;
      });
      
      // Vérifier s'il y a des changements
      const hasChanges = commandesMisAJour.some((cmd, index) => 
        cmd.statut !== commandes[index].statut || cmd.status !== commandes[index].status
      );
      
      if (hasChanges) {
        setCommandes(commandesMisAJour);
        // Sauvegarder les changements dans le localStorage
        const userKey = `commandes_${user.email}`;
        localStorage.setItem(userKey, JSON.stringify(commandesMisAJour));
      }
    }
  }, [user]); // Seulement quand l'utilisateur change

    // Recharger les retours et échanges au rafraîchissement de la page
  useEffect(() => {
    if (user && user.email) {
      // Recharger les retours et échanges
      const userKeyRetours = `retours_${user.email}`;
      const userKeyEchanges = `echanges_${user.email}`;
      
      const storedRetours = localStorage.getItem(userKeyRetours);
      const storedEchanges = localStorage.getItem(userKeyEchanges);
      
      if (storedRetours) {
        setRetours(JSON.parse(storedRetours));
      }
      if (storedEchanges) {
        setEchanges(JSON.parse(storedEchanges));
      }
    }
  }, [user]);

  // Recharger automatiquement quand le localStorage change
  useEffect(() => {
    const handleStorageChange = () => {
      if (user && user.email) {
        loadUserCommandes(user.email);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  // Charger les données de suivi quand l'onglet "Suivi" est activé
  useEffect(() => {
    if (activeTab === 'suivi' && commandes.length > 0) {
      loadAllTrackingData();
    }
  }, [activeTab, commandes]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  // Obtenir le statut coloré (utilise maintenant les constantes centralisées)
  const getStatutColor = (statut) => {
    return getStatusColor(statut);
  };

  // Obtenir l'icône du statut (utilise maintenant les constantes centralisées)
  const getStatutIcon = (statut) => {
    return getStatusIcon(statut);
  };

  return (
    <>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="text-warning fw-bold mb-0" style={{fontSize: '2.2rem'}}>
                <i className="bi bi-box-seam me-3"></i>
                Mes Commandes
              </h1>
              
              {/* Indicateur de mise à jour automatique */}
              <div className="d-flex align-items-center gap-3">
                {/* Indicateur WebSocket */}
                <div className="d-flex align-items-center">
                  {wsConnected ? (
                    <div className="d-flex align-items-center text-success">
                      <div className="rounded-circle bg-success me-2" style={{width: '8px', height: '8px'}}></div>
                      <small>Temps réel</small>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center text-warning">
                      <div className="rounded-circle bg-warning me-2" style={{width: '8px', height: '8px'}}></div>
                      <small>Polling</small>
                    </div>
                  )}
                </div>

                {/* Indicateur de mise à jour */}
                {pollingLoading && (
                  <div className="d-flex align-items-center text-success">
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Chargement...</span>
                    </div>
                    <small>Mise à jour...</small>
                  </div>
                )}
                
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={refreshOrders}
                  title="Actualiser les commandes"
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>

                {/* Bouton notifications */}
                <button 
                  className="btn btn-outline-info btn-sm"
                  onClick={requestPermission}
                  title="Autoriser les notifications"
                >
                  <i className="bi bi-bell"></i>
                </button>
              </div>
            </div>

            {/* Navigation par onglets */}
            <ul className="nav nav-tabs mb-4" id="ordersTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'historique' ? 'active' : ''}`}
                  id="historique-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#historique"
                  type="button"
                  role="tab"
                  onClick={() => handleTabClick('historique')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-clock-history me-2"></i>
                  Historique des commandes
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'suivi' ? 'active' : ''}`}
                  id="suivi-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#suivi"
                  type="button"
                  role="tab"
                  onClick={() => handleTabClick('suivi')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-truck me-2"></i>
                  Suivi des livraisons
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'retours' ? 'active' : ''}`}
                  id="retours-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#retours"
                  type="button"
                  role="tab"
                  onClick={() => handleTabClick('retours')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <i className="bi bi-arrow-return-left me-2"></i>
                  Retours et remboursements
                </button>
              </li>
            </ul>

            {/* Contenu des onglets */}
            <div className="tab-content" id="ordersTabContent">
              
              {/* Section Historique des commandes */}
              <div 
                className={`tab-pane fade ${activeTab === 'historique' ? 'show active' : ''}`}
                id="historique"
                role="tabpanel"
                aria-labelledby="historique-tab"
              >
                <div className="row">
                  <div className="col-12">
                    {commandes.length === 0 && (
                      <div className="text-center py-5">
                        <i className="bi bi-box-seam display-1 text-muted mb-3"></i>
                        <h4 className="text-muted">Aucune commande trouvée</h4>
                        <p className="text-muted">Vous n'avez passé aucune commande pour le moment.</p>
                      </div>
                    )}
                    {commandes.map((commande, cIdx) => (
                      <div key={commande.id} className="card border-0 shadow-sm mb-4 hover-shadow">
                        <div className="card-header bg-light border-0">
                          <div className="row align-items-center">
                            <div className="col-md-6">
                              <h6 className="fw-bold mb-0">
                                <i className="bi bi-box-seam me-2 text-primary"></i>
                                Commande {commande.id}
                              </h6>
                              {commande.adresse?.nom && (
                                <div className="text-muted" style={{fontSize: '1rem', fontWeight: 500}}>
                                  Client : {commande.adresse.nom}
                                </div>
                              )}
                              <small className="text-muted">
                                <i className="bi bi-calendar me-1"></i>
                                {formatDate(commande.date)}
                              </small>
                            </div>
                            <div className="col-md-6 text-end">
                              <span className={`badge bg-${getStatutColor(commande.statut)} me-2`}>
                                <i className={`bi ${getStatutIcon(commande.statut)} me-1`}></i>
                                {commande.statut}
                              </span>
                              <span className="fw-bold text-primary">
                                {commande.total ? commande.total.toLocaleString('fr-FR') : '0'} GNF
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            {/* Produits normaux */}
                            {(commande.produits || []).map((produit, pIdx) => (
                              <div key={pIdx} className="col-md-6 mb-3">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center">
                                    <img 
                                      src={produit.image} 
                                      alt={produit.nom}
                                      className="rounded me-3"
                                      style={{width: '60px', height: '60px', objectFit: 'cover'}}
                                    />
                                    <div className="flex-grow-1">
                                      <h6 className="fw-bold mb-1">{produit.nom}</h6>
                                      <p className="text-muted mb-0">
                                        Quantité: {produit.qte} • {produit.prix.toLocaleString('fr-FR')} GNF<br/>
                                        {produit.marque && <span className="badge bg-secondary me-1">{produit.marque}</span>}
                                        {produit.categorie && <span className="badge bg-info me-1">{produit.categorie}</span>}
                                        {produit.genre && <span className="badge bg-warning me-1">{produit.genre}</span>}
                                        {produit.couleur && <span className="badge bg-success me-1">{produit.couleur}</span>}
                                        {produit.taille && <span className="badge bg-primary me-1">Taille: {produit.taille}</span>}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {/* Produits d'échange */}
                            {commande.type === 'echange' && commande.produitEchange && (
                              <div className="col-md-6 mb-3">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center">
                                    <img 
                                      src={commande.produitEchange.image} 
                                      alt={commande.produitEchange.nom}
                                      className="rounded me-3"
                                      style={{width: '60px', height: '60px', objectFit: 'cover'}}
                                    />
                                    <div className="flex-grow-1">
                                      <h6 className="fw-bold mb-1 text-success">
                                        <i className="bi bi-arrow-repeat me-1"></i>
                                        {commande.produitEchange.nom}
                                      </h6>
                                      <p className="text-muted mb-0">
                                        Quantité: {commande.produitEchange.qte} • {commande.produitEchange.prix.toLocaleString('fr-FR')} GNF<br/>
                                        {commande.produitEchange.couleur && <span>Couleur: {commande.produitEchange.couleur} </span>}
                                        {commande.produitEchange.taille && <span>Taille: {commande.produitEchange.taille}</span>}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Adresse et paiement */}
                          <div className="mt-2">
                            <b>Adresse de livraison :</b><br/>
                            {commande.adresse ? (
                              <span>
                                <strong>Nom complet :</strong> {commande.adresse.nom}<br/>
                                <strong>Adresse :</strong> {commande.adresse.adresse}<br/>
                                <strong>Ville :</strong> {commande.adresse.ville}<br/>
                                <strong>Téléphone :</strong> {commande.adresse.telephone}<br/>
                                <strong>Type de lieu :</strong> {
                                  commande.adresse.placeType === 'maison' ? 'Maison' : 
                                  commande.adresse.placeType === 'bureau' ? 'Bureau' : 
                                  commande.adresse.placeType === 'appartement' ? 'Appartement' :
                                  commande.adresse.placeType === 'entreprise' ? 'Entreprise' :
                                  commande.adresse.placeType === 'magasin' ? 'Magasin' :
                                  commande.adresse.placeType === 'ecole' ? 'École/Université' :
                                  commande.adresse.placeType === 'hopital' ? 'Hôpital/Clinique' :
                                  commande.adresse.placeType === 'hotel' ? 'Hôtel' :
                                  commande.adresse.placeType === 'residence' ? 'Résidence' :
                                  commande.adresse.placeType === 'villa' ? 'Villa' :
                                  commande.adresse.placeType === 'immeuble' ? 'Immeuble' : 'Autre'
                                }
                              </span>
                            ) : <span className="text-muted">Non renseignée</span>}
                          </div>
                          <div className="mt-2">
                            <b>Mode de paiement :</b> {commande.modePaiement || commande.paiement || <span className="text-muted">Non renseigné</span>}
                          </div>
                          {commande.statut === getStatusLabel('delivered') && (
                            <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => handleOpenRetourModal(commande)}>
                              Demander un retour
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                </div>
              </div>

              {/* Section Suivi des livraisons */}
              <div 
                className={`tab-pane fade ${activeTab === 'suivi' ? 'show active' : ''}`}
                id="suivi"
                role="tabpanel"
                aria-labelledby="suivi-tab"
              >
                <div className="row">
                  <div className="col-12">
                    {/* En-tête avec boutons d'action */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">
                        <i className="bi bi-truck me-2"></i>
                        Suivi des livraisons
                      </h5>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={loadAllTrackingData}
                          disabled={trackingLoading}
                        >
                          <i className="bi bi-arrow-clockwise me-1"></i>
                          Actualiser
                        </button>
                        <button 
                          className="btn btn-outline-info btn-sm"
                          onClick={openPublicTrackingModal}
                        >
                          <i className="bi bi-search me-1"></i>
                          Suivi public
                        </button>
                      </div>
                    </div>

                    {/* Indicateur de chargement */}
                    {trackingLoading && (
                      <div className="text-center py-3">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Chargement du suivi...</span>
                        </div>
                        <p className="mt-2 text-muted">Chargement des informations de suivi...</p>
                      </div>
                    )}

                    {/* Message d'erreur */}
                    {trackingError && (
                      <div className="alert alert-danger">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Erreur lors du chargement du suivi : {trackingError}
                      </div>
                    )}

                    {(() => {
                      // Filtrer les commandes qui ont un suivi (backend ou local)
                      const commandesAvecSuivi = commandes.filter(c => {
                        const orderId = c._id || c.id;
                        const hasBackendTracking = trackingDetails[orderId] && trackingDetails[orderId].steps && trackingDetails[orderId].steps.length > 0;
                        const hasLocalTracking = (c.tracking && c.tracking.steps && c.tracking.steps.length > 0) ||
                                               (c.suivi && c.suivi.etapes && c.suivi.etapes.length > 0);
                        return hasBackendTracking || hasLocalTracking;
                      });
                      
                      if (commandesAvecSuivi.length === 0 && !trackingLoading) {
                        return (
                          <div className="text-center py-5">
                            <i className="bi bi-truck display-1 text-muted mb-3"></i>
                            <h4 className="text-muted">Aucun suivi de livraison disponible</h4>
                            <p className="text-muted mb-4">
                              Aucune information de suivi n'est disponible pour vos commandes.
                              <br />
                              L'administrateur ajoutera le suivi une fois votre commande expédiée.
                            </p>
                            <button 
                              className="btn btn-outline-primary"
                              onClick={loadAllTrackingData}
                            >
                              <i className="bi bi-arrow-clockwise me-1"></i>
                              Vérifier à nouveau
                            </button>
                          </div>
                        );
                      }
                      return commandesAvecSuivi.map((commande) => (
                      <div key={commande.id} className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-warning text-dark border-0">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <h6 className="fw-bold mb-0">
                                <i className="bi bi-truck me-2"></i>
                                Suivi de la commande {commande.numero || commande.id}
                              </h6>
                              {(commande.tracking && (commande.tracking.carrier || commande.tracking.trackingNumber)) || 
                               (commande.suivi && (commande.suivi.transporteur || commande.suivi.numero)) ? (
                                <small>
                                  {commande.tracking?.carrier && <>Transporteur : {commande.tracking.carrier} </>}
                                  {commande.tracking?.trackingNumber && <>• Numéro : {commande.tracking.trackingNumber}</>}
                                  {commande.suivi?.transporteur && <>Transporteur : {commande.suivi.transporteur} </>}
                                  {commande.suivi?.numero && <>• Numéro : {commande.suivi.numero}</>}
                                </small>
                              ) : null}
                            </div>
                            <div className="col-md-4 text-end">
                              {(() => {
                                // Vérifier si la commande est livrée (nouveau système backend ou ancien)
                                const isDelivered = commande.statut === getStatusLabel('delivered') ||
                                  (commande.tracking && commande.tracking.steps && commande.tracking.steps.length > 0 &&
                                    commande.tracking.steps[commande.tracking.steps.length - 1].status.toLowerCase().includes("livré")) ||
                                  (commande.suivi && commande.suivi.etapes && commande.suivi.etapes.length > 0 &&
                                    commande.suivi.etapes[commande.suivi.etapes.length - 1].statut.toLowerCase().includes("livrée"));
                                
                                return isDelivered ? (
                                  <span className="badge bg-success">
                                    <i className="bi bi-check-circle me-1"></i>
                                    Livrée
                                  </span>
                                ) : (
                                  <span className="badge bg-warning text-dark">
                                    <i className="bi bi-clock me-1"></i>
                                    En cours de livraison
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          {/* Produits de la commande */}
                          <div className="mb-4">
                            <h6 className="mb-3"><i className="bi bi-box-seam me-2"></i>Produits commandés :</h6>
                            <div className="row">
                              {/* Produits normaux */}
                              {(commande.produits || []).map((produit, pIdx) => (
                                <div key={pIdx} className="col-md-6 mb-3">
                                  <div className="d-flex align-items-center">
                                    <img 
                                      src={produit.image} 
                                      alt={produit.nom}
                                      className="rounded me-3"
                                      style={{width: '60px', height: '60px', objectFit: 'cover'}}
                                    />
                                    <div className="flex-grow-1">
                                      <h6 className="fw-bold mb-1">{produit.nom}</h6>
                                      <p className="text-muted mb-0">
                                        Quantité: {produit.qte} • {produit.prix.toLocaleString('fr-FR')} GNF<br/>
                                        {produit.marque && <span className="badge bg-secondary me-1">{produit.marque}</span>}
                                        {produit.categorie && <span className="badge bg-info me-1">{produit.categorie}</span>}
                                        {produit.genre && <span className="badge bg-warning me-1">{produit.genre}</span>}
                                        {produit.couleur && <span className="badge bg-success me-1">{produit.couleur}</span>}
                                        {produit.taille && <span className="badge bg-primary me-1">Taille: {produit.taille}</span>}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {/* Produits d'échange */}
                              {commande.type === 'echange' && commande.produitEchange && (
                                <div className="col-md-6 mb-3">
                                  <div className="d-flex align-items-center">
                                    <img 
                                      src={commande.produitEchange.image} 
                                      alt={commande.produitEchange.nom}
                                      className="rounded me-3"
                                      style={{width: '60px', height: '60px', objectFit: 'cover'}}
                                    />
                                    <div className="flex-grow-1">
                                      <h6 className="fw-bold mb-1 text-success">
                                        <i className="bi bi-arrow-repeat me-1"></i>
                                        {commande.produitEchange.nom}
                                      </h6>
                                      <p className="text-muted mb-0">
                                        Quantité: {commande.produitEchange.qte} • {commande.produitEchange.prix.toLocaleString('fr-FR')} GNF<br/>
                                        {commande.produitEchange.couleur && <span>Couleur: {commande.produitEchange.couleur} </span>}
                                        {commande.produitEchange.taille && <span>Taille: {commande.produitEchange.taille}</span>}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Informations générales du suivi */}
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <div className="mb-2">
                                <strong>Transporteur :</strong> {
                                  (() => {
                                    const orderId = commande._id || commande.id;
                                    const backendTracking = trackingDetails[orderId];
                                    return backendTracking?.carrier || 
                                           commande.tracking?.carrier || 
                                           commande.suivi?.transporteur || 
                                           'Non spécifié';
                                  })()
                                }
                              </div>
                              <div className="mb-2">
                                <strong>Numéro de suivi :</strong> {
                                  (() => {
                                    const orderId = commande._id || commande.id;
                                    const backendTracking = trackingDetails[orderId];
                                    return backendTracking?.trackingNumber || 
                                           commande.tracking?.trackingNumber || 
                                           commande.suivi?.numero || 
                                           'Non spécifié';
                                  })()
                                }
                              </div>
                            </div>
                            <div className="col-md-6">
                              {(() => {
                                const orderId = commande._id || commande.id;
                                const backendTracking = trackingDetails[orderId];
                                const estimatedDelivery = backendTracking?.estimatedDelivery || commande.tracking?.estimatedDelivery;
                                const trackingUrl = backendTracking?.trackingUrl || commande.tracking?.trackingUrl;
                                
                                return (
                                  <>
                                    {estimatedDelivery && (
                                      <div className="mb-2">
                                        <strong>Livraison prévue :</strong> {new Date(estimatedDelivery).toLocaleDateString('fr-FR')}
                                      </div>
                                    )}
                                    {trackingUrl && (
                                      <div className="mb-2">
                                        <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                          <i className="bi bi-box-arrow-up-right me-1"></i>Suivre sur le site du transporteur
                                        </a>
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Étapes du suivi */}
                          {(() => {
                            const orderId = commande._id || commande.id;
                            // Priorité aux données de l'API de tracking, puis fallback sur les données locales
                            const backendTracking = trackingDetails[orderId];
                            const steps = backendTracking?.steps || commande.tracking?.steps || commande.suivi?.etapes || [];
                            
                            if (steps.length > 0) {
                              return (
                                <div className="timeline">
                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="mb-0">
                                      <i className="bi bi-list-ul me-2"></i>Étapes du suivi :
                                    </h6>
                                    {!backendTracking && (
                                      <button 
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => loadTrackingForOrder(orderId)}
                                        disabled={trackingLoading}
                                      >
                                        <i className="bi bi-arrow-clockwise me-1"></i>
                                        Actualiser
                                      </button>
                                    )}
                                  </div>
                                  {steps.map((etape, index) => (
                                    <div key={index} className="timeline-item d-flex mb-3">
                                      <div className="timeline-marker me-3">
                                        <div className={`rounded-circle d-flex align-items-center justify-content-center ${index === steps.length - 1 ? 'bg-success' : 'bg-secondary'}`} style={{width: '30px', height: '30px'}}>
                                          <i className={`bi ${index === steps.length - 1 ? 'bi-check text-white' : 'bi-circle text-white'}`}></i>
                                        </div>
                                      </div>
                                      <div className="timeline-content flex-grow-1">
                                        <h6 className="fw-bold mb-1">
                                          {etape.status || etape.statut}
                                        </h6>
                                        <p className="text-muted mb-1">
                                          {etape.description}
                                        </p>
                                        <small className="text-muted">
                                          {etape.timestamp ? 
                                            `${new Date(etape.timestamp).toLocaleDateString('fr-FR')} à ${new Date(etape.timestamp).toLocaleTimeString('fr-FR')}` :
                                            etape.date ? new Date(etape.date).toLocaleDateString('fr-FR') : ''
                                          }
                                          {etape.heure && ` à ${etape.heure}`}
                                          {etape.location && ` • ${etape.location}`}
                                        </small>
                                      </div>
                                    </div>
                                  ))}
                                  {backendTracking && (
                                    <div className="mt-3 p-2 bg-light rounded">
                                      <small className="text-success">
                                        <i className="bi bi-check-circle me-1"></i>
                                        Données mises à jour en temps réel
                                      </small>
                                    </div>
                                  )}
                                </div>
                              );
                            } else {
                              return (
                                <div className="alert alert-info">
                                  <i className="bi bi-info-circle me-2"></i>
                                  Aucune étape de suivi disponible pour le moment.
                                  <br />
                                  <button 
                                    className="btn btn-outline-primary btn-sm mt-2"
                                    onClick={() => loadTrackingForOrder(orderId)}
                                    disabled={trackingLoading}
                                  >
                                    <i className="bi bi-arrow-clockwise me-1"></i>
                                    Vérifier le suivi
                                  </button>
                                </div>
                              );
                            }
                          })()}
                          {commande.suivi && (commande.suivi.modeExpedition || commande.suivi.dateLivraisonEstimee) && (
                            <div className="mb-2">
                              {commande.suivi.modeExpedition && (
                                <span><b>Mode d'expédition :</b> {commande.suivi.modeExpedition}</span>
                              )}
                              {commande.suivi.dateLivraisonEstimee && (
                                <span className="ms-3"><b>Date estimée :</b> {new Date(commande.suivi.dateLivraisonEstimee).toLocaleDateString('fr-FR')}</span>
                              )}
                              {commande.suivi.heureLivraisonEstimee && (
                                <span className="ms-3"><b>Heure estimée :</b> {commande.suivi.heureLivraisonEstimee}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              {/* Section Retours et remboursements */}
              <div 
                className={`tab-pane fade ${activeTab === 'retours' ? 'show active' : ''}`}
                id="retours"
                role="tabpanel"
                aria-labelledby="retours-tab"
              >
                <div className="row">
                  <div className="col-12">
                    {activeTab === 'retours' && (
                      <div className="row">
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Retours et remboursements</h5>
                            <Button variant="outline-info" size="sm" onClick={() => navigate('/echanges')}>
                              <i className="bi bi-package me-1"></i>
                              Voir mes échanges
                            </Button>
                          </div>
                          {retours.length === 0 ? (
                            <div className="text-center py-4">
                              <i className="bi bi-arrow-return-left display-4 text-muted"></i>
                              <h5 className="mt-3 text-muted">Aucun retour</h5>
                              <p className="text-muted">Vous n'avez pas encore effectué de demande de retour.</p>
                            </div>
                          ) : (
                            retours.map(retour => (
                              <div key={retour.id} className="card mb-3">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                  <h6 className="mb-0">Retour #{retour.id}</h6>
                                  <span className={`badge bg-${retour.statut === 'En attente de validation' ? 'warning' : retour.statut === 'Accepté' ? 'success' : retour.statut === 'Refusé' ? 'danger' : retour.statut === 'Remboursé' ? 'info' : retour.statut === 'En attente de validation client' ? 'warning' : retour.statut === 'Échange validé' ? 'success' : retour.statut === 'Échange refusé' ? 'danger' : 'primary'}`}>
                                    {retour.statut}
                                  </span>
                                </div>
                                <div className="card-body">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <p><strong>Commande :</strong> #{retour.commande}</p>
                                      <p><strong>Date de demande :</strong> {retour.date}</p>
                                      <p><strong>Type :</strong> {retour.type}</p>
                                      <p><strong>Raison :</strong> {retour.raison}</p>
                                      {retour.commentaireInitial && (
                                        <p><strong>Commentaire initial :</strong> {retour.commentaireInitial}</p>
                                      )}
                                      {retour.notesClient && (
                                        <p><strong>Mes notes :</strong> {retour.notesClient}</p>
                                      )}
                                      {retour.notesAdmin && (
                                        <p><strong>Message de l'admin :</strong> {retour.notesAdmin}</p>
                                      )}
                                      <button 
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => {
                                          setSelectedReturn(retour);
                                          setClientNote(retour.notesClient || '');
                                          setShowNoteModal(true);
                                        }}
                                      >
                                        <i className="bi bi-chat-dots me-1"></i>
                                        {retour.notesClient ? 'Modifier mes notes' : 'Ajouter mes notes'}
                                      </button>
                                    </div>
                                    <div className="col-md-6">
                                      <p><strong>Produits :</strong></p>
                                      <ul className="list-unstyled">
                                        {(retour.produits || []).map((produit, index) => (
                                          <li key={index} className="d-flex align-items-center mb-2">
                                            <img 
                                              src={produit.image || '/assets/placeholder-product.svg'} 
                                              alt={produit.nom || produit.name} 
                                              style={{ 
                                                width: '50px', 
                                                height: '50px', 
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                border: '1px solid #dee2e6'
                                              }}
                                              onError={(e) => {
                                                e.target.src = '/assets/placeholder-product.svg';
                                              }}
                                              className="me-2"
                                            />
                                            <div>
                                              <div>{produit.nom || produit.name}</div>
                                              <small className="text-muted">{produit.prix?.toLocaleString('fr-FR')} GNF</small>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  
                                  {/* Affichage des détails d'échange si le retour a été échangé */}
                                  {(retour.statut === 'Échangé' || retour.statut === 'Échange validé' || retour.statut === 'Échange refusé') && retour.echangeId && (
                                    <div className="mt-3 p-3 bg-light rounded">
                                      <h6 className={`${retour.statut === 'Échange validé' ? 'text-success' : retour.statut === 'Échange refusé' ? 'text-danger' : 'text-success'}`}>
                                        <i className="bi bi-check-circle me-2"></i>
                                        {retour.statut === 'Échange validé' ? 'Échange validé' : retour.statut === 'Échange refusé' ? 'Échange refusé' : 'Échange effectué'} - #{retour.echangeId}
                                      </h6>
                                      {(() => {
                                        const echange = echanges.find(e => e.id === retour.echangeId);
                                        if (echange) {
                                          return (
                                            <div className="row mt-2">
                                              <div className="col-md-6">
                                                <small className="text-muted">Produit retourné :</small>
                                                <div className="d-flex align-items-center mt-1">
                                                  <img 
                                                    src={echange.produitRetourne?.image || '/assets/placeholder-product.svg'} 
                                                    alt="Produit retourné" 
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    className="me-2"
                                                  />
                                                  <div className="fw-bold">{echange.produitRetourne?.nom || 'Produit'}</div>
                                                </div>
                                              </div>
                                              <div className="col-md-6">
                                                <small className="text-muted">Produit échangé :</small>
                                                <div className="d-flex align-items-center mt-1">
                                                  <img 
                                                    src={echange.produitEchange?.image || '/assets/placeholder-product.svg'} 
                                                    alt="Produit échangé" 
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    className="me-2"
                                                  />
                                                  <div className="fw-bold text-success">{echange.produitEchange?.nom || 'Produit'}</div>
                                                </div>
                                                <small className="text-muted">
                                                  Quantité : {echange.produitEchange?.quantite || 1}
                                                </small>
                                              </div>
                                              {echange.commentaire && (
                                                <div className="col-12 mt-2">
                                                  <small className="text-muted">Commentaire vendeur :</small>
                                                  <div className="fst-italic">{echange.commentaire}</div>
                                                </div>
                                              )}
                                              {retour.statut === 'Échange validé' && (
                                                <div className="col-12 mt-2">
                                                  <div className="alert alert-success mb-0">
                                                    <i className="bi bi-check-circle me-2"></i>
                                                    <strong>Échange validé !</strong> Le produit a été ajouté à vos commandes.
                                                  </div>
                                                </div>
                                              )}
                                              {retour.statut === 'Échange refusé' && (
                                                <div className="col-12 mt-2">
                                                  <div className="alert alert-danger mb-0">
                                                    <i className="bi bi-x-circle me-2"></i>
                                                    <strong>Échange refusé !</strong> Un nouveau retour a été créé automatiquement.
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        }
                                        return null;
                                      })()}
                                    </div>
                                  )}
                                  
                                  {/* Bouton de validation si l'échange est en attente */}
                                  {retour.statut === 'En attente de validation client' && retour.echangeId && (
                                    <div className="mt-3 p-3 bg-warning bg-opacity-10 rounded">
                                      <h6 className="text-warning">
                                        <i className="bi bi-clock me-2"></i>
                                        Échange en attente de validation
                                      </h6>
                                      <p className="mb-2">Vous avez reçu le produit d'échange. Veuillez le valider.</p>
                                      <Button 
                                        variant="primary" 
                                        size="sm"
                                        onClick={() => navigate(`/validation-echange/${retour.echangeId}`)}
                                      >
                                        <i className="bi bi-check-circle me-1"></i>
                                        Valider l'échange
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal pour les détails de commande */}
        {showModal && commandeSelectionnee && (
          <>
            <div className="modal-backdrop-custom" onClick={() => setShowModal(false)}></div>
            <div className="modal-custom">
              <div className="modal-box" style={{maxWidth: 700, width: '95vw'}}>
                <div className="modal-header" style={{borderBottom: '1px solid #eee', padding: '18px 24px 10px 24px'}}>
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-box-seam me-2"></i>
                    Détails de la commande {commandeSelectionnee.id}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body" style={{padding: '18px 24px'}}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <h6 className="fw-bold">Informations de commande</h6>
                      <p className="text-muted mb-1">
                        <strong>Date:</strong> {new Date(commandeSelectionnee.date).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-muted mb-1">
                        <strong>Statut:</strong> 
                        <span className={`badge bg-${getStatutColor(commandeSelectionnee.statut)} ms-2`}>
                          {commandeSelectionnee.statut}
                        </span>
                      </p>
                      <p className="text-muted mb-0">
                        <strong>Total:</strong> {commandeSelectionnee.total.toFixed(2)} €
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold">Adresse de livraison</h6>
                      <div className="text-muted mb-0">
                        <div className="row">
                          <div className="col-md-6">
                            <strong>Nom complet :</strong><br />
                            {commandeSelectionnee.adresse.nom || commandeSelectionnee.customer}<br /><br />
                            <strong>Type d'adresse :</strong><br />
                            Adresse de livraison<br /><br />
                            <strong>Adresse :</strong><br />
                            {commandeSelectionnee.adresse.adresse || commandeSelectionnee.adresse}<br /><br />
                            <strong>Ville :</strong><br />
                            {commandeSelectionnee.adresse.ville}
                          </div>
                          <div className="col-md-6">
                            <strong>Pays :</strong><br />
                            {commandeSelectionnee.adresse.pays || 'Non spécifié'}<br /><br />
                            <strong>Téléphone :</strong><br />
                            {commandeSelectionnee.adresse.telephone}<br /><br />
                            <strong>Type de lieu :</strong><br />
                            {commandeSelectionnee.adresse.placeType === 'maison' ? 'Maison' : 
                             commandeSelectionnee.adresse.placeType === 'bureau' ? 'Bureau' : 
                             commandeSelectionnee.adresse.placeType === 'appartement' ? 'Appartement' :
                             commandeSelectionnee.adresse.placeType === 'entreprise' ? 'Entreprise' :
                             commandeSelectionnee.adresse.placeType === 'magasin' ? 'Magasin' :
                             commandeSelectionnee.adresse.placeType === 'ecole' ? 'École/Université' :
                             commandeSelectionnee.adresse.placeType === 'hopital' ? 'Hôpital/Clinique' :
                             commandeSelectionnee.adresse.placeType === 'hotel' ? 'Hôtel' :
                             commandeSelectionnee.adresse.placeType === 'residence' ? 'Résidence' :
                             commandeSelectionnee.adresse.placeType === 'villa' ? 'Villa' :
                             commandeSelectionnee.adresse.placeType === 'immeuble' ? 'Immeuble' : 'Non spécifié'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h6 className="fw-bold mb-3">Produits commandés</h6>
                  {commandeSelectionnee.produits.map((produit, index) => (
                    <div key={index} className="d-flex align-items-center mb-3 p-3 bg-light rounded">
                      <img 
                        src={produit.image} 
                        alt={produit.nom}
                        className="rounded me-3"
                        style={{width: '60px', height: '60px', objectFit: 'cover'}}
                      />
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">{produit.nom}</h6>
                        <p className="text-muted mb-0">
                          Quantité: {produit.qte} • Prix unitaire: {produit.prix.toFixed(2)} €
                        </p>
                      </div>
                      <div className="text-end">
                        <span className="fw-bold">{(produit.prix * produit.qte).toFixed(2)} €</span>
                      </div>
                    </div>
                  ))}
                  {commandeSelectionnee.retour && (
                    <div className="mt-3 p-3 bg-warning bg-opacity-10 rounded">
                      <h6 className="fw-bold text-warning">
                        <i className="bi bi-arrow-return-left me-2"></i>
                        Informations de retour
                      </h6>
                      <p className="text-muted mb-1">
                        <strong>Raison:</strong> {commandeSelectionnee.retour.raison}
                      </p>
                      <p className="text-muted mb-1">
                        <strong>Remboursement:</strong> {commandeSelectionnee.retour.remboursement.toFixed(2)} €
                      </p>
                      <p className="text-muted mb-0">
                        <strong>Date de remboursement:</strong> {new Date(commandeSelectionnee.retour.dateRemboursement).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>
                <div className="modal-footer" style={{borderTop: '1px solid #eee', padding: '12px 24px', display: 'flex', justifyContent: 'flex-end', gap: 8}}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowModal(false)}
                  >
                    Fermer
                  </button>
                  {commandeSelectionnee.statut === getStatusLabel('delivered') && !commandeSelectionnee.avisDonne && (
                    <button 
                      className="btn btn-warning"
                      onClick={() => {
                        setShowModal(false);
                        window.location.href = `/avis?commande=${commandeSelectionnee.id}`;
                      }}
                    >
                      <i className="bi bi-star me-1"></i>
                      Laisser un avis
                    </button>
                  )}
                  {commandeSelectionnee.statut === getStatusLabel('delivered') && commandeSelectionnee.avisDonne && (
                    <button 
                      className="btn btn-success"
                      onClick={() => {
                        setShowModal(false);
                        window.location.href = `/avis?commande=${commandeSelectionnee.id}&modifier=true`;
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Modifier mon avis
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Overlay pour le modal */}
        {showModal && (
          <div 
            className="modal-backdrop fade show" 
            onClick={() => setShowModal(false)}
          ></div>
        )}

        {/* Formulaire d'avis contextuel */}
        {avisForm.show && (
          <>
            <div className="modal-backdrop-custom" onClick={() => setAvisForm({ ...avisForm, show: false })}></div>
            <div className="modal-custom" tabIndex="-1">
              <div className="modal-box">
                <div className="modal-header" style={{borderBottom: '1px solid #eee', padding: '18px 24px 10px 24px'}}>
                  <h5 className="modal-title fw-bold">
                    {avisForm.mode === 'ajout' ? 'Laisser un avis' : 'Modifier mon avis'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setAvisForm({ ...avisForm, show: false })}></button>
                </div>
                <form onSubmit={e => {
                  e.preventDefault();
                  setCommandes(prev => prev.map(cmd =>
                    cmd.id === avisForm.commandeId
                      ? {
                          ...cmd,
                          produits: cmd.produits.map((prod, idx) =>
                            idx === avisForm.produitIndex
                              ? { ...prod, avis: { note: avisForm.note, titre: avisForm.titre, commentaire: avisForm.commentaire } }
                              : prod
                          )
                        }
                      : cmd
                  ));
                  setAvisForm({ ...avisForm, show: false });
                  setMessage(avisForm.mode === 'ajout' ? 'Avis ajouté avec succès !' : 'Avis modifié avec succès !');
                  setTimeout(() => setMessage(''), 2500);
                }}>
                  <div className="modal-body" style={{padding: '18px 24px'}}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Note</label>
                      <div className="d-flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <button
                            key={star}
                            type="button"
                            className="btn btn-link p-0"
                            style={{fontSize: '2rem'}}
                            onClick={() => setAvisForm({ ...avisForm, note: star })}
                          >
                            <i className={`bi ${star <= avisForm.note ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}></i>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Titre</label>
                      <input type="text" className="form-control" value={avisForm.titre} onChange={e => setAvisForm({ ...avisForm, titre: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Commentaire</label>
                      <textarea className="form-control" rows="4" value={avisForm.commentaire} onChange={e => setAvisForm({ ...avisForm, commentaire: e.target.value })} required></textarea>
                    </div>
                  </div>
                  <div className="modal-footer" style={{borderTop: '1px solid #eee', padding: '12px 24px', display: 'flex', justifyContent: 'flex-end', gap: 8}}>
                    <button type="button" className="btn btn-secondary" onClick={() => setAvisForm({ ...avisForm, show: false })}>Annuler</button>
                    <button type="submit" className="btn btn-warning fw-bold">
                      <i className="bi bi-check me-1"></i>
                      {avisForm.mode === 'ajout' ? 'Publier l\'avis' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {/* Modal de demande de retour */}
        {showRetourModal && retourCommande && (
          <Modal show={showRetourModal} onHide={handleCloseRetourModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Demande de retour/remboursement</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleValiderRetour}>
              {message && (
                <div className="alert alert-danger m-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {message}
                </div>
              )}
              <Modal.Body>
                <div className="mb-2">
                  <b>Commande n° :</b> {retourCommande.id}<br/>
                  <b>Date d'achat :</b> {new Date(retourCommande.date).toLocaleDateString('fr-FR')}
                </div>
                <div className="mb-3">
                  <b>Type de retour :</b><br/>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="typeRetour" id="type-remboursement" value="Remboursement" checked={retourType === 'Remboursement'} onChange={() => setRetourType('Remboursement')} />
                    <label className="form-check-label" htmlFor="type-remboursement">Remboursement</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="typeRetour" id="type-echange" value="Échange" checked={retourType === 'Échange'} onChange={() => setRetourType('Échange')} />
                    <label className="form-check-label" htmlFor="type-echange">Échange</label>
                  </div>
                </div>
                <div className="mb-3">
                  <b>Produits à retourner :</b> <span className="text-danger">*</span>
                  <div className="text-muted small mb-2">Sélectionnez au moins un produit à retourner</div>
                  {(retourCommande.produits || []).map((prod, idx) => (
                    <div key={idx} className="form-check">
                      <input className="form-check-input" type="checkbox" id={`retour-prod-${idx}`} checked={retourProduits.includes(idx)} onChange={() => handleToggleProduit(idx)} />
                      <label className="form-check-label" htmlFor={`retour-prod-${idx}`}>
                        <strong>{prod.nom}</strong> - Quantité : {prod.qte} - Prix : {prod.prix?.toLocaleString('fr-FR')} GNF
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mb-3">
                  <b>Raison du retour :</b> <span className="text-danger">*</span>
                  <div className="text-muted small mb-2">Sélectionnez une raison pour le retour</div>
                  {raisonsRetour.map((raison, idx) => (
                    <div key={idx} className="form-check">
                      <input className="form-check-input" type="radio" name="raison" id={`raison-${idx}`} value={raison} checked={retourRaison === raison} onChange={() => setRetourRaison(raison)} />
                      <label className="form-check-label" htmlFor={`raison-${idx}`}>{raison}</label>
                    </div>
                  ))}
                  {retourRaison === 'Autre' && (
                    <div className="mt-2">
                      <label className="form-label">Autre raison <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" value={retourAutre} onChange={e => setRetourAutre(e.target.value)} required />
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Commentaire (optionnel)</label>
                  <textarea className="form-control" rows="3" value={retourCommentaire} onChange={e => setRetourCommentaire(e.target.value)}></textarea>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseRetourModal}>
                  Annuler
                </Button>
                <Button variant="warning" type="submit">
                  <i className="bi bi-check me-1"></i>
                  Enregistrer le retour
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        )}

        {/* Modal de suivi public */}
        {showPublicTrackingModal && (
          <Modal show={showPublicTrackingModal} onHide={() => setShowPublicTrackingModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                <i className="bi bi-search me-2"></i>
                Suivi Public
              </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handlePublicTracking}>
              <Modal.Body>
                <div className="mb-3">
                  <label className="form-label fw-bold">Numéro de commande <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: CMD240110001"
                    value={publicTrackingForm.orderNumber}
                    onChange={e => setPublicTrackingForm(prev => ({ ...prev, orderNumber: e.target.value }))}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Email de la commande <span className="text-danger">*</span></label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="votre@email.com"
                    value={publicTrackingForm.email}
                    onChange={e => setPublicTrackingForm(prev => ({ ...prev, email: e.target.value }))}
                    required 
                  />
                </div>
                
                {publicTrackingResult && (
                  <div className="mt-4">
                    <h6 className="fw-bold">Résultat du suivi :</h6>
                    {publicTrackingResult.steps && publicTrackingResult.steps.length > 0 ? (
                      <div className="timeline">
                        {publicTrackingResult.steps.map((etape, index) => (
                          <div key={index} className="timeline-item d-flex mb-3">
                            <div className="timeline-marker me-3">
                              <div className={`rounded-circle d-flex align-items-center justify-content-center ${index === publicTrackingResult.steps.length - 1 ? 'bg-success' : 'bg-secondary'}`} style={{width: '30px', height: '30px'}}>
                                <i className={`bi ${index === publicTrackingResult.steps.length - 1 ? 'bi-check text-white' : 'bi-circle text-white'}`}></i>
                              </div>
                            </div>
                            <div className="timeline-content flex-grow-1">
                              <h6 className="fw-bold mb-1">{etape.status}</h6>
                              <p className="text-muted mb-1">{etape.description}</p>
                              <small className="text-muted">
                                {etape.timestamp ? 
                                  `${new Date(etape.timestamp).toLocaleDateString('fr-FR')} à ${new Date(etape.timestamp).toLocaleTimeString('fr-FR')}` : ''
                                }
                                {etape.location && ` • ${etape.location}`}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        Aucune information de suivi disponible pour cette commande.
                      </div>
                    )}
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowPublicTrackingModal(false)}>
                  Fermer
                </Button>
                <Button variant="primary" type="submit" disabled={trackingLoading}>
                  {trackingLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Recherche...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search me-1"></i>
                      Rechercher
                    </>
                  )}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        )}

        {/* Correction de la fin du fichier pour fermer correctement les balises et le composant */}
        {message && (
          <div className="alert alert-success position-fixed top-0 end-0 m-4" style={{zIndex: 2000}}>{message}</div>
        )}
      </div>

      {/* Modal pour ajouter une note client */}
      <Modal show={showNoteModal} onHide={() => setShowNoteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Mes notes sur ce retour</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ajoutez vos notes supplémentaires :</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={clientNote}
                onChange={(e) => setClientNote(e.target.value)}
                placeholder="Ajoutez vos commentaires supplémentaires sur ce retour (différent du commentaire initial)..."
              />
              <Form.Text className="text-muted">
                Ces notes seront visibles par l'administrateur et peuvent être ajoutées à tout moment.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNoteModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveClientNote}>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}