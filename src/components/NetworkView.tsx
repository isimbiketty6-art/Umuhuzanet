import { useState } from 'react';
import { CommunityGroup } from '../types';
import { Users, Calendar, MapPin, Check, Plus, ExternalLink, Sparkles } from 'lucide-react';

export function NetworkView({
  communities,
  onToggleJoin,
  notify
}: {
  communities: CommunityGroup[];
  onToggleJoin: (id: number) => void;
  notify: (msg: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = communities.filter(
    (c) => activeCategory === 'All' || c.category === activeCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/[0.08] bg-panel/75 p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-mint mb-1">
            <Users size={14} />
            <span>Professional Network & Rwandan Ecosystem</span>
          </div>
          <h1 className="text-lg font-bold text-white">Connect with Engineers, Founders & Artisans</h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Build meaningful collaborations across Kigali hubs, universities, and creative collectives.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-300">
            5,890+ Rwandan Professionals
          </span>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {filtered.map((comm) => (
          <article
            key={comm.id}
            className="rounded-2xl border border-white/[0.08] bg-panel/75 p-6 flex flex-col justify-between hover:border-white/15 transition"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-mint uppercase font-semibold tracking-wider">
                    {comm.category}
                  </span>
                  <h3 className="mt-1 font-bold text-white text-base">{comm.name}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {comm.location}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{comm.membersCount.toLocaleString()} members</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onToggleJoin(comm.id);
                    notify(comm.joined ? `Left ${comm.name}` : `Joined ${comm.name}!`);
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                    comm.joined
                      ? 'border border-mint/20 bg-mint/10 text-mint'
                      : 'bg-mint text-[#07211e] hover:bg-emerald-300'
                  }`}
                >
                  {comm.joined ? (
                    <>
                      <Check size={14} /> Member
                    </>
                  ) : (
                    <>
                      <Plus size={14} /> Join Hub
                    </>
                  )}
                </button>
              </div>

              <p className="mt-4 text-xs text-slate-300 leading-relaxed">
                {comm.description}
              </p>

              {/* Upcoming Event Box */}
              {comm.upcomingEvent && (
                <div className="mt-5 rounded-xl border border-white/[0.06] bg-[#0c1524] p-3.5">
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                    <Calendar size={12} />
                    <span>Next Kigali Gathering</span>
                  </div>
                  <div className="mt-1 font-medium text-xs text-white">
                    {comm.upcomingEvent.title}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{comm.upcomingEvent.date} · {comm.upcomingEvent.venue}</span>
                    <button
                      onClick={() => notify(`RSVP confirmed for "${comm.upcomingEvent?.title}"`)}
                      className="text-mint hover:underline font-semibold"
                    >
                      RSVP →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-white/[0.06] pt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Active weekly discussions</span>
              <button
                onClick={() => notify(`Opening community discussions for ${comm.name}`)}
                className="text-slate-300 hover:text-mint transition"
              >
                View Community Board →
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
