export type Language = 'en' | 'rw';

export type UserRole = 'customer' | 'seller' | 'trader' | 'admin';

export type PortalView = 
  | 'human-os'
  | 'marketplace' 
  | 'buyer' 
  | 'seller' 
  | 'trader' 
  | 'jobs' 
  | 'admin' 
  | 'architecture';

export type AgriCategory = 
  | 'Vegetables'
  | 'Fruits'
  | 'Grains & Cereals'
  | 'Livestock'
  | 'Dairy Products'
  | 'Seeds & Inputs'
  | 'Processed Foods'
  | 'Tools & Equipment';

export interface AgriProduct {
  id: string;
  name: string;
  nameRw: string;
  category: AgriCategory;
  pricePerUnit: number;
  usdEquivalent?: number;
  marketTrendPct?: number;
  marketBenchmarkNote?: string;
  unit: 'kg' | 'liter' | 'sack (50kg)' | 'crate' | 'head' | 'piece' | 'tray';
  location: string;
  district: string;
  province: 'Kigali' | 'Northern' | 'Southern' | 'Eastern' | 'Western';
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerRating: number;
  sellerVerified: boolean;
  stockQuantity: number;
  image: string;
  description: string;
  descriptionRw: string;
  harvestDate?: string;
  isOrganic?: boolean;
  isBulkWholesale?: boolean;
}

export interface CartItem {
  product: AgriProduct;
  quantity: number;
}

export interface AgriOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryDistrict: string;
  deliveryAddress: string;
  paymentMethod: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    unit: string;
    subtotal: number;
  }[];
  totalAmount: number;
  usdEquivalent?: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  createdAt: string;
  sellerName: string;
}

export interface AgriJob {
  id: string;
  title: string;
  titleRw: string;
  farmOrCompany: string;
  location: string;
  district: string;
  employmentType: 'Full-time' | 'Part-time' | 'Seasonal' | 'Contract';
  salaryRwf: string;
  postedDate: string;
  description: string;
  descriptionRw: string;
  requirements: string[];
  applicantCount: number;
  category: 'Farm Production' | 'Agronomy' | 'Sales & Distribution' | 'Machinery & Tech' | 'Livestock Care';
}

export interface WholesaleRequest {
  id: string;
  traderName: string;
  companyName: string;
  cropRequired: string;
  quantityNeeded: string;
  targetPricePerKg: number;
  deliveryLocation: string;
  deadline: string;
  status: 'Open for Farmers' | 'Negotiating' | 'Supplied';
  responsesCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'seller' | 'trader';
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface ChatConversation {
  id: string;
  recipientName: string;
  recipientPhone: string;
  productContext?: string;
  messages: ChatMessage[];
  unread: boolean;
}
