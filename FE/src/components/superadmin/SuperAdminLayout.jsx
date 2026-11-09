import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminTopbar from './SuperAdminTopbar';
import superAdminService from '../../services/superAdminService';

export default function SuperAdminLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0);

  // Derive title & breadcrumb from pathname
  const getPageMeta = (pathname) => {
    if (pathname.includes('/applications')) {
      return { title: 'Admin Applications', breadcrumbs: ['Applications'] };
    }
    if (pathname.includes('/admins')) {
      return { title: 'Administrator Accounts', breadcrumbs: ['Admins'] };
    }
    if (pathname.includes('/permissions')) {
      return { title: 'Permission Management', breadcrumbs: ['Permissions'] };
    }
    if (pathname.includes('/users')) {
      return { title: 'Developer Moderation', breadcrumbs: ['Users'] };
    }
    if (pathname.includes('/audit-logs')) {
      return { title: 'Platform Audit Logs', breadcrumbs: ['Audit Logs'] };
    }
    if (pathname.includes('/settings')) {
      return { title: 'Platform Settings', breadcrumbs: ['Settings'] };
    }
    return { title: 'Super Admin Overview', breadcrumbs: ['Overview'] };
  };

  const meta = getPageMeta(location.pathname);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const notifRes = await superAdminService.getNotifications();
        if (isMounted && notifRes.success) {
          setNotifications(notifRes.notifications || []);
          setUnreadCount(notifRes.unreadCount || 0);
        }
      } catch {
        // Ignore background notification fetch errors
      }

      try {
        const overRes = await superAdminService.getOverview();
        if (isMounted && overRes.success && overRes.stats) {
          setPendingApplicationsCount(overRes.stats.pendingApplications || 0);
        }
      } catch {
        // Ignore background count errors
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleMarkNotificationRead = async (id) => {
    try {
      await superAdminService.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // Ignore error
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await superAdminService.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Ignore error
    }
  };

  return (
    <div className="flex h-screen bg-[#F0EBD8] text-[#0D1321] overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full shrink-0">
        <SuperAdminSidebar
          pendingApplicationsCount={pendingApplicationsCount}
          onCloseMobile={() => setMobileOpen(false)}
        />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#0D1321]/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SuperAdminSidebar
          pendingApplicationsCount={pendingApplicationsCount}
          onCloseMobile={() => setMobileOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <SuperAdminTopbar
          title={meta.title}
          breadcrumbs={meta.breadcrumbs}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkNotificationRead={handleMarkNotificationRead}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
