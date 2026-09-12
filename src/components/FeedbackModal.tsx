import React, { useState, useEffect, useCallback } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { X, CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { soundManager } from '../utils/sound';

// =========================================================================
// FORMSPREE CONFIGURATION
// Formspree endpoint and Form ID for user feedback & inquiries:
// Endpoint: https://formspree.io/f/mqpkwojz
// =========================================================================
export const FORMSPREE_FORM_ID = 'mqpkwojz';
export const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;
export const RECIPIENT_EMAIL = 'mahmudulharham@outlook.com';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Formspree React Hook integration
  const [formspreeState, handleFormspreeSubmit, resetFormspree] = useForm(FORMSPREE_FORM_ID);
  const isLoading = formspreeState.submitting;

  // React to successful submission from Formspree
  useEffect(() => {
    if (formspreeState.succeeded) {
      soundManager.playCorrect();
      setIsSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [formspreeState.succeeded, onSuccess]);

  // Lock body scroll while modal is open & listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundManager.playClick();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset form when reopened
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setApiError(null);
      setHasAttemptedSubmit(false);
      resetFormspree();
    }
  }, [isOpen, resetFormspree]);

  const validate = useCallback((): { isValid: boolean; errors: FormErrors } => {
    const errors: FormErrors = {};

    if (!firstName.trim()) {
      errors.firstName = 'First name is required.';
    } else if (firstName.trim().length > 30) {
      errors.firstName = 'First name cannot exceed 30 characters.';
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last name is required.';
    } else if (lastName.trim().length > 30) {
      errors.lastName = 'Last name cannot exceed 30 characters.';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!message.trim()) {
      errors.message = 'Message is required.';
    } else if (message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters.';
    } else if (message.trim().length > 500) {
      errors.message = 'Message cannot exceed 500 characters.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, [firstName, lastName, email, message]);

  const { errors } = validate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    setApiError(null);

    const validation = validate();
    if (!validation.isValid) {
      soundManager.playWrong();
      return;
    }

    try {
      await handleFormspreeSubmit(e);
    } catch (err: unknown) {
      console.error('Formspree feedback submission error:', err);
      soundManager.playWrong();
      setApiError('Something went wrong. Please try again later.');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      soundManager.playClick();
      onClose();
    }
  };

  if (!isOpen) return null;

  const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(
    'Gramify Feedback'
  )}&body=${encodeURIComponent(
    `First Name: ${firstName.trim()}\nLast Name: ${lastName.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`
  )}`;

  return (
    <div
      id="modal-feedback"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto transition-opacity duration-200"
    >
      <div
        className="relative w-full max-w-lg bg-[#0d121f]/95 border border-white/[0.08] rounded-2xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto transform transition-all duration-200 animate-scale-up"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(6, 182, 212, 0.1)',
        }}
      >
        {/* Close Button */}
        <button
          id="btn-close-feedback-modal"
          type="button"
          disabled={isLoading}
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors disabled:opacity-50"
          aria-label="Close feedback modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Success State View */
          <div className="py-8 text-center space-y-5 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400 shadow-[0_0_25px_rgba(132,204,22,0.25)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Thank you for your feedback
              </h2>
              <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                We will get back to you at your email if needed.
              </p>
            </div>

            <div className="pt-3">
              <button
                id="btn-feedback-success-close"
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all active:scale-95 shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Form Content View */
          <div className="space-y-5">
            {/* Header */}
            <div className="pr-8 space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Send Feedback
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Help us improve Gramify for HSC students everywhere
              </p>
            </div>

            {/* Error Banner */}
            {apiError && (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs space-y-2.5 animate-shake">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">
                    Something went wrong. Please try again or email us directly at{' '}
                    <a
                      href={mailtoUrl}
                      className="text-rose-300 underline font-bold hover:text-white"
                    >
                      {RECIPIENT_EMAIL}
                    </a>
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setApiError(null)}
                    className="px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-white font-bold text-[11px] border border-rose-600 transition-colors"
                  >
                    Try Again
                  </button>
                  <a
                    href={mailtoUrl}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-[11px] border border-slate-700 transition-colors"
                  >
                    Send Direct Email
                  </a>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-1">
              {/* General Formspree errors */}
              <ValidationError errors={formspreeState.errors} className="text-xs text-rose-400 font-medium" />

              {/* First Name & Last Name in responsive 2-column on sm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="feedback-first-name"
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                  >
                    First Name
                  </label>
                  <input
                    id="feedback-first-name"
                    name="firstName"
                    type="text"
                    maxLength={30}
                    disabled={isLoading}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Alamin"
                    className={`w-full bg-slate-900/90 border rounded-xl px-3.5 py-3 text-base text-white placeholder-slate-500 transition-all focus:outline-none disabled:opacity-50 ${
                      hasAttemptedSubmit && errors.firstName
                        ? 'border-rose-500 ring-1 ring-rose-500/30'
                        : 'border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
                    }`}
                  />
                  {hasAttemptedSubmit && errors.firstName && (
                    <p className="text-xs text-rose-400 mt-1 font-medium">
                      {errors.firstName}
                    </p>
                  )}
                  <ValidationError prefix="First Name" field="firstName" errors={formspreeState.errors} className="text-xs text-rose-400 mt-1 font-medium" />
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="feedback-last-name"
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                  >
                    Last Name
                  </label>
                  <input
                    id="feedback-last-name"
                    name="lastName"
                    type="text"
                    maxLength={30}
                    disabled={isLoading}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Russel"
                    className={`w-full bg-slate-900/90 border rounded-xl px-3.5 py-3 text-base text-white placeholder-slate-500 transition-all focus:outline-none disabled:opacity-50 ${
                      hasAttemptedSubmit && errors.lastName
                        ? 'border-rose-500 ring-1 ring-rose-500/30'
                        : 'border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
                    }`}
                  />
                  {hasAttemptedSubmit && errors.lastName && (
                    <p className="text-xs text-rose-400 mt-1 font-medium">
                      {errors.lastName}
                    </p>
                  )}
                  <ValidationError prefix="Last Name" field="lastName" errors={formspreeState.errors} className="text-xs text-rose-400 mt-1 font-medium" />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="feedback-email"
                  className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                >
                  Email
                </label>
                <input
                  id="feedback-email"
                  name="email"
                  type="email"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full bg-slate-900/90 border rounded-xl px-3.5 py-3 text-base text-white placeholder-slate-500 transition-all focus:outline-none disabled:opacity-50 ${
                    hasAttemptedSubmit && errors.email
                      ? 'border-rose-500 ring-1 ring-rose-500/30'
                      : 'border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
                  }`}
                />
                {hasAttemptedSubmit && errors.email && (
                  <p className="text-xs text-rose-400 mt-1 font-medium">
                    {errors.email}
                  </p>
                )}
                <ValidationError prefix="Email" field="email" errors={formspreeState.errors} className="text-xs text-rose-400 mt-1 font-medium" />
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="feedback-message"
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block"
                  >
                    Message
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      message.length > 500
                        ? 'text-rose-400 font-bold'
                        : message.length >= 10
                        ? 'text-slate-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {message.length} of 500
                  </span>
                </div>
                <textarea
                  id="feedback-message"
                  name="message"
                  rows={4}
                  maxLength={500}
                  disabled={isLoading}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you like or how we can make Gramify even better..."
                  className={`w-full min-h-[120px] bg-slate-900/90 border rounded-xl px-3.5 py-3 text-base text-white placeholder-slate-500 transition-all resize-y focus:outline-none disabled:opacity-50 ${
                    hasAttemptedSubmit && errors.message
                      ? 'border-rose-500 ring-1 ring-rose-500/30'
                      : 'border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
                  }`}
                />
                {hasAttemptedSubmit && errors.message && (
                  <p className="text-xs text-rose-400 mt-1 font-medium">
                    {errors.message}
                  </p>
                )}
                <ValidationError prefix="Message" field="message" errors={formspreeState.errors} className="text-xs text-rose-400 mt-1 font-medium" />
              </div>

              {/* Submit Button (56px tall = h-14) */}
              <div className="pt-2">
                <button
                  id="btn-submit-feedback"
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-base shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;

