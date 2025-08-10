import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLanguage } from "../contexts/LanguageContext";
import { BiUser, BiLock, BiStore, BiShield } from 'react-icons/bi';

const ConnexionVendeur = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('vendeur');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Authentification fictive pour la démo
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    // Ici, tu pourrais faire un appel API pour vérifier les identifiants
    // Pour la démo, on accepte n'importe quel email/mot de passe
    if (role === 'vendeur') {
      const userData = {
        email,
        isVendor: true,
        isVendorValidated: true,
        isAdmin: false,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/vendeur/commandes');
    } else {
      const userData = {
        email,
        isVendor: false,
        isVendorValidated: false,
        isAdmin: true,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/admin/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 32, borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', minWidth: 350 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <BiStore size={40} style={{ color: '#007bff' }} />
          <h2 style={{ margin: '16px 0 8px 0', fontWeight: 700 }}>Connexion Vendeur/Admin</h2>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Adresse e-mail</label>
          <div className="input-group">
            <span className="input-group-text"><BiUser /></span>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Mot de passe</label>
          <div className="input-group">
            <span className="input-group-text"><BiLock /></span>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Rôle</label>
          <div style={{ display: 'flex', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="radio" name="role" value="vendeur" checked={role === 'vendeur'} onChange={() => setRole('vendeur')} />
              <BiStore /> Vendeur
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} />
              <BiShield /> Admin
            </label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100 fw-bold">Se connecter</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <a href="#" style={{ fontSize: 14 }}>Mot de passe oublié ?</a>
          <a href="/" style={{ fontSize: 14 }}>Retour à l'accueil</a>
        </div>
      </form>
    </div>
  );
};

export default ConnexionVendeur; 