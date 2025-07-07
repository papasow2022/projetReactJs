import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Homme from './pages/categorie/Homme.jsx';
import Femme from "./pages/categorie/Femme";
import Enfant from "./pages/categorie/Enfant";
import Bebe from "./pages/categorie/Bebe";
import ProductDetail from "./pages/ProductDetail";
import Catalogue from "./pages/Catalogue";

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorie/homme" element={<Homme />} />
          <Route path="/categorie/femme" element={<Femme />} />
          <Route path="/categorie/enfant" element={<Enfant />} />
          <Route path="/categorie/bebe" element={<Bebe />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          {/* Ajoutez d'autres routes ici si nécessaire */}
          {/* Exemple : <Route path="/categorie/femme" element={<Femme />} /> */}
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
