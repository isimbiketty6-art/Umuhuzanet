import { useState } from 'react';
import {
  X,
  KeyRound,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  Briefcase,
  Building2,
  Sprout,
  TrendingUp,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { PRESET_CREDENTIALS, CredentialPreset, authStorage } from '../utils/authStorage';
import { AuthUser } from '../utils/authStorage';
import { PortalView } from '../types/agri';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onSelectAndLogin: (user: AuthUser, targetPortal: PortalView) => void;
  notify: (msg: string) => void;
}

export function DashboardCredentialsModal({
  isOpen,
  onClose,
  currentUser,
  onSelectAndLogin,
  notify
}: {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onSelectAndLogin: (user: AuthUser, targetPortal: PortalView) => void;
  notify: (msg: string) => void;
}) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    notify(`Copied ${label} to clipboard`);
    setTimeout(() => {
      setCopiedField((curr) => (curr === label ? null : curr));
    }, 2000);
  };

  const handleDirectAccess = (preset: CredentialPreset) => {
    const res = authStorage.verifyCredentials(preset.email, preset.password);
    if (res.success && res.user) {
      onSelectAndLogin(res.user, preset.targetPortal as PortalView);
      notify(`Logged in as ${res.user.name} (${preset.dashboardLabel})`);
      onClose();
    } else {
      notify(res.message || 'Authentication error');
    }
  };

  const getRoleIcon = (role: string, targetPortal: string) => {
    if (targetPortal === 'admin') return <ShieldAlert className="text-amber-400" size={20} />;
    if (targetPortal === 'seller') return <Sprout className="text-emerald-400" size={20} />;
    if (targetPortal === 'trader') return <TrendingUp className="text-teal-400" size={20} />;
    if (role === 'Employer') return <Building2 className="text-cyan-400" size={20} />;
    return <Briefcase className="text-mint" size={20} />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0a1322] shadow-2xl text-white relative max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between bg-gradient-to-r from-[#0d1b2e] to-[#0a1322]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-xl bg-mint/15 px-3 py-1 text-xs font-bold text-mint">
              <KeyRound size={14} />
              <span>Verified Rwanda Credentials Directory</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Access Any Dashboard with Real Credentials
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Each role grants specific authenticated permissions across Umuhuza Connect. You can sign in directly, copy real credentials, or use them in the login form.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Active Session Callout */}
        {currentUser && (
          <div className="px-6 py-2.5 bg-mint/10 border-b border-mint/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-mint animate-pulse" />
              <span className="text-slate-300">Currently active session:</span>
              <span className="font-bold text-white">{currentUser.name}</span>
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-mint font-semibold uppercase">
                {currentUser.role}
              </span>
            </div>
            <span className="text-[11px] text-mint font-mono">{currentUser.phone}</span>
          </div>
        )}

        {/* Directory List */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_CREDENTIALS.map((preset, index) => {
              const isCurrent = currentUser?.email.toLowerCase() === preset.email.toLowerCase();

              return (
                <div
                  key={index}
                  className={`rounded-2xl border p-4.5 transition relative flex flex-col justify-between ${
                    isCurrent
                      ? 'border-mint/50 bg-mint/[0.04] ring-1 ring-mint/30 shadow-lg shadow-mint/10'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Top Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          {getRoleIcon(preset.role, preset.targetPortal)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-1.5">
                            {preset.dashboardLabel}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {preset.name} · <span className="text-slate-300">{preset.role}</span>
                          </div>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="rounded-full bg-mint text-[#07211e] px-2 py-0.5 text-[10px] font-bold">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300/90 mb-3.5 leading-relaxed">
                      {preset.description}
                    </p>

                    {/* Credentials Box */}
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-2 mb-4 font-mono text-[11px]">
                      {/* Email / Identifier */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-slate-300">
                          <span className="text-slate-500 mr-1.5 font-sans">Email:</span>
                          <span className="text-emerald-300">{preset.email}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(preset.email, `${preset.name} email`)}
                          className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 transition shrink-0"
                          title="Copy Email"
                        >
                          {copiedField === `${preset.name} email` ? (
                            <Check size={13} className="text-mint" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-slate-300">
                          <span className="text-slate-500 mr-1.5 font-sans">Phone:</span>
                          <span>{preset.phone}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(preset.phone, `${preset.name} phone`)}
                          className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 transition shrink-0"
                          title="Copy Phone"
                        >
                          {copiedField === `${preset.name} phone` ? (
                            <Check size={13} className="text-mint" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>

                      {/* Password */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-slate-300">
                          <span className="text-slate-500 mr-1.5 font-sans">Pass:</span>
                          <span className="text-amber-300 font-semibold">{preset.password}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(preset.password, `${preset.name} password`)}
                          className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 transition shrink-0"
                          title="Copy Password"
                        >
                          {copiedField === `${preset.name} password` ? (
                            <Check size={13} className="text-mint" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Direct Action Button */}
                  <button
                    type="button"
                    onClick={() => handleDirectAccess(preset)}
                    className="w-full rounded-xl bg-white/10 hover:bg-mint hover:text-[#07211e] py-2.5 px-3 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 group"
                  >
                    <span>Launch & Sign in to Dashboard</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-[#08101d] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-mint" />
            <span>All accounts are pre-verified with Rwanda National ID (NIDA) & MTN MoMo status.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
}
