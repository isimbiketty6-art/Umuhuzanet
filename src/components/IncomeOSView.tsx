import { useState } from 'react';
import { Invoice } from '../types';
import { Plus, Receipt, CheckCircle, Clock, Copy, Download, ExternalLink, ShieldCheck } from 'lucide-react';

export function IncomeOSView({
  invoices,
  onOpenCreateInvoice,
  onMarkInvoicePaid,
  notify
}: {
  invoices: Invoice[];
  onOpenCreateInvoice: () => void;
  onMarkInvoicePaid: (id: string) => void;
  notify: (msg: string) => void;
}) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const totalEarned = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalPending = invoices
    .filter((inv) => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.total, 0);

  const copyMomo = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    notify('MTN MoMo payment code copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/[0.08] bg-panel/75 p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-mint mb-1">
            <Receipt size={14} />
            <span>Income OS · Rwandan Freelancer & SME Billing</span>
          </div>
          <h1 className="text-lg font-bold text-white">Track Deliverables, Invoices & Mobile Money</h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Compliant with Rwanda Revenue Authority (RRA) invoice structures and instant MTN/Airtel settlement.
          </p>
        </div>
        <button
          onClick={onOpenCreateInvoice}
          className="flex items-center gap-2 rounded-xl bg-mint px-4 py-2.5 text-xs font-bold text-[#07211e] hover:bg-emerald-300 transition shrink-0"
        >
          <Plus size={14} /> Create New Invoice
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.07] bg-panel/75 p-5">
          <span className="text-xs text-slate-400">Total Settled (Paid)</span>
          <div className="mt-2 text-2xl font-bold text-mint font-mono tabular-nums">
            RWF {totalEarned.toLocaleString()}
          </div>
          <span className="mt-1 block text-[11px] text-slate-500">From verified local clients</span>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-panel/75 p-5">
          <span className="text-xs text-slate-400">Pending Invoices</span>
          <div className="mt-2 text-2xl font-bold text-amber-300 font-mono tabular-nums">
            RWF {totalPending.toLocaleString()}
          </div>
          <span className="mt-1 block text-[11px] text-slate-500">Awaiting client bank / MoMo transfer</span>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-panel/75 p-5">
          <span className="text-xs text-slate-400">Active Invoices</span>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {invoices.length} Invoices
          </div>
          <span className="mt-1 block text-[11px] text-slate-500">100% digital audit trail</span>
        </div>
      </div>

      {/* Invoices List */}
      <div className="rounded-2xl border border-white/[0.08] bg-panel/75 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Recent Invoices & Payment Status</h2>
          <span className="text-xs text-slate-500 font-mono">{invoices.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] text-slate-400">
              <tr>
                <th className="pb-3 font-semibold">Invoice #</th>
                <th className="pb-3 font-semibold">Client</th>
                <th className="pb-3 font-semibold">Due Date</th>
                <th className="pb-3 font-semibold">Amount (RWF)</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-slate-300">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 font-mono text-slate-200">{inv.invoiceNumber}</td>
                  <td className="py-3.5 font-medium text-white">
                    <div>{inv.clientName}</div>
                    <div className="text-[11px] text-slate-500">{inv.clientEmail}</div>
                  </td>
                  <td className="py-3.5 text-slate-400 font-mono text-[11px]">{inv.dueDate}</td>
                  <td className="py-3.5 font-mono font-bold text-white">
                    RWF {inv.total.toLocaleString()}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`rounded-md px-2.5 py-1 text-[10px] font-semibold ${
                        inv.status === 'Paid'
                          ? 'border border-mint/20 bg-mint/10 text-mint'
                          : 'border border-amber-300/20 bg-amber-300/10 text-amber-300'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-slate-300 hover:bg-white/5 hover:text-white transition"
                      >
                        View & Print
                      </button>
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => {
                            onMarkInvoicePaid(inv.id);
                            notify(`Invoice ${inv.invoiceNumber} marked as Paid`);
                          }}
                          className="rounded-lg bg-mint/15 px-2.5 py-1 text-mint font-semibold hover:bg-mint/25 transition"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-white/10 bg-[#0d1627] p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-mono text-mint uppercase tracking-wider">Rwanda Standard Invoice</span>
                <h3 className="text-lg font-bold text-white font-mono">{selectedInvoice.invoiceNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/[0.06] bg-panel/60 p-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Billed To:</span>
                  <div className="font-bold text-white mt-0.5">{selectedInvoice.clientName}</div>
                  <div className="text-slate-400">{selectedInvoice.clientEmail}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase">Dates:</span>
                  <div className="text-slate-300 mt-0.5">Issued: {selectedInvoice.issueDate}</div>
                  <div className="text-amber-300">Due: {selectedInvoice.dueDate}</div>
                </div>
              </div>

              {/* Items */}
              <div className="rounded-xl border border-white/[0.06] bg-panel/60 p-4">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/[0.08] text-slate-500 pb-2">
                    <tr>
                      <th className="pb-2">Description</th>
                      <th className="pb-2 text-center">Qty</th>
                      <th className="pb-2 text-right">Price</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {selectedInvoice.items.map((it) => (
                      <tr key={it.id}>
                        <td className="py-2.5 text-white">{it.description}</td>
                        <td className="py-2.5 text-center font-mono">{it.quantity}</td>
                        <td className="py-2.5 text-right font-mono">RWF {it.unitPrice.toLocaleString()}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-white">RWF {it.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 pt-3 border-t border-white/[0.08] flex flex-col items-end gap-1 font-mono text-xs">
                  <div className="flex w-56 justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>RWF {selectedInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  {selectedInvoice.taxAmount > 0 && (
                    <div className="flex w-56 justify-between text-slate-400">
                      <span>RRA VAT (18%):</span>
                      <span>RWF {selectedInvoice.taxAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex w-56 justify-between text-sm font-bold text-mint pt-1 border-t border-white/10">
                    <span>Total Due:</span>
                    <span>RWF {selectedInvoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* MoMo Code Payment */}
              {selectedInvoice.momoPaymentCode && (
                <div className="rounded-xl border border-mint/20 bg-mint/[0.04] p-4">
                  <span className="text-[10px] uppercase font-bold text-mint tracking-wider">Mobile Money Checkout Code</span>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-white">{selectedInvoice.momoPaymentCode}</span>
                    <button
                      onClick={() => copyMomo(selectedInvoice.momoPaymentCode)}
                      className="flex items-center gap-1 rounded-lg bg-mint/10 px-2.5 py-1 text-[11px] font-semibold text-mint hover:bg-mint/20"
                    >
                      <Copy size={12} /> Copy Code
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-slate-400">Dial on MTN / Airtel Rwanda or send via MoMo Pay merchant terminal.</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4">
              <span className="text-[11px] text-slate-500">Umuhuza Connect · Digital Invoicing</span>
              <button
                onClick={() => {
                  window.print();
                  notify('Preparing printable document layout');
                }}
                className="flex items-center gap-1.5 rounded-xl bg-mint px-4 py-2 text-xs font-bold text-[#07211e] hover:bg-emerald-300"
              >
                <Download size={14} /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
