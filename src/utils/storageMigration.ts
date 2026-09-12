import { AppState } from '../types';

/**
 * Migration helper to ensure the localStorage state complies with the Supabase Auth schema.
 * Ensures supabaseUserId, lastSyncedAt, and syncPreference fields are initialized.
 */
export function migrateAuthSchema(state: Partial<AppState>): AppState {
  const updated = { ...state } as AppState;

  if (updated.supabaseUserId === undefined) {
    updated.supabaseUserId = null;
  }

  if (updated.lastSyncedAt === undefined) {
    updated.lastSyncedAt = null;
  }

  if (updated.syncPreference === undefined) {
    updated.syncPreference = 'auto';
  }

  return updated;
}
