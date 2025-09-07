// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Récupérer le thème depuis localStorage ou utiliser 'light' par défaut
    const savedTheme = localStorage.getItem('papasow-theme');
    return savedTheme || 'light';
  });

  const [isSystemTheme, setIsSystemTheme] = useState(() => {
    return localStorage.getItem('papasow-theme-system') === 'true';
  });

  // Détecter le thème système
  useEffect(() => {
    if (isSystemTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      
      setTheme(mediaQuery.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [isSystemTheme]);

  // Sauvegarder le thème dans localStorage
  useEffect(() => {
    localStorage.setItem('papasow-theme', theme);
  }, [theme]);

  // Appliquer le thème au document
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    setIsSystemTheme(false);
  }, []);

  const setSystemTheme = useCallback(() => {
    setIsSystemTheme(true);
    localStorage.setItem('papasow-theme-system', 'true');
  }, []);

  const setLightTheme = useCallback(() => {
    setTheme('light');
    setIsSystemTheme(false);
    localStorage.setItem('papasow-theme-system', 'false');
  }, []);

  const setDarkTheme = useCallback(() => {
    setTheme('dark');
    setIsSystemTheme(false);
    localStorage.setItem('papasow-theme-system', 'false');
  }, []);

  const value = {
    theme,
    isSystemTheme,
    toggleTheme,
    setSystemTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook pour obtenir les couleurs du thème actuel
export const useThemeColors = () => {
  const { theme } = useTheme();
  
  const lightColors = {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#dee2e6',
    shadow: 'rgba(0, 0, 0, 0.1)',
    header: '#232f3e',
    card: '#ffffff',
    input: '#ffffff',
    hover: '#f8f9fa'
  };

  const darkColors = {
    primary: '#0d6efd',
    secondary: '#6c757d',
    success: '#198754',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#0dcaf0',
    light: '#f8f9fa',
    dark: '#212529',
    white: '#ffffff',
    background: '#0d1117',
    surface: '#161b22',
    text: '#f0f6fc',
    textSecondary: '#8b949e',
    border: '#30363d',
    shadow: 'rgba(0, 0, 0, 0.3)',
    header: '#161b22',
    card: '#21262d',
    input: '#21262d',
    hover: '#30363d'
  };

  return theme === 'dark' ? darkColors : lightColors;
};
 
 
 
 
 
 
 
 
 