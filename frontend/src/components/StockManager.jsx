import React, { useState, useEffect } from 'react';
import { useStock } from '../contexts/StockContext';
import { useAuth } from '../hooks/useAuth';
import useStockCheck from '../hooks/useStock';
import WaitingListModal from './WaitingListModal';

const StockManager = ({ product, onStockChange }) => {
  const { addNotification } = useStock();
  const { user } = useAuth();
  const { checkStock } = useStockCheck();
  const [showWaitingList, setShowWaitingList] = useState(false);
  const [stockInfo, setStockInfo] = useState({
    quantity: 0,
    isLowStock: false,
    isOutOfStock: false,
    canAddToCart: false,
    isLoading: true
  });

  useEffect(() => {
    const fetchRealTimeStock = async () => {
      console.log('🔍 StockManager - Product complet:', product);
      console.log('🔍 StockManager - Product keys:', product ? Object.keys(product) : 'null');
      console.log('🔍 StockManager - Product.id:', product?.id);
      console.log('🔍 StockManager - Product.category:', product?.category);
      console.log('🔍 StockManager - Product._id:', product?._id);
      
      if (!product?.id && !product?._id || !product?.category) {
        console.log('⚠️ StockManager - Product ID ou category manquant:', { 
          id: product?.id, 
          _id: product?._id,
          category: product?.category 
        });
        setStockInfo({
          quantity: 0,
          isLowStock: false,
          isOutOfStock: true,
          canAddToCart: false,
          isLoading: false
        });
        return;
      }

      try {
        setStockInfo(prev => ({ ...prev, isLoading: true }));
        
        // SOLUTION SIMPLIFIÉE : Utiliser directement les données du produit
        // Évite les problèmes avec les IDs synthétiques et l'API
        const quantity = product.stock || 0;
        const isLowStock = quantity > 0 && quantity <= 5;
        const isOutOfStock = quantity <= 0;
        const canAddToCart = quantity > 0;

        console.log('🔍 StockManager - Utilisation des données du produit:', { 
          stock: product.stock,
          quantity,
          isLowStock,
          isOutOfStock,
          canAddToCart
        });

        setStockInfo({
          quantity,
          isLowStock,
          isOutOfStock,
          canAddToCart,
          isLoading: false
        });

        // Notifier le composant parent du changement de stock
        if (onStockChange) {
          onStockChange({ quantity, isLowStock, isOutOfStock, canAddToCart });
        }

        // Optionnel : Vérifier le stock en arrière-plan (sans bloquer l'UI)
        try {
          const productId = product.id || product._id;
          const category = product.subcategory || product.category || 'homme';
          
          if (productId && !productId.includes('synthetic-')) {
            const stockCheck = await checkStock(productId, category, 1);
            console.log('🔍 Vérification en arrière-plan:', stockCheck);
            
            // Mettre à jour avec les données réelles si disponibles
            if (stockCheck.availableStock !== undefined) {
              const realQuantity = stockCheck.availableStock || 0;
              const realIsLowStock = realQuantity > 0 && realQuantity <= 5;
              const realIsOutOfStock = realQuantity <= 0;
              const realCanAddToCart = realQuantity > 0;

              setStockInfo({
                quantity: realQuantity,
                isLowStock: realIsLowStock,
                isOutOfStock: realIsOutOfStock,
                canAddToCart: realCanAddToCart,
                isLoading: false
              });

              if (onStockChange) {
                onStockChange({ 
                  quantity: realQuantity, 
                  isLowStock: realIsLowStock, 
                  isOutOfStock: realIsOutOfStock, 
                  canAddToCart: realCanAddToCart 
                });
              }
            }
          }
        } catch (backgroundError) {
          console.log('⚠️ Vérification en arrière-plan échouée, utilisation des données du produit:', backgroundError.message);
        }

      } catch (error) {
        console.error('Erreur StockManager:', error);
        // En cas d'erreur, utiliser les données du produit
        const quantity = product.stock || 0;
        const isLowStock = quantity > 0 && quantity <= 5;
        const isOutOfStock = quantity <= 0;
        const canAddToCart = quantity > 0;

        setStockInfo({
          quantity,
          isLowStock,
          isOutOfStock,
          canAddToCart,
          isLoading: false
        });
      }
    };

    fetchRealTimeStock();
  }, [product, checkStock]); // Supprimer onStockChange des dépendances

  const handleWaitingListClick = () => {
    if (!user) {
      addNotification('Vous devez être connecté pour rejoindre la liste d\'attente', 'warning');
      return;
    }
    setShowWaitingList(true);
  };

  const getStockStatus = () => {
    if (stockInfo.isOutOfStock) {
      return {
        text: 'Rupture de stock',
        color: 'danger',
        icon: '❌',
        showWaitingList: true
      };
    } else if (stockInfo.isLowStock) {
      return {
        text: `Stock faible (${stockInfo.quantity} restants)`,
        color: 'warning',
        icon: '⚠️',
        showWaitingList: false
      };
    } else {
      return {
        text: `En stock (${stockInfo.quantity} disponibles)`,
        color: 'success',
        icon: '✅',
        showWaitingList: false
      };
    }
  };

  const status = getStockStatus();

  // Afficher un indicateur de chargement
  if (stockInfo.isLoading) {
    return (
      <div className="alert alert-info d-flex align-items-center mb-3" style={{ fontSize: '14px' }}>
        <div className="spinner-border spinner-border-sm me-2" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <span>Vérification du stock en cours...</span>
      </div>
    );
  }

  return (
    <>
      <div className={`alert alert-${status.color} d-flex align-items-center mb-3`} style={{ fontSize: '14px' }}>
        <span className="me-2" style={{ fontSize: '16px' }}>
          {status.icon}
        </span>
        <div className="flex-grow-1">
          <strong>{status.text}</strong>
          {stockInfo.isLowStock && (
            <div className="small text-muted">
              Commandez rapidement pour ne pas le rater !
            </div>
          )}
          {stockInfo.isOutOfStock && (
            <div className="small text-muted">
              Ce produit est temporairement indisponible.
            </div>
          )}
        </div>
        {status.showWaitingList && (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handleWaitingListClick}
            style={{ fontSize: '12px' }}
          >
            📋 Liste d'attente
          </button>
        )}
      </div>

      {/* Bouton d'ajout au panier conditionnel */}
      {!stockInfo.canAddToCart && (
        <div className="d-grid gap-2">
          <button
            className="btn btn-outline-secondary"
            disabled
            style={{ fontSize: '14px' }}
          >
            ❌ Indisponible
          </button>
          <button
            className="btn btn-primary"
            onClick={handleWaitingListClick}
            style={{ fontSize: '14px' }}
          >
            📋 Rejoindre la liste d'attente
          </button>
        </div>
      )}

      {/* Modal de liste d'attente */}
      <WaitingListModal
        isOpen={showWaitingList}
        onClose={() => setShowWaitingList(false)}
        product={{
          id: product?.id,
          name: product?.name,
          category: product?.category || 'homme'
        }}
      />
    </>
  );
};

export default StockManager;
