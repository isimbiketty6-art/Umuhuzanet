import { useState, useEffect } from 'react';

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
import { authStorage } from './utils/authStorage';
import {
  realtimeClient,
  LiveEconomySnapshot,
  LiveNewsItem
} from './utils/realtimeClient';
import { Sprout, ShieldCheck, Lock, LogIn } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  // Primary Section Navigation (Single Unified Dashboard)
  const [section, setSection] = useState<Section>('Home');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'admin'>('login');
  const [role, setRole] = useState<UserRole>('Job seeker');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return authStorage.getCurrentUser();
  });
  const [accountInfoModalOpen, setAccountInfoModalOpen] = useState(false);

  const isAdmin = currentUser?.role === 'Administrator';

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

  // Agricultural Marketplace & Real-Time State
  const [agriProducts, setAgriProducts] = useState<AgriProduct[]>(INITIAL_AGRI_PRODUCTS);
  const [agriOrders, setAgriOrders] = useState<AgriOrder[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [liveNews, setLiveNews] = useState<LiveNewsItem[]>([]);
  const [liveEconomy, setLiveEconomy] = useState<LiveEconomySnapshot | null>(null);
  const [onlineUsersCount, setOnlineUsersCount] = useState<number>(1);
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

  // Real-Time WebSocket Subscription (Cart, Market Prices, Stock, Orders, News & Economy)
  useEffect(() => {
    const unsubscribe = realtimeClient.subscribe({
      onProducts: (products) => setAgriProducts(products),
      onCart: (serverCart) => setCart(serverCart.items),
      onOrders: (orders) => setAgriOrders(orders),
      onOrderPlaced: (order) => {
        setAgriOrders((prev) =>
          prev.some((o) => o.id === order.id) ? prev : [order, ...prev]
        );
      },
      onOrderUpdated: (updated) => {
        setAgriOrders((prev) =>
          prev.map((o) => (o.id === updated.id ? updated : o))
        );
      },
      onNews: (newsItems) => setLiveNews(newsItems),
      onEconomy: (economy) => setLiveEconomy(economy),
      onPresence: (count) => setOnlineUsersCount(count)
    });

    return () => unsubscribe();
  }, []);

  // Re-identify cart on auth login/logout
  useEffect(() => {
    realtimeClient.identifyCart(currentUser?.id);
    realtimeClient.fetchCart().then((c) => {
      if (c) setCart(c.items);
    });
  }, [currentUser?.id]);

  const handleRefreshLiveFeeds = async () => {
    const res = await realtimeClient.refreshLiveFeeds();
    if (res?.economy) setLiveEconomy(res.economy);
    if (res?.news) setLiveNews(res.news);
    if (res?.products) setAgriProducts(res.products);
    notify('Synced real-time Rwanda & global news and market prices.');
  };

  // Auth Handlers
  const handleAuthSuccess = (user: AuthUser, targetPortal?: PortalView) => {
    setCurrentUser(user);
    setRole(user.role);

    if (user.role === 'Administrator' || targetPortal === 'admin') {
      setSection('Admin Center');
    } else if (user.role === 'Seller' || targetPortal === 'seller') {
      setSection('Marketplace');
    } else {
      setSection('Overview');
    }
  };

  const handleLogout = async () => {
    await authStorage.logout();
    setCurrentUser(null);
    setRole('Job seeker');
    setSection('Home');
    notify('Signed out of your session securely.');
  };

  const handleNavigateSection = (target: Section) => {
    if (target === 'Admin Center' && !isAdmin) {
      notify('Restricted: Administrator authorization is required.');
      return;
    }
    const check = authStorage.checkAuthorization(currentUser, target);
    if (!check.authorized) {
      setSection(target);
      setAuthModalMode('login');
      setAuthModalOpen(true);
      notify(check.reason || 'Please sign in to continue.');
      return;
    }
    setSection(target);
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

  // Real-Time Server-Synced Cart Handlers
  const handleAddToCart = async (product: AgriProduct, qty: number) => {
    const res = await realtimeClient.addToCart(product, qty);
    if (res.ok && res.cart) {
      setCart(res.cart.items);
      notify(
        lang === 'rw'
          ? `${product.nameRw} (${qty} ${product.unit}) byashyizwe mu gatebo!`
          : `Added ${product.name} (${qty} ${product.unit}) to live cart!`
      );
    } else {
      notify(res.error || 'Could not add item to cart.');
    }
  };

  const handleAddArtisanProductToCart = async (prod: Product) => {
    const parsedPrice = Number(prod.price.replace(/[^\d]/g, '')) || 5000;
    const res = await realtimeClient.addToCart(
      {
        id: `artisan-${prod.id}`,
        name: prod.name,
        nameRw: prod.name,
        category: prod.category,
        pricePerUnit: parsedPrice,
        unit: 'piece',
        location: prod.sellerLocation,
        sellerName: prod.seller,
        image: '',
        stockQuantity: 25
      },
      1
    );
    if (res.ok && res.cart) {
      setCart(res.cart.items);
      notify(`Added "${prod.name}" (RWF ${parsedPrice.toLocaleString()}) to cart!`);
    } else {
      notify(res.error || 'Could not add item to cart.');
    }
  };

  const handleUpdateCartQty = async (productId: string, newQty: number) => {
    const res = await realtimeClient.updateCartQuantity(productId, newQty);
    if (res.ok && res.cart) {
      setCart(res.cart.items);
    } else if (res.error) {
      notify(res.error);
    }
  };

  const handleRemoveCartItem = async (productId: string) => {
    const res = await realtimeClient.removeFromCart(productId);
    if (res.ok && res.cart) {
      setCart(res.cart.items);
      notify(lang === 'rw' ? 'Bikuwe mu gatebo' : 'Item removed from cart');
    }
  };

  const handleClearCart = async () => {
    const res = await realtimeClient.clearCart();
    if (res.ok && res.cart) {
      setCart(res.cart.items);
      notify(lang === 'rw' ? 'Agatebo kasibwe' : 'Cart cleared');
    }
  };

  const handleCheckoutCart = async (payload: {
    customerName: string;
    customerPhone: string;
    deliveryDistrict: string;
    deliveryAddress: string;
    paymentMethod: string;
    paymentRef?: string;
  }) => {
    const res = await realtimeClient.checkoutCart(payload);
    if (res.ok && res.order) {
      if (res.cart) setCart(res.cart.items);
      if (res.products) setAgriProducts(res.products);
      setAgriOrders((prev) =>
        prev.some((o) => o.id === res.order!.id) ? prev : [res.order!, ...prev]
      );
      notify(
        lang === 'rw'
          ? `Komande ${res.order.orderNumber} yakiriwe neza!`
          : `Order #${res.order.orderNumber} confirmed in real time!`
      );
      return { ok: true, order: res.order };
    }
    return { ok: false, error: res.error };
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
        setSection={handleNavigateSection}
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
      />

      {/* ==================================================== */}
      {/* 2. MAIN UNIFIED DASHBOARD CANVAS                     */}
      {/* ======================================================== */}
      {section === 'Home' ? (
        <main className="flex-1 w-full animate-in fade-in duration-200">
          <HomePageView
            lang={lang}
            onNavigate={handleNavigateSection}
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
            isAdmin={isAdmin}
            liveEconomy={liveEconomy}
            liveNews={liveNews}
            onlineUsersCount={onlineUsersCount}
            onRefreshLiveFeeds={handleRefreshLiveFeeds}
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
                onSelectSection={(sec) => handleNavigateSection(sec as Section)}
                role={role}
                isAdmin={isAdmin}
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

              {/* Authentication Gate for Personal Workspace Sections */}
              {!currentUser && ['Overview', 'Income OS', 'Messages', 'Settings'].includes(section) ? (
                <div className="rounded-3xl border border-emerald-500/30 bg-[#092532] p-8 max-w-xl mx-auto my-10 text-center space-y-4 animate-in fade-in">
                  <div className="h-14 w-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <Lock size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Sign In Required</h2>
                    <p className="text-xs text-slate-300 mt-1.5 max-w-md mx-auto">
                      Your personal dashboard, invoices, messages, and account settings require an authenticated Umuhuza Connect session.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setAuthModalMode('login');
                        setAuthModalOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#04131B] font-bold text-xs transition flex items-center gap-2"
                    >
                      <LogIn size={14} />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        setAuthModalMode('register');
                        setAuthModalOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition"
                    >
                      Create Verified Account
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* TAB 1: USER DASHBOARD */}
                  {section === 'Overview' && (
                    <OverviewView
                      jobs={humanJobs}
                      products={humanProducts}
                      activities={activities}
                      savedJobIds={savedJobIds}
                      appliedJobIds={appliedJobIds}
                      onSelectJob={(j) => setSelectedJob(j)}
                      onSaveJob={handleSaveJob}
                      setSection={handleNavigateSection}
                      onOpenCopilot={() => setCopilotOpen(true)}
                      isAdmin={isAdmin}
                      onSwitchToAdmin={
                        isAdmin
                          ? () => {
                              setSection('Admin Center');
                              notify('Switched to Executive Admin Dashboard');
                            }
                          : undefined
                      }
                      userName={currentUser?.name?.split(' ')[0] || 'Member'}
                      liveEconomy={liveEconomy}
                      liveNews={liveNews}
                      onlineUsersCount={onlineUsersCount}
                      onRefreshLiveFeeds={handleRefreshLiveFeeds}
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
                    rwfPerUsd={liveEconomy?.fxRates.rwfPerUsd || 1385}
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
                      onAddToCart={handleAddArtisanProductToCart}
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
              {currentUser && section === 'Messages' && (
                <MessagesView
                  threads={threads}
                  onSendMessage={handleSendMessage}
                  notify={notify}
                />
              )}

              {/* TAB 8: EXECUTIVE ADMIN DASHBOARD (Strictly Protected) */}
              {section === 'Admin Center' && (
                isAdmin ? (
                  <AdminPortal
                    lang={lang}
                    notify={notify}
                    onSwitchToUserDashboard={() => {
                      setSection('Overview');
                      notify('Switched to User Dashboard');
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
                        Access to the Executive Admin Center is restricted to authorized Administrator accounts. Your current active role is <strong className="text-emerald-400 font-mono">{currentUser?.role || 'Guest / Unauthenticated'}</strong>.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={() => setSection(currentUser ? 'Overview' : 'Home')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#04131B] text-xs font-bold transition"
                      >
                        {currentUser ? 'Return to My Dashboard' : 'Return Home'}
                      </button>
                    </div>
                  </div>
                )
              )}

              {/* TAB 9: SETTINGS */}
              {currentUser && section === 'Settings' && (
                <SettingsView
                  currentUser={currentUser}
                  onProfileUpdated={(updated) => setCurrentUser(updated)}
                  notify={notify}
                />
              )}
                </>
              )}
            </div>
          </main>
        </div>
      )}

      {/* ==================================================== */}
      {/* BOTTOM FOOTER BAR                                    */}
      {/* ==================================================== */}
      <footer className="border-t border-[#19414D] bg-[#031720] py-5 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-[#04131B] flex items-center justify-center font-bold">
              <Sprout size={16} />
            </div>
            <div>
              <div className="font-bold text-white tracking-tight">
                Umuhuza Connect · <span className="text-emerald-300">Developed by Izere Elias</span>
              </div>
              <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-2">
                <span>Contact: <a href="mailto:izeredeveloper@gmail.com" className="text-emerald-300 hover:underline">izeredeveloper@gmail.com</a></span>
                <span>•</span>
                <span>Support: <a href="mailto:umuhuzanet@outlook.com" className="text-emerald-300 hover:underline">umuhuzanet@outlook.com</a></span>
                <span>•</span>
                <span className="font-mono">Tel: <a href="tel:+250796916332" className="text-emerald-300 hover:underline">0796916332</a></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <button onClick={() => handleNavigateSection('Network')} className="hover:text-emerald-300 flex items-center gap-1.5 transition">
              <span className="text-emerald-400">👥</span>
              <span>Connect</span>
            </button>
            <span>•</span>
            <button onClick={() => handleNavigateSection('Marketplace')} className="hover:text-emerald-300 flex items-center gap-1.5 transition">
              <span className="text-emerald-400">🛒</span>
              <span>Trade</span>
            </button>
            <span>•</span>
            <button onClick={() => handleNavigateSection('Learning')} className="hover:text-emerald-300 flex items-center gap-1.5 transition">
              <span className="text-emerald-400">🎓</span>
              <span>Learn</span>
            </button>
            <span>•</span>
            <button onClick={() => handleNavigateSection('Income OS')} className="hover:text-emerald-300 flex items-center gap-1.5 transition">
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
      {/* Single, Streamlined Authentication Modal */}
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
        notify={notify}
      />

      {/* Real-Time Server-Synced Shopping Cart Drawer with MTN MoMo / Bank Transfer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        orders={agriOrders}
        rwfPerUsd={liveEconomy?.fxRates.rwfPerUsd || 1385}
        currentUser={currentUser}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckout={handleCheckoutCart}
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
        setSection={handleNavigateSection}
        role={role}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthModalMode('login');
          setAuthModalOpen(true);
        }}
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
