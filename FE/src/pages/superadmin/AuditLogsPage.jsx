import { useState, useEffect } from 'react';
import superAdminService from '../../services/superAdminService';
import {
  ScrollText,
  Search,
  Eye,
  Loader2,
  X,
  FileText,
} from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [distinctActions, setDistinctActions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [targetEntityFilter, setTargetEntityFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selected Log for JSON Metadata Viewer
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    let isMounted = true;
    superAdminService
      .getAuditLogs({
        search,
        action: actionFilter,
        actorRole: roleFilter,
        targetEntity: targetEntityFilter,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate + 'T23:59:59').toISOString() : undefined,
        page,
        limit: 20,
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.success) {
          setLogs(data.logs || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
          if (data.distinctActions) {
            setDistinctActions(data.distinctActions);
          }
        }
      })
      .catch(() => {
        // Fallback
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [search, actionFilter, roleFilter, targetEntityFilter, startDate, endDate, page]);

  const clearFilters = () => {
    setSearch('');
    setActionFilter('all');
    setRoleFilter('all');
    setTargetEntityFilter('all');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const getActionBadgeColor = (action) => {
    if (action.includes('delete') || action.includes('suspend') || action.includes('reject')) {
      return 'bg-[#9B2226]/10 text-[#9B2226] border-[#9B2226]/20';
    }
    if (action.includes('approve') || action.includes('create') || action.includes('restore')) {
      return 'bg-[#2D6A4F]/10 text-[#2D6A4F] border-[#2D6A4F]/20';
    }
    if (action.includes('login') || action.includes('submitted')) {
      return 'bg-[#1D2D44]/10 text-[#1D2D44] border-[#1D2D44]/20';
    }
    return 'bg-[#3E5C76]/10 text-[#3E5C76] border-[#3E5C76]/20';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D1321] tracking-tight">
          Platform Governance Audit Logs
        </h1>
        <p className="text-sm text-[#3E5C76] mt-1">
          Read-only, immutable event trail recording every sensitive administrative operation on Accept&Defeat.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-[#DDDCCF] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search size={16} className="absolute left-3.5 top-3 text-[#748CAB]" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by actor, target name, or reason..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] text-xs placeholder-[#748CAB] focus:outline-none focus:border-[#1D2D44]"
            />
          </div>

          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-[#748CAB] hover:text-[#0D1321] hover:underline cursor-pointer self-end sm:self-auto"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-[#748CAB] uppercase mb-1">Action Type</label>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321]"
            >
              <option value="all">All Actions</option>
              {distinctActions.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#748CAB] uppercase mb-1">Actor Role</label>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321]"
            >
              <option value="all">All Roles</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Administrator</option>
              <option value="user">User / Developer</option>
              <option value="system">System</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#748CAB] uppercase mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#748CAB] uppercase mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321]"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-[#DDDCCF] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#748CAB]">
            <Loader2 size={28} className="animate-spin mx-auto mb-2 text-[#1D2D44]" />
            <span className="text-xs font-semibold">Loading audit logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-[#748CAB]">
            <ScrollText size={36} className="mx-auto mb-2 text-[#748CAB]/60" />
            <h3 className="text-sm font-bold text-[#0D1321]">No Audit Logs Found</h3>
            <p className="text-xs mt-1">No recorded operations matched your current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EF] text-[#3E5C76] font-bold uppercase tracking-wider text-[11px] border-b border-[#DDDCCF]">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Actor</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Target Entity / Name</th>
                  <th className="py-3.5 px-4">Audit Reason</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDDCCF]/60 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#F7F5EF]/40 transition-colors">
                    <td className="py-3 px-4 text-[#748CAB] whitespace-nowrap font-sans text-xs">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-sans text-xs">
                      <div className="font-bold text-[#0D1321]">{log.actorName}</div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#1D2D44]/10 text-[#1D2D44]">
                        {log.actorRole}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-sans text-xs">
                      <span className="font-bold text-[#0D1321]">{log.targetEntity}</span>
                      {log.targetName && <span className="text-[#3E5C76] ml-1">({log.targetName})</span>}
                    </td>

                    <td className="py-3 px-4 font-sans text-xs text-[#3E5C76] max-w-xs truncate">
                      {log.reason || '—'}
                    </td>

                    <td className="py-3 px-4 text-right font-sans">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 rounded-lg border border-[#DDDCCF] text-[#3E5C76] hover:bg-[#1D2D44] hover:text-[#F0EBD8] transition-colors cursor-pointer"
                        title="View Full Event Details"
                      >
                        <Eye size={14} />
                      </button>
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
              Page {page} of {totalPages} ({total} events logged)
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

      {/* Event Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-[#0D1321]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#DDDCCF] shadow-2xl max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#748CAB] hover:text-[#0D1321] cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1D2D44] text-[#F0EBD8] flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0D1321]">Audit Event Details</h3>
                <div className="text-xs text-[#748CAB]">{selectedLog._id}</div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF]">
                <div>
                  <span className="font-bold text-[#748CAB] uppercase text-[10px] block">Actor</span>
                  <span className="font-bold text-[#0D1321]">
                    {selectedLog.actorName} ({selectedLog.actorRole})
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[#748CAB] uppercase text-[10px] block">Timestamp</span>
                  <span className="text-[#0D1321]">{new Date(selectedLog.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-bold text-[#748CAB] uppercase text-[10px] block">Action</span>
                  <span className="font-mono text-[#1D2D44]">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="font-bold text-[#748CAB] uppercase text-[10px] block">Target</span>
                  <span className="text-[#0D1321]">
                    {selectedLog.targetEntity} {selectedLog.targetName ? `(${selectedLog.targetName})` : ''}
                  </span>
                </div>
              </div>

              {selectedLog.reason && (
                <div className="p-3 rounded-xl bg-[#F0EBD8]/40 border border-[#DDDCCF]">
                  <span className="font-bold text-[#0D1321] text-[11px] block">Stated Reason:</span>
                  <p className="text-[#3E5C76] italic mt-0.5">{selectedLog.reason}</p>
                </div>
              )}

              <div>
                <span className="font-bold text-[#0D1321] text-[11px] block mb-1">
                  Metadata (Non-Sensitive Context):
                </span>
                <pre className="p-3.5 rounded-xl bg-[#0D1321] text-[#F0EBD8] text-[11px] font-mono overflow-x-auto max-h-48">
                  {JSON.stringify(selectedLog.metadata || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-[#DDDCCF] flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-[#1D2D44] text-[#F0EBD8] font-bold text-xs hover:bg-[#0D1321] cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
