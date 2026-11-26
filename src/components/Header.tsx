import { useState } from 'react';
import { Language, PortalView } from '../types/agri';
import { translations } from '../data/translations';
import {
  Sprout,
  ShoppingBag,
  ShoppingCart,
  User,
  Briefcase,
  Layers,
  Bot,
  Globe,
  Store,
  ShieldCheck,
  TrendingUp,
  Menu,
  X,
  LayoutDashboard,
  FolderArchive,
  KeyRound,
  LogIn,
  LogOut
} from 'lucide-react';
import { AuthUser } from '../utils/authStorage';

export function Header({
  lang,
  setLang,
  activePortal,
  setActivePortal,
  cartCount,
  onOpenCart,
  onOpenAi,
  onOpenStarterDownload,
  unreadMessagesCount,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenCredentialsDirectory,
  onOpenSidebar
}: {
  lang: Language;
  setLang: (l: Language) => void;
  activePortal: PortalView;
  setActivePortal: (p: PortalView) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAi: () => void;
  onOpenStarterDownload?: () => void;
  unreadMessagesCount: number;
  currentUser?: AuthUser | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onOpenCredentialsDirectory?: () => void;
  onOpenSidebar?: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const t = translations[lang];

  const portalButtons: { id: PortalView; label: string; icon: any }[] = [
    { id: 'human-os', label: 'Human OS (Dark)', icon: LayoutDashboard },
    { id: 'marketplace', label: lang === 'rw' ? 'Isoko' : 'Marketplace', icon: Store },
    { id: 'buyer', label: lang === 'rw' ? 'Umuguzi' : 'Buyer Portal', icon: User },
    { id: 'seller', label: lang === 'rw' ? 'Umuhinzi / Umugurisha' : 'Seller Portal', icon: Sprout },
    { id: 'trader', label: lang === 'rw' ? 'Umucuruzi' : 'Trader / B2B', icon: TrendingUp },
    { id: 'jobs', label: lang === 'rw' ? 'Imirimo' : 'Agri Jobs', icon: Briefcase },
    { id: 'admin', label: lang === 'rw' ? 'Ubuyobozi' : 'Admin', icon: ShieldCheck },
    { id: 'architecture', label: 'React + PHP + MySQL', icon: Layers }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c1a14]/95 border-b border-emerald-500/20 backdrop-blur-md">
      {/* Top Banner Tagline */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#0a2318] to-emerald-950 py-1.5 px-4 text-center border-b border-emerald-500/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-emerald-300">
          <span className="hidden sm:inline font-medium">
            🇷🇼 {t.subTagline}
          </span>
          <span className="mx-auto sm:mx-0 font-semibold tracking-wide">
            {t.tagline}
          </span>
          <span className="hidden md:inline text-emerald-400/80 font-mono text-[10px]">
            {t.madeForRwanda}
          </span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand Zone */}
        <div className="flex items-center gap-2.5">
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/60 hover:bg-emerald-900/60 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 transition shadow-sm"
              title="Open all features and dashboards sidebar"
            >
              <Menu size={16} className="text-emerald-400" />
              <span className="font-semibold text-white">Features</span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-emerald-300 hover:bg-emerald-900/30 xl:hidden"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <button
            onClick={() => setActivePortal('marketplace')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-[#062114] shadow-md shadow-emerald-900/40 group-hover:scale-105 transition-transform">
              <Sprout size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1">
                <span className="text-emerald-400">UMUHUZA</span>
                <span className="text-[#f97316] font-black">CONNECT</span>
              </div>
              <div className="text-[9px] text-emerald-300/80 tracking-wider font-medium uppercase hidden sm:block">
                Rwanda's Agricultural Marketplace · Isoko ry'Ubuhinzi
              </div>
            </div>
          </button>
        </div>

        {/* Center: Portal Selectors (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1 bg-emerald-950/60 p-1 rounded-xl border border-emerald-500/20">
          {portalButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = activePortal === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setActivePortal(btn.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-emerald-500 text-[#051f12] shadow-sm'
                    : 'text-emerald-200 hover:bg-emerald-900/40 hover:text-white'
                }`}
              >
                <Icon size={13} />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Affordances */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher [EN] / [RW] */}
          <div className="flex items-center bg-emerald-950/70 border border-emerald-500/30 rounded-lg p-0.5 text-xs font-bold">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded transition ${
                lang === 'en'
                  ? 'bg-emerald-500 text-[#072416]'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('rw')}
              className={`px-2 py-1 rounded transition ${
                lang === 'rw'
                  ? 'bg-emerald-500 text-[#072416]'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              RW
            </button>
          </div>

          {/* Download Starter ZIP Button */}
          {onOpenStarterDownload && (
            <button
              onClick={onOpenStarterDownload}
              className="hidden lg:flex items-center gap-1.5 bg-[#0e2219] hover:bg-[#143224] border border-emerald-500/30 text-emerald-300 px-3 py-2 rounded-xl text-xs font-semibold transition"
              title="Download umuhuza-connect-starter.zip"
            >
              <FolderArchive size={14} className="text-emerald-400" />
              <span>Starter ZIP</span>
            </button>
          )}

          {/* Verified Credentials Directory Button */}
          {onOpenCredentialsDirectory && (
            <button
              onClick={onOpenCredentialsDirectory}
              className="hidden sm:flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm"
              title="Access Any Dashboard with Real Credentials"
            >
              <KeyRound size={14} className="text-emerald-400" />
              <span>Real Credentials</span>
            </button>
          )}

          {/* User Authentication Status */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-[#0e241b] border border-emerald-500/30 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-200 hover:bg-[#153427] transition"
              >
                <div className="h-6 w-6 rounded-full bg-emerald-400 text-[#072416] font-bold text-xs flex items-center justify-center">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden md:inline truncate max-w-[80px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ShieldCheck size={14} className="text-emerald-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-emerald-500/30 bg-[#0a1b14] p-3 shadow-2xl z-50 space-y-2 text-left">
                  <div className="border-b border-emerald-500/20 pb-2">
                    <div className="text-xs font-bold text-white">{currentUser.name}</div>
                    <div className="text-[10px] text-emerald-300 font-mono">{currentUser.phone}</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">{currentUser.district} · {currentUser.role}</div>
                  </div>

                  <div className="space-y-1">
                    {onOpenCredentialsDirectory && (
                      <button
                        onClick={() => {
                          onOpenCredentialsDirectory();
                          setUserDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-emerald-300 hover:bg-emerald-900/30 font-semibold"
                      >
                        <KeyRound size={13} />
                        <span>Credentials Directory (All Roles)</span>
                      </button>
                    )}
                  </div>

                  {onLogout && (
                    <div className="border-t border-emerald-500/20 pt-2">
                      <button
                        onClick={() => {
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                      >
                        <LogOut size={13} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-200 px-3 py-2 rounded-xl text-xs font-bold transition"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
            )
          )}

          {/* AI Assistant Button */}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-900/30 transition transform active:scale-95"
            title="Ask Umuhuza AI Assistant"
          >
            <Bot size={15} />
            <span className="hidden md:inline">Umuhuza AI</span>
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-200 hover:bg-emerald-900/50 hover:text-white transition"
            aria-label="View shopping cart"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-amber-400 text-[#0a2318] text-[10px] font-black flex items-center justify-center shadow font-mono">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Horizontal Sub-Bar for Quick Portal & Role Access across all screen sizes */}
      <div className="bg-[#08150f] border-t border-emerald-500/10 px-4 py-2 overflow-x-auto scrollbar-thin scrollbar-thumb-emerald-500/20">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mr-1 hidden sm:inline">
            Portals:
          </span>
          {portalButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = activePortal === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setActivePortal(btn.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition shrink-0 ${
                  isActive
                    ? 'bg-emerald-500 text-[#051f12] shadow-sm font-bold'
                    : 'text-emerald-300 hover:bg-emerald-950/60 hover:text-white border border-emerald-500/15'
                }`}
              >
                <Icon size={13} />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0a1812] border-b border-emerald-500/20 px-4 py-3 space-y-1">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-2 pb-1">
            {t.choosePortal}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {portalButtons.map((btn) => {
              const Icon = btn.icon;
              const isActive = activePortal === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => {
                    setActivePortal(btn.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold text-left transition ${
                    isActive
                      ? 'bg-emerald-500 text-[#051f12]'
                      : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/50'
                  }`}
                >
                  <Icon size={14} />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
