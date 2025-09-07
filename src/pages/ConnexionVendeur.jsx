import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useVendor } from '../contexts/VendorContext';
import { useLanguage } from "../contexts/LanguageContext";
import { BiUser, BiLock, BiStore, BiShield } from 'react-icons/bi';

const ConnexionVendeur = () => {
  const navigate = useNavigate();
  const { setUser, login } = useAuth();
  const { createTestVendor } = useVendor();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      // Utiliser la fonction login de useAuth pour vérifier les identifiants
      const result = await login(email, password);
      
      if (result.success) {
        const userData = result.user;
        
        // Créer un vendeur de test validé
        const testVendor = createTestVendor(email);
        
        const vendorData = {
          ...userData,
          isVendor: true,
          isVendorValidated: true,
          vendorStatus: 'active',
          vendorId: testVendor.id,
          isAdmin: false,
          roles: []
        };
        setUser(vendorData);
        localStorage.setItem('user', JSON.stringify(vendorData));
        navigate('/vendeur/dashboard');
      } else {
        setError(result.error || 'Identifiants incorrects');
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
        <div className="mb-3">
          <label className="form-label">Mot de passe</label>
          <div className="input-group">
            <span className="input-group-text"><BiLock /></span>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
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