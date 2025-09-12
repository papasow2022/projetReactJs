import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useVendor } from '../contexts/VendorContext';
import { useProducts } from '../contexts/ProductsContext';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { BiSearch, BiBasket, BiHeart, BiUser, BiMenu, BiStar, BiGift, BiRefresh, BiPackage, BiShield } from 'react-icons/bi';
import '../styles/vendor-shop.css';

const VendorShopPage = () => {
  const { vendorId } = useParams();
  const location = useLocation();
  const { vendors } = useVendor();
  const { allProducts } = useProducts();
  const [vendor, setVendor] = useState(null);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shopSettings, setShopSettings] = useState({});
  const [activeSection, setActiveSection] = useState('home');

  // Détection de la section active basée sur l'URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/products')) {
      setActiveSection('products');
    } else if (path.includes('/about')) {
      setActiveSection('about');
    } else if (path.includes('/contact')) {
      setActiveSection('contact');
    } else if (path.includes('/reviews')) {
      setActiveSection('reviews');
    } else if (path.includes('/promotions')) {
      setActiveSection('promotions');
    } else if (path.includes('/returns')) {
      setActiveSection('returns');
    } else if (path.includes('/shipping')) {
      setActiveSection('shipping');
    } else if (path.includes('/policies')) {
      setActiveSection('policies');
    } else {
      setActiveSection('home');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (vendorId && vendors[vendorId]) {
      setVendor(vendors[vendorId]);
      const shopSettings = vendors[vendorId].shopSettings || {};
      setShopSettings(shopSettings);
      
      // Filtrer les produits du vendeur
      const products = allProducts.filter(product => 
        product.vendorId === vendorId && product.status === 'active'
      );
      setVendorProducts(products);
    }
  }, [vendorId, vendors, allProducts]);

  // Fonction pour forcer le rechargement des données
  const refreshVendorData = () => {
    if (vendorId && vendors[vendorId]) {
      const shopSettings = vendors[vendorId].shopSettings || {};
      setShopSettings(shopSettings);
      console.log('Données du vendeur rechargées:', shopSettings);
    }
  };

  // Fonctions de rendu pour chaque section
  const renderHomeSection = () => (
    <div>
      {/* Hero Section */}
      <section className="vendor-hero" style={{ 
        backgroundImage: shopSettings.bannerImage ? `url(${shopSettings.bannerImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        position: 'relative'
      }}>
        <div className="hero-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.4)'
        }}></div>
        <Container style={{ position: 'relative', zIndex: 2 }}>
          <Row>
            <Col md={8}>
              <h1 className="display-4 fw-bold mb-3">
                {shopSettings.displayName || vendor.name || 'Boutique'}
              </h1>
              <p className="lead mb-4">
                {shopSettings.description || 'Découvrez notre collection de produits de qualité'}
              </p>
              <Button variant="light" size="lg" className="me-3">
                Voir les produits
              </Button>
              <Button variant="outline-light" size="lg">
                En savoir plus
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Produits vedettes */}
      {vendorProducts.filter(p => p.featured).slice(0, 4).length > 0 && (
        <section className="py-5">
          <Container>
            <h2 className="text-center mb-5">Produits vedettes</h2>
            <Row>
              {vendorProducts.filter(p => p.featured).slice(0, 4).map((product, index) => (
                <Col md={3} key={index} className="mb-4">
                  <Card className="h-100 product-card">
                    <div className="product-image" style={{ height: '200px', overflow: 'hidden' }}>
                      <img 
                        src={product.image || '/assets/images/placeholder.jpg'} 
                        alt={product.name}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text className="text-muted">{product.description}</Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="h5 text-primary">{product.price}€</span>
                        <Button variant="primary" size="sm">
                          <BiBasket className="me-1" />
                          Ajouter
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* Nouveaux arrivages */}
      {vendorProducts.slice(-4).length > 0 && (
        <section className="py-5 bg-light">
          <Container>
            <h2 className="text-center mb-5">Nouveaux arrivages</h2>
            <Row>
              {vendorProducts.slice(-4).map((product, index) => (
                <Col md={3} key={index} className="mb-4">
                  <Card className="h-100 product-card">
                    <div className="product-image" style={{ height: '200px', overflow: 'hidden' }}>
                      <img 
                        src={product.image || '/assets/images/placeholder.jpg'} 
                        alt={product.name}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text className="text-muted">{product.description}</Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="h5 text-primary">{product.price}€</span>
                        <Button variant="primary" size="sm">
                          <BiBasket className="me-1" />
                          Ajouter
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
    </div>
  );

  const renderProductsSection = () => (
    <section className="py-5">
      <Container>
        <h2 className="mb-4">Tous nos produits</h2>
        <Row>
          {vendorProducts.map((product, index) => (
            <Col md={3} key={index} className="mb-4">
              <Card className="h-100 product-card">
                <div className="product-image" style={{ height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={product.image || '/assets/images/placeholder.jpg'} 
                    alt={product.name}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="text-muted">{product.description}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h5 text-primary">{product.price}€</span>
                    <Button variant="primary" size="sm">
                      <BiBasket className="me-1" />
                      Ajouter
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );

  const renderAboutSection = () => (
    <section className="py-5">
      <Container>
        <Row>
          <Col md={8} className="mx-auto">
            <h2 className="text-center mb-5">À propos de nous</h2>
            <div className="text-center mb-5">
              {shopSettings.logoImage && (
                <img 
                  src={shopSettings.logoImage} 
                  alt="Logo" 
                  className="mb-4"
                  style={{ maxHeight: '100px' }}
                />
              )}
            </div>
            <p className="lead text-center mb-4">
              {shopSettings.description || 'Nous sommes une boutique passionnée par la qualité et l\'excellence.'}
            </p>
            <div className="row text-center">
              <div className="col-md-4 mb-4">
                <BiShield className="display-4 text-primary mb-3" />
                <h5>Qualité garantie</h5>
                <p>Tous nos produits sont soigneusement sélectionnés pour leur qualité.</p>
              </div>
              <div className="col-md-4 mb-4">
                <BiPackage className="display-4 text-primary mb-3" />
                <h5>Livraison rapide</h5>
                <p>Livraison dans les meilleurs délais partout en France.</p>
              </div>
              <div className="col-md-4 mb-4">
                <BiUser className="display-4 text-primary mb-3" />
                <h5>Service client</h5>
                <p>Une équipe dédiée pour vous accompagner dans vos achats.</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );

  const renderContactSection = () => (
    <section className="py-5">
      <Container>
        <Row>
          <Col md={8} className="mx-auto">
            <h2 className="text-center mb-5">Contactez-nous</h2>
            <div className="row">
              <div className="col-md-6 mb-4">
                <h5>Informations de contact</h5>
                <p><strong>Email:</strong> {shopSettings.shopEmail || 'contact@boutique.com'}</p>
                <p><strong>Téléphone:</strong> {shopSettings.phone || '01 23 45 67 89'}</p>
                <p><strong>Adresse:</strong> {shopSettings.address || '123 Rue de la Paix, 75001 Paris'}</p>
              </div>
              <div className="col-md-6 mb-4">
                <h5>Horaires d'ouverture</h5>
                <p>Lundi - Vendredi: 9h00 - 18h00</p>
                <p>Samedi: 10h00 - 16h00</p>
                <p>Dimanche: Fermé</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );

  const renderReviewsSection = () => (
    <section className="py-5">
      <Container>
        <h2 className="text-center mb-5">Avis clients</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <BiStar className="text-warning me-1" />
                  <BiStar className="text-warning me-1" />
                  <BiStar className="text-warning me-1" />
                  <BiStar className="text-warning me-1" />
                  <BiStar className="text-warning me-1" />
                  <span className="ms-2">5.0</span>
                </div>
                <p>"Excellent service et produits de qualité. Je recommande vivement !"</p>
                <small className="text-muted">- Marie D.</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <BiStar className="text-warning me-1" />
                  <BiStar className="text-warning me-1" />
                  <BiStar className="text-warning me-1" />
                  <BiStar className="text-warning me-1" />
                  <BiStar className="text-warning me-1" />
                  <span className="ms-2">5.0</span>
                </div>
                <p>"Livraison rapide et emballage soigné. Très satisfait de mon achat."</p>
                <small className="text-muted">- Jean M.</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <BiStar className="text-warning me-1" />
                  <BiStar className="text-warning me-1" />
                  <BiStar className="text-warning me-1" />
                  <BiStar className="text-warning me-1" />
                  <BiStar className="text-warning me-1" />
                  <span className="ms-2">5.0</span>
                </div>
                <p>"Boutique de confiance avec des produits authentiques."</p>
                <small className="text-muted">- Sophie B.</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );

  const renderPromotionsSection = () => (
    <section className="py-5">
      <Container>
        <h2 className="text-center mb-5">Promotions en cours</h2>
        <Row>
          <Col md={6} className="mb-4">
            <Card className="border-warning">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <BiGift className="text-warning me-2" />
                  <Badge bg="warning" className="me-2">-20%</Badge>
                  <h5 className="mb-0">Réduction sur tous les produits</h5>
                </div>
                <p>Profitez de 20% de réduction sur tous nos produits jusqu'au 31 décembre.</p>
                <Button variant="warning">Voir les offres</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="border-success">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <BiPackage className="text-success me-2" />
                  <Badge bg="success" className="me-2">Gratuit</Badge>
                  <h5 className="mb-0">Livraison gratuite</h5>
                </div>
                <p>Livraison gratuite pour toute commande supérieure à 50€.</p>
                <Button variant="success">Commander maintenant</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );

  const renderReturnsSection = () => (
    <section className="py-5">
      <Container>
        <Row>
          <Col md={8} className="mx-auto">
            <h2 className="text-center mb-5">Politique de retour</h2>
            <div className="row">
              <div className="col-md-6 mb-4">
                <h5>Délai de retour</h5>
                <p>Vous disposez de 30 jours à compter de la réception de votre commande pour effectuer un retour.</p>
              </div>
              <div className="col-md-6 mb-4">
                <h5>Conditions</h5>
                <p>Les articles doivent être dans leur état d'origine, avec leurs étiquettes et emballages.</p>
              </div>
              <div className="col-md-6 mb-4">
                <h5>Remboursement</h5>
                <p>Le remboursement sera effectué sous 5-7 jours ouvrés après réception de l'article.</p>
              </div>
              <div className="col-md-6 mb-4">
                <h5>Frais de retour</h5>
                <p>Les frais de retour sont à la charge du client, sauf en cas de défaut de notre part.</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );

  const renderShippingSection = () => (
    <section className="py-5">
      <Container>
        <Row>
          <Col md={8} className="mx-auto">
            <h2 className="text-center mb-5">Livraison</h2>
            <div className="row text-center">
              <div className="col-md-4 mb-4">
                <BiPackage className="display-4 text-primary mb-3" />
                <h5>Livraison standard</h5>
                <p>3-5 jours ouvrés</p>
                <p className="text-muted">5,99€</p>
              </div>
              <div className="col-md-4 mb-4">
                <BiPackage className="display-4 text-success mb-3" />
                <h5>Livraison express</h5>
                <p>1-2 jours ouvrés</p>
                <p className="text-muted">12,99€</p>
              </div>
              <div className="col-md-4 mb-4">
                <BiPackage className="display-4 text-warning mb-3" />
                <h5>Livraison gratuite</h5>
                <p>Commande +50€</p>
                <p className="text-muted">Gratuit</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );

  const renderPoliciesSection = () => (
    <section className="py-5">
      <Container>
        <Row>
          <Col md={8} className="mx-auto">
            <h2 className="text-center mb-5">Politiques</h2>
            <div className="accordion" id="policiesAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#privacy">
                    Politique de confidentialité
                  </button>
                </h2>
                <div id="privacy" className="accordion-collapse collapse show">
                  <div className="accordion-body">
                    <p>Nous nous engageons à protéger vos données personnelles conformément au RGPD.</p>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#terms">
                    Conditions générales de vente
                  </button>
                </h2>
                <div id="terms" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <p>Nos conditions générales de vente régissent tous nos échanges commerciaux.</p>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#cookies">
                    Politique des cookies
                  </button>
                </h2>
                <div id="cookies" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <p>Nous utilisons des cookies pour améliorer votre expérience de navigation.</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );

  // Fonction pour rendre le contenu principal basé sur la section active
  const renderMainContent = () => {
    switch (activeSection) {
      case 'products':
        return renderProductsSection();
      case 'about':
        return renderAboutSection();
      case 'contact':
        return renderContactSection();
      case 'reviews':
        return renderReviewsSection();
      case 'promotions':
        return renderPromotionsSection();
      case 'returns':
        return renderReturnsSection();
      case 'shipping':
        return renderShippingSection();
      case 'policies':
        return renderPoliciesSection();
      default:
        return renderHomeSection();
    }
  };

  if (!vendor) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <h3>Boutique introuvable</h3>
          <p>Cette boutique n'existe pas ou n'est plus disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-shop-page">
      {/* Debug Info - À supprimer après résolution */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '10px', 
          margin: '10px', 
          border: '1px solid #dee2e6',
          borderRadius: '5px',
          fontSize: '12px'
        }}>
          <strong>Debug Info:</strong><br/>
          Vendor ID: {vendorId}<br/>
          Active Section: {activeSection}<br/>
          Shop Settings: {JSON.stringify(shopSettings, null, 2)}<br/>
          Logo Image: {shopSettings.logoImage || 'Aucune'}<br/>
          Banner Image: {shopSettings.bannerImage || 'Aucune'}<br/>
          <button onClick={refreshVendorData} style={{ marginTop: '5px', padding: '5px 10px' }}>
            Recharger les données
          </button>
        </div>
      )}
      
      {/* Header */}
      <header className="vendor-shop-header">
        <Container>
          <div className="d-flex justify-content-between align-items-center py-3">
            {/* Logo et Navigation */}
            <div className="d-flex align-items-center">
              <div className="vendor-logo me-4">
                {shopSettings.logoImage ? (
                  <img 
                    src={shopSettings.logoImage} 
                    alt="Logo boutique" 
                    className="logo-image"
                    onError={(e) => {
                      console.error('Erreur de chargement du logo:', e.target.src);
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => console.log('Logo chargé avec succès:', shopSettings.logoImage)}
                  />
                ) : (
                  <div className="logo-icon"></div>
                )}
                <span className="logo-text">{shopSettings.displayName || vendor.businessName || 'Boutique'}</span>
              </div>
              <nav className="vendor-nav d-none d-md-flex">
                <Link to={`/vendor/${vendorId}`} className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>Accueil</Link>
                <Link to={`/vendor/${vendorId}/products`} className={`nav-link ${activeSection === 'products' ? 'active' : ''}`}>Produits</Link>
                <Link to={`/vendor/${vendorId}/about`} className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>À propos</Link>
                <Link to={`/vendor/${vendorId}/contact`} className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}>Contact</Link>
                <Link to={`/vendor/${vendorId}/reviews`} className={`nav-link ${activeSection === 'reviews' ? 'active' : ''}`}>Avis</Link>
                <Link to={`/vendor/${vendorId}/promotions`} className={`nav-link ${activeSection === 'promotions' ? 'active' : ''}`}>Promotions</Link>
                <Link to={`/vendor/${vendorId}/returns`} className={`nav-link ${activeSection === 'returns' ? 'active' : ''}`}>Retours</Link>
                <Link to={`/vendor/${vendorId}/shipping`} className={`nav-link ${activeSection === 'shipping' ? 'active' : ''}`}>Livraison</Link>
                <Link to={`/vendor/${vendorId}/policies`} className={`nav-link ${activeSection === 'policies' ? 'active' : ''}`}>Politiques</Link>
              </nav>
            </div>

            {/* Recherche et Panier */}
            <div className="d-flex align-items-center">
              <div className="search-box me-3">
                <BiSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Rechercher des produits..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline-primary" className="cart-btn">
                <BiBasket />
              </Button>
              <Button 
                variant="outline-secondary ms-2 d-md-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <BiMenu />
              </Button>
            </div>
          </div>

          {/* Menu mobile */}
          {isMenuOpen && (
            <div className="mobile-menu">
              <nav className="vendor-nav-mobile">
                <Link to={`/vendor/${vendorId}`} className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>Accueil</Link>
                <Link to={`/vendor/${vendorId}/products`} className={`nav-link ${activeSection === 'products' ? 'active' : ''}`}>Produits</Link>
                <Link to={`/vendor/${vendorId}/about`} className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>À propos</Link>
                <Link to={`/vendor/${vendorId}/contact`} className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}>Contact</Link>
                <Link to={`/vendor/${vendorId}/reviews`} className={`nav-link ${activeSection === 'reviews' ? 'active' : ''}`}>Avis</Link>
                <Link to={`/vendor/${vendorId}/promotions`} className={`nav-link ${activeSection === 'promotions' ? 'active' : ''}`}>Promotions</Link>
                <Link to={`/vendor/${vendorId}/returns`} className={`nav-link ${activeSection === 'returns' ? 'active' : ''}`}>Retours</Link>
                <Link to={`/vendor/${vendorId}/shipping`} className={`nav-link ${activeSection === 'shipping' ? 'active' : ''}`}>Livraison</Link>
                <Link to={`/vendor/${vendorId}/policies`} className={`nav-link ${activeSection === 'policies' ? 'active' : ''}`}>Politiques</Link>
              </nav>
            </div>
          )}
        </Container>
      </header>

      {/* Contenu principal conditionnel */}
      {renderMainContent()}

      {/* Footer */}
      <footer className="vendor-footer py-4">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="footer-links">
              <Link to={`/vendor/${vendorId}/shipping`} className="footer-link">Livraison</Link>
              <Link to={`/vendor/${vendorId}/returns`} className="footer-link">Retours</Link>
              <Link to={`/vendor/${vendorId}/contact`} className="footer-link">Contact</Link>
              <Link to={`/vendor/${vendorId}/policies`} className="footer-link">Politiques</Link>
            </div>
            <div className="footer-copyright">
              © 2024 {shopSettings.displayName || vendor.businessName}. Tous droits réservés.
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default VendorShopPage;