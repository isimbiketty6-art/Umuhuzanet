import { useState } from 'react';
import { UserRole } from '../types';
import { Settings, User, Bell, Shield, Smartphone, Check, Save } from 'lucide-react';

export function SettingsView({
  currentRole,
  onRoleChange,
  notify
}: {
  currentRole: UserRole;
  onRoleChange: (r: UserRole) => void;
  notify: (msg: string) => void;
}) {
  const [name, setName] = useState('Jean-Luc Mugisha');
  const [phone, setPhone] = useState('+250 788 123 456');
  const [location, setLocation] = useState('Kigali (Gasabo District), Rwanda');
  const [skills, setSkills] = useState('React, TypeScript, Tailwind CSS, API Integration, PWA');
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsSms, setNotificationsSms] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    notify('Profile settings updated successfully');
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
            Control how Rwandan employers and buyers discover your talent and services.
          </p>
        </div>
      </div>

      {/* Role Switcher Section */}
      <div className="rounded-2xl border border-white/[0.08] bg-panel/75 p-6">
        <h2 className="text-sm font-semibold text-white mb-2">Simulated Workspace Role</h2>
        <p className="text-xs text-slate-400 mb-4">
          Switch roles to experience Umuhuza Connect from different Rwandan stakeholder perspectives:
        </p>

        <div className="grid gap-3 sm:grid-cols-4">
          {(['Job seeker', 'Employer', 'Seller', 'Administrator'] as UserRole[]).map((r) => {
            const isCurrent = currentRole === r;
            return (
              <button
                key={r}
                onClick={() => {
                  onRoleChange(r);
                  notify(`Workspace role switched to ${r}`);
                }}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                  isCurrent
                    ? 'border-mint bg-mint/10 text-white'
                    : 'border-white/[0.07] bg-panel hover:bg-white/[0.03] text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{r}</span>
                    {isCurrent && <Check size={14} className="text-mint" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {r === 'Job seeker' && 'Browse jobs & submit CVs'}
                    {r === 'Employer' && 'Publish vacancies & review candidates'}
                    {r === 'Seller' && 'List Made in Rwanda goods & receive inquiries'}
                    {r === 'Administrator' && 'Company verification & moderation'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="rounded-2xl border border-white/[0.08] bg-panel/75 p-6 space-y-4 text-xs text-slate-300">
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <User size={15} className="text-mint" />
          <span>Talent & Contact Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Rwandan Phone (MTN / Airtel)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-mint/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">District & Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Core Competencies / Tags</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
            />
          </div>
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
              <div className="text-[11px] text-slate-400">Receive instant notifications when 85%+ matched roles are posted</div>
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
              <div className="text-[11px] text-slate-400">Get text verification upon client settlement of RWF invoices</div>
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
            className="flex items-center gap-2 rounded-xl bg-mint px-5 py-2.5 text-xs font-bold text-[#07211e] hover:bg-emerald-300 transition"
          >
            <Save size={14} /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
