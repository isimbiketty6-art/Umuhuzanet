import { useMemo, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BriefcaseBusiness,
  Building2, Check, ChevronDown, CircleHelp, Compass, GraduationCap, Handshake,
  LayoutDashboard, Menu, MessageCircle, Search, Settings, ShieldCheck, ShoppingBag,
  Sparkles, Target, Users, Wallet, X, Zap, Plus, MapPin, Clock3, Bookmark, Send,
  CircleUserRound, SlidersHorizontal
} from 'lucide-react'
import { jobs, products } from './data/demo'

type Section = 'Overview' | 'Find opportunities' | 'Career & jobs' | 'Marketplace' | 'Learning' | 'Network' | 'Income OS' | 'Messages' | 'Settings'
const nav: { label: Section; icon: typeof LayoutDashboard; group: string }[] = [
  { label: 'Overview', icon: LayoutDashboard, group: 'WORKSPACE' },
  { label: 'Find opportunities', icon: Compass, group: 'WORKSPACE' },
  { label: 'Career & jobs', icon: BriefcaseBusiness, group: 'WORKSPACE' },
  { label: 'Marketplace', icon: ShoppingBag, group: 'WORKSPACE' },
  { label: 'Learning', icon: GraduationCap, group: 'GROWTH' },
  { label: 'Network', icon: Users, group: 'GROWTH' },
  { label: 'Income OS', icon: Wallet, group: 'GROWTH' },
  { label: 'Messages', icon: MessageCircle, group: 'PERSONAL' },
  { label: 'Settings', icon: Settings, group: 'PERSONAL' },
]

function App() {
  const [section, setSection] = useState<Section>('Overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('Job seeker')
  const [roleMenu, setRoleMenu] = useState(false)
  const [saved, setSaved] = useState<number[]>([])
  const [applied, setApplied] = useState<number[]>([])
  const [toast, setToast] = useState('')
  const [tasks, setTasks] = useState([true, false, false])
  const [filter, setFilter] = useState('All')
  const [showAllJobs, setShowAllJobs] = useState(false)
  const [notifications, setNotifications] = useState(false)

  const filteredJobs = useMemo(() => jobs.filter(j => {
    const matchesQuery = `${j.title} ${j.company} ${j.location} ${j.category}`.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === 'All' || j.type === filter
    return matchesQuery && matchesFilter
  }), [query, filter])

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  const toggleSave = (id: number) => {
    setSaved(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id])
    notify(saved.includes(id) ? 'Removed from saved jobs' : 'Job saved to your list')
  }

  const toggleApply = (id: number) => {
    if (applied.includes(id)) return
    setApplied(current => [...current, id])
    notify('Demo application added to your tracker')
  }

  const title = section === 'Overview' ? 'Your opportunity center' : section
  const subtitle: Record<Section, string> = {
    'Overview': 'Your next opportunity could be one connection away.',
    'Find opportunities': 'Discover work, customers, skills and partnerships.',
    'Career & jobs': 'Find roles that fit your strengths and goals.',
    'Marketplace': 'Discover local products and services from Rwanda.',
    'Learning': 'Build practical skills that open new doors.',
    'Network': 'Build relationships that move your goals forward.',
    'Income OS': 'Keep your work, sales and income organized.',
    'Messages': 'Keep your professional conversations together.',
    'Settings': 'Manage your profile and workspace preferences.'
  }

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      {mobileNav && <button aria-label="Close menu backdrop" onClick={() => setMobileNav(false)} className="fixed inset-0 z-40 bg-black/60 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/[0.07] bg-[#0d1727] transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[82px] items-center justify-between border-b border-white/[0.07] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-[#071b22] shadow-glow"><Activity size={22} /></div>
            <div><div className="text-[15px] font-bold tracking-tight">umuhuza<span className="text-mint">connect</span></div><div className="mt-0.5 text-[9px] font-bold tracking-[.24em] text-slate-500">YOUR HUMAN OS</div></div>
          </div>
          <button className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden" onClick={() => setMobileNav(false)}><X size={18}/></button>
        </div>
        <div className="px-4 pt-5">
          <button onClick={() => setRoleMenu(!roleMenu)} className="flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-left hover:bg-white/[0.05]">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-400/15 text-indigo-300"><CircleUserRound size={19}/></div>
            <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">Your workspace</div><div className="mt-0.5 text-xs text-slate-500">{role}</div></div><ChevronDown size={15} className="text-slate-500"/>
          </button>
          {roleMenu && <div className="mt-2 rounded-xl border border-white/10 bg-panel p-2">{['Job seeker', 'Employer', 'Seller', 'Administrator'].map(r => <button key={r} onClick={() => { setRole(r); setRoleMenu(false); notify(`Preview role switched to ${r}`) }} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/5">{r}{role === r && <Check className="float-right text-mint" size={16}/>}</button>)}<p className="px-3 pb-2 pt-1 text-[10px] text-amber-300/80">UI preview only. Server permissions must enforce real roles.</p></div>}
        </div>
        <nav className="scrollbar-hide flex-1 overflow-y-auto px-3 py-5">
          {['WORKSPACE', 'GROWTH', 'PERSONAL'].map(group => <div key={group} className="mb-5">
            <div className="px-3 pb-2 text-[9px] font-bold tracking-[.2em] text-slate-600">{group}</div>
            {nav.filter(item => item.group === group).map(item => {
              const Icon = item.icon
              const active = section === item.label
              return <button key={item.label} onClick={() => { setSection(item.label); setMobileNav(false) }} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-[11px] text-[13px] font-medium transition ${active ? 'bg-mint/10 text-mint ring-1 ring-inset ring-mint/15' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'}`}>
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8}/><span className="flex-1 text-left">{item.label}</span>
                {item.label === 'Messages' && <span className="rounded-md bg-indigo-400/15 px-1.5 py-0.5 text-[10px] text-indigo-300">2</span>}
              </button>
            })}
          </div>)}
        </nav>
        <div className="p-4">
          <div className="rounded-2xl border border-mint/15 bg-gradient-to-br from-mint/[0.09] to-indigo-500/[0.05] p-4">
            <div className="mb-2 flex items-center gap-2 text-mint"><Sparkles size={16}/><span className="text-xs font-semibold">Opportunity Copilot</span></div>
            <p className="text-xs leading-5 text-slate-400">Get help with your next career or business move.</p>
            <button onClick={() => notify('AI Copilot is planned for the next release')} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-mint px-3 py-2 text-xs font-bold text-[#07211e] hover:bg-emerald-300">Explore Copilot <ArrowUpRight size={14}/></button>
          </div>
          <div className="mt-4 flex items-center gap-2 px-1 text-[10px] text-slate-600"><ShieldCheck size={13}/> Built for opportunity in Rwanda</div>
        </div>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center gap-4 border-b border-white/[0.07] bg-ink/90 px-4 backdrop-blur-xl sm:px-7">
          <button aria-label="Open navigation" onClick={() => setMobileNav(true)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden"><Menu size={20}/></button>
          <div className="relative hidden max-w-[430px] flex-1 md:block">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search jobs, skills, people, services..." className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-mint/40"/>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-white/[0.07] px-3 py-2 text-xs text-slate-400 sm:flex"><MapPin size={13} className="text-mint"/> Rwanda <ChevronDown size={13}/></div>
            <button aria-label="Notifications" onClick={() => setNotifications(!notifications)} className="relative rounded-xl border border-white/[0.08] p-2.5 text-slate-400 hover:bg-white/5"><Bell size={17}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-mint"/></button>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 text-xs font-bold text-white">UC</div>
          </div>
          {notifications && <div className="absolute right-4 top-[62px] w-[290px] rounded-2xl border border-white/10 bg-panel p-4 shadow-2xl"><div className="mb-2 flex items-center justify-between font-semibold">Notifications <button onClick={() => setNotifications(false)}><X size={15}/></button></div><p className="border-t border-white/5 py-3 text-xs text-slate-400">Your demo workspace is all caught up. Real notifications connect through the API.</p></div>}
        </header>

        <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-mint"/> THURSDAY · YOUR HUMAN OS</div><h1 className="text-2xl font-bold tracking-tight sm:text-[30px]">{title}<span className="text-mint">.</span></h1><p className="mt-2 max-w-xl text-sm text-slate-400">{subtitle[section]}</p></div>
            <div className="flex flex-wrap gap-2"><button onClick={() => notify('Profile editor is planned for the next release')} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5">Edit profile</button><button onClick={() => setSection('Find opportunities')} className="flex items-center gap-2 rounded-xl bg-mint px-4 py-2.5 text-xs font-bold text-[#07211e] hover:bg-emerald-300"><Plus size={15}/> Explore opportunities</button></div>
          </div>

          {section === 'Overview' && <Overview tasks={tasks} setTasks={setTasks} setSection={setSection} notify={notify} />}
          {(section === 'Career & jobs' || section === 'Find opportunities') && <JobsView query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} jobs={filteredJobs} saved={saved} applied={applied} onSave={toggleSave} onApply={toggleApply} showAll={showAllJobs} setShowAll={setShowAllJobs}/>}
          {section === 'Marketplace' && <Marketplace notify={notify} />}
          {section === 'Learning' && <SimpleWorkspace icon={GraduationCap} title="Your learning journey" desc="Turn skills into proof of work and new opportunities." cards={[['React foundations','4 lessons · Beginner','62%'],['Build a portfolio project','Practical project · Intermediate','Start'],['Professional communication','6 lessons · All levels','New']]} notify={notify}/>}
          {section === 'Network' && <SimpleWorkspace icon={Handshake} title="Your professional network" desc="Build relationships with people who share your goals." cards={[['Kigali Tech Community','2,480 members','Join'],['Women in Digital Rwanda','1,120 members','Explore'],['Startup Founders Circle','860 members','Join']]} notify={notify}/>}
          {section === 'Income OS' && <IncomeView notify={notify}/>}
          {section === 'Messages' && <SimpleWorkspace icon={MessageCircle} title="Messages" desc="Professional conversations, project briefs and introductions." cards={[['Aline M.','Could you share your portfolio?','Open conversation'],['Kigali Digital Labs','We received your application.','View thread'],['Umutima Crafts','Interested in a collaboration?','Open conversation']]} notify={notify}/>}
          {section === 'Settings' && <SimpleWorkspace icon={Settings} title="Workspace settings" desc="Manage your profile, privacy and preferences." cards={[['Profile & visibility','Choose what people can see','Manage'],['Notifications','Email and in-app preferences','Configure'],['Privacy & security','Sessions and account protection','Review']]} notify={notify}/>}
        </main>
        <footer className="border-t border-white/[0.06] px-7 py-5 text-center text-[10px] text-slate-600">UMUHUZA CONNECT · YOUR HUMAN OS · RWANDA <span className="mx-2">·</span> DEMO DATA — NOT LIVE OPPORTUNITIES</footer>
      </div>
      {toast && <div role="status" className="fixed bottom-5 right-5 z-[70] flex max-w-sm items-center gap-3 rounded-xl border border-mint/20 bg-[#122437] px-4 py-3 text-sm shadow-2xl"><Check size={17} className="text-mint"/>{toast}</div>}
    </div>
  )
}

function Overview({ tasks, setTasks, setSection, notify }: { tasks: boolean[]; setTasks: (v: boolean[]) => void; setSection: (s: Section) => void; notify: (s: string) => void }) {
  const stats = [
    { label: 'Matched opportunities', value: '24', delta: '+6 this week', icon: Target, color: 'text-mint', bg: 'bg-mint/10' },
    { label: 'Profile strength', value: '68%', delta: 'Add 2 skills to improve', icon: Zap, color: 'text-amber-300', bg: 'bg-amber-300/10' },
    { label: 'Connections', value: '12', delta: '+3 this month', icon: Users, color: 'text-sky-300', bg: 'bg-sky-300/10' },
    { label: 'Applications', value: '5', delta: `${2} in review`, icon: BriefcaseBusiness, color: 'text-violet-300', bg: 'bg-violet-300/10' },
  ]
  const actions = [
    ['Complete your profile', 'Help employers understand your strengths', '10 min'],
    ['Apply to a matched role', 'Take the next step in your career', '5 min'],
    ['Make a new connection', 'Grow your professional network', '3 min'],
  ]
  const done = tasks.filter(Boolean).length
  return <div className="space-y-6">
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map(s => { const Icon = s.icon; return <div key={s.label} className="rounded-2xl border border-white/[0.07] bg-panel/70 p-5 transition hover:border-white/15"><div className="flex items-center justify-between"><span className="text-xs text-slate-400">{s.label}</span><span className={`rounded-xl p-2 ${s.bg} ${s.color}`}><Icon size={17}/></span></div><div className="mt-4 text-3xl font-semibold tracking-tight">{s.value}</div><div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500"><ArrowUpRight size={13} className="text-mint"/>{s.delta}</div></div> })}</div>
    <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
      <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-panel/70">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4"><div><h2 className="text-sm font-semibold">Recommended for you</h2><p className="mt-1 text-xs text-slate-500">Roles to explore based on your interests</p></div><button onClick={() => setSection('Career & jobs')} className="flex items-center gap-1 text-xs font-semibold text-mint hover:text-emerald-300">View all <ArrowRight size={14}/></button></div>
        <div className="divide-y divide-white/[0.05]">{jobs.slice(0,3).map(job => <div key={job.id} className="flex flex-col gap-3 px-5 py-4 transition hover:bg-white/[0.02] sm:flex-row sm:items-center"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold text-slate-300">{job.logo}</div><div className="min-w-0 flex-1"><div className="font-semibold text-slate-100">{job.title}</div><div className="mt-1 text-xs text-slate-400">{job.company} <span className="mx-1.5 text-slate-700">·</span>{job.location}</div><div className="mt-2 flex flex-wrap gap-2"><span className="rounded-md bg-white/[0.05] px-2 py-1 text-[10px] text-slate-400">{job.type}</span><span className="rounded-md bg-white/[0.05] px-2 py-1 text-[10px] text-slate-400">{job.salary}</span></div></div><div className="flex items-center gap-3 sm:flex-col sm:items-end"><span className="rounded-full border border-mint/15 bg-mint/[0.07] px-2.5 py-1 text-[10px] font-semibold text-mint">{job.match}% match</span><button onClick={() => setSection('Career & jobs')} className="text-xs font-semibold text-slate-300 hover:text-mint">View role <ArrowRight size={13} className="ml-1 inline"/></button></div></div>)}</div>
      </section>
      <section className="rounded-2xl border border-white/[0.07] bg-panel/70 p-5">
        <div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold">Your growth plan</h2><p className="mt-1 text-xs text-slate-500">Small steps. Real progress.</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300"><Target size={19}/></div></div>
        <div className="mt-5 flex items-end justify-between"><div><span className="text-3xl font-semibold">{Math.round(done / actions.length * 100)}%</span><span className="ml-2 text-xs text-slate-500">completed</span></div><span className="text-xs text-slate-500">{done}/{actions.length} tasks</span></div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-mint transition-all" style={{ width: `${done / actions.length * 100}%` }}/></div>
        <div className="mt-4 space-y-1">{actions.map((a, i) => <button key={a[0]} onClick={() => setTasks(tasks.map((v, idx) => idx === i ? !v : v))} className="flex w-full items-start gap-3 rounded-xl px-2 py-3 text-left hover:bg-white/[0.025]"><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${tasks[i] ? 'border-mint bg-mint text-[#06211c]' : 'border-white/15 text-transparent'}`}><Check size={13}/></span><span className="min-w-0 flex-1"><span className={`block text-xs font-medium ${tasks[i] ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{a[0]}</span><span className="mt-1 block text-[10px] text-slate-500">{a[1]}</span></span><span className="text-[10px] text-slate-600">{a[2]}</span></button>)}</div>
        <button onClick={() => notify('Your growth plan is saved in this demo session')} className="mt-3 w-full rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5">Save my plan</button>
      </section>
    </div>
    <section className="rounded-2xl border border-white/[0.07] bg-panel/70 p-5">
      <div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-semibold">Explore your Human OS</h2><p className="mt-1 text-xs text-slate-500">One account for the things you want to achieve.</p></div><Sparkles size={18} className="text-mint"/></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[
        { name: 'Marketplace', desc: 'Buy, sell and offer services', icon: ShoppingBag, tint: 'text-amber-300 bg-amber-300/10' },
        { name: 'Learning', desc: 'Turn new skills into proof', icon: GraduationCap, tint: 'text-sky-300 bg-sky-300/10' },
        { name: 'Network', desc: 'Meet collaborators and mentors', icon: Handshake, tint: 'text-violet-300 bg-violet-300/10' },
        { name: 'Income OS', desc: 'Organize work and earnings', icon: Wallet, tint: 'text-mint bg-mint/10' },
      ].map(c => { const Icon = c.icon; return <button key={c.name} onClick={() => setSection(c.name as Section)} className="group rounded-xl border border-white/[0.07] p-4 text-left transition hover:border-mint/25 hover:bg-mint/[0.025]"><div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${c.tint}`}><Icon size={19}/></div><div className="text-sm font-semibold group-hover:text-mint">{c.name}</div><div className="mt-1 text-xs text-slate-500">{c.desc}</div><ArrowUpRight size={15} className="mt-4 text-slate-600 group-hover:text-mint"/></button> })}</div>
    </section>
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-2xl border border-white/[0.07] bg-panel/70 p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold">Recent activity</h2><Activity size={17} className="text-slate-500"/></div>{[{ title:'Your profile is ready for an update', detail:'Add your top 3 skills to improve discoverability', time:'Today' },{ title:'New opportunities in Kigali', detail:'4 roles match your selected categories', time:'Yesterday' },{ title:'Learning plan suggested', detail:'React fundamentals · Beginner', time:'2 days ago' }].map(a => <div key={a.title} className="flex gap-3 border-t border-white/[0.05] py-3 first:border-0"><div className="mt-0.5 h-2 w-2 rounded-full bg-mint/70"/><div className="min-w-0 flex-1"><div className="text-xs font-medium">{a.title}</div><div className="mt-1 text-[11px] text-slate-500">{a.detail}</div></div><span className="text-[10px] text-slate-600">{a.time}</span></div>)}</section>
      <section className="relative overflow-hidden rounded-2xl border border-indigo-300/10 bg-gradient-to-br from-indigo-500/[0.12] via-panel to-mint/[0.04] p-5"><div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-indigo-400/[0.06] blur-2xl"/><div className="relative"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/15 text-indigo-300"><Sparkles size={20}/></div><h2 className="text-sm font-semibold">Meet your Opportunity Copilot</h2><p className="mt-2 max-w-sm text-xs leading-5 text-slate-400">Get guidance on your CV, discover skills employers need, and turn your goals into an action plan.</p><button onClick={() => notify('Copilot will be connected to an AI service in a future phase')} className="mt-4 flex items-center gap-2 rounded-xl border border-indigo-300/20 bg-indigo-300/[0.07] px-3 py-2.5 text-xs font-semibold text-indigo-200 hover:bg-indigo-300/10">Preview assistant <ArrowRight size={14}/></button></div></section>
    </div>
  </div>
}

function JobsView({ query, setQuery, filter, setFilter, jobs: visibleJobs, saved, applied, onSave, onApply, showAll, setShowAll }: any) {
  const [category, setCategory] = useState('All categories')
  return <div className="space-y-5">
    <div className="rounded-2xl border border-white/[0.07] bg-panel/70 p-4 sm:p-5">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_160px]"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Role, company, skill..." className="w-full rounded-xl border border-white/10 bg-white/[0.025] py-3 pl-10 pr-3 text-sm outline-none focus:border-mint/40"/></div><select value={category} onChange={e => setCategory(e.target.value)} className="rounded-xl border border-white/10 bg-[#111b2c] px-3 py-3 text-sm text-slate-300 outline-none"><option>All categories</option><option>Technology</option><option>Design</option><option>Business</option></select><select value={filter} onChange={e => setFilter(e.target.value)} className="rounded-xl border border-white/10 bg-[#111b2c] px-3 py-3 text-sm text-slate-300 outline-none"><option>All</option><option>Full-time</option><option>Contract</option></select></div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span><SlidersHorizontal size={13} className="mr-1 inline"/> Showing demo opportunities in Rwanda</span><span>{visibleJobs.filter((j: any) => category === 'All categories' || j.category === category).length} results</span></div>
    </div>
    <div className="grid gap-4 xl:grid-cols-2">{visibleJobs.filter((j: any) => category === 'All categories' || j.category === category).slice(0, showAll ? undefined : 4).map((job: any) => <article key={job.id} className="rounded-2xl border border-white/[0.07] bg-panel/70 p-5 transition hover:border-white/15"><div className="flex items-start gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold">{job.logo}</div><div className="min-w-0 flex-1"><h3 className="font-semibold">{job.title}</h3><p className="mt-1 text-xs text-slate-400">{job.company}</p></div><button aria-label="Save job" onClick={() => onSave(job.id)} className={`rounded-lg p-2 ${saved.includes(job.id) ? 'text-mint' : 'text-slate-500 hover:text-slate-200'}`}><Bookmark size={17} fill={saved.includes(job.id) ? 'currentColor' : 'none'}/></button></div><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-md bg-white/[0.05] px-2.5 py-1.5 text-[10px] text-slate-400"><MapPin size={11} className="mr-1 inline"/>{job.location}</span><span className="rounded-md bg-white/[0.05] px-2.5 py-1.5 text-[10px] text-slate-400">{job.type}</span><span className="rounded-md bg-white/[0.05] px-2.5 py-1.5 text-[10px] text-slate-400"><Clock3 size={11} className="mr-1 inline"/>{job.posted}</span></div><div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4"><div><div className="text-sm font-semibold">{job.salary}</div><div className="mt-1 text-[10px] text-slate-500">Illustrative salary · verify with employer</div></div><button disabled={applied.includes(job.id)} onClick={() => onApply(job.id)} className="rounded-xl bg-mint px-3.5 py-2.5 text-xs font-bold text-[#07211e] transition hover:bg-emerald-300 disabled:cursor-default disabled:bg-white/10 disabled:text-slate-400">{applied.includes(job.id) ? 'Demo applied' : 'Quick apply'} <ArrowRight size={13} className="ml-1 inline"/></button></div></article>)}</div>
    {visibleJobs.length === 0 && <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-slate-500">No demo results match your search. Try another keyword.</div>}
    <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.035] p-4 text-xs leading-5 text-slate-400"><CircleHelp size={15} className="mr-2 inline text-amber-300"/>Sample listings are for interface demonstration only. They are not verified vacancies and applications are not sent to real employers.</div>
  </div>
}

function Marketplace({ notify }: { notify: (s: string) => void }) {
  const [q, setQ] = useState('')
  const list = products.filter(p => `${p.name} ${p.seller} ${p.category}`.toLowerCase().includes(q.toLowerCase()))
  return <div className="space-y-5"><div className="flex flex-col justify-between gap-3 rounded-2xl border border-white/[0.07] bg-panel/70 p-5 sm:flex-row sm:items-center"><div><h2 className="font-semibold">Made in Rwanda. Connected to opportunity.</h2><p className="mt-1 text-xs text-slate-400">Explore local products and services from independent sellers.</p></div><button onClick={() => notify('Seller onboarding will be implemented with authenticated API')} className="rounded-xl bg-mint px-4 py-2.5 text-xs font-bold text-[#07211e]"><Plus size={14} className="mr-1 inline"/> Open a shop</button></div><div className="relative max-w-lg"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products and services..." className="w-full rounded-xl border border-white/10 bg-panel px-4 py-3 pl-10 text-sm outline-none focus:border-mint/40"/></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map(p => <article key={p.id} className="rounded-2xl border border-white/[0.07] bg-panel/70 p-5"><div className="mb-5 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-mint/[0.12] via-white/[0.025] to-indigo-400/[0.1] text-4xl text-mint">{p.icon}</div><div className="text-[10px] uppercase tracking-wider text-slate-500">{p.category}</div><h3 className="mt-2 font-semibold">{p.name}</h3><p className="mt-1 text-xs text-slate-400">by {p.seller}</p><div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4"><span className="text-sm font-bold">{p.price}</span><button onClick={() => notify(`Demo inquiry prepared for ${p.seller}`)} className="rounded-lg border border-mint/20 px-3 py-2 text-xs font-semibold text-mint hover:bg-mint/5">Contact seller <Send size={12} className="ml-1 inline"/></button></div></article>)}</div><p className="text-xs text-slate-600">Demo catalog only. No orders or payments are processed.</p></div>
}

function IncomeView({ notify }: { notify: (s: string) => void }) {
  return <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-3">{[['Tracked income','RWF 420,000','This month'],['Open projects','3','In progress'],['Pending invoices','RWF 85,000','2 invoices']].map(x => <div key={x[0]} className="rounded-2xl border border-white/[0.07] bg-panel/70 p-5"><div className="text-xs text-slate-400">{x[0]}</div><div className="mt-3 text-2xl font-semibold">{x[1]}</div><div className="mt-1 text-[11px] text-slate-500">{x[2]}</div></div>)}</div><div className="rounded-2xl border border-white/[0.07] bg-panel/70 p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Income activity</h2><p className="mt-1 text-xs text-slate-500">A sample view for independent professionals.</p></div><button onClick={() => notify('Invoice creation is planned for a future release')} className="rounded-xl bg-mint px-3 py-2 text-xs font-bold text-[#07211e]"><Plus size={14} className="mr-1 inline"/> New invoice</button></div><div className="mt-4 divide-y divide-white/[0.05]">{[['Website design milestone','RWF 250,000','Received'],['Brand assets','RWF 85,000','Pending'],['Landing page update','RWF 85,000','In progress']].map(x => <div key={x[0]} className="flex items-center justify-between py-4"><div><div className="text-sm font-medium">{x[0]}</div><div className="mt-1 text-xs text-slate-500">{x[2]}</div></div><div className="text-sm font-semibold">{x[1]}</div></div>)}</div></div><p className="text-xs text-slate-600">Illustrative figures only; no bank or payment account is connected.</p></div>
}

function SimpleWorkspace({ icon: Icon, title, desc, cards, notify }: { icon: typeof GraduationCap; title: string; desc: string; cards: string[][]; notify: (s: string) => void }) {
  return <div className="space-y-5"><div className="rounded-2xl border border-white/[0.07] bg-panel/70 p-6"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint/10 text-mint"><Icon size={22}/></div><h2 className="mt-4 text-lg font-semibold">{title}</h2><p className="mt-2 text-sm text-slate-400">{desc}</p></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{cards.map(c => <article key={c[0]} className="rounded-2xl border border-white/[0.07] bg-panel/70 p-5"><h3 className="font-semibold">{c[0]}</h3><p className="mt-2 text-xs text-slate-400">{c[1]}</p><button onClick={() => notify(`${c[0]} is a demo item; connect the API to enable it.`)} className="mt-5 flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-mint/25 hover:text-mint">{c[2]} <ArrowRight size={13}/></button></article>)}</div></div>
}

export default App
