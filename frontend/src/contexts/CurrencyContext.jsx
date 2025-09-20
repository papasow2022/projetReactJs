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
    USD: 1.08,
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

  const convert = (amount, fromCurrency, toCurrency) => {
    if (!rates[fromCurrency] || !rates[toCurrency]) return 0;
    // Convertir vers EUR puis vers la devise cible
    const inEUR = amount / rates[fromCurrency];
    return inEUR * rates[toCurrency];
  };

  const getCurrencySymbol = (currency) => {
    const symbols = {
      EUR: '€',
      USD: '$',
      CFA: 'F',
      GNF: 'G'
    };
    return symbols[currency] || currency;
  };

  const value = { selectedCurrency, rates, changeCurrency, format, convert, getCurrencySymbol };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export { CurrencyContext };