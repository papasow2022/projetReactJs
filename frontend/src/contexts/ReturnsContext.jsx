import React, { createContext, useContext, useState, useEffect } from 'react';

const ReturnsContext = createContext();

export const useReturns = () => {
  const context = useContext(ReturnsContext);
  if (!context) {
    throw new Error('useReturns doit être utilisé dans un ReturnsProvider');
  }
  return context;
};

export const ReturnsProvider = ({ children }) => {
  const [returns, setReturns] = useState({});
  const [exchanges, setExchanges] = useState({});
  const [loading, setLoading] = useState(false);

  // Charger les données depuis localStorage
  useEffect(() => {
    loadReturns();
    loadExchanges();
  }, []);

  const loadReturns = () => {
    try {
      const savedReturns = localStorage.getItem('returns');
      if (savedReturns) {
        setReturns(JSON.parse(savedReturns));
      } else {
        // Données de démonstration
        const demoReturns = {
          'ret_001': {
            id: 'ret_001',
            orderId: 'ORD_12345',
            customerId: 'cust_001',
            customerName: 'Marie Dupont',
            vendorId: 'vendor_1',
            vendorName: 'Boutique Mode',
            productId: 'prod_001',
            productName: 'Robe été fleurie',
            productImage: '/images/product1.jpg',
            reason: 'Taille incorrecte',
            description: 'La robe est trop petite, je souhaite la retourner pour une taille plus grande.',
            status: 'pending',
            type: 'return',
            amount: 89.99,
            date: '2024-01-15T10:30:00Z',
            responses: [
              {
                id: 'resp_001',
                sender: 'customer',
                senderName: 'Marie Dupont',
                message: 'Bonjour, je souhaite retourner cette robe car elle est trop petite.',
                date: '2024-01-15T10:30:00Z'
              }
            ]
          },
          'ret_002': {
            id: 'ret_002',
            orderId: 'ORD_12346',
            customerId: 'cust_002',
            customerName: 'Jean Martin',
            vendorId: 'vendor_1',
            vendorName: 'Boutique Mode',
            productId: 'prod_002',
            productName: 'Chaussures cuir noir',
            productImage: '/images/product2.jpg',
            reason: 'Défaut de fabrication',
            description: 'Les chaussures ont un défaut sur la semelle droite.',
            status: 'approved',
            type: 'return',
            amount: 149.99,
            date: '2024-01-14T14:20:00Z',
            approvedAt: '2024-01-15T09:15:00Z',
            responses: [
              {
                id: 'resp_002',
                sender: 'customer',
                senderName: 'Jean Martin',
                message: 'Bonjour, j\'ai reçu les chaussures mais il y a un défaut sur la semelle.',
                date: '2024-01-14T14:20:00Z'
              },
              {
                id: 'resp_003',
                sender: 'vendor',
                senderName: 'Boutique Mode',
                message: 'Bonjour, nous acceptons votre retour. Veuillez nous renvoyer l\'article.',
                date: '2024-01-15T09:15:00Z'
              }
            ]
          }
        };
        setReturns(demoReturns);
        localStorage.setItem('returns', JSON.stringify(demoReturns));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des retours:', error);
    }
  };

  const loadExchanges = () => {
    try {
      const savedExchanges = localStorage.getItem('exchanges');
      if (savedExchanges) {
        setExchanges(JSON.parse(savedExchanges));
      } else {
        // Données de démonstration
        const demoExchanges = {
          'exc_001': {
            id: 'exc_001',
            orderId: 'ORD_12347',
            customerId: 'cust_003',
            customerName: 'Sophie Leroy',
            vendorId: 'vendor_1',
            vendorName: 'Boutique Mode',
            productId: 'prod_003',
            productName: 'Sac à main cuir',
            productImage: '/images/product3.jpg',
            reason: 'Couleur différente',
            description: 'Le sac reçu est bleu au lieu de noir comme commandé.',
            status: 'pending',
            type: 'exchange',
            amount: 199.99,
            date: '2024-01-16T11:45:00Z',
            responses: [
              {
                id: 'resp_004',
                sender: 'customer',
                senderName: 'Sophie Leroy',
                message: 'Bonjour, j\'ai reçu un sac bleu au lieu du noir commandé. Puis-je l\'échanger ?',
                date: '2024-01-16T11:45:00Z'
              }
            ]
          }
        };
        setExchanges(demoExchanges);
        localStorage.setItem('exchanges', JSON.stringify(demoExchanges));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des échanges:', error);
    }
  };

  const createReturnRequest = (requestData) => {
    const returnId = `ret_${Date.now()}`;
    const newReturn = {
      id: returnId,
      ...requestData,
      status: 'pending',
      date: new Date().toISOString(),
      responses: []
    };

    const updatedReturns = { ...returns, [returnId]: newReturn };
    setReturns(updatedReturns);
    localStorage.setItem('returns', JSON.stringify(updatedReturns));

    return { success: true, returnId };
  };

  const createExchangeRequest = (requestData) => {
    const exchangeId = `exc_${Date.now()}`;
    const newExchange = {
      id: exchangeId,
      ...requestData,
      status: 'pending',
      date: new Date().toISOString(),
      responses: []
    };

    const updatedExchanges = { ...exchanges, [exchangeId]: newExchange };
    setExchanges(updatedExchanges);
    localStorage.setItem('exchanges', JSON.stringify(updatedExchanges));

    return { success: true, exchangeId };
  };

  const processReturnRequest = (returnId, action, vendorResponse = '') => {
    const returnRequest = returns[returnId];
    if (!returnRequest) return { success: false, error: 'Retour non trouvé' };

    const updatedReturn = {
      ...returnRequest,
      status: action,
      processedAt: new Date().toISOString()
    };

    if (vendorResponse) {
      const response = {
        id: `resp_${Date.now()}`,
        sender: 'vendor',
        senderName: returnRequest.vendorName,
        message: vendorResponse,
        date: new Date().toISOString()
      };
      updatedReturn.responses = [...returnRequest.responses, response];
    }

    const updatedReturns = { ...returns, [returnId]: updatedReturn };
    setReturns(updatedReturns);
    localStorage.setItem('returns', JSON.stringify(updatedReturns));

    return { success: true };
  };

  const processExchangeRequest = (exchangeId, action, vendorResponse = '') => {
    const exchangeRequest = exchanges[exchangeId];
    if (!exchangeRequest) return { success: false, error: 'Échange non trouvé' };

    const updatedExchange = {
      ...exchangeRequest,
      status: action,
      processedAt: new Date().toISOString()
    };

    if (vendorResponse) {
      const response = {
        id: `resp_${Date.now()}`,
        sender: 'vendor',
        senderName: exchangeRequest.vendorName,
        message: vendorResponse,
        date: new Date().toISOString()
      };
      updatedExchange.responses = [...exchangeRequest.responses, response];
    }

    const updatedExchanges = { ...exchanges, [exchangeId]: updatedExchange };
    setExchanges(updatedExchanges);
    localStorage.setItem('exchanges', JSON.stringify(updatedExchanges));

    return { success: true };
  };

  const getVendorReturns = (vendorId) => {
    return Object.values(returns).filter(returnItem => returnItem.vendorId === vendorId);
  };

  const getVendorExchanges = (vendorId) => {
    return Object.values(exchanges).filter(exchange => exchange.vendorId === vendorId);
  };

  const getCustomerReturns = (customerId) => {
    return Object.values(returns).filter(returnItem => returnItem.customerId === customerId);
  };

  const getCustomerExchanges = (customerId) => {
    return Object.values(exchanges).filter(exchange => exchange.customerId === customerId);
  };

  const cancelRequest = (requestId, type) => {
    if (type === 'return') {
      const updatedReturns = { ...returns };
      if (updatedReturns[requestId]) {
        updatedReturns[requestId].status = 'cancelled';
        updatedReturns[requestId].cancelledAt = new Date().toISOString();
        setReturns(updatedReturns);
        localStorage.setItem('returns', JSON.stringify(updatedReturns));
      }
    } else if (type === 'exchange') {
      const updatedExchanges = { ...exchanges };
      if (updatedExchanges[requestId]) {
        updatedExchanges[requestId].status = 'cancelled';
        updatedExchanges[requestId].cancelledAt = new Date().toISOString();
        setExchanges(updatedExchanges);
        localStorage.setItem('exchanges', JSON.stringify(updatedExchanges));
      }
    }
  };

  const updateReturnStatus = (returnId, newStatus) => {
    const updatedReturns = { ...returns };
    if (updatedReturns[returnId]) {
      updatedReturns[returnId].status = newStatus;
      updatedReturns[returnId].updatedAt = new Date().toISOString();
      setReturns(updatedReturns);
      localStorage.setItem('returns', JSON.stringify(updatedReturns));
    }
  };

  const updateExchangeStatus = (exchangeId, newStatus) => {
    const updatedExchanges = { ...exchanges };
    if (updatedExchanges[exchangeId]) {
      updatedExchanges[exchangeId].status = newStatus;
      updatedExchanges[exchangeId].updatedAt = new Date().toISOString();
      setExchanges(updatedExchanges);
      localStorage.setItem('exchanges', JSON.stringify(updatedExchanges));
    }
  };

  const addReturnResponse = (returnId, message, senderName) => {
    const updatedReturns = { ...returns };
    if (updatedReturns[returnId]) {
      const response = {
        id: `resp_${Date.now()}`,
        sender: 'vendor',
        senderName,
        message,
        date: new Date().toISOString()
      };
      updatedReturns[returnId].responses = [...updatedReturns[returnId].responses, response];
      setReturns(updatedReturns);
      localStorage.setItem('returns', JSON.stringify(updatedReturns));
    }
  };

  const getReturnsStats = (vendorId) => {
    const vendorReturns = getVendorReturns(vendorId);
    const vendorExchanges = getVendorExchanges(vendorId);
    
    return {
      totalReturns: vendorReturns.length,
      pendingReturns: vendorReturns.filter(r => r.status === 'pending').length,
      approvedReturns: vendorReturns.filter(r => r.status === 'approved').length,
      rejectedReturns: vendorReturns.filter(r => r.status === 'rejected').length,
      totalExchanges: vendorExchanges.length,
      pendingExchanges: vendorExchanges.filter(e => e.status === 'pending').length,
      approvedExchanges: vendorExchanges.filter(e => e.status === 'approved').length,
      rejectedExchanges: vendorExchanges.filter(e => e.status === 'rejected').length
    };
  };

  const getReturnReasons = () => {
    return [
      'Taille incorrecte',
      'Couleur différente',
      'Défaut de fabrication',
      'Article endommagé',
      'Article non conforme à la description',
      'Changement d\'avis',
      'Autre'
    ];
  };

  const generateReturnLabel = (returnId) => {
    const returnRequest = returns[returnId];
    if (!returnRequest) return { success: false, error: 'Retour non trouvé' };

    const label = {
      id: `label_${returnId}`,
      returnId,
      trackingNumber: `RET${returnId}`,
      generatedAt: new Date().toISOString(),
      status: 'generated'
    };

    const updatedReturn = {
      ...returnRequest,
      returnLabel: label,
      status: 'label_generated'
    };

    const updatedReturns = { ...returns, [returnId]: updatedReturn };
    setReturns(updatedReturns);
    localStorage.setItem('returns', JSON.stringify(updatedReturns));

    return { success: true, label };
  };

  const generateExchangeLabel = (exchangeId) => {
    const exchangeRequest = exchanges[exchangeId];
    if (!exchangeRequest) return { success: false, error: 'Échange non trouvé' };

    const label = {
      id: `label_${exchangeId}`,
      exchangeId,
      trackingNumber: `EXC${exchangeId}`,
      generatedAt: new Date().toISOString(),
      status: 'generated'
    };

    const updatedExchange = {
      ...exchangeRequest,
      exchangeLabel: label,
      status: 'label_generated'
    };

    const updatedExchanges = { ...exchanges, [exchangeId]: updatedExchange };
    setExchanges(updatedExchanges);
    localStorage.setItem('exchanges', JSON.stringify(updatedExchanges));

    return { success: true, label };
  };

  const value = {
    returns: Object.values(returns),
    exchanges: Object.values(exchanges),
    loading,
    createReturnRequest,
    createExchangeRequest,
    processReturnRequest,
    processExchangeRequest,
    getVendorReturns,
    getVendorExchanges,
    getCustomerReturns,
    getCustomerExchanges,
    cancelRequest,
    updateReturnStatus,
    updateExchangeStatus,
    addReturnResponse,
    getReturnsStats,
    getReturnReasons,
    generateReturnLabel,
    generateExchangeLabel
  };

  return (
    <ReturnsContext.Provider value={value}>
      {children}
    </ReturnsContext.Provider>
  );
};

export { ReturnsContext };
export default ReturnsContext;