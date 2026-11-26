import { useState } from 'react';
import { LiveEconomySnapshot, LiveNewsItem } from '../utils/realtimeClient';
import {
  Radio,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Globe,
  ExternalLink,
  Newspaper,
  DollarSign,
  Landmark
} from 'lucide-react';

interface LiveMarketNewsBoardProps {
  economy: LiveEconomySnapshot | null;
  news: LiveNewsItem[];
  onlineUsersCount?: number;
  onRefresh: () => Promise<void>;
  compact?: boolean;
}

export function LiveMarketNewsBoard({
  economy,
  news,
  onlineUsersCount = 1,
  onRefresh,
  compact = false
}: LiveMarketNewsBoardProps) {
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const sources = ['All', 'IGIHE', 'The New Times', 'Google News', 'KT Press', 'BBC Africa'];
  const filteredNews =
    selectedSource === 'All' ? news : news.filter((item) => item.source === selectedSource);

  const sourceBadgeColor = (src: LiveNewsItem['source']) => {
    switch (src) {
      case 'IGIHE':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'The New Times':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Google News':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'KT Press':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
      default:
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <section className="rounded-3xl border border-[#19414D] bg-[#071F2B] p-5 sm:p-6 space-y-6 shadow-xl">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <Radio size={14} className="animate-pulse text-emerald-400" />
            <span>LIVE RWANDA &amp; GLOBAL MARKET PULSE</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] border border-emerald-500/25">
              {onlineUsersCount} Online
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Real-Time Economic Rates &amp; News Broadcasting
          </h2>
          <p className="text-xs text-slate-400">
            Live exchange rates, Kigali &amp; world commodity prices, plus live broadcasts from IGIHE, The New Times, Google News, KT Press &amp; BBC Africa.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 hover:bg-emerald-500/25 px-4 py-2 text-xs font-bold text-emerald-300 transition shrink-0 disabled:opacity-60"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Syncing Live Feeds...' : 'Sync Live Data'}</span>
        </button>
      </div>

      {/* Live FX & Rwanda Macro Strip */}
      {economy && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              label: 'USD / RWF',
              val: `${economy.fxRates.rwfPerUsd.toLocaleString()} RWF`,
              sub: '1 US Dollar',
              icon: DollarSign,
              accent: 'text-emerald-400'
            },
            {
              label: 'EUR / RWF',
              val: `${economy.fxRates.rwfPerEur.toLocaleString()} RWF`,
              sub: '1 Euro',
              icon: Globe,
              accent: 'text-blue-400'
            },
            {
              label: 'KES / RWF',
              val: `${economy.fxRates.rwfPerKes.toLocaleString()} RWF`,
              sub: '1 Kenyan Shilling',
              icon: TrendingUp,
              accent: 'text-teal-400'
            },
            {
              label: 'GBP / RWF',
              val: `${economy.fxRates.rwfPerGbp.toLocaleString()} RWF`,
              sub: '1 British Pound',
              icon: Globe,
              accent: 'text-purple-400'
            },
            {
              label: `Rwanda GDP (${economy.rwandaMacro.gdpYear})`,
              val: `+${economy.rwandaMacro.gdpGrowthPct}%`,
              sub: 'World Bank Annual Growth',
              icon: Landmark,
              accent: 'text-emerald-400'
            },
            {
              label: `Rwanda CPI (${economy.rwandaMacro.inflationYear})`,
              val: `${economy.rwandaMacro.inflationPct}%`,
              sub: economy.fxRates.fxProvider.split(' ')[0],
              icon: TrendingUp,
              accent: 'text-amber-400'
            }
          ].map((tile, idx) => {
            const Icon = tile.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] bg-[#092532] p-3.5 space-y-1"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>{tile.label}</span>
                  <Icon size={13} className={tile.accent} />
                </div>
                <div className="text-sm sm:text-base font-black text-white font-mono">
                  {tile.val}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{tile.sub}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Split: Rwanda vs World Market Prices + Live News Broadcasters */}
      <div className={`grid grid-cols-1 ${compact ? 'lg:grid-cols-12' : 'lg:grid-cols-12'} gap-6`}>
        {/* LEFT: Rwanda & World Economic Commodity Prices */}
        <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#092532] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe size={15} className="text-emerald-400" />
                <span>Rwanda &amp; World Market Prices</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Live Kigali wholesale benchmarks vs global futures parity
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
              {economy?.sourceStatus === 'live' ? 'LIVE FEED' : 'SYNCED'}
            </span>
          </div>

          <div className="space-y-2.5">
            {(economy?.commodities || []).map((cmd) => {
              const isUp = cmd.changePct24h >= 0;
              return (
                <div
                  key={cmd.id}
                  className="rounded-xl border border-white/[0.06] bg-[#071F2B] p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{cmd.commodity}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {cmd.rwandaMarketName} · {cmd.source}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {cmd.globalBenchmarkLabel}: ${cmd.globalPriceUsd.toLocaleString()} (≈ RWF{' '}
                      {cmd.globalEquivalentRwfPerKg.toLocaleString()})
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-black font-mono text-emerald-400">
                      RWF {cmd.rwandaPriceRwf.toLocaleString()}/{cmd.rwandaUnit}
                    </div>
                    <div
                      className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-bold mt-0.5 ${
                        isUp ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      <span>
                        {isUp ? '+' : ''}
                        {cmd.changePct24h}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Real-Time News Broadcasting (Google News, IGIHE, The New Times, KT Press, BBC) */}
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#092532] p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Newspaper size={15} className="text-emerald-400" />
                <span>Live Rwanda &amp; World News Broadcasts</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Real-time headlines from IGIHE, The New Times, Google News, KT Press &amp; BBC Africa
              </p>
            </div>
          </div>

          {/* Broadcaster Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {sources.map((src) => (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition border ${
                  selectedSource === src
                    ? 'bg-emerald-500 text-[#04131B] border-emerald-400 font-bold'
                    : 'bg-[#071F2B] text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {src}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {filteredNews.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                Fetching live headlines from IGIHE, The New Times, and Google News...
              </div>
            ) : (
              filteredNews.slice(0, compact ? 6 : 10).map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-white/[0.06] bg-[#071F2B] p-3 hover:border-emerald-500/40 hover:bg-[#0a2735] transition group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[10px]">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold border ${sourceBadgeColor(
                            item.source
                          )}`}
                        >
                          {item.source}
                        </span>
                        <span className="text-slate-400 font-mono">{item.category}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 font-mono">{item.publishedAt}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-300 transition leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                    <ExternalLink
                      size={14}
                      className="text-slate-500 group-hover:text-emerald-400 shrink-0 mt-1"
                    />
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
