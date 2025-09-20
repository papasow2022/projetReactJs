import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useStock } from '../contexts/StockContext';

const UserWaitingList = () => {
  const { user } = useAuth();
  const { getUserWaitingList, removeFromWaitingList, waitingList } = useStock();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      loadWaitingList();
    }
  }, [user?.email]);

  const loadWaitingList = async () => {
    setLoading(true);
    try {
      await getUserWaitingList(user.email);
    } catch (error) {
      console.error('Erreur chargement liste d\'attente:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWaitingList = async (entryId) => {
    if (window.confirm('Êtes-vous sûr de vouloir vous retirer de cette liste d\'attente ?')) {
      await removeFromWaitingList(entryId, user.email);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'waiting':
        return <span className="badge bg-warning">En attente</span>;
      case 'notified':
        return <span className="badge bg-success">Notifié</span>;
      case 'fulfilled':
        return <span className="badge bg-info">Traité</span>;
      case 'cancelled':
        return <span className="badge bg-secondary">Annulé</span>;
      default:
        return <span className="badge bg-light text-dark">Inconnu</span>;
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'homme': 'primary',
      'femme': 'pink',
      'enfant': 'success'
    };
    return <span className={`badge bg-${colors[category] || 'secondary'}`}>{category}</span>;
  };

  if (!user) {
    return (
      <div className="alert alert-warning text-center">
        <h5>🔐 Connexion requise</h5>
        <p>Vous devez être connecté pour voir vos listes d'attente.</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.href = '/connexion'}
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>📋 Mes Listes d'Attente</h2>
            <button 
              className="btn btn-outline-primary"
              onClick={loadWaitingList}
              disabled={loading}
            >
              {loading ? '⏳ Chargement...' : '🔄 Actualiser'}
            </button>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-2">Chargement de vos listes d'attente...</p>
            </div>
          ) : waitingList.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <div className="mb-3">
                  <i className="bi bi-inbox display-1 text-muted"></i>
                </div>
                <h5 className="text-muted">Aucune liste d'attente</h5>
                <p className="text-muted">
                  Vous n'êtes actuellement sur aucune liste d'attente.<br/>
                  Rejoignez une liste d'attente depuis la page d'un produit en rupture de stock.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/catalogue'}
                >
                  Voir le catalogue
                </button>
              </div>
            </div>
          ) : (
            <div className="row">
              {waitingList.map((entry) => (
                <div key={entry.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title mb-0">{entry.productName}</h6>
                        {getStatusBadge(entry.status)}
                      </div>
                      
                      <div className="mb-2">
                        {getCategoryBadge(entry.category)}
                      </div>
                      
                      <div className="mb-3">
                        <small className="text-muted">
                          <strong>Quantité souhaitée :</strong> {entry.requestedQuantity} exemplaire(s)
                        </small>
                      </div>
                      
                      <div className="mb-3">
                        <small className="text-muted">
                          <strong>Inscrit le :</strong> {new Date(entry.createdAt).toLocaleDateString('fr-FR')}
                        </small>
                      </div>
                      
                      {entry.notifiedAt && (
                        <div className="mb-3">
                          <small className="text-success">
                            <strong>Notifié le :</strong> {new Date(entry.notifiedAt).toLocaleDateString('fr-FR')}
                          </small>
                        </div>
                      )}
                      
                      <div className="mt-auto">
                        {entry.status === 'waiting' && (
                          <div className="alert alert-info py-2 mb-2">
                            <small>
                              <i className="bi bi-info-circle me-1"></i>
                              Vous serez notifié par email dès que ce produit sera disponible.
                            </small>
                          </div>
                        )}
                        
                        {entry.status === 'notified' && (
                          <div className="alert alert-success py-2 mb-2">
                            <small>
                              <i className="bi bi-check-circle me-1"></i>
                              Ce produit est disponible ! Vérifiez votre email pour le lien direct.
                            </small>
                          </div>
                        )}
                        
                        <div className="d-flex gap-2">
                          {entry.status === 'waiting' && (
                            <button
                              className="btn btn-outline-danger btn-sm flex-grow-1"
                              onClick={() => handleRemoveFromWaitingList(entry.id)}
                            >
                              ❌ Se retirer
                            </button>
                          )}
                          
                          {entry.status === 'notified' && (
                            <button
                              className="btn btn-success btn-sm flex-grow-1"
                              onClick={() => {
                                // Rediriger vers le produit
                                window.location.href = `/product/${entry.productId}`;
                              }}
                            >
                              👀 Voir le produit
                            </button>
                          )}
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
  );
};

export default UserWaitingList;

