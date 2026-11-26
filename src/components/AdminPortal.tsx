import { useState, useEffect } from 'react';
import { Language } from '../types/agri';
import { authStorage } from '../utils/authStorage';
import {
  Users,
  Briefcase,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  LayoutDashboard,
  Package,
  Layers,
  ShieldCheck,
  MoreVertical,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Eye,
  Crown
} from 'lucide-react';

interface Props {
  lang: Language;
  notify: (msg: string) => void;
  onSwitchToUserDashboard?: () => void;
}

export function AdminPortal({
  lang,
  notify,
  onSwitchToUserDashboard
}: Props) {
  // Admin view tabs: 'executive' (home.png / new.png) vs 'products' (uhm.jfif ShopPoint) vs 'moderation'
  const [adminTab, setAdminTab] = useState<'executive' | 'products' | 'moderation'>('executive');

  // Time Range Filter for Platform Growth
  const [growthRange, setGrowthRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Search in Recent Users table
  const [userSearch, setUserSearch] = useState('');

  // Server-verified Admin status & live telemetry
  const [serverStats, setServerStats] = useState<{
    authorized: boolean;
    registeredUsersCount: number;
    activeSessionsCount: number;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    authStorage.fetchAdminOverview().then((res) => {
      if (!mounted) return;
      if (res.authorized) {
        setServerStats({
          authorized: true,
          registeredUsersCount: res.registeredUsersCount ?? 0,
          activeSessionsCount: res.activeSessionsCount ?? 0
        });
      } else {
        setServerStats({
          authorized: false,
          registeredUsersCount: 0,
          activeSessionsCount: 0
        });
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // 12 Products for ShopPoint Product Grid (uhm.jfif)
  const [productsList, setProductsList] = useState([
    {
      id: 'p1',
      name: 'Phone 234-M',
      desc: 'Tristique sed tortur dual SIM MoMo',
      category: 'Electronics',
      available: 1235,
      sold: 235,
      regularPrice: 800,
      salePrice: 600,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'p2',
      name: 'Triple Camera - Infrared Night Vision',
      desc: 'Field monitoring camera for harvest security',
      category: 'Electronics',
      available: 1235,
      sold: 235,
      regularPrice: 800,
      salePrice: 600,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'p3',
      name: 'Reference Premiere Monitor Speakers',
      desc: 'High fidelity audio for studio recording',
      category: 'Electronics',
      available: 1235,
      sold: 235,
      regularPrice: 800,
      salePrice: 600,
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'p4',
      name: 'ELITE LCD Display Liquid CPU Cooler',
      desc: 'Cooling equipment for processing workstations',
      category: 'Electronics',
      available: 1235,
      sold: 235,
      regularPrice: 800,
      salePrice: 600,
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'p5',
      name: 'Phone 234-M Special',
      desc: 'Tristique sed tortur rugged edition',
      category: 'Electronics',
      available: 1235,
      sold: 235,
      regularPrice: 800,
      salePrice: 600,
      image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'p6',
      name: 'Smart Watches Sport Edition',
      desc: 'Health, heart rate, and GPS tracker',
      category: 'Electronics',
      available: 1235,
      sold: 235,
      regularPrice: 800,
      salePrice: 600,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'p7',
      name: 'HTC VIVE Pro 2 VR Headset - 99HASW',
      desc: 'Spatial visualization tool for education',
      category: 'Electronics',
      available: 1235,
      sold: 235,
      regularPrice: 800,
      salePrice: 600,
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'p8',
      name: 'Qwr Gaming display 25.7" 2E D2621W',
      desc: 'Full HD ultra refresh developer monitor',
      category: 'Electronics',
      available: 1235,
      sold: 235,
      regularPrice: 800,
      salePrice: 600,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'p9',
      name: 'Laptop, 16 WUXGA (1920 x 1200)',
      desc: 'Intel Core i7 16GB RAM for developers',
      category: 'Electronics',
      available: 1235,
      sold: 235,
      regularPrice: 800,
      salePrice: 600,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'p10',
      name: 'HiPad Max 10.36" 2K Screen',
      desc: 'Digital inventory tablet with stylus',
      category: 'Electronics',
      available: 1235,
      sold: 235,
      regularPrice: 800,
      salePrice: 600,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'p11',
      name: 'Quadcopter UAV with 4K Camera',
      desc: 'Agricultural crop surveying drone',
      category: 'Electronics',
      available: 1235,
      sold: 235,
      regularPrice: 800,
      salePrice: 600,
      image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'p12',
      name: 'Phone 234 Pro max 2023 edition',
      desc: 'Titanium chassis flagship mobile',
      category: 'Electronics',
      available: 1235,
      sold: 235,
      regularPrice: 800,
      salePrice: 600,
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&auto=format&fit=crop&q=80'
    }
  ]);

  const [shopCategory, setShopCategory] = useState('Electronics');
  const [shopSort, setShopSort] = useState('Best Seller');
  const [shopPage, setShopPage] = useState(1);

  // Recent Users (Matching home.png & new.png)
  const [recentUsers, setRecentUsers] = useState([
    { id: 1, name: 'Jean Bosco', role: 'Customer', status: 'Active', joined: '2 hours ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { id: 2, name: 'Uwimana Aline', role: 'Seller', status: 'Active', joined: '4 hours ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { id: 3, name: 'Mugisha Daniel', role: 'Employer', status: 'Active', joined: '6 hours ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
    { id: 4, name: 'Niyigena Pascal', role: 'Trader', status: 'Active', joined: '8 hours ago', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' },
    { id: 5, name: 'Mukamana Claudine', role: 'Customer', status: 'Active', joined: '12 hours ago', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' }
  ]);

  // Recent Job Applications (Matching home.png & new.png)
  const [recentApplications, setRecentApplications] = useState([
    { id: 1, applicant: 'Irakoze Jean', title: 'Software Developer', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80' },
    { id: 2, applicant: 'Uwimana Aline', title: 'UI/UX Designer', status: 'Accepted', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { id: 3, applicant: 'Mugisha Daniel', title: 'Backend Developer', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
    { id: 4, applicant: 'Niyigena Pascal', title: 'Graphic Designer', status: 'Rejected', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' },
    { id: 5, applicant: 'Mukamana Claudine', title: 'Marketing Assistant', status: 'Accepted', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' }
  ]);

  const handleUpdateAppStatus = (id: number, newStatus: 'Accepted' | 'Rejected') => {
    setRecentApplications(
      recentApplications.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    notify(`Application status updated to ${newStatus}`);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setProductsList(productsList.filter((p) => p.id !== id));
    notify(`Product "${name}" removed from catalog.`);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans animate-in fade-in duration-200">
      {/* ======================================================== */}
      {/* TOP BAR / SUB-NAVIGATION CONTROLS                        */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-purple-500/25 bg-[#071F2B] p-5 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Good morning, Admin</span>
              <span className="text-2xl">👋</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold border border-purple-500/30">
              Executive
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Here&apos;s what&apos;s happening on Umuhuza Connect today.
            {serverStats?.authorized && (
              <span className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-mono text-emerald-300">
                <ShieldCheck size={12} />
                Server Verified · {serverStats.registeredUsersCount} Accounts · {serverStats.activeSessionsCount} Active Sessions
              </span>
            )}
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-[#092532] p-1 rounded-2xl border border-white/10 flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setAdminTab('executive')}
              className={`px-3 py-1.5 rounded-xl transition ${
                adminTab === 'executive'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Executive Dashboard
            </button>
            <button
              onClick={() => setAdminTab('products')}
              className={`px-3 py-1.5 rounded-xl transition ${
                adminTab === 'products'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛍️ ShopPoint Grid (Image 4)
            </button>
          </div>

          {onSwitchToUserDashboard && (
            <button
              onClick={onSwitchToUserDashboard}
              className="flex items-center gap-1.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/15 hover:bg-emerald-500/25 px-3 py-2 text-xs font-bold text-emerald-300 transition shadow-sm"
              title="Switch to User Dashboard"
            >
              <LayoutDashboard size={14} />
              <span>User Dashboard</span>
            </button>
          )}

          <button
            onClick={() => notify('Downloading full platform PDF executive report...')}
            className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-3.5 py-2 text-xs font-bold text-white transition shadow-lg shadow-purple-900/30"
          >
            <Download size={13} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW A: EXECUTIVE DASHBOARD (Matching home.png & new.png) */}
      {/* ======================================================== */}
      {adminTab === 'executive' && (
        <div className="space-y-6">
          {/* 1. FOUR METRIC CARDS (Exact match from home.png & new.png) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CARD 1: TOTAL USERS (Green) */}
            <div className="rounded-2xl border border-emerald-500/30 bg-[#092532] p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-300">Total Users</div>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Users size={18} />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-mono mt-2 tracking-tight">
                12,458
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 font-mono">
                <ArrowUpRight size={14} />
                <span>+12% this month</span>
              </div>
              <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />
            </div>

            {/* CARD 2: TOTAL JOBS (Blue) */}
            <div className="rounded-2xl border border-blue-500/30 bg-[#092532] p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-300">Total Jobs</div>
                <div className="h-8 w-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Briefcase size={18} />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-mono mt-2 tracking-tight">
                342
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-400 font-mono">
                <ArrowUpRight size={14} />
                <span>+8% this month</span>
              </div>
              <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-blue-500/5 blur-xl pointer-events-none" />
            </div>

            {/* CARD 3: TOTAL LISTINGS (Orange) */}
            <div className="rounded-2xl border border-amber-500/30 bg-[#092532] p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-300">Total Listings</div>
                <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ShoppingBag size={18} />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-mono mt-2 tracking-tight">
                1,206
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-400 font-mono">
                <ArrowUpRight size={14} />
                <span>+15% this month</span>
              </div>
              <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />
            </div>

            {/* CARD 4: TOTAL ORDERS (Purple) */}
            <div className="rounded-2xl border border-purple-500/30 bg-[#092532] p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-300">Total Orders</div>
                <div className="h-8 w-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <ShoppingCart size={18} />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-mono mt-2 tracking-tight">
                892
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-purple-400 font-mono">
                <ArrowUpRight size={14} />
                <span>+10% this month</span>
              </div>
              <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-purple-500/5 blur-xl pointer-events-none" />
            </div>
          </div>

          {/* 2. CHARTS ROW: Platform Growth (Line) + Users by Role (Donut) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* PLATFORM GROWTH LINE CHART (Matching home.png & new.png) */}
            <div className="lg:col-span-8 rounded-3xl border border-[#19414D] bg-[#092532] p-5 sm:p-6 space-y-4 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Platform Growth</h3>
                  <p className="text-xs text-slate-400">Users, Jobs, and Orders across Rwandan sectors.</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Legend */}
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <span>Users</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                      <span>Jobs</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                      <span className="h-2.5 w-2.5 rounded-full bg-purple-400" />
                      <span>Orders</span>
                    </span>
                  </div>

                  <select
                    value={growthRange}
                    onChange={(e) => setGrowthRange(e.target.value as any)}
                    className="bg-[#071F2B] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>
              </div>

              {/* Custom SVG Line Chart */}
              <div className="relative pt-4 pb-2">
                <svg viewBox="0 0 600 200" className="w-full h-48 overflow-visible">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="580" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="40" y1="65" x2="580" y2="65" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="40" y1="110" x2="580" y2="110" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="40" y1="155" x2="580" y2="155" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

                  {/* Y Axis Labels */}
                  <text x="5" y="24" fill="#64748b" fontSize="10" fontFamily="monospace">1,000</text>
                  <text x="15" y="69" fill="#64748b" fontSize="10" fontFamily="monospace">750</text>
                  <text x="15" y="114" fill="#64748b" fontSize="10" fontFamily="monospace">500</text>
                  <text x="15" y="159" fill="#64748b" fontSize="10" fontFamily="monospace">250</text>
                  <text x="25" y="195" fill="#64748b" fontSize="10" fontFamily="monospace">0</text>

                  {/* Users Line (Green) */}
                  <path
                    d="M 50,150 Q 130,120 210,135 T 370,85 T 480,50 T 560,40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Jobs Line (Blue) */}
                  <path
                    d="M 50,170 Q 130,150 210,140 T 370,110 T 480,95 T 560,75"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Orders Line (Purple) */}
                  <path
                    d="M 50,180 Q 130,165 210,160 T 370,130 T 480,120 T 560,105"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Data Point Dots */}
                  {[
                    { cx: 50, cy: 150 }, { cx: 135, cy: 125 }, { cx: 220, cy: 136 },
                    { cx: 305, cy: 110 }, { cx: 390, cy: 75 }, { cx: 475, cy: 52 }, { cx: 560, cy: 40 }
                  ].map((pt, i) => (
                    <circle key={i} cx={pt.cx} cy={pt.cy} r="4" fill="#10b981" stroke="#092532" strokeWidth="2" />
                  ))}

                  {/* X Axis Date Labels */}
                  <text x="40" y="195" fill="#64748b" fontSize="10" fontFamily="monospace">16 Oct</text>
                  <text x="125" y="195" fill="#64748b" fontSize="10" fontFamily="monospace">17 Oct</text>
                  <text x="210" y="195" fill="#64748b" fontSize="10" fontFamily="monospace">18 Oct</text>
                  <text x="295" y="195" fill="#64748b" fontSize="10" fontFamily="monospace">19 Oct</text>
                  <text x="380" y="195" fill="#64748b" fontSize="10" fontFamily="monospace">20 Oct</text>
                  <text x="465" y="195" fill="#64748b" fontSize="10" fontFamily="monospace">21 Oct</text>
                  <text x="550" y="195" fill="#64748b" fontSize="10" fontFamily="monospace">22 Oct</text>
                </svg>
              </div>

              <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-xs text-slate-400">
                <span>Data refreshed 2 minutes ago</span>
                <button
                  onClick={() => notify('Detailed analytics view')}
                  className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>View details</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* USERS BY ROLE DONUT CHART (Matching home.png & new.png) */}
            <div className="lg:col-span-4 rounded-3xl border border-[#19414D] bg-[#092532] p-5 sm:p-6 space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white tracking-tight">Users by Role</h3>
                <button
                  onClick={() => notify('User demographic details')}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  View details →
                </button>
              </div>

              {/* Donut Graphic */}
              <div className="relative h-44 flex items-center justify-center">
                <svg className="h-40 w-40 -rotate-90" viewBox="0 0 100 100">
                  {/* Customers 48% (Cyan) */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#06b6d4" strokeWidth="16" strokeDasharray="114 239" strokeDashoffset="0" />
                  {/* Sellers 22% (Green) */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="16" strokeDasharray="52 239" strokeDashoffset="-114" />
                  {/* Employers 12% (Orange) */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="16" strokeDasharray="29 239" strokeDashoffset="-166" />
                  {/* Traders 8% (Pink/Purple) */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#ec4899" strokeWidth="16" strokeDasharray="19 239" strokeDashoffset="-195" />
                  {/* Admins 5% (Yellow) */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#eab308" strokeWidth="16" strokeDasharray="12 239" strokeDashoffset="-214" />
                  {/* Others 5% (Slate) */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#64748b" strokeWidth="16" strokeDasharray="12 239" strokeDashoffset="-226" />
                </svg>

                {/* Donut Center Label */}
                <div className="absolute text-center">
                  <div className="text-base font-black text-white font-mono">12,458</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Users</div>
                </div>
              </div>

              {/* Role Breakdown Legend (Exact percentages from new.png) */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/[0.05]">
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/[0.02]">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-[#06b6d4]" />
                    <span>Customers</span>
                  </span>
                  <span className="font-mono font-bold text-white">48%</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/[0.02]">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                    <span>Sellers</span>
                  </span>
                  <span className="font-mono font-bold text-white">22%</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/[0.02]">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                    <span>Employers</span>
                  </span>
                  <span className="font-mono font-bold text-white">12%</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/[0.02]">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-[#ec4899]" />
                    <span>Traders</span>
                  </span>
                  <span className="font-mono font-bold text-white">8%</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/[0.02]">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-[#eab308]" />
                    <span>Admins</span>
                  </span>
                  <span className="font-mono font-bold text-white">5%</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/[0.02]">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-[#64748b]" />
                    <span>Others</span>
                  </span>
                  <span className="font-mono font-bold text-white">5%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. TWO DATA TABLES: Recent Users + Recent Job Applications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RECENT USERS TABLE (Exact names from new.png) */}
            <div className="rounded-3xl border border-[#19414D] bg-[#092532] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white tracking-tight">Recent Users</h3>
                <button
                  onClick={() => notify('Users management table')}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  View all →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-slate-400 font-mono">
                      <th className="pb-2.5">Name</th>
                      <th className="pb-2.5">Role</th>
                      <th className="pb-2.5">Status</th>
                      <th className="pb-2.5 text-right">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {recentUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition">
                        <td className="py-2.5 font-semibold text-white flex items-center gap-2">
                          <img src={u.avatar} alt={u.name} className="h-7 w-7 rounded-full object-cover border border-white/10" />
                          <span>{u.name}</span>
                        </td>
                        <td className="py-2.5 text-slate-300">{u.role}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-[10px] font-bold">
                            {u.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-slate-400 font-mono text-[11px]">{u.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RECENT JOB APPLICATIONS TABLE (Exact names from new.png) */}
            <div className="rounded-3xl border border-[#19414D] bg-[#092532] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white tracking-tight">Recent Job Applications</h3>
                <button
                  onClick={() => notify('Job applications pipeline')}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  View all →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-slate-400 font-mono">
                      <th className="pb-2.5">Applicant</th>
                      <th className="pb-2.5">Job Title</th>
                      <th className="pb-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {recentApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-white/[0.02] transition">
                        <td className="py-2.5 font-semibold text-white flex items-center gap-2">
                          <img src={app.avatar} alt={app.applicant} className="h-7 w-7 rounded-full object-cover border border-white/10" />
                          <span>{app.applicant}</span>
                        </td>
                        <td className="py-2.5 text-slate-300">{app.title}</td>
                        <td className="py-2.5 text-right">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                              app.status === 'Accepted'
                                ? 'bg-emerald-500/15 text-emerald-300'
                                : app.status === 'Rejected'
                                ? 'bg-rose-500/15 text-rose-300'
                                : 'bg-amber-500/15 text-amber-300'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 4. FOUR ADMINISTRATIVE QUICK ACTIONS (Matching home.png & new.png) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => notify('Opening User Management directory')}
              className="rounded-2xl border border-white/[0.08] bg-[#071F2B] p-4 text-left hover:border-emerald-500/40 hover:bg-[#092532] transition group"
            >
              <div className="h-9 w-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Users size={18} />
              </div>
              <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Manage Users
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                View and control all registered accounts
              </div>
            </button>

            <button
              onClick={() => notify('Opening Vacancies & Recruitment pipeline')}
              className="rounded-2xl border border-white/[0.08] bg-[#071F2B] p-4 text-left hover:border-emerald-500/40 hover:bg-[#092532] transition group"
            >
              <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Briefcase size={18} />
              </div>
              <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Manage Jobs
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Review and moderate job opportunities
              </div>
            </button>

            <button
              onClick={() => setAdminTab('products')}
              className="rounded-2xl border border-white/[0.08] bg-[#071F2B] p-4 text-left hover:border-emerald-500/40 hover:bg-[#092532] transition group"
            >
              <div className="h-9 w-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <ShoppingBag size={18} />
              </div>
              <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Manage Listings
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Approve products and services catalog
              </div>
            </button>

            <button
              onClick={() => notify('Generating system audit and analytics reports')}
              className="rounded-2xl border border-white/[0.08] bg-[#071F2B] p-4 text-left hover:border-emerald-500/40 hover:bg-[#092532] transition group"
            >
              <div className="h-9 w-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <TrendingUp size={18} />
              </div>
              <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                View Reports
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Analytics and system health audit
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW B: SHOPPOINT PRODUCT GRID (Exact match from uhm.jfif) */}
      {/* ======================================================== */}
      {adminTab === 'products' && (
        <div className="space-y-6">
          {/* ShopPoint Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#19414D] bg-[#092532] p-5">
            <div>
              <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                SHOPPOINT INVENTORY
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Product Grid</h2>
              <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Data Refreshed</span>
                <span>•</span>
                <span>September 28, 2023 12:35 PM</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <select
                value={shopCategory}
                onChange={(e) => setShopCategory(e.target.value)}
                className="bg-[#071F2B] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
              >
                <option value="Electronics">Product Category: Electronics</option>
                <option value="Agriculture">Product Category: Agriculture</option>
                <option value="Artisan">Product Category: Artisan Made</option>
              </select>

              <select
                value={shopSort}
                onChange={(e) => setShopSort(e.target.value)}
                className="bg-[#071F2B] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
              >
                <option value="Best Seller">Sort by: Best Seller</option>
                <option value="Price Low">Price: Low to High</option>
                <option value="Price High">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* 12 Cards Grid (Exact layout from uhm.jfif) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {productsList.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl border border-white/[0.08] bg-[#071F2B] overflow-hidden flex flex-col justify-between hover:border-purple-500/40 transition group"
              >
                {/* Product Thumbnail */}
                <div className="relative h-32 bg-[#05141e] p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                  <button
                    onClick={() => notify(`Settings menu for ${prod.name}`)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-white"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{prod.desc}</p>
                  </div>

                  <div className="space-y-0.5 text-[10px] font-mono pt-1 border-t border-white/[0.04]">
                    <div className="text-slate-400">Available: <span className="text-slate-200 font-bold">{prod.available}</span></div>
                    <div className="text-slate-400">Already sold: <span className="text-slate-200 font-bold">{prod.sold}</span></div>
                    <div className="text-slate-400">Regular Price: <span className="line-through">${prod.regularPrice}</span></div>
                    <div className="text-emerald-400 font-bold">Sale Price: ${prod.salePrice}</div>
                  </div>

                  <div className="pt-2 flex items-center gap-1.5">
                    <button
                      onClick={() => notify(`Editing product ${prod.name}`)}
                      className="flex-1 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 text-[10px] font-bold transition text-center"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id, prod.name)}
                      className="flex-1 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-[10px] font-bold transition text-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination (1, 2, 3, >> matching uhm.jfif) */}
          <div className="flex items-center justify-between pt-2 text-xs">
            <div className="text-slate-400 font-mono">
              Showing 1-12 of 48 items
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setShopPage(page)}
                  className={`h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center transition ${
                    shopPage === page
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-[#071F2B] border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setShopPage(2)}
                className="h-7 px-2 rounded-lg bg-[#071F2B] border border-white/10 text-slate-300 hover:bg-white/10 text-xs font-bold transition"
              >
                »
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
