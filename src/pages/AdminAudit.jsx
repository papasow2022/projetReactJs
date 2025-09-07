import React, { useMemo, useState } from 'react';
import { useAudit } from '../contexts/AuditContext';
import { BiSearch, BiDownload, BiFilter } from 'react-icons/bi';
import { exportToCsv } from '../utils/csvExport';

export default function AdminAudit() {
  const { entries, clearAudit } = useAudit();
  const [query, setQuery] = useState('');
  const [action, setAction] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const filtered = useMemo(() => {
    return (entries || []).filter(e => {
      const q = query.toLowerCase();
      const matchesQuery = !q || JSON.stringify(e).toLowerCase().includes(q);
      const matchesAction = action === 'all' || e.action === action;
      const d = new Date(e.createdAt);
      const afterFrom = !dateFrom || d >= new Date(dateFrom);
      const beforeTo = !dateTo || d <= new Date(dateTo);
      return matchesQuery && matchesAction && afterFrom && beforeTo;
    });
  }, [entries, query, action, dateFrom, dateTo]);

  // Mettre à jour la date de dernière mise à jour quand les entrées changent
  React.useEffect(() => {
    setLastUpdate(new Date());
  }, [entries]);

  const exportCsv = () => {
    exportToCsv('audit.csv', filtered.map(e => ({
      id: e.id,
      date: new Date(e.createdAt).toLocaleString(),
      action: e.action,
      subject: e.subject ? `${e.subject.type}:${e.subject.id}` : '',
      actor: e.actor,
      details: JSON.stringify(e.details || {})
    })));
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h1 className="mb-0">Journal d'audit</h1>
          <small className="text-muted">
            Dernière mise à jour : {lastUpdate.toLocaleTimeString('fr-FR')}
            <span className="badge bg-success ms-2">En temps réel</span>
          </small>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={exportCsv}><BiDownload className="me-2"/>Exporter CSV</button>
          <button className="btn btn-outline-danger" onClick={clearAudit}>Vider</button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Recherche</label>
              <div className="input-group">
                <span className="input-group-text"><BiSearch/></span>
                <input className="form-control" placeholder="Rechercher dans le journal" value={query} onChange={e=>setQuery(e.target.value)} />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label">Action</label>
              <select className="form-select" value={action} onChange={e=>setAction(e.target.value)}>
                <option value="all">Toutes</option>
                <option value="vendor.approve">vendor.approve</option>
                <option value="vendor.reject">vendor.reject</option>
                <option value="vendor.approve.bulk">vendor.approve.bulk</option>
                <option value="vendor.reject.bulk">vendor.reject.bulk</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Du</label>
              <input type="date" className="form-control" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Au</label>
              <input type="date" className="form-control" value={dateTo} onChange={e=>setDateTo(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Subject</th>
                <th>Acteur</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="fw-semibold">{new Date(e.createdAt).toLocaleDateString('fr-FR')}</span>
                      <small className="text-muted">{new Date(e.createdAt).toLocaleTimeString('fr-FR')}</small>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      e.action.includes('approved') ? 'bg-success' :
                      e.action.includes('rejected') || e.action.includes('suspended') ? 'bg-danger' :
                      e.action.includes('updated') || e.action.includes('changed') ? 'bg-warning' :
                      'bg-primary'
                    }`}>
                      {e.action === 'vendor_approved' ? 'VENDEUR APPROUVÉ' :
                       e.action === 'product_approved' ? 'PRODUIT APPROUVÉ' :
                       e.action === 'product_rejected' ? 'PRODUIT REJETÉ' :
                       e.action === 'product_deleted' ? 'PRODUIT SUPPRIMÉ' :
                       e.action === 'product_approved_bulk' ? 'PRODUITS APPROUVÉS (MASSE)' :
                       e.action === 'product_rejected_bulk' ? 'PRODUITS REJETÉS (MASSE)' :
                       e.action === 'order_status_updated' ? 'STATUT COMMANDE MODIFIÉ' :
                       e.action === 'review_approved' ? 'AVIS APPROUVÉ' :
                       e.action === 'review_rejected' ? 'AVIS REJETÉ' :
                       e.action === 'review_deleted' ? 'AVIS SUPPRIMÉ' :
                       e.action === 'user_role_changed' ? 'RÔLE MODIFIÉ' :
                       e.action === 'system_settings_updated' ? 'PARAMÈTRES MODIFIÉS' :
                       e.action === 'vendor_suspended' ? 'VENDEUR SUSPENDU' :
                       e.action === 'vendor_unsuspended' ? 'VENDEUR RÉACTIVÉ' :
                       e.action.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <i className={`bi bi-${
                        e.subject?.type === 'vendor' ? 'shop' :
                        e.subject?.type === 'product' ? 'box' :
                        e.subject?.type === 'user' ? 'person' :
                        e.subject?.type === 'settings' ? 'gear' : 'file'
                      } me-2`}></i>
                      <div>
                        <div className="fw-semibold">
                          {e.subject?.type === 'vendor' ? 'Vendeur' :
                           e.subject?.type === 'product' ? 'Produit' :
                           e.subject?.type === 'user' ? 'Utilisateur' :
                           e.subject?.type === 'settings' ? 'Paramètres' :
                           e.subject?.type || 'N/A'}
                        </div>
                        <small className="text-muted">{e.subject?.id || ''}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-person-circle me-2"></i>
                      <span>{e.actor}</span>
                    </div>
                  </td>
                  <td>
                    <div className="text-wrap" style={{maxWidth: '300px'}}>
                      {typeof e.details === 'object' ? JSON.stringify(e.details) : (e.details || 'Aucun détail disponible')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

