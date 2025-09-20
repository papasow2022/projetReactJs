import React, { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]); // e.g., ['superadmin','moderator','finance','support','viewer']

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Vérifier si la session n'a pas expiré (24h)
          const loginTime = new Date(userData.loginTime);
          const now = new Date();
          const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
          
          if (hoursDiff < 24 && userData.isLoggedIn) {
            setUser(userData);
            setIsAuthenticated(true);
            setRoles(userData.roles || (userData.isAdmin ? ['superadmin'] : []));
          } else {
            // Session expirée
            logout();
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.success) {
        const userData = {
          ...data.user,
          isLoggedIn: true,
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
        setUser(userData);
        setIsAuthenticated(true);
        setRoles(userData.roles || (userData.isAdmin ? ['superadmin'] : []));
        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.message,
          needsVerification: data.needsVerification,
          email: data.email
        };
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, error: 'Erreur de connexion' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setRoles([]);
  };

  const updateUser = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      if (updates.roles) setRoles(updates.roles);
    }
  };

  // RBAC helpers
  const hasRole = (role) => roles.includes(role);
  const hasAnyRole = (required = []) => required.length === 0 || required.some(r => roles.includes(r));


  const value = {
    user,
    setUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    roles,
    setRoles,
    hasRole,
    hasAnyRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 