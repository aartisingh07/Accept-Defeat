import authService from '../services/authService';

export default function SocialAuthButtons({ onSocialClick, disabled = false }) {
  const handleProviderClick = (provider) => {
    if (disabled) return;
    if (onSocialClick) {
      onSocialClick(provider);
    } else {
      // Redirect directly to backend OAuth initiation endpoint
      const oauthUrl = authService.getOAuthUrl(provider.toLowerCase());
      window.location.href = oauthUrl;
    }
  };

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {/* GitHub Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => handleProviderClick('GitHub')}
        className="glass-button-social w-full h-11 px-4 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-[#0D1321] hover:text-[#1D2D44] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden shadow-sm"
        aria-label="Continue with GitHub"
      >
        <svg
          className="w-4 h-4 fill-current text-[#1D2D44] transition-transform group-hover:scale-110"
          viewBox="0 0 24 24"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        <span>Continue with GitHub</span>
      </button>

      {/* Google Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => handleProviderClick('Google')}
        className="glass-button-social w-full h-11 px-4 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-[#0D1321] hover:text-[#1D2D44] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden shadow-sm"
        aria-label="Continue with Google"
      >
        <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.4 7.5 23 12 23z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>
    </div>
  );
}
