import { useState } from 'react';
import {
  X,
  Download,
  FolderArchive,
  Terminal,
  CheckCircle2,
  Copy,
  ExternalLink,
  Layers,
  Server,
  FileCode,
  ShieldCheck
} from 'lucide-react';

export function StarterDownloadModal({
  isOpen,
  onClose,
  notify
}: {
  isOpen: boolean;
  onClose: () => void;
  notify: (msg: string) => void;
}) {
  const [downloadProgress, setDownloadProgress] = useState<'idle' | 'preparing' | 'ready'>('idle');
  const [activeOS, setActiveOS] = useState<'windows' | 'mac' | 'linux'>('windows');

  if (!isOpen) return null;

  const copyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    notify(`Copied ${label} to clipboard`);
  };

  const handleDownload = () => {
    setDownloadProgress('preparing');
    setTimeout(() => {
      setDownloadProgress('ready');
      notify('Starting download of umuhuza-connect-starter.zip...');

      // Trigger download of the starter ZIP file located in public assets
      const link = document.createElement('a');
      link.href = '/public/assets/aistudio/umuhuza-connect-starter_a277281c.zip';
      link.download = 'umuhuza-connect-starter.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0c1524] shadow-2xl text-white p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Heading */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/15 text-mint shrink-0">
            <FolderArchive size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Download Umuhuza Connect Starter Code</h2>
              <span className="rounded-full bg-mint/20 px-2 py-0.5 text-[10px] font-bold text-mint font-mono">
                v1.0 Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Complete bundle with React frontend, dark dashboard interface, demo job marketplace, and Laravel/MySQL backend starter files.
            </p>
          </div>
        </div>

        {/* Package Highlights Box */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 mb-6">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white">umuhuza-connect-starter.zip</span>
              <span className="text-[11px] text-slate-400">· 31 files · React + TS + Tailwind + Laravel API</span>
            </div>
            <span className="text-xs text-mint font-mono font-bold">~1.2 MB</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-mint shrink-0" />
              <span>React dashboard with responsive dark UI & role switch</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-mint shrink-0" />
              <span>Career & jobs marketplace with application tracker</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-mint shrink-0" />
              <span>Laravel 11 REST API starter with Sanctum routes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-mint shrink-0" />
              <span>MySQL schema migrations for users, jobs & products</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-mint text-[#07211e] font-bold text-xs hover:bg-emerald-300 transition shadow-lg shadow-mint/20 flex items-center justify-center gap-2"
            >
              <Download size={15} />
              <span>
                {downloadProgress === 'preparing' ? 'Bundling ZIP Package...' : 'Download umuhuza-connect-starter.zip'}
              </span>
            </button>
            <span className="text-[11px] text-slate-400">
              Direct download link ready for local development
            </span>
          </div>
        </div>

        {/* Step-by-Step Setup Guide */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal size={15} className="text-mint" />
              <span>Run the Project on Your Computer</span>
            </h3>

            {/* OS tabs */}
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-0.5 text-[11px]">
              {(['windows', 'mac', 'linux'] as const).map((os) => (
                <button
                  key={os}
                  onClick={() => setActiveOS(os)}
                  className={`px-2.5 py-1 rounded transition capitalize ${
                    activeOS === os ? 'bg-mint text-[#07211e] font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {os}
                </button>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3 text-xs">
            {/* Step 1 */}
            <div className="rounded-xl border border-white/10 bg-[#08121f] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-white">Step 1 — Extract the Project</strong>
                <span className="text-[10px] text-slate-500 font-mono">Downloads folder</span>
              </div>
              <p className="text-slate-300">
                Extract <code className="text-mint">umuhuza-connect-starter.zip</code> into your preferred projects directory.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-white/10 bg-[#08121f] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-white">Step 2 — Start the React Frontend</strong>
                <button
                  onClick={() => copyCode('cd frontend && npm install && npm run dev', 'Frontend Commands')}
                  className="flex items-center gap-1 text-[10px] text-mint hover:underline font-mono"
                >
                  <Copy size={11} /> Copy Commands
                </button>
              </div>
              <div className="bg-black/60 p-2.5 rounded-lg font-mono text-[11px] text-slate-300 border border-white/5 space-y-1">
                <div className="text-slate-500"># Navigate into frontend and launch dev server:</div>
                <div className="text-mint">cd frontend</div>
                <div className="text-mint">npm install</div>
                <div className="text-mint">npm run dev</div>
              </div>
              <p className="text-[11px] text-slate-400">
                Open <span className="text-white font-mono">http://localhost:5173</span> in your browser.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-white/10 bg-[#08121f] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-white">Step 3 — Set Up PHP, Laravel, and MySQL</strong>
                <button
                  onClick={() => copyCode('composer create-project laravel/laravel backend-app && cd backend-app && php artisan install:api', 'Laravel Setup')}
                  className="flex items-center gap-1 text-[10px] text-mint hover:underline font-mono"
                >
                  <Copy size={11} /> Copy Laravel Script
                </button>
              </div>
              <div className="bg-black/60 p-2.5 rounded-lg font-mono text-[11px] text-slate-300 border border-white/5 space-y-1">
                <div className="text-slate-500"># Create database in MySQL:</div>
                <div className="text-yellow-300">CREATE DATABASE umuhuza_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;</div>
                <div className="text-slate-500 mt-2"># Copy backend starter files and run migrations:</div>
                <div className="text-mint">php artisan migrate --seed</div>
                <div className="text-mint">php artisan serve</div>
              </div>
              <p className="text-[11px] text-slate-400">
                Your REST API runs at <span className="text-white font-mono">http://127.0.0.1:8000/api/v1/health</span> and <span className="text-white font-mono">/api/v1/jobs</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
