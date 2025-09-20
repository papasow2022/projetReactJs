import { useState, useCallback } from 'react';

const useStock = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Trouver l'ID du produit dans le catalogue par son path
  const findProductId = useCallback(async (productPath) => {
    try {
      const response = await fetch(`${baseUrl}/api/catalogue`);
      if (!response.ok) throw new Error('Erreur lors de la récupération du catalogue');
      
      const products = await response.json();
      const product = products.find(p => p.path === productPath);
      
      if (!product) {
        throw new Error(`Produit non trouvé: ${productPath}`);
      }
      
      return product._id;
    } catch (err) {
      console.error('❌ Erreur recherche produit:', err);
      throw err;
    }
  }, [baseUrl]);

  // Vérifier le stock disponible
  const checkStock = useCallback(async (productPath, quantity = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Vérification du stock (API catalogue):', { productPath, quantity, type: typeof quantity });
      
      // Trouver l'ID du produit
      const productId = await findProductId(productPath);
      
      // Vérifier le stock via l'API catalogue
      const response = await fetch(`${baseUrl}/api/catalogue/${productId}/stock`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la vérification du stock');
      }
      
      const data = await response.json();
      const canAdd = data.stock >= quantity;
      
      const result = {
        success: true,
        canAdd,
        availableStock: data.stock,
        requestedQuantity: quantity,
        productId: productId,
        productName: data.name,
        message: canAdd ? 'Stock disponible' : 'Stock insuffisant'
      };
      
      console.log('📊 Résultat de vérification (catalogue):', result);
      return result;
      
    } catch (err) {
      console.error('❌ Erreur vérification stock:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl, findProductId]);

  // Réserver du stock (ajouter au panier) - SIMULATION PURE FRONTEND
  const reserveStock = useCallback(async (productPath, quantity = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📦 Réservation du stock (SIMULATION PURE):', { productPath, quantity });
      
      // Simulation simple - toujours réussir
      const result = {
        success: true,
        productId: 'simulation-id',
        name: 'Produit simulé',
        reservedQuantity: quantity,
        remainingStock: 7, // Stock simulé
        message: `${quantity} exemplaire(s) réservé(s)`
      };
      
      console.log('📊 Résultat de réservation (SIMULATION PURE):', result);
      return result;
      
    } catch (err) {
      console.error('❌ Erreur réservation stock:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Restaurer du stock (retirer du panier) - MISE À JOUR RÉELLE
  const restoreStock = useCallback(async (productPath, quantity = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Restauration du stock (API catalogue):', { productPath, quantity });
      
      // Trouver l'ID du produit
      const productId = await findProductId(productPath);
      
      // Restaurer le stock via l'API catalogue
      const response = await fetch(`${baseUrl}/api/catalogue/${productId}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la restauration du stock');
      }
      
      const data = await response.json();
      
      console.log('📊 Résultat de restauration (catalogue):', data);
      return data;
      
    } catch (err) {
      console.error('❌ Erreur restauration stock:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl, findProductId]);

  // Obtenir le stock d'un produit
  const getStock = useCallback(async (productPath) => {
    setLoading(true);
    setError(null);
    
    try {
      // Trouver l'ID du produit
      const productId = await findProductId(productPath);
      
      // Récupérer le stock via l'API catalogue
      const response = await fetch(`${baseUrl}/api/catalogue/${productId}/stock`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération du stock');
      }
      
      const data = await response.json();
      return data;
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl, findProductId]);

  // Récupérer tous les produits du catalogue
  const getCatalogue = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const url = `${baseUrl}/api/catalogue${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du catalogue');
      }
      
      const data = await response.json();
      return data;
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  return {
    loading,
    error,
    checkStock,
    reserveStock,
    restoreStock,
    getStock,
    getCatalogue
  };
};

export default useStock;