import React, { createContext, useContext, useState, useEffect } from 'react';

const ReviewsContext = createContext();

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews doit être utilisé dans un ReviewsProvider');
  }
  return context;
};

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState({});
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviewsData();
  }, []);

  const loadReviewsData = () => {
    try {
      const storedReviews = JSON.parse(localStorage.getItem('reviews') || '{}');
      const storedPendingReviews = JSON.parse(localStorage.getItem('pendingReviews') || '[]');
      
      setReviews(storedReviews);
      setPendingReviews(storedPendingReviews);
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    }
  };

  // Soumettre un avis
  const submitReview = (reviewData) => {
    const review = {
      id: Date.now(),
      ...reviewData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      moderatedAt: null,
      moderatedBy: null
    };

    const updatedPendingReviews = [...pendingReviews, review];
    setPendingReviews(updatedPendingReviews);
    localStorage.setItem('pendingReviews', JSON.stringify(updatedPendingReviews));

    return { success: true, reviewId: review.id };
  };

  // Modérer un avis (vendeur)
  const moderateReview = (reviewId, action, reason = null) => {
    const pendingReview = pendingReviews.find(r => r.id === reviewId);
    if (!pendingReview) return { success: false, error: 'Avis non trouvé' };

    if (action === 'approve') {
      // Approuver l'avis
      const approvedReview = {
        ...pendingReview,
        status: 'approved',
        moderatedAt: new Date().toISOString(),
        moderatedBy: 'vendor'
      };

      // Ajouter aux avis approuvés
      const productReviews = reviews[pendingReview.productId] || [];
      const updatedReviews = {
        ...reviews,
        [pendingReview.productId]: [...productReviews, approvedReview]
      };

      setReviews(updatedReviews);
      localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    }

    // Retirer des avis en attente
    const updatedPendingReviews = pendingReviews.filter(r => r.id !== reviewId);
    setPendingReviews(updatedPendingReviews);
    localStorage.setItem('pendingReviews', JSON.stringify(updatedPendingReviews));

    return { success: true };
  };

  // Répondre à un avis (vendeur)
  const replyToReview = (reviewId, reply) => {
    const allReviews = { ...reviews };
    let reviewFound = false;

    Object.keys(allReviews).forEach(productId => {
      const productReviews = allReviews[productId];
      const reviewIndex = productReviews.findIndex(r => r.id === reviewId);
      
      if (reviewIndex !== -1) {
        allReviews[productId][reviewIndex] = {
          ...productReviews[reviewIndex],
          vendorReply: {
            content: reply,
            repliedAt: new Date().toISOString()
          }
        };
        reviewFound = true;
      }
    });

    if (reviewFound) {
      setReviews(allReviews);
      localStorage.setItem('reviews', JSON.stringify(allReviews));
      return { success: true };
    }

    return { success: false, error: 'Avis non trouvé' };
  };

  // Signaler un avis
  const reportReview = (reviewId, reason, reporterId) => {
    const allReviews = { ...reviews };
    let reviewFound = false;

    Object.keys(allReviews).forEach(productId => {
      const productReviews = allReviews[productId];
      const reviewIndex = productReviews.findIndex(r => r.id === reviewId);
      
      if (reviewIndex !== -1) {
        allReviews[productId][reviewIndex] = {
          ...productReviews[reviewIndex],
          reported: {
            reason,
            reporterId,
            reportedAt: new Date().toISOString(),
            status: 'pending'
          }
        };
        reviewFound = true;
      }
    });

    if (reviewFound) {
      setReviews(allReviews);
      localStorage.setItem('reviews', JSON.stringify(allReviews));
      return { success: true };
    }

    return { success: false, error: 'Avis non trouvé' };
  };

  // Obtenir les avis d'un produit
  const getProductReviews = (productId) => {
    return reviews[productId] || [];
  };

  // Obtenir les avis en attente d'un vendeur
  const getVendorPendingReviews = (vendorId) => {
    return pendingReviews.filter(review => review.vendorId === vendorId);
  };

  // Obtenir les avis d'un vendeur
  const getVendorReviews = (vendorId) => {
    const vendorReviews = [];
    Object.values(reviews).forEach(productReviews => {
      productReviews.forEach(review => {
        if (review.vendorId === vendorId) {
          vendorReviews.push(review);
        }
      });
    });
    return vendorReviews;
  };

  // Calculer la note moyenne d'un produit
  const getProductAverageRating = (productId) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / productReviews.length) * 10) / 10;
  };

  // Calculer la note moyenne d'un vendeur
  const getVendorAverageRating = (vendorId) => {
    const vendorReviews = getVendorReviews(vendorId);
    if (vendorReviews.length === 0) return 0;
    
    const totalRating = vendorReviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / vendorReviews.length) * 10) / 10;
  };

  // Obtenir la distribution des notes
  const getRatingDistribution = (productId) => {
    const productReviews = getProductReviews(productId);
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    productReviews.forEach(review => {
      distribution[review.rating]++;
    });
    
    return distribution;
  };

  // Obtenir les avis signalés
  const getReportedReviews = () => {
    const reportedReviews = [];
    Object.values(reviews).forEach(productReviews => {
      productReviews.forEach(review => {
        if (review.reported && review.reported.status === 'pending') {
          reportedReviews.push(review);
        }
      });
    });
    return reportedReviews;
  };

  // Modérer un avis signalé (admin)
  const moderateReportedReview = (reviewId, action) => {
    const allReviews = { ...reviews };
    let reviewFound = false;

    Object.keys(allReviews).forEach(productId => {
      const productReviews = allReviews[productId];
      const reviewIndex = productReviews.findIndex(r => r.id === reviewId);
      
      if (reviewIndex !== -1) {
        if (action === 'dismiss') {
          // Rejeter le signalement
          allReviews[productId][reviewIndex] = {
            ...productReviews[reviewIndex],
            reported: {
              ...productReviews[reviewIndex].reported,
              status: 'dismissed'
            }
          };
        } else if (action === 'remove') {
          // Supprimer l'avis
          allReviews[productId].splice(reviewIndex, 1);
        }
        reviewFound = true;
      }
    });

    if (reviewFound) {
      setReviews(allReviews);
      localStorage.setItem('reviews', JSON.stringify(allReviews));
      return { success: true };
    }

    return { success: false, error: 'Avis non trouvé' };
  };

  const value = {
    reviews,
    pendingReviews,
    loading,
    submitReview,
    moderateReview,
    replyToReview,
    reportReview,
    getProductReviews,
    getVendorPendingReviews,
    getVendorReviews,
    getProductAverageRating,
    getVendorAverageRating,
    getRatingDistribution,
    getReportedReviews,
    moderateReportedReview
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
};

export { ReviewsContext };
export default ReviewsContext;