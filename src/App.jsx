import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Catalogue from "./pages/Catalogue";
import OffreDuJour from "./pages/OffreDuJour";
import OffresAmazonLike from "./pages/OffresAmazonLike";
import ServiceClient from "./pages/ServiceClient";
import CartesCadeaux from "./pages/CartesCadeaux";
import Orders from "./pages/Orders";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import MotDePasseOublie from "./pages/MotDePasseOublie";
import Panier from "./pages/Panier";
import Comparaison from "./pages/Comparaison";
import Profil from "./pages/Profil";
import Adresses from "./pages/Adresses";
import Paiement from "./pages/Paiement";
import Securite from "./pages/Securite";
import Preferences from "./pages/Preferences";
import ListesEnvies from "./pages/ListesEnvies";
import ListesCadeaux from "./pages/ListesCadeaux";
import ListesCategories from "./pages/ListesCategories";
import ListesSauvegardes from "./pages/ListesSauvegardes";
import Avis from "./pages/Avis";

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/offres-du-jour" element={<OffreDuJour />} />
          <Route path="/offres" element={<OffresAmazonLike />} />
          <Route path="/service-client" element={<ServiceClient />} />
          <Route path="/cartes-cadeaux" element={<CartesCadeaux />} />
          <Route path="/commandes" element={<Orders />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/comparaison" element={<Comparaison />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/adresses" element={<Adresses />} />
          <Route path="/paiement" element={<Paiement />} />
          <Route path="/securite" element={<Securite />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/listes/envies" element={<ListesEnvies />} />
          <Route path="/listes/cadeaux" element={<ListesCadeaux />} />
          <Route path="/listes/categories" element={<ListesCategories />} />
          <Route path="/listes/sauvegardes" element={<ListesSauvegardes />} />
          <Route path="/avis" element={<Avis />} />
          {/* Ajoutez d'autres routes ici si nécessaire */}
          {/* Exemple : <Route path="/categorie/femme" element={<Femme />} /> */}
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
