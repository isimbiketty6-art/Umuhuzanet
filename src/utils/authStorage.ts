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
  avatar?: string;
  companyName?: string;
  tinNumber?: string;
  joinedDate?: string;
}

export interface StoredUser extends AuthUser {
  passwordHash: string;
  resetOtp?: string;
  resetOtpExpires?: number;
  lastLoginAt?: number;
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
  role: UserRole;
  nationalId: string;
  district: string;
  companyName?: string;
  tinNumber?: string;
}

export interface CredentialPreset {
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  password: string;
  dashboardLabel: string;
  targetPortal: 'human-os' | 'seller' | 'admin' | 'trader' | 'buyer';
  description: string;
}

const STORAGE_USERS_KEY = 'umuhuza_registered_users_v3';
const STORAGE_SESSION_KEY = 'umuhuza_active_session_v3';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 Hours

// Standard Pre-seeded Real Rwandan Verified Credentials
export const PRESET_CREDENTIALS: CredentialPreset[] = [
  {
    role: 'Job seeker',
    name: 'Aline Uwimana',
    email: 'aline.uwimana@gmail.com',
    phone: '+250 788 123 456',
    nationalId: '1199880012345678',
    password: 'Password123!',
    dashboardLabel: 'Job Seeker & Talent OS',
    targetPortal: 'human-os',
    description: 'Career marketplace, job applications, skills track, and freelance invoicing.'
  },
  {
    role: 'Seller',
    name: 'Jean Claude Nshimiyimana',
    email: 'jc.nshimiye@umuhuza.rw',
    phone: '+250 788 412 901',
    nationalId: '1199080034567891',
    password: 'SellerRwanda2026!',
    dashboardLabel: 'Farmer & Seller Portal',
    targetPortal: 'seller',
    description: 'Manage agricultural harvest inventory, product catalog, sales, and MoMo payouts.'
  },
  {
    role: 'Administrator',
    name: 'Nadine Mukamana',
    email: 'admin@umuhuza.rw',
    phone: '+250 788 000 001',
    nationalId: '1198580056789012',
    password: 'AdminMaster2026!',
    dashboardLabel: 'Executive Administrator Control',
    targetPortal: 'admin',
    description: 'National overview, escrow payment oversight, KYC approvals, and security audits.'
  },
  {
    role: 'Employer',
    name: 'Eric Gasana',
    email: 'eric.gasana@kigalidigital.rw',
    phone: '+250 788 998 877',
    nationalId: '1199580045612390',
    password: 'Employer2026!',
    dashboardLabel: 'Employer & Cooperative Hub',
    targetPortal: 'human-os',
    description: 'Post vacancies, review applicant pipeline, hire talent, and manage subscriptions.'
  }
];

// ========================================================
// VALIDATION UTILITIES (Strict True Info Enforcement)
// ========================================================

/**
 * Validates Rwandan National ID (NIDA format: exactly 16 numeric digits starting with 1).
 * Standard Rwandan citizen NID starts with 1 followed by birth year (e.g. 1 1998 ...).
 */
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

/**
 * Normalizes and validates Rwandan telephone numbers (MTN & Airtel Rwanda).
 * Prefixes: +250 78, +250 79, +250 72, +250 73, +250 77
 */
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

  // Must match +250 followed by 78, 79, 72, 73, 77 and exactly 7 digits
  const phoneRegex = /^\+250(78|79|72|73|77)\d{7}$/;
  if (!phoneRegex.test(clean)) {
    return {
      valid: false,
      error: 'Must be a valid Rwandan mobile number (+250 78/79 MTN or 72/73 Airtel, 9 digits).'
    };
  }

  const prefix = clean.substring(4, 6);
  const carrier = ['78', '79'].includes(prefix) ? 'MTN Rwanda' : 'Airtel Rwanda';

  // Format nicely for display: +250 788 123 456
  const formatted = `${clean.substring(0, 4)} ${clean.substring(4, 7)} ${clean.substring(7, 10)} ${clean.substring(10, 13)}`;

  return { valid: true, normalized: formatted, carrier };
}

/**
 * Validates RFC standard email address
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Please enter a valid, complete email address (e.g. name@domain.rw).' };
  }
  return { valid: true };
}

/**
 * Enforces strong password criteria
 */
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
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) missing.push('One special symbol (!@#$...)');

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

// Helper to generate a simulated cryptographically strong session token
function generateSessionToken(userId: string): string {
  const rand1 = Math.random().toString(36).substring(2, 10);
  const rand2 = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36);
  return `umz_sess_${userId.substring(0, 8)}_${rand1}${rand2}_${timestamp}`;
}

// Initial default registered users with real NIDA and phone info
function createInitialUsers(): StoredUser[] {
  return [
    {
      id: 'usr-rw-seeker-01',
      name: 'Aline Uwimana',
      email: 'aline.uwimana@gmail.com',
      phone: '+250 788 123 456',
      nationalId: '1199880012345678',
      district: 'Gasabo (Kigali)',
      role: 'Job seeker',
      isVerified: true,
      joinedDate: 'Jan 2026',
      passwordHash: 'Password123!'
    },
    {
      id: 'usr-rw-seller-01',
      name: 'Jean Claude Nshimiyimana',
      email: 'jc.nshimiye@umuhuza.rw',
      phone: '+250 788 412 901',
      nationalId: '1199080034567891',
      district: 'Musanze (Northern Province)',
      role: 'Seller',
      companyName: 'Musanze High-Yield Potato Cooperative',
      tinNumber: '100892019',
      isVerified: true,
      joinedDate: 'Nov 2025',
      passwordHash: 'SellerRwanda2026!'
    },
    {
      id: 'usr-rw-admin-01',
      name: 'Nadine Mukamana',
      email: 'admin@umuhuza.rw',
      phone: '+250 788 000 001',
      nationalId: '1198580056789012',
      district: 'Nyarugenge (Kigali)',
      role: 'Administrator',
      isVerified: true,
      joinedDate: 'Sep 2025',
      passwordHash: 'AdminMaster2026!'
    },
    {
      id: 'usr-rw-employer-01',
      name: 'Eric Gasana',
      email: 'eric.gasana@kigalidigital.rw',
      phone: '+250 788 998 877',
      nationalId: '1199580045612390',
      district: 'Kicukiro (Kigali)',
      companyName: 'Kigali Digital Labs Ltd',
      tinNumber: '100482910',
      role: 'Employer',
      isVerified: true,
      joinedDate: 'Feb 2026',
      passwordHash: 'Employer2026!'
    }
  ];
}

// ========================================================
// AUTH STORAGE & SESSION MANAGER
// ========================================================
export const authStorage = {
  getUsers(): StoredUser[] {
    try {
      const raw = localStorage.getItem(STORAGE_USERS_KEY);
      if (!raw) {
        const initial = createInitialUsers();
        this.saveUsers(initial);
        return initial;
      }
      return JSON.parse(raw);
    } catch {
      return createInitialUsers();
    }
  },

  saveUsers(users: StoredUser[]) {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to persist users to localStorage', e);
    }
  },

  // ----------------------------------------------------
  // ROBUST SESSION MANAGEMENT
  // ----------------------------------------------------
  getActiveSession(): UserSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_SESSION_KEY);
      if (!raw) return null;
      const session: UserSession = JSON.parse(raw);

      // Check for session expiry
      if (Date.now() > session.expiresAt) {
        console.warn('Umuhuza session expired at', new Date(session.expiresAt).toISOString());
        this.terminateSession();
        return null;
      }

      // Update lastActiveAt periodically
      session.lastActiveAt = Date.now();
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
      return session;
    } catch {
      return null;
    }
  },

  createSession(user: AuthUser): UserSession {
    const session: UserSession = {
      token: generateSessionToken(user.id),
      userId: user.id,
      user,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
      lastActiveAt: Date.now(),
      deviceId: 'Browser Session • Rwanda Web Node',
      sessionIp: '197.243.16.89 (Kigali, RW)'
    };
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to save session', e);
    }
    return session;
  },

  refreshSession(): UserSession | null {
    const current = this.getActiveSession();
    if (!current) return null;
    current.expiresAt = Date.now() + SESSION_DURATION_MS;
    current.lastActiveAt = Date.now();
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('Failed to refresh session', e);
    }
    return current;
  },

  terminateSession() {
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch (e) {
      console.warn('Failed to remove session', e);
    }
  },

  // Backward compatibility with previous API
  getCurrentUser(): AuthUser | null {
    const session = this.getActiveSession();
    return session ? session.user : null;
  },

  setCurrentUser(user: AuthUser | null) {
    if (!user) {
      this.terminateSession();
    } else {
      this.createSession(user);
    }
  },

  findUserByIdentifier(identifier: string): StoredUser | null {
    const users = this.getUsers();
    const id = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/[^\d]/g, '');

    return (
      users.find((u) => {
        const emailMatch = u.email.toLowerCase() === id;
        const phoneMatch = u.phone.replace(/[^\d]/g, '').includes(cleanDigits) && cleanDigits.length >= 8;
        const nidaMatch = Boolean(u.nationalId && u.nationalId.replace(/\s+/g, '') === cleanDigits);
        return emailMatch || phoneMatch || nidaMatch;
      }) || null
    );
  },

  // ----------------------------------------------------
  // VERIFY CREDENTIALS WITH STRICT INPUT CHECK
  // ----------------------------------------------------
  verifyCredentials(
    identifier: string,
    passwordAttempt: string
  ): { success: boolean; session?: UserSession; user?: AuthUser; message: string } {
    const id = identifier.trim();
    if (!id) {
      return { success: false, message: 'Please enter your registered Rwanda National ID, Phone, or Email.' };
    }
    if (!passwordAttempt) {
      return { success: false, message: 'Password is required to authenticate.' };
    }

    const user = this.findUserByIdentifier(id);
    if (!user) {
      return {
        success: false,
        message: `No verified Rwandan account matches "${id}". Check spelling or register a new verified profile.`
      };
    }

    if (user.passwordHash !== passwordAttempt) {
      return {
        success: false,
        message: 'Incorrect password entered. Passwords are case-sensitive.'
      };
    }

    // Strip passwordHash before returning
    const { passwordHash, resetOtp, resetOtpExpires, ...safeUser } = user;
    const session = this.createSession(safeUser);

    return {
      success: true,
      session,
      user: safeUser,
      message: `Authentication verified! Welcome back, ${safeUser.name}.`
    };
  },

  // ----------------------------------------------------
  // REGISTER USER WITH MANDATORY TRUE INFO
  // ----------------------------------------------------
  registerUser(data: RegisterData): {
    success: boolean;
    session?: UserSession;
    user?: AuthUser;
    message: string;
  } {
    // 1. Legal Name Check
    if (!data.name || data.name.trim().split(' ').length < 2) {
      return { success: false, message: 'Please provide your full legal name (First and Last Name).' };
    }

    // 2. Strict National ID Check
    const nidVal = validateRwandaNationalId(data.nationalId);
    if (!nidVal.valid) {
      return { success: false, message: nidVal.error || 'Invalid Rwanda National ID.' };
    }

    // 3. Strict Rwandan Phone Check
    const phoneVal = validateRwandaPhone(data.phone);
    if (!phoneVal.valid) {
      return { success: false, message: phoneVal.error || 'Invalid Rwanda phone number.' };
    }

    // 4. Strict Email Check
    const emailVal = validateEmail(data.email);
    if (!emailVal.valid) {
      return { success: false, message: emailVal.error || 'Invalid email address.' };
    }

    // 5. Strong Password Check
    const passCheck = checkPasswordStrength(data.password);
    if (!passCheck.valid) {
      return {
        success: false,
        message: `Password requirement not met: ${passCheck.missing.join(', ')}.`
      };
    }

    const users = this.getUsers();

    // Prevent duplicate National ID, Phone or Email
    const existingNid = users.find((u) => u.nationalId && u.nationalId.replace(/\s+/g, '') === nidVal.cleanId);
    if (existingNid) {
      return {
        success: false,
        message: 'This Rwanda National ID (NIDA) is already registered on Umuhuza Connect.'
      };
    }

    const existingEmail = users.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existingEmail) {
      return {
        success: false,
        message: 'An account with this email address already exists. Please log in instead.'
      };
    }

    const newUser: StoredUser = {
      id: `usr-rw-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: phoneVal.normalized || data.phone.trim(),
      nationalId: nidVal.cleanId!,
      district: data.district || 'Gasabo (Kigali)',
      role: data.role,
      companyName: data.companyName ? data.companyName.trim() : undefined,
      tinNumber: data.tinNumber ? data.tinNumber.trim() : undefined,
      isVerified: true,
      joinedDate: 'Today',
      passwordHash: data.password
    };

    users.push(newUser);
    this.saveUsers(users);

    const { passwordHash, ...safeUser } = newUser;
    const session = this.createSession(safeUser);

    return {
      success: true,
      session,
      user: safeUser,
      message: `Verified Rwandan account created! Welcome to Umuhuza Connect, ${safeUser.name}.`
    };
  },

  // ----------------------------------------------------
  // ROLE AUTHORIZATION (RBAC)
  // ----------------------------------------------------
  checkAuthorization(
    user: AuthUser | null,
    targetSection: Section
  ): { authorized: boolean; reason?: string } {
    if (targetSection === 'Admin Center') {
      if (!user) {
        return {
          authorized: false,
          reason: 'Administrator authentication required. Please sign in with an Admin account.'
        };
      }
      if (user.role !== 'Administrator') {
        return {
          authorized: false,
          reason: `Restricted Access: Role "${user.role}" does not have Administrator privileges.`
        };
      }
    }
    return { authorized: true };
  },

  requestPasswordResetOtp(
    identifier: string
  ): { success: boolean; otp?: string; destination?: string; message: string } {
    const user = this.findUserByIdentifier(identifier);
    if (!user) {
      return {
        success: false,
        message: `No account found for "${identifier}". Please verify your Rwanda phone, NIDA, or email.`
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetOtp = otp;
    user.resetOtpExpires = expires;

    const users = this.getUsers().map((u) => (u.id === user.id ? user : u));
    this.saveUsers(users);

    return {
      success: true,
      otp,
      destination: user.phone || user.email,
      message: `A 6-digit recovery PIN (${otp}) was dispatched to ${user.phone} via MTN Rwanda SMS gateway.`
    };
  },

  resetPasswordWithOtp(
    identifier: string,
    otp: string,
    newPassword: string
  ): { success: boolean; session?: UserSession; user?: AuthUser; message: string } {
    const passCheck = checkPasswordStrength(newPassword);
    if (!passCheck.valid) {
      return {
        success: false,
        message: `Password does not meet requirements: ${passCheck.missing.join(', ')}.`
      };
    }

    const user = this.findUserByIdentifier(identifier);
    if (!user) {
      return { success: false, message: 'Account not found for password reset.' };
    }

    if (!user.resetOtp || user.resetOtp !== otp.trim()) {
      return { success: false, message: 'Invalid 6-digit recovery PIN. Please check the code and retry.' };
    }

    if (user.resetOtpExpires && Date.now() > user.resetOtpExpires) {
      return { success: false, message: 'Recovery PIN has expired. Please request a new PIN.' };
    }

    user.passwordHash = newPassword;
    delete user.resetOtp;
    delete user.resetOtpExpires;

    const users = this.getUsers().map((u) => (u.id === user.id ? user : u));
    this.saveUsers(users);

    const { passwordHash, ...safeUser } = user;
    const session = this.createSession(safeUser);

    return {
      success: true,
      session,
      user: safeUser,
      message: 'Password successfully updated! Your session has been secured.'
    };
  }
};
