import React, { useMemo, useMemo as _useMemo, useState } from 'react';
import { useVendor } from '../contexts/VendorContext';
import { useAuth } from '../hooks/useAuth.jsx';
import { BiUser, BiCheckCircle, BiXCircle, BiInfoCircle, BiTime, BiHistory, BiDownload, BiSearch, BiBlock, BiStar } from 'react-icons/bi';
import { useAudit } from '../contexts/AuditContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { exportToCsv } from '../utils/csvExport';

export default function AdminVendors() {
  const { vendors, updateVendor, addVendorNotification, rateVendor, suspendVendor, unsuspendVendor, getVendorHistory, bulkApproveVendors, bulkRejectVendors, updateVendorVerificationStep, purgeSimulatedVendors } = useVendor();
  const { user, updateUser } = useAuth();
  const { addAuditEntry } = useAudit();
  const { selectedCurrency, changeCurrency, format } = useCurrency();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState({});
  const [historyVendorId, setHistoryVendorId] = useState(null);
  const [viewVendorId, setViewVendorId] = useState(null);
  const [suspendReason, setSuspendReason] = useState('Non conformité');
  const [suspendUntil, setSuspendUntil] = useState('');
  const [needsInfoMessage, setNeedsInfoMessage] = useState('Merci de fournir un document plus lisible.');

  const stepLabel = (s) => ({ kyc: 'KYC', bank: 'Bancaire', tax: 'Fiscal', compliance: 'Conformité' }[s] || s);

  const askNeedsInfo = (vendor, step) => {
    const msg = window.prompt('Message pour la demande de complément', needsInfoMessage);
    if (msg !== null) {
      if (msg.trim() !== '') setNeedsInfoMessage(msg);
      updateVendorVerificationStep(vendor.id, step, 'needs_more_info', msg || needsInfoMessage);
      addVendorNotification(vendor.id, {
        type: 'status',
        title: `Demande de complément - ${stepLabel(step)}`,
        message: msg || needsInfoMessage
      });
    }
  };

  const askReject = (vendor, step) => {
    const reason = window.prompt('Raison du refus (visible par le vendeur)', 'Document invalide / informations non conformes');
    updateVendorVerificationStep(vendor.id, step, 'rejected', reason || 'Non conforme');
    addVendorNotification(vendor.id, {
      type: 'status',
      title: `Refus - ${stepLabel(step)}`,
      message: reason || 'Non conforme'
    });
  };

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
  const active = vendorList.filter(v => !v.status); // Vendeurs sans statut défini (anciens vendeurs)


  const isVendorReady = (v) => {
    const ver = v.verification || {};
    return (
      (ver.kyc?.status === 'approved') &&
      (ver.bank?.status === 'approved') &&
      (ver.tax?.status === 'approved') &&
      (ver.compliance?.status === 'approved')
    );
  };

  const approve = (v) => {
    if (!isVendorReady(v)) {
      alert('Impossible d\'approuver: toutes les étapes (KYC, Bancaire, Fiscal, Conformité) doivent être Validées.');
      return;
    }
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
    const readyIds = ids.filter(id => {
      const v = vendors[id];
      return v && isVendorReady(v);
    });
    const notReadyIds = ids.filter(id => !readyIds.includes(id));
    if (readyIds.length > 0) {
      bulkApproveVendors(readyIds);
      readyIds.forEach(id => addAuditEntry('vendor.approve.bulk', { type: 'vendor', id }));
    }
    if (notReadyIds.length > 0) {
      alert(`Certains vendeurs n'ont pas toutes les étapes validées: ${notReadyIds.join(', ')}`);
    }
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

  const StepBadge = ({ value }) => {
    const label = value === 'approved' || value === 'validated' ? 'Validé' : value === 'rejected' ? 'Refusé' : value === 'needs_more_info' ? 'À compléter' : 'En cours';
    const cls = value === 'approved' || value === 'validated' ? 'success' : value === 'rejected' ? 'danger' : value === 'needs_more_info' ? 'warning text-dark' : 'secondary';
    return <span className={`badge bg-${cls}`}>{label}</span>;
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
                <th>KYC</th>
                <th>Bancaire</th>
                <th>Fiscal</th>
                <th>Conformité</th>
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
                    <div className="d-flex align-items-center gap-2">
                      <StepBadge value={v.verification?.kyc?.status || 'pending'} />
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-success" title="Valider" onClick={() => updateVendorVerificationStep(v.id, 'kyc', 'approved')}>OK</button>
                        <button className="btn btn-outline-danger" title="Refuser" onClick={() => askReject(v, 'kyc')}>No</button>
                        <button className="btn btn-outline-warning" title="À compléter" onClick={() => askNeedsInfo(v, 'kyc')}>Info</button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <StepBadge value={v.verification?.bank?.status || 'pending'} />
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-success" onClick={() => updateVendorVerificationStep(v.id, 'bank', 'approved')}>OK</button>
                        <button className="btn btn-outline-danger" onClick={() => askReject(v, 'bank')}>No</button>
                        <button className="btn btn-outline-warning" onClick={() => askNeedsInfo(v, 'bank')}>Info</button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <StepBadge value={v.verification?.tax?.status || 'pending'} />
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-success" onClick={() => updateVendorVerificationStep(v.id, 'tax', 'approved')}>OK</button>
                        <button className="btn btn-outline-danger" onClick={() => askReject(v, 'tax')}>No</button>
                        <button className="btn btn-outline-warning" onClick={() => askNeedsInfo(v, 'tax')}>Info</button>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="d-flex align-items-center gap-1">
                        <StepBadge value={v.verification?.compliance?.status || 'pending'} />
                        {v.verification?.compliance?.notes && (
                          <span className="badge bg-info" title="Notes conformité disponibles">Notes</span>
                        )}
                      </div>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-success" onClick={() => updateVendorVerificationStep(v.id, 'compliance', 'approved')}>OK</button>
                        <button className="btn btn-outline-danger" onClick={() => askReject(v, 'compliance')}>No</button>
                        <button className="btn btn-outline-warning" onClick={() => askNeedsInfo(v, 'compliance')}>Info</button>
                      </div>
                    </div>
                  </td>
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
                    <button className="btn btn-sm btn-outline-info me-2" onClick={() => setViewVendorId(v.id)}>Voir dossier</button>
                    {v.status === 'pending' && (
                      <>
                        <button className="btn btn-sm btn-success me-2" onClick={() => approve(v)} disabled={!isVendorReady(v)} title={!isVendorReady(v) ? 'Toutes les étapes doivent être Validées' : undefined}>Approuver</button>
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
          <button className="btn btn-outline-warning" onClick={purgeSimulatedVendors} title="Supprimer vendeurs test (VD-TEST-*)">Purger tests</button>
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
            <div className="col-md-4">
              <label className="form-label">Message pour « À compléter »</label>
              <input className="form-control" placeholder="Ex: Document illisible, merci de renvoyer" value={needsInfoMessage} onChange={e=>setNeedsInfoMessage(e.target.value)} />
            </div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-success" onClick={bulkApprove}><BiCheckCircle className="me-2"/>Approuver sélection</button>
            <button className="btn btn-outline-danger" onClick={bulkReject}><BiXCircle className="me-2"/>Refuser sélection</button>
          </div>
        </div>
      </div>

      <Section title={`Résultats (${filtered.length})`} items={filtered} color="primary" />
      <Section title={`En attente (${pending.length})`} items={pending} color="warning" />
      <Section title={`Approuvés (${approved.length})`} items={approved} color="success" />
      <Section title={`Refusés (${rejected.length})`} items={rejected} color="danger" />
      <Section title={`Actifs (${active.length})`} items={active} color="info" />

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

      {viewVendorId && (() => {
        const v = vendors[viewVendorId];
        if (!v) return null;
        const docs = v.documents || {};
        const payout = v.payout || {};
        const openPreview = (obj) => {
          if (!obj?.dataUrl) return alert('Aperçu indisponible');
          const win = window.open();
          if (!win) return alert('Pop-up bloquée');
          const isImage = /^image\//.test(obj.type || '');
          if (isImage) {
            win.document.write(`<img src="${obj.dataUrl}" style="max-width:100%;height:auto;" />`);
          } else {
            win.document.write(`<embed src="${obj.dataUrl}" type="${obj.type || 'application/pdf'}" width="100%" height="100%" />`);
          }
        };
        const docItem = (label, obj) => (
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span>{label}</span>
            {obj ? (
              <span className="small">
                <span className="text-success">{obj.name || 'fourni'}</span>
                {obj.type ? ` • ${obj.type}` : ''}
                {obj.size ? ` • ${(obj.size/1024).toFixed(1)} Ko` : ''}
                {obj.dataUrl && (
                  <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => openPreview(obj)}>Ouvrir</button>
                )}
              </span>
            ) : (
              <span className="text-danger small">manquant</span>
            )}
          </li>
        );
        let complianceNotes = '';
        return (
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Dossier vendeur {v.id}</h5>
                  <button type="button" className="btn-close" onClick={() => setViewVendorId(null)} />
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <h6 className="fw-bold">Identité</h6>
                      <div className="small text-muted">
                        <div><strong>Nom</strong>: {v.informations?.prenom} {v.informations?.nom}</div>
                        <div><strong>Email</strong>: {v.informations?.email || '—'}</div>
                        <div><strong>Téléphone</strong>: {v.informations?.telephone || '—'}</div>
                        <div><strong>Date de naissance</strong>: {v.informations?.dateNaissance ? new Date(v.informations.dateNaissance).toLocaleDateString() : '—'}</div>
                        <div><strong>Adresse</strong>: {v.informations?.adresse ? `${v.informations.adresse}, ` : ''}{v.informations?.codePostal} {v.informations?.ville}{v.informations?.pays ? `, ${v.informations.pays}` : ''}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold">Entreprise</h6>
                      <div className="small text-muted">
                        <div><strong>Nom</strong>: {v.informations?.entreprise?.nom || '—'}</div>
                        <div><strong>SIRET/RC</strong>: {v.informations?.entreprise?.siret || '—'}</div>
                        <div><strong>Pays immatriculation</strong>: {v.informations?.entreprise?.paysImmatriculation || '—'}</div>
                        <div><strong>Adresse</strong>: {v.informations?.entreprise?.adresse || '—'}</div>
                        <div><strong>Numéro fiscal (TVA/NIU)</strong>: {v.informations?.numeroTaxe || '—'}</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Boutique</h6>
                      <div className="small text-muted">
                        Nom: {v.nomBoutique || v.informations?.entreprise?.nom || '—'} | Mode: {v.fulfillmentMode}
                      </div>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Documents fournis</h6>
                      <ul className="list-group">
                        {docItem("Pièce d'identité", docs.pieceIdentite)}
                        {docItem('Registre de commerce', docs.registreCommerce)}
                        {docItem('Justificatif d\'adresse', docs.justificatifAdresse)}
                        {docItem('Portfolio', docs.portfolio)}
                        {docItem('Accord fournisseur', docs.accordFournisseur)}
                        {docItem('Liste produits (FBP)', docs.listeProduits)}
                      </ul>
                    </div>
                    <div className="col-12 mt-3">
                      <h6 className="fw-bold">Coordonnées bancaires (versement)</h6>
                      <div className="small text-muted">
                        <div><strong>Titulaire</strong>: {payout.titulaireCompte || '—'}</div>
                        <div><strong>IBAN/RIB</strong>: {payout.iban ? `${String(payout.iban).slice(0,4)}••••${String(payout.iban).slice(-4)}` : '—'}</div>
                        <div><strong>BIC</strong>: {payout.bic || '—'}</div>
                        <div><strong>Banque</strong>: {payout.banqueNom || '—'}{payout.banquePays ? `, ${payout.banquePays}` : ''}</div>
                        <div className="mt-2"><strong>Justificatif RIB</strong>:
                          {payout.justificatifRib ? (
                            <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => openPreview(payout.justificatifRib)}>Ouvrir</button>
                          ) : (
                            <span className="text-danger ms-2">manquant</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-3">
                      <h6 className="fw-bold">Mobile Money</h6>
                      <div className="small text-muted">
                        <div><strong>Numéro</strong>: {payout?.mobileMoney?.numero || '—'}</div>
                        <div><strong>Opérateur</strong>: {payout?.mobileMoney?.operateur || '—'}</div>
                        <div className="mt-2"><strong>Justificatif</strong>:
                          {payout?.mobileMoney?.justificatif ? (
                            <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => openPreview(payout.mobileMoney.justificatif)}>Ouvrir</button>
                          ) : (
                            <span className="text-muted ms-2">(optionnel)</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-3">
                      <h6 className="fw-bold">Checklist Conformité</h6>
                      <ul className="small text-muted">
                        <li>Infos boutique exactes et non trompeuses</li>
                        <li>Produits autorisés, pas de marques sans droit</li>
                        <li>Documents lisibles et à jour</li>
                        <li>KYC, Bancaire, Fiscal validés</li>
                      </ul>
                      <label className="form-label">Notes internes</label>
                      <textarea className="form-control" rows={3} placeholder="Observations, restrictions, conditions..." onChange={(e)=>{ complianceNotes = e.target.value; }} defaultValue={v.verification?.compliance?.notes || ''}></textarea>
                      <div className="mt-2">
                        <button className="btn btn-outline-secondary" onClick={()=> updateVendorVerificationStep(v.id, 'compliance', v.verification?.compliance?.status || 'pending', complianceNotes)}>
                          Enregistrer notes conformité
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setViewVendorId(null)}>Fermer</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

