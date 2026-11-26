import { useState } from 'react';
import { AgriOrder, AgriProduct, Language } from '../types/agri';
import { translations } from '../data/translations';
import {
  Search,
  Package,
  MessageCircle,
  Heart,
  Clock,
  CheckCircle2,
  MapPin,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';

export function BuyerPortal({
  orders,
  products,
  lang,
  onOpenMarketplace,
  onOpenMessages,
  onAddToCart,
  notify
}: {
  orders: AgriOrder[];
  products: AgriProduct[];
  lang: Language;
  onOpenMarketplace: () => void;
  onOpenMessages: () => void;
  onAddToCart: (p: AgriProduct, q: number) => void;
  notify: (msg: string) => void;
}) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites'>('orders');
  const [favorites, setFavorites] = useState<string[]>(['prod-01', 'prod-02', 'prod-04']);

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((x) => x !== id));
      notify(lang === 'rw' ? 'Bikuwe mu byo wakunze' : 'Removed from favorites');
    } else {
      setFavorites([...favorites, id]);
      notify(lang === 'rw' ? 'Bishyizwe mu byo wakunze' : 'Added to favorites');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-white">
      {/* Welcome Banner matching Infographic Buyer Portal */}
      <div className="bg-gradient-to-r from-[#0d281c] via-[#091f15] to-[#07160f] p-6 rounded-3xl border border-emerald-500/25 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
              <ShoppingBag size={14} />
              <span>{t.buyerPortal}</span>
            </div>
            <h1 className="text-2xl font-black text-white">{t.welcomeBuyer}</h1>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
              {lang === 'rw'
                ? 'Shakisha ibiribwa byiza bishya biturutse ku bahinzi bizerwa mu Rwanda.'
                : 'Discover fresh agricultural products from trusted Rwandan farmers & track your orders.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMarketplace}
              className="bg-emerald-500 hover:bg-emerald-400 text-[#072416] px-4 py-2.5 rounded-xl font-bold text-xs transition"
            >
              {lang === 'rw' ? 'Gura Ibiribwa' : 'Browse Products'}
            </button>
            <button
              onClick={onOpenMessages}
              className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-900/50 transition flex items-center gap-1.5"
            >
              <MessageCircle size={14} />
              <span>{t.messages}</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Nav Buttons (from Infographic) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-500/15">
          <button
            onClick={onOpenMarketplace}
            className="p-3 bg-[#0f241a]/60 hover:bg-[#0f241a] rounded-2xl border border-emerald-500/15 flex items-center gap-3 transition text-left"
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Search size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{lang === 'rw' ? 'Shaka Ibiribwa' : 'Search Products'}</div>
              <div className="text-[10px] text-emerald-400/70">{lang === 'rw' ? 'Amoko yose' : 'Direct from farm'}</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`p-3 rounded-2xl border flex items-center gap-3 transition text-left ${
              activeTab === 'orders'
                ? 'bg-emerald-500/20 border-emerald-400 text-white'
                : 'bg-[#0f241a]/60 border-emerald-500/15 hover:bg-[#0f241a]'
            }`}
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Package size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{lang === 'rw' ? 'Ibyo Natumije' : 'My Orders'}</div>
              <div className="text-[10px] text-emerald-400/70">{orders.length} {lang === 'rw' ? 'byatumijwe' : 'active orders'}</div>
            </div>
          </button>

          <button
            onClick={onOpenMessages}
            className="p-3 bg-[#0f241a]/60 hover:bg-[#0f241a] rounded-2xl border border-emerald-500/15 flex items-center gap-3 transition text-left"
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageCircle size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{t.messages}</div>
              <div className="text-[10px] text-emerald-400/70">{lang === 'rw' ? 'Abahinzi' : 'Farmer chats'}</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`p-3 rounded-2xl border flex items-center gap-3 transition text-left ${
              activeTab === 'favorites'
                ? 'bg-emerald-500/20 border-emerald-400 text-white'
                : 'bg-[#0f241a]/60 border-emerald-500/15 hover:bg-[#0f241a]'
            }`}
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Heart size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{t.favorites}</div>
              <div className="text-[10px] text-emerald-400/70">{favorites.length} {lang === 'rw' ? 'bikunzwe' : 'saved items'}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'orders' ? (
        <div className="bg-[#0b1a13] p-6 rounded-3xl border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/15 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">
                {lang === 'rw' ? 'Gukurikirana Ibyatumijwe' : 'My Orders & Real-Time Delivery Status'}
              </h2>
              <p className="text-xs text-emerald-300/70">
                {lang === 'rw' ? 'Reba aho ibiribwa watumije bigeze' : 'Monitor package preparation, courier dispatch, and fulfillment.'}
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              {orders.length} {lang === 'rw' ? 'Ibyemejwe' : 'Total'}
            </span>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 bg-[#0e2218] rounded-2xl border border-emerald-500/15 hover:border-emerald-500/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs text-white">{ord.orderNumber}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : ord.status === 'Processing'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-sky-400/20 text-sky-300 border border-sky-400/30'
                      }`}
                    >
                      {ord.status}
                    </span>
                    <span className="text-[10px] text-emerald-400/60 font-mono">{ord.createdAt}</span>
                  </div>

                  <div className="mt-2 text-xs text-emerald-100 font-medium">
                    {ord.items.map((i) => `${i.productName} (${i.quantity} ${i.unit})`).join(' · ')}
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-[11px] text-emerald-300/70">
                    <MapPin size={12} className="text-emerald-400" />
                    <span>{ord.deliveryDistrict} · {ord.deliveryAddress}</span>
                    <span>·</span>
                    <span>{ord.paymentMethod}</span>
                  </div>
                </div>

                <div className="text-right sm:self-center shrink-0 border-t sm:border-t-0 border-emerald-500/10 pt-2 sm:pt-0">
                  <div className="text-xs text-emerald-400/70 font-mono">Amount Paid:</div>
                  <div className="text-sm font-black text-white font-mono">
                    RWF {ord.totalAmount.toLocaleString()}
                  </div>
                  <button
                    onClick={() => notify(`Tracking receipt generated for ${ord.orderNumber}`)}
                    className="mt-1 text-[11px] text-emerald-400 hover:underline font-bold"
                  >
                    {lang === 'rw' ? 'Reba Inyemezabwishyu' : 'View Receipt'} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#0b1a13] p-6 rounded-3xl border border-emerald-500/20 space-y-4">
          <div className="border-b border-emerald-500/15 pb-4">
            <h2 className="text-base font-bold text-white">
              {lang === 'rw' ? 'Ibicuruzwa Wakunze' : 'Saved Favorites'}
            </h2>
            <p className="text-xs text-emerald-300/70">
              {lang === 'rw' ? 'Ibicuruzwa byihuse kugaruka kubyitegereza' : 'Quick access to your preferred fresh produce items.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products
              .filter((p) => favorites.includes(p.id))
              .map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 bg-[#0f241a] rounded-2xl border border-emerald-500/15 flex items-center gap-3 justify-between"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="h-14 w-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs text-white truncate">
                      {lang === 'rw' ? prod.nameRw : prod.name}
                    </h3>
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      RWF {prod.pricePerUnit.toLocaleString()} /{prod.unit}
                    </div>
                    <div className="text-[10px] text-emerald-300/70 truncate">{prod.location}</div>
                  </div>
                  <button
                    onClick={() => onAddToCart(prod, 1)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-[#062114] p-2 rounded-xl text-xs font-bold shrink-0"
                    title={t.addToCart}
                  >
                    +
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recommended For You Section (Matching Infographic) */}
      <div className="bg-[#0b1a13] p-6 rounded-3xl border border-emerald-500/20 space-y-4">
        <h3 className="text-sm font-bold text-white">
          {lang === 'rw' ? 'Ibyo Wagura Bikugiriye Akamaro' : 'Recommended For You in Rwanda'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {products.slice(0, 4).map((p) => (
            <div
              key={p.id}
              onClick={onOpenMarketplace}
              className="p-3 bg-[#0e2218] rounded-xl border border-emerald-500/15 hover:border-emerald-400/40 cursor-pointer transition flex flex-col justify-between"
            >
              <img src={p.image} alt={p.name} className="h-24 w-full rounded-lg object-cover mb-2" />
              <div className="font-bold text-xs text-white truncate">{lang === 'rw' ? p.nameRw : p.name}</div>
              <div className="text-[11px] font-mono text-emerald-400 font-bold mt-1">
                RWF {p.pricePerUnit.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
