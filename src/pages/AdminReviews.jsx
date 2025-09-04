import React, { useState, useEffect } from 'react';
import { 
  BiStar, 
  BiSearch, 
  BiFilter, 
  BiCheckCircle, 
  BiXCircle, 
  BiInfoCircle, 
  BiUser,
  BiCalendar,
  BiFlag,
  BiMessage,
  BiRefresh,
  
} from 'react-icons/bi';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchTerm, statusFilter, ratingFilter]);

  const loadReviews = () => {
    setLoading(true);
    // Simuler des données de test
    const mockReviews = [
      {
        id: 'REV-001',
        customer: 'Marie Dupont',
        customerEmail: 'marie.dupont@email.com',
        product: 'Chaussures Nike Air Max',
        productId: 'PROD-001',
        vendor: 'Boutique Sport',
        vendorId: 'VD-001',
        rating: 5,
        title: 'Excellent produit !',
        comment: 'Très satisfaite de mon achat. Les chaussures sont confortables et de bonne qualité. Livraison rapide.',
        status: 'approved',
        reported: false,
        reportReason: null,
        createdAt: '2024-01-15T10:30:00Z',
        helpful: 12,
        notHelpful: 1
      },
      {
        id: 'REV-002',
        customer: 'Jean Martin',
        customerEmail: 'jean.martin@email.com',
        product: 'Sac à dos Adidas',
        productId: 'PROD-002',
        vendor: 'Mode & Style',
        vendorId: 'VD-002',
        rating: 4,
        title: 'Bon produit',
        comment: 'Sac de bonne qualité, mais la fermeture éclair pourrait être plus solide.',
        status: 'approved',
        reported: false,
        reportReason: null,
        createdAt: '2024-01-14T15:20:00Z',
        helpful: 8,
        notHelpful: 2
      },
      {
        id: 'REV-003',
        customer: 'Sophie Bernard',
        customerEmail: 'sophie.bernard@email.com',
        product: 'Apple Watch Series 7',
        productId: 'PROD-003',
        vendor: 'Tech Store',
        vendorId: 'VD-003',
        rating: 1,
        title: 'Produit défectueux',
        comment: 'La montre ne fonctionne pas du tout. Je demande un remboursement immédiat !',
        status: 'pending',
        reported: true,
        reportReason: 'Contenu inapproprié',
        createdAt: '2024-01-13T09:15:00Z',
        helpful: 0,
        notHelpful: 5
      },
      {
        id: 'REV-004',
        customer: 'Pierre Durand',
        customerEmail: 'pierre.durand@email.com',
        product: 'Veste Nike',
        productId: 'PROD-004',
        vendor: 'Sport Plus',
        vendorId: 'VD-004',
        rating: 3,
        title: 'Correct',
        comment: 'La veste est correcte mais pas exceptionnelle. Le prix est un peu élevé pour la qualité.',
        status: 'rejected',
        reported: false,
        reportReason: null,
        createdAt: '2024-01-12T14:45:00Z',
        helpful: 3,
        notHelpful: 1
      },
      {
        id: 'REV-005',
        customer: 'Anonyme',
        customerEmail: 'anonyme@email.com',
        product: 'Chaussures Nike Air Max',
        productId: 'PROD-001',
        vendor: 'Boutique Sport',
        vendorId: 'VD-001',
        rating: 2,
        title: 'Déçu',
        comment: 'Produit pas conforme à la description. Taille incorrecte et qualité médiocre.',
        status: 'pending',
        reported: true,
        reportReason: 'Avis suspect',
        createdAt: '2024-01-11T16:30:00Z',
        helpful: 1,
        notHelpful: 8
      }
    ];

    setTimeout(() => {
      setReviews(mockReviews);
      setLoading(false);
    }, 1000);
  };

  const filterReviews = () => {
    let filtered = reviews;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(review => review.status === statusFilter);
    }

    // Filtre par note
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    setFilteredReviews(filtered);
  };

  const approveReview = (reviewId) => {
    setReviews(prev => prev.map(r => 
      r.id === reviewId ? { ...r, status: 'approved' } : r
    ));
  };

  const rejectReview = (reviewId) => {
    setReviews(prev => prev.map(r => 
      r.id === reviewId ? { ...r, status: 'rejected' } : r
    ));
  };

  const deleteReview = (reviewId) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="badge bg-success">Approuvé</span>;
      case 'rejected':
        return <span className="badge bg-danger">Rejeté</span>;
      case 'pending':
        return <span className="badge bg-warning">En attente</span>;
      default:
        return <span className="badge bg-secondary">Inconnu</span>;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <BiStar
        key={index}
        className={index < rating ? 'text-warning' : 'text-muted'}
        style={{ fontSize: '1rem' }}
      />
    ));
  };

  const getStatusCounts = () => {
    return {
      all: reviews.length,
      pending: reviews.filter(r => r.status === 'pending').length,
      approved: reviews.filter(r => r.status === 'approved').length,
      rejected: reviews.filter(r => r.status === 'rejected').length,
      reported: reviews.filter(r => r.reported).length
    };
  };

  const getRatingCounts = () => {
    return {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };
  };

  const counts = getStatusCounts();
  const ratingCounts = getRatingCounts();
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Modération des avis</h1>
          <p className="text-muted mb-0">Gérer et valider les avis clients</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={loadReviews}>
            <BiRefresh className="me-2" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="row g-3 mb-4">
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-primary mb-1">{counts.all}</h4>
              <small className="text-muted">Total</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-warning mb-1">{counts.pending}</h4>
              <small className="text-muted">En attente</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-success mb-1">{counts.approved}</h4>
              <small className="text-muted">Approuvés</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-danger mb-1">{counts.rejected}</h4>
              <small className="text-muted">Rejetés</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-warning mb-1">{counts.reported}</h4>
              <small className="text-muted">Signalés</small>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-info mb-1">{averageRating}</h4>
              <small className="text-muted">Note moyenne</small>
            </div>
          </div>
        </div>
      </div>

      {/* Répartition des notes */}
      <div className="row g-3 mb-4">
        {[5, 4, 3, 2, 1].map(rating => (
          <div key={rating} className="col-md-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="d-flex justify-content-center mb-2">
                  {renderStars(rating)}
                </div>
                <h4 className="text-primary mb-1">{ratingCounts[rating]}</h4>
                <small className="text-muted">Note {rating}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <BiSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher un avis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvés</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="all">Toutes les notes</option>
                <option value="5">5 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="2">2 étoiles</option>
                <option value="1">1 étoile</option>
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100">
                <BiFilter className="me-2" />
                Plus de filtres
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des avis */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0">Avis ({filteredReviews.length})</h5>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Client</th>
                    <th>Produit</th>
                    <th>Vendeur</th>
                    <th>Note</th>
                    <th>Commentaire</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((review) => (
                    <tr key={review.id}>
                      <td>
                        <div>
                          <div className="fw-medium">{review.customer}</div>
                          <small className="text-muted">{review.customerEmail}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">{review.product}</div>
                          <small className="text-muted">ID: {review.productId}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">{review.vendor}</div>
                          <small className="text-muted">{review.vendorId}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="d-flex align-items-center mb-1">
                            {renderStars(review.rating)}
                          </div>
                          <small className="text-muted">{review.rating}/5</small>
                        </div>
                      </td>
                      <td>
                        <div style={{ maxWidth: '300px' }}>
                          <div className="fw-medium mb-1">{review.title}</div>
                          <div className="text-muted small mb-2">{review.comment}</div>
                          {review.reported && (
                            <div className="mt-1">
                              <BiFlag className="text-warning me-1" />
                              <small className="text-warning">Signalé: {review.reportReason}</small>
                            </div>
                          )}
                          <div className="d-flex gap-3 mt-2">
                            <small className="text-success">
                              <BiCheckCircle className="me-1" />
                              {review.helpful}
                            </small>
                            <small className="text-danger">
                              <BiXCircle className="me-1" />
                              {review.notHelpful}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(review.status)}
                      </td>
                      <td>
                        <small className="text-muted">
                          <BiCalendar className="me-1" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-primary" title="Voir détails">
                            <BiInfoCircle />
                          </button>
                          {review.status === 'pending' && (
                            <>
                              <button 
                                className="btn btn-sm btn-success" 
                                title="Approuver"
                                onClick={() => approveReview(review.id)}
                              >
                                <BiCheckCircle />
                              </button>
                              <button 
                                className="btn btn-sm btn-danger" 
                                title="Rejeter"
                                onClick={() => rejectReview(review.id)}
                              >
                                <BiXCircle />
                              </button>
                            </>
                          )}
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            title="Supprimer"
                            onClick={() => deleteReview(review.id)}
                          >
                            <BiXCircle />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}