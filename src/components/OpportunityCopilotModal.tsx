import { useState } from 'react';
import { Sparkles, X, Send, Bot, ArrowRight, Lightbulb, CheckCircle2 } from 'lucide-react';

export function OpportunityCopilotModal({
  isOpen,
  onClose,
  notify
}: {
  isOpen: boolean;
  onClose: () => void;
  notify: (msg: string) => void;
}) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'copilot'; text: string; suggestions?: string[] }>>([
    {
      sender: 'copilot',
      text: 'Muraho! I am your Opportunity Copilot for Rwanda. I can evaluate your profile, suggest high-demand roles in Kigali, draft custom application pitches, or help you structure fair freelance rates in RWF. What would you like to explore today?',
      suggestions: [
        'How competitive is my frontend experience in Kigali?',
        'Help me write a pitch for Kigali Digital Labs',
        'What are standard freelance design rates in Rwanda?',
        'How do I list my artisan crafts on Made in Rwanda?'
      ]
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || prompt;
    if (!query.trim()) return;

    const userMsg = query.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setPrompt('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      let reply = '';
      let suggestions: string[] | undefined = undefined;

      if (userMsg.toLowerCase().includes('frontend') || userMsg.toLowerCase().includes('react')) {
        reply = `Senior React & TypeScript engineers in Kigali currently earn between RWF 1,200,000 and 1,800,000 / month, with remote international hubs paying up to RWF 2.5M+. 

Key recommendations for the Kigali tech market:
1. Highlight experience with mobile-responsive layouts and slow-network resilience (2G/3G testing).
2. Showcase practical integration with local APIs like MTN MoMo, Airtel Money, or Irembo services.
3. Your 96% match with Kigali Digital Labs makes you a primary candidate. Would you like me to tailor a cover note?`;
        suggestions = ['Draft pitch for Kigali Digital Labs', 'Suggest 3 portfolio projects that stand out'];
      } else if (userMsg.toLowerCase().includes('rate') || userMsg.toLowerCase().includes('price') || userMsg.toLowerCase().includes('freelance')) {
        reply = `Standard independent rates in Rwanda (2026 benchmarks):
• Brand Identity & Logo Package: RWF 150,000 – 350,000
• SME Website & Mobile Checkout: RWF 200,000 – 600,000
• Monthly Digital Marketing / Social Commerce: RWF 300,000 – 650,000 / mo
• Technical Consulting / Full-stack Development: RWF 25,000 – 45,000 / hour

Remember to clearly specify whether RRA 18% VAT applies or if you operate under micro-enterprise tax exemption status.`;
        suggestions = ['How do I create a compliant RRA invoice?', 'What should be in my milestone contract?'];
      } else if (userMsg.toLowerCase().includes('pitch') || userMsg.toLowerCase().includes('cover')) {
        reply = `Here is a high-impact intro pitch tailored for Kigali Digital Labs:

"Dear Kigali Digital Labs Hiring Team,

As a frontend engineer passionate about Rwanda's expanding digital ecosystem, I was immediately drawn to your mission of building inclusive public-service digital interfaces. Over the past 3+ years, I have architected high-performance React and TypeScript applications with deep focus on accessibility, state management, and seamless mobile UX.

I would love to contribute to your engineering team in Kacyiru and help mentor the next generation of Rwandan developers."`;
        suggestions = ['Copy this pitch to clipboard', 'Customize for remote positions'];
      } else {
        reply = `Great question! The Rwandan economy is growing rapidly across tech, tourism, creative arts, and agritech. Umuhuza Connect matches your verified skills with active companies across Kigali and the provinces. You can use our Income OS to invoice clients directly with MTN Mobile Money codes.`;
        suggestions = ['Explore high-match jobs', 'View Made in Rwanda marketplace'];
      }

      setMessages((prev) => [...prev, { sender: 'copilot', text: reply, suggestions }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex h-[88vh] max-h-[720px] w-full max-w-2xl flex-col rounded-2xl border border-white/10 bg-[#0c1524] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/15 text-mint shadow-glow">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Opportunity Copilot</h3>
              <p className="text-xs text-slate-400">Rwandan Career & Enterprise Advisor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'copilot' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mint/10 text-mint">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-mint text-[#08221e] font-medium'
                    : 'border border-white/[0.07] bg-panel/90 text-slate-200 whitespace-pre-wrap'
                }`}
              >
                {m.text}

                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-white/[0.06]">
                    {m.suggestions.map((s, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => {
                          if (s === 'Copy this pitch to clipboard') {
                            navigator.clipboard.writeText(m.text);
                            notify('Pitch copied to clipboard');
                          } else {
                            handleSend(s);
                          }
                        }}
                        className="rounded-lg border border-mint/20 bg-mint/5 px-2.5 py-1 text-[11px] font-medium text-mint hover:bg-mint/15 transition text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
              <span className="h-2 w-2 animate-bounce rounded-full bg-mint" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-mint delay-150" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-mint delay-300" />
              <span className="ml-1 text-[11px]">Thinking for Rwanda context...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t border-white/[0.08] p-4 bg-[#090e18]/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about jobs, salaries in RWF, pitch tailoring, or artisan selling..."
              className="flex-1 rounded-xl border border-white/10 bg-[#121c2e] px-4 py-3 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-mint/50"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isThinking}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-[#08221e] hover:bg-emerald-300 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 px-1">
            <span>Powered by Gemini for East Africa & Rwanda</span>
            <span>Free for all Umuhuza talent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
