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

  // Si l'utilisateur n'est pas un vendeur, rediriger vers l'accueil
  if (!user?.isVendor) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si le vendeur n'est pas encore validé, rediriger vers le centre de statut
  if (!user?.isVendorValidated) {
    return <Navigate to="/vendeur/statut-demande" state={{ from: location }} replace />;
  }

  // Si tout est OK, afficher le contenu protégé
  return children;
};

export default VendorProtectedRoute; 