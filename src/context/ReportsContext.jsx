import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import { sessionService } from "../services/sessionService";
import { conversationService } from "../services/conversationService";

const ReportsContext = createContext(null);

export const ReportsProvider = ({ children }) => {
  const { userId } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [questionCounts, setQuestionCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // =========================================================
  // LOAD REPORT DATA
  // =========================================================

  const loadReports = useCallback(
    async (forceRefresh = false) => {
      if (!userId) {
        setSessions([]);
        setQuestionCounts({});
        setLoaded(false);
        return;
      }

      // Don't reload if already loaded
      // unless explicitly requested.
      if (loaded && !forceRefresh) {
        return;
      }

      setLoading(true);

      try {
        const sessionData =
          await sessionService.getByUserId(userId);

        const allSessions = sessionData || [];

        const completedSessions = allSessions.filter(
          (session) =>
            session.status === "COMPLETED"
        );

        setSessions(allSessions);

        // -----------------------------------------------------
        // Load answered-question counts
        // -----------------------------------------------------

        const countEntries = await Promise.all(
          completedSessions.map(async (session) => {
            try {
              const conversations =
                await conversationService.getBySession(
                  session.id
                );

              const answeredCount =
                Array.isArray(conversations)
                  ? conversations.filter(
                      (conversation) => {
                        const answer =
                          conversation?.userAnswer ??
                          conversation?.answer;

                        return (
                          answer != null &&
                          String(answer).trim() !== ""
                        );
                      }
                    ).length
                  : 0;

              return [
                session.id,
                answeredCount,
              ];
            } catch {
              // If this particular session fails,
              // don't let it break the entire reports list.
              return [session.id, 0];
            }
          })
        );

        setQuestionCounts(
          Object.fromEntries(countEntries)
        );

        setLoaded(true);
      } catch {
        setSessions([]);
        setQuestionCounts({});
        setLoaded(false);
      } finally {
        setLoading(false);
      }
    },
    [userId, loaded]
  );

  // =========================================================
  // PRELOAD REPORTS
  // =========================================================

  useEffect(() => {
    if (!userId) {
      return;
    }

    loadReports();
  }, [userId, loadReports]);

  // =========================================================
  // REFRESH REPORTS
  // =========================================================

  const refreshReports = useCallback(async () => {
    setLoaded(false);

    await loadReports(true);
  }, [loadReports]);

  // =========================================================
  // REPORT SESSIONS
  // =========================================================

  const reportSessions = useMemo(() => {
    return sessions.filter((session) => {
      if (session.status !== "COMPLETED") {
        return false;
      }

      const count = questionCounts[session.id];

      return (
        typeof count === "number" &&
        count > 0
      );
    });
  }, [sessions, questionCounts]);

  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  const value = {
    sessions,
    questionCounts,
    reportSessions,
    loading,
    loaded,
    loadReports,
    refreshReports,
  };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};

// =========================================================
// CUSTOM HOOK
// =========================================================

export const useReports = () => {
  const context = useContext(ReportsContext);

  if (!context) {
    throw new Error(
      "useReports must be used inside ReportsProvider"
    );
  }

  return context;
};