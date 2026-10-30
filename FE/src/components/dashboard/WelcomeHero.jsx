import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export default function WelcomeHero() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showRobotTip, setShowRobotTip] = useState(true);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const username = user?.username || 'Developer';
  const firstName = user?.name ? user.name.split(' ')[0] : username.charAt(0).toUpperCase() + username.slice(1);

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-r from-[#0E172C] via-[#10182E] to-[#141A35] border border-purple-500/20 p-6 sm:p-7 overflow-hidden shadow-2xl">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Welcome Copy */}
        <div className="space-y-3 max-w-xl">
          <div className="text-xs font-semibold text-purple-400 tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{getGreeting()},</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>{firstName}</span>
            <span className="inline-block animate-bounce origin-bottom">👋</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            &ldquo;Every challenge you solve makes you a better developer.&rdquo;
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/challenges')}
              className="btn-primary-purple px-4 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 cursor-pointer select-none"
            >
              <span>Explore Challenges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigate('/challenges/create')}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#131D33]/80 hover:bg-[#1A2642] border border-slate-700/60 hover:border-purple-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Challenge</span>
            </button>
          </div>
        </div>

        {/* Center-Right Robot Mascot & Smart Speech Bubble */}
        {showRobotTip && (
          <div className="relative flex items-center gap-4 bg-[#0A1020]/90 border border-purple-500/25 p-3.5 sm:p-4 rounded-2xl shadow-xl max-w-md w-full lg:w-auto">
            {/* Robot 3D Vector Mascot */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 relative flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]">
                {/* Robot Head */}
                <rect x="22" y="24" width="56" height="45" rx="14" fill="#1E293B" stroke="#8B5CF6" strokeWidth="2.5" />
                {/* Robot Ears / Antennas */}
                <rect x="14" y="38" width="8" height="16" rx="4" fill="#A855F7" />
                <rect x="78" y="38" width="8" height="16" rx="4" fill="#A855F7" />
                <line x1="50" y1="24" x2="50" y2="12" stroke="#A855F7" strokeWidth="2.5" />
                <circle cx="50" cy="10" r="4.5" fill="#C084FC" className="animate-pulse" />
                {/* Visor Screen */}
                <rect x="29" y="33" width="42" height="26" rx="8" fill="#090D1A" stroke="#38BDF8" strokeWidth="1.2" />
                {/* Glowing Eyes */}
                <ellipse cx="40" cy="45" rx="4" ry="5.5" fill="#38BDF8" className="animate-pulse" />
                <ellipse cx="60" cy="45" rx="4" ry="5.5" fill="#38BDF8" className="animate-pulse" />
                <circle cx="41.5" cy="43.5" r="1.5" fill="#FFFFFF" />
                <circle cx="61.5" cy="43.5" r="1.5" fill="#FFFFFF" />
                {/* Friendly Smile */}
                <path d="M44 52 Q50 56 56 52" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            {/* Bubble Text */}
            <div className="space-y-1.5 flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span>Hey {firstName}!</span>
                  <span className="text-purple-400">👋</span>
                </span>
                <button
                  onClick={() => setShowRobotTip(false)}
                  className="text-slate-500 hover:text-slate-300 p-1"
                  aria-label="Dismiss tip"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-slate-300 leading-tight">
                You have <span className="text-purple-300 font-semibold">5 new challenges</span> in React and Node.js that match your skills. Want to take a look?
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => navigate('/challenges')}
                  className="btn-primary-purple px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white cursor-pointer"
                >
                  Show Challenges &rarr;
                </button>
                <button
                  onClick={() => setShowRobotTip(false)}
                  className="px-2 py-1 rounded-lg text-[10px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Not Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
