import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import AuthLoadingScreen from './AuthLoadingScreen';

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    const intendedPath = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={intendedPath} replace />;
  }

  return children;
}
