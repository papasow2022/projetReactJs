import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import useStock from '../hooks/useStock';
import SizeSelector from '../components/SizeSelector';
import '../amazon-like.css';

const Chaussures = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { checkStock, reserveStock } = useStock();
  
  const [images, setImages] = useState({
    homme: [],
    femme: [],
    enfant: []
  });
  const [localStock, setLocalStock] = useState({}); // Stock local pour gérer les diminutions
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('homme');
  const [selectedSizes, setSelectedSizes] = useState({}); // Taille sélectionnée par produit
  const [isAddingToCart, setIsAddingToCart] = useState({});

  // Fonction pour recharger les images depuis le catalogue
  const fetchImages = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      
      // Récupérer tous les produits du catalogue
      const response = await fetch(`${baseUrl}/api/catalogue`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du catalogue');
      }
      
      const allProducts = await response.json();
      
      // Organiser par catégorie
      const organizedImages = {
        homme: allProducts.filter(product => product.category === 'homme'),
        femme: allProducts.filter(product => product.category === 'femme'),
        enfant: allProducts.filter(product => product.category === 'enfant')
      };

      setImages(organizedImages);

      // Initialiser le stock local avec les données réelles du catalogue (seulement si pas déjà défini)
      setLocalStock(prevStock => {
        console.log('🔄 fetchImages - Stock précédent:', prevStock);
        const newStock = { ...prevStock };
        allProducts.forEach(product => {
          if (newStock[product.path] === undefined) {
            newStock[product.path] = product.stock || 8;
            console.log('🆕 Nouveau produit ajouté au stock:', product.path, '=', product.stock || 8);
          } else {
            console.log('✅ Stock préservé pour:', product.path, '=', newStock[product.path]);
          }
        });
        console.log('📦 Stock final après fetchImages:', newStock);
        return newStock;
      });
      
      console.log('📦 Catalogue chargé:', {
        total: allProducts.length,
        homme: organizedImages.homme.length,
        femme: organizedImages.femme.length,
        enfant: organizedImages.enfant.length
      });
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement du catalogue:', error);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les images depuis le backend au chargement
  useEffect(() => {
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

  // Ajouter directement au panier avec vérification du stock réel
  const handleAddToCart = async (imageData, event) => {
    event.stopPropagation();
    
    const productPath = imageData.path;
    setIsAddingToCart(prev => ({ ...prev, [productPath]: true }));

    try {
      console.log('🛒 Tentative d\'ajout au panier:', productPath);
      
      // 1. Réserver le stock (inclut la vérification)
      const reserveResult = await reserveStock(productPath, 1);
      
      if (!reserveResult.success) {
        alert(reserveResult.message || 'Erreur lors de la réservation du stock');
        return;
      }
      
      // 3. Vérifier qu'une taille est sélectionnée
      const selectedSize = selectedSizes[productPath];
      if (!selectedSize) {
        alert('Veuillez sélectionner une taille avant d\'ajouter au panier');
        return;
      }

      // 4. Créer le produit pour le panier
      const product = {
        id: imageData._id || imageData.id, // Utiliser l'ID MongoDB au lieu du path
        productId: imageData._id || imageData.id, // ID pour le backend
        name: imageData.name || imageData.alt || 'Chaussure',
        price: imageData.price || 250000,
        image: imageData.path,
        stock: reserveResult.remainingStock, // Stock mis à jour depuis la DB
        brand: imageData.brand || 'Marque',
        category: 'chaussure', // Type de produit
        subcategory: selectedCategory, // Genre (homme/femme/enfant)
        genre: selectedCategory, // Genre pour le backend
        color: imageData.color || 'Non spécifié',
        size: selectedSize, // Taille sélectionnée
        description: imageData.description || 'Chaussure de qualité'
      };

      // 4. Ajouter au panier
      const result = await addToCart(product, 1);
      
      if (result.success) {
        console.log('✅ Produit ajouté au panier:', product.name);
        
        // 5. Mettre à jour le stock local en diminuant de 1
        setLocalStock(prev => {
          const currentStock = prev[productPath] || imageData.stock || 8;
          const newStock = Math.max(0, currentStock - 1);
          
          console.log('📉 Stock mis à jour (simulation):', {
            path: productPath,
            currentStock,
            newStock
          });
          
          return {
      ...prev,
            [productPath]: newStock
          };
        });
        
        // 6. NE PAS recharger les données pour garder la simulation
        console.log('✅ Stock local mis à jour, pas de rechargement DB');
        
      } else {
        console.error('❌ Erreur ajout panier:', result.message);
        alert(result.message || 'Erreur lors de l\'ajout au panier');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('Erreur lors de l\'ajout au panier: ' + error.message);
    } finally {
      setIsAddingToCart(prev => ({ ...prev, [productPath]: false }));
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
                    <span className={`badge ${(localStock[imageData.path] !== undefined ? localStock[imageData.path] : imageData.stock) > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {(localStock[imageData.path] !== undefined ? localStock[imageData.path] : imageData.stock) > 0 ? `${localStock[imageData.path] !== undefined ? localStock[imageData.path] : imageData.stock} en stock` : 'Quantité insuffisante'}
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

                    {/* Sélecteur de taille */}
                    <div className="mb-3">
                      <SizeSelector
                        product={imageData}
                        selectedSize={selectedSizes[imageData.path]}
                        onSizeChange={(size) => {
                          setSelectedSizes(prev => ({
                            ...prev,
                            [imageData.path]: size
                          }));
                        }}
                        disabled={isAdding}
                      />
                    </div>

                    <button 
                      className={`btn btn-warning w-100 ${isAdding ? 'disabled' : ''}`}
                      onClick={(e) => handleAddToCart(imageData, e)}
                      disabled={isAdding || (localStock[imageData.path] !== undefined ? localStock[imageData.path] : imageData.stock) <= 0}
                    >
                      {isAdding ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Ajout...
                        </>
                      ) : (localStock[imageData.path] !== undefined ? localStock[imageData.path] : imageData.stock) > 0 ? (
                        <>
                          <i className="bi bi-cart-plus me-2"></i>
                          Ajouter au panier
                                    </>
                                  ) : (
                                    <>
                          <i className="bi bi-x-circle me-2"></i>
                          Quantité insuffisante
                                    </>
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

export default Chaussures; 
