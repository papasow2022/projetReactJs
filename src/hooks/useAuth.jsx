import { useState, useEffect, createContext, useContext } from 'react';

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
      // Simulation d'une API de connexion
      const response = await simulateLoginAPI(email, password);
      
      if (response.success) {
        const userData = {
          ...response.user,
          isLoggedIn: true,
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        setRoles(userData.roles || (userData.isAdmin ? ['superadmin'] : []));
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
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

  const simulateLoginAPI = async (email, password) => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Chercher l'utilisateur dans le localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      // On retourne toutes les infos stockées avec les propriétés vendeur et admin
      return { success: true, user: {
        email: found.email,
        prenom: found.prenom,
        nom: found.nom,
        phone: found.phone,
        birthDate: found.birthDate,
        gender: found.gender,
        newsletter: found.newsletter,
        // Propriétés admin
        isAdmin: found.isAdmin || false,
        roles: found.roles || [],
        // Propriétés vendeur (par défaut false)
        isVendor: found.isVendor || false,
        isVendorValidated: found.isVendorValidated || false,
        vendorId: found.vendorId || null,
        vendorStatus: found.vendorStatus || 'none' // 'none', 'pending', 'validated', 'rejected'
      }};
    }

    // Si aucun utilisateur trouvé, retourner une erreur
    return { success: false, error: "Email ou mot de passe incorrect" };
  };

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