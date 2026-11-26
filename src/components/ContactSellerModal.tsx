import { useState } from 'react';
import { Product } from '../types';
import { X, Send, ShieldCheck } from 'lucide-react';

export function ContactSellerModal({
  product,
  onClose,
  onSendMessage
}: {
  product: Product | null;
  onClose: () => void;
  onSendMessage: (product: Product, messageText: string) => void;
}) {
  const [message, setMessage] = useState('');

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(product, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-white/10 bg-[#0c1524] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
          <div>
            <span className="text-[10px] font-bold text-mint uppercase tracking-wider">Inquiry for Seller</span>
            <h3 className="font-bold text-white text-sm mt-0.5">{product.name}</h3>
            <p className="text-xs text-slate-400">By {product.seller} · {product.sellerLocation}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-300">
          <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-panel/70 p-3.5">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Listed Price</span>
              <div className="text-sm font-bold text-mint font-mono mt-0.5">{product.price}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Lead Time</span>
              <div className="text-xs text-slate-300 mt-0.5">{product.leadTime}</div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Your Inquiry or Custom Request</label>
            <textarea
              rows={4}
              required
              placeholder="Ask about delivery options within Kigali, custom dimensions, wholesale pricing, or project kickoff..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111c2e] p-3 text-xs text-white outline-none focus:border-mint/50 leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck size={14} className="text-mint shrink-0" />
            <span>Direct conversation will be added to your Umuhuza Messages workspace.</span>
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
              <Send size={13} /> Send Inquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
