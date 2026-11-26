import { Job } from '../types';
import { X, MapPin, Clock, Briefcase, DollarSign, Bookmark, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function JobDetailModal({
  job,
  onClose,
  onApply,
  onSave,
  isSaved,
  isApplied
}: {
  job: Job | null;
  onClose: () => void;
  onApply: (job: Job) => void;
  onSave: (id: number) => void;
  isSaved: boolean;
  isApplied: boolean;
}) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-white/10 bg-[#0c1524] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-panel text-base font-bold text-mint shadow-inner">
              {job.companyLogo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{job.title}</h2>
                <span className="rounded-full border border-mint/20 bg-mint/10 px-2.5 py-0.5 text-[10px] font-semibold text-mint">
                  {job.match}% Match
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {job.company} · <MapPin size={12} className="inline text-slate-400 mr-0.5" />{job.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {/* Key Facts Strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-white/[0.06] bg-panel/50 p-3.5">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Compensation</span>
              <div className="mt-1 font-semibold text-white font-mono">{job.salary}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Employment</span>
              <div className="mt-1 font-semibold text-white">{job.type}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Category</span>
              <div className="mt-1 font-semibold text-white">{job.category}</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Posted</span>
              <div className="mt-1 font-semibold text-white">{job.posted}</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Role Overview</h4>
            <p className="leading-relaxed text-slate-300">{job.description}</p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Key Responsibilities</h4>
              <ul className="space-y-2">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Candidate Requirements</h4>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-mint" />
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Perks */}
          {job.perks && job.perks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Benefits & Perks</h4>
              <div className="flex flex-wrap gap-2">
                {job.perks.map((p, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-300"
                  >
                    ✦ {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Employer Verification Note */}
          <div className="rounded-xl border border-mint/20 bg-mint/[0.04] p-4 flex items-center gap-3">
            <ShieldCheck size={20} className="text-mint shrink-0" />
            <div className="text-[11px] leading-relaxed text-slate-300">
              <strong className="text-white">{job.company}</strong> is a registered entity verified on Umuhuza Connect with verified Rwanda Revenue Authority (RRA) compliance.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/[0.08] p-6 bg-[#090e18]/80">
          <button
            onClick={() => onSave(job.id)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
              isSaved
                ? 'border-mint text-mint bg-mint/10'
                : 'border-white/10 text-slate-300 hover:bg-white/5'
            }`}
          >
            <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
            {isSaved ? 'Saved in Watchlist' : 'Save Role'}
          </button>

          <button
            disabled={isApplied}
            onClick={() => {
              onClose();
              onApply(job);
            }}
            className="flex items-center gap-2 rounded-xl bg-mint px-6 py-2.5 text-xs font-bold text-[#07211e] hover:bg-emerald-300 disabled:opacity-60 transition"
          >
            {isApplied ? 'Application Submitted' : 'Apply for this Role'}
            {!isApplied && <ArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
