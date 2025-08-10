import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ProductsContext } from '../contexts/ProductsContext';
import Footer from "../components/Footer";

import { useCart } from '../contexts/CartContext';


const formatGNF = (amount) =>
  amount
    ? new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " GNF"
    : "0 GNF";

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  for (let i = 0; i < fullStars; i++) stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
  if (hasHalfStar) stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) stars.push(<i key={`empty-${i}`} className="bi bi-star text-warning"></i>);
  return stars;
};

export default function ProductDetail() {
  const { productId } = useParams();
  const { products } = useContext(ProductsContext);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: 80,
          fontSize: 22,
          color: "#dc3545",
        }}
      >
        Produit non trouvé
      </div>
    );
  }

  // Gestion des variantes
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(selectedVariant.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  // Questions/Réponses mock
  const [questions, setQuestions] = useState([
    { user: 'Fatou B.', question: 'Est-ce que la chaussure taille grand ?', date: '2024-01-21', answer: 'Elle taille normalement, prenez votre pointure habituelle.' },
    { user: 'Moussa K.', question: 'Est-elle imperméable ?', date: '2024-01-19', answer: 'Elle résiste à la pluie légère mais n’est pas 100% imperméable.' }
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  // Panier et sidebar
  const { addToCart, cartItems, setShowCartSidebar } = useCart();

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });
  const addToWishlist = (item) => {
    const exists = wishlist.some(w => w.id === item.id && w.color === item.color && w.size === item.size);
    if (!exists) {
      const updated = [...wishlist, item];
      setWishlist(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      alert('Produit ajouté à votre liste de souhaits !');
    } else {
      alert('Ce produit est déjà dans votre liste de souhaits.');
    }
  };

  // Reçu cadeau
  const [giftReceipt, setGiftReceipt] = useState(false);
  const giftInfo = "Un reçu cadeau permet d'offrir ce produit sans afficher le prix dans le colis. Pratique pour les cadeaux !";

  // Quand on change de variante, on remet l'image principale à la première
  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
    setSelectedImageIdx(0);
    setSelectedSize(variant.sizes[0]);
  };

  // Produits similaires (exemple simplifié)
  const similarProducts = products.filter(p => p.id !== product.id && p.category === product.category);
  // Bloc fréquemment achetés ensemble (exemple simplifié)
  const frequentlyBoughtTogether = [product, ...similarProducts.slice(0, 2)];
  // Sélection des produits à acheter ensemble
  const [selectedTogether, setSelectedTogether] = useState(frequentlyBoughtTogether.map(p => p.id));
  const handleToggleTogether = (id) => {
    setSelectedTogether(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };
  const togetherTotal = frequentlyBoughtTogether
    .filter(p => selectedTogether.includes(p.id))
    .reduce((sum, p) => sum + (p.variants[0].price || 0), 0);

  // Ajouter au panier (produit principal ou groupé)
  const handleAddToCart = async (qty = 1) => {
    const newItem = {
      id: product.id,
      name: product.name,
      price: selectedVariant.price,
      size: selectedSize,
      color: selectedVariant.color,
      qty,
      image: selectedVariant.images[selectedImageIdx], // image de la variante sélectionnée
      gift: giftReceipt
    };
    
    const result = await addToCart(newItem, qty);
    if (result.success) {
      setShowCartSidebar(true);
    }
  };
  // Ajouter tous les produits sélectionnés ensemble
  const handleAddTogether = async () => {
    const items = frequentlyBoughtTogether.filter(p => selectedTogether.includes(p.id));
    
    for (const item of items) {
      const cartItem = {
        id: item.id,
        name: item.name,
        price: item.variants ? item.variants[0].price : item.price,
        size: item.variants ? item.variants[0].sizes[0] : undefined,
        color: item.variants ? item.variants[0].color : undefined,
        qty: 1,
        image: item.variants ? item.variants[0].images[0] : item.image,
        gift: false
      };
      
      await addToCart(cartItem, 1);
    }
    
    setShowCartSidebar(true);
  };
  // Acheter maintenant (redirige vers la vraie page de paiement)
  const handleBuyNow = () => {
    // Créer un objet représentant le produit à acheter immédiatement
    const buyNowItem = {
      id: product.id,
      name: product.name,
      price: selectedVariant.price,
      size: selectedSize,
      color: selectedVariant.color,
      qty: quantity,
      image: selectedVariant.images[selectedImageIdx],
      gift: giftReceipt
    };
    // Stocker dans le localStorage sous une clé spéciale
    localStorage.setItem('buyNow', JSON.stringify([buyNowItem]));
    // Rediriger vers la page de paiement
    window.location.href = '/paiement';
  };

  // Avis clients mock
  const avisClients = [
    {
      user: 'Sophie L.',
      rating: 5,
      date: '2024-01-20',
      text: 'Superbes chaussures, très confortables et stylées !',
      photos: [selectedVariant.images[0]]
    },
    {
      user: 'Amadou D.',
      rating: 4,
      date: '2024-01-18',
      text: 'Bonne qualité, taille un peu grand. Livraison rapide.',
      photos: [selectedVariant.images[1] || selectedVariant.images[0]]
    }
  ];
  // Pagination avis clients
  const [avisPage, setAvisPage] = useState(1);
  const avisParPage = 2;
  const avisTotalPages = Math.ceil(avisClients.length / avisParPage);
  const avisAffiches = avisClients.slice((avisPage - 1) * avisParPage, avisPage * avisParPage);



  return (
    <>
      <div className="container py-5" style={{ maxWidth: 1300, paddingBottom: 0 }}>
        <div className="row g-4 align-items-start">
          {/* Galerie d'images à gauche */}
          <div className="col-md-4">
            <div className="d-flex flex-row flex-md-column gap-2 align-items-start">
              {/* Galerie verticale : images de la couleur sélectionnée */}
              <div className="d-flex flex-md-column flex-row gap-2 align-items-center">
                {selectedVariant.images.map((img, idx) => (
                  <img
                    key={img}
                    src={img}
                    alt={selectedVariant.color + ' ' + (idx + 1)}
                    className={`rounded border ${selectedImageIdx === idx ? 'border-primary' : 'border-light'}`}
                    style={{ width: 56, height: 56, objectFit: 'cover', cursor: 'pointer', background: '#fff' }}
                    onClick={() => setSelectedImageIdx(idx)}
                    onError={(e) => {
                      e.target.src = '/assets/chaussure/blanc1.jpg'; // Image de fallback
                    }}
                  />
                ))}
              </div>
              {/* Image principale */}
              <div style={{ flex: 1, textAlign: 'center', position: 'relative', minWidth: 0 }}>
                <img
                  src={selectedVariant.images[selectedImageIdx]}
                  alt={product.name}
                  className="img-fluid mb-2"
                  style={{ maxHeight: 340, objectFit: 'contain', borderRadius: 8, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
                  onError={(e) => {
                    e.target.src = '/assets/chaussure/blanc1.jpg'; // Image de fallback
                  }}
                />
              </div>
            </div>
          </div>
          {/* Infos produit au centre */}
          <div className="col-md-5">
            <h2 className="fw-bold mb-2" style={{ color: '#2563eb' }}>{product.name}</h2>
            <div className="mb-2 d-flex align-items-center" style={{ fontSize: 15 }}>
              {renderStars(product.rating)}
              <span className="ms-2 text-primary fw-bold">{product.rating}</span>
              <span className="ms-2 text-muted">({product.reviewCount} avis)</span>
            </div>
            <div className="mb-3">
              <span className="fw-bold text-danger" style={{ fontSize: 28 }}>{formatGNF(selectedVariant.price)}</span>
              {product.originalPrice && (
                <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: 18 }}>{formatGNF(product.originalPrice)}</span>
              )}
              {product.discount > 0 && (
                <span className="badge bg-success ms-2">-{product.discount}%</span>
              )}
            </div>
            <div className="mb-3">
              <span className="badge bg-info me-2">Homme</span>
              <span className="badge bg-success">{product.category}</span>
            </div>
            <div className="mb-3">
              <span className="text-success fw-bold">En stock</span>
              <span className="ms-3 text-info">Livraison gratuite demain</span>
            </div>
            {/* Sélecteurs couleur/taille/quantité */}
            <div className="mb-2">
              <label className="form-label fw-bold mb-1">Couleur :</label>
              <div className="d-flex gap-2 flex-wrap">
                {product.variants.map((variant, idx) => (
                  <div
                    key={variant.color}
                    className={`border rounded p-1 ${selectedVariant.color === variant.color ? 'border-primary' : 'border-light'}`}
                    style={{ cursor: 'pointer', minWidth: 32 }}
                    onClick={() => handleVariantClick(variant)}
                  >
                    <img 
                      src={variant.images[0]} 
                      alt={variant.color} 
                      style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: 4 }}
                      onError={(e) => {
                        e.target.src = '/assets/chaussure/blanc1.jpg'; // Image de fallback
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label fw-bold mb-1">Taille :</label>
              <div className="d-flex gap-2 flex-wrap">
                {selectedVariant.sizes.map((size) => (
                  <button
                    key={size}
                    className={`btn btn-sm ${selectedSize === size ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setSelectedSize(size)}
                    style={{ minWidth: 40, fontSize: 13, fontWeight: 500 }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label fw-bold mb-1">Quantité :</label>
              <input type="number" min={1} max={10} value={quantity} onChange={e => setQuantity(Number(e.target.value))} style={{ width: 60 }} className="form-control d-inline-block ms-2" />
            </div>
            <div className="d-flex gap-2 mt-3">
                              <button className="btn btn-warning fw-bold" style={{ fontSize: 17, color: '#232f3e' }} onClick={() => handleAddToCart(quantity)}>Ajouter au panier</button>
              <button className="btn btn-primary fw-bold" style={{ fontSize: 17, background: '#2563eb', border: 'none' }} onClick={handleBuyNow}>Acheter maintenant</button>
            </div>
            <div className="mt-4">
              <h5>Description du produit</h5>
              <p>{product.description}</p>
            </div>
          </div>
          {/* Colonne droite Amazon-like */}
          <div className="col-md-3">
            <div className="bg-light rounded-3 p-2 mb-4 d-flex align-items-center justify-content-between" style={{ border: '1px solid #e3e6e6' }}>
              <div>
                <i className="bi bi-geo-alt text-primary me-2"></i>
                <span className="fw-semibold">Livraison à</span>
                <span className="ms-2">Mamadou Dian - Marseille</span>
              </div>
              <button className="btn btn-link p-0" style={{ fontSize: 15 }}>Changer d'adresse</button>
            </div>
            <div className="card p-3 shadow-sm" style={{ borderRadius: 10, maxWidth: 340 }}>
              <div className="mb-2">
                <span className="fw-bold text-danger" style={{ fontSize: 26 }}>{formatGNF(selectedVariant.price)}</span>
                {product.originalPrice && (
                  <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: 16 }}>{formatGNF(product.originalPrice)}</span>
                )}
                {product.discount > 0 && (
                  <span className="badge bg-success ms-2">-{product.discount}%</span>
                )}
              </div>
              <div className="mb-2" style={{ fontSize: 15 }}>
                <span className="text-success fw-bold">En stock</span>
              </div>
              <div className="mb-2" style={{ fontSize: 15 }}>
                <span>Livraison : <b>Gratuite demain</b></span>
              </div>
              <div className="mb-2" style={{ fontSize: 15 }}>
                <span>Vendu par <b>Boutique</b></span>
                <span className="badge bg-primary ms-2">Vendeur vérifié</span>
              </div>
              <div className="mb-2">
                <label className="form-label fw-bold mb-1">Quantité :</label>
                <select className="form-select d-inline-block ms-2" style={{ width: 80, display: 'inline-block' }} value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
                  {[...Array(10).keys()].map(i => <option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
              </div>
                              <button className="btn btn-warning w-100 mb-2" style={{ fontWeight: 'bold', fontSize: 17 }} onClick={() => handleAddToCart(quantity)}>Ajouter au panier</button>
              <button className="btn w-100 mb-2" style={{ background: '#ffa41c', color: '#232f3e', fontWeight: 'bold', fontSize: 17 }} onClick={handleBuyNow}>Acheter maintenant</button>
              <div className="mt-2 small text-muted">
                <div><i className="bi bi-shield-check text-info me-1"></i>Paiement sécurisé SSL</div>
                <div><i className="bi bi-arrow-counterclockwise text-success me-1"></i>Retours gratuits 30j</div>
                <div><i className="bi bi-truck text-primary me-1"></i>Livraison rapide</div>
              </div>
              <div className="form-check mt-2">
                <input className="form-check-input" type="checkbox" id="gift" checked={giftReceipt} onChange={() => setGiftReceipt(!giftReceipt)} />
                <label className="form-check-label" htmlFor="gift">Ajouter un reçu cadeau</label>
                {giftReceipt && (
                  <div className="mt-1 small text-muted">
                    <i className="bi bi-info-circle-fill text-info me-1"></i>
                    {giftInfo}
                  </div>
                )}
              </div>
              <button className="btn btn-outline-secondary w-100 mt-2" onClick={() => addToWishlist(product)}>Ajouter à la liste</button>
            </div>
          </div>
        </div>
        {/* Onglets Amazon-like */}
        <div className="mt-5">
          <ul className="nav nav-tabs mb-3" id="productTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button className={`nav-link${activeTab === 'description' ? ' active' : ''}`} onClick={() => setActiveTab('description')} type="button">Description</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className={`nav-link${activeTab === 'specs' ? ' active' : ''}`} onClick={() => setActiveTab('specs')} type="button">Caractéristiques</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className={`nav-link${activeTab === 'avis' ? ' active' : ''}`} onClick={() => setActiveTab('avis')} type="button">Avis clients</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className={`nav-link${activeTab === 'qa' ? ' active' : ''}`} onClick={() => setActiveTab('qa')} type="button">Questions/Réponses</button>
            </li>
          </ul>
          <div className="tab-content bg-white p-4 rounded shadow-sm mb-4">
            {activeTab === 'description' && (
              <div>
                <h4>Description détaillée</h4>
                <p>{product.description}</p>
                <ul>
                  <li>Technologie Air Max pour un amorti optimal</li>
                  <li>Semelle extérieure en caoutchouc durable</li>
                  <li>Tige en mesh respirant</li>
                  <li>Doublure confortable</li>
                  <li>Poids léger : 320g</li>
                </ul>
              </div>
            )}
            {activeTab === 'specs' && (
              <div>
                <h4>Caractéristiques techniques</h4>
                <ul>
                  <li>Catégorie : {product.category}</li>
                  <li>Prix : {formatGNF(selectedVariant.price)}</li>
                  <li>Note : {product.rating} / 5</li>
                </ul>
              </div>
            )}
            {activeTab === 'avis' && (
              <div>
                <h4>Avis clients</h4>
                {avisClients.length === 0 ? <div>Aucun avis pour ce produit.</div> : (
                  <div>
                    {avisAffiches.map((avis, idx) => (
                      <div key={idx} className="border-bottom pb-3 mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <span className="fw-bold me-2">{avis.user}</span>
                          {renderStars(avis.rating)}
                          <span className="ms-2 text-muted" style={{ fontSize: 13 }}>{avis.date}</span>
                        </div>
                        <div>{avis.text}</div>
                        {avis.photos && avis.photos.length > 0 && (
                          <div className="d-flex gap-2 mt-2">
                            {avis.photos.map((p, i) => <img key={i} src={p} alt="avis" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} />)}
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Pagination */}
                    {avisTotalPages > 1 && (
                      <div className="d-flex gap-2 justify-content-center align-items-center mt-3">
                        <button className="btn btn-sm btn-outline-primary" disabled={avisPage === 1} onClick={() => setAvisPage(avisPage - 1)}>Précédent</button>
                        <span>Page {avisPage} / {avisTotalPages}</span>
                        <button className="btn btn-sm btn-outline-primary" disabled={avisPage === avisTotalPages} onClick={() => setAvisPage(avisPage + 1)}>Suivant</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'qa' && (
              <div>
                <h4>Questions & Réponses</h4>
                <div className="mb-3">
                  <strong>Conseils d’entretien :</strong>
                  <ul>
                    <li>Nettoyez vos chaussures avec un chiffon doux et humide.</li>
                    <li>Évitez l'exposition prolongée au soleil pour préserver les couleurs.</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <strong>Questions des clients :</strong>
                  {questions.length === 0 ? <div className="text-muted">Aucune question pour ce produit.</div> : (
                    <ul className="list-group mb-3">
                      {questions.map((q, idx) => (
                        <li key={idx} className="list-group-item">
                          <div className="fw-bold mb-1">{q.user} <span className="text-muted" style={{ fontSize: 13 }}>({q.date})</span></div>
                          <div className="mb-1">Q : {q.question}</div>
                          {q.answer && <div className="text-success">R : {q.answer}</div>}
                        </li>
                      ))}
                    </ul>
                  )}
                  <form className="d-flex gap-2 mt-2" onSubmit={e => { e.preventDefault(); if (newQuestion.trim()) { setQuestions([{ user: 'Vous', question: newQuestion, date: new Date().toISOString().slice(0,10), answer: null }, ...questions]); setNewQuestion(''); } }}>
                    <input type="text" className="form-control" placeholder="Posez votre question..." style={{ maxWidth: 300 }} value={newQuestion} onChange={e => setNewQuestion(e.target.value)} />
                    <button className="btn btn-primary" type="submit">Envoyer</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Carrousel produits similaires */}
        {similarProducts.length > 0 && (
          <div className="mt-5">
            <h4>Produits similaires</h4>
            <div className="d-flex overflow-auto gap-3 pb-2">
              {similarProducts.map((prod, idx) => (
                <div key={prod.id} className="card border-0 shadow-sm" style={{ minWidth: 180, maxWidth: 200 }}>
                  <img src={prod.variants[0].images[0]} alt={prod.name} style={{ height: 90, objectFit: 'contain', marginTop: 10 }} />
                  <div className="card-body p-2">
                    <div className="fw-bold" style={{ fontSize: 15 }}>{prod.name}</div>
                    <div className="text-danger fw-bold mb-2">{formatGNF(prod.variants[0].price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Bloc fréquemment achetés ensemble amélioré */}
        <div className="bg-white rounded shadow-sm p-3 my-4">
          <h5 className="fw-bold mb-3" style={{ color: '#2563eb' }}><i className="bi bi-plus-circle me-2 text-primary"></i>Fréquemment achetés ensemble</h5>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            {frequentlyBoughtTogether.map((prod, idx) => (
              <div key={prod.id} className="card border-0 shadow-sm text-center p-2" style={{ minWidth: 140, maxWidth: 160, borderColor: '#2563eb' }}>
                <input type="checkbox" checked={selectedTogether.includes(prod.id)} onChange={() => handleToggleTogether(prod.id)} />
                <img src={prod.variants[0].images[0]} alt={prod.name} style={{ height: 70, objectFit: 'contain', marginBottom: 8 }} />
                <div className="fw-bold mb-1" style={{ fontSize: 14 }}>{prod.name}</div>
                <div className="text-danger fw-bold mb-1">{formatGNF(prod.variants[0].price)}</div>
              </div>
            ))}
            <div className="fw-bold ms-3" style={{ fontSize: 18, color: '#2563eb' }}>Total : {formatGNF(togetherTotal)}</div>
            <button className="btn btn-primary fw-bold ms-2" style={{ background: '#2563eb', border: 'none' }} onClick={handleAddTogether}>Tout ajouter au panier</button>
          </div>
        </div>
        {/* Bloc livraison/retours/paiement détaillé */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="bg-light rounded-3 p-3 mb-3">
              <i className="bi bi-truck text-primary me-2"></i>
              <span className="fw-semibold">Livraison estimée :</span>
              <span className="ms-2">Gratuite demain</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-light rounded-3 p-3 mb-3">
              <i className="bi bi-arrow-counterclockwise text-success me-2"></i>
              <span className="fw-semibold">Retours :</span>
              <span className="ms-2">Gratuits 30j</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-light rounded-3 p-3 mb-3">
              <i className="bi bi-shield-check text-info me-2"></i>
              <span className="fw-semibold">Paiement sécurisé</span>
            </div>
          </div>
        </div>
        {/* Section avis clients stylés avec pagination */}
        <div className="mt-5">
          <h4>Avis clients</h4>
          {avisClients.length === 0 ? <div>Aucun avis pour ce produit.</div> : (
            <div>
              {avisAffiches.map((avis, idx) => (
                <div key={idx} className="border-bottom pb-3 mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <span className="fw-bold me-2">{avis.user}</span>
                    {renderStars(avis.rating)}
                    <span className="ms-2 text-muted" style={{ fontSize: 13 }}>{avis.date}</span>
                  </div>
                  <div>{avis.text}</div>
                  {avis.photos && avis.photos.length > 0 && (
                    <div className="d-flex gap-2 mt-2">
                      {avis.photos.map((p, i) => <img key={i} src={p} alt="avis" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} />)}
                    </div>
                  )}
                </div>
              ))}
              {/* Pagination */}
              {avisTotalPages > 1 && (
                <div className="d-flex gap-2 justify-content-center align-items-center mt-3">
                  <button className="btn btn-sm btn-outline-primary" disabled={avisPage === 1} onClick={() => setAvisPage(avisPage - 1)}>Précédent</button>
                  <span>Page {avisPage} / {avisTotalPages}</span>
                  <button className="btn btn-sm btn-outline-primary" disabled={avisPage === avisTotalPages} onClick={() => setAvisPage(avisPage + 1)}>Suivant</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
} 