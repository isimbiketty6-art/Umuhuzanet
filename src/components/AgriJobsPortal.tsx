import { useState } from 'react';
import { AgriJob, Language } from '../types/agri';
import { translations } from '../data/translations';
import {
  Briefcase,
  Plus,
  MapPin,
  Clock,
  CheckCircle2,
  DollarSign,
  Send,
  X,
  FileText
} from 'lucide-react';

export function AgriJobsPortal({
  jobs,
  lang,
  onApplyJob,
  onPostJob,
  notify
}: {
  jobs: AgriJob[];
  lang: Language;
  onApplyJob: (job: AgriJob, candidateName: string, phone: string, pitch: string) => void;
  onPostJob: (job: AgriJob) => void;
  notify: (msg: string) => void;
}) {
  const t = translations[lang];

  const [selectedJob, setSelectedJob] = useState<AgriJob | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Apply Form
  const [candidateName, setCandidateName] = useState('Jean-Luc Mugisha');
  const [phone, setPhone] = useState('+250 788 123 456');
  const [pitch, setPitch] = useState('I have 2 years of experience managing drip irrigation and post-harvest produce sorting.');

  // Post Job Form
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('Akagera Agrifarm Ltd');
  const [newLocation, setNewLocation] = useState('Kayonza, Eastern Province');
  const [newDistrict, setNewDistrict] = useState('Kayonza');
  const [newSalary, setNewSalary] = useState('RWF 300,000 – 450,000 / mo');
  const [newType, setNewType] = useState<AgriJob['employmentType']>('Full-time');
  const [newDesc, setNewDesc] = useState('');

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    onApplyJob(selectedJob, candidateName, phone, pitch);
    setIsApplying(false);
    setSelectedJob(null);
    notify(lang === 'rw' ? 'Gusaba akazi byoherejwe neza!' : 'Application sent to the farm employer!');
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AgriJob = {
      id: `job-${Date.now()}`,
      title: newTitle,
      titleRw: newTitle,
      farmOrCompany: newCompany,
      location: newLocation,
      district: newDistrict,
      employmentType: newType,
      salaryRwf: newSalary,
      postedDate: 'Just now',
      description: newDesc,
      descriptionRw: newDesc,
      requirements: ['Valid national ID', 'Passionate about agricultural modern techniques'],
      applicantCount: 0,
      category: 'Farm Production'
    };

    onPostJob(created);
    setIsPosting(false);
    notify(lang === 'rw' ? 'Umurimo mushya washyizweho!' : 'New agricultural vacancy published!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-white">
      {/* Header Banner matching Infographic #2 Job Seek Portal */}
      <div className="bg-gradient-to-r from-[#0d281c] via-[#091f15] to-[#07160f] p-6 rounded-3xl border border-emerald-500/25 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
              <Briefcase size={14} />
              <span>{t.jobPortal}</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              {lang === 'rw' ? 'Imirimo n’Amahirwe mu Buhinzi n’Ubworozi' : 'Agriculture Career & Job Opportunities in Rwanda'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
              {lang === 'rw'
                ? 'Shaka akazi cyangwa utange imyanya y’akazi mu mirima n’inganda z’ibiribwa mu Rwanda.'
                : 'Connect with verified farms, agribusinesses, cooperatives, and food logistics companies.'}
            </p>
          </div>

          <button
            onClick={() => setIsPosting(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#072416] px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-lg shrink-0"
          >
            <Plus size={16} />
            <span>{lang === 'rw' ? 'Tanga Umurimo' : 'Post an Agri Job'}</span>
          </button>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {jobs.map((j) => (
          <article
            key={j.id}
            className="bg-[#0b1a13] border border-emerald-500/20 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-400/40 transition shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
                    {j.category}
                  </span>
                  <h3 className="font-bold text-white text-base leading-snug mt-1">
                    {lang === 'rw' ? j.titleRw : j.title}
                  </h3>
                  <div className="text-xs text-emerald-200/80 font-medium mt-0.5">
                    {j.farmOrCompany}
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-[10px] font-semibold text-emerald-300">
                  {j.employmentType}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-300/70">
                <MapPin size={12} className="text-emerald-400" />
                <span>{j.location}</span>
                <span>·</span>
                <Clock size={12} />
                <span>{j.postedDate}</span>
              </div>

              <p className="mt-3 text-xs text-emerald-100/70 line-clamp-3 leading-relaxed">
                {lang === 'rw' ? j.descriptionRw : j.description}
              </p>

              {/* Requirements preview */}
              <div className="mt-3 space-y-1">
                {j.requirements.slice(0, 2).map((req, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                    <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
                    <span className="truncate">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-emerald-500/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-emerald-400/70 uppercase font-mono">Salary</div>
                <div className="text-xs font-black text-white font-mono">{j.salaryRwf}</div>
              </div>

              <button
                onClick={() => {
                  setSelectedJob(j);
                  setIsApplying(true);
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-[#072416] px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <span>{lang === 'rw' ? 'Saba Umurimo' : 'Apply Now'}</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Apply Modal */}
      {isApplying && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#0b1a13] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-500/15 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Quick Job Application
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedJob.title}</h3>
                <p className="text-xs text-emerald-300/70">{selectedJob.farmOrCompany} · {selectedJob.location}</p>
              </div>
              <button
                onClick={() => {
                  setIsApplying(false);
                  setSelectedJob(null);
                }}
                className="p-1 rounded-lg text-emerald-400 hover:bg-emerald-900/30"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-emerald-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-300 mb-1">Phone Number (Rwanda)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-300 mb-1">Short Pitch / Qualifications</label>
                <textarea
                  rows={3}
                  required
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-emerald-500/15">
                <button
                  type="button"
                  onClick={() => setIsApplying(false)}
                  className="bg-emerald-950 text-emerald-300 px-4 py-2 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-[#072416] px-5 py-2 rounded-xl font-bold text-xs shadow-md"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {isPosting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#0b1a13] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-500/15 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Post an Agricultural Job</h3>
                <p className="text-xs text-emerald-300/70">Find skilled farm workers, agronomists, or sales agents.</p>
              </div>
              <button onClick={() => setIsPosting(false)} className="p-1 rounded-lg text-emerald-400 hover:bg-emerald-900/30">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-emerald-300 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Agronomist or Farm Assistant"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">Farm / Cooperative</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">Location in Rwanda</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">Monthly Salary (RWF)</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 mb-1">Job Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Seasonal">Seasonal</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-300 mb-1">Description & Tasks</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Outline responsibilities..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#0f241a] border border-emerald-500/30 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-emerald-500/15">
                <button
                  type="button"
                  onClick={() => setIsPosting(false)}
                  className="bg-emerald-950 text-emerald-300 px-4 py-2 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-[#072416] px-5 py-2 rounded-xl font-bold text-xs shadow-md"
                >
                  Publish Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
