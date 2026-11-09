import { useState, useEffect } from 'react';
import superAdminService from '../../services/superAdminService';
import {
  Shield,
  Bell,
  Clock,
  CheckCircle2,
  Loader2,
  Save,
  X,
} from 'lucide-react';

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    superAdminService
      .getSettings()
      .then((res) => {
        if (isMounted && res.success) {
          setSettings(res.settings || []);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to load settings');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value: !s.value } : s))
    );
  };

  const handleNumberChange = (key, val) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value: Number(val) } : s))
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await superAdminService.updateSettings(settings);
      if (res.success) {
        setSuccessMsg('Platform configuration updated and logged to audit trail.');
      }
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D1321] tracking-tight">
          Platform Governance Settings
        </h1>
        <p className="text-sm text-[#3E5C76] mt-1">
          Adjust administrative workflow preferences, session limits, and governance notification triggers.
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

      {loading ? (
        <div className="p-16 text-center text-[#748CAB]">
          <Loader2 size={32} className="animate-spin mx-auto mb-2 text-[#1D2D44]" />
          <span className="text-xs font-semibold">Loading platform settings...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Security & Sessions */}
          <div className="bg-white rounded-2xl border border-[#DDDCCF] shadow-sm overflow-hidden p-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#DDDCCF] mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#1D2D44] text-[#F0EBD8] flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0D1321]">Session Timeout Configuration</h3>
                <p className="text-xs text-[#748CAB]">
                  Enforced across all tabs using the tab-scoped JWT session protocol.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF]">
                <label className="font-bold text-[#0D1321] block mb-1">
                  Idle Session Limit (Minutes)
                </label>
                <p className="text-[11px] text-[#3E5C76] mb-3">
                  Revokes user or admin session if no mouse, keyboard, or touch events occur.
                </p>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={
                    settings.find((s) => s.key === 'session_idle_timeout_min')?.value || 15
                  }
                  onChange={(e) =>
                    handleNumberChange('session_idle_timeout_min', e.target.value)
                  }
                  className="w-full p-2 rounded-lg border border-[#DDDCCF] bg-white text-[#0D1321] font-bold"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF]">
                <label className="font-bold text-[#0D1321] block mb-1">
                  Absolute Expiry Limit (Hours)
                </label>
                <p className="text-[11px] text-[#3E5C76] mb-3">
                  Hard upper bound requiring authentication re-entry regardless of activity.
                </p>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={
                    settings.find((s) => s.key === 'session_absolute_timeout_hr')?.value || 8
                  }
                  onChange={(e) =>
                    handleNumberChange('session_absolute_timeout_hr', e.target.value)
                  }
                  className="w-full p-2 rounded-lg border border-[#DDDCCF] bg-white text-[#0D1321] font-bold"
                />
              </div>
            </div>
          </div>

          {/* Administrative Application Rules */}
          <div className="bg-white rounded-2xl border border-[#DDDCCF] shadow-sm overflow-hidden p-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#DDDCCF] mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#1D2D44] text-[#F0EBD8] flex items-center justify-center">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0D1321]">Administrative Application Workflow</h3>
                <p className="text-xs text-[#748CAB]">
                  Controls for the public application portal at <code>/admin/apply</code>.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF]">
                <div>
                  <div className="font-bold text-[#0D1321]">Allow Developer Applications</div>
                  <div className="text-[11px] text-[#3E5C76]">
                    When active, developers can submit requests to become platform administrators.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={
                    Boolean(settings.find((s) => s.key === 'allow_admin_applications')?.value)
                  }
                  onChange={() => handleToggle('allow_admin_applications')}
                  className="w-5 h-5 rounded text-[#1D2D44] focus:ring-[#1D2D44] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF]">
                <div>
                  <div className="font-bold text-[#0D1321]">Require Verified Email Before Review</div>
                  <div className="text-[11px] text-[#3E5C76]">
                    Ensures applicants confirm their email address before applications appear in review queue.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={
                    Boolean(settings.find((s) => s.key === 'require_email_verification_for_review')?.value)
                  }
                  onChange={() => handleToggle('require_email_verification_for_review')}
                  className="w-5 h-5 rounded text-[#1D2D44] focus:ring-[#1D2D44] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Notification Alerts */}
          <div className="bg-white rounded-2xl border border-[#DDDCCF] shadow-sm overflow-hidden p-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#DDDCCF] mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#1D2D44] text-[#F0EBD8] flex items-center justify-center">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0D1321]">Governance Notifications</h3>
                <p className="text-xs text-[#748CAB]">
                  Alert triggers delivered to the Super Admin bell icon.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF]">
                <div>
                  <div className="font-bold text-[#0D1321]">Notify on New Admin Applications</div>
                  <div className="text-[11px] text-[#3E5C76]">
                    Create a live notification whenever a candidate submits a new application.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={
                    Boolean(settings.find((s) => s.key === 'notify_on_new_applications')?.value)
                  }
                  onChange={() => handleToggle('notify_on_new_applications')}
                  className="w-5 h-5 rounded text-[#1D2D44] focus:ring-[#1D2D44] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF]">
                <div>
                  <div className="font-bold text-[#0D1321]">Notify on Sensitive Moderation Actions</div>
                  <div className="text-[11px] text-[#3E5C76]">
                    Alert authorities on account suspensions, user deletions, or permission grants.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={
                    Boolean(settings.find((s) => s.key === 'notify_on_sensitive_actions')?.value)
                  }
                  onChange={() => handleToggle('notify_on_sensitive_actions')}
                  className="w-5 h-5 rounded text-[#1D2D44] focus:ring-[#1D2D44] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#1D2D44] text-[#F0EBD8] font-bold text-xs hover:bg-[#0D1321] shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Platform Configuration
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
