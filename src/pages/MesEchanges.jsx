import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Alert } from 'react-bootstrap';
import { BiPackage, BiArrowBack, BiCheckCircle } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLanguage } from "../contexts/LanguageContext";

const MesEchanges = () => {
  const [echanges, setEchanges] = useState([]);
  const [retours, setRetours] = useState([]);
  const { user } = useAuth();
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
    if (user && user.email) {
      const userKeyEchanges = `echanges_${user.email}`;
      const userKeyRetours = `retours_${user.email}`;
      
      const storedEchanges = localStorage.getItem(userKeyEchanges);
      const storedRetours = localStorage.getItem(userKeyRetours);
      
      if (storedEchanges) {
        setEchanges(JSON.parse(storedEchanges));
      } else {
        setEchanges([]);
      }
      if (storedRetours) {
        setRetours(JSON.parse(storedRetours));
      } else {
        setRetours([]);
      }
    }
  }, [user]);

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'Échangé':
        return <Badge bg="success">Échangé</Badge>;
      case 'En attente de validation client':
        return <Badge bg="warning" text="dark">En attente de validation</Badge>;
      case 'Échange validé':
        return <Badge bg="success">Échange validé</Badge>;
      case 'Échange refusé':
        return <Badge bg="danger">Échange refusé</Badge>;
      case 'En cours':
        return <Badge bg="warning" text="dark">En cours</Badge>;
      case 'Annulé':
        return <Badge bg="danger">Annulé</Badge>;
      default:
        return <Badge bg="secondary">{statut}</Badge>;
    }
  };

  const getTypeBadge = (type) => {
    return <Badge bg="info">{type}</Badge>;
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <BiPackage className="me-2" />
          Mes échanges
        </h2>
        <Button variant="outline-secondary" onClick={() => navigate('/commandes')}>
          <BiArrowBack /> Retour aux commandes
        </Button>
      </div>

      {echanges.length === 0 ? (
        <div className="text-center py-5">
          <BiPackage style={{ fontSize: '4rem', color: '#6c757d' }} />
          <h4 className="mt-3 text-muted">Aucun échange effectué</h4>
          <p className="text-muted">Vos échanges apparaîtront ici une fois effectués.</p>
        </div>
      ) : (
        <div className="row">
          {echanges.map(echange => {
            // Trouver le retour associé
            const retourAssocie = retours.find(r => r.id === echange.retourId);
            
            return (
              <div key={echange.id} className="col-12 mb-4">
                <Card className="border-success">
                  <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-0">
                        <BiCheckCircle className="me-2" />
                        Échange #{echange.id}
                      </h5>
                      <small>
                        Retour #{echange.retourId} - Commande #{echange.commandeId}
                      </small>
                    </div>
                    <div className="text-end">
                      {getStatutBadge(echange.statut)}
                      <br />
                      <small>
                        {formatDate(echange.dateEchange)}
                      </small>
                    </div>
                  </Card.Header>
                  
                  <Card.Body>
                    {/* Bouton de validation si l'échange est en attente */}
                    {echange.statut === 'En attente de validation client' && (
                      <Alert variant="warning" className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">
                              <i className="bi bi-clock me-2"></i>
                              Échange en attente de validation
                            </h6>
                            <p className="mb-0">Vous avez reçu le produit d'échange. Veuillez le valider.</p>
                          </div>
                          <Button 
                            variant="primary"
                            onClick={() => navigate(`/validation-echange/${echange.id}`)}
                          >
                            <i className="bi bi-check-circle me-1"></i>
                            Valider l'échange
                          </Button>
                        </div>
                      </Alert>
                    )}
                    
                    {/* Message de confirmation si échange validé */}
                    {echange.statut === 'Échange validé' && (
                      <Alert variant="success" className="mb-3">
                        <h6 className="mb-1">
                          <i className="bi bi-check-circle me-2"></i>
                          Échange validé avec succès !
                        </h6>
                        <p className="mb-0">Le produit a été ajouté à vos commandes.</p>
                      </Alert>
                    )}
                    
                    {/* Message si échange refusé */}
                    {echange.statut === 'Échange refusé' && (
                      <Alert variant="danger" className="mb-3">
                        <h6 className="mb-1">
                          <i className="bi bi-x-circle me-2"></i>
                          Échange refusé
                        </h6>
                        <p className="mb-0">Un nouveau retour a été créé automatiquement.</p>
                      </Alert>
                    )}
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="text-muted">
                          <i className="bi bi-arrow-left me-2"></i>
                          Produit retourné
                        </h6>
                        <div className="card p-3 bg-light">
                          <div className="d-flex align-items-center">
                            <img 
                              src={echange.produitRetourne?.image || '/assets/placeholder-product.svg'} 
                              alt="Produit retourné" 
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                              className="me-3"
                            />
                            <div>
                              <strong>{echange.produitRetourne?.nom || 'Produit'}</strong>
                              <br />
                              <span className="text-muted">
                                Prix : {echange.produitRetourne?.prix?.toLocaleString('fr-FR')} GNF
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <h6 className="text-success">
                          <i className="bi bi-arrow-right me-2"></i>
                          Produit échangé
                        </h6>
                        <div className="card p-3 bg-success bg-opacity-10 border-success">
                          <div className="d-flex align-items-center">
                            <img 
                              src={echange.produitEchange?.image || '/assets/placeholder-product.svg'} 
                              alt="Produit échangé" 
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                              className="me-3"
                            />
                            <div>
                              <strong className="text-success">{echange.produitEchange?.nom || 'Produit'}</strong>
                              <br />
                              <span className="text-muted">
                                Prix : {echange.produitEchange?.prix?.toLocaleString('fr-FR')} GNF
                                <br />
                                Quantité : {echange.produitEchange?.quantite || 1}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Informations du retour associé */}
                    {retourAssocie && (
                      <div className="mt-3 p-3 bg-light rounded">
                        <h6>Détails de la demande de retour :</h6>
                        <div className="row">
                          <div className="col-md-6">
                            <p><strong>Type :</strong> {getTypeBadge(retourAssocie.type)}</p>
                            <p><strong>Raison :</strong> {retourAssocie.raison}</p>
                          </div>
                          <div className="col-md-6">
                            <p><strong>Date de demande :</strong> {formatDate(retourAssocie.dateDemande)}</p>
                            {retourAssocie.commentaire && (
                              <p><strong>Votre commentaire :</strong> {retourAssocie.commentaire}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Commentaire du vendeur */}
                    {echange.commentaire && (
                      <div className="mt-3 p-3 bg-info bg-opacity-10 rounded">
                        <h6>Commentaire du vendeur :</h6>
                        <p className="mb-0 fst-italic">{echange.commentaire}</p>
                      </div>
                    )}
                    
                    {/* Résumé financier */}
                    <div className="mt-3 pt-3 border-top">
                      <div className="row text-center">
                        <div className="col-md-4">
                          <small className="text-muted">Prix total retourné</small>
                          <div className="fw-bold">
                            {echange.produitRetourne?.prix?.toLocaleString('fr-FR')} GNF
                          </div>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted">Prix total échangé</small>
                          <div className="fw-bold text-success">
                            {(echange.produitEchange?.prix * (echange.produitEchange?.quantite || 1)).toLocaleString('fr-FR')} GNF
                          </div>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted">Différence</small>
                          <div className={`fw-bold ${(echange.produitEchange?.prix * (echange.produitEchange?.quantite || 1)) - echange.produitRetourne?.prix > 0 ? 'text-danger' : 'text-success'}`}>
                            {((echange.produitEchange?.prix * (echange.produitEchange?.quantite || 1)) - echange.produitRetourne?.prix).toLocaleString('fr-FR')} GNF
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MesEchanges; 