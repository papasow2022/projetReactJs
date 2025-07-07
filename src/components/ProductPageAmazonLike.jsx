import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Données simulées (à remplacer par API plus tard)
const product = {
  id: 1,
  name: 'Nike Air Max 270',
  brand: 'Nike',
  price: 129.99,
  oldPrice: 159.99,
  discount: 19,
  rating: 4.5,
  reviewCount: 1247,
  soldCount: 2100,
  isPrime: true,
  promo: true,
  isNew: true,
  isExclusive: false,
  color: '#000000',
  delivery: 'Demain',
  stock: 8,
  sizes: ['40', '41', '42', '43', '44'],
  colors: [
    { name: 'Noir/Blanc', code: '#000000', image: '/assets/categorie/arriver (1).png' },
    { name: 'Bleu Marine', code: '#000080', image: '/assets/categorie/arriver (2).png' },
    { name: 'Gris', code: '#808080', image: '/assets/categorie/arriver (3).png' }
  ],
  description: 'Chaussure running homme, confort et style, idéale pour le sport et la ville.',
  images: [
    '/assets/categorie/arriver (1).png',
    '/assets/categorie/arriver (2).png',
    '/assets/categorie/arriver (3).png',
    '/assets/categorie/arriver (4).png',
  ],
  features: [
    "Amorti Air Max pour un confort optimal",
    "Tige en mesh respirant",
    "Design moderne et urbain",
    "Semelle extérieure résistante",
    "Poids léger : 320g"
  ],
  specifications: {
    "Marque": "Nike",
    "Modèle": "Air Max 270",
    "Type": "Running",
    "Matière": "Mesh, Caoutchouc",
    "Poids": "320g",
    "Fermeture": "Lacets"
  },
  seller: 'Nike Store',
  deliveryDate: 'Livraison offerte demain',
  frequentlyBoughtTogether: [
    { id: 2, name: 'Chaussettes sport Nike', price: 12.99, image: '/assets/categorie/arriver (2).png' },
    { id: 3, name: 'Lacets de rechange', price: 5.99, image: '/assets/categorie/arriver (3).png' }
  ],
  similarProducts: [
    { id: 4, name: 'Adidas Ultraboost', price: 149.99, image: '/assets/categorie/arriver (4).png', rating: 4.3 },
    { id: 5, name: 'Puma RS-X', price: 89.99, image: '/assets/categorie/arriver (1).png', rating: 4.1 },
    { id: 6, name: 'New Balance 574', price: 79.99, image: '/assets/categorie/arriver (2).png', rating: 4.4 },
    { id: 7, name: 'Veste légère Nike', price: 59.99, image: '/assets/categorie/arriver (3).png', rating: 4.6 }
  ],
  reviews: [
    { user: 'Marie', rating: 5, comment: 'Super confort, livraison rapide !' },
    { user: 'Alex', rating: 4, comment: 'Très bon produit, taille un peu petit.' },
    { user: 'Sophie', rating: 3, comment: 'Joli design mais taille petit.' },
    { user: 'Yann', rating: 5, comment: 'Parfait pour le running.' },
    { user: 'Léa', rating: 2, comment: 'Déçue par la couleur.' }
  ]
};

const reviewHistogram = [
  { stars: 5, count: 54 },
  { stars: 4, count: 18 },
  { stars: 3, count: 10 },
  { stars: 2, count: 7 },
  { stars: 1, count: 11 }
];

const faqs = [
  { q: "Est-ce que la chaussure taille normalement ?", a: "Oui, prenez votre taille habituelle." },
  { q: "Est-elle adaptée à la course ?", a: "Oui, elle est conçue pour le running et le confort urbain." },
  { q: "Peut-on la laver en machine ?", a: "Nous recommandons un lavage à la main pour préserver la qualité." }
];

const ProductPageAmazonLike = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [faqOpen, setFaqOpen] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Carrousel produits similaires (4 visibles)
  const carouselVisible = product.similarProducts.slice(carouselIndex, carouselIndex + 4);
  const canGoPrev = carouselIndex > 0;
  const canGoNext = carouselIndex + 4 < product.similarProducts.length;

  // Calcul du total "fréquemment achetés ensemble"
  const totalTogether = [product, ...product.frequentlyBoughtTogether].reduce((sum, p) => sum + p.price, 0);

  // Histogramme avis (pourcentage)
  const totalReviews = reviewHistogram.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="container-fluid py-4">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-2">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/">Accueil</a></li>
          <li className="breadcrumb-item"><a href="/catalogue">Catalogue</a></li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      {/* Bloc principal 3 colonnes */}
      <div className="row">
        {/* Colonne 1 : Galerie verticale */}
        <div className="col-md-1 d-none d-md-flex flex-column align-items-center gap-2">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={product.name + ' miniature ' + (i + 1)}
              className={`img-thumbnail ${selectedImage === i ? 'border-warning' : ''}`}
              style={{ width: 60, height: 60, objectFit: 'cover', cursor: 'pointer', borderWidth: selectedImage === i ? 2 : 1 }}
              onClick={() => setSelectedImage(i)}
            />
          ))}
        </div>
        {/* Colonne 2 : Image principale + infos */}
        <div className="col-md-6">
          <div className="position-relative mb-3">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: 400, objectFit: 'contain', background: '#f7f7f7', width: '100%' }}
            />
            {product.promo && (
              <span className="position-absolute top-0 start-0 badge bg-danger m-2">Promo</span>
            )}
            {product.isNew && (
              <span className="position-absolute top-0 end-0 badge bg-success m-2">Nouveau</span>
            )}
          </div>
          <h1 className="h3 fw-bold mb-2">{product.name}</h1>
          <div className="mb-2 d-flex align-items-center gap-2 flex-wrap">
            <span className="badge bg-warning text-dark">{product.rating} <i className="bi bi-star-fill text-warning"></i></span>
            <span className="text-muted">({product.reviewCount} avis)</span>
            <span className="ms-2 text-success">{product.soldCount.toLocaleString()}+ vendus ce mois</span>
            {product.isPrime && <span className="badge bg-primary ms-2"><i className="bi bi-truck"></i> Livraison Prime</span>}
            {product.isExclusive && <span className="badge bg-info text-dark ms-2">Exclu web</span>}
          </div>
          <p className="lead mb-3">{product.description}</p>
          {/* À propos de cet article */}
          <section className="mb-3">
            <h5>À propos de cet article</h5>
            <ul>
              {product.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </section>
          {/* Tableau de spécifications */}
          <section className="mb-3">
            <h6>Caractéristiques techniques</h6>
            <table className="table table-sm">
              <tbody>
                {Object.entries(product.specifications).map(([k, v]) => (
                  <tr key={k}><th>{k}</th><td>{v}</td></tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
        {/* Colonne 3 : Actions */}
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <div className="mb-2 d-flex align-items-center gap-2">
                <span className="h4 text-danger fw-bold">€{product.price}</span>
                <span className="text-muted text-decoration-line-through">€{product.oldPrice}</span>
                <span className="badge bg-danger">-{product.discount}%</span>
              </div>
              <div className="mb-2 text-success"><i className="bi bi-check-circle"></i> {product.stock > 0 ? 'En stock' : 'Rupture de stock'}</div>
              <div className="mb-2"><i className="bi bi-truck"></i> {product.deliveryDate}</div>
              {/* Sélecteurs dynamiques */}
              <div className="mb-2">
                <label className="form-label">Couleur :</label>
                <div className="d-flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      className={`btn btn-outline-secondary btn-sm ${selectedColor === color.name ? 'btn-primary' : ''}`}
                      style={{ borderColor: color.code, color: color.code }}
                      onClick={() => setSelectedColor(color.name)}
                    >
                      <span style={{ background: color.code, display: 'inline-block', width: 16, height: 16, borderRadius: '50%', marginRight: 6, border: '1px solid #ccc' }}></span>
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label">Taille :</label>
                <div className="d-flex gap-2 flex-wrap">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`btn btn-outline-secondary btn-sm ${selectedSize === size ? 'btn-primary' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label">Quantité :</label>
                <div className="input-group" style={{ maxWidth: 120 }}>
                  <button className="btn btn-outline-secondary" onClick={() => setQuantity(q => Math.max(1, q - 1))}><i className="bi bi-dash"></i></button>
                  <input type="number" className="form-control text-center" min={1} value={quantity} onChange={e => setQuantity(Math.max(1, +e.target.value))} />
                  <button className="btn btn-outline-secondary" onClick={() => setQuantity(q => q + 1)}><i className="bi bi-plus"></i></button>
                </div>
              </div>
              <button className="btn btn-warning w-100 mb-2"><i className="bi bi-cart-plus me-2"></i>Ajouter au panier</button>
              <button className="btn btn-orange w-100 mb-2"><i className="bi bi-lightning me-2"></i>Acheter maintenant</button>
              <div className="small text-muted mt-2"><i className="bi bi-shop"></i> Vendu par <b>{product.seller}</b></div>
              <div className="small text-muted"><i className="bi bi-arrow-repeat"></i> Retour gratuit 30j • <i className="bi bi-shield-lock"></i> Paiement sécurisé</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section fréquemment achetés ensemble */}
      <section className="my-4">
        <h5>Fréquemment achetés ensemble</h5>
        <div className="d-flex gap-3 align-items-center flex-wrap">
          <div className="d-flex align-items-center gap-3">
            <div className="card p-2 text-center" style={{ width: 120 }}>
              <img src={product.images[0]} alt={product.name} className="img-fluid mb-1" style={{ height: 60, objectFit: 'cover' }} />
              <div className="small fw-bold">{product.name}</div>
              <div className="text-danger">€{product.price}</div>
            </div>
            {product.frequentlyBoughtTogether.map((p, i) => (
              <React.Fragment key={p.id}>
                <span className="h3 mb-0">+</span>
                <div className="card p-2 text-center" style={{ width: 120 }}>
                  <img src={p.image} alt={p.name} className="img-fluid mb-1" style={{ height: 60, objectFit: 'cover' }} />
                  <div className="small fw-bold">{p.name}</div>
                  <div className="text-danger">€{p.price}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
          <span className="ms-3 fw-bold">Total : <span className="text-danger">€{totalTogether.toFixed(2)}</span></span>
          <button className="btn btn-warning ms-3"><i className="bi bi-cart-plus me-1"></i>Ajouter tout au panier</button>
        </div>
      </section>

      {/* Section produits similaires (carrousel) */}
      <section className="my-4">
        <h5>Produits similaires</h5>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary btn-sm" disabled={!canGoPrev} onClick={() => setCarouselIndex(i => Math.max(0, i - 1))}><i className="bi bi-chevron-left"></i></button>
          <div className="d-flex gap-3 overflow-auto" style={{ minWidth: 0 }}>
            {carouselVisible.map(p => (
              <div key={p.id} className="card p-2 text-center" style={{ width: 140, minWidth: 140 }}>
                <img src={p.image} alt={p.name} className="img-fluid mb-1" style={{ height: 80, objectFit: 'cover' }} />
                <div className="small fw-bold">{p.name}</div>
                <div className="text-danger">€{p.price}</div>
                <div className="badge bg-warning text-dark">{p.rating} <i className="bi bi-star-fill text-warning"></i></div>
                <button className="btn btn-outline-primary btn-sm mt-2 w-100">Voir</button>
              </div>
            ))}
          </div>
          <button className="btn btn-outline-secondary btn-sm" disabled={!canGoNext} onClick={() => setCarouselIndex(i => Math.min(product.similarProducts.length - 4, i + 1))}><i className="bi bi-chevron-right"></i></button>
        </div>
      </section>

      {/* Section comparateur (exemple réaliste) */}
      <section className="my-4">
        <h5>Comparer avec des articles similaires</h5>
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Produit</th>
                {[product, ...product.similarProducts.slice(0, 3)].map(p => (
                  <th key={p.id}>{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Prix</th>
                {[product, ...product.similarProducts.slice(0, 3)].map(p => (
                  <td key={p.id} className="text-danger">€{p.price}</td>
                ))}
              </tr>
              <tr>
                <th>Note</th>
                {[product, ...product.similarProducts.slice(0, 3)].map(p => (
                  <td key={p.id}><span className="badge bg-warning text-dark">{p.rating || product.rating} <i className="bi bi-star-fill text-warning"></i></span></td>
                ))}
              </tr>
              <tr>
                <th>Taille(s)</th>
                {[product, ...product.similarProducts.slice(0, 3)].map(p => (
                  <td key={p.id}>{p.sizes ? p.sizes.join(', ') : '-'}</td>
                ))}
              </tr>
              <tr>
                <th>Badge</th>
                {[product, ...product.similarProducts.slice(0, 3)].map(p => (
                  <td key={p.id}>{p.isPrime && <span className="badge bg-primary me-1">Prime</span>}{p.promo && <span className="badge bg-danger">Promo</span>}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section avis clients */}
      <section className="my-4">
        <h5>Avis clients</h5>
        <div className="mb-2 d-flex align-items-center gap-3 flex-wrap">
          <span className="badge bg-warning text-dark fs-5">{product.rating} <i className="bi bi-star-fill text-warning"></i></span>
          <span className="text-muted">{product.reviewCount} avis</span>
        </div>
        {/* Histogramme */}
        <div className="row mb-3">
          <div className="col-md-6">
            {reviewHistogram.map(r => (
              <div key={r.stars} className="d-flex align-items-center mb-1">
                <span className="me-1" style={{ width: 30 }}>{r.stars} <i className="bi bi-star-fill text-warning"></i></span>
                <div className="progress flex-grow-1" style={{ height: 12, background: '#f3f3f3' }}>
                  <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${(r.count / totalReviews) * 100}%` }}></div>
                </div>
                <span className="ms-2 text-muted small">{r.count}%</span>
              </div>
            ))}
          </div>
        </div>
        {/* Avis */}
        <div className="row">
          {product.reviews.slice(0, 3).map((r, i) => (
            <div key={i} className="col-md-4 mb-2">
              <div className="border rounded p-2 h-100">
                <div className="fw-bold">{r.user}</div>
                <div className="text-warning">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <div>{r.comment}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-outline-primary mt-2"><i className="bi bi-chat-left-text me-1"></i>Voir tous les avis</button>
      </section>

      {/* Section FAQ (optionnel) */}
      <section className="my-4">
        <h5>Questions fréquentes</h5>
        <div className="accordion" id="faqAccordion">
          {faqs.map((faq, i) => (
            <div className="accordion-item" key={i}>
              <h6 className="accordion-header">
                <button
                  className={`accordion-button ${faqOpen === i ? '' : 'collapsed'}`}
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                >
                  {faq.q}
                </button>
              </h6>
              <div className={`accordion-collapse collapse${faqOpen === i ? ' show' : ''}`}> 
                <div className="accordion-body">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductPageAmazonLike; 