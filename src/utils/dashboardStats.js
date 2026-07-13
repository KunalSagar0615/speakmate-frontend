const getSessionDate = (session) => {
  const rawDate = session?.createdAt || session?.created_at || session?.date || session?.timestamp || session?.sessionDate;
  if (!rawDate) return null;

  const parsed = new Date(rawDate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toDateKey = (date) => {
  const d = date instanceof Date ? date : getSessionDate({ createdAt: date });
  if (!d) return null;

  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

export const computeDashboardStats = (sessions = []) => {
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.status === "COMPLETED").length;
  const reportsGenerated = completedSessions;

  const practiceDaySet = new Set(
    sessions
      .map((s) => toDateKey(getSessionDate(s) || s.createdAt))
      .filter((d) => d && !d.includes("NaN"))
  );
  const practiceDays = practiceDaySet.size;

  const sortedDays = [...practiceDaySet]
    .map((key) => {
      const [y, m, d] = key.split("-").map(Number);
      return new Date(y, m, d);
    })
    .sort((a, b) => b - a);

  let currentStreak = 0;
  if (sortedDays.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const check = new Date(today);
    const hasToday = practiceDaySet.has(toDateKey(today));
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const hasYesterday = practiceDaySet.has(toDateKey(yesterday));

    if (hasToday || hasYesterday) {
      if (!hasToday) check.setDate(check.getDate() - 1);
      while (practiceDaySet.has(toDateKey(check))) {
        currentStreak += 1;
        check.setDate(check.getDate() - 1);
      }
    }
  }

  return {
    totalSessions,
    completedSessions,
    currentStreak,
    practiceDays,
    reportsGenerated,
  };
};

export const computeWeeklyActivity = (sessions = []) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const counts = Object.fromEntries(days.map((d) => [d, 0]));

  sessions.forEach((session) => {
    const createdAt = getSessionDate(session);
    if (!createdAt) return;
    const day = days[createdAt.getDay()];
    counts[day] += 1;
  });

  return days.map((day) => ({ day, sessions: counts[day] }));
};

export const computePracticeTrend = (sessions = []) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const startOfCurrentWeek = new Date(now);
  startOfCurrentWeek.setDate(now.getDate() - now.getDay());
  startOfCurrentWeek.setHours(0, 0, 0, 0);
  const weeks = [];

  for (let i = 3; i >= 0; i -= 1) {
    const weekStart = new Date(startOfCurrentWeek);
    weekStart.setDate(startOfCurrentWeek.getDate() - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const count = sessions.filter((session) => {
      const createdAt = getSessionDate(session);
      return createdAt && createdAt >= weekStart && createdAt < weekEnd;
    }).length;

    weeks.push({ week: `W${4 - i}`, sessions: count });
  }

  return weeks;
};
