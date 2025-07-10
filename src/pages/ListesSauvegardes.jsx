import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ListesSauvegardes() {
  const { t } = useLanguage();
  const [savedItems, setSavedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Articles sauvegardés par défaut
  const defaultSavedItems = [
    {
      id: 1,
      name: "Nike Air Max 270",
      price: "129.99 €",
      originalPrice: "149.99 €",
      image: "/assets/categorie/arriver (1).png",
      category: "Chaussures de sport",
      brand: "Nike",
      savedDate: "2024-01-15",
      status: "available",
      inStock: true,
      rating: 4.5,
      reviews: 128
    },
    {
      id: 2,
      name: "Adidas Ultraboost 22",
      price: "149.99 €",
      originalPrice: "179.99 €",
      image: "/assets/categorie/arriver (2).png",
      category: "Chaussures de running",
      brand: "Adidas",
      savedDate: "2024-01-10",
      status: "available",
      inStock: true,
      rating: 4.8,
      reviews: 95
    },
    {
      id: 3,
      name: "Puma RS-X",
      price: "89.99 €",
      originalPrice: "89.99 €",
      image: "/assets/categorie/arriver (3).png",
      category: "Chaussures lifestyle",
      brand: "Puma",
      savedDate: "2024-01-08",
      status: "out-of-stock",
      inStock: false,
      rating: 4.2,
      reviews: 67
    }
  ];

  // Charger les articles sauvegardés depuis localStorage
  useEffect(() => {
    const loadSavedItems = () => {
      try {
        const stored = localStorage.getItem('savedForLater');
        if (stored) {
          setSavedItems(JSON.parse(stored));
        } else {
          setSavedItems(defaultSavedItems);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des articles sauvegardés:', error);
        setSavedItems(defaultSavedItems);
      }
    };

    loadSavedItems();
  }, []);

  // Sauvegarder les articles
  const saveItems = (updatedItems) => {
    try {
      localStorage.setItem('savedForLater', JSON.stringify(updatedItems));
      setSavedItems(updatedItems);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Ajouter au panier
  const addToCart = (item) => {
    try {
      const stored = localStorage.getItem('cart');
      const cart = stored ? JSON.parse(stored) : [];
      
      const existingItem = cart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cart.push({ ...item, qty: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    }
  };

  // Supprimer un article
  const removeItem = (itemId) => {
    if (window.confirm("Supprimer cet article de vos sauvegardes ?")) {
      const updatedItems = savedItems.filter(item => item.id !== itemId);
      saveItems(updatedItems);
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  // Supprimer plusieurs articles
  const removeSelectedItems = () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(`Supprimer ${selectedItems.length} article(s) de vos sauvegardes ?`)) {
      const updatedItems = savedItems.filter(item => !selectedItems.includes(item.id));
      saveItems(updatedItems);
      setSelectedItems([]);
    }
  };

  // Ajouter plusieurs articles au panier
  const addSelectedToCart = () => {
    if (selectedItems.length === 0) return;
    
    selectedItems.forEach(itemId => {
      const item = savedItems.find(savedItem => savedItem.id === itemId);
      if (item) {
        addToCart(item);
      }
    });
    
    setSelectedItems([]);
  };

  // Gérer la sélection d'articles
  const handleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Sélectionner tous les articles
  const selectAllItems = () => {
    const availableItems = savedItems.filter(item => item.inStock);
    setSelectedItems(availableItems.map(item => item.id));
  };

  // Désélectionner tous les articles
  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  // Filtrer les articles
  const filteredItems = savedItems.filter(item => {
    switch (filterStatus) {
      case "available":
        return item.inStock;
      case "out-of-stock":
        return !item.inStock;
      case "on-sale":
        return item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.price);
      default:
        return true;
    }
  });

  // Trier les articles
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      case "date":
      default:
        return new Date(b.savedDate) - new Date(a.savedDate);
    }
  });

  const getStatusBadge = (item) => {
    if (!item.inStock) {
      return (
        <span className="badge bg-danger bg-opacity-10 text-danger fw-semibold">
          <i className="bi bi-x-circle-fill me-1"></i>
          Rupture de stock
        </span>
      );
    }
    
    if (item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.price)) {
      return (
        <span className="badge bg-success bg-opacity-10 text-success fw-semibold">
          <i className="bi bi-tag-fill me-1"></i>
          En promotion
        </span>
      );
    }
    
    return (
      <span className="badge bg-success bg-opacity-10 text-success fw-semibold">
        <i className="bi bi-check-circle-fill me-1"></i>
        En stock
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

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
              {/* Fil d'Ariane */}
              <div className="mb-4">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="/" className="text-decoration-none" style={{ color: '#e47911' }}>
                        Accueil
                      </a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="/profil" className="text-decoration-none" style={{ color: '#e47911' }}>
                        Mon compte
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Articles sauvegardés
                    </li>
                  </ol>
                </nav>
              </div>

              {/* En-tête de la page */}
              <div className="bg-white rounded-4 shadow-lg border p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h1 className="fw-bold mb-2" style={{ color: '#232f3e' }}>
                      <i className="bi bi-bookmark-heart me-2"></i>
                      Articles sauvegardés pour plus tard
                    </h1>
                    <p className="text-muted mb-0">
                      Retrouvez vos produits mis de côté et gérez vos achats futurs
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <Link 
                      to="/catalogue"
                      className="btn btn-outline-primary fw-semibold"
                      style={{ borderRadius: '8px' }}
                    >
                      <i className="bi bi-search me-2"></i>
                      Parcourir les produits
                    </Link>
                    <Link 
                      to="/panier"
                      className="btn fw-bold"
                      style={{
                        background: 'linear-gradient(135deg, #e47911 0%, #f0c14b 100%)',
                        border: 'none',
                        color: '#232f3e',
                        borderRadius: '8px'
                      }}
                    >
                      <i className="bi bi-cart me-2"></i>
                      Voir le panier
                    </Link>
                  </div>
                </div>
              </div>

              {/* Filtres et actions */}
              <div className="bg-white rounded-4 shadow-lg border p-4 mb-4">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="selectAll"
                          checked={selectedItems.length === sortedItems.filter(item => item.inStock).length && selectedItems.length > 0}
                          onChange={selectedItems.length === sortedItems.filter(item => item.inStock).length ? deselectAllItems : selectAllItems}
                        />
                        <label className="form-check-label fw-semibold" htmlFor="selectAll">
                          Tout sélectionner
                        </label>
                      </div>
                      {selectedItems.length > 0 && (
                        <span className="text-muted">
                          {selectedItems.length} article(s) sélectionné(s)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex gap-2 justify-content-end">
                      <select
                        className="form-select"
                        style={{ width: 'auto' }}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">Tous les articles</option>
                        <option value="available">En stock</option>
                        <option value="out-of-stock">Rupture de stock</option>
                        <option value="on-sale">En promotion</option>
                      </select>
                      <select
                        className="form-select"
                        style={{ width: 'auto' }}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="date">Plus récents</option>
                        <option value="price-low">Prix croissant</option>
                        <option value="price-high">Prix décroissant</option>
                        <option value="rating">Meilleures notes</option>
                        <option value="name">Ordre alphabétique</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Actions pour les articles sélectionnés */}
                {selectedItems.length > 0 && (
                  <div className="mt-3 pt-3 border-top">
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-primary fw-semibold"
                        onClick={addSelectedToCart}
                        style={{ borderRadius: '8px' }}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        Ajouter {selectedItems.length} article(s) au panier
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger fw-semibold"
                        onClick={removeSelectedItems}
                        style={{ borderRadius: '8px' }}
                      >
                        <i className="bi bi-trash me-2"></i>
                        Supprimer {selectedItems.length} article(s)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Liste des articles */}
              {savedItems.length === 0 ? (
                <div className="bg-white rounded-4 shadow-lg border p-5 text-center">
                  <i className="bi bi-bookmark-x text-muted" style={{ fontSize: '64px' }}></i>
                  <h3 className="fw-bold mt-3" style={{ color: '#232f3e' }}>
                    Aucun article sauvegardé
                  </h3>
                  <p className="text-muted mb-4">
                    Vous n'avez pas encore sauvegardé d'articles pour plus tard
                  </p>
                  <Link 
                    to="/catalogue"
                    className="btn fw-bold px-4 py-2"
                    style={{
                      background: 'linear-gradient(135deg, #e47911 0%, #f0c14b 100%)',
                      border: 'none',
                      color: '#232f3e',
                      borderRadius: '8px'
                    }}
                  >
                    <i className="bi bi-search me-2"></i>
                    Découvrir des produits
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-4 shadow-lg border">
                  {sortedItems.length === 0 ? (
                    <div className="p-5 text-center">
                      <i className="bi bi-funnel-x text-muted" style={{ fontSize: '48px' }}></i>
                      <h5 className="fw-bold mt-3" style={{ color: '#232f3e' }}>
                        Aucun article correspondant aux filtres
                      </h5>
                      <p className="text-muted">
                        Essayez de modifier vos critères de filtrage
                      </p>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="row">
                        {sortedItems.map((item) => (
                          <div key={item.id} className="col-lg-6 mb-4">
                            <div className="border rounded-4 p-3 h-100">
                              <div className="row">
                                <div className="col-md-3">
                                  <div className="position-relative">
                                    <img 
                                      src={item.image || '/assets/images/placeholder.jpg'} 
                                      alt={item.name}
                                      className="img-fluid rounded"
                                      style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                                    />
                                    {item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.price) && (
                                      <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 rounded-bottom-end" style={{ fontSize: '12px' }}>
                                        -{Math.round(((parseFloat(item.originalPrice) - parseFloat(item.price)) / parseFloat(item.originalPrice)) * 100)}%
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="col-md-9">
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div className="flex-grow-1">
                                      <h6 className="fw-bold mb-1" style={{ color: '#232f3e', fontSize: '16px' }}>
                                        {item.name}
                                      </h6>
                                      <p className="text-muted mb-1" style={{ fontSize: '14px' }}>
                                        {item.brand} • {item.category}
                                      </p>
                                    </div>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => handleItemSelection(item.id)}
                                        disabled={!item.inStock}
                                      />
                                    </div>
                                  </div>

                                  <div className="mb-2">
                                    {getStatusBadge(item)}
                                  </div>

                                  <div className="d-flex align-items-center mb-2">
                                    <div className="text-warning me-2">
                                      {[...Array(5)].map((_, i) => (
                                        <i 
                                          key={i} 
                                          className={`bi ${i < Math.floor(item.rating) ? 'bi-star-fill' : 'bi-star'}`}
                                          style={{ fontSize: '14px' }}
                                        ></i>
                                      ))}
                                    </div>
                                    <small className="text-muted">
                                      {item.rating} ({item.reviews} avis)
                                    </small>
                                  </div>

                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                      <span className="fw-bold" style={{ color: '#e47911', fontSize: '18px' }}>
                                        {item.price}
                                      </span>
                                      {item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.price) && (
                                        <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: '14px' }}>
                                          {item.originalPrice}
                                        </span>
                                      )}
                                    </div>
                                    <small className="text-muted">
                                      Sauvegardé le {formatDate(item.savedDate)}
                                    </small>
                                  </div>

                                  <div className="d-flex gap-2">
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm fw-semibold"
                                      onClick={() => addToCart(item)}
                                      disabled={!item.inStock}
                                      style={{ borderRadius: '8px' }}
                                    >
                                      <i className="bi bi-cart-plus me-1"></i>
                                      Ajouter au panier
                                    </button>
                                    <Link 
                                      to={`/product/${item.id}`}
                                      className="btn btn-outline-primary btn-sm fw-semibold"
                                      style={{ borderRadius: '8px' }}
                                    >
                                      <i className="bi bi-eye me-1"></i>
                                      Voir détails
                                    </Link>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => removeItem(item.id)}
                                      style={{ borderRadius: '8px' }}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Statistiques */}
              {savedItems.length > 0 && (
                <div className="bg-white rounded-4 shadow-sm border mt-4 p-4">
                  <h5 className="fw-bold mb-3" style={{ color: '#232f3e' }}>
                    <i className="bi bi-graph-up me-2"></i>
                    Résumé de vos sauvegardes
                  </h5>
                  <div className="row text-center">
                    <div className="col-md-3">
                      <div className="p-3">
                        <h4 className="fw-bold text-primary">{savedItems.length}</h4>
                        <small className="text-muted">Total d'articles</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3">
                        <h4 className="fw-bold text-success">{savedItems.filter(item => item.inStock).length}</h4>
                        <small className="text-muted">En stock</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3">
                        <h4 className="fw-bold text-warning">{savedItems.filter(item => item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.price)).length}</h4>
                        <small className="text-muted">En promotion</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3">
                        <h4 className="fw-bold text-info">{Math.round(savedItems.reduce((sum, item) => sum + parseFloat(item.price), 0))} €</h4>
                        <small className="text-muted">Valeur totale</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
  </div>

      <Footer />
    </>
);
} 