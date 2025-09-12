import React from 'react';
import { useAuth } from '../hooks/useAuth.jsx';

const Badge = ({ status }) => {
  const map = {
    approved: { cls: 'bg-success', label: 'Validé' },
    validated: { cls: 'bg-success', label: 'Validé' },
    rejected: { cls: 'bg-danger', label: 'Refusé' },
    needs_more_info: { cls: 'bg-warning text-dark', label: 'À compléter' },
    pending: { cls: 'bg-secondary', label: 'En cours' }
  };
  const m = map[status] || map.pending;
  return <span className={`badge ${m.cls}`}>{m.label}</span>;
};

export default function VendeurStatutDemande() {
  const { user } = useAuth();
  const vendors = JSON.parse(localStorage.getItem('vendors') || '{}');
  const vendor = user?.vendorId ? vendors[user.vendorId] : null;
  const verification = vendor?.verification || {};
  const k = verification.kyc || {};
  const b = verification.bank || {};
  const t = verification.tax || {};
  const c = verification.compliance || {};

  return (
    <div className="container py-4">
      <h1 className="mb-3">Statut de votre demande vendeur</h1>
      {!vendor ? (
        <div className="alert alert-warning">Aucune demande vendeur associée à votre compte.</div>
      ) : (
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title d-flex align-items-center justify-content-between">
                  KYC <Badge status={k.status} />
                </h5>
                <p className="small text-muted mb-2">Vérification de votre identité et justificatif d'adresse.</p>
                {k.status === 'needs_more_info' && k.notes && <div className="alert alert-warning small mb-0">{k.notes}</div>}
                {k.status === 'rejected' && k.notes && <div className="alert alert-danger small mb-0">{k.notes}</div>}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title d-flex align-items-center justify-content-between">
                  Bancaire <Badge status={b.status} />
                </h5>
                <p className="small text-muted mb-2">Coordonnées de versement (RIB/IBAN ou Mobile Money).</p>
                {b.status === 'needs_more_info' && b.notes && <div className="alert alert-warning small mb-0">{b.notes}</div>}
                {b.status === 'rejected' && b.notes && <div className="alert alert-danger small mb-0">{b.notes}</div>}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title d-flex align-items-center justify-content-between">
                  Fiscal <Badge status={t.status} />
                </h5>
                <p className="small text-muted mb-2">Immatriculation (SIRET/RC), TVA/NIU, Kbis/équivalent.</p>
                {t.status === 'needs_more_info' && t.notes && <div className="alert alert-warning small mb-0">{t.notes}</div>}
                {t.status === 'rejected' && t.notes && <div className="alert alert-danger small mb-0">{t.notes}</div>}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title d-flex align-items-center justify-content-between">
                  Conformité <Badge status={c.status} />
                </h5>
                <p className="small text-muted mb-2">Respect des politiques de la plateforme.</p>
                {c.status === 'needs_more_info' && c.notes && <div className="alert alert-warning small mb-0">{c.notes}</div>}
                {c.status === 'rejected' && c.notes && <div className="alert alert-danger small mb-0">{c.notes}</div>}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="alert alert-info mt-2">
              Vous serez notifié par email lorsque votre compte sera approuvé. En cas de demande de complément, mettez à jour vos documents et répondez aux remarques indiquées ci-dessus.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

