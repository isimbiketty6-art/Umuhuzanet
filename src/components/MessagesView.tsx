import { useState } from 'react';
import { MessageThread } from '../types';
import { Send, CheckCheck, Clock, CircleUserRound } from 'lucide-react';

export function MessagesView({
  threads,
  onSendMessage,
  notify
}: {
  threads: MessageThread[];
  onSendMessage: (threadId: string, text: string) => void;
  notify: (msg: string) => void;
}) {
  const [activeThreadId, setActiveThreadId] = useState(threads[0]?.id || '');
  const [inputText, setInputText] = useState('');

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    onSendMessage(activeThread.id, inputText.trim());
    setInputText('');
    notify('Message delivered');
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-panel/75 overflow-hidden grid lg:grid-cols-[300px_1fr] h-[75vh] min-h-[520px]">
      {/* Sidebar Threads List */}
      <div className="border-r border-white/[0.08] flex flex-col bg-[#0b1322]">
        <div className="p-4 border-b border-white/[0.08]">
          <h2 className="text-sm font-bold text-white">Direct Messages</h2>
          <p className="text-[11px] text-slate-400">Employers, artisans & clients</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
          {threads.map((t) => {
            const isActive = t.id === activeThreadId;
            return (
              <button
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className={`w-full p-4 text-left transition flex items-start gap-3 hover:bg-white/[0.03] ${
                  isActive ? 'bg-mint/10 border-l-2 border-mint' : ''
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] font-bold text-mint font-mono text-xs">
                  {t.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white truncate">{t.contactName}</span>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">{t.time}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{t.company || t.contactRole}</div>
                  <p className="text-[11px] text-slate-300 truncate mt-1">
                    {t.lastMessage}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Conversation Zone */}
      {activeThread ? (
        <div className="flex flex-col bg-panel/40">
          {/* Thread Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#0c1524]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] font-bold text-mint font-mono text-xs">
                {activeThread.avatar}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{activeThread.contactName}</h3>
                <p className="text-[11px] text-slate-400">
                  {activeThread.contactRole} {activeThread.company ? `· ${activeThread.company}` : ''}
                </p>
              </div>
            </div>

            <span className="rounded-lg border border-mint/20 bg-mint/10 px-2.5 py-1 text-[10px] text-mint font-semibold">
              Active Connection
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {activeThread.messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    m.sender === 'me'
                      ? 'bg-mint text-[#07211e] font-medium'
                      : 'border border-white/[0.08] bg-[#0d1627] text-slate-200'
                  }`}
                >
                  {m.text}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                  <span>{m.time}</span>
                  {m.sender === 'me' && <CheckCheck size={12} className="text-mint" />}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/[0.08] bg-[#090e18] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Reply to ${activeThread.contactName}...`}
              className="flex-1 rounded-xl border border-white/10 bg-[#111c2e] px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-mint/50"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint text-[#07211e] hover:bg-emerald-300 disabled:opacity-40 transition"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex items-center justify-center text-xs text-slate-500">
          Select a conversation from the sidebar to view messages.
        </div>
      )}
    </div>
  );
}
