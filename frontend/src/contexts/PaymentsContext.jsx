import React, { createContext, useContext, useReducer, useEffect } from 'react';

const PaymentsContext = createContext();

// Types d'actions
const PAYMENT_ACTIONS = {
  LOAD_PAYMENTS: 'LOAD_PAYMENTS',
  ADD_PAYMENT: 'ADD_PAYMENT',
  UPDATE_PAYMENT_STATUS: 'UPDATE_PAYMENT_STATUS',
  SET_PAYMENT_METHOD: 'SET_PAYMENT_METHOD',
  PROCESS_PAYMENT: 'PROCESS_PAYMENT',
  ADD_PAYMENT_HISTORY: 'ADD_PAYMENT_HISTORY'
};

// État initial
const initialState = {
  payments: [],
  paymentMethods: [],
  paymentHistory: [],
  loading: false,
  error: null
};

// Reducer
const paymentsReducer = (state, action) => {
  switch (action.type) {
    case PAYMENT_ACTIONS.LOAD_PAYMENTS:
      return {
        ...state,
        payments: action.payload,
        loading: false
      };
    
    case PAYMENT_ACTIONS.ADD_PAYMENT:
      return {
        ...state,
        payments: [...state.payments, action.payload]
      };
    
    case PAYMENT_ACTIONS.UPDATE_PAYMENT_STATUS:
      return {
        ...state,
        payments: state.payments.map(payment =>
          payment.id === action.payload.id
            ? { ...payment, status: action.payload.status, updatedAt: new Date().toISOString() }
            : payment
        )
      };
    
    case PAYMENT_ACTIONS.SET_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethods: action.payload
      };
    
    case PAYMENT_ACTIONS.PROCESS_PAYMENT:
      return {
        ...state,
        payments: state.payments.map(payment =>
          payment.id === action.payload.id
            ? { 
                ...payment, 
                status: 'processed',
                processedAt: new Date().toISOString(),
                transactionId: action.payload.transactionId
              }
            : payment
        )
      };
    
    case PAYMENT_ACTIONS.ADD_PAYMENT_HISTORY:
      return {
        ...state,
        paymentHistory: [...state.paymentHistory, action.payload]
      };
    
    default:
      return state;
  }
};

// Provider
export const PaymentsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paymentsReducer, initialState);

  // Charger les paiements depuis le localStorage
  useEffect(() => {
    loadPayments();
    loadPaymentMethods();
    loadPaymentHistory();
  }, []);

  const loadPayments = () => {
    try {
      const savedPayments = localStorage.getItem('vendor_payments');
      if (savedPayments) {
        const payments = JSON.parse(savedPayments);
        dispatch({ type: PAYMENT_ACTIONS.LOAD_PAYMENTS, payload: payments });
      } else {
        // Données de démonstration
        const demoPayments = [
          {
            id: 'pay_001',
            vendorId: 'vendor_1',
            vendorName: 'Boutique Mode',
            amount: 1250.50,
            currency: 'EUR',
            status: 'pending',
            type: 'monthly',
            period: '2024-01',
            ordersCount: 45,
            commissionRate: 0.15,
            platformFee: 187.58,
            netAmount: 1062.92,
            createdAt: '2024-01-31T10:00:00Z',
            dueDate: '2024-02-15T23:59:59Z',
            paymentMethod: 'bank_transfer',
            bankDetails: {
              accountName: 'Boutique Mode SARL',
              iban: 'FR76 1234 5678 9012 3456 7890 123',
              bic: 'BNPAFRPPXXX'
            }
          },
          {
            id: 'pay_002',
            vendorId: 'vendor_2',
            vendorName: 'Tech Store Pro',
            amount: 890.25,
            currency: 'EUR',
            status: 'processed',
            type: 'monthly',
            period: '2024-01',
            ordersCount: 32,
            commissionRate: 0.12,
            platformFee: 106.83,
            netAmount: 783.42,
            createdAt: '2024-01-31T10:00:00Z',
            processedAt: '2024-02-01T14:30:00Z',
            dueDate: '2024-02-15T23:59:59Z',
            paymentMethod: 'paypal',
            transactionId: 'TXN_789456123',
            bankDetails: {
              accountName: 'Tech Store Pro',
              email: 'payments@techstorepro.com'
            }
          },
          {
            id: 'pay_003',
            vendorId: 'vendor_1',
            vendorName: 'Boutique Mode',
            amount: 2100.75,
            currency: 'EUR',
            status: 'scheduled',
            type: 'monthly',
            period: '2024-02',
            ordersCount: 78,
            commissionRate: 0.15,
            platformFee: 315.11,
            netAmount: 1785.64,
            createdAt: '2024-02-29T10:00:00Z',
            dueDate: '2024-03-15T23:59:59Z',
            paymentMethod: 'bank_transfer',
            bankDetails: {
              accountName: 'Boutique Mode SARL',
              iban: 'FR76 1234 5678 9012 3456 7890 123',
              bic: 'BNPAFRPPXXX'
            }
          }
        ];
        dispatch({ type: PAYMENT_ACTIONS.LOAD_PAYMENTS, payload: demoPayments });
        localStorage.setItem('vendor_payments', JSON.stringify(demoPayments));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
    }
  };

  const loadPaymentMethods = () => {
    const demoMethods = [
      {
        id: 'bank_transfer',
        name: 'Virement bancaire',
        description: 'Paiement par virement bancaire SEPA',
        processingTime: '2-3 jours ouvrés',
        fees: 0,
        icon: '🏦',
        isActive: true
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Paiement instantané via PayPal',
        processingTime: 'Instantané',
        fees: 0.029,
        icon: '💳',
        isActive: true
      },
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Paiement sécurisé via Stripe',
        processingTime: '1-2 jours ouvrés',
        fees: 0.029,
        icon: '💎',
        isActive: false
      }
    ];
    dispatch({ type: PAYMENT_ACTIONS.SET_PAYMENT_METHOD, payload: demoMethods });
  };

  const loadPaymentHistory = () => {
    try {
      const savedHistory = localStorage.getItem('vendor_payment_history');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        dispatch({ type: PAYMENT_ACTIONS.ADD_PAYMENT_HISTORY, payload: history });
      } else {
        // Historique de démonstration
        const demoHistory = [
          {
            id: 'hist_001',
            paymentId: 'pay_002',
            action: 'payment_processed',
            amount: 783.42,
            currency: 'EUR',
            timestamp: '2024-02-01T14:30:00Z',
            details: 'Paiement traité avec succès via PayPal',
            transactionId: 'TXN_789456123'
          },
          {
            id: 'hist_002',
            paymentId: 'pay_001',
            action: 'payment_scheduled',
            amount: 1062.92,
            currency: 'EUR',
            timestamp: '2024-01-31T10:00:00Z',
            details: 'Paiement programmé pour le 15/02/2024'
          }
        ];
        dispatch({ type: PAYMENT_ACTIONS.ADD_PAYMENT_HISTORY, payload: demoHistory });
        localStorage.setItem('vendor_payment_history', JSON.stringify(demoHistory));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    }
  };

  const updatePaymentStatus = (paymentId, status) => {
    dispatch({ 
      type: PAYMENT_ACTIONS.UPDATE_PAYMENT_STATUS, 
      payload: { id: paymentId, status } 
    });
    
    // Sauvegarder dans localStorage
    const updatedPayments = state.payments.map(payment =>
      payment.id === paymentId
        ? { ...payment, status, updatedAt: new Date().toISOString() }
        : payment
    );
    localStorage.setItem('vendor_payments', JSON.stringify(updatedPayments));
  };

  const processPayment = (paymentId, transactionId) => {
    dispatch({ 
      type: PAYMENT_ACTIONS.PROCESS_PAYMENT, 
      payload: { id: paymentId, transactionId } 
    });
    
    // Ajouter à l'historique
    const payment = state.payments.find(p => p.id === paymentId);
    if (payment) {
      const historyEntry = {
        id: `hist_${Date.now()}`,
        paymentId,
        action: 'payment_processed',
        amount: payment.netAmount,
        currency: payment.currency,
        timestamp: new Date().toISOString(),
        details: `Paiement traité avec succès via ${payment.paymentMethod}`,
        transactionId
      };
      
      dispatch({ type: PAYMENT_ACTIONS.ADD_PAYMENT_HISTORY, payload: historyEntry });
      
      // Sauvegarder l'historique
      const updatedHistory = [...state.paymentHistory, historyEntry];
      localStorage.setItem('vendor_payment_history', JSON.stringify(updatedHistory));
    }
    
    // Sauvegarder les paiements
    const updatedPayments = state.payments.map(payment =>
      payment.id === paymentId
        ? { 
            ...payment, 
            status: 'processed',
            processedAt: new Date().toISOString(),
            transactionId
          }
        : payment
    );
    localStorage.setItem('vendor_payments', JSON.stringify(updatedPayments));
  };

  const getVendorPayments = (vendorId) => {
    return state.payments.filter(payment => payment.vendorId === vendorId);
  };

  const getVendorPaymentHistory = (vendorId) => {
    const vendorPaymentIds = state.payments
      .filter(payment => payment.vendorId === vendorId)
      .map(payment => payment.id);
    
    return state.paymentHistory.filter(history => 
      vendorPaymentIds.includes(history.paymentId)
    );
  };

  const calculateMonthlyStats = (vendorId) => {
    const vendorPayments = getVendorPayments(vendorId);
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    const monthlyPayments = vendorPayments.filter(payment => 
      payment.period === currentMonth
    );
    
    const totalAmount = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalNetAmount = monthlyPayments.reduce((sum, payment) => sum + payment.netAmount, 0);
    const totalOrders = monthlyPayments.reduce((sum, payment) => sum + payment.ordersCount, 0);
    const totalFees = monthlyPayments.reduce((sum, payment) => sum + payment.platformFee, 0);
    
    return {
      totalAmount,
      totalNetAmount,
      totalOrders,
      totalFees,
      paymentsCount: monthlyPayments.length
    };
  };

  const getUpcomingPayments = (vendorId) => {
    const vendorPayments = getVendorPayments(vendorId);
    const now = new Date();
    
    return vendorPayments.filter(payment => {
      const dueDate = new Date(payment.dueDate);
      return dueDate > now && payment.status === 'scheduled';
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  const getPendingPayments = (vendorId) => {
    const vendorPayments = getVendorPayments(vendorId);
    return vendorPayments.filter(payment => payment.status === 'pending');
  };

  const value = {
    ...state,
    updatePaymentStatus,
    processPayment,
    getVendorPayments,
    getVendorPaymentHistory,
    calculateMonthlyStats,
    getUpcomingPayments,
    getPendingPayments,
    loadPayments
  };

  return (
    <PaymentsContext.Provider value={value}>
      {children}
    </PaymentsContext.Provider>
  );
};

export const usePayments = () => {
  const context = useContext(PaymentsContext);
  if (!context) {
    throw new Error('usePayments doit être utilisé dans un PaymentsProvider');
  }
  return context;
};

export { PaymentsContext };
export default PaymentsContext;