import { useState, useMemo } from 'react';
import { AgriProduct, AgriCategory, Language } from '../types/agri';
import { RWANDA_DISTRICTS } from '../data/agriData';
import { translations } from '../data/translations';
import {
  MapPin,
  Star,
  CheckCircle,
  Plus,
  Minus,
  MessageCircle,
  ShoppingCart,
  Filter,
  SlidersHorizontal,
  ShieldCheck,
  Package
} from 'lucide-react';

export function ProductCatalog({
  products,
  lang,
  rwfPerUsd = 1385,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  onAddToCart,
  onOpenMessageSeller,
  notify
}: {
  products: AgriProduct[];
  lang: Language;
  rwfPerUsd?: number;
  selectedCategory: AgriCategory | 'All';
  setSelectedCategory: (c: AgriCategory | 'All') => void;
  searchQuery: string;
  onAddToCart: (product: AgriProduct, qty: number) => void;
  onOpenMessageSeller: (product: AgriProduct) => void;
  notify: (msg: string) => void;
}) {
  const t = translations[lang];
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQtyChange = (productId: string, delta: number, maxStock: number) => {
    const current = quantities[productId] || 1;
    const next = Math.max(1, Math.min(maxStock, current + delta));
    setQuantities({ ...quantities, [productId]: next });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // District filter
      if (selectedDistrict !== 'All' && !p.district.toLowerCase().includes(selectedDistrict.toLowerCase())) {
        return false;
      }
      // Search query filter (matches English name, Kinyarwanda name, description, seller, location)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.nameRw.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [products, selectedCategory, selectedDistrict, searchQuery]);

  return (
    <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Section Header & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/15 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
            <Package size={14} />
            <span>{t.featuredProducts}</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 font-mono text-[10px] text-emerald-300">
              LIVE FX: 1 USD = {rwfPerUsd.toLocaleString()} RWF
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            {lang === 'rw' ? 'Umusaruro Ugezweho wo mu Rwanda' : 'Fresh Farm Harvest & Produce'}
          </h2>
          <p className="text-xs text-emerald-300/70 mt-0.5">
            {filteredProducts.length}{' '}
            {lang === 'rw'
              ? 'ibicuruzwa byabonetse'
              : 'live farm listings indexed to Rwanda e-Soko & global markets'}
          </p>
        </div>

        {/* District & Location Filter Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-500/25 rounded-xl px-3 py-2 text-xs text-emerald-200">
            <MapPin size={14} className="text-emerald-400 shrink-0" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent text-xs text-emerald-100 outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#0b1b13] text-white">
                {lang === 'rw' ? 'Uturere Twose tw’u Rwanda' : 'All Rwanda Districts'}
              </option>
              <option value="Gasabo" className="bg-[#0b1b13] text-white">Gasabo (Kigali)</option>
              <option value="Musanze" className="bg-[#0b1b13] text-white">Musanze (Northern)</option>
              <option value="Rubavu" className="bg-[#0b1b13] text-white">Rubavu (Western)</option>
              <option value="Huye" className="bg-[#0b1b13] text-white">Huye (Southern)</option>
              <option value="Gicumbi" className="bg-[#0b1b13] text-white">Gicumbi (Northern)</option>
              <option value="Nyagatare" className="bg-[#0b1b13] text-white">Nyagatare (Eastern)</option>
              <option value="Kayonza" className="bg-[#0b1b13] text-white">Kayonza (Eastern)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((prod) => {
          const qty = quantities[prod.id] || 1;

          return (
            <article
              key={prod.id}
              className="bg-[#0b1a13] border border-emerald-500/20 rounded-2xl overflow-hidden hover:border-emerald-400/50 transition-all flex flex-col justify-between shadow-lg shadow-black/30 group"
            >
              <div>
                {/* Product Image Frame */}
                <div className="relative h-44 w-full overflow-hidden bg-emerald-950/50">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                    {prod.category}
                  </div>

                  {prod.isOrganic && (
                    <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-[#062114] px-2 py-0.5 rounded-md text-[10px] font-bold">
                      {lang === 'rw' ? 'Kimeza' : 'Organic'}
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-emerald-200 flex items-center gap-1">
                    <MapPin size={11} className="text-emerald-400" />
                    <span>{prod.location}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h3 className="font-bold text-white text-sm leading-snug group-hover:text-emerald-300 transition">
                        {lang === 'rw' ? prod.nameRw : prod.name}
                      </h3>
                      <div className="text-[11px] text-emerald-400/80 font-medium">
                        {lang === 'rw' ? prod.name : prod.nameRw}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-emerald-100/70 line-clamp-2 leading-relaxed">
                    {lang === 'rw' ? prod.descriptionRw : prod.description}
                  </p>

                  {/* Seller Info */}
                  <div className="pt-2 border-t border-emerald-500/10 flex items-center justify-between text-[11px] text-emerald-300/80">
                    <div className="flex items-center gap-1 truncate">
                      <span className="font-medium text-emerald-200 truncate">{prod.sellerName}</span>
                      {prod.sellerVerified && (
                        <CheckCircle size={12} className="text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-300 font-mono text-[10px] shrink-0">
                      <Star size={11} fill="currentColor" />
                      <span>{prod.sellerRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Action Strip */}
              <div className="p-4 pt-0 border-t border-emerald-500/10 mt-2 bg-[#091610]/40">
                <div className="flex items-baseline justify-between py-2">
                  <div>
                    <div className="text-xs text-emerald-400 font-medium">
                      {lang === 'rw' ? 'Igiciro:' : 'Live Market Price:'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Stock: {prod.stockQuantity} {prod.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-white font-mono">
                      RWF {prod.pricePerUnit.toLocaleString()}
                      <span className="text-xs text-emerald-300/80 font-normal">/{prod.unit}</span>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-300/80">
                      ≈ $
                      {(
                        prod.usdEquivalent ??
                        Math.round((prod.pricePerUnit / rwfPerUsd) * 100) / 100
                      ).toFixed(2)}{' '}
                      USD
                      {typeof prod.marketTrendPct === 'number' && (
                        <span
                          className={`ml-1.5 ${
                            prod.marketTrendPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          ({prod.marketTrendPct >= 0 ? '+' : ''}
                          {prod.marketTrendPct}%)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between gap-2 mb-3 bg-emerald-950/60 p-1 rounded-xl border border-emerald-500/20">
                  <span className="text-[11px] text-emerald-300/80 pl-2">
                    {lang === 'rw' ? 'Ingano:' : 'Quantity:'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQtyChange(prod.id, -1, prod.stockQuantity)}
                      className="h-6 w-6 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 flex items-center justify-center transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-xs font-bold text-white font-mono w-6 text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleQtyChange(prod.id, 1, prod.stockQuantity)}
                      className="h-6 w-6 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 flex items-center justify-center transition"
                      aria-label="Increase quantity"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>

                {/* Buttons: Add to Cart & Message Seller */}
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => onOpenMessageSeller(prod)}
                    className="col-span-1 flex items-center justify-center p-2 rounded-xl border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 hover:text-white transition"
                    title={lang === 'rw' ? 'Ohereza ubutumwa umugurisha' : 'Chat with farmer'}
                  >
                    <MessageCircle size={15} />
                  </button>

                  <button
                    disabled={prod.stockQuantity <= 0}
                    onClick={() => onAddToCart(prod, qty)}
                    className="col-span-3 flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-[#072416] py-2 px-3 rounded-xl font-bold text-xs transition shadow-md shadow-emerald-900/20 active:scale-95 disabled:opacity-40"
                  >
                    <ShoppingCart size={13} />
                    <span>{prod.stockQuantity <= 0 ? 'Out of Stock' : t.addToCart}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-emerald-950/20 rounded-3xl border border-dashed border-emerald-500/20 p-8 space-y-3">
          <p className="text-emerald-200 text-sm font-semibold">
            {lang === 'rw'
              ? 'Nta bicuruzwa bihwanye n’ibyo ushaka byabonetse muri iri teka.'
              : 'No agricultural products match your current filters.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDistrict('All');
            }}
            className="text-xs text-emerald-400 underline font-bold"
          >
            {lang === 'rw' ? 'Kugarura byose' : 'Reset all filters'}
          </button>
        </div>
      )}
    </section>
  );
}
