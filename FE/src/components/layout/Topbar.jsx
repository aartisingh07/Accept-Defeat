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
    <header className="h-16 px-4 sm:px-6 lg:px-8 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#DDDCCF] flex items-center justify-between sticky top-0 z-30">
      {/* Left Search Bar & Mobile Hamburger */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-[#3E5C76] hover:text-[#0D1321] hover:bg-[#F7F5EF] lg:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3E5C76] pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search challenges, users, skills..."
            className="w-full h-10 pl-10 pr-12 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-xs sm:text-sm text-[#0D1321] placeholder-[#3E5C76]/60 focus:outline-none focus:border-[#1D2D44] focus:ring-1 focus:ring-[#1D2D44]/30 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#FFFFFF] text-[10px] font-mono text-[#3E5C76] border border-[#DDDCCF]">
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
          className="bg-[#1D2D44] hover:bg-[#0D1321] text-[#F0EBD8] hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer select-none shadow-sm hover:shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Challenge</span>
        </button>

        {/* Notifications Icon with Unread Badge */}
        <button
          className="relative p-2 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-[#0D1321] hover:bg-[#FFFFFF] hover:border-[#748CAB] transition-colors cursor-pointer"
          aria-label="View notifications"
          onClick={() => alert('Notifications: 1 new battle invitation from @karan_dev')}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B65C50] text-[#FFFFFF] text-[9px] font-bold flex items-center justify-center border-2 border-[#FFFFFF]">
            1
          </span>
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-[#F7F5EF] transition-colors cursor-pointer border border-transparent hover:border-[#DDDCCF]"
            aria-expanded={dropdownOpen}
          >
            <div className="relative">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover border border-[#DDDCCF]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#55765B] border-2 border-[#FFFFFF]" />
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-[#0D1321] leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-[#3E5C76] leading-tight font-mono">
                {handleTag}
              </span>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 py-1.5 rounded-2xl bg-[#FFFFFF] border border-[#DDDCCF] shadow-xl z-50 text-xs">
              <div className="px-3.5 py-2 border-b border-[#DDDCCF]">
                <div className="font-bold text-[#0D1321]">{displayName}</div>
                <div className="text-[11px] text-[#1D2D44] font-mono">{user?.email || handleTag}</div>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/profile');
                }}
                className="w-full px-3.5 py-2 text-left text-[#0D1321] hover:bg-[#F7F5EF] flex items-center gap-2.5 cursor-pointer font-medium"
              >
                <User className="w-3.5 h-3.5 text-[#1D2D44]" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/settings');
                }}
                className="w-full px-3.5 py-2 text-left text-[#0D1321] hover:bg-[#F7F5EF] flex items-center gap-2.5 cursor-pointer font-medium"
              >
                <Settings className="w-3.5 h-3.5 text-[#1D2D44]" />
                <span>Settings</span>
              </button>

              <div className="my-1 border-t border-[#DDDCCF]" />

              <button
                onClick={handleLogout}
                className="w-full px-3.5 py-2 text-left text-[#B65C50] hover:bg-[#F7EAE6] flex items-center gap-2.5 cursor-pointer font-semibold"
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
