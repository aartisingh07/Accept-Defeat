import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import BrandLogo from '../components/BrandLogo';
import { AlertCircle } from 'lucide-react';
import { setTabToken, setTabId } from '../utils/tabSession';

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
    const returnedTabId = searchParams.get('tabId');

    if (!error && token) {
      if (returnedTabId) {
        setTabId(returnedTabId);
      }
      setTabToken(token);
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
      <div className="min-h-screen bg-[#F0EBD8] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-2xl bg-[#FFFFFF] border border-[#B65C50]/30 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-[#F7EAE6] border border-[#B65C50]/30 text-[#B65C50] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[#0D1321]">OAuth Authentication Failed</h2>
          <p className="text-xs text-[#B65C50]">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#1D2D44] hover:bg-[#0D1321] text-[#F0EBD8] px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EBD8] flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-3">
        <BrandLogo size="lg" />
        <div className="flex items-center gap-2 text-xs font-mono text-[#1D2D44]">
          <div className="w-4 h-4 border-2 border-[#DDDCCF] border-t-[#1D2D44] rounded-full animate-spin" />
          <span>Finalizing OAuth session token...</span>
        </div>
      </div>
    </div>
  );
}
