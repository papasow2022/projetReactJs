import React, { createContext, useContext, useState, useEffect } from 'react';

const PromotionsContext = createContext();

export const usePromotions = () => {
  const context = useContext(PromotionsContext);
  if (!context) {
    throw new Error('usePromotions doit être utilisé dans un PromotionsProvider');
  }
  return context;
};

export const PromotionsProvider = ({ children }) => {
  const [promotions, setPromotions] = useState({});
  const [coupons, setCoupons] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPromotionsData();
  }, []);

  const loadPromotionsData = () => {
    try {
      const storedPromotions = JSON.parse(localStorage.getItem('promotions') || '{}');
      const storedCoupons = JSON.parse(localStorage.getItem('coupons') || '{}');
      
      setPromotions(storedPromotions);
      setCoupons(storedCoupons);
    } catch (error) {
      console.error('Erreur lors du chargement des promotions:', error);
    }
  };

  // Créer une promotion
  const createPromotion = (promotionData) => {
    const promotion = {
      id: Date.now(),
      ...promotionData,
      status: 'active',
      createdAt: new Date().toISOString(),
      usageCount: 0,
      totalDiscount: 0
    };

    const updatedPromotions = { ...promotions, [promotion.id]: promotion };
    setPromotions(updatedPromotions);
    localStorage.setItem('promotions', JSON.stringify(updatedPromotions));

    return { success: true, promotionId: promotion.id };
  };

  // Créer un coupon
  const createCoupon = (couponData) => {
    const coupon = {
      id: Date.now(),
      ...couponData,
      status: 'active',
      createdAt: new Date().toISOString(),
      usageCount: 0,
      maxUsage: couponData.maxUsage || null,
      usedBy: []
    };

    const updatedCoupons = { ...coupons, [coupon.id]: coupon };
    setCoupons(updatedCoupons);
    localStorage.setItem('coupons', JSON.stringify(updatedCoupons));

    return { success: true, couponId: coupon.id };
  };

  // Mettre à jour une promotion
  const updatePromotion = (promotionId, updates) => {
    if (promotions[promotionId]) {
      const updatedPromotions = {
        ...promotions,
        [promotionId]: {
          ...promotions[promotionId],
          ...updates,
          updatedAt: new Date().toISOString()
        }
      };

      setPromotions(updatedPromotions);
      localStorage.setItem('promotions', JSON.stringify(updatedPromotions));
      return { success: true };
    }
    return { success: false, error: 'Promotion non trouvée' };
  };

  // Mettre à jour un coupon
  const updateCoupon = (couponId, updates) => {
    if (coupons[couponId]) {
      const updatedCoupons = {
        ...coupons,
        [couponId]: {
          ...coupons[couponId],
          ...updates,
          updatedAt: new Date().toISOString()
        }
      };

      setCoupons(updatedCoupons);
      localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
      return { success: true };
    }
    return { success: false, error: 'Coupon non trouvé' };
  };

  // Supprimer une promotion
  const deletePromotion = (promotionId) => {
    const updatedPromotions = { ...promotions };
    delete updatedPromotions[promotionId];
    
    setPromotions(updatedPromotions);
    localStorage.setItem('promotions', JSON.stringify(updatedPromotions));
    return { success: true };
  };

  // Supprimer un coupon
  const deleteCoupon = (couponId) => {
    const updatedCoupons = { ...coupons };
    delete updatedCoupons[couponId];
    
    setCoupons(updatedCoupons);
    localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
    return { success: true };
  };

  // Obtenir les promotions d'un vendeur
  const getVendorPromotions = (vendorId) => {
    return Object.values(promotions).filter(promotion => promotion.vendorId === vendorId);
  };

  // Obtenir les coupons d'un vendeur
  const getVendorCoupons = (vendorId) => {
    return Object.values(coupons).filter(coupon => coupon.vendorId === vendorId);
  };

  // Valider un coupon
  const validateCoupon = (couponCode, customerId, orderAmount) => {
    const coupon = Object.values(coupons).find(c => c.code === couponCode && c.status === 'active');
    
    if (!coupon) {
      return { valid: false, error: 'Coupon invalide' };
    }

    // Vérifier la date d'expiration
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { valid: false, error: 'Coupon expiré' };
    }

    // Vérifier le montant minimum
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return { valid: false, error: `Montant minimum requis: ${coupon.minOrderAmount}€` };
    }

    // Vérifier l'utilisation maximale
    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      return { valid: false, error: 'Coupon épuisé' };
    }

    // Vérifier si le client a déjà utilisé ce coupon
    if (coupon.usedBy.includes(customerId)) {
      return { valid: false, error: 'Coupon déjà utilisé' };
    }

    // Calculer la réduction
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (orderAmount * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, orderAmount);
    }

    return {
      valid: true,
      coupon,
      discount: Math.round(discount * 100) / 100
    };
  };

  // Utiliser un coupon
  const useCoupon = (couponId, customerId, orderAmount) => {
    const coupon = coupons[couponId];
    if (!coupon) return { success: false, error: 'Coupon non trouvé' };

    const validation = validateCoupon(coupon.code, customerId, orderAmount);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Mettre à jour le coupon
    const updatedCoupons = {
      ...coupons,
      [couponId]: {
        ...coupon,
        usageCount: coupon.usageCount + 1,
        usedBy: [...coupon.usedBy, customerId]
      }
    };

    setCoupons(updatedCoupons);
    localStorage.setItem('coupons', JSON.stringify(updatedCoupons));

    return { success: true, discount: validation.discount };
  };

  // Obtenir les statistiques des promotions
  const getPromotionStats = (vendorId) => {
    const vendorPromotions = getVendorPromotions(vendorId);
    const vendorCoupons = getVendorCoupons(vendorId);

    const totalPromotions = vendorPromotions.length;
    const activePromotions = vendorPromotions.filter(p => p.status === 'active').length;
    const totalCoupons = vendorCoupons.length;
    const activeCoupons = vendorCoupons.filter(c => c.status === 'active').length;
    const totalUsage = vendorCoupons.reduce((sum, coupon) => sum + coupon.usageCount, 0);
    const totalDiscount = vendorPromotions.reduce((sum, promotion) => sum + promotion.totalDiscount, 0);

    return {
      totalPromotions,
      activePromotions,
      totalCoupons,
      activeCoupons,
      totalUsage,
      totalDiscount
    };
  };

  // Archiver une promotion
  const archivePromotion = (promotionId) => {
    return updatePromotion(promotionId, { status: 'archived' });
  };

  // Activer/Désactiver une promotion
  const togglePromotionStatus = (promotionId) => {
    const promotion = promotions[promotionId];
    if (promotion) {
      const newStatus = promotion.status === 'active' ? 'inactive' : 'active';
      return updatePromotion(promotionId, { status: newStatus });
    }
    return { success: false, error: 'Promotion non trouvée' };
  };

  // Activer/Désactiver un coupon
  const toggleCouponStatus = (couponId) => {
    const coupon = coupons[couponId];
    if (coupon) {
      const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
      return updateCoupon(couponId, { status: newStatus });
    }
    return { success: false, error: 'Coupon non trouvé' };
  };

  // Dupliquer une promotion
  const duplicatePromotion = (promotionId) => {
    const originalPromotion = promotions[promotionId];
    if (!originalPromotion) {
      return { success: false, error: 'Promotion non trouvée' };
    }

    const duplicatedPromotion = {
      ...originalPromotion,
      id: Date.now(),
      name: `${originalPromotion.name} (Copie)`,
      status: 'inactive',
      createdAt: new Date().toISOString(),
      usageCount: 0,
      totalDiscount: 0
    };

    const updatedPromotions = { ...promotions, [duplicatedPromotion.id]: duplicatedPromotion };
    setPromotions(updatedPromotions);
    localStorage.setItem('promotions', JSON.stringify(updatedPromotions));

    return { success: true, promotionId: duplicatedPromotion.id };
  };

  // Dupliquer un coupon
  const duplicateCoupon = (couponId) => {
    const originalCoupon = coupons[couponId];
    if (!originalCoupon) {
      return { success: false, error: 'Coupon non trouvé' };
    }

    const duplicatedCoupon = {
      ...originalCoupon,
      id: Date.now(),
      code: `${originalCoupon.code}-COPY`,
      name: `${originalCoupon.name} (Copie)`,
      status: 'inactive',
      createdAt: new Date().toISOString(),
      usageCount: 0,
      usedBy: []
    };

    const updatedCoupons = { ...coupons, [duplicatedCoupon.id]: duplicatedCoupon };
    setCoupons(updatedCoupons);
    localStorage.setItem('coupons', JSON.stringify(updatedCoupons));

    return { success: true, couponId: duplicatedCoupon.id };
  };

  const value = {
    promotions,
    coupons,
    loading,
    createPromotion,
    createCoupon,
    updatePromotion,
    updateCoupon,
    deletePromotion,
    deleteCoupon,
    getVendorPromotions,
    getVendorCoupons,
    validateCoupon,
    useCoupon,
    getPromotionStats,
    archivePromotion,
    togglePromotionStatus,
    toggleCouponStatus,
    duplicatePromotion,
    duplicateCoupon
  };

  return (
    <PromotionsContext.Provider value={value}>
      {children}
    </PromotionsContext.Provider>
  );
};

export { PromotionsContext };
export default PromotionsContext;