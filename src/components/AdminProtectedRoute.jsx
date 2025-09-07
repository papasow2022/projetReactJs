import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function AdminProtectedRoute({ children, roles: requiredRoles = [] }) {
  const location = useLocation();
  
  // Vérifier directement dans localStorage
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    return <Navigate to="/connexion-admin" state={{ from: location }} replace />;
  }
  
  const user = JSON.parse(storedUser);
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Vérifier les rôles si spécifiés
  if (requiredRoles.length > 0) {
    const userRoles = user.roles || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    if (!hasRequiredRole) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
}

