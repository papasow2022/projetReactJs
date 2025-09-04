import React, { useMemo } from 'react';
import { useVendor } from '../contexts/VendorContext';
import { useAuth } from '../hooks/useAuth.jsx';

export default function AdminVendors() {
  const { vendors, updateVendor, addVendorNotification } = useVendor();
  const { user, updateUser } = useAuth();

  const vendorList = useMemo(() => Object.values(vendors || {}), [vendors]);
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
                <th>Vendor ID</th>
                <th>Type</th>
                <th>Mode</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Entreprise</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(v => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.typeVendeur}</td>
                  <td>{v.fulfillmentMode}</td>
                  <td>{v.informations?.prenom} {v.informations?.nom}</td>
                  <td>{v.informations?.email}</td>
                  <td>{v.informations?.entreprise?.nom}</td>
                  <td>
                    {v.status === 'pending' && (
                      <>
                        <button className="btn btn-sm btn-success me-2" onClick={() => approve(v)}>Approuver</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => reject(v)}>Refuser</button>
                      </>
                    )}
                    {v.status === 'approved' && (
                      <span className="badge bg-success">Approuvé</span>
                    )}
                    {v.status === 'rejected' && (
                      <span className="badge bg-danger">Refusé</span>
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
      <h1 className="mb-4">Admin - Vendeurs</h1>
      <Section title="En attente" items={pending} color="warning" />
      <Section title="Approuvés" items={approved} color="success" />
      <Section title="Refusés" items={rejected} color="danger" />
    </div>
  );
}

