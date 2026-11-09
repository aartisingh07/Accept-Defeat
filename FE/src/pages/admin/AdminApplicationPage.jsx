import { useState } from 'react';
import { Link } from 'react-router-dom';
import superAdminService from '../../services/superAdminService';
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Globe,
  Code,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  HelpCircle,
} from 'lucide-react';

export default function AdminApplicationPage() {
  const [activeMode, setActiveMode] = useState('apply'); // 'apply' | 'respond'

  // Application Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    reason: '',
    experience: '',
    linkedinUrl: '',
    githubUrl: '',
  });

  // Respond Form State
  const [respondAppId, setRespondAppId] = useState('');
  const [responseText, setResponseText] = useState('');

  // Status & Error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessResult(null);
    setLoading(true);

    try {
      const res = await superAdminService.submitAdminApplication(formData);
      if (res.success) {
        setSuccessResult({
          type: 'submitted',
          message: res.message,
          application: res.application,
        });
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          reason: '',
          experience: '',
          linkedinUrl: '',
          githubUrl: '',
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const handleRespondSubmit = async (e) => {
    e.preventDefault();
    if (!respondAppId.trim() || !responseText.trim()) {
      setError('Please provide your Application ID and your response message.');
      return;
    }

    setError(null);
    setSuccessResult(null);
    setLoading(true);

    try {
      const res = await superAdminService.respondToInfoRequest(
        respondAppId.trim(),
        responseText.trim()
      );
      if (res.success) {
        setSuccessResult({
          type: 'responded',
          message: res.message,
        });
        setRespondAppId('');
        setResponseText('');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EBD8] text-[#0D1321] py-12 px-4 selection:bg-[#748CAB]/30">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#3E5C76] hover:text-[#0D1321] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Accept&Defeat Home
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#DDDCCF] shadow-xl p-8 sm:p-10 relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0D1321] via-[#1D2D44] to-[#3E5C76]" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#1D2D44] text-[#F0EBD8] flex items-center justify-center shadow-md">
              <ShieldCheck size={32} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D1321] tracking-tight">
              Administrator Access Application
            </h1>

            <p className="text-xs text-[#3E5C76] mt-2 max-w-md mx-auto leading-relaxed">
              Help shape challenges, organize tournaments, and moderate competitive matches. Every administrator must be vetted and authorized by the Super Admin.
            </p>
          </div>

          {/* Toggle Modes: Apply vs Respond */}
          <div className="flex rounded-xl bg-[#F7F5EF] p-1 mb-8 border border-[#DDDCCF]">
            <button
              type="button"
              onClick={() => {
                setActiveMode('apply');
                setError(null);
                setSuccessResult(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeMode === 'apply'
                  ? 'bg-white text-[#0D1321] shadow-sm'
                  : 'text-[#748CAB] hover:text-[#0D1321]'
              }`}
            >
              New Application
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMode('respond');
                setError(null);
                setSuccessResult(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeMode === 'respond'
                  ? 'bg-white text-[#0D1321] shadow-sm'
                  : 'text-[#748CAB] hover:text-[#0D1321]'
              }`}
            >
              Respond to Information Request
            </button>
          </div>

          {/* Success Banner */}
          {successResult && (
            <div className="mb-6 p-5 rounded-2xl bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 text-[#2D6A4F] text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 size={18} />
                <span>Application Update</span>
              </div>
              <p className="leading-relaxed">{successResult.message}</p>
              {successResult.application?.id && (
                <div className="mt-2 pt-2 border-t border-[#2D6A4F]/20 text-[11px] font-mono text-[#0D1321]">
                  Reference Application ID: <strong>{successResult.application.id}</strong> (Save this if you are asked to provide further details).
                </div>
              )}
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-[#9B2226]/10 border border-[#9B2226]/20 text-[#9B2226] text-xs font-medium flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* New Application Form */}
          {activeMode === 'apply' && (
            <form onSubmit={handleApplySubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0D1321] uppercase tracking-wider text-[11px] mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3 text-[#748CAB]" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] placeholder-[#748CAB] focus:outline-none focus:border-[#1D2D44]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#0D1321] uppercase tracking-wider text-[11px] mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3 text-[#748CAB]" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] placeholder-[#748CAB] focus:outline-none focus:border-[#1D2D44]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0D1321] uppercase tracking-wider text-[11px] mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-3 text-[#748CAB]" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] placeholder-[#748CAB] focus:outline-none focus:border-[#1D2D44]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0D1321] uppercase tracking-wider text-[11px] mb-1.5">
                  Reason for Requesting Administrator Access *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Explain why you wish to join the administrative team, which areas you intend to support, and your motivation..."
                  className="w-full p-3 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] placeholder-[#748CAB] focus:outline-none focus:border-[#1D2D44] leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0D1321] uppercase tracking-wider text-[11px] mb-1.5">
                  Previous Community or Platform Experience (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Mention previous moderation roles, competitive programming achievements, or technical leadership..."
                  className="w-full p-3 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] placeholder-[#748CAB] focus:outline-none focus:border-[#1D2D44] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0D1321] uppercase tracking-wider text-[11px] mb-1.5">
                    LinkedIn URL (Optional)
                  </label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3.5 top-3 text-[#748CAB]" />
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] placeholder-[#748CAB] focus:outline-none focus:border-[#1D2D44]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#0D1321] uppercase tracking-wider text-[11px] mb-1.5">
                    GitHub URL (Optional)
                  </label>
                  <div className="relative">
                    <Code size={16} className="absolute left-3.5 top-3 text-[#748CAB]" />
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/username"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] placeholder-[#748CAB] focus:outline-none focus:border-[#1D2D44]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#1D2D44] hover:bg-[#0D1321] text-[#F0EBD8] font-bold text-sm tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    'Submit Admin Application'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Respond to Info Request Form */}
          {activeMode === 'respond' && (
            <form onSubmit={handleRespondSubmit} className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl bg-[#B07D1C]/10 border border-[#B07D1C]/20 text-[#B07D1C] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <HelpCircle size={16} />
                  <span>Information Follow-Up</span>
                </div>
                <p className="text-[#0D1321] text-[11px] leading-relaxed">
                  If the Super Administrator requested additional background, references, or details, enter your Application ID and provide the requested information below.
                </p>
              </div>

              <div>
                <label className="block font-bold text-[#0D1321] uppercase tracking-wider text-[11px] mb-1.5">
                  Application ID *
                </label>
                <input
                  type="text"
                  required
                  value={respondAppId}
                  onChange={(e) => setRespondAppId(e.target.value)}
                  placeholder="e.g. 672e819b58943f..."
                  className="w-full p-2.5 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] font-mono text-xs focus:outline-none focus:border-[#1D2D44]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0D1321] uppercase tracking-wider text-[11px] mb-1.5">
                  Your Response / Additional Details *
                </label>
                <textarea
                  required
                  rows={5}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Provide the specific clarifications or additional proof requested by the review team..."
                  className="w-full p-3 rounded-xl border border-[#DDDCCF] bg-[#F7F5EF] text-[#0D1321] text-xs focus:outline-none focus:border-[#1D2D44] leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#1D2D44] hover:bg-[#0D1321] text-[#F0EBD8] font-bold text-sm tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting Response...
                    </>
                  ) : (
                    'Submit Clarification'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-[#DDDCCF] text-center text-xs text-[#748CAB]">
            Already an authorized Super Administrator?{' '}
            <Link
              to="/superadmin/login"
              className="font-bold text-[#1D2D44] hover:text-[#0D1321] underline underline-offset-2"
            >
              Sign in to Super Admin Console
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
