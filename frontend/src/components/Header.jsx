// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../hooks/useAuth.jsx";
import { useCart } from "../contexts/CartContext";
import { useProducts } from "../contexts/ProductsContext";
import { useThemeColors } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";
import LivraisonLocation from './LivraisonLocation.jsx';
import NotificationCenter from './NotificationCenter';
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

// Lien stylé utilisé dans le menu Compte & Listes
function MenuLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        padding: '8px 10px',
        borderRadius: 6,
        color: '#111',
        textDecoration: 'none',
        fontSize: 14
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#f7fafa'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </Link>
  );
}

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
  const { fetchProductsApi, allProducts } = useProducts();
  const colors = useThemeColors();
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
  const [searchQuery, setSearchQuery] = useState("");
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
        setShowSubMenu(null);
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
        {/* Barre de recherche large et centrée (catégorie + input + bouton icône) */}
        <form style={{ flex: 1, display: 'flex', maxWidth: 700, minWidth: 250, margin: '0 24px', background: 'transparent', alignItems: 'center' }}
          onSubmit={async (e) => {
            e.preventDefault();
            const term = (searchQuery || '').toLowerCase();

            // 0) Recherche directe dans les produits chargés (priorité aux produits homme)
            try {
              const normalized = term.replace(/\s+/g, ' ').trim();
              const isMen = /\bhomme\b/.test(normalized) || true; // par défaut, laisser passer pour capturer les modèles homme
              const direct = (allProducts || []).find(p => {
                const name = (p.name || '').toLowerCase();
                const brand = (p.brand || '').toLowerCase();
                const idStr = String(p.id || '').toLowerCase();
                const okText = name.includes(normalized) || normalized.includes(name) ||
                  normalized.includes(brand) || brand && normalized.includes(brand);
                const okStatus = (p.status === 'approved') && (p.visible ?? true);
                const okSub = !isMen || (p.subcategory === 'homme');
                return okText && okStatus && okSub;
              });
              if (direct) {
                const to = `/product/${direct.slug || direct.id}`;
                window.location.href = to;
                return;
              }
            } catch {}

            // 1) Résolution front-only des modèles HOMME via mapping images publiques
            const mapMenQueryToImage = (q) => {
              const t = (q || '').toLowerCase().replace(/\s+/g, ' ').trim();
              // Balenciaga
              if (t.includes('balenciaga') || t.includes('balanciaga')) {
                if (t.includes('defender') && t.includes('blanc')) return '/chaussures/homme/Balanciaga/Blanc/balenciaga-defender-blanc.jpg';
                if (t.includes('defender') && (t.includes('noir') || t.includes('noire'))) return '/chaussures/homme/Balanciaga/Noire/balenciaga-defender-noire.jpg';
                if (t.includes('defender') && t.includes('vert olive')) return '/chaussures/homme/Balanciaga/Vertolive/balenciaga-defender-vertolive.jpg';
                if (t.includes('speed') && t.includes('blanc')) return '/chaussures/homme/Balanciaga/Blanc/balenciaga-speed-blanc.jpg';
                if (t.includes('speed') && (t.includes('noir') || t.includes('noire'))) return '/chaussures/homme/Balanciaga/Noire/balenciaga-speed-noire.jpg';
                if (t.includes('speed') && t.includes('vert olive')) return '/chaussures/homme/Balanciaga/Vertolive/balenciaga-speed-vertolive.jpg';
                if (t.includes('track') && t.includes('blanc')) return '/chaussures/homme/Balanciaga/Blanc/balenciaga-track-blanc.jpg';
                if (t.includes('track') && (t.includes('noir') || t.includes('noire'))) return '/chaussures/homme/Balanciaga/Noire/balenciaga-track-noire.jpg';
                if (t.includes('track') && t.includes('vert olive')) return '/chaussures/homme/Balanciaga/Vertolive/balenciaga-track-vertolive.jpg';
              }
              // Nike
              if (t.includes('nike')) {
                if ((t.includes('air max 270') || t.includes('270')) && t.includes('blanc')) return '/chaussures/homme/Nike/blanc/nike-air-max-270-blanc.jpg';
                if ((t.includes('air max 270') || t.includes('270')) && (t.includes('noir') || t.includes('noire'))) return '/chaussures/homme/Nike/noire/nike-air-max-270-noir.jpg';
                if ((t.includes('air max 270') || t.includes('270')) && t.includes('vert olive')) return '/chaussures/homme/Nike/vertolive/nike-air-max-270-vertolive.jpg';
                if (t.includes('air jordan 1') && t.includes('blanc')) return '/chaussures/homme/Nike/blanc/nike-air-jordan-1-blanc.jpg';
                if (t.includes('air jordan 1') && (t.includes('noir') || t.includes('noire'))) return '/chaussures/homme/Nike/noire/nike-air-jordan-1-noir.jpg';
                if (t.includes('air jordan 1') && t.includes('vert olive')) return '/chaussures/homme/Nike/vertolive/nike-air-jordan-1-vertolive.jpg';
                if (t.includes('dunk low') && t.includes('blanc')) return '/chaussures/homme/Nike/blanc/nike-dunk-low-blanc.jpg';
                if (t.includes('dunk low') && (t.includes('noir') || t.includes('noire'))) return '/chaussures/homme/Nike/noire/nike-dunk-low-noir.jpg';
                if (t.includes('dunk low') && t.includes('vert olive')) return '/chaussures/homme/Nike/vertolive/nike-dunk-low-vertolive.jpg';
              }
              // Puma
              if (t.includes('puma')) {
                if (t.includes('basket classic') && t.includes('blanc')) return '/chaussures/homme/Puma/Blanc/puma-basket-classic-blanc.jpg';
                if (t.includes('basket classic') && t.includes('vert olive')) return '/chaussures/homme/Puma/Vertolive/puma-basket-classic-vertolive.jpg';
                if (t.includes('cali sport') && t.includes('blanc')) return '/chaussures/homme/Puma/Blanc/puma-cali-sport-blanc.jpg';
                if (t.includes('cali sport') && (t.includes('noir') || t.includes('noire'))) return '/chaussures/homme/Puma/Noir/puma-cali-sport-noire.jpg';
                if (t.includes('future rider') && t.includes('blanc')) return '/chaussures/homme/Puma/Blanc/puma-future-rider-blanc.jpg';
                if (t.includes('future rider') && (t.includes('noir') || t.includes('noire'))) return '/chaussures/homme/Puma/Noir/puma-future-rider-noire.jpg';
                if (t.includes('future rider') && t.includes('vert olive')) return '/chaussures/homme/Puma/Vertolive/puma-future-rider-vertolive.jpg';
                if (t.includes('rs-x') && (t.includes('noir') || t.includes('noire'))) return '/chaussures/homme/Puma/Noir/puma-rs-x-noire.jpg';
              }
              // Gucci
              if (t.includes('gucci')) {
                if (t.includes('ace') && t.includes('blanc')) return '/chaussures/homme/Gucci/Blanc/gucci-ace-blanc.jpg';
                if (t.includes('ace') && (t.includes('noir') || t.includes('noire'))) return '/chaussures/homme/Gucci/Guccinoire/gucci-ace-guccinoire.jpg';
                if (t.includes('ace') && t.includes('rose')) return '/chaussures/homme/Gucci/Guccirose/gucci-ace-guccirose.jpg';
                if (t.includes('rhyton') && t.includes('blanc')) return '/chaussures/homme/Gucci/Blanc/gucci-rhyton-blanc.jpg';
                if (t.includes('rhyton') && (t.includes('noir') || t.includes('noire'))) return '/chaussures/homme/Gucci/Guccinoire/gucci-rhyton-guccinoire.jpg';
                if (t.includes('rhyton') && t.includes('rose')) return '/chaussures/homme/Gucci/Guccirose/gucci-rhyton-guccirose.jpg';
                if (t.includes('screener') && t.includes('blanc')) return '/chaussures/homme/Gucci/Blanc/gucci-screener-blanc.jpg';
                if (t.includes('screener') && (t.includes('noir') || t.includes('noire'))) return '/chaussures/homme/Gucci/Guccinoire/gucci-screener-guccinoire.jpg';
                if (t.includes('screener') && t.includes('rose')) return '/chaussures/homme/Gucci/Guccirose/gucci-screener-guccirose.jpg';
              }
              return null;
            };
            const imageForMen = mapMenQueryToImage(searchQuery);
            if (imageForMen) {
              window.location.href = `/product/synthetic-homme?image=${encodeURIComponent(imageForMen)}`;
              return;
            }
            const hasBalenciaga = term.includes('balenciaga') || term.includes('balanciaga');
            const colorMap = [
              { tokens: ['noir', 'noire'], value: 'Noir' },
              { tokens: ['blanc', 'blanche'], value: 'Blanc' },
              { tokens: ['vert olive', 'vertolive', 'olive'], value: 'Vert olive' },
            ];
            const foundColor = colorMap.find(c => c.tokens.some(t => term.includes(t)))?.value || null;
            if (hasBalenciaga) {
              try {
                const params = { brand: 'Balenciaga', subcategory: 'homme', page: 1, pageSize: 24 };
                if (foundColor) params.color = foundColor;
                const res = await fetchProductsApi(params);
                const items = Array.isArray(res?.items) ? res.items : [];
                if (foundColor && items.length > 0) {
                  window.location.href = `/product/${items[0].slug}?color=${encodeURIComponent(foundColor)}`;
                  return;
                }
                // Pas de couleur: rediriger vers la page catalogue avec filtres
                window.location.href = `/catalogue?brand=Balenciaga&subcategory=homme${foundColor ? `&color=${encodeURIComponent(foundColor)}` : ''}`;
                return;
              } catch (err) {
                console.error(err);
              }
            }
            window.location.href = `/catalogue?search=${encodeURIComponent(searchQuery || '')}`;
          }}
        >
          {/* Conteneur unifié pour assurer un seul contour et des coins homogènes */}
          <div style={{ display: 'flex', flex: 1, maxWidth: '100%', border: '1px solid #d5d5d5', borderRadius: 8, overflow: 'visible', background: '#fff', position: 'relative' }}>
            {/* Bouton catégorie à gauche (Chaussures) */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="search-cat-btn"
                ref={searchCatBtnRef}
                onClick={() => setSearchCatOpen(!searchCatOpen)}
                style={{
                  background: '#f3f3f3',
                  color: '#111',
                  border: 'none',
                  borderRight: '1px solid #d5d5d5',
                  padding: '9px 12px',
                  minWidth: 130,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  height: 38
                }}
              >
                <span>{searchCategory.label}</span>
                <i className="bi bi-caret-down-fill" style={{ fontSize: 10 }}></i>
              </button>
              {searchCatOpen && (
                <div className="search-cat-dropdown" style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', color: '#111', border: '1px solid #d5d5d5', borderTop: 'none', borderRadius: '0 0 8px 8px', minWidth: 220, zIndex: 10000, boxShadow: '0 6px 14px rgba(0,0,0,0.12)' }}>
                  {CATEGORIES.map(cat => (
                    <button key={cat.key} onClick={() => { setSearchCategory(cat); setSearchCatOpen(false); }} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', padding: '10px 12px', cursor: 'pointer', fontSize: 14 }}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Champ de recherche central */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Rechercher dans ${searchCategory.label}`}
              style={{
                flex: 1,
                minWidth: 0,
                padding: '10px 12px',
                border: 'none',
                outline: 'none',
                fontSize: 14,
                background: '#fff',
                color: '#111',
                height: 38
              }}
            />

            {/* Bouton de recherche jaune avec icône */}
            <button type="submit" title="Rechercher" style={{ width: 44, background: '#febd69', color: '#111', border: 'none', borderLeft: '1px solid #d5d5d5', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 38 }}>
              <i className="bi bi-search" style={{ fontSize: 16 }}></i>
            </button>
          </div>
        </form>
        {/* Zone de droite: Compte & Listes, Retours et Commandes, Notifications, Panier */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Sélecteur de langue FR avec drapeau */}
          <div style={{ position: 'relative' }}>
            <button
              ref={langBtnRef}
              onClick={() => setLangDropdown(!langDropdown)}
              style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '4px 8px' }}
              title={selectedLang.label}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span role="img" aria-label={selectedLang.label}>{selectedLang.emoji}</span>
                <span style={{ fontWeight: 700 }}>{selectedLang.code}</span>
              </span>
              <i className="bi bi-caret-down-fill" style={{ fontSize: 10, color: '#ddd' }}></i>
            </button>
            {langDropdown && (
              <div style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', color: '#111', border: '1px solid #ddd', borderRadius: 6, minWidth: 160, zIndex: 10000 }}>
                {LANGUAGES.map(lang => (
                  <button key={lang.code} onClick={() => handleLangClick(lang)} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', padding: '8px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span role="img" aria-label={lang.label}>{lang.emoji}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Compte & Listes */}
          <div style={{ position: 'relative' }}>
            <button
              ref={accountBtnRef}
              onClick={() => setAccountDropdown(!accountDropdown)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '4px 8px'
              }}
            >
              <span style={{ fontSize: 11, color: '#ddd' }}>{user ? `${t('hello')?.replace('identifiez-vous','')}${user?.prenom ? ' ' + user.prenom : ''}` : t('hello_identify')}</span>
              <span style={{ fontSize: 13, fontWeight: 700, textDecoration: 'underline' }}>{t('account_lists')}</span>
            </button>
            {accountDropdown && (
              <div
                ref={accountMenuRef}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: '#fff',
                  color: '#111',
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  minWidth: 320,
                  zIndex: 10000,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }}
              >
                {/* Bandeau Se connecter */}
                {!user && (
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid #eee' }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Se connecter</div>
                    <div style={{ fontSize: 12, color: '#565959' }}>Nouveau client ? <a href="/inscription" style={{ color: '#007185', textDecoration: 'none' }}>Commencez ici</a></div>
                    <a href="/connexion" style={{ display: 'inline-block', marginTop: 10, background: '#ffd814', color: '#111', border: '1px solid #f2c200', borderRadius: 8, padding: '6px 10px', fontWeight: 700, textDecoration: 'none' }}>Se connecter</a>
                  </div>
                )}

                {/* Sections */}
                <div style={{ padding: '8px 0' }}>
                  <div style={{ padding: '8px 14px', fontWeight: 700, color: '#111' }}>Mon compte</div>
                  <div style={{ padding: '0 8px 8px 8px' }}>
                    <MenuLink to="/profil">Mon profil</MenuLink>
                    <MenuLink to="/adresses">Mes adresses</MenuLink>
                    <MenuLink to="/paiement">Mes moyens de paiement</MenuLink>
                    <MenuLink to="/securite">Paramètres de sécurité</MenuLink>
                    <MenuLink to="/communications">Préférences de communication</MenuLink>
                  </div>

                  <div style={{ height: 1, background: '#f1f1f1' }}></div>

                  <div style={{ padding: '8px 14px', fontWeight: 700, color: '#111' }}>Mes commandes</div>
                  <div style={{ padding: '0 8px 8px 8px' }}>
                    <MenuLink to="/commandes">Historique des commandes</MenuLink>
                    <MenuLink to="/livraisons">Suivi des livraisons</MenuLink>
                    <MenuLink to="/retours">Retours et remboursements</MenuLink>
                  </div>

                  <div style={{ height: 1, background: '#f1f1f1' }}></div>

                  <div style={{ padding: '8px 14px', fontWeight: 700, color: '#111' }}>Mes listes</div>
                  <div style={{ padding: '0 8px 8px 8px' }}>
                    <MenuLink to="/listes/envies">Listes d'envies</MenuLink>
                    <MenuLink to="/listes/cadeaux">Listes cadeaux</MenuLink>
                    <MenuLink to="/listes/categories">Listes par catégorie</MenuLink>
                    <MenuLink to="/listes/sauvegardes">Articles sauvegardés pour plus tard</MenuLink>
                  </div>

                  <div style={{ height: 1, background: '#f1f1f1' }}></div>

                  <div style={{ padding: '8px 14px', fontWeight: 700, color: '#111' }}>Abonnements et programmes</div>
                  <div style={{ padding: '0 8px 12px 8px' }}>
                    <MenuLink to="/cartes-cadeaux/gestion">Gestion des cartes-cadeaux et crédits</MenuLink>
                  </div>

                  <div style={{ height: 1, background: '#f1f1f1' }}></div>

                  <div style={{ padding: '8px 14px', fontWeight: 700, color: '#111' }}>Mes avis</div>
                  <div style={{ padding: '0 8px 8px 8px' }}>
                    <MenuLink to="/avis">Mes évaluations et commentaires</MenuLink>
                  </div>

                  <div style={{ height: 1, background: '#f1f1f1' }}></div>

                  <div style={{ padding: '8px 14px', fontWeight: 700, color: '#111' }}>Aide et assistance</div>
                  <div style={{ padding: '0 8px 12px 8px' }}>
                    <MenuLink to="/aide">Centre d'aide</MenuLink>
                    <MenuLink to="/support/contact">Contact service client</MenuLink>
                    <MenuLink to="/faq">FAQ</MenuLink>
                  </div>
                </div>

                {user && (
                  <div style={{ borderTop: '1px solid #eee', padding: '10px 14px' }}>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#e47911', padding: 0, cursor: 'pointer', fontWeight: 600 }}>Se déconnecter</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Retours et Commandes */}
          <Link to="/commandes" style={{ textDecoration: 'none', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '4px 8px' }}>
            <span style={{ fontSize: 11, color: '#ddd' }}>{t('returnsShort')}</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{t('andOrders')}</span>
          </Link>

          {/* Notifications (icône cloche) */}
          <div title="Notifications" style={{ color: '#aab7b8', display: 'flex', alignItems: 'center' }}>
            <i className="bi bi-bell" style={{ fontSize: 18 }}></i>
          </div>

          
          {/* Panier Original (gardé pour compatibilité) */}
          <button
            onClick={() => setShowCartSidebar(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '4px 6px'
            }}
          >
            <div style={{ position: 'relative' }}>
              <i className="bi bi-cart" style={{ fontSize: 20 }}></i>
              <span style={{
                position: 'absolute',
                top: -8,
                right: -10,
                background: '#ffd814',
                color: '#111',
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700
              }}>{cartCount}</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Panier</span>
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
              Cartes cadeau
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
              <i className="bi bi-headset" style={{ fontSize: '14px', color: '#aab7b8' }}></i>
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
