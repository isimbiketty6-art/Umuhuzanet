import { useState, useEffect } from 'react';
import { UserRole } from '../types';
import {
  X,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Crown,
  KeyRound
} from 'lucide-react';
import {
  authStorage,
  AuthUser,
  validateRwandaNationalId,
  validateRwandaPhone,
  validateEmail,
  checkPasswordStrength
} from '../utils/authStorage';
import { PortalView } from '../types/agri';

export type { AuthUser };

export function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
  notify
}: {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'admin';
  onAuthSuccess: (user: AuthUser, targetPortal?: PortalView) => void;
  notify: (msg: string) => void;
}) {
  const [mode, setMode] = useState<'login' | 'register' | 'admin'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State (Strict True Info Required; non-admin roles only)
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('+250 ');
  const [regEmail, setRegEmail] = useState('');
  const [regNationalId, setRegNationalId] = useState('');
  const [regDistrict, setRegDistrict] = useState('Gasabo (Kigali)');
  const [regRole, setRegRole] = useState<Exclude<UserRole, 'Administrator'>>('Job seeker');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regTinNumber, setRegTinNumber] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Admin Login / First-Run Claim State
  const [adminConfigured, setAdminConfigured] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [claimName, setClaimName] = useState('');
  const [claimPhone, setClaimPhone] = useState('+250 ');
  const [claimNationalId, setClaimNationalId] = useState('');
  const [claimConfirmPasscode, setClaimConfirmPasscode] = useState('');

  const passwordStrength = checkPasswordStrength(
    mode === 'admin' && adminConfigured === false ? adminPasscode : regPassword
  );

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (isOpen && mode === 'admin') {
      setAdminConfigured(null);
      authStorage.getAdminStatus().then((status) => {
        setAdminConfigured(status.configured);
      });
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const res = await authStorage.login(loginIdentifier, loginPassword);
    setIsLoading(false);

    if (!res.success || !res.user) {
      setErrorMessage(res.message);
      return;
    }

    const targetPortalMap: Record<UserRole, PortalView> = {
      'Job seeker': 'human-os',
      'Employer': 'human-os',
      'Seller': 'seller',
      'Administrator': 'admin'
    };

    onAuthSuccess(res.user, targetPortalMap[res.user.role] || 'human-os');
    notify(res.message);
    setLoginPassword('');
    onClose();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regName.trim() || regName.trim().split(/\s+/).length < 2) {
      setErrorMessage('Please provide your full legal name (First & Last Name as on your National ID).');
      return;
    }

    const nidCheck = validateRwandaNationalId(regNationalId);
    if (!nidCheck.valid || !nidCheck.cleanId) {
      setErrorMessage(nidCheck.error || 'Invalid Rwanda National ID.');
      return;
    }

    const phoneCheck = validateRwandaPhone(regPhone);
    if (!phoneCheck.valid || !phoneCheck.normalized) {
      setErrorMessage(phoneCheck.error || 'Invalid Rwandan mobile phone number.');
      return;
    }

    const emailCheck = validateEmail(regEmail);
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error || 'Please enter a valid email address.');
      return;
    }

    const passCheck = checkPasswordStrength(regPassword);
    if (!passCheck.valid) {
      setErrorMessage(`Password requirement: ${passCheck.missing.join(', ')}.`);
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password confirmation.');
      return;
    }

    setIsLoading(true);
    const res = await authStorage.register({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: phoneCheck.normalized,
      nationalId: nidCheck.cleanId,
      district: regDistrict,
      role: regRole,
      companyName: regCompanyName.trim() || undefined,
      tinNumber: regTinNumber.trim() || undefined,
      password: regPassword
    });
    setIsLoading(false);

    if (!res.success || !res.user) {
      setErrorMessage(res.message);
      return;
    }

    onAuthSuccess(res.user, res.user.role === 'Seller' ? 'seller' : 'human-os');
    notify(res.message);
    setRegPassword('');
    setRegConfirmPassword('');
    onClose();
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const res = await authStorage.adminLogin(adminPasscode, adminEmail);
    setIsLoading(false);

    if (res.needsSetup) {
      setAdminConfigured(false);
      setErrorMessage(res.message);
      return;
    }

    if (!res.success || !res.user) {
      setErrorMessage(res.message);
      return;
    }

    onAuthSuccess(res.user, 'admin');
    notify(res.message);
    setAdminPasscode('');
    onClose();
  };

  const handleAdminClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!claimName.trim() || claimName.trim().split(/\s+/).length < 2) {
      setErrorMessage('Please enter the Administrator full legal name.');
      return;
    }
    const emailCheck = validateEmail(adminEmail);
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error || 'Please enter a valid Administrator email.');
      return;
    }
    const phoneCheck = validateRwandaPhone(claimPhone);
    if (!phoneCheck.valid || !phoneCheck.normalized) {
      setErrorMessage(phoneCheck.error || 'Invalid Rwandan phone number.');
      return;
    }
    const nidCheck = validateRwandaNationalId(claimNationalId);
    if (!nidCheck.valid || !nidCheck.cleanId) {
      setErrorMessage(nidCheck.error || 'Invalid Rwanda National ID.');
      return;
    }
    const passCheck = checkPasswordStrength(adminPasscode);
    if (!passCheck.valid) {
      setErrorMessage(`Admin passcode requirement: ${passCheck.missing.join(', ')}.`);
      return;
    }
    if (adminPasscode !== claimConfirmPasscode) {
      setErrorMessage('Passcodes do not match.');
      return;
    }

    setIsLoading(true);
    const res = await authStorage.claimAdmin({
      name: claimName.trim(),
      email: adminEmail.trim(),
      phone: phoneCheck.normalized,
      nationalId: nidCheck.cleanId,
      passcode: adminPasscode
    });
    setIsLoading(false);

    if (!res.success || !res.user) {
      setErrorMessage(res.message);
      return;
    }

    onAuthSuccess(res.user, 'admin');
    notify(res.message);
    setAdminPasscode('');
    setClaimConfirmPasscode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#071722] text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#041119]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-[#04131B] flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              {mode === 'admin' ? <Crown size={20} /> : <ShieldCheck size={20} />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>
                  {mode === 'login'
                    ? 'Secure Account Sign In'
                    : mode === 'register'
                    ? 'Verified Account Registration'
                    : adminConfigured === false
                    ? 'First-Run Administrator Setup'
                    : 'Administrator Authentication'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  Server Verified
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {mode === 'login'
                  ? 'Sign in with your Rwanda National ID, Phone (+250), or Email'
                  : mode === 'register'
                  ? 'Requires genuine 16-digit Rwandan NIDA & valid MTN/Airtel number'
                  : 'Protected administrative access verified by server credentials'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close auth dialog"
            className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Selector (Sign In / Register) */}
        {mode !== 'admin' && (
          <div className="grid grid-cols-2 border-b border-white/10 bg-[#071722] text-xs font-semibold">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`py-3 text-center border-b-2 transition ${
                mode === 'login'
                  ? 'border-emerald-400 text-emerald-300 font-bold bg-white/[0.02]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`py-3 text-center border-b-2 transition ${
                mode === 'register'
                  ? 'border-emerald-400 text-emerald-300 font-bold bg-white/[0.02]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs animate-in fade-in">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODE: LOGIN                                          */}
          {/* ==================================================== */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>National ID / Rwanda Phone / Email</span>
                  <span className="text-[10px] text-slate-400 font-mono">16-digit NID or +250...</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-3 text-slate-400">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. 1199880012345678 or name@example.rw"
                    className="w-full rounded-2xl border border-white/10 bg-[#041119] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500/50 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">Password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-3 text-slate-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-white/10 bg-[#041119] pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500/50 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#04131B] font-bold text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {isLoading ? 'Verifying Credentials...' : 'Sign In Securely'}
              </button>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  New to Umuhuza Connect?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage(null);
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    Create Verified Account
                  </button>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('admin');
                    setErrorMessage(null);
                  }}
                  className="text-slate-400 hover:text-purple-300 transition flex items-center gap-1"
                >
                  <KeyRound size={12} />
                  <span>Admin Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* ==================================================== */}
          {/* MODE: REGISTER (Strict True Info Required)            */}
          {/* ==================================================== */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>
                  Rwanda NIDA Compliance: Genuine 16-digit Rwandan National ID and active MTN/Airtel number are required.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diane Uwamahoro"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">
                    Rwanda National ID (16 Digits)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="1199880012345678"
                    value={regNationalId}
                    onChange={(e) => setRegNationalId(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">
                    Rwanda Phone (+250 78/79/72/73)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+250 788 123 456"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.rw"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Account Role</label>
                  <select
                    value={regRole}
                    onChange={(e) =>
                      setRegRole(e.target.value as Exclude<UserRole, 'Administrator'>)
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                  >
                    <option value="Job seeker">Job Seeker / Trainee</option>
                    <option value="Seller">Farmer / Cooperative Seller</option>
                    <option value="Employer">Employer / Business</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">District / Province</label>
                  <input
                    type="text"
                    placeholder="e.g. Gasabo (Kigali)"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {(regRole === 'Employer' || regRole === 'Seller') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-300">
                      Organization / Cooperative (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Musanze Fresh Co-op"
                      value={regCompanyName}
                      onChange={(e) => setRegCompanyName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-300">
                      RRA TIN Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="9-digit TIN"
                      value={regTinNumber}
                      onChange={(e) => setRegTinNumber(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300 flex items-center justify-between">
                    <span>Create Password</span>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        passwordStrength.label === 'Weak'
                          ? 'text-red-400'
                          : passwordStrength.label === 'Medium'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 8 chars, A-Z, 0-9, symbol"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {regPassword && passwordStrength.missing.length > 0 && (
                <div className="p-2.5 rounded-xl bg-black/20 border border-white/5 text-[10px] text-slate-400">
                  <span className="text-amber-400 font-semibold">Missing requirements:</span>{' '}
                  {passwordStrength.missing.join(' • ')}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#04131B] font-bold text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {isLoading ? 'Verifying & Registering...' : 'Verify NIDA & Create Account'}
              </button>
            </form>
          )}

          {/* ==================================================== */}
          {/* MODE: ADMINISTRATOR SIGN IN / FIRST-RUN SETUP         */}
          {/* ==================================================== */}
          {mode === 'admin' && (
            <div className="space-y-4">
              {adminConfigured === null ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Checking administrator configuration...
                </div>
              ) : adminConfigured === false ? (
                <form onSubmit={handleAdminClaim} className="space-y-3.5">
                  <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs">
                    <strong>First-Run Admin Setup:</strong> No Administrator passcode is configured on the server yet. Claim and set your Administrator credentials once below.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300">Admin Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nadine Mukamana"
                        value={claimName}
                        onChange={(e) => setClaimName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300">Admin Email</label>
                      <input
                        type="email"
                        required
                        placeholder="admin@umuhuza.rw"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300">Rwanda Phone</label>
                      <input
                        type="tel"
                        required
                        placeholder="+250 788 000 001"
                        value={claimPhone}
                        onChange={(e) => setClaimPhone(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300">Rwanda NIDA (16 digits)</label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        placeholder="1198580056789012"
                        value={claimNationalId}
                        onChange={(e) => setClaimNationalId(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300 flex items-center justify-between">
                        <span>Admin Passcode</span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {passwordStrength.label}
                        </span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Strong passcode"
                        value={adminPasscode}
                        onChange={(e) => setAdminPasscode(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300">Confirm Passcode</label>
                      <input
                        type="password"
                        required
                        placeholder="Re-enter passcode"
                        value={claimConfirmPasscode}
                        onChange={(e) => setClaimConfirmPasscode(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>

                  {adminPasscode && passwordStrength.missing.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-black/20 border border-white/5 text-[10px] text-slate-400">
                      <span className="text-amber-400 font-semibold">Missing requirements:</span>{' '}
                      {passwordStrength.missing.join(' • ')}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-lg shadow-purple-600/20 disabled:opacity-50"
                  >
                    {isLoading ? 'Securing Admin Account...' : 'Claim Administrator Credentials'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="w-full text-center text-xs text-slate-400 hover:text-white"
                  >
                    ← Back to User Sign In
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Administrator Email (Optional if using server secret)
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@umuhuza.rw"
                      className="w-full rounded-2xl border border-white/10 bg-[#041119] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500/50 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Administrator Passcode</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-3 text-slate-400">
                        <Lock size={15} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={adminPasscode}
                        onChange={(e) => setAdminPasscode(e.target.value)}
                        placeholder="Enter Administrator passcode"
                        className="w-full rounded-2xl border border-white/10 bg-[#041119] pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500/50 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-lg shadow-purple-600/20 disabled:opacity-50"
                  >
                    {isLoading ? 'Verifying Clearance...' : 'Sign In as Administrator'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage(null);
                    }}
                    className="w-full text-center text-xs text-slate-400 hover:text-white"
                  >
                    ← Back to User Sign In
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
