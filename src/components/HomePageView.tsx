import { useState } from 'react';
import { Section, Job, Product } from '../types';
import { Language } from '../types/agri';
import { AGRI_ASSETS } from '../data/assets';
import {
  Search,
  MapPin,
  Briefcase,
  ShoppingBag,
  GraduationCap,
  Users,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  Building2,
  Heart,
  Globe,
  Sparkles,
  ChevronRight,
  Award,
  Layers
} from 'lucide-react';

interface HomePageViewProps {
  lang: Language;
  onNavigate: (section: Section) => void;
  onOpenAuth: (initialMode?: 'signin' | 'signup') => void;
  onSearch: (query: string, location: string) => void;
  featuredJobs: Job[];
  recommendedProducts: Product[];
  notify: (msg: string) => void;
}

export function HomePageView({
  lang,
  onNavigate,
  onOpenAuth,
  onSearch,
  featuredJobs,
  recommendedProducts,
  notify
}: HomePageViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All locations');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedLocation);
    onNavigate('Career & jobs');
    notify(`Searching for "${searchQuery || 'all opportunities'}" in ${selectedLocation}`);
  };

  const categories = [
    {
      id: 'jobs',
      icon: Briefcase,
      title: 'Find Jobs',
      sub: 'Get hired or hire talent',
      color: 'from-blue-600/20 to-blue-900/30 text-blue-400 border-blue-500/30',
      badgeColor: 'bg-blue-500/20 text-blue-300',
      action: () => onNavigate('Career & jobs')
    },
    {
      id: 'marketplace',
      icon: ShoppingBag,
      title: 'Marketplace',
      sub: 'Buy & sell quality products',
      color: 'from-emerald-600/20 to-emerald-900/30 text-emerald-400 border-emerald-500/30',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      action: () => onNavigate('Marketplace')
    },
    {
      id: 'learning',
      icon: GraduationCap,
      title: 'Learn Skills',
      sub: 'Gain certified expertise',
      color: 'from-purple-600/20 to-purple-900/30 text-purple-400 border-purple-500/30',
      badgeColor: 'bg-purple-500/20 text-purple-300',
      action: () => onNavigate('Learning')
    },
    {
      id: 'community',
      icon: Users,
      title: 'Connect',
      sub: 'Build your Rwanda network',
      color: 'from-amber-600/20 to-amber-900/30 text-amber-400 border-amber-500/30',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      action: () => onNavigate('Network')
    },
    {
      id: 'business',
      icon: TrendingUp,
      title: 'Business',
      sub: 'Grow enterprise & trade',
      color: 'from-teal-600/20 to-teal-900/30 text-teal-400 border-teal-500/30',
      badgeColor: 'bg-teal-500/20 text-teal-300',
      action: () => onNavigate('Income OS')
    }
  ];

  const exploreServices = [
    {
      icon: Briefcase,
      title: 'Jobs & Recruitment',
      desc: 'Find your dream job or the right talent across Kigali, Musanze, and all 30 districts.',
      count: '5K+ Jobs',
      color: 'bg-blue-500/15 text-blue-400',
      action: () => onNavigate('Career & jobs')
    },
    {
      icon: ShoppingBag,
      title: 'Agricultural Marketplace',
      desc: 'Buy and sell fresh Rwandan crops, dairy, and coffee directly with fair farm-gate pricing.',
      count: '1,200+ Listings',
      color: 'bg-emerald-500/15 text-emerald-400',
      action: () => onNavigate('Marketplace')
    },
    {
      icon: GraduationCap,
      title: 'Learning & Skills',
      desc: 'Online courses, vocational training, and verified digital certifications for Rwandan youth.',
      count: '80+ Courses',
      color: 'bg-purple-500/15 text-purple-400',
      action: () => onNavigate('Learning')
    },
    {
      icon: Users,
      title: 'Community & Network',
      desc: 'Meet mentors, cooperatives, startup founders, and artisans building the future of Rwanda.',
      count: '10K+ Members',
      color: 'bg-amber-500/15 text-amber-400',
      action: () => onNavigate('Network')
    },
    {
      icon: TrendingUp,
      title: 'Business & MoMo Invoicing',
      desc: 'Grow your business, create MTN Mobile Money instant invoices, and track revenue seamlessly.',
      count: '3K+ Businesses',
      color: 'bg-teal-500/15 text-teal-400',
      action: () => onNavigate('Income OS')
    }
  ];

  return (
    <div className="w-full text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-white">
      {/* ======================================================== */}
      {/* 1. HERO SECTION (Exact recreation from home.png)          */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#04131B] via-[#071F2B] to-[#04131B] border-b border-[#19414D]/60 pt-8 pb-16 lg:py-20">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -z-10 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headlines, Search & Action Pills */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Rwanda&apos;s Digital Bridge</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                  Connect. Grow.{' '}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-mint bg-clip-text text-transparent">
                    Build a Better Future.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed pt-2">
                  Umuhuza Connect brings people together — for jobs, businesses, learning, and opportunities.
                  Your next step starts here.
                </p>
              </div>

              {/* Unified Search Box (Matching home.png search) */}
              <form
                onSubmit={handleSearchSubmit}
                className="rounded-2xl border border-[#19414D] bg-[#092532]/90 p-2.5 sm:p-3 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row gap-2 max-w-2xl"
              >
                <div className="relative flex-1 flex items-center">
                  <Search size={18} className="absolute left-3.5 text-emerald-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for? e.g. jobs, products, services..."
                    className="w-full bg-transparent pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-400 outline-none"
                  />
                </div>

                <div className="relative flex items-center border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-2">
                  <MapPin size={16} className="absolute left-4 text-emerald-400 pointer-events-none" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full sm:w-auto bg-[#071F2B] sm:bg-transparent pl-10 pr-8 py-2.5 text-xs sm:text-sm text-slate-200 outline-none rounded-xl cursor-pointer"
                  >
                    <option value="All locations" className="bg-[#071F2B]">All locations</option>
                    <option value="Kigali" className="bg-[#071F2B]">Kigali</option>
                    <option value="Musanze" className="bg-[#071F2B]">Musanze (Northern)</option>
                    <option value="Huye" className="bg-[#071F2B]">Huye (Southern)</option>
                    <option value="Rubavu" className="bg-[#071F2B]">Rubavu (Western)</option>
                    <option value="Rwamagana" className="bg-[#071F2B]">Rwamagana (Eastern)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-6 py-2.5 text-xs sm:text-sm font-bold text-[#04131B] transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Search size={15} />
                  <span>Search</span>
                </button>
              </form>

              {/* 5 Quick Action Category Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 max-w-2xl">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={cat.action}
                      className="group flex flex-col items-center justify-center p-3 rounded-xl border border-white/[0.08] bg-[#071F2B]/70 hover:bg-[#092532] hover:border-emerald-500/40 transition text-center"
                    >
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                        <Icon size={16} />
                      </div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {cat.title}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">
                        {cat.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Hero Graphic matching home.png */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 bg-[#092532] group">
                <img
                  src={AGRI_ASSETS.heroFarmer}
                  alt="Rwandan Farmer Harvest"
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04131B] via-transparent to-transparent" />

                {/* Script Callout from home.png */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#04131B]/85 backdrop-blur-md border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-black text-white flex items-center gap-2">
                      <span>Together We Build Rwanda</span>
                      <span className="text-base">🇷🇼</span>
                    </div>
                    <div className="text-[11px] text-emerald-300 font-medium">
                      Connecting 30 Districts Online
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#04131B] text-xs font-bold transition shadow-sm"
                  >
                    Join Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PLATFORM TRUST STATS (home.png middle)                */}
      {/* ======================================================== */}
      <section className="border-b border-[#19414D]/40 bg-[#071F2B]/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Users', value: '10K+', sub: 'Across 30 Districts', icon: Users, color: 'text-emerald-400' },
              { label: 'Jobs Posted', value: '5K+', sub: 'Tech, Agri & Services', icon: Briefcase, color: 'text-blue-400' },
              { label: 'Businesses & Coops', value: '3K+', sub: 'Verified Rwandan sellers', icon: Building2, color: 'text-amber-400' },
              { label: 'Active Categories', value: '50+', sub: 'From Farm to Tech', icon: Layers, color: 'text-purple-400' }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/[0.08] bg-[#092532] p-4 flex items-center gap-3.5"
                >
                  <div className={`h-11 w-11 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0 ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white font-mono">{stat.value}</div>
                    <div className="text-xs font-bold text-slate-200">{stat.label}</div>
                    <div className="text-[10px] text-slate-400">{stat.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. EXPLORE OUR SERVICES (home.png left cards)            */}
      {/* ======================================================== */}
      <section className="py-14 bg-[#04131B] border-b border-[#19414D]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">
                ALL-IN-ONE DIGITAL ECOSYSTEM
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Explore Our Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Everything you need in one place. Choose what matters to you and take your next step.
              </p>
            </div>
            <button
              onClick={() => onNavigate('Overview')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
            >
              <span>Open Human OS Dashboard</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {exploreServices.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  onClick={srv.action}
                  className="rounded-2xl border border-white/[0.08] bg-[#092532] p-5 hover:border-emerald-500/40 hover:-translate-y-1 transition duration-200 cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${srv.color}`}>
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-300">
                        {srv.count}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                        {srv.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Explore</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. FEATURED JOBS & OPPORTUNITIES                         */}
      {/* ======================================================== */}
      <section className="py-14 bg-[#071F2B] border-b border-[#19414D]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-blue-400 tracking-wider uppercase">
                CAREER & TALENT
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
                Featured Vacancies in Rwanda
              </h2>
            </div>
            <button
              onClick={() => onNavigate('Career & jobs')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View all vacancies</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredJobs.slice(0, 4).map((job) => (
              <div
                key={job.id}
                onClick={() => onNavigate('Career & jobs')}
                className="rounded-2xl border border-white/[0.08] bg-[#092532] p-4 flex flex-col justify-between hover:border-blue-500/30 transition cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 font-semibold">
                      {job.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{job.posted}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <div className="text-xs text-slate-300 font-medium mt-0.5">{job.company}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin size={11} className="text-emerald-400" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                  <div className="text-xs font-bold font-mono text-emerald-400">{job.salary}</div>
                  <span className="text-[11px] font-bold text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Apply <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. RECOMMENDED RWANDAN PRODUCE & ARTISAN PRODUCTS        */}
      {/* ======================================================== */}
      <section className="py-14 bg-[#04131B] border-b border-[#19414D]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">
                MADE IN RWANDA & AGRICULTURAL ISOKO
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
                Recommended Local Produce & Crafts
              </h2>
            </div>
            <button
              onClick={() => onNavigate('Marketplace')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Browse entire marketplace</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                id: 101,
                name: 'Fresh Tomatoes',
                price: 'RWF 800/kg',
                seller: 'AgriFresh Rwanda',
                rating: 4.8,
                image: AGRI_ASSETS.freshTomatoes
              },
              {
                id: 102,
                name: 'Irish Potatoes',
                price: 'RWF 500/kg',
                seller: 'Mugabo Farm (Musanze)',
                rating: 4.6,
                image: AGRI_ASSETS.irishPotatoes
              },
              {
                id: 103,
                name: 'Maize Flour',
                price: 'RWF 1,200/kg',
                seller: 'Green Farms Nyagatare',
                rating: 4.7,
                image: AGRI_ASSETS.sweetBananas
              },
              {
                id: 104,
                name: 'Specialty Coffee Beans',
                price: 'RWF 4,500/kg',
                seller: 'Rwanda Specialty Coffee Co.',
                rating: 4.9,
                image: AGRI_ASSETS.coffee
              }
            ].map((prod) => (
              <div
                key={prod.id}
                onClick={() => onNavigate('Marketplace')}
                className="rounded-2xl border border-white/[0.08] bg-[#092532] overflow-hidden hover:border-emerald-500/40 transition cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative h-40 overflow-hidden bg-[#071F2B]">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#04131B]/80 backdrop-blur-sm text-[10px] font-bold text-amber-300 flex items-center gap-1">
                    <Star size={11} fill="currentColor" />
                    <span>{prod.rating}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-xs text-slate-400">{prod.seller}</div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {prod.name}
                  </h3>
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-sm font-bold font-mono text-emerald-400">{prod.price}</div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                      Order
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. CALL TO ACTION / REGISTRATION BANNER                  */}
      {/* ======================================================== */}
      <section className="py-16 bg-gradient-to-r from-[#04131B] via-[#072430] to-[#04131B] border-b border-[#19414D]/50 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles size={13} />
            <span>Join 10,000+ Rwandans Online</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Connect, Grow, and Succeed?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Whether you are looking for your next career step, selling farm harvest, hiring top talent,
            or taking skills courses — Umuhuza Connect is built for you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('signup')}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 px-6 py-3 text-sm font-bold text-[#04131B] transition shadow-lg shadow-emerald-500/25"
            >
              Create Free Account
            </button>
            <button
              onClick={() => onNavigate('Overview')}
              className="rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/10 px-6 py-3 text-sm font-semibold text-white transition"
            >
              Explore User Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. COMPREHENSIVE PUBLIC FOOTER                           */}
      {/* ======================================================== */}
      <footer className="bg-[#031720] text-slate-300 text-xs py-12 border-t border-[#19414D]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-emerald-500 text-[#04131B] flex items-center justify-center font-black">
                  <Briefcase size={16} />
                </div>
                <div className="text-base font-bold text-white tracking-tight">
                  umuhuza<span className="text-emerald-400">connect</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Rwanda&apos;s unified digital platform connecting people, jobs, businesses, products,
                services, education, and opportunities.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-sm">🇷🇼</span>
                <span className="text-xs font-semibold text-white">Together We Build Rwanda</span>
              </div>
            </div>

            <div>
              <div className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Platform</div>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('Overview')} className="hover:text-emerald-300 transition">User Dashboard</button></li>
                <li><button onClick={() => onNavigate('Career & jobs')} className="hover:text-emerald-300 transition">Find Jobs</button></li>
                <li><button onClick={() => onNavigate('Marketplace')} className="hover:text-emerald-300 transition">Marketplace (Isoko)</button></li>
                <li><button onClick={() => onNavigate('Learning')} className="hover:text-emerald-300 transition">Skills & Courses</button></li>
                <li><button onClick={() => onNavigate('Admin Center')} className="hover:text-emerald-300 transition">Admin Center</button></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Portals</div>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('Find opportunities')} className="hover:text-emerald-300 transition">Job Seeker Portal</button></li>
                <li><button onClick={() => onNavigate('Marketplace')} className="hover:text-emerald-300 transition">Seller & Farmer Portal</button></li>
                <li><button onClick={() => onNavigate('Income OS')} className="hover:text-emerald-300 transition">MoMo Invoicing</button></li>
                <li><button onClick={() => onNavigate('Network')} className="hover:text-emerald-300 transition">Community Groups</button></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Trust & Support</div>
              <ul className="space-y-2">
                <li><a href="#about" onClick={(e) => { e.preventDefault(); notify('Umuhuza Connect — Built for Rwanda'); }} className="hover:text-emerald-300 transition">About Umuhuza</a></li>
                <li><a href="#privacy" onClick={(e) => { e.preventDefault(); notify('Data Protection compliant with Rwanda NCSA regulations'); }} className="hover:text-emerald-300 transition">Privacy Policy</a></li>
                <li><a href="#terms" onClick={(e) => { e.preventDefault(); notify('Terms of Service: Fair trade and community standards'); }} className="hover:text-emerald-300 transition">Terms & Safety</a></li>
                <li><button onClick={() => onOpenAuth('signin')} className="hover:text-emerald-300 transition">Sign In</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 Umuhuza Connect. All rights reserved. Kigali, Rwanda.
            </div>
            <div className="flex items-center gap-4">
              <span>A Human OS for a Better Tomorrow</span>
              <span>•</span>
              <span>English / Ikinyarwanda</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
