import { useState } from 'react';
import { Application, Job, UserRole } from '../types';
import {
  X,
  Briefcase,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  ChevronRight,
  ShieldCheck,
  Award,
  Filter,
  MessageSquare
} from 'lucide-react';

export function ApplicationsTrackerModal({
  isOpen,
  onClose,
  applications,
  jobs,
  role,
  onUpdateStatus,
  onOpenMessageCandidate,
  notify
}: {
  isOpen: boolean;
  onClose: () => void;
  applications: Application[];
  jobs: Job[];
  role: UserRole;
  onUpdateStatus: (appId: string, newStatus: Application['status']) => void;
  onOpenMessageCandidate?: (applicantName: string, jobTitle: string) => void;
  notify: (msg: string) => void;
}) {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(applications[0]?.id || null);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  if (!isOpen) return null;

  const isEmployer = role === 'Employer' || role === 'Administrator';

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'All') return true;
    return app.status === filterStatus;
  });

  const selectedApp = applications.find((a) => a.id === selectedAppId) || filteredApps[0];

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'Submitted':
        return <span className="rounded-lg bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 font-mono">Submitted</span>;
      case 'Reviewing':
        return <span className="rounded-lg bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 font-mono">Under Review</span>;
      case 'Interview':
        return <span className="rounded-lg bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 font-mono">Interview</span>;
      case 'Offer':
        return <span className="rounded-lg bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 font-mono">Offer Made</span>;
      case 'Rejected':
        return <span className="rounded-lg bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-300 font-mono">Archived</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-[#0c1524] shadow-2xl text-white flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#08121f]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/10 text-mint">
              <Briefcase size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  {isEmployer ? 'Employer Recruitment & Applicant Pipeline' : 'My Job Applications Tracker'}
                </h2>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                  {applications.length} Records
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isEmployer
                  ? 'Review Rwandan candidate profiles, schedule interviews, and issue job offers'
                  : 'Track your submitted applications, feedback, and interview schedules in Rwanda'}
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

        {/* Filter bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-2.5 bg-white/[0.02] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1">Stage:</span>
            {['All', 'Submitted', 'Reviewing', 'Interview', 'Offer'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                  filterStatus === st
                    ? 'bg-mint text-[#07211e] font-bold shadow-sm'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Split Master-Detail */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* List column */}
          <div className="md:col-span-5 border-r border-white/10 overflow-y-auto p-3 space-y-2 max-h-[500px]">
            {filteredApps.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No applications match this filter.
              </div>
            ) : (
              filteredApps.map((app) => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <button
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-white/10 border-mint/40 shadow-md'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-white line-clamp-1">{app.jobTitle}</span>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="text-[11px] text-slate-300 flex items-center justify-between">
                      <span>{app.company}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{app.submittedAt}</span>
                    </div>
                    {isEmployer && (
                      <div className="text-[10px] text-mint font-medium flex items-center gap-1">
                        <User size={10} />
                        <span>Candidate: {app.applicantName}</span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Details column */}
          <div className="md:col-span-7 overflow-y-auto p-6 space-y-5 max-h-[500px]">
            {selectedApp ? (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Application ID: {selectedApp.id}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{selectedApp.jobTitle}</h3>
                    <p className="text-xs text-slate-300">{selectedApp.company} · Applied {selectedApp.submittedAt}</p>
                  </div>
                  <div>{getStatusBadge(selectedApp.status)}</div>
                </div>

                {/* Candidate Information Card */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <User size={14} className="text-mint" />
                    <span>Candidate Profile & Contact</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Name</span>
                      <strong className="text-white">{selectedApp.applicantName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Phone</span>
                      <span className="text-mint font-mono">{selectedApp.applicantPhone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Email</span>
                      <span className="text-slate-300 font-mono truncate block">{selectedApp.applicantEmail}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Experience</span>
                      <span className="text-white">{selectedApp.experienceYears || 3}+ Years Experience</span>
                    </div>
                  </div>

                  {(selectedApp.pitch || selectedApp.note) && (
                    <div className="border-t border-white/10 pt-3">
                      <span className="text-[10px] text-slate-400 block mb-1">Cover Note / Pitch</span>
                      <p className="text-xs text-slate-300 bg-black/30 p-3 rounded-xl border border-white/5 leading-relaxed">
                        "{selectedApp.pitch || selectedApp.note}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Timeline Stepper */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Recruitment Progress Pipeline
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { key: 'Submitted', label: '1. Applied' },
                      { key: 'Reviewing', label: '2. Review' },
                      { key: 'Interview', label: '3. Interview' },
                      { key: 'Offer', label: '4. Offer' }
                    ].map((step, idx) => {
                      const stages = ['Submitted', 'Reviewing', 'Interview', 'Offer'];
                      const currentIdx = stages.indexOf(selectedApp.status);
                      const isComplete = currentIdx >= idx;
                      const isCurrent = stages[currentIdx] === step.key;

                      return (
                        <div
                          key={step.key}
                          className={`p-2 rounded-xl border text-center transition ${
                            isCurrent
                              ? 'bg-mint/20 border-mint text-white font-bold'
                              : isComplete
                              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                              : 'bg-white/[0.02] border-white/5 text-slate-500'
                          }`}
                        >
                          <div className="text-[10px]">{step.label}</div>
                          {isComplete && <CheckCircle2 size={12} className="mx-auto mt-1 text-mint" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions for Employers */}
                {isEmployer && (
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 block">Update Candidate Stage:</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          onUpdateStatus(selectedApp.id, 'Reviewing');
                          notify('Candidate moved to Under Review');
                        }}
                        className="py-1.5 px-3 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition"
                      >
                        Mark Under Review
                      </button>
                      <button
                        onClick={() => {
                          onUpdateStatus(selectedApp.id, 'Interview');
                          notify('Candidate invited to Interview in Kigali / Online');
                        }}
                        className="py-1.5 px-3 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs font-bold transition"
                      >
                        Schedule Interview
                      </button>
                      <button
                        onClick={() => {
                          onUpdateStatus(selectedApp.id, 'Offer');
                          notify('Job offer extended to candidate!');
                        }}
                        className="py-1.5 px-3 rounded-xl bg-mint text-[#07211e] hover:bg-emerald-300 text-xs font-bold transition shadow-md shadow-mint/20"
                      >
                        Extend Job Offer
                      </button>
                      <button
                        onClick={() => {
                          onUpdateStatus(selectedApp.id, 'Rejected');
                          notify('Application marked as archived');
                        }}
                        className="py-1.5 px-3 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-medium transition"
                      >
                        Archive / Decline
                      </button>
                      {onOpenMessageCandidate && (
                        <button
                          onClick={() => onOpenMessageCandidate(selectedApp.applicantName, selectedApp.jobTitle)}
                          className="py-1.5 px-3 rounded-xl border border-white/20 text-slate-200 hover:bg-white/5 text-xs font-medium transition flex items-center gap-1.5 ml-auto"
                        >
                          <MessageSquare size={13} />
                          <span>Direct Message</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 text-slate-400 text-xs">
                Select an application from the left panel to view its full dossier.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
