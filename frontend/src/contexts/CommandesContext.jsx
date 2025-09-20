import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const CommandesContext = createContext();

const commandesInitiales = [];

export function CommandesProvider({ children }) {
  // Initialisation depuis le localStorage si dispo, sinon commandesInitiales
  const [commandes, setCommandes] = useState(commandesInitiales);

  // Fonction pour charger les commandes d'un utilisateur spécifique
  const loadUserCommandes = useCallback((userEmail) => {
    if (userEmail) {
      const userKey = `commandes_${userEmail}`;
      const stored = localStorage.getItem(userKey);
      if (stored) {
        setCommandes(JSON.parse(stored));
      } else {
        setCommandes(commandesInitiales);
      }
    }
  }, []);

  // Fonction pour sauvegarder les commandes d'un utilisateur spécifique
  const saveUserCommandes = useCallback((userEmail, commandesData) => {
    if (userEmail) {
      const userKey = `commandes_${userEmail}`;
      localStorage.setItem(userKey, JSON.stringify(commandesData));
      console.log('Context: Sauvegarde dans', userKey, ':', commandesData.length, 'commandes');
    }
  }, []);

  // Fonction pour obtenir l'email de l'utilisateur actuel depuis localStorage
  const getCurrentUserEmail = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.email;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    }
    return null;
  };

  // Charger les commandes au démarrage
  useEffect(() => {
    const userEmail = getCurrentUserEmail();
    if (userEmail) {
      loadUserCommandes(userEmail);
    }
  }, []);

  // Note: La sauvegarde automatique a été supprimée pour éviter les boucles infinies
  // La sauvegarde se fait maintenant explicitement via saveUserCommandes

  return (
    <CommandesContext.Provider value={{ 
      commandes, 
      setCommandes, 
      loadUserCommandes, 
      saveUserCommandes 
    }}>
      {children}
    </CommandesContext.Provider>
  );
}

export function useCommandes() {
  return useContext(CommandesContext);
} 