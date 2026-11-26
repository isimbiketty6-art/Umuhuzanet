import { useState } from 'react';
import { CartItem, Language, AgriOrder } from '../types/agri';
import { RWANDA_DISTRICTS } from '../data/agriData';
import { translations } from '../data/translations';
import { RwandanPaymentModal } from './RwandanPaymentModal';
import {
  X,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  Smartphone,
  Truck,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Building2
} from 'lucide-react';

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
  lang,
  notify
}: {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: AgriOrder) => void;
  lang: Language;
  notify: (msg: string) => void;
}) {
  const t = translations[lang];

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('Diane Uwamahoro');
  const [customerPhone, setCustomerPhone] = useState('+250 788 123 456');
  const [deliveryDistrict, setDeliveryDistrict] = useState('Gasabo (Kigali)');
  const [deliveryAddress, setDeliveryAddress] = useState('KG 11 Ave, Kimironko Sector');
  const [paymentMethod, setPaymentMethod] = useState<
    'MTN Mobile Money (MoMo)' | 'Airtel Money' | 'Bank of Kigali (BK Quick)' | 'Cash on Delivery'
  >('MTN Mobile Money (MoMo)');
  const [placedOrder, setPlacedOrder] = useState<AgriOrder | null>(null);
  const [showRwandanPaymentModal, setShowRwandanPaymentModal] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.pricePerUnit * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 1500 : 0;
  const totalAmount = subtotal + deliveryFee;

  const [currentOrderNumber] = useState(`UMH-${Math.floor(10000 + Math.random() * 90000)}`);

  const handlePaymentSuccess = (methodName: string, txnId: string) => {
    if (items.length === 0) return;

    const newOrder: AgriOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: currentOrderNumber,
      customerId: 'cust-demo',
      customerName,
      customerPhone,
      deliveryDistrict,
      deliveryAddress,
      paymentMethod: `${methodName} (${txnId})`,
      items: items.map((it) => ({
        productId: it.product.id,
        productName: lang === 'rw' ? it.product.nameRw : it.product.name,
        quantity: it.quantity,
        unitPrice: it.product.pricePerUnit,
        unit: it.product.unit,
        subtotal: it.product.pricePerUnit * it.quantity
      })),
      totalAmount,
      status: 'Processing',
      createdAt: 'Just now',
      sellerName: items[0]?.product.sellerName || 'Rwanda Farmers'
    };

    setPlacedOrder(newOrder);
    onOrderPlaced(newOrder);
    onClearCart();
    setShowRwandanPaymentModal(false);
    setStep('success');
    notify(
      lang === 'rw'
        ? `Kwishyura byemejwe! Umubare w'icyemezo: ${txnId}`
        : `Payment verified via ${methodName}! Ref: ${txnId}`
    );
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (paymentMethod !== 'Cash on Delivery') {
      setShowRwandanPaymentModal(true);
      return;
    }

    const newOrder: AgriOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: currentOrderNumber,
      customerId: 'cust-demo',
      customerName,
      customerPhone,
      deliveryDistrict,
      deliveryAddress,
      paymentMethod: 'Cash on Delivery',
      items: items.map((it) => ({
        productId: it.product.id,
        productName: lang === 'rw' ? it.product.nameRw : it.product.name,
        quantity: it.quantity,
        unitPrice: it.product.pricePerUnit,
        unit: it.product.unit,
        subtotal: it.product.pricePerUnit * it.quantity
      })),
      totalAmount,
      status: 'Pending',
      createdAt: 'Just now',
      sellerName: items[0]?.product.sellerName || 'Rwanda Farmers'
    };

    setPlacedOrder(newOrder);
    onOrderPlaced(newOrder);
    onClearCart();
    setStep('success');
    notify(lang === 'rw' ? 'Ibyo watumije byemejwe neza! Uzishyura igihe bikugezeho.' : 'Your order has been placed! You will pay cash upon delivery.');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0b1a13] border-l border-emerald-500/25 h-full flex flex-col justify-between shadow-2xl text-white">
        {/* Header */}
        <div className="p-5 border-b border-emerald-500/15 flex items-center justify-between bg-[#08150f]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {step === 'cart' ? t.cart : step === 'checkout' ? t.checkout : (lang === 'rw' ? 'Ibyemezo by\'Ibyatumijwe' : 'Order Confirmation')}
              </h3>
              <p className="text-[10px] text-emerald-300/70 font-mono">
                {items.length} {lang === 'rw' ? 'amoko y\'umusaruro' : 'items in order'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-900/30"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <div className="text-4xl">🛒</div>
                  <p className="text-xs text-emerald-200 font-semibold">
                    {lang === 'rw' ? 'Nta kintu kiri mu gatebo kawe.' : 'Your cart is currently empty.'}
                  </p>
                  <p className="text-[11px] text-emerald-400/60 max-w-xs mx-auto">
                    {lang === 'rw'
                      ? 'Reba mu musaruro w\'abahinzi uhitemo inyanya, ibirayi n\'ibindi biribwa bishya.'
                      : 'Explore fresh tomatoes, potatoes, bananas, and milk from Rwandan farmers.'}
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-3 bg-emerald-500 text-[#062114] px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    {lang === 'rw' ? 'Tembera mu Isoko' : 'Start Shopping'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 bg-[#0f241a] rounded-xl border border-emerald-500/15 flex items-center justify-between gap-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-12 w-12 rounded-lg object-cover shrink-0 border border-emerald-500/20"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-white truncate">
                          {lang === 'rw' ? item.product.nameRw : item.product.name}
                        </div>
                        <div className="text-[11px] text-emerald-400 font-mono">
                          RWF {item.product.pricePerUnit.toLocaleString()} / {item.product.unit}
                        </div>
                        <div className="text-[10px] text-emerald-300/60 truncate">
                          {item.product.location}
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-1.5 bg-[#091610] p-1 rounded-lg border border-emerald-500/20">
                        <button
                          onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                          className="h-5 w-5 rounded bg-emerald-950 text-emerald-200 flex items-center justify-center hover:bg-emerald-900"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-xs font-bold font-mono px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                          className="h-5 w-5 rounded bg-emerald-950 text-emerald-200 flex items-center justify-center hover:bg-emerald-900"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      <div className="text-right font-mono font-bold text-xs text-emerald-300">
                        RWF {(item.product.pricePerUnit * item.quantity).toLocaleString()}
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-emerald-500/60 hover:text-red-400 p-1"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                  {lang === 'rw' ? 'Amazina y’Umuguzi' : 'Customer Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                  {lang === 'rw' ? 'Nimero ya Telefoni (MTN MoMo / Airtel)' : 'Phone Number (MTN / Airtel)'}
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+250 788 000 000"
                  className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                    {t.deliveryDistrict}
                  </label>
                  <select
                    value={deliveryDistrict}
                    onChange={(e) => setDeliveryDistrict(e.target.value)}
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
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                    {t.deliveryAddress}
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="KG 11 Ave, House #24"
                    className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                  {t.paymentMethod} (Rwandan Modes)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'MTN Mobile Money (MoMo)', label: 'MTN MoMo', sub: '*182#', icon: Smartphone, color: 'text-yellow-400' },
                    { id: 'Airtel Money', label: 'Airtel Money', sub: '*500#', icon: Smartphone, color: 'text-red-400' },
                    { id: 'Bank of Kigali (BK Quick)', label: 'BK Quick', sub: 'Internet Bank', icon: Building2, color: 'text-blue-400' },
                    { id: 'Cash on Delivery', label: 'Cash / Ntoki', sub: 'Pay upon delivery', icon: Truck, color: 'text-emerald-400' }
                  ].map((m) => {
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                            : 'bg-[#0f241a] border-emerald-500/20 text-emerald-200 hover:bg-emerald-900/30'
                        }`}
                      >
                        <m.icon size={15} className={m.color} />
                        <span className="text-[11px] font-bold">{m.label}</span>
                        <span className="text-[9px] opacity-70 font-mono">{m.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MoMo Helper & Interactive Simulator Trigger */}
              <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-300/80 space-y-2">
                <div className="flex items-start gap-1.5">
                  <ShieldCheck size={14} className="mt-0.5 text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'rw'
                      ? 'Iyo wemeje itegeko, uhita ubona ubutumwa bwa USSD (*182#) bugusaba PIN yo kwishyura kuri MTN cyangwa Airtel.'
                      : 'Submitting will prompt your phone with Rwandan MoMo USSD prompt (*182#) to authorize payment.'}
                  </span>
                </div>
                {paymentMethod !== 'Cash on Delivery' && (
                  <button
                    type="button"
                    onClick={() => setShowRwandanPaymentModal(true)}
                    className="w-full bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 border border-yellow-400/40 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Smartphone size={13} />
                    <span>{lang === 'rw' ? 'Kora Ikizamini cyo Kwishyura kuri MoMo (*182#)' : 'Launch Interactive MoMo USSD (*182#)'}</span>
                  </button>
                )}
              </div>
            </form>
          )}

          {step === 'success' && placedOrder && (
            <div className="py-6 text-center space-y-4">
              <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/30">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 font-mono tracking-widest">
                  {lang === 'rw' ? 'Ibyatumijwe Byemewe' : 'Order Confirmed'}
                </span>
                <h4 className="text-lg font-black text-white mt-1">
                  {placedOrder.orderNumber}
                </h4>
                <p className="text-xs text-emerald-200/80 mt-1">
                  {lang === 'rw'
                    ? `Murakoze ${placedOrder.customerName}. Ubutumwa bwoherejwe kuri ${placedOrder.customerPhone}.`
                    : `Thank you ${placedOrder.customerName}! We have dispatched order details to ${placedOrder.customerPhone}.`}
                </p>
              </div>

              <div className="bg-[#0f241a] p-4 rounded-2xl border border-emerald-500/20 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between text-emerald-300">
                  <span>Status:</span>
                  <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300 font-bold">
                    {placedOrder.status}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-300">
                  <span>Destination:</span>
                  <span className="text-white">{placedOrder.deliveryDistrict}</span>
                </div>
                <div className="flex justify-between text-emerald-300">
                  <span>Payment:</span>
                  <span className="text-white">{placedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-t border-emerald-500/20 pt-2 text-sm font-bold text-white">
                  <span>Total Paid:</span>
                  <span className="text-emerald-400">RWF {placedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep('cart');
                  onClose();
                }}
                className="w-full bg-emerald-500 text-[#072416] py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-400 transition"
              >
                {lang === 'rw' ? 'Komeza Guhaha' : 'Continue Shopping'}
              </button>
            </div>
          )}
        </div>

        {/* Footer Summary & Action */}
        {step !== 'success' && items.length > 0 && (
          <div className="p-5 border-t border-emerald-500/15 bg-[#08150f] space-y-3">
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-emerald-300/80">
                <span>{t.subtotal}:</span>
                <span>RWF {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-300/80">
                <span>{lang === 'rw' ? 'Kugezaho (Transport):' : 'Local Delivery:'}</span>
                <span>RWF {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white border-t border-emerald-500/15 pt-2">
                <span>{t.total}:</span>
                <span className="text-emerald-400">RWF {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#072416] py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition"
              >
                <span>{t.checkout}</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="w-1/3 bg-emerald-950 border border-emerald-500/30 text-emerald-300 py-3 rounded-xl font-bold text-xs hover:bg-emerald-900/50"
                >
                  {lang === 'rw' ? 'Gusubira Inyuma' : 'Back'}
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-[#072416] py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition"
                >
                  <span>{t.placeOrder}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rwandan MoMo / Bank Interactive Payment Modal */}
      <RwandanPaymentModal
        isOpen={showRwandanPaymentModal}
        onClose={() => setShowRwandanPaymentModal(false)}
        totalAmount={totalAmount}
        orderNumber={currentOrderNumber}
        customerPhone={customerPhone}
        customerName={customerName}
        lang={lang}
        onPaymentSuccess={handlePaymentSuccess}
        notify={notify}
      />
    </div>
  );
}
