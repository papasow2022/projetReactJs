import React, { useState, useEffect } from 'react';
import { useDailyDeals } from '../contexts/DailyDealsContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from "../contexts/LanguageContext";

const DailyDealCard = ({ deal, variant = 'default', showTimer = true, showStock = true }) => {
  const { t } = useLanguage();
  const { addToCart: addToDailyDealsCart, translateProductName, translateDescription, translateTags } = useDailyDeals();
  const { addNotification } = useNotifications();
  const { addToCart, isAddingToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Calculer le temps restant
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(now.getHours() + deal.heuresRestantes, 59, 59, 999);
      const diff = end - now;
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [deal.heuresRestantes]);

  const handleAddToCart = async () => {
    // Vérifier si l'offre est expirée
    if (deal.heuresRestantes <= 0) {
      addNotification(t("deal_expired"), 'warning');
      return;
    }
    
    if (deal.stock <= 0) {
      addNotification(t("out_of_stock"), 'warning');
      return;
    }

    try {
      // Ajouter au panier global (logique Amazon)
      const result = await addToCart(deal);
      
      if (result.success) {
        // Mettre à jour le stock dans le contexte DailyDeals
        addToDailyDealsCart(deal.id);
        
        addNotification(
          `${deal.nom} ajouté au panier`,
          'success',
          { 
            details: `Prix: ${deal.prix.toLocaleString('fr-FR')} GNF`,
            action: 'Voir le panier'
          }
        );
      } else {
        addNotification('Erreur lors de l\'ajout au panier', 'error');
      }
    } catch (error) {
      addNotification('Erreur lors de l\'ajout au panier', 'error');
    }
  };

  const getStockStatus = () => {
    if (deal.stock === 0) return { text: t("out_of_stock"), class: 'danger' };
    if (deal.stock <= 3) return { text: `${deal.stock} ${t("items_remaining")}`, class: 'warning' };
    return { text: `${deal.stock} ${t("items_remaining")}`, class: 'success' };
  };

  const stockStatus = getStockStatus();

  // Variantes de style
  const getCardStyle = () => {
    switch (variant) {
      case 'featured':
        return 'border-warning border-3 shadow-lg';
      case 'ending-soon':
        return 'border-danger border-2 shadow';
      case 'compact':
        return 'border-0 shadow-sm';
      default:
        return 'border-0 shadow-sm';
    }
  };

  const getImageStyle = () => {
    switch (variant) {
      case 'featured':
        return { height: 250, objectFit: 'contain' };
      case 'compact':
        return { height: 120, objectFit: 'contain' };
      default:
        return { height: 180, objectFit: 'contain' };
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`card h-100 ${getCardStyle()} hover-shadow`}>
        <div className="position-relative">
          <img 
            src={deal.image} 
            alt={deal.nom} 
            className="card-img-top p-2" 
            style={getImageStyle()}
          />
          <div className="position-absolute top-0 start-0 m-2">
            <span className="badge bg-danger">{deal.badge}</span>
          </div>
          {showTimer && deal.heuresRestantes <= 6 && (
            <div className="position-absolute top-0 end-0 m-2">
              <span className="badge bg-warning text-dark">
                <i className="bi bi-clock me-1"></i>
                {timeLeft.hours}h {timeLeft.minutes}m
              </span>
            </div>
          )}
        </div>
        <div className="card-body p-2">
          <h6 className="card-title fw-bold mb-1" style={{fontSize: '0.9rem'}}>
            {translateProductName(deal.nom)}
          </h6>
          <div className="mb-1">
            <span className="text-danger fw-bold">{deal.prix.toLocaleString('fr-FR')} GNF</span>
            <span className="text-muted text-decoration-line-through ms-1" style={{fontSize: '0.8rem'}}>
              {deal.ancienPrix.toLocaleString('fr-FR')} GNF
            </span>
          </div>
          {showStock && (
            <small className={`text-${stockStatus.class} d-block mb-1`}>
              {stockStatus.text}
            </small>
          )}
          <button 
            className={`btn btn-sm btn-${deal.stock > 0 ? 'warning' : 'secondary'} w-100`}
            onClick={handleAddToCart}
            disabled={deal.stock <= 0 || isAddingToCart}
          >
            {isAddingToCart ? (
              <span><i className="bi bi-hourglass-split me-1"></i>{t("adding")}</span>
            ) : deal.stock > 0 ? (
              <span><i className="bi bi-cart-plus me-1"></i>{t('add')}</span>
            ) : (
              <span>{t('out_of_stock_short')}</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`card h-100 ${getCardStyle()} hover-shadow`}>
      <div className="position-relative">
        <img 
          src={deal.image} 
          alt={translateProductName(deal.nom)} 
          className="card-img-top p-3" 
          style={getImageStyle()}
        />
        
        {/* Badge de réduction ou statut expiré */}
        <div className="position-absolute top-0 start-0 m-2">
          {deal.heuresRestantes <= 0 ? (
            <span className="badge bg-secondary fs-6">
              <i className="bi bi-clock-history me-1"></i>{t('ended')}
            </span>
          ) : (
            <span className="badge bg-danger fs-6">{deal.badge}</span>
          )}
        </div>
        
        {/* Timer si activé et offre non expirée */}
        {showTimer && deal.heuresRestantes > 0 && (
          <div className="position-absolute top-0 end-0 m-2">
            <div className="bg-dark text-white p-2 rounded" style={{fontSize: '0.8rem'}}>
              <div className="text-center">
                <i className="bi bi-clock me-1"></i>
                {deal.heuresRestantes <= 6 ? t('ends') : t('ends_in')}
              </div>
              <div className="text-center fw-bold">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        )}
        
        {/* Indicateur d'offre expirée */}
        {deal.heuresRestantes <= 0 && (
          <div className="position-absolute top-0 end-0 m-2">
            <div className="bg-secondary text-white p-2 rounded" style={{fontSize: '0.8rem'}}>
              <div className="text-center">
                <i className="bi bi-x-circle me-1"></i>
                {t('offer_ended')}
              </div>
            </div>
          </div>
        )}
        
        {/* Badge Prime si applicable */}
        {deal.livraison === 'Prime' && (
          <div className="position-absolute bottom-0 start-0 m-2">
            <span className="badge bg-primary">
              <i className="bi bi-lightning me-1"></i>{t('prime')}
            </span>
          </div>
        )}
        
        {/* Badge livraison gratuite */}
        {deal.livraisonGratuite && (
          <div className="position-absolute bottom-0 end-0 m-2">
            <span className="badge bg-success">
              <i className="bi bi-truck me-1"></i>{t('free_shipping')}
            </span>
          </div>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold mb-2" style={{fontSize: variant === 'featured' ? '1.3rem' : '1.1rem'}}>
          {translateProductName(deal.nom)}
        </h5>
        
        {/* Prix */}
        <div className="mb-2">
          {deal.heuresRestantes <= 0 ? (
            // Prix normal pour les offres expirées
            <span className="text-dark fw-bold" style={{fontSize: variant === 'featured' ? '1.5rem' : '1.2rem'}}>
              {deal.ancienPrix.toLocaleString('fr-FR')} GNF
            </span>
          ) : (
            // Prix réduit pour les offres actives
            <>
              <span className="text-danger fw-bold" style={{fontSize: variant === 'featured' ? '1.5rem' : '1.2rem'}}>
                {deal.prix.toLocaleString('fr-FR')} GNF
              </span>
              <span className="text-muted text-decoration-line-through ms-2">
                {deal.ancienPrix.toLocaleString('fr-FR')} GNF
              </span>
            </>
          )}
        </div>
        
        {/* Informations supplémentaires */}
        <div className="mb-2">
          {/* Note */}
          <span className="me-2">
            <i className="bi bi-star-fill text-warning me-1"></i>
            {deal.note} ({deal.avis?.length || 0} {t('reviews')})
          </span>
          
          {/* Stock */}
          {showStock && (
            <span className={`badge bg-${stockStatus.class} me-2`}>
              {stockStatus.text}
            </span>
          )}
          
          {/* Vendeur */}
          <small className="text-muted d-block mt-1">
            {t('sold_by', { seller: deal.vendeur })}
          </small>
        </div>
        
        {/* Description */}
        <p className="card-text small mb-3 text-muted">
          {translateDescription(deal.description)}
        </p>
        
        {/* Tags */}
        {deal.tags && deal.tags.length > 0 && (
          <div className="mb-3">
            {translateTags(deal.tags).slice(0, 3).map((tag, index) => (
              <span key={index} className="badge bg-light text-dark me-1" style={{fontSize: '0.7rem'}}>
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Bouton d'action */}
        <button 
          className={`btn btn-${deal.heuresRestantes <= 0 ? 'secondary' : (deal.stock > 0 ? 'warning' : 'secondary')} mt-auto fw-bold`}
          onClick={handleAddToCart}
          disabled={deal.heuresRestantes <= 0 || deal.stock <= 0 || isAddingToCart}
        >
          {isAddingToCart ? (
            <span><i className="bi bi-hourglass-split me-2"></i>{t('adding')}</span>
          ) : deal.heuresRestantes <= 0 ? (
            <span><i className="bi bi-clock-history me-2"></i>{t('offer_ended')}</span>
          ) : deal.stock > 0 ? (
            <span><i className="bi bi-cart-plus me-2"></i>{t('add_to_cart')}</span>
          ) : (
            <span><i className="bi bi-x-circle me-2"></i>{t('out_of_stock')}</span>
          )}
        </button>
        
        {/* Informations supplémentaires pour les variantes featured */}
        {variant === 'featured' && (
          <div className="mt-3 pt-3 border-top">
            <div className="row text-center">
              <div className="col-4">
                <small className="text-muted d-block">{t('discount')}</small>
                <strong className="text-danger">-{deal.reduction}%</strong>
              </div>
              <div className="col-4">
                <small className="text-muted d-block">{t('savings')}</small>
                <strong className="text-success">
                  {(deal.ancienPrix - deal.prix).toLocaleString('fr-FR')} GNF
                </strong>
              </div>
              <div className="col-4">
                <small className="text-muted d-block">{t('initial_stock')}</small>
                <strong>{deal.stockInitial}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyDealCard; 