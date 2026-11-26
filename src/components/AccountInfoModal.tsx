import { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  KeyRound,
  User,
  RefreshCw,
  LogOut,
  Smartphone,
  MapPin,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { AuthUser, authStorage, UserSession, checkPasswordStrength } from '../utils/authStorage';

export function AccountInfoModal({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  notify
}: {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  notify: (msg: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'info' | 'session' | 'authorization'>('info');
  const [session, setSession] = useState<UserSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMessage, setPwMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSession(authStorage.getActiveSession());
      setPwMessage(null);
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

  const isAdmin = currentUser?.role === 'Administrator';
  const isSellerOrEmployer = currentUser?.role === 'Seller' || currentUser?.role === 'Employer';

  const handleRenewSession = async () => {
    const refreshed = await authStorage.refreshSession();
    if (refreshed) {
      setSession({ ...refreshed });
      notify('Session renewed! Token extended for an additional 24 hours.');
    } else {
      notify('Session expired. Please sign in again.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage(null);
    const strength = checkPasswordStrength(newPassword);
    if (!strength.valid) {
      setPwMessage({ type: 'err', text: `Missing: ${strength.missing.join(', ')}` });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMessage({ type: 'err', text: 'New passwords do not match.' });
      return;
    }
    setPwLoading(true);
    const res = await authStorage.changePassword(currentPassword, newPassword);
    setPwLoading(false);
    if (!res.success) {
      setPwMessage({ type: 'err', text: res.message });
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPwMessage({ type: 'ok', text: res.message });
    notify(res.message);
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
                Rwanda National ID Verification • Server Session • Role Permissions
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
            <span>Session & Password</span>
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
            <span>Account Permissions</span>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                        <ShieldCheck size={13} className="text-emerald-400" />
                        <span>Rwanda National ID (NIDA)</span>
                      </div>
                      <div className="font-mono font-bold text-white text-sm tracking-wider">
                        {currentUser.nationalId}
                      </div>
                      <div className="text-[10px] text-emerald-400/90 mt-1">
                        ✓ Verified against NIDA format standard
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
                        ✓ Verified Rwandan mobile line
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                        <MapPin size={13} className="text-emerald-400" />
                        <span>Administrative District</span>
                      </div>
                      <div className="font-bold text-white text-sm">
                        {currentUser.district}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">Republic of Rwanda</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                        <User size={13} className="text-emerald-400" />
                        <span>Authorized Role</span>
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

          {/* TAB 2: SESSION & PASSWORD */}
          {activeTab === 'session' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">Active Server Session</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    24-Hour TTL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                    <div className="text-[10px] text-slate-400">Session Remaining</div>
                    <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                      {timeRemaining || 'Active'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                    <div className="text-[10px] text-slate-400">Session Storage</div>
                    <div className="font-mono font-bold text-white text-xs mt-0.5">
                      Signed In-Memory Bearer
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/20 border border-white/5">
                    <div className="text-[10px] text-slate-400">Origin IP</div>
                    <div className="font-mono font-bold text-slate-300 text-xs mt-0.5 truncate">
                      {session?.sessionIp || 'Kigali (RW)'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleRenewSession}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition shadow-sm"
                  >
                    <RefreshCw size={14} />
                    <span>Renew Session (+24h)</span>
                  </button>

                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold border border-red-500/30 transition shadow-sm"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {!isAdmin && currentUser && (
                <form
                  onSubmit={handleChangePassword}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3"
                >
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Lock size={14} className="text-emerald-400" />
                    <span>Update Account Password</span>
                  </div>

                  {pwMessage && (
                    <div
                      className={`p-2.5 rounded-xl text-xs border ${
                        pwMessage.type === 'ok'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-red-500/10 border-red-500/30 text-red-300'
                      }`}
                    >
                      {pwMessage.text}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <input
                      type="password"
                      required
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="rounded-xl border border-white/10 bg-[#041119] px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                    />
                    <input
                      type="password"
                      required
                      placeholder="New strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="rounded-xl border border-white/10 bg-[#041119] px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                    />
                    <input
                      type="password"
                      required
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-xl border border-white/10 bg-[#041119] px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#04131B] font-bold text-xs transition disabled:opacity-50"
                  >
                    {pwLoading ? 'Updating...' : 'Save New Password'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT PERMISSIONS (Strictly Scoped to User Role) */}
          {activeTab === 'authorization' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white">Authorized Workspace Scope</h3>
                    <p className="text-[11px] text-slate-400">
                      Features enabled for your verified account role.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    {currentUser?.role || 'Guest'}
                  </span>
                </div>

                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <div className="font-semibold text-white">Personal Human OS Workspace</div>
                      <div className="text-[10px] text-slate-400">
                        Apply for vacancies, track skills courses, manage messages & invoices
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                      Authorized
                    </span>
                  </div>

                  {isSellerOrEmployer && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <div>
                        <div className="font-semibold text-white">
                          {currentUser?.role === 'Seller'
                            ? 'Harvest & Artisan Seller Store'
                            : 'Employer Vacancy Publishing'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {currentUser?.role === 'Seller'
                            ? 'List agricultural produce, manage stock & receive MoMo orders'
                            : 'Publish Kigali vacancies & review candidate pipeline'}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                        Authorized
                      </span>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <div>
                        <div className="font-semibold text-white">Executive Admin Center</div>
                        <div className="text-[10px] text-slate-400">
                          ShopPoint management, national transactions, platform audits
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold text-[10px] border border-purple-500/30">
                        Admin Clearance
                      </span>
                    </div>
                  )}
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
