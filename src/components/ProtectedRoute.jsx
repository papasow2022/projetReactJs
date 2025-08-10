import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/connexion" state={{ from: location }} replace />;
} 