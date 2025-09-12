import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductsContext';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BiSearch, BiBasket } from 'react-icons/bi';

const BoutiqueVendeur = () => {
  const { vendeurId } = useParams();
  const { allProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  // Configuration de la boutique depuis localStorage
  let vendorStores = {};
  try { 
    vendorStores = JSON.parse(localStorage.getItem('vendorStores') || '{}'); 
  } catch {}
  
  const vidLower = (vendeurId || '').toString().toLowerCase();
  const storeConfig = vendorStores[vidLower] || vendorStores[vendeurId] || vendorStores[(vendeurId || '').toString().toUpperCase()];
  
  // Produits du vendeur
  const produitsVendeur = allProducts.filter(p => 
    (p.vendorId || '').toLowerCase() === vidLower || 
    (p.sellerId || '').toLowerCase() === vidLower
  );

  // Vérifier si la boutique existe
  if (!storeConfig?.created) {
  return (
      <div className="container py-5 text-center">
        <h3 className="mb-2">Boutique non créée</h3>
        <p className="text-muted">Ce vendeur n'a pas encore configuré sa boutique publique.</p>
        <p>Aucun produit public pour ce vendeur.</p>
        <Link to="/vendeur/boutique" className="btn btn-primary mt-2">
          Créer ma boutique
        </Link>
      </div>
    );
  }

  // Configuration du vendeur
  const vendeur = {
    nom: storeConfig.displayName || 'Boutique',
    description: storeConfig.description || 'Votre boutique de confiance pour des produits de qualité',
    logo: storeConfig.logo || '/assets/vendeur/accueil.jpg',
    theme: storeConfig.theme || { accent: '#2563eb', background: '#f8f9fa', button: '#ffd814' }
  };

  // Produits vedettes (premiers 4 produits)
  const featuredProducts = produitsVendeur.slice(0, 4);
  
  // Nouveaux arrivages (derniers 4 produits)
  const newArrivals = produitsVendeur.slice(-4);

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
        minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Container>
          <Row className="align-items-center">
            <Col md={3}>
              <div className="d-flex align-items-center">
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: vendeur.theme.accent,
                  borderRadius: '8px',
                  marginRight: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  {vendeur.nom.charAt(0)}
                </div>
                <h4 style={{ 
                  margin: 0, 
                  color: '#1a1a1a',
                  fontWeight: 'bold'
                }}>
                  {vendeur.nom}
                </h4>
              </div>
            </Col>
            <Col md={6}>
              <nav className="d-flex justify-content-center">
                <Link to="#" style={{ 
                  margin: '0 1rem', 
                  textDecoration: 'none', 
                  color: '#1a1a1a',
                  fontWeight: '500'
                }}>
                  Home
                </Link>
                <Link to="#" style={{ 
                  margin: '0 1rem', 
                  textDecoration: 'none', 
                  color: '#1a1a1a',
                  fontWeight: '500'
                }}>
                  Products
                </Link>
                <Link to="#" style={{ 
                  margin: '0 1rem', 
                  textDecoration: 'none', 
                  color: '#1a1a1a',
                  fontWeight: '500'
                }}>
                  About Us
                </Link>
                <Link to="#" style={{ 
                  margin: '0 1rem', 
                  textDecoration: 'none', 
                  color: '#1a1a1a',
                  fontWeight: '500'
                }}>
                  Contact
                </Link>
              </nav>
            </Col>
            <Col md={3}>
              <div className="d-flex align-items-center justify-content-end">
                <div style={{ position: 'relative', marginRight: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
          style={{
                      padding: '8px 12px 8px 40px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      width: '200px',
                      fontSize: '14px'
                    }}
                  />
                  <BiSearch style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#666',
                    fontSize: '16px'
                  }} />
      </div>
                <BiBasket style={{
                  fontSize: '24px',
                  color: '#1a1a1a',
                  cursor: 'pointer'
                }} />
          </div>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Hero Section */}
      <section style={{
        background: `linear-gradient(135deg, ${vendeur.theme.accent}20, ${vendeur.theme.accent}40), url('/assets/vendeur/accueil3.jpg') center/cover`,
        padding: '4rem 0',
        textAlign: 'center',
        color: 'white',
        position: 'relative'
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          padding: '2rem',
          borderRadius: '12px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            Welcome to {vendeur.nom}
          </h1>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '1.5rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            Your one-stop shop for quality goods
          </p>
        </div>
      </section>

      {/* About Section */}
      <section style={{
        backgroundColor: '#f8f9fa',
        padding: '3rem 0'
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1a1a1a',
                marginBottom: '1.5rem'
              }}>
                About {vendeur.nom}
              </h2>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: '#666',
                marginBottom: '2rem'
              }}>
                {vendeur.description} We specialize in a wide range of items, from home goods to personal care, 
                ensuring that there's something for everyone. Our commitment is to deliver value and satisfaction 
                with every purchase.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section style={{ padding: '3rem 0' }}>
        <Container>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1a1a1a',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Featured Products
          </h2>
          <Row>
            {featuredProducts.map((product, index) => (
              <Col md={3} key={product.id} className="mb-4">
                <Card style={{
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  height: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    height: '200px',
                    background: '#f8f9fa',
                    borderRadius: '12px 12px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={product.image || product.images?.[0]?.url || '/assets/placeholder.png'}
                      alt={product.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.target.src = '/assets/placeholder.png';
                      }}
                    />
                  </div>
                  <Card.Body>
                    <h5 style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem',
                      color: '#1a1a1a'
                    }}>
                      {product.name}
                    </h5>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#28a745',
                      marginBottom: '0.5rem'
                    }}>
                      In Stock: {product.stock || 50}
            </div>
                    <div style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: vendeur.theme.accent,
                      marginBottom: '1rem'
                    }}>
                      {product.price ? `${product.price} GNF` : '$29.99'}
        </div>
                    <Button
                      style={{
                        backgroundColor: vendeur.theme.button,
                        border: 'none',
                        color: '#1a1a1a',
                        fontWeight: 'bold',
                        width: '100%',
                        padding: '0.75rem'
                      }}
                    >
                      Add to Cart
                </Button>
              </Card.Body>
            </Card>
          </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* New Arrivals Section */}
      <section style={{
        backgroundColor: '#f8f9fa',
        padding: '3rem 0'
      }}>
        <Container>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1a1a1a',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            New Arrivals
          </h2>
          <Row>
            {newArrivals.map((product, index) => (
              <Col md={3} key={product.id} className="mb-4">
                <Card style={{
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  height: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    height: '200px',
                    background: '#f8f9fa',
                    borderRadius: '12px 12px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={product.image || product.images?.[0]?.url || '/assets/placeholder.png'}
                      alt={product.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.target.src = '/assets/placeholder.png';
                      }}
                    />
                  </div>
                        <Card.Body>
                    <h5 style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem',
                      color: '#1a1a1a'
                    }}>
                      {product.name}
                    </h5>
                    <div style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: vendeur.theme.accent
                    }}>
                      {product.price ? `${product.price} GNF` : '$29.99'}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#f8f9fa',
        padding: '2rem 0',
        borderTop: '1px solid #e9ecef'
      }}>
        <Container>
          <Row>
            <Col md={6}>
              <div className="d-flex gap-4">
                <Link to="#" style={{ 
                  textDecoration: 'none', 
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  Delivery Policy
                </Link>
                <Link to="#" style={{ 
                  textDecoration: 'none', 
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  Return Policy
                </Link>
                <Link to="#" style={{ 
                  textDecoration: 'none', 
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  Contact Us
                </Link>
              </div>
            </Col>
            <Col md={6} className="text-end">
              <p style={{
                margin: 0,
                color: '#666',
                fontSize: '0.9rem'
              }}>
                © 2024 {vendeur.nom}. All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default BoutiqueVendeur;