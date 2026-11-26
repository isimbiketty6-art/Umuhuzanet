import { useState } from 'react';
import { WholesaleRequest, Language } from '../types/agri';
import { INITIAL_WHOLESALE_REQUESTS } from '../data/agriData';
import { translations } from '../data/translations';
import {
  TrendingUp,
  Package,
  Plus,
  Building2,
  Calendar,
  CheckCircle2,
  Handshake,
  MapPin,
  ArrowRight
} from 'lucide-react';

export function TraderPortal({
  lang,
  notify
}: {
  lang: Language;
  notify: (msg: string) => void;
}) {
  const t = translations[lang];
  const [requests, setRequests] = useState<WholesaleRequest[]>(INITIAL_WHOLESALE_REQUESTS);
  const [isCreating, setIsCreating] = useState(false);

  const [crop, setCrop] = useState('');
  const [qty, setQty] = useState('');
  const [targetPrice, setTargetPrice] = useState(650);
  const [location, setLocation] = useState('Nyabugogo Depot, Kigali');

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: WholesaleRequest = {
      id: `req-${Date.now()}`,
      traderName: 'Kigali Bulk Sourcing Partner',
      companyName: 'Rwanda Grain & Produce Traders',
      cropRequired: crop,
      quantityNeeded: qty,
      targetPricePerKg: targetPrice,
      deliveryLocation: location,
      deadline: 'In 7 days',
      status: 'Open for Farmers',
      responsesCount: 0
    };
    setRequests([newReq, ...requests]);
    setIsCreating(false);
    notify('Bulk wholesale procurement request published to Rwandan cooperatives!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-white">
      {/* Trader Banner */}
      <div className="bg-gradient-to-r from-[#0d281c] via-[#091f15] to-[#07160f] p-6 rounded-3xl border border-emerald-500/25 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
              <TrendingUp size={14} />
              <span>{t.traderPortal}</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              {lang === 'rw' ? 'Isoko ry’Umusaruro Mwinshi (Wholesale & B2B)' : 'Wholesale Commodity & Cooperative Supply Board'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
              {lang === 'rw'
                ? 'Gura umusaruro mwinshi w\'ibigori, ibiharage, inyanya n\'ibirayi mu mashyirahamwe y\'abahinzi.'
                : 'Procure bulk commercial tonnage directly from agricultural cooperatives across all 5 provinces.'}
            </p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#072416] px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-lg shrink-0"
          >
            <Plus size={16} />
            <span>{lang === 'rw' ? 'Gusaba Umusaruro Mwinshi' : 'Create Bulk Sourcing Request'}</span>
          </button>
        </div>
      </div>

      {/* Active Wholesale Sourcing Requests */}
      <div className="bg-[#0b1a13] p-6 rounded-3xl border border-emerald-500/20 space-y-5">
        <div className="border-b border-emerald-500/15 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">
              {lang === 'rw' ? 'Ibisabwa n’Abacuruzi Banini' : 'Active Commercial Sourcing Demands'}
            </h2>
            <p className="text-xs text-emerald-300/70">
              Cooperative leaders can view specifications and bid supply contracts directly.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold">
            {requests.length} B2B Requests
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-5 bg-[#0e2218] rounded-2xl border border-emerald-500/15 hover:border-emerald-500/30 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
                      Target Crop
                    </span>
                    <h3 className="font-bold text-white text-base mt-0.5">{req.cropRequired}</h3>
                    <div className="text-xs text-emerald-200/80">{req.companyName}</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    {req.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs bg-[#091811] p-3 rounded-xl border border-emerald-500/10 font-mono">
                  <div>
                    <span className="text-[10px] text-emerald-400/70 uppercase">Volume:</span>
                    <div className="font-bold text-white text-sm">{req.quantityNeeded}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400/70 uppercase">Target Price:</span>
                    <div className="font-bold text-emerald-400 text-sm">RWF {req.targetPricePerKg} /kg</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300/70">
                  <MapPin size={13} className="text-emerald-400" />
                  <span>{req.deliveryLocation}</span>
                  <span>·</span>
                  <Calendar size={13} />
                  <span>Due: {req.deadline}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-emerald-500/10 pt-3 text-xs">
                <span className="text-[11px] text-emerald-400 font-mono">
                  {req.responsesCount} Cooperatives connected
                </span>
                <button
                  onClick={() => notify(`Submitting cooperative supply proposal for ${req.cropRequired}`)}
                  className="bg-emerald-500 text-[#072416] px-4 py-1.5 rounded-lg font-bold hover:bg-emerald-400 transition"
                >
                  Supply This Order →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Sourcing Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#0b1a13] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white border-b border-emerald-500/15 pb-3">
              Post Wholesale Commodity Request
            </h3>
            <form onSubmit={handleCreateRequest} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-emerald-300 mb-1">Crop / Commodity</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dry Maize or Irish Potatoes Kinigi"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">Quantity (e.g. 5 Tonnes)</label>
                  <input
                    type="text"
                    required
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">Target Price / kg (RWF)</label>
                  <input
                    type="number"
                    required
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-300 mb-1">Delivery Depot Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-emerald-500/15">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="bg-emerald-950 text-emerald-300 px-4 py-2 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-[#072416] px-5 py-2 rounded-xl font-bold text-xs shadow-md"
                >
                  Publish Demand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
