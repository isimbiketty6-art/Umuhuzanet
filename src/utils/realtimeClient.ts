import { AgriOrder, AgriProduct, CartItem } from '../types/agri';
import { authStorage } from './authStorage';

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

export interface ServerCartView {
  cartKey: string;
  items: CartItem[];
  subtotalRwf: number;
  deliveryFeeRwf: number;
  totalRwf: number;
  totalUsd: number;
  updatedAt: number;
}

export interface RealtimeStateHandlers {
  onProducts?: (products: AgriProduct[]) => void;
  onCart?: (cart: ServerCartView) => void;
  onOrders?: (orders: AgriOrder[]) => void;
  onOrderPlaced?: (order: AgriOrder) => void;
  onOrderUpdated?: (order: AgriOrder) => void;
  onNews?: (news: LiveNewsItem[]) => void;
  onEconomy?: (economy: LiveEconomySnapshot) => void;
  onPresence?: (onlineUsersCount: number) => void;
}

let anonymousCartId = '';

function getAnonymousCartId(): string {
  if (anonymousCartId) return anonymousCartId;
  try {
    const existing = window.sessionStorage.getItem('umuhuza_cart_id');
    if (existing && /^[a-zA-Z0-9_-]{8,64}$/.test(existing)) {
      anonymousCartId = existing;
      return anonymousCartId;
    }
    const generated = `cart_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem('umuhuza_cart_id', generated);
    anonymousCartId = generated;
    return anonymousCartId;
  } catch {
    anonymousCartId = `cart_${Date.now().toString(36)}`;
    return anonymousCartId;
  }
}

function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    'x-cart-id': getAnonymousCartId(),
    ...authStorage.getAuthHeaders(),
    ...(extra || {})
  };
}

class RealtimeMarketplaceClient {
  private ws: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private handlers = new Set<RealtimeStateHandlers>();
  private stopped = false;

  subscribe(handler: RealtimeStateHandlers): () => void {
    this.handlers.add(handler);
    if (!this.ws && !this.stopped) {
      this.connect();
    }
    return () => {
      this.handlers.delete(handler);
    };
  }

  identifyCart(userId?: string) {
    const cartKey = userId ? `user:${userId}` : `guest:${getAnonymousCartId()}`;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event: 'cart:identify', cartKey }));
    }
  }

  private connect() {
    if (typeof window === 'undefined') return;
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${proto}//${window.location.host}/ws?cartId=${encodeURIComponent(
      getAnonymousCartId()
    )}`;

    try {
      const socket = new WebSocket(wsUrl);
      this.ws = socket;

      socket.onopen = () => {
        const user = authStorage.getCurrentUser();
        if (user) {
          this.identifyCart(user.id);
        }
      };

      socket.onmessage = (evt) => {
        try {
          const msg = JSON.parse(String(evt.data)) as { event: string; payload: any };
          if (!msg || !msg.event) return;
          this.dispatchEvent(msg.event, msg.payload);
        } catch {
          // ignore invalid frame
        }
      };

      socket.onclose = () => {
        this.ws = null;
        if (!this.stopped && this.handlers.size > 0) {
          this.reconnectTimer = window.setTimeout(() => this.connect(), 3000);
        }
      };

      socket.onerror = () => {
        socket.close();
      };
    } catch {
      this.reconnectTimer = window.setTimeout(() => this.connect(), 4000);
    }
  }

  private dispatchEvent(event: string, payload: any) {
    for (const h of this.handlers) {
      if (event === 'init' && payload) {
        if (payload.products) h.onProducts?.(payload.products);
        if (payload.cart) h.onCart?.(payload.cart);
        if (payload.orders) h.onOrders?.(payload.orders);
        if (payload.news) h.onNews?.(payload.news);
        if (payload.economy) h.onEconomy?.(payload.economy);
        if (typeof payload.onlineUsersCount === 'number') {
          h.onPresence?.(payload.onlineUsersCount);
        }
      } else if (event === 'market:products-updated') {
        h.onProducts?.(payload);
      } else if (event === 'cart:updated') {
        h.onCart?.(payload);
      } else if (event === 'order:placed') {
        h.onOrderPlaced?.(payload);
      } else if (event === 'order:status-updated') {
        h.onOrderUpdated?.(payload);
      } else if (event === 'live:news-updated') {
        h.onNews?.(payload);
      } else if (event === 'live:economy-updated') {
        h.onEconomy?.(payload);
      } else if (event === 'presence:updated' && typeof payload?.onlineUsersCount === 'number') {
        h.onPresence?.(payload.onlineUsersCount);
      }
    }
  }

  async fetchCart(): Promise<ServerCartView | null> {
    try {
      const res = await fetch('/api/cart', { headers: buildHeaders() });
      if (!res.ok) return null;
      return (await res.json()) as ServerCartView;
    } catch {
      return null;
    }
  }

  async addToCart(
    product: AgriProduct | {
      id: string;
      name: string;
      nameRw?: string;
      category?: string;
      pricePerUnit: number;
      unit?: string;
      location?: string;
      sellerName?: string;
      image?: string;
      stockQuantity?: number;
    },
    quantity: number
  ): Promise<{ ok: boolean; cart?: ServerCartView; error?: string }> {
    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: buildHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          productId: product.id,
          quantity,
          customItem: product
        })
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.message || 'Could not add item to cart.' };
      }
      return { ok: true, cart: data as ServerCartView };
    } catch {
      return { ok: false, error: 'Unable to reach cart server.' };
    }
  }

  async updateCartQuantity(
    productId: string,
    quantity: number
  ): Promise<{ ok: boolean; cart?: ServerCartView; error?: string }> {
    try {
      const res = await fetch(`/api/cart/items/${encodeURIComponent(productId)}`, {
        method: 'PATCH',
        headers: buildHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ quantity })
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.message || 'Could not update cart.' };
      }
      return { ok: true, cart: data as ServerCartView };
    } catch {
      return { ok: false, error: 'Unable to reach cart server.' };
    }
  }

  async removeFromCart(productId: string): Promise<{ ok: boolean; cart?: ServerCartView }> {
    try {
      const res = await fetch(`/api/cart/items/${encodeURIComponent(productId)}`, {
        method: 'DELETE',
        headers: buildHeaders()
      });
      if (!res.ok) return { ok: false };
      return { ok: true, cart: (await res.json()) as ServerCartView };
    } catch {
      return { ok: false };
    }
  }

  async clearCart(): Promise<{ ok: boolean; cart?: ServerCartView }> {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: buildHeaders()
      });
      if (!res.ok) return { ok: false };
      return { ok: true, cart: (await res.json()) as ServerCartView };
    } catch {
      return { ok: false };
    }
  }

  async checkoutCart(payload: {
    customerName: string;
    customerPhone: string;
    deliveryDistrict: string;
    deliveryAddress: string;
    paymentMethod: string;
    paymentRef?: string;
  }): Promise<{
    ok: boolean;
    order?: AgriOrder;
    cart?: ServerCartView;
    products?: AgriProduct[];
    error?: string;
  }> {
    try {
      const res = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: buildHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.message || 'Checkout failed.' };
      }
      return {
        ok: true,
        order: data.order as AgriOrder,
        cart: data.cart as ServerCartView,
        products: data.products as AgriProduct[]
      };
    } catch {
      return { ok: false, error: 'Unable to reach checkout server.' };
    }
  }

  async refreshLiveFeeds(): Promise<{
    economy?: LiveEconomySnapshot;
    news?: LiveNewsItem[];
    products?: AgriProduct[];
  } | null> {
    try {
      const res = await fetch('/api/live/refresh', { method: 'POST' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}

export const realtimeClient = new RealtimeMarketplaceClient();
