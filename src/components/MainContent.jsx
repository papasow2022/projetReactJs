// src/components/MainContent.jsx
import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const banners = [
  {
    image: "/assets/images/banner1.jpg",
    title: "kitchen_essentials",
    subtitle: "under_50",
  },
  {
    image: "/assets/images/banner2.jpg",
    title: "sneakers_collection",
    subtitle: "spring_new_2025",
  },
  {
    image: "/assets/images/banner3.jpg",
    title: "special_offers",
    subtitle: "up_to_40_off",
  },
];

// Titres pour chaque bloc (utiliser des clés universelles)
const blocs = [
  "trendy_shoes_for_all",
  "stylish_pants_for_every_occasion",
  "elegant_jackets_for_all_seasons",
  "accessories_that_complete_your_style",
  "current_offers_and_new",
];

// Produits pour le bloc "Chaussures tendance pour tous"
const produitsChaussures = [
  {
    id: "nike-air-max-270",
    image: "/assets/categorie/arriver (1).png",
    nom: "Homme",
    prix: "129.99 €",
    category: "shoes"
  },
  {
    id: "adidas-ultraboost-22",
    image: "/assets/categorie/arriver (2).png",
    nom: "Femme",
    prix: "149.99 €",
    category: "shoes"
  },
  {
    id: "puma-rs-x",
    image: "/assets/categorie/arriver (3).png",
    nom: "Enfant",
    prix: "89.99 €",
    category: "shoes"
  },
  {
    id: "new-balance-574",
    image: "/assets/categorie/arriver (4).png",
    nom: "Bébé",
    prix: "79.99 €",
    category: "shoes"
  },
];

// Produits pour le bloc "Pantalons stylés pour chaque occasion"
const produitsPantalons = [
  {
    id: "levis-501-jeans",
    image: "/assets/categorie/arriver (2).png",
    nom: "levis_501_jeans",
    prix: "89.99 €",
    category: "pants"
  },
  {
    id: "calvin-klein-chinos",
    image: "/assets/categorie/arriver (3).png",
    nom: "calvin_klein_chinos",
    prix: "69.99 €",
    category: "pants"
  },
  {
    id: "tommy-hilfiger-cargo",
    image: "/assets/categorie/arriver (4).png",
    nom: "tommy_hilfiger_cargo",
    prix: "79.99 €",
    category: "pants"
  },
  {
    id: "gap-slim-fit",
    image: "/assets/categorie/arriver (1).png",
    nom: "gap_slim_fit",
    prix: "59.99 €",
    category: "pants"
  },
];

// Produits pour "Vestes élégantes pour toutes saisons"
const produitsVestes = [
  {
    id: "north-face-jacket",
    image: "/assets/categorie/arriver (3).png",
    nom: "north_face_jacket",
    prix: "199.99 €",
    category: "jackets"
  },
  {
    id: "columbia-omni-heat",
    image: "/assets/categorie/arriver (4).png",
    nom: "columbia_omni_heat",
    prix: "159.99 €",
    category: "jackets"
  },
  {
    id: "patagonia-down",
    image: "/assets/categorie/arriver (1).png",
    nom: "patagonia_down_jacket",
    prix: "229.99 €",
    category: "jackets"
  },
  {
    id: "canada-goose-parka",
    image: "/assets/categorie/arriver (2).png",
    nom: "canada_goose_parka",
    prix: "899.99 €",
    category: "jackets"
  },
];

// Produits pour le bloc "Accessoires qui complètent votre style"
const produitsAccessoires = [
  {
    id: "louis-vuitton-bag",
    image: "/assets/categorie/arriver (4).png",
    nom: "louis_vuitton_bag",
    prix: "1299.99 €",
    category: "accessories"
  },
  {
    id: "gucci-belt",
    image: "/assets/categorie/arriver (1).png",
    nom: "gucci_belt",
    prix: "299.99 €",
    category: "accessories"
  },
  {
    id: "ray-ban-sunglasses",
    image: "/assets/categorie/arriver (2).png",
    nom: "ray_ban_sunglasses",
    prix: "159.99 €",
    category: "accessories"
  },
  {
    id: "rolex-watch",
    image: "/assets/categorie/arriver (3).png",
    nom: "rolex_watch",
    prix: "8999.99 €",
    category: "accessories"
  },
];

// Produits pour le bloc "Offres du moment et Nouveautés"
const produitsOffres = [
  {
    id: "nike-air-jordan",
    image: "/assets/categorie/arriver (2).png",
    nom: "nike_air_jordan",
    prix: "189.99 €",
    category: "shoes",
    discount: "20%"
  },
  {
    id: "adidas-yeezy",
    image: "/assets/categorie/arriver (3).png",
    nom: "adidas_yeezy",
    prix: "249.99 €",
    category: "shoes",
    discount: "15%"
  },
  {
    id: "supreme-hoodie",
    image: "/assets/categorie/arriver (4).png",
    nom: "supreme_hoodie",
    prix: "129.99 €",
    category: "clothing",
    discount: "30%"
  },
  {
    id: "off-white-sneakers",
    image: "/assets/categorie/arriver (1).png",
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
                  background: `url(${banner.image}) center/cover no-repeat`,
                  position: "relative",
                  width: "100%",
                  backgroundBlendMode: "darken",
                  backgroundColor: "rgba(30,30,30,0.7)",
                  display: "flex",
                  margin: 0,
                  padding: 0,
                  border: "none",
                }}
              >
                <div
                  className="text-center animate__animated animate__fadeIn"
                  style={{
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
                      fontSize: "clamp(2rem, 5vw, 3.5rem)",
                      textShadow: "0 2px 8px rgba(0,0,0,0.25)",
                    }}
                  >
                    {t(banner.title)}
                  </h1>
                  <p
                    className="lead mb-0"
                    style={{
                      color: "#fff",
                      fontSize: "clamp(1.1rem, 2.5vw, 2rem)",
                      textShadow: "0 1px 4px rgba(0,0,0,0.18)",
                    }}
                  >
                    {t(banner.subtitle)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Blocs catégories côte à côte, responsive */}
      <div className="d-flex flex-wrap gap-4 py-4 px-3">
        {blocs.map((titre) => (
          <div
            key={titre}
            className="bg-white"
            style={{
              border: "1px solid #e3e6e6",
              borderRadius: 8,
              maxWidth: 370,
              minWidth: 260,
              width: "100%",
              padding: "20px 16px",
              boxShadow: "none",
              flex: "1 1 320px",
            }}
          >
            <h5 className="fw-bold mb-3" style={{ fontSize: 20, textAlign: "left" }}>
              {t(titre)}
            </h5>
            <div className="row g-3">
              {(titre === "trendy_shoes_for_all"
                ? produitsChaussures
                : titre === "elegant_jackets_for_all_seasons"
                ? produitsVestes
                : titre === "stylish_pants_for_every_occasion"
                ? produitsPantalons
                : titre === "accessories_that_complete_your_style"
                ? produitsAccessoires
                : titre === "current_offers_and_new"
                ? produitsOffres
                : produits
              ).map((prod, pidx) => (
                <div className="col-6 d-flex flex-column align-items-center" key={pidx}>
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
                      {prod.discount && (
                        <div 
                          className="position-absolute top-0 start-0 bg-danger text-white px-1 py-0"
                          style={{ fontSize: "10px", fontWeight: "bold" }}
                        >
                          {prod.discount}
                        </div>
                      )}
                    </div>
                    <div className="text-center" style={{ fontSize: 15 }}>
                      <div>{t(prod.nom) || prod.nom}</div>
                      <div className="text-secondary" style={{ fontSize: 14 }}>{prod.prix}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <Link 
              to="/catalogue" 
              className="d-block mt-3 text-primary fw-bold" 
              style={{ 
                fontSize: 15, 
                textDecoration: "none",
                transition: "all 0.3s ease",
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #e9ecef"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#e9ecef";
                e.currentTarget.style.transform = "translateX(5px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <i className="bi bi-arrow-right me-1"></i>
              {t('see_more_products')}
            </Link>
          </div>
        ))}
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

      {/* Section "Découvrez notre catalogue complet" */}
      <div className="py-5 px-3" style={{ background: "#f6faff" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h2 className="fw-bold mb-2" style={{ color: "#111" }}>
                <span className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle me-2" style={{ width: 48, height: 48 }}>
                  <i className="bi bi-grid-3x3-gap" style={{ fontSize: 24 }}></i>
                </span>
                Découvrez notre catalogue complet
              </h2>
              <p className="mb-4" style={{ fontSize: 18, color: '#222' }}>
                Explorez plus de <span style={{ color: '#2563eb', fontWeight: 600 }}>5000 produits</span> soigneusement sélectionnés :
                <span style={{ fontWeight: 600 }}> chaussures tendance</span>,
                <span style={{ fontWeight: 600 }}> vêtements stylés</span>,
                <span style={{ fontWeight: 600 }}> accessoires uniques</span> et
                <span style={{ color: '#e11d48', fontWeight: 600 }}> promotions exclusives</span>.
                Trouvez exactement ce que vous cherchez avec nos outils intelligents !
              </p>
              <div className="row g-4 justify-content-center mt-4">
                <div className="col-md-6 col-12 col-lg-3">
                  <div
                    className="h-100 d-flex flex-column align-items-center justify-content-center rounded-4 shadow-sm bg-white position-relative stat-card"
                    style={{
                      minHeight: 180,
                      transition: 'box-shadow 0.2s, transform 0.2s, filter 0.2s',
                      cursor: 'pointer',
                      border: '1.5px solid #f2f2f2',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,99,235,0.10)';
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
                      e.currentTarget.style.filter = 'brightness(1.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.filter = 'none';
                    }}
                  >
                    <i className="bi bi-grid-3x3-gap" style={{ fontSize: 32, color: '#2563eb', marginBottom: 8 }}></i>
                    <div className="fw-bold mb-1" style={{ fontSize: 26, color: '#111' }}>5000+</div>
                    <div className="small" style={{ color: '#444' }}>Produits</div>
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-3">
                  <div
                    className="h-100 d-flex flex-column align-items-center justify-content-center rounded-4 shadow-sm bg-white position-relative stat-card"
                    style={{
                      minHeight: 180,
                      transition: 'box-shadow 0.2s, transform 0.2s, filter 0.2s',
                      cursor: 'pointer',
                      border: '1.5px solid #f2f2f2',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,99,235,0.10)';
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
                      e.currentTarget.style.filter = 'brightness(1.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.filter = 'none';
                    }}
                  >
                    <i className="bi bi-tag" style={{ fontSize: 32, color: '#2563eb', marginBottom: 8 }}></i>
                    <div className="fw-bold mb-1" style={{ fontSize: 26, color: '#111' }}>50+</div>
                    <div className="small" style={{ color: '#444' }}>Marques</div>
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-3">
                  <div
                    className="h-100 d-flex flex-column align-items-center justify-content-center rounded-4 shadow-sm bg-white position-relative stat-card"
                    style={{
                      minHeight: 180,
                      transition: 'box-shadow 0.2s, transform 0.2s, filter 0.2s',
                      cursor: 'pointer',
                      border: '1.5px solid #f2f2f2',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,99,235,0.10)';
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
                      e.currentTarget.style.filter = 'brightness(1.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.filter = 'none';
                    }}
                  >
                    <i className="bi bi-clock-history" style={{ fontSize: 32, color: '#2563eb', marginBottom: 8 }}></i>
                    <div className="fw-bold mb-1" style={{ fontSize: 26, color: '#111' }}>24h</div>
                    <div className="small" style={{ color: '#444' }}>Livraison</div>
                  </div>
                </div>
                <div className="col-md-6 col-12 col-lg-3">
                  <div
                    className="h-100 d-flex flex-column align-items-center justify-content-center rounded-4 shadow-sm bg-white position-relative stat-card"
                    style={{
                      minHeight: 180,
                      transition: 'box-shadow 0.2s, transform 0.2s, filter 0.2s',
                      cursor: 'pointer',
                      border: '1.5px solid #f2f2f2',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,99,235,0.10)';
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
                      e.currentTarget.style.filter = 'brightness(1.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.filter = 'none';
                    }}
                  >
                    <i className="bi bi-star" style={{ fontSize: 32, color: '#2563eb', marginBottom: 8 }}></i>
                    <div className="fw-bold mb-1" style={{ fontSize: 26, color: '#111' }}>4.8/5</div>
                    <div className="small" style={{ color: '#444' }}>Satisfaction</div>
                  </div>
                </div>
              </div>
              <div className="row g-4 justify-content-center mt-2">
                <div className="col-12 col-md-6">
                  <div
                    className="h-100 d-flex flex-column align-items-center justify-content-center rounded-4 shadow-sm bg-white position-relative stat-card"
                    style={{
                      minHeight: 230,
                      transition: 'box-shadow 0.2s, transform 0.2s, filter 0.2s',
                      cursor: 'pointer',
                      border: '1.5px solid #f2f2f2',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,99,235,0.10)';
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
                      e.currentTarget.style.filter = 'brightness(1.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.filter = 'none';
                    }}
                  >
                    <span className="d-inline-flex align-items-center justify-content-center mb-3" style={{ background: 'rgba(37,99,235,0.08)', borderRadius: '50%', width: 64, height: 64 }}>
                      <i className="bi bi-funnel" style={{ fontSize: 36, color: '#2563eb' }}></i>
                    </span>
                    <div className="fw-bold mb-2" style={{ fontSize: 26, color: '#111' }}>Filtres avancés</div>
                    <div className="small" style={{ color: '#444', fontSize: 18 }}>Taille, couleur, marque, prix, style</div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div
                    className="h-100 d-flex flex-column align-items-center justify-content-center rounded-4 shadow-sm bg-white position-relative stat-card"
                    style={{
                      minHeight: 230,
                      transition: 'box-shadow 0.2s, transform 0.2s, filter 0.2s',
                      cursor: 'pointer',
                      border: '1.5px solid #f2f2f2',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(16,185,129,0.10)';
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
                      e.currentTarget.style.filter = 'brightness(1.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.filter = 'none';
                    }}
                  >
                    <span className="d-inline-flex align-items-center justify-content-center mb-3" style={{ background: 'rgba(16,185,129,0.08)', borderRadius: '50%', width: 64, height: 64 }}>
                      <i className="bi bi-search" style={{ fontSize: 36, color: '#10b981' }}></i>
                    </span>
                    <div className="fw-bold mb-2" style={{ fontSize: 26, color: '#111' }}>Recherche intelligente</div>
                    <div className="small" style={{ color: '#444', fontSize: 18 }}>IA pour trouver le produit parfait</div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div
                    className="h-100 d-flex flex-column align-items-center justify-content-center rounded-4 shadow-sm bg-white position-relative stat-card"
                    style={{
                      minHeight: 230,
                      transition: 'box-shadow 0.2s, transform 0.2s, filter 0.2s',
                      cursor: 'pointer',
                      border: '1.5px solid #f2f2f2',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(139,92,246,0.10)';
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
                      e.currentTarget.style.filter = 'brightness(1.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.filter = 'none';
                    }}
                  >
                    <span className="d-inline-flex align-items-center justify-content-center mb-3" style={{ background: 'rgba(139,92,246,0.08)', borderRadius: '50%', width: 64, height: 64 }}>
                      <i className="bi bi-star" style={{ fontSize: 36, color: '#8b5cf6' }}></i>
                    </span>
                    <div className="fw-bold mb-2" style={{ fontSize: 26, color: '#111' }}>Produits recommandés</div>
                    <div className="small" style={{ color: '#444', fontSize: 18 }}>Basé sur vos préférences</div>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div
                    className="h-100 d-flex flex-column align-items-center justify-content-center rounded-4 shadow-sm bg-white position-relative stat-card"
                style={{ 
                      minHeight: 230,
                      transition: 'box-shadow 0.2s, transform 0.2s, filter 0.2s',
                      cursor: 'pointer',
                      border: '1.5px solid #f2f2f2',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(251,191,36,0.10)';
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.04)';
                      e.currentTarget.style.filter = 'brightness(1.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.filter = 'none';
                    }}
                  >
                    <span className="d-inline-flex align-items-center justify-content-center mb-3" style={{ background: 'rgba(251,191,36,0.08)', borderRadius: '50%', width: 64, height: 64 }}>
                      <i className="bi bi-truck" style={{ fontSize: 36, color: '#fbbf24' }}></i>
                    </span>
                    <div className="fw-bold mb-2" style={{ fontSize: 26, color: '#111' }}>Livraison rapide</div>
                    <div className="small" style={{ color: '#444', fontSize: 18 }}>Expédition sous 24h partout</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
