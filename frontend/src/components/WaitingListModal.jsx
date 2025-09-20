import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useStock } from '../contexts/StockContext';

const WaitingListModal = ({ isOpen, onClose, product }) => {
  const { user } = useAuth();
  const { addToWaitingList, getUserWaitingList, removeFromWaitingList, waitingList } = useStock();
  const [requestedQuantity, setRequestedQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userWaitingList, setUserWaitingList] = useState([]);

  useEffect(() => {
    if (isOpen && user?.email) {
      loadUserWaitingList();
    }
  }, [isOpen, user?.email]);

  const loadUserWaitingList = async () => {
    if (user?.email) {
      await getUserWaitingList(user.email);
      setUserWaitingList(waitingList);
    }
  };

  const handleAddToWaitingList = async () => {
    if (!user?.email) {
      alert('Vous devez être connecté pour rejoindre la liste d\'attente');
      return;
    }

    if (!product) {
      alert('Informations produit manquantes');
      return;
    }

    setIsLoading(true);
    try {
      const result = await addToWaitingList(
        user.email,
        product.id,
        product.name,
        product.category,
        requestedQuantity
      );
      
      if (result) {
        await loadUserWaitingList();
        onClose();
      }
    } catch (error) {
      console.error('Erreur ajout liste d\'attente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWaitingList = async (entryId) => {
    if (!user?.email) return;

    setIsLoading(true);
    try {
      const result = await removeFromWaitingList(entryId, user.email);
      if (result) {
        await loadUserWaitingList();
      }
    } catch (error) {
      console.error('Erreur suppression liste d\'attente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              📋 Liste d'attente - {product?.name}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body">
            {!user ? (
              <div className="alert alert-warning text-center">
                <h6>🔐 Connexion requise</h6>
                <p>Vous devez être connecté pour rejoindre la liste d'attente.</p>
                <button className="btn btn-primary" onClick={() => window.location.href = '/connexion'}>
                  Se connecter
                </button>
              </div>
            ) : (
              <>
                {/* Informations produit */}
                <div className="card mb-4">
                  <div className="card-body">
                    <h6 className="card-title">📦 Produit en rupture</h6>
                    <p className="card-text">
                      <strong>{product?.name}</strong><br/>
                      <small className="text-muted">Catégorie: {product?.category}</small>
                    </p>
                    <div className="alert alert-info">
                      <small>
                        <strong>ℹ️ Comment ça marche ?</strong><br/>
                        • Inscrivez-vous pour être notifié quand le produit sera disponible<br/>
                        • Vous recevrez un email avec un lien direct vers le produit<br/>
                        • Premier arrivé, premier servi
                      </small>
                    </div>
                  </div>
                </div>

                {/* Formulaire d'ajout */}
                <div className="card mb-4">
                  <div className="card-body">
                    <h6 className="card-title">➕ Rejoindre la liste d'attente</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <label className="form-label">Quantité souhaitée</label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          max="10"
                          value={requestedQuantity}
                          onChange={(e) => setRequestedQuantity(parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col-md-6 d-flex align-items-end">
                        <button
                          className="btn btn-success w-100"
                          onClick={handleAddToWaitingList}
                          disabled={isLoading}
                        >
                          {isLoading ? '⏳ Ajout...' : '✅ Rejoindre la liste'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Liste d'attente actuelle */}
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">📋 Mes listes d'attente</h6>
                    {userWaitingList.length === 0 ? (
                      <p className="text-muted text-center">Aucune liste d'attente active</p>
                    ) : (
                      <div className="list-group">
                        {userWaitingList.map((entry) => (
                          <div key={entry.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{entry.productName}</strong><br/>
                              <small className="text-muted">
                                Quantité: {entry.requestedQuantity} | 
                                Statut: <span className={`badge ${
                                  entry.status === 'waiting' ? 'bg-warning' : 
                                  entry.status === 'notified' ? 'bg-success' : 'bg-secondary'
                                }`}>
                                  {entry.status === 'waiting' ? 'En attente' : 
                                   entry.status === 'notified' ? 'Notifié' : 'Traité'}
                                </span>
                              </small>
                            </div>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleRemoveFromWaitingList(entry.id)}
                              disabled={isLoading}
                            >
                              ❌ Supprimer
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingListModal;

