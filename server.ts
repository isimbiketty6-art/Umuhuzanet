import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { attachRealtimeMarketAndNews } from './server/realtimeService.ts';

type UserRole = 'Job seeker' | 'Employer' | 'Seller' | 'Administrator';
type PublicRole = 'Job seeker' | 'Employer' | 'Seller';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  district: string;
  role: UserRole;
  isVerified: boolean;
  skills?: string;
  companyName?: string;
  tinNumber?: string;
  joinedDate: string;
}

interface StoredUserRecord extends AuthUser {
  passwordHash: string; // format: saltHex:derivedKeyHex (scrypt)
  createdAt: number;
}

interface AdminCredentialRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  district: string;
  passcodeHash: string; // scrypt salt:hash
  claimedAt: number;
}

interface AuthStoreData {
  users: StoredUserRecord[];
  admin: AdminCredentialRecord | null;
}

interface ServerSession {
  tokenId: string;
  userId: string;
  user: AuthUser;
  createdAt: number;
  expiresAt: number;
  lastActiveAt: number;
  deviceId: string;
  sessionIp: string;
}

interface AuthenticatedRequest extends Request {
  authSession?: ServerSession;
  rawToken?: string;
}

const PORT = Number(process.env.PORT) || 3000;
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_SECRET =
  process.env.SESSION_SECRET && process.env.SESSION_SECRET.trim().length > 0
    ? process.env.SESSION_SECRET.trim()
    : crypto.randomBytes(32).toString('hex');

const DATA_DIR = path.resolve(process.cwd(), '.data');
const STORE_PATH = path.resolve(DATA_DIR, 'auth-store.json');

// In-memory active session registry
const activeSessions = new Map<string, ServerSession>();

// Ensure .data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readStore(): AuthStoreData {
  ensureDataDir();
  if (!fs.existsSync(STORE_PATH)) {
    const initial: AuthStoreData = { users: [], admin: null };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<AuthStoreData>;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      admin: parsed.admin ?? null
    };
  } catch {
    return { users: [], admin: null };
  }
}

function writeStore(data: AuthStoreData) {
  ensureDataDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// ========================================================
// CRYPTOGRAPHY HELPERS (scrypt + HMAC-SHA256 + timingSafeEqual)
// ========================================================
function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(plain, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(plain: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  if (!salt || !keyHex) return false;
  const keyBuf = Buffer.from(keyHex, 'hex');
  const derivedBuf = crypto.scryptSync(plain, salt, 64);
  if (keyBuf.length !== derivedBuf.length) return false;
  return crypto.timingSafeEqual(keyBuf, derivedBuf);
}

function safeCompareSecret(attempt: string, expected: string): boolean {
  const attemptDigest = crypto.createHash('sha256').update(attempt).digest();
  const expectedDigest = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(attemptDigest, expectedDigest);
}

function signSessionToken(tokenId: string, userId: string): string {
  const payload = Buffer.from(JSON.stringify({ tid: tokenId, uid: userId })).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `umz_${payload}.${sig}`;
}

function verifySignedToken(token: string): { tid: string; uid: string } | null {
  if (!token || !token.startsWith('umz_')) return null;
  const body = token.slice(4);
  const dotIdx = body.indexOf('.');
  if (dotIdx <= 0) return null;
  const payload = body.slice(0, dotIdx);
  const sig = body.slice(dotIdx + 1);
  if (!payload || !sig) return null;

  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      tid?: string;
      uid?: string;
    };
    if (!decoded.tid || !decoded.uid) return null;
    return { tid: decoded.tid, uid: decoded.uid };
  } catch {
    return null;
  }
}

// ========================================================
// VALIDATION HELPERS (Rwanda NIDA, Phone, Email, Password)
// ========================================================
function validateRwandaNationalId(rawId: unknown): {
  valid: boolean;
  cleanId?: string;
  error?: string;
} {
  if (typeof rawId !== 'string' || !rawId.trim()) {
    return { valid: false, error: 'Rwanda National ID (NIDA) is required.' };
  }
  const cleanId = rawId.replace(/\s+/g, '');
  if (!/^\d{16}$/.test(cleanId)) {
    return { valid: false, error: 'National ID must contain exactly 16 numeric digits.' };
  }
  if (!cleanId.startsWith('1')) {
    return { valid: false, error: 'Rwandan Citizen National ID must begin with digit 1.' };
  }
  const yearNum = parseInt(cleanId.substring(1, 5), 10);
  const currentYear = new Date().getFullYear();
  if (yearNum < 1920 || yearNum > currentYear - 14) {
    return {
      valid: false,
      error: `Invalid birth year (${cleanId.substring(1, 5)}) encoded in National ID.`
    };
  }
  return { valid: true, cleanId };
}

function validateRwandaPhone(raw: unknown): {
  valid: boolean;
  normalized?: string;
  digitsOnly?: string;
  error?: string;
} {
  if (typeof raw !== 'string' || !raw.trim()) {
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

  if (!/^\+250(78|79|72|73|77)\d{7}$/.test(clean)) {
    return {
      valid: false,
      error: 'Must be a valid Rwandan mobile number (+250 78/79 MTN or 72/73 Airtel).'
    };
  }
  const formatted = `${clean.substring(0, 4)} ${clean.substring(4, 7)} ${clean.substring(7, 10)} ${clean.substring(10, 13)}`;
  return { valid: true, normalized: formatted, digitsOnly: clean.replace(/[^\d]/g, '') };
}

function validateEmail(raw: unknown): { valid: boolean; clean?: string; error?: string } {
  if (typeof raw !== 'string' || !raw.trim()) {
    return { valid: false, error: 'Email address is required.' };
  }
  const clean = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(clean)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  return { valid: true, clean };
}

function checkPasswordStrength(password: unknown): { valid: boolean; missing: string[] } {
  if (typeof password !== 'string') {
    return { valid: false, missing: ['Valid password string'] };
  }
  const missing: string[] = [];
  if (password.length < 8) missing.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) missing.push('One uppercase letter (A-Z)');
  if (!/[a-z]/.test(password)) missing.push('One lowercase letter (a-z)');
  if (!/[0-9]/.test(password)) missing.push('One number (0-9)');
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) missing.push('One special symbol (!@#$...)');
  return { valid: missing.length === 0, missing };
}

function sanitizeUser(record: StoredUserRecord): AuthUser {
  const { passwordHash: _ph, createdAt: _ca, ...safe } = record;
  return safe;
}

function issueSessionForUser(user: AuthUser, req: Request) {
  const tokenId = crypto.randomBytes(16).toString('hex');
  const now = Date.now();
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    'Rwanda Web Node';
  const session: ServerSession = {
    tokenId,
    userId: user.id,
    user,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
    lastActiveAt: now,
    deviceId: String(req.headers['user-agent'] || 'Web Client').slice(0, 64),
    sessionIp: ip
  };
  activeSessions.set(tokenId, session);
  const token = signSessionToken(tokenId, user.id);
  return {
    token,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    lastActiveAt: session.lastActiveAt,
    deviceId: session.deviceId,
    sessionIp: session.sessionIp
  };
}

// ========================================================
// MIDDLEWARE: AUTHENTICATION & ROLE AUTHORIZATION
// ========================================================
function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please sign in.' });
    return;
  }

  const token = authHeader.slice(7).trim();
  const parsed = verifySignedToken(token);
  if (!parsed) {
    res.status(401).json({ error: 'Invalid session token.' });
    return;
  }

  const session = activeSessions.get(parsed.tid);
  if (!session || session.userId !== parsed.uid) {
    res.status(401).json({ error: 'Session not found or has been signed out.' });
    return;
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(parsed.tid);
    res.status(401).json({ error: 'Session expired. Please sign in again.' });
    return;
  }

  session.lastActiveAt = Date.now();
  req.authSession = session;
  req.rawToken = token;
  next();
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.authSession) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }
  if (req.authSession.user.role !== 'Administrator') {
    res.status(403).json({
      error: `Access denied: Role "${req.authSession.user.role}" does not have Administrator authorization.`
    });
    return;
  }
  next();
}

// ========================================================
// EXPRESS APP & ROUTES
// ========================================================
async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'umuhuza-connect-auth' });
  });

  // Public Registration (Strictly non-admin roles only)
  app.post('/api/auth/register', (req, res) => {
    const {
      name,
      email,
      phone,
      nationalId,
      district,
      role,
      companyName,
      tinNumber,
      password
    } = req.body ?? {};

    if (typeof name !== 'string' || name.trim().split(/\s+/).length < 2) {
      res.status(400).json({ message: 'Please provide your full legal name (First and Last Name).' });
      return;
    }

    if (role === 'Administrator') {
      res.status(403).json({
        message: 'Administrator accounts cannot be created via public registration.'
      });
      return;
    }

    const allowedRoles: PublicRole[] = ['Job seeker', 'Employer', 'Seller'];
    if (!allowedRoles.includes(role)) {
      res.status(400).json({ message: 'Please select a valid role (Job seeker, Employer, or Seller).' });
      return;
    }

    const nidCheck = validateRwandaNationalId(nationalId);
    if (!nidCheck.valid || !nidCheck.cleanId) {
      res.status(400).json({ message: nidCheck.error || 'Invalid Rwanda National ID.' });
      return;
    }

    const phoneCheck = validateRwandaPhone(phone);
    if (!phoneCheck.valid || !phoneCheck.normalized || !phoneCheck.digitsOnly) {
      res.status(400).json({ message: phoneCheck.error || 'Invalid Rwanda phone number.' });
      return;
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid || !emailCheck.clean) {
      res.status(400).json({ message: emailCheck.error || 'Invalid email address.' });
      return;
    }

    const passCheck = checkPasswordStrength(password);
    if (!passCheck.valid) {
      res.status(400).json({
        message: `Password requirements not met: ${passCheck.missing.join(', ')}.`
      });
      return;
    }

    const store = readStore();
    if (store.users.some((u) => u.nationalId === nidCheck.cleanId)) {
      res.status(409).json({
        message: 'This Rwanda National ID (NIDA) is already registered.'
      });
      return;
    }
    if (store.users.some((u) => u.email.toLowerCase() === emailCheck.clean)) {
      res.status(409).json({
        message: 'An account with this email address already exists.'
      });
      return;
    }
    if (
      store.users.some((u) => u.phone.replace(/[^\d]/g, '') === phoneCheck.digitsOnly)
    ) {
      res.status(409).json({
        message: 'An account with this phone number already exists.'
      });
      return;
    }

    const record: StoredUserRecord = {
      id: `usr-rw-${crypto.randomUUID()}`,
      name: name.trim(),
      email: emailCheck.clean,
      phone: phoneCheck.normalized,
      nationalId: nidCheck.cleanId,
      district: typeof district === 'string' && district.trim() ? district.trim() : 'Gasabo (Kigali)',
      role,
      isVerified: true,
      companyName: typeof companyName === 'string' && companyName.trim() ? companyName.trim() : undefined,
      tinNumber: typeof tinNumber === 'string' && tinNumber.trim() ? tinNumber.trim() : undefined,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      passwordHash: hashPassword(password),
      createdAt: Date.now()
    };

    store.users.push(record);
    writeStore(store);

    const safeUser = sanitizeUser(record);
    const session = issueSessionForUser(safeUser, req);

    res.status(201).json({
      user: safeUser,
      session,
      message: `Verified account created! Welcome to Umuhuza Connect, ${safeUser.name}.`
    });
  });

  // Account Login (Email, Rwanda Phone, or 16-digit National ID + Password)
  app.post('/api/auth/login', (req, res) => {
    const { identifier, password } = req.body ?? {};
    if (typeof identifier !== 'string' || !identifier.trim()) {
      res.status(400).json({ message: 'Please enter your National ID, Rwanda Phone, or Email.' });
      return;
    }
    if (typeof password !== 'string' || !password) {
      res.status(400).json({ message: 'Password is required.' });
      return;
    }

    const rawId = identifier.trim();
    const idLower = rawId.toLowerCase();
    const cleanDigits = rawId.replace(/[^\d]/g, '');
    const normalizedPhoneAttempt = validateRwandaPhone(rawId).digitsOnly;

    const store = readStore();
    const record = store.users.find((u) => {
      const emailMatch = u.email.toLowerCase() === idLower;
      const nidaMatch = cleanDigits.length === 16 && u.nationalId === cleanDigits;
      const phoneMatch =
        Boolean(normalizedPhoneAttempt) &&
        u.phone.replace(/[^\d]/g, '') === normalizedPhoneAttempt;
      return emailMatch || nidaMatch || phoneMatch;
    });

    if (!record || !verifyPassword(password, record.passwordHash)) {
      res.status(401).json({
        message: 'Invalid credentials. Please verify your identifier and password.'
      });
      return;
    }

    const safeUser = sanitizeUser(record);
    const session = issueSessionForUser(safeUser, req);

    res.json({
      user: safeUser,
      session,
      message: `Authenticated successfully! Welcome back, ${safeUser.name}.`
    });
  });

  // Admin configuration status (never exposes secrets)
  app.get('/api/auth/admin-status', (_req, res) => {
    const envPasscode = (process.env.ADMIN_PASSCODE || '').trim();
    if (envPasscode.length > 0) {
      res.json({ configured: true, source: 'env' });
      return;
    }
    const store = readStore();
    if (store.admin && store.admin.passcodeHash) {
      res.json({ configured: true, source: 'claimed' });
      return;
    }
    res.json({ configured: false, source: 'unconfigured' });
  });

  // One-time bootstrap claim for first-run Admin setup (locks once claimed or when ADMIN_PASSCODE is set)
  app.post('/api/auth/admin-claim', (req, res) => {
    const envPasscode = (process.env.ADMIN_PASSCODE || '').trim();
    if (envPasscode.length > 0) {
      res.status(403).json({
        message: 'Administrator access is already managed by server configuration.'
      });
      return;
    }

    const store = readStore();
    if (store.admin && store.admin.passcodeHash) {
      res.status(403).json({
        message: 'Administrator access has already been claimed. Please sign in as Administrator.'
      });
      return;
    }

    const { name, email, phone, nationalId, passcode } = req.body ?? {};
    if (typeof name !== 'string' || name.trim().split(/\s+/).length < 2) {
      res.status(400).json({ message: 'Please enter the Administrator full legal name.' });
      return;
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid || !emailCheck.clean) {
      res.status(400).json({ message: emailCheck.error || 'Valid Administrator email is required.' });
      return;
    }

    const phoneCheck = validateRwandaPhone(phone);
    if (!phoneCheck.valid || !phoneCheck.normalized) {
      res.status(400).json({ message: phoneCheck.error || 'Valid Rwanda phone is required.' });
      return;
    }

    const nidCheck = validateRwandaNationalId(nationalId);
    if (!nidCheck.valid || !nidCheck.cleanId) {
      res.status(400).json({ message: nidCheck.error || 'Valid 16-digit Rwanda NIDA ID is required.' });
      return;
    }

    const passCheck = checkPasswordStrength(passcode);
    if (!passCheck.valid) {
      res.status(400).json({
        message: `Admin passcode requirements not met: ${passCheck.missing.join(', ')}.`
      });
      return;
    }

    const adminRecord: AdminCredentialRecord = {
      id: `adm-rw-${crypto.randomUUID()}`,
      name: name.trim(),
      email: emailCheck.clean,
      phone: phoneCheck.normalized,
      nationalId: nidCheck.cleanId,
      district: 'Nyarugenge (Kigali)',
      passcodeHash: hashPassword(passcode),
      claimedAt: Date.now()
    };

    store.admin = adminRecord;
    writeStore(store);

    const adminUser: AuthUser = {
      id: adminRecord.id,
      name: adminRecord.name,
      email: adminRecord.email,
      phone: adminRecord.phone,
      nationalId: adminRecord.nationalId,
      district: adminRecord.district,
      role: 'Administrator',
      isVerified: true,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    const session = issueSessionForUser(adminUser, req);
    res.status(201).json({
      user: adminUser,
      session,
      message: 'Administrator access claimed and authenticated.'
    });
  });

  // Administrator Login
  app.post('/api/auth/admin-login', (req, res) => {
    const { passcode, email } = req.body ?? {};
    if (typeof passcode !== 'string' || !passcode) {
      res.status(400).json({ message: 'Administrator passcode is required.' });
      return;
    }

    const envPasscode = (process.env.ADMIN_PASSCODE || '').trim();
    const store = readStore();

    if (envPasscode.length > 0) {
      if (!safeCompareSecret(passcode, envPasscode)) {
        res.status(401).json({ message: 'Invalid Administrator passcode.' });
        return;
      }
      const adminUser: AuthUser = {
        id: store.admin?.id || 'adm-rw-env-primary',
        name: store.admin?.name || 'Platform Administrator',
        email:
          typeof email === 'string' && validateEmail(email).valid
            ? email.trim().toLowerCase()
            : store.admin?.email || 'admin@umuhuza.rw',
        phone: store.admin?.phone || '+250 788 000 001',
        nationalId: store.admin?.nationalId || '1198580056789012',
        district: store.admin?.district || 'Nyarugenge (Kigali)',
        role: 'Administrator',
        isVerified: true,
        joinedDate: 'System Admin'
      };
      const session = issueSessionForUser(adminUser, req);
      res.json({
        user: adminUser,
        session,
        message: `Authenticated as Administrator (${adminUser.name}).`
      });
      return;
    }

    if (!store.admin || !store.admin.passcodeHash) {
      res.status(409).json({
        needsSetup: true,
        message: 'Administrator access has not been claimed yet.'
      });
      return;
    }

    if (email && typeof email === 'string' && email.trim()) {
      if (store.admin.email.toLowerCase() !== email.trim().toLowerCase()) {
        res.status(401).json({ message: 'Invalid Administrator email or passcode.' });
        return;
      }
    }

    if (!verifyPassword(passcode, store.admin.passcodeHash)) {
      res.status(401).json({ message: 'Invalid Administrator passcode.' });
      return;
    }

    const adminUser: AuthUser = {
      id: store.admin.id,
      name: store.admin.name,
      email: store.admin.email,
      phone: store.admin.phone,
      nationalId: store.admin.nationalId,
      district: store.admin.district,
      role: 'Administrator',
      isVerified: true,
      joinedDate: new Date(store.admin.claimedAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      })
    };

    const session = issueSessionForUser(adminUser, req);
    res.json({
      user: adminUser,
      session,
      message: `Authenticated as Administrator (${adminUser.name}).`
    });
  });

  // Current Session Inspection
  app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
    const s = req.authSession!;
    res.json({
      user: s.user,
      session: {
        token: req.rawToken!,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt,
        lastActiveAt: s.lastActiveAt,
        deviceId: s.deviceId,
        sessionIp: s.sessionIp
      }
    });
  });

  // Extend Active Session
  app.post('/api/auth/refresh', requireAuth, (req: AuthenticatedRequest, res) => {
    const s = req.authSession!;
    s.expiresAt = Date.now() + SESSION_DURATION_MS;
    s.lastActiveAt = Date.now();
    res.json({
      user: s.user,
      session: {
        token: req.rawToken!,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt,
        lastActiveAt: s.lastActiveAt,
        deviceId: s.deviceId,
        sessionIp: s.sessionIp
      }
    });
  });

  // Terminate Session
  app.post('/api/auth/logout', requireAuth, (req: AuthenticatedRequest, res) => {
    if (req.authSession) {
      activeSessions.delete(req.authSession.tokenId);
    }
    res.json({ ok: true, message: 'Session terminated securely.' });
  });

  // Authenticated User Profile Update (Never allows role or verification elevation)
  app.patch('/api/account/profile', requireAuth, (req: AuthenticatedRequest, res) => {
    const s = req.authSession!;
    const { name, district, skills, companyName, tinNumber } = req.body ?? {};

    if (typeof name === 'string' && name.trim().split(/\s+/).length >= 2) {
      s.user.name = name.trim();
    }
    if (typeof district === 'string' && district.trim()) {
      s.user.district = district.trim();
    }
    if (typeof skills === 'string') {
      s.user.skills = skills.trim();
    }
    if (typeof companyName === 'string') {
      s.user.companyName = companyName.trim() || undefined;
    }
    if (typeof tinNumber === 'string') {
      s.user.tinNumber = tinNumber.trim() || undefined;
    }

    const store = readStore();
    const userIdx = store.users.findIndex((u) => u.id === s.userId);
    if (userIdx >= 0) {
      store.users[userIdx] = {
        ...store.users[userIdx],
        name: s.user.name,
        district: s.user.district,
        skills: s.user.skills,
        companyName: s.user.companyName,
        tinNumber: s.user.tinNumber
      };
      writeStore(store);
    } else if (store.admin && store.admin.id === s.userId) {
      store.admin.name = s.user.name;
      store.admin.district = s.user.district;
      writeStore(store);
    }

    res.json({ user: s.user, message: 'Profile updated and persisted securely.' });
  });

  // Change Password (Authenticated User Only)
  app.post('/api/account/change-password', requireAuth, (req: AuthenticatedRequest, res) => {
    const s = req.authSession!;
    if (s.user.role === 'Administrator') {
      res.status(400).json({
        message: 'Administrator passcodes are managed via server secrets or admin setup.'
      });
      return;
    }

    const { currentPassword, newPassword } = req.body ?? {};
    if (typeof currentPassword !== 'string' || !currentPassword) {
      res.status(400).json({ message: 'Current password is required.' });
      return;
    }

    const passCheck = checkPasswordStrength(newPassword);
    if (!passCheck.valid) {
      res.status(400).json({
        message: `New password requirements not met: ${passCheck.missing.join(', ')}.`
      });
      return;
    }

    const store = readStore();
    const userIdx = store.users.findIndex((u) => u.id === s.userId);
    if (userIdx < 0) {
      res.status(404).json({ message: 'Account record not found.' });
      return;
    }

    if (!verifyPassword(currentPassword, store.users[userIdx].passwordHash)) {
      res.status(401).json({ message: 'Current password is incorrect.' });
      return;
    }

    store.users[userIdx].passwordHash = hashPassword(newPassword);
    writeStore(store);
    res.json({ ok: true, message: 'Password updated securely.' });
  });

  // Protected Admin Endpoint (Strictly Requires Authenticated Administrator)
  app.get('/api/admin/overview', requireAuth, requireAdmin, (_req, res) => {
    const store = readStore();
    res.json({
      registeredUsersCount: store.users.length,
      activeSessionsCount: activeSessions.size,
      recentUsers: store.users.slice(-10).map(sanitizeUser)
    });
  });

  // Attach Real-Time Cart, Orders, Market Prices, Live News & WebSocket Hub on same port
  const httpServer = http.createServer(app);

  function resolveUserIdFromReq(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.slice(7).trim();
    const parsed = verifySignedToken(token);
    if (!parsed) return null;
    const session = activeSessions.get(parsed.tid);
    if (!session || session.userId !== parsed.uid || Date.now() > session.expiresAt) {
      return null;
    }
    return session.userId;
  }

  attachRealtimeMarketAndNews(
    app,
    httpServer,
    resolveUserIdFromReq,
    (req, res, next) => {
      requireAuth(req as AuthenticatedRequest, res, () => {
        requireAdmin(req as AuthenticatedRequest, res, next);
      });
    }
  );

  // Vite dev middleware or static production assets
  const distDir = path.resolve(process.cwd(), 'dist');
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (process.env.npm_lifecycle_event === 'start' && fs.existsSync(path.join(distDir, 'index.html')));

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Umuhuza Connect server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Umuhuza Connect server:', err);
  process.exit(1);
});
