import { useState } from 'react';
import { Section, UserRole } from '../types';
import { AuthUser, PRESET_CREDENTIALS, CredentialPreset } from '../utils/authStorage';
import { Language } from '../types/agri';
import {
  Menu,
  ChevronDown,
  LogOut,
  LogIn,
  ShoppingCart,
  Crown,
  LayoutDashboard,
  Sprout,
  Store,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Users,
  ShieldCheck,
  Settings,
  CheckCircle2,
  RefreshCw,
  UserCheck
} from 'lucide-react';

export function Navigation({
  section,
  setSection,
  role,
  setRole,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenMobileNav,
  onOpenCart,
  cartCount = 0,
  lang = 'en',
  setLang,
  unreadMessagesCount = 2,
  notify,
  onOpenAccountInfo,
  onSwitchUser
}: {
  section: Section;
  setSection: (s: Section) => void;
  role: UserRole;
  setRole: (r: UserRole) => void;
  currentUser: AuthUser | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onLogout: () => void;
  onOpenMobileNav: () => void;
  onOpenCart?: () => void;
  cartCount?: number;
  lang?: Language;
  setLang?: (l: Language) => void;
  unreadMessagesCount?: number;
  notify: (msg: string) => void;
  onOpenAccountInfo?: () => void;
  onSwitchUser?: (preset: CredentialPreset) => void;
}) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  // Quick navigation pills (from new.png & home.png)
  const quickPills: { label: Section; name: string; icon: any; sub: string }[] = [
    { label: 'Career & jobs', name: 'Jobs', icon: Briefcase, sub: 'Find opportunities' },
    { label: 'Marketplace', name: 'Marketplace', icon: Store, sub: 'Buy & Sell' },
    { label: 'Learning', name: 'Learning', icon: GraduationCap, sub: 'Rwanda Skills' },
    { label: 'Network', name: 'Community', icon: Users, sub: 'Connect' },
    { label: 'Income OS', name: 'Business', icon: TrendingUp, sub: 'Grow' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#19414D] bg-[#04131B]/95 backdrop-blur-xl">
      {/* ======================================================== */}
      {/* TOP SLOGAN & BRAND BANNER (from new.png)                 */}
      {/* ======================================================== */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1.5 border-b border-white/[0.05] bg-[#031720] text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-white tracking-tight">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400">UMUHUZA CONNECT</span>
            <span className="text-slate-400">— Connecting People • Creating Opportunities • Building Rwanda</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span className="italic text-emerald-300 font-serif">“A Human OS for a Better Tomorrow”</span>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
            <span>🇷🇼</span>
            <span>Rwanda Digital First</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN NAVIGATION BAR                                      */}
      {/* ======================================================== */}
      <div className="flex h-[68px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand & Mobile Menu */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            aria-label="Open all features sidebar"
            onClick={onOpenMobileNav}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/[0.08] hover:text-white transition shadow-sm"
            title="Open features drawer"
          >
            <Menu size={16} className="text-emerald-400" />
            <span className="font-semibold text-white hidden sm:inline">Menu</span>
          </button>

          <button
            onClick={() => setSection('Home' as Section)}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group text-left"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-[#04131B] shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sprout size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white leading-tight">
                umuhuza<span className="text-emerald-400">connect</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400 font-medium tracking-wider uppercase hidden sm:block">
                Human OS • Rwanda
              </div>
            </div>
          </button>
        </div>

        {/* Quick Navigation Category Pills */}
        <nav className="hidden xl:flex items-center gap-2 text-xs font-medium">
          {quickPills.map((pill) => {
            const Icon = pill.icon;
            const isActive = section === pill.label;
            return (
              <button
                key={pill.label}
                onClick={() => setSection(pill.label)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition group ${
                  isActive
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300 font-bold shadow-sm'
                    : 'border-transparent text-slate-300 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <div
                  className={`h-6 w-6 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-emerald-500 text-[#04131B]' : 'bg-white/[0.05] text-emerald-400'
                  }`}
                >
                  <Icon size={13} />
                </div>
                <div className="text-left">
                  <div className="leading-tight">{pill.name}</div>
                  <div className="text-[9px] text-slate-400 font-normal leading-none group-hover:text-slate-300">
                    {pill.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* ======================================================== */}
        {/* RIGHT CORNER: ONLY THE TWO SWITCHED ACCOUNT & SETTINGS LINKS */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Cart Button (when items present) */}
          {onOpenCart && cartCount > 0 && (
            <button
              onClick={onOpenCart}
              className="relative flex items-center justify-center h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10 hover:text-white transition shadow-sm"
              title="Shopping Cart"
            >
              <ShoppingCart size={16} className="text-emerald-400" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-black font-mono shadow-sm">
                {cartCount}
              </span>
            </button>
          )}

          {/* Language Toggle: EN / RW */}
          {setLang && (
            <button
              onClick={() => {
                const nextLang = lang === 'en' ? 'rw' : 'en';
                setLang(nextLang);
                notify(nextLang === 'rw' ? 'Ikinyarwanda cyakoreshejwe' : 'Language switched to English');
              }}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-mono font-bold text-slate-300 hover:bg-white/10 transition"
              title="Toggle English / Ikinyarwanda"
            >
              <span className="text-sm">🇷🇼</span>
              <span>{lang.toUpperCase()}</span>
            </button>
          )}

          {/* ---------------------------------------------------- */}
          {/* CORNER CONTROL 1: SWITCHED ACCOUNT LINK & DROPDOWN   */}
          {/* ---------------------------------------------------- */}
          <div className="relative">
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#071F2B] hover:bg-[#0b2836] pl-2 pr-3 py-1.5 text-xs text-white transition shadow-sm group"
              title="Switched Account & Profiles"
            >
              <div className="relative">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-[#04131B] flex items-center justify-center font-black text-xs shadow-sm">
                  {currentUser ? currentUser.name.charAt(0) : 'U'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#071F2B]" />
              </div>

              <div className="text-left hidden sm:block">
                <div className="font-bold text-white text-xs leading-tight truncate max-w-[110px]">
                  {currentUser ? currentUser.name : 'Sign In'}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono leading-none flex items-center gap-1 mt-0.5">
                  <CheckCircle2 size={10} />
                  <span>{currentUser ? currentUser.role : 'Guest'}</span>
                </div>
              </div>

              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform ${accountMenuOpen ? 'rotate-180 text-emerald-400' : ''}`}
              />
            </button>

            {/* Switched Account Dropdown Menu */}
            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-white/10 bg-[#092532] p-3 shadow-2xl text-xs z-50 animate-in fade-in duration-150">
                {/* Active Account Identity Card */}
                {currentUser ? (
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                        Current Active Session
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        NIDA Verified
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm mt-1">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-2">
                      <span>NID: {currentUser.nationalId || '1199880012345678'}</span>
                      <span>•</span>
                      <span>{currentUser.district}</span>
                    </div>

                    {/* Role Direct Dashboard Button */}
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex gap-2">
                      {currentUser.role === 'Administrator' ? (
                        <button
                          onClick={() => {
                            setSection('Admin Center');
                            setAccountMenuOpen(false);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <Crown size={13} />
                          <span>Admin Control Center</span>
                        </button>
                      ) : currentUser.role === 'Seller' ? (
                        <button
                          onClick={() => {
                            setSection('Marketplace');
                            setAccountMenuOpen(false);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <Store size={13} />
                          <span>Seller Harvest Store</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSection('Overview');
                            setAccountMenuOpen(false);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <LayoutDashboard size={13} />
                          <span>User Dashboard</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 text-center text-slate-400 mb-2">
                    Not signed in. Choose a verified Rwandan account below to switch:
                  </div>
                )}

                {/* Switch to Other Verified Rwandan Accounts */}
                <div className="mb-2">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1 mb-1.5 flex items-center gap-1">
                    <UserCheck size={12} className="text-emerald-400" />
                    <span>Switch to Another Account:</span>
                  </div>

                  <div className="space-y-1">
                    {PRESET_CREDENTIALS.map((preset) => {
                      const isCurrent = currentUser?.email === preset.email;
                      return (
                        <button
                          key={preset.email}
                          onClick={() => {
                            if (onSwitchUser) {
                              onSwitchUser(preset);
                            } else {
                              setRole(preset.role);
                              notify(`Switched to account: ${preset.name} (${preset.role})`);
                            }
                            setAccountMenuOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl transition flex items-center justify-between group ${
                            isCurrent
                              ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold'
                              : 'hover:bg-white/5 border border-transparent text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-white/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                              {preset.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-xs leading-tight text-white">
                                {preset.name}
                              </div>
                              <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                                {preset.role} • {preset.phone}
                              </div>
                            </div>
                          </div>
                          {isCurrent ? (
                            <span className="text-[10px] text-emerald-400 font-mono">Active</span>
                          ) : (
                            <span className="text-[10px] text-slate-400 group-hover:text-emerald-300">
                              Switch
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      onOpenAuth('signin');
                      setAccountMenuOpen(false);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium text-center transition flex items-center justify-center gap-1.5"
                  >
                    <LogIn size={13} className="text-emerald-400" />
                    <span>+ Log in with ID</span>
                  </button>

                  {currentUser && (
                    <button
                      onClick={() => {
                        onLogout();
                        setAccountMenuOpen(false);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition flex items-center gap-1"
                      title="Sign Out"
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------- */}
          {/* CORNER CONTROL 2: SETTINGS & ACCOUNT INFO LINK       */}
          {/* ---------------------------------------------------- */}
          <button
            onClick={() => {
              if (onOpenAccountInfo) {
                onOpenAccountInfo();
              } else {
                setSection('Settings');
              }
            }}
            className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-[#071F2B] hover:bg-[#0b2836] px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white transition shadow-sm group"
            title="Account Information, Identity Verification & Security Settings"
          >
            <Settings size={15} className="text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
            <span className="hidden sm:inline">Settings & Info</span>
          </button>
        </div>
      </div>
    </header>
  );
}
