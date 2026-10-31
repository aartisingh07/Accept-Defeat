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
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
          <span>Welcome Back</span>
          <span className="inline-block animate-bounce origin-bottom">👋</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Login to continue your coding journey
        </p>
      </div>

      {/* Social Auth Buttons */}
      <SocialAuthButtons disabled={isLoading} />

      {/* OR Divider */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700/60" />
        </div>
        <span className="relative px-3 bg-[#101827] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          OR
        </span>
      </div>

      {/* Session Expiration / Inactivity Notice */}
      {sessionNotice && (
        <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-start justify-between gap-2 animate-fadeIn">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{sessionNotice}</span>
          </div>
          <button
            type="button"
            onClick={clearSessionNotice}
            className="text-amber-400 hover:text-white text-xs px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Server Feedback Notices */}
      {serverError && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-red-300">
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
        <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-emerald-300">Success</span>
            <span>{serverSuccess}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Email or Username */}
        <div className="w-full text-left space-y-1.5">
          <label htmlFor="login-identifier" className="block text-xs font-medium text-slate-300">
            Email or Username <span className="text-purple-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
              className={`glass-input w-full h-11 pl-10 pr-4 rounded-xl text-sm text-[#F8FAFC] placeholder-slate-500 transition-all ${
                errors.identifier
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : ''
              }`}
            />
          </div>
          {errors.identifier && (
            <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
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
              className="text-xs text-slate-400 hover:text-purple-300 transition-colors cursor-pointer"
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
            className="btn-primary-purple w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
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
      <div className="mt-5 text-center text-xs text-slate-400">
        <span>Don't have an account? </span>
        <button
          type="button"
          onClick={onSwitchTab}
          className="text-purple-400 font-semibold hover:text-purple-300 transition-colors ml-1 cursor-pointer focus:outline-none focus:underline"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
