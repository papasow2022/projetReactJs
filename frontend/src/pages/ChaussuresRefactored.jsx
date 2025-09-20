import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../amazon-like.css';

const ChaussuresRefactored = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  
  const [images, setImages] = useState({
    homme: [],
    femme: [],
    enfant: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('homme');
  const [isAddingToCart, setIsAddingToCart] = useState({});

  // Récupérer les images depuis le backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        
        // Récupérer toutes les catégories en parallèle
        const [hommeRes, femmeRes, enfantRes] = await Promise.all([
          fetch(`${baseUrl}/api/homme`),
          fetch(`${baseUrl}/api/femme`),
          fetch(`${baseUrl}/api/enfant`)
        ]);

        const [hommeData, femmeData, enfantData] = await Promise.all([
          hommeRes.json(),
          femmeRes.json(),
          enfantRes.json()
        ]);

        setImages({
          homme: hommeData || [],
          femme: femmeData || [],
          enfant: enfantData || []
        });
      } catch (error) {
        console.error('Erreur lors du chargement des images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Gérer le clic sur une image
  const handleImageClick = (imageData) => {
    console.log('🖼️ Clic sur image:', imageData);
    
    // Créer un produit basé sur les vraies données de l'image
    const product = {
      id: `image-${imageData.path.replace(/[^a-zA-Z0-9]/g, '-')}`,
      name: imageData.name || imageData.alt || 'Chaussure',
      price: imageData.price || 250000,
      image: imageData.path,
      stock: imageData.stock || 5,
      brand: imageData.brand || 'Marque',
      category: 'Chaussures',
      subcategory: selectedCategory,
      description: imageData.description || 'Chaussure de qualité'
    };

    // Naviguer vers la page de détail avec les vraies données
    navigate(`/product/${product.id}`, { 
      state: { product, fromImage: true } 
    });
  };

  // Ajouter directement au panier
  const handleAddToCart = async (imageData, event) => {
    event.stopPropagation();
    
    const productId = `image-${imageData.path.replace(/[^a-zA-Z0-9]/g, '-')}`;
    setIsAddingToCart(prev => ({ ...prev, [productId]: true }));

    try {
      const product = {
        id: productId,
        name: imageData.name || imageData.alt || 'Chaussure',
        price: imageData.price || 250000,
        image: imageData.path,
        stock: imageData.stock || 5,
        brand: imageData.brand || 'Marque',
        category: 'Chaussures',
        subcategory: selectedCategory,
        description: imageData.description || 'Chaussure de qualité'
      };

      const result = await addToCart(product, 1);
      
      if (result.success) {
        console.log('✅ Produit ajouté au panier:', product.name);
      } else {
        console.error('❌ Erreur ajout panier:', result.message);
        alert(result.message || 'Erreur lors de l\'ajout au panier');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setIsAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Rendu des images
  const renderImageGrid = (imageList) => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      );
    }

    if (!imageList || imageList.length === 0) {
      return (
        <div className="text-center py-5">
          <p className="text-muted">Aucune image trouvée pour cette catégorie</p>
        </div>
      );
    }

    return (
      <div className="row g-3">
        {imageList.map((imageData, index) => {
          const productId = `image-${imageData.path.replace(/[^a-zA-Z0-9]/g, '-')}`;
          const isAdding = isAddingToCart[productId] || false;
          
          return (
            <div key={index} className="col-lg-3 col-md-4 col-sm-6">
              <div 
                className="card h-100 shadow-sm product-card"
                style={{ cursor: 'pointer' }}
                onClick={() => handleImageClick(imageData)}
              >
                <div className="position-relative">
                  <img
                    src={imageData.path}
                    className="card-img-top"
                    alt={imageData.alt || 'Chaussure'}
                    style={{ height: '250px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/assets/images/placeholder.jpg';
                    }}
                  />
                  
                  {/* Badge stock */}
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className={`badge ${imageData.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {imageData.stock > 0 ? `${imageData.stock} en stock` : 'Rupture'}
                    </span>
                  </div>
                </div>
                
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title text-truncate">
                    {imageData.name || imageData.alt || 'Chaussure'}
                  </h6>
                  
                  <p className="card-text text-muted small">
                    {imageData.brand || 'Marque'} • {imageData.model || 'Modèle'}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="h5 text-primary mb-0">
                        {new Intl.NumberFormat('fr-FR').format(imageData.price || 250000)} GNF
                      </span>
                    </div>
                    
                    <button
                      className={`btn btn-warning w-100 ${isAdding ? 'disabled' : ''}`}
                      onClick={(e) => handleAddToCart(imageData, e)}
                      disabled={isAdding || imageData.stock <= 0}
                    >
                      {isAdding ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Ajout...
                        </>
                      ) : imageData.stock > 0 ? (
                        <>
                          <i className="bi bi-cart-plus me-2"></i>
                          Ajouter au panier
                        </>
                      ) : (
                        'Rupture de stock'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Chaussures</h1>
          
          {/* Filtres par catégorie */}
          <div className="mb-4">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn ${selectedCategory === 'homme' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory('homme')}
              >
                <i className="bi bi-person me-2"></i>
                Homme ({images.homme.length})
              </button>
              <button
                type="button"
                className={`btn ${selectedCategory === 'femme' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory('femme')}
              >
                <i className="bi bi-person me-2"></i>
                Femme ({images.femme.length})
              </button>
              <button
                type="button"
                className={`btn ${selectedCategory === 'enfant' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory('enfant')}
              >
                <i className="bi bi-person me-2"></i>
                Enfant ({images.enfant.length})
              </button>
            </div>
          </div>

          {/* Grille d'images */}
          {renderImageGrid(images[selectedCategory])}
        </div>
      </div>
    </div>
  );
};

export default ChaussuresRefactored;
