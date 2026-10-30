import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { authService } from '../services/authService';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverNotice, setServerNotice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your account email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsLoading(true);
    setServerNotice('');

    try {
      await authService.requestPasswordReset(email);
      setIsSuccess(true);
    } catch (err) {
      // In development when backend is not running, provide helpful message
      if (err.message.includes('not reachable') || err.message.includes('Cannot connect')) {
        setServerNotice(err.message);
        // Show simulated UI feedback for visual confirmation
        setIsSuccess(true);
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setError('');
    setIsSuccess(false);
    setServerNotice('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md p-6 sm:p-7 rounded-2xl bg-[#101827] border border-purple-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(139,92,246,0.2)] text-left"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {isSuccess ? (
              <div className="py-2 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  <CheckCircle2 className="w-6 h-6 text-purple-300" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-semibold text-white">Reset Link Dispatched</h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    If an account exists for <span className="text-purple-300 font-medium">{email}</span>, you will receive password reset instructions shortly.
                  </p>
                </div>

                {serverNotice && (
                  <div className="p-3 text-left rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-200">
                    <span className="font-semibold block text-purple-300 mb-0.5">ℹ️ Backend Notice:</span>
                    {serverNotice}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleReset();
                      onClose();
                    }}
                    className="btn-primary-purple w-full h-10 rounded-xl text-xs font-semibold text-white cursor-pointer"
                  >
                    Return to Login
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Reset Password</h3>
                    <p className="text-xs text-slate-400">Recover your battle arena account</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Enter your registered email address below. We will send a secure token to reset your password and restore your contest standings.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="reset-email" className="block text-xs font-medium text-slate-300">
                      Account Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="reset-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="developer@domain.com"
                        disabled={isLoading}
                        className="glass-input w-full h-11 pl-10 pr-4 rounded-xl text-sm text-[#F8FAFC] placeholder-slate-500 transition-all"
                        autoFocus
                      />
                    </div>
                    {error && (
                      <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{error}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-1/2 h-11 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary-purple w-1/2 h-11 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Link</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
