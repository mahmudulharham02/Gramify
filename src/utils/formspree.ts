import { AppState, StudentProfile } from '../types';

// =========================================================================
// FORMSPREE ONBOARDING CONFIGURATION
// Dedicated Formspree endpoint for student first-time onboarding submissions.
// Can be customized via VITE_FORMSPREE_ONBOARDING_ENDPOINT in .env
// =========================================================================
export const DEFAULT_FORMSPREE_FORM_ID = 'mqpkwojz';
export const DEFAULT_FORMSPREE_ONBOARDING_ENDPOINT = 'https://formspree.io/f/mqpkwojz';

export const ONBOARDING_SUBMITTED_KEY = 'gramify_onboarding_formspree_submitted_v1';
export const PENDING_ONBOARDING_QUEUE_KEY = 'gramify_pending_onboarding_formspree_v1';
const CLIENT_USER_ID_KEY = 'gramify_client_device_user_id_v1';

export interface FormspreeOnboardingPayload {
  studentName: string;
  roll: string;
  college: string;
  academicGroup: string;
  educationBoard: string;
  gender: string;
  avatar: string;
  title: string;
  joinedAt: string;
  submittedAt: string;
  clientUserId: string;
  userEmail: string;
  formType: string;
  event: string;
  source: string;
  platform: string;
  language: string;
  screenResolution: string;
  _subject: string;
}

export interface SubmissionResult {
  success: boolean;
  alreadySubmitted?: boolean;
  queuedOffline?: boolean;
  error?: string;
  submittedAt?: string;
}

// In-flight concurrency lock to prevent duplicate parallel requests (e.g. rapid clicks)
let isSubmittingMutex = false;

/**
 * Get or generate a persistent anonymous client device/user UUID.
 * This provides an immutable identifier for deduplication audit in Formspree.
 */
export function getOrCreateClientUserId(): string {
  try {
    const existing = localStorage.getItem(CLIENT_USER_ID_KEY);
    if (existing && existing.trim()) {
      return existing.trim();
    }
    const newId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `usr_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(CLIENT_USER_ID_KEY, newId);
    return newId;
  } catch {
    return `usr_${Date.now()}`;
  }
}

/**
 * Resolves the dedicated Formspree onboarding endpoint.
 * Supports full URLs (e.g. https://formspree.io/f/mqkenbyp) or bare form IDs (e.g. mqkenbyp).
 */
export function getFormspreeOnboardingEndpoint(): string {
  const envEndpoint = (import.meta.env.VITE_FORMSPREE_ONBOARDING_ENDPOINT as string | undefined)?.trim();
  if (envEndpoint) {
    if (envEndpoint.startsWith('http://') || envEndpoint.startsWith('https://')) {
      return envEndpoint;
    }
    return `https://formspree.io/f/${envEndpoint}`;
  }
  return DEFAULT_FORMSPREE_ONBOARDING_ENDPOINT;
}

/**
 * Checks whether user onboarding has already been submitted to Formspree.
 * Validates across both AppState and the persistent dedicated localStorage lock.
 */
export function isOnboardingAlreadySubmitted(state?: AppState | null): boolean {
  // Check AppState flag if provided
  if (state?.onboardingSubmittedToFormspree === true) {
    return true;
  }

  // Check persistent dedicated localStorage submission record
  try {
    const record = localStorage.getItem(ONBOARDING_SUBMITTED_KEY);
    if (record) {
      const parsed = JSON.parse(record);
      if (parsed && parsed.submitted === true) {
        return true;
      }
    }
  } catch {
    // If parsing fails but key exists, treat as submitted to be safe against duplicates
    if (localStorage.getItem(ONBOARDING_SUBMITTED_KEY)) {
      return true;
    }
  }

  return false;
}

/**
 * Marks onboarding as submitted in persistent storage.
 */
export function markOnboardingAsSubmitted(details: {
  submittedAt?: string;
  studentName?: string;
  clientUserId?: string;
}): void {
  try {
    const record = {
      submitted: true,
      submittedAt: details.submittedAt || new Date().toISOString(),
      studentName: details.studentName || '',
      clientUserId: details.clientUserId || getOrCreateClientUserId(),
      endpoint: getFormspreeOnboardingEndpoint(),
    };
    localStorage.setItem(ONBOARDING_SUBMITTED_KEY, JSON.stringify(record));
    // Clear any pending queue since submission has completed
    localStorage.removeItem(PENDING_ONBOARDING_QUEUE_KEY);
  } catch (e) {
    console.warn('Failed to save onboarding Formspree submission lock:', e);
  }
}

/**
 * Retrieves the timestamp of when onboarding was submitted to Formspree, if available.
 */
export function getOnboardingSubmittedAt(): string | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_SUBMITTED_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.submittedAt || null;
    }
  } catch {}
  return null;
}

/**
 * Formats student profile and environment context into a structured Formspree payload.
 */
export function buildOnboardingPayload(
  profile: Partial<StudentProfile>,
  userEmail?: string | null
): FormspreeOnboardingPayload {
  const clientUserId = getOrCreateClientUserId();
  const studentName = (profile.name || '').trim() || 'New HSC Student';
  const roll = (profile.roll || profile.roll_id || '').trim() || 'N/A';
  const college = (profile.college_name || profile.institute || '').trim() || 'N/A';
  const academicGroup = profile.group || 'Science';
  const educationBoard = profile.board || 'Dhaka';
  const gender = profile.gender ? (profile.gender === 'male' ? 'Male' : 'Female') : 'Not Specified';
  const avatar = profile.avatar || '🧑🎓';
  const title = profile.title || 'Apprentice 🐣';
  const joinedAt = profile.joinedAt || new Date().toISOString();
  const submittedAt = new Date().toISOString();

  let screenResolution = 'Unknown';
  let platform = 'Browser';
  let language = 'en';

  if (typeof window !== 'undefined') {
    screenResolution = `${window.innerWidth}x${window.innerHeight} (Screen: ${window.screen?.width || 0}x${window.screen?.height || 0})`;
    platform = navigator.userAgent || 'Web Client';
    language = navigator.language || 'en';
  }

  return {
    studentName,
    roll,
    college,
    academicGroup,
    educationBoard,
    gender,
    avatar,
    title,
    joinedAt,
    submittedAt,
    clientUserId,
    userEmail: userEmail ? userEmail.trim() : 'Anonymous / Offline Student',
    formType: 'Student Onboarding (First-Time Completion)',
    event: 'onboarding_completed',
    source: 'Gramify - Bangladesh HSC Grammar Master',
    platform,
    language,
    screenResolution,
    _subject: `[Gramify] New Student Onboarding: ${studentName} (${educationBoard} - ${academicGroup})`,
  };
}

/**
 * Automatically sends user onboarding data to Formspree on first-time completion.
 * Enforces strict exactly-once submission semantics:
 * 1. Fast-path check: immediately returns if already submitted.
 * 2. In-memory mutex: prevents concurrent parallel clicks / requests.
 * 3. Offline queuing: saves to pending queue if offline, ready for background delivery.
 * 4. Atomic storage lock: permanently records completion upon HTTP 200.
 */
export async function sendOnboardingToFormspree(
  profile: Partial<StudentProfile>,
  options?: {
    state?: AppState | null;
    userEmail?: string | null;
    forceRetryQueued?: boolean;
  }
): Promise<SubmissionResult> {
  // 1. Exactly-once guard: If already submitted, abort immediately
  if (!options?.forceRetryQueued && isOnboardingAlreadySubmitted(options?.state)) {
    return {
      success: true,
      alreadySubmitted: true,
      submittedAt: getOnboardingSubmittedAt() || undefined,
    };
  }

  // 2. Concurrency guard: Mutex against simultaneous in-flight requests
  if (isSubmittingMutex) {
    return {
      success: false,
      error: 'Submission already in progress.',
    };
  }

  isSubmittingMutex = true;
  const payload = buildOnboardingPayload(profile, options?.userEmail);
  const endpoint = getFormspreeOnboardingEndpoint();

  // 3. Offline handling: Queue for background sync when device reconnects
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    try {
      localStorage.setItem(PENDING_ONBOARDING_QUEUE_KEY, JSON.stringify(payload));
    } catch {}
    isSubmittingMutex = false;
    return {
      success: false,
      queuedOffline: true,
      error: 'Device is offline. Onboarding submission has been queued for background delivery.',
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.error || errorData?.errors?.[0]?.message || `Formspree responded with HTTP ${response.status}`;

      // Queue for automatic retry on temporary or 5xx server issues
      if (response.status >= 500 || response.status === 429) {
        try {
          localStorage.setItem(PENDING_ONBOARDING_QUEUE_KEY, JSON.stringify(payload));
        } catch {}
      }

      throw new Error(errorMessage);
    }

    // 4. Success: Mark permanently in localStorage so it never submits again
    markOnboardingAsSubmitted({
      submittedAt: payload.submittedAt,
      studentName: payload.studentName,
      clientUserId: payload.clientUserId,
    });

    return {
      success: true,
      alreadySubmitted: false,
      submittedAt: payload.submittedAt,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to submit onboarding data to Formspree';
    console.warn('Formspree onboarding submission error:', msg);

    // If network error occurred, safely queue
    try {
      if (!isOnboardingAlreadySubmitted(options?.state)) {
        localStorage.setItem(PENDING_ONBOARDING_QUEUE_KEY, JSON.stringify(payload));
      }
    } catch {}

    return {
      success: false,
      error: msg,
    };
  } finally {
    isSubmittingMutex = false;
  }
}

/**
 * Flushes any pending offline onboarding submission queue when connectivity is restored.
 */
export async function flushPendingOnboardingQueue(
  stateGetter?: () => AppState | null,
  userEmailGetter?: () => string | null,
  onSuccess?: (submittedAt: string) => void
): Promise<boolean> {
  if (isOnboardingAlreadySubmitted(stateGetter ? stateGetter() : null)) {
    try {
      localStorage.removeItem(PENDING_ONBOARDING_QUEUE_KEY);
    } catch {}
    return true;
  }

  let rawQueue: string | null = null;
  try {
    rawQueue = localStorage.getItem(PENDING_ONBOARDING_QUEUE_KEY);
  } catch {}

  if (!rawQueue) {
    return false;
  }

  let queuedPayload: FormspreeOnboardingPayload | null = null;
  try {
    queuedPayload = JSON.parse(rawQueue);
  } catch {
    localStorage.removeItem(PENDING_ONBOARDING_QUEUE_KEY);
    return false;
  }

  if (!queuedPayload) {
    return false;
  }

  const endpoint = getFormspreeOnboardingEndpoint();
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queuedPayload),
    });

    if (response.ok) {
      markOnboardingAsSubmitted({
        submittedAt: queuedPayload.submittedAt || new Date().toISOString(),
        studentName: queuedPayload.studentName,
        clientUserId: queuedPayload.clientUserId,
      });
      if (onSuccess) {
        onSuccess(queuedPayload.submittedAt || new Date().toISOString());
      }
      return true;
    }
  } catch (e) {
    console.warn('Failed to flush pending Formspree onboarding queue:', e);
  }

  return false;
}

/**
 * Initializes listeners for online status and visibility change to automatically
 * flush any pending offline onboarding data.
 */
export function initOnboardingFormspreeSyncListener(
  stateGetter: () => AppState,
  userEmailGetter?: () => string | null,
  onSuccess?: (submittedAt: string) => void
): () => void {
  const handleOnline = () => {
    flushPendingOnboardingQueue(stateGetter, userEmailGetter, onSuccess);
  };

  const handleVisibility = () => {
    if (document.visibilityState === 'visible' && navigator.onLine) {
      flushPendingOnboardingQueue(stateGetter, userEmailGetter, onSuccess);
    }
  };

  window.addEventListener('online', handleOnline);
  document.addEventListener('visibilitychange', handleVisibility);

  // Check on startup if online
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    setTimeout(() => {
      flushPendingOnboardingQueue(stateGetter, userEmailGetter, onSuccess);
    }, 2000);
  }

  return () => {
    window.removeEventListener('online', handleOnline);
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}
