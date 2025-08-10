import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from "../contexts/LanguageContext";
import { 
  BiArrowBack, 
  BiPlus, 
  BiEdit, 
  BiTrash, 
  BiSearch, 
  BiFilter,
  BiShow,
  BiPackage,
  BiDollar,
  BiStar,
  BiCheckCircle,
  BiXCircle
} from 'react-icons/bi';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useAuth } from '../hooks/useAuth.jsx';
import { useProducts } from '../contexts/ProductsContext';

const GestionProduits = () => {
  const { user } = useAuth();
  const { getVendorProducts, addProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('tous');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [croppedImage, setCroppedImage] = useState(null);

  // Charger les produits du vendeur
  useEffect(() => {
    if (user?.vendorId) {
      const vendorProducts = getVendorProducts(user.vendorId);
      setProducts(vendorProducts);
    }
  }, [user, getVendorProducts]);



  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: '👟',
    // Champs SEO
    seoKeywords: '',
    seoTitle: '',
    seoDescription: '',
    slug: ''
  });

  const statusOptions = [
    { id: 'tous', label: 'Tous les statuts' },
    { id: 'active', label: 'Actif' },
    { id: 'inactive', label: 'Inactif' },
    { id: 'out_of_stock', label: 'Rupture de stock' },
    { id: 'pending', label: 'En attente' }
  ];

  const categories = [
    'Chaussures de sport',
    'Chaussures élégantes',
    'Chaussures casual',
    'Chaussures outdoor',
    'Sandales',
    'Chaussures pour enfants'
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'tous' || product.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.price && newProduct.stock) {
      const product = {
        id: Date.now(), // ID unique
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        status: 'active',
        rating: 0,
        sales: 0,
        sellerName: user?.prenom ? `${user.prenom} ${user.nom || ''}`.trim() : 'Vendeur papasow',
        // Conversion des mots-clés SEO en tableau
        seoKeywords: newProduct.seoKeywords.split(',').map(k => k.trim()).filter(Boolean)
      };

      // Ajouter le produit via le contexte
      const result = addProduct(product, user?.vendorId);
      
      if (result.success) {
        // Recharger les produits
        const vendorProducts = getVendorProducts(user?.vendorId);
        setProducts(vendorProducts);
        
        setNewProduct({ name: '', category: '', price: '', stock: '', description: '', image: '👟', seoKeywords: '', seoTitle: '', seoDescription: '', slug: '' });
        setShowAddModal(false);
        alert('Produit ajouté avec succès ! Il sera visible dans le catalogue papasow.');
      } else {
        alert('Erreur lors de l\'ajout du produit : ' + result.error);
      }
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { bg: '#d4edda', color: '#155724' };
      case 'inactive': return { bg: '#f8d7da', color: '#721c24' };
      case 'out_of_stock': return { bg: '#fff3cd', color: '#856404' };
      case 'pending': return { bg: '#d1ecf1', color: '#0c5460' };
      default: return { bg: '#e9ecef', color: '#495057' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'out_of_stock': return 'Rupture';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  // Suggestion automatique de titre
  const suggestTitle = () => {
    let title = '';
    if (newProduct.brand && newProduct.category) {
      title = `${newProduct.brand} - ${newProduct.category}`;
    } else if (newProduct.category) {
      title = `Produit ${newProduct.category}`;
    } else {
      title = 'Nouveau produit';
    }
    setNewProduct({ ...newProduct, name: title });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', padding: '1rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/vendeur/dashboard" style={{ textDecoration: 'none', color: '#666' }}>
              <BiArrowBack style={{ fontSize: '1.5rem' }} />
            </Link>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '600', color: '#232f3e' }}>
                Gestion des Produits
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                Gérez votre catalogue de produits
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 0' }}>
        {/* Statistiques */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiPackage style={{ fontSize: '2rem', color: '#007bff' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>{products.length}</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Produits total</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiCheckCircle style={{ fontSize: '2rem', color: '#28a745' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {products.filter(p => p.status === 'active').length}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Actifs</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiXCircle style={{ fontSize: '2rem', color: '#dc3545' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {products.filter(p => p.stock === 0).length}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Rupture de stock</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiDollar style={{ fontSize: '2rem', color: '#ffc107' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {products.reduce((sum, p) => sum + p.sales, 0)}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Ventes totales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions et filtres */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <BiPlus />
              Ajouter un produit
            </button>
            
            <div style={{ flex: 1, position: 'relative' }}>
              <BiSearch style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#666' 
              }} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                minWidth: '150px'
              }}
            >
              {statusOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste des produits */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e0e0e0' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600' }}>
              Produits ({filteredProducts.length})
            </h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>
                    Produit
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>
                    Catégorie
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>
                    Prix
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>
                    Stock
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>
                    Statut
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>
                    Ventes
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          fontSize: '2rem', 
                          width: '50px', 
                          height: '50px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '6px'
                        }}>
                          {product.image}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            {product.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {product.category}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#28a745' }}>
                      €{product.price}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        color: product.stock === 0 ? '#dc3545' : 
                               product.stock < 5 ? '#ffc107' : '#28a745',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {product.stock}
                        {product.stock === 0 && <span style={{ color: '#dc3545', fontWeight: 700, marginLeft: 4 }} title="Rupture de stock">(Rupture)</span>}
                        {product.stock > 0 && product.stock < 5 && <span style={{ color: '#ffc107', fontWeight: 700, marginLeft: 4 }} title="Stock faible">(Stock faible)</span>}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        ...getStatusColor(product.status)
                      }}>
                        {getStatusLabel(product.status)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{product.sales}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <BiStar style={{ fontSize: '0.8rem', color: '#ffc107' }} />
                          <span style={{ fontSize: '0.8rem' }}>{product.rating}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setEditingProduct(product)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <BiEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <BiTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Ajouter/Modifier Produit */}
      {(showAddModal || editingProduct) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Image upload et preview */}
              <label>Image du produit</label>
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => setImagePreview(ev.target.result);
                  reader.readAsDataURL(file);
                }
              }} />
              {imagePreview && (
                <div style={{ marginBottom: 10 }}>
                  <ReactCrop src={imagePreview} crop={crop} onChange={setCrop} onComplete={c => setCroppedImage(c)} />
                </div>
              )}
              {/* Suggestion automatique de titre */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="text" placeholder="Nom du produit" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} style={{ flex: 1 }} />
                <button type="button" onClick={suggestTitle} style={{ background: '#eee', border: 'none', borderRadius: 4, padding: '0.5rem 1rem', cursor: 'pointer' }}>Suggérer</button>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Catégorie *
                </label>
                <select
                  value={editingProduct ? editingProduct.category : newProduct.category}
                  onChange={(e) => editingProduct ? 
                    setEditingProduct({...editingProduct, category: e.target.value}) :
                    setNewProduct({...newProduct, category: e.target.value})
                  }
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Prix (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct ? editingProduct.price : newProduct.price}
                    onChange={(e) => editingProduct ? 
                      setEditingProduct({...editingProduct, price: e.target.value}) :
                      setNewProduct({...newProduct, price: e.target.value})
                    }
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={editingProduct ? editingProduct.stock : newProduct.stock}
                    onChange={(e) => editingProduct ? 
                      setEditingProduct({...editingProduct, stock: e.target.value}) :
                      setNewProduct({...newProduct, stock: e.target.value})
                    }
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Description
                </label>
                <textarea
                  value={editingProduct ? editingProduct.description : newProduct.description}
                  onChange={(e) => editingProduct ? 
                    setEditingProduct({...editingProduct, description: e.target.value}) :
                    setNewProduct({...newProduct, description: e.target.value})
                  }
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Champs SEO */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Mots-clés SEO (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={editingProduct ? editingProduct.seoKeywords : newProduct.seoKeywords}
                  onChange={(e) => editingProduct ? 
                    setEditingProduct({...editingProduct, seoKeywords: e.target.value}) :
                    setNewProduct({...newProduct, seoKeywords: e.target.value})
                  }
                  placeholder="Ex: chaussures, sport, running, Nike"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Titre SEO (meta title)
                </label>
                <input
                  type="text"
                  value={editingProduct ? editingProduct.seoTitle : newProduct.seoTitle}
                  onChange={(e) => editingProduct ? 
                    setEditingProduct({...editingProduct, seoTitle: e.target.value}) :
                    setNewProduct({...newProduct, seoTitle: e.target.value})
                  }
                  placeholder="Ex: Chaussures de Running - Papasow"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Description SEO (meta description)
                </label>
                <textarea
                  value={editingProduct ? editingProduct.seoDescription : newProduct.seoDescription}
                  onChange={(e) => editingProduct ? 
                    setEditingProduct({...editingProduct, seoDescription: e.target.value}) :
                    setNewProduct({...newProduct, seoDescription: e.target.value})
                  }
                  placeholder="Ex: Découvrez nos chaussures de running haut de gamme, conçues pour la performance et la durabilité."
                  rows="2"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Slug (URL propre, optionnel)
                </label>
                <input
                  type="text"
                  value={editingProduct ? editingProduct.slug : newProduct.slug}
                  onChange={(e) => editingProduct ? 
                    setEditingProduct({...editingProduct, slug: e.target.value}) :
                    setNewProduct({...newProduct, slug: e.target.value})
                  }
                  placeholder="Ex: chaussures-de-running-papasow"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddProduct}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {editingProduct ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProduits; 