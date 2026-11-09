import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import superAdminService from '../../services/superAdminService';
import { setTabToken, setTabUser } from '../../utils/tabSession';
import { Shield, Lock, User, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function SuperAdminLoginPage() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please provide your Super Admin identifier and password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = await superAdminService.login({ identifier, password });

      if (data.token) {
        setTabToken(data.token);
      }
      if (data.user) {
        setTabUser(data.user);
        updateUser(data.user);
      }

      navigate('/superadmin', { replace: true });
    } catch (err) {
      setError(err.message || 'Super Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EBD8] flex flex-col justify-center items-center p-4 selection:bg-[#748CAB]/30">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#DDDCCF] shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0D1321] via-[#1D2D44] to-[#3E5C76]" />

        {/* Brand & Badge */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1D2D44] text-[#F0EBD8] flex items-center justify-center shadow-md">
            <Shield size={32} />
          </div>

          <h1 className="text-2xl font-black text-[#0D1321] tracking-tight">
            Accept<span className="text-[#3E5C76]">&</span>Defeat
          </h1>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-[#1D2D44]/10 border border-[#1D2D44]/20 text-[#1D2D44] text-xs font-bold uppercase tracking-wider">
            Super Admin Console
          </div>

          <p className="text-xs text-[#3E5C76] mt-3">
            Secure authentication portal restricted to platform governance authorities.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-[#9B2226]/10 border border-[#9B2226]/20 text-[#9B2226] text-xs font-medium flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#0D1321] uppercase tracking-wider mb-2">
              Super Admin Identifier
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#748CAB]">
                <User size={18} />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="superadmin@acceptdefeat.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] text-sm font-medium placeholder-[#748CAB] focus:outline-none focus:border-[#1D2D44] focus:ring-2 focus:ring-[#1D2D44]/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0D1321] uppercase tracking-wider mb-2">
              Security Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#748CAB]">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] text-sm font-medium placeholder-[#748CAB] focus:outline-none focus:border-[#1D2D44] focus:ring-2 focus:ring-[#1D2D44]/10 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#1D2D44] hover:bg-[#0D1321] text-[#F0EBD8] font-bold text-sm tracking-wide shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Verifying Credentials...
              </>
            ) : (
              'Enter Super Admin Console'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-[#DDDCCF] text-center space-y-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#3E5C76] hover:text-[#0D1321] transition-colors"
          >
            <ArrowLeft size={14} />
            Return to Developer Login
          </Link>

          <div>
            <Link
              to="/admin/apply"
              className="text-[11px] font-medium text-[#748CAB] hover:text-[#3E5C76] underline underline-offset-2"
            >
              Want to join platform administration? Submit an Application
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
