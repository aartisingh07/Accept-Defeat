import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import superAdminService from '../../services/superAdminService';
import {
  Users,
  ShieldCheck,
  FileCheck,
  UserCheck,
  UserX,
  Activity,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';

export default function SuperAdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await superAdminService.getOverview();
      if (res.success) {
        setData(res);
      } else {
        setError(res.message || 'Failed to fetch overview metrics');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch overview data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    superAdminService
      .getOverview()
      .then((res) => {
        if (isMounted) {
          if (res.success) setData(res);
          else setError(res.message || 'Failed to fetch overview metrics');
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to fetch overview data');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = data?.stats || {
    totalDevelopers: 0,
    totalAdmins: 0,
    pendingApplications: 0,
    activeAdmins: 0,
    suspendedUsers: 0,
    recentActionsCount: 0,
  };

  const statCards = [
    {
      label: 'Total Developers',
      value: stats.totalDevelopers,
      icon: Users,
      trend: 'Registered platform users',
      to: '/superadmin/users',
      bg: 'bg-white',
    },
    {
      label: 'Total Administrators',
      value: stats.totalAdmins,
      icon: ShieldCheck,
      trend: 'Active governance accounts',
      to: '/superadmin/admins',
      bg: 'bg-white',
    },
    {
      label: 'Pending Applications',
      value: stats.pendingApplications,
      icon: FileCheck,
      trend: stats.pendingApplications > 0 ? 'Requires your review' : 'No pending reviews',
      highlight: stats.pendingApplications > 0,
      to: '/superadmin/applications',
      bg: 'bg-white',
    },
    {
      label: 'Active Administrators',
      value: stats.activeAdmins,
      icon: UserCheck,
      trend: 'Admins with active status',
      to: '/superadmin/admins',
      bg: 'bg-white',
    },
    {
      label: 'Suspended Users',
      value: stats.suspendedUsers,
      icon: UserX,
      trend: 'Moderated or locked accounts',
      to: '/superadmin/users?status=suspended',
      bg: 'bg-white',
    },
    {
      label: 'Recent Actions (24h)',
      value: stats.recentActionsCount,
      icon: Activity,
      trend: 'Immutable audit logs recorded',
      to: '/superadmin/audit-logs',
      bg: 'bg-white',
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20">
            <CheckCircle2 size={12} /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#9B2226]/10 text-[#9B2226] border border-[#9B2226]/20">
            <XCircle size={12} /> Rejected
          </span>
        );
      case 'info_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#B07D1C]/10 text-[#B07D1C] border border-[#B07D1C]/20">
            <HelpCircle size={12} /> Info Requested
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1D2D44]/10 text-[#1D2D44] border border-[#1D2D44]/20">
            <Clock size={12} /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D1321] tracking-tight">
            Super Admin Overview
          </h1>
          <p className="text-sm text-[#3E5C76] mt-1">
            Manage administrators, permissions, and platform governance from one place.
          </p>
        </div>

        <button
          onClick={fetchOverview}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#DDDCCF] text-[#3E5C76] hover:text-[#0D1321] text-xs font-bold hover:bg-[#F7F5EF] transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh Metrics
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-[#9B2226]/10 border border-[#9B2226]/20 text-[#9B2226] text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchOverview}
            className="text-xs font-bold underline underline-offset-2 hover:opacity-80 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state skeleton / Stats Grid */}
      {loading && !data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-white/70 rounded-2xl border border-[#DDDCCF] animate-pulse p-6" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                to={card.to}
                className={`p-6 rounded-2xl border border-[#DDDCCF] shadow-sm hover:shadow-md hover:border-[#3E5C76]/50 transition-all group flex flex-col justify-between ${
                  card.bg
                } ${card.highlight ? 'ring-2 ring-[#9B2226]/30' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#748CAB]">
                      {card.label}
                    </div>
                    <div className="text-3xl font-extrabold text-[#0D1321] mt-2">
                      {card.value}
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      card.highlight
                        ? 'bg-[#9B2226]/10 text-[#9B2226]'
                        : 'bg-[#1D2D44]/10 text-[#1D2D44]'
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DDDCCF]/60 flex items-center justify-between text-xs text-[#3E5C76]">
                  <span>{card.trend}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Quick Action Shortcuts */}
      <div className="bg-white rounded-2xl border border-[#DDDCCF] p-6 shadow-sm">
        <h2 className="text-base font-bold text-[#0D1321] mb-4">Quick Governance Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/superadmin/applications"
            className="p-4 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] hover:bg-[#1D2D44] hover:text-[#F0EBD8] text-[#0D1321] transition-all text-center group font-semibold text-xs flex flex-col items-center justify-center gap-2"
          >
            <FileCheck size={20} className="text-[#3E5C76] group-hover:text-[#F0EBD8]" />
            <span>Review Applications</span>
          </Link>

          <Link
            to="/superadmin/admins"
            className="p-4 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] hover:bg-[#1D2D44] hover:text-[#F0EBD8] text-[#0D1321] transition-all text-center group font-semibold text-xs flex flex-col items-center justify-center gap-2"
          >
            <ShieldCheck size={20} className="text-[#3E5C76] group-hover:text-[#F0EBD8]" />
            <span>Manage Admins</span>
          </Link>

          <Link
            to="/superadmin/permissions"
            className="p-4 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] hover:bg-[#1D2D44] hover:text-[#F0EBD8] text-[#0D1321] transition-all text-center group font-semibold text-xs flex flex-col items-center justify-center gap-2"
          >
            <Users size={20} className="text-[#3E5C76] group-hover:text-[#F0EBD8]" />
            <span>Manage Permissions</span>
          </Link>

          <Link
            to="/superadmin/audit-logs"
            className="p-4 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] hover:bg-[#1D2D44] hover:text-[#F0EBD8] text-[#0D1321] transition-all text-center group font-semibold text-xs flex flex-col items-center justify-center gap-2"
          >
            <Activity size={20} className="text-[#3E5C76] group-hover:text-[#F0EBD8]" />
            <span>View Audit Logs</span>
          </Link>
        </div>
      </div>

      {/* Two Column Section: Recent Applications & Recent Admin Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Admin Applications */}
        <div className="bg-white rounded-2xl border border-[#DDDCCF] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#DDDCCF]">
              <div>
                <h2 className="text-base font-bold text-[#0D1321]">Recent Applications</h2>
                <p className="text-xs text-[#748CAB]">Latest developer requests for Admin access</p>
              </div>
              <Link
                to="/superadmin/applications"
                className="text-xs font-bold text-[#3E5C76] hover:text-[#0D1321] flex items-center gap-1"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="divide-y divide-[#DDDCCF]/60 mt-2">
              {!data?.recentApplications || data.recentApplications.length === 0 ? (
                <div className="py-10 text-center text-xs text-[#748CAB]">
                  No admin applications submitted yet.
                </div>
              ) : (
                data.recentApplications.map((app) => (
                  <div key={app._id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#0D1321] truncate">
                        {app.fullName}
                      </div>
                      <div className="text-xs text-[#748CAB] truncate">{app.email}</div>
                      <div className="text-[11px] text-[#3E5C76] mt-0.5">
                        Submitted: {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {getStatusBadge(app.status)}
                      <Link
                        to={`/superadmin/applications?id=${app._id}`}
                        className="px-3 py-1 rounded-lg bg-[#1D2D44] text-[#F0EBD8] text-xs font-bold hover:bg-[#0D1321] transition-colors"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Admin Activity Feed */}
        <div className="bg-white rounded-2xl border border-[#DDDCCF] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#DDDCCF]">
              <div>
                <h2 className="text-base font-bold text-[#0D1321]">Recent Administrative Activity</h2>
                <p className="text-xs text-[#748CAB]">Verified immutable audit entries</p>
              </div>
              <Link
                to="/superadmin/audit-logs"
                className="text-xs font-bold text-[#3E5C76] hover:text-[#0D1321] flex items-center gap-1"
              >
                All Logs <ArrowRight size={14} />
              </Link>
            </div>

            <div className="divide-y divide-[#DDDCCF]/60 mt-2 max-h-96 overflow-y-auto">
              {!data?.recentActivity || data.recentActivity.length === 0 ? (
                <div className="py-10 text-center text-xs text-[#748CAB]">
                  No administrative actions logged yet.
                </div>
              ) : (
                data.recentActivity.map((log) => (
                  <div key={log._id} className="py-3 flex items-start gap-3 text-xs">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-[#1D2D44]/10 text-[#1D2D44] shrink-0">
                      <Activity size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#0D1321] truncate">
                          {log.actorName} ({log.actorRole})
                        </span>
                        <span className="text-[10px] text-[#748CAB] shrink-0">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-[#3E5C76] font-medium mt-0.5">
                        <code className="px-1.5 py-0.5 rounded bg-[#F7F5EF] text-[11px] font-mono text-[#1D2D44]">
                          {log.action}
                        </code>{' '}
                        on {log.targetEntity} {log.targetName ? `(${log.targetName})` : ''}
                      </div>
                      {log.reason && (
                        <div className="text-[11px] text-[#748CAB] italic mt-0.5 truncate">
                          Reason: "{log.reason}"
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
