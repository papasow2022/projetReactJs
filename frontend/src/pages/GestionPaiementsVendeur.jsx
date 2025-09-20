import React, { useState, useEffect, useContext } from 'react';
import { PaymentsContext } from '../contexts/PaymentsContext';
import { VendorContext } from '../contexts/VendorContext';
import { 
  BiCreditCard, 
  BiCalendar, 
  BiCheck, 
  BiTime, 
  BiDownload,
  BiRefresh,
  BiInfoCircle,
  BiTrendingUp,
  BiTrendingDown,
  BiDollar,
  BiPackage,
  BiHistory,
  BiFilter,
  BiSearch,
  BiBuilding,
  BiWallet,
  BiCreditCardAlt
} from 'react-icons/bi';
import './GestionPaiementsVendeur.css';

const GestionPaiementsVendeur = () => {
  const { 
    payments, 
    paymentMethods, 
    paymentHistory,
    updatePaymentStatus, 
    processPayment,
    getVendorPayments,
    getVendorPaymentHistory,
    calculateMonthlyStats,
    getUpcomingPayments,
    getPendingPayments
  } = useContext(PaymentsContext);
  
  const { vendor } = useContext(VendorContext);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Données du vendeur
  const vendorPayments = getVendorPayments(vendor?.id);
  const vendorHistory = getVendorPaymentHistory(vendor?.id);
  const monthlyStats = calculateMonthlyStats(vendor?.id);
  const upcomingPayments = getUpcomingPayments(vendor?.id);
  const pendingPayments = getPendingPayments(vendor?.id);

  // Filtrer les paiements
  const filteredPayments = vendorPayments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.status === filter;
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.period.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'scheduled': return 'info';
      case 'processed': return 'success';
      case 'failed': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'scheduled': return 'Programmé';
      case 'processed': return 'Traité';
      case 'failed': return 'Échoué';
      default: return status;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'bank_transfer': return <BiBuilding />;
      case 'paypal': return <BiWallet />;
      case 'stripe': return <BiCreditCardAlt />;
      default: return <BiCreditCard />;
    }
  };

  const getPaymentMethodName = (method) => {
    const methodData = paymentMethods.find(m => m.id === method);
    return methodData ? methodData.name : method;
  };

  const handleProcessPayment = (paymentId) => {
    const transactionId = `TXN_${Date.now()}`;
    processPayment(paymentId, transactionId);
  };

  const exportPayments = () => {
    const csvContent = [
      ['ID Paiement', 'Période', 'Montant Brut', 'Frais Plateforme', 'Montant Net', 'Statut', 'Date Création', 'Date Échéance'],
      ...filteredPayments.map(payment => [
        payment.id,
        payment.period,
        payment.amount,
        payment.platformFee,
        payment.netAmount,
        getStatusText(payment.status),
        new Date(payment.createdAt).toLocaleDateString(),
        new Date(payment.dueDate).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paiements_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="gestion-paiements-vendeur">
      <div className="paiements-header">
        <div className="header-content">
          <div className="header-left">
            <BiCreditCard className="header-icon" />
            <div>
              <h1>Gestion des Paiements</h1>
              <p>Suivez vos paiements et revenus automatiques</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={exportPayments}>
              <BiDownload /> Exporter
            </button>
            <button className="btn btn-primary">
              <BiRefresh /> Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="tabs-navigation">
        <button 
          className={`tab ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          <BiTrendingUp /> Vue d'ensemble
        </button>
        <button 
          className={`tab ${selectedTab === 'payments' ? 'active' : ''}`}
          onClick={() => setSelectedTab('payments')}
        >
          <BiCreditCard /> Paiements
        </button>
        <button 
          className={`tab ${selectedTab === 'history' ? 'active' : ''}`}
          onClick={() => setSelectedTab('history')}
        >
          <BiHistory /> Historique
        </button>
        <button 
          className={`tab ${selectedTab === 'methods' ? 'active' : ''}`}
          onClick={() => setSelectedTab('methods')}
        >
          <BiBuilding /> Méthodes de paiement
        </button>
      </div>

      {/* Vue d'ensemble */}
      {selectedTab === 'overview' && (
        <div className="overview-content">
          {/* Statistiques mensuelles */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <BiDollar />
              </div>
              <div className="stat-content">
                <h3>{formatCurrency(monthlyStats.totalNetAmount)}</h3>
                <p>Revenus nets ce mois</p>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-icon">
                <BiPackage />
              </div>
              <div className="stat-content">
                <h3>{monthlyStats.totalOrders}</h3>
                <p>Commandes traitées</p>
              </div>
            </div>
            <div className="stat-card warning">
              <div className="stat-icon">
                <BiTrendingDown />
              </div>
              <div className="stat-content">
                <h3>{formatCurrency(monthlyStats.totalFees)}</h3>
                <p>Frais de plateforme</p>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-icon">
                <BiCreditCard />
              </div>
              <div className="stat-content">
                <h3>{monthlyStats.paymentsCount}</h3>
                <p>Paiements programmés</p>
              </div>
            </div>
          </div>

          {/* Paiements à venir */}
          <div className="upcoming-payments">
            <h2>Paiements à venir</h2>
            {upcomingPayments.length === 0 ? (
              <div className="empty-state">
                <BiCalendar className="empty-icon" />
                <p>Aucun paiement programmé</p>
              </div>
            ) : (
              <div className="payments-list">
                {upcomingPayments.map(payment => (
                  <div key={payment.id} className="payment-card">
                    <div className="payment-info">
                      <h4>Paiement {payment.period}</h4>
                      <p>{payment.ordersCount} commandes</p>
                    </div>
                    <div className="payment-amount">
                      <span className="amount">{formatCurrency(payment.netAmount)}</span>
                      <span className="due-date">Échéance: {formatDate(payment.dueDate)}</span>
                    </div>
                    <div className="payment-method">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span>{getPaymentMethodName(payment.paymentMethod)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Paiements en attente */}
          <div className="pending-payments">
            <h2>Paiements en attente</h2>
            {pendingPayments.length === 0 ? (
              <div className="empty-state">
                <BiTime className="empty-icon" />
                <p>Aucun paiement en attente</p>
              </div>
            ) : (
              <div className="payments-list">
                {pendingPayments.map(payment => (
                  <div key={payment.id} className="payment-card pending">
                    <div className="payment-info">
                      <h4>Paiement {payment.period}</h4>
                      <p>{payment.ordersCount} commandes</p>
                    </div>
                    <div className="payment-amount">
                      <span className="amount">{formatCurrency(payment.netAmount)}</span>
                      <span className="due-date">Échéance: {formatDate(payment.dueDate)}</span>
                    </div>
                    <div className="payment-actions">
                      <button 
                        className="btn btn-success"
                        onClick={() => handleProcessPayment(payment.id)}
                      >
                        <BiCheck /> Traiter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Liste des paiements */}
      {selectedTab === 'payments' && (
        <div className="payments-content">
          <div className="payments-filters">
            <div className="filter-group">
              <BiFilter className="filter-icon" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="scheduled">Programmés</option>
                <option value="processed">Traités</option>
                <option value="failed">Échoués</option>
              </select>
            </div>
            <div className="search-group">
              <BiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher par ID ou période..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="payments-table">
            {filteredPayments.length === 0 ? (
              <div className="empty-state">
                <BiCreditCard className="empty-icon" />
                <h3>Aucun paiement trouvé</h3>
                <p>Aucun paiement ne correspond à vos critères de recherche.</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID Paiement</th>
                      <th>Période</th>
                      <th>Commandes</th>
                      <th>Montant Brut</th>
                      <th>Frais</th>
                      <th>Montant Net</th>
                      <th>Statut</th>
                      <th>Méthode</th>
                      <th>Échéance</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map(payment => (
                      <tr key={payment.id}>
                        <td className="payment-id">{payment.id}</td>
                        <td>{payment.period}</td>
                        <td>{payment.ordersCount}</td>
                        <td className="amount">{formatCurrency(payment.amount)}</td>
                        <td className="fees">{formatCurrency(payment.platformFee)}</td>
                        <td className="net-amount">{formatCurrency(payment.netAmount)}</td>
                        <td>
                          <span className={`status-badge ${getStatusColor(payment.status)}`}>
                            {getStatusText(payment.status)}
                          </span>
                        </td>
                        <td className="payment-method">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <span>{getPaymentMethodName(payment.paymentMethod)}</span>
                        </td>
                        <td>{formatDate(payment.dueDate)}</td>
                        <td className="actions">
                          {payment.status === 'pending' && (
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => handleProcessPayment(payment.id)}
                            >
                              <BiCheck /> Traiter
                            </button>
                          )}
                          <button className="btn btn-sm btn-outline">
                            <BiInfoCircle /> Détails
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Historique */}
      {selectedTab === 'history' && (
        <div className="history-content">
          <div className="history-list">
            {vendorHistory.length === 0 ? (
              <div className="empty-state">
                <BiHistory className="empty-icon" />
                <h3>Aucun historique</h3>
                <p>Aucune activité de paiement enregistrée.</p>
              </div>
            ) : (
              vendorHistory.map(history => (
                <div key={history.id} className="history-item">
                  <div className="history-icon">
                    <BiCheck />
                  </div>
                  <div className="history-content">
                    <h4>{history.details}</h4>
                    <p className="history-date">{formatDate(history.timestamp)}</p>
                    {history.transactionId && (
                      <p className="transaction-id">ID: {history.transactionId}</p>
                    )}
                  </div>
                  <div className="history-amount">
                    {formatCurrency(history.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Méthodes de paiement */}
      {selectedTab === 'methods' && (
        <div className="methods-content">
          <div className="methods-list">
            {paymentMethods.map(method => (
              <div key={method.id} className={`method-card ${method.isActive ? 'active' : 'inactive'}`}>
                <div className="method-icon">
                  <span className="icon-emoji">{method.icon}</span>
                </div>
                <div className="method-info">
                  <h3>{method.name}</h3>
                  <p>{method.description}</p>
                  <div className="method-details">
                    <span className="processing-time">
                      <BiTime /> {method.processingTime}
                    </span>
                    {method.fees > 0 && (
                      <span className="fees">
                        <BiDollar /> {method.fees * 100}% de frais
                      </span>
                    )}
                  </div>
                </div>
                <div className="method-status">
                  <span className={`status-badge ${method.isActive ? 'success' : 'secondary'}`}>
                    {method.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPaiementsVendeur;