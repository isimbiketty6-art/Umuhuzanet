import { useState, useMemo } from 'react';
import { Product } from '../types';
import { ASSETS } from '../data/assets';
import { Search, Plus, Send, Star, ShieldCheck, ShoppingBag, ShoppingCart } from 'lucide-react';

export function MarketplaceView({
  products,
  onOpenAddProduct,
  onOpenContactSeller,
  onAddToCart,
  notify
}: {
  products: Product[];
  onOpenAddProduct: () => void;
  onOpenContactSeller: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  notify: (msg: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const getProductImage = (prod: Product) => {
    if (prod.name.toLowerCase().includes('agaseke') || prod.category === 'Handcraft') {
      return prod.id === 2 ? ASSETS.artisanAgaseke : ASSETS.imigongoArt;
    }
    if (prod.name.toLowerCase().includes('coffee') || prod.category === 'Agriculture & Food') {
      return ASSETS.specialtyCoffee;
    }
    return null;
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery = `${p.name} ${p.seller} ${p.sellerLocation} ${p.category} ${p.description}`
        .toLowerCase()
        .includes(query.toLowerCase());
      if (!matchQuery) return false;

      if (category !== 'All' && p.category !== category) return false;

      return true;
    });
  }, [products, query, category]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/[0.08] bg-panel/75 p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-mint mb-1">
            <ShoppingBag size={14} />
            <span>Made in Rwanda Storefront & Artisan Commerce</span>
          </div>
          <h1 className="text-lg font-bold text-white">Authentic Rwandan Crafts, Coffee & Digital Services</h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Direct trade connecting local cooperatives, craftsmen, and freelance creators with verified buyers.
          </p>
        </div>
        <button
          onClick={onOpenAddProduct}
          className="flex items-center gap-2 rounded-xl bg-mint px-4 py-2.5 text-xs font-bold text-[#07211e] hover:bg-emerald-300 transition shrink-0"
        >
          <Plus size={14} /> List Product / Service
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Agaseke baskets, Bourbon coffee, UI design, web development..."
            className="w-full rounded-xl border border-white/10 bg-[#0d1524] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 outline-none focus:border-mint/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            'All',
            'Handcraft',
            'Agriculture & Food',
            'Design service',
            'Digital service'
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition ${
                category === cat
                  ? 'bg-mint/15 text-mint font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((p) => {
          const imgUrl = getProductImage(p);

          return (
            <article
              key={p.id}
              className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-panel/75 flex flex-col justify-between hover:border-white/15 transition"
            >
              <div>
                {/* Media frame */}
                <div className="relative h-48 w-full overflow-hidden bg-[#0c1524]">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-mint/10 via-panel to-indigo-500/10 text-4xl text-mint">
                      <span>{p.icon}</span>
                      <span className="mt-2 text-xs font-semibold text-slate-400">{p.category}</span>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-[10px] font-medium text-slate-200 backdrop-blur-md">
                    {p.category}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-amber-300 backdrop-blur-md font-mono">
                    <Star size={11} fill="currentColor" /> {p.rating.toFixed(1)}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="font-bold text-white text-sm group-hover:text-mint transition line-clamp-1">
                    {p.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <span>{p.seller}</span>
                    <span aria-hidden="true">·</span>
                    <span>{p.sellerLocation}</span>
                  </div>

                  <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Lead time: {p.leadTime}</span>
                    <span aria-hidden="true">·</span>
                    <span>{p.salesCount} sold</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between border-t border-white/[0.06] p-5 bg-[#090e18]/40">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Price</span>
                  <span className="text-sm font-bold text-mint font-mono">{p.price}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenContactSeller(p)}
                    className="flex items-center gap-1.5 rounded-xl border border-mint/20 bg-mint/10 px-3 py-2 text-xs font-semibold text-mint hover:bg-mint/20 transition"
                  >
                    <Send size={12} /> Contact
                  </button>
                  {onAddToCart && (
                    <button
                      onClick={() => onAddToCart(p)}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3 py-2 text-xs font-bold text-[#07211e] transition shadow-sm"
                    >
                      <ShoppingCart size={12} /> Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-xs text-slate-500">
          No Made in Rwanda items match your search. Try adjusting keywords or category filters.
        </div>
      )}

      {/* Verification footer note */}
      <div className="rounded-xl border border-white/[0.06] bg-panel/60 p-4 flex items-center gap-3 text-xs text-slate-400">
        <ShieldCheck size={18} className="text-mint shrink-0" />
        <div>
          Made in Rwanda listings undergo quality assurance in cooperation with local artisan guilds. Payments are protected and directly settled via local mobile money or bank accounts.
        </div>
      </div>
    </div>
  );
}
