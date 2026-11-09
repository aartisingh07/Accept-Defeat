import { useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function AuthPage() {
  const location = useLocation();
  const initialTab = location.pathname === '/signup' ? 'signup' : 'login';

  return <AuthLayout key={initialTab} initialTab={initialTab} />;
}
