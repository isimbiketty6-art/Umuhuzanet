import { useState } from 'react';
import { UserRole } from '../types';
import {
  X,
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  TrendingUp,
  CreditCard,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

export function SubscriptionsModal({
  isOpen,
  onClose,
  role,
  onSubscribeSuccess,
  notify
}: {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  onSubscribeSuccess: (planName: string, priceRwf: number) => void;
  notify: (msg: string) => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'growth' | 'enterprise'>('growth');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [phone, setPhone] = useState('+250 788 123 456');

  if (!isOpen) return null;

  const plans = [
    {
      id: 'starter',
      name: 'Starter Talent',
      priceMonthly: 0,
      priceAnnual: 0,
      description: 'Ideal for early-stage Rwandan startups and family cooperatives testing recruitment.',
      features: [
        '1 Active Job Listing',
        'Standard 30-day posting duration',
        'Basic applicant inbox',
        'Standard search ranking'
      ],
      cta: 'Current Free Tier',
      isCurrent: true
    },
    {
      id: 'growth',
      name: 'Growth Pro Hiring',
      priceMonthly: 35000,
      priceAnnual: 350000,
      badge: 'Most Popular in Kigali',
      description: 'For growing tech companies, agricultural exporters, and retail chains hiring regularly.',
      features: [
        'Up to 10 Active Job Listings',
        'Featured "Verified Employer" Badge',
        'Instant MoMo SMS alerts on new applications',
        'Direct Candidate WhatsApp / Phone Access',
        'Promoted to top of Career & Jobs feed',
        'Unlimited candidate resume downloads'
      ],
      cta: 'Upgrade to Growth Pro',
      isCurrent: false
    },
    {
      id: 'enterprise',
      name: 'Cooperative Enterprise',
      priceMonthly: 95000,
      priceAnnual: 950000,
      description: 'Full-service hiring, bulk agricultural labor deployment, and dedicated recruiter support.',
      features: [
        'Unlimited Job & Contract Postings',
        'Dedicated Rwandan HR Account Manager',
        'Pre-vetted agronomists & engineers pipeline',
        'Custom RRA-compliant electronic invoices',
        'Integration with internal HRMS & Payroll'
      ],
      cta: 'Activate Enterprise',
      isCurrent: false
    }
  ];

  const handleCheckout = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    if (plan.priceMonthly === 0) {
      notify('You are already on the Starter plan.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual;
      onSubscribeSuccess(plan.name, price);
      notify(`Successfully subscribed to ${plan.name} via MTN MoMo (*182#)!`);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-[#0c1524] shadow-2xl text-white p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Heading Banner */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint">
            <Sparkles size={14} />
            <span>Employer Subscriptions & Promoted Plans</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Hire Top Rwandan Talent Faster
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Promote your job vacancies, reach 12,000+ candidates across Kigali and all 30 districts, and streamline hiring with Mobile Money.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.03] p-1 mt-4 text-xs font-semibold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-lg px-3 py-1.5 transition ${
                billingCycle === 'monthly' ? 'bg-mint text-[#07211e] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`rounded-lg px-3 py-1.5 transition flex items-center gap-1.5 ${
                billingCycle === 'annual' ? 'bg-mint text-[#07211e] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual (Save 17%)</span>
              <span className="rounded bg-amber-400/20 text-amber-300 text-[9px] px-1 py-0.2 font-mono">Save</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {plans.map((plan) => {
            const isHighlight = plan.id === 'growth';
            const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
                  isHighlight
                    ? 'border-mint bg-[#0f232d] shadow-xl shadow-mint/10 ring-1 ring-mint'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-mint px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#07211e] shadow-md">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <h3 className="font-bold text-sm text-white">{plan.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 min-h-[32px]">{plan.description}</p>

                  <div className="my-4 border-y border-white/10 py-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white font-mono">
                        {price === 0 ? 'Free' : `RWF ${price.toLocaleString()}`}
                      </span>
                      {price > 0 && (
                        <span className="text-xs text-slate-400">
                          /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Billed in Rwandan Francs (RWF)
                    </span>
                  </div>

                  {/* Features list */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Includes:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check size={14} className="mt-0.5 text-mint shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  disabled={plan.isCurrent || isProcessing}
                  onClick={() => handleCheckout(plan.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md ${
                    plan.isCurrent
                      ? 'bg-white/10 text-slate-400 cursor-default'
                      : isHighlight
                      ? 'bg-mint text-[#07211e] hover:bg-emerald-300 shadow-mint/20'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <span>Authorizing MoMo...</span>
                  ) : (
                    <span>{plan.cta}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Rwandan MoMo Guarantee Footer */}
        <div className="rounded-2xl border border-white/10 bg-[#08121f] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-yellow-400/20 text-yellow-300 flex items-center justify-center font-bold">
              <Smartphone size={18} />
            </div>
            <div>
              <strong className="text-white block">Rwandan Payment Methods Supported</strong>
              <span>MTN Mobile Money (*182#), Airtel Money (*500#), and Bank of Kigali Wire</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-mint">
            <ShieldCheck size={14} />
            <span>Instant activation with official RRA tax invoice</span>
          </div>
        </div>
      </div>
    </div>
  );
}
