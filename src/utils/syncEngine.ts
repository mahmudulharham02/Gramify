import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { AppState, StudentProfile } from '../types';
import { loadAppState, saveAppState } from './storage';

const PENDING_SYNC_KEY = 'gramify_pending_sync_queue_v1';

interface PendingSyncQueue {
  profile?: StudentProfile;
  progress?: boolean;
  queuedAt: string;
}

let progressDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let activeUserGetter: (() => User | null) | null = null;
let activeStateGetter: (() => AppState) | null = null;
let onSyncCallback: ((timestamp: string) => void) | null = null;

/**
 * Mask an email string, e.g. "mahmudulharham@gmail.com" -> "m****@gmail.com"
 */
export function maskEmail(email?: string | null): string {
  if (!email) return 'User';
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf('@');
  if (atIndex <= 0) return trimmed;
  const localPart = trimmed.slice(0, atIndex);
  const domainPart = trimmed.slice(atIndex);
  const firstChar = localPart[0];
  return `${firstChar}****${domainPart}`;
}

/**
 * Format timestamp into human-readable sync string (e.g. "Just now", "2m ago", or time)
 */
export function formatLastSynced(timestamp?: string | null): string {
  if (!timestamp) return 'Never';
  try {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    if (diffMs < 60 * 1000) return 'Just now';
    if (diffMs < 60 * 60 * 1000) {
      const mins = Math.floor(diffMs / (60 * 1000));
      return `${mins}m ago`;
    }
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Recently';
  }
}

function getPendingQueue(): PendingSyncQueue | null {
  try {
    const raw = localStorage.getItem(PENDING_SYNC_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setPendingQueue(queue: PendingSyncQueue | null): void {
  try {
    if (!queue) {
      localStorage.removeItem(PENDING_SYNC_KEY);
    } else {
      localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(queue));
    }
  } catch {
    // Storage quota or error safe
  }
}

function markSyncedInStorage(timestamp: string): void {
  try {
    const state = loadAppState();
    state.lastSyncedAt = timestamp;
    saveAppState(state);
    if (onSyncCallback) {
      onSyncCallback(timestamp);
    }
  } catch {
    // safe
  }
}

/**
 * Pushes user profile to Supabase `profiles` table.
 */
export async function syncProfileToSupabase(
  profile: StudentProfile,
  user: User | null
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || !user) {
    return false;
  }

  if (!navigator.onLine) {
    const queue = getPendingQueue() || { queuedAt: new Date().toISOString() };
    queue.profile = profile;
    setPendingQueue(queue);
    return false;
  }

  try {
    const collegeValue = (profile.college_name || profile.institute || '').trim() || null;
    const rollValue = (profile.roll_id || profile.roll || '').trim() || null;
    const fullNameValue = (profile.name || '').trim() || null;

    const payload = {
      id: user.id,
      full_name: fullNameValue,
      roll_id: rollValue,
      gender: profile.gender || null,
      academic_group: profile.group || null,
      education_board: profile.board || null,
      college_name: collegeValue,
      avatar: profile.avatar || '🧑🎓',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('[Gramify Sync] Profile sync notice:', error.message);
      const queue = getPendingQueue() || { queuedAt: new Date().toISOString() };
      queue.profile = profile;
      setPendingQueue(queue);
      return false;
    }

    const timestamp = new Date().toISOString();
    markSyncedInStorage(timestamp);

    const queue = getPendingQueue();
    if (queue) {
      delete queue.profile;
      if (!queue.progress) {
        setPendingQueue(null);
      } else {
        setPendingQueue(queue);
      }
    }

    return true;
  } catch (err) {
    console.warn('[Gramify Sync] Profile sync error, queued for retry:', err);
    const queue = getPendingQueue() || { queuedAt: new Date().toISOString() };
    queue.profile = profile;
    setPendingQueue(queue);
    return false;
  }
}

/**
 * Reads user profile from Supabase `profiles` table and merges into localStorage.
 */
export async function fetchProfileFromSupabase(
  user: User | null
): Promise<StudentProfile | null> {
  if (!isSupabaseConfigured || !supabase || !user) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.warn('[Gramify Sync] Profile fetch notice:', error.message);
      return null;
    }

    if (!data) {
      return null;
    }

    const state = loadAppState();
    const collegeName = (data.college_name || data.institute || '').trim();
    const rollId = (data.roll_id || data.roll || '').trim() || null;
    const fullName = data.full_name || data.name || state.user.name;
    const groupName = data.academic_group || data.group || state.user.group;
    const boardName = data.education_board || data.board || state.user.board;
    const genderVal =
      data.gender === 'male' || data.gender === 'female' ? data.gender : state.user.gender;
    const avatarVal = data.avatar || state.user.avatar || '🧑🎓';

    const mergedProfile: StudentProfile = {
      ...state.user,
      name: fullName,
      roll: rollId,
      roll_id: rollId,
      college_name: collegeName,
      institute: collegeName,
      group: groupName,
      board: boardName,
      gender: genderVal,
      avatar: avatarVal,
    };

    state.user = mergedProfile;
    saveAppState(state);
    return mergedProfile;
  } catch (err) {
    console.warn('[Gramify Sync] Error fetching profile:', err);
    return null;
  }
}

/**
 * Pushes full progress to Supabase `user_progress` table.
 */
export async function syncProgressToSupabase(
  state: AppState,
  user: User | null
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || !user) {
    return false;
  }

  if (!navigator.onLine) {
    const queue = getPendingQueue() || { queuedAt: new Date().toISOString() };
    queue.progress = true;
    setPendingQueue(queue);
    return false;
  }

  try {
    const progressData = {
      xp: state.xp,
      level: state.level,
      streak: state.streak,
      bestStreak: state.bestStreak,
      coins: state.coins,
      diamonds: state.diamonds,
      hearts: state.hearts,
      topicProgress: state.topicProgress,
      badges: state.badges,
      inventory: state.inventory,
      settings: state.settings,
      recentScores: state.recentScores,
      lastStudyDate: state.lastStudyDate,
    };

    const { error } = await supabase.from('user_progress').upsert(
      {
        user_id: user.id,
        progress_data: progressData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    if (error) {
      // If table does not exist or user lacks permission, don't break app
      console.warn('[Gramify Sync] Progress sync notice:', error.message);
    }

    const timestamp = new Date().toISOString();
    markSyncedInStorage(timestamp);

    const queue = getPendingQueue();
    if (queue) {
      delete queue.progress;
      if (!queue.profile) {
        setPendingQueue(null);
      } else {
        setPendingQueue(queue);
      }
    }

    return true;
  } catch (err) {
    console.warn('[Gramify Sync] Progress sync failed, queued for retry:', err);
    const queue = getPendingQueue() || { queuedAt: new Date().toISOString() };
    queue.progress = true;
    setPendingQueue(queue);
    return false;
  }
}

/**
 * Flush all pending syncs immediately (profile + progress).
 */
export async function flushAllSync(): Promise<void> {
  if (!activeUserGetter || !activeStateGetter) return;
  const user = activeUserGetter();
  const state = activeStateGetter();
  if (!user) return;

  if (state.user) {
    await syncProfileToSupabase(state.user, user);
  }
  await syncProgressToSupabase(state, user);
}

/**
 * Debounced progress sync (runs 30 seconds after significant events: drill complete, exam complete, badge earned, level up).
 */
export function scheduleProgressSync(
  getState: () => AppState,
  getUser: () => User | null,
  onSynced?: (timestamp: string) => void
): void {
  activeStateGetter = getState;
  activeUserGetter = getUser;
  if (onSynced) {
    onSyncCallback = onSynced;
  }

  const user = getUser();
  if (!user || !isSupabaseConfigured) return;

  if (progressDebounceTimer) {
    clearTimeout(progressDebounceTimer);
  }

  progressDebounceTimer = setTimeout(async () => {
    const currentState = getState();
    const currentUser = getUser();
    if (currentUser) {
      await syncProgressToSupabase(currentState, currentUser);
    }
  }, 30000); // 30 seconds debounce
}

/**
 * Setup global listeners:
 * 1. Online event to retry queued syncs
 * 2. Visibility change to trigger immediate sync when tab hides
 */
export function initSyncListeners(
  getState: () => AppState,
  getUser: () => User | null,
  onSynced?: (timestamp: string) => void
): () => void {
  activeStateGetter = getState;
  activeUserGetter = getUser;
  if (onSynced) {
    onSyncCallback = onSynced;
  }

  const handleOnline = () => {
    const queue = getPendingQueue();
    const user = getUser();
    if (queue && user) {
      const state = getState();
      if (queue.profile && state.user) {
        syncProfileToSupabase(state.user, user);
      }
      if (queue.progress) {
        syncProgressToSupabase(state, user);
      }
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      const user = getUser();
      const state = getState();
      if (user && isSupabaseConfigured) {
        // Sync profile immediately
        if (state.user) {
          syncProfileToSupabase(state.user, user);
        }
        // Sync progress
        syncProgressToSupabase(state, user);
      }
    }
  };

  window.addEventListener('online', handleOnline);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    window.removeEventListener('online', handleOnline);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (progressDebounceTimer) {
      clearTimeout(progressDebounceTimer);
    }
  };
}
