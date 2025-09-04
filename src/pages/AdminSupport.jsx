import React, { useState, useEffect } from 'react';
import {
  BiSearch,
  BiFilter,
  BiRefresh,
  BiUser,
  BiCalendar,
  BiMessage,
  BiCheckCircle,
  BiXCircle,
  BiInfoCircle
} from 'react-icons/bi';

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadTickets(); }, []);

  const loadTickets = () => {
    setLoading(true);
    const mock = [
      { id: 'SUP-001', subject: 'Commande non reçue', user: 'Marie Dupont', email: 'marie@example.com', priority: 'high', status: 'open', createdAt: '2024-01-14T12:10:00Z' },
      { id: 'SUP-002', subject: 'Problème de paiement', user: 'Jean Martin', email: 'jean@example.com', priority: 'medium', status: 'pending', createdAt: '2024-01-15T09:45:00Z' },
      { id: 'SUP-003', subject: 'Retour produit', user: 'Sophie Bernard', email: 'sophie@example.com', priority: 'low', status: 'closed', createdAt: '2024-01-13T16:25:00Z' }
    ];
    setTimeout(() => { setTickets(mock); setLoading(false); }, 600);
  };

  const filtered = tickets.filter(t => {
    const matchesSearch = `${t.id} ${t.subject} ${t.user} ${t.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const badge = (status) => {
    if (status === 'open') return <span className="badge bg-danger">Ouvert</span>;
    if (status === 'pending') return <span className="badge bg-warning">En attente</span>;
    if (status === 'closed') return <span className="badge bg-success">Fermé</span>;
    return <span className="badge bg-secondary">Inconnu</span>;
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Support client</h1>
          <p className="text-muted mb-0">Gestion des tickets et demandes</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={loadTickets}><BiRefresh className="me-2"/>Actualiser</button>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text"><BiSearch/></span>
                <input className="form-control" placeholder="Rechercher un ticket..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
                <option value="all">Tous les statuts</option>
                <option value="open">Ouverts</option>
                <option value="pending">En attente</option>
                <option value="closed">Fermés</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-secondary w-100"><BiFilter className="me-2"/>Plus de filtres</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0"><h5 className="mb-0">Tickets ({filtered.length})</h5></div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Chargement...</span></div></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Ticket</th>
                    <th>Utilisateur</th>
                    <th>Objet</th>
                    <th>Priorité</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id}>
                      <td className="align-middle">{t.id}</td>
                      <td className="align-middle">{t.user} <small className="text-muted">({t.email})</small></td>
                      <td className="align-middle">{t.subject}</td>
                      <td className="align-middle">
                        {t.priority === 'high' && <span className="badge bg-danger">Haute</span>}
                        {t.priority === 'medium' && <span className="badge bg-warning">Moyenne</span>}
                        {t.priority === 'low' && <span className="badge bg-secondary">Basse</span>}
                      </td>
                      <td className="align-middle">{badge(t.status)}</td>
                      <td className="align-middle"><small className="text-muted"><BiCalendar className="me-1" />{new Date(t.createdAt).toLocaleDateString()}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="text-muted small mt-3 d-flex align-items-center">
        <BiInfoCircle className="me-2"/>Interface de support simulée pour la démo.
      </div>
    </div>
  );
}


