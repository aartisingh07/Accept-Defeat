import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import AuthLoadingScreen from './AuthLoadingScreen';
import { getTabToken } from '../../utils/tabSession';

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  const hasAuth = isAuthenticated || Boolean(getTabToken());

  if (hasAuth) {
    const intendedPath =
      location.state?.from?.pathname &&
      location.state.from.pathname !== '/login' &&
      location.state.from.pathname !== '/'
        ? location.state.from.pathname
        : '/dashboard';
    return <Navigate to={intendedPath} replace />;
  }

  return children;
}
