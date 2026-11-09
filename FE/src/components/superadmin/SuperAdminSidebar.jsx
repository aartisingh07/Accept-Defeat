import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  LayoutDashboard,
  FileCheck,
  ShieldCheck,
  KeyRound,
  Users,
  ScrollText,
  Sliders,
  LogOut,
  Shield,
  ExternalLink,
} from 'lucide-react';

export default function SuperAdminSidebar({ pendingApplicationsCount = 0, onCloseMobile }) {
  const { user, logout } = useAuth();

  const mainNavItems = [
    { to: '/superadmin', label: 'Overview', icon: LayoutDashboard, end: true },
    {
      to: '/superadmin/applications',
      label: 'Admin Applications',
      icon: FileCheck,
      badge: pendingApplicationsCount > 0 ? pendingApplicationsCount : null,
    },
    { to: '/superadmin/admins', label: 'Admin Management', icon: ShieldCheck },
    { to: '/superadmin/permissions', label: 'Permission Management', icon: KeyRound },
  ];

  const governanceNavItems = [
    { to: '/superadmin/users', label: 'User Management', icon: Users },
    { to: '/superadmin/audit-logs', label: 'Audit Logs', icon: ScrollText },
    { to: '/superadmin/settings', label: 'Platform Settings', icon: Sliders },
  ];

  return (
    <aside className="w-64 h-full bg-[#FFFFFF] border-r border-[#DDDCCF] flex flex-col select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#DDDCCF] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1D2D44] flex items-center justify-center text-[#F0EBD8] shadow-sm">
            <Shield size={22} className="text-[#F0EBD8]" />
          </div>
          <div>
            <div className="font-extrabold text-[#0D1321] text-base tracking-tight leading-none">
              Accept<span className="text-[#3E5C76]">&</span>Defeat
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#1D2D44] text-[#F0EBD8]">
                SUPER ADMIN
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#748CAB]">
            Main
          </div>
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#1D2D44] text-[#F0EBD8] shadow-sm'
                        : 'text-[#3E5C76] hover:bg-[#F7F5EF] hover:text-[#0D1321]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#9B2226] text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#748CAB]">
            Platform Governance
          </div>
          <div className="space-y-1">
            {governanceNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#1D2D44] text-[#F0EBD8] shadow-sm'
                        : 'text-[#3E5C76] hover:bg-[#F7F5EF] hover:text-[#0D1321]'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Quick Portal Switch */}
        <div className="pt-2">
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#748CAB]">
            Portals
          </div>
          <a
            href="/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-[#3E5C76] hover:bg-[#F7F5EF] hover:text-[#0D1321] transition-colors"
          >
            <span>Developer Dashboard</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-[#DDDCCF] bg-[#F7F5EF]/60">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#DDDCCF]">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user?.avatar || '/default-avatar.png'}
              alt={user?.name || user?.username || 'Super Admin'}
              className="w-8 h-8 rounded-full object-cover border border-[#DDDCCF]"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#0D1321] truncate">
                {user?.name || user?.username || 'Super Admin'}
              </div>
              <div className="text-[10px] text-[#748CAB] font-semibold uppercase">
                {user?.role || 'Super Admin'}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 rounded-lg text-[#3E5C76] hover:bg-[#F7F5EF] hover:text-[#9B2226] transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
