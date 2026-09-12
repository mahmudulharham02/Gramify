// Mode preferences storage and retrieval
export type DrillMode = 'mcq' | 'write';

const PREFS_STORAGE_KEY = 'drillModePreferences';

export function getDrillModePreferences(): Record<string, DrillMode> {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getDrillModePreference(topicId: string, subModuleId?: string): DrillMode | null {
  const prefs = getDrillModePreferences();
  const specificKey = subModuleId ? `${topicId}_${subModuleId}` : topicId;
  if (prefs[specificKey]) {
    return prefs[specificKey];
  }
  if (prefs[topicId]) {
    return prefs[topicId];
  }
  return null;
}

export function setDrillModePreference(topicId: string, subModuleId: string | undefined, mode: DrillMode) {
  try {
    const prefs = getDrillModePreferences();
    const key = subModuleId ? `${topicId}_${subModuleId}` : topicId;
    prefs[key] = mode;
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save drill mode preference', e);
  }
}

export function clearDrillModePreference(topicId: string, subModuleId?: string) {
  try {
    const prefs = getDrillModePreferences();
    const key = subModuleId ? `${topicId}_${subModuleId}` : topicId;
    delete prefs[key];
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to clear drill mode preference', e);
  }
}

export function clearAllDrillModePreferences() {
  try {
    localStorage.removeItem(PREFS_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear all drill mode preferences', e);
  }
}
