import { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function PasswordInput({
  id = 'password',
  name = 'password',
  label = 'Password',
  value,
  onChange,
  placeholder = 'Enter your password',
  error = '',
  rightLabel = null,
  disabled = false,
  autoComplete = 'current-password',
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full text-left space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-medium text-[#0D1321]">
          {label} {required && <span className="text-[#B65C50]">*</span>}
        </label>
        {rightLabel}
      </div>

      <div className="relative">
        {/* Left Lock Icon */}
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3E5C76]">
          <Lock className="w-4 h-4" />
        </div>

        {/* Input */}
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          required={required}
          className={`glass-input w-full h-11 pl-10 pr-11 rounded-xl text-sm text-[#0D1321] placeholder-[#687386] transition-all ${
            error
              ? 'border-[#B65C50] focus:border-[#B65C50] focus:ring-2 focus:ring-[#B65C50]/20'
              : ''
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        />

        {/* Visibility Toggle */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#3E5C76] hover:text-[#0D1321] transition-colors cursor-pointer focus:outline-none"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 transition-transform active:scale-90" />
          ) : (
            <Eye className="w-4 h-4 transition-transform active:scale-90" />
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-[#B65C50] mt-1 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
