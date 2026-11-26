import { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  KeyRound,
  User,
  Clock,
  RefreshCw,
  LogOut,
  Smartphone,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Lock,
  ChevronRight
} from 'lucide-react';
import { AuthUser, authStorage, UserSession } from '../utils/authStorage';
import { UserRole } from '../types';

export function AccountInfoModal({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onSwitchAccount,
  notify
}: {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  onSwitchAccount: (role: UserRole) => void;
  notify: (msg: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'info' | 'session' | 'authorization'>('info');
  const [session, setSession] = useState<UserSession | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const active = authStorage.getActiveSession();
      setSession(active);
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (!session) return;
    const updateCountdown = () => {
      const diff = session.expiresAt - Date.now();
      if (diff <= 0) {
        setTimeRemaining('Expired');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [session]);

  if (!isOpen) return null;

  const handleCopyToken = () => {
    if (session?.token) {
      navigator.clipboard.writeText(session.token);
      setCopiedToken(true);
      notify('Session token copied to clipboard');
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleRenewSession = () => {
    const refreshed = authStorage.refreshSession();
    if (refreshed) {
      setSession({ ...refreshed });
      notify('Session renewed! Token extended for an additional 24 hours.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#071722] text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#041119]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-[#04131B] flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Account Information & Security</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono">
                  Verified Session
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Rwanda National ID Verification • Active Token Session • RBAC Access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close settings"
            className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-[#071722] px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'info'
                ? 'border-emerald-400 text-emerald-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User size={14} />
            <span>Profile & Identity</span>
          </button>

          <button
            onClick={() => setActiveTab('session')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'session'
                ? 'border-emerald-400 text-emerald-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound size={14} />
            <span>Active Session & Token</span>
          </button>

          <button
            onClick={() => setActiveTab('authorization')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'authorization'
                ? 'border-emerald-400 text-emerald-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Role Authorization (RBAC)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: PROFILE & IDENTITY */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-[#04131B] flex items-center justify-center text-xl font-black">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white">{currentUser.name}</span>
                        <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                          <CheckCircle2 size={12} />
                          NIDA Verified
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{currentUser.email}</div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                        <span className="font-mono text-emerald-400">{currentUser.phone}</span>
                        <span>•</span>
                        <span className="text-slate-300">{currentUser.district}</span>
                      </div>
                    </div>
                  </div>

                  {/* Identity Data Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                        <ShieldCheck size={13} className="text-emerald-400" />
                        <span>Rwanda National ID (NIDA)</span>
                      </div>
                      <div className="font-mono font-bold text-white text-sm tracking-wider">
                        {currentUser.nationalId || '1199880012345678'}
                      </div>
                      <div className="text-[10px] text-emerald-400/90 mt-1">
                        ✓ Verified with National Identification Agency (NIDA)
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                        <Smartphone size={13} className="text-emerald-400" />
                        <span>Mobile MoMo Status</span>
                      </div>
                      <div className="font-mono font-bold text-white text-sm">
                        {currentUser.phone}
                      </div>
                      <div className="text-[10px] text-emerald-400/90 mt-1">
                        ✓ Linked to MTN/Airtel MoMo Escrow Account
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                        <MapPin size={13} className="text-emerald-400" />
                        <span>Administrative District</span>
                      </div>
                      <div className="font-bold text-white text-sm">
                        {currentUser.district || 'Gasabo (Kigali Province)'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Republic of Rwanda</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                        <User size={13} className="text-emerald-400" />
                        <span>Platform Role</span>
                      </div>
                      <div className="font-bold text-emerald-300 text-sm">
                        {currentUser.role}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Member since {currentUser.joinedDate || '2026'}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No active authenticated user. Please sign in to view identity details.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE SESSION & TOKEN */}
          {activeTab === 'session' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">Active Cryptographic Session</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    24-Hour TTL
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-slate-400">Bearer Session Token</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={session?.token || 'umz_sess_anon_guest_expired'}
                      className="w-full rounded-xl border border-white/10 bg-[#041119] px-3 py-2 text-xs font-mono text-emerald-300 select-all"
                    />
                    <button
                      onClick={handleCopyToken}
                      className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white font-medium flex items-center gap-1.5 transition"
                      title="Copy token"
                    >
                      {copiedToken ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span className="hidden sm:inline">{copiedToken ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                    <div className="text-[10px] text-slate-400">Session Remaining</div>
                    <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                      {timeRemaining || 'Active'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                    <div className="text-[10px] text-slate-400">Node Location</div>
                    <div className="font-mono font-bold text-white text-xs mt-0.5">
                      {session?.sessionIp || 'Kigali (RW)'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                    <div className="text-[10px] text-slate-400">Session Device</div>
                    <div className="font-mono font-bold text-slate-300 text-xs mt-0.5 truncate">
                      {session?.deviceId || 'Web Client'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleRenewSession}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition shadow-sm"
                >
                  <RefreshCw size={14} />
                  <span>Renew Active Session (+24h)</span>
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold border border-red-500/30 transition shadow-sm"
                >
                  <LogOut size={14} />
                  <span>Terminate Session (Logout)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ROLE AUTHORIZATION (RBAC) */}
          {activeTab === 'authorization' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white">Role-Based Access Control (RBAC)</h3>
                    <p className="text-[11px] text-slate-400">
                      Security policies governing portal features based on verified credentials.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    {currentUser?.role || 'Guest'}
                  </span>
                </div>

                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <div className="font-semibold text-white">Executive Admin Center</div>
                      <div className="text-[10px] text-slate-400">
                        ShopPoint management, national transactions, platform audits
                      </div>
                    </div>
                    {currentUser?.role === 'Administrator' ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                        Granted
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 font-bold text-[10px] border border-red-500/30">
                        Restricted (Admin Only)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <div className="font-semibold text-white">Harvest & Artisan Marketplace Seller</div>
                      <div className="text-[10px] text-slate-400">
                        List agricultural produce, manage inventory, receive MoMo payments
                      </div>
                    </div>
                    {['Seller', 'Administrator'].includes(currentUser?.role || '') ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                        Granted
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                        Requires Seller Account
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <div className="font-semibold text-white">Talent & Job Seeker Hub</div>
                      <div className="text-[10px] text-slate-400">
                        Apply for Kigali & nationwide vacancies, build skills profile, generate invoices
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                      Granted
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Role Switcher shortcut */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Switch Current Role Perspective:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {(['Job seeker', 'Seller', 'Administrator', 'Employer'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onSwitchAccount(r);
                        onClose();
                      }}
                      className={`py-2 px-3 rounded-xl border text-center transition font-semibold ${
                        currentUser?.role === r
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Close */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#041119] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
