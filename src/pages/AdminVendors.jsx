import React, { useMemo, useMemo as _useMemo, useState } from 'react';
import { useVendor } from '../contexts/VendorContext';
import { useAuth } from '../hooks/useAuth.jsx';
import { BiUser, BiCheckCircle, BiXCircle, BiInfoCircle, BiTime, BiHistory, BiDownload, BiSearch, BiBlock, BiStar } from 'react-icons/bi';
import { useAudit } from '../contexts/AuditContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { exportToCsv } from '../utils/csvExport';

export default function AdminVendors() {
  const { vendors, updateVendor, addVendorNotification, rateVendor, suspendVendor, unsuspendVendor, getVendorHistory, bulkApproveVendors, bulkRejectVendors } = useVendor();
  const { user, updateUser } = useAuth();
  const { addAuditEntry } = useAudit();
  const { selectedCurrency, changeCurrency, format } = useCurrency();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState({});
  const [historyVendorId, setHistoryVendorId] = useState(null);
  const [suspendReason, setSuspendReason] = useState('Non conformité');
  const [suspendUntil, setSuspendUntil] = useState('');

  const vendorList = useMemo(() => Object.values(vendors || {}), [vendors]);
  const filtered = useMemo(() => {
    return vendorList.filter(v => {
      const matchesQuery = query.trim() === '' ||
        (v.informations?.email || '').toLowerCase().includes(query.toLowerCase()) ||
        (v.informations?.prenom || '').toLowerCase().includes(query.toLowerCase()) ||
        (v.informations?.nom || '').toLowerCase().includes(query.toLowerCase()) ||
        (v.businessName || '').toLowerCase().includes(query.toLowerCase()) ||
        (v.id || '').toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : (v.status || 'pending') === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [vendorList, query, statusFilter]);
  const pending = vendorList.filter(v => (v.status || 'pending') === 'pending');
  const approved = vendorList.filter(v => v.status === 'approved');
  const rejected = vendorList.filter(v => v.status === 'rejected');

  const approve = (v) => {
    updateVendor(v.id, { status: 'approved', isVerified: true });
    addVendorNotification(v.id, {
      type: 'status',
      title: 'Compte vendeur approuvé',
      message: 'Votre compte vendeur a été approuvé. Vous pouvez accéder au tableau de bord.'
    });
    addAuditEntry('vendor.approve', { type: 'vendor', id: v.id }, { email: v.informations?.email });
    // Mettre à jour la base locale des utilisateurs (simulateur) pour refléter l'approbation
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(u => {
        const matchByVendorId = u.vendorId && u.vendorId === v.id;
        const matchByEmail = v.informations?.email && u.email === v.informations.email;
        if (matchByVendorId || matchByEmail) {
          return { ...u, isVendor: true, isVendorValidated: true, vendorId: v.id, vendorStatus: 'approved' };
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (_) {}
    // Mettre à jour l'utilisateur courant si concerné
    if (user?.vendorId === v.id || (v.informations?.email && user?.email === v.informations.email)) {
      updateUser({ isVendor: true, isVendorValidated: true, vendorId: v.id, vendorStatus: 'approved' });
    }
  };

  const reject = (v) => {
    updateVendor(v.id, { status: 'rejected', isVerified: false });
    addVendorNotification(v.id, {
      type: 'status',
      title: 'Compte vendeur refusé',
      message: 'Votre demande a été refusée. Vous pouvez re-soumettre avec des informations complémentaires.'
    });
    addAuditEntry('vendor.reject', { type: 'vendor', id: v.id }, { email: v.informations?.email });
    // Mettre à jour la base locale des utilisateurs (simulateur) pour refléter le refus
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(u => {
        const matchByVendorId = u.vendorId && u.vendorId === v.id;
        const matchByEmail = v.informations?.email && u.email === v.informations.email;
        if (matchByVendorId || matchByEmail) {
          return { ...u, isVendor: true, isVendorValidated: false, vendorId: v.id, vendorStatus: 'rejected' };
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (_) {}
    if (user?.vendorId === v.id || (v.informations?.email && user?.email === v.informations.email)) {
      updateUser({ isVendor: true, isVendorValidated: false, vendorId: v.id, vendorStatus: 'rejected' });
    }
  };

  const toggleSelect = (id) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAll = (list) => {
    const map = {};
    list.forEach(v => { map[v.id] = true; });
    setSelected(map);
  };

  const clearSelection = () => setSelected({});

  const bulkApprove = () => {
    const ids = Object.entries(selected).filter(([, val]) => val).map(([k]) => k);
    if (ids.length === 0) return;
    bulkApproveVendors(ids);
    ids.forEach(id => addAuditEntry('vendor.approve.bulk', { type: 'vendor', id }));
    clearSelection();
  };

  const bulkReject = () => {
    const ids = Object.entries(selected).filter(([, val]) => val).map(([k]) => k);
    if (ids.length === 0) return;
    bulkRejectVendors(ids, 'Rejet par lot');
    ids.forEach(id => addAuditEntry('vendor.reject.bulk', { type: 'vendor', id }));
    clearSelection();
  };

  const exportCsv = () => {
    const data = filtered.map(v => ({
      id: v.id,
      statut: v.status,
      email: v.informations?.email || v.email || '',
      nom: `${v.informations?.prenom || ''} ${v.informations?.nom || ''}`.trim(),
      entreprise: v.informations?.entreprise?.nom || v.businessName || '',
      note: v.rating || 0,
      commandes: v.totalOrders || 0,
      ventes: format(v.totalSales || 0)
    }));
    exportToCsv('vendors.csv', data);
  };

  const Section = ({ title, items, color }) => (
    <div className="card mb-4">
      <div className={`card-header text-white bg-${color}`}>
        <h5 className="mb-0">{title} ({items.length})</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{width: 32}}><input type="checkbox" onChange={(e)=> e.target.checked ? selectAll(items) : clearSelection()} /></th>
                <th>Vendor ID</th>
                <th>Type</th>
                <th>Mode</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Entreprise</th>
                <th>Statut</th>
                <th>Commandes</th>
                <th>Ventes</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(v => (
                <tr key={v.id}>
                  <td><input type="checkbox" checked={!!selected[v.id]} onChange={() => toggleSelect(v.id)} /></td>
                  <td>{v.id}</td>
                  <td>{v.typeVendeur}</td>
                  <td>{v.fulfillmentMode}</td>
                  <td>{v.informations?.prenom} {v.informations?.nom}</td>
                  <td>{v.informations?.email}</td>
                  <td>{v.informations?.entreprise?.nom}</td>
                  <td>
                    {v.status === 'approved' && <span className="badge bg-success">Approuvé</span>}
                    {v.status === 'pending' && <span className="badge bg-secondary">En attente</span>}
                    {v.status === 'rejected' && <span className="badge bg-danger">Refusé</span>}
                    {v.status === 'suspended' && <span className="badge bg-warning text-dark">Suspendu</span>}
                    {!v.status && <span className="badge bg-light text-dark">active</span>}
                  </td>
                  <td>{v.totalOrders || 0}</td>
                  <td>{format(v.totalSales || 0)}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-primary">{Number(v.rating || 0).toFixed(2)}</span>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => rateVendor(v.id, 5)}>+5</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => rateVendor(v.id, 1)}>+1</button>
                    </div>
                  </td>
                  <td>
                    {v.status === 'pending' && (
                      <>
                        <button className="btn btn-sm btn-success me-2" onClick={() => approve(v)}>Approuver</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => reject(v)}>Refuser</button>
                      </>
                    )}
                    {v.status === 'approved' && (
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-success">Approuvé</span>
                        <button className="btn btn-sm btn-outline-warning" onClick={() => setHistoryVendorId(v.id)}><BiHistory className="me-1"/>Historique</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => suspendVendor(v.id, suspendReason, suspendUntil || null)}><BiBlock className="me-1"/>Suspendre</button>
                      </div>
                    )}
                    {v.status === 'rejected' && (
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-danger">Refusé</span>
                        <button className="btn btn-sm btn-outline-warning" onClick={() => setHistoryVendorId(v.id)}><BiHistory className="me-1"/>Historique</button>
                      </div>
                    )}
                    {v.status === 'suspended' && (
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-warning text-dark">Suspendu</span>
                        <button className="btn btn-sm btn-outline-success" onClick={() => unsuspendVendor(v.id)}><BiCheckCircle className="me-1"/>Réactiver</button>
                        <button className="btn btn-sm btn-outline-warning" onClick={() => setHistoryVendorId(v.id)}><BiHistory className="me-1"/>Historique</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="mb-0">Admin - Vendeurs</h1>
        <div className="d-flex gap-2">
          <select className="form-select" style={{width: 'auto'}} value={selectedCurrency} onChange={e => changeCurrency(e.target.value)}>
            <option value="EUR">EUR</option>
            <option value="CFA">CFA</option>
            <option value="GNF">GNF</option>
          </select>
          <button className="btn btn-outline-secondary" onClick={exportCsv}><BiDownload className="me-2"/>Exporter CSV</button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Recherche</label>
              <div className="input-group">
                <span className="input-group-text"><BiSearch/></span>
                <input className="form-control" placeholder="Nom, email, entreprise, ID" value={query} onChange={e=>setQuery(e.target.value)} />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label">Statut</label>
              <select className="form-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
                <option value="all">Tous</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvés</option>
                <option value="rejected">Refusés</option>
                <option value="suspended">Suspendus</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Raison suspension</label>
              <input className="form-control" value={suspendReason} onChange={e=>setSuspendReason(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Jusqu'au</label>
              <input type="date" className="form-control" value={suspendUntil} onChange={e=>setSuspendUntil(e.target.value)} />
            </div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-success" onClick={bulkApprove}><BiCheckCircle className="me-2"/>Approuver sélection</button>
            <button className="btn btn-outline-danger" onClick={bulkReject}><BiXCircle className="me-2"/>Refuser sélection</button>
          </div>
        </div>
      </div>

      <Section title={`Résultats (${filtered.length})`} items={filtered} color="primary" />
      <Section title="En attente" items={pending} color="warning" />
      <Section title="Approuvés" items={approved} color="success" />
      <Section title="Refusés" items={rejected} color="danger" />

      {historyVendorId && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Historique vendeur {historyVendorId}</h5>
                <button type="button" className="btn-close" onClick={() => setHistoryVendorId(null)} />
              </div>
              <div className="modal-body">
                <ul className="list-group list-group-flush">
                  {getVendorHistory(historyVendorId).map(h => {
                    const date = new Date(h.createdAt).toLocaleString();
                    const action = h.action;
                    const details = h.details || {};
                    let badgeClass = 'secondary';
                    let icon = <BiHistory className="me-2"/>;
                    let label = action;
                    if (action === 'approved') { badgeClass = 'success'; icon = <BiCheckCircle className="me-2"/>; label = 'Approuvé'; }
                    if (action === 'rejected') { badgeClass = 'danger'; icon = <BiXCircle className="me-2"/>; label = 'Refusé'; }
                    if (action === 'suspended') { badgeClass = 'warning'; icon = <BiBlock className="me-2"/>; label = 'Suspendu'; }
                    if (action === 'unsuspended') { badgeClass = 'success'; icon = <BiCheckCircle className="me-2"/>; label = 'Réactivé'; }
                    if (action === 'rated') { badgeClass = 'info'; icon = <BiStar className="me-2"/>; label = 'Notation'; }
                    const prettyDetails = [];
                    if (details.reason) prettyDetails.push(`Raison: ${details.reason}`);
                    if (details.until) prettyDetails.push(`Jusqu'au: ${new Date(details.until).toLocaleDateString()}`);
                    if (typeof details.ratingValue !== 'undefined') prettyDetails.push(`Note: ${details.ratingValue}`);
                    return (
                      <li key={h.id} className="list-group-item d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                          <div className="fw-semibold d-flex align-items-center">
                            {icon}
                            <span className={`badge bg-${badgeClass} me-2`}>{label}</span>
                            <small className="text-muted"><BiTime className="me-1"/>{date}</small>
                          </div>
                          {prettyDetails.length > 0 && (
                            <div className="mt-1 small text-muted">{prettyDetails.join(' • ')}</div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setHistoryVendorId(null)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

