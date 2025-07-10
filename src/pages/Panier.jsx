import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ShoppingCart from "../components/ShoppingCart";

export default function Panier() {
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
              <div className="mb-4">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/" className="text-decoration-none" style={{ color: '#e47911' }}>
                        Accueil
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Panier
                    </li>
                  </ol>
                </nav>
              </div>
              
              <ShoppingCart />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
} 