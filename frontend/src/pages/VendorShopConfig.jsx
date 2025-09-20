import React, { useState, useEffect } from 'react';
import { useVendor } from '../contexts/VendorContext';
import { useProducts } from '../contexts/ProductsContext';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { BiSave, BiImage, BiUser, BiEnvelope, BiPhone, BiMapPin, BiEdit, BiTestTube } from 'react-icons/bi';
import { createTestShopSettings } from '../utils/testShopSettings';

const VendorShopConfig = () => {
  const { currentVendor, updateVendor } = useVendor();
  const { clearVendorProducts } = useProducts();
  const [formData, setFormData] = useState({
    displayName: '',
    description: '',
    shopEmail: '',
    phone: '',
    address: '',
    logoImage: null,
    bannerImage: null
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentVendor) {
      setFormData({
        displayName: String(currentVendor.shopSettings?.displayName || currentVendor.businessName || ''),
        description: String(currentVendor.shopSettings?.description || 'Bienvenue dans ma boutique.'),
        shopEmail: String(currentVendor.shopSettings?.shopEmail || currentVendor.informations?.email || ''),
        phone: String(currentVendor.shopSettings?.phone || currentVendor.informations?.telephone || ''),
        address: String(currentVendor.shopSettings?.address || currentVendor.informations?.adresse || ''),
        logoImage: currentVendor.shopSettings?.logoImage || null,
        bannerImage: currentVendor.shopSettings?.bannerImage || null
      });
    }
  }, [currentVendor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          [imageType]: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTestData = () => {
    const testSettings = createTestShopSettings();
    setFormData(prev => ({
      ...prev,
      ...testSettings
    }));
    setMessage('Données de test chargées !');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const shopSettings = {
        displayName: formData.displayName,
        description: formData.description,
        shopEmail: formData.shopEmail,
        phone: formData.phone,
        address: formData.address,
        logoImage: formData.logoImage,
        bannerImage: formData.bannerImage
      };

      const result = updateVendor(currentVendor.id, { shopSettings });
      
      if (result.success) {
        setMessage('Configuration de boutique sauvegardée avec succès !');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Erreur lors de la sauvegarde');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Erreur lors de la sauvegarde');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetShop = async () => {
    if (!currentVendor?.id) return;
    try {
      // 1) Vider produits du vendeur (local)
      await clearVendorProducts(currentVendor.id);
      // 2) Vider la configuration visuelle
      updateVendor(currentVendor.id, { 
        shopSettings: {
          displayName: '',
          description: '',
          shopEmail: '',
          phone: '',
          address: '',
          logoImage: null,
          bannerImage: null
        }
      });
      setFormData(prev => ({
        ...prev,
        displayName: '',
        description: '',
        shopEmail: '',
        phone: '',
        address: '',
        logoImage: null,
        bannerImage: null
      }));
      setMessage('Boutique réinitialisée. Tout le contenu a été vidé.');
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      setMessage("Erreur lors de la réinitialisation");
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (!currentVendor) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          Vous devez être connecté en tant que vendeur pour accéder à cette page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Configurer ma boutique</h2>
            <Badge bg="danger" className="fs-6">
              Identifiant vendeur: {currentVendor.id}
            </Badge>
          </div>

          {message && (
            <Alert variant="success" className="mb-4">
              {message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Informations de base */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <BiUser className="me-2" />
                  Informations de base
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom affiché</Form.Label>
                      <Form.Control
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        placeholder="Nom de votre boutique"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email boutique</Form.Label>
                      <Form.Control
                        type="email"
                        name="shopEmail"
                        value={formData.shopEmail}
                        onChange={handleInputChange}
                        placeholder="email@boutique.com"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre boutique..."
                    style={{ resize: 'vertical' }}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Images de la boutique */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <BiImage className="me-2" />
                  Images de la boutique
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {/* Logo de la boutique */}
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">
                        <BiImage className="me-2" />
                        Logo de la boutique
                      </Form.Label>
                      <p className="text-muted small mb-3">
                        Votre logo apparaîtra dans l'en-tête de votre boutique. 
                        Recommandé : 200x80px, format PNG avec fond transparent.
                      </p>
                      <div className="d-flex align-items-center mb-2">
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'logoImage')}
                          className="me-2"
                        />
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => document.querySelector('input[type="file"]').click()}
                        >
                          Choisir un fichier
                        </Button>
                      </div>
                      <small className="text-muted">
                        {formData.logoImage ? 'Fichier sélectionné' : 'Aucun fichier sélectionné'}
                      </small>
                      
                      {formData.logoImage && (
                        <div className="mt-3">
                          <img 
                            src={formData.logoImage} 
                            alt="Logo boutique" 
                            className="img-thumbnail border"
                            style={{ maxWidth: '200px', maxHeight: '80px', objectFit: 'contain' }}
                          />
                          <div className="mt-2">
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, logoImage: null }))}
                            >
                              Retirer le logo
                            </Button>
                          </div>
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Bannière/Header */}
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">
                        <BiImage className="me-2" />
                        Bannière/Header
                      </Form.Label>
                      <p className="text-muted small mb-3">
                        Image de bannière pour la section principale de votre boutique. 
                        Recommandé : 1200x400px, format JPG ou PNG.
                      </p>
                      <div className="d-flex align-items-center mb-2">
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'bannerImage')}
                          className="me-2"
                        />
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => document.querySelectorAll('input[type="file"]')[1].click()}
                        >
                          Choisir un fichier
                        </Button>
                      </div>
                      <small className="text-muted">
                        {formData.bannerImage ? 'Fichier sélectionné' : 'Aucun fichier sélectionné'}
                      </small>
                      
                      {formData.bannerImage && (
                        <div className="mt-3">
                          <img 
                            src={formData.bannerImage} 
                            alt="Bannière boutique" 
                            className="img-thumbnail border"
                            style={{ maxWidth: '300px', maxHeight: '120px', objectFit: 'cover' }}
                          />
                          <div className="mt-2">
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, bannerImage: null }))}
                            >
                              Retirer la bannière
                            </Button>
                          </div>
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Coordonnées de contact */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <BiMapPin className="me-2" />
                  Coordonnées de contact
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <BiEnvelope className="me-1" />
                        Email boutique
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="shopEmail"
                        value={formData.shopEmail}
                        onChange={handleInputChange}
                        placeholder="email@boutique.com"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <BiPhone className="me-1" />
                        Téléphone
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+33 1 23 45 67 89"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <BiMapPin className="me-1" />
                    Adresse
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Adresse complète de votre boutique"
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Boutons */}
            <div className="text-center">
              <Button 
                type="button" 
                variant="outline-danger" 
                size="lg"
                className="me-3"
                onClick={handleResetShop}
              >
                Vider toute la boutique
              </Button>
              <Button 
                type="button" 
                variant="outline-info" 
                size="lg"
                className="me-3"
                onClick={handleTestData}
              >
                <BiTestTube className="me-2" />
                Charger données de test
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                size="lg"
                disabled={isLoading}
              >
                <BiSave className="me-2" />
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default VendorShopConfig;