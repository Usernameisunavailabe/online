import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { initialQuestions } from "../data/questions.js";
import {
  STORAGE_KEYS,
  defaultPreferences,
  defaultDailyGoal,
  getStoredItem,
  setStoredItem,
  clearAllAppStorage,
  exportAppData
} from "../utils/storage.js";
import { getTodayDateString } from "../utils/dates.js";
import { validateImportedData } from "../utils/validation.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Questions list
  const [questions, setQuestions] = useState(() => {
    return getStoredItem(STORAGE_KEYS.QUESTIONS, initialQuestions);
  });

  // Code drafts: { [problemId]: { [lang]: code } }
  const [drafts, setDrafts] = useState(() => {
    return getStoredItem(STORAGE_KEYS.DRAFTS, {});
  });

  // Problem personal notes: { [problemId]: noteText }
  const [notes, setNotes] = useState(() => {
    return getStoredItem(STORAGE_KEYS.NOTES, {});
  });

  // Revisions planner items
  const [revisions, setRevisions] = useState(() => {
    return getStoredItem(STORAGE_KEYS.REVISIONS, [
      {
        id: "rev-two-sum",
        problemId: "two-sum",
        problemTitle: "Two Sum",
        difficulty: "Easy",
        scheduledDate: getTodayDateString(),
        notes: "Review hash map complement lookup and single-pass edge cases.",
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "rev-3sum",
        problemId: "3sum",
        problemTitle: "3Sum",
        difficulty: "Medium",
        scheduledDate: (() => {
          const d = new Date();
          d.setDate(d.getDate() + 2);
          return d.toISOString().split("T")[0];
        })(),
        notes: "Focus on skipping duplicate elements during pointer movements.",
        completed: false,
        createdAt: new Date().toISOString()
      }
    ]);
  });

  // Daily goal
  const [dailyGoal, setDailyGoal] = useState(() => {
    const stored = getStoredItem(STORAGE_KEYS.DAILY_GOAL, defaultDailyGoal);
    const today = getTodayDateString();
    if (stored.date !== today) {
      return {
        target: stored.target || 2,
        date: today,
        completedToday: 0
      };
    }
    return stored;
  });

  // User preferences
  const [preferences, setPreferences] = useState(() => {
    return getStoredItem(STORAGE_KEYS.PREFERENCES, defaultPreferences);
  });

  // Interview history
  const [interviewHistory, setInterviewHistory] = useState(() => {
    return getStoredItem(STORAGE_KEYS.INTERVIEWS, []);
  });

  // Activity log for streak and history calculation
  const [activityLog, setActivityLog] = useState(() => {
    return getStoredItem(STORAGE_KEYS.ACTIVITY_LOG, [
      {
        id: "act-init-1",
        type: "solved",
        problemId: "two-sum",
        problemTitle: "Two Sum",
        timestamp: new Date().toISOString(),
        detail: "Solved using single pass hash map approach"
      }
    ]);
  });

  // Global UI states
  const [activeProblemId, setActiveProblemId] = useState("two-sum");
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    setStoredItem(STORAGE_KEYS.QUESTIONS, questions);
  }, [questions]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.DRAFTS, drafts);
  }, [drafts]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.NOTES, notes);
  }, [notes]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.REVISIONS, revisions);
  }, [revisions]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.DAILY_GOAL, dailyGoal);
  }, [dailyGoal]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.PREFERENCES, preferences);
    // Apply theme
    if (preferences.theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [preferences]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.INTERVIEWS, interviewHistory);
  }, [interviewHistory]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.ACTIVITY_LOG, activityLog);
  }, [activityLog]);

  // Activity logger helper
  const logActivity = useCallback((type, problemId, problemTitle, detail) => {
    const entry = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      problemId,
      problemTitle,
      timestamp: new Date().toISOString(),
      detail
    };
    setActivityLog((prev) => [entry, ...prev.slice(0, 99)]);
  }, []);

  // Update problem status
  const updateProblemStatus = useCallback(
    (problemId, newStatus) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === problemId) {
            const oldStatus = q.status;
            if (oldStatus !== newStatus) {
              logActivity(
                newStatus === "Solved" ? "solved" : "status_change",
                q.id,
                q.title,
                `Status changed from ${oldStatus} to ${newStatus}`
              );

              if (newStatus === "Solved" && oldStatus !== "Solved") {
                const today = getTodayDateString();
                setDailyGoal((current) => ({
                  ...current,
                  date: today,
                  completedToday:
                    current.date === today ? current.completedToday + 1 : 1
                }));
              }
            }
            return { ...q, status: newStatus };
          }
          return q;
        })
      );
    },
    [logActivity]
  );

  // Toggle problem bookmark
  const toggleBookmark = useCallback(
    (problemId) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === problemId) {
            const nextBookmarked = !q.bookmarked;
            logActivity(
              nextBookmarked ? "bookmarked" : "unbookmarked",
              q.id,
              q.title,
              nextBookmarked ? "Added to bookmarks" : "Removed from bookmarks"
            );
            return { ...q, bookmarked: nextBookmarked };
          }
          return q;
        })
      );
    },
    [logActivity]
  );

  // Draft operations
  const getDraft = useCallback(
    (problemId, language) => {
      if (drafts[problemId] && drafts[problemId][language] !== undefined) {
        return drafts[problemId][language];
      }
      const q = questions.find((item) => item.id === problemId);
      if (q && q.starterCode && q.starterCode[language]) {
        return q.starterCode[language];
      }
      return "";
    },
    [drafts, questions]
  );

  const saveDraft = useCallback((problemId, language, code) => {
    setDrafts((prev) => ({
      ...prev,
      [problemId]: {
        ...(prev[problemId] || {}),
        [language]: code
      }
    }));
  }, []);

  const resetDraft = useCallback(
    (problemId, language) => {
      const q = questions.find((item) => item.id === problemId);
      const starter =
        q && q.starterCode && q.starterCode[language] ? q.starterCode[language] : "";
      setDrafts((prev) => ({
        ...prev,
        [problemId]: {
          ...(prev[problemId] || {}),
          [language]: starter
        }
      }));
      return starter;
    },
    [questions]
  );

  // Notes operations
  const getNote = useCallback(
    (problemId) => {
      return notes[problemId] || "";
    },
    [notes]
  );

  const saveNote = useCallback((problemId, text) => {
    setNotes((prev) => ({
      ...prev,
      [problemId]: text
    }));
  }, []);

  // Revision operations
  const addRevision = useCallback(
    ({ problemId, problemTitle, difficulty, scheduledDate, revisionNotes }) => {
      const newRev = {
        id: `rev-${Date.now()}`,
        problemId,
        problemTitle,
        difficulty: difficulty || "Medium",
        scheduledDate,
        notes: revisionNotes || "",
        completed: false,
        createdAt: new Date().toISOString()
      };
      setRevisions((prev) => [newRev, ...prev]);
      logActivity(
        "revision_scheduled",
        problemId,
        problemTitle,
        `Scheduled revision for ${scheduledDate}`
      );
      return newRev;
    },
    [logActivity]
  );

  const updateRevision = useCallback((id, updates) => {
    setRevisions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  }, []);

  const completeRevision = useCallback(
    (id) => {
      setRevisions((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            logActivity(
              "revision_completed",
              r.problemId,
              r.problemTitle,
              "Completed scheduled revision"
            );
            return { ...r, completed: true };
          }
          return r;
        })
      );
    },
    [logActivity]
  );

  const deleteRevision = useCallback((id) => {
    setRevisions((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Preferences operations
  const updatePreferences = useCallback((partial) => {
    setPreferences((prev) => ({ ...prev, ...partial }));
  }, []);

  // Daily goal target update
  const setDailyGoalTarget = useCallback((target) => {
    setDailyGoal((prev) => ({
      ...prev,
      target: Math.max(1, parseInt(target, 10) || 1)
    }));
  }, []);

  // Save interview session
  const saveInterviewSession = useCallback((session) => {
    setInterviewHistory((prev) => [session, ...prev]);
  }, []);

  // Export / Import / Reset
  const exportData = useCallback(() => {
    return exportAppData({
      questions,
      drafts,
      notes,
      revisions,
      dailyGoal,
      preferences,
      interviewHistory,
      activityLog
    });
  }, [
    questions,
    drafts,
    notes,
    revisions,
    dailyGoal,
    preferences,
    interviewHistory,
    activityLog
  ]);

  const importData = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      const validation = validateImportedData(parsed);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      if (parsed.questions) setQuestions(parsed.questions);
      if (parsed.drafts) setDrafts(parsed.drafts);
      if (parsed.notes) setNotes(parsed.notes);
      if (parsed.revisions) setRevisions(parsed.revisions);
      if (parsed.dailyGoal) setDailyGoal(parsed.dailyGoal);
      if (parsed.preferences) setPreferences(parsed.preferences);
      if (parsed.interviewHistory) setInterviewHistory(parsed.interviewHistory);
      if (parsed.activityLog) setActivityLog(parsed.activityLog);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Invalid JSON content." };
    }
  }, []);

  const resetAllData = useCallback(() => {
    clearAllAppStorage();
    setQuestions(initialQuestions);
    setDrafts({});
    setNotes({});
    setRevisions([]);
    setDailyGoal(defaultDailyGoal);
    setPreferences(defaultPreferences);
    setInterviewHistory([]);
    setActivityLog([]);
  }, []);

  // Helper to find a question
  const getQuestionById = useCallback(
    (id) => {
      return questions.find((q) => q.id === id) || questions[0];
    },
    [questions]
  );

  const value = {
    questions,
    drafts,
    notes,
    revisions,
    dailyGoal,
    preferences,
    interviewHistory,
    activityLog,
    activeProblemId,
    setActiveProblemId,
    searchModalOpen,
    setSearchModalOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    updateProblemStatus,
    toggleBookmark,
    getDraft,
    saveDraft,
    resetDraft,
    getNote,
    saveNote,
    addRevision,
    updateRevision,
    completeRevision,
    deleteRevision,
    updatePreferences,
    setDailyGoalTarget,
    saveInterviewSession,
    logActivity,
    exportData,
    importData,
    resetAllData,
    getQuestionById
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
