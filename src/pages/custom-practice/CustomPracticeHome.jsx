import {
  Clock3,
  FileText,
  PauseCircle,
  PlayCircle,
  Sparkles,
  TimerReset,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Button,
  Card,
  Loader,
} from "../../components/common/UI";

import { customPracticeService } from "../../services/customPracticeService";
import { getErrorMessage } from "../../utils/errorMessages";

const formatDate = (value) => {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  } catch {
    return value;
  }
};

const formatRelativeExpiry = (value) => {
  if (!value) return null;

  const diff = Math.max(
    0,
    Math.round(
      (new Date(value) - new Date()) /
        (1000 * 60 * 60 * 24)
    )
  );

  if (diff === 0) {
    return "Expires today";
  }

  return `Expires in ${diff} day${
    diff === 1 ? "" : "s"
  }`;
};

const isValidSessionId = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return false;
  }

  return /^\d+$/.test(String(value).trim());
};

export const CustomPracticeHome = () => {
  const navigate = useNavigate();

  const [pausedSessions, setPausedSessions] =
    useState([]);

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [resumingId, setResumingId] =
    useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);

      try {
        const [paused, historyData] =
          await Promise.all([
            customPracticeService.getPausedSessions(),
            customPracticeService.getSessionHistory(),
          ]);

        if (isMounted) {
          setPausedSessions(
            Array.isArray(paused) ? paused : []
          );

          setHistory(
            Array.isArray(historyData)
              ? historyData
              : []
          );
        }
      } catch (error) {
        if (isMounted) {
          toast.error(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleResume = async (sessionId) => {
    if (!isValidSessionId(sessionId)) {
      toast.error("Invalid practice session ID.");
      return;
    }

    setResumingId(sessionId);

    try {
      const session =
        await customPracticeService.resumeSession(
          sessionId
        );

      // Backend returns sessionId, not id
      const resolvedSessionId =
        session?.sessionId ?? null;

      if (!isValidSessionId(resolvedSessionId)) {
        console.error(
          "Invalid resumed session returned:",
          session
        );

        toast.error(
          "Invalid practice session ID."
        );

        return;
      }

      navigate(
        `/custom-practice/session/${String(
          resolvedSessionId
        )}`,
        {
          state: { session },
        }
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setResumingId(null);
    }
  };

  const handleViewReport = (session) => {
    const sessionId =
      session?.sessionId ?? null;

    if (!isValidSessionId(sessionId)) {
      console.error(
        "Invalid history session:",
        session
      );

      toast.error(
        "Invalid practice session ID."
      );

      return;
    }

    navigate(
      `/custom-practice/report/${String(
        sessionId
      )}`
    );
  };

  const renderEmptyState = (
    title,
    description
  ) => (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
      <p className="font-medium text-slate-700 dark:text-slate-200">
        {title}
      </p>

      <p className="mt-1">
        {description}
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Custom Practice
            </p>

            <h2 className="text-2xl font-bold">
              Practice with your own questions
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Paste questions, review them, and get
              AI feedback in a focused
              interview-style flow.
            </p>
          </div>

          <Button
            onClick={() =>
              navigate("/custom-practice/new")
            }
          >
            Create New Practice
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/70">
          <Loader />
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {/* PAUSED PRACTICE */}

          <Card className="space-y-3">
            <div className="flex items-center gap-2">
              <PauseCircle className="h-5 w-5 text-amber-500" />

              <h3 className="text-lg font-semibold">
                Paused Practice
              </h3>
            </div>

            {pausedSessions.length === 0 ? (
              renderEmptyState(
                "No paused sessions",
                "Pause an active session and it will appear here for quick resume."
              )
            ) : (
              pausedSessions.map((session) => {
                const sessionId =
                  session.sessionId;

                return (
                  <div
                    key={sessionId}
                    className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">
                          {session.sessionName}
                        </p>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {session.answeredQuestions}/
                          {session.totalQuestions}{" "}
                          answered • Round{" "}
                          {session.currentRound}
                        </p>
                      </div>

                      <Button
                        variant="secondary"
                        onClick={() =>
                          handleResume(sessionId)
                        }
                        disabled={
                          resumingId === sessionId
                        }
                      >
                        {resumingId === sessionId ? (
                          <Loader />
                        ) : (
                          <span className="flex items-center gap-2">
                            <PlayCircle
                              size={16}
                            />
                            Resume
                          </span>
                        )}
                      </Button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock3 size={14} />
                        Paused{" "}
                        {formatDate(
                          session.pausedAt
                        )}
                      </span>

                      <span className="flex items-center gap-1">
                        <TimerReset size={14} />

                        {formatRelativeExpiry(
                          session.expiresAt
                        ) ||
                          "Resume before expiry"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </Card>

          {/* RECENT PRACTICE */}

          <Card className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-500" />

              <h3 className="text-lg font-semibold">
                Recent Practice
              </h3>
            </div>

            {history.length === 0 ? (
              renderEmptyState(
                "No completed sessions yet",
                "Finished practice sessions will appear here with quick report access."
              )
            ) : (
              history.map((session) => (
                <div
                  key={session.sessionId}
                  className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {session.sessionName}
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {session.answeredQuestions}/
                        {session.totalQuestions}{" "}
                        answered • {session.status}
                      </p>
                    </div>

                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleViewReport(session)
                      }
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles size={16} />
                        View Report
                      </span>
                    </Button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock3 size={14} />

                      Started{" "}
                      {formatDate(
                        session.startedAt
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      )}
    </div>
  );
};