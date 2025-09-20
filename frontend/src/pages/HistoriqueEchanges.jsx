import React, { useState, useEffect } from 'react';
import { Card, Badge, Table, Button } from 'react-bootstrap';
import { BiPackage, BiArrowBack } from 'react-icons/bi';
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from 'react-router-dom';

const HistoriqueEchanges = () => {
  const [echanges, setEchanges] = useState([]);
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
    const stored = localStorage.getItem('echanges');
    if (stored) {
      setEchanges(JSON.parse(stored));
    }
  }, []);

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'Échangé':
        return <Badge bg="success">Échangé</Badge>;
      case 'En cours':
        return <Badge bg="warning" text="dark">En cours</Badge>;
      case 'Annulé':
        return <Badge bg="danger">Annulé</Badge>;
      default:
        return <Badge bg="secondary">{statut}</Badge>;
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <BiPackage className="me-2" />
          Historique des échanges
        </h2>
        <Button variant="outline-secondary" onClick={() => navigate('/vendeur/retours')}>
          <BiArrowBack /> Retour aux retours
        </Button>
      </div>

      {echanges.length === 0 ? (
        <div className="text-center py-5">
          <BiPackage style={{ fontSize: '4rem', color: '#6c757d' }} />
          <h4 className="mt-3 text-muted">Aucun échange effectué</h4>
          <p className="text-muted">Les échanges effectués apparaîtront ici.</p>
        </div>
      ) : (
        <div className="row">
          {echanges.map(echange => (
            <div key={echange.id} className="col-12 mb-4">
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Échange #{echange.id}</strong>
                    <br />
                    <small className="text-muted">
                      Retour #{echange.retourId} - Commande #{echange.commandeId}
                    </small>
                  </div>
                  <div className="text-end">
                    {getStatutBadge(echange.statut)}
                    <br />
                    <small className="text-muted">
                      {formatDate(echange.dateEchange)}
                    </small>
                  </div>
                </Card.Header>
                
                <Card.Body>
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Produit retourné :</h6>
                      <div className="card p-3 bg-light">
                        <div className="d-flex align-items-center">
                          <img 
                            src={echange.produitRetourne?.image || '/assets/placeholder-product.svg'} 
                            alt="Produit retourné" 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            className="me-3"
                          />
                          <div>
                            <strong>{echange.produitRetourne?.nom || 'Produit'}</strong>
                            <br />
                            <small className="text-muted">
                              Prix : {echange.produitRetourne?.prix?.toLocaleString('fr-FR')} GNF
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <h6>Produit échangé :</h6>
                      <div className="card p-3 bg-success bg-opacity-10">
                        <div className="d-flex align-items-center">
                          <img 
                            src={echange.produitEchange?.image || '/assets/placeholder-product.svg'} 
                            alt="Produit échangé" 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            className="me-3"
                          />
                          <div>
                            <strong>{echange.produitEchange?.nom || 'Produit'}</strong>
                            <br />
                            <small className="text-muted">
                              Prix : {echange.produitEchange?.prix?.toLocaleString('fr-FR')} GNF
                              <br />
                              Quantité : {echange.produitEchange?.quantite || 1}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {echange.commentaire && (
                    <div className="mt-3">
                      <h6>Commentaire :</h6>
                      <p className="text-muted mb-0">{echange.commentaire}</p>
                    </div>
                  )}
                  
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
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoriqueEchanges; 