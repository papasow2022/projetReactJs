import React, { createContext, useContext, useEffect, useState } from 'react';

const AuditContext = createContext();

export const useAudit = () => {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error('useAudit must be used within an AuditProvider');
  return ctx;
};

export const AuditProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const loadAuditEntries = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('adminAuditLog') || '[]');
        if (saved.length === 0) {
          // Initialiser avec quelques entrées d'exemple
          const initialEntries = [
            {
              id: 'AUD-1',
              action: 'vendor_approved',
              subject: { type: 'vendor', id: 'vendor1' },
              details: 'Vendeur "Boutique Fashion" approuvé avec succès',
              actor: 'admin@test.com',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'AUD-2',
              action: 'product_rejected',
              subject: { type: 'product', id: 'prod123' },
              details: 'Produit "Chaussures Nike" rejeté - Images de mauvaise qualité',
              actor: 'admin@test.com',
              createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'AUD-3',
              action: 'user_role_changed',
              subject: { type: 'user', id: 'user456' },
              details: 'Rôle modifié pour user@example.com - Nouveau rôle: Moderator',
              actor: 'admin@test.com',
              createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'AUD-4',
              action: 'system_settings_updated',
              subject: { type: 'settings', id: 'commission_rate' },
              details: 'Taux de commission modifié de 5% à 7%',
              actor: 'admin@test.com',
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 'AUD-5',
              action: 'vendor_suspended',
              subject: { type: 'vendor', id: 'vendor2' },
              details: 'Vendeur "Electronics Store" suspendu - Violation des conditions',
              actor: 'admin@test.com',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            }
          ];
          setEntries(initialEntries);
          localStorage.setItem('adminAuditLog', JSON.stringify(initialEntries));
        } else {
          setEntries(Array.isArray(saved) ? saved : []);
        }
      } catch (_) {
        setEntries([]);
      }
    };

    // Charger les entrées au démarrage
    loadAuditEntries();

    // Vérifier les changements toutes les 2 secondes
    const interval = setInterval(() => {
      const saved = JSON.parse(localStorage.getItem('adminAuditLog') || '[]');
      setEntries(prevEntries => {
        // Comparer les IDs pour détecter les changements
        const currentIds = prevEntries.map(e => e.id).sort();
        const savedIds = saved.map(e => e.id).sort();
        
        if (JSON.stringify(currentIds) !== JSON.stringify(savedIds)) {
          return Array.isArray(saved) ? saved : [];
        }
        return prevEntries;
      });
    }, 2000);

    // Nettoyer l'intervalle au démontage
    return () => clearInterval(interval);
  }, []);

  const addAuditEntry = (action, subject, details = {}) => {
    // Récupérer l'utilisateur connecté
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const actor = currentUser?.email || 'admin@unknown.com';
    
    const entry = {
      id: 'AUD-' + Date.now(),
      action, // e.g., 'vendor.approve', 'vendor.reject', 'vendor.suspend'
      subject, // e.g., { type: 'vendor', id: 'VD-...' }
      details,
      actor: actor,
      createdAt: new Date().toISOString()
    };
    const next = [entry, ...entries].slice(0, 500);
    setEntries(next);
    localStorage.setItem('adminAuditLog', JSON.stringify(next));
    return entry;
  };

  const clearAudit = () => {
    setEntries([]);
    localStorage.setItem('adminAuditLog', JSON.stringify([]));
  };

  const value = { entries, addAuditEntry, clearAudit };

  return (
    <AuditContext.Provider value={value}>
      {children}
    </AuditContext.Provider>
  );
};
export { AuditContext };


