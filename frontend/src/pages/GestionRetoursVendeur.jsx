import React, { useState, useEffect, useContext } from 'react';
import { ReturnsContext } from '../contexts/ReturnsContext';
import { VendorContext } from '../contexts/VendorContext';
import { 
  BiArrowBack, 
  BiPackage, 
  BiCheck, 
  BiX, 
  BiMessage, 
  BiCalendar,
  BiFilter,
  BiSearch,
  BiDownload,
  BiRefresh,
  BiInfoCircle,
  BiTime,
  BiUser,
  BiShoppingBag
} from 'react-icons/bi';
import './GestionRetoursVendeur.css';

const GestionRetoursVendeur = () => {
  const { returns, updateReturnStatus, addReturnResponse } = useContext(ReturnsContext);
  const { vendor } = useContext(VendorContext);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [responseText, setResponseText] = useState('');

  // Filtrer les retours du vendeur
  const vendorReturns = returns.filter(returnItem => 
    returnItem.vendorId === vendor?.id
  );

  // Filtrer et rechercher
  const filteredReturns = vendorReturns.filter(returnItem => {
    const matchesFilter = filter === 'all' || returnItem.status === filter;
    const matchesSearch = returnItem.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusUpdate = (returnId, newStatus) => {
    updateReturnStatus(returnId, newStatus);
    setSelectedReturn(null);
  };

  const handleAddResponse = (returnId) => {
    if (responseText.trim()) {
      addReturnResponse(returnId, responseText, vendor?.name || 'Vendeur');
      setResponseText('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'completed': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const exportReturns = () => {
    const csvContent = [
      ['ID Commande', 'Produit', 'Client', 'Raison', 'Statut', 'Date', 'Montant'],
      ...filteredReturns.map(returnItem => [
        returnItem.orderId,
        returnItem.productName,
        returnItem.customerName,
        returnItem.reason,
        getStatusText(returnItem.status),
        new Date(returnItem.date).toLocaleDateString(),
        returnItem.amount
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `retours_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="gestion-retours-vendeur">
      <div className="retours-header">
        <div className="header-content">
          <div className="header-left">
            <BiPackage className="header-icon" />
            <div>
              <h1>Gestion des Retours</h1>
              <p>Gérez les demandes de retour et d'échange de vos clients</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={exportReturns}>
              <BiDownload /> Exporter
            </button>
            <button className="btn btn-primary">
              <BiRefresh /> Actualiser
            </button>
          </div>
        </div>
      </div>

      <div className="retours-stats">
        <div className="stat-card">
          <div className="stat-icon pending">
            <BiTime />
          </div>
          <div className="stat-content">
            <h3>{vendorReturns.filter(r => r.status === 'pending').length}</h3>
            <p>En attente</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon approved">
            <BiCheck />
          </div>
          <div className="stat-content">
            <h3>{vendorReturns.filter(r => r.status === 'approved').length}</h3>
            <p>Approuvés</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">
            <BiPackage />
          </div>
          <div className="stat-content">
            <h3>{vendorReturns.filter(r => r.status === 'completed').length}</h3>
            <p>Terminés</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total">
            <BiShoppingBag />
          </div>
          <div className="stat-content">
            <h3>{vendorReturns.length}</h3>
            <p>Total</p>
          </div>
        </div>
      </div>

      <div className="retours-filters">
        <div className="filter-group">
          <BiFilter className="filter-icon" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvés</option>
            <option value="rejected">Rejetés</option>
            <option value="completed">Terminés</option>
          </select>
        </div>
        <div className="search-group">
          <BiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par commande, produit ou client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="retours-list">
        {filteredReturns.length === 0 ? (
          <div className="empty-state">
            <BiPackage className="empty-icon" />
            <h3>Aucun retour trouvé</h3>
            <p>Aucune demande de retour ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          filteredReturns.map(returnItem => (
            <div key={returnItem.id} className="return-card">
              <div className="return-header">
                <div className="return-info">
                  <h3>Commande #{returnItem.orderId}</h3>
                  <p className="product-name">{returnItem.productName}</p>
                  <div className="return-meta">
                    <span className="customer">
                      <BiUser /> {returnItem.customerName}
                    </span>
                    <span className="date">
                      <BiCalendar /> {new Date(returnItem.date).toLocaleDateString()}
                    </span>
                    <span className="amount">€{returnItem.amount}</span>
                  </div>
                </div>
                <div className="return-status">
                  <span className={`status-badge ${getStatusColor(returnItem.status)}`}>
                    {getStatusText(returnItem.status)}
                  </span>
                </div>
              </div>

              <div className="return-details">
                <div className="detail-section">
                  <h4>Raison du retour</h4>
                  <p>{returnItem.reason}</p>
                </div>
                
                {returnItem.description && (
                  <div className="detail-section">
                    <h4>Description</h4>
                    <p>{returnItem.description}</p>
                  </div>
                )}

                {returnItem.responses && returnItem.responses.length > 0 && (
                  <div className="detail-section">
                    <h4>Conversation</h4>
                    <div className="responses">
                      {returnItem.responses.map((response, index) => (
                        <div key={index} className={`response ${response.sender === 'vendor' ? 'vendor-response' : 'customer-response'}`}>
                          <div className="response-header">
                            <strong>{response.senderName}</strong>
                            <span className="response-date">
                              {new Date(response.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p>{response.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {returnItem.status === 'pending' && (
                <div className="return-actions">
                  <button 
                    className="btn btn-success"
                    onClick={() => handleStatusUpdate(returnItem.id, 'approved')}
                  >
                    <BiCheck /> Approuver
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleStatusUpdate(returnItem.id, 'rejected')}
                  >
                    <BiX /> Rejeter
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => setSelectedReturn(returnItem)}
                  >
                    <BiMessage /> Répondre
                  </button>
                </div>
              )}

              {returnItem.status === 'approved' && (
                <div className="return-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleStatusUpdate(returnItem.id, 'completed')}
                  >
                    <BiCheck /> Marquer comme terminé
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => setSelectedReturn(returnItem)}
                  >
                    <BiMessage /> Répondre
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedReturn && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Répondre au client</h3>
              <button 
                className="modal-close"
                onClick={() => setSelectedReturn(null)}
              >
                <BiX />
              </button>
            </div>
            <div className="modal-content">
              <div className="return-context">
                <h4>Commande #{selectedReturn.orderId}</h4>
                <p><strong>Produit:</strong> {selectedReturn.productName}</p>
                <p><strong>Client:</strong> {selectedReturn.customerName}</p>
                <p><strong>Raison:</strong> {selectedReturn.reason}</p>
              </div>
              <div className="response-form">
                <label>Votre réponse</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Tapez votre message au client..."
                  rows="4"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-outline"
                onClick={() => setSelectedReturn(null)}
              >
                Annuler
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => handleAddResponse(selectedReturn.id)}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionRetoursVendeur;