import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import superAdminService from '../../services/superAdminService';
import {
  FileCheck,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';

export default function AdminApplicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [counts, setCounts] = useState({ all: 0, pending: 0, approved: 0, rejected: 0, info_requested: 0 });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters & Pagination
  const [activeTab, setActiveTab] = useState(searchParams.get('status') || 'all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Selected application for detail modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [existingUser, setExistingUser] = useState(null);

  // Action Dialog states
  const [actionType, setActionType] = useState(null); // 'approve' | 'reject' | 'info'
  const [rejectReason, setRejectReason] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([
    'challenge.create',
    'challenge.edit',
    'competition.create',
    'reports.review',
    'user.view',
  ]);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await superAdminService.getApplications({
        status: activeTab,
        search,
        page,
        limit: 10,
      });
      if (data.success) {
        setApplications(data.applications || []);
        setCounts(data.counts || counts);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    superAdminService
      .getApplications({
        status: activeTab,
        search,
        page,
        limit: 10,
      })
      .then((data) => {
        if (isMounted && data.success) {
          setApplications(data.applications || []);
          setCounts((c) => data.counts || c);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to fetch applications');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab, search, page]);

  const openDetailModal = async (id) => {
    try {
      const res = await superAdminService.getApplication(id);
      if (res.success) {
        setSelectedApp(res.application);
        setExistingUser(res.existingUser);
      }
    } catch (err) {
      setError('Could not load application details: ' + err.message);
    }
  };

  // Handle direct link query param `?id=...`
  useEffect(() => {
    const directId = searchParams.get('id');
    if (!directId) return;

    let isMounted = true;
    superAdminService
      .getApplication(directId)
      .then((res) => {
        if (isMounted && res.success) {
          setSelectedApp(res.application);
          setExistingUser(res.existingUser);
        }
      })
      .catch((err) => {
        if (isMounted) setError('Could not load application details: ' + err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const closeDetailModal = () => {
    setSelectedApp(null);
    setExistingUser(null);
    setActionType(null);
    setRejectReason('');
    setInfoMessage('');
    searchParams.delete('id');
    setSearchParams(searchParams);
  };

  const handleApprove = async () => {
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      const res = await superAdminService.approveApplication(selectedApp._id, {
        permissions: selectedPermissions,
      });
      if (res.success) {
        setSuccessMsg(res.message);
        closeDetailModal();
        fetchApplications();
      }
    } catch (err) {
      setError(err.message || 'Failed to approve application');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp || !rejectReason.trim()) return;
    setActionLoading(true);
    try {
      const res = await superAdminService.rejectApplication(selectedApp._id, {
        reason: rejectReason.trim(),
      });
      if (res.success) {
        setSuccessMsg(res.message);
        closeDetailModal();
        fetchApplications();
      }
    } catch (err) {
      setError(err.message || 'Failed to reject application');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestInfo = async () => {
    if (!selectedApp || !infoMessage.trim()) return;
    setActionLoading(true);
    try {
      const res = await superAdminService.requestApplicationInfo(selectedApp._id, {
        message: infoMessage.trim(),
      });
      if (res.success) {
        setSuccessMsg(res.message);
        closeDetailModal();
        fetchApplications();
      }
    } catch (err) {
      setError(err.message || 'Failed to request additional information');
    } finally {
      setActionLoading(false);
    }
  };

  const tabs = [
    { key: 'all', label: 'All Applications', count: counts.all },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'approved', label: 'Approved', count: counts.approved },
    { key: 'rejected', label: 'Rejected', count: counts.rejected },
    { key: 'info_requested', label: 'Info Requested', count: counts.info_requested },
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
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D1321] tracking-tight">
          Admin Application Review
        </h1>
        <p className="text-sm text-[#3E5C76] mt-1">
          Review developer applications for administrative privileges, request details, or approve accounts.
        </p>
      </div>

      {/* Success Notification */}
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

      {/* Error Notification */}
      {error && (
        <div className="p-4 rounded-2xl bg-[#9B2226]/10 border border-[#9B2226]/20 text-[#9B2226] text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle size={16} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="hover:opacity-75 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DDDCCF] pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-[#1D2D44] text-[#F0EBD8] shadow-sm'
                : 'text-[#3E5C76] hover:bg-white hover:text-[#0D1321]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.key ? 'bg-white/20 text-[#F0EBD8]' : 'bg-[#DDDCCF] text-[#0D1321]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
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
            placeholder="Search by applicant name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] text-xs placeholder-[#748CAB] focus:outline-none focus:border-[#1D2D44]"
          />
        </div>

        <div className="text-xs text-[#748CAB] font-medium self-end sm:self-auto">
          Showing {applications.length} of {total} applications
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-[#DDDCCF] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#748CAB]">
            <Loader2 size={28} className="animate-spin mx-auto mb-2 text-[#1D2D44]" />
            <span className="text-xs font-semibold">Loading applications...</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-[#748CAB]">
            <FileCheck size={36} className="mx-auto mb-2 text-[#748CAB]/60" />
            <h3 className="text-sm font-bold text-[#0D1321]">No Applications Found</h3>
            <p className="text-xs mt-1">There are no applications matching your current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EF] text-[#3E5C76] font-bold uppercase tracking-wider text-[11px] border-b border-[#DDDCCF]">
                <tr>
                  <th className="py-3.5 px-4">Applicant</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Submitted</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDDCCF]/60">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-[#F7F5EF]/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#0D1321]">
                      {app.fullName}
                      {app.emailVerified && (
                        <span className="ml-1.5 inline-block text-[10px] text-[#2D6A4F] font-semibold bg-[#2D6A4F]/10 px-1 rounded">
                          Verified
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#3E5C76]">{app.email}</td>
                    <td className="py-3.5 px-4 text-[#748CAB]">{app.phone}</td>
                    <td className="py-3.5 px-4 text-[#748CAB]">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openDetailModal(app._id)}
                        className="px-3 py-1.5 rounded-lg bg-[#1D2D44] text-[#F0EBD8] font-bold text-xs hover:bg-[#0D1321] transition-colors cursor-pointer"
                      >
                        Inspect & Review
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
              Page {page} of {totalPages}
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

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-[#0D1321]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#DDDCCF] shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative my-8">
            <button
              onClick={closeDetailModal}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#748CAB] hover:text-[#0D1321] hover:bg-[#F7F5EF] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 pb-6 border-b border-[#DDDCCF]">
              <div className="w-12 h-12 rounded-2xl bg-[#1D2D44] text-[#F0EBD8] flex items-center justify-center font-bold text-lg shrink-0">
                {selectedApp.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-[#0D1321]">{selectedApp.fullName}</h2>
                  {getStatusBadge(selectedApp.status)}
                </div>
                <div className="text-xs text-[#748CAB] mt-1 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Mail size={13} /> {selectedApp.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={13} /> {selectedApp.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="py-6 space-y-5 text-xs max-h-[60vh] overflow-y-auto pr-2">
              {/* Existing User Check */}
              {existingUser ? (
                <div className="p-3.5 rounded-2xl bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 text-[#2D6A4F] flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>
                    <strong>Existing Platform Account:</strong> @{existingUser.username} (Role: {existingUser.role}, Status: {existingUser.status}). Approving will promote this user without duplicate accounts.
                  </span>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#B07D1C]/10 border border-[#B07D1C]/20 text-[#B07D1C] flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>
                    <strong>New User:</strong> No existing developer account found with this email. Approving will create an administrator account for this applicant.
                  </span>
                </div>
              )}

              <div>
                <h4 className="font-bold text-[#0D1321] uppercase tracking-wider text-[11px] mb-1">
                  Reason for Requesting Admin Access
                </h4>
                <div className="p-3.5 rounded-xl bg-[#F7F5EF] text-[#0D1321] leading-relaxed whitespace-pre-wrap border border-[#DDDCCF]">
                  {selectedApp.reason}
                </div>
              </div>

              {selectedApp.experience && (
                <div>
                  <h4 className="font-bold text-[#0D1321] uppercase tracking-wider text-[11px] mb-1">
                    Previous Administrative Experience
                  </h4>
                  <div className="p-3.5 rounded-xl bg-[#F7F5EF] text-[#0D1321] leading-relaxed whitespace-pre-wrap border border-[#DDDCCF]">
                    {selectedApp.experience}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="flex flex-wrap gap-4 pt-1">
                {selectedApp.linkedinUrl && (
                  <a
                    href={selectedApp.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDDCCF] text-[#3E5C76] hover:text-[#0D1321] hover:bg-[#F7F5EF] font-semibold"
                  >
                    <span>LinkedIn Profile</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {selectedApp.githubUrl && (
                  <a
                    href={selectedApp.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDDCCF] text-[#3E5C76] hover:text-[#0D1321] hover:bg-[#F7F5EF] font-semibold"
                  >
                    <span>GitHub Profile</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              {/* Review History / Applicant response */}
              {selectedApp.requestedInfoMessage && (
                <div className="p-3.5 rounded-xl bg-[#B07D1C]/10 border border-[#B07D1C]/20 space-y-1">
                  <div className="font-bold text-[#B07D1C]">Super Admin Requested Info:</div>
                  <p className="text-[#0D1321]">{selectedApp.requestedInfoMessage}</p>
                </div>
              )}

              {selectedApp.applicantResponse && (
                <div className="p-3.5 rounded-xl bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 space-y-1">
                  <div className="font-bold text-[#2D6A4F]">Applicant Provided Response:</div>
                  <p className="text-[#0D1321]">{selectedApp.applicantResponse}</p>
                  <div className="text-[10px] text-[#748CAB]">
                    Date: {new Date(selectedApp.applicantResponseDate).toLocaleString()}
                  </div>
                </div>
              )}

              {selectedApp.rejectionReason && (
                <div className="p-3.5 rounded-xl bg-[#9B2226]/10 border border-[#9B2226]/20 space-y-1">
                  <div className="font-bold text-[#9B2226]">Rejection Reason Recorded:</div>
                  <p className="text-[#0D1321]">{selectedApp.rejectionReason}</p>
                </div>
              )}

              {/* Nested Action Form */}
              {actionType === 'approve' && (
                <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#DDDCCF] space-y-3">
                  <h4 className="font-bold text-[#0D1321]">Select Initial Permissions to Grant:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {[
                      { key: 'challenge.create', label: 'Create Challenges' },
                      { key: 'challenge.edit', label: 'Edit Challenges' },
                      { key: 'competition.create', label: 'Create Competitions' },
                      { key: 'reports.review', label: 'Review Community Reports' },
                      { key: 'user.view', label: 'View Developers' },
                    ].map((p) => (
                      <label key={p.key} className="flex items-center gap-2 cursor-pointer font-medium text-[#0D1321]">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(p.key)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions([...selectedPermissions, p.key]);
                            } else {
                              setSelectedPermissions(selectedPermissions.filter((k) => k !== p.key));
                            }
                          }}
                          className="rounded text-[#1D2D44] focus:ring-[#1D2D44]"
                        />
                        {p.label}
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="px-4 py-2 rounded-xl bg-[#2D6A4F] text-white font-bold hover:bg-[#1B4332] transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {actionLoading && <Loader2 size={14} className="animate-spin" />}
                      Confirm Approval & Grant Role
                    </button>
                    <button
                      onClick={() => setActionType(null)}
                      className="px-3 py-2 rounded-xl text-[#748CAB] hover:text-[#0D1321] font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {actionType === 'reject' && (
                <div className="p-4 rounded-2xl bg-[#9B2226]/5 border border-[#9B2226]/20 space-y-3">
                  <h4 className="font-bold text-[#9B2226]">Enter Required Rejection Reason:</h4>
                  <textarea
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="State the objective reason why this application cannot be accepted..."
                    className="w-full p-3 rounded-xl border border-[#DDDCCF] bg-white text-[#0D1321] text-xs placeholder-[#748CAB] focus:outline-none focus:border-[#9B2226]"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReject}
                      disabled={actionLoading || !rejectReason.trim()}
                      className="px-4 py-2 rounded-xl bg-[#9B2226] text-white font-bold hover:bg-[#660708] transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {actionLoading && <Loader2 size={14} className="animate-spin" />}
                      Confirm Rejection
                    </button>
                    <button
                      onClick={() => setActionType(null)}
                      className="px-3 py-2 rounded-xl text-[#748CAB] hover:text-[#0D1321] font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {actionType === 'info' && (
                <div className="p-4 rounded-2xl bg-[#B07D1C]/5 border border-[#B07D1C]/20 space-y-3">
                  <h4 className="font-bold text-[#B07D1C]">Describe More Information Needed:</h4>
                  <textarea
                    rows={3}
                    value={infoMessage}
                    onChange={(e) => setInfoMessage(e.target.value)}
                    placeholder="Specify additional context, references, or links the applicant should provide..."
                    className="w-full p-3 rounded-xl border border-[#DDDCCF] bg-white text-[#0D1321] text-xs placeholder-[#748CAB] focus:outline-none focus:border-[#B07D1C]"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRequestInfo}
                      disabled={actionLoading || !infoMessage.trim()}
                      className="px-4 py-2 rounded-xl bg-[#B07D1C] text-white font-bold hover:bg-[#78350F] transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {actionLoading && <Loader2 size={14} className="animate-spin" />}
                      Send Request to Applicant
                    </button>
                    <button
                      onClick={() => setActionType(null)}
                      className="px-3 py-2 rounded-xl text-[#748CAB] hover:text-[#0D1321] font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            {!actionType && (
              <div className="pt-4 border-t border-[#DDDCCF] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={closeDetailModal}
                  className="px-4 py-2 rounded-xl border border-[#DDDCCF] text-[#3E5C76] font-semibold text-xs hover:bg-[#F7F5EF] cursor-pointer"
                >
                  Close Inspection
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActionType('info')}
                    className="px-3.5 py-2 rounded-xl border border-[#DDDCCF] text-[#B07D1C] font-bold text-xs hover:bg-[#B07D1C]/10 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <HelpCircle size={14} /> Request More Info
                  </button>

                  <button
                    onClick={() => setActionType('reject')}
                    className="px-3.5 py-2 rounded-xl border border-[#DDDCCF] text-[#9B2226] font-bold text-xs hover:bg-[#9B2226]/10 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <XCircle size={14} /> Reject Application
                  </button>

                  <button
                    onClick={() => setActionType('approve')}
                    className="px-4 py-2 rounded-xl bg-[#1D2D44] text-[#F0EBD8] font-bold text-xs hover:bg-[#0D1321] shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={14} /> Approve Administrator
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
