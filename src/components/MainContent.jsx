// src/components/MainContent.jsx
import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

// Fallback bannière si l’API ne répond pas
const defaultBanners = [
  { image: "/assets/images/banner1.jpg", title: "kitchen_essentials", subtitle: "under_50", i18n: true },
  { image: "/assets/images/banner2.jpg", title: "sneakers_collection", subtitle: "spring_new_2025", i18n: true },
  { image: "/assets/images/banner3.jpg", title: "special_offers", subtitle: "up_to_40_off", i18n: true },
];

function filenameToTitle(pathOrAlt) {
  const base = (pathOrAlt || "").split("/").pop() || pathOrAlt || "";
  const noExt = base.replace(/\.(jpg|jpeg|png|webp)$/i, "");
  return noExt.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

// Titres pour chaque bloc (utiliser des clés universelles)
const blocs = [
  "trendy_shoes_for_all",
  "stylish_pants_for_every_occasion",
  "elegant_jackets_for_all_seasons",
  "accessories_that_complete_your_style",
  "Electronique",
  "produitsMontre" // Ajouté ici
];

// Images du dossier public/assets/chaussure
const imageNames = [
  "accueil.jpg",
  "accueil2.jpg",
  "accueil3.jpg",
  "chaussureArriver (2).jpg"
];

// Base centralisée de tous les produits
const allProducts = [
  // Chaussures Homme
  {
    id: 'nike-air-max-270-blanc',
    name: 'Nike Air Max 270',
    image: '/assets/categorie/chaussures/nike-air-max.png',
    price: 1200000,
    category: 'chaussures',
    subcategory: 'homme',
    nom: 'Homme',
  },
  {
    id: 'nike-air-jordan-1-blanc',
    name: 'Nike Air Jordan 1',
    image: '/assets/categorie/chaussures/chaussure1.png',
    price: 1250000,
    category: 'chaussures',
    subcategory: 'homme',
    nom: 'Homme',
  },
  // Chaussures Femme
  {
    id: 'nike-dunk-low-blanc',
    name: 'Nike Dunk Low',
    image: '/assets/categorie/chaussures/puma-rs-x.png',
    price: 1350000,
    category: 'chaussures',
    subcategory: 'homme',
    nom: 'Homme',
  },
  {
    id: 'nike-zoom-fly-4-blanc',
    name: 'Nike Zoom Fly 4',
    image: '/assets/categorie/chaussures/new-balance.png',
    price: 1150000,
    category: 'chaussures',
    subcategory: 'homme',
    nom: 'Homme',
  },
  // Chaussures Enfant
  {
    id: 'puma-rs-x-blanc',
    name: 'Puma RS-X',
    image: '/assets/categorie/chaussures/puma-rs-x.png',
    price: 950000,
    category: 'chaussures',
    subcategory: 'homme',
    nom: 'Homme',
  },
  {
    id: 'balenciaga-defender-blanc',
    name: 'Balenciaga Defender',
    image: '/assets/categorie/chaussures/chaussure1.png',
    price: 850000,
    category: 'chaussures',
    subcategory: 'homme',
    nom: 'Homme',
  },
  // Chaussures Bébé
  {
    id: 'balenciaga-speed-blanc',
    name: 'Balenciaga Speed',
    image: '/assets/categorie/chaussures/new-balance.png',
    price: 800000,
    category: 'chaussures',
    subcategory: 'homme',
    nom: 'Homme',
  },
  {
    id: 'balenciaga-track-blanc',
    name: 'Balenciaga Track',
    image: '/assets/categorie/chaussures/nike-air-max.png',
    price: 650000,
    category: 'chaussures',
    subcategory: 'homme',
    nom: 'Homme',
  },
  // Ajoute ici les autres produits (pantalons, montres, etc.)
];

// Bloc Chaussures tendance pour tous : on filtre sur la catégorie et on garde seulement les 4 premiers produits
const produitsChaussures = allProducts.filter(p => p.category === 'chaussures').slice(0, 4);

// Sous-catégories de chaussures (non utilisées car on a limité à 4 produits)

// Produits pour le bloc "Pantalons stylés pour chaque occasion" - limité à 4 produits
const produitsPantalons = [
  // Pantalons Homme
  {
    id: "levis-501-jeans",
    image: "/assets/categorie/chaussures/nike-air-max.png",
    nom: "levis_501_jeans",
    prix: "89.99 €",
    category: "pants",
    subcategory: "homme"
  },
  {
    id: "calvin-klein-chinos",
    image: "/assets/categorie/chaussures/chaussure1.png",
    nom: "calvin_klein_chinos",
    prix: "69.99 €",
    category: "pants",
    subcategory: "homme"
  },
  // Pantalons Femme
  {
    id: "tommy-hilfiger-cargo",
    image: "/assets/categorie/chaussures/puma-rs-x.png",
    nom: "tommy_hilfiger_cargo",
    prix: "79.99 €",
    category: "pants",
    subcategory: "femme"
  },
  {
    id: "gap-slim-fit",
    image: "/assets/categorie/chaussures/new-balance.png",
    nom: "gap_slim_fit",
    prix: "59.99 €",
    category: "pants",
    subcategory: "femme"
  }
  // Les autres pantalons ont été supprimés pour ne garder que 4 produits
];

// Sous-catégories de pantalons (non utilisées car on a limité à 4 produits)

// Produits pour "Vestes élégantes pour toutes saisons" - limité à 4 produits
const produitsVestes = [
  // Vestes Homme
  {
    id: "north-face-jacket",
    image: "/assets/categorie/vestes/veste1.png",
    nom: "north_face_jacket",
    prix: "199.99 €",
    category: "jackets",
    subcategory: "homme"
  },
  {
    id: "columbia-omni-heat",
    image: "/assets/categorie/vestes/veste1 - Copie.png",
    nom: "columbia_omni_heat",
    prix: "159.99 €",
    category: "jackets",
    subcategory: "homme"
  },
  // Vestes Femme
  {
    id: "patagonia-down",
    image: "/assets/categorie/vestes/veste1 - Copie (2).png",
    nom: "patagonia_down_jacket",
    prix: "229.99 €",
    category: "jackets",
    subcategory: "femme"
  },
  {
    id: "canada-goose-parka",
    image: "/assets/categorie/vestes/veste1 - Copie (3).png",
    nom: "canada_goose_parka",
    prix: "899.99 €",
    category: "jackets",
    subcategory: "femme"
  }
  // Les autres vestes ont été supprimées pour ne garder que 4 produits
];

// Sous-catégories de vestes (non utilisées car on a limité à 4 produits)

// Produits pour le bloc "Accessoires qui complètent votre style"
const produitsAccessoires = [
  {
    id: "louis-vuitton-bag",
    image: "/assets/categorie/accessoires/arriver (2).png",
    nom: "louis_vuitton_bag",
    prix: "1299.99 €",
    category: "accessories"
  },
  {
    id: "gucci-belt",
    image: "/assets/categorie/accessoires/arriver (2) - Copie.png",
    nom: "gucci_belt",
    prix: "299.99 €",
    category: "accessories"
  },
  {
    id: "ray-ban-sunglasses",
    image: "/assets/categorie/accessoires/arriver (3) - Copie.png",
    nom: "ray_ban_sunglasses",
    prix: "159.99 €",
    category: "accessories"
  },
  {
    id: "rolex-watch",
    image: "/assets/categorie/accessoires/arriver (4) - Copie.png",
    nom: "rolex_watch",
    prix: "8999.99 €",
    category: "accessories"
  },
];

//Produits pour le bloc "Montre de luxe"

const produitsMontre = [
  {
    id: "louis-vuitton-bag",
    image: "/assets/categorie/montres/montre1.png",
    nom: "louis_vuitton_bag",
    prix: "1299.99 GNF",
    category: "Montre"
  },
  {
    id: "gucci-belt",
    image: "/assets/categorie/montres/montre1 - Copie.png",
    nom: "gucci_belt",
    prix: "299.99 GNF",
    category: "Montre"
  },
  {
    id: "ray-ban-sunglasses",
    image: "/assets/categorie/montres/montre1 - Copie (2).png",
    nom: "ray_ban_sunglasses",
    prix: "159.99 GNF",
    category: "Montre"
  },
  {
    id: "rolex-watch",
    image: "/assets/categorie/montres/montre1 - Copie (3).png",
    nom: "rolex_watch",
    prix: "8999.99 GNF",
    category: "Montre"
  },
];

// Produits pour le bloc "Electronique"
const produitsOffres = [
  {
    id: "nike-air-jordan",
    image: "/assets/categorie/electronique/samsung-s23.png",
    nom: "nike_air_jordan",
    prix: "189.99 €",
    category: "shoes",
    discount: "20%"
  },
  {
    id: "adidas-yeezy",
    image: "/assets/categorie/electronique/macbook-air-m2.png",
    nom: "adidas_yeezy",
    prix: "249.99 €",
    category: "shoes",
    discount: "15%"
  },
  {
    id: "supreme-hoodie",
    image: "/assets/categorie/electronique/sony-headphones.png",
    nom: "supreme_hoodie",
    prix: "129.99 €",
    category: "clothing",
    discount: "30%"
  },
  {
    id: "off-white-sneakers",
    image: "/assets/categorie/electronique/samsung-s23.png",
    nom: "off_white_sneakers",
    prix: "899.99 €",
    category: "shoes",
    discount: "10%"
  },
];

// Boutons façon Amazon (inchangé)
function AmazonArrow({ direction, onClick }) {
  return (
    <button
      className="amazon-arrow"
      onClick={onClick}
      aria-label={direction === "left" ? "Précédent" : "Suivant"}
      style={{
        position: "absolute",
        top: "50%",
        [direction === "left" ? "left" : "right"]: 12,
        zIndex: 2,
        transform: "translateY(-50%)",
        background: "#fff",
        border: "none",
        borderRadius: "50%",
        width: 38,
        height: 38,
        boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s",
        opacity: 0.95,
        cursor: "pointer",
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = "#f3f3f3")}
      onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#232f3e"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: "block" }}
      >
        {direction === "left" ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 6 15 12 9 18" />
        )}
      </svg>
    </button>
  );
}

export default function MainContent() {
  const { t } = useLanguage();
  const sliderRef = useRef(null);
  const [hoveredBrand, setHoveredBrand] = useState(null);
  const [banners, setBanners] = useState(defaultBanners);
  const [produitsChaussures, setProduitsChaussures] = useState(allProducts.filter(p => p.category === 'chaussures').slice(0, 4));

  useEffect(() => {
    let aborted = false;
    async function fetchCarousel() {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const res = await fetch(`${baseUrl}/api/carousel?limit=10`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (aborted) return;
        const items = Array.isArray(data.items) ? data.items : [];
        if (items.length > 0) {
          setBanners(items.map((it) => ({
            image: it.path,
            title: filenameToTitle(it.alt || it.path),
            subtitle: "",
            alt: it.alt || filenameToTitle(it.path),
            i18n: false,
          })));
        }
      } catch (e) {
        // garder les defaults en fallback
        console.warn('Carousel API fallback:', e.message);
      }
    }
    fetchCarousel();
    return () => { aborted = true; };
  }, []);

  // Charger des images aléatoires pour le bloc chaussures (homme + femme + enfant)
  useEffect(() => {
    let aborted = false;
    async function fetchImages() {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        
        // Récupérer l'image homme
        const hommeRes = await fetch(`${baseUrl}/api/homme/random`);
        if (!hommeRes.ok) throw new Error(`HTTP ${hommeRes.status}`);
        const hommeData = await hommeRes.json();
        
        if (aborted) return;
        
        // Récupérer l'image enfant
        const enfantRes = await fetch(`${baseUrl}/api/enfant/random`);
        if (!enfantRes.ok) throw new Error(`HTTP ${enfantRes.status}`);
        const enfantData = await enfantRes.json();
        
        if (aborted) return;
        
        // Images femme disponibles (sélection aléatoire)
        const femmeImages = [
          '/chaussures/femme/CritianlouboutinNoire/Christian Louboutin Escarpins.jpeg',
          '/chaussures/femme/Gucci/Designer High Heel Sandals _ Block Heel Sandals   _ GUCCI® International.jpeg',
          '/chaussures/femme/Jonak/Chaussures Femme tendance _ Jonak.jpeg',
          '/chaussures/femme/Mango/Mango Strappy Sandals - Nude.jpeg',
          '/chaussures/femme/Minelli/Minelli Escarpins - Noir.jpeg',
          '/chaussures/femme/PradaBeige/Prada Ankle Strap Platform Sandals - Beige.jpeg',
          '/chaussures/femme/Zaranoire/Zara Classic Heels - Noir.jpeg'
        ];
        
        const randomFemmeImage = femmeImages[Math.floor(Math.random() * femmeImages.length)];
        
        // Créer trois produits : homme, femme et enfant
        setProduitsChaussures([
          {
            id: 'homme-random',
            image: hommeData.path,
            nom: hommeData.model || 'Chaussure tendance',
            prix: 'Prix sur demande',
            category: 'chaussures',
            subcategory: 'homme',
            brand: hommeData.brand || '',
            color: hommeData.color || ''
          },
          {
            id: 'femme-random',
            image: randomFemmeImage,
            nom: 'La Femme',
            prix: 'Prix sur demande',
            category: 'chaussures',
            subcategory: 'femme',
            brand: 'Collection Femme',
            color: ''
          },
          {
            id: 'enfant-random',
            image: enfantData.path,
            nom: 'Homme-Enfant',
            prix: 'Prix sur demande',
            category: 'chaussures',
            subcategory: 'enfant',
            brand: enfantData.brand || '',
            color: enfantData.color || ''
          }
        ]);
      } catch (e) {
        // Fallback sur les produits par défaut
        console.warn('Images API fallback:', e.message);
        setProduitsChaussures(allProducts.filter(p => p.category === 'chaussures').slice(0, 3));
      }
    }
    fetchImages();
    return () => { aborted = true; };
  }, []);

  // Les états pour les sous-catégories ont été supprimés car les boutons ont été retirés

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 1000,
    cssEase: "ease-in-out",
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    // Ajout des options d'accessibilité pour corriger les erreurs
    accessibility: true,
    focusOnSelect: false,
    focusOnChange: false,
    swipeToSlide: true,
    // Désactiver le focus automatique qui cause les conflits
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: true,
        },
      },
    ],
  };

  return (
    <main className="w-100 p-0 m-0" style={{ background: "#f6f6f6" }}>
      {/* Carousel collé au header */}
      <div
        className="w-100 bg-dark position-relative p-0 m-0"
        style={{
          width: "100vw",
          maxWidth: "100vw",
          overflow: "hidden",
          minHeight: 340,
          marginTop: 0,
          paddingTop: 0,
          borderTop: "none",
          background: "none",
        }}
        role="region"
        aria-label="Carrousel de bannières promotionnelles"
      >
        <AmazonArrow
          direction="left"
          onClick={() => sliderRef.current?.slickPrev()}
        />
        <AmazonArrow
          direction="right"
          onClick={() => sliderRef.current?.slickNext()}
        />
        <Slider ref={sliderRef} {...settings}>
          {banners.map((banner, idx) => (
            <div key={idx}>
              <div
                className="d-flex align-items-center justify-content-center p-0 m-0"
                style={{
                  minHeight: 320,
                  height: "40vw",
                  maxHeight: 420,
                  position: "relative",
                  width: "100%",
                  display: "flex",
                  margin: 0,
                  padding: 0,
                  border: "none",
                  backgroundColor: "#0b1f2a",
                }}
                role="tabpanel"
                aria-label={`Slide ${idx + 1}: ${banner.title}`}
                tabIndex={-1}
              >
                <img
                  src={banner.image}
                  alt={banner.alt || banner.title}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    filter: "brightness(0.75)",
                  }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />

                <div
                  className="text-center animate__animated animate__fadeIn"
                  style={{
                    position: "relative",
                    zIndex: 1,
                    background: "rgba(0,0,0,0.35)",
                    borderRadius: 16,
                    padding: "2rem 1.5rem",
                    maxWidth: 600,
                    margin: "0 auto",
                  }}
                >
                  <h1
                    className="fw-bold mb-3"
                    style={{
                      color: "#fff",
                      fontSize: "clamp(1.5rem, 5vw, 3rem)",
                      textShadow: "0 2px 8px rgba(0,0,0,0.25)",
                    }}
                  >
                    {banner.i18n ? t(banner.title) : banner.title}
                  </h1>
                  {Boolean(banner.subtitle) && (
                    <p
                      className="lead mb-0"
                      style={{ color: "#f3f4f6", textShadow: "0 1px 4px rgba(0,0,0,0.25)" }}
                    >
                      {banner.i18n ? t(banner.subtitle) : banner.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Blocs catégories côte à côte, responsive */}
      <div className="d-flex flex-wrap gap-4 py-4 px-3 justify-content-center">
        {blocs.map((titre) => {
          // Les sous-catégories ont été supprimées, on affiche tous les produits de chaque catégorie
          let filteredProducts;
          if (titre === "trendy_shoes_for_all") {
            filteredProducts = produitsChaussures;
          } else if (titre === "elegant_jackets_for_all_seasons") {
            filteredProducts = produitsVestes;
          } else if (titre === "stylish_pants_for_every_occasion") {
            filteredProducts = produitsPantalons;
          } else {
            filteredProducts = titre === "accessories_that_complete_your_style"
              ? produitsAccessoires
              : titre === "Electronique"
                ? produitsOffres
                : titre === "produitsMontre"
                  ? produitsMontre
                  : [];
          }
          
          return (
          <div
            key={titre}
            className="bg-white"
            style={{
              border: "1px solid #e3e6e6",
              borderRadius: 8,
              maxWidth: 450,
              minWidth: 300,
              width: "100%",
              padding: "20px 16px",
              boxShadow: "none",
              flex: "1 1 400px",
            }}
          >
            <h5 className="fw-bold mb-3" style={{ fontSize: 20, textAlign: "left" }}>
            {t(titre)}
          </h5>
            
            <div className="row g-3">
              {filteredProducts.map((prod, pidx) => (
                <div className="col-4 d-flex flex-column align-items-center" key={pidx}>
                  <Link to={`/product/${prod.id}`} state={{ fromHome: true }} style={{ textDecoration: "none", color: "inherit" }}>
                    <div
                      className="bg-light d-flex align-items-center justify-content-center mb-2"
                      style={{
                        width: 130,
                        height: 110,
                        overflow: "hidden",
                        border: "1px solid #e3e6e6",
                        borderRadius: 0,
                        cursor: "pointer",
                        transition: "transform 0.2s ease-in-out",
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                      <img
                        src={prod.image}
                        alt={t(prod.nom) || prod.nom}
                        style={{
                          maxWidth: "90%",
                          maxHeight: "90%",
                          objectFit: "contain",
                        }}
                      />

                    </div>
                    <div className="text-center" style={{ fontSize: 15 }}>
                      <div>
                        {prod.subcategory === 'femme' ? 'La Femme' : 
                         prod.subcategory === 'enfant' ? 'Homme-Enfant' : 'Homme'}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            {/* Le bouton "Voir plus de produits" a été supprimé */}
          </div>
        )})}
      </div>

      {/* Section Marques populaires */}
      <div className="py-5 px-3" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h2 className="fw-bold mb-2" style={{ color: "#232f3e" }}>
                <i className="bi bi-star me-2 text-warning"></i>
                {t('popular_brands')}
              </h2>
              <p className="mb-4" style={{ color: '#6c757d', fontSize: 18 }}>
                {t('popular_brands_subtitle')}
              </p>
              {(() => {
                const brands = [
                  { name: 'NIKE', desc: t('brand_nike_desc'), top: true },
                  { name: 'ADIDAS', desc: t('brand_adidas_desc'), top: true },
                  { name: 'PUMA', desc: t('brand_puma_desc'), top: true },
                  { name: "LEVI'S", desc: t('brand_levis_desc'), top: true },
                  { name: 'TOMMY HILFIGER', desc: t('brand_tommy_desc'), top: true },
                  { name: 'CALVIN KLEIN', desc: t('brand_calvin_desc'), top: true },
                ];
                return (
              <div className="row g-4">
                    {brands.map((brand, idx) => (
                      <div key={brand.name} className="col-md-4 col-12">
                    <div 
                          className="bg-white rounded-3 shadow-sm h-100 d-flex flex-column align-items-center justify-content-center position-relative popular-brand-card"
                      style={{
                            minHeight: 170,
                            border: hoveredBrand === idx ? '2.5px solid #ffc107' : '1px solid #e9ecef',
                            boxShadow: hoveredBrand === idx
                              ? '0 8px 32px rgba(255,193,7,0.18)'
                              : '0 2px 8px rgba(0,0,0,0.07)',
                            transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
                            cursor: 'pointer',
                            zIndex: hoveredBrand === idx ? 2 : 1,
                      }}
                          onMouseEnter={() => setHoveredBrand(idx)}
                          onMouseLeave={() => setHoveredBrand(null)}
                        >
                          <div className="d-flex align-items-center justify-content-center mb-2 w-100">
                            <span
                              className="fw-bold text-uppercase"
                              style={{
                                fontSize: 22,
                                letterSpacing: 1,
                                color: hoveredBrand === idx ? '#ffc107' : '#232f3e',
                                transition: 'color 0.2s',
                              }}
                            >
                              {brand.name}
                            </span>
                            {brand.top && (
                              <span className="badge bg-warning text-white ms-2" style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>TOP</span>
                            )}
                          </div>
                          <div className="mb-2" style={{ color: '#6c757d', fontSize: 15, fontWeight: 500 }}>
                            {brand.desc}
                          </div>
                          {hoveredBrand === idx && (
                            <div>
                              <a href="#" className="fw-bold text-warning text-decoration-none" style={{ fontSize: 15 }}>
                                {t('see_collection')} &rarr;
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
