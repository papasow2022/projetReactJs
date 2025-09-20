import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from "../contexts/LanguageContext";
import { 
  BiArrowBack, 
  BiSearch, 
  BiFilter, 
  BiPackage, 
  BiCar, 
  BiCheckCircle,
  BiXCircle,
  BiTime,
  BiUser,
  BiDollar,
  BiCalendar,
  BiPrinter,
  BiDownload,
  BiEdit,
  BiUndo,
  BiRefresh
} from 'react-icons/bi';
import { useCommandes } from '../contexts/CommandesContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../hooks/useAuth.jsx';

// Statuts Amazon-style avec descriptions automatiques
const STATUTS_AMAZON = {
  'Commande confirmée': {
    description: 'Votre commande a été confirmée et sera traitée prochainement.',
    color: 'success'
  },
  'En préparation': {
    description: 'Votre commande est en cours de préparation dans notre entrepôt.',
    color: 'info'
  },
  'Expédiée': {
    description: 'Votre colis a quitté notre entrepôt et est en route vers vous.',
    color: 'primary'
  },
  'En transit': {
    description: 'Votre colis est en cours de livraison par le transporteur.',
    color: 'warning'
  },
  'En cours de livraison': {
    description: 'Votre colis arrive aujourd\'hui ! Le livreur est en route.',
    color: 'warning'
  },
  'Livrée': {
    description: 'Votre colis a été livré avec succès.',
    color: 'success'
  }
};

const CentreCommandes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('tous');
  const [selectedPeriod, setSelectedPeriod] = useState('7j');
  const [selectedOrders, setSelectedOrders] = useState([]);

  const { commandes, setCommandes, loadUserCommandes, saveUserCommandes } = useCommandes();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Ajout état pour le modal de suivi
  const [showSuiviModal, setShowSuiviModal] = useState(false);
  const [suiviOrderId, setSuiviOrderId] = useState(null);
  const [suiviForm, setSuiviForm] = useState({
    transporteur: '',
    numero: '',
    modeExpedition: 'Standard',
    dateLivraisonEstimee: '',
    heureLivraisonEstimee: '',
    statutActuel: 'Commande confirmée'
  });

  // Charger TOUTES les commandes pour le vendeur (pas seulement celles de l'utilisateur connecté)
  const loadAllCommandes = () => {
    if (user && user.email) {
      // Pour le vendeur, on charge toutes les commandes de tous les utilisateurs
      const allCommandes = [];
      
      // Parcourir toutes les clés localStorage pour trouver les commandes
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('commandes_')) {
          try {
            const userCommandes = JSON.parse(localStorage.getItem(key));
            if (Array.isArray(userCommandes)) {
              // Filtrer pour ne garder que les commandes de produits (pas les échanges ou retours)
              const commandesProduits = userCommandes.filter(commande => 
                commande.type === 'commande' || commande.type === 'achat' || !commande.type || commande.type === undefined
              );
              allCommandes.push(...commandesProduits);
            }
          } catch (error) {
            console.error('Erreur lors du chargement des commandes de', key, error);
          }
        }
      }
      
      setCommandes(allCommandes);
    }
  };

  // Chargement initial
  useEffect(() => {
    loadAllCommandes();
  }, [user]);

  // Écouter les changements du localStorage pour synchronisation en temps réel
  useEffect(() => {
    const handleStorageChange = () => {
      loadAllCommandes();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  // Ouvre le modal et pré-remplit si déjà un suivi
  const handleOpenSuiviModal = (order) => {
    setSuiviOrderId(order.id);
    
    // Pour les échanges, priorité à echange.suiviVendeur
    let suiviData = order.suivi;
    if (order.type === 'echange' && order.echange && order.echange.suiviVendeur) {
      suiviData = order.echange.suiviVendeur;
    }
    
    if (suiviData) {
      setSuiviForm({
        transporteur: suiviData.transporteur || '',
        numero: suiviData.numero || '',
        modeExpedition: suiviData.modeExpedition || 'Standard',
        dateLivraisonEstimee: suiviData.dateLivraisonEstimee || '',
        heureLivraisonEstimee: suiviData.heureLivraisonEstimee || '',
        statutActuel: STATUTS_AMAZON[suiviData.statutActuel] ? suiviData.statutActuel : 'Commande confirmée'
      });
    } else {
      setSuiviForm({
        transporteur: '',
        numero: '',
        modeExpedition: 'Standard',
        dateLivraisonEstimee: '',
        heureLivraisonEstimee: '',
        statutActuel: 'Commande confirmée'
      });
    }
    setShowSuiviModal(true);
  };

  // Ferme le modal
  const handleCloseSuiviModal = () => {
    setShowSuiviModal(false);
    setSuiviOrderId(null);
  };

  // Gère la modification d'un champ du suivi
  const handleSuiviChange = (e) => {
    const { name, value } = e.target;
    setSuiviForm({ ...suiviForm, [name]: value });
  };



  // Sauvegarde le suivi dans la commande (Logique Amazon)
  const handleSaveSuivi = (e) => {
    e.preventDefault();
    
    // Créer les étapes automatiquement basées sur le statut actuel
    const statutActuel = suiviForm.statutActuel;
    const etapes = [];
    
    // Ajouter automatiquement toutes les étapes jusqu'au statut actuel
    const statutsOrdre = ['Commande confirmée', 'En préparation', 'Expédiée', 'En transit', 'En cours de livraison', 'Livrée'];
    const indexStatutActuel = statutsOrdre.indexOf(statutActuel);
    
    for (let i = 0; i <= indexStatutActuel; i++) {
      const statut = statutsOrdre[i];
      if (STATUTS_AMAZON[statut]) {
        // Utiliser les dates et heures personnalisées si disponibles
        const datePersonnalisee = suiviForm[`date_${i}`];
        const heurePersonnalisee = suiviForm[`heure_${i}`];
        
        // Date par défaut si non spécifiée
        const dateEtape = datePersonnalisee || new Date().toISOString().split('T')[0];
        const heureEtape = heurePersonnalisee || `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
        
        etapes.push({
          statut: statut,
          description: STATUTS_AMAZON[statut].description,
          date: dateEtape,
          heure: heureEtape
        });
      }
    }
    
    // Créer le nouveau suivi
    const newSuivi = {
      transporteur: suiviForm.transporteur,
      numero: suiviForm.numero,
      modeExpedition: suiviForm.modeExpedition,
      dateLivraisonEstimee: suiviForm.dateLivraisonEstimee,
      heureLivraisonEstimee: suiviForm.heureLivraisonEstimee,
      statutActuel: statutActuel,
      etapes: etapes
    };
    
    const commandesMisAJour = commandes.map(order => {
      if (order.id === suiviOrderId) {
        let newStatut = 'en cours'; // Par défaut
        let shouldNotify = false;
        
        // Synchronisation stricte avec la dernière étape
        if (newSuivi.etapes.length > 0) {
          const derniereEtape = newSuivi.etapes[newSuivi.etapes.length - 1].statut.trim().toLowerCase();
          if (derniereEtape.includes('livrée') || derniereEtape.includes('livré')) {
            newStatut = 'livrée';
            shouldNotify = true;
          } else if (derniereEtape.includes('expédiée') || derniereEtape.includes('expédié') || derniereEtape.includes('transit')) {
            newStatut = 'expédiée';
          } else if (derniereEtape.includes('préparation') || derniereEtape.includes('confirmée') || derniereEtape.includes('confirmé')) {
            newStatut = 'en cours';
          } else {
            newStatut = 'en cours';
          }
        }
        
        // Pour les échanges, synchroniser aussi avec echange.suiviVendeur
        let updatedOrder = { ...order, suivi: newSuivi, statut: newStatut, status: newStatut };
        
        if (order.type === 'echange' && order.echange) {
          // Déterminer le nouveau statut basé sur les étapes
          let nouveauStatutEchange = order.echange.statut;
          if (newSuivi.etapes.length > 0) {
            const derniereEtape = newSuivi.etapes[newSuivi.etapes.length - 1].statut.trim().toLowerCase();
            if (derniereEtape.includes('livrée') || derniereEtape.includes('livré')) {
              nouveauStatutEchange = 'Échange livré';
            } else if (derniereEtape.includes('expédiée') || derniereEtape.includes('expédié') || derniereEtape.includes('transit')) {
              nouveauStatutEchange = 'Échange expédié';
            } else if (derniereEtape.includes('préparation')) {
              nouveauStatutEchange = 'Échange en préparation';
            } else if (derniereEtape.includes('confirmée') || derniereEtape.includes('confirmé')) {
              nouveauStatutEchange = 'Échange confirmé';
            }
          }
          
          updatedOrder = {
            ...updatedOrder,
                          echange: {
                ...order.echange,
                statut: nouveauStatutEchange,
                dateValidation: order.echange.dateValidation || '', // Date de validation automatique depuis la validation côté client
              suiviVendeur: {
                ...order.echange.suiviVendeur,
                transporteur: suiviForm.transporteur,
                numero: suiviForm.numero,
                modeExpedition: suiviForm.modeExpedition,
                dateLivraisonEstimee: suiviForm.dateLivraisonEstimee,
                etapes: newSuivi.etapes
              }
            }
          };
        }
        
        // Notification pour le client si la commande est livrée
        if (shouldNotify) {
          addNotification(
            `Votre commande #${order.id} a été livrée !`,
            'success',
            {
              details: `Commande livrée le ${new Date().toLocaleDateString('fr-FR')}`
            }
          );
        }
        
        return updatedOrder;
      }
      return order;
    });
    
    setCommandes(commandesMisAJour);
    
    // Sauvegarder dans la clé du client qui a passé la commande
    const commandeModifiee = commandesMisAJour.find(cmd => cmd.id === suiviOrderId);
    console.log('Commande modifiée trouvée:', commandeModifiee);
    
    // Essayer de trouver l'email du client
    let clientEmail = commandeModifiee?.email;
    
    // Si pas d'email dans la commande, chercher dans toutes les clés localStorage
    if (!clientEmail) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('commandes_')) {
          try {
            const userCommandes = JSON.parse(localStorage.getItem(key));
            if (Array.isArray(userCommandes)) {
              const commandeClient = userCommandes.find(cmd => cmd.id === suiviOrderId);
              if (commandeClient) {
                clientEmail = key.replace('commandes_', '');
                console.log('✅ Email trouvé via localStorage:', clientEmail);
                break;
              }
            }
          } catch (error) {
            console.error('Erreur lors de la recherche:', error);
          }
        }
      }
    }
    
    console.log('Email du client final:', clientEmail);
    
    if (commandeModifiee && clientEmail) {
      // Trouver toutes les commandes du client
      const clientKey = `commandes_${clientEmail}`;
      console.log('Clé du client:', clientKey);
      
      const clientCommandes = JSON.parse(localStorage.getItem(clientKey) || '[]');
      console.log('Commandes du client avant mise à jour:', clientCommandes);
      
      // Mettre à jour la commande spécifique
      const clientCommandesMisAJour = clientCommandes.map(cmd => 
        cmd.id === suiviOrderId ? commandeModifiee : cmd
      );
      
      console.log('Commandes du client après mise à jour:', clientCommandesMisAJour);
      
      // Sauvegarder les commandes mises à jour du client
      localStorage.setItem(clientKey, JSON.stringify(clientCommandesMisAJour));
      console.log('✅ Suivi sauvegardé pour le client:', clientEmail);
      console.log('✅ Nouveau suivi créé:', newSuivi);
      console.log('✅ Commande mise à jour:', commandeModifiee);
    } else {
      console.error('❌ Impossible de sauvegarder: commande ou email manquant');
      console.error('Commande modifiée:', commandeModifiee);
      console.error('Email trouvé:', clientEmail);
    }
    
    // Notification de succès pour le vendeur
    addNotification(
      `Suivi mis à jour pour la commande #${suiviOrderId}`,
      'success',
      {
        details: `Transporteur : ${suiviForm.transporteur}`
      }
    );
    
    handleCloseSuiviModal();
  };

  const statusOptions = [
    { id: 'tous', label: 'Toutes les commandes' },
    { id: 'pending', label: 'En attente' },
    { id: 'processing', label: 'En traitement' },
    { id: 'shipped', label: 'Expédiée' },
    { id: 'delivered', label: 'Livrée' },
    { id: 'cancelled', label: 'Annulée' }
  ];

  const periodOptions = [
    { id: '7j', label: '7 derniers jours' },
    { id: '30j', label: '30 derniers jours' },
    { id: '90j', label: '90 derniers jours' },
    { id: '1an', label: '1 an' }
  ];

  const filteredOrders = commandes.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'tous' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: '#fff3cd', color: '#856404', icon: BiTime };
      case 'processing': return { bg: '#d1ecf1', color: '#0c5460', icon: BiPackage };
      case 'shipped': return { bg: '#d4edda', color: '#155724', icon: BiCar };
      case 'delivered': return { bg: '#d1e7dd', color: '#0f5132', icon: BiCheckCircle };
      case 'cancelled': return { bg: '#f8d7da', color: '#721c24', icon: BiXCircle };
      default: return { bg: '#e9ecef', color: '#495057', icon: BiTime };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En traitement';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
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

  // Calcul du chiffre d'affaires (seulement les vrais achats)
  const totalRevenue = commandes.reduce((sum, order) => {
    // Ne compter que les achats normaux, pas les échanges ni remboursements
    if (order.type === 'achat') {
      return sum + (order.total || 0);
    }
    return sum;
  }, 0);
  
  // Calcul du nombre total de commandes (seulement les vrais achats)
  const totalOrders = commandes.filter(order => order.type === 'achat').length;
  
  // Nouveau calcul dynamique pour les compteurs (seulement les vrais achats) :
  const pendingOrders = commandes.filter(order =>
    order.type === 'achat' && (
      order.statut?.toLowerCase() === 'en cours' ||
     order.statut?.toLowerCase() === 'en attente' ||
     order.statut?.toLowerCase() === 'préparation' ||
     order.statut?.toLowerCase() === 'préparation en cours' ||
     order.status === 'pending' ||
      order.status === 'processing'
    )
  ).length;
  
  const shippedOrders = commandes.filter(order =>
    order.type === 'achat' && (
      order.statut?.toLowerCase() === 'expédiée' ||
      order.status === 'shipped'
    )
  ).length;
  
  const deliveredOrders = commandes.filter(order =>
    order.type === 'achat' && (
      order.statut?.toLowerCase() === 'livrée' ||
      order.status === 'delivered'
    )
  ).length;
  
  // Statistiques pour échanges et remboursements
  const echangesCount = commandes.filter(order => order.type === 'echange').length;
  const remboursementsCount = commandes.filter(order => order.type === 'remboursement').length;
  
  // Debug des statistiques
  console.log('Statistiques commandes:', {
    total: totalOrders,
    pending: pendingOrders,
    shipped: shippedOrders,
    delivered: deliveredOrders,
    echanges: echangesCount,
    remboursements: remboursementsCount,
    commandes: commandes.map(c => ({ id: c.id, type: c.type, statut: c.statut, status: c.status }))
  });

  // Gérer la sélection d'une commande
  const handleSelectOrder = (orderId) => {
    setSelectedOrders(selected =>
      selected.includes(orderId)
        ? selected.filter(id => id !== orderId)
        : [...selected, orderId]
    );
  };

  // Sélectionner/désélectionner toutes les commandes filtrées
  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  // Expédier les commandes sélectionnées
  const handleExpedierSelection = () => {
    const commandesMisAJour = commandes.map(order =>
      selectedOrders.includes(order.id)
        ? { ...order, status: 'shipped' }
        : order
    );
    setCommandes(commandesMisAJour);
    
    // Sauvegarder dans les clés des clients concernés
    const commandesExpediees = commandesMisAJour.filter(order => 
      selectedOrders.includes(order.id)
    );
    
    commandesExpediees.forEach(commande => {
      if (commande.email) {
        const clientKey = `commandes_${commande.email}`;
        const clientCommandes = JSON.parse(localStorage.getItem(clientKey) || '[]');
        
        const clientCommandesMisAJour = clientCommandes.map(cmd => 
          cmd.id === commande.id ? commande : cmd
        );
        
        localStorage.setItem(clientKey, JSON.stringify(clientCommandesMisAJour));
        console.log('Commande expédiée sauvegardée pour le client:', commande.email);
      }
    });
    
    setSelectedOrders([]);
  };

  // Exporter les commandes sélectionnées en CSV
  const handleExportSelection = () => {
    const selected = commandes.filter(order => selectedOrders.includes(order.id));
    if (selected.length === 0) return;
    const headers = ['ID', 'Client', 'Email', 'Téléphone', 'Total', 'Statut', 'Date', 'Adresse', 'Mode d\'expédition', 'Livraison estimée'];
    const rows = selected.map(order => [
      order.id,
      order.customer || order.adresse?.nom || '',
      order.email || '',
      order.phone || order.adresse?.telephone || '',
      order.total || '',
      order.status || order.statut || '',
      order.date || '',
      order.shippingAddress || order.adresse?.adresse || '',
      order.suivi?.modeExpedition || '',
      order.suivi?.dateLivraisonEstimee || ''
    ]);
    const csvContent = [headers, ...rows].map(e => e.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'commandes_selectionnees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Imprimer les factures des commandes sélectionnées
  const handlePrintSelection = () => {
    const selected = commandes.filter(order => selectedOrders.includes(order.id));
    if (selected.length === 0) return;
    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write('<html><head><title>Factures</title>');
    printWindow.document.write('<style>body{font-family:sans-serif;} h2{margin-top:24px;} table{width:100%;border-collapse:collapse;margin-bottom:24px;} th,td{border:1px solid #ccc;padding:8px;text-align:left;} .total{font-weight:bold;}</style>');
    printWindow.document.write('</head><body>');
    selected.forEach(order => {
      printWindow.document.write(`<h2>Facture - Commande ${order.id}</h2>`);
      printWindow.document.write(`<div><b>Date :</b> ${order.date || ''}</div>`);
      printWindow.document.write(`<div><b>Client :</b> ${order.customer || order.adresse?.nom || ''}</div>`);
      printWindow.document.write(`<div><b>Adresse :</b> ${order.shippingAddress || order.adresse?.adresse || ''} ${order.adresse?.ville || ''}</div>`);
      printWindow.document.write(`<div><b>Téléphone :</b> ${order.phone || order.adresse?.telephone || ''}</div>`);
      printWindow.document.write('<table><thead><tr><th>Produit</th><th>Quantité</th><th>Prix unitaire</th><th>Total</th></tr></thead><tbody>');
      (order.products || order.produits || []).forEach(prod => {
        printWindow.document.write(`<tr><td>${prod.name || prod.nom}</td><td>${prod.quantity ?? prod.qte}</td><td>${(prod.price ?? prod.prix)?.toLocaleString('fr-FR')}</td><td>${((prod.price ?? prod.prix) * (prod.quantity ?? prod.qte)).toLocaleString('fr-FR')}</td></tr>`);
      });
      printWindow.document.write('</tbody></table>');
      printWindow.document.write(`<div class='total'>Total : ${(order.total || 0).toLocaleString('fr-FR')} GNF</div>`);
      printWindow.document.write('<hr/>');
    });
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', padding: '1rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/vendeur/dashboard" style={{ textDecoration: 'none', color: '#666' }}>
                <BiArrowBack style={{ fontSize: '1.5rem' }} />
              </Link>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '600', color: '#232f3e' }}>
                  Centre de Commandes
                </h1>
                <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                  Gérez vos commandes et suivez vos expéditions
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => navigate('/vendeur/retours')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#17a2b8', color: 'white', border: 'none', borderRadius: 6,
                padding: '0.5rem 1rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <BiUndo style={{ fontSize: '1.3rem' }} />
              Gestion des retours
            </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 0' }}>
        {/* Statistiques */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiDollar style={{ fontSize: '2rem', color: '#28a745' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {totalRevenue.toLocaleString('fr-FR')} GNF
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Chiffre d'affaires</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiPackage style={{ fontSize: '2rem', color: '#007bff' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {totalOrders}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Commandes totales</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiTime style={{ fontSize: '2rem', color: '#ffc107' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {pendingOrders}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>En attente</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiCar style={{ fontSize: '2rem', color: '#17a2b8' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {shippedOrders}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Expédiées</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiCheckCircle style={{ fontSize: '2rem', color: '#28a745' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {deliveredOrders}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Livrées</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiRefresh style={{ fontSize: '2rem', color: '#ffc107' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {echangesCount}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Échanges</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiUndo style={{ fontSize: '2rem', color: '#dc3545' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {remboursementsCount}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Remboursements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
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
                placeholder="Rechercher une commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                minWidth: '150px'
              }}
            >
              {statusOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                minWidth: '150px'
              }}
            >
              {periodOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste des commandes */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0} onChange={handleSelectAll} style={{ marginRight: 12 }} />
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600' }}>
              Commandes ({filteredOrders.length})
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Console log removed - use browser dev tools instead */}
            {filteredOrders.map(order => {
              console.log('Commande affichée:', order.id, 'Suivi:', order.suivi);
              const statusConfig = getStatusColor(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div key={order.id} style={{ 
                  padding: '1.5rem', 
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ position: 'absolute', left: 10, top: 24 }}>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                    />
                  </div>
                  {/* En-tête de la commande */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                        {order.id}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', color: '#666' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <BiCalendar />
                          {formatDate(order.date)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <BiUser />
                          {order.customer}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        backgroundColor: statusConfig.bg,
                        color: statusConfig.color,
                        fontWeight: '500'
                      }}>
                        <StatusIcon />
                        {getStatusLabel(order.status)}
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#28a745' }}>
                          {order.total ? order.total.toLocaleString('fr-FR') : 0} GNF
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          {(order.products?.length || order.produits?.length || 0)} article{((order.products?.length || order.produits?.length || 0) > 1 ? 's' : '')}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Détails des produits - Style Amazon */}
                  <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '6px' }}>
                    <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: '600' }}>
                      {order.type === 'echange' ? 'Échange de produit' : 
                       order.type === 'remboursement' ? 'Remboursement' : 
                       'Produits commandés'}
                    </h4>
                    
                    {/* Produit original (pour échange/remboursement) */}
                    {(order.type === 'echange' || order.type === 'remboursement') && order.produitOriginal && (
                      <div style={{ marginBottom: '1rem' }}>
                        <h5 style={{ fontSize: '0.9rem', color: '#dc3545', marginBottom: '0.5rem' }}>
                          <BiUndo style={{ marginRight: '0.25rem' }} />
                          Produit retourné
                        </h5>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '0.75rem',
                          backgroundColor: '#f8d7da',
                          borderRadius: '4px',
                          border: '1px solid #f5c6cb'
                        }}>
                          <img 
                            src={order.produitOriginal.image} 
                            alt={order.produitOriginal.nom}
                            style={{ width: 60, height: 60, borderRadius: '4px', objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '500', marginBottom: '0.25rem', color: '#721c24' }}>
                              {order.produitOriginal.nom}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#721c24', display: 'flex', gap: '1rem' }}>
                              <span>Quantité: {order.produitOriginal.qte}</span>
                              {order.produitOriginal.couleur && <span>Couleur: {order.produitOriginal.couleur}</span>}
                              {order.produitOriginal.taille && <span>Taille: {order.produitOriginal.taille}</span>}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#721c24', marginTop: '0.25rem' }}>
                              <strong>Raison :</strong> {order.produitOriginal.raison}
                            </div>
                          </div>
                          <div style={{ fontWeight: '600', color: '#721c24', textAlign: 'right' }}>
                            {order.produitOriginal.prix?.toLocaleString('fr-FR')} GNF
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Produit d'échange (pour échange uniquement) */}
                    {order.type === 'echange' && order.produitEchange && (
                      <div style={{ marginBottom: '1rem' }}>
                        <h5 style={{ fontSize: '0.9rem', color: '#28a745', marginBottom: '0.5rem' }}>
                          <BiRefresh style={{ marginRight: '0.25rem' }} />
                          Produit de remplacement
                        </h5>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '0.75rem',
                          backgroundColor: '#d4edda',
                          borderRadius: '4px',
                          border: '1px solid #c3e6cb'
                        }}>
                          <img 
                            src={order.produitEchange.image} 
                            alt={order.produitEchange.nom}
                            style={{ width: 60, height: 60, borderRadius: '4px', objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '500', marginBottom: '0.25rem', color: '#155724' }}>
                              {order.produitEchange.nom}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#155724', display: 'flex', gap: '1rem' }}>
                              <span>Quantité: {order.produitEchange.qte}</span>
                              {order.produitEchange.couleur && <span>Couleur: {order.produitEchange.couleur}</span>}
                              {order.produitEchange.taille && <span>Taille: {order.produitEchange.taille}</span>}
                            </div>
                          </div>
                          <div style={{ fontWeight: '600', color: '#155724', textAlign: 'right' }}>
                            {order.produitEchange.prix?.toLocaleString('fr-FR')} GNF
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Produits normaux (pour commandes classiques) */}
                    {order.type === 'achat' && (order.products || order.produits || []).map((product, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem',
                          backgroundColor: 'white',
                          borderRadius: '4px'
                        }}>
                        <img 
                          src={product.image || '/assets/placeholder-product.svg'} 
                          alt={product.name || product.nom}
                          style={{ width: 60, height: 60, borderRadius: '4px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                            {product.name || product.nom}
                            </div>
                          <div style={{ fontSize: '0.8rem', color: '#666', display: 'flex', gap: '1rem' }}>
                            <span>Quantité: {product.quantity ?? product.qte}</span>
                            {product.couleur && <span>Couleur: {product.couleur}</span>}
                            {product.taille && <span>Taille: {product.taille}</span>}
                          </div>
                        </div>
                        <div style={{ fontWeight: '600', color: '#28a745', textAlign: 'right' }}>
                            {(product.price ?? product.prix)?.toLocaleString('fr-FR')} GNF
                          </div>
                        </div>
                      ))}
                    </div>

                  {/* Section détails échange/remboursement */}
                  {(order.type === 'echange' || order.type === 'remboursement') && (
                    <div style={{ 
                      backgroundColor: order.type === 'echange' ? '#fff3cd' : '#d1ecf1', 
                      padding: '1rem', 
                      borderRadius: '6px', 
                      border: `1px solid ${order.type === 'echange' ? '#ffeaa7' : '#bee5eb'}`
                    }}>
                      <h4 style={{ 
                        margin: '0 0 0.75rem 0', 
                        fontSize: '1rem', 
                        fontWeight: '600', 
                        color: order.type === 'echange' ? '#856404' : '#0c5460'
                      }}>
                                                 {order.type === 'echange' ? (
                           <>
                             <BiRefresh style={{ marginRight: '0.5rem' }} />
                             Statut de l'échange
                           </>
                         ) : (
                          <>
                            <BiDollar style={{ marginRight: '0.5rem' }} />
                            Détails du remboursement
                          </>
                        )}
                      </h4>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: order.type === 'echange' ? '#856404' : '#0c5460'
                      }}>
                        {order.type === 'echange' && order.echange && (
                          <>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong>Statut :</strong> {order.echange.statut}
                  </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong>Date de demande :</strong> {order.echange.dateDemande}
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong>Date de validation :</strong> {order.echange.dateValidation}
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong>Transporteur :</strong> {order.echange.suiviVendeur?.transporteur || 'Non défini'}
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong>Numéro de suivi :</strong> {order.echange.suiviVendeur?.numero || 'Non défini'}
                            </div>
                            <div>
                              <strong>Mode d'expédition :</strong> {order.echange.suiviVendeur?.modeExpedition || 'Non défini'}
                            </div>
                          </>
                        )}
                        {order.type === 'remboursement' && order.remboursement && (
                          <>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong>Statut :</strong> {order.remboursement.statut}
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong>Date de demande :</strong> {order.remboursement.dateDemande}
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong>Date de remboursement :</strong> {order.remboursement.dateRemboursement}
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong>Montant :</strong> {order.remboursement.montant?.toLocaleString('fr-FR')} GNF
                            </div>
                            <div>
                              <strong>Méthode :</strong> {order.remboursement.methode}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Informations client et livraison */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600' }}>
                        Informations client
                      </h4>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        {order.adresse ? (
                          <>
                            <div><strong>Nom :</strong> {order.adresse.nom || 'Non renseigné'}</div>
                            <div><strong>Adresse :</strong> {order.adresse.adresse || 'Non renseignée'}</div>
                            <div><strong>Ville :</strong> {order.adresse.ville || 'Non renseignée'}</div>
                            <div><strong>Téléphone :</strong> {order.adresse.telephone || 'Non renseigné'}</div>
                          </>
                        ) : (
                          <>
                            <div><strong>Nom :</strong> {order.customer || 'Non renseigné'}</div>
                            <div><strong>Email :</strong> {order.email || 'Non renseigné'}</div>
                            <div><strong>Téléphone :</strong> {order.phone || 'Non renseigné'}</div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600' }}>
                        Adresse de livraison
                      </h4>
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        {order.adresse ? (
                          <>
                            <div><strong>Nom complet :</strong> {order.adresse.nom}</div>
                            <div><strong>Adresse :</strong> {order.adresse.adresse}</div>
                            <div><strong>Ville :</strong> {order.adresse.ville}</div>
                            <div><strong>Téléphone :</strong> {order.adresse.telephone}</div>
                            <div><strong>Type de lieu :</strong> {
                              order.adresse.placeType === 'maison' ? 'Maison' : 
                              order.adresse.placeType === 'bureau' ? 'Bureau' : 
                              order.adresse.placeType === 'appartement' ? 'Appartement' :
                              order.adresse.placeType === 'entreprise' ? 'Entreprise' :
                              order.adresse.placeType === 'magasin' ? 'Magasin' :
                              order.adresse.placeType === 'ecole' ? 'École/Université' :
                              order.adresse.placeType === 'hopital' ? 'Hôpital/Clinique' :
                              order.adresse.placeType === 'hotel' ? 'Hôtel' :
                              order.adresse.placeType === 'residence' ? 'Résidence' :
                              order.adresse.placeType === 'villa' ? 'Villa' :
                              order.adresse.placeType === 'immeuble' ? 'Immeuble' : 'Autre'
                            }</div>
                          </>
                        ) : (
                          <div>{order.shippingAddress || 'Non renseignée'}</div>
                        )}
                      </div>
                      {order.suivi?.numero && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <strong>Numéro de suivi:</strong> {order.suivi.numero}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mode de paiement */}
                  <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '6px' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600' }}>
                      Mode de paiement
                    </h4>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {order.modePaiement || 'Non renseigné'}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#ffc107',
                        color: '#232f3e',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}
                      onClick={() => handleOpenSuiviModal(order)}
                    >
                      <BiEdit />
                      {order.type === 'echange' ? 'Gérer le suivi d\'échange' : 'Ajouter/Modifier le suivi'}
                    </button>
                    

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions en lot */}
        {filteredOrders.length > 0 && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginTop: '2rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600' }}>
              Actions en lot
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: selectedOrders.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                opacity: selectedOrders.length === 0 ? 0.5 : 1
              }}
              disabled={selectedOrders.length === 0}
              onClick={handleExportSelection}
              >
                <BiDownload />
                Exporter les commandes
              </button>
              
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: selectedOrders.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                opacity: selectedOrders.length === 0 ? 0.5 : 1
              }}
              disabled={selectedOrders.length === 0}
              onClick={handlePrintSelection}
              >
                <BiPrinter />
                Imprimer les factures
              </button>
              
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
              onClick={() => {
                if (confirm('⚠️ ATTENTION ! Vous êtes sur le point de supprimer TOUTES les données.\n\nCette action est irréversible !\n\nÊtes-vous sûr de vouloir continuer ?')) {
                  setCommandes([]);
                  addNotification('Toutes les données ont été supprimées', 'success');
                  window.location.reload();
                }
              }}
              >
                🧹 Nettoyer tout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de suivi - Style Amazon */}
      {showSuiviModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <form onSubmit={handleSaveSuivi} style={{ 
            background: 'white', 
            borderRadius: 12, 
            padding: 32, 
            minWidth: 500, 
            maxWidth: '90vw', 
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ margin: 0, color: '#232f3e', fontSize: '1.5rem' }}>
                <BiPackage style={{ marginRight: 8, color: '#ff9900' }} />
                Suivi de livraison
              </h3>
              <button 
                type="button" 
                onClick={handleCloseSuiviModal}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}
              >
                ×
              </button>
            </div>

            {/* Informations de base */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ color: '#232f3e', marginBottom: 16, fontSize: '1.1rem' }}>Informations de livraison</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#232f3e' }}>Transporteur</label>
                  <input 
                    className="form-control" 
                    name="transporteur" 
                    value={suiviForm.transporteur} 
                    onChange={handleSuiviChange} 
                    required 
                    style={{ border: '1px solid #ddd', borderRadius: 6, padding: '8px 12px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#232f3e' }}>Numéro de suivi</label>
                  <input 
                    className="form-control" 
                    name="numero" 
                    value={suiviForm.numero} 
                    onChange={handleSuiviChange} 
                    required 
                    style={{ border: '1px solid #ddd', borderRadius: 6, padding: '8px 12px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#232f3e' }}>Mode d'expédition</label>
                  <select 
                    className="form-select" 
                    name="modeExpedition" 
                    value={suiviForm.modeExpedition} 
                    onChange={handleSuiviChange} 
                    required
                    style={{ border: '1px solid #ddd', borderRadius: 6, padding: '8px 12px' }}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Express">Express</option>
                    <option value="Point relais">Point relais</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#232f3e' }}>Date de livraison estimée</label>
                  <input 
                    className="form-control" 
                    name="dateLivraisonEstimee" 
                    type="date" 
                    value={suiviForm.dateLivraisonEstimee} 
                    onChange={handleSuiviChange} 
                    required 
                    style={{ border: '1px solid #ddd', borderRadius: 6, padding: '8px 12px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: '500', color: '#232f3e' }}>Heure de livraison estimée</label>
                  <input 
                    className="form-control" 
                    name="heureLivraisonEstimee" 
                    type="time" 
                    value={suiviForm.heureLivraisonEstimee} 
                    onChange={handleSuiviChange} 
                    style={{ border: '1px solid #ddd', borderRadius: 6, padding: '8px 12px' }}
                  />
                </div>
              </div>
            </div>

            {/* Statut actuel - Style Amazon */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ color: '#232f3e', marginBottom: 16, fontSize: '1.1rem' }}>Statut de la commande</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {Object.keys(STATUTS_AMAZON).map((statut) => (
                  <button
                    key={statut}
                    type="button"
                    onClick={() => setSuiviForm({ ...suiviForm, statutActuel: statut })}
                    style={{
                      padding: '12px 16px',
                      border: `2px solid ${suiviForm.statutActuel === statut ? '#ff9900' : '#ddd'}`,
                      borderRadius: 8,
                      background: suiviForm.statutActuel === statut ? '#fff8e1' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      color: suiviForm.statutActuel === statut ? '#232f3e' : '#666'
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: 4 }}>{statut}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{STATUTS_AMAZON[statut].description}</div>
                  </button>
                ))}
              </div>
            </div>

                           {/* Configuration des dates et heures pour chaque étape */}
               <div style={{ marginBottom: 24, padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
                 <h5 style={{ color: '#232f3e', marginBottom: 12 }}>Configuration des dates et heures</h5>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                   {Object.keys(STATUTS_AMAZON).map((statut, index) => {
                     const isActive = Object.keys(STATUTS_AMAZON).indexOf(suiviForm.statutActuel) >= index;
                     return (
                       <div key={statut} style={{
                         display: 'flex',
                         alignItems: 'center',
                         gap: 12,
                         opacity: isActive ? 1 : 0.5,
                         padding: '12px',
                         border: '1px solid #ddd',
                         borderRadius: 8,
                         backgroundColor: 'white'
                       }}>
                         <div style={{
                           width: 24,
                           height: 24,
                           borderRadius: '50%',
                           backgroundColor: isActive ? '#ff9900' : '#ddd',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           color: 'white',
                           fontSize: '0.8rem',
                           fontWeight: 'bold'
                         }}>
                           {isActive ? '✓' : index + 1}
                         </div>
                         <div style={{ flex: 1 }}>
                           <div style={{ fontWeight: '500', color: '#232f3e', marginBottom: 4 }}>{statut}</div>
                           <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: 8 }}>{STATUTS_AMAZON[statut].description}</div>
                           {isActive && (
                             <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                               <input
                                 type="date"
                                 value={suiviForm[`date_${index}`] || ''}
                                 onChange={(e) => setSuiviForm({
                                   ...suiviForm,
                                   [`date_${index}`]: e.target.value
                                 })}
                                 style={{ border: '1px solid #ddd', borderRadius: 4, padding: '4px 8px', fontSize: '0.85rem' }}
                               />
                               <input
                                 type="time"
                                 value={suiviForm[`heure_${index}`] || ''}
                                 onChange={(e) => setSuiviForm({
                                   ...suiviForm,
                                   [`heure_${index}`]: e.target.value
                                 })}
                                 style={{ border: '1px solid #ddd', borderRadius: 4, padding: '4px 8px', fontSize: '0.85rem' }}
                               />
                             </div>
                           )}
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>

            {/* Boutons d'action */}
            <div style={{ 
              display: 'flex', 
              gap: 12, 
              justifyContent: 'flex-end',
              marginTop: 'auto',
              paddingTop: 20,
              borderTop: '1px solid #eee'
            }}>
              <button 
                type="button" 
                onClick={handleCloseSuiviModal}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  background: 'white',
                  color: '#232f3e',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Annuler
              </button>
              <button 
                type="submit"
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: 6,
                  background: '#ff9900',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Enregistrer le suivi
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CentreCommandes; 