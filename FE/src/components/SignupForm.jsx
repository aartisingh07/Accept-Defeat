import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import PasswordInput from './PasswordInput';
import SocialAuthButtons from './SocialAuthButtons';
import { useAuth } from '../context/useAuth';

export default function SignupForm({ onSwitchTab }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Password Strength Calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-blue-500', text: 'text-blue-400' };
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
      default:
        return { score: 10, label: 'Too short', color: 'bg-rose-500', text: 'text-rose-400' };
    }
  };

  const passwordStrength = getPasswordStrength(password);

  const validate = () => {
    const errs = {};
    if (!username.trim()) {
      errs.username = 'Username is required';
    } else if (username.trim().length < 3) {
      errs.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      errs.username = 'Only letters, numbers, and underscores allowed';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
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
      const data = await signup({ username, email, password });
      setServerSuccess(`Account @${data.user?.username || username} activated! Entering battle arena...`);

      if (data.token) {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
          <span>Create Account</span>
          <span className="inline-block animate-pulse">🚀</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Join Accept&amp;Defeat and start your journey
        </p>
      </div>

      {/* Social Auth Buttons */}
      <SocialAuthButtons disabled={isLoading} />

      {/* OR Divider */}
      <div className="relative my-3 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700/60" />
        </div>
        <span className="relative px-3 bg-[#101827] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          OR
        </span>
      </div>

      {/* Server Feedback Notices */}
      {serverError && (
        <div className="mb-3.5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-red-300">Registration Notice</span>
            <span>{serverError}</span>
          </div>
        </div>
      )}

      {serverSuccess && (
        <div className="mb-3.5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-emerald-300">Profile Activated</span>
            <span>{serverSuccess}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        {/* Username */}
        <div className="w-full text-left space-y-1">
          <label htmlFor="signup-username" className="block text-xs font-medium text-slate-300">
            Username <span className="text-purple-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="signup-username"
              type="text"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors({ ...errors, username: '' });
              }}
              placeholder="Choose a username"
              disabled={isLoading}
              autoComplete="username"
              className={`glass-input w-full h-10 pl-10 pr-9 rounded-xl text-sm text-[#F8FAFC] placeholder-slate-500 transition-all ${
                errors.username
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : ''
              }`}
            />
            {username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username) && !errors.username && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-400 pointer-events-none">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>
          {errors.username && (
            <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.username}</span>
            </p>
          )}
        </div>

        {/* Email */}
        <div className="w-full text-left space-y-1">
          <label htmlFor="signup-email" className="block text-xs font-medium text-slate-300">
            Email <span className="text-purple-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="signup-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="Enter your email"
              disabled={isLoading}
              autoComplete="email"
              className={`glass-input w-full h-10 pl-10 pr-4 rounded-xl text-sm text-[#F8FAFC] placeholder-slate-500 transition-all ${
                errors.email
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : ''
              }`}
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <PasswordInput
            id="signup-password"
            name="password"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
            placeholder="Create a strong password"
            error={errors.password}
            disabled={isLoading}
            autoComplete="new-password"
            required
          />

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2 space-y-1 text-left">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Strength:</span>
                <span className={`font-semibold ${passwordStrength.text}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  style={{ width: `${passwordStrength.score}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                <span className={password.length >= 6 ? 'text-emerald-400' : 'text-slate-500'}>
                  • 6+ chars
                </span>
                <span className={/[0-9]/.test(password) ? 'text-emerald-400' : 'text-slate-500'}>
                  • 1 number
                </span>
                <span className={/[^A-Za-z0-9]/.test(password) ? 'text-emerald-400' : 'text-slate-500'}>
                  • 1 symbol
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Primary Sign Up Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary-purple w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating battle profile...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Footer Switcher */}
      <div className="mt-4 text-center text-xs text-slate-400">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={onSwitchTab}
          className="text-purple-400 font-semibold hover:text-purple-300 transition-colors ml-1 cursor-pointer focus:outline-none focus:underline"
        >
          Login
        </button>
      </div>
    </div>
  );
}
