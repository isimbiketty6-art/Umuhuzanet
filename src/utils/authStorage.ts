import { UserRole, Section } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  district: string;
  role: UserRole;
  isVerified: boolean;
  skills?: string;
  avatar?: string;
  companyName?: string;
  tinNumber?: string;
  joinedDate?: string;
}

export interface UserSession {
  token: string;
  userId: string;
  user: AuthUser;
  createdAt: number;
  expiresAt: number;
  lastActiveAt: number;
  deviceId: string;
  sessionIp: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Exclude<UserRole, 'Administrator'>;
  nationalId: string;
  district: string;
  companyName?: string;
  tinNumber?: string;
}

export interface AdminClaimData {
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  passcode: string;
}

export interface AuthActionResult {
  success: boolean;
  user?: AuthUser;
  session?: UserSession;
  needsSetup?: boolean;
  message: string;
}

// In-memory session store (never persisted in localStorage/sessionStorage)
let inMemorySession: UserSession | null = null;

// ========================================================
// VALIDATION UTILITIES (Rwanda NIDA, Phone, Email, Password)
// ========================================================
export function validateRwandaNationalId(rawId: string): {
  valid: boolean;
  cleanId?: string;
  birthYear?: string;
  error?: string;
} {
  if (!rawId) {
    return { valid: false, error: 'Rwanda National ID (NIDA) is required.' };
  }
  const cleanId = rawId.replace(/\s+/g, '');
  if (!/^\d+$/.test(cleanId)) {
    return { valid: false, error: 'National ID must contain only numeric digits.' };
  }
  if (cleanId.length !== 16) {
    return {
      valid: false,
      error: `National ID must be exactly 16 digits (currently ${cleanId.length} digits).`
    };
  }
  if (!cleanId.startsWith('1')) {
    return {
      valid: false,
      error: 'Rwandan Citizen National ID must begin with digit 1 according to NIDA standards.'
    };
  }

  const birthYear = cleanId.substring(1, 5);
  const yearNum = parseInt(birthYear, 10);
  const currentYear = new Date().getFullYear();
  if (yearNum < 1920 || yearNum > currentYear - 14) {
    return {
      valid: false,
      error: `Invalid birth year (${birthYear}) encoded in National ID. Must represent an adult age 14+.`
    };
  }

  return { valid: true, cleanId, birthYear };
}

export function validateRwandaPhone(raw: string): {
  valid: boolean;
  normalized?: string;
  carrier?: 'MTN Rwanda' | 'Airtel Rwanda';
  error?: string;
} {
  if (!raw) {
    return { valid: false, error: 'Phone number is required.' };
  }
  let clean = raw.replace(/[^\d+]/g, '');

  if (clean.startsWith('07')) {
    clean = '+250' + clean.substring(1);
  } else if (clean.startsWith('7') && clean.length === 9) {
    clean = '+250' + clean;
  } else if (clean.startsWith('250') && !clean.startsWith('+')) {
    clean = '+' + clean;
  }

  const phoneRegex = /^\+250(78|79|72|73|77)\d{7}$/;
  if (!phoneRegex.test(clean)) {
    return {
      valid: false,
      error: 'Must be a valid Rwandan mobile number (+250 78/79 MTN or 72/73 Airtel, 9 digits).'
    };
  }

  const prefix = clean.substring(4, 6);
  const carrier = ['78', '79'].includes(prefix) ? 'MTN Rwanda' : 'Airtel Rwanda';
  const formatted = `${clean.substring(0, 4)} ${clean.substring(4, 7)} ${clean.substring(7, 10)} ${clean.substring(10, 13)}`;

  return { valid: true, normalized: formatted, carrier };
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Please enter a valid email address (e.g. name@domain.rw).' };
  }
  return { valid: true };
}

export function checkPasswordStrength(password: string): {
  valid: boolean;
  score: number;
  label: 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  missing: string[];
} {
  const missing: string[] = [];
  if (password.length < 8) missing.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) missing.push('One uppercase letter (A-Z)');
  if (!/[a-z]/.test(password)) missing.push('One lowercase letter (a-z)');
  if (!/[0-9]/.test(password)) missing.push('One number (0-9)');
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    missing.push('One special symbol (!@#$...)');
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;

  let label: 'Weak' | 'Medium' | 'Strong' | 'Very Strong' = 'Weak';
  if (score >= 4) label = 'Very Strong';
  else if (score >= 3) label = 'Strong';
  else if (score >= 2) label = 'Medium';

  return {
    valid: missing.length === 0,
    score,
    label,
    missing
  };
}

function buildSession(user: AuthUser, rawSession: any): UserSession {
  return {
    token: rawSession.token,
    userId: user.id,
    user,
    createdAt: rawSession.createdAt,
    expiresAt: rawSession.expiresAt,
    lastActiveAt: rawSession.lastActiveAt,
    deviceId: rawSession.deviceId || 'Web Client',
    sessionIp: rawSession.sessionIp || 'Kigali, RW'
  };
}

async function authFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }
  const active = authStorage.getActiveSession();
  if (active?.token) {
    headers.set('Authorization', `Bearer ${active.token}`);
  }
  return fetch(path, { ...init, headers });
}

// ========================================================
// SERVER-BACKED AUTHENTICATION & AUTHORIZATION CLIENT
// ========================================================
export const authStorage = {
  getActiveSession(): UserSession | null {
    if (!inMemorySession) return null;
    if (Date.now() > inMemorySession.expiresAt) {
      inMemorySession = null;
      return null;
    }
    return inMemorySession;
  },

  getCurrentUser(): AuthUser | null {
    const session = this.getActiveSession();
    return session ? session.user : null;
  },

  getAuthHeaders(): Record<string, string> {
    const session = this.getActiveSession();
    return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
  },

  clearSession() {
    inMemorySession = null;
  },

  async login(identifier: string, password: string): Promise<AuthActionResult> {
    if (!identifier.trim()) {
      return { success: false, message: 'Please enter your National ID, Rwanda Phone, or Email.' };
    }
    if (!password) {
      return { success: false, message: 'Password is required.' };
    }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password })
      });
      const data = await res.json();
      if (!res.ok || !data.user || !data.session) {
        return { success: false, message: data.message || 'Authentication failed.' };
      }
      const session = buildSession(data.user, data.session);
      inMemorySession = session;
      return {
        success: true,
        user: data.user,
        session,
        message: data.message || `Welcome back, ${data.user.name}.`
      };
    } catch {
      return { success: false, message: 'Unable to reach authentication server.' };
    }
  },

  async register(data: RegisterData): Promise<AuthActionResult> {
    if (!data.name || data.name.trim().split(/\s+/).length < 2) {
      return { success: false, message: 'Please provide your full legal name (First and Last Name).' };
    }
    const nidVal = validateRwandaNationalId(data.nationalId);
    if (!nidVal.valid) {
      return { success: false, message: nidVal.error || 'Invalid Rwanda National ID.' };
    }
    const phoneVal = validateRwandaPhone(data.phone);
    if (!phoneVal.valid) {
      return { success: false, message: phoneVal.error || 'Invalid Rwanda phone number.' };
    }
    const emailVal = validateEmail(data.email);
    if (!emailVal.valid) {
      return { success: false, message: emailVal.error || 'Invalid email address.' };
    }
    const passCheck = checkPasswordStrength(data.password);
    if (!passCheck.valid) {
      return {
        success: false,
        message: `Password requirements not met: ${passCheck.missing.join(', ')}.`
      };
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          nationalId: nidVal.cleanId,
          phone: phoneVal.normalized
        })
      });
      const body = await res.json();
      if (!res.ok || !body.user || !body.session) {
        return { success: false, message: body.message || 'Registration failed.' };
      }
      const session = buildSession(body.user, body.session);
      inMemorySession = session;
      return {
        success: true,
        user: body.user,
        session,
        message: body.message || `Account created! Welcome, ${body.user.name}.`
      };
    } catch {
      return { success: false, message: 'Unable to reach authentication server.' };
    }
  },

  async getAdminStatus(): Promise<{ configured: boolean; source: string }> {
    try {
      const res = await fetch('/api/auth/admin-status');
      if (!res.ok) return { configured: true, source: 'unknown' };
      return await res.json();
    } catch {
      return { configured: true, source: 'unknown' };
    }
  },

  async claimAdmin(data: AdminClaimData): Promise<AuthActionResult> {
    try {
      const res = await fetch('/api/auth/admin-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const body = await res.json();
      if (!res.ok || !body.user || !body.session) {
        return { success: false, message: body.message || 'Failed to claim Administrator access.' };
      }
      const session = buildSession(body.user, body.session);
      inMemorySession = session;
      return {
        success: true,
        user: body.user,
        session,
        message: body.message || 'Administrator access configured.'
      };
    } catch {
      return { success: false, message: 'Unable to reach authentication server.' };
    }
  },

  async adminLogin(passcode: string, email?: string): Promise<AuthActionResult> {
    if (!passcode) {
      return { success: false, message: 'Administrator passcode is required.' };
    }
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode, email: email?.trim() || undefined })
      });
      const body = await res.json();
      if (!res.ok || !body.user || !body.session) {
        return {
          success: false,
          needsSetup: Boolean(body.needsSetup),
          message: body.message || 'Administrator authentication failed.'
        };
      }
      const session = buildSession(body.user, body.session);
      inMemorySession = session;
      return {
        success: true,
        user: body.user,
        session,
        message: body.message || 'Authenticated as Administrator.'
      };
    } catch {
      return { success: false, message: 'Unable to reach authentication server.' };
    }
  },

  async refreshSession(): Promise<UserSession | null> {
    if (!inMemorySession) return null;
    try {
      const res = await authFetch('/api/auth/refresh', { method: 'POST' });
      if (!res.ok) {
        inMemorySession = null;
        return null;
      }
      const data = await res.json();
      if (data.user && data.session) {
        inMemorySession = buildSession(data.user, data.session);
        return inMemorySession;
      }
      return null;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    if (inMemorySession?.token) {
      try {
        await authFetch('/api/auth/logout', { method: 'POST' });
      } catch {
        // Always clear client session state
      }
    }
    inMemorySession = null;
  },

  async updateProfile(updates: {
    name?: string;
    district?: string;
    skills?: string;
    companyName?: string;
    tinNumber?: string;
  }): Promise<AuthActionResult> {
    if (!inMemorySession) {
      return { success: false, message: 'You must be signed in to update your profile.' };
    }
    try {
      const res = await authFetch('/api/account/profile', {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok || !data.user) {
        return { success: false, message: data.message || data.error || 'Failed to update profile.' };
      }
      inMemorySession = { ...inMemorySession, user: data.user };
      return {
        success: true,
        user: data.user,
        session: inMemorySession,
        message: data.message || 'Profile updated.'
      };
    } catch {
      return { success: false, message: 'Unable to reach server.' };
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<AuthActionResult> {
    if (!inMemorySession) {
      return { success: false, message: 'You must be signed in to change your password.' };
    }
    try {
      const res = await authFetch('/api/account/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || data.error || 'Failed to update password.' };
      }
      return { success: true, message: data.message || 'Password updated securely.' };
    } catch {
      return { success: false, message: 'Unable to reach server.' };
    }
  },

  async fetchAdminOverview(): Promise<{
    authorized: boolean;
    registeredUsersCount?: number;
    activeSessionsCount?: number;
    error?: string;
  }> {
    try {
      const res = await authFetch('/api/admin/overview');
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { authorized: false, error: err.error || 'Unauthorized' };
      }
      const data = await res.json();
      return {
        authorized: true,
        registeredUsersCount: data.registeredUsersCount,
        activeSessionsCount: data.activeSessionsCount
      };
    } catch {
      return { authorized: false, error: 'Network error' };
    }
  },

  checkAuthorization(
    user: AuthUser | null,
    targetSection: Section
  ): { authorized: boolean; reason?: string } {
    if (targetSection === 'Admin Center') {
      if (!user) {
        return {
          authorized: false,
          reason: 'Administrator authentication required.'
        };
      }
      if (user.role !== 'Administrator') {
        return {
          authorized: false,
          reason: `Restricted Access: Role "${user.role}" does not have Administrator privileges.`
        };
      }
    }

    const protectedUserSections: Section[] = ['Overview', 'Income OS', 'Messages', 'Settings'];
    if (protectedUserSections.includes(targetSection) && !user) {
      return {
        authorized: false,
        reason: 'Please sign in to access your personal workspace.'
      };
    }

    return { authorized: true };
  }
};
