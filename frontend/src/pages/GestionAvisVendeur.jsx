import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useReviews } from '../contexts/ReviewsContext';
import { useProducts } from '../contexts/ProductsContext';
import { 
  BiArrowBack, 
  BiSearch, 
  BiFilter,
  BiStar,
  BiCheck,
  BiX,
  BiMessage,
  BiFlag,
  BiUser,
  BiCalendar,
  BiTrendingUp,
  BiTrendingDown,
  BiRefresh
} from 'react-icons/bi';

const GestionAvisVendeur = () => {
  const { user } = useAuth();
  const { 
    getVendorReviews, 
    getVendorPendingReviews,
    getVendorAverageRating,
    moderateReview,
    replyToReview
  } = useReviews();
  const { getVendorProducts } = useProducts();

  const [reviews, setReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  const vendorProducts = getVendorProducts(user?.vendorId || {});
  const averageRating = getVendorAverageRating(user?.vendorId || '');

  useEffect(() => {
    loadReviews();
  }, [user]);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchTerm, filterRating, filterStatus]);

  const loadReviews = () => {
    setLoading(true);
    const vendorReviews = getVendorReviews(user?.vendorId || '');
    const vendorPendingReviews = getVendorPendingReviews(user?.vendorId || '');
    
    setReviews(vendorReviews);
    setPendingReviews(vendorPendingReviews);
    setLoading(false);
  };

  const filterReviews = () => {
    let filtered = [...reviews];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par note
    if (filterRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(filterRating));
    }

    // Filtre par statut
    if (filterStatus !== 'all') {
      if (filterStatus === 'replied') {
        filtered = filtered.filter(review => review.vendorReply);
      } else if (filterStatus === 'unreplied') {
        filtered = filtered.filter(review => !review.vendorReply);
      }
    }

    setFilteredReviews(filtered);
  };

  const handleModerateReview = async (reviewId, action) => {
    setLoading(true);
    const result = await moderateReview(reviewId, action);
    
    if (result.success) {
      loadReviews();
      alert(`Avis ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès`);
    } else {
      alert('Erreur lors de la modération de l\'avis');
    }
    setLoading(false);
  };

  const handleReplyToReview = async () => {
    if (!replyText.trim() || !selectedReview) return;

    setLoading(true);
    const result = await replyToReview(selectedReview.id, replyText.trim());
    
    if (result.success) {
      setShowReplyModal(false);
      setReplyText('');
      setSelectedReview(null);
      loadReviews();
      alert('Réponse envoyée avec succès');
    } else {
      alert('Erreur lors de l\'envoi de la réponse');
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <BiStar
        key={index}
        style={{
          color: index < rating ? '#ffc107' : '#e0e0e0',
          fontSize: '1rem'
        }}
      />
    ));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#28a745';
    if (rating >= 3) return '#ffc107';
    return '#dc3545';
  };

  const getRatingLabel = (rating) => {
    const labels = {
      5: 'Excellent',
      4: 'Très bien',
      3: 'Bien',
      2: 'Moyen',
      1: 'Mauvais'
    };
    return labels[rating] || '';
  };

  // Statistiques
  const stats = {
    totalReviews: reviews.length,
    averageRating: averageRating,
    pendingReviews: pendingReviews.length,
    repliedReviews: reviews.filter(r => r.vendorReply).length,
    ratingDistribution: reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {})
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
                Gestion des Avis
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                Gérez les avis de vos clients
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
              <BiStar style={{ fontSize: '2rem', color: '#ffc107' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {stats.averageRating.toFixed(1)}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Note moyenne</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiMessage style={{ fontSize: '2rem', color: '#007bff' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {stats.totalReviews}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Avis total</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiCalendar style={{ fontSize: '2rem', color: '#ffc107' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {stats.pendingReviews}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>En attente</p>
              </div>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <BiCheck style={{ fontSize: '2rem', color: '#28a745' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                  {stats.repliedReviews}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Répondus</p>
              </div>
            </div>
          </div>
        </div>

        {/* Avis en attente de modération */}
        {pendingReviews.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e0e0e0' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600' }}>
                Avis en attente de modération ({pendingReviews.length})
              </h2>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {pendingReviews.map(review => (
                <div key={review.id} style={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px', 
                  padding: '1rem', 
                  marginBottom: '1rem' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600' }}>{review.customerName}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {renderStars(review.rating)}
                        </div>
                        <span style={{ 
                          color: getRatingColor(review.rating),
                          fontWeight: '500',
                          fontSize: '0.9rem'
                        }}>
                          {getRatingLabel(review.rating)}
                        </span>
                      </div>
                      <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                        Avis pour: <strong>{review.productName}</strong>
                      </p>
                    </div>
                    <span style={{ color: '#666', fontSize: '0.8rem' }}>
                      {formatDate(review.submittedAt)}
                    </span>
                  </div>
                  
                  <p style={{ marginBottom: '1rem', lineHeight: 1.5 }}>
                    {review.content}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleModerateReview(review.id, 'approve')}
                      disabled={loading}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1
                      }}
                    >
                      <BiCheck />
                      Approuver
                    </button>
                    <button
                      onClick={() => handleModerateReview(review.id, 'reject')}
                      disabled={loading}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.6 : 1
                      }}
                    >
                      <BiX />
                      Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtres */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <BiSearch style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#666' 
              }} />
              <input
                type="text"
                placeholder="Rechercher dans les avis..."
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
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                minWidth: '120px'
              }}
            >
              <option value="all">Toutes les notes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles</option>
              <option value="3">3 étoiles</option>
              <option value="2">2 étoiles</option>
              <option value="1">1 étoile</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                minWidth: '120px'
              }}
            >
              <option value="all">Tous les avis</option>
              <option value="replied">Répondus</option>
              <option value="unreplied">Non répondus</option>
            </select>
            
            <button
              onClick={loadReviews}
              style={{
                padding: '0.75rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <BiRefresh />
            </button>
          </div>
        </div>

        {/* Liste des avis */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e0e0e0' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600' }}>
              Avis approuvés ({filteredReviews.length})
            </h2>
          </div>
          
          <div style={{ padding: '1.5rem' }}>
            {filteredReviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                <BiMessage size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3>Aucun avis trouvé</h3>
                <p>Aucun avis ne correspond à vos critères de recherche.</p>
              </div>
            ) : (
              filteredReviews.map(review => (
                <div key={review.id} style={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px', 
                  padding: '1.5rem', 
                  marginBottom: '1rem' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <BiUser style={{ color: '#666' }} />
                        <span style={{ fontWeight: '600' }}>{review.customerName}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {renderStars(review.rating)}
                        </div>
                        <span style={{ 
                          color: getRatingColor(review.rating),
                          fontWeight: '500',
                          fontSize: '0.9rem'
                        }}>
                          {getRatingLabel(review.rating)}
                        </span>
                      </div>
                      <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
                        Avis pour: <strong>{review.productName}</strong>
                      </p>
                    </div>
                    <span style={{ color: '#666', fontSize: '0.8rem' }}>
                      {formatDate(review.submittedAt)}
                    </span>
                  </div>
                  
                  <p style={{ marginBottom: '1rem', lineHeight: 1.5 }}>
                    {review.content}
                  </p>
                  
                  {review.vendorReply && (
                    <div style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '1rem', 
                      borderRadius: '6px', 
                      marginBottom: '1rem',
                      borderLeft: '4px solid #007bff'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600', color: '#007bff' }}>Votre réponse</span>
                        <span style={{ color: '#666', fontSize: '0.8rem' }}>
                          {formatDate(review.vendorReply.repliedAt)}
                        </span>
                      </div>
                      <p style={{ margin: 0, lineHeight: 1.5 }}>
                        {review.vendorReply.content}
                      </p>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!review.vendorReply && (
                      <button
                        onClick={() => {
                          setSelectedReview(review);
                          setShowReplyModal(true);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <BiMessage />
                        Répondre
                      </button>
                    )}
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <BiFlag />
                      Signaler
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de réponse */}
      {showReplyModal && selectedReview && (
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
            maxWidth: '600px'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Répondre à l'avis</h3>
            
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600' }}>{selectedReview.customerName}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {renderStars(selectedReview.rating)}
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                {selectedReview.content}
              </p>
            </div>
            
            <textarea
              placeholder="Tapez votre réponse..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                resize: 'vertical',
                marginBottom: '1rem'
              }}
            />
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyText('');
                  setSelectedReview(null);
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
                onClick={handleReplyToReview}
                disabled={!replyText.trim() || loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: replyText.trim() && !loading ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: replyText.trim() && !loading ? 'pointer' : 'not-allowed'
                }}
              >
                {loading ? 'Envoi...' : 'Envoyer la réponse'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionAvisVendeur;