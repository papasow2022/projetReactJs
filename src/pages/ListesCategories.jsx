import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ListesCategories() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    priority: "medium"
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "bi-tags",
    color: "#007bff"
  });
  const [isLoading, setIsLoading] = useState(false);

  // Catégories par défaut
  const defaultCategories = [
    {
      id: 1,
      name: "Chaussures de sport",
      icon: "bi-shoe",
      color: "#28a745",
      products: [
        { id: 1, name: "Nike Air Max 270", price: "129.99 €", image: "/assets/categorie/arriver (1).png", description: "Chaussures de running confortables", priority: "high" },
        { id: 2, name: "Adidas Ultraboost", price: "149.99 €", image: "/assets/categorie/arriver (2).png", description: "Performance et style", priority: "medium" }
      ]
    },
    {
      id: 2,
      name: "Chaussures élégantes",
      icon: "bi-heart",
      color: "#dc3545",
      products: [
        { id: 3, name: "Escarpins classiques", price: "89.99 €", image: "/assets/categorie/arriver (3).png", description: "Élégance et confort", priority: "high" }
      ]
    },
    {
      id: 3,
      name: "Accessoires",
      icon: "bi-bag",
      color: "#ffc107",
      products: [
        { id: 4, name: "Sac à dos sport", price: "59.99 €", image: "/assets/categorie/arriver (4).png", description: "Parfait pour le sport", priority: "low" }
      ]
    }
  ];

  // Charger les catégories depuis localStorage
  useEffect(() => {
    const loadCategories = () => {
      try {
        const stored = localStorage.getItem('categoryLists');
        if (stored) {
          setCategories(JSON.parse(stored));
        } else {
          setCategories(defaultCategories);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setCategories(defaultCategories);
      }
    };

    loadCategories();
  }, []);

  // Sauvegarder les catégories
  const saveCategories = (updatedCategories) => {
    try {
      localStorage.setItem('categoryLists', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Ajouter une nouvelle catégorie
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    const category = {
      id: Date.now(),
      name: newCategory.name,
      icon: newCategory.icon,
      color: newCategory.color,
      products: []
    };

    const updatedCategories = [...categories, category];
    saveCategories(updatedCategories);
    setNewCategory({ name: "", icon: "bi-tags", color: "#007bff" });
    setShowCategoryModal(false);
  };

  // Ajouter un produit à une catégorie
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !selectedCategory) return;

    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: newProduct.price,
      image: newProduct.image,
      description: newProduct.description,
      priority: newProduct.priority
    };

    const updatedCategories = categories.map(cat => {
      if (cat.id === selectedCategory.id) {
        return { ...cat, products: [...cat.products, product] };
      }
      return cat;
    });

    saveCategories(updatedCategories);
    setNewProduct({ name: "", price: "", image: "", description: "", priority: "medium" });
    setShowAddModal(false);
  };

  // Supprimer une catégorie
  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie et tous ses produits ?")) {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      saveCategories(updatedCategories);
      if (selectedCategory?.id === categoryId) {
        setSelectedCategory(null);
      }
    }
  };

  // Supprimer un produit
  const handleDeleteProduct = (categoryId, productId) => {
    if (window.confirm("Supprimer ce produit de la liste ?")) {
      const updatedCategories = categories.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, products: cat.products.filter(p => p.id !== productId) };
        }
        return cat;
      });
      saveCategories(updatedCategories);
    }
  };

  // Ajouter au panier
  const addToCart = (product) => {
    try {
      const stored = localStorage.getItem('cart');
      const cart = stored ? JSON.parse(stored) : [];
      
      const existingItem = cart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cart.push({ ...product, qty: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Priorité haute';
      case 'medium': return 'Priorité moyenne';
      case 'low': return 'Priorité basse';
      default: return 'Non définie';
    }
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
                      Listes par catégorie
                    </li>
                  </ol>
                </nav>
              </div>

              {/* En-tête de la page */}
              <div className="bg-white rounded-4 shadow-lg border p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h1 className="fw-bold mb-2" style={{ color: '#232f3e' }}>
                      <i className="bi bi-collection me-2"></i>
                      Listes par catégorie
                    </h1>
                    <p className="text-muted mb-0">
                      Organisez vos produits par type et gérez vos priorités d'achat
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary fw-semibold"
                      onClick={() => setShowCategoryModal(true)}
                      style={{ borderRadius: '8px' }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Nouvelle catégorie
                    </button>
                    {selectedCategory && (
                      <button
                        type="button"
                        className="btn fw-bold"
                        onClick={() => setShowAddModal(true)}
                        style={{
                          background: 'linear-gradient(135deg, #e47911 0%, #f0c14b 100%)',
                          border: 'none',
                          color: '#232f3e',
                          borderRadius: '8px'
                        }}
                      >
                        <i className="bi bi-plus me-2"></i>
                        Ajouter un produit
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Liste des catégories */}
                <div className="col-lg-4">
                  <div className="bg-white rounded-4 shadow-lg border p-4">
                    <h4 className="fw-bold mb-3" style={{ color: '#232f3e' }}>
                      <i className="bi bi-folder me-2"></i>
                      Mes catégories
                    </h4>
                    
                    {categories.length === 0 ? (
                      <div className="text-center py-4">
                        <i className="bi bi-folder-x text-muted" style={{ fontSize: '48px' }}></i>
                        <p className="text-muted mt-2">Aucune catégorie créée</p>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => setShowCategoryModal(true)}
                        >
                          Créer ma première catégorie
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className={`p-3 rounded-3 cursor-pointer transition-all ${
                              selectedCategory?.id === category.id 
                                ? 'bg-primary bg-opacity-10 border border-primary' 
                                : 'bg-light hover:bg-light'
                            }`}
                            onClick={() => setSelectedCategory(category)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex align-items-center">
                                <div 
                                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                  style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    backgroundColor: category.color,
                                    color: 'white'
                                  }}
                                >
                                  <i className={`bi ${category.icon}`} style={{ fontSize: '18px' }}></i>
                                </div>
                                <div>
                                  <h6 className="fw-bold mb-1" style={{ color: '#232f3e' }}>
                                    {category.name}
                                  </h6>
                                  <small className="text-muted">
                                    {category.products.length} produit{category.products.length > 1 ? 's' : ''}
                                  </small>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCategory(category.id);
                                }}
                                style={{ borderRadius: '50%', width: '30px', height: '30px', padding: 0 }}
                              >
                                <i className="bi bi-trash" style={{ fontSize: '12px' }}></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Produits de la catégorie sélectionnée */}
                <div className="col-lg-8">
                  {selectedCategory ? (
                    <div className="bg-white rounded-4 shadow-lg border p-4">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <h3 className="fw-bold mb-1" style={{ color: '#232f3e' }}>
                            <i className={`bi ${selectedCategory.icon} me-2`} style={{ color: selectedCategory.color }}></i>
                            {selectedCategory.name}
                          </h3>
                          <p className="text-muted mb-0">
                            {selectedCategory.products.length} produit{selectedCategory.products.length > 1 ? 's' : ''} dans cette catégorie
                          </p>
                        </div>
                        <button
                          type="button"
                          className="btn fw-bold"
                          onClick={() => setShowAddModal(true)}
                          style={{
                            background: 'linear-gradient(135deg, #e47911 0%, #f0c14b 100%)',
                            border: 'none',
                            color: '#232f3e',
                            borderRadius: '8px'
                          }}
                        >
                          <i className="bi bi-plus me-2"></i>
                          Ajouter un produit
                        </button>
                      </div>

                      {selectedCategory.products.length === 0 ? (
                        <div className="text-center py-5">
                          <i className="bi bi-box text-muted" style={{ fontSize: '64px' }}></i>
                          <h5 className="fw-bold mt-3" style={{ color: '#232f3e' }}>
                            Aucun produit dans cette catégorie
                          </h5>
                          <p className="text-muted mb-3">
                            Commencez par ajouter des produits à votre liste
                          </p>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setShowAddModal(true)}
                          >
                            <i className="bi bi-plus me-2"></i>
                            Ajouter mon premier produit
                          </button>
                        </div>
                      ) : (
                        <div className="row">
                          {selectedCategory.products.map((product) => (
                            <div key={product.id} className="col-md-6 col-lg-4 mb-3">
                              <div className="border rounded-3 p-3 h-100">
                                <div className="position-relative mb-3">
                                  <img 
                                    src={product.image || '/assets/images/placeholder.jpg'} 
                                    alt={product.name}
                                    className="img-fluid rounded"
                                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                  />
                                  <span 
                                    className="badge position-absolute top-0 start-0 m-2"
                                    style={{ 
                                      backgroundColor: getPriorityColor(product.priority),
                                      color: 'white'
                                    }}
                                  >
                                    {getPriorityLabel(product.priority)}
                                  </span>
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm position-absolute top-0 end-0 m-2"
                                    onClick={() => handleDeleteProduct(selectedCategory.id, product.id)}
                                    style={{ borderRadius: '50%', width: '30px', height: '30px', padding: 0 }}
                                  >
                                    <i className="bi bi-x" style={{ fontSize: '12px' }}></i>
                                  </button>
                                </div>
                                
                                <h6 className="fw-bold mb-2" style={{ color: '#232f3e', fontSize: '14px' }}>
                                  {product.name}
                                </h6>
                                
                                {product.description && (
                                  <p className="text-muted mb-2" style={{ fontSize: '12px' }}>
                                    {product.description}
                                  </p>
                                )}
                                
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <span className="fw-bold" style={{ color: '#e47911', fontSize: '16px' }}>
                                    {product.price}
                                  </span>
                                </div>
                                
                                <div className="d-grid gap-2">
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm fw-semibold"
                                    onClick={() => addToCart(product)}
                                    style={{ borderRadius: '8px' }}
                                  >
                                    <i className="bi bi-cart-plus me-1"></i>
                                    Ajouter au panier
                                  </button>
                                  <Link 
                                    to={`/product/${product.id}`}
                                    className="btn btn-outline-primary btn-sm fw-semibold"
                                    style={{ borderRadius: '8px' }}
                                  >
                                    <i className="bi bi-eye me-1"></i>
                                    Voir détails
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-4 shadow-lg border p-5 text-center">
                      <i className="bi bi-arrow-left-circle text-muted" style={{ fontSize: '64px' }}></i>
                      <h4 className="fw-bold mt-3" style={{ color: '#232f3e' }}>
                        Sélectionnez une catégorie
                      </h4>
                      <p className="text-muted">
                        Choisissez une catégorie dans la liste pour voir ses produits
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour ajouter une catégorie */}
      {showCategoryModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Créer une nouvelle catégorie</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCategoryModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddCategory}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Nom de la catégorie</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      placeholder="Ex: Chaussures de sport"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Icône</label>
                    <select
                      className="form-select"
                      value={newCategory.icon}
                      onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                    >
                      <option value="bi-tags">🏷️ Tags</option>
                      <option value="bi-shoe">👟 Chaussures</option>
                      <option value="bi-heart">❤️ Cœur</option>
                      <option value="bi-bag">👜 Sac</option>
                      <option value="bi-star">⭐ Étoile</option>
                      <option value="bi-gift">🎁 Cadeau</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Couleur</label>
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                      style={{ width: '100%', height: '40px' }}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCategoryModal(false)}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary fw-semibold">
                    Créer la catégorie
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour ajouter un produit */}
      {showAddModal && selectedCategory && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  Ajouter un produit à "{selectedCategory.name}"
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddProduct}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Nom du produit</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Ex: Nike Air Max 270"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Prix</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="Ex: 129.99 €"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Image (URL)</label>
                    <input
                      type="url"
                      className="form-control"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      placeholder="https://exemple.com/image.jpg"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Description du produit..."
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Priorité</label>
                    <select
                      className="form-select"
                      value={newProduct.priority}
                      onChange={(e) => setNewProduct({...newProduct, priority: e.target.value})}
                    >
                      <option value="high">Priorité haute</option>
                      <option value="medium">Priorité moyenne</option>
                      <option value="low">Priorité basse</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary fw-semibold">
                    Ajouter le produit
                  </button>
                </div>
              </form>
            </div>
          </div>
  </div>
      )}

      <Footer />
    </>
);
} 