const getSessionDate = (session) => {
  const rawDate =
    session?.createdAt ||
    session?.created_at ||
    session?.date ||
    session?.timestamp ||
    session?.sessionDate;

  if (!rawDate) return null;

  const parsed = new Date(rawDate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toDateKey = (date) => {
  const d =
    date instanceof Date
      ? date
      : getSessionDate({ createdAt: date });

  if (!d) return null;

  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

export const computeDashboardStats = (sessions = []) => {
  const totalSessions = sessions.length;

  const completedSessions = sessions.filter(
    (session) => session.status === "COMPLETED"
  ).length;

  const reportsGenerated = completedSessions;

  const practiceDaySet = new Set(
    sessions
      .map((session) =>
        toDateKey(getSessionDate(session) || session.createdAt)
      )
      .filter(Boolean)
  );

  const practiceDays = practiceDaySet.size;

  let currentStreak = 0;

  if (practiceDaySet.size > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const hasToday = practiceDaySet.has(toDateKey(today));
    const hasYesterday = practiceDaySet.has(toDateKey(yesterday));

    if (hasToday || hasYesterday) {
      const checkDate = new Date(hasToday ? today : yesterday);

      while (practiceDaySet.has(toDateKey(checkDate))) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }
  }

  const latestSession =
    sessions.length > 0
      ? [...sessions].sort((a, b) => {
          const dateA = getSessionDate(a);
          const dateB = getSessionDate(b);

          if (!dateA || !dateB) return 0;

          return dateB - dateA;
        })[0]
      : null;

  return {
    totalSessions,
    completedSessions,
    currentStreak,
    practiceDays,
    reportsGenerated,
    latestSession,
  };
};