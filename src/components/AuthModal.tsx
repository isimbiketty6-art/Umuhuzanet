import { useState, useEffect } from 'react';
import { UserRole } from '../types';
import {
  X,
  Lock,
  Mail,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Check,
  Building2,
  Send,
  UserCheck
} from 'lucide-react';
import {
  authStorage,
  AuthUser,
  PRESET_CREDENTIALS,
  CredentialPreset,
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
  initialMode?: 'login' | 'register' | 'forgot';
  onAuthSuccess: (user: AuthUser, targetPortal?: PortalView) => void;
  notify: (msg: string) => void;
  onOpenCredentialsDirectory?: () => void;
}) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('aline.uwimana@gmail.com');
  const [loginPassword, setLoginPassword] = useState('Password123!');

  // Register State (Strict True Info Required)
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('+250 788 000 000');
  const [regEmail, setRegEmail] = useState('');
  const [regNationalId, setRegNationalId] = useState('');
  const [regDistrict, setRegDistrict] = useState('Gasabo (Kigali)');
  const [regRole, setRegRole] = useState<UserRole>('Job seeker');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regTinNumber, setRegTinNumber] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Password Strength State
  const passwordStrength = checkPasswordStrength(regPassword);

  // Forgot Password State
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState('aline.uwimana@gmail.com');
  const [dispatchedOtp, setDispatchedOtp] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // ----------------------------------------------------
  // LOGIN HANDLER (Strong Verification)
  // ----------------------------------------------------
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = authStorage.verifyCredentials(loginIdentifier, loginPassword);

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

      const selectedPortal = targetPortalMap[res.user.role] || 'human-os';
      onAuthSuccess(res.user, selectedPortal);
      notify(`Welcome back, ${res.user.name}! Authenticated with verified Rwanda session.`);
      onClose();
    }, 250);
  };

  // Instant Account Switch Login
  const handleDirectLogin = (preset: CredentialPreset) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      const res = authStorage.verifyCredentials(preset.email, preset.password);
      if (res.success && res.user) {
        onAuthSuccess(res.user, preset.targetPortal as PortalView);
        notify(`Switched to ${res.user.name} (${res.user.role}) • NIDA Verified`);
        onClose();
      } else {
        setErrorMessage(res.message);
      }
    }, 150);
  };

  // ----------------------------------------------------
  // REGISTRATION HANDLER (Strict True Info Required)
  // ----------------------------------------------------
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Full Legal Name validation
    if (!regName.trim() || regName.trim().split(' ').length < 2) {
      setErrorMessage('Please provide your full legal name (First & Last Name as on your National ID).');
      return;
    }

    // 2. Rwanda National ID validation (16 numeric digits starting with 1)
    const nidCheck = validateRwandaNationalId(regNationalId);
    if (!nidCheck.valid) {
      setErrorMessage(nidCheck.error || 'Invalid Rwanda National ID.');
      return;
    }

    // 3. Rwanda Mobile Phone validation
    const phoneCheck = validateRwandaPhone(regPhone);
    if (!phoneCheck.valid) {
      setErrorMessage(phoneCheck.error || 'Invalid Rwandan mobile phone number.');
      return;
    }

    // 4. Email validation
    const emailCheck = validateEmail(regEmail);
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error || 'Please enter a valid email address.');
      return;
    }

    // 5. Password criteria check
    if (!passwordStrength.valid) {
      setErrorMessage(`Password requirement: ${passwordStrength.missing.join(', ')}.`);
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password confirmation.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = authStorage.registerUser({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: phoneCheck.normalized || regPhone.trim(),
        nationalId: nidCheck.cleanId!,
        district: regDistrict,
        role: regRole,
        companyName: regCompanyName.trim() || undefined,
        tinNumber: regTinNumber.trim() || undefined,
        password: regPassword
      });

      if (!res.success || !res.user) {
        setErrorMessage(res.message);
        return;
      }

      onAuthSuccess(res.user, res.user.role === 'Seller' ? 'seller' : 'human-os');
      notify(`Account created and NIDA verified! Welcome, ${res.user.name}.`);
      onClose();
    }, 300);
  };

  // ----------------------------------------------------
  // PASSWORD RESET HANDLER
  // ----------------------------------------------------
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const res = authStorage.requestPasswordResetOtp(forgotIdentifier);
    if (!res.success) {
      setErrorMessage(res.message);
      return;
    }
    setDispatchedOtp(res.otp || null);
    setOtpInput(res.otp || '');
    setForgotStep(2);
    notify(res.message);
  };

  const handleVerifyOtpAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    const res = authStorage.resetPasswordWithOtp(forgotIdentifier, otpInput, newPassword);
    if (!res.success || !res.user) {
      setErrorMessage(res.message);
      return;
    }
    onAuthSuccess(res.user);
    notify(res.message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#071722] text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#041119]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-[#04131B] flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>
                  {mode === 'login'
                    ? 'Secure Authentication'
                    : mode === 'register'
                    ? 'Rwanda Verified Registration'
                    : 'Security PIN Recovery'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  NIDA Standard
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {mode === 'login'
                  ? 'Sign in using your Rwanda National ID, Phone (+250) or Email'
                  : 'Requires genuine 16-digit Rwandan NIDA & valid MTN/Airtel number'}
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

        {/* Tab Selector */}
        {mode !== 'forgot' && (
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
              Sign In to Session
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
              Register New Profile
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Error Banner */}
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
                    placeholder="e.g. 1199880012345678 or aline.uwimana@gmail.com"
                    className="w-full rounded-2xl border border-white/10 bg-[#041119] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500/50 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                  <label>Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setForgotIdentifier(loginIdentifier);
                      setErrorMessage(null);
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-3 text-slate-400">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
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
                {isLoading ? 'Verifying Credentials...' : 'Sign In with Verified Session'}
              </button>

              {/* 1-Click Authenticate Quick Accounts */}
              <div className="pt-3 border-t border-white/10">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <UserCheck size={13} className="text-emerald-400" />
                    <span>Quick Switch Verified Accounts:</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">1-Tap Auth</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {PRESET_CREDENTIALS.map((preset) => (
                    <button
                      key={preset.email}
                      type="button"
                      onClick={() => handleDirectLogin(preset)}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-emerald-500/10 hover:border-emerald-500/30 text-left transition group"
                    >
                      <div className="font-bold text-white text-xs truncate group-hover:text-emerald-300">
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                        {preset.role}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate mt-0.5">
                        NID: {preset.nationalId.substring(0, 6)}...
                      </div>
                    </button>
                  ))}
                </div>
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
                  Rwanda NIDA Compliance: Only genuine 16-digit Rwandan National IDs and active MTN/Airtel numbers are accepted.
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
                    placeholder="1 1998 8 0012345 1 20"
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
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-white/10 bg-[#041119] px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
                  >
                    <option value="Job seeker">Job Seeker / Trainee</option>
                    <option value="Seller">Farmer / Cooperative Seller</option>
                    <option value="Employer">Employer / Business</option>
                    <option value="Administrator">Platform Administrator</option>
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

              {/* Password & Live Strength Checker */}
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

              {/* Missing password requirements tag list */}
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
                {isLoading ? 'Registering...' : 'Verify NIDA & Create Account'}
              </button>
            </form>
          )}

          {/* ==================================================== */}
          {/* MODE: FORGOT PASSWORD (SMS PIN)                      */}
          {/* ==================================================== */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {forgotStep === 1 ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      Registered Phone Number or Email
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="+250 788 123 456 or name@gmail.com"
                      className="w-full rounded-2xl border border-white/10 bg-[#041119] px-4 py-2.5 text-xs text-white outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#04131B] font-bold text-xs transition"
                  >
                    Send 6-Digit SMS PIN (MTN Rwanda)
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-full text-center text-xs text-slate-400 hover:text-white"
                  >
                    ← Back to Sign In
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                    <span>SMS PIN dispatched! Simulated Code:</span>
                    <span className="font-mono font-bold text-sm bg-emerald-500/20 px-2 py-0.5 rounded">
                      {dispatchedOtp}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Enter 6-Digit PIN</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#041119] px-4 py-2 text-center text-base font-mono tracking-widest text-emerald-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">New Strong Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className="w-full rounded-xl border border-white/10 bg-[#041119] px-4 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-type password"
                      className="w-full rounded-xl border border-white/10 bg-[#041119] px-4 py-2 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#04131B] font-bold text-xs transition"
                  >
                    Update Password & Launch Session
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
