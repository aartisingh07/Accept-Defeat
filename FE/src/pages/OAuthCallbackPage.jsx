import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import BrandLogo from '../components/BrandLogo';
import { AlertCircle } from 'lucide-react';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const [error] = useState(() => {
    const err = searchParams.get('error');
    if (err) return decodeURIComponent(err);
    const token = searchParams.get('token');
    if (!token) return 'OAuth authentication failed: No token received in callback.';
    return null;
  });
  const navigate = useNavigate();
  const { refreshSession } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!error && token) {
      localStorage.setItem('ad_auth_token', token);
      refreshSession()
        .then(() => {
          navigate('/dashboard', { replace: true });
        })
        .catch(() => {
          navigate('/dashboard', { replace: true });
        });
    }
  }, [error, searchParams, navigate, refreshSession]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-2xl bg-[#0D1528] border border-rose-500/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white">OAuth Authentication Failed</h2>
          <p className="text-xs text-rose-300">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary-purple px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-3">
        <BrandLogo size="lg" />
        <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
          <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
          <span>Finalizing OAuth session token...</span>
        </div>
      </div>
    </div>
  );
}
