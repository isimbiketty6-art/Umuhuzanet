import { useState } from 'react';

// Types for Agricultural Marketplace
import {
  Language,
  PortalView,
  AgriProduct,
  CartItem,
  AgriOrder,
  AgriCategory
} from './types/agri';

// Types for Talent & Human OS
import {
  Job,
  Product,
  Application,
  Invoice,
  Course,
  CommunityGroup,
  MessageThread,
  ChatMessage,
  UserActivity,
  Section,
  UserRole
} from './types';

// Data
import {
  INITIAL_AGRI_PRODUCTS,
  INITIAL_ORDERS
} from './data/agriData';
import { translations } from './data/translations';
import {
  initialJobs,
  initialProducts,
  initialApplications,
  initialInvoices,
  initialCourses,
  initialCommunities,
  initialMessages,
  initialActivities
} from './data/mockData';

// Core Components
import { Navigation } from './components/Navigation';
import { WorkspaceTabsBar } from './components/WorkspaceTabsBar';
import { OverviewView } from './components/OverviewView';
import { HomePageView } from './components/HomePageView';
import { DedicatedPortalsView } from './components/DedicatedPortalsView';
import { ProductCatalog } from './components/ProductCatalog';
import { MarketplaceView } from './components/MarketplaceView';
import { JobsView } from './components/JobsView';
import { LearningView } from './components/LearningView';
import { NetworkView } from './components/NetworkView';
import { IncomeOSView } from './components/IncomeOSView';
import { MessagesView } from './components/MessagesView';
import { SettingsView } from './components/SettingsView';
import { AdminPortal } from './components/AdminPortal';
import { Sidebar } from './components/Sidebar';

// Modals & Drawers
import { CartDrawer } from './components/CartDrawer';
import { MessagingModal } from './components/MessagingModal';
import { AgriAiAssistant } from './components/AgriAiAssistant';
import { AuthModal, AuthUser } from './components/AuthModal';
import { JobDetailModal } from './components/JobDetailModal';
import { ApplyModal } from './components/ApplyModal';
import { PostJobModal } from './components/PostJobModal';
import { AddProductModal } from './components/AddProductModal';
import { ContactSellerModal } from './components/ContactSellerModal';
import { CreateInvoiceModal } from './components/CreateInvoiceModal';
import { OpportunityCopilotModal } from './components/OpportunityCopilotModal';
import { AccountInfoModal } from './components/AccountInfoModal';
import { authStorage, PRESET_CREDENTIALS, CredentialPreset } from './utils/authStorage';
import { Sprout, Crown, ShieldCheck } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  // Primary Section Navigation (Single Unified Dashboard)
  const [section, setSection] = useState<Section>('Home');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('Job seeker');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return authStorage.getCurrentUser();
  });
  const [accountInfoModalOpen, setAccountInfoModalOpen] = useState(false);

  // State Collections
  const [humanJobs, setHumanJobs] = useState<Job[]>(initialJobs);
  const [humanProducts, setHumanProducts] = useState<Product[]>(initialProducts);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [groups, setGroups] = useState<CommunityGroup[]>(initialCommunities);
  const [threads, setThreads] = useState<MessageThread[]>(initialMessages);
  const [activities, setActivities] = useState<UserActivity[]>(initialActivities);

  const [savedJobIds, setSavedJobIds] = useState<number[]>([1, 4]);
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([1, 2]);

  // Agricultural Marketplace State
  const [agriProducts, setAgriProducts] = useState<AgriProduct[]>(INITIAL_AGRI_PRODUCTS);
  const [agriOrders, setAgriOrders] = useState<AgriOrder[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([
    { product: INITIAL_AGRI_PRODUCTS[0], quantity: 5 },
    { product: INITIAL_AGRI_PRODUCTS[1], quantity: 10 }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AgriCategory | 'All'>('All');

  // Modal Visibility State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatProduct, setChatProduct] = useState<AgriProduct | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [postJobOpen, setPostJobOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [contactProduct, setContactProduct] = useState<Product | null>(null);
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  // Universal Toast Notification
  const [toast, setToast] = useState<string | null>(null);
  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Auth Handlers
  const handleAuthSuccess = (user: AuthUser, targetPortal?: PortalView) => {
    setCurrentUser(user);
    setRole(user.role);
    authStorage.setCurrentUser(user);

    if (user.role === 'Administrator' || targetPortal === 'admin') {
      setSection('Admin Center');
      notify(`Welcome back, Administrator ${user.name}!`);
    } else if (user.role === 'Seller' || targetPortal === 'seller') {
      setSection('Marketplace');
      notify(`Welcome back, ${user.name}! Your agricultural harvest store is ready.`);
    } else {
      setSection('Overview');
      notify(`Welcome back, ${user.name}! Connected to your Rwanda Career OS.`);
    }
  };

  const handleLogout = () => {
    authStorage.setCurrentUser(null);
    setCurrentUser(null);
    setRole('Job seeker');
    setSection('Overview');
    notify('Signed out of session');
  };

  // Job Handlers
  const handleSaveJob = (id: number) => {
    if (savedJobIds.includes(id)) {
      setSavedJobIds(savedJobIds.filter((jId) => jId !== id));
      notify('Job removed from saved listings');
    } else {
      setSavedJobIds([...savedJobIds, id]);
      notify('Job saved to your career bookmarks');
    }
  };

  const handleApplySuccess = (jobId: number, newApp: Application) => {
    setApplications([newApp, ...applications]);
    if (!appliedJobIds.includes(jobId)) {
      setAppliedJobIds([...appliedJobIds, jobId]);
    }
    setHumanJobs(
      humanJobs.map((j) => (j.id === jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j))
    );
    notify(`Application submitted to ${newApp.company} in Kigali!`);
  };

  const handlePostJobSuccess = (newJob: Job) => {
    setHumanJobs([newJob, ...humanJobs]);
    notify(`New vacancy "${newJob.title}" published!`);
  };

  // Product Handlers
  const handleAddProductSuccess = (newProduct: Product) => {
    setHumanProducts([newProduct, ...humanProducts]);
    notify(`Product "${newProduct.name}" listed in Made in Rwanda marketplace!`);
  };

  // Cart Handlers
  const handleAddToCart = (product: AgriProduct, qty: number) => {
    const existingIndex = cart.findIndex((it) => it.product.id === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += qty;
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity: qty }]);
    }
    notify(
      lang === 'rw'
        ? `${product.nameRw} (${qty} ${product.unit}) byashyizwe mu gatebo!`
        : `Added ${product.name} (${qty} ${product.unit}) to cart!`
    );
  };

  const handleUpdateCartQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId);
    } else {
      setCart(
        cart.map((it) => (it.product.id === productId ? { ...it, quantity: newQty } : it))
      );
    }
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart(cart.filter((it) => it.product.id !== productId));
    notify(lang === 'rw' ? 'Bikuwe mu gatebo' : 'Item removed from cart');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOrderPlaced = (order: AgriOrder) => {
    setAgriOrders([order, ...agriOrders]);
    setCart([]);
    setIsCartOpen(false);
    notify(
      lang === 'rw'
        ? `Komande ${order.id} yakiriwe neza! Nimero: ${order.orderNumber}`
        : `Order ${order.id} placed successfully! Order #${order.orderNumber}`
    );
  };

  // Invoice Handlers
  const handleCreateInvoiceSuccess = (newInv: Invoice) => {
    setInvoices([newInv, ...invoices]);
    notify(`Invoice ${newInv.invoiceNumber} created with MTN MoMo payment instructions!`);
  };

  const handleMarkInvoicePaid = (id: string) => {
    setInvoices(
      invoices.map((inv) => (inv.id === id ? { ...inv, status: 'Paid' } : inv))
    );
    notify('Invoice marked as Paid via MoMo transfer');
  };

  // Message Handlers
  const handleSendMessage = (threadId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      senderName: currentUser ? currentUser.name : 'You',
      text,
      time: 'Just now'
    };

    setThreads(
      threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              lastMessage: text,
              lastMessageTime: 'Just now',
              messages: [...t.messages, newMessage]
            }
          : t
      )
    );
    notify('Message sent');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col font-sans selection:bg-mint/30 selection:text-white">
      {/* ==================================================== */}
      {/* 1. PRISTINE UNIFIED TOP HEADER                      */}
      {/* ==================================================== */}
      <Navigation
        section={section}
        setSection={setSection}
        role={role}
        setRole={setRole}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode === 'signup' ? 'register' : 'login');
          setAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenMobileNav={() => setSidebarOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        lang={lang}
        setLang={setLang}
        unreadMessagesCount={2}
        notify={notify}
        onOpenAccountInfo={() => setAccountInfoModalOpen(true)}
        onSwitchUser={(preset) => {
          const res = authStorage.verifyCredentials(preset.email, preset.password);
          if (res.success && res.user) {
            handleAuthSuccess(res.user, preset.targetPortal as PortalView);
          }
        }}
      />

      {/* ==================================================== */}
      {/* 2. MAIN UNIFIED DASHBOARD CANVAS                     */}
      {/* ======================================================== */}
      {section === 'Home' ? (
        <main className="flex-1 w-full animate-in fade-in duration-200">
          <HomePageView
            lang={lang}
            onNavigate={(sec) => setSection(sec)}
            onOpenAuth={(mode) => {
              setAuthModalMode(mode === 'signup' ? 'register' : 'login');
              setAuthModalOpen(true);
            }}
            onSearch={(q, loc) => {
              setSearchQuery(q);
              notify(`Searching opportunities for ${q || 'all'} in ${loc}`);
            }}
            featuredJobs={humanJobs}
            recommendedProducts={humanProducts}
            notify={notify}
          />
        </main>
      ) : (
        <div className="flex flex-1 flex-col w-full min-w-0 transition-all duration-200">
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {/* Organized Workspace Tabs & Quick Actions Ribbon */}
              <WorkspaceTabsBar
                currentSection={section}
                onSelectSection={(sec) => {
                  setSection(sec as Section);
                }}
                role={role}
                onOpenQuickAction={(actionType) => {
                  if (actionType === 'postJob') setPostJobOpen(true);
                  else if (actionType === 'addProduct') setAddProductOpen(true);
                  else if (actionType === 'createInvoice') setCreateInvoiceOpen(true);
                  else if (actionType === 'copilot') setCopilotOpen(true);
                }}
                unreadMessagesCount={2}
                savedJobsCount={savedJobIds.length}
                invoicesCount={invoices.length}
              />

              {/* TAB 1: USER DASHBOARD (Image 1 Career OS & Image 2 Trainee Hub) */}
              {section === 'Overview' && (
                <OverviewView
                  jobs={humanJobs}
                  products={humanProducts}
                  activities={activities}
                  savedJobIds={savedJobIds}
                  appliedJobIds={appliedJobIds}
                  onSelectJob={(j) => setSelectedJob(j)}
                  onSaveJob={handleSaveJob}
                  setSection={setSection}
                  onOpenCopilot={() => setCopilotOpen(true)}
                  onSwitchToAdmin={() => {
                    setSection('Admin Center');
                    notify('Switched to Executive Admin Dashboard');
                  }}
                  userName={currentUser?.name?.split(' ')[0] || 'Aline'}
                  notify={notify}
                />
              )}

              {/* TAB 2: AGRICULTURAL & ARTISAN MARKETPLACE (ISOKO) */}
              {section === 'Marketplace' && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  {/* Rwandan Farm Produce Catalog with Cart and MoMo */}
                  <ProductCatalog
                    products={agriProducts}
                    lang={lang}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    searchQuery={searchQuery}
                    onAddToCart={handleAddToCart}
                    onOpenMessageSeller={(prod) => setChatProduct(prod)}
                    notify={notify}
                  />

                  {/* Made in Rwanda Artisan Crafts & Digital Services */}
                  <div className="border-t border-white/10 pt-8">
                    <MarketplaceView
                      products={humanProducts}
                      onOpenAddProduct={() => setAddProductOpen(true)}
                      onOpenContactSeller={(p) => setContactProduct(p)}
                      notify={notify}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: CAREERS & VACANCIES */}
              {section === 'Career & jobs' && (
                <JobsView
                  jobs={humanJobs}
                  savedJobIds={savedJobIds}
                  appliedJobIds={appliedJobIds}
                  applications={applications}
                  onSelectJob={(j) => setSelectedJob(j)}
                  onSaveJob={handleSaveJob}
                  onOpenApply={(j) => setApplyingJob(j)}
                  onOpenPostJob={() => setPostJobOpen(true)}
                  notify={notify}
                />
              )}

              {/* SPECIALIZED PORTALS (Job Seeker / Seller / Buyer Connection from home.png) */}
              {section === 'Find opportunities' && (
                <DedicatedPortalsView
                  initialPortal="seeker"
                  jobs={humanJobs}
                  onSelectJob={(j) => setSelectedJob(j)}
                  onOpenMessageWith={(seller) => notify(`Conversation started with ${seller}`)}
                  notify={notify}
                />
              )}

              {/* TAB 4: LEARNING & SKILLS */}
              {section === 'Learning' && (
                <LearningView
                  courses={courses}
                  onCompleteLesson={(courseId, lessonId) => {
                    setCourses(
                      courses.map((c) =>
                        c.id === courseId
                          ? {
                              ...c,
                              lessons: c.lessons.map((l) =>
                                l.id === lessonId ? { ...l, completed: true } : l
                              ),
                              completedLessons: Math.min(c.lessonsCount, c.completedLessons + 1)
                            }
                          : c
                      )
                    );
                    notify('Lesson completed! Progress saved to Rwanda skills profile.');
                  }}
                  notify={notify}
                />
              )}

              {/* TAB 5: PROFESSIONAL NETWORK */}
              {section === 'Network' && (
                <NetworkView
                  communities={groups}
                  onToggleJoin={(id) => {
                    setGroups(
                      groups.map((g) => (g.id === id ? { ...g, joined: !g.joined } : g))
                    );
                    notify('Community membership updated');
                  }}
                  notify={notify}
                />
              )}

              {/* TAB 6: INCOME OS & FREELANCE MOMO INVOICING */}
              {section === 'Income OS' && (
                <IncomeOSView
                  invoices={invoices}
                  onOpenCreateInvoice={() => setCreateInvoiceOpen(true)}
                  onMarkInvoicePaid={handleMarkInvoicePaid}
                  notify={notify}
                />
              )}

              {/* TAB 7: MESSAGES */}
              {section === 'Messages' && (
                <MessagesView
                  threads={threads}
                  onSendMessage={handleSendMessage}
                  notify={notify}
                />
              )}

              {/* TAB 8: EXECUTIVE ADMIN DASHBOARD (Image 3 Panelify & Image 4 ShopPoint) */}
              {section === 'Admin Center' && (
                currentUser?.role === 'Administrator' ? (
                  <AdminPortal
                    lang={lang}
                    notify={notify}
                    onSwitchToUserDashboard={() => {
                      setSection('Overview');
                      notify('Switched to User Dashboard (Hello, Aline)');
                    }}
                  />
                ) : (
                  <div className="rounded-3xl border border-red-500/30 bg-[#0c1626] p-8 max-w-2xl mx-auto my-12 text-center space-y-4 animate-in fade-in">
                    <div className="h-16 w-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">403: Administrator Clearance Required</h2>
                      <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                        Access to the Umuhuza Executive Admin Center is strictly restricted to verified Administrator accounts. Your current active session role is <strong className="text-emerald-400 font-mono">{currentUser?.role || 'Guest / Unauthenticated'}</strong>.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          const adminPreset = PRESET_CREDENTIALS.find((p) => p.role === 'Administrator');
                          if (adminPreset) {
                            const res = authStorage.verifyCredentials(adminPreset.email, adminPreset.password);
                            if (res.success && res.user) {
                              handleAuthSuccess(res.user, 'admin');
                              notify(`Switched to Administrator: ${res.user.name}`);
                            }
                          }
                        }}
                        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-purple-600/20"
                      >
                        <Crown size={14} />
                        <span>Switch to Admin Session (Nadine Mukamana)</span>
                      </button>

                      <button
                        onClick={() => setSection('Overview')}
                        className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  </div>
                )
              )}

              {/* TAB 9: SETTINGS */}
              {section === 'Settings' && (
                <SettingsView
                  currentRole={role}
                  onRoleChange={(r) => {
                    setRole(r);
                    notify(`Role updated to ${r}`);
                  }}
                  notify={notify}
                />
              )}
            </div>
          </main>
        </div>
      )}

      {/* ==================================================== */}
      {/* BOTTOM FOOTER BAR (from new.png)                     */}
      {/* ==================================================== */}
      <footer className="border-t border-[#19414D] bg-[#031720] py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-[#04131B] flex items-center justify-center font-bold">
              <Sprout size={16} />
            </div>
            <div>
              <div className="font-bold text-white tracking-tight">
                Umuhuza Connect
              </div>
              <div className="text-[10px] text-emerald-400">
                Rwanda&apos;s Digital Bridge for a Brighter Future
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <button onClick={() => setSection('Network')} className="hover:text-emerald-300 flex items-center gap-1.5 transition">
              <span className="text-emerald-400">👥</span>
              <span>Connect</span>
            </button>
            <span>•</span>
            <button onClick={() => setSection('Marketplace')} className="hover:text-emerald-300 flex items-center gap-1.5 transition">
              <span className="text-emerald-400">🛒</span>
              <span>Trade</span>
            </button>
            <span>•</span>
            <button onClick={() => setSection('Learning')} className="hover:text-emerald-300 flex items-center gap-1.5 transition">
              <span className="text-emerald-400">🎓</span>
              <span>Learn</span>
            </button>
            <span>•</span>
            <button onClick={() => setSection('Income OS')} className="hover:text-emerald-300 flex items-center gap-1.5 transition">
              <span className="text-emerald-400">📈</span>
              <span>Grow</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="italic text-emerald-300 font-serif font-bold text-xs">
              Together We Build Rwanda
            </span>
            <span className="text-sm">🇷🇼</span>
          </div>
        </div>
      </footer>

      {/* ==================================================== */}
      {/* 3. UNIVERSAL MODALS & DRAWERS                        */}
      {/* ==================================================== */}
      {/* Single, Streamlined Authentication Modal with 1-Tap Demo Login */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
        notify={notify}
      />

      {/* Real Account Information & Security Session Settings Modal */}
      <AccountInfoModal
        isOpen={accountInfoModalOpen}
        onClose={() => setAccountInfoModalOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchAccount={(newRole) => {
          setRole(newRole);
          const matchedPreset = PRESET_CREDENTIALS.find((p) => p.role === newRole);
          if (matchedPreset) {
            const res = authStorage.verifyCredentials(matchedPreset.email, matchedPreset.password);
            if (res.success && res.user) {
              handleAuthSuccess(res.user);
            }
          }
          notify(`Switched role perspective to ${newRole}`);
        }}
        notify={notify}
      />

      {/* Shopping Cart Drawer with MTN MoMo / Bank Transfer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
        lang={lang}
        notify={notify}
      />

      {/* Direct Buyer-Seller Chat Modal */}
      <MessagingModal
        product={chatProduct}
        isOpen={!!chatProduct}
        onClose={() => setChatProduct(null)}
        lang={lang}
        notify={notify}
      />

      {/* Opportunity AI Copilot Modal */}
      <OpportunityCopilotModal
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        notify={notify}
      />

      {/* Job Detail & Apply Modals */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        isSaved={selectedJob ? savedJobIds.includes(selectedJob.id) : false}
        isApplied={selectedJob ? appliedJobIds.includes(selectedJob.id) : false}
        onSave={handleSaveJob}
        onApply={(j: Job) => {
          setSelectedJob(null);
          setApplyingJob(j);
        }}
      />

      <ApplyModal
        job={applyingJob}
        onClose={() => setApplyingJob(null)}
        onSubmit={(appData) => {
          if (applyingJob) {
            const newApp: Application = {
              id: `app-${Date.now()}`,
              jobId: applyingJob.id,
              jobTitle: applyingJob.title,
              company: applyingJob.company,
              applicantName: appData.applicantName,
              applicantEmail: appData.applicantEmail,
              applicantPhone: appData.applicantPhone,
              portfolioUrl: appData.portfolioUrl,
              note: appData.note,
              cvFileName: appData.cvFileName,
              submittedAt: 'Just now',
              status: 'Under Review'
            };
            handleApplySuccess(applyingJob.id, newApp);
          }
          setApplyingJob(null);
        }}
      />

      <PostJobModal
        isOpen={postJobOpen}
        onClose={() => setPostJobOpen(false)}
        onPostJob={handlePostJobSuccess}
      />

      <AddProductModal
        isOpen={addProductOpen}
        onClose={() => setAddProductOpen(false)}
        onAddProduct={handleAddProductSuccess}
      />

      <ContactSellerModal
        product={contactProduct}
        onClose={() => setContactProduct(null)}
        onSendMessage={(prod, msg) => {
          notify(`Message sent to seller of ${prod.name}`);
          setContactProduct(null);
        }}
      />

      <CreateInvoiceModal
        isOpen={createInvoiceOpen}
        onClose={() => setCreateInvoiceOpen(false)}
        onCreateInvoice={handleCreateInvoiceSuccess}
      />

      {/* Features Sidebar Drawer (Auto-hides on selection) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        section={section}
        setSection={setSection}
        role={role}
        setRole={setRole}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenCopilot={() => setCopilotOpen(true)}
        onOpenPostJob={() => setPostJobOpen(true)}
        onOpenAddProduct={() => setAddProductOpen(true)}
        onOpenCreateInvoice={() => setCreateInvoiceOpen(true)}
        unreadMessagesCount={2}
        notify={notify}
      />

      {/* Universal Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-mint/30 bg-[#0c1827] px-4 py-3 text-xs font-semibold text-mint shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-200">
          <span className="h-2 w-2 rounded-full bg-mint animate-pulse" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
