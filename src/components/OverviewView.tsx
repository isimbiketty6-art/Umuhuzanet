import { useState } from 'react';
import { Job, Product, UserActivity, Section } from '../types';
import { AGRI_ASSETS } from '../data/assets';
import {
  Search,
  Briefcase,
  ShoppingBag,
  GraduationCap,
  Users,
  ArrowRight,
  ChevronRight,
  Sun,
  CloudSun,
  Star,
  CheckCircle2,
  Circle,
  Sparkles,
  MessageCircle,
  Heart,
  TrendingUp,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Crown,
  Bell,
  Clock,
  Send,
  Plus
} from 'lucide-react';

interface OverviewViewProps {
  jobs: Job[];
  products: Product[];
  activities: UserActivity[];
  savedJobIds: number[];
  appliedJobIds: number[];
  onSelectJob: (job: Job) => void;
  onSaveJob: (id: number) => void;
  setSection: (sec: Section) => void;
  onOpenCopilot: () => void;
  notify: (msg: string) => void;
  onSwitchToAdmin?: () => void;
  userName?: string;
  onOpenMessageWith?: (name: string, role: string) => void;
}

export function OverviewView({
  jobs,
  products,
  activities,
  savedJobIds,
  appliedJobIds,
  onSelectJob,
  onSaveJob,
  setSection,
  onOpenCopilot,
  notify,
  onSwitchToAdmin,
  userName = 'Aline',
  onOpenMessageWith
}: OverviewViewProps) {
  // Checklist for "Your Progress" (matching home.png & new.png)
  const [checklist, setChecklist] = useState([
    { id: 1, label: 'Complete your profile', completed: true },
    { id: 2, label: 'Add a product listing', completed: true },
    { id: 3, label: 'Apply for a job', completed: true },
    { id: 4, label: 'Join a learning course', completed: false }
  ]);

  const toggleChecklistItem = (id: number) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    notify('Profile progress updated');
  };

  const completedCount = checklist.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  // Popular Categories from home.png & new.png
  const popularCategories = [
    { name: 'Agriculture', count: 432, icon: '🌱', section: 'Marketplace' as Section },
    { name: 'Electronics', count: 298, icon: '📱', section: 'Marketplace' as Section },
    { name: 'Fashion', count: 256, icon: '👗', section: 'Marketplace' as Section },
    { name: 'Education', count: 189, icon: '🎓', section: 'Learning' as Section },
    { name: 'Services', count: 162, icon: '🛠️', section: 'Income OS' as Section },
    { name: 'Others', count: 120, icon: '📦', section: 'Marketplace' as Section }
  ];

  // Latest Messages from home.png & new.png
  const latestMessages = [
    {
      id: 'm1',
      sender: 'Jean Bosco',
      role: 'Seller',
      text: 'Yes, the tomatoes are available...',
      time: '10:24 AM',
      unread: 2,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'm2',
      sender: 'Uwimana Aline',
      role: 'Buyer',
      text: 'Can you reduce the price?',
      time: '09:50 AM',
      unread: 1,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'm3',
      sender: 'Mugisha Daniel',
      role: 'Seller',
      text: 'Order #1234 is ready',
      time: 'Yesterday',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'm4',
      sender: 'Support Team',
      role: 'System',
      text: 'How can we help you?',
      time: 'Yesterday',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
    }
  ];

  // Recommended Products from home.png & new.png
  const recommendedProducts = [
    {
      id: 201,
      name: 'Fresh Tomatoes',
      price: 'RWF 800/kg',
      seller: 'AgriFresh',
      rating: 4.8,
      image: AGRI_ASSETS.freshTomatoes
    },
    {
      id: 202,
      name: 'Irish Potatoes',
      price: 'RWF 500/kg',
      seller: 'Mugabo Farm',
      rating: 4.6,
      image: AGRI_ASSETS.irishPotatoes
    },
    {
      id: 203,
      name: 'Maize Flour',
      price: 'RWF 1,200/kg',
      seller: 'Green Farms',
      rating: 4.7,
      image: AGRI_ASSETS.sweetBananas
    },
    {
      id: 204,
      name: 'Coffee Beans',
      price: 'RWF 4,500/kg',
      seller: 'Rwanda Coffee',
      rating: 4.9,
      image: AGRI_ASSETS.coffee
    }
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans animate-in fade-in duration-200">
      {/* ======================================================== */}
      {/* 1. TOP WELCOME HEADER & WEATHER WIDGET (home.png & new.png) */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#19414D] bg-gradient-to-r from-[#071F2B] via-[#092532] to-[#071F2B] p-5 sm:p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Hello, {userName}</span>
              <span className="text-2xl">👋</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              Human OS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Explore jobs, products, learn new skills and grow your future.
          </p>
        </div>

        {/* Right: Weather & Admin Switcher */}
        <div className="flex items-center gap-3">
          {/* Weather Widget matching new.png ("Kigali 22°C Partly Cloudy") */}
          <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur-md">
            <CloudSun size={18} className="text-amber-400 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <span>Kigali</span>
                <span className="text-emerald-400">22°C</span>
              </div>
              <div className="text-[10px] text-slate-400">Partly Cloudy</div>
            </div>
          </div>

          {onSwitchToAdmin && (
            <button
              onClick={onSwitchToAdmin}
              className="flex items-center gap-1.5 rounded-2xl border border-purple-500/30 bg-purple-500/15 hover:bg-purple-500/25 px-3 py-2 text-xs font-bold text-purple-200 transition shadow-sm"
              title="Switch to Admin Center"
            >
              <Crown size={14} className="text-purple-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. FOUR BIG ACTION CARDS (Exact match from new.png & home.png) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: FIND A JOB (Blue) */}
        <div
          onClick={() => setSection('Career & jobs')}
          className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-[#0c2340] to-[#08182b] p-5 shadow-lg hover:border-blue-400 hover:scale-[1.01] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white group-hover:text-blue-300 transition-colors">
                Find a Job
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Explore latest job opportunities in Rwanda.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-blue-500/20 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
            <span>Explore Jobs</span>
            <ArrowRight size={15} />
          </div>
        </div>

        {/* CARD 2: BUY & SELL (Emerald) */}
        <div
          onClick={() => setSection('Marketplace')}
          className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#092a1d] to-[#061c13] p-5 shadow-lg hover:border-emerald-400 hover:scale-[1.01] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                Buy & Sell
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Shop or sell quality Rwandan farm products.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
            <span>Open Marketplace</span>
            <ArrowRight size={15} />
          </div>
        </div>

        {/* CARD 3: LEARN SKILLS (Purple) */}
        <div
          onClick={() => setSection('Learning')}
          className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#201138] to-[#140b24] p-5 shadow-lg hover:border-purple-400 hover:scale-[1.01] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white group-hover:text-purple-300 transition-colors">
                Learn Skills
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Take courses, earn certificates and improve.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
            <span>Browse Courses</span>
            <ArrowRight size={15} />
          </div>
        </div>

        {/* CARD 4: CONNECT (Orange / Amber) */}
        <div
          onClick={() => setSection('Network')}
          className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#2f1b0a] to-[#1c1005] p-5 shadow-lg hover:border-amber-400 hover:scale-[1.01] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors">
                Connect
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Meet mentors, cooperatives and grow your network.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>Join Communities</span>
            <ArrowRight size={15} />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. FOUR QUICK STAT PILLS (Applied, Saved, Orders, Msgs)  */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Applied Jobs', count: appliedJobIds.length || 3, action: () => setSection('Career & jobs'), color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
          { label: 'Saved Jobs', count: savedJobIds.length || 5, action: () => setSection('Career & jobs'), color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          { label: 'My Orders', count: 2, action: () => setSection('Marketplace'), color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
          { label: 'Messages', count: 8, action: () => setSection('Messages'), color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
        ].map((stat, i) => (
          <button
            key={i}
            onClick={stat.action}
            className={`rounded-2xl border ${stat.color} p-3.5 flex items-center justify-between text-left hover:scale-[1.01] transition`}
          >
            <div>
              <div className="text-xl font-black text-white font-mono">{stat.count}</div>
              <div className="text-xs font-medium text-slate-300">{stat.label}</div>
            </div>
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
              <span>View</span>
              <ChevronRight size={12} />
            </div>
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* 4. MAIN TWO-COLUMN CONTENT GRID (Matching new.png layout) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Featured Jobs + Recommended Products + AI Assistant */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. FEATURED JOBS (Matching home.png & new.png) */}
          <div className="rounded-3xl border border-[#19414D] bg-[#092532] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Featured Jobs
                </h2>
                <p className="text-xs text-slate-400">Verified vacancies in Rwanda with real salary rates.</p>
              </div>
              <button
                onClick={() => setSection('Career & jobs')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {jobs.slice(0, 4).map((job) => {
                const isApplied = appliedJobIds.includes(job.id);
                return (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-white/[0.08] bg-[#071F2B] p-4 flex flex-col justify-between hover:border-emerald-500/30 transition group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center font-bold text-emerald-400 shrink-0">
                          {job.companyLogo ? (
                            <img src={job.companyLogo} alt={job.company} className="h-5 w-5 rounded object-cover" />
                          ) : (
                            job.company.charAt(0)
                          )}
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold">
                          {job.type}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                        <div className="text-xs text-slate-300 font-medium">{job.company}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin size={11} className="text-emerald-400" />
                          <span>{job.location}</span>
                          <span className="mx-1">•</span>
                          <span>{job.posted}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                      <div className="text-xs font-bold font-mono text-emerald-400">{job.salary}</div>
                      <button
                        onClick={() => onSelectJob(job)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                          isApplied
                            ? 'bg-white/10 text-slate-300'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-[#04131B]'
                        }`}
                      >
                        {isApplied ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. RECOMMENDED PRODUCTS (Matching new.png fresh produce cards) */}
          <div className="rounded-3xl border border-[#19414D] bg-[#092532] p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Recommended Products
                </h2>
                <p className="text-xs text-slate-400">Direct from Rwandan farmers & cooperatives.</p>
              </div>
              <button
                onClick={() => setSection('Marketplace')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {recommendedProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSection('Marketplace')}
                  className="rounded-2xl border border-white/[0.08] bg-[#071F2B] overflow-hidden hover:border-emerald-500/40 transition cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative h-28 overflow-hidden bg-black/20">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-[#04131B]/80 text-[10px] font-bold text-amber-300 flex items-center gap-0.5">
                      <Star size={10} fill="currentColor" />
                      <span>{prod.rating}</span>
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <h3 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {prod.name}
                    </h3>
                    <div className="text-[11px] font-bold font-mono text-emerald-400">{prod.price}</div>
                    <div className="text-[10px] text-slate-400">{prod.seller}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* C. NEED HELP? ASK OUR AI ASSISTANT CARD (home.png & new.png) */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-[#072430] via-[#092b3a] to-[#071F2B] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles size={28} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Need help? Ask our AI Assistant!
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 max-w-md">
                  Get instant answers, find products, generate application pitches, or discover job opportunities across Rwanda.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenCopilot}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-5 py-2.5 text-xs font-bold text-[#04131B] transition shadow-lg shadow-emerald-500/20 shrink-0 flex items-center gap-1.5"
            >
              <MessageCircle size={15} />
              <span>Chat Now</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Popular Categories + Latest Messages + Your Progress */}
        <div className="lg:col-span-4 space-y-6">
          {/* A. POPULAR CATEGORIES (new.png & home.png) */}
          <div className="rounded-3xl border border-[#19414D] bg-[#092532] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">Popular Categories</h3>
              <button
                onClick={() => setSection('Marketplace')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
              >
                <span>View all</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {popularCategories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setSection(cat.section)}
                  className="rounded-xl border border-white/[0.06] bg-[#071F2B] p-2.5 text-left hover:border-emerald-500/30 hover:bg-[#092938] transition group flex items-center gap-2.5"
                >
                  <span className="text-base shrink-0">{cat.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                      {cat.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {cat.count} listings
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* B. LATEST MESSAGES (new.png right panel) */}
          <div className="rounded-3xl border border-[#19414D] bg-[#092532] p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">Latest Messages</h3>
              <button
                onClick={() => setSection('Messages')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
              >
                <span>View all</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="space-y-2">
              {latestMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    if (onOpenMessageWith) {
                      onOpenMessageWith(msg.sender, msg.role);
                    } else {
                      setSection('Messages');
                    }
                  }}
                  className="rounded-xl border border-white/[0.06] bg-[#071F2B] p-2.5 flex items-center justify-between gap-3 hover:border-emerald-500/30 hover:bg-[#092938] transition cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={msg.avatar}
                      alt={msg.sender}
                      className="h-8 w-8 rounded-full object-cover shrink-0 border border-white/10"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{msg.sender}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({msg.role})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{msg.text}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-400">{msg.time}</div>
                    {msg.unread > 0 && (
                      <span className="inline-block mt-0.5 h-4 min-w-4 px-1 rounded-full bg-emerald-500 text-[#04131B] text-[9px] font-black text-center leading-4">
                        {msg.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* C. YOUR PROGRESS WIDGET (70% radial tracker from new.png & home.png) */}
          <div className="rounded-3xl border border-[#19414D] bg-[#092532] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">Your Progress</h3>
              <span className="text-xs font-mono font-bold text-emerald-400">{progressPercent}%</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Circular Radial Donut Indicator */}
              <div className="relative h-16 w-16 shrink-0 flex items-center justify-center">
                <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/[0.08]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400 transition-all duration-500 ease-out"
                    strokeDasharray={`${progressPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-mono text-xs font-black text-white">
                  {progressPercent}%
                </span>
              </div>

              <div className="text-xs text-slate-300 leading-tight">
                Complete your Rwanda profile steps to unlock verified badges and boost matching.
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2 pt-1 border-t border-white/[0.06]">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-white/[0.03] transition text-left text-xs"
                >
                  <span className={item.completed ? 'text-slate-300' : 'text-white font-medium'}>
                    {item.label}
                  </span>
                  {item.completed ? (
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  ) : (
                    <Circle size={16} className="text-slate-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* D. GO PRO / BUSINESS UPGRADE CARD (from new.png) */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 to-amber-900/10 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <Crown size={20} />
              </div>
              <div>
                <div className="text-xs font-extrabold text-white">Go Pro Rwanda</div>
                <div className="text-[11px] text-amber-200/80">Get priority listing & MoMo escrow</div>
              </div>
            </div>
            <button
              onClick={() => notify('Umuhuza Pro features activated for demonstration')}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#04131B] text-xs font-bold transition shadow-sm shrink-0"
            >
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
