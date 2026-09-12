import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { StudentProfile } from '../types';
import { loadAppState, saveAppState } from '../utils/storage';
import {
  syncProfileToSupabase,
  fetchProfileFromSupabase,
  syncProgressToSupabase,
} from '../utils/syncEngine';

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  lastSynced: string | null;
  setLastSynced: (timestamp: string) => void;
  loginEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  syncProfile: (profileOverride?: Partial<StudentProfile>) => Promise<boolean>;
  fetchProfile: () => Promise<StudentProfile | null>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(isSupabaseConfigured);
  const [lastSynced, setLastSynced] = useState<string | null>(() => {
    try {
      const state = loadAppState();
      return state.lastSyncedAt || null;
    } catch {
      return null;
    }
  });

  // Check initial session & subscribe to auth state changes across tabs
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // 1. Initial session check
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (!isMounted) return;
        if (error) {
          console.warn('[Gramify Auth] Initial session fetch notice:', error.message);
        }
        if (session?.user) {
          setUser(session.user);
          // Update localStorage supabaseUserId and fetch remote profile
          try {
            const state = loadAppState();
            if (state.supabaseUserId !== session.user.id) {
              state.supabaseUserId = session.user.id;
              saveAppState(state);
            }
            fetchProfileFromSupabase(session.user);
          } catch {
            // safe
          }
        } else {
          setUser(null);
        }
      })
      .catch((err) => {
        console.warn('[Gramify Auth] Session fetch error:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    // 2. Auth state subscription
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session: Session | null) => {
      if (!isMounted) return;
      const currentUser = session?.user || null;
      setUser(currentUser);

      try {
        const state = loadAppState();
        if (currentUser) {
          state.supabaseUserId = currentUser.id;
          saveAppState(state);
          // Fetch remote profile from Supabase and merge, then sync
          fetchProfileFromSupabase(currentUser).then((remoteProfile) => {
            const activeProfile = remoteProfile || state.user;
            if (activeProfile) {
              syncProfileToSupabase(activeProfile, currentUser).then((ok) => {
                if (ok) {
                  setLastSynced(new Date().toISOString());
                }
              });
            }
          });
        } else if (event === 'SIGNED_OUT') {
          state.supabaseUserId = null;
          saveAppState(state);
        }
      } catch (err) {
        console.warn('[Gramify Auth] Auth state update notice:', err);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshSession = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    } catch {
      // safe
    }
  }, []);

  const loginEmail = useCallback(async (email: string) => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Cloud authentication is not configured in this environment.',
      };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send verification code.';
      return { success: false, error: msg };
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string) => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Cloud authentication is not configured in this environment.',
      };
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: token.trim(),
        type: 'email',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        setUser(data.user);
        const state = loadAppState();
        state.supabaseUserId = data.user.id;
        saveAppState(state);

        // Immediate profile fetch and sync on successful login
        fetchProfileFromSupabase(data.user).then((remoteProfile) => {
          const profileToSync = remoteProfile || state.user;
          if (profileToSync) {
            syncProfileToSupabase(profileToSync, data.user).then((ok) => {
              if (ok) {
                const now = new Date().toISOString();
                setLastSynced(now);
              }
            });
          }
        });
        syncProgressToSupabase(state, data.user);
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      return { success: false, error: msg };
    }
  }, []);

  const logout = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setUser(null);
      return;
    }

    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[Gramify Auth] SignOut notice:', err);
    } finally {
      setUser(null);
      try {
        const state = loadAppState();
        state.supabaseUserId = null;
        saveAppState(state);
      } catch {
        // safe
      }
    }
  }, []);

  const fetchProfile = useCallback(async (): Promise<StudentProfile | null> => {
    if (!isSupabaseConfigured || !supabase || !user) {
      return null;
    }
    try {
      const profile = await fetchProfileFromSupabase(user);
      if (profile) {
        setLastSynced(new Date().toISOString());
      }
      return profile;
    } catch {
      return null;
    }
  }, [user]);

  const syncProfile = useCallback(
    async (profileOverride?: Partial<StudentProfile>): Promise<boolean> => {
      if (!isSupabaseConfigured || !supabase || !user) {
        return false;
      }

      try {
        const state = loadAppState();
        const effectiveProfile: StudentProfile = {
          ...state.user,
          ...(profileOverride || {}),
        };

        const ok = await syncProfileToSupabase(effectiveProfile, user);
        if (ok) {
          const now = new Date().toISOString();
          setLastSynced(now);
        }
        return ok;
      } catch {
        return false;
      }
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        isConfigured: isSupabaseConfigured,
        lastSynced,
        setLastSynced,
        loginEmail,
        verifyOtp,
        logout,
        syncProfile,
        fetchProfile,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
