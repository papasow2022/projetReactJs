import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function SetVendorPassword() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password || !confirm) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const vendors = JSON.parse(localStorage.getItem('vendors') || '{}');
      // Trouver un vendor par email
      const candidate = Object.values(vendors).find(v => (v?.informations?.email || '').toLowerCase() === email.toLowerCase());
      if (!candidate) {
        setError("Aucun vendeur n'est associé à cet email. Veuillez vérifier l'adresse.");
        return;
      }

      // Mettre à jour/Créer l'entrée utilisateur locale
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const idx = users.findIndex(u => (u.email || '').toLowerCase() === email.toLowerCase());
      const baseUser = {
        email: email,
        password: password,
        isVendor: true,
        isVendorValidated: candidate.status === 'approved',
        vendorStatus: candidate.status || 'pending',
        vendorId: candidate.id,
        isAdmin: false,
        roles: []
      };
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...baseUser };
      } else {
        users.push(baseUser);
      }
      localStorage.setItem('users', JSON.stringify(users));

      // Établir la session
      setUser(baseUser);
      localStorage.setItem('user', JSON.stringify(baseUser));

      setSuccess('Mot de passe défini avec succès.');
      setTimeout(() => {
        if (baseUser.isVendorValidated) {
          navigate('/vendeur/dashboard');
        } else {
          navigate('/vendeur/statut-demande');
        }
      }, 700);
    } catch (err) {
      setError('Erreur lors de la sauvegarde.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 32, borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', minWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: '0 0 8px 0', fontWeight: 700 }}>Définir mon mot de passe</h2>
          <div className="text-muted" style={{ fontSize: 14 }}>Pour accéder à votre espace vendeur</div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="mb-3">
          <label className="form-label">Adresse e-mail</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Nouveau mot de passe</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirmer le mot de passe</label>
          <input type="password" className="form-control" value={confirm} onChange={e => setConfirm(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-100 fw-bold">Valider</button>
      </form>
    </div>
  );
}

