import { useState } from 'react';
import { Database, Terminal, Server, Check, Copy, ExternalLink, Code2, Play, Layers } from 'lucide-react';

export function BackendApiView({ notify }: { notify: (msg: string) => void }) {
  const [activeTab, setActiveTab] = useState<'routes' | 'migrations' | 'tester' | 'notes'>('routes');
  const [endpoint, setEndpoint] = useState('/api/jobs');
  const [httpMethod, setHttpMethod] = useState<'GET' | 'POST'>('GET');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    notify(`Copied ${label} to clipboard`);
  };

  const handleTestApi = () => {
    setIsLoading(true);
    setApiResponse(null);
    setTimeout(() => {
      setIsLoading(false);
      if (endpoint === '/api/v1/health') {
        setApiResponse(JSON.stringify({
          status: 'ok',
          app: 'Umuhuza Connect API',
          target_market: 'Rwanda',
          currency: 'RWF',
          version: '1.0.0',
          database: 'MySQL 8.0 connected',
          timestamp: new Date().toISOString()
        }, null, 2));
      } else if (endpoint === '/api/v1/plans') {
        setApiResponse(JSON.stringify({
          status: 'success',
          currency: 'RWF',
          plans: [
            { id: 'starter', name: 'Starter Talent', price_monthly: 0, max_active_jobs: 1 },
            { id: 'growth', name: 'Growth Pro Hiring', price_monthly: 35000, max_active_jobs: 10, payment: 'MTN MoMo *182#' },
            { id: 'enterprise', name: 'Cooperative Enterprise', price_monthly: 95000, max_active_jobs: 999, payment: 'Bank of Kigali / MoMo' }
          ]
        }, null, 2));
      } else if (endpoint === '/api/jobs') {
        setApiResponse(JSON.stringify({
          status: 'success',
          count: 6,
          data: [
            { id: 1, title: 'Senior Frontend Engineer (React/TypeScript)', company: 'Kigali Digital Labs', location: 'Kigali, Rwanda', salary: 'RWF 1.2M - 1.8M', category: 'Technology', status: 'published' },
            { id: 2, title: 'Product & Brand Designer', company: 'Imanzi Studio', location: 'Hybrid · Kigali', salary: 'RWF 800k - 1.25M', category: 'Design', status: 'published' }
          ]
        }, null, 2));
      } else if (endpoint === '/api/dashboard') {
        setApiResponse(JSON.stringify({
          status: 'success',
          authenticated: false,
          metrics: {
            public_jobs_count: 6,
            verified_companies_count: 4,
            active_products_count: 6
          },
          note: 'Public metrics returned. Authenticate via Sanctum for user-specific application counts.'
        }, null, 2));
      } else if (endpoint === '/api/products') {
        setApiResponse(JSON.stringify({
          status: 'success',
          data: [
            { id: 1, name: 'Brand Identity & Web Package', seller: 'Imanzi Creative', price_rwf: 185000, category: 'Design service' },
            { id: 2, name: 'Handwoven Agaseke Basket', seller: 'Umutima Crafts', price_rwf: 24000, category: 'Handcraft' }
          ]
        }, null, 2));
      } else {
        setApiResponse(JSON.stringify({
          status: 'success',
          message: `Endpoint ${endpoint} executed successfully with mock Sanctum session.`,
          timestamp: new Date().toISOString()
        }, null, 2));
      }
    }, 350);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-white/[0.08] bg-panel/80 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint/10 text-mint">
              <Server size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Laravel 11/12 API Backend Architecture</h2>
              <p className="text-xs text-slate-400">
                Inspect routes, database migrations, Sanctum security policies, and live API endpoints.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-mint/20 bg-mint/10 px-3 py-1.5 text-xs font-mono text-mint">
              PHP 8.2+ · Laravel Sanctum
            </span>
            <button
              onClick={() => copyToClipboard('composer create-project laravel/laravel backend-app && cd backend-app && php artisan install:api', 'Laravel Setup Command')}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <Copy size={13} /> Copy Setup
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
        {[
          { id: 'routes', label: 'API Routes (api.php)', icon: Terminal },
          { id: 'migrations', label: 'Database Migrations', icon: Database },
          { id: 'tester', label: 'Interactive API Sandbox', icon: Play },
          { id: 'notes', label: 'Integration Guide & Notes', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
                active
                  ? 'bg-mint/15 text-mint font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: API Routes */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1524] p-5 font-mono text-xs">
            <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-slate-400">backend/routes/api.php</span>
              <button
                onClick={() => copyToClipboard(`use App\\Http\\Controllers\\Api\\...`, 'Routes')}
                className="flex items-center gap-1 text-[11px] text-mint hover:underline"
              >
                <Copy size={12} /> Copy api.php
              </button>
            </div>
            <pre className="overflow-x-auto text-slate-300 leading-relaxed">
{`// Public Opportunity & Discovery Endpoints
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{job}', [JobController::class, 'show']);
Route::get('/companies', [CompanyController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/dashboard', [DashboardController::class, 'index']);

// Protected User & Employer Endpoints (auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Current User Profile & Opportunities
    Route::get('/user', [UserController::class, 'current']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);

    // Job Seekers: Applications
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/jobs/{job}/apply', [ApplicationController::class, 'store']);
    Route::get('/applications/{application}', [ApplicationController::class, 'show']);

    // Employers & Verified Companies
    Route::post('/jobs', [JobController::class, 'store'])->middleware('can:create,App\\Models\\Job');
    Route::put('/jobs/{job}', [JobController::class, 'update']);
    Route::delete('/jobs/{job}', [JobController::class, 'destroy']);
    Route::get('/jobs/{job}/applicants', [JobController::class, 'applicants']);

    // Sellers & Artisans: Made in Rwanda Marketplace
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
});`}
            </pre>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 text-xs text-slate-400">
            <div className="rounded-xl border border-white/[0.06] bg-panel/60 p-3.5">
              <span className="font-semibold text-slate-200">Public Reading</span>
              <p className="mt-1">Jobs and Made in Rwanda storefronts are indexed and publicly browsable.</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-panel/60 p-3.5">
              <span className="font-semibold text-slate-200">Sanctum Protected</span>
              <p className="mt-1">CV applications and private messaging require cookie-based SPA credentials.</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-panel/60 p-3.5">
              <span className="font-semibold text-slate-200">Role-Based Policies</span>
              <p className="mt-1">Job creation strictly verified for registered Rwandan employer profiles.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Migrations */}
      {activeTab === 'migrations' && (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              table: 'companies',
              file: '2026_01_01_000001_create_companies_table.php',
              cols: ['id (bigint)', 'name (string)', 'tin_number (string, unique)', 'category (string)', 'location (string)', 'is_verified (boolean)', 'website (string, nullable)', 'created_at, updated_at']
            },
            {
              table: 'jobs',
              file: '2026_01_01_000002_create_jobs_table.php',
              cols: ['id (bigint)', 'company_id (foreignId)', 'title (string)', 'location (string)', 'job_type (enum: full-time, contract, remote)', 'salary_min_rwf (integer)', 'salary_max_rwf (integer)', 'status (string)', 'published_at']
            },
            {
              table: 'applications',
              file: '2026_01_01_000004_create_applications_table.php',
              cols: ['id (bigint)', 'job_id (foreignId)', 'user_id (foreignId)', 'status (enum: submitted, under_review, interview, offered)', 'cv_path (string)', 'cover_note (text)', 'portfolio_url (string, nullable)']
            },
            {
              table: 'products',
              file: '2026_01_01_000005_create_products_table.php',
              cols: ['id (bigint)', 'user_id (foreignId)', 'name (string)', 'category (string: handcraft, agri, digital)', 'price_rwf (integer)', 'description (text)', 'stock_count (integer)', 'is_active (boolean)']
            }
          ].map((m) => (
            <div key={m.table} className="rounded-2xl border border-white/[0.08] bg-panel/70 p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-mint">{m.table}</span>
                <span className="text-[11px] font-mono text-slate-500">PostgreSQL / MySQL</span>
              </div>
              <p className="mt-1 text-[11px] font-mono text-slate-500">{m.file}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.cols.map((c) => (
                  <span key={c} className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-slate-300">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Interactive Sandbox */}
      {activeTab === 'tester' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.08] bg-panel/70 p-5">
            <h3 className="text-sm font-semibold text-white">API Client Sandbox</h3>
            <p className="mt-1 text-xs text-slate-400">
              Simulate live requests to Umuhuza Connect REST endpoints.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={httpMethod}
                onChange={(e) => setHttpMethod(e.target.value as any)}
                className="rounded-xl border border-white/10 bg-[#0d1524] px-3 py-2.5 font-mono text-xs text-mint outline-none"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>

              <select
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-[#0d1524] px-3.5 py-2.5 font-mono text-xs text-slate-200 outline-none"
              >
                <option value="/api/v1/health">/api/v1/health (System Status & Rwanda Config)</option>
                <option value="/api/jobs">/api/jobs (List Published Jobs)</option>
                <option value="/api/v1/plans">/api/v1/plans (Employer Subscriptions)</option>
                <option value="/api/dashboard">/api/dashboard (Public Opportunity Counts)</option>
                <option value="/api/products">/api/products (Made in Rwanda Catalog)</option>
                <option value="/api/applications">/api/applications (User Tracker)</option>
              </select>

              <button
                onClick={handleTestApi}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 rounded-xl bg-mint px-5 py-2.5 text-xs font-bold text-[#07211e] hover:bg-emerald-300 disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Executing...</span>
                ) : (
                  <>
                    <Play size={14} /> Send Request
                  </>
                )}
              </button>
            </div>

            {apiResponse && (
              <div className="mt-5">
                <div className="flex items-center justify-between pb-2 text-xs">
                  <span className="font-mono text-slate-400">Status: <strong className="text-mint">200 OK</strong> · JSON</span>
                  <button
                    onClick={() => copyToClipboard(apiResponse, 'API response')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    <Copy size={12} /> Copy JSON
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto rounded-xl border border-white/[0.08] bg-[#090e18] p-4 font-mono text-xs text-emerald-300">
                  <pre>{apiResponse}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Integration Notes */}
      {activeTab === 'notes' && (
        <div className="rounded-2xl border border-white/[0.08] bg-panel/70 p-6 space-y-4 text-xs text-slate-300 leading-relaxed">
          <h3 className="text-sm font-semibold text-white">How to connect this UI to a live Laravel installation</h3>
          <ol className="list-decimal space-y-3 pl-4">
            <li>
              <strong>Create fresh Laravel 11/12 application:</strong>
              <div className="mt-1 rounded-lg bg-[#090e18] p-3 font-mono text-[11px] text-slate-300">
                composer create-project laravel/laravel backend-app<br />
                cd backend-app && php artisan install:api
              </div>
            </li>
            <li>
              <strong>Copy starter files:</strong>
              <p className="mt-1 text-slate-400">
                Copy all files from <code className="text-mint">umuhuza-connect/backend/app</code>, <code className="text-mint">umuhuza-connect/backend/database</code>, and <code className="text-mint">umuhuza-connect/backend/routes/api.php</code> into your Laravel directory.
              </p>
            </li>
            <li>
              <strong>Run database migrations & seeders:</strong>
              <div className="mt-1 rounded-lg bg-[#090e18] p-3 font-mono text-[11px] text-slate-300">
                php artisan migrate --seed
              </div>
            </li>
            <li>
              <strong>Configure Frontend Environment:</strong>
              <p className="mt-1 text-slate-400">
                Set <code className="text-mint">VITE_API_BASE_URL=http://127.0.0.1:8000/api</code> in your <code className="text-mint">.env</code> file. When empty, Umuhuza Connect seamlessly operates with local in-memory storage!
              </p>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
