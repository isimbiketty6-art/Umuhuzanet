import { Section, UserRole } from '../types';
import {
  LayoutDashboard,
  Briefcase,
  ShoppingBag,
  GraduationCap,
  Users,
  Wallet,
  MessageSquare,
  Server,
  Settings,
  ShieldCheck,
  ChevronRight,
  Plus,
  Sparkles,
  Store,
  FolderArchive,
  ArrowRight
} from 'lucide-react';

interface TabItem {
  id: Section | 'Admin Center';
  name: string;
  icon: any;
  badge?: string | number;
  badgeColor?: string;
  description: string;
}

export function WorkspaceTabsBar({
  currentSection,
  onSelectSection,
  role,
  onOpenQuickAction,
  onOpenStarterDownload,
  onSwitchToAgriMarketplace,
  unreadMessagesCount = 2,
  savedJobsCount = 2,
  invoicesCount = 3
}: {
  currentSection: Section;
  onSelectSection: (section: Section | 'Admin Center') => void;
  role: UserRole;
  onOpenQuickAction: (actionType: 'postJob' | 'addProduct' | 'createInvoice' | 'copilot') => void;
  onOpenStarterDownload?: () => void;
  onSwitchToAgriMarketplace?: () => void;
  unreadMessagesCount?: number;
  savedJobsCount?: number;
  invoicesCount?: number;
}) {
  const allTabs: TabItem[] = [
    {
      id: 'Overview',
      name: 'Overview',
      icon: LayoutDashboard,
      description: 'Human OS dashboard, Kigali talent metrics & growth tasks'
    },
    {
      id: 'Career & jobs',
      name: 'Career & Jobs',
      icon: Briefcase,
      badge: 6,
      badgeColor: 'bg-mint/15 text-mint border-mint/20',
      description: 'Verified vacancies in Kigali, tech hubs & applicant pipeline'
    },
    {
      id: 'Marketplace',
      name: 'Marketplace',
      icon: ShoppingBag,
      badge: 'Local',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
      description: 'Made in Rwanda craft, artisan coffee & creative services'
    },
    {
      id: 'Learning',
      name: 'Learning',
      icon: GraduationCap,
      badge: '3 Courses',
      badgeColor: 'bg-amber-400/15 text-amber-300 border-amber-400/20',
      description: 'Proof of work, software skills & certification tracks'
    },
    {
      id: 'Network',
      name: 'Network',
      icon: Users,
      badge: '4 Hubs',
      badgeColor: 'bg-cyan-400/15 text-cyan-300 border-cyan-400/20',
      description: 'Rwandan tech founders, university collectives & meetups'
    },
    {
      id: 'Income OS',
      name: 'Income OS',
      icon: Wallet,
      badge: 'MoMo',
      badgeColor: 'bg-yellow-400/15 text-yellow-300 border-yellow-400/20',
      description: 'Freelance deliverables, compliant invoices & MTN MoMo'
    },
    {
      id: 'Messages',
      name: 'Messages',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      badgeColor: 'bg-mint text-[#08221e] font-bold',
      description: 'Direct communication with employers, clients & artisans'
    },
    {
      id: 'Settings',
      name: 'Settings',
      icon: Settings,
      description: 'Profile, district, NIDA verification & simulated roles'
    }
  ];

  // If user is Admin, insert Admin Center tab
  if (role === 'Administrator') {
    allTabs.splice(7, 0, {
      id: 'Admin Center',
      name: 'Admin Center',
      icon: ShieldCheck,
      badge: 'Admin',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      description: 'Platform supervision, KYC audit & revenue control'
    });
  }

  // Current tab metadata
  const activeTabMeta = allTabs.find((t) => t.id === currentSection) || allTabs[0];

  return (
    <div className="mb-6 space-y-3">
      {/* Top Breadcrumb & Contextual Quick-Action Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-[#0c1524] px-4 py-3 text-xs">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-slate-400 font-medium overflow-x-auto whitespace-nowrap">
          <span className="text-slate-300">Human OS</span>
          <ChevronRight size={13} className="text-slate-600 shrink-0" />
          <span className="text-slate-300">Workspace</span>
          <ChevronRight size={13} className="text-slate-600 shrink-0" />
          <span className="text-mint font-semibold flex items-center gap-1.5">
            <activeTabMeta.icon size={14} className="text-mint shrink-0" />
            <span>{activeTabMeta.name}</span>
          </span>
          <span className="text-slate-600 hidden md:inline">·</span>
          <span className="text-[11px] text-slate-400 hidden md:inline truncate max-w-sm">
            {activeTabMeta.description}
          </span>
        </div>

        {/* Right: Contextual Quick-Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {currentSection === 'Career & jobs' && (
            <button
              onClick={() => onOpenQuickAction('postJob')}
              className="flex items-center gap-1.5 rounded-xl bg-mint px-3 py-1.5 text-[11px] font-bold text-[#07211e] hover:bg-emerald-300 transition"
            >
              <Plus size={13} />
              <span>Post Vacancy</span>
            </button>
          )}

          {currentSection === 'Marketplace' && (
            <button
              onClick={() => onOpenQuickAction('addProduct')}
              className="flex items-center gap-1.5 rounded-xl bg-mint px-3 py-1.5 text-[11px] font-bold text-[#07211e] hover:bg-emerald-300 transition"
            >
              <Plus size={13} />
              <span>List Product / Service</span>
            </button>
          )}

          {currentSection === 'Income OS' && (
            <button
              onClick={() => onOpenQuickAction('createInvoice')}
              className="flex items-center gap-1.5 rounded-xl bg-mint px-3 py-1.5 text-[11px] font-bold text-[#07211e] hover:bg-emerald-300 transition"
            >
              <Plus size={13} />
              <span>New Invoice</span>
            </button>
          )}

          {currentSection === 'Overview' && (
            <button
              onClick={() => onOpenQuickAction('copilot')}
              className="flex items-center gap-1.5 rounded-xl border border-mint/30 bg-mint/10 px-3 py-1.5 text-[11px] font-semibold text-mint hover:bg-mint/20 transition"
            >
              <Sparkles size={13} />
              <span>Ask Copilot</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Scrollable Features & Tabs Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10">
        {allTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentSection === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectSection(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition shrink-0 border ${
                isActive
                  ? 'border-mint/50 bg-mint/15 text-mint shadow-sm'
                  : 'border-white/[0.06] bg-[#0c1524]/80 text-slate-400 hover:border-white/15 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-mint' : 'text-slate-400'} />
              <span>{tab.name}</span>

              {tab.badge !== undefined && (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold border ${tab.badgeColor}`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
