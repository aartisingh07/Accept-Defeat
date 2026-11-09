import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import PasswordInput from './PasswordInput';
import SocialAuthButtons from './SocialAuthButtons';
import { useAuth } from '../context/useAuth';

export default function LoginForm({ onSwitchTab, onForgotPassword }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');

  const { login, sessionNotice, clearSessionNotice } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const errs = {};
    if (!identifier.trim()) {
      errs.identifier = 'Email or username is required';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setServerSuccess('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      const data = await login({ identifier, password });
      const targetUser = data.user?.username || identifier;
      setServerSuccess(`Welcome back, ${targetUser}! Entering arena...`);

      const destination =
        location.state?.from?.pathname &&
        location.state.from.pathname !== '/login' &&
        location.state.from.pathname !== '/'
          ? location.state.from.pathname
          : '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0D1321] tracking-tight flex items-center justify-center gap-2">
          <span>Welcome Back</span>
          <span className="inline-block animate-pulse text-[#748CAB]">⚡</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#3E5C76] mt-1">
          Login to continue your coding journey
        </p>
      </div>

      {/* Social Auth Buttons */}
      <SocialAuthButtons disabled={isLoading} />

      {/* OR Divider */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#DDDCCF]" />
        </div>
        <span className="relative px-3 bg-[#FFFFFF] text-[11px] font-semibold text-[#687386] uppercase tracking-wider">
          OR
        </span>
      </div>

      {/* Session Expiration / Inactivity Notice */}
      {sessionNotice && (
        <div className="mb-4 p-3 rounded-xl bg-[#F5EEDF] border border-[#A67C42]/40 text-xs text-[#A67C42] flex items-start justify-between gap-2 animate-fadeIn">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#A67C42] shrink-0 mt-0.5" />
            <span>{sessionNotice}</span>
          </div>
          <button
            type="button"
            onClick={clearSessionNotice}
            className="text-[#A67C42] hover:text-[#0D1321] text-xs px-1 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Server Feedback Notices */}
      {serverError && (
        <div className="mb-4 p-3 rounded-xl bg-[#F7EAE6] border border-[#B65C50]/30 text-xs text-[#B65C50] flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#B65C50] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-[#B65C50]">
              {serverError.includes('another tab')
                ? 'Session Conflict'
                : serverError.includes('Cannot connect')
                ? 'Connection Error'
                : 'Authentication Error'}
            </span>
            <span>{serverError}</span>
          </div>
        </div>
      )}

      {serverSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-[#EAF0E7] border border-[#55765B]/30 text-xs text-[#55765B] flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#55765B] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-[#55765B]">Success</span>
            <span>{serverSuccess}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Email or Username */}
        <div className="w-full text-left space-y-1.5">
          <label htmlFor="login-identifier" className="block text-xs font-medium text-[#0D1321]">
            Email or Username <span className="text-[#B65C50]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3E5C76]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-identifier"
              type="text"
              name="identifier"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errors.identifier) setErrors({ ...errors, identifier: '' });
              }}
              placeholder="Enter your email or username"
              disabled={isLoading}
              autoComplete="username"
              className={`glass-input w-full h-11 pl-10 pr-4 rounded-xl text-sm text-[#0D1321] placeholder-[#687386] transition-all ${
                errors.identifier
                  ? 'border-[#B65C50] focus:border-[#B65C50] focus:ring-2 focus:ring-[#B65C50]/20'
                  : ''
              }`}
            />
          </div>
          {errors.identifier && (
            <p className="flex items-center gap-1.5 text-xs text-[#B65C50] mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.identifier}</span>
            </p>
          )}
        </div>

        {/* Password */}
        <PasswordInput
          id="login-password"
          name="password"
          label="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: '' });
          }}
          placeholder="Enter your password"
          error={errors.password}
          disabled={isLoading}
          autoComplete="current-password"
          required
          rightLabel={
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-[#3E5C76] hover:text-[#0D1321] transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          }
        />

        {/* Primary Login Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary-deep-space w-full h-11 rounded-xl text-sm font-semibold text-[#F0EBD8] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none shadow-sm hover:shadow"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Footer Switcher */}
      <div className="mt-5 text-center text-xs text-[#3E5C76]">
        <span>Don't have an account? </span>
        <button
          type="button"
          onClick={onSwitchTab}
          className="text-[#1D2D44] font-bold hover:text-[#0D1321] transition-colors ml-1 cursor-pointer focus:outline-none focus:underline"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
