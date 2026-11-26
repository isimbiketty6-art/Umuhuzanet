import { useState } from 'react';
import { Section, UserRole } from '../types';
import { AuthUser } from '../utils/authStorage';
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
  Settings,
  CheckCircle2,
  UserPlus,
  RefreshCw
} from 'lucide-react';

export function Navigation({
  section,
  setSection,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenMobileNav,
  onOpenCart,
  cartCount = 0,
  lang = 'en',
  setLang,
  notify,
  onOpenAccountInfo
}: {
  section: Section;
  setSection: (s: Section) => void;
  role?: UserRole;
  setRole?: (r: UserRole) => void;
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
}) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const isAdmin = currentUser?.role === 'Administrator';

  // Quick navigation pills
  const quickPills: { label: Section; name: string; icon: any; sub: string }[] = [
    { label: 'Career & jobs', name: 'Jobs', icon: Briefcase, sub: 'Find opportunities' },
    { label: 'Marketplace', name: 'Marketplace', icon: Store, sub: 'Buy & Sell' },
    { label: 'Learning', name: 'Learning', icon: GraduationCap, sub: 'Rwanda Skills' },
    { label: 'Network', name: 'Community', icon: Users, sub: 'Connect' },
    { label: 'Income OS', name: 'Business', icon: TrendingUp, sub: 'Grow' }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#19414D] bg-[#04131B]/95 backdrop-blur-xl">
      {/* TOP SLOGAN & BRAND BANNER */}
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

      {/* MAIN NAVIGATION BAR */}
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

        {/* RIGHT CORNER: ONLY THE TWO ACCOUNT & SETTINGS CONTROLS */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Cart Button (always accessible for real-time cart & order tracking) */}
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="relative flex items-center justify-center h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10 hover:text-white transition shadow-sm"
              title="Real-Time Shopping Cart & Orders"
            >
              <ShoppingCart size={16} className="text-emerald-400" />
              <span
                className={`absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full text-[9px] font-bold font-mono shadow-sm ${
                  cartCount > 0 ? 'bg-emerald-500 text-black' : 'bg-white/15 text-slate-200'
                }`}
              >
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

          {/* CORNER CONTROL 1: AUTHENTICATED ACCOUNT & SESSION SWITCHER */}
          <div className="relative">
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#071F2B] hover:bg-[#0b2836] pl-2 pr-3 py-1.5 text-xs text-white transition shadow-sm group"
              title="Account & Authentication"
            >
              <div className="relative">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-[#04131B] flex items-center justify-center font-black text-xs shadow-sm">
                  {currentUser ? currentUser.name.charAt(0) : <LogIn size={15} />}
                </div>
                {currentUser && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#071F2B]" />
                )}
              </div>

              <div className="text-left hidden sm:block">
                <div className="font-bold text-white text-xs leading-tight truncate max-w-[110px]">
                  {currentUser ? currentUser.name : 'Sign In'}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono leading-none flex items-center gap-1 mt-0.5">
                  {currentUser ? (
                    <>
                      <CheckCircle2 size={10} />
                      <span>{currentUser.role}</span>
                    </>
                  ) : (
                    <span className="text-slate-400">Account Access</span>
                  )}
                </div>
              </div>

              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform ${
                  accountMenuOpen ? 'rotate-180 text-emerald-400' : ''
                }`}
              />
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#092532] p-3 shadow-2xl text-xs z-50 animate-in fade-in duration-150">
                {currentUser ? (
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                          Active Session
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                          NIDA Verified
                        </span>
                      </div>
                      <div className="font-bold text-white text-sm mt-1">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-2">
                        <span>NID: {currentUser.nationalId}</span>
                        <span>•</span>
                        <span>{currentUser.district}</span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-white/10 flex gap-2">
                        {isAdmin ? (
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
                            <span>My Dashboard</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          onOpenAuth('signin');
                          setAccountMenuOpen(false);
                        }}
                        className="flex-1 py-2 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw size={13} className="text-emerald-400" />
                        <span>Switch Account</span>
                      </button>

                      <button
                        onClick={() => {
                          onLogout();
                          setAccountMenuOpen(false);
                        }}
                        className="py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition flex items-center gap-1"
                        title="Sign Out"
                      >
                        <LogOut size={13} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 leading-relaxed">
                      Sign in with your verified Rwandan account or register to access your personal workspace.
                    </div>
                    <button
                      onClick={() => {
                        onOpenAuth('signin');
                        setAccountMenuOpen(false);
                      }}
                      className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#04131B] font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <LogIn size={14} />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenAuth('signup');
                        setAccountMenuOpen(false);
                      }}
                      className="w-full py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <UserPlus size={14} className="text-emerald-400" />
                      <span>Create Verified Account</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CORNER CONTROL 2: SETTINGS & ACCOUNT INFO LINK */}
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuth('signin');
                return;
              }
              if (onOpenAccountInfo) {
                onOpenAccountInfo();
              } else {
                setSection('Settings');
              }
            }}
            className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-[#071F2B] hover:bg-[#0b2836] px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white transition shadow-sm group"
            title="Account Information, Identity Verification & Security Settings"
          >
            <Settings
              size={15}
              className="text-emerald-400 group-hover:rotate-45 transition-transform duration-300"
            />
            <span className="hidden sm:inline">Settings & Info</span>
          </button>
        </div>
      </div>
    </header>
  );
}
