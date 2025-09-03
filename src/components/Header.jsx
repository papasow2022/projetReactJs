// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../hooks/useAuth.jsx";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import LivraisonLocation from './LivraisonLocation.jsx';
import NotificationBell from './NotificationBell';
import AmazonCartSidebar from './AmazonCartSidebar';
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

// Menu complet avec toutes les catégories basé sur la structure originale
const FULL_MENU_CATEGORIES = [
  {
    id: 'chaussures',
    label: 'Chaussures',
    icon: 'bi-shoe',
    subcategories: [
      { id: 'homme', label: 'Homme', icon: 'bi-person' },
      { id: 'femme', label: 'Femme', icon: 'bi-person' },
      { id: 'enfant', label: 'Enfant', icon: 'bi-person' },
      { id: 'bebe', label: 'Bébé', icon: 'bi-heart' }
    ]
  },
  {
    id: 'pantalons',
    label: 'Pantalons',
    icon: 'bi-list',
    subcategories: [
      { id: 'pantalons-homme', label: 'Homme', icon: 'bi-person' },
      { id: 'pantalons-femme', label: 'Femme', icon: 'bi-person' },
      { id: 'pantalons-enfant', label: 'Enfant', icon: 'bi-person' },
      { id: 'pantalons-bebe', label: 'Bébé', icon: 'bi-heart' }
    ]
  },
  {
    id: 'vestes',
    label: 'Vestes',
    icon: 'bi-journal',
    subcategories: [
      { id: 'vestes-homme', label: 'Homme', icon: 'bi-person' },
      { id: 'vestes-femme', label: 'Femme', icon: 'bi-person' },
      { id: 'vestes-enfant', label: 'Enfant', icon: 'bi-person' },
      { id: 'vestes-bebe', label: 'Bébé', icon: 'bi-heart' }
    ]
  },
  {
    id: 'accessoires',
    label: 'Accessoires',
    icon: 'bi-bag',
    subcategories: [
      { id: 'ceintures', label: 'Ceintures', icon: 'bi-bag' },
      { id: 'sacs', label: 'Sacs', icon: 'bi-bag' },
      { id: 'lunettes', label: 'Lunettes', icon: 'bi-eye' },
      { id: 'casquettes', label: 'Casquettes', icon: 'bi-bag' }
    ]
  },
  {
    id: 'promotions',
    label: 'Promotions',
    icon: 'bi-lightning',
    subcategories: [
      { id: 'offres-cours', label: 'Offres en cours', icon: 'bi-lightning' },
      { id: 'nouveautes', label: 'Nouveautés', icon: 'bi-star' },
      { id: 'produits-recents', label: 'Produits récents', icon: 'bi-clock' },
      { id: 'meilleures-ventes', label: 'Meilleures ventes', icon: 'bi-trophy' }
    ]
  }
];

export default function Header() {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { getCartItemCount, setShowCartSidebar } = useCart();
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
  const [showSubMenu, setShowSubMenu] = useState(null); // nouvelle variable d'état
  // Utiliser le contexte de panier pour le compteur
  const cartCount = getCartItemCount();

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
        setOpenSubMenu(null);
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

  function handleCategoryHover(categoryId) {
    setOpenSubMenu(categoryId);
  }

  function handleCategoryLeave() {
    setOpenSubMenu(null);
  }

  const handleLogout = () => {
    logout();
    setAllMenuOpen(false);
    setOpenSubMenu(null);
    setShowSubMenu(null);
    window.location.reload();
  };

  return (
    <header style={{ background: "#232f3e", color: "#fff", width: "100%", fontFamily: 'Arial, sans-serif' }}>
      {/* Barre principale façon Amazon */}
      <nav style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid #444', minHeight: 56, background: '#232f3e' }}>
        {/* Logo papasow (remplace VenteChaussure) */}
        <div style={{ marginRight: 12, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#fff', fontWeight: 700, fontSize: 20, letterSpacing: 0.5, fontFamily: 'Arial Black, Arial, sans-serif', lineHeight: 1, display: 'flex', alignItems: 'center' }}>
            papasow
          </Link>
        </div>
        {/* Adresse de livraison juste à droite du logo */}
        <div style={{ marginRight: 16, flexShrink: 0 }}>
          <LivraisonLocation user={user} />
        </div>
        {/* Barre de recherche large et centrée */}
        <form style={{ flex: 1, display: 'flex', maxWidth: 700, minWidth: 250, margin: '0 24px', background: 'transparent', alignItems: 'center' }}>
          {/* Sélecteur de catégorie stylé comme un bouton 'All' */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              type="button"
              className="btn btn-light search-cat-btn"
              style={{ border: '1px solid #ddd', background: '#f3f3f3', color: '#222', fontSize: 15, padding: '0 18px', borderRadius: '8px 0 0 8px', height: 40, outline: 'none', fontWeight: 500, borderRight: 'none', display: 'flex', alignItems: 'center', minWidth: 70, boxShadow: 'none' }}
              onClick={() => setSearchCatOpen((v) => !v)}
              ref={searchCatBtnRef}
            >
              {t(searchCategory.key) || 'All'} <span style={{ fontSize: 12, marginLeft: 6 }}>▼</span>
            </button>
            {searchCatOpen && (
              <ul className="dropdown-menu show search-cat-dropdown" style={{ display: 'block', position: 'absolute', top: 40, left: 0, minWidth: 140, zIndex: 1000, background: '#fff', color: '#232f3e', border: '1px solid #ddd', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: 0, margin: 0 }}>
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
          <input type="text" placeholder={`${t('searchIn')} ${t(searchCategory.key)}`} style={{ flex: 1, border: '1px solid #ddd', borderLeft: 'none', fontSize: 15, padding: '0 12px', height: 40, outline: 'none', borderRadius: '0', background: '#fff' }} />
          <button type="submit" style={{ background: '#ffd814', border: '1.5px solid #e47911', borderLeft: 'none', borderRadius: '0 8px 8px 0', width: 48, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'none', cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 16 16" stroke="currentColor">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.656a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" fill="#232f3e" />
            </svg>
          </button>
        </form>
        {/* À droite : langue, compte, retours & commandes, panier */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Bouton Devenir vendeur - Prominent */}
          <Link to="/vendeur" style={{
            background: '#ffd814',
            color: '#232f3e',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            border: '1px solid #e47911',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginRight: '8px'
          }}>
            <i className="bi bi-shop" style={{ fontSize: '14px' }}></i>
            Devenir vendeur
          </Link>
          {/* Sélecteur de langue */}
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 8, position: 'relative' }} ref={langBtnRef}>
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
          {/* Compte & Listes */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 8, minWidth: 120, position: 'relative' }} ref={accountBtnRef}>
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
              marginRight: 8,
              minWidth: 100,
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: 11, color: '#ddd', lineHeight: 1 }}>{t('returnsShort')}</span>
            <span style={{ fontWeight: 600, fontSize: 15, color: '#fff', lineHeight: 1.1 }}>{t('andOrders')}</span>
          </Link>
          {/* Notifications */}
          <div style={{ marginRight: 16 }}>
            <NotificationBell />
          </div>
          
          {/* Panier */}
          <button
            onClick={() => setShowCartSidebar(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              marginRight: 0,
              minWidth: 70,
              textDecoration: 'none',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              color: 'inherit'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#fff" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .485.379L2.89 5H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 14H4a.5.5 0 0 1-.491-.408L1.01 2H.5a.5.5 0 0 1-.5-.5zm3.14 4l1.25 6.5h7.22l1.25-6.5H3.14z" />
            </svg>
            <span style={{ position: 'absolute', top: -8, right: -2, background: '#ffd814', color: '#232f3e', borderRadius: '50%', fontSize: 13, fontWeight: 700, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
            <span style={{ fontWeight: 600, fontSize: 15, color: '#fff', marginLeft: 6 }}>{t('cart')}</span>
          </button>
        </div>
      </nav>
      {/* Barre secondaire façon Amazon */}
      <nav style={{ background: '#232f3e', borderBottom: '1px solid #222', padding: '0 16px', minHeight: 38, display: 'flex', alignItems: 'center' }}>
        <ul style={{ display: 'flex', gap: 24, listStyle: 'none', margin: 0, padding: 0, fontSize: 15, fontWeight: 500, alignItems: 'center', height: 38 }}>
          <li style={{ cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', height: 38 }}>
            <button
              className="btn-toutes-dropdown"
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: 4,
                transition: 'background-color 0.2s',
                height: 38
            }}
            onMouseEnter={() => setAllMenuOpen(true)}
            onClick={() => setAllMenuOpen(!allMenuOpen)}
          >
            <i className="bi bi-list" style={{ fontSize: 18, marginRight: 8 }}></i>
            Toutes
            <i className="bi bi-chevron-down" style={{ fontSize: 12, marginLeft: 6 }}></i>
          </button>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', height: 38 }}>
            <Link to="/offres-du-jour" style={{ 
              color: '#fff', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px',
              borderRadius: '4px',
              transition: 'all 0.2s'
            }}>
              <i className="bi bi-lightning-fill" style={{ fontSize: '14px', color: '#ffd814' }}></i>
              Offres du jour
            </Link>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', height: 38 }}>
            <Link to="/cartes-cadeaux" style={{ 
              color: '#fff', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px',
              borderRadius: '4px',
              transition: 'all 0.2s'
            }}>
              <i className="bi bi-gift-fill" style={{ fontSize: '14px', color: '#ff6b6b' }}></i>
              Cartes-cadeaux
            </Link>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', height: 38 }}>
            <Link to="/vendeur" style={{ 
              color: '#ffd814', 
              textDecoration: 'none', 
              fontWeight: '600',
              padding: '6px 12px',
              borderRadius: '4px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <i className="bi bi-shop" style={{ fontSize: '14px' }}></i>
              Vendeur
            </Link>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', height: 38 }}>
            <Link to="/nouveautes" style={{ 
              color: '#fff', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px',
              borderRadius: '4px',
              transition: 'all 0.2s'
            }}>
              <i className="bi bi-star-fill" style={{ fontSize: '14px', color: '#ffd814' }}></i>
              Nouveautés
            </Link>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', height: 38 }}>
            <Link to="/service-client" style={{ 
              color: '#fff', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px',
              borderRadius: '4px',
              transition: 'all 0.2s'
            }}>
              <i className="bi bi-headset" style={{ fontSize: '14px', color: '#4ecdc4' }}></i>
              Service client
            </Link>
          </li>
        </ul>
      </nav>
          {/* Menu "Toutes" - Drawer latéral */}
          {allMenuOpen && (
            <div 
              className="menu-toutes-drawer"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                zIndex: 9999,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                overflowX: 'hidden',
              }}
              onClick={(e) => {
                if (e.target.classList.contains('menu-toutes-drawer')) {
                  setAllMenuOpen(false);
                  setOpenSubMenu(null);
                  setShowSubMenu(null);
                }
              }}
            >
              <div style={{
                width: '400px',
                height: '100%',
                background: '#fff',
                color: '#232f3e',
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                borderRadius: '8px 0 0 8px'
              }}
              onClick={e => e.stopPropagation()}
              >
                {/* Bandeau Hello, sign in en haut du menu Toutes */}
                <div
                  style={{
                    background: '#232f3e',
                    color: '#fff',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 700,
                    fontSize: 18,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    borderBottom: '1px solid #444',
                    minHeight: 48,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setAllMenuOpen(false);
                    setOpenSubMenu(null);
                    setShowSubMenu(null);
                    window.location.href = '/connexion';
                  }}
                >
                  <i className="bi bi-person-circle" style={{ fontSize: 24, marginRight: 10 }}></i>
                  <span>{user ? `Bonjour, ${user.prenom}${user.nom ? ' ' + user.nom : ''}` : t('helloSignIn')}</span>
                </div>
                {/* Bouton de déconnexion si connecté */}
                {user && (
                  <div style={{ borderBottom: '1px solid #eee', padding: '0 0 8px 0', background: '#fff' }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#232f3e', padding: '12px 20px 4px 20px' }}>
                      Mon compte
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      <a href="/profil" style={{ color: '#232f3e', textDecoration: 'none', fontSize: 15, padding: '8px 20px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>Profil</a>
                      <a href="/commandes" style={{ color: '#232f3e', textDecoration: 'none', fontSize: 15, padding: '8px 20px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>Commandes</a>
                      <a href="/adresses" style={{ color: '#232f3e', textDecoration: 'none', fontSize: 15, padding: '8px 20px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>Adresses</a>
                      <a href="/paiement" style={{ color: '#232f3e', textDecoration: 'none', fontSize: 15, padding: '8px 20px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>Paiement</a>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#e47911',
                          fontWeight: 600,
                          fontSize: 15,
                          textAlign: 'left',
                          padding: '8px 20px',
                          cursor: 'pointer',
                          borderTop: '1px solid #eee',
                          marginTop: 8
                        }}
                        onClick={handleLogout}
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
                {/* Fin bandeau Hello, sign in */}
                {/* Header du menu */}
                <div style={{
                  background: '#232f3e',
                  color: '#fff',
                  padding: '16px 20px',
                  borderBottom: '1px solid #444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: 22,
                }}>
                  <span>{t('all')}</span>
                  <button
                    onClick={() => {
                      setAllMenuOpen(false);
                      setOpenSubMenu(null);
                      setShowSubMenu(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      fontSize: 22,
                      cursor: 'pointer',
                      padding: 4
                    }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                {/* Contenu du menu principal ou du sous-menu */}
                {!showSubMenu ? (
                  <div style={{ flex: 1, overflow: 'auto', padding: '0', margin: 0 }}>
                    {FULL_MENU_CATEGORIES.map((category) => (
                      <div key={category.id} style={{ position: 'relative' }}>
                        <Link
                          to={`/${category.id}`}
                          className={`menu-category-item`}
                          style={{
                            width: '100%',
                            padding: '16px 20px',
                            background: 'none',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: 16,
                            color: '#232f3e',
                            borderBottom: '1px solid #f0f0f0',
                            transition: 'background-color 0.2s',
                            fontWeight: 500,
                            textDecoration: 'none'
                          }}
                          onClick={() => {
                            setAllMenuOpen(false);
                            setOpenSubMenu(null);
                            setShowSubMenu(null);
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <i className={`bi ${category.icon}`} style={{ fontSize: 18, minWidth: 22 }}></i>
                            <span>{category.label}</span>
                          </div>
                          <i className="bi bi-chevron-right" style={{ fontSize: 14 }}></i>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ flex: 1, overflow: 'auto', padding: 0, margin: 0, background: '#fff' }}>
                    {FULL_MENU_CATEGORIES.find(cat => cat.id === showSubMenu).subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        style={{
                          padding: '18px 24px',
                          color: '#111',
                          fontSize: 16,
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f0f0f0',
                          fontWeight: 400
                        }}
                      >
                        {sub.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
      
      {/* Sidebar du panier Amazon */}
      <AmazonCartSidebar />
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

// Styles pour le menu "Toutes"
const menuStyles = `
  .btn-toutes-dropdown:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
  
  .menu-toutes-drawer {
    animation: fadeIn 0.2s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .menu-category-item:hover {
    background-color: #f8f9fa !important;
  }
  
  .menu-subcategory-item:hover {
    background-color: #e9ecef !important;
  }
  
  .menu-submenu {
    animation: slideIn 0.15s ease-out;
  }
  
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateX(-5px);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .menu-category-item.active {
    background-color: #f8f9fa !important;
  }
`;

// Injecter les styles dans le head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = menuStyles;
  document.head.appendChild(styleElement);
}
