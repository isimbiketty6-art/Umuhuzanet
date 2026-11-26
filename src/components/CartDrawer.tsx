import { useState, useEffect } from 'react';
import { CartItem, Language, AgriOrder } from '../types/agri';
import { AuthUser } from '../utils/authStorage';
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
  Building2,
  Clock,
  Radio,
  Package
} from 'lucide-react';

export function CartDrawer({
  isOpen,
  onClose,
  items,
  orders = [],
  rwfPerUsd = 1385,
  currentUser = null,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout,
  lang,
  notify
}: {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orders?: AgriOrder[];
  rwfPerUsd?: number;
  currentUser?: AuthUser | null;
  onUpdateQty: (productId: string, newQty: number) => Promise<void> | void;
  onRemoveItem: (productId: string) => Promise<void> | void;
  onClearCart: () => Promise<void> | void;
  onCheckout: (payload: {
    customerName: string;
    customerPhone: string;
    deliveryDistrict: string;
    deliveryAddress: string;
    paymentMethod: string;
    paymentRef?: string;
  }) => Promise<{ ok: boolean; order?: AgriOrder; error?: string }>;
  lang: Language;
  notify: (msg: string) => void;
}) {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart');
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [deliveryDistrict, setDeliveryDistrict] = useState(
    currentUser?.district || 'Gasabo (Kigali)'
  );
  const [deliveryAddress, setDeliveryAddress] = useState('KG 11 Ave, Kimironko Sector');
  const [paymentMethod, setPaymentMethod] = useState<
    'MTN Mobile Money (MoMo)' | 'Airtel Money' | 'Bank of Kigali (BK Quick)' | 'Cash on Delivery'
  >('MTN Mobile Money (MoMo)');
  const [placedOrder, setPlacedOrder] = useState<AgriOrder | null>(null);
  const [showRwandanPaymentModal, setShowRwandanPaymentModal] = useState(false);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [pendingOrderRef, setPendingOrderRef] = useState(
    () => `UMH-${Math.floor(10000 + Math.random() * 90000)}`
  );

  // Sync user identity fields when signed-in user changes
  useEffect(() => {
    if (currentUser) {
      setCustomerName((prev) => prev || currentUser.name);
      setCustomerPhone((prev) => prev || currentUser.phone);
      if (currentUser.district) {
        setDeliveryDistrict(currentUser.district);
      }
    }
  }, [currentUser]);

  // Reset back to cart view when user opens drawer with items in cart after a previous order
  useEffect(() => {
    if (isOpen && items.length > 0 && step === 'success') {
      setStep('cart');
      setPlacedOrder(null);
      setCheckoutError(null);
      setPendingOrderRef(`UMH-${Math.floor(10000 + Math.random() * 90000)}`);
    }
    if (isOpen && items.length > 0) {
      setActiveTab('cart');
    }
  }, [isOpen, items.length, step]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.pricePerUnit * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 1500 : 0;
  const totalAmount = subtotal + deliveryFee;
  const totalUsd = Math.round((totalAmount / (rwfPerUsd || 1385)) * 100) / 100;

  const executeServerCheckout = async (methodLabel: string, paymentRef?: string) => {
    setCheckoutPending(true);
    setCheckoutError(null);
    const result = await onCheckout({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryDistrict,
      deliveryAddress: deliveryAddress.trim(),
      paymentMethod: methodLabel,
      paymentRef
    });
    setCheckoutPending(false);

    if (!result.ok || !result.order) {
      setCheckoutError(result.error || 'Failed to place order. Please check your details.');
      return false;
    }

    setPlacedOrder(result.order);
    setShowRwandanPaymentModal(false);
    setStep('success');
    setPendingOrderRef(`UMH-${Math.floor(10000 + Math.random() * 90000)}`);
    return true;
  };

  const handlePaymentSuccess = async (methodName: string, txnId: string) => {
    if (items.length === 0) return;
    const ok = await executeServerCheckout(methodName, txnId);
    if (ok) {
      notify(
        lang === 'rw'
          ? `Kwishyura byemejwe! Umubare w'icyemezo: ${txnId}`
          : `Payment verified via ${methodName}! Ref: ${txnId}`
      );
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setCheckoutError('Please complete your name, phone number, and delivery address.');
      return;
    }

    if (paymentMethod !== 'Cash on Delivery') {
      setShowRwandanPaymentModal(true);
      return;
    }

    const ok = await executeServerCheckout('Cash on Delivery', 'COD-PENDING');
    if (ok) {
      notify(
        lang === 'rw'
          ? 'Ibyo watumije byemejwe neza! Uzishyura igihe bikugezeho.'
          : 'Your order has been placed! You will pay cash upon delivery.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0b1a13] border-l border-emerald-500/25 h-full flex flex-col justify-between shadow-2xl text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-500/15 bg-[#08150f] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShoppingBag size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">
                    {activeTab === 'orders'
                      ? lang === 'rw'
                        ? 'Ibyatumijwe Mu Gihe Nyacyo'
                        : 'Live Order Tracker'
                      : step === 'cart'
                      ? t.cart
                      : step === 'checkout'
                      ? t.checkout
                      : lang === 'rw'
                      ? "Ibyemezo by'Ibyatumijwe"
                      : 'Order Confirmation'}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[9px] font-mono font-bold">
                    <Radio size={9} className="animate-pulse" />
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-emerald-300/70 font-mono">
                  {items.length} {lang === 'rw' ? "amoko mu gatebo" : 'items in cart'} · 1 USD ={' '}
                  {rwfPerUsd.toLocaleString()} RWF
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-900/30"
              aria-label="Close cart drawer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Tabs: Live Cart vs Live Orders */}
          <div className="grid grid-cols-2 gap-1.5 bg-[#05100b] p-1 rounded-xl border border-emerald-500/15 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('cart')}
              className={`py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'cart'
                  ? 'bg-emerald-500 text-[#062114] font-bold'
                  : 'text-emerald-200/80 hover:text-white'
              }`}
            >
              <ShoppingBag size={13} />
              <span>
                {lang === 'rw' ? 'Agatebo' : 'Cart'} ({items.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-emerald-500 text-[#062114] font-bold'
                  : 'text-emerald-200/80 hover:text-white'
              }`}
            >
              <Clock size={13} />
              <span>
                {lang === 'rw' ? 'Ibyatumijwe' : 'Live Orders'} ({orders.length})
              </span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'orders' ? (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-16 text-xs text-emerald-200/70">
                  No orders recorded yet.
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="rounded-2xl border border-emerald-500/20 bg-[#0f241a] p-4 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white">{ord.orderNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : ord.status === 'Processing'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-200/80">
                      {ord.items.map((it) => `${it.quantity}× ${it.productName}`).join(', ')}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-emerald-500/15 font-mono text-[11px]">
                      <span className="text-emerald-300/70">{ord.deliveryDistrict}</span>
                      <span className="font-bold text-emerald-400">
                        RWF {ord.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              {step === 'cart' && (
                <>
                  {items.length === 0 ? (
                    <div className="text-center py-20 space-y-3">
                      <div className="text-4xl">🛒</div>
                      <p className="text-xs text-emerald-200 font-semibold">
                        {lang === 'rw'
                          ? 'Nta kintu kiri mu gatebo kawe.'
                          : 'Your cart is currently empty.'}
                      </p>
                      <p className="text-[11px] text-emerald-400/60 max-w-xs mx-auto">
                        {lang === 'rw'
                          ? "Reba mu musaruro w'abahinzi uhitemo inyanya, ibirayi n'ibindi biribwa bishya."
                          : 'Explore fresh produce and Made in Rwanda items to add them in real time.'}
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
                      <div className="flex items-center justify-between text-[11px] text-emerald-300/80">
                        <span>Server-synced real-time cart</span>
                        <button
                          onClick={() => onClearCart()}
                          className="text-rose-300 hover:text-rose-200 font-semibold"
                        >
                          Clear Cart
                        </button>
                      </div>

                      {items.map((item) => (
                        <div
                          key={item.product.id}
                          className="p-3 bg-[#0f241a] rounded-xl border border-emerald-500/15 flex items-center justify-between gap-3"
                        >
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-12 w-12 rounded-lg object-cover shrink-0 border border-emerald-500/20"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                              <Package size={18} />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs text-white truncate">
                              {lang === 'rw' ? item.product.nameRw : item.product.name}
                            </div>
                            <div className="text-[11px] text-emerald-400 font-mono">
                              RWF {item.product.pricePerUnit.toLocaleString()} / {item.product.unit}
                            </div>
                            <div className="text-[10px] text-emerald-300/60 truncate">
                              {item.product.location} · Stock: {item.product.stockQuantity}{' '}
                              {item.product.unit}
                            </div>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center gap-1.5 bg-[#091610] p-1 rounded-lg border border-emerald-500/20">
                            <button
                              onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                              className="h-5 w-5 rounded bg-emerald-950 text-emerald-200 flex items-center justify-center hover:bg-emerald-900"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-xs font-bold font-mono px-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stockQuantity}
                              className="h-5 w-5 rounded bg-emerald-950 text-emerald-200 flex items-center justify-center hover:bg-emerald-900 disabled:opacity-40"
                              aria-label="Increase quantity"
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
                  {checkoutError && (
                    <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs">
                      {checkoutError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                      {lang === 'rw' ? 'Amazina y’Umuguzi' : 'Customer Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Diane Uwamahoro"
                      className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-300 mb-1">
                      {lang === 'rw'
                        ? 'Nimero ya Telefoni (MTN MoMo / Airtel)'
                        : 'Phone Number (MTN / Airtel)'}
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
                        {
                          id: 'MTN Mobile Money (MoMo)',
                          label: 'MTN MoMo',
                          sub: '*182#',
                          icon: Smartphone,
                          color: 'text-yellow-400'
                        },
                        {
                          id: 'Airtel Money',
                          label: 'Airtel Money',
                          sub: '*500#',
                          icon: Smartphone,
                          color: 'text-red-400'
                        },
                        {
                          id: 'Bank of Kigali (BK Quick)',
                          label: 'BK Quick',
                          sub: 'Internet Bank',
                          icon: Building2,
                          color: 'text-blue-400'
                        },
                        {
                          id: 'Cash on Delivery',
                          label: 'Cash / Ntoki',
                          sub: 'Pay on delivery',
                          icon: Truck,
                          color: 'text-emerald-400'
                        }
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

                  <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-300/80 space-y-2">
                    <div className="flex items-start gap-1.5">
                      <ShieldCheck size={14} className="mt-0.5 text-emerald-400 shrink-0" />
                      <span>
                        {lang === 'rw'
                          ? 'Iyo wemeje itegeko, uhita ubona ubutumwa bwa USSD (*182#) bugusaba PIN yo kwishyura kuri MTN cyangwa Airtel.'
                          : 'Submitting verifies real-time stock on our server and authorizes your Rwandan payment method.'}
                      </span>
                    </div>
                    {paymentMethod !== 'Cash on Delivery' && (
                      <button
                        type="button"
                        onClick={() => setShowRwandanPaymentModal(true)}
                        className="w-full bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 border border-yellow-400/40 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <Smartphone size={13} />
                        <span>
                          {lang === 'rw'
                            ? 'Fungura Kwishyura kuri MoMo (*182#)'
                            : 'Open MoMo / Bank Payment (*182#)'}
                        </span>
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
                      {lang === 'rw' ? 'Ibyatumijwe Byemewe' : 'Order Confirmed & Saved'}
                    </span>
                    <h4 className="text-lg font-black text-white mt-1">
                      {placedOrder.orderNumber}
                    </h4>
                    <p className="text-xs text-emerald-200/80 mt-1">
                      {lang === 'rw'
                        ? `Murakoze ${placedOrder.customerName}. Ubutumwa bwoherejwe kuri ${placedOrder.customerPhone}.`
                        : `Thank you ${placedOrder.customerName}! Real-time stock has been reserved for ${placedOrder.customerPhone}.`}
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
                      <span className="text-emerald-400">
                        RWF {placedOrder.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setStep('cart');
                        setActiveTab('orders');
                      }}
                      className="w-1/2 border border-emerald-500/30 text-emerald-300 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-950/60 transition"
                    >
                      View Live Orders
                    </button>
                    <button
                      onClick={() => {
                        setStep('cart');
                        onClose();
                      }}
                      className="w-1/2 bg-emerald-500 text-[#072416] py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-400 transition"
                    >
                      {lang === 'rw' ? 'Komeza Guhaha' : 'Continue Shopping'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Summary & Action */}
        {activeTab === 'cart' && step !== 'success' && items.length > 0 && (
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
                <div className="text-right">
                  <div className="text-emerald-400">RWF {totalAmount.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 font-normal">≈ ${totalUsd.toFixed(2)} USD</div>
                </div>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => {
                  setCheckoutError(null);
                  setStep('checkout');
                }}
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
                  disabled={checkoutPending}
                  className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-[#072416] py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition disabled:opacity-50"
                >
                  <span>{checkoutPending ? 'Processing...' : t.placeOrder}</span>
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
        orderNumber={pendingOrderRef}
        customerPhone={customerPhone || '+250 788 123 456'}
        customerName={customerName || 'Shopper'}
        lang={lang}
        onPaymentSuccess={handlePaymentSuccess}
        notify={notify}
      />
    </div>
  );
}
