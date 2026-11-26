import { useState } from 'react';
import { Language } from '../types/agri';
import {
  X,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  Banknote,
  Copy,
  ArrowRight,
  PhoneCall
} from 'lucide-react';

export type PaymentMethodType = 'mtn_momo' | 'airtel_money' | 'bk_transfer' | 'cash_on_delivery';

export function RwandanPaymentModal({
  isOpen,
  onClose,
  totalAmount,
  orderNumber,
  customerPhone,
  customerName,
  lang,
  onPaymentSuccess,
  notify
}: {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  orderNumber: string;
  customerPhone: string;
  customerName: string;
  lang: Language;
  onPaymentSuccess: (method: string, txnId: string) => void;
  notify: (msg: string) => void;
}) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('mtn_momo');
  const [phone, setPhone] = useState(customerPhone || '+250 788 123 456');
  const [pin, setPin] = useState('');
  const [ussdStep, setUssdStep] = useState<'idle' | 'prompt' | 'processing' | 'done'>('idle');
  const [transactionRef, setTransactionRef] = useState('');

  if (!isOpen) return null;

  const handleStartMoMo = () => {
    setUssdStep('prompt');
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    setUssdStep('processing');

    setTimeout(() => {
      const ref = `MTN-RW-${Math.floor(100000 + Math.random() * 900000)}`;
      setTransactionRef(ref);
      setUssdStep('done');
      onPaymentSuccess('MTN Mobile Money', ref);
      notify(lang === 'rw' ? `Kwishyura RWF ${totalAmount.toLocaleString()} byarangiye neza kuri MoMo!` : `MoMo payment of RWF ${totalAmount.toLocaleString()} confirmed!`);
    }, 1500);
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    notify('Copied to clipboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0b1a13] border-2 border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="p-5 border-b border-emerald-500/15 bg-gradient-to-r from-[#0a2318] to-[#07160f] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-400 text-[#092114] flex items-center justify-center font-bold">
              <Smartphone size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">
                  {lang === 'rw' ? 'Kwishyura mu Rwanda (MoMo / Airtel / BK)' : 'Rwanda Mobile Payment Mode'}
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                  RWF
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70 font-mono">
                Order: {orderNumber} · Total: <strong className="text-white">RWF {totalAmount.toLocaleString()}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-900/30">
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Payment Method Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'mtn_momo', label: 'MTN MoMo', sub: '*182*8*1#', color: 'border-yellow-400 text-yellow-300' },
              { id: 'airtel_money', label: 'Airtel Money', sub: '*500*4#', color: 'border-red-400 text-red-300' },
              { id: 'bk_transfer', label: 'BK Quick', sub: 'Bank of Kigali', color: 'border-blue-400 text-blue-300' },
              { id: 'cash_on_delivery', label: 'Cash / Ntoki', sub: 'Pay on Delivery', color: 'border-emerald-400 text-emerald-300' }
            ].map((m) => {
              const active = selectedMethod === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMethod(m.id as any);
                    setUssdStep('idle');
                  }}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                    active
                      ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold shadow-md'
                      : 'bg-[#0f241a] border-emerald-500/15 text-emerald-200/80 hover:bg-emerald-900/40'
                  }`}
                >
                  <span className="text-xs font-bold leading-tight">{m.label}</span>
                  <span className="text-[10px] opacity-70 font-mono">{m.sub}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: MTN Mobile Money USSD Interactive Simulator */}
          {selectedMethod === 'mtn_momo' && (
            <div className="space-y-4">
              <div className="bg-[#0f241a] p-4 rounded-2xl border border-yellow-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-yellow-400 flex items-center gap-1.5">
                    <Smartphone size={14} /> MTN Mobile Money Rwanda
                  </span>
                  <span className="text-[10px] text-emerald-300 font-mono">Merchant: 819201</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                    {lang === 'rw' ? 'Nimero ya MTN MoMo' : 'MTN Mobile Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#08160f] border border-yellow-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-yellow-400"
                    placeholder="0788 123 456"
                  />
                </div>

                {ussdStep === 'idle' && (
                  <button
                    onClick={handleStartMoMo}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-2.5 rounded-xl font-black text-xs transition shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>{lang === 'rw' ? 'Ohereza Ubutumwa bwa MoMo Push' : 'Trigger MoMo USSD Prompt'}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>

              {/* Real Phone USSD Overlay Simulation */}
              {ussdStep === 'prompt' && (
                <div className="bg-[#121c16] p-5 rounded-2xl border-2 border-yellow-400/80 shadow-2xl space-y-3 animate-in zoom-in-95">
                  <div className="text-center space-y-1">
                    <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-yellow-400">
                      MTN RWANDA · USSD PROMPT (*182#)
                    </div>
                    <p className="text-xs text-white font-medium">
                      Emeza kwishyura <strong>RWF {totalAmount.toLocaleString()}</strong> kuri <strong>UMUHUZA CONNECT</strong> (Merchant ID: 819201).
                    </p>
                  </div>

                  <form onSubmit={handleConfirmPin} className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[10px] font-mono text-center text-yellow-300 mb-1">
                        Shyiramo PIN yawe ya MoMo (Enter 4-digit PIN):
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        autoFocus
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="••••"
                        className="w-32 mx-auto block bg-black border-2 border-yellow-400 rounded-xl px-3 py-2 text-center text-lg font-mono text-yellow-400 tracking-widest outline-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setUssdStep('idle')}
                        className="w-1/2 bg-gray-800 text-gray-300 py-2 rounded-xl text-xs font-bold hover:bg-gray-700"
                      >
                        Oya (Cancel)
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 bg-yellow-400 text-black py-2 rounded-xl text-xs font-black hover:bg-yellow-300 shadow-md"
                      >
                        Yego (Confirm)
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {ussdStep === 'processing' && (
                <div className="text-center py-6 space-y-2 bg-[#0f241a] rounded-2xl border border-yellow-500/20">
                  <div className="h-6 w-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-mono text-yellow-300">
                    Guhuza na seriveri ya MTN Rwanda... (Connecting to MoMo gateway)
                  </p>
                </div>
              )}

              {ussdStep === 'done' && (
                <div className="bg-[#0f281b] p-4 rounded-2xl border border-emerald-400 text-center space-y-2 animate-in fade-in">
                  <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
                  <div className="font-bold text-sm text-white">Payment Received!</div>
                  <div className="text-xs font-mono text-emerald-300">
                    Txn ID: {transactionRef}
                  </div>
                  <p className="text-[11px] text-emerald-200/80">
                    Ubutumwa bugufi (SMS) bwoherejwe kuri {phone}. Umusaruro uri gutegurwa n'umuhinzi.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 bg-emerald-500 text-[#072416] px-5 py-1.5 rounded-xl text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Airtel Money */}
          {selectedMethod === 'airtel_money' && (
            <div className="bg-[#0f241a] p-4 rounded-2xl border border-red-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-red-400 flex items-center gap-1.5">
                  <Smartphone size={14} /> Airtel Money Rwanda
                </span>
                <span className="text-[10px] text-emerald-300 font-mono">Dial *500*4#</span>
              </div>
              <p className="text-xs text-emerald-100">
                Kanda <strong>*500*4#</strong> kuri telefone yawe, shyiramo code y’umucuruzi <strong>77201</strong> hanyuma wemeze kwishyura <strong>RWF {totalAmount.toLocaleString()}</strong>.
              </p>
              <button
                onClick={() => {
                  const ref = `AIRTEL-${Math.floor(100000 + Math.random() * 900000)}`;
                  onPaymentSuccess('Airtel Money', ref);
                  onClose();
                  notify('Airtel Money payment confirmed!');
                }}
                className="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl font-bold text-xs"
              >
                Emeza Kwishyura (Confirm Airtel Payment)
              </button>
            </div>
          )}

          {/* Tab 3: Bank of Kigali (BK) */}
          {selectedMethod === 'bk_transfer' && (
            <div className="bg-[#0f241a] p-4 rounded-2xl border border-blue-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-400 flex items-center gap-1.5">
                  <Building2 size={14} /> Bank of Kigali (BK)
                </span>
                <span className="text-[10px] text-emerald-300 font-mono">BK Quick</span>
              </div>
              <div className="bg-[#08160f] p-3 rounded-xl border border-blue-500/20 font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-emerald-400/80">Account Name:</span>
                  <span className="text-white font-bold">Umuhuza Connect Ltd</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400/80">Account Number:</span>
                  <span className="text-white font-bold">00040-06912345-88</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400/80">Reference / Code:</span>
                  <span className="text-yellow-400 font-bold">{orderNumber}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  const ref = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
                  onPaymentSuccess('Bank of Kigali', ref);
                  onClose();
                  notify('Bank of Kigali transfer confirmed!');
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-bold text-xs"
              >
                Confirm Bank Transfer
              </button>
            </div>
          )}

          {/* Tab 4: Cash on Delivery */}
          {selectedMethod === 'cash_on_delivery' && (
            <div className="bg-[#0f241a] p-4 rounded-2xl border border-emerald-500/30 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Banknote size={16} />
                <span>Kwishyura mu Ntoki (Cash on Delivery)</span>
              </div>
              <p className="text-emerald-100 leading-relaxed">
                Umuhinzi cyangwa motari azakugezaho umusaruro ubanze urebe ubuziranenge bwawo, hanyuma wishyure <strong>RWF {totalAmount.toLocaleString()}</strong> mu ntoki.
              </p>
              <button
                onClick={() => {
                  onPaymentSuccess('Cash on Delivery', 'COD-PENDING');
                  onClose();
                  notify('Cash on Delivery confirmed!');
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#072416] py-2.5 rounded-xl font-black text-xs"
              >
                Emeza Gahunda yo Kwishyura Kugezwaho
              </button>
            </div>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="p-4 border-t border-emerald-500/15 bg-[#08150f] flex items-center justify-between text-[11px] text-emerald-400/80">
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Regulated by National Bank of Rwanda (BNR)</span>
          </span>
          <span className="font-mono text-emerald-300">100% Secure Payment</span>
        </div>
      </div>
    </div>
  );
}
