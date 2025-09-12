import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './utils/fixAdminAccount.js';
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./hooks/useAuth.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import VendorProtectedRoute from "./components/VendorProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Catalogue from "./pages/Catalogue";
import OffreDuJour from "./pages/OffreDuJour";
import OffresUrgentes from "./pages/OffresUrgentes";
import Nouveautes from "./pages/Nouveautes";
import Chaussures from "./pages/Chaussures";

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
import Vendeur from './pages/Vendeur.jsx';
import SupportVendeur from './pages/SupportVendeur.jsx';
import InscriptionVendeur from './pages/InscriptionVendeur.jsx';
import ConfirmationVendeur from './pages/ConfirmationVendeur.jsx';
import ConditionsVente from './pages/ConditionsVente.jsx';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite.jsx';
import DashboardVendeur from './pages/DashboardVendeur';
import ConfigurationCompte from './pages/ConfigurationCompte';
import CentreFormation from './pages/CentreFormation';
import GestionProduits from './pages/GestionProduits';
import CentreCommandes from './pages/CentreCommandes';
import OnboardingVendeur from './pages/OnboardingVendeur';
import BoutiqueVendeur from './pages/BoutiqueVendeur';
import ProductDetailVendor from './pages/ProductDetailVendor';
import ListeBoutiques from './pages/ListeBoutiques';
import VendorShopPage from './pages/VendorShopPage';
import VendorShopConfig from './pages/VendorShopConfig';
import { CommandesProvider } from "./contexts/CommandesContext";
import { ProductsProvider } from "./contexts/ProductsContext";
import ConnexionVendeur from './pages/ConnexionVendeur';
import ConnexionAdmin from './pages/ConnexionAdmin';
import RetoursVendeur from './pages/RetoursVendeur';
import HistoriqueEchanges from './pages/HistoriqueEchanges';
import MesEchanges from './pages/MesEchanges';
import ValidationEchange from './pages/ValidationEchange';
import GestionCommandesVendeur from './pages/GestionCommandesVendeur';
import AnalyticsVendeur from './pages/AnalyticsVendeur';
import { NotificationProvider } from './contexts/NotificationContext';
import { DailyDealsProvider } from './contexts/DailyDealsContext';
import { CartProvider } from './contexts/CartContext';
import { VendorProvider } from './contexts/VendorContext';
import { AuditProvider } from './contexts/AuditContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { MessagingProvider } from './contexts/MessagingContext';
import { ReviewsProvider } from './contexts/ReviewsContext';
import { PromotionsProvider } from './contexts/PromotionsContext';
import { ReturnsProvider } from './contexts/ReturnsContext';
import { PaymentsProvider } from './contexts/PaymentsContext';
import AdminDashboard from './pages/AdminDashboard';
import AdminVendors from './pages/AdminVendors';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminReviews from './pages/AdminReviews';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminPayments from './pages/AdminPayments';
import AdminSupport from './pages/AdminSupport';
import AdminSettings from './pages/AdminSettings';
import AdminAudit from './pages/AdminAudit';
import AdminUsers from './pages/AdminUsers';
import AdminInventory from './pages/AdminInventory';
import AdminPromotions from './pages/AdminPromotions';
import AdminAdvancedAnalytics from './pages/AdminAdvancedAnalytics';
import AdminLogistics from './pages/AdminLogistics';
import AdminAIRecommendations from './pages/AdminAIRecommendations';
import MessagerieVendeur from './pages/MessagerieVendeur';
import GestionAvisVendeur from './pages/GestionAvisVendeur';
import OutilsPromotionVendeur from './pages/OutilsPromotionVendeur';
import GestionRetoursVendeur from './pages/GestionRetoursVendeur';
import GestionPaiementsVendeur from './pages/GestionPaiementsVendeur';
import VendeurStatutDemande from './pages/VendeurStatutDemande.jsx';
import SetVendorPassword from './pages/SetVendorPassword.jsx';
import GlobalSearchOverlay from './components/GlobalSearchOverlay';
import { ThemeProvider } from './contexts/ThemeContext';
import { RealtimeProvider } from './contexts/RealtimeContext';
import { NotificationSystemProvider } from './contexts/NotificationSystemContext';
import VendeurBoutique from './pages/VendeurBoutique';


export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <RealtimeProvider>
              <DailyDealsProvider>
                <CartProvider>
                  <CommandesProvider>
                    <ProductsProvider>
                      <VendorProvider>
                        <AuditProvider>
                          <CurrencyProvider>
                        <MessagingProvider>
                          <ReviewsProvider>
                            <PromotionsProvider>
                              <ReturnsProvider>
                                <PaymentsProvider>
                                  <NotificationSystemProvider>
              <Router>
                <Header />
                <Routes>
                  {/* Routes publiques */}
                  <Route path="/" element={<Home />} />
                  <Route path="/catalogue" element={<Catalogue />} />
                  <Route path="/product/:productId" element={<ProductDetail />} />
                  <Route path="/produit/:productId" element={<ProductDetailVendor />} />
                  <Route path="/offres-du-jour" element={<OffreDuJour />} />
                  <Route path="/offres-urgentes" element={<OffresUrgentes />} />
                  <Route path="/nouveautes" element={<Nouveautes />} />
                  <Route path="/chaussures" element={<Chaussures />} />

                  <Route path="/service-client" element={<ServiceClient />} />
                  <Route path="/connexion" element={<Connexion />} />
                  <Route path="/inscription" element={<Inscription />} />
                  <Route path="/inscription-vendeur" element={<InscriptionVendeur />} />
                  <Route path="/confirmation-vendeur" element={<ConfirmationVendeur />} />
                  <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
                  <Route path="/comparaison" element={<Comparaison />} />
                  <Route path="/avis" element={<Avis />} />
                  <Route path="/vendeur" element={<Vendeur />} />
                  {/* Configuration boutique (protégée) */}
                  <Route path="/vendeur/boutique" element={
                    <VendorProtectedRoute>
                      <VendeurBoutique />
                    </VendorProtectedRoute>
                  } />
                  {/* Boutique publique par identifiant vendeur */}
                  <Route path="/vendeur/:vendeurId" element={<BoutiqueVendeur />} />
                  {/* Routes boutique publique vendeur */}
                  <Route path="/vendor/:vendorId" element={<VendorShopPage />} />
                  <Route path="/vendor/:vendorId/products" element={<VendorShopPage />} />
                  <Route path="/vendor/:vendorId/about" element={<VendorShopPage />} />
                  <Route path="/vendor/:vendorId/contact" element={<VendorShopPage />} />
                  <Route path="/vendor/:vendorId/reviews" element={<VendorShopPage />} />
                  <Route path="/vendor/:vendorId/promotions" element={<VendorShopPage />} />
                  <Route path="/vendor/:vendorId/returns" element={<VendorShopPage />} />
                  <Route path="/vendor/:vendorId/shipping" element={<VendorShopPage />} />
                  <Route path="/vendor/:vendorId/policies" element={<VendorShopPage />} />
                  <Route path="/support-vendeur" element={<SupportVendeur />} />
                  <Route path="/conditions-vente" element={<ConditionsVente />} />
                  <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                  <Route path="/boutiques" element={<ListeBoutiques />} />
                  <Route path="/connexion-vendeur" element={<ConnexionVendeur />} />
                  <Route path="/vendeur/definir-mot-de-passe" element={<SetVendorPassword />} />
                <Route path="/connexion-admin" element={<ConnexionAdmin />} />
                  <Route path="/vendeur/retours" element={
                    <VendorProtectedRoute>
                      <RetoursVendeur />
                    </VendorProtectedRoute>
                  } />
                  <Route path="/vendeur/statut-demande" element={
                    <ProtectedRoute>
                      <VendeurStatutDemande />
                    </ProtectedRoute>
                  } />
                  <Route path="/vendeur/echanges" element={
                    <VendorProtectedRoute>
                      <HistoriqueEchanges />
                    </VendorProtectedRoute>
                  } />
                  
                  {/* Routes protégées */}
                  <Route path="/commandes" element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } />
                  <Route path="/echanges" element={
                    <ProtectedRoute>
                      <MesEchanges />
                    </ProtectedRoute>
                  } />
                  <Route path="/validation-echange/:echangeId" element={
                    <ProtectedRoute>
                      <ValidationEchange />
                    </ProtectedRoute>
                  } />
                  <Route path="/panier" element={
                    <ProtectedRoute>
                      <Panier />
                    </ProtectedRoute>
                  } />
                  <Route path="/profil" element={
                    <ProtectedRoute>
                      <Profil />
                    </ProtectedRoute>
                  } />
                  <Route path="/adresses" element={
                    <ProtectedRoute>
                      <Adresses />
                    </ProtectedRoute>
                  } />
                  <Route path="/paiement" element={
                    <ProtectedRoute>
                      <Paiement />
                    </ProtectedRoute>
                  } />
                  <Route path="/securite" element={
                    <ProtectedRoute>
                      <Securite />
                    </ProtectedRoute>
                  } />
                  <Route path="/preferences" element={
                    <ProtectedRoute>
                      <Preferences />
                    </ProtectedRoute>
                  } />
                  <Route path="/listes/envies" element={
                    <ProtectedRoute>
                      <ListesEnvies />
                    </ProtectedRoute>
                  } />
                  <Route path="/listes/cadeaux" element={
                    <ProtectedRoute>
                      <ListesCadeaux />
                    </ProtectedRoute>
                  } />
                  <Route path="/listes/categories" element={
                    <ProtectedRoute>
                      <ListesCategories />
                    </ProtectedRoute>
                  } />
                  <Route path="/listes/sauvegardes" element={
                    <ProtectedRoute>
                      <ListesSauvegardes />
                    </ProtectedRoute>
                  } />
                  <Route path="/cartes-cadeaux" element={
                    <ProtectedRoute>
                      <CartesCadeaux />
                    </ProtectedRoute>
                  } />
                  
                  {/* Route principale vendeur - Dashboard centralisé */}
                  <Route path="/vendeur/dashboard" element={
                    <VendorProtectedRoute>
                      <DashboardVendeur />
                    </VendorProtectedRoute>
                  } />
                  
                  {/* Redirection vers le dashboard pour toutes les autres routes vendeur */}
                  <Route path="/vendeur/*" element={
                    <VendorProtectedRoute>
                      <DashboardVendeur />
                    </VendorProtectedRoute>
                  } />
                  
                {/* Ajoutez d'autres routes ici si nécessaire */}
                {/* Exemple : <Route path="/categorie/femme" element={<Femme />} /> */}
                {/* Routes Admin */}
                <Route path="/admin/dashboard" element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/vendors" element={
                  <AdminProtectedRoute>
                    <AdminVendors />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/products" element={
                  <AdminProtectedRoute>
                    <AdminProducts />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <AdminProtectedRoute>
                    <AdminOrders />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/reviews" element={
                  <AdminProtectedRoute>
                    <AdminReviews />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                  <AdminProtectedRoute>
                    <AdminAnalytics />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/payments" element={
                  <AdminProtectedRoute>
                    <AdminPayments />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/support" element={
                  <AdminProtectedRoute>
                    <AdminSupport />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <AdminProtectedRoute>
                    <AdminSettings />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/audit" element={
                  <AdminProtectedRoute roles={["superadmin","moderator","finance","viewer"]}>
                    <AdminAudit />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <AdminProtectedRoute roles={["superadmin"]}>
                    <AdminUsers />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/inventory" element={
                  <AdminProtectedRoute>
                    <AdminInventory />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/promotions" element={
                  <AdminProtectedRoute>
                    <AdminPromotions />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/advanced-analytics" element={
                  <AdminProtectedRoute>
                    <AdminAdvancedAnalytics />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/logistics" element={
                  <AdminProtectedRoute>
                    <AdminLogistics />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/ai-recommendations" element={
                  <AdminProtectedRoute>
                    <AdminAIRecommendations />
                  </AdminProtectedRoute>
                } />
                </Routes>
              </Router>
                                  </NotificationSystemProvider>
            </PaymentsProvider>
          </ReturnsProvider>
        </PromotionsProvider>
      </ReviewsProvider>
    </MessagingProvider>
  </CurrencyProvider>
</AuditProvider>
                  </VendorProvider>
                </ProductsProvider>
              </CommandesProvider>
            </CartProvider>
          </DailyDealsProvider>
        </RealtimeProvider>
      </NotificationProvider>
    </AuthProvider>
  </LanguageProvider>
</ThemeProvider>
  );
}
