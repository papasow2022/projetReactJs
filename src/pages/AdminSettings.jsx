import React, { useState } from 'react';
import {
  BiCog,
  BiSave,
  BiInfoCircle
} from 'react-icons/bi';

export default function AdminSettings() {
  const [commissionRate, setCommissionRate] = useState(15);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(50);
  const [supportEmail, setSupportEmail] = useState('support@papasow.com');

  const save = (e) => {
    e.preventDefault();
    // Simulation d'enregistrement
    alert('Paramètres sauvegardés (démo)');
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-3">
        <BiCog className="text-primary me-2" style={{ fontSize: '1.8rem' }} />
        <h1 className="mb-0">Paramètres de la plateforme</h1>
      </div>

      <form onSubmit={save} className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Commission par défaut (%)</label>
              <input type="number" min="0" max="100" className="form-control" value={commissionRate} onChange={(e)=>setCommissionRate(parseFloat(e.target.value||0))} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Seuil livraison gratuite (€)</label>
              <input type="number" min="0" className="form-control" value={freeShippingThreshold} onChange={(e)=>setFreeShippingThreshold(parseFloat(e.target.value||0))} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Email support</label>
              <input type="email" className="form-control" value={supportEmail} onChange={(e)=>setSupportEmail(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="card-footer bg-white border-0 d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            <BiSave className="me-2"/>Sauvegarder
          </button>
        </div>
      </form>

      <div className="text-muted small mt-3 d-flex align-items-center">
        <BiInfoCircle className="me-2"/>Formulaire de démo (aucune persistance serveur pour l’instant).
      </div>
    </div>
  );
}

