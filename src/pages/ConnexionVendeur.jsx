import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLanguage } from "../contexts/LanguageContext";
import { BiUser, BiStore } from 'react-icons/bi';

const ConnexionVendeur = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Veuillez saisir votre adresse e-mail.');
      return;
    }

    try {
      const vendors = JSON.parse(localStorage.getItem('vendors') || '{}');
      const vendor = Object.values(vendors).find(v => (v?.informations?.email || '').toLowerCase() === email.toLowerCase());
      if (!vendor) {
        setError("Aucun vendeur n'est associé à cet email. Veuillez vérifier l'adresse.");
        return;
      }
      const baseUser = {
        email: email,
        isVendor: true,
        isVendorValidated: vendor.status === 'approved',
        vendorStatus: vendor.status || 'pending',
        vendorId: vendor.id,
        isAdmin: false,
        roles: []
      };
      setUser(baseUser);
      localStorage.setItem('user', JSON.stringify(baseUser));

      if (baseUser.isVendorValidated) {
        navigate('/vendeur/dashboard');
      } else {
        navigate('/vendeur/statut-demande');
      }
    } catch (error) {
      setError('Erreur de connexion');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 32, borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', minWidth: 350 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <BiStore size={40} style={{ color: '#007bff' }} />
          <h2 style={{ margin: '16px 0 8px 0', fontWeight: 700 }}>Connexion Vendeur</h2>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Adresse e-mail</label>
          <div className="input-group">
            <span className="input-group-text"><BiUser /></span>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100 fw-bold">Continuer</button>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <a href="/" style={{ fontSize: 14 }}>Retour à l'accueil</a>
        </div>
      </form>
    </div>
  );
};

export default ConnexionVendeur; 