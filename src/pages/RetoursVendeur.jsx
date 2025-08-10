import React, { useState, useEffect } from 'react';
import { Button, Card, Badge, Modal, Form } from 'react-bootstrap';
import { BiCheck, BiX, BiPackage, BiUndo, BiHistory } from 'react-icons/bi';
import { useNotifications } from '../contexts/NotificationContext';
import EchangeModal from './EchangeModal';
import { useNavigate } from 'react-router-dom';

const RetoursVendeur = () => {
  const [retours, setRetours] = useState([]);
  const [showEchangeModal, setShowEchangeModal] = useState(false);
  const [retourSelectionne, setRetourSelectionne] = useState(null);
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

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

  useEffect(() => {
    // Récupérer tous les retours de tous les clients
    const allRetours = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('retours_')) {
        try {
          const userRetours = JSON.parse(localStorage.getItem(key));
          if (Array.isArray(userRetours)) {
            allRetours.push(...userRetours);
          }
        } catch (error) {
          console.error('Erreur lors du chargement des retours:', error);
        }
      }
    }
    
    setRetours(allRetours);
  }, []);

  const updateStatut = (retourId, newStatut) => {
    // Trouver le retour à mettre à jour
    const retourToUpdate = retours.find(r => r.id === retourId);
    if (!retourToUpdate) return;
    
    // Mettre à jour dans le localStorage du client concerné
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('retours_')) {
        try {
          const userRetours = JSON.parse(localStorage.getItem(key));
          if (Array.isArray(userRetours)) {
            const retourIndex = userRetours.findIndex(r => r.id === retourId);
            if (retourIndex !== -1) {
              // Mettre à jour le retour
              userRetours[retourIndex] = { ...userRetours[retourIndex], statut: newStatut };
              localStorage.setItem(key, JSON.stringify(userRetours));
              break;
            }
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour:', error);
        }
      }
    }
    
    // Mettre à jour l'état local
    const retoursMisAJour = retours.map(retour => {
      if (retour.id === retourId) {
        const retourMisAJour = { ...retour, statut: newStatut };
        
        // Ajouter une notification selon le statut
        let message = '';
        let type = 'info';
        
        switch (newStatut) {
          case 'Accepté':
            message = `Retour #${retour.id} accepté`;
            type = 'success';
            break;
          case 'Refusé':
            message = `Retour #${retour.id} refusé`;
            type = 'error';
            break;
          case 'Remboursé':
            message = `Remboursement effectué pour le retour #${retour.id}`;
            type = 'success';
            break;
          case 'Échangé':
            message = `Échange effectué pour le retour #${retour.id}`;
            type = 'success';
            break;
          default:
            message = `Statut du retour #${retour.id} mis à jour`;
            type = 'info';
        }
        
        addNotification(message, type, {
          details: `Commande #${retour.commandeId} - ${retour.produits[0]?.nom || 'Produit'}`
        });
        
        return retourMisAJour;
      }
      return retour;
    });
    
    setRetours(retoursMisAJour);
  };

  const handleEchangeClick = (retour) => {
    setRetourSelectionne(retour);
    setShowEchangeModal(true);
  };

  const handleEchangeComplete = (echange) => {
    // Mettre à jour la liste des retours
    const retoursMisAJour = retours.map(r => 
      r.id === echange.retourId ? { ...r, statut: 'Échangé', echangeId: echange.id } : r
    );
    setRetours(retoursMisAJour);
    localStorage.setItem('retours', JSON.stringify(retoursMisAJour));
    
    // Notification de succès
    addNotification(
      `Échange effectué avec succès pour le retour #${echange.retourId}`,
      'success',
      {
        details: `Produit échangé : ${echange.produitEchange.nom}`
      }
    );
  };

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'En attente de validation':
        return <Badge bg="warning" text="dark">En attente</Badge>;
      case 'Accepté':
        return <Badge bg="success">Accepté</Badge>;
      case 'Refusé':
        return <Badge bg="danger">Refusé</Badge>;
      case 'Remboursé':
        return <Badge bg="info">Remboursé</Badge>;
      case 'Échangé':
        return <Badge bg="primary">Échangé</Badge>;
      default:
        return <Badge bg="secondary">{statut}</Badge>;
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <BiUndo className="me-2" />
          Gestion des retours et remboursements
        </h2>
        <div className="d-flex gap-2">
          <Button variant="outline-info" onClick={() => navigate('/vendeur/echanges')}>
            <BiHistory /> Historique des échanges
          </Button>
          <div className="text-muted align-self-center">
            {retours.length} retour{retours.length > 1 ? 's' : ''} au total
          </div>
        </div>
      </div>

      {retours.length === 0 ? (
        <div className="text-center py-5">
          <BiUndo style={{ fontSize: '4rem', color: '#6c757d' }} />
          <h4 className="mt-3 text-muted">Aucun retour à traiter</h4>
          <p className="text-muted">Les demandes de retour des clients apparaîtront ici.</p>
        </div>
      ) : (
        <div className="row">
          {retours.map(retour => (
            <div key={retour.id} className="col-md-6 col-lg-4 mb-4">
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <strong>Retour #{retour.id}</strong>
                  {getStatutBadge(retour.statut)}
                </Card.Header>
                
                <Card.Body>
                  <div className="mb-2">
                    <b>Commande :</b> #{retour.commandeId}
                  </div>
                  <div className="mb-2">
                    <b>Date d'achat :</b> {formatDate(retour.dateAchat)}
                  </div>
                  <div className="mb-2">
                    <b>Date de demande :</b> {formatDate(retour.dateDemande)}
                  </div>
                  <div className="mb-2">
                    <b>Type de retour :</b> {retour.type}
                  </div>
                  
                  <div className="mb-3">
                    <b>Produits :</b>
                    {retour.produits && retour.produits.length > 0 ? (
                      retour.produits.map((produit, index) => (
                        <div key={index} className="d-flex align-items-center mb-2 p-2 bg-light rounded">
                          <img 
                            src={produit.image || produit.img || produit.photo || '/assets/placeholder-product.svg'} 
                            alt={produit.nom || produit.name || produit.title || 'Produit'} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            className="me-3"
                            onError={(e) => {
                              e.target.src = '/assets/placeholder-product.svg';
                            }}
                          />
                          <div className="flex-grow-1">
                            <div className="fw-bold">{produit.nom || produit.name || produit.title || 'Produit'}</div>
                            <div className="text-muted small">
                              Quantité : {produit.qte || 1} • Prix : {(produit.prix || produit.price || 0)?.toLocaleString('fr-FR')} GNF
                            </div>
                            {produit.couleur && <div className="text-muted small">Couleur : {produit.couleur}</div>}
                            {produit.taille && <div className="text-muted small">Taille : {produit.taille}</div>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted small p-2 bg-light rounded">
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        Aucun produit spécifié dans ce retour
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-2">
                    <b>Raison :</b> {retour.raison}
                  </div>
                  
                  {retour.commentaire && (
                    <div className="mb-2">
                      <b>Commentaire :</b> {retour.commentaire}
                    </div>
                  )}
                  
                  <div className="d-flex gap-2 mt-3">
                    {retour.statut === 'En attente de validation' && (
                      <>
                        <Button variant="success" size="sm" onClick={() => updateStatut(retour.id, 'Accepté')}>
                          <BiCheck /> Accepter
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => updateStatut(retour.id, 'Refusé')}>
                          <BiX /> Refuser
                        </Button>
                      </>
                    )}
                    
                    {retour.statut === 'Accepté' && retour.type === 'Remboursement' && (
                      <Button variant="primary" size="sm" onClick={() => updateStatut(retour.id, 'Remboursé')}>
                        <BiCheck /> Marquer comme remboursé
                      </Button>
                    )}
                    
                    {retour.statut === 'Accepté' && retour.type === 'Échange' && (
                      <Button variant="info" size="sm" onClick={() => handleEchangeClick(retour)}>
                        <BiPackage /> Gérer l'échange
                      </Button>
                    )}
                    
                    {retour.statut === 'Échangé' && retour.echangeId && (
                      <div className="w-100">
                        <Badge bg="success" className="mb-2">
                          Échange #{retour.echangeId} effectué
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      <EchangeModal
        show={showEchangeModal}
        onHide={() => setShowEchangeModal(false)}
        retour={retourSelectionne}
        onEchangeComplete={handleEchangeComplete}
      />
    </div>
  );
};

export default RetoursVendeur; 