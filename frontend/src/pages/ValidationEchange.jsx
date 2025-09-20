import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Badge, Alert } from 'react-bootstrap';
import { BiCheckCircle, BiXCircle, BiPackage, BiArrowBack } from 'react-icons/bi';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { useCommandes } from '../contexts/CommandesContext';
import { useAuth } from '../hooks/useAuth.jsx';

const ValidationEchange = () => {
  const [echange, setEchange] = useState(null);
  const [retour, setRetour] = useState(null);
  const [commentaire, setCommentaire] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();
  const { echangeId } = useParams();
  const { addNotification } = useNotifications();
  const { commandes, setCommandes } = useCommandes();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.email) {
      // Charger l'échange depuis localStorage (isolé par utilisateur)
      const userKeyEchanges = `echanges_${user.email}`;
      const userKeyRetours = `retours_${user.email}`;
      
      const echanges = JSON.parse(localStorage.getItem(userKeyEchanges) || '[]');
      const retours = JSON.parse(localStorage.getItem(userKeyRetours) || '[]');
      
      const echangeTrouve = echanges.find(e => e.id === echangeId);
      if (echangeTrouve) {
        setEchange(echangeTrouve);
        const retourAssocie = retours.find(r => r.id === echangeTrouve.retourId);
        setRetour(retourAssocie);
      }
    }
  }, [echangeId, user]);

  const handleValidation = async (accepted) => {
    setIsValidating(true);
    
    try {
      if (!user || !user.email) {
        throw new Error('Utilisateur non connecté');
      }

      const userKeyEchanges = `echanges_${user.email}`;
      const userKeyRetours = `retours_${user.email}`;

      // Mettre à jour le statut de l'échange
      const echanges = JSON.parse(localStorage.getItem(userKeyEchanges) || '[]');
      const echangesMisAJour = echanges.map(e => 
        e.id === echangeId ? { ...e, statut: accepted ? 'Échange validé' : 'Échange refusé' } : e
      );
      localStorage.setItem(userKeyEchanges, JSON.stringify(echangesMisAJour));

      // Mettre à jour le statut du retour
      const retours = JSON.parse(localStorage.getItem(userKeyRetours) || '[]');
      const retoursMisAJour = retours.map(r => 
        r.id === echange.retourId ? { ...r, statut: accepted ? 'Échange validé' : 'Échange refusé' } : r
      );
      localStorage.setItem(userKeyRetours, JSON.stringify(retoursMisAJour));

      if (accepted) {
        // Mettre à jour la commande d'échange avec la date de validation
        console.log('Échange à valider:', echange);
        console.log('Commandes disponibles:', commandes);
        
        const commandesMisAJour = commandes.map(cmd => {
          // Chercher la commande d'échange qui correspond au retour via l'ID
          if (cmd.type === 'echange' && cmd.echange && cmd.echange.retourId === echange.retourId) {
            console.log('Commande d\'échange trouvée:', cmd.id);
            return {
              ...cmd,
              statut: 'livrée', // Mettre à jour le statut de la commande
              status: 'delivered',
              echange: {
                ...cmd.echange,
                dateValidation: new Date().toISOString().split('T')[0], // Date de validation automatique
                statut: 'Échange validé par le client'
              }
            };
          }
          return cmd;
        });

        setCommandes(commandesMisAJour);
        
        // Sauvegarder explicitement dans le localStorage avec la clé utilisateur
        if (user && user.email) {
          const userKey = `commandes_${user.email}`;
          localStorage.setItem(userKey, JSON.stringify(commandesMisAJour));
        }

        addNotification(
          'Échange validé avec succès !',
          'success',
          {
            details: `Le produit ${echange.produitEchange.nom} a été ajouté à vos commandes`
          }
        );
      } else {
        // Créer un nouveau retour automatique
        const nouveauRetour = {
          id: 'RET-' + Math.floor(100000 + Math.random() * 900000),
          commandeId: echange.commandeId,
          dateAchat: echange.dateEchange,
          dateDemande: new Date().toISOString(),
          produits: [echange.produitEchange],
          raison: 'Produit échangé non conforme',
          commentaire: commentaire || 'Le produit échangé ne me convient pas',
          type: 'Remboursement',
          statut: 'En attente de validation'
        };

        const nouveauxRetours = [nouveauRetour, ...retoursMisAJour];
        localStorage.setItem(userKeyRetours, JSON.stringify(nouveauxRetours));

        addNotification(
          'Échange refusé - Nouveau retour créé',
          'warning',
          {
            details: `Un nouveau retour a été créé pour le produit ${echange.produitEchange.nom}`
          }
        );
      }

      // Rediriger vers la page des échanges
      setTimeout(() => {
        navigate('/echanges');
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      addNotification(
        'Erreur lors de la validation de l\'échange',
        'error',
        {
          details: 'Veuillez réessayer'
        }
      );
    } finally {
      setIsValidating(false);
    }
  };

  if (!echange) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <BiPackage style={{ fontSize: '4rem', color: '#6c757d' }} />
          <h4 className="mt-3 text-muted">Échange introuvable</h4>
          <p className="text-muted">L'échange demandé n'existe pas ou a été supprimé.</p>
          <Button variant="outline-secondary" onClick={() => navigate('/echanges')}>
            <BiArrowBack /> Retour aux échanges
          </Button>
        </div>
      </div>
    );
  }

  if (echange.statut !== 'En attente de validation client') {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <BiPackage style={{ fontSize: '4rem', color: '#6c757d' }} />
          <h4 className="mt-3 text-muted">Échange déjà traité</h4>
          <p className="text-muted">Cet échange a déjà été validé ou refusé.</p>
          <Button variant="outline-secondary" onClick={() => navigate('/echanges')}>
            <BiArrowBack /> Retour aux échanges
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <BiPackage className="me-2" />
          Validation de l'échange #{echange.id}
        </h2>
        <Button variant="outline-secondary" onClick={() => navigate('/echanges')}>
          <BiArrowBack /> Retour aux échanges
        </Button>
      </div>

      <Alert variant="info" className="mb-4">
        <h6>Instructions :</h6>
        <p className="mb-0">
          Vous avez reçu le produit d'échange. Veuillez le tester et décider si vous l'acceptez ou le refusez.
          <br />
          <strong>Si vous acceptez :</strong> Le produit sera ajouté à vos commandes.
          <br />
          <strong>Si vous refusez :</strong> Un nouveau retour sera créé automatiquement.
        </p>
      </Alert>

      <div className="row">
        <div className="col-md-6">
          <Card className="mb-4">
            <Card.Header>
              <h6>Produit retourné</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center">
                <img 
                                          src={echange.produitRetourne?.image || '/assets/placeholder-product.svg'} 
                  alt="Produit retourné" 
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  className="me-3"
                />
                <div>
                  <h6>{echange.produitRetourne?.nom || 'Produit'}</h6>
                  <p className="text-muted mb-0">
                    Prix : {echange.produitRetourne?.prix?.toLocaleString('fr-FR')} GNF
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6">
          <Card className="mb-4 border-success">
            <Card.Header className="bg-success text-white">
              <h6>Produit échangé reçu</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center">
                <img 
                                          src={echange.produitEchange?.image || '/assets/placeholder-product.svg'} 
                  alt="Produit échangé" 
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  className="me-3"
                />
                <div>
                  <h6 className="text-success">{echange.produitEchange?.nom || 'Produit'}</h6>
                  <p className="text-muted mb-0">
                    Prix : {echange.produitEchange?.prix?.toLocaleString('fr-FR')} GNF
                    <br />
                    Quantité : {echange.produitEchange?.quantite || 1}
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {echange.commentaire && (
        <Card className="mb-4">
          <Card.Header>
            <h6>Commentaire du vendeur</h6>
          </Card.Header>
          <Card.Body>
            <p className="mb-0 fst-italic">{echange.commentaire}</p>
          </Card.Body>
        </Card>
      )}

      <Card className="mb-4">
        <Card.Header>
          <h6>Votre commentaire (optionnel)</h6>
        </Card.Header>
        <Card.Body>
          <Form.Control
            as="textarea"
            rows="3"
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Ajoutez un commentaire sur votre décision..."
          />
        </Card.Body>
      </Card>

      <div className="d-flex gap-3 justify-content-center">
        <Button 
          variant="success" 
          size="lg"
          onClick={() => handleValidation(true)}
          disabled={isValidating}
        >
          <BiCheckCircle className="me-2" />
          {isValidating ? 'Validation...' : 'Accepter l\'échange'}
        </Button>
        
        <Button 
          variant="danger" 
          size="lg"
          onClick={() => handleValidation(false)}
          disabled={isValidating}
        >
          <BiXCircle className="me-2" />
          {isValidating ? 'Validation...' : 'Refuser l\'échange'}
        </Button>
      </div>
    </div>
  );
};

export default ValidationEchange; 