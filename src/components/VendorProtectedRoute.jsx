import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const VendorProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Si l'utilisateur n'est pas connecté, rediriger vers la connexion
  if (!isAuthenticated) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  // Si l'utilisateur n'est pas un vendeur, rediriger vers l'inscription vendeur
  if (!user?.isVendor) {
    return <Navigate to="/vendeur/inscription" state={{ from: location }} replace />;
  }

  // Si le vendeur n'est pas encore validé, rediriger vers la page de confirmation
  if (!user?.isVendorValidated) {
    return <Navigate to="/confirmation-vendeur" state={{ from: location }} replace />;
  }

  // Si tout est OK, afficher le contenu protégé
  return children;
};

export default VendorProtectedRoute; 