import { useState } from 'react';
import { Invoice, InvoiceItem } from '../types';
import { X, Plus, Trash2, Receipt, PhoneCall } from 'lucide-react';

export function CreateInvoiceModal({
  isOpen,
  onClose,
  onCreateInvoice
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (invoice: Invoice) => void;
}) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-15');
  const [taxRate, setTaxRate] = useState<number>(0.18); // Default Rwanda VAT 18%
  const [momoNumber, setMomoNumber] = useState('0788123456');
  const [notes, setNotes] = useState('Payment via MTN Mobile Money (*182*8*1*0788123456#) or Bank of Kigali transfer.');

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Design or Engineering deliverable milestone', quantity: 1, unitPrice: 250000, amount: 250000 }
  ]);

  if (!isOpen) return null;

  const handleItemChange = (index: number, field: 'description' | 'quantity' | 'unitPrice', val: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: val };
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(val) : item.quantity;
      const p = field === 'unitPrice' ? Number(val) : item.unitPrice;
      item.amount = (q || 0) * (p || 0);
    }
    updated[index] = item;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: String(Date.now()), description: '', quantity: 1, unitPrice: 50000, amount: 50000 }
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const taxAmount = Math.round(subtotal * taxRate);
  const total = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceNum = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invoiceNum,
      clientName,
      clientEmail,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      items,
      subtotal,
      taxRate,
      taxAmount,
      total,
      status: 'Pending',
      momoPaymentCode: `*182*8*1*${momoNumber}#`,
      notes
    };

    onCreateInvoice(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl border border-white/10 bg-[#0c1524] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/15 text-mint">
              <Receipt size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white">Create Professional Invoice (RWF)</h3>
              <p className="text-xs text-slate-400">Tailored for Rwandan SMEs, freelancers, and artisans</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Client / Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Bank of Kigali, Irembo, or Private Client"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Client Email Address</label>
              <input
                type="email"
                required
                placeholder="billing@client.rw"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3 py-2 text-xs text-white outline-none focus:border-mint/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Rwanda Tax / VAT Rate</label>
              <select
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3 py-2 text-xs text-white outline-none focus:border-mint/50"
              >
                <option value={0.18}>Standard 18% VAT (RRA)</option>
                <option value={0}>0% Tax Exempt / Micro Enterprise</option>
                <option value={0.03}>3% Lump-sum Turnover Tax</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">MTN / Airtel MoMo Merchant</label>
              <input
                type="text"
                placeholder="0788123456"
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3 py-2 text-xs text-white font-mono outline-none focus:border-mint/50"
              />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">Line Items</span>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-[11px] text-mint hover:underline"
              >
                <Plus size={13} /> Add Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-panel/60 p-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Description of deliverable / service"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="flex-1 rounded-lg border border-white/10 bg-[#0d1524] px-3 py-1.5 text-xs text-white outline-none focus:border-mint/50"
                  />
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-16 rounded-lg border border-white/10 bg-[#0d1524] px-2 py-1.5 text-center text-xs text-white font-mono outline-none"
                    placeholder="Qty"
                  />
                  <div className="relative w-32">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">RWF</span>
                    <input
                      type="number"
                      step="5000"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#0d1524] py-1.5 pl-10 pr-2 text-right text-xs text-white font-mono outline-none"
                    />
                  </div>
                  <div className="w-28 text-right font-mono font-semibold text-white">
                    RWF {item.amount.toLocaleString()}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="p-1.5 text-slate-500 hover:text-red-400 disabled:opacity-30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Calculations Summary */}
          <div className="flex flex-col items-end gap-1.5 rounded-xl border border-white/[0.06] bg-panel/80 p-4 font-mono">
            <div className="flex w-64 justify-between text-xs text-slate-400">
              <span>Subtotal:</span>
              <span>RWF {subtotal.toLocaleString()}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex w-64 justify-between text-xs text-slate-400">
                <span>Rwanda VAT ({(taxRate * 100).toFixed(0)}%):</span>
                <span>RWF {taxAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex w-64 justify-between border-t border-white/10 pt-2 text-sm font-bold text-mint">
              <span>Total Due:</span>
              <span>RWF {total.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Payment Instructions & Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111c2e] p-3 text-xs text-white outline-none focus:border-mint/50"
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
              className="rounded-xl bg-mint px-6 py-2.5 text-xs font-bold text-[#07211e] hover:bg-emerald-300 transition"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
