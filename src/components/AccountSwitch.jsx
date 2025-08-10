import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function AccountSwitch({ accounts = [], onAddAccount, onSignOut }) {
  const { t } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 60 }}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" style={{ width: 120, marginBottom: 24 }} />
      <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 10, padding: '32px 36px', minWidth: 340, maxWidth: '90vw', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' }}>
        <div style={{ fontSize: 26, fontWeight: 600, marginBottom: 18 }}>{t('switchAccounts')}</div>
        {accounts.length > 0 ? (
          <>
            {accounts.map(acc => (
              <div key={acc.email} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <i className="bi bi-person-circle" style={{ fontSize: 38, color: '#bbb' }}></i>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>{acc.name}</div>
                    <div style={{ fontSize: 14, color: '#555' }}>{acc.email}</div>
                  </div>
                </div>
                <button onClick={() => onSignOut(acc)} style={{ background: 'none', border: 'none', color: '#007185', fontSize: 15, cursor: 'pointer', textDecoration: 'underline' }}>{t('signOut')}</button>
              </div>
            ))}
          </>
        ) : null}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 0', cursor: 'pointer', justifyContent: 'center' }} onClick={onAddAccount}>
          <i className="bi bi-plus-circle" style={{ fontSize: 32, color: '#bbb' }}></i>
          <span style={{ fontWeight: 600, fontSize: 17 }}>{t('addAccount')}</span>
        </div>
        <div style={{ fontSize: 13, color: '#555', marginTop: 18 }}>{t('learnMoreSwitching')}</div>
      </div>
      <div style={{ marginTop: 40, color: '#888', fontSize: 13, textAlign: 'center' }}>
        <a href="#" style={{ color: '#007185', margin: '0 10px' }}>{t('conditionsOfUse')}</a>
        <a href="#" style={{ color: '#007185', margin: '0 10px' }}>{t('privacyNotice')}</a>
        <a href="#" style={{ color: '#007185', margin: '0 10px' }}>{t('help')}</a>
        <div style={{ marginTop: 10 }}>&copy; 1996-2025, Amazon.com, Inc. {t('orAffiliates')}</div>
      </div>
    </div>
  );
} 