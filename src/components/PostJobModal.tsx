import { useState } from 'react';
import { Job } from '../types';
import { X, Plus, Briefcase, MapPin } from 'lucide-react';

export function PostJobModal({
  isOpen,
  onClose,
  onPostJob
}: {
  isOpen: boolean;
  onClose: () => void;
  onPostJob: (job: Job) => void;
}) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('Kigali Tech Innovations Ltd');
  const [location, setLocation] = useState('Kigali (Nyarugenge), Rwanda');
  const [type, setType] = useState<Job['type']>('Full-time');
  const [category, setCategory] = useState<Job['category']>('Technology');
  const [salaryMin, setSalaryMin] = useState(800000);
  const [salaryMax, setSalaryMax] = useState(1300000);
  const [description, setDescription] = useState('');
  const [req1, setReq1] = useState('');
  const [req2, setReq2] = useState('');
  const [tags, setTags] = useState('React, TypeScript, Tailwind');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      id: Date.now(),
      title,
      company,
      companyLogo: company.slice(0, 2).toUpperCase(),
      location,
      type,
      category,
      salary: `RWF ${(salaryMin / 1000).toLocaleString()}k – ${(salaryMax / 1000).toLocaleString()}k / mo`,
      salaryMin,
      salaryMax,
      match: 95,
      posted: 'Just now',
      description,
      requirements: [req1, req2].filter(Boolean),
      responsibilities: ['Drive project deliverables', 'Collaborate across cross-functional teams'],
      perks: ['RSSB Health Insurance', 'Norrsken Flex Membership', 'Stipend for professional courses'],
      applicantsCount: 0,
      status: 'Open',
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean)
    };

    onPostJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex max-h-[92vh] w-full max-w-xl flex-col rounded-2xl border border-white/10 bg-[#0c1524] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint/15 text-mint">
              <Briefcase size={18} />
            </div>
            <div>
              <h3 className="font-bold text-white">Post an Opportunity in Rwanda</h3>
              <p className="text-xs text-slate-400">Reach verified Rwandan engineers, designers, and specialists</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-300">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Job Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Full-Stack Developer or Brand Designer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Company / Organization</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white outline-none focus:border-mint/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Employment Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3 py-2.5 text-xs text-white outline-none focus:border-mint/50"
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3 py-2.5 text-xs text-white outline-none focus:border-mint/50"
              >
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Agriculture & Green Tech">Agriculture & Green Tech</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Min Monthly Salary (RWF)</label>
              <input
                type="number"
                step="50000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-mint/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Max Monthly Salary (RWF)</label>
              <input
                type="number"
                step="50000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-mint/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Role Description</label>
            <textarea
              rows={3}
              required
              placeholder="Describe what the role entails and why joining your company is exciting..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111c2e] p-3 text-xs text-white outline-none focus:border-mint/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Primary Requirement</label>
              <input
                type="text"
                placeholder="e.g. 2+ years experience in React"
                value={req1}
                onChange={(e) => setReq1(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2 text-xs text-white outline-none focus:border-mint/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Secondary Requirement</label>
              <input
                type="text"
                placeholder="e.g. Excellent communication in English & Kinyarwanda"
                value={req2}
                onChange={(e) => setReq2(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#111c2e] px-3.5 py-2 text-xs text-white outline-none focus:border-mint/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Skill Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
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
              <Plus size={14} /> Publish Vacancy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
