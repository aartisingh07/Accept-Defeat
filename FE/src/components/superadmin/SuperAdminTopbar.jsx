import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import {
  Menu,
  Bell,
  Clock,
  Check,
  ChevronDown,
  User,
  LogOut,
  Sliders,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SuperAdminTopbar({
  title = 'Overview',
  breadcrumbs = [],
  notifications = [],
  unreadCount = 0,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onToggleMobile,
}) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-[#DDDCCF] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-xl text-[#3E5C76] hover:bg-[#F7F5EF] transition-colors"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#748CAB] mb-0.5">
            <span>Super Admin</span>
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span>/</span>
                <span className={idx === breadcrumbs.length - 1 ? 'text-[#0D1321] font-semibold' : ''}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
          <h1 className="text-lg font-bold text-[#0D1321] leading-tight">{title}</h1>
        </div>
      </div>

      {/* Right: Notifications & User Dropdown */}
      <div className="flex items-center gap-3">
        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-[#3E5C76] hover:bg-[#F7F5EF] hover:text-[#0D1321] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#9B2226] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#DDDCCF] shadow-xl z-50 overflow-hidden">
              <div className="p-3.5 border-b border-[#DDDCCF] bg-[#F7F5EF] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#0D1321]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#1D2D44] text-[#F0EBD8]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="text-xs font-medium text-[#3E5C76] hover:text-[#0D1321] flex items-center gap-1"
                  >
                    <Check size={14} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#DDDCCF]/60">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-[#748CAB] text-sm">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => !notif.isRead && onMarkNotificationRead?.(notif._id)}
                      className={`p-3.5 text-left transition-colors cursor-pointer flex gap-3 ${
                        notif.isRead ? 'bg-white hover:bg-[#F7F5EF]/50' : 'bg-[#F0EBD8]/40 hover:bg-[#F0EBD8]/70'
                      }`}
                    >
                      <div className="mt-0.5 text-[#1D2D44]">
                        <Clock size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#0D1321]">{notif.title}</div>
                        <div className="text-xs text-[#3E5C76] mt-0.5 line-clamp-2">{notif.message}</div>
                        <div className="text-[10px] text-[#748CAB] mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-[#3E5C76] mt-1 shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F7F5EF] transition-colors border border-transparent hover:border-[#DDDCCF]"
          >
            <img
              src={user?.avatar || '/default-avatar.png'}
              alt={user?.name || user?.username || 'Super Admin'}
              className="w-8 h-8 rounded-full object-cover border border-[#DDDCCF]"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <span className="hidden md:inline-block text-xs font-bold text-[#0D1321] max-w-[120px] truncate">
              {user?.name || user?.username || 'Super Admin'}
            </span>
            <ChevronDown size={14} className="text-[#748CAB]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#DDDCCF] shadow-xl z-50 p-2">
              <div className="px-3 py-2 border-b border-[#DDDCCF] mb-1">
                <div className="text-xs font-bold text-[#0D1321] truncate">
                  {user?.name || user?.username}
                </div>
                <div className="text-[11px] text-[#748CAB] truncate">{user?.email}</div>
                <div className="mt-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#1D2D44] text-[#F0EBD8]">
                    SUPER ADMIN
                  </span>
                </div>
              </div>

              <Link
                to="/superadmin/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#3E5C76] hover:bg-[#F7F5EF] hover:text-[#0D1321] rounded-xl transition-colors"
              >
                <Sliders size={15} />
                Platform Settings
              </Link>

              <Link
                to="/profile"
                target="_blank"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#3E5C76] hover:bg-[#F7F5EF] hover:text-[#0D1321] rounded-xl transition-colors"
              >
                <User size={15} />
                Profile Settings
              </Link>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#9B2226] hover:bg-[#F8D7DA]/30 rounded-xl transition-colors mt-1"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
