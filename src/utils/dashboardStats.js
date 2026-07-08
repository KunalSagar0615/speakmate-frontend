const toDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

export const computeDashboardStats = (sessions = []) => {
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.status === "COMPLETED").length;
  const reportsGenerated = completedSessions;

  const practiceDaySet = new Set(
    sessions.map((s) => toDateKey(s.createdAt)).filter((d) => d && !d.includes("NaN"))
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

  sessions.forEach((s) => {
    if (!s.createdAt) return;
    const day = days[new Date(s.createdAt).getDay()];
    counts[day] += 1;
  });

  return days.map((day) => ({ day, sessions: counts[day] }));
};

export const computePracticeTrend = (sessions = []) => {
  const now = new Date();
  const weeks = [];

  for (let i = 3; i >= 0; i -= 1) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - i * 7 - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const count = sessions.filter((s) => {
      const created = new Date(s.createdAt);
      return created >= weekStart && created < weekEnd;
    }).length;

    weeks.push({ week: `W${4 - i}`, sessions: count });
  }

  return weeks;
};
