import { useState } from 'react';
import { Language, AgriCategory } from '../types/agri';
import { translations } from '../data/translations';
import { AGRI_ASSETS } from '../data/assets';
import {
  Search,
  Sprout,
  Users,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export function Hero({
  lang,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenPortal
}: {
  lang: Language;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: AgriCategory | 'All';
  setSelectedCategory: (c: AgriCategory | 'All') => void;
  onOpenPortal: (p: any) => void;
}) {
  const t = translations[lang];

  const categories: { label: AgriCategory; labelRw: string; icon: string }[] = [
    { label: 'Vegetables', labelRw: 'Imboga', icon: '🍅' },
    { label: 'Fruits', labelRw: 'Imbuto', icon: '🍌' },
    { label: 'Grains & Cereals', labelRw: 'Impeke', icon: '🌾' },
    { label: 'Livestock', labelRw: 'Amatungo', icon: '🐄' },
    { label: 'Dairy Products', labelRw: 'Amata', icon: '🥛' },
    { label: 'Seeds & Inputs', labelRw: 'Imbuto zo gutera', icon: '🌱' },
    { label: 'Processed Foods', labelRw: 'Ibiribwa bitunganije', icon: '🍯' },
    { label: 'Tools & Equipment', labelRw: 'Ibikoresho', icon: '🚜' }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0a2016] via-[#091811] to-[#07130d] border-b border-emerald-500/20 text-white">
      {/* 4 Value Pillars Strip (From Infographic Top Bar) */}
      <div className="border-b border-emerald-500/15 bg-emerald-950/40">
        <div className="max-w-7xl mx-auto px-4 py-2.5 grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
          {[
            { title: t.supportFarmers, icon: Sprout, sub: lang === 'rw' ? 'Isoko ryagutse' : 'Direct fair pricing' },
            { title: t.growBusinesses, icon: ShoppingBag, sub: lang === 'rw' ? 'Ibicuruzwa byinshi' : 'Wholesale & retail' },
            { title: t.connectCommunities, icon: Users, sub: lang === 'rw' ? 'Urugwiro n’umutekano' : '30 Districts united' },
            { title: t.boostAgriculture, icon: TrendingUp, sub: lang === 'rw' ? 'Umusaruro wiyongera' : 'Digital transformation' }
          ].map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div key={i} className="flex items-center justify-center gap-2 py-1 px-2 rounded-lg bg-emerald-900/20 border border-emerald-500/10">
                <div className="h-6 w-6 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Icon size={14} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-emerald-200 text-[11px] leading-tight">{pillar.title}</div>
                  <div className="text-[10px] text-emerald-400/70">{pillar.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hero Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & Search */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{lang === 'rw' ? 'Isoko ry’Ubuhinzi mu Rwanda' : 'Rwanda’s Modern Agricultural Marketplace'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              {t.heroHeadline}
            </h1>

            <p className="text-sm sm:text-base text-emerald-200/80 max-w-xl leading-relaxed">
              {t.heroSub}
            </p>

            {/* Main Product Search Bar */}
            <div className="bg-[#0f281d] p-2 rounded-2xl border border-emerald-500/30 shadow-xl shadow-black/40 flex flex-col sm:flex-row gap-2 max-w-xl">
              <div className="relative flex-1 flex items-center">
                <Search size={18} className="absolute left-3.5 text-emerald-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-transparent pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-emerald-300/50 outline-none"
                />
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-[#072416] px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shrink-0 shadow-md"
              >
                <span>{t.searchBtn}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Quick stats note */}
            <div className="flex items-center gap-4 text-xs text-emerald-300/80 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>320+ Verified Rwandan Farmers</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>MTN MoMo & Airtel Supported</span>
              </span>
            </div>
          </div>

          {/* Right Column: Visual Showcase Matching Infographic */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl bg-gradient-to-br from-emerald-950 to-[#071911]">
              <img
                src={AGRI_ASSETS.heroFarmer}
                alt="Rwandan female farmer with fresh produce harvest crate"
                className="w-full h-72 sm:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071911] via-black/20 to-transparent" />

              {/* Floating Pill Badges */}
              <div className="absolute bottom-4 left-4 right-4 bg-emerald-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">
                    {lang === 'rw' ? 'Ibituruka ku Murima Uyu Munsi' : 'Fresh Harvest Delivered Daily'}
                  </div>
                  <div className="text-[10px] text-emerald-300">
                    Musanze · Rubavu · Gasabo · Nyagatare · Huye
                  </div>
                </div>
                <button
                  onClick={() => onOpenPortal('seller')}
                  className="bg-emerald-500 text-[#072416] text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-400 transition"
                >
                  {lang === 'rw' ? 'Tangira Gucuruza' : 'Sell Produce'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Carousel Buttons */}
        <div className="mt-10 pt-6 border-t border-emerald-500/15">
          <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3">
            {lang === 'rw' ? 'Hitamo Icyiciro cy’Ibiribwa' : 'Explore Agricultural Categories'}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                selectedCategory === 'All'
                  ? 'bg-emerald-500 border-emerald-400 text-[#062416] font-bold shadow-md'
                  : 'bg-emerald-950/40 border-emerald-500/20 text-emerald-200 hover:bg-emerald-900/50'
              }`}
            >
              <span className="text-lg">🌿</span>
              <span className="text-[11px] font-semibold">{t.allCategories}</span>
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-500 border-emerald-400 text-[#062416] font-bold shadow-md'
                      : 'bg-emerald-950/40 border-emerald-500/20 text-emerald-200 hover:bg-emerald-900/50'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-[11px] font-semibold truncate w-full">
                    {lang === 'rw' ? cat.labelRw : cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
