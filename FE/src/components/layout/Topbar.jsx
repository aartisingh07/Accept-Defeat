import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, Menu, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const username = user?.username || 'Developer';
  const displayName = user?.name || username.charAt(0).toUpperCase() + username.slice(1);
  const handleTag = `@${username.toLowerCase().replace(/\s+/g, '_')}`;
  const avatarUrl =
    user?.avatar && !user.avatar.includes('unsplash')
      ? user.avatar
      : '/default-avatar.png';

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 bg-[#080D1B]/80 backdrop-blur-md border-b border-purple-500/15 flex items-center justify-between sticky top-0 z-30">
      {/* Left Search Bar & Mobile Hamburger */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search challenges, users, skills..."
            className="w-full h-10 pl-10 pr-12 rounded-xl bg-[#0D1528] border border-slate-700/60 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Action Icons & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4 ml-4">
        {/* Create Challenge Button */}
        <button
          onClick={() => navigate('/challenges/create')}
          className="btn-primary-purple hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer select-none"
        >
          <Plus className="w-4 h-4" />
          <span>Create Challenge</span>
        </button>

        {/* Notifications Icon with Unread Badge */}
        <button
          className="relative p-2 rounded-xl bg-[#0D1528] border border-slate-700/60 text-slate-300 hover:text-white hover:border-purple-500/40 transition-colors cursor-pointer"
          aria-label="View notifications"
          onClick={() => alert('Notifications: 1 new battle invitation from @karan_dev')}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#080D1B]">
            1
          </span>
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-slate-800/50 transition-colors cursor-pointer border border-transparent hover:border-purple-500/20"
            aria-expanded={dropdownOpen}
          >
            <div className="relative">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#080D1B]" />
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                {handleTag}
              </span>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 py-1.5 rounded-2xl bg-[#0D1528] border border-purple-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(139,92,246,0.15)] z-50 text-xs">
              <div className="px-3.5 py-2 border-b border-slate-800">
                <div className="font-semibold text-white">{displayName}</div>
                <div className="text-[11px] text-purple-400 font-mono">{user?.email || handleTag}</div>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/profile');
                }}
                className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/settings');
                }}
                className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2.5 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-purple-400" />
                <span>Settings</span>
              </button>

              <div className="my-1 border-t border-slate-800" />

              <button
                onClick={handleLogout}
                className="w-full px-3.5 py-2 text-left text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 flex items-center gap-2.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
