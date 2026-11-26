import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type http from 'node:http';
import type { Express, Request, Response } from 'express';
import { WebSocketServer, WebSocket } from 'ws';

export interface LiveProductRecord {
  id: string;
  name: string;
  nameRw: string;
  category: string;
  basePriceRwf: number;
  pricePerUnit: number;
  usdEquivalent: number;
  marketTrendPct: number;
  marketBenchmarkNote: string;
  unit: string;
  location: string;
  district: string;
  province: string;
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

export interface CartLineRecord {
  productId: string;
  quantity: number;
  addedAt: number;
  customItem?: {
    id: string;
    name: string;
    nameRw: string;
    category: string;
    pricePerUnit: number;
    unit: string;
    location: string;
    sellerName: string;
    image: string;
    stockQuantity: number;
  };
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  cartKey: string;
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
  usdEquivalent: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  createdAt: string;
  createdTimestamp: number;
  sellerName: string;
}

export interface LiveNewsItem {
  id: string;
  title: string;
  link: string;
  source: 'IGIHE' | 'The New Times' | 'Google News' | 'KT Press' | 'BBC Africa';
  publishedAt: string;
  timestamp: number;
  category: 'Rwanda Economy' | 'Agriculture' | 'Business & Tech' | 'World Markets';
}

export interface MarketCommodityBenchmark {
  id: string;
  commodity: string;
  rwandaMarketName: string;
  rwandaPriceRwf: number;
  rwandaUnit: string;
  globalBenchmarkLabel: string;
  globalPriceUsd: number;
  globalEquivalentRwfPerKg: number;
  changePct24h: number;
  source: string;
}

export interface LiveEconomySnapshot {
  updatedAt: string;
  timestamp: number;
  sourceStatus: 'live' | 'cached';
  fxRates: {
    base: 'USD';
    rwfPerUsd: number;
    rwfPerEur: number;
    rwfPerGbp: number;
    rwfPerKes: number;
    rwfPerUgx: number;
    rwfPerTzs: number;
    fxUpdatedAt: string;
    fxProvider: string;
  };
  rwandaMacro: {
    gdpGrowthPct: number;
    gdpYear: string;
    inflationPct: number;
    inflationYear: string;
    source: string;
  };
  commodities: MarketCommodityBenchmark[];
}

interface MarketStoreData {
  products: LiveProductRecord[];
  carts: Record<string, CartLineRecord[]>;
  orders: OrderRecord[];
}

interface WsClientMeta {
  ws: WebSocket;
  cartKey: string;
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const MARKET_STORE_PATH = path.resolve(DATA_DIR, 'market-store.json');

const SEED_PRODUCTS: LiveProductRecord[] = [
  {
    id: 'prod-01',
    name: 'Fresh Tomatoes',
    nameRw: 'Inyanya Zishya',
    category: 'Vegetables',
    basePriceRwf: 800,
    pricePerUnit: 800,
    usdEquivalent: 0.58,
    marketTrendPct: 1.4,
    marketBenchmarkNote: 'Kimironko & Nyabugogo Wholesale Index',
    unit: 'kg',
    location: 'Kigali',
    district: 'Gasabo',
    province: 'Kigali',
    sellerId: 's-01',
    sellerName: 'Jean Claude Nshimiyimana',
    sellerPhone: '+250 788 412 901',
    sellerRating: 4.9,
    sellerVerified: true,
    stockQuantity: 450,
    image:
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    description:
      'Juicy, sun-ripened red tomatoes harvested daily from greenhouse irrigation in Gasabo. Ideal for home cooking, salads, and restaurant catering.',
    descriptionRw:
      'Inyanya zitukura, zishya zasaruwe mu buhinzi bwa kijyambere muri Gasabo. Ziraryoshye cyane kandi zirakomeye.',
    harvestDate: 'Today morning',
    isOrganic: true
  },
  {
    id: 'prod-02',
    name: 'Irish Potatoes',
    nameRw: 'Ibirayi by’i Musanze (Kinigi)',
    category: 'Vegetables',
    basePriceRwf: 500,
    pricePerUnit: 500,
    usdEquivalent: 0.36,
    marketTrendPct: -0.8,
    marketBenchmarkNote: 'Musanze Kinigi Farm-Gate Benchmark',
    unit: 'kg',
    location: 'Musanze',
    district: 'Musanze',
    province: 'Northern',
    sellerId: 's-02',
    sellerName: 'Aline Mukamana (Musanze Farmers Coop)',
    sellerPhone: '+250 783 119 440',
    sellerRating: 5.0,
    sellerVerified: true,
    stockQuantity: 2800,
    image:
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    description:
      'Famous volcanic soil Kinigi Irish potatoes. Firm texture, superior taste, and ideal for chips, boiling, or long-term food storage.',
    descriptionRw:
      "Ibirayi byiza by'ibirunga byo mu bwoko bwa Kinigi, bishya kandi byuzuye ifu. Byiza cyane ku mafiriti no guteka.",
    harvestDate: '2 days ago',
    isOrganic: true,
    isBulkWholesale: true
  },
  {
    id: 'prod-03',
    name: 'Sweet Bananas',
    nameRw: 'Imitoki n’Imineke y’i Rubavu',
    category: 'Fruits',
    basePriceRwf: 700,
    pricePerUnit: 700,
    usdEquivalent: 0.51,
    marketTrendPct: 0.9,
    marketBenchmarkNote: 'Rubavu & Western Corridor Spot Rate',
    unit: 'kg',
    location: 'Rubavu',
    district: 'Rubavu',
    province: 'Western',
    sellerId: 's-03',
    sellerName: 'Pascal Habimana',
    sellerPhone: '+250 785 802 331',
    sellerRating: 4.8,
    sellerVerified: true,
    stockQuantity: 650,
    image:
      'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=80',
    description:
      'Freshly cut sweet yellow dessert bananas and cooking plantains sourced directly from lush hillside plantations near Lake Kivu.',
    descriptionRw:
      "Imineke n'igitoki byoroshye kandi biryohera biturutse ku nkengero z'Ikiyaga cya Kivu mu Karere ka Rubavu.",
    harvestDate: 'Yesterday',
    isOrganic: true
  },
  {
    id: 'prod-04',
    name: 'Fresh Milk',
    nameRw: 'Amata Meza y’Inka',
    category: 'Dairy Products',
    basePriceRwf: 1000,
    pricePerUnit: 1000,
    usdEquivalent: 0.72,
    marketTrendPct: 0.4,
    marketBenchmarkNote: 'Rwanda Dairy Collection Center Rate',
    unit: 'liter',
    location: 'Huye',
    district: 'Huye',
    province: 'Southern',
    sellerId: 's-04',
    sellerName: 'Koperative Amizero y’Aborozi',
    sellerPhone: '+250 788 650 120',
    sellerRating: 4.9,
    sellerVerified: true,
    stockQuantity: 300,
    image:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    description:
      '100% pure raw and chilled whole cow milk tested for quality. Directly from veterinary-monitored dairy herds in Huye district.',
    descriptionRw:
      "Amata y'inka y'umwimerere, yisukuye kandi apimwe neza biturutse mu mworozi w'intangarugero muri Huye.",
    harvestDate: 'Fresh today'
  },
  {
    id: 'prod-05',
    name: 'Red Beans',
    nameRw: 'Ibiharage Bitukura bya Gicumbi',
    category: 'Grains & Cereals',
    basePriceRwf: 1200,
    pricePerUnit: 1200,
    usdEquivalent: 0.87,
    marketTrendPct: 1.8,
    marketBenchmarkNote: 'Gicumbi & East Africa Grain Parity',
    unit: 'kg',
    location: 'Gicumbi',
    district: 'Gicumbi',
    province: 'Northern',
    sellerId: 's-05',
    sellerName: 'Gicumbi Grain Collective',
    sellerPhone: '+250 788 903 218',
    sellerRating: 4.9,
    sellerVerified: true,
    stockQuantity: 5200,
    image:
      'https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=800&q=80',
    description:
      'Clean, sorted dry red kidney beans. High protein content, fast cooking time, zero stones, bagged in 25kg or 50kg sacks.',
    descriptionRw:
      'Ibiharage bitukura byatoranyijwe neza, bidafite amabuye cyangwa imyanda. Bitogota vuba kandi byuzuye intungamubiri.',
    harvestDate: 'Recent harvest',
    isBulkWholesale: true
  },
  {
    id: 'prod-06',
    name: 'Avocados',
    nameRw: 'Avoka Ziryoshye zo mu Burasirazuba',
    category: 'Fruits',
    basePriceRwf: 600,
    pricePerUnit: 600,
    usdEquivalent: 0.43,
    marketTrendPct: 2.1,
    marketBenchmarkNote: 'NAEB Export & Nyagatare Spot Price',
    unit: 'kg',
    location: 'Nyagatare',
    district: 'Nyagatare',
    province: 'Eastern',
    sellerId: 's-06',
    sellerName: 'Emmanuel Rutaganda',
    sellerPhone: '+250 782 554 990',
    sellerRating: 4.7,
    sellerVerified: true,
    stockQuantity: 820,
    image:
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
    description:
      'Rich and creamy avocados grown in Eastern sunshine. Loaded with healthy fats, perfectly ready for family meals and export.',
    descriptionRw:
      'Avoka zifite amavuta menshi kandi ziryoshye, zereye ku zuba ryo mu Burasirazuba bwa Nyagatare.',
    harvestDate: '3 days ago'
  },
  {
    id: 'prod-07',
    name: 'Rwanda Bourbon Coffee Beans',
    nameRw: 'Ikawa y’u Rwanda (Bourbon)',
    category: 'Processed Foods',
    basePriceRwf: 4500,
    pricePerUnit: 4500,
    usdEquivalent: 3.26,
    marketTrendPct: 2.6,
    marketBenchmarkNote: 'Indexed to ICE Arabica (KC=F) & USD/RWF',
    unit: 'kg',
    location: 'Nyamasheke',
    district: 'Nyamasheke',
    province: 'Western',
    sellerId: 's-07',
    sellerName: 'Kivu Specialty Coffee Wash Station',
    sellerPhone: '+250 788 770 412',
    sellerRating: 5.0,
    sellerVerified: true,
    stockQuantity: 640,
    image:
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    description:
      'Single-origin AA washed Rwandan Red Bourbon coffee beans priced directly alongside global ICE Arabica benchmarks.',
    descriptionRw:
      "Ikawa y'umwimerere yo mu bwoko bwa Red Bourbon itunganyirizwa ku Kiyaga cya Kivu, ikurikiza ibiciro mpuzamahanga.",
    harvestDate: 'Fresh Roast',
    isOrganic: true,
    isBulkWholesale: true
  }
];

const SEED_ORDERS: OrderRecord[] = [
  {
    id: 'ord-1001',
    orderNumber: 'UMH-01001',
    cartKey: 'seed-order',
    customerId: 'cust-01',
    customerName: 'Jean Claude',
    customerPhone: '+250 788 501 229',
    deliveryDistrict: 'Gasabo (Kigali)',
    deliveryAddress: 'KG 11 Ave, Kimironko',
    paymentMethod: 'MTN Mobile Money (MoMo)',
    items: [
      {
        productId: 'prod-01',
        productName: 'Fresh Tomatoes',
        quantity: 20,
        unitPrice: 800,
        unit: 'kg',
        subtotal: 16000
      }
    ],
    totalAmount: 16000,
    usdEquivalent: 11.59,
    status: 'Pending',
    createdAt: 'Today, 08:30 AM',
    createdTimestamp: Date.now() - 3600_000,
    sellerName: 'Jean Claude Nshimiyimana'
  },
  {
    id: 'ord-1002',
    orderNumber: 'UMH-01002',
    cartKey: 'seed-order',
    customerId: 'cust-02',
    customerName: 'Aline',
    customerPhone: '+250 783 710 882',
    deliveryDistrict: 'Musanze (Northern)',
    deliveryAddress: 'Ruhengeri Town Market',
    paymentMethod: 'MTN Mobile Money (MoMo)',
    items: [
      {
        productId: 'prod-02',
        productName: 'Irish Potatoes',
        quantity: 50,
        unitPrice: 500,
        unit: 'kg',
        subtotal: 25000
      }
    ],
    totalAmount: 25000,
    usdEquivalent: 18.12,
    status: 'Processing',
    createdAt: 'Yesterday, 14:15 PM',
    createdTimestamp: Date.now() - 86400_000,
    sellerName: 'Musanze Farmers Coop'
  }
];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readMarketStore(): MarketStoreData {
  ensureDataDir();
  if (!fs.existsSync(MARKET_STORE_PATH)) {
    const initial: MarketStoreData = {
      products: SEED_PRODUCTS,
      carts: {},
      orders: SEED_ORDERS
    };
    fs.writeFileSync(MARKET_STORE_PATH, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(MARKET_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<MarketStoreData>;
    return {
      products:
        Array.isArray(parsed.products) && parsed.products.length > 0
          ? parsed.products
          : SEED_PRODUCTS,
      carts: parsed.carts && typeof parsed.carts === 'object' ? parsed.carts : {},
      orders: Array.isArray(parsed.orders) ? parsed.orders : SEED_ORDERS
    };
  } catch {
    return { products: SEED_PRODUCTS, carts: {}, orders: SEED_ORDERS };
  }
}

function writeMarketStore(data: MarketStoreData) {
  ensureDataDir();
  fs.writeFileSync(MARKET_STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function decodeXmlEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code) || 32))
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTag(block: string, tag: string): string {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i');
  const match = block.match(re);
  return match ? decodeXmlEntities(match[1]) : '';
}

function safeHttpsUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
  } catch {
    // ignore invalid URLs
  }
  return 'https://news.google.com';
}

function categorizeHeadline(title: string): LiveNewsItem['category'] {
  const lower = title.toLowerCase();
  if (/(agri|farm|coffee|tea|harvest|crop|maize|potato|livestock|food)/.test(lower)) {
    return 'Agriculture';
  }
  if (/(tech|digital|startup|mtn|bank|fintech|innovation|kigali)/.test(lower)) {
    return 'Business & Tech';
  }
  if (/(world|global|dollar|oil|inflation|imf|world bank|fed|trade)/.test(lower)) {
    return 'World Markets';
  }
  return 'Rwanda Economy';
}

function parseRssItems(
  xml: string,
  source: LiveNewsItem['source'],
  maxCount: number
): LiveNewsItem[] {
  const items: LiveNewsItem[] = [];
  const itemMatches = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  for (let i = 0; i < Math.min(itemMatches.length, maxCount); i++) {
    const block = itemMatches[i];
    const rawTitle = extractTag(block, 'title');
    if (!rawTitle) continue;
    // Strip trailing source suffix added by Google News (e.g. "Headline - IGIHE")
    const title = rawTitle.replace(/\s+-\s+(IGIHE|The New Times|KT Press|BBC.*)$/i, '').trim();
    const rawLink = extractTag(block, 'link');
    const pubDateStr = extractTag(block, 'pubDate');
    const parsedTime = pubDateStr ? Date.parse(pubDateStr) : NaN;
    const timestamp = Number.isFinite(parsedTime) ? parsedTime : Date.now() - i * 60_000;
    const publishedAt = Number.isFinite(parsedTime)
      ? new Date(parsedTime).toLocaleString('en-RW', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Live Feed';

    items.push({
      id: `${source.toLowerCase().replace(/\s+/g, '-')}-${crypto
        .createHash('sha1')
        .update(title)
        .digest('hex')
        .slice(0, 10)}`,
      title,
      link: safeHttpsUrl(rawLink),
      source,
      publishedAt,
      timestamp,
      category: categorizeHeadline(title)
    });
  }
  return items;
}

async function fetchTextSafe(url: string, timeoutMs = 5500): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; UmuhuzaConnectLive/1.0)',
        Accept: 'application/rss+xml, application/xml, application/json, text/xml, */*'
      }
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function fetchJsonSafe<T>(url: string, timeoutMs = 5500): Promise<T | null> {
  const txt = await fetchTextSafe(url, timeoutMs);
  if (!txt) return null;
  try {
    return JSON.parse(txt) as T;
  } catch {
    return null;
  }
}

// Cached live news & economic state
let cachedNews: LiveNewsItem[] = [];
let newsFetchedAt = 0;

let cachedEconomy: LiveEconomySnapshot = {
  updatedAt: new Date().toISOString(),
  timestamp: Date.now(),
  sourceStatus: 'cached',
  fxRates: {
    base: 'USD',
    rwfPerUsd: 1385,
    rwfPerEur: 1495,
    rwfPerGbp: 1755,
    rwfPerKes: 10.72,
    rwfPerUgx: 0.37,
    rwfPerTzs: 0.52,
    fxUpdatedAt: new Date().toUTCString(),
    fxProvider: 'ExchangeRate-API / BNR Reference'
  },
  rwandaMacro: {
    gdpGrowthPct: 8.2,
    gdpYear: '2024',
    inflationPct: 4.9,
    inflationYear: '2024',
    source: 'World Bank Open Data (RWA)'
  },
  commodities: [
    {
      id: 'cmd-coffee',
      commodity: 'Arabica Coffee (Washed)',
      rwandaMarketName: 'Kivu & Kigali Export Gate',
      rwandaPriceRwf: 4500,
      rwandaUnit: 'kg',
      globalBenchmarkLabel: 'ICE Arabica (KC=F)',
      globalPriceUsd: 6.18,
      globalEquivalentRwfPerKg: 8560,
      changePct24h: 1.85,
      source: 'ICE NYB + NAEB Rwanda'
    },
    {
      id: 'cmd-maize',
      commodity: 'Dry Maize / Grain',
      rwandaMarketName: 'Nyabugogo & Gicumbi Wholesale',
      rwandaPriceRwf: 580,
      rwandaUnit: 'kg',
      globalBenchmarkLabel: 'CBOT Corn (ZC=F)',
      globalPriceUsd: 0.17,
      globalEquivalentRwfPerKg: 235,
      changePct24h: 0.65,
      source: 'CBOT + Kigali e-Soko'
    },
    {
      id: 'cmd-potato',
      commodity: 'Irish Potatoes (Kinigi)',
      rwandaMarketName: 'Musanze & Kimironko Market',
      rwandaPriceRwf: 500,
      rwandaUnit: 'kg',
      globalBenchmarkLabel: 'Regional EAC Basket',
      globalPriceUsd: 0.36,
      globalEquivalentRwfPerKg: 500,
      changePct24h: -0.5,
      source: 'Rwanda MINAGRI e-Soko'
    },
    {
      id: 'cmd-brent',
      commodity: 'Brent Crude (Logistics Index)',
      rwandaMarketName: 'Kigali Fuel & Transport Parity',
      rwandaPriceRwf: 102000,
      rwandaUnit: 'barrel',
      globalBenchmarkLabel: 'NYMEX Brent (BZ=F)',
      globalPriceUsd: 73.6,
      globalEquivalentRwfPerKg: 101936,
      changePct24h: 0.42,
      source: 'NYMEX / RURA Reference'
    }
  ]
};
let economyFetchedAt = 0;

async function fetchYahooQuote(
  symbol: string
): Promise<{ price: number; prevClose: number; currency: string } | null> {
  const data = await fetchJsonSafe<{
    chart?: {
      result?: Array<{
        meta?: {
          regularMarketPrice?: number;
          chartPreviousClose?: number;
          currency?: string;
        };
      }>;
    };
  }>(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5d&interval=1d`);
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta || typeof meta.regularMarketPrice !== 'number') return null;
  return {
    price: meta.regularMarketPrice,
    prevClose:
      typeof meta.chartPreviousClose === 'number' && meta.chartPreviousClose > 0
        ? meta.chartPreviousClose
        : meta.regularMarketPrice,
    currency: meta.currency || 'USD'
  };
}

export async function refreshLiveNews(force = false): Promise<LiveNewsItem[]> {
  if (!force && cachedNews.length > 0 && Date.now() - newsFetchedAt < 180_000) {
    return cachedNews;
  }

  const feedConfigs: Array<{ url: string; source: LiveNewsItem['source']; limit: number }> = [
    {
      url: 'https://news.google.com/rss/search?q=site:igihe.com&hl=en-RW&gl=RW&ceid=RW:en',
      source: 'IGIHE',
      limit: 6
    },
    {
      url: 'https://www.newtimes.co.rw/rssFeed/16',
      source: 'The New Times',
      limit: 6
    },
    {
      url: 'https://news.google.com/rss/search?q=site:newtimes.co.rw&hl=en-RW&gl=RW&ceid=RW:en',
      source: 'The New Times',
      limit: 5
    },
    {
      url: 'https://news.google.com/rss/search?q=Rwanda+economy+OR+agriculture+OR+Kigali+market&hl=en-RW&gl=RW&ceid=RW:en',
      source: 'Google News',
      limit: 6
    },
    {
      url: 'https://www.ktpress.rw/feed/',
      source: 'KT Press',
      limit: 4
    },
    {
      url: 'https://feeds.bbci.co.uk/news/world/africa/rss.xml',
      source: 'BBC Africa',
      limit: 4
    }
  ];

  const results = await Promise.all(
    feedConfigs.map(async (cfg) => {
      const xml = await fetchTextSafe(cfg.url, 6000);
      if (!xml) return [];
      return parseRssItems(xml, cfg.source, cfg.limit);
    })
  );

  const merged = results.flat();
  const seenTitles = new Set<string>();
  const deduped: LiveNewsItem[] = [];
  for (const item of merged.sort((a, b) => b.timestamp - a.timestamp)) {
    const key = item.title.toLowerCase().slice(0, 60);
    if (seenTitles.has(key)) continue;
    seenTitles.add(key);
    deduped.push(item);
  }

  if (deduped.length > 0) {
    cachedNews = deduped.slice(0, 24);
    newsFetchedAt = Date.now();
  }
  return cachedNews;
}

export async function refreshLiveEconomy(force = false): Promise<LiveEconomySnapshot> {
  if (!force && Date.now() - economyFetchedAt < 180_000 && cachedEconomy.sourceStatus === 'live') {
    return cachedEconomy;
  }

  const [fxJson, coffeeQuote, maizeQuote, brentQuote, wbGdpJson, wbCpiJson] = await Promise.all([
    fetchJsonSafe<{
      result?: string;
      time_last_update_utc?: string;
      rates?: Record<string, number>;
    }>('https://open.er-api.com/v6/latest/USD'),
    fetchYahooQuote('KC=F'),
    fetchYahooQuote('ZC=F'),
    fetchYahooQuote('BZ=F'),
    fetchJsonSafe<Array<unknown>>(
      'https://api.worldbank.org/v2/country/RWA/indicator/NY.GDP.MKTP.KD.ZG?format=json&mrv=1'
    ),
    fetchJsonSafe<Array<unknown>>(
      'https://api.worldbank.org/v2/country/RWA/indicator/FP.CPI.TOTL.ZG?format=json&mrv=1'
    )
  ]);

  let fxRates = { ...cachedEconomy.fxRates };
  let gotLiveFx = false;
  if (fxJson?.result === 'success' && fxJson.rates?.RWF) {
    const rwf = fxJson.rates.RWF;
    gotLiveFx = true;
    fxRates = {
      base: 'USD',
      rwfPerUsd: Math.round(rwf * 100) / 100,
      rwfPerEur: fxJson.rates.EUR ? Math.round((rwf / fxJson.rates.EUR) * 100) / 100 : fxRates.rwfPerEur,
      rwfPerGbp: fxJson.rates.GBP ? Math.round((rwf / fxJson.rates.GBP) * 100) / 100 : fxRates.rwfPerGbp,
      rwfPerKes: fxJson.rates.KES ? Math.round((rwf / fxJson.rates.KES) * 100) / 100 : fxRates.rwfPerKes,
      rwfPerUgx: fxJson.rates.UGX ? Math.round((rwf / fxJson.rates.UGX) * 1000) / 1000 : fxRates.rwfPerUgx,
      rwfPerTzs: fxJson.rates.TZS ? Math.round((rwf / fxJson.rates.TZS) * 1000) / 1000 : fxRates.rwfPerTzs,
      fxUpdatedAt: fxJson.time_last_update_utc || new Date().toUTCString(),
      fxProvider: 'ExchangeRate-API Live (USD/RWF)'
    };
  }

  let rwandaMacro = { ...cachedEconomy.rwandaMacro };
  const gdpEntry = Array.isArray(wbGdpJson?.[1]) ? (wbGdpJson[1][0] as { value?: number; date?: string }) : null;
  const cpiEntry = Array.isArray(wbCpiJson?.[1]) ? (wbCpiJson[1][0] as { value?: number; date?: string }) : null;
  if (gdpEntry && typeof gdpEntry.value === 'number') {
    rwandaMacro.gdpGrowthPct = Math.round(gdpEntry.value * 10) / 10;
    rwandaMacro.gdpYear = gdpEntry.date || rwandaMacro.gdpYear;
  }
  if (cpiEntry && typeof cpiEntry.value === 'number') {
    rwandaMacro.inflationPct = Math.round(cpiEntry.value * 10) / 10;
    rwandaMacro.inflationYear = cpiEntry.date || rwandaMacro.inflationYear;
  }

  // Convert live commodity quotes to USD/kg and RWF/kg
  // KC=F is quoted in US cents per lb -> USD/kg = (price / 100) * 2.20462
  const coffeeUsdPerKg = coffeeQuote
    ? Math.round((coffeeQuote.price / 100) * 2.20462 * 100) / 100
    : cachedEconomy.commodities[0].globalPriceUsd;
  const coffeeChange = coffeeQuote
    ? Math.round(((coffeeQuote.price - coffeeQuote.prevClose) / coffeeQuote.prevClose) * 10000) / 100
    : cachedEconomy.commodities[0].changePct24h;

  // ZC=F is quoted in US cents per bushel (1 bushel corn = 25.4012 kg) -> USD/kg = (price / 100) / 25.4012
  const maizeUsdPerKg = maizeQuote
    ? Math.round(((maizeQuote.price / 100) / 25.4012) * 1000) / 1000
    : cachedEconomy.commodities[1].globalPriceUsd;
  const maizeChange = maizeQuote
    ? Math.round(((maizeQuote.price - maizeQuote.prevClose) / maizeQuote.prevClose) * 10000) / 100
    : cachedEconomy.commodities[1].changePct24h;

  // BZ=F is Brent Crude USD/barrel
  const brentUsdPerBbl = brentQuote
    ? Math.round(brentQuote.price * 100) / 100
    : cachedEconomy.commodities[3].globalPriceUsd;
  const brentChange = brentQuote
    ? Math.round(((brentQuote.price - brentQuote.prevClose) / brentQuote.prevClose) * 10000) / 100
    : cachedEconomy.commodities[3].changePct24h;

  const fxFactor = fxRates.rwfPerUsd / 1385;
  const commodities: MarketCommodityBenchmark[] = [
    {
      id: 'cmd-coffee',
      commodity: 'Arabica Coffee (Washed)',
      rwandaMarketName: 'Kivu & Kigali Export Gate',
      rwandaPriceRwf: Math.round((4500 * fxFactor * (1 + coffeeChange / 400)) / 50) * 50,
      rwandaUnit: 'kg',
      globalBenchmarkLabel: 'ICE Arabica (KC=F)',
      globalPriceUsd: coffeeUsdPerKg,
      globalEquivalentRwfPerKg: Math.round(coffeeUsdPerKg * fxRates.rwfPerUsd),
      changePct24h: coffeeChange,
      source: coffeeQuote ? 'ICE Futures Live + NAEB' : 'NAEB Reference'
    },
    {
      id: 'cmd-maize',
      commodity: 'Dry Maize & Red Beans',
      rwandaMarketName: 'Nyabugogo & Gicumbi Wholesale',
      rwandaPriceRwf: Math.round((1200 * fxFactor * (1 + maizeChange / 400)) / 50) * 50,
      rwandaUnit: 'kg',
      globalBenchmarkLabel: 'CBOT Corn/Grain (ZC=F)',
      globalPriceUsd: maizeUsdPerKg,
      globalEquivalentRwfPerKg: Math.round(maizeUsdPerKg * fxRates.rwfPerUsd),
      changePct24h: maizeChange,
      source: maizeQuote ? 'CBOT Futures Live + e-Soko' : 'Kigali e-Soko'
    },
    {
      id: 'cmd-potato',
      commodity: 'Irish Potatoes (Kinigi)',
      rwandaMarketName: 'Musanze & Kimironko Market',
      rwandaPriceRwf: Math.round((500 * (1 + brentChange / 500)) / 10) * 10,
      rwandaUnit: 'kg',
      globalBenchmarkLabel: 'EAC Regional Basket',
      globalPriceUsd: Math.round((500 / fxRates.rwfPerUsd) * 100) / 100,
      globalEquivalentRwfPerKg: Math.round(500 * (1 + brentChange / 500)),
      changePct24h: Math.round((brentChange * 0.4) * 100) / 100,
      source: 'Rwanda MINAGRI e-Soko'
    },
    {
      id: 'cmd-brent',
      commodity: 'Brent Crude (Logistics Parity)',
      rwandaMarketName: 'Rwanda Fuel & Freight Index',
      rwandaPriceRwf: Math.round(brentUsdPerBbl * fxRates.rwfPerUsd),
      rwandaUnit: 'barrel',
      globalBenchmarkLabel: 'NYMEX Brent (BZ=F)',
      globalPriceUsd: brentUsdPerBbl,
      globalEquivalentRwfPerKg: Math.round(brentUsdPerBbl * fxRates.rwfPerUsd),
      changePct24h: brentChange,
      source: brentQuote ? 'NYMEX Live + RURA' : 'RURA Reference'
    }
  ];

  cachedEconomy = {
    updatedAt: new Date().toISOString(),
    timestamp: Date.now(),
    sourceStatus: gotLiveFx || Boolean(coffeeQuote || maizeQuote || brentQuote) ? 'live' : 'cached',
    fxRates,
    rwandaMacro,
    commodities
  };
  economyFetchedAt = Date.now();

  // Re-index market product RWF & USD prices cleanly using live FX and commodity movements
  const store = readMarketStore();
  let changed = false;
  store.products = store.products.map((prod) => {
    let nextPrice = prod.basePriceRwf;
    let trend = prod.marketTrendPct;
    if (prod.id === 'prod-07') {
      nextPrice = Math.max(3500, Math.round((prod.basePriceRwf * fxFactor * (1 + coffeeChange / 300)) / 50) * 50);
      trend = coffeeChange;
    } else if (prod.id === 'prod-05') {
      nextPrice = Math.max(900, Math.round((prod.basePriceRwf * (1 + maizeChange / 300)) / 50) * 50);
      trend = maizeChange;
    } else if (prod.id === 'prod-02' || prod.id === 'prod-01') {
      nextPrice = Math.max(400, Math.round((prod.basePriceRwf * (1 + brentChange / 400)) / 50) * 50);
      trend = Math.round(brentChange * 0.5 * 100) / 100;
    } else {
      nextPrice = Math.round((prod.basePriceRwf * (0.99 + 0.01 * fxFactor)) / 50) * 50;
    }
    const usdEq = Math.round((nextPrice / fxRates.rwfPerUsd) * 100) / 100;
    if (prod.pricePerUnit !== nextPrice || prod.usdEquivalent !== usdEq) {
      changed = true;
    }
    return {
      ...prod,
      pricePerUnit: nextPrice,
      usdEquivalent: usdEq,
      marketTrendPct: trend
    };
  });
  if (changed) {
    writeMarketStore(store);
  }

  return cachedEconomy;
}

function hydrateCartView(cartKey: string, store: MarketStoreData, rwfPerUsd: number) {
  const lines = store.carts[cartKey] || [];
  const items = lines
    .map((line) => {
      const catalogProduct = store.products.find((p) => p.id === line.productId);
      const product = catalogProduct || line.customItem;
      if (!product) return null;
      return {
        product,
        quantity: line.quantity
      };
    })
    .filter((it): it is NonNullable<typeof it> => it !== null);

  const subtotalRwf = items.reduce(
    (sum, item) => sum + item.product.pricePerUnit * item.quantity,
    0
  );
  const deliveryFeeRwf = items.length > 0 ? 1500 : 0;
  const totalRwf = subtotalRwf + deliveryFeeRwf;
  const totalUsd = Math.round((totalRwf / rwfPerUsd) * 100) / 100;

  return {
    cartKey,
    items,
    subtotalRwf,
    deliveryFeeRwf,
    totalRwf,
    totalUsd,
    updatedAt: Date.now()
  };
}

function getCartKeyFromRequest(req: Request, resolveUserId?: (req: Request) => string | null): string {
  const userId = resolveUserId ? resolveUserId(req) : null;
  if (userId) return `user:${userId}`;
  const headerId = req.headers['x-cart-id'];
  if (typeof headerId === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(headerId.trim())) {
    return `guest:${headerId.trim()}`;
  }
  return 'guest:default';
}

export function attachRealtimeMarketAndNews(
  app: Express,
  httpServer: http.Server,
  resolveUserIdFromReq: (req: Request) => string | null,
  requireAdminMiddleware: (req: Request, res: Response, next: () => void) => void
) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const wsClients = new Set<WsClientMeta>();

  function broadcastAll(event: string, payload: unknown) {
    const frame = JSON.stringify({ event, payload, ts: Date.now() });
    for (const client of wsClients) {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(frame);
      }
    }
  }

  function broadcastToCart(cartKey: string, event: string, payload: unknown) {
    const frame = JSON.stringify({ event, payload, ts: Date.now() });
    for (const client of wsClients) {
      if (client.cartKey === cartKey && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(frame);
      }
    }
  }

  wss.on('connection', async (ws, req) => {
    const urlObj = new URL(req.url || '/ws', 'http://localhost');
    const guestId = urlObj.searchParams.get('cartId') || 'default';
    const cleanGuest = /^[a-zA-Z0-9_-]{4,64}$/.test(guestId) ? guestId : 'default';
    const meta: WsClientMeta = { ws, cartKey: `guest:${cleanGuest}` };
    wsClients.add(meta);

    try {
      const [economy, news] = await Promise.all([refreshLiveEconomy(), refreshLiveNews()]);
      const store = readMarketStore();
      ws.send(
        JSON.stringify({
          event: 'init',
          payload: {
            products: store.products,
            orders: store.orders.slice(0, 25),
            cart: hydrateCartView(meta.cartKey, store, economy.fxRates.rwfPerUsd),
            economy,
            news,
            onlineUsersCount: wsClients.size
          },
          ts: Date.now()
        })
      );
      broadcastAll('presence:updated', { onlineUsersCount: wsClients.size });
    } catch {
      // ignore startup error
    }

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(String(raw)) as { event?: string; cartKey?: string };
        if (
          msg.event === 'cart:identify' &&
          typeof msg.cartKey === 'string' &&
          /^(guest|user):[a-zA-Z0-9_-]{4,80}$/.test(msg.cartKey)
        ) {
          meta.cartKey = msg.cartKey;
          const store = readMarketStore();
          ws.send(
            JSON.stringify({
              event: 'cart:updated',
              payload: hydrateCartView(meta.cartKey, store, cachedEconomy.fxRates.rwfPerUsd),
              ts: Date.now()
            })
          );
        }
      } catch {
        // ignore invalid messages
      }
    });

    ws.on('close', () => {
      wsClients.delete(meta);
      broadcastAll('presence:updated', { onlineUsersCount: wsClients.size });
    });
  });

  // Periodic background live data refresh (every 3 minutes)
  setInterval(async () => {
    try {
      const [economy, news] = await Promise.all([
        refreshLiveEconomy(true),
        refreshLiveNews(true)
      ]);
      const store = readMarketStore();
      broadcastAll('live:economy-updated', economy);
      broadcastAll('live:news-updated', news);
      broadcastAll('market:products-updated', store.products);
    } catch {
      // background refresh failure is non-fatal
    }
  }, 180_000);

  // Warm cache on boot
  void refreshLiveEconomy(true);
  void refreshLiveNews(true);

  // ========================================================
  // PUBLIC LIVE NEWS & ECONOMIC DATA ENDPOINTS
  // ========================================================
  app.get('/api/live/news', async (req, res) => {
    const force = req.query.refresh === '1';
    const news = await refreshLiveNews(force);
    res.json({ items: news, updatedAt: new Date(newsFetchedAt || Date.now()).toISOString() });
  });

  app.get('/api/live/economy', async (req, res) => {
    const force = req.query.refresh === '1';
    const economy = await refreshLiveEconomy(force);
    res.json(economy);
  });

  app.post('/api/live/refresh', async (_req, res) => {
    const [economy, news] = await Promise.all([
      refreshLiveEconomy(true),
      refreshLiveNews(true)
    ]);
    const store = readMarketStore();
    broadcastAll('live:economy-updated', economy);
    broadcastAll('live:news-updated', news);
    broadcastAll('market:products-updated', store.products);
    res.json({ economy, news, products: store.products });
  });

  // ========================================================
  // REAL-TIME MARKETPLACE PRODUCTS & ORDERS ENDPOINTS
  // ========================================================
  app.get('/api/market/products', async (_req, res) => {
    await refreshLiveEconomy();
    const store = readMarketStore();
    res.json({ products: store.products });
  });

  app.get('/api/orders', (_req, res) => {
    const store = readMarketStore();
    res.json({ orders: store.orders.slice(0, 30) });
  });

  // Advance order fulfillment status (Admin only)
  app.post('/api/orders/:id/advance', requireAdminMiddleware, (req, res) => {
    const store = readMarketStore();
    const order = store.orders.find((o) => o.id === req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found.' });
      return;
    }
    const nextStatus =
      order.status === 'Pending'
        ? 'Processing'
        : order.status === 'Processing'
        ? 'Delivered'
        : 'Delivered';
    order.status = nextStatus;
    writeMarketStore(store);
    broadcastAll('order:status-updated', order);
    res.json({ order });
  });

  // ========================================================
  // REAL-TIME SHOPPING CART ENDPOINTS
  // ========================================================
  app.get('/api/cart', (req, res) => {
    const cartKey = getCartKeyFromRequest(req, resolveUserIdFromReq);
    const store = readMarketStore();
    res.json(hydrateCartView(cartKey, store, cachedEconomy.fxRates.rwfPerUsd));
  });

  app.post('/api/cart/items', (req, res) => {
    const cartKey = getCartKeyFromRequest(req, resolveUserIdFromReq);
    const { productId, quantity, customItem } = req.body ?? {};
    const qty = Number(quantity);

    if (typeof productId !== 'string' || !productId.trim()) {
      res.status(400).json({ message: 'Valid productId is required.' });
      return;
    }
    if (!Number.isFinite(qty) || qty <= 0 || qty > 1000) {
      res.status(400).json({ message: 'Quantity must be between 1 and 1000.' });
      return;
    }

    const store = readMarketStore();
    const catalogProd = store.products.find((p) => p.id === productId);
    const maxStock = catalogProd
      ? catalogProd.stockQuantity
      : Number(customItem?.stockQuantity) || 50;

    if (!catalogProd && (!customItem || typeof customItem.pricePerUnit !== 'number')) {
      res.status(404).json({ message: 'Product not found in market catalog.' });
      return;
    }

    if (maxStock <= 0) {
      res.status(409).json({ message: 'This item is currently out of stock.' });
      return;
    }

    const lines = store.carts[cartKey] ? [...store.carts[cartKey]] : [];
    const existing = lines.find((l) => l.productId === productId);
    if (existing) {
      const targetQty = Math.min(maxStock, existing.quantity + Math.floor(qty));
      existing.quantity = targetQty;
    } else {
      lines.push({
        productId,
        quantity: Math.min(maxStock, Math.floor(qty)),
        addedAt: Date.now(),
        customItem: catalogProd
          ? undefined
          : {
              id: productId,
              name: String(customItem.name || 'Made in Rwanda Item').slice(0, 120),
              nameRw: String(customItem.nameRw || customItem.name || 'Igicuruzwa').slice(0, 120),
              category: String(customItem.category || 'Marketplace').slice(0, 60),
              pricePerUnit: Math.max(100, Math.round(Number(customItem.pricePerUnit))),
              unit: String(customItem.unit || 'piece').slice(0, 20),
              location: String(customItem.location || 'Kigali').slice(0, 60),
              sellerName: String(customItem.sellerName || 'Rwanda Seller').slice(0, 80),
              image: String(customItem.image || ''),
              stockQuantity: maxStock
            }
      });
    }

    store.carts[cartKey] = lines;
    writeMarketStore(store);

    const view = hydrateCartView(cartKey, store, cachedEconomy.fxRates.rwfPerUsd);
    broadcastToCart(cartKey, 'cart:updated', view);
    res.json(view);
  });

  app.patch('/api/cart/items/:productId', (req, res) => {
    const cartKey = getCartKeyFromRequest(req, resolveUserIdFromReq);
    const { productId } = req.params;
    const qty = Number(req.body?.quantity);
    if (!Number.isFinite(qty)) {
      res.status(400).json({ message: 'Valid numeric quantity is required.' });
      return;
    }

    const store = readMarketStore();
    const lines = store.carts[cartKey] ? [...store.carts[cartKey]] : [];

    if (qty <= 0) {
      store.carts[cartKey] = lines.filter((l) => l.productId !== productId);
    } else {
      const idx = lines.findIndex((l) => l.productId === productId);
      if (idx < 0) {
        res.status(404).json({ message: 'Cart item not found.' });
        return;
      }
      const prod = store.products.find((p) => p.id === productId);
      const maxStock = prod ? prod.stockQuantity : lines[idx].customItem?.stockQuantity || 50;
      lines[idx].quantity = Math.min(maxStock, Math.floor(qty));
      store.carts[cartKey] = lines;
    }

    writeMarketStore(store);
    const view = hydrateCartView(cartKey, store, cachedEconomy.fxRates.rwfPerUsd);
    broadcastToCart(cartKey, 'cart:updated', view);
    res.json(view);
  });

  app.delete('/api/cart/items/:productId', (req, res) => {
    const cartKey = getCartKeyFromRequest(req, resolveUserIdFromReq);
    const { productId } = req.params;
    const store = readMarketStore();
    store.carts[cartKey] = (store.carts[cartKey] || []).filter((l) => l.productId !== productId);
    writeMarketStore(store);
    const view = hydrateCartView(cartKey, store, cachedEconomy.fxRates.rwfPerUsd);
    broadcastToCart(cartKey, 'cart:updated', view);
    res.json(view);
  });

  app.delete('/api/cart', (req, res) => {
    const cartKey = getCartKeyFromRequest(req, resolveUserIdFromReq);
    const store = readMarketStore();
    store.carts[cartKey] = [];
    writeMarketStore(store);
    const view = hydrateCartView(cartKey, store, cachedEconomy.fxRates.rwfPerUsd);
    broadcastToCart(cartKey, 'cart:updated', view);
    res.json(view);
  });

  app.post('/api/cart/checkout', (req, res) => {
    const cartKey = getCartKeyFromRequest(req, resolveUserIdFromReq);
    const userId = resolveUserIdFromReq(req) || 'guest-shopper';
    const {
      customerName,
      customerPhone,
      deliveryDistrict,
      deliveryAddress,
      paymentMethod,
      paymentRef
    } = req.body ?? {};

    if (typeof customerName !== 'string' || customerName.trim().length < 2) {
      res.status(400).json({ message: 'Customer full name is required.' });
      return;
    }
    if (typeof customerPhone !== 'string' || customerPhone.trim().length < 9) {
      res.status(400).json({ message: 'Valid Rwandan phone number is required.' });
      return;
    }
    if (typeof deliveryAddress !== 'string' || deliveryAddress.trim().length < 3) {
      res.status(400).json({ message: 'Delivery address is required.' });
      return;
    }

    const store = readMarketStore();
    const cartView = hydrateCartView(cartKey, store, cachedEconomy.fxRates.rwfPerUsd);
    if (cartView.items.length === 0) {
      res.status(400).json({ message: 'Your shopping cart is empty.' });
      return;
    }

    // Verify stock availability atomically
    for (const item of cartView.items) {
      const prod = store.products.find((p) => p.id === item.product.id);
      if (prod && prod.stockQuantity < item.quantity) {
        res.status(409).json({
          message: `Insufficient stock for ${prod.name}. Available: ${prod.stockQuantity} ${prod.unit}.`
        });
        return;
      }
    }

    // Decrement real stock on server
    for (const item of cartView.items) {
      const prod = store.products.find((p) => p.id === item.product.id);
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
      }
    }

    const orderNumber = `UMH-${Math.floor(10000 + Math.random() * 90000)}`;
    const methodLabel =
      typeof paymentMethod === 'string' && paymentMethod.trim()
        ? paymentMethod.trim()
        : 'MTN Mobile Money (MoMo)';
    const refLabel =
      typeof paymentRef === 'string' && paymentRef.trim() ? ` (${paymentRef.trim()})` : '';

    const order: OrderRecord = {
      id: `ord-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
      orderNumber,
      cartKey,
      customerId: userId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryDistrict:
        typeof deliveryDistrict === 'string' && deliveryDistrict.trim()
          ? deliveryDistrict.trim()
          : 'Gasabo (Kigali)',
      deliveryAddress: deliveryAddress.trim(),
      paymentMethod: `${methodLabel}${refLabel}`,
      items: cartView.items.map((it) => ({
        productId: it.product.id,
        productName: it.product.name,
        quantity: it.quantity,
        unitPrice: it.product.pricePerUnit,
        unit: it.product.unit,
        subtotal: it.product.pricePerUnit * it.quantity
      })),
      totalAmount: cartView.totalRwf,
      usdEquivalent: cartView.totalUsd,
      status: methodLabel.toLowerCase().includes('cash') ? 'Pending' : 'Processing',
      createdAt: new Date().toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit' }),
      createdTimestamp: Date.now(),
      sellerName: cartView.items[0]?.product.sellerName || 'Rwanda Cooperatives'
    };

    store.orders.unshift(order);
    store.carts[cartKey] = [];
    writeMarketStore(store);

    const emptyCart = hydrateCartView(cartKey, store, cachedEconomy.fxRates.rwfPerUsd);
    broadcastToCart(cartKey, 'cart:updated', emptyCart);
    broadcastAll('order:placed', order);
    broadcastAll('market:products-updated', store.products);

    res.status(201).json({ order, cart: emptyCart, products: store.products });
  });
}
