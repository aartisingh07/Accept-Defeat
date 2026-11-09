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

  // Password Strength Calculation (using Deep Sea & supporting semantic colors)
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-[#DDDCCF]' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-[#B65C50]', text: 'text-[#B65C50]' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-[#A67C42]', text: 'text-[#A67C42]' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-[#748CAB]', text: 'text-[#748CAB]' };
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-[#55765B]', text: 'text-[#55765B]' };
      default:
        return { score: 10, label: 'Too short', color: 'bg-[#B65C50]', text: 'text-[#B65C50]' };
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
        <h2 className="text-xl sm:text-2xl font-bold text-[#0D1321] tracking-tight flex items-center justify-center gap-2">
          <span>Create Account</span>
          <span className="inline-block animate-pulse">🚀</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#3E5C76] mt-1">
          Join Accept&amp;Defeat and start your journey
        </p>
      </div>

      {/* Social Auth Buttons */}
      <SocialAuthButtons disabled={isLoading} />

      {/* OR Divider */}
      <div className="relative my-3 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#DDDCCF]" />
        </div>
        <span className="relative px-3 bg-[#FFFFFF] text-[11px] font-semibold text-[#687386] uppercase tracking-wider">
          OR
        </span>
      </div>

      {/* Server Feedback Notices */}
      {serverError && (
        <div className="mb-3.5 p-3 rounded-xl bg-[#F7EAE6] border border-[#B65C50]/30 text-xs text-[#B65C50] flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#B65C50] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-[#B65C50]">Registration Notice</span>
            <span>{serverError}</span>
          </div>
        </div>
      )}

      {serverSuccess && (
        <div className="mb-3.5 p-3 rounded-xl bg-[#EAF0E7] border border-[#55765B]/30 text-xs text-[#55765B] flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#55765B] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-[#55765B]">Profile Activated</span>
            <span>{serverSuccess}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        {/* Username */}
        <div className="w-full text-left space-y-1">
          <label htmlFor="signup-username" className="block text-xs font-medium text-[#0D1321]">
            Username <span className="text-[#B65C50]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3E5C76]">
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
              className={`glass-input w-full h-10 pl-10 pr-9 rounded-xl text-sm text-[#0D1321] placeholder-[#687386] transition-all ${
                errors.username
                  ? 'border-[#B65C50] focus:border-[#B65C50] focus:ring-2 focus:ring-[#B65C50]/20'
                  : ''
              }`}
            />
            {username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username) && !errors.username && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#55765B] pointer-events-none">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>
          {errors.username && (
            <p className="flex items-center gap-1.5 text-xs text-[#B65C50] mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.username}</span>
            </p>
          )}
        </div>

        {/* Email */}
        <div className="w-full text-left space-y-1">
          <label htmlFor="signup-email" className="block text-xs font-medium text-[#0D1321]">
            Email <span className="text-[#B65C50]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3E5C76]">
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
              className={`glass-input w-full h-10 pl-10 pr-4 rounded-xl text-sm text-[#0D1321] placeholder-[#687386] transition-all ${
                errors.email
                  ? 'border-[#B65C50] focus:border-[#B65C50] focus:ring-2 focus:ring-[#B65C50]/20'
                  : ''
              }`}
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1.5 text-xs text-[#B65C50] mt-1">
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
                <span className="text-[#687386]">Strength:</span>
                <span className={`font-semibold ${passwordStrength.text}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#F7F5EF] rounded-full overflow-hidden border border-[#DDDCCF]/60">
                <div
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  style={{ width: `${passwordStrength.score}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#687386] pt-0.5">
                <span className={password.length >= 6 ? 'text-[#55765B]' : 'text-[#687386]'}>
                  • 6+ chars
                </span>
                <span className={/[0-9]/.test(password) ? 'text-[#55765B]' : 'text-[#687386]'}>
                  • 1 number
                </span>
                <span className={/[^A-Za-z0-9]/.test(password) ? 'text-[#55765B]' : 'text-[#687386]'}>
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
            className="btn-primary-deep-space w-full h-11 rounded-xl text-sm font-semibold text-[#F0EBD8] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none shadow-sm hover:shadow"
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
      <div className="mt-4 text-center text-xs text-[#3E5C76]">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={onSwitchTab}
          className="text-[#1D2D44] font-bold hover:text-[#0D1321] transition-colors ml-1 cursor-pointer focus:outline-none focus:underline"
        >
          Login
        </button>
      </div>
    </div>
  );
}
