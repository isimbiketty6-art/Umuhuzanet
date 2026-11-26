import { useState } from 'react';
import { Product } from '../types';
import { X, Plus, ShoppingBag } from 'lucide-react';

export function AddProductModal({
  isOpen,
  onClose,
  onAddProduct
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}) {
  const [name, setName] = useState('');
  const [seller, setSeller] = useState('Kigali Artisan Collective');
  const [sellerLocation, setSellerLocation] = useState('Kigali, Rwanda');
  const [priceNumber, setPriceNumber] = useState(35000);
  const [category, setCategory] = useState<Product['category']>('Handcraft');
  const [description, setDescription] = useState('');
  const [leadTime, setLeadTime] = useState('2–3 business days');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Date.now(),
      name,
      seller,
      sellerLocation,
      price: `RWF ${priceNumber.toLocaleString()}`,
      priceNumber,
      category,
      icon: category === 'Handcraft' ? '❖' : category === 'Agriculture & Food' ? '☕' : category === 'Design service' ? '✦' : '⌘',
      description,
      rating: 5.0,
      salesCount: 1,
      inStock: true,
      leadTime
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col rounded-2xl border border-white/10 bg-[#0c1524] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/15 text-mint">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white">List on Made in Rwanda</h3>
              <p className="text-xs text-slate-400">Offer your artisan products or digital services to verified buyers</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-300">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Product or Service Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Handwoven Agaseke Basket or Brand Identity Sprint"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Seller / Workshop Name</label>
              <input
                type="text"
                required
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Location in Rwanda</label>
              <input
                type="text"
                required
                value={sellerLocation}
                onChange={(e) => setSellerLocation(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3 py-2.5 text-xs text-white outline-none focus:border-mint/50"
              >
                <option value="Handcraft">Handcraft & Cultural Art</option>
                <option value="Agriculture & Food">Specialty Agri & Food</option>
                <option value="Design service">Design & Creative Service</option>
                <option value="Digital service">Digital & Software Service</option>
                <option value="Home & living">Home & Living</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Price in RWF</label>
              <input
                type="number"
                step="1000"
                required
                value={priceNumber}
                onChange={(e) => setPriceNumber(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-mint/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Description & Craft Story</label>
            <textarea
              rows={3}
              required
              placeholder="Tell buyers about the materials, authenticity, or deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111c2e] p-3 text-xs text-white outline-none focus:border-mint/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Delivery / Lead Time</label>
            <input
              type="text"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
              placeholder="e.g. 2–3 business days or Made to order"
              className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-mint px-5 py-2.5 text-xs font-bold text-[#07211e] hover:bg-emerald-300 transition"
            >
              <Plus size={14} /> Add Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
