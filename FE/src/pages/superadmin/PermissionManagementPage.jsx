import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import superAdminService from '../../services/superAdminService';
import {
  KeyRound,
  CheckCircle2,
  Loader2,
  X,
  History,
  Check,
  AlertCircle,
} from 'lucide-react';

export default function PermissionManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialAdminId = searchParams.get('adminId') || '';

  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(initialAdminId);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [catalog, setCatalog] = useState([]);
  const [assignedPermissions, setAssignedPermissions] = useState(new Set());
  const [originalPermissions, setOriginalPermissions] = useState(new Set());
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [saveReason, setSaveReason] = useState('');

  // Fetch initial admins list & permission catalog
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      superAdminService.getPermissionCatalog(),
      superAdminService.getAdmins({ limit: 50 }),
    ])
      .then(([catalogRes, adminsRes]) => {
        if (!isMounted) return;
        if (catalogRes.success) {
          setCatalog(catalogRes.catalog || []);
        }
        if (adminsRes.success) {
          const adminList = (adminsRes.admins || []).filter((a) => a.role === 'admin');
          setAdmins(adminList);
          setSelectedAdminId((prev) => prev || (adminList.length > 0 ? adminList[0]._id : ''));
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to load permission catalog');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch selected admin's current permissions
  const fetchAdminPermissions = async (adminId) => {
    if (!adminId) return;
    try {
      const res = await superAdminService.getAdminPermissions(adminId);
      if (res.success) {
        setSelectedAdmin(res.admin);
        const permsSet = new Set(res.permissions || []);
        setAssignedPermissions(permsSet);
        setOriginalPermissions(new Set(permsSet));
        setHistory(res.history || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load administrator permissions');
    }
  };

  useEffect(() => {
    if (!selectedAdminId) return;
    searchParams.set('adminId', selectedAdminId);
    setSearchParams(searchParams);

    let isMounted = true;
    superAdminService
      .getAdminPermissions(selectedAdminId)
      .then((res) => {
        if (!isMounted) return;
        if (res.success) {
          setSelectedAdmin(res.admin);
          const permsSet = new Set(res.permissions || []);
          setAssignedPermissions(permsSet);
          setOriginalPermissions(new Set(permsSet));
          setHistory(res.history || []);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to load administrator permissions');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedAdminId, searchParams, setSearchParams]);

  const togglePermission = (key) => {
    setAssignedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleCategory = (category) => {
    const catKeys = category.permissions.map((p) => p.key);
    const allSelected = catKeys.every((k) => assignedPermissions.has(k));

    setAssignedPermissions((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        catKeys.forEach((k) => next.delete(k));
      } else {
        catKeys.forEach((k) => next.add(k));
      }
      return next;
    });
  };

  // Calculate diff
  const addedPermissions = Array.from(assignedPermissions).filter((k) => !originalPermissions.has(k));
  const removedPermissions = Array.from(originalPermissions).filter((k) => !assignedPermissions.has(k));
  const hasChanges = addedPermissions.length > 0 || removedPermissions.length > 0;

  const handleSavePermissions = async () => {
    if (!selectedAdminId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await superAdminService.updateAdminPermissions(selectedAdminId, {
        permissions: Array.from(assignedPermissions),
        reason: saveReason.trim() || 'Updated via Super Admin console',
      });
      if (res.success) {
        setSuccessMsg('Administrator permissions successfully updated and logged.');
        setConfirmModalOpen(false);
        setSaveReason('');
        setOriginalPermissions(new Set(assignedPermissions));
        fetchAdminPermissions(selectedAdminId);
      }
    } catch (err) {
      setError(err.message || 'Failed to update permissions');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D1321] tracking-tight">
          Granular Permission Management
        </h1>
        <p className="text-sm text-[#3E5C76] mt-1">
          Configure individual authorities per administrator. Actions require strict backend authorization.
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

      {/* Admin Selector Bar */}
      <div className="bg-white rounded-2xl border border-[#DDDCCF] p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[#1D2D44] text-[#F0EBD8] flex items-center justify-center shrink-0">
            <KeyRound size={20} />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#748CAB] block">
              Configuring Authority For:
            </label>
            <select
              value={selectedAdminId}
              onChange={(e) => setSelectedAdminId(e.target.value)}
              className="mt-0.5 px-3 py-1.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-sm font-bold text-[#0D1321] focus:outline-none focus:border-[#1D2D44]"
            >
              {admins.length === 0 ? (
                <option value="">No standard administrators available</option>
              ) : (
                admins.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name || a.username} ({a.email})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {selectedAdmin && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-[#0D1321]">{assignedPermissions.size} Granted</div>
              <div className="text-[10px] text-[#748CAB]">
                {hasChanges ? 'Unsaved changes pending' : 'Synchronized with database'}
              </div>
            </div>

            <button
              onClick={() => setConfirmModalOpen(true)}
              disabled={!hasChanges || saving}
              className="px-5 py-2.5 rounded-xl bg-[#1D2D44] text-[#F0EBD8] font-bold text-xs hover:bg-[#0D1321] shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Save Permission Changes
            </button>
          </div>
        )}
      </div>

      {loading && !selectedAdmin ? (
        <div className="p-16 text-center text-[#748CAB]">
          <Loader2 size={32} className="animate-spin mx-auto mb-2 text-[#1D2D44]" />
          <span className="text-xs font-semibold">Loading permissions matrix...</span>
        </div>
      ) : !selectedAdmin ? (
        <div className="bg-white rounded-2xl border border-[#DDDCCF] p-12 text-center text-[#748CAB]">
          <AlertCircle size={36} className="mx-auto mb-2 text-[#748CAB]/60" />
          <h3 className="text-sm font-bold text-[#0D1321]">No Administrator Selected</h3>
          <p className="text-xs mt-1">Select an active administrator to manage their granted authorities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Permission Matrix: 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {catalog.map((cat, catIdx) => {
              const catKeys = cat.permissions.map((p) => p.key);
              const allSelected = catKeys.every((k) => assignedPermissions.has(k));

              return (
                <div key={catIdx} className="bg-white rounded-2xl border border-[#DDDCCF] shadow-sm overflow-hidden">
                  <div className="p-4 bg-[#F7F5EF] border-b border-[#DDDCCF] flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#0D1321]">{cat.category}</h3>
                      <p className="text-[11px] text-[#748CAB]">{cat.description}</p>
                    </div>

                    <button
                      onClick={() => toggleCategory(cat)}
                      className="px-3 py-1 rounded-lg border border-[#DDDCCF] bg-white text-[11px] font-bold text-[#3E5C76] hover:bg-[#F7F5EF] hover:text-[#0D1321] transition-colors cursor-pointer"
                    >
                      {allSelected ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  <div className="p-4 divide-y divide-[#DDDCCF]/60">
                    {cat.permissions.map((perm) => {
                      const isGranted = assignedPermissions.has(perm.key);
                      const isDangerous = perm.key === 'user.delete' || perm.key === 'challenge.delete';

                      return (
                        <div
                          key={perm.key}
                          onClick={() => togglePermission(perm.key)}
                          className="py-3 flex items-start justify-between gap-3 cursor-pointer hover:bg-[#F7F5EF]/30 -mx-4 px-4 transition-colors"
                        >
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#0D1321]">{perm.label}</span>
                              <code className="text-[10px] font-mono text-[#748CAB] bg-[#F7F5EF] px-1.5 py-0.2 rounded">
                                {perm.key}
                              </code>
                              {isDangerous && (
                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#9B2226]/10 text-[#9B2226] border border-[#9B2226]/20">
                                  High Impact
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#3E5C76] mt-0.5">{perm.description}</p>
                          </div>

                          <div className="pt-0.5 shrink-0">
                            <input
                              type="checkbox"
                              checked={isGranted}
                              onChange={() => {}}
                              className="w-4 h-4 rounded text-[#1D2D44] focus:ring-[#1D2D44] cursor-pointer"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Change Summary & History */}
          <div className="space-y-6">
            {/* Diff Summary Card */}
            <div className="bg-white rounded-2xl border border-[#DDDCCF] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-[#0D1321] mb-3">Pending Authorization Diff</h3>

              {hasChanges ? (
                <div className="space-y-3 text-xs">
                  {addedPermissions.length > 0 && (
                    <div className="p-3 rounded-xl bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 space-y-1">
                      <div className="font-bold text-[#2D6A4F]">To Grant ({addedPermissions.length}):</div>
                      <ul className="list-disc list-inside text-[11px] text-[#0D1321] font-mono">
                        {addedPermissions.map((k) => (
                          <li key={k}>+{k}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {removedPermissions.length > 0 && (
                    <div className="p-3 rounded-xl bg-[#9B2226]/10 border border-[#9B2226]/20 space-y-1">
                      <div className="font-bold text-[#9B2226]">To Revoke ({removedPermissions.length}):</div>
                      <ul className="list-disc list-inside text-[11px] text-[#0D1321] font-mono">
                        {removedPermissions.map((k) => (
                          <li key={k}>-{k}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => setConfirmModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-[#1D2D44] text-[#F0EBD8] font-bold text-xs hover:bg-[#0D1321] shadow-sm transition-colors cursor-pointer mt-2"
                  >
                    Review & Confirm Changes
                  </button>
                </div>
              ) : (
                <div className="text-xs text-[#748CAB] p-4 text-center rounded-xl bg-[#F7F5EF] border border-[#DDDCCF]">
                  No permission modifications made yet.
                </div>
              )}
            </div>

            {/* Change History Card */}
            <div className="bg-white rounded-2xl border border-[#DDDCCF] p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <History size={16} className="text-[#3E5C76]" />
                <h3 className="text-sm font-bold text-[#0D1321]">Recent Change History</h3>
              </div>

              {history.length === 0 ? (
                <div className="text-xs text-[#748CAB] text-center py-6">
                  No historical permission changes logged for this administrator.
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {history.map((log) => (
                    <div key={log._id} className="p-3 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#748CAB]">
                        <span className="font-bold text-[#0D1321]">By: {log.actorName}</span>
                        <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-[#3E5C76] italic">"{log.reason || 'Permissions updated'}"</p>
                      {log.metadata?.added?.length > 0 && (
                        <div className="text-[10px] text-[#2D6A4F] font-mono">
                          +{log.metadata.added.join(', ')}
                        </div>
                      )}
                      {log.metadata?.removed?.length > 0 && (
                        <div className="text-[10px] text-[#9B2226] font-mono">
                          -{log.metadata.removed.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-[#0D1321]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#DDDCCF] shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#748CAB] hover:text-[#0D1321] cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-[#0D1321]">Confirm Permission Updates</h3>
            <p className="text-xs text-[#3E5C76] mt-1">
              Updating authorities for{' '}
              <span className="font-bold text-[#0D1321]">{selectedAdmin?.name || selectedAdmin?.username}</span>.
              Revoked permissions take effect immediately upon backend verification.
            </p>

            <div className="my-4 space-y-2 text-xs">
              {addedPermissions.length > 0 && (
                <div className="p-2.5 rounded-xl bg-[#2D6A4F]/10 text-[#2D6A4F] text-[11px] font-mono">
                  + Granting {addedPermissions.length} permissions
                </div>
              )}
              {removedPermissions.length > 0 && (
                <div className="p-2.5 rounded-xl bg-[#9B2226]/10 text-[#9B2226] text-[11px] font-mono">
                  - Revoking {removedPermissions.length} permissions
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-[#0D1321] uppercase tracking-wider mb-1.5">
                  Audit Reason (Recommended)
                </label>
                <textarea
                  rows={2}
                  value={saveReason}
                  onChange={(e) => setSaveReason(e.target.value)}
                  placeholder="Operational justification for granting or revoking authorities..."
                  className="w-full p-2.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] text-xs focus:outline-none focus:border-[#1D2D44]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#DDDCCF] text-[#3E5C76] font-semibold hover:bg-[#F7F5EF] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePermissions}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-[#1D2D44] text-[#F0EBD8] font-bold hover:bg-[#0D1321] cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                Confirm & Log Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
