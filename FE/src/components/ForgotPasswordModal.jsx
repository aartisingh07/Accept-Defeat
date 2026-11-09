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
      if (err.message.includes('not reachable') || err.message.includes('Cannot connect')) {
        setServerNotice(err.message);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md p-6 sm:p-7 rounded-2xl bg-[#FFFFFF] border border-[#DDDCCF] shadow-2xl text-left"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#687386] hover:text-[#0D1321] hover:bg-[#F7F5EF] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {isSuccess ? (
              <div className="py-2 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EAF0E7] border border-[#55765B]/30 text-[#55765B] flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-[#55765B]" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-[#0D1321]">Reset Link Dispatched</h3>
                  <p className="text-xs text-[#3E5C76] max-w-sm mx-auto">
                    If an account exists for <span className="text-[#1D2D44] font-semibold">{email}</span>, you will receive password reset instructions shortly.
                  </p>
                </div>

                {serverNotice && (
                  <div className="p-3 text-left rounded-xl bg-[#F5EEDF] border border-[#A67C42]/30 text-[11px] text-[#A67C42]">
                    <span className="font-semibold block text-[#A67C42] mb-0.5">ℹ️ Backend Notice:</span>
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
                    className="btn-primary-deep-space w-full h-10 rounded-xl text-xs font-semibold text-[#F0EBD8] cursor-pointer"
                  >
                    Return to Login
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-[#1D2D44]">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0D1321]">Reset Password</h3>
                    <p className="text-xs text-[#3E5C76]">Recover your battle arena account</p>
                  </div>
                </div>

                <p className="text-xs text-[#3E5C76] leading-relaxed mb-4">
                  Enter your registered email address below. We will send a secure link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="reset-email" className="block text-xs font-medium text-[#0D1321]">
                      Account Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3E5C76]">
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
                        className="glass-input w-full h-11 pl-10 pr-4 rounded-xl text-sm text-[#0D1321] placeholder-[#687386] transition-all"
                        autoFocus
                      />
                    </div>
                    {error && (
                      <p className="flex items-center gap-1.5 text-xs text-[#B65C50] mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{error}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-1/2 h-11 rounded-xl text-xs font-semibold text-[#0D1321] hover:bg-[#FFFFFF] bg-[#F7F5EF] border border-[#DDDCCF] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary-deep-space w-1/2 h-11 rounded-xl text-xs font-semibold text-[#F0EBD8] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
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
