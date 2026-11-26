import { useState, useMemo } from 'react';
import { Job, Application } from '../types';
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  MapPin,
  Clock,
  Briefcase,
  ArrowRight,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Filter
} from 'lucide-react';

export function JobsView({
  jobs,
  savedJobIds,
  appliedJobIds,
  applications,
  onSelectJob,
  onSaveJob,
  onOpenApply,
  onOpenPostJob,
  notify
}: {
  jobs: Job[];
  savedJobIds: number[];
  appliedJobIds: number[];
  applications: Application[];
  onSelectJob: (job: Job) => void;
  onSaveJob: (id: number) => void;
  onOpenApply: (job: Job) => void;
  onOpenPostJob: () => void;
  notify: (msg: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'applied'>('all');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All categories');
  const [jobType, setJobType] = useState<string>('All');
  const [minSalary, setMinSalary] = useState<number>(0);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Tab filter
      if (activeTab === 'saved' && !savedJobIds.includes(job.id)) return false;
      if (activeTab === 'applied' && !appliedJobIds.includes(job.id)) return false;

      // Search query
      const matchQuery =
        `${job.title} ${job.company} ${job.location} ${job.category} ${job.tags.join(' ')}`
          .toLowerCase()
          .includes(query.toLowerCase());
      if (!matchQuery) return false;

      // Category filter
      if (category !== 'All categories' && job.category !== category) return false;

      // Job Type filter
      if (jobType !== 'All' && job.type !== jobType) return false;

      // Salary filter
      if (minSalary > 0 && job.salaryMax < minSalary) return false;

      return true;
    });
  }, [jobs, activeTab, savedJobIds, appliedJobIds, query, category, jobType, minSalary]);

  return (
    <div className="space-y-6">
      {/* Top action strip */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/[0.08] bg-panel/75 p-5">
        <div>
          <h1 className="text-lg font-bold text-white">Rwanda Career & Vacancy Portal</h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Discover verified roles across Kigali, innovation hubs, and remote positions in Rwanda.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPostJob}
            className="flex items-center gap-2 rounded-xl bg-mint px-4 py-2.5 text-xs font-bold text-[#07211e] hover:bg-emerald-300 transition"
          >
            <Plus size={14} /> Post Vacancy
          </button>
        </div>
      </div>

      {/* Tabs: All / Saved / Applied */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
        {[
          { id: 'all', label: `All Vacancies (${jobs.length})` },
          { id: 'saved', label: `Saved Roles (${savedJobIds.length})` },
          { id: 'applied', label: `My Applications (${appliedJobIds.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-lg px-3.5 py-2 text-xs font-medium transition ${
              activeTab === tab.id
                ? 'bg-mint/15 text-mint font-semibold shadow-sm'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filters Bar */}
      <div className="grid gap-3 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search role, skills (e.g. React), company, Kigali..."
            className="w-full rounded-xl border border-white/10 bg-[#0d1524] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 outline-none focus:border-mint/50"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0d1524] px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-mint/50"
        >
          <option>All categories</option>
          <option>Technology</option>
          <option>Design</option>
          <option>Business</option>
          <option>Agriculture & Green Tech</option>
          <option>Operations</option>
        </select>

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0d1524] px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-mint/50"
        >
          <option>All</option>
          <option>Full-time</option>
          <option>Contract</option>
          <option>Hybrid</option>
          <option>Remote</option>
          <option>Internship</option>
        </select>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="flex items-center gap-1.5">
          <SlidersHorizontal size={13} className="text-mint" />
          <span>Showing verified opportunities in Rwanda</span>
        </span>
        <span className="font-mono">{filteredJobs.length} results</span>
      </div>

      {/* Job Cards Grid */}
      <div className="grid gap-4 xl:grid-cols-2">
        {filteredJobs.map((job) => {
          const isSaved = savedJobIds.includes(job.id);
          const isApplied = appliedJobIds.includes(job.id);

          return (
            <article
              key={job.id}
              className="rounded-2xl border border-white/[0.08] bg-panel/75 p-5 transition hover:border-white/15 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold font-mono text-mint">
                      {job.companyLogo}
                    </div>
                    <div>
                      <h3
                        onClick={() => onSelectJob(job)}
                        className="font-bold text-white hover:text-mint cursor-pointer text-sm transition"
                      >
                        {job.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                        <span>{job.company}</span>
                        <span aria-hidden="true">·</span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSaveJob(job.id)}
                    className={`rounded-lg p-2 transition ${
                      isSaved ? 'text-mint bg-mint/10' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save job'}
                  >
                    <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skill tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[10px] text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                  <span className="rounded-md border border-mint/20 bg-mint/5 px-2 py-0.5 text-[10px] font-semibold text-mint font-mono">
                    {job.match}% match
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                <div>
                  <div className="text-xs font-bold text-white font-mono">{job.salary}</div>
                  <div className="mt-0.5 text-[10px] text-slate-500">{job.posted} · {job.type}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectJob(job)}
                    className="rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition"
                  >
                    Details
                  </button>
                  <button
                    disabled={isApplied}
                    onClick={() => onOpenApply(job)}
                    className="rounded-xl bg-mint px-4 py-2 text-xs font-bold text-[#07211e] hover:bg-emerald-300 disabled:opacity-50 transition"
                  >
                    {isApplied ? 'Applied' : 'Quick apply'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-xs text-slate-500">
          No opportunities match your current filters. Try resetting keyword or salary filters.
        </div>
      )}

      {/* Applied Roles Table Tracker */}
      {activeTab === 'applied' && applications.length > 0 && (
        <div className="rounded-2xl border border-white/[0.08] bg-panel/75 p-6 mt-8">
          <h2 className="text-sm font-semibold text-white mb-3">Live Application Tracker</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">Job Title</th>
                  <th className="pb-3 font-semibold">Company</th>
                  <th className="pb-3 font-semibold">Submitted</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-300">
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="py-3 font-medium text-white">{app.jobTitle}</td>
                    <td className="py-3 text-slate-400">{app.company}</td>
                    <td className="py-3 text-slate-500 font-mono text-[11px]">{app.submittedAt}</td>
                    <td className="py-3">
                      <span className="rounded-md border border-mint/20 bg-mint/10 px-2 py-0.5 text-[10px] font-semibold text-mint">
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => notify(`Viewing status updates for ${app.jobTitle}`)}
                        className="text-mint hover:underline text-xs"
                      >
                        Track Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
