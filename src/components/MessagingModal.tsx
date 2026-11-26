import { useState } from 'react';
import { AgriProduct, Language, ChatMessage } from '../types/agri';
import { X, Send, User, CheckCheck, Phone, ShieldCheck } from 'lucide-react';

export function MessagingModal({
  product,
  isOpen,
  onClose,
  lang,
  notify
}: {
  product: AgriProduct | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  notify: (msg: string) => void;
}) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      senderId: 'farmer',
      senderName: product?.sellerName || 'Farmer Jean-Claude',
      senderRole: 'seller',
      text:
        lang === 'rw'
          ? `Muraho! Ndi ${product?.sellerName || 'umuhinzi'}. Ukeneye umusaruro w’i ${product?.location || 'Rwanda'} ku bwinshi cyangwa kugezwa mu rugo?`
          : `Muraho! I am ${product?.sellerName || 'the farmer'}. Are you inquiring about retail home delivery or bulk wholesale supply in ${product?.location || 'Kigali'}?`,
      timestamp: '10:14 AM',
      isMe: false
    }
  ]);

  if (!isOpen || !product) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'buyer',
      senderName: 'You',
      senderRole: 'customer',
      text: inputText.trim(),
      timestamp: 'Just now',
      isMe: true
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    notify(lang === 'rw' ? 'Ubutumwa bwoherejwe!' : 'Message sent to farmer!');

    // Simulated farmer response
    setTimeout(() => {
      const replies =
        lang === 'rw'
          ? [
              'Yego rwose! Dufite uburyo bwo kugeza umusaruro mu Mujyi wa Kigali mu masaha 2.',
              'Umusaruro wacu wasaruwe uyu munsi mu gitondo, ni mwiza cyane kandi ufite ubuziranenge.',
              'Kuri MoMo, wishyura kuri nimero yacu ya Merchant. Reka ngutegurire ibyo wifuza!'
            ]
          : [
              'Yes, absolutely! We can arrange express delivery to your location in Kigali within 2 hours.',
              'This produce was harvested this morning and is in prime fresh condition.',
              'You can settle payment via our MTN MoMo code directly upon delivery!'
            ];
      const botReply: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: 'farmer',
        senderName: product.sellerName,
        senderRole: 'seller',
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: 'Just now',
        isMe: false
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0b1a13] border border-emerald-500/30 rounded-3xl flex flex-col h-[75vh] max-h-[580px] shadow-2xl text-white overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-emerald-500/20 bg-[#08150f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="h-10 w-10 rounded-xl object-cover border border-emerald-500/30"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-xs sm:text-sm text-white">{product.sellerName}</h3>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[11px] text-emerald-300/80">
                {product.name} · RWF {product.pricePerUnit.toLocaleString()} /{product.unit}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${product.sellerPhone}`}
              className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50"
              title="Call farmer"
            >
              <Phone size={14} />
            </a>
            <button onClick={onClose} className="p-2 rounded-xl text-emerald-400 hover:bg-emerald-900/30">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.isMe
                    ? 'bg-emerald-500 text-[#072416] font-semibold'
                    : 'bg-[#0f241a] border border-emerald-500/15 text-emerald-100'
                }`}
              >
                {m.text}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400/60 font-mono">
                <span>{m.timestamp}</span>
                {m.isMe && <CheckCheck size={11} className="text-emerald-400" />}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-emerald-500/15 bg-[#08150f] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              lang === 'rw'
                ? `Andika ubutumwa kuri ${product.sellerName}...`
                : `Message ${product.sellerName} about delivery or price...`
            }
            className="flex-1 bg-[#0f241a] border border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-emerald-300/50 outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-[#072416] p-2.5 rounded-xl transition"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
