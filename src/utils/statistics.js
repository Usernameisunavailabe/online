import { getTodayDateString } from "./dates.js";

export function calculateOverviewMetrics(questions, activityLog = []) {
  const total = questions.length;
  const solved = questions.filter((q) => q.status === "Solved").length;
  const inProgress = questions.filter((q) => q.status === "In Progress").length;
  const todo = total - solved - inProgress;
  const bookmarked = questions.filter((q) => q.bookmarked).length;

  const streak = calculateStreak(activityLog);

  return {
    total,
    solved,
    inProgress,
    todo,
    bookmarked,
    streak,
    solvedPercentage: total > 0 ? Math.round((solved / total) * 100) : 0
  };
}

export function calculateStreak(activityLog) {
  if (!activityLog || activityLog.length === 0) return 0;

  // Extract unique active dates sorted descending
  const activeDates = Array.from(
    new Set(
      activityLog.map((log) => {
        const d = new Date(log.timestamp);
        return !isNaN(d) ? d.toISOString().split("T")[0] : null;
      }).filter(Boolean)
    )
  ).sort().reverse();

  if (activeDates.length === 0) return 0;

  const today = getTodayDateString();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  // If user hasn't practised today or yesterday, streak is broken
  const mostRecent = activeDates[0];
  if (mostRecent !== today && mostRecent !== yesterday) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(mostRecent);

  for (let i = 0; i < activeDates.length; i++) {
    const expected = checkDate.toISOString().split("T")[0];
    if (activeDates[i] === expected) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function calculateDifficultyBreakdown(questions) {
  const breakdown = {
    Easy: { total: 0, solved: 0 },
    Medium: { total: 0, solved: 0 },
    Hard: { total: 0, solved: 0 }
  };

  questions.forEach((q) => {
    const diff = q.difficulty || "Medium";
    if (breakdown[diff]) {
      breakdown[diff].total++;
      if (q.status === "Solved") {
        breakdown[diff].solved++;
      }
    }
  });

  return breakdown;
}

export function calculateCompanyReadiness(questions, companies) {
  return companies.map((comp) => {
    const name = typeof comp === "string" ? comp : comp.name;
    const matching = questions.filter((q) =>
      Array.isArray(q.companies) && q.companies.includes(name)
    );
    const total = matching.length;
    const solved = matching.filter((q) => q.status === "Solved").length;
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

    return {
      name,
      total,
      solved,
      percentage
    };
  });
}

export function calculateTopicBreakdown(questions) {
  const topicMap = {};

  questions.forEach((q) => {
    if (Array.isArray(q.topics)) {
      q.topics.forEach((t) => {
        if (!topicMap[t]) {
          topicMap[t] = { topic: t, total: 0, solved: 0 };
        }
        topicMap[t].total++;
        if (q.status === "Solved") {
          topicMap[t].solved++;
        }
      });
    }
  });

  return Object.values(topicMap)
    .sort((a, b) => b.total - a.total)
    .map((item) => ({
      ...item,
      percentage: item.total > 0 ? Math.round((item.solved / item.total) * 100) : 0
    }));
}

export function calculateWeeklyActivity(activityLog) {
  // Generate last 7 days buckets
  const days = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = dayNames[d.getDay()];

    const count = (activityLog || []).filter((log) => {
      const logDate = new Date(log.timestamp).toISOString().split("T")[0];
      return logDate === dateStr;
    }).length;

    days.push({
      date: dateStr,
      day: dayLabel,
      count
    });
  }

  return days;
}
