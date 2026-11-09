import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import superAdminService from '../../services/superAdminService';
import {
  Users,
  Search,
  UserX,
  UserCheck,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react';

export default function UserModerationPage() {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters & sorting
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Messages
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Detail Modal
  const [selectedUser, setSelectedUser] = useState(null);

  // Action Dialogs
  const [actionTarget, setActionTarget] = useState(null);
  const [actionKind, setActionKind] = useState(null); // 'suspend' | 'restore' | 'delete'
  const [actionReason, setActionReason] = useState('');
  const [confirmDeleteCheck, setConfirmDeleteCheck] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await superAdminService.getUsers({
        search,
        status: statusFilter,
        sortBy,
        sortOrder,
        page,
        limit: 10,
      });
      if (data.success) {
        setUsers(data.users || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    superAdminService
      .getUsers({
        search,
        status: statusFilter,
        sortBy,
        sortOrder,
        page,
        limit: 10,
      })
      .then((data) => {
        if (isMounted && data.success) {
          setUsers(data.users || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to fetch users');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [search, statusFilter, sortBy, sortOrder, page]);

  const openUserDetail = async (id) => {
    try {
      const res = await superAdminService.getUser(id);
      if (res.success) {
        setSelectedUser(res.user);
      }
    } catch (err) {
      setError('Failed to load user details: ' + err.message);
    }
  };

  const handleExecuteAction = async () => {
    if (!actionTarget || !actionKind) return;
    if (actionKind === 'delete' && !confirmDeleteCheck) return;

    setActionLoading(true);
    setError(null);
    try {
      let res;
      if (actionKind === 'suspend') {
        res = await superAdminService.updateUserStatus(actionTarget._id, {
          status: 'suspended',
          reason: actionReason.trim(),
        });
      } else if (actionKind === 'restore') {
        res = await superAdminService.updateUserStatus(actionTarget._id, {
          status: 'active',
          reason: actionReason.trim(),
        });
      } else if (actionKind === 'delete') {
        res = await superAdminService.deleteUser(actionTarget._id, {
          reason: actionReason.trim(),
        });
      }

      if (res?.success) {
        setSuccessMsg(res.message);
        setActionTarget(null);
        setActionKind(null);
        setActionReason('');
        setConfirmDeleteCheck(false);
        fetchUsers();
      }
    } catch (err) {
      setError(err.message || `Failed to execute ${actionKind}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D1321] tracking-tight">
          Developer Account Moderation
        </h1>
        <p className="text-sm text-[#3E5C76] mt-1">
          Inspect platform participants, enforce policy suspensions, and safely moderate accounts.
        </p>
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

      {/* Search, Filter & Sort Controls */}
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
            placeholder="Search by username, name, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] text-xs placeholder-[#748CAB] focus:outline-none focus:border-[#1D2D44]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#748CAB]">
            <span className="font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-xs font-medium text-[#0D1321]"
            >
              <option value="all">All</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#748CAB]">
            <span className="font-semibold">Sort:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-xs font-medium text-[#0D1321]"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="points-desc">Highest Points</option>
              <option value="rank-asc">Top Rank</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#DDDCCF] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#748CAB]">
            <Loader2 size={28} className="animate-spin mx-auto mb-2 text-[#1D2D44]" />
            <span className="text-xs font-semibold">Loading developer accounts...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-[#748CAB]">
            <Users size={36} className="mx-auto mb-2 text-[#748CAB]/60" />
            <h3 className="text-sm font-bold text-[#0D1321]">No Developers Found</h3>
            <p className="text-xs mt-1">Try adjusting your search criteria or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EF] text-[#3E5C76] font-bold uppercase tracking-wider text-[11px] border-b border-[#DDDCCF]">
                <tr>
                  <th className="py-3.5 px-4">Developer</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Points & Rank</th>
                  <th className="py-3.5 px-4">Challenges / Battles</th>
                  <th className="py-3.5 px-4">Registered</th>
                  <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDDCCF]/60">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-[#F7F5EF]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || '/default-avatar.png'}
                          alt={user.name || user.username}
                          className="w-9 h-9 rounded-full object-cover border border-[#DDDCCF]"
                          onError={(e) => {
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                        <div>
                          <div
                            onClick={() => openUserDetail(user._id)}
                            className="font-bold text-[#0D1321] hover:text-[#1D2D44] hover:underline cursor-pointer"
                          >
                            {user.name || user.username}
                          </div>
                          <div className="text-[11px] text-[#748CAB]">
                            @{user.username} • {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {user.status === 'active' ? (
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
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#0D1321]">{user.points || 0} pts</span>
                        <span className="text-[11px] text-[#748CAB]">Rank #{user.rank || '—'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#748CAB]">
                      <span>{user.challengesSolved || 0} solved</span> •{' '}
                      <span>{user.battlesWon || 0} won</span>
                    </td>

                    <td className="py-3.5 px-4 text-[#748CAB]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openUserDetail(user._id)}
                          className="px-2.5 py-1 rounded-lg border border-[#DDDCCF] text-[#3E5C76] font-semibold text-xs hover:bg-[#F7F5EF] cursor-pointer"
                        >
                          View
                        </button>

                        {user.status === 'active' ? (
                          <button
                            onClick={() => {
                              setActionTarget(user);
                              setActionKind('suspend');
                            }}
                            title="Suspend Account"
                            className="p-1.5 rounded-lg border border-[#DDDCCF] text-[#B07D1C] hover:bg-[#B07D1C] hover:text-white transition-colors cursor-pointer"
                          >
                            <UserX size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setActionTarget(user);
                              setActionKind('restore');
                            }}
                            title="Restore Account"
                            className="p-1.5 rounded-lg border border-[#DDDCCF] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white transition-colors cursor-pointer"
                          >
                            <UserCheck size={14} />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setActionTarget(user);
                            setActionKind('delete');
                          }}
                          title="Soft-Delete User"
                          className="p-1.5 rounded-lg border border-[#DDDCCF] text-[#9B2226] hover:bg-[#9B2226] hover:text-white transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#DDDCCF] flex items-center justify-between text-xs text-[#3E5C76]">
            <span>
              Page {page} of {totalPages} ({total} developers)
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

      {/* Developer Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-[#0D1321]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#DDDCCF] shadow-2xl max-w-xl w-full p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#748CAB] hover:text-[#0D1321] cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 pb-6 border-b border-[#DDDCCF]">
              <img
                src={selectedUser.avatar || '/default-avatar.png'}
                alt={selectedUser.name || selectedUser.username}
                className="w-14 h-14 rounded-full object-cover border border-[#DDDCCF]"
              />
              <div>
                <h3 className="text-xl font-bold text-[#0D1321]">{selectedUser.name || selectedUser.username}</h3>
                <div className="text-xs text-[#748CAB]">@{selectedUser.username} • {selectedUser.email}</div>
                <div className="mt-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      selectedUser.status === 'active'
                        ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]'
                        : 'bg-[#9B2226]/10 text-[#9B2226]'
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="py-5 space-y-4 text-xs">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF]">
                  <div className="text-[10px] font-bold text-[#748CAB] uppercase">Points</div>
                  <div className="text-lg font-extrabold text-[#0D1321] mt-0.5">{selectedUser.points || 0}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF]">
                  <div className="text-[10px] font-bold text-[#748CAB] uppercase">Rank</div>
                  <div className="text-lg font-extrabold text-[#0D1321] mt-0.5">#{selectedUser.rank || '—'}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF]">
                  <div className="text-[10px] font-bold text-[#748CAB] uppercase">Challenges</div>
                  <div className="text-lg font-extrabold text-[#0D1321] mt-0.5">{selectedUser.challengesSolved || 0}</div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="font-bold text-[#0D1321] uppercase text-[11px] mb-1.5">Developer Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedUser.skills && selectedUser.skills.length > 0
                    ? selectedUser.skills
                    : ['JavaScript', 'React', 'Node.js']
                  ).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#F7F5EF] border border-[#DDDCCF] text-xs font-semibold text-[#1D2D44]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Reason if any */}
              {selectedUser.statusReason && (
                <div className="p-3 rounded-xl bg-[#9B2226]/10 border border-[#9B2226]/20">
                  <div className="font-bold text-[#9B2226]">Moderation Note:</div>
                  <div className="text-[#0D1321] mt-0.5">{selectedUser.statusReason}</div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#DDDCCF] flex items-center justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-[#1D2D44] text-[#F0EBD8] font-bold text-xs hover:bg-[#0D1321] cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Action Modal (suspend/restore/delete) */}
      {actionTarget && actionKind && (
        <div className="fixed inset-0 bg-[#0D1321]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#DDDCCF] shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                actionKind === 'restore'
                  ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]'
                  : actionKind === 'suspend'
                  ? 'bg-[#B07D1C]/10 text-[#B07D1C]'
                  : 'bg-[#9B2226]/10 text-[#9B2226]'
              }`}
            >
              {actionKind === 'delete' ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
            </div>

            <h3 className="text-lg font-bold text-[#0D1321]">
              Confirm{' '}
              {actionKind === 'suspend'
                ? 'Account Suspension'
                : actionKind === 'restore'
                ? 'Account Restoration'
                : 'Account Deletion (user.delete)'}
            </h3>

            <p className="text-xs text-[#3E5C76] mt-1.5 leading-relaxed">
              Target Developer: <span className="font-bold text-[#0D1321]">{actionTarget.name || actionTarget.username}</span> (
              {actionTarget.email}).
              {actionKind === 'suspend' &&
                ' This will revoke all active login sessions and block the developer from coding or competing.'}
              {actionKind === 'delete' &&
                ' This operation soft-deletes and deactivates the account while preserving immutable audit logs.'}
            </p>

            {actionKind === 'delete' && (
              <div className="mt-4 p-3 rounded-xl bg-[#9B2226]/10 border border-[#9B2226]/20">
                <label className="flex items-start gap-2 text-xs font-bold text-[#9B2226] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmDeleteCheck}
                    onChange={(e) => setConfirmDeleteCheck(e.target.checked)}
                    className="mt-0.5 rounded text-[#9B2226] focus:ring-[#9B2226]"
                  />
                  <span>
                    I confirm that I understand this account will be deactivated and removed from developer leaderboards.
                  </span>
                </label>
              </div>
            )}

            <div className="mt-4">
              <label className="block text-[11px] font-bold text-[#0D1321] uppercase tracking-wider mb-1.5">
                Audit Reason (Required) *
              </label>
              <textarea
                rows={2}
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="State the moderation justification..."
                className="w-full p-2.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] text-xs focus:outline-none focus:border-[#1D2D44]"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => {
                  setActionTarget(null);
                  setActionKind(null);
                  setActionReason('');
                  setConfirmDeleteCheck(false);
                }}
                className="px-4 py-2 rounded-xl border border-[#DDDCCF] text-[#3E5C76] font-semibold hover:bg-[#F7F5EF] cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleExecuteAction}
                disabled={actionLoading || !actionReason.trim() || (actionKind === 'delete' && !confirmDeleteCheck)}
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
