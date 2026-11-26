export type UserRole = 'Job seeker' | 'Employer' | 'Seller' | 'Administrator';

export type Section =
  | 'Home'
  | 'Overview'
  | 'Find opportunities'
  | 'Career & jobs'
  | 'Marketplace'
  | 'Learning'
  | 'Network'
  | 'Income OS'
  | 'Messages'
  | 'Backend API'
  | 'Settings'
  | 'Admin Center';

export interface Job {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Hybrid' | 'Remote' | 'Internship';
  salary: string;
  salaryMin: number;
  salaryMax: number;
  category: 'Technology' | 'Design' | 'Business' | 'Agriculture & Green Tech' | 'Operations';
  match: number;
  posted: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  perks: string[];
  applicantsCount: number;
  status: 'Open' | 'Urgent' | 'Closing Soon';
  tags: string[];
}

export interface Product {
  id: number;
  name: string;
  seller: string;
  sellerLocation: string;
  price: string;
  priceNumber: number;
  category: 'Design service' | 'Home & living' | 'Digital service' | 'Agriculture & Food' | 'Handcraft';
  icon: string;
  description: string;
  rating: number;
  salesCount: number;
  inStock: boolean;
  leadTime: string;
}

export interface Application {
  id: string;
  jobId: number;
  jobTitle: string;
  company: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  status: 'Submitted' | 'Under Review' | 'Reviewing' | 'Interview' | 'Offered' | 'Offer' | 'Archived' | 'Rejected';
  submittedAt: string;
  note: string;
  pitch?: string;
  experienceYears?: number;
  portfolioUrl?: string;
  cvFileName?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // e.g. 0.18 for 18% VAT or 0
  taxAmount: number;
  total: number;
  status: 'Paid' | 'Pending' | 'Draft' | 'Overdue';
  momoPaymentCode?: string;
  notes?: string;
}

export interface Course {
  id: number;
  title: string;
  provider: string;
  category: string;
  duration: string;
  lessonsCount: number;
  completedLessons: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  badge: string;
  lessons: { id: number; title: string; duration: string; completed: boolean }[];
}

export interface CommunityGroup {
  id: number;
  name: string;
  description: string;
  membersCount: number;
  location: string;
  category: string;
  joined: boolean;
  upcomingEvent?: { title: string; date: string; venue: string };
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  senderName: string;
  text: string;
  time: string;
}

export interface MessageThread {
  id: string;
  contactName: string;
  contactRole: string;
  company?: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface UserActivity {
  id: string;
  iconType: 'briefcase' | 'users' | 'graduation' | 'wallet' | 'shopping-bag';
  title: string;
  detail: string;
  time: string;
}
