import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductComparison from "../components/ProductComparison";

export default function Comparaison() {
  return (
    <>
      <Header />
      
      <div style={{ 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        minHeight: '100vh'
      }}>
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-12">
              {/* Fil d'Ariane */}
              <div className="mb-4">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/" className="text-decoration-none" style={{ color: '#e47911' }}>
                        Accueil
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Comparaison de produits
                    </li>
                  </ol>
                </nav>
              </div>

              {/* Titre de la page */}
              <div className="text-center mb-4">
                <h1 className="fw-bold mb-3" style={{ color: '#232f3e' }}>
                  <i className="bi bi-bar-chart me-2"></i>
                  Comparaison de produits
                </h1>
                <p className="text-muted" style={{ fontSize: '18px' }}>
                  Analysez et comparez vos produits favoris pour faire le meilleur choix
                </p>
              </div>

              {/* Composant de comparaison */}
              <ProductComparison />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
} 