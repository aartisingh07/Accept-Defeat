import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import AuthLoadingScreen from './AuthLoadingScreen';
import { getTabToken } from '../../utils/tabSession';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  // Check both React state and tab sessionStorage to prevent transition race conditions
  const hasAuth = isAuthenticated || Boolean(getTabToken());

  if (!hasAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
