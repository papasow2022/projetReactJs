import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BiStar, 
  BiHeart, 
  BiShare, 
  BiPackage, 
  BiShield, 
  BiRefresh, 
  BiCheckCircle,
  BiChevronLeft,
  BiChevronRight,
  BiZoomIn,
  BiMinus,
  BiPlus,
  BiCart,
  BiCreditCard
} from 'react-icons/bi';
import { useProducts } from '../contexts/ProductsContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import ImageUpload from '../components/ImageUpload';

const ProductDetailVendor = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { allProducts } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Charger le produit
  useEffect(() => {
    const foundProduct = allProducts.find(p => p.id == productId);
    if (foundProduct) {
      setProduct(foundProduct);
      // Charger les produits similaires
      const similar = allProducts
        .filter(p => p.id !== foundProduct.id && p.category === foundProduct.category)
        .slice(0, 4);
      setSimilarProducts(similar);
      
      // Générer des avis factices
      setReviews([
        {
          id: 1,
          name: "Marie L.",
          rating: 5,
          date: "Il y a 2 jours",
          title: "Excellent produit !",
          comment: "Très satisfaite de mon achat. Qualité conforme à la description. Livraison rapide.",
          verified: true
        },
        {
          id: 2,
          name: "Jean P.",
          rating: 4,
          date: "Il y a 1 semaine",
          title: "Bon rapport qualité-prix",
          comment: "Produit correct, emballage soigné. Petit délai de livraison mais acceptable.",
          verified: true
        },
        {
          id: 3,
          name: "Sophie M.",
          rating: 5,
          date: "Il y a 2 semaines",
          title: "Parfait !",
          comment: "Exactement ce que j'attendais. Je recommande ce vendeur.",
          verified: false
        }
      ]);
    }
  }, [productId, allProducts]);

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h3>Produit non trouvé</h3>
        <p>Le produit que vous recherchez n'existe pas.</p>
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    );
  }

  // Données factices pour les variantes
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = [
    { name: 'Noir', code: '#000000' },
    { name: 'Blanc', code: '#ffffff' },
    { name: 'Rouge', code: '#dc3545' },
    { name: 'Bleu', code: '#007bff' }
  ];

  // Images du produit (utiliser les vraies images ou des placeholders)
  const productImages = product.images && product.images.length > 0 
    ? product.images.map(img => img.url)
    : [
        'https://via.placeholder.com/600x600/007bff/ffffff?text=Image+1',
        'https://via.placeholder.com/600x600/28a745/ffffff?text=Image+2',
        'https://via.placeholder.com/600x600/dc3545/ffffff?text=Image+3',
        'https://via.placeholder.com/600x600/ffc107/000000?text=Image+4'
      ];

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/connexion');
      return;
    }
    
    if (!selectedSize || !selectedColor) {
      alert('Veuillez sélectionner une taille et une couleur');
      return;
    }

    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity
    });
    
    alert('Produit ajouté au panier !');
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/connexion');
      return;
    }
    
    if (!selectedSize || !selectedColor) {
      alert('Veuillez sélectionner une taille et une couleur');
      return;
    }

    // Ajouter au panier et rediriger vers le paiement
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity
    });
    
    navigate('/paiement');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <BiStar 
        key={i} 
        className={i < rating ? 'text-warning' : 'text-muted'} 
        style={{ fill: i < rating ? '#ffc107' : 'currentColor' }}
      />
    ));
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
            <li className="breadcrumb-item"><Link to="/catalogue">Catalogue</Link></li>
            <li className="breadcrumb-item"><Link to={`/vendeur/${product.vendorId}`}>Boutique</Link></li>
            <li className="breadcrumb-item active">{product.name}</li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* Galerie d'images */}
          <div className="col-lg-6">
            <div className="product-gallery">
              {/* Image principale */}
              <div className="main-image-container mb-3">
                <div 
                  className="main-image"
                  style={{
                    width: '100%',
                    height: '500px',
                    backgroundImage: `url(${productImages[selectedImage]})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => setShowImageModal(true)}
                >
                  <div className="image-actions position-absolute top-0 end-0 p-2">
                    <button 
                      className="btn btn-light btn-sm me-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsWishlisted(!isWishlisted);
                      }}
                    >
                      <BiHeart className={isWishlisted ? 'text-danger' : ''} />
                    </button>
                    <button className="btn btn-light btn-sm">
                      <BiShare />
                    </button>
                  </div>
                  <div className="zoom-indicator position-absolute bottom-0 end-0 p-2">
                    <BiZoomIn className="text-muted" />
                  </div>
                </div>
              </div>

              {/* Miniatures */}
              <div className="thumbnails d-flex gap-2 overflow-auto">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundImage: `url(${image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '8px',
                      border: selectedImage === index ? '3px solid #007bff' : '1px solid #e0e0e0',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Informations produit */}
          <div className="col-lg-6">
            <div className="product-info">
              {/* Nom et note */}
              <div className="mb-3">
                <h1 className="h3 fw-bold mb-2">{product.name}</h1>
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center">
                    {renderStars(4.5)}
                    <span className="ms-2 text-muted">(128 avis)</span>
                  </div>
                  <span className="badge bg-success">En stock</span>
                </div>
              </div>

              {/* Prix */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-3">
                  <span className="h2 text-danger fw-bold">€{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-muted text-decoration-line-through fs-5">€{product.originalPrice}</span>
                  )}
                  {product.originalPrice && (
                    <span className="badge bg-danger">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
                <p className="text-muted mb-0">Prix TTC, livraison gratuite</p>
              </div>

              {/* Description courte */}
              <div className="mb-4">
                <p className="text-muted">{product.description}</p>
              </div>

              {/* Variantes */}
              <div className="variants mb-4">
                {/* Couleurs */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Couleur :</label>
                  <div className="d-flex gap-2">
                    {availableColors.map((color, index) => (
                      <button
                        key={index}
                        className={`btn btn-outline-secondary ${selectedColor === color.name ? 'active' : ''}`}
                        onClick={() => setSelectedColor(color.name)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: color.code,
                          border: selectedColor === color.name ? '3px solid #007bff' : '2px solid #e0e0e0'
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Tailles */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Taille :</label>
                  <div className="d-flex gap-2 flex-wrap">
                    {availableSizes.map((size, index) => (
                      <button
                        key={index}
                        className={`btn ${selectedSize === size ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedSize(size)}
                        style={{ minWidth: '50px' }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantité */}
              <div className="quantity mb-4">
                <label className="form-label fw-bold">Quantité :</label>
                <div className="d-flex align-items-center gap-2">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <BiMinus />
                  </button>
                  <span className="px-3 py-2 border rounded">{quantity}</span>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <BiPlus />
                  </button>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="action-buttons mb-4">
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-warning btn-lg"
                    onClick={handleAddToCart}
                    disabled={!selectedSize || !selectedColor}
                  >
                    <BiCart className="me-2" />
                    Ajouter au panier
                  </button>
                  <button 
                    className="btn btn-danger btn-lg"
                    onClick={handleBuyNow}
                    disabled={!selectedSize || !selectedColor}
                  >
                    <BiCreditCard className="me-2" />
                    Commander maintenant
                  </button>
                </div>
              </div>

              {/* Informations livraison */}
              <div className="delivery-info">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <BiPackage className="text-success me-2" />
                      <div>
                        <div className="fw-bold">Livraison gratuite</div>
                        <div className="text-muted small">Dès 50€ d'achat</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <BiShield className="text-primary me-2" />
                      <div>
                        <div className="fw-bold">Paiement sécurisé</div>
                        <div className="text-muted small">100% protégé</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <BiRefresh className="text-info me-2" />
                      <div>
                        <div className="fw-bold">Retours gratuits</div>
                        <div className="text-muted small">30 jours</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <BiCheckCircle className="text-success me-2" />
                      <div>
                        <div className="fw-bold">Garantie</div>
                        <div className="text-muted small">2 ans</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets détaillés */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="product-tabs">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={() => setActiveTab('description')}
                  >
                    Description
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'specifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('specifications')}
                  >
                    Caractéristiques
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Avis clients (128)
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'delivery' ? 'active' : ''}`}
                    onClick={() => setActiveTab('delivery')}
                  >
                    Livraison & Retours
                  </button>
                </li>
              </ul>

              <div className="tab-content p-4 bg-white rounded-bottom">
                {activeTab === 'description' && (
                  <div>
                    <h5>Description du produit</h5>
                    <p>{product.description}</p>
                    <p>Ce produit de haute qualité vous accompagnera dans toutes vos activités. Conçu avec des matériaux durables et un design moderne, il répondra parfaitement à vos besoins.</p>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div>
                    <h5>Caractéristiques techniques</h5>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td><strong>Marque</strong></td>
                          <td>{product.brand || 'Marque générique'}</td>
                        </tr>
                        <tr>
                          <td><strong>Catégorie</strong></td>
                          <td>{product.category}</td>
                        </tr>
                        <tr>
                          <td><strong>Matière</strong></td>
                          <td>100% Coton</td>
                        </tr>
                        <tr>
                          <td><strong>Entretien</strong></td>
                          <td>Machine à laver 30°C</td>
                        </tr>
                        <tr>
                          <td><strong>Origine</strong></td>
                          <td>France</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h5>Avis clients</h5>
                    <div className="row mb-4">
                      <div className="col-md-4">
                        <div className="text-center">
                          <div className="h1 text-warning">4.5</div>
                          <div className="d-flex justify-content-center mb-2">
                            {renderStars(4.5)}
                          </div>
                          <div className="text-muted">Basé sur 128 avis</div>
                        </div>
                      </div>
                      <div className="col-md-8">
                        {[5, 4, 3, 2, 1].map(rating => (
                          <div key={rating} className="d-flex align-items-center mb-2">
                            <span className="me-2">{rating}★</span>
                            <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                              <div 
                                className="progress-bar bg-warning" 
                                style={{ width: `${Math.random() * 100}%` }}
                              />
                            </div>
                            <span className="text-muted small">{Math.floor(Math.random() * 50)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="reviews-list">
                      {reviews.map(review => (
                        <div key={review.id} className="review-item border-bottom pb-3 mb-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <div className="fw-bold">{review.name}</div>
                              <div className="d-flex align-items-center">
                                {renderStars(review.rating)}
                                {review.verified && <span className="badge bg-success ms-2">Achat vérifié</span>}
                              </div>
                            </div>
                            <div className="text-muted small">{review.date}</div>
                          </div>
                          <h6 className="mb-1">{review.title}</h6>
                          <p className="text-muted mb-0">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'delivery' && (
                  <div>
                    <h5>Livraison & Retours</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <h6>Options de livraison</h6>
                        <ul>
                          <li><strong>Livraison standard :</strong> 3-5 jours ouvrés (Gratuite dès 50€)</li>
                          <li><strong>Livraison express :</strong> 24-48h (+5€)</li>
                          <li><strong>Point relais :</strong> 2-3 jours ouvrés (Gratuite)</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h6>Politique de retour</h6>
                        <ul>
                          <li><strong>Délai :</strong> 30 jours après réception</li>
                          <li><strong>Condition :</strong> Produit non utilisé, emballage d'origine</li>
                          <li><strong>Frais :</strong> Retour gratuit</li>
                          <li><strong>Remboursement :</strong> 2-5 jours ouvrés</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        <div className="row mt-5">
          <div className="col-12">
            <h4 className="mb-4">Produits similaires</h4>
            <div className="row g-4">
              {similarProducts.map(prod => (
                <div key={prod.id} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="card h-100">
                    <div className="position-relative">
                      <img 
                        src={prod.images?.[0]?.url || prod.image || 'https://via.placeholder.com/300x300'} 
                        className="card-img-top" 
                        alt={prod.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute top-0 end-0 p-2">
                        <button className="btn btn-light btn-sm">
                          <BiHeart />
                        </button>
                      </div>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title">{prod.name}</h6>
                      <div className="d-flex align-items-center mb-2">
                        {renderStars(4.0)}
                        <span className="text-muted small ms-1">(12)</span>
                      </div>
                      <div className="mt-auto">
                        <div className="fw-bold text-danger">€{prod.price}</div>
                        <Link to={`/produit/${prod.id}`} className="btn btn-outline-primary btn-sm w-100 mt-2">
                          Voir le produit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'image */}
      {showImageModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Galerie d'images</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowImageModal(false)}
                />
              </div>
              <div className="modal-body text-center">
                <img 
                  src={productImages[selectedImage]} 
                  alt="Produit" 
                  className="img-fluid"
                  style={{ maxHeight: '500px' }}
                />
                <div className="d-flex justify-content-center gap-2 mt-3">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                    disabled={selectedImage === 0}
                  >
                    <BiChevronLeft />
                  </button>
                  <span className="px-3 py-2">{selectedImage + 1} / {productImages.length}</span>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setSelectedImage(Math.min(productImages.length - 1, selectedImage + 1))}
                    disabled={selectedImage === productImages.length - 1}
                  >
                    <BiChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailVendor;