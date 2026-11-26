import { useState, useEffect } from 'react';
import { Settings, User, Bell, ShieldCheck, Save, CheckCircle2 } from 'lucide-react';
import { AuthUser, authStorage } from '../utils/authStorage';

export function SettingsView({
  currentUser,
  onProfileUpdated,
  notify
}: {
  currentUser: AuthUser | null;
  onProfileUpdated: (user: AuthUser) => void;
  notify: (msg: string) => void;
}) {
  const [name, setName] = useState(currentUser?.name || '');
  const [district, setDistrict] = useState(currentUser?.district || 'Gasabo (Kigali)');
  const [skills, setSkills] = useState(
    currentUser?.skills || 'React, TypeScript, Tailwind CSS, API Integration'
  );
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsSms, setNotificationsSms] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setDistrict(currentUser.district);
      setSkills(currentUser.skills || 'React, TypeScript, Tailwind CSS, API Integration');
    }
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      notify('Please sign in first to save profile changes.');
      return;
    }
    setSaving(true);
    const res = await authStorage.updateProfile({
      name: name.trim(),
      district: district.trim(),
      skills: skills.trim()
    });
    setSaving(false);

    if (!res.success || !res.user) {
      notify(res.message);
      return;
    }
    onProfileUpdated(res.user);
    notify(res.message);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/[0.08] bg-panel/75 p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-mint mb-1">
            <Settings size={14} />
            <span>Workspace & Identity Preferences</span>
          </div>
          <h1 className="text-lg font-bold text-white">Profile, Verification & Notifications</h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Manage your verified Rwandan account details and notification triggers.
          </p>
        </div>

        {currentUser && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <div>
              <div className="font-bold text-white">{currentUser.role}</div>
              <div className="text-[10px] text-emerald-300 font-mono">NIDA Verified Account</div>
            </div>
          </div>
        )}
      </div>

      {/* Verified Identity Summary (Read-only security attributes) */}
      {currentUser && (
        <div className="rounded-2xl border border-white/[0.08] bg-panel/75 p-6">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <ShieldCheck size={15} className="text-mint" />
            <span>Verified Account Credentials</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-white/[0.06] bg-[#0c1524]">
              <div className="text-[10px] text-slate-400">National ID (NIDA)</div>
              <div className="font-mono font-bold text-white mt-0.5">{currentUser.nationalId}</div>
            </div>
            <div className="p-3 rounded-xl border border-white/[0.06] bg-[#0c1524]">
              <div className="text-[10px] text-slate-400">Verified Phone</div>
              <div className="font-mono font-bold text-emerald-400 mt-0.5">{currentUser.phone}</div>
            </div>
            <div className="p-3 rounded-xl border border-white/[0.06] bg-[#0c1524]">
              <div className="text-[10px] text-slate-400">Verified Email</div>
              <div className="font-bold text-white mt-0.5 truncate">{currentUser.email}</div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-2xl border border-white/[0.08] bg-panel/75 p-6 space-y-4 text-xs text-slate-300"
      >
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <User size={15} className="text-mint" />
          <span>Talent & Contact Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">District & Location</label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-300 mb-1">
            Core Competencies / Tags
          </label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
          />
        </div>

        {/* Notification preferences */}
        <div className="pt-4 border-t border-white/[0.06] space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <Bell size={14} className="text-mint" />
            <span>Notification Triggers</span>
          </h3>

          <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-[#0c1524]">
            <div>
              <div className="font-semibold text-white">Email alerts for matched jobs in Rwanda</div>
              <div className="text-[11px] text-slate-400">
                Receive instant notifications when 85%+ matched roles are posted
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationsEmail}
              onChange={(e) => setNotificationsEmail(e.target.checked)}
              className="h-4 w-4 accent-[#39d6b0] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-[#0c1524]">
            <div>
              <div className="font-semibold text-white">SMS updates for Mobile Money receipts</div>
              <div className="text-[11px] text-slate-400">
                Get text verification upon client settlement of RWF invoices
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationsSms}
              onChange={(e) => setNotificationsSms(e.target.checked)}
              className="h-4 w-4 accent-[#39d6b0] cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-mint px-5 py-2.5 text-xs font-bold text-[#07211e] hover:bg-emerald-300 transition disabled:opacity-50"
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
}
