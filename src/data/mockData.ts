import { Job, Product, Application, Invoice, Course, CommunityGroup, MessageThread, UserActivity } from '../types';

export const initialJobs: Job[] = [
  {
    id: 1,
    title: 'Senior Frontend Engineer (React/TypeScript)',
    company: 'Kigali Digital Labs',
    companyLogo: 'KD',
    location: 'Kigali (Kacyiru), Rwanda',
    type: 'Full-time',
    salary: 'RWF 1,200,000 – 1,800,000 / mo',
    salaryMin: 1200000,
    salaryMax: 1800000,
    category: 'Technology',
    match: 96,
    posted: '2 hours ago',
    description: 'Lead the frontend architecture for next-generation digital public service portals and high-scale consumer fintech applications across East Africa.',
    requirements: [
      '3+ years professional experience with React, TypeScript, and modern state architecture',
      'Solid command of Tailwind CSS and web performance metrics (Core Web Vitals)',
      'Experience with REST / GraphQL APIs and automated testing with Vitest/Jest',
      'Passion for accessible and inclusive digital design for Rwandan users'
    ],
    responsibilities: [
      'Design and build responsive web applications with top-tier accessibility',
      'Collaborate closely with product managers and Rwandan UX designers',
      'Mentor junior software apprentices in our Kigali developer hub',
      'Conduct code reviews and champion front-end best practices'
    ],
    perks: ['Health insurance (RSSB top-tier)', 'Norrsken House flex pass', 'Continuous learning budget', 'Home office equipment allowance'],
    applicantsCount: 14,
    status: 'Open',
    tags: ['React', 'TypeScript', 'Tailwind', 'REST']
  },
  {
    id: 2,
    title: 'Product & Brand Designer',
    company: 'Imanzi Studio',
    companyLogo: 'IS',
    location: 'Hybrid · Kigali (Nyarutarama)',
    type: 'Full-time',
    salary: 'RWF 800,000 – 1,250,000 / mo',
    salaryMin: 800000,
    salaryMax: 1250000,
    category: 'Design',
    match: 91,
    posted: '5 hours ago',
    description: 'Shape the visual language and user experiences for innovative East African consumer brands, digital products, and cultural exhibitions.',
    requirements: [
      'Portfolio showcasing end-to-end design systems, mobile UX, and brand identity',
      'Proficiency in Figma, design tokens, and interactive prototyping',
      'Strong eye for Rwandan and African contemporary design aesthetics',
      'Clear communication skills in English and Kinyarwanda'
    ],
    responsibilities: [
      'Conduct user research and usability testing with Rwandan local communities',
      'Design clean UI components and maintain our unified Figma system',
      'Work alongside engineering to ensure pixel-perfect implementation'
    ],
    perks: ['Flexible hours', 'MacBook Pro provided', 'Design conference tickets', 'Annual team retreat at Lake Kivu'],
    applicantsCount: 9,
    status: 'Open',
    tags: ['Figma', 'UI/UX', 'Design Systems', 'Brand Strategy']
  },
  {
    id: 3,
    title: 'Customer Success & Operations Lead',
    company: 'Akazi Cloud',
    companyLogo: 'AC',
    location: 'Kigali (Gasabo), Rwanda',
    type: 'Full-time',
    salary: 'RWF 600,000 – 900,000 / mo',
    salaryMin: 600000,
    salaryMax: 900000,
    category: 'Business',
    match: 87,
    posted: '1 day ago',
    description: 'Empower Rwandan small businesses, hospitality venues, and retailers to succeed using our cloud management and electronic invoicing POS system.',
    requirements: [
      'Experience in customer support, SaaS account onboarding, or merchant success',
      'Strong empathy, problem-solving, and patience with non-technical business owners',
      'Fluency in Kinyarwanda and English (French is a plus)'
    ],
    responsibilities: [
      'Onboard new commercial clients and lead hands-on platform training sessions',
      'Resolve customer inquiries via WhatsApp, phone, and ticketing systems',
      'Gather merchant feedback to shape upcoming product updates'
    ],
    perks: ['Commuter transport stipend', 'Performance bonus', 'Paid family leave'],
    applicantsCount: 22,
    status: 'Open',
    tags: ['SaaS', 'Account Management', 'Merchant Support', 'Operations']
  },
  {
    id: 4,
    title: 'Data & Business Intelligence Analyst',
    company: 'Inzira Analytics',
    companyLogo: 'IA',
    location: 'Remote · Rwanda',
    type: 'Contract',
    salary: 'RWF 750,000 – 1,100,000 / mo',
    salaryMin: 750000,
    salaryMax: 1100000,
    category: 'Technology',
    match: 84,
    posted: '1 day ago',
    description: 'Transform agricultural supply chain and retail data into actionable visual dashboards for agricultural cooperatives across Rwanda.',
    requirements: [
      'Strong SQL knowledge and experience with Metabase, Tableau, or Power BI',
      'Python or R proficiency for data transformation and statistical modeling',
      'Demonstrated interest in agritech and rural economic development'
    ],
    responsibilities: [
      'Build automated data ingestion pipelines for field survey data',
      'Create executive reports for cooperative leaders and development partners',
      'Analyze seasonal yield and harvest price volatility patterns'
    ],
    perks: ['Fully remote setup', 'Mobile data subsidy', 'Quarterly bonus'],
    applicantsCount: 8,
    status: 'Open',
    tags: ['SQL', 'Python', 'BI', 'Agritech']
  },
  {
    id: 5,
    title: 'Agritech IoT & Systems Technician',
    company: 'Rwanda Green Harvest',
    companyLogo: 'RG',
    location: 'Musanze / Kigali, Rwanda',
    type: 'Full-time',
    salary: 'RWF 650,000 – 950,000 / mo',
    salaryMin: 650000,
    salaryMax: 950000,
    category: 'Agriculture & Green Tech',
    match: 82,
    posted: '2 days ago',
    description: 'Install and monitor solar-powered soil moisture and automated drip irrigation sensors across cooperative farms in Northern Province.',
    requirements: [
      'Technical diploma or degree in Electrical Engineering, Mechatronics, or Agronomy',
      'Hands-on experience troubleshooting low-power sensors, solar inverters, and GSM telemetry',
      'Willingness to travel between Kigali and agricultural field stations'
    ],
    responsibilities: [
      'Deploy IoT telemetry units in tea, coffee, and horticultural zones',
      'Perform preventative maintenance and diagnose sensor connectivity faults',
      'Train local farm managers on reading the mobile alert dashboard'
    ],
    perks: ['Field travel per diem', 'Motorcycle transport allowance', 'Comprehensive health cover'],
    applicantsCount: 6,
    status: 'Open',
    tags: ['IoT', 'Solar', 'Agronomy', 'Hardware']
  },
  {
    id: 6,
    title: 'Digital Marketing & Content Specialist',
    company: 'Kigali Artisan Guild',
    companyLogo: 'KA',
    location: 'Kigali, Rwanda',
    type: 'Contract',
    salary: 'RWF 500,000 – 800,000 / mo',
    salaryMin: 500000,
    salaryMax: 800000,
    category: 'Business',
    match: 79,
    posted: '3 days ago',
    description: 'Promote authentic Rwandan artisanal products, weaving heritage, and coffee to diaspora and international markets through social commerce.',
    requirements: [
      'Demonstrated experience in social media storytelling, short video editing, and email marketing',
      'Strong written English with captivating narrative voice',
      'Experience with Shopify or WooCommerce is desirable'
    ],
    responsibilities: [
      'Create weekly photo and reel content highlighting Rwandan artisans',
      'Manage cross-border customer service and international courier inquiries',
      'Track engagement metrics and run targeted digital campaigns'
    ],
    perks: ['Flexible schedule', 'Free artisan coffee daily', 'Creative autonomy'],
    applicantsCount: 17,
    status: 'Open',
    tags: ['Social Commerce', 'Content Creation', 'Branding', 'Copywriting']
  }
];

export const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Brand Identity & Web Styleguide Package',
    seller: 'Imanzi Creative',
    sellerLocation: 'Kigali, Rwanda',
    price: 'RWF 185,000',
    priceNumber: 185000,
    category: 'Design service',
    icon: '✦',
    description: 'Complete brand toolkit for Rwandan businesses: modern bilingual logo mark, color palette, typography guidelines, business cards, and social media template bundle.',
    rating: 4.9,
    salesCount: 38,
    inStock: true,
    leadTime: '5–7 business days'
  },
  {
    id: 2,
    name: 'Traditional Handwoven Agaseke Peace Basket',
    seller: 'Umutima Crafts Cooperative',
    sellerLocation: 'Huye, Southern Province',
    price: 'RWF 24,000',
    priceNumber: 24000,
    category: 'Handcraft',
    icon: '⬡',
    description: 'Masterfully handwoven from organic sisal and natural sweetgrass. Represents peace and gratitude, ideal for modern home decor, jewelry storage, or ceremonial gift.',
    rating: 5.0,
    salesCount: 142,
    inStock: true,
    leadTime: 'Available in stock (express Kigali delivery)'
  },
  {
    id: 3,
    name: 'Single-Origin Bourbon Specialty Coffee (1kg)',
    seller: 'Inzora Mountain Reserve',
    sellerLocation: 'Rubavu / Kigali',
    price: 'RWF 16,500',
    priceNumber: 16500,
    category: 'Agriculture & Food',
    icon: '☕',
    description: 'High-altitude Arabica Bourbon roasted in Kigali. Flavor notes of wild blackberry, dark honey, and black tea. Fair-trade verified supporting 80+ smallholder farmers.',
    rating: 4.8,
    salesCount: 210,
    inStock: true,
    leadTime: 'Freshly roasted weekly'
  },
  {
    id: 4,
    name: 'Custom SME Landing Page & MoMo Integration',
    seller: 'Kigali Web Works',
    sellerLocation: 'Kigali, Rwanda',
    price: 'RWF 250,000',
    priceNumber: 250000,
    category: 'Digital service',
    icon: '⌘',
    description: 'Lightning-fast, mobile-friendly landing page configured with MTN Mobile Money & Airtel Money instant payment checkout, domain setup, and bilingual copy.',
    rating: 4.9,
    salesCount: 26,
    inStock: true,
    leadTime: '7 business days'
  },
  {
    id: 5,
    name: 'Handcrafted Imigongo Geometric Wall Art (60x40cm)',
    seller: 'Nyakarimbi Heritage Art',
    sellerLocation: 'Kirehe, Eastern Province',
    price: 'RWF 45,000',
    priceNumber: 45000,
    category: 'Handcraft',
    icon: '❖',
    description: 'Traditional Rwandan geometric relief art created with natural pigments (white kaolin, black ash, ochre). Framed in durable local cedar wood.',
    rating: 4.9,
    salesCount: 64,
    inStock: true,
    leadTime: '3 business days'
  },
  {
    id: 6,
    name: 'Bespoke Accounting & RRA Tax E-Filing Setup',
    seller: 'Kigali Ledger Advisory',
    sellerLocation: 'Kigali, Rwanda',
    price: 'RWF 120,000',
    priceNumber: 120000,
    category: 'Digital service',
    icon: '⚖',
    description: 'Setup and reconciliation for Rwanda Revenue Authority (RRA) compliance, quarterly returns guidance, VAT exemption check, and customized invoice spreadsheets.',
    rating: 4.7,
    salesCount: 51,
    inStock: true,
    leadTime: '3–4 business days'
  }
];

export const initialApplications: Application[] = [
  {
    id: 'app-01',
    jobId: 1,
    jobTitle: 'Senior Frontend Engineer (React/TypeScript)',
    company: 'Kigali Digital Labs',
    applicantName: 'Jean-Luc Mugisha',
    applicantEmail: 'jeanluc.mugisha@example.rw',
    applicantPhone: '+250 788 123 456',
    status: 'Interview',
    submittedAt: 'Yesterday at 14:20',
    note: 'Excited about building scalable public service portals with React 19 and Tailwind. Attached my portfolio featuring Rwanda payment widgets.',
    portfolioUrl: 'https://github.com/jeanluc-mugisha/rwanda-ui',
    cvFileName: 'JeanLuc_Mugisha_Frontend_CV.pdf'
  },
  {
    id: 'app-02',
    jobId: 2,
    jobTitle: 'Product & Brand Designer',
    company: 'Imanzi Studio',
    applicantName: 'Jean-Luc Mugisha',
    applicantEmail: 'jeanluc.mugisha@example.rw',
    applicantPhone: '+250 788 123 456',
    status: 'Under Review',
    submittedAt: '3 days ago',
    note: 'Passionate about contemporary East African typography and accessible micro-interactions.',
    portfolioUrl: 'https://imanzi-design-showcase.rw',
    cvFileName: 'JeanLuc_Design_Portfolio.pdf'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-0042',
    clientName: 'Norrsken Kigali Ecosystem Hub',
    clientEmail: 'billing@norrsken.org',
    issueDate: '2026-10-10',
    dueDate: '2026-10-25',
    items: [
      { id: '1', description: 'Frontend portal UI implementation sprint', quantity: 1, unitPrice: 320000, amount: 320000 },
      { id: '2', description: 'Mobile responsiveness and performance audit', quantity: 1, unitPrice: 100000, amount: 100000 }
    ],
    subtotal: 420000,
    taxRate: 0.18,
    taxAmount: 75600,
    total: 495600,
    status: 'Pending',
    momoPaymentCode: '*182*8*1*0788123456#',
    notes: 'Payment via MTN MoMo Merchant Code or Bank of Kigali transfer. Thank you for your partnership!'
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-0038',
    clientName: 'Kigali Artisan Guild',
    clientEmail: 'finance@kigaliartisan.rw',
    issueDate: '2026-09-28',
    dueDate: '2026-10-12',
    items: [
      { id: '1', description: 'E-commerce product photography & catalog upload', quantity: 1, unitPrice: 180000, amount: 180000 }
    ],
    subtotal: 180000,
    taxRate: 0,
    taxAmount: 0,
    total: 180000,
    status: 'Paid',
    momoPaymentCode: '*182*8*1*0788123456#',
    notes: 'Paid in full via MTN Mobile Money. Receipt archived.'
  }
];

export const initialCourses: Course[] = [
  {
    id: 1,
    title: 'Modern Web Engineering for African Scale',
    provider: 'Kigali Code Guild',
    category: 'Software Engineering',
    duration: '4 weeks · 16 lessons',
    lessonsCount: 16,
    completedLessons: 10,
    level: 'Intermediate',
    summary: 'Build high-performance web applications optimized for varying network conditions, mobile-first users, and offline resiliency.',
    badge: 'Certified Web Architect (Rwanda)',
    lessons: [
      { id: 1, title: 'Network resiliency & low-bandwidth optimization', duration: '25 min', completed: true },
      { id: 2, title: 'State management and offline synchronization', duration: '35 min', completed: true },
      { id: 3, title: 'Integrating MoMo (MTN & Airtel) payment gateways', duration: '40 min', completed: true },
      { id: 4, title: 'Building PWA support for Android devices in Rwanda', duration: '30 min', completed: false }
    ]
  },
  {
    id: 2,
    title: 'Digital Freelancing & Cross-Border Client Billing',
    provider: 'Kigali Innovation Hub',
    category: 'Business & Finance',
    duration: '2 weeks · 8 lessons',
    lessonsCount: 8,
    completedLessons: 8,
    level: 'Beginner',
    summary: 'Navigate remote contracts, compliant RRA invoice generation, currency hedging, and building a professional reputation across borders.',
    badge: 'Pro Freelancer Badge',
    lessons: [
      { id: 1, title: 'Contract structuring for international clients', duration: '20 min', completed: true },
      { id: 2, title: 'Managing RRA withholding taxes & invoice regulations', duration: '30 min', completed: true },
      { id: 3, title: 'Pricing your tech and creative services competitively', duration: '25 min', completed: true }
    ]
  },
  {
    id: 3,
    title: 'Made in Rwanda: Artisan Export & E-Commerce Readiness',
    provider: 'Made in Rwanda Secretariat',
    category: 'Trade & Commerce',
    duration: '3 weeks · 10 lessons',
    lessonsCount: 10,
    completedLessons: 4,
    level: 'Beginner',
    summary: 'Packaging, international standards, barcode generation, customs clearance, and storytelling for global boutique buyers.',
    badge: 'Export Verified Artisan',
    lessons: [
      { id: 1, title: 'Export quality benchmarks for handcrafted sisal & wood', duration: '30 min', completed: true },
      { id: 2, title: 'Product photography with natural lighting', duration: '25 min', completed: true },
      { id: 3, title: 'DHL & Postal shipping logistics from Kigali', duration: '35 min', completed: false }
    ]
  }
];

export const initialCommunities: CommunityGroup[] = [
  {
    id: 1,
    name: 'Kigali Tech Community',
    description: 'The premier network of developers, designers, product managers, and founders in Rwanda meeting monthly at Norrsken Kigali.',
    membersCount: 2840,
    location: 'Norrsken House Kigali / Hybrid',
    category: 'Tech & Startups',
    joined: true,
    upcomingEvent: {
      title: 'Full-Stack East Africa Meetup: React 19 & Cloud SQL',
      date: 'Next Thursday, 6:00 PM',
      venue: 'Town Hall, Norrsken House Kigali'
    }
  },
  {
    id: 2,
    name: 'Women in Digital Rwanda',
    description: 'A vibrant community advancing women in coding, UX design, product leadership, and tech entrepreneurship across Rwanda.',
    membersCount: 1420,
    location: 'Kigali Innovation City / Online',
    category: 'Diversity in Tech',
    joined: false,
    upcomingEvent: {
      title: 'Mentorship Circles & Portfolio Review Night',
      date: 'Saturday, 10:00 AM',
      venue: 'Klab Kigali, Telecom House'
    }
  },
  {
    id: 3,
    name: 'Made in Rwanda Artisan & Creators Circle',
    description: 'Collaborative collective of independent weavers, jewelers, fashion designers, and coffee purveyors building export linkages.',
    membersCount: 950,
    location: 'Kimihurura Artisan Quarter',
    category: 'Creative Industry',
    joined: true,
    upcomingEvent: {
      title: 'Collective Showcase & Holiday Pop-up Market',
      date: 'Nov 12, 9:00 AM',
      venue: 'Inzora Rooftop Garden, Kigali'
    }
  },
  {
    id: 4,
    name: 'Rwanda Agritech & Green Growth Network',
    description: 'Engineers, agronomy researchers, and IoT innovators applying solar technology and data science to East African agriculture.',
    membersCount: 680,
    location: 'Musanze Hub & Online',
    category: 'Agriculture',
    joined: false
  }
];

export const initialMessages: MessageThread[] = [
  {
    id: 'thread-1',
    contactName: 'Aline Mukamana',
    contactRole: 'Lead Recruiter',
    company: 'Kigali Digital Labs',
    avatar: 'AM',
    lastMessage: 'We reviewed your React experience! Could you do a 20-min technical call this Friday?',
    time: '14 min ago',
    unreadCount: 1,
    messages: [
      { id: 'm1', sender: 'other', senderName: 'Aline Mukamana', text: 'Hello Jean-Luc! Thank you for applying to the Senior Frontend role.', time: '10:15 AM' },
      { id: 'm2', sender: 'me', senderName: 'You', text: 'Hi Aline, thank you! I am really excited about what Kigali Digital Labs is building.', time: '10:22 AM' },
      { id: 'm3', sender: 'other', senderName: 'Aline Mukamana', text: 'We reviewed your React experience! Could you do a 20-min technical call this Friday?', time: '10:45 AM' }
    ]
  },
  {
    id: 'thread-2',
    contactName: 'Kevin Rutayisire',
    contactRole: 'Creative Director',
    company: 'Imanzi Studio',
    avatar: 'KR',
    lastMessage: 'Your branding portfolio is impressive. We sent over the design brief for review.',
    time: '2 hours ago',
    unreadCount: 0,
    messages: [
      { id: 'm1', sender: 'other', senderName: 'Kevin Rutayisire', text: 'Muraho! Checking in regarding the design system assignment.', time: 'Yesterday' },
      { id: 'm2', sender: 'me', senderName: 'You', text: 'Muraho Kevin! I have drafted the token hierarchy and typography scale.', time: 'Yesterday' },
      { id: 'm3', sender: 'other', senderName: 'Kevin Rutayisire', text: 'Your branding portfolio is impressive. We sent over the design brief for review.', time: '2 hours ago' }
    ]
  },
  {
    id: 'thread-3',
    contactName: 'Grace Uwase',
    contactRole: 'Artisan Coordinator',
    company: 'Umutima Crafts',
    avatar: 'GU',
    lastMessage: 'The custom order for 12 sisal baskets has been dispatched via Kigali express courier.',
    time: '1 day ago',
    unreadCount: 0,
    messages: [
      { id: 'm1', sender: 'other', senderName: 'Grace Uwase', text: 'The custom order for 12 sisal baskets has been dispatched via Kigali express courier.', time: '1 day ago' }
    ]
  }
];

export const initialActivities: UserActivity[] = [
  { id: 'act-1', iconType: 'briefcase', title: 'New role matched your profile', detail: 'Senior Frontend Engineer · Kigali Digital Labs (96% match)', time: '12 min ago' },
  { id: 'act-2', iconType: 'users', title: 'Connection request accepted', detail: 'Aline Mukamana connected with you', time: '1 hour ago' },
  { id: 'act-3', iconType: 'wallet', title: 'Payment received via MoMo', detail: 'RWF 180,000 from Kigali Artisan Guild', time: '3 hours ago' },
  { id: 'act-4', iconType: 'graduation', title: 'Lesson completed', durationDetail: '4/4 in MoMo API Integration', time: 'Yesterday' } as any,
  { id: 'act-5', iconType: 'shopping-bag', title: 'New inquiry on Marketplace', detail: 'Inzora Mountain Reserve requested wholesale quote', time: '2 days ago' }
];
