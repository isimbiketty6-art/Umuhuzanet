import { useState } from 'react';
import { Job } from '../types';
import { X, Upload, CheckCircle2, FileText, Sparkles } from 'lucide-react';

export function ApplyModal({
  job,
  onClose,
  onSubmit
}: {
  job: Job | null;
  onClose: () => void;
  onSubmit: (appData: {
    applicantName: string;
    applicantEmail: string;
    applicantPhone: string;
    portfolioUrl: string;
    note: string;
    cvFileName: string;
  }) => void;
}) {
  const [name, setName] = useState('Jean-Luc Mugisha');
  const [email, setEmail] = useState('jeanluc.mugisha@example.rw');
  const [phone, setPhone] = useState('+250 788 123 456');
  const [portfolio, setPortfolio] = useState('https://github.com/jeanluc-mugisha/rwanda-ui');
  const [note, setNote] = useState(
    'I am excited about this role and have 3+ years of experience delivering responsive web applications in Kigali. Looking forward to discussing how I can add immediate value.'
  );
  const [cvName, setCvName] = useState('JeanLuc_Mugisha_CV_2026.pdf');
  const [isUploading, setIsUploading] = useState(false);

  if (!job) return null;

  const handleFakeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setCvName(e.target.files![0].name);
      }, 400);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      applicantName: name,
      applicantEmail: email,
      applicantPhone: phone,
      portfolioUrl: portfolio,
      note,
      cvFileName: cvName
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex max-h-[92vh] w-full max-w-xl flex-col rounded-2xl border border-white/10 bg-[#0c1524] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
          <div>
            <span className="text-[10px] font-bold text-mint uppercase tracking-wider">Quick Application</span>
            <h3 className="text-base font-bold text-white mt-0.5">{job.title}</h3>
            <p className="text-xs text-slate-400">{job.company} · {job.location}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Phone Number (MTN / Airtel Rwanda)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+250 788 000 000"
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-mint/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Portfolio or GitHub URL</label>
              <input
                type="url"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://yourportfolio.rw"
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
              />
            </div>
          </div>

          {/* Resume Upload Box */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Resume / CV Attachment</label>
            <div className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-center hover:border-mint/40 transition">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFakeUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint/10 text-mint mb-2">
                <Upload size={18} />
              </div>
              {isUploading ? (
                <span className="text-xs text-mint">Uploading document...</span>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <FileText size={14} className="text-mint" />
                    <span>{cvName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">Click or drag another PDF (up to 5MB)</span>
                </>
              )}
            </div>
          </div>

          {/* Intro Pitch */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-medium text-slate-300">Personal Pitch / Cover Note</label>
              <span className="text-[10px] text-slate-500">Concise pitch for Rwandan recruiters</span>
            </div>
            <textarea
              rows={3}
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111c2e] p-3 text-xs text-white outline-none focus:border-mint/50 leading-relaxed"
            />
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-panel/60 p-3.5 text-[11px] text-slate-400">
            <CheckCircle2 size={13} className="text-mint inline mr-1.5" />
            Your application will be transmitted directly to {job.company}'s hiring portal and tracked under your Umuhuza Career dashboard.
          </div>

          {/* Footer */}
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
              className="rounded-xl bg-mint px-5 py-2.5 text-xs font-bold text-[#07211e] hover:bg-emerald-300 transition"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
