import { useState } from 'react';
import { AgriProduct, AgriOrder, Language, AgriCategory } from '../types/agri';
import { RWANDA_DISTRICTS } from '../data/agriData';
import { translations } from '../data/translations';
import {
  Sprout,
  Plus,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  Truck,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

export function SellerPortal({
  products,
  orders,
  lang,
  onAddNewProduct,
  onUpdateOrderStatus,
  notify
}: {
  products: AgriProduct[];
  orders: AgriOrder[];
  lang: Language;
  onAddNewProduct: (p: AgriProduct) => void;
  onUpdateOrderStatus: (orderId: string, nextStatus: 'Pending' | 'Processing' | 'Delivered') => void;
  notify: (msg: string) => void;
}) {
  const t = translations[lang];
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [nameRw, setNameRw] = useState('');
  const [category, setCategory] = useState<AgriCategory>('Vegetables');
  const [pricePerUnit, setPricePerUnit] = useState(800);
  const [unit, setUnit] = useState<'kg' | 'liter' | 'sack (50kg)' | 'crate' | 'head' | 'piece'>('kg');
  const [district, setDistrict] = useState('Gasabo');
  const [stockQuantity, setStockQuantity] = useState(250);
  const [description, setDescription] = useState('');
  const [descriptionRw, setDescriptionRw] = useState('');
  const [isOrganic, setIsOrganic] = useState(true);

  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 450000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: AgriProduct = {
      id: `prod-${Date.now()}`,
      name,
      nameRw: nameRw || name,
      category,
      pricePerUnit,
      unit,
      location: `${district} (Rwanda)`,
      district,
      province: district === 'Gasabo' ? 'Kigali' : 'Northern',
      sellerId: 's-me',
      sellerName: 'My Rwandan Farm Co.',
      sellerPhone: '+250 788 123 456',
      sellerRating: 5.0,
      sellerVerified: true,
      stockQuantity,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      description,
      descriptionRw: descriptionRw || description,
      harvestDate: 'Freshly harvested',
      isOrganic
    };

    onAddNewProduct(newProd);
    setIsAddOpen(false);
    notify(lang === 'rw' ? 'Umusaruro mushya washyizwe ku isoko!' : 'New produce added to Umuhuza marketplace!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-white">
      {/* Seller Portal Header Banner */}
      <div className="bg-gradient-to-r from-[#0d281c] via-[#091f15] to-[#07160f] p-6 rounded-3xl border border-emerald-500/25 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
              <Sprout size={14} />
              <span>{t.sellerPortal}</span>
            </div>
            <h1 className="text-2xl font-black text-white">{t.welcomeSeller}</h1>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
              {lang === 'rw'
                ? 'Genzura umusaruro wawe, ibiciro, n’ibyo abakiriya batumije muri aka kanya.'
                : 'Manage your farm listings, set prices, and fulfill customer orders seamlessly.'}
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#072416] px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-lg shadow-emerald-950/40"
          >
            <Plus size={16} />
            <span>{lang === 'rw' ? 'Ongeraho Umusaruro' : 'Add New Produce'}</span>
          </button>
        </div>

        {/* 4 Stat Tiles (Direct from Infographic Seller Portal) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-500/15">
          <div className="p-4 bg-[#0f241a]/60 rounded-2xl border border-emerald-500/15">
            <span className="text-[11px] text-emerald-300/80 font-medium">{t.totalProducts}</span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {products.length}
            </div>
            <span className="text-[10px] text-emerald-400">Available in catalog</span>
          </div>

          <div className="p-4 bg-[#0f241a]/60 rounded-2xl border border-emerald-500/15">
            <span className="text-[11px] text-emerald-300/80 font-medium">{lang === 'rw' ? 'Ibyatumijwe Byose' : 'Total Orders'}</span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {orders.length + 26}
            </div>
            <span className="text-[10px] text-emerald-400">This harvest season</span>
          </div>

          <div className="p-4 bg-[#0f241a]/60 rounded-2xl border border-emerald-500/15">
            <span className="text-[11px] text-emerald-300/80 font-medium">{t.activeCustomers}</span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              12
            </div>
            <span className="text-[10px] text-emerald-400">Repeat buyers</span>
          </div>

          <div className="p-4 bg-[#0f241a]/60 rounded-2xl border border-emerald-500/15">
            <span className="text-[11px] text-emerald-300/80 font-medium">{t.totalSales}</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              RWF {totalSales.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400">Direct MoMo settlement</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Section (Matching Infographic Seller Wireframe) */}
      <div className="bg-[#0b1a13] p-6 rounded-3xl border border-emerald-500/20 space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-500/15 pb-4">
          <div>
            <h2 className="text-base font-bold text-white">
              {lang === 'rw' ? 'Ibyatumijwe Byavuba n\'Ububiko' : 'Recent Customer Orders & Fulfillment Queue'}
            </h2>
            <p className="text-xs text-emerald-300/70">
              {lang === 'rw' ? 'Hindura uko gahunda yo kugezaho ihagaze' : 'Update status from Pending to Processing and Delivered.'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-emerald-500/20 text-emerald-300/70">
              <tr>
                <th className="pb-3 font-semibold">Order #</th>
                <th className="pb-3 font-semibold">Product / Items</th>
                <th className="pb-3 font-semibold">Buyer Name</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold">Total RWF</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Fulfillment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10 text-emerald-100">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-emerald-950/20 transition">
                  <td className="py-3.5 font-mono text-emerald-300 font-bold">{ord.orderNumber}</td>
                  <td className="py-3.5 font-medium text-white max-w-xs truncate">
                    {ord.items.map((i) => `${i.productName} (${i.quantity}${i.unit})`).join(', ')}
                  </td>
                  <td className="py-3.5">
                    <div>{ord.customerName}</div>
                    <div className="text-[10px] text-emerald-400/60 font-mono">{ord.customerPhone}</div>
                  </td>
                  <td className="py-3.5 text-emerald-300/80">{ord.deliveryDistrict}</td>
                  <td className="py-3.5 font-mono font-bold text-white">
                    RWF {ord.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : ord.status === 'Processing'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-sky-400/20 text-sky-300 border border-sky-400/30'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    {ord.status === 'Pending' && (
                      <button
                        onClick={() => {
                          onUpdateOrderStatus(ord.id, 'Processing');
                          notify(`Order ${ord.orderNumber} set to Processing`);
                        }}
                        className="bg-amber-400/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-lg text-xs font-bold hover:bg-amber-400/30 transition"
                      >
                        Start Packing →
                      </button>
                    )}
                    {ord.status === 'Processing' && (
                      <button
                        onClick={() => {
                          onUpdateOrderStatus(ord.id, 'Delivered');
                          notify(`Order ${ord.orderNumber} confirmed Delivered!`);
                        }}
                        className="bg-emerald-500 text-[#072416] px-3 py-1 rounded-lg text-xs font-bold hover:bg-emerald-400 transition"
                      >
                        Mark Delivered ✓
                      </button>
                    )}
                    {ord.status === 'Delivered' && (
                      <span className="text-[11px] text-emerald-400 font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Produce Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-[#0b1a13] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-emerald-500/15 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'rw' ? 'Shyiraho Umusaruro Mushya' : 'Add New Agricultural Listing'}
                </h3>
                <p className="text-xs text-emerald-300/70">
                  {lang === 'rw' ? 'Uzuza amakuru y\'umusaruro wifuza kugurisha' : 'Publish your fresh farm harvest directly to customers across Rwanda.'}
                </p>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-lg text-emerald-400 hover:bg-emerald-900/30">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                    Product Name (English)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fresh Tomatoes"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                    Izina ry’Ibicuruzwa (Kinyarwanda)
                  </label>
                  <input
                    type="text"
                    placeholder="urugero: Inyanya Zishya"
                    value={nameRw}
                    onChange={(e) => setNameRw(e.target.value)}
                    className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  >
                    <option value="Vegetables">Vegetables (Imboga)</option>
                    <option value="Fruits">Fruits (Imbuto)</option>
                    <option value="Grains & Cereals">Grains & Cereals (Impeke)</option>
                    <option value="Livestock">Livestock (Amatungo)</option>
                    <option value="Dairy Products">Dairy (Amata)</option>
                    <option value="Seeds & Inputs">Seeds (Imbuto)</option>
                    <option value="Processed Foods">Processed (Ibiribwa)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">Price (RWF)</label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(Number(e.target.value))}
                    className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">Per Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  >
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                    <option value="crate">crate</option>
                    <option value="sack (50kg)">sack (50kg)</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">District (Akarere)</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  >
                    {RWANDA_DISTRICTS.map((d) => (
                      <option key={d} value={d} className="bg-[#0b1b13]">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">Available Stock</label>
                  <input
                    type="number"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-300 mb-1">Description (Ibisobanuro)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe your harvest quality, freshness, and delivery availability..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="organic"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="h-4 w-4 accent-emerald-500"
                />
                <label htmlFor="organic" className="text-xs text-emerald-200 cursor-pointer">
                  {lang === 'rw' ? 'Iki gihingwa cyakoreshejwe ifumbire y\'imborera gusa (Organic)' : 'Certified 100% Organic compost produce'}
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-emerald-500/15">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="bg-emerald-950 text-emerald-300 px-4 py-2 rounded-xl font-bold text-xs hover:bg-emerald-900/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-[#072416] px-5 py-2 rounded-xl font-bold text-xs shadow-md"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
