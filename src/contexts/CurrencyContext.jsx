import React, { createContext, useContext, useEffect, useState } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within a CurrencyProvider');
  return ctx;
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');

  // Taux de change fixes (EUR comme base)
  const rates = {
    EUR: 1,
    CFA: 655.957,
    GNF: 9500
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('adminCurrency');
      if (saved && rates[saved]) setSelectedCurrency(saved);
    } catch (_) {}
  }, []);

  const changeCurrency = (code) => {
    if (rates[code]) {
      setSelectedCurrency(code);
      localStorage.setItem('adminCurrency', code);
    }
  };

  const format = (amountInEUR) => {
    const converted = Number(amountInEUR || 0) * rates[selectedCurrency];
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(converted);
    return `${formatted} ${selectedCurrency}`;
  };

  const value = { selectedCurrency, rates, changeCurrency, format };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export { CurrencyContext };