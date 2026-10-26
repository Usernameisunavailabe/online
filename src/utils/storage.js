const STORAGE_PREFIX = "practise_dsa_v1_";

export const STORAGE_KEYS = {
  QUESTIONS: `${STORAGE_PREFIX}questions`,
  DRAFTS: `${STORAGE_PREFIX}code_drafts`,
  NOTES: `${STORAGE_PREFIX}notes`,
  REVISIONS: `${STORAGE_PREFIX}revisions`,
  DAILY_GOAL: `${STORAGE_PREFIX}daily_goal`,
  PREFERENCES: `${STORAGE_PREFIX}user_preferences`,
  INTERVIEWS: `${STORAGE_PREFIX}mock_interviews`,
  ACTIVITY_LOG: `${STORAGE_PREFIX}activity_log`,
  AI_CONFIG: `${STORAGE_PREFIX}ai_config`
};

export const defaultPreferences = {
  theme: "dark",
  fontSize: 14,
  tabSize: 2,
  wordWrap: "on",
  preferredLanguage: "javascript",
  defaultDifficulty: "All",
  preferredCompanies: ["Google", "Amazon", "Microsoft", "Meta"]
};

export const defaultDailyGoal = {
  target: 2,
  date: new Date().toISOString().split("T")[0],
  completedToday: 0
};

export function getStoredItem(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading key ${key} from localStorage:`, err);
    return fallback;
  }
}

export function setStoredItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing key ${key} to localStorage:`, err);
  }
}

export function removeStoredItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing key ${key} from localStorage:`, err);
  }
}

export function clearAllAppStorage() {
  Object.values(STORAGE_KEYS).forEach((k) => {
    localStorage.removeItem(k);
  });
}

/**
 * Exports application state as a clean JSON string, stripping sensitive AI keys.
 */
export function exportAppData(fullState) {
  const exportPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    questions: fullState.questions || [],
    drafts: fullState.drafts || {},
    notes: fullState.notes || {},
    revisions: fullState.revisions || [],
    dailyGoal: fullState.dailyGoal || defaultDailyGoal,
    preferences: fullState.preferences || defaultPreferences,
    interviewHistory: fullState.interviewHistory || [],
    activityLog: fullState.activityLog || []
  };
  return JSON.stringify(exportPayload, null, 2);
}
