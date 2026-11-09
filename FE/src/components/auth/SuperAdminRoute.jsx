import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import AuthLoadingScreen from './AuthLoadingScreen';
import { getTabToken, getTabUser } from '../../utils/tabSession';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

export default function SuperAdminRoute({ children }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  const tabToken = getTabToken();
  const tabUser = user || getTabUser();
  const hasAuth = isAuthenticated || Boolean(tabToken);

  if (!hasAuth) {
    return <Navigate to="/superadmin/login" state={{ from: location }} replace />;
  }

  // Verify Super Admin role
  if (tabUser?.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-[#F0EBD8] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#DDDCCF] shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#9B2226]/10 border border-[#9B2226]/20 flex items-center justify-center text-[#9B2226]">
            <ShieldAlert size={36} />
          </div>

          <h2 className="text-2xl font-bold text-[#0D1321] mb-2">Access Restricted</h2>
          <p className="text-sm text-[#3E5C76] mb-6 leading-relaxed">
            This management console is strictly restricted to Super Administrators. Your current account (
            <span className="font-semibold text-[#0D1321]">@{tabUser?.username || 'user'}</span>, role:{' '}
            <span className="font-semibold text-[#1D2D44]">{tabUser?.role || 'user'}</span>) does not have
            authorization to access this area.
          </p>

          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1D2D44] text-[#F0EBD8] font-semibold hover:bg-[#0D1321] transition-colors shadow-sm"
            >
              <ArrowLeft size={18} />
              Return to Developer Dashboard
            </Link>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#DDDCCF] text-[#3E5C76] font-medium hover:bg-[#F7F5EF] hover:text-[#0D1321] transition-colors"
            >
              <LogOut size={16} />
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
