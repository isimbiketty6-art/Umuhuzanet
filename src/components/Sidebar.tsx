import { useEffect, useState } from 'react';
import { Section, UserRole } from '../types';
import { PortalView } from '../types/agri';
import { AuthUser } from '../utils/authStorage';
import {
  Activity,
  X,
  LayoutDashboard,
  GraduationCap,
  ShieldCheck,
  Briefcase,
  FileText,
  Plus,
  ShoppingBag,
  Package,
  Store,
  Sprout,
  ShoppingCart,
  TrendingUp,
  Users,
  Wallet,
  Server,
  Layers,
  MessageCircle,
  Sparkles,
  KeyRound,
  FolderArchive,
  Settings,
  CircleUserRound,
  LogOut,
  LogIn,
  ChevronRight,
  ExternalLink,
  Crown,
  Compass
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  section: Section;
  setSection: (s: Section) => void;
  role: UserRole;
  setRole?: (r: UserRole) => void;
  currentUser?: AuthUser | null;
  activePortal?: PortalView;
  onSwitchPortal?: (p: PortalView) => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onOpenCopilot?: () => void;
  onOpenStarterDownload?: () => void;
  onOpenCredentialsDirectory?: () => void;
  onOpenApplicationsTracker?: () => void;
  onOpenPostJob?: () => void;
  onOpenAddProduct?: () => void;
  onOpenCreateInvoice?: () => void;
  onOpenSubscriptions?: () => void;
  unreadMessagesCount?: number;
  notify?: (msg: string) => void;
}

export function Sidebar({
  isOpen,
  onClose,
  section,
  setSection,
  role,
  setRole,
  currentUser,
  activePortal = 'human-os',
  onSwitchPortal,
  onOpenAuth,
  onLogout,
  onOpenCopilot,
  onOpenStarterDownload,
  onOpenCredentialsDirectory,
  onOpenApplicationsTracker,
  onOpenPostJob,
  onOpenAddProduct,
  onOpenCreateInvoice,
  onOpenSubscriptions,
  unreadMessagesCount = 2,
  notify
}: SidebarProps) {
  // Listen for Escape key to close sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Helper: execute an action and immediately hide the sidebar
  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const handleSelectSection = (targetSection: Section) => {
    handleAction(() => {
      setSection(targetSection);
      if (notify) {
        notify(`Navigated to ${targetSection}`);
      }
    });
  };

  const isAdmin = currentUser?.role === 'Administrator';

  return (
    <>
      {/* Universal Backdrop for Mobile and Desktop: clicking outside always hides the sidebar */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar backdrop"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onClose();
          }}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Slide-out Sidebar Drawer */}
      <aside
        aria-label="Main features sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-[300px] sm:w-[320px] flex-col border-r border-white/[0.08] bg-[#09111e] text-slate-200 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header: Brand Zone + Explicit Close Button */}
        <div className="flex h-[68px] items-center justify-between border-b border-white/[0.08] px-5 bg-[#0b1424]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint text-[#071b22] font-black shadow-md shadow-mint/20">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>umuhuza<span className="text-mint">connect</span></span>
              </div>
              <div className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                All Features & Portals
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1.5 text-xs text-slate-400 hover:bg-white/10 hover:text-white transition"
            title="Close sidebar (Esc)"
          >
            <X size={16} />
            <span className="text-[10px] font-mono">Esc</span>
          </button>
        </div>

        {/* User Identity & Fast Actions Card */}
        <div className="p-3.5 border-b border-white/[0.08] bg-[#0c1628]/60 space-y-2">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint/15 text-mint shrink-0 font-bold text-xs border border-mint/20">
                {currentUser ? currentUser.name.charAt(0) : <CircleUserRound size={17} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">
                  {currentUser ? currentUser.name : 'Guest Explorer'}
                </div>
                <div className="text-[10px] text-mint font-medium flex items-center gap-1 truncate">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
                  <span>{currentUser ? `${currentUser.role} · ${currentUser.district}` : `${role} view`}</span>
                </div>
              </div>
            </div>

            {currentUser ? (
              onLogout && (
                <button
                  onClick={() => handleAction(onLogout)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-red-300 transition shrink-0"
                  title="Sign out"
                >
                  <LogOut size={14} />
                </button>
              )
            ) : (
              onOpenAuth && (
                <button
                  onClick={() => handleAction(onOpenAuth)}
                  className="rounded-lg bg-mint text-[#07211e] px-2.5 py-1 text-[10px] font-bold hover:bg-emerald-300 transition shrink-0 shadow-sm"
                >
                  Sign In
                </button>
              )
            )}
          </div>
        </div>

        {/* Scrollable Arranged Features Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin scrollbar-thumb-white/10">

          {/* ---------------------------------------------------- */}
          {/* SECTION 1: DASHBOARDS & CORE WORKSPACE              */}
          {/* ---------------------------------------------------- */}
          <div className="space-y-1">
            <div className="px-2 pb-1 text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase flex items-center justify-between">
              <span>DASHBOARDS & WORKSPACE</span>
              <span className="text-[8px] text-mint font-normal">Auto-hide on click</span>
            </div>

            {/* Home Public Experience */}
            <button
              onClick={() => handleSelectSection('Home' as Section)}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                (section as string) === 'Home'
                  ? 'bg-mint text-[#061b17] font-bold shadow-md shadow-mint/20'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Store size={16} className={(section as string) === 'Home' ? 'text-[#061b17]' : 'text-mint'} />
                <span>Home Landing Page</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                (section as string) === 'Home' ? 'bg-[#061b17]/20 text-[#061b17] font-bold' : 'bg-mint/15 text-mint'
              }`}>
                Public
              </span>
            </button>

            {/* Career OS Dashboard (Image 1) */}
            <button
              onClick={() => handleSelectSection('Overview')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                section === 'Overview'
                  ? 'bg-mint text-[#061b17] font-bold shadow-md shadow-mint/20'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard size={16} className={section === 'Overview' ? 'text-[#061b17]' : 'text-mint'} />
                <span>User Dashboard (Hello, Aline)</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                section === 'Overview' ? 'bg-[#061b17]/20 text-[#061b17] font-bold' : 'bg-mint/15 text-mint'
              }`}>
                Image 1
              </span>
            </button>

            {/* Executive Admin Center (Shown strictly to verified Administrators) */}
            {isAdmin && (
              <button
                onClick={() => handleSelectSection('Admin Center')}
                className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                  section === 'Admin Center'
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
                    : 'text-purple-300 hover:bg-purple-950/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Crown size={16} className="text-purple-400" />
                  <span>Executive Admin Center</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-200 border border-purple-500/30 font-bold font-mono">
                  Admin
                </span>
              </button>
            )}

            {/* Specialized Portals (Seeker / Seller / Connection) */}
            <button
              onClick={() => handleSelectSection('Find opportunities')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                section === 'Find opportunities'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-900/30'
                  : 'text-blue-300 hover:bg-blue-950/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass size={16} className="text-blue-400" />
                <span>Specialized Portals</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-200 border border-blue-500/30 font-bold font-mono">
                Portals
              </span>
            </button>

            {/* Trainee & Skills Hub (Image 2) */}
            <button
              onClick={() => handleSelectSection('Learning')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                section === 'Learning'
                  ? 'bg-mint text-[#061b17] font-bold shadow-md shadow-mint/20'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap size={16} className={section === 'Learning' ? 'text-[#061b17]' : 'text-amber-400'} />
                <span>Trainee & Skills Hub</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-400/15 text-amber-300 font-mono">
                Image 2
              </span>
            </button>
          </div>

          {/* ---------------------------------------------------- */}
          {/* SECTION 2: TALENT & OPPORTUNITIES                   */}
          {/* ---------------------------------------------------- */}
          <div className="space-y-1">
            <div className="px-2 pb-1 text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              TALENT & EMPLOYMENT
            </div>

            <button
              onClick={() => handleSelectSection('Career & jobs')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                section === 'Career & jobs' && activePortal === 'human-os'
                  ? 'bg-mint text-[#061b17] font-bold'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase size={16} className="text-emerald-400" />
                <span>Career & Vacancies</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-slate-300 font-mono">
                6 Active
              </span>
            </button>

            {onOpenApplicationsTracker && (
              <button
                onClick={() => handleAction(onOpenApplicationsTracker)}
                className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05] hover:text-white transition"
              >
                <div className="flex items-center gap-2.5">
                  <FileText size={16} className="text-cyan-400" />
                  <span>{role === 'Employer' ? 'Applicant Pipeline' : 'Application Tracker'}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-400/10 text-cyan-300 font-mono">
                  Review
                </span>
              </button>
            )}

            {onOpenPostJob && (
              <button
                onClick={() => handleAction(onOpenPostJob)}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-mint hover:bg-mint/10 transition"
              >
                <Plus size={15} />
                <span>Post a Kigali Vacancy</span>
              </button>
            )}
          </div>

          {/* ---------------------------------------------------- */}
          {/* SECTION 3: MADE IN RWANDA & COMMERCE                */}
          {/* ---------------------------------------------------- */}
          <div className="space-y-1">
            <div className="px-2 pb-1 text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              MADE IN RWANDA & COMMERCE
            </div>

            <button
              onClick={() => handleSelectSection('Marketplace')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                section === 'Marketplace'
                  ? 'bg-mint text-[#061b17] font-bold'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={16} className="text-teal-400" />
                <span>Made in Rwanda Store</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-teal-500/15 text-teal-300 font-mono">
                Artisan
              </span>
            </button>

            {onOpenAddProduct && (
              <button
                onClick={() => handleAction(onOpenAddProduct)}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-mint hover:bg-mint/10 transition"
              >
                <Plus size={15} />
                <span>List Product / Service</span>
              </button>
            )}
          </div>

          {/* ---------------------------------------------------- */}
          {/* SECTION 4: RWANDA AGRICULTURAL MARKETPLACE (ISOKO)  */}
          {/* ---------------------------------------------------- */}
          <div className="space-y-1">
            <div className="px-2 pb-1 text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase flex items-center justify-between">
              <span>AGRICULTURAL MARKETPLACE</span>
              <span className="text-[8px] text-emerald-400 font-mono">ISOKO</span>
            </div>

            {/* Agri Marketplace (Isoko) */}
            <button
              onClick={() => handleSelectSection('Marketplace')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                section === 'Marketplace'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Store size={16} className="text-emerald-400" />
                <span>Agri Marketplace (Isoko)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono">
                Catalog
              </span>
            </button>

            {/* Farmer Harvest Produce */}
            <button
              onClick={() => handleSelectSection('Marketplace')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                section === 'Marketplace'
                  ? 'text-white hover:bg-white/[0.05]'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sprout size={16} className="text-emerald-400" />
                <span>Farmer Harvest & Produce</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-slate-300 font-mono">
                Harvest
              </span>
            </button>

            {/* Buyer Portal */}
            <button
              onClick={() => handleSelectSection('Marketplace')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                section === 'Marketplace'
                  ? 'text-white hover:bg-white/[0.05]'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingCart size={16} className="text-emerald-400" />
                <span>Buyer Portal & Cart</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/10 text-slate-300 font-mono">
                Orders
              </span>
            </button>

            {/* B2B Wholesale Trader */}
            <button
              onClick={() => handleSelectSection('Marketplace')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                section === 'Marketplace'
                  ? 'text-white hover:bg-white/[0.05]'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp size={16} className="text-teal-400" />
                <span>B2B Wholesale Trader</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-mono">
                Bulk
              </span>
            </button>

            {/* Agri Jobs & Cooperatives */}
            <button
              onClick={() => handleSelectSection('Career & jobs')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                section === 'Career & jobs'
                  ? 'text-white hover:bg-white/[0.05]'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase size={16} className="text-lime-400" />
                <span>Agri Jobs & Cooperatives</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-lime-500/20 text-lime-300 font-mono">
                Farms
              </span>
            </button>
          </div>

          {/* ---------------------------------------------------- */}
          {/* SECTION 5: GROWTH & FINANCE                         */}
          {/* ---------------------------------------------------- */}
          <div className="space-y-1">
            <div className="px-2 pb-1 text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              GROWTH & FINANCE
            </div>

            <button
              onClick={() => handleSelectSection('Network')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                section === 'Network'
                  ? 'bg-mint text-[#061b17] font-bold'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users size={16} className="text-blue-400" />
                <span>Professional Network</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-300 font-mono">
                4 Hubs
              </span>
            </button>

            <button
              onClick={() => handleSelectSection('Income OS')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                section === 'Income OS'
                  ? 'bg-mint text-[#061b17] font-bold'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wallet size={16} className="text-yellow-400" />
                <span>Income OS & MoMo</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-yellow-400/15 text-yellow-300 font-mono">
                Invoices
              </span>
            </button>

            {onOpenCreateInvoice && (
              <button
                onClick={() => handleAction(onOpenCreateInvoice)}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-mint hover:bg-mint/10 transition"
              >
                <Plus size={15} />
                <span>Create MoMo Invoice</span>
              </button>
            )}
          </div>

          {/* ---------------------------------------------------- */}
          {/* SECTION 6: COMMUNICATIONS & SETTINGS                */}
          {/* ---------------------------------------------------- */}
          <div className="space-y-1">
            <div className="px-2 pb-1 text-[9px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              COMMUNICATION & SETTINGS
            </div>

            <button
              onClick={() => handleSelectSection('Messages')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                section === 'Messages'
                  ? 'bg-mint text-[#061b17] font-bold'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageCircle size={16} className="text-purple-400" />
                <span>Messages & Inquiries</span>
              </div>
              {unreadMessagesCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-mint text-[#07211e] font-bold font-mono">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleSelectSection('Settings')}
              className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                section === 'Settings'
                  ? 'bg-mint text-[#061b17] font-bold'
                  : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings size={16} className="text-slate-400" />
                <span>Settings & Profile</span>
              </div>
            </button>
          </div>
        </nav>

        {/* Bottom Callout & Quick Utilities Bar */}
        <div className="p-3 border-t border-white/[0.08] bg-[#070e1a] space-y-2">
          {/* Opportunity AI Copilot Quick Action */}
          {onOpenCopilot && (
            <button
              onClick={() => handleAction(onOpenCopilot)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-mint/25 bg-gradient-to-r from-mint/15 to-indigo-900/20 hover:from-mint/25 hover:to-indigo-900/30 transition text-left"
            >
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-mint text-[#07211e] flex items-center justify-center font-black">
                  <Sparkles size={14} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">AI Opportunity Copilot</div>
                  <div className="text-[10px] text-mint">Career guidance & smart pitches</div>
                </div>
              </div>
              <ChevronRight size={14} className="text-mint" />
            </button>
          )}

          <div className="flex items-center justify-center gap-1.5 pt-0.5 text-[9px] font-mono text-slate-500">
            <ShieldCheck size={11} className="text-mint" />
            <span>Umuhuza Connect · Kigali, Rwanda</span>
          </div>
        </div>
      </aside>
    </>
  );
}
