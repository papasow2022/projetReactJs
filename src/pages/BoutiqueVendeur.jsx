import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductsContext';
import { Container, Row, Col, Card, Badge, Button, Modal } from 'react-bootstrap';
import './AmazonStorefront.css';

// Ajoutons des propriétés mock avancées pour la personnalisation
const vendeursMock = [
  {
    id: '1',
    nom: 'Nike Store',
    logo: '/assets/vendeur/accueil.jpg',
    banniere: '/assets/vendeur/accueil3.jpg',
    couleur: '#232f3e',
    theme: {
      accent: '#ff9900',
      fond: '#f6f7fa',
      bouton: '#ffd814',
    },
    banners: [
      '/assets/vendeur/accueil3.jpg',
      '/assets/vendeur/accueil.jpg',
      '/assets/vendeur/veste (2).jpg'
    ],
    coupDeCoeur: {
      titre: 'Coup de cœur du vendeur',
      produitId: 'mock-1',
      texte: 'Notre best-seller du mois, recommandé par l’équipe Nike !'
    },
    instagramFeed: [
      '/assets/vendeur/accueil.jpg',
      '/assets/vendeur/accueil3.jpg',
      '/assets/vendeur/veste (2).jpg'
    ],
    blog: [
      { titre: 'Nouvelle collection été', date: '2024-05-01', contenu: 'Découvrez nos nouveautés pour l’été 2024 !' },
      { titre: 'Conseils running', date: '2024-04-15', contenu: 'Comment bien choisir ses chaussures de course.' }
    ],
    note: 4.8,
    avis: 124,
    pays: 'France',
    membreDepuis: '2019',
    verified: true,
    description: "Boutique officielle Nike. Découvrez nos dernières collections et innovations sportives.",
    produitsPhareIds: ['mock-1'],
    promoIds: [],
    categories: ['Chaussures', 'Vêtements', 'Accessoires'],
    aPropos: "Nike Store est le distributeur officiel de la marque Nike. Nous nous engageons à offrir des produits authentiques, un service client réactif et une expérience d'achat exceptionnelle.",
    engagements: ["Livraison rapide", "Retours gratuits 30j", "Paiement sécurisé", "Service client premium"],
    avisVendeur: [
      { user: 'Fatou', note: 5, commentaire: 'Service impeccable, vendeur très réactif !', date: '2024-04-10' },
      { user: 'Moussa', note: 4, commentaire: 'Livraison rapide, produits conformes.', date: '2024-03-22' }
    ],
    reseaux: {
      facebook: 'https://facebook.com/nike',
      instagram: 'https://instagram.com/nike',
      site: 'https://nike.com'
    }
  },
  {
    id: '2',
    nom: 'Adidas Store',
    logo: '/assets/vendeur/veste (2).jpg',
    banniere: '/assets/vendeur/pantalonArriver (1).jpg',
    couleur: '#008080',
    note: 4.7,
    avis: 98,
    pays: 'Allemagne',
    membreDepuis: '2020',
    verified: false,
    description: "Adidas, la référence du sport et du lifestyle. Produits officiels et exclusivités.",
    produitsPhareIds: ['mock-2'],
    promoIds: [],
    categories: ['Chaussures', 'Sacs', 'Accessoires'],
    aPropos: "Adidas Store propose les dernières innovations et collections Adidas. Notre équipe est à votre écoute pour toute question.",
    engagements: ["Livraison express", "Qualité garantie", "Paiement sécurisé"],
    avisVendeur: [
      { user: 'Yann', note: 5, commentaire: 'Super boutique, produits originaux.', date: '2024-04-01' }
    ],
    reseaux: {
      facebook: 'https://facebook.com/adidas',
      instagram: 'https://instagram.com/adidas',
      site: 'https://adidas.com'
    }
  }
];

const tabs = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'produits', label: 'Produits', submenu: [
    { id: 'chaussures', label: 'Chaussures' },
    { id: 'vetements', label: 'Vêtements' },
    { id: 'accessoires', label: 'Accessoires' }
  ] },
  { id: 'promotions', label: 'Promotions' },
  { id: 'apropos', label: 'À propos' },
  { id: 'faq', label: 'FAQ' },
  { id: 'questions', label: 'Questions' },
  { id: 'contact', label: 'Contact' },
  { id: 'avis', label: 'Avis' }
];

function noteToStars(note) {
  const full = Math.floor(note);
  const half = note % 1 >= 0.5;
  return (
    <span>
      {[...Array(full)].map((_, i) => <i key={i} className="bi bi-star-fill text-warning"></i>)}
      {half && <i className="bi bi-star-half text-warning"></i>}
      {[...Array(5 - full - (half ? 1 : 0))].map((_, i) => <i key={i} className="bi bi-star text-warning"></i>)}
    </span>
  );
}

function MiniProductCard({ prod }) {
  return (
    <Card className="store-product-card flex-shrink-0 position-relative" style={{ width: 220, minWidth: 180, border: '1px solid #eee', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s, transform 0.2s', overflow: 'hidden' }}>
      <div className="position-relative" style={{ overflow: 'hidden' }}>
        <Link to={`/produit/${prod.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card.Img variant="top" src={prod.images?.[0] || '/assets/placeholder.png'} style={{ height: 140, objectFit: 'contain', background: '#f7f7f7', borderTopLeftRadius: 10, borderTopRightRadius: 10, transition: 'transform 0.2s', cursor: 'pointer' }} />
        </Link>
        {/* Badges */}
        <div className="position-absolute top-0 start-0 m-2 d-flex gap-1">
          {prod.isPrime && <Badge bg="primary">Prime</Badge>}
          {prod.promo && <Badge bg="danger">Promo</Badge>}
          {prod.isExclusive && <Badge bg="info">Exclu</Badge>}
        </div>
        {/* Stock */}
        <div className="position-absolute top-0 end-0 m-2">
          {prod.stock > 0 ? <Badge bg="success">En stock</Badge> : <Badge bg="secondary">Rupture</Badge>}
        </div>
      </div>
      <Card.Body>
        <Link to={`/produit/${prod.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card.Title className="fw-bold" style={{ fontSize: 16, cursor: 'pointer' }}>{prod.name}</Card.Title>
        </Link>
        {/* Livraison estimée (mock) */}
        <div className="mb-1" style={{ fontSize: 13, color: '#146eb4' }}>
          <i className="bi bi-truck me-1"></i> {prod.deliveryDate || 'Livraison demain'}
        </div>
        {/* Stock restant */}
        <div className="mb-1" style={{ fontSize: 13, color: prod.stock > 5 ? '#28a745' : prod.stock > 0 ? '#ffc107' : '#dc3545' }}>
          <i className="bi bi-box-seam me-1"></i> Stock : {prod.stock > 0 ? prod.stock : 'Rupture'}
        </div>
        {/* Options (mock) */}
        {prod.sizes && prod.sizes.length > 0 && (
          <div className="mb-1" style={{ fontSize: 13 }}>
            <i className="bi bi-rulers me-1"></i> Tailles : {prod.sizes.slice(0, 3).join(', ')}{prod.sizes.length > 3 ? '…' : ''}
          </div>
        )}
        {prod.colors && prod.colors.length > 0 && (
          <div className="mb-1 d-flex align-items-center" style={{ fontSize: 13 }}>
            <i className="bi bi-palette me-1"></i> Couleurs :
            {prod.colors.slice(0, 3).map((c, i) => (
              <span key={i} style={{ display: 'inline-block', width: 14, height: 14, borderRadius: '50%', background: c.code, border: '1px solid #ccc', marginLeft: 4 }}></span>
            ))}
            {prod.colors.length > 3 && <span>…</span>}
          </div>
        )}
        {/* Mini-avis */}
        <div className="mb-1 d-flex align-items-center" style={{ fontSize: 13 }}>
          {noteToStars(prod.rating)}
          <span className="ms-1">({prod.reviewCount})</span>
        </div>
        {/* Prix */}
        <div className="mb-2">
          <span className="fw-bold text-danger" style={{ fontSize: 15 }}>€{prod.price}</span>
          {prod.originalPrice && (
            <span className="text-muted text-decoration-line-through ms-2">€{prod.originalPrice}</span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

function StoreCarousel({ title, products }) {
  const ref = useRef();
  const [scrollIndex, setScrollIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  // Responsive : ajuste le nombre de produits visibles
  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 600) setVisibleCount(1);
      else if (window.innerWidth < 900) setVisibleCount(2);
      else if (window.innerWidth < 1200) setVisibleCount(3);
      else setVisibleCount(4);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Support swipe/tactile
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let startX = 0;
    let scrollLeft = 0;
    function onTouchStart(e) {
      startX = e.touches[0].pageX;
      scrollLeft = el.scrollLeft;
    }
    function onTouchMove(e) {
      if (e.touches.length > 1) return;
      const dx = e.touches[0].pageX - startX;
      el.scrollLeft = scrollLeft - dx;
    }
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchmove', onTouchMove);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  if (!products || products.length === 0) return null;
  const maxIndex = Math.max(0, products.length - visibleCount);

  // Scroll vers l’index voulu
  const scrollTo = (idx) => {
    setScrollIndex(idx);
    if (ref.current) {
      ref.current.scrollTo({ left: idx * 236, behavior: 'smooth' });
    }
  };

  return (
    <div className="store-carousel mb-4 position-relative" role="region" aria-label={title}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold mb-0">{title}</h5>
      </div>
      {/* Flèches flottantes */}
      {scrollIndex > 0 && (
        <Button size="sm" variant="light" className="carousel-arrow carousel-arrow-left" style={{ position: 'absolute', top: '50%', left: 0, zIndex: 2, transform: 'translateY(-50%)' }} onClick={() => scrollTo(scrollIndex - 1)} aria-label="Précédent">&lt;</Button>
      )}
      {scrollIndex < maxIndex && (
        <Button size="sm" variant="light" className="carousel-arrow carousel-arrow-right" style={{ position: 'absolute', top: '50%', right: 0, zIndex: 2, transform: 'translateY(-50%)' }} onClick={() => scrollTo(scrollIndex + 1)} aria-label="Suivant">&gt;</Button>
      )}
      <div className="d-flex overflow-auto" ref={ref} style={{ gap: 16, scrollBehavior: 'smooth', transition: 'all 0.3s' }}>
        {products.map((prod, idx) => (
          <MiniProductCard key={prod.id} prod={prod} />
        ))}
      </div>
      {/* Pagination */}
      <div className="d-flex justify-content-center mt-2 gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <span key={i} className={`carousel-dot${i === scrollIndex ? ' active' : ''}`} onClick={() => scrollTo(i)} style={{ cursor: 'pointer', width: 12, height: 12, borderRadius: '50%', background: i === scrollIndex ? '#ffd814' : '#e3e6e6', display: 'inline-block' }} aria-label={`Aller à la page ${i + 1}`}></span>
        ))}
      </div>
    </div>
  );
}

function SectionBandeau({ title, color, children, icon }) {
  return (
    <div className="mb-4" style={{ background: color, borderRadius: 12, padding: '18px 24px', color: '#fff', display: 'flex', alignItems: 'center', gap: 18 }}>
      {icon && <i className={`bi ${icon} fs-2`} style={{ opacity: 0.8 }}></i>}
      <div style={{ flex: 1 }}>
        <h4 className="fw-bold mb-1" style={{ color: '#fff' }}>{title}</h4>
        {children}
      </div>
    </div>
  );
}

// Carrousel d’images/bannières animé
function BannerCarousel({ images }) {
  const [idx, setIdx] = useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % images.length), 3500);
    return () => clearInterval(timer);
  }, [images.length]);
  return (
    <div style={{ width: '100%', height: 220, background: `url(${images[idx]}) center/cover`, borderRadius: 16, marginBottom: 24, position: 'relative', transition: 'background 0.5s' }}>
      <div style={{ position: 'absolute', bottom: 10, right: 20, display: 'flex', gap: 6 }}>
        {images.map((_, i) => (
          <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i === idx ? '#ffd814' : '#fff', opacity: 0.8, border: '1px solid #eee', marginLeft: 2, cursor: 'pointer' }} onClick={() => setIdx(i)}></span>
        ))}
      </div>
    </div>
  );
}

// Widget Instagram mock
function InstagramWidget({ images }) {
  return (
    <div className="mb-4" style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <h6 className="fw-bold mb-2"><i className="bi bi-instagram me-2" style={{ color: '#e4405f' }}></i>Instagram</h6>
      <div className="d-flex gap-2 flex-wrap">
        {images.map((img, i) => (
          <img key={i} src={img} alt="insta" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
        ))}
      </div>
    </div>
  );
}

// Widget blog/actualités
function BlogWidget({ posts }) {
  return (
    <div className="mb-4" style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <h6 className="fw-bold mb-2"><i className="bi bi-newspaper me-2" style={{ color: '#146eb4' }}></i>Actualités</h6>
      {posts.map((post, i) => (
        <div key={i} className="mb-3">
          <div className="fw-bold">{post.titre}</div>
          <div className="text-muted" style={{ fontSize: 12 }}>{post.date}</div>
          <div style={{ fontSize: 14 }}>{post.contenu}</div>
        </div>
      ))}
    </div>
  );
}

// Widget Coup de cœur
function CoupDeCoeurWidget({ produit, texte }) {
  if (!produit) return null;
  return (
    <div className="mb-4" style={{ background: '#fffbe6', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 18 }}>
      <div style={{ flex: 1 }}>
        <h6 className="fw-bold mb-2" style={{ color: '#ff9900' }}><i className="bi bi-star-fill me-2"></i>Coup de cœur du vendeur</h6>
        <div style={{ fontSize: 15 }}>{texte}</div>
      </div>
      <MiniProductCard prod={produit} />
    </div>
  );
}

export default function BoutiqueVendeur() {
  const { t } = useLanguage();
  const { vendeurId } = useParams();
  const { allProducts } = useProducts();
  const [tab, setTab] = useState('accueil');
  const [showContact, setShowContact] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const vendeur = vendeursMock.find(v => v.id === vendeurId);
  if (!vendeur) return <div className="text-center py-5">Boutique introuvable.</div>;
  // Couleur par défaut persistante
  const DEFAULT_THEME = { accent: '#2563eb', fond: '#f6f7fa', bouton: '#ffd814', font: 'Arial' };
  // Initialisation du thème depuis localStorage ou valeur par défaut
  const [customTheme, setCustomTheme] = useState(() => {
    const saved = localStorage.getItem('boutiqueTheme');
    if (saved) return JSON.parse(saved);
    return { ...DEFAULT_THEME, ...vendeur.theme };
  });
  // Persistance du thème à chaque changement
  useEffect(() => {
    localStorage.setItem('boutiqueTheme', JSON.stringify(customTheme));
  }, [customTheme]);
  const sectionsRef = {
    accueil: useRef(),
    produits: useRef(),
    promotions: useRef(),
    apropos: useRef(),
    faq: useRef(),
    questions: useRef(),
    contact: useRef(),
    avis: useRef()
  };
  // Filtrage produits
  const produitsVendeur = allProducts.filter(p => p.sellerId === vendeurId || p.seller?.name === vendeur.nom);
  const produitsPhare = produitsVendeur.filter(p => vendeur.produitsPhareIds?.includes(p.id));
  const produitsPromo = produitsVendeur.filter(p => vendeur.promoIds?.includes(p.id));
  const produitsParCategorie = vendeur.categories?.map(cat => ({
    cat,
    produits: produitsVendeur.filter(p => p.category === cat)
  })) || [];

  // Section dynamique : Meilleures ventes
  const meilleuresVentes = [...produitsVendeur].sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 5);
  // Section dynamique : Nouveautés (par id décroissant ou date d'ajout si dispo)
  const nouveautes = [...produitsVendeur].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5);
  // Section dynamique : Promotions
  const promotions = produitsVendeur.filter(p => p.promo);
  // Section dynamique : Collections par catégorie
  const collectionsParCategorie = produitsParCategorie.filter(c => c.produits.length > 0);
  // Section dynamique : Produits sponsorisés (publicité interne)
  const produitsSponsorisés = produitsVendeur.filter(p => p.isSponsored);

  // Mock Q/R
  const [questions, setQuestions] = useState([
    { user: 'Alice', question: 'Ce produit est-il garanti ?', reponse: 'Oui, garantie 2 ans.' },
    { user: 'Bob', question: 'Livrez-vous à l’international ?', reponse: 'Oui, livraison dans toute l’Europe.' }
  ]);
  const [newQuestion, setNewQuestion] = useState('');
  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      setQuestions(qs => [...qs, { user: 'Vous', question: newQuestion, reponse: null }]);
      setNewQuestion('');
    }
  };

  // Dans le composant BoutiqueVendeur, détecter si mobile
  const isMobile = window.innerWidth < 900;

  // Scroll fluide vers section
  const handleTabClick = (id) => {
    setTab(id);
    setTimeout(() => {
      sectionsRef[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Suivre vendeur (mock)
  const handleFollow = () => {
    setIsFollowing(f => !f);
  };

  // Envoi du formulaire de contact (mock)
  const handleContactSend = (e) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setShowContact(false);
      setContactSent(false);
    }, 1500);
  };

  // Dans le composant principal, avant le menu/banner Amazon, appliquer le thème
  const theme = vendeur.theme || { accent: '#ffd814', fond: '#f6f7fa', bouton: '#ffd814' };

  return (
    <div
      className="amazon-storefront-bg"
      style={{
        background: customTheme.fond,
        fontFamily: customTheme.font,
        minHeight: '100vh',
        transition: 'background 0.3s, font-family 0.3s'
      }}
    >
      {/* Bannière Amazon sticky */}
      <BannerCarousel images={vendeur.banners || [vendeur.banniere]} />
      {/* Bouton personnalisation */}
      <div className="container d-flex justify-content-end mt-2">
        <button
          className="btn"
          style={{
            background: customTheme.bouton,
            color: '#232f3e',
            border: 'none',
            fontWeight: 600
          }}
          onClick={() => setShowThemePanel(true)}
        >
          <i className="bi bi-palette me-2"></i>Personnaliser la boutique
        </button>
      </div>
      {/* Panneau latéral de personnalisation (mock) */}
      {showThemePanel && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: 340, height: '100vh', background: '#fff', boxShadow: '-2px 0 12px rgba(0,0,0,0.08)', zIndex: 2000, padding: 24 }}>
          <h5>Personnalisation de la boutique</h5>
          <div className="mb-3">
            <label>Couleur principale</label>
            <input type="color" value={customTheme.accent} onChange={e => setCustomTheme({ ...customTheme, accent: e.target.value })} className="form-control form-control-color" />
          </div>
          <div className="mb-3">
            <label>Couleur secondaire</label>
            <input type="color" value={customTheme.fond} onChange={e => setCustomTheme({ ...customTheme, fond: e.target.value })} className="form-control form-control-color" />
          </div>
          <div className="mb-3">
            <label>Couleur bouton</label>
            <input type="color" value={customTheme.bouton} onChange={e => setCustomTheme({ ...customTheme, bouton: e.target.value })} className="form-control form-control-color" />
          </div>
          <div className="mb-3">
            <label>Police</label>
            <select value={customTheme.font} onChange={e => setCustomTheme({ ...customTheme, font: e.target.value })} className="form-select">
              <option value="Arial">Arial</option>
              <option value="Roboto">Roboto</option>
              <option value="Georgia">Georgia</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
            </select>
          </div>
          <button className="btn btn-dark" onClick={() => setShowThemePanel(false)}>Fermer</button>
        </div>
      )}
      {/* Menu horizontal Amazon sticky */}
      <div
        className="amazon-banner-menu sticky-top"
        style={{
          top: 0,
          zIndex: 101,
          background: customTheme.accent,
          color: '#fff',
          transition: 'background 0.3s'
        }}
      >
        <div className="container d-flex gap-4">
          {tabs.map(t => (
            <div key={t.id} style={{ position: 'relative', display: 'inline-block' }}>
              <Button
                variant={tab === t.id ? 'dark' : 'outline-dark'}
                className={`amazon-tab-btn${tab === t.id ? ' active' : ''}${t.submenu ? ' has-submenu' : ''}`}
                onClick={() => handleTabClick(t.id)}
                style={{
                  minWidth: 90,
                  background: tab === t.id ? customTheme.bouton : 'transparent',
                  color: tab === t.id ? '#232f3e' : '#fff',
                  border: tab === t.id ? 'none' : '1px solid #fff',
                  fontWeight: 600
                }}
                aria-label={t.label}
              >
                {t.label}
                {/* Sous-menu mock */}
                {t.submenu && (
                  <div className="submenu">
                    {t.submenu.map(sub => (
                      <div key={sub.id}>{sub.label}</div>
                    ))}
                  </div>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Sections dynamiques */}
      <div className="container" style={{ marginTop: 24 }}>
        {/* Exemple d'application de la couleur principale sur les titres */}
        {tab === 'accueil' && <h1 style={{ color: customTheme.accent, fontWeight: 700 }}>{t("welcome_to_store")}</h1>}
        {produitsSponsorisés.length > 0 && <StoreCarousel title={t("sponsored_products")} products={produitsSponsorisés} />}
        {tab === 'accueil' && <>
          {meilleuresVentes.length > 0 && <StoreCarousel title={t("best_sellers")} products={meilleuresVentes} />}
          {nouveautes.length > 0 && <StoreCarousel title={t("new_arrivals")} products={nouveautes} />}
          {promotions.length > 0 && <StoreCarousel title={t("promotions")} products={promotions} />}
          {collectionsParCategorie.map(col => (
            <StoreCarousel key={col.cat} title={col.cat} products={col.produits} />
          ))}
        </>}
        {tab === 'apropos' && <SectionBandeau title={t("our_story")}
          color={theme.accent}>
          <div>{t("our_story_content")}</div>
          <div className="mt-4">
            <h6>{t("seller_commitments")}</h6>
            <ul>
              {vendeur.engagements?.map((e, i) => <li key={i}>{t(e)}</li>)}
            </ul>
            <div className="d-flex gap-2 mt-2">
              <span className="badge bg-success">{t("certified_authentic")}</span>
              <span className="badge bg-info">{t("quality_label")}</span>
              <span className="badge bg-warning text-dark">{t("money_back_guarantee")}</span>
            </div>
          </div>
        </SectionBandeau>}
        {tab === 'faq' && (
          <SectionBandeau title="FAQ" color={theme.accent}>
            <ul style={{ fontSize: 17, lineHeight: 1.7 }}>
              <li><b>Quels sont les délais de livraison ?</b> 24-48h en France, 3-5j en Europe.</li>
              <li><b>Puis-je retourner un produit ?</b> Oui, sous 30 jours après réception.</li>
              <li><b>Comment contacter le service client ?</b> Via l’onglet Contact ou par email.</li>
              <li><b>Les produits sont-ils garantis ?</b> Oui, tous nos produits bénéficient d’une garantie de 2 ans.</li>
              <li><b>Quels moyens de paiement acceptez-vous ?</b> Carte bancaire, PayPal, virement.</li>
            </ul>
          </SectionBandeau>
        )}
        {tab === 'contact' && <SectionBandeau title="Contact" color={theme.accent}><div>Formulaire de contact (à personnaliser par le vendeur).</div></SectionBandeau>}
        {tab === 'questions' && (
          <SectionBandeau title="Questions / Réponses" color={theme.accent}>
            <div>
              <form onSubmit={handleAskQuestion} className="mb-3">
                <label>Posez votre question au vendeur :</label>
                <div className="d-flex gap-2">
                  <input type="text" value={newQuestion} onChange={e => setNewQuestion(e.target.value)} className="form-control" placeholder="Votre question..." />
                  <button type="submit" className="btn btn-dark">Envoyer</button>
                </div>
              </form>
              <div>
                {questions.map((q, i) => (
                  <div key={i} className="mb-2 p-2 bg-white rounded shadow-sm" style={{ border: `2px solid ${customTheme.accent}` }}>
                    <b>{q.user} :</b> {q.question}
                    {q.reponse && <div className="text-success mt-1"><i className="bi bi-arrow-return-right me-1"></i>{q.reponse}</div>}
                  </div>
                ))}
              </div>
            </div>
          </SectionBandeau>
        )}
      </div>
      <Container className="py-4">
        <Row>
          {/* Sidebar vendeur enrichie à gauche */}
          <Col md={3} className={`mb-4${isMobile ? ' sidebar-mobile' : ''}`}>
            <Card className="amazon-sidebar-card mb-4 p-3" style={{ borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} role="complementary" aria-label="Informations vendeur">
              <Card.Body className="text-center">
                <img src={vendeur.logo} alt={vendeur.nom} style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', marginBottom: 12, border: '2px solid #ffd814' }} />
                <h5 className="fw-bold mb-2">{vendeur.nom}</h5>
                <div className="mb-2">{noteToStars(vendeur.note)} <span className="ms-1">({vendeur.avis})</span></div>
                <div className="mb-2 text-muted" style={{ fontSize: 14 }}>Membre depuis {vendeur.membreDepuis}</div>
                {/* Badges dynamiques */}
                <div className="mb-2">
                  {vendeur.verified && <Badge bg="info" className="me-1">Vendeur vérifié</Badge>}
                  {vendeur.engagements?.includes('Livraison express') && <Badge bg="success" className="me-1">Livraison express</Badge>}
                  {vendeur.engagements?.includes('Top vendeur') && <Badge bg="warning" className="me-1">Top vendeur</Badge>}
                </div>
                {/* Bouton suivre interactif */}
                <Button variant={isFollowing ? 'secondary' : 'outline-dark'} className="w-100 fw-bold mb-2" onClick={handleFollow} aria-label={isFollowing ? 'Ne plus suivre ce vendeur' : 'Suivre ce vendeur'} tabIndex={0}>
                  {isFollowing ? 'Suivi ✓' : 'Suivre'}
                </Button>
                <Button variant="warning" className="w-100 fw-bold" onClick={() => setShowContact(true)} aria-label="Contacter le vendeur" tabIndex={0}>Contacter</Button>
              </Card.Body>
            </Card>
            {/* Engagements / Avantages visuels */}
            <Card className="mb-4" style={{ borderRadius: 14 }}>
              <Card.Body>
                <h6 className="fw-bold mb-2">Pourquoi acheter ici ?</h6>
                <ul className="mb-0" style={{ fontSize: 15, listStyle: 'none', paddingLeft: 0 }}>
                  {vendeur.engagements?.map((e, i) => (
                    <li key={i} className="d-flex align-items-center mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i> {e}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
            {/* Réseaux sociaux stylisés */}
            <Card style={{ borderRadius: 14 }}>
              <Card.Body className="text-center">
                <h6 className="fw-bold mb-2">Réseaux</h6>
                {vendeur.reseaux?.facebook && <a href={vendeur.reseaux.facebook} target="_blank" rel="noopener noreferrer" className="me-2" aria-label="Facebook"><i className="bi bi-facebook fs-4" style={{ color: '#1877f3' }}></i></a>}
                {vendeur.reseaux?.instagram && <a href={vendeur.reseaux.instagram} target="_blank" rel="noopener noreferrer" className="me-2" aria-label="Instagram"><i className="bi bi-instagram fs-4" style={{ color: '#e4405f' }}></i></a>}
                {vendeur.reseaux?.site && <a href={vendeur.reseaux.site} target="_blank" rel="noopener noreferrer" className="me-2" aria-label="Site officiel"><i className="bi bi-globe fs-4" style={{ color: '#146eb4' }}></i></a>}
              </Card.Body>
            </Card>
            {/* Widget Instagram */}
            <InstagramWidget images={vendeur.instagramFeed || []} />
            {/* Widget Blog */}
            <BlogWidget posts={vendeur.blog || []} />
          </Col>
          {/* Contenu principal par section (scroll fluide) */}
          <Col md={9}>
            <section ref={sectionsRef.accueil} className="mb-5">
              {tab === 'accueil' && <>
                {/* Offres du moment */}
                <SectionBandeau title="Offres du moment" color="#ff9900" icon="bi-lightning-charge-fill">
                  <div className="d-flex flex-wrap gap-3">
                    {produitsPromo.length === 0 ? <span>Aucune offre en cours.</span> : produitsPromo.slice(0, 3).map(prod => (
                      <MiniProductCard key={prod.id} prod={prod} />
                    ))}
                  </div>
                </SectionBandeau>
                {/* Nouveautés */}
                <SectionBandeau title="Nouveautés" color="#146eb4" icon="bi-stars">
                  <div className="d-flex flex-wrap gap-3">
                    {produitsVendeur.filter(p => p.isNew).length === 0 ? <span>Aucune nouveauté.</span> : produitsVendeur.filter(p => p.isNew).slice(0, 3).map(prod => (
                      <MiniProductCard key={prod.id} prod={prod} />
                    ))}
                  </div>
                </SectionBandeau>
                {/* Collections (mock) */}
                <SectionBandeau title="Collections" color="#232f3e" icon="bi-collection">
                  <div className="d-flex flex-wrap gap-3">
                    {vendeur.categories?.map(cat => (
                      <Card key={cat} className="text-center" style={{ width: 140, minWidth: 140, background: '#fff', color: '#232f3e', border: '1px solid #eee', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <Card.Body>
                          <i className="bi bi-box-seam fs-2 mb-2" style={{ color: '#146eb4' }}></i>
                          <div className="fw-bold mb-1">{cat}</div>
                          <div style={{ fontSize: 13 }}>Voir la collection</div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </SectionBandeau>
                {/* Recommandations (mock, produits aléatoires) */}
                <SectionBandeau title="Recommandé pour vous" color="#ffd814" icon="bi-hand-thumbs-up-fill">
                  <div className="d-flex flex-wrap gap-3">
                    {produitsVendeur.slice(0, 3).map(prod => (
                      <MiniProductCard key={prod.id} prod={prod} />
                    ))}
                  </div>
                </SectionBandeau>
                {/* Widget Nos engagements */}
                <SectionBandeau title="Nos engagements" color="#00b894" icon="bi-shield-check">
                  <ul className="mb-0" style={{ fontSize: 15, color: '#fff', listStyle: 'none', paddingLeft: 0 }}>
                    {vendeur.engagements?.map((e, i) => (
                      <li key={i} className="d-flex align-items-center mb-2">
                        <i className="bi bi-check-circle-fill me-2"></i> {e}
                      </li>
                    ))}
                  </ul>
                </SectionBandeau>
                {/* Carrousels principaux */}
                <StoreCarousel title="Meilleures ventes" products={produitsPhare} />
                <StoreCarousel title="Promotions" products={produitsPromo} />
                <StoreCarousel title="Tous les produits" products={produitsVendeur} />
                {/* Widget Coup de cœur */}
                <CoupDeCoeurWidget produit={produitsVendeur.find(p => p.id === vendeur.coupDeCoeur?.produitId)} texte={vendeur.coupDeCoeur?.texte} />
              </>}
            </section>
            <section ref={sectionsRef.produits} className="mb-5">
              {tab === 'produits' && <>
                {vendeur.categories?.map(cat => (
                  <div key={cat} className="mb-4">
                    <h5 className="fw-bold mb-3">{cat}</h5>
                    <div className="d-flex flex-wrap gap-3">
                      {produitsVendeur.filter(p => p.category === cat).length === 0 ? <div className="text-muted">Aucun produit</div> : produitsVendeur.filter(p => p.category === cat).map(prod => (
                        <MiniProductCard key={prod.id} prod={prod} />
                      ))}
                    </div>
                  </div>
                ))}
              </>}
            </section>
            <section ref={sectionsRef.promotions} className="mb-5">
              {tab === 'promotions' && <StoreCarousel title="Promotions" products={produitsPromo} />}
            </section>
            <section ref={sectionsRef.apropos} className="mb-5">
              {tab === 'apropos' && <Card className="mb-4"><Card.Body><h5 className="fw-bold mb-2">À propos du vendeur</h5><div style={{ fontSize: 15 }}>{vendeur.aPropos}</div></Card.Body></Card>}
            </section>
            <section ref={sectionsRef.avis} className="mb-5">
              {tab === 'avis' && <Card className="mb-4"><Card.Body><h5 className="fw-bold mb-2">Avis sur le vendeur</h5>{vendeur.avisVendeur?.map((avis, i) => (<div key={i} className="mb-3 border-bottom pb-2"><div className="fw-bold">{avis.user} <span className="ms-2">{noteToStars(avis.note)}</span></div><div style={{ fontSize: 14 }}>{avis.commentaire}</div><div className="text-muted" style={{ fontSize: 12 }}>{avis.date}</div></div>))}</Card.Body></Card>}
            </section>
          </Col>
        </Row>
      </Container>
      {/* Modal contact vendeur amélioré */}
      <Modal show={showContact} onHide={() => { setShowContact(false); setContactSent(false); }} centered>
        <Modal.Header closeButton><Modal.Title>Contacter le vendeur</Modal.Title></Modal.Header>
        <Modal.Body>
          {contactSent ? (
            <div className="text-center py-4">
              <i className="bi bi-check-circle-fill text-success fs-1 mb-2"></i>
              <div className="fw-bold mb-2">Message envoyé !</div>
              <div>Le vendeur vous répondra bientôt.</div>
            </div>
          ) : (
            <form onSubmit={handleContactSend}>
              <div className="mb-3">
                <label className="form-label">Votre email</label>
                <input type="email" className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Votre message</label>
                <textarea className="form-control" rows={4} required></textarea>
              </div>
              <Button variant="warning" type="submit" className="w-100 fw-bold" aria-label="Envoyer le message">Envoyer</Button>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
} 