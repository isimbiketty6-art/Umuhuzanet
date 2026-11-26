import { useState } from 'react';
import { Job, Product } from '../types';
import { Language } from '../types/agri';
import { AGRI_ASSETS } from '../data/assets';
import {
  Briefcase,
  ShoppingBag,
  Users,
  Search,
  MapPin,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  Filter,
  DollarSign,
  Package,
  Star,
  MessageCircle,
  Truck
} from 'lucide-react';

interface Props {
  initialPortal?: 'seeker' | 'seller' | 'connection';
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onOpenMessageWith: (sellerName: string, role: string) => void;
  notify: (msg: string) => void;
}

export function DedicatedPortalsView({
  initialPortal = 'seeker',
  jobs,
  onSelectJob,
  onOpenMessageWith,
  notify
}: Props) {
  const [activePortal, setActivePortal] = useState<'seeker' | 'seller' | 'connection'>(initialPortal);

  // Job Seeker Filter
  const [selectedPill, setSelectedPill] = useState('All');
  const [jobKeyword, setJobKeyword] = useState('');
  const [jobLocation, setJobLocation] = useState('All Locations');

  // Seller Portal Orders
  const [sellerOrders, setSellerOrders] = useState([
    { id: 'ord-101', customer: 'Jean Bosco (Gasabo)', product: 'Fresh Tomatoes 50kg', amount: 'RWF 40,000', status: 'Pending' },
    { id: 'ord-102', customer: 'Uwimana Aline (Kicukiro)', product: 'Irish Potatoes 100kg', amount: 'RWF 50,000', status: 'Shipped' },
    { id: 'ord-103', customer: 'Mugisha Daniel (Musanze)', product: 'Maize Flour 25kg', amount: 'RWF 30,000', status: 'Delivered' }
  ]);

  const updateOrderStatus = (id: string, newStatus: string) => {
    setSellerOrders(
      sellerOrders.map((ord) => (ord.id === id ? { ...ord, status: newStatus } : ord))
    );
    notify(`Order ${id} marked as ${newStatus}`);
  };

  // Top Sellers for Buyer-Seller Connection (from home.png)
  const topSellers = [
    {
      id: 1,
      name: 'GreenFarm Cooperative',
      district: 'Kigali & Rwamagana',
      category: 'Fresh Vegetables & Maize',
      rating: 4.8,
      reviews: 132,
      badge: 'Verified Coop',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      name: 'Rwanda AgriCo Ltd',
      district: 'Ruhango & Huye',
      category: 'Organic Coffee & Seeds',
      rating: 4.9,
      reviews: 215,
      badge: 'Certified Exporter',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      name: 'FreshFoods Ltd',
      district: 'Musanze & Rubavu',
      category: 'Irish Potatoes & Fruits',
      rating: 4.7,
      reviews: 98,
      badge: 'Cold Chain Verified',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans animate-in fade-in duration-200">
      {/* Portal Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#071F2B] p-3 rounded-2xl border border-[#19414D]">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            <Users size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Specialized Portals</h2>
            <p className="text-[11px] text-slate-400">Direct workflows for Rwandan participants</p>
          </div>
        </div>

        <div className="bg-[#092532] p-1 rounded-xl border border-white/10 flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={() => setActivePortal('seeker')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activePortal === 'seeker'
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💼 Job Seeker Portal
          </button>
          <button
            onClick={() => setActivePortal('seller')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activePortal === 'seller'
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌾 Seller & Farmer Portal
          </button>
          <button
            onClick={() => setActivePortal('connection')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activePortal === 'connection'
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🤝 Buyer - Seller Connection
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. JOB SEEKER PORTAL (Matching home.png bottom right)     */}
      {/* ======================================================== */}
      {activePortal === 'seeker' && (
        <div className="space-y-6 rounded-3xl border border-[#19414D] bg-[#092532] p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
            <div>
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                TALENT GATEWAY
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Find Your Next Opportunity
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Explore jobs, apply with one click, and build your career in Rwanda.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-mono font-bold">
                6 Active Vacancies
              </span>
            </div>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3.5 text-slate-400" />
              <input
                type="text"
                value={jobKeyword}
                onChange={(e) => setJobKeyword(e.target.value)}
                placeholder="Search jobs, skills, roles..."
                className="w-full bg-[#071F2B] border border-white/10 pl-10 pr-3 py-2 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none"
              />
            </div>

            <div className="relative flex items-center">
              <MapPin size={16} className="absolute left-3.5 text-emerald-400" />
              <select
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                className="w-full bg-[#071F2B] border border-white/10 pl-10 pr-8 py-2 rounded-xl text-xs text-slate-200 outline-none cursor-pointer"
              >
                <option value="All Locations">All Locations</option>
                <option value="Kigali">Kigali</option>
                <option value="Musanze">Musanze</option>
                <option value="Huye">Huye</option>
                <option value="Rubavu">Rubavu</option>
              </select>
            </div>

            <button
              onClick={() => notify(`Searching for "${jobKeyword || 'all'}" in ${jobLocation}`)}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Search size={14} />
              <span>Search Opportunities</span>
            </button>
          </div>

          {/* Category Filter Pills (from home.png) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {['All', 'IT & Tech', 'Agriculture', 'Education', 'Health', 'Trade', 'Others'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedPill(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  selectedPill === cat
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-[#071F2B] text-slate-300 hover:bg-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Job Cards */}
          <div className="space-y-3 pt-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-white/[0.08] bg-[#071F2B] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500/30 transition group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="h-11 w-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center font-bold text-blue-400 shrink-0">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} className="h-6 w-6 rounded object-cover" />
                    ) : (
                      job.company.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                      {job.title}
                    </h3>
                    <div className="text-xs text-slate-300 mt-0.5">{job.company}</div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-emerald-400" />
                        <span>{job.location}</span>
                      </span>
                      <span>•</span>
                      <span>{job.type}</span>
                      <span>•</span>
                      <span>{job.posted}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.05]">
                  <div className="text-xs font-bold font-mono text-emerald-400">{job.salary}</div>
                  <button
                    onClick={() => onSelectJob(job)}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SELLER & FARMER PORTAL (Matching home.png bottom)      */}
      {/* ======================================================== */}
      {activePortal === 'seller' && (
        <div className="space-y-6 rounded-3xl border border-[#19414D] bg-[#092532] p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                FARMER & MERCHANT PORTAL
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Manage Your Products & Orders
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Track harvest sales, buyer dispatches, and MTN Mobile Money revenues.
              </p>
            </div>
            <button
              onClick={() => notify('Add product modal opened')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#04131B] text-xs font-bold transition shadow-sm"
            >
              + List New Produce
            </button>
          </div>

          {/* 3 Metrics (Matching home.png: Products 12, Orders 8, Revenue RWF 1,250,000) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-emerald-500/30 bg-[#071F2B] p-4">
              <div className="text-xs text-slate-400">Total Products Listed</div>
              <div className="text-2xl font-black text-white font-mono mt-1">12</div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1">4 Harvests in stock</div>
            </div>

            <div className="rounded-2xl border border-blue-500/30 bg-[#071F2B] p-4">
              <div className="text-xs text-slate-400">Total Orders Received</div>
              <div className="text-2xl font-black text-white font-mono mt-1">8</div>
              <div className="text-[11px] text-blue-400 font-medium mt-1">1 Pending shipment</div>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-[#071F2B] p-4">
              <div className="text-xs text-slate-400">Gross Farm Revenue</div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">RWF 1,250,000</div>
              <div className="text-[11px] text-amber-300 font-medium mt-1">Settled via MTN MoMo</div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white tracking-tight">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400 font-mono">
                    <th className="pb-2.5">Buyer</th>
                    <th className="pb-2.5">Produce Item</th>
                    <th className="pb-2.5">Total (RWF)</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {sellerOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 font-semibold text-white">{ord.customer}</td>
                      <td className="py-3 text-slate-300">{ord.product}</td>
                      <td className="py-3 font-mono text-emerald-400 font-bold">{ord.amount}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : ord.status === 'Shipped'
                              ? 'bg-blue-500/15 text-blue-300'
                              : 'bg-amber-500/15 text-amber-300'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                          className="bg-[#071F2B] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-slate-200 outline-none cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. BUYER - SELLER CONNECTION (home.png bottom right)      */}
      {/* ======================================================== */}
      {activePortal === 'connection' && (
        <div className="space-y-6 rounded-3xl border border-[#19414D] bg-[#092532] p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                SUPPLIER NETWORK
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Find Trusted Sellers & Suppliers
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Connect directly with farmers, cooperatives and verified Rwandan food distributors.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold">
                100% Escrow Protected
              </span>
            </div>
          </div>

          {/* Supplier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topSellers.map((seller) => (
              <div
                key={seller.id}
                className="rounded-2xl border border-white/[0.08] bg-[#071F2B] p-5 flex flex-col justify-between hover:border-amber-500/30 transition group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      className="h-12 w-12 rounded-xl object-cover border border-white/10"
                    />
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      {seller.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {seller.name}
                    </h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-emerald-400" />
                      <span>{seller.district}</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-2 font-medium">
                      {seller.category}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-amber-300 font-semibold pt-1">
                    <Star size={13} fill="currentColor" />
                    <span>{seller.rating}</span>
                    <span className="text-slate-400 font-normal">({seller.reviews} verified reviews)</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center gap-2">
                  <button
                    onClick={() => onOpenMessageWith(seller.name, 'Seller')}
                    className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#04131B] text-xs font-bold transition text-center shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle size={14} />
                    <span>Contact Seller</span>
                  </button>
                  <button
                    onClick={() => notify(`Viewing wholesale harvest catalog for ${seller.name}`)}
                    className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white text-xs font-semibold transition"
                  >
                    Catalog
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
