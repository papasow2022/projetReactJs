// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router-dom";
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

const CATEGORY_ICONS = {
  chaussures: 'bi-shoe',
  pantalons: 'bi-list',
  vestes: 'bi-journal',
  accessoires: 'bi-bag',
  promotions: 'bi-lightning',
};

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
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    function updateCartCount() {
      const stored = localStorage.getItem('cart');
      if (stored) {
        try {
          const cart = JSON.parse(stored);
          const total = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.qty || 1), 0) : 0;
          setCartCount(total);
        } catch {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    }
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    const interval = setInterval(updateCartCount, 500);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

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
        !event.target.closest('.menu-toutes-drawer') &&
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
            <div ref={accountMenuRef} style={{
              position: 'absolute', top: 38, left: 0, minWidth: 340, zIndex: 1000, background: '#fff', color: '#232f3e', border: '1px solid #ddd', borderRadius: 6, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', padding: 0, margin: 0, fontSize: 15
            }}>
              {/* Connexion / Inscription */}
              <div style={{ borderBottom: '1px solid #eee', padding: '16px 20px 12px 20px', background: '#f7fafc' }}>
                <Link to="/connexion" style={{ fontWeight: 700, color: '#232f3e', textDecoration: 'none', fontSize: 16 }}>
                  Se connecter
                </Link>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  Nouveau client ? <Link to="/inscription" style={{ color: '#007185', textDecoration: 'none', fontWeight: 500 }}>Commencez ici</Link>
                </div>
              </div>
              {/* Mon compte */}
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Mon compte</div>
                <Link to="/profil" className="dropdown-item" style={{ color: '#232f3e', padding: 0, marginBottom: 4 }}>Mon profil</Link><br/>
                <Link to="/adresses" className="dropdown-item" style={{ color: '#232f3e', padding: 0, marginBottom: 4 }}>Mes adresses</Link><br/>
                <Link to="/paiement" className="dropdown-item" style={{ color: '#232f3e', padding: 0, marginBottom: 4 }}>Mes moyens de paiement</Link><br/>
                <Link to="/securite" className="dropdown-item" style={{ color: '#232f3e', padding: 0, marginBottom: 4 }}>Paramètres de sécurité</Link><br/>
                <Link to="/preferences" className="dropdown-item" style={{ color: '#232f3e', padding: 0 }}>Préférences de communication</Link>
              </div>
              {/* Mes commandes */}
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Mes commandes</div>
                <Link to="/commandes#historique" className="dropdown-item" style={{ color: '#232f3e', padding: 0, marginBottom: 4 }}>Historique des commandes</Link><br/>
                <Link to="/commandes#suivi" className="dropdown-item" style={{ color: '#232f3e', padding: 0, marginBottom: 4 }}>Suivi des livraisons</Link><br/>
                <Link to="/commandes#retours" className="dropdown-item" style={{ color: '#232f3e', padding: 0 }}>Retours et remboursements</Link>
              </div>
              {/* Mes listes */}
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Mes listes</div>
                <Link to="/listes/envies" className="dropdown-item" style={{ color: '#232f3e', padding: 0, marginBottom: 4 }}>Listes d'envies</Link><br/>
                <Link to="/listes/cadeaux" className="dropdown-item" style={{ color: '#232f3e', padding: 0, marginBottom: 4 }}>Listes cadeaux</Link><br/>
                <Link to="/listes/categories" className="dropdown-item" style={{ color: '#232f3e', padding: 0, marginBottom: 4 }}>Listes par catégorie</Link><br/>
                <Link to="/listes/sauvegardes" className="dropdown-item" style={{ color: '#232f3e', padding: 0 }}>Articles sauvegardés pour plus tard</Link>
              </div>
              {/* Abonnements et programmes */}
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Abonnements et programmes</div>
                <Link to="/cartes-cadeaux" className="dropdown-item" style={{ color: '#232f3e', padding: 0 }}>Gestion des cartes-cadeaux et crédits</Link>
              </div>
              {/* Mes avis */}
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Mes avis</div>
                <Link to="/avis" className="dropdown-item" style={{ color: '#232f3e', padding: 0 }}>Mes évaluations et commentaires</Link>
              </div>
              {/* Aide et assistance */}
              <div style={{ padding: '12px 20px' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Aide et assistance</div>
                <Link to="/service-client#centre-aide" className="dropdown-item" style={{ color: '#232f3e', padding: 0, marginBottom: 4 }}>Centre d'aide</Link><br/>
                <Link to="/service-client#contact" className="dropdown-item" style={{ color: '#232f3e', padding: 0, marginBottom: 4 }}>Contact service client</Link><br/>
                <Link to="/service-client#faq" className="dropdown-item" style={{ color: '#232f3e', padding: 0 }}>FAQ</Link>
              </div>
            </div>
          )}
        </div>
        {/* Retours et Commandes */}
        <Link
          to="/commandes"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginRight: 18,
            minWidth: 100,
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: 11, color: '#ddd', lineHeight: 1 }}>{t('returnsShort')}</span>
          <span style={{ fontWeight: 600, fontSize: 15, color: '#fff', lineHeight: 1.1 }}>{t('andOrders')}</span>
        </Link>
        {/* Panier */}
        <Link
          to="/panier"
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            marginRight: 8,
            minWidth: 70,
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#fff" viewBox="0 0 16 16">
            <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .485.379L2.89 5H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 14H4a.5.5 0 0 1-.491-.408L1.01 2H.5a.5.5 0 0 1-.5-.5zm3.14 4l1.25 6.5h7.22l1.25-6.5H3.14z" />
          </svg>
          <span style={{ position: 'absolute', top: -8, right: -2, background: '#ffd814', color: '#232f3e', borderRadius: '50%', fontSize: 13, fontWeight: 700, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
          <span style={{ fontWeight: 600, fontSize: 15, color: '#fff', marginLeft: 6 }}>{t('cart')}</span>
        </Link>
      </nav>
    </header>
  );
}

/*
.category-hover:hover, .category-hover.active {
  background: #f3f6fa !important;
  transition: background 0.18s;
}
.category-hover:focus {
  outline: 2px solid #007185;
  background: #e9ecef !important;
}
.subcategory-hover:hover, .subcategory-hover:focus-within {
  background: #e9ecef !important;
  transition: background 0.18s;
}
.submenu-animated {
  opacity: 0;
  transform: translateX(-20px);
  animation: submenuIn 0.25s cubic-bezier(.4,1.2,.6,1) forwards;
}
@keyframes submenuIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
*/
