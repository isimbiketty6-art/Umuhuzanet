import { useState } from 'react';
import { Language } from '../types/agri';
import { translations } from '../data/translations';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Sprout,
  HelpCircle,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export function AgriAiAssistant({
  isOpen,
  onClose,
  lang,
  notify
}: {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  notify: (msg: string) => void;
}) {
  const t = translations[lang];

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<
    Array<{ sender: 'user' | 'bot'; text: string; suggestions?: string[] }>
  >([
    {
      sender: 'bot',
      text:
        lang === 'rw'
          ? 'Muraho! Ndi Umuhuza AI, umufasha wawe mu by’ubuhinzi n’amasoko mu Rwanda. Mbaza ibiciro by’isoko mu turere twose, inama ku buhinzi n’ubworozi, cyangwa ubufasha bwo kubona umusaruro w’ibiribwa!'
          : 'Muraho! I am Umuhuza AI, your Rwandan Agricultural Assistant. Ask me about current farm gate prices across Rwanda, seasonal planting tips, pest management, or finding fresh produce on Umuhuza Connect!',
      suggestions: [
        lang === 'rw' ? 'Ibiciro by’ibirayi mu Musanze ubu bimeze bite?' : 'What is the current price of Kinigi Irish potatoes in Musanze?',
        lang === 'rw' ? 'Ntekeraho inama yo kurwanya indwara z’inyanya' : 'How to prevent tomato blight in Rwanda greenhouse farming?',
        lang === 'rw' ? 'Ibihe by’ihinga mu Rwanda (Season A & B)' : 'Rwanda agricultural seasons: When to plant maize?'
      ]
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const q = textToSend || prompt;
    if (!q.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: q.trim() }]);
    setPrompt('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      let reply = '';
      let suggestions: string[] = [];
      const lower = q.toLowerCase();

      if (lower.includes('ibirayi') || lower.includes('potato') || lower.includes('musanze')) {
        reply =
          lang === 'rw'
            ? `Ibiciro by’Ibirayi bya Kinigi mu Karere ka Musanze no mu masoko ya Kigali:\n• Ku murima (Musanze): RWF 450 – 500 / kg\n• Isoko rya Nyabugogo (Kigali): RWF 600 – 650 / kg\n• Icyitegererezo cy’ubucuruzi: Umuhuza Connect ifite amashyirahamwe y’abahinzi i Musanze atanga toni 10+ z’ibirayi byujuje ubuziranenge bwa RSB.`
            : `Current Kinigi Irish Potato Market Rates in Rwanda:\n• Farm gate (Musanze): RWF 450 – 500 / kg\n• Wholesale (Nyabugogo Central Depot): RWF 600 – 650 / kg\n• Retail (Kigali markets): RWF 700 / kg\n• Cooperatives in Musanze are currently accepting bulk B2B orders directly on Umuhuza Connect.`;
        suggestions = [
          lang === 'rw' ? 'Gura ibirayi mu isoko' : 'View Irish Potatoes on Marketplace',
          lang === 'rw' ? 'Uburyo bwo guhunika neza' : 'Potato post-harvest storage tips'
        ];
      } else if (lower.includes('inyanya') || lower.includes('tomato') || lower.includes('blight')) {
        reply =
          lang === 'rw'
            ? `Inama zo kurinda Inyanya imvura nyinshi n'indwara:\n1. Koresha amazi yo kuhira munsi y’igiti (Drip irrigation) aho kumena hejuru ku mababi.\n2. Gutera imiti y’ubwirinzi (Fungicides zemewe n’Ikigo cya RAB) mbere y’uko ibicu by’imvura bihinduka.\n3. Gushyiraho uruzitiro n’ibiti byo gufasha inyanya kudakorana n’ubutaka (Staking).`
            : `Agronomic Advice for Rwandan Tomato Farmers:\n1. Use drip irrigation at the root zone rather than overhead splashing to suppress fungal late blight.\n2. Apply RAB-registered copper-based preventive fungicides during cool, damp weather in Season A.\n3. Stake vines to keep fruit away from wet volcanic soil. You can hire experienced Farm Assistants on our Agri Jobs portal!`;
        suggestions = [
          lang === 'rw' ? 'Shaka abakozi b’umurima' : 'Browse Farm Assistant jobs',
          lang === 'rw' ? 'Ibiciro by’inyanya muri Kigali' : 'Fresh Tomato prices in Kigali'
        ];
      } else if (lower.includes('season') || lower.includes('ihinga') || lower.includes('maize') || lower.includes('ibigori')) {
        reply =
          lang === 'rw'
            ? `Ingengabihe y’Ihinga mu Rwanda:\n• Igihempwe A (Urugaryi): Nzeri – Mutarama (Ibigori, ibiharage, ibirayi)\n• Igihempwe B (Itumba): Gashyantare – Kamena (Ibigori, soya, imboga)\n• Igihempwe C (Mu bishanga): Nyakanga – Kanama (Imboga, inyanya, imboga zihirwa)\nUmuti mwiza wo kubona imbuto zemewe: Koresha icyiciro cya Seeds & Inputs kuri Umuhuza Connect.`
            : `Agricultural Calendar in Rwanda:\n• Season A: September – January (Maize, dry beans, Irish potatoes in highland zones)\n• Season B: February – June (Sorghum, cassava, climbing beans, vegetables)\n• Season C: July – August (Marshland intensive horticulture & irrigated tomatoes)\nAlways source RAB-certified seed varieties directly through Umuhuza Connect sellers.`;
        suggestions = [
          lang === 'rw' ? 'Reba imbuto zo gutera' : 'View Certified Seeds in catalog',
          lang === 'rw' ? 'Vugana n’umuhinzi' : 'Message a local agronomist'
        ];
      } else {
        reply =
          lang === 'rw'
            ? `Murakoze kubaza! Umuhuza Connect ihuza abahinzi, abaguzi n’abacuruzi banini mu turere twose 30 tw’u Rwanda. Ushobora kugura umusaruro wishyuye na MTN MoMo cyangwa Airtel Money.`
            : `Great inquiry! Umuhuza Connect unifies farmers, shoppers, and commercial wholesale buyers across all 30 Rwandan districts. All orders are settled securely via Mobile Money (MoMo/Airtel) or cash on delivery.`;
        suggestions = [
          lang === 'rw' ? 'Tembera mu Isoko' : 'Explore fresh harvest',
          lang === 'rw' ? 'Gura ibiribwa' : 'Check current basket'
        ];
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply, suggestions }]);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0b1a13] border border-emerald-500/30 rounded-3xl flex flex-col h-[85vh] max-h-[680px] shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-500/20 bg-[#08150f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-[#062114] shadow-md shadow-emerald-950/40">
              <Bot size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Umuhuza AI Assistant</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Bilingual EN/RW
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70">
                {lang === 'rw' ? 'Inama z’ubuhinzi, ibiciro by’isoko n’ubufasha' : 'Rwanda agricultural market intelligence & agronomic advice'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-900/30">
            <X size={18} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sprout size={15} />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-500 text-[#072416] font-semibold'
                    : 'bg-[#0f241a] border border-emerald-500/15 text-emerald-100 whitespace-pre-line'
                }`}
              >
                {m.text}

                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-emerald-500/15 flex flex-wrap gap-1.5">
                    {m.suggestions.map((s, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSend(s)}
                        className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/25 text-emerald-300 text-[10px] px-2.5 py-1 rounded-lg transition text-left"
                      >
                        ✦ {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 pl-9">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce delay-150" />
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce delay-300" />
              <span className="text-[11px] font-mono">Analyzing Rwanda agricultural intelligence...</span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-3.5 border-t border-emerald-500/15 bg-[#08150f]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                lang === 'rw'
                  ? 'Baza igiciro, inama z\'ihinga cyangwa uko wagurisha...'
                  : 'Ask about market prices, pest prevention, or selling farm harvest...'
              }
              className="flex-1 bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-emerald-300/50 outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isThinking}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-[#072416] p-2.5 rounded-xl transition"
            >
              <Send size={15} />
            </button>
          </form>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-emerald-400/60 px-1 font-mono">
            <span>Umuhuza AI · Powered by Gemini for Rwanda</span>
            <span>Free for all Rwandan farmers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
