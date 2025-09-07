import React, { useState, useEffect } from 'react';
import { exportToCsv } from '../utils/csvExport';
import { 
  BiCreditCard,
  BiWallet,
  BiBuilding,
  BiSearch,
  BiFilter,
  BiRefresh,
  BiCalendar,
  BiInfoCircle
} from 'react-icons/bi';

export default function AdminPayments() {
  const [payouts, setPayouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = () => {
    setLoading(true);
    const mock = [
      { id: 'PAY-001', vendor: 'Boutique Sport', vendorId: 'VD-001', amount: 1250.75, status: 'completed', method: 'bank', date: '2024-01-12T10:00:00Z' },
      { id: 'PAY-002', vendor: 'Mode & Style', vendorId: 'VD-002', amount: 980.20, status: 'processing', method: 'wallet', date: '2024-01-14T14:30:00Z' },
      { id: 'PAY-003', vendor: 'Tech Store', vendorId: 'VD-003', amount: 1567.40, status: 'failed', method: 'bank', date: '2024-01-15T09:15:00Z' }
    ];
    setTimeout(() => { setPayouts(mock); setLoading(false); }, 600);
  };

  const filtered = payouts
    .filter(p => `${p.id} ${p.vendor} ${p.vendorId}`.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => statusFilter === 'all' || p.status === statusFilter)
    .filter(p => vendorFilter ? `${p.vendor} ${p.vendorId}`.toLowerCase().includes(vendorFilter.toLowerCase()) : true)
    .filter(p => dateFrom ? new Date(p.date).getTime() >= new Date(dateFrom).getTime() : true)
    .filter(p => dateTo ? new Date(p.date).getTime() <= new Date(dateTo).getTime() : true);

  const badge = (status) => {
    if (status === 'completed') return <span className="badge bg-success">Terminé</span>;
    if (status === 'processing') return <span className="badge bg-warning">En cours</span>;
    if (status === 'failed') return <span className="badge bg-danger">Échoué</span>;
    return <span className="badge bg-secondary">Inconnu</span>;
  };

  const sumCompleted = payouts.filter(p=>p.status==='completed').reduce((s,p)=>s+p.amount,0);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Gestion des paiements</h1>
          <p className="text-muted mb-0">Commissions et reversements aux vendeurs</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              const rows = filtered.map(p => ({
                id: p.id,
                vendor: p.vendor,
                vendorId: p.vendorId,
                amount: p.amount,
                status: p.status,
                method: p.method,
                date: p.date
              }));
              exportToCsv('admin_payments.csv', rows);
            }}
          >
            Export CSV
          </button>
          <button className="btn btn-outline-primary" onClick={loadPayouts}>
            <BiRefresh className="me-2" />Actualiser
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <BiCreditCard className="text-primary" style={{ fontSize: '2rem' }} />
              <div className="ms-3">
                <div className="text-muted small">Reversements terminés</div>
                <div className="h5 mb-0">€{sumCompleted.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <BiWallet className="text-success" style={{ fontSize: '2rem' }} />
              <div className="ms-3">
                <div className="text-muted small">Méthode la plus utilisée</div>
                <div className="h6 mb-0">Portefeuille / Virement</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <BiBuilding className="text-info" style={{ fontSize: '2rem' }} />
              <div className="ms-3">
                <div className="text-muted small">Banques connectées</div>
                <div className="h6 mb-0">Simulation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text"><BiSearch /></span>
                <input className="form-control" placeholder="Rechercher un paiement..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
                <option value="all">Tous les statuts</option>
                <option value="completed">Terminés</option>
                <option value="processing">En cours</option>
                <option value="failed">Échoués</option>
              </select>
            </div>
            <div className="col-md-3">
              <input className="form-control" placeholder="Filtrer par vendeur ou ID vendeur" value={vendorFilter} onChange={(e)=>setVendorFilter(e.target.value)} />
            </div>
            <div className="col-md-3">
              <div className="d-flex gap-2">
                <input type="date" className="form-control" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
                <input type="date" className="form-control" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0"><h5 className="mb-0">Paiements ({filtered.length})</h5></div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Chargement...</span></div></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Paiement</th>
                    <th>Vendeur</th>
                    <th>Montant</th>
                    <th>Méthode</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id}>
                      <td className="align-middle">{p.id}</td>
                      <td className="align-middle">{p.vendor} <small className="text-muted">({p.vendorId})</small></td>
                      <td className="align-middle">€{p.amount.toLocaleString()}</td>
                      <td className="align-middle">{p.method === 'bank' ? 'Virement bancaire' : 'Portefeuille'}</td>
                      <td className="align-middle">{badge(p.status)}</td>
                      <td className="align-middle"><small className="text-muted"><BiCalendar className="me-1" />{new Date(p.date).toLocaleDateString()}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="text-muted small mt-3 d-flex align-items-center">
        <BiInfoCircle className="me-2"/>Données de démonstration (mock) pour l’interface d’administration.
      </div>
    </div>
  );
}


