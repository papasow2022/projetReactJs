// src/components/Header.jsx
import React, { useState, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
// import 'bootstrap/dist/css/bootstrap.min.css';

const LANGUAGES = [
  { code: "FR", label: "Français", flag: "https://flagcdn.com/fr.svg", emoji: "🇫🇷" },
  { code: "EN", label: "English", flag: "https://flagcdn.com/gb.svg", emoji: "🇬🇧" },
  { code: "ES", label: "Español", flag: "https://flagcdn.com/es.svg", emoji: "🇪🇸" },
  { code: "DE", label: "Deutsch", flag: "https://flagcdn.com/de.svg", emoji: "🇩🇪" },
];

const CATEGORIES = [
  { key: 'chaussures', label: 'Chaussures', sub: ['Homme', 'Femme', 'Enfant', 'Bébé'] },
  { key: 'pantalons', label: 'Pantalons', sub: ['Homme', 'Femme', 'Enfant', 'Bébé'] },
  { key: 'vestes', label: 'Vestes', sub: ['Homme', 'Femme', 'Enfant', 'Bébé'] },
  { key: 'accessoires', label: 'Accessoires', sub: ['Ceintures', 'Sacs', 'Lunettes', 'Casquettes'] },
  { key: 'promotions', label: 'Promotions', sub: ['Offres en cours', 'Nouveautés', 'Produits récents', 'Meilleures ventes'] },
];

export default function Header() {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [langDropdown, setLangDropdown] = useState(false);
  const selectedLang = LANGUAGES.find(lang => lang.code === currentLanguage) || LANGUAGES[0];
  const langBtnRef = useRef(null);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const accountBtnRef = useRef(null);
  const accountMenuRef = useRef(null);
  const [allMenuOpen, setAllMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [searchCategory, setSearchCategory] = useState(CATEGORIES[0]);
  const [searchCatOpen, setSearchCatOpen] = useState(false);
  const searchCatBtnRef = useRef(null);

  // Fermer le menu si clic à l'extérieur
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        accountBtnRef.current &&
        !accountBtnRef.current.contains(event.target) &&
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountDropdown(false);
      }
    }
    if (langDropdown || accountDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [langDropdown, accountDropdown]);

  // Fermer le menu 'Toutes' si clic à l'extérieur
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        allMenuOpen &&
        !event.target.closest('.menu-toutes-dropdown') &&
        !event.target.closest('.btn-toutes-dropdown')
      ) {
        setAllMenuOpen(false);
      }
    }
    if (allMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [allMenuOpen]);

  // Fermer le menu catégorie recherche si clic à l'extérieur
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchCatOpen &&
        !event.target.closest('.search-cat-dropdown') &&
        !event.target.closest('.search-cat-btn')
      ) {
        setSearchCatOpen(false);
      }
    }
    if (searchCatOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchCatOpen]);

  function handleLangClick(lang) {
    changeLanguage(lang.code);
    setLangDropdown(false);
    console.log(`Langue changée : ${lang.label}`);
  }

  function handleAccountClick(action) {
    setAccountDropdown(false);
    console.log(`Action compte : ${action}`);
  }

  return (
    <header style={{ background: "#232f3e", color: "#fff", width: "100%", fontFamily: 'Arial, sans-serif' }}>
      {/* Barre principale */}
      <nav style={{ display: 'flex', alignItems: 'center', padding: '8px 16px 0 16px', borderBottom: '1px solid #444', minHeight: 56 }}>
        {/* Sélecteur de langue avec menu déroulant */}
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 18, position: 'relative' }} ref={langBtnRef}>
          <button
            className="btn btn-link p-0 d-flex align-items-center text-white"
            style={{ fontSize: 15, fontWeight: 500, textDecoration: 'none', outline: 'none', boxShadow: 'none' }}
            onClick={() => setLangDropdown((v) => !v)}
          >
            <span style={{ fontSize: 15, fontWeight: 500 }}>{selectedLang.code.toUpperCase()}</span>
            <img src={selectedLang.flag} alt={selectedLang.code} style={{ width: 20, height: 14, marginLeft: 4, objectFit: 'cover', borderRadius: 2, border: '1px solid #fff' }} />
            <span style={{ fontSize: 12, color: '#fff', marginLeft: 2, marginTop: 2 }}>▼</span>
          </button>
          {langDropdown && (
            <ul className="dropdown-menu show" style={{ display: 'block', position: 'absolute', top: 36, left: 0, minWidth: 140, zIndex: 1000, background: '#fff', color: '#222', border: '1px solid #ddd', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: 0, margin: 0 }}>
              {LANGUAGES.map((lang) => (
                <li key={lang.code} style={{ width: '100%' }}>
                  <button
                    className="dropdown-item d-flex align-items-center py-2 px-3"
                    style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontSize: 15 }}
                    onClick={() => handleLangClick(lang)}
                  >
                    <img src={lang.flag} alt={lang.code} style={{ width: 20, height: 14, marginRight: 8, objectFit: 'cover', borderRadius: 2, border: '1px solid #ddd' }} />
                    {lang.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Adresse de livraison */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 18, minWidth: 120 }}>
          <span style={{ fontSize: 11, color: '#ddd', lineHeight: 1 }}>{t('deliverTo')}</span>
          <span style={{ fontWeight: 600, fontSize: 15, color: '#fff', lineHeight: 1.1 }}>Mamadou - Conakry</span>
        </div>
        {/* Barre de recherche */}
        <form style={{ flex: 1, display: 'flex', maxWidth: 500, minWidth: 250, margin: '0 18px', background: 'transparent' }}>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn btn-light search-cat-btn"
              style={{ border: 'none', background: '#fff', color: '#222', fontSize: 15, padding: '0 12px', borderRadius: '8px 0 0 8px', height: 36, outline: 'none', fontWeight: 500, borderRight: '1px solid #e47911', display: 'flex', alignItems: 'center', minWidth: 90 }}
              onClick={() => setSearchCatOpen((v) => !v)}
              ref={searchCatBtnRef}
            >
                             {t(searchCategory.key)} <span style={{ fontSize: 12, marginLeft: 6 }}>▼</span>
            </button>
            {searchCatOpen && (
              <ul className="dropdown-menu show search-cat-dropdown" style={{ display: 'block', position: 'absolute', top: 36, left: 0, minWidth: 140, zIndex: 1000, background: '#fff', color: '#232f3e', border: '1px solid #ddd', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: 0, margin: 0 }}>
                {CATEGORIES.map(cat => (
                  <li key={cat.key}>
                    <button
                      className="dropdown-item py-2 px-3"
                      style={{ fontWeight: 500, color: '#232f3e', fontSize: 15, textAlign: 'left', width: '100%' }}
                      onClick={() => { setSearchCategory(cat); setSearchCatOpen(false); }}
                    >
                      {t(cat.key)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input type="text" placeholder={`${t('searchIn')} ${t(searchCategory.key)}`} style={{ flex: 1, border: 'none', fontSize: 15, padding: '0 10px', height: 36, outline: 'none' }} />
          <button type="submit" style={{ background: '#ffd18b', border: '2px solid #e47911', borderLeft: 'none', borderRadius: '0 8px 8px 0', width: 48, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none', cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 16 16" stroke="currentColor">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" fill="#232f3e" />
            </svg>
          </button>
        </form>
        {/* Compte & Listes */}
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 18, minWidth: 120, position: 'relative' }}
          ref={accountBtnRef}
        >
          <button
            className="btn btn-link p-0 text-white"
            style={{ fontWeight: 600, fontSize: 15, textDecoration: 'underline', cursor: 'pointer', lineHeight: 1.1 }}
            onClick={() => setAccountDropdown((v) => !v)}
          >
            <span style={{ fontSize: 11, color: '#ddd', fontWeight: 400, textDecoration: 'none', display: 'block', marginBottom: -2 }}>{t('hello')}</span>
            {t('accountLists')} <span style={{ fontSize: 12, color: '#fff', marginLeft: 2 }}>▼</span>
          </button>
          {accountDropdown && (
            <ul className="dropdown-menu show" ref={accountMenuRef}
              style={{ display: 'block', position: 'absolute', top: 38, left: 0, minWidth: 260, zIndex: 1000, background: '#fff', color: '#222', border: '1px solid #ddd', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: 0, margin: 0 }}
            >
              <li><button className="dropdown-item py-2 px-3" style={{ fontWeight: 600, color: '#232f3e' }} onClick={() => handleAccountClick('Connexion')}>{t('signIn')}</button></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item py-2 px-3" onClick={() => handleAccountClick('Commandes')}>{t('orders')}</button></li>
              <li><button className="dropdown-item py-2 px-3" onClick={() => handleAccountClick('Favoris')}>{t('favourites')}</button></li>
              <li><button className="dropdown-item py-2 px-3" onClick={() => handleAccountClick('Retours')}>{t('returns')}</button></li>
              <li><button className="dropdown-item py-2 px-3" onClick={() => handleAccountClick('Adresses')}>{t('addresses')}</button></li>
              <li><button className="dropdown-item py-2 px-3" onClick={() => handleAccountClick('Paiement')}>{t('payment')}</button></li>
              <li><button className="dropdown-item py-2 px-3" onClick={() => handleAccountClick('Listes')}>{t('lists')}</button></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item py-2 px-3" style={{ color: '#b12704' }} onClick={() => handleAccountClick('Déconnexion')}>{t('logout')}</button></li>
            </ul>
          )}
        </div>
        {/* Retours et Commandes */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 18, minWidth: 100 }}>
          <span style={{ fontSize: 11, color: '#ddd', lineHeight: 1 }}>{t('returnsShort')}</span>
          <span style={{ fontWeight: 600, fontSize: 15, color: '#fff', lineHeight: 1.1 }}>{t('andOrders')}</span>
        </div>
        {/* Panier */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginRight: 8, minWidth: 70 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#fff" viewBox="0 0 16 16">
            <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .485.379L2.89 5H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 14H4a.5.5 0 0 1-.491-.408L1.01 2H.5a.5.5 0 0 1-.5-.5zm3.14 4l1.25 6.5h7.22l1.25-6.5H3.14z" />
          </svg>
          <span style={{ position: 'absolute', top: -8, right: -2, background: '#ffd814', color: '#232f3e', borderRadius: '50%', fontSize: 13, fontWeight: 700, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0</span>
          <span style={{ fontWeight: 600, fontSize: 15, color: '#fff', marginLeft: 6 }}>{t('cart')}</span>
        </div>
      </nav>
      {/* Barre secondaire */}
      <nav style={{ background: '#37475a', color: '#fff', width: '100%', minHeight: 36, display: 'flex', alignItems: 'center', padding: '0 16px', position: 'relative' }}>
        <ul style={{ display: 'flex', alignItems: 'center', listStyle: 'none', margin: 0, padding: 0, width: '100%' }}>
          <li style={{ fontWeight: 700, marginRight: 18, fontSize: 15, cursor: 'pointer', position: 'relative' }}>
            <button
              className="btn btn-link p-0 text-white btn-toutes-dropdown"
              style={{ fontWeight: 700, fontSize: 15, textDecoration: 'none', cursor: 'pointer' }}
              onClick={() => setAllMenuOpen((v) => !v)}
            >
              {t('all')} <span style={{ fontSize: 12, marginLeft: 2 }}>▼</span>
            </button>
            {allMenuOpen && (
              <>
                <div
                  onClick={() => setAllMenuOpen(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.45)',
                    zIndex: 1100,
                    transition: 'opacity 0.2s',
                  }}
                />
                <aside
                  className="menu-toutes-drawer"
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    width: 340,
                    background: '#fff',
                    color: '#232f3e',
                    zIndex: 1200,
                    boxShadow: '2px 0 16px rgba(0,0,0,0.18)',
                    borderRight: '1px solid #ddd',
                    borderRadius: 0,
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideInLeft 0.22s cubic-bezier(.4,1.2,.6,1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#232f3e', color: '#fff', padding: '16px 18px', fontWeight: 700, fontSize: 18, borderBottom: '1px solid #eee' }}>
                    <span>{t('all')}</span>
                    <button
                      className="btn btn-link p-0"
                      style={{ fontSize: 26, color: '#fff', fontWeight: 700, textDecoration: 'none', cursor: 'pointer', background: 'none', border: 'none' }}
                      onClick={() => setAllMenuOpen(false)}
                      aria-label={t('close')}
                    >
                      ×
                    </button>
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: '100%' }}>
                    {CATEGORIES.map(cat => (
                      <li key={cat.key} style={{ position: 'relative', padding: 0 }}>
                        <button
                          className="dropdown-item py-3 px-4 d-flex justify-content-between align-items-center"
                          style={{ fontWeight: 600, color: '#232f3e', fontSize: 17, textAlign: 'left', width: '100%', background: 'none', border: 'none', outline: 'none', borderBottom: '1px solid #f2f2f2' }}
                          onClick={() => setOpenSubMenu(openSubMenu === cat.key ? null : cat.key)}
                        >
                          <span>{t(cat.key)}</span>
                          <span style={{ fontSize: 15, marginLeft: 8 }}>{openSubMenu === cat.key ? '▲' : '▶'}</span>
                        </button>
                        {openSubMenu === cat.key && cat.sub && (
                          <ul style={{ listStyle: 'none', margin: 0, padding: 0, background: '#f8f9fa', borderRadius: 0, boxShadow: 'none', border: 'none', position: 'relative', left: 0, top: 0 }}>
                            {cat.sub.map((sub, idx) => (
                              <li key={sub}>
                                <button
                                  className="dropdown-item py-2 px-5"
                                  style={{ fontWeight: 400, color: '#232f3e', fontSize: 15, textAlign: 'left', width: '100%', background: 'none', border: 'none', outline: 'none' }}
                                  onClick={() => console.log(`Catégorie : ${t(cat.key)} > ${sub}`)}
                                >
                                  {t(sub)}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </aside>
                <style>{`
                  @keyframes slideInLeft {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                  }
                `}</style>
              </>
            )}
          </li>
          <li style={{ marginRight: 18, fontSize: 15, color: '#ddd', cursor: 'pointer' }}>{t('dailyDeals')}</li>
          <li style={{ marginRight: 18, fontSize: 15, color: '#ddd', cursor: 'pointer' }}>{t('customerService')}</li>
          <li style={{ marginRight: 18, fontSize: 15, color: '#ddd', cursor: 'pointer' }}>{t('giftCards')}</li>
          <li style={{ marginRight: 0, fontSize: 15, color: '#ddd', cursor: 'pointer' }}>{t('sell')}</li>
        </ul>
      </nav>
    </header>
  );
}
