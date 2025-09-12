import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { BiBell, BiHelpCircle, BiGlobe, BiChevronDown } from 'react-icons/bi';

export default function VendorHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/vendeur/dashboard?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div style={{ backgroundColor: '#131921', color: '#fff', borderBottom: '1px solid #232f3e' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Logo papasow vendre */}
        <div onClick={() => navigate('/vendeur/dashboard')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 700, fontSize: '18px' }}>
          <span style={{ backgroundColor: '#ffd814', color: '#131921', padding: '4px 8px', borderRadius: '4px', marginRight: 8 }}>papasow</span>
          <span>vendre</span>
        </div>

        {/* Barre de recherche rapide */}
        <form onSubmit={submit} style={{ flex: 1 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher: produits, commandes, aide"
            style={{ width: '100%', background: '#fff', color: '#111', border: '1px solid #d5d9d9', borderRadius: 6, padding: '10px 12px', outline: 'none' }}
          />
        </form>

        {/* Icônes utilitaires */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button title="Notifications" style={iconBtnStyle}>
            <BiBell size={20} />
          </button>
          {/* Aide vendeur: pas de lien externe ici */}
          <button title="Aide / Support" style={iconBtnStyle}>
            <BiHelpCircle size={20} />
          </button>

          {/* Langue & pays */}
          <div style={{ position: 'relative' }}>
            <button style={iconBtnStyle} onClick={() => setLangOpen(v => !v)}>
              <BiGlobe size={20} />
              <span style={{ marginLeft: 6, fontSize: 13 }}>FR · GN</span>
              <BiChevronDown size={16} style={{ marginLeft: 4 }} />
            </button>
            {langOpen && (
              <div style={menuStyle}>
                <div style={menuItemStyle}>FR · GN</div>
                <div style={menuItemStyle}>EN · US</div>
                <div style={menuItemStyle}>ES · ES</div>
              </div>
            )}
          </div>

          {/* Profil vendeur */}
          <div style={{ position: 'relative' }}>
            <button style={iconBtnStyle} onClick={() => setProfileOpen(v => !v)}>
              <span style={{ fontSize: 13, marginRight: 6 }}>
                {user?.businessName || user?.name || 'Mon compte vendeur'}
              </span>
              <BiChevronDown size={16} />
            </button>
            {profileOpen && (
              <div style={menuStyle}>
                <div style={menuItemStyle} onClick={() => navigate('/vendeur/boutique')}>Paramètres de la boutique</div>
                <div style={menuItemStyle} onClick={() => navigate('/vendeur/dashboard')}>Tableau de bord</div>
                <div style={menuItemStyle} onClick={() => navigate('/profil')}>Mon profil</div>
                <div style={{ ...menuItemStyle, color: '#b12704' }} onClick={() => logout?.()}>Déconnexion</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const iconBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid #232f3e',
  background: '#232f3e',
  color: '#fff',
  cursor: 'pointer'
};

const menuStyle = {
  position: 'absolute',
  right: 0,
  top: '100%',
  marginTop: 6,
  background: '#fff',
  color: '#111',
  border: '1px solid #d5d9d9',
  borderRadius: 8,
  minWidth: 220,
  boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
  zIndex: 50
};

const menuItemStyle = {
  padding: '10px 12px',
  cursor: 'pointer'
};