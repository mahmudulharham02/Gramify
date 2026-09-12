import { createClient, SupabaseClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as unknown as { env?: { VITE_SUPABASE_URL?: string; VITE_SUPABASE_ANON_KEY?: string } }).env;
const supabaseUrl = metaEnv?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  typeof supabaseUrl === 'string' &&
  supabaseUrl.trim() !== '' &&
  supabaseUrl.startsWith('http') &&
  typeof supabaseAnonKey === 'string' &&
  supabaseAnonKey.trim() !== ''
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Gramify] Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not configured. Running in pure offline localStorage guest mode.'
  );
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          typeof window !== 'undefined' && window.fetch
            ? window.fetch(input, init)
            : fetch(input, init),
      },
    })
  : null;
