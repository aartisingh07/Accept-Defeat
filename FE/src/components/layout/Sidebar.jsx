import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Swords,
  PlusCircle,
  FileCode2,
  MessageSquare,
  Users,
  Trophy,
  User,
  Settings,
  X,
} from 'lucide-react';
import BrandLogo from '../BrandLogo';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Explore Challenges', path: '/challenges', icon: Compass },
  { label: 'Live Battles', path: '/battles', icon: Swords },
  { label: 'Create Challenge', path: '/challenges/create', icon: PlusCircle },
  { label: 'My Challenges', path: '/my-challenges', icon: FileCode2 },
  { label: 'Messages', path: '/messages', icon: MessageSquare, badge: 3 },
  { label: 'Developers Online', path: '/developers', icon: Users },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'My Profile', path: '/profile', icon: User },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#080D1B] border-r border-purple-500/15 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Top Logo and Mobile Close */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/60 shrink-0">
            <BrandLogo size="md" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024 && onClose) onClose();
                  }}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 select-none ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600/30 to-purple-600/10 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)] font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-purple-300 transition-colors" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Promotional Artwork Card in Sidebar */}
        <div className="p-3 shrink-0">
          <div className="relative p-3.5 rounded-2xl bg-gradient-to-b from-[#121B33]/80 to-[#0A1020] border border-purple-500/25 overflow-hidden shadow-lg group">
            {/* Ambient glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/20 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <div className="text-[11px] font-bold text-white leading-tight">
                Challenge <br />
                <span className="text-purple-400">Real Minds.</span> <br />
                Prove Yours.
              </div>

              {/* Mini vector coder illustration */}
              <div className="w-full h-16 rounded-lg bg-[#070B14]/80 flex items-center justify-center overflow-hidden border border-purple-500/15">
                <svg viewBox="0 0 160 65" className="w-full h-full" fill="none">
                  {/* Glow */}
                  <circle cx="80" cy="30" r="25" fill="#8B5CF6" fillOpacity="0.2" />
                  {/* Monitors */}
                  <rect x="25" y="15" width="40" height="30" rx="3" fill="#101827" stroke="#8B5CF6" strokeWidth="1" />
                  <rect x="70" y="12" width="45" height="35" rx="3" fill="#0B0F19" stroke="#A78BFA" strokeWidth="1.2" />
                  {/* Code lines */}
                  <line x1="30" y1="22" x2="55" y2="22" stroke="#38BDF8" strokeWidth="1.5" />
                  <line x1="30" y1="28" x2="48" y2="28" stroke="#34D399" strokeWidth="1.5" />
                  <line x1="76" y1="18" x2="105" y2="18" stroke="#C084FC" strokeWidth="1.5" />
                  <line x1="76" y1="24" x2="95" y2="24" stroke="#60A5FA" strokeWidth="1.5" />
                  <line x1="76" y1="30" x2="102" y2="30" stroke="#F472B6" strokeWidth="1.5" />
                  {/* Coder head & headphones */}
                  <circle cx="80" cy="46" r="8" fill="#1E293B" />
                  <path d="M72 45 C72 38, 88 38, 88 45" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" />
                  <rect x="70" y="44" width="3" height="6" rx="1.5" fill="#C084FC" />
                  <rect x="87" y="44" width="3" height="6" rx="1.5" fill="#C084FC" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

