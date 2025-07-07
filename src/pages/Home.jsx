// src/pages/Home.jsx
import React from "react";
import MainContent from "../components/MainContent";  
import Header from "../components/Header";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";
import PopularProducts from "../components/PopularProducts";
import PromotionalBanner from "../components/PromotionalBanner";
import WhyChooseUs from "../components/WhyChooseUs";
import VideoSection from "../components/VideoSection";

export default function Home() {
  return (
    <>
      <Header />
      
      {/* 1. Carousel principal avec bannières */}
      <MainContent />
      
      {/* Bloc IA intelligent */}
      <section className="container my-5">
        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 text-center" style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="d-flex align-items-center justify-content-center mb-2">
            <i className="bi bi-graph-up-arrow text-success me-2" style={{ fontSize: 22 }}></i>
            <span className="badge bg-success bg-opacity-10 text-success fw-semibold px-3 py-2" style={{ fontSize: 16 }}>Nouveauté</span>
          </div>
          <h2 className="fw-bold mb-3" style={{ fontSize: 32 }}>Catalogue intelligent avec IA</h2>
          <p className="mb-4" style={{ fontSize: 18, color: '#222' }}>
            Notre nouvelle technologie d'intelligence artificielle vous aide à trouver les produits parfaits<br />
            selon votre style, votre budget et vos préférences.
          </p>
          <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
            <a href="#catalogue" className="btn btn-primary btn-lg px-4 fw-bold d-flex align-items-center justify-content-center" style={{ fontSize: 18 }}>
              <i className="bi bi-arrow-right me-2"></i> Accéder au catalogue complet
            </a>
            <a href="#ia-shopping" className="btn btn-outline-primary btn-lg px-4 fw-bold d-flex align-items-center justify-content-center" style={{ fontSize: 18 }}>
              <i className="bi bi-stars me-2"></i> Découvrir l'IA shopping
            </a>
          </div>
        </div>
      </section>
      
      {/* 2. Bannière promotionnelle pour les offres spéciales */}
      <PromotionalBanner />
      
      {/* 3. Produits populaires - Meilleures ventes */}
      <PopularProducts />
      
      {/* 4. Pourquoi nous choisir - Avantages concurrentiels */}
      <WhyChooseUs />
      
      {/* 5. Témoignages clients - Social proof */}
      <Testimonials />
      
      {/* 6. Section vidéos - Contenu multimédia */}
      <VideoSection />
      
      {/* 7. Footer avec informations complètes */}
      <Footer />
    </>
  );
}
