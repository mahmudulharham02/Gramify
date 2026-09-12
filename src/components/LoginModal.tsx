import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { soundManager } from '../utils/sound';
import { ThemeToggle } from './ThemeToggle';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast?: (msg: string) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onToast }) => {
  const { loginEmail, verifyOtp, isConfigured } = useAuth();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);

  const otpInputRef = useRef<HTMLInputElement>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('email');
      setEmail('');
      setOtp('');
      setError(null);
      setIsLoading(false);
      setCountdown(60);
    }
  }, [isOpen]);

  // Lock body scroll while modal is open & listen for Escape
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        soundManager.playClick();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (step !== 'otp' || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [step, countdown]);

  // Auto-focus OTP input on step change
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  const isEmailValid = EMAIL_REGEX.test(email.trim());

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid || isLoading) return;

    setError(null);
    setIsLoading(true);
    soundManager.playClick();

    const res = await loginEmail(email);
    setIsLoading(false);

    if (res.success) {
      soundManager.playClick();
      setStep('otp');
      setCountdown(60);
    } else {
      soundManager.playWrong();
      setError(res.error || 'Could not send verification code. Please check your email.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6 || isLoading) return;

    setError(null);
    setIsLoading(true);
    soundManager.playClick();

    const res = await verifyOtp(email, otp);
    setIsLoading(false);

    if (res.success) {
      soundManager.playCorrect();
      onToast?.('Logged in successfully');
      onClose();
    } else {
      soundManager.playWrong();
      setError(res.error || 'Invalid or expired verification code. Please try again.');
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isLoading) return;
    setError(null);
    setIsLoading(true);
    soundManager.playClick();

    const res = await loginEmail(email);
    setIsLoading(false);

    if (res.success) {
      setCountdown(60);
      onToast?.('A new 6-digit code was sent to your email.');
    } else {
      setError(res.error || 'Could not resend code. Please wait a moment.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-login"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          soundManager.playClick();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
    >
      <div
        className="relative w-full max-w-[420px] bg-[#1e293b] border border-white/[0.08] rounded-[16px] p-6 shadow-2xl space-y-5 animate-scale-up select-none"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(14, 165, 233, 0.1)',
        }}
      >
        {/* Top Right Controls: Theme Toggle & Close Button */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
          <ThemeToggle id="btn-login-theme-toggle" variant="icon" />
          <button
            id="btn-close-login-modal"
            type="button"
            disabled={isLoading}
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/[0.06] transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close login modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Back Button on OTP step */}
        {step === 'otp' && (
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              soundManager.playClick();
              setStep('email');
              setError(null);
            }}
            className="absolute top-4 left-4 p-2 rounded-xl text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/[0.06] transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1 text-[12px]"
            aria-label="Back to email input"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        {/* Step One: Email Input */}
        {step === 'email' ? (
          <form onSubmit={handleSendEmail} className="space-y-4 pt-1">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center mx-auto text-[#0ea5e9] mb-2">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-[20px] font-bold text-[#f8fafc] leading-tight">
                Login with Email
              </h2>
              <p className="text-[13px] text-[#94a3b8] leading-relaxed max-w-xs mx-auto">
                We will send a one-time code to your email. No password needed.
              </p>
            </div>

            {!isConfigured && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[12px] leading-relaxed">
                Supabase configuration required. Please define <code className="font-mono text-[11px]">VITE_SUPABASE_URL</code> and <code className="font-mono text-[11px]">VITE_SUPABASE_ANON_KEY</code>.
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="input-login-email" className="text-[12px] font-semibold text-[#f8fafc] block">
                Email Address
              </label>
              <input
                id="input-login-email"
                type="email"
                autoFocus
                required
                disabled={isLoading || !isConfigured}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="name@example.com"
                className="w-full h-[48px] px-3.5 rounded-xl bg-[#0f172a] border border-white/10 text-[14px] text-[#f8fafc] placeholder:text-[#94a3b8]/60 focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all disabled:opacity-50"
              />
              {error && (
                <p className="text-[12px] text-[#ef4444] pt-1">{error}</p>
              )}
            </div>

            <button
              id="btn-send-email-code"
              type="submit"
              disabled={!isEmailValid || isLoading || !isConfigured}
              className="w-full h-[48px] rounded-xl font-semibold text-[14px] bg-[#0ea5e9] hover:bg-[#0284c7] text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0ea5e9] shadow-md cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Code</span>
              )}
            </button>
          </form>
        ) : (
          /* Step Two: OTP Input */
          <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center mx-auto text-[#0ea5e9] mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-[20px] font-bold text-[#f8fafc] leading-tight">
                Enter Verification Code
              </h2>
              <p className="text-[13px] text-[#94a3b8] leading-relaxed max-w-xs mx-auto">
                Check your email for a 6-digit code sent to{' '}
                <span className="text-[#f8fafc] font-medium break-all">{email}</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <input
                id="input-login-otp"
                ref={otpInputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                disabled={isLoading}
                value={otp}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(cleaned);
                  if (error) setError(null);
                }}
                placeholder="123456"
                className="w-full h-[48px] px-3.5 rounded-xl bg-[#0f172a] border border-white/10 text-[20px] text-center tracking-[0.35em] font-mono text-[#f8fafc] placeholder:text-[#94a3b8]/30 placeholder:tracking-normal focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all disabled:opacity-50"
              />
              {error && (
                <p className="text-[12px] text-[#ef4444] text-center pt-1">{error}</p>
              )}
            </div>

            <button
              id="btn-verify-otp"
              type="submit"
              disabled={otp.trim().length !== 6 || isLoading}
              className="w-full h-[48px] rounded-xl font-semibold text-[14px] bg-[#0ea5e9] hover:bg-[#0284c7] text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0ea5e9] shadow-md cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify</span>
              )}
            </button>

            {/* Resend Link */}
            <div className="text-center pt-1">
              {countdown > 0 ? (
                <span className="text-[12px] text-[#94a3b8]">
                  Resend code in <span className="font-mono text-[#f8fafc]">{countdown}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-[12px] text-[#0ea5e9] hover:underline font-medium cursor-pointer"
                >
                  Resend code
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
