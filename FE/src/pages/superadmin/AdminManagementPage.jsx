import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import superAdminService from '../../services/superAdminService';
import {
  Search,
  UserPlus,
  Shield,
  KeyRound,
  UserX,
  UserCheck,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react';

export default function AdminManagementPage() {
  const { user: currentSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    email: '',
    username: '',
    name: '',
    password: '',
    permissions: ['challenge.create', 'challenge.edit', 'competition.create', 'reports.review', 'user.view'],
  });

  // Action Dialogs (suspend, restore, demote, delete)
  const [actionTarget, setActionTarget] = useState(null);
  const [actionKind, setActionKind] = useState(null); // 'suspend' | 'restore' | 'demote' | 'delete'
  const [actionReason, setActionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await superAdminService.getAdmins({
        search,
        status: statusFilter,
        page,
        limit: 20,
      });
      if (data.success) {
        setAdmins(data.admins || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch administrators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    superAdminService
      .getAdmins({
        search,
        status: statusFilter,
        page,
        limit: 20,
      })
      .then((data) => {
        if (isMounted && data.success) {
          setAdmins(data.admins || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to fetch administrators');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [search, statusFilter, page]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminData.email.trim()) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await superAdminService.createAdmin(newAdminData);
      if (res.success) {
        setSuccessMsg(res.message);
        setCreateModalOpen(false);
        setNewAdminData({
          email: '',
          username: '',
          name: '',
          password: '',
          permissions: ['challenge.create', 'challenge.edit', 'competition.create', 'reports.review', 'user.view'],
        });
        fetchAdmins();
      }
    } catch (err) {
      setError(err.message || 'Failed to create administrator');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecuteAction = async () => {
    if (!actionTarget || !actionKind) return;
    setActionLoading(true);
    setError(null);
    try {
      let res;
      if (actionKind === 'suspend') {
        res = await superAdminService.updateAdminStatus(actionTarget._id, {
          status: 'suspended',
          reason: actionReason.trim(),
        });
      } else if (actionKind === 'restore') {
        res = await superAdminService.updateAdminStatus(actionTarget._id, {
          status: 'active',
          reason: actionReason.trim(),
        });
      } else if (actionKind === 'demote') {
        res = await superAdminService.removeAdminRole(actionTarget._id, {
          reason: actionReason.trim(),
        });
      } else if (actionKind === 'delete') {
        res = await superAdminService.deleteAdmin(actionTarget._id, {
          reason: actionReason.trim(),
        });
      }

      if (res?.success) {
        setSuccessMsg(res.message);
        setActionTarget(null);
        setActionKind(null);
        setActionReason('');
        fetchAdmins();
      }
    } catch (err) {
      setError(err.message || `Failed to execute ${actionKind} action`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D1321] tracking-tight">
            Administrator Accounts
          </h1>
          <p className="text-sm text-[#3E5C76] mt-1">
            Supervise governance accounts, assign roles, enforce suspensions, or adjust authority.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D2D44] text-[#F0EBD8] text-xs font-bold hover:bg-[#0D1321] transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <UserPlus size={16} />
          Create or Promote Admin
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 text-[#2D6A4F] text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="hover:opacity-75 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-[#9B2226]/10 border border-[#9B2226]/20 text-[#9B2226] text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:opacity-75 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search & Status Filter */}
      <div className="bg-white rounded-2xl border border-[#DDDCCF] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-[#748CAB]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search admins by name, email, or username..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] text-xs placeholder-[#748CAB] focus:outline-none focus:border-[#1D2D44]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-[#748CAB] font-semibold">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-xs font-medium text-[#0D1321] focus:outline-none focus:border-[#1D2D44]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl border border-[#DDDCCF] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#748CAB]">
            <Loader2 size={28} className="animate-spin mx-auto mb-2 text-[#1D2D44]" />
            <span className="text-xs font-semibold">Loading administrators...</span>
          </div>
        ) : admins.length === 0 ? (
          <div className="p-12 text-center text-[#748CAB]">
            <Shield size={36} className="mx-auto mb-2 text-[#748CAB]/60" />
            <h3 className="text-sm font-bold text-[#0D1321]">No Administrators Found</h3>
            <p className="text-xs mt-1">No admin accounts matched your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EF] text-[#3E5C76] font-bold uppercase tracking-wider text-[11px] border-b border-[#DDDCCF]">
                <tr>
                  <th className="py-3.5 px-4">Administrator</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Permissions</th>
                  <th className="py-3.5 px-4">Approved / Active Since</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDDCCF]/60">
                {admins.map((admin) => {
                  const isSelf = admin._id === currentSuperAdmin?.id || admin._id === currentSuperAdmin?._id;
                  const isSuperAdmin = admin.role === 'superadmin';

                  return (
                    <tr key={admin._id} className="hover:bg-[#F7F5EF]/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={admin.avatar || '/default-avatar.png'}
                            alt={admin.name || admin.username}
                            className="w-9 h-9 rounded-full object-cover border border-[#DDDCCF]"
                            onError={(e) => {
                              e.target.src = '/default-avatar.png';
                            }}
                          />
                          <div>
                            <div className="font-bold text-[#0D1321]">
                              {admin.name || admin.username}
                              {isSelf && (
                                <span className="ml-1.5 text-[10px] bg-[#1D2D44] text-[#F0EBD8] px-1.5 py-0.2 rounded font-bold">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#748CAB]">
                              @{admin.username} • {admin.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isSuperAdmin
                              ? 'bg-[#1D2D44] text-[#F0EBD8]'
                              : 'bg-[#3E5C76]/10 text-[#3E5C76] border border-[#3E5C76]/20'
                          }`}
                        >
                          {admin.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {admin.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-[#2D6A4F] font-bold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#9B2226] font-bold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#9B2226]" /> Suspended
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {isSuperAdmin ? (
                          <span className="text-[11px] font-semibold text-[#1D2D44]">Full Platform Access</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#0D1321]">
                              {admin.permissions?.length || 0} granted
                            </span>
                            <Link
                              to={`/superadmin/permissions?adminId=${admin._id}`}
                              className="text-[11px] font-semibold text-[#3E5C76] hover:text-[#0D1321] hover:underline"
                            >
                              Configure
                            </Link>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[#748CAB]">
                        {admin.approvedAt
                          ? new Date(admin.approvedAt).toLocaleDateString()
                          : new Date(admin.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isSuperAdmin && (
                            <>
                              <Link
                                to={`/superadmin/permissions?adminId=${admin._id}`}
                                title="Manage Permissions"
                                className="p-1.5 rounded-lg border border-[#DDDCCF] text-[#3E5C76] hover:bg-[#1D2D44] hover:text-[#F0EBD8] transition-colors"
                              >
                                <KeyRound size={14} />
                              </Link>

                              {admin.status === 'active' ? (
                                <button
                                  onClick={() => {
                                    setActionTarget(admin);
                                    setActionKind('suspend');
                                  }}
                                  title="Suspend Admin"
                                  className="p-1.5 rounded-lg border border-[#DDDCCF] text-[#B07D1C] hover:bg-[#B07D1C] hover:text-white transition-colors cursor-pointer"
                                >
                                  <UserX size={14} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setActionTarget(admin);
                                    setActionKind('restore');
                                  }}
                                  title="Restore Admin Access"
                                  className="p-1.5 rounded-lg border border-[#DDDCCF] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white transition-colors cursor-pointer"
                                >
                                  <UserCheck size={14} />
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setActionTarget(admin);
                                  setActionKind('demote');
                                }}
                                title="Demote to Developer"
                                className="p-1.5 rounded-lg border border-[#DDDCCF] text-[#748CAB] hover:bg-[#3E5C76] hover:text-white transition-colors cursor-pointer"
                              >
                                <Shield size={14} />
                              </button>

                              <button
                                onClick={() => {
                                  setActionTarget(admin);
                                  setActionKind('delete');
                                }}
                                title="Delete Admin"
                                className="p-1.5 rounded-lg border border-[#DDDCCF] text-[#9B2226] hover:bg-[#9B2226] hover:text-white transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                          {isSuperAdmin && (
                            <span className="text-[11px] text-[#748CAB] italic">Protected Authority</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#DDDCCF] flex items-center justify-between text-xs text-[#3E5C76]">
            <span>
              Page {page} of {totalPages} ({total} administrators)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#DDDCCF] bg-white hover:bg-[#F7F5EF] disabled:opacity-50 cursor-pointer font-bold"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-[#DDDCCF] bg-white hover:bg-[#F7F5EF] disabled:opacity-50 cursor-pointer font-bold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Promote Admin Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-[#0D1321]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#DDDCCF] shadow-2xl max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#748CAB] hover:text-[#0D1321] hover:bg-[#F7F5EF] cursor-pointer"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-[#0D1321]">Create or Promote Administrator</h2>
            <p className="text-xs text-[#3E5C76] mt-1 mb-6">
              If an account with this email already exists, it will be promoted. Otherwise, a new admin account will be provisioned.
            </p>

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#0D1321] uppercase tracking-wider text-[11px] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                  placeholder="admin@acceptdefeat.com"
                  className="w-full p-2.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0D1321] uppercase tracking-wider text-[11px] mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    value={newAdminData.username}
                    onChange={(e) => setNewAdminData({ ...newAdminData, username: e.target.value })}
                    placeholder="admin_handle"
                    className="w-full p-2.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0D1321] uppercase tracking-wider text-[11px] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newAdminData.name}
                    onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full p-2.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0D1321] uppercase tracking-wider text-[11px] mb-1.5">
                  Password (Required if creating a new account)
                </label>
                <input
                  type="password"
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3 rounded-xl bg-[#1D2D44] text-[#F0EBD8] font-bold hover:bg-[#0D1321] shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : 'Authorize & Provision Administrator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Action Dialog (suspend/restore/demote/delete) */}
      {actionTarget && actionKind && (
        <div className="fixed inset-0 bg-[#0D1321]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#DDDCCF] shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
            <div className="w-12 h-12 rounded-2xl bg-[#9B2226]/10 text-[#9B2226] flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-lg font-bold text-[#0D1321]">
              Confirm{' '}
              {actionKind === 'suspend'
                ? 'Suspension'
                : actionKind === 'restore'
                ? 'Account Restoration'
                : actionKind === 'demote'
                ? 'Role Demotion'
                : 'Account Deletion'}
            </h3>

            <p className="text-xs text-[#3E5C76] mt-1.5 leading-relaxed">
              Target Administrator:{' '}
              <span className="font-bold text-[#0D1321]">{actionTarget.name || actionTarget.username}</span> (
              {actionTarget.email}).
              {actionKind === 'suspend' &&
                ' All current browser sessions will be revoked and this administrator will be locked out immediately.'}
              {actionKind === 'demote' &&
                ' All administrative permissions will be cleared and the account will revert to developer role.'}
              {actionKind === 'delete' &&
                ' This account will be deactivated and soft-deleted according to platform governance rules.'}
            </p>

            <div className="mt-4">
              <label className="block text-[11px] font-bold text-[#0D1321] uppercase tracking-wider mb-1.5">
                Audit Reason (Required) *
              </label>
              <textarea
                rows={2}
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Specify the operational or policy reason for this action..."
                className="w-full p-2.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] text-xs focus:outline-none focus:border-[#1D2D44]"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => {
                  setActionTarget(null);
                  setActionKind(null);
                  setActionReason('');
                }}
                className="px-4 py-2 rounded-xl border border-[#DDDCCF] text-[#3E5C76] font-semibold hover:bg-[#F7F5EF] cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleExecuteAction}
                disabled={actionLoading || !actionReason.trim()}
                className={`px-4 py-2 rounded-xl font-bold text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 ${
                  actionKind === 'restore'
                    ? 'bg-[#2D6A4F] hover:bg-[#1B4332]'
                    : actionKind === 'suspend'
                    ? 'bg-[#B07D1C] hover:bg-[#78350F]'
                    : 'bg-[#9B2226] hover:bg-[#660708]'
                }`}
              >
                {actionLoading && <Loader2 size={14} className="animate-spin" />}
                Confirm {actionKind.charAt(0).toUpperCase() + actionKind.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
