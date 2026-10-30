import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import AuthLoadingScreen from './AuthLoadingScreen';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
