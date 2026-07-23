import {
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Sparkles,
  StopCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Button, Card, Loader } from "../../components/common/UI";
import { EndPracticeModal } from "../../components/custom-practice/EndPracticeModal";
import { PausePracticeModal } from "../../components/custom-practice/PausePracticeModal";
import { customPracticeService } from "../../services/customPracticeService";
import { getErrorMessage } from "../../utils/errorMessages";

const statusStyles = {
  ACTIVE: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  PAUSED:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  COMPLETED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  ENDED:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  EXPIRED:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

const evaluationStyles = {
  CORRECT:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  PARTIALLY_CORRECT:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  INCORRECT:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export const CustomPracticeSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = useParams();

  const [session, setSession] = useState(location.state?.session || null);
  const [loading, setLoading] = useState(!location.state?.session);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const [movingNext, setMovingNext] = useState(false);

  const [draftSaving, setDraftSaving] = useState(false);
  const [draftStatus, setDraftStatus] = useState("idle");

  const [pauseModalOpen, setPauseModalOpen] = useState(false);
  const [endModalOpen, setEndModalOpen] = useState(false);

  const [pauseLoading, setPauseLoading] = useState(false);
  const [endLoading, setEndLoading] = useState(false);

  const [evaluation, setEvaluation] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);

  const [sessionMessage, setSessionMessage] = useState("");
  const [roundBanner, setRoundBanner] = useState("");

  const debounceRef = useRef(null);

  // =========================================================
  // NORMALIZE SESSION ID FROM URL
  // =========================================================

  const normalizedRouteSessionId = useMemo(() => {
    if (
      sessionId === null ||
      sessionId === undefined ||
      sessionId === ""
    ) {
      return null;
    }

    const trimmed = String(sessionId).trim();

    if (
      trimmed === "" ||
      trimmed === "undefined" ||
      trimmed === "null"
    ) {
      return null;
    }

    const parsed = Number(trimmed);

    return Number.isInteger(parsed) && parsed > 0
      ? String(parsed)
      : null;
  }, [sessionId]);

  // =========================================================
  // LOAD SESSION
  // =========================================================

  const loadSession = async (
    requestedSessionId = normalizedRouteSessionId,
    preserveEvaluation = false
  ) => {
    if (
      !requestedSessionId ||
      !/^\d+$/.test(String(requestedSessionId))
    ) {
      toast.error("Invalid practice session ID.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const currentSession =
        await customPracticeService.getSession(requestedSessionId);

      setSession(currentSession);

      setAnswer(
        currentSession?.currentQuestion?.draftAnswer || ""
      );

      setEvaluation((current) =>
        preserveEvaluation ? current : null
      );

      setShowNextButton((current) =>
        preserveEvaluation ? current : false
      );

      setSessionMessage("");
      setRoundBanner("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL SESSION LOAD
  // =========================================================

  useEffect(() => {
    if (!normalizedRouteSessionId) {
      toast.error("Invalid practice session ID.");
      navigate("/custom-practice");
      return;
    }

    if (!session) {
      loadSession(normalizedRouteSessionId);
      return;
    }

    setAnswer(session?.currentQuestion?.draftAnswer || "");
  }, [normalizedRouteSessionId, navigate, session]);

  // =========================================================
  // CURRENT QUESTION
  // =========================================================

  const currentQuestion = session?.currentQuestion;

  // =========================================================
  // AUTO SAVE DRAFT
  // =========================================================

  useEffect(() => {
    const activeSessionId = normalizedRouteSessionId;
    const questionId = session?.currentQuestion?.questionId;

    if (!questionId || !activeSessionId) {
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setDraftSaving(true);
      setDraftStatus("saving");

      try {
        await customPracticeService.saveDraft(activeSessionId, {
          questionId,
          draftAnswer: answer.trim() ? answer : null,
        });

        setDraftStatus("saved");
      } catch (error) {
        console.error("Draft save failed:", error);
        setDraftStatus("error");
      } finally {
        setDraftSaving(false);
      }
    }, 800);

    return () => {
      clearTimeout(debounceRef.current);
    };
  }, [
    answer,
    session?.currentQuestion?.questionId,
    normalizedRouteSessionId,
  ]);

  // =========================================================
  // PROGRESS
  // =========================================================

  const progressValue = useMemo(() => {
    if (!session?.totalQuestions) {
      return 0;
    }

    const answered = session?.answeredQuestions ?? 0;

    return Math.round(
      (answered / session.totalQuestions) * 100
    );
  }, [session]);

  // =========================================================
  // SUBMIT ANSWER
  // =========================================================

  const handleSubmit = async () => {
    const activeSessionId = normalizedRouteSessionId;
    const questionId = currentQuestion?.questionId;

    if (!activeSessionId) {
      toast.error("Invalid practice session ID.");
      return;
    }

    if (!questionId) {
      toast.error("Invalid practice question ID.");
      return;
    }

    if (!answer.trim()) {
      toast.error("Write an answer before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const result =
        await customPracticeService.submitAnswer(
          activeSessionId,
          {
            questionId,
            answer: answer.trim(),
          }
        );

      setEvaluation(result);
      setShowNextButton(true);

      if (result?.retryRequired) {
        setSessionMessage(
          "You will get one more chance to answer this question in Round 2."
        );
      } else {
        setSessionMessage("");
      }

      setRoundBanner("");

      await loadSession(activeSessionId, true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // SKIP QUESTION
  // =========================================================

  const handleSkip = async () => {
    const activeSessionId = normalizedRouteSessionId;
    const questionId = currentQuestion?.questionId;

    if (!activeSessionId) {
      toast.error("Invalid practice session ID.");
      return;
    }

    if (!questionId) {
      toast.error("Invalid practice question ID.");
      return;
    }

    const confirmed = window.confirm(
      session?.currentRound === 2
        ? "Skip this question? This will be final in Round 2."
        : "Skip this question? It will return in Round 2."
    );

    if (!confirmed) return;

    setSkipping(true);

    try {
      const result =
        await customPracticeService.skipQuestion(
          activeSessionId
        );

      setEvaluation(null);
      setShowNextButton(true);

      if (result?.message) {
        setSessionMessage(result.message);
      }

      setRoundBanner("");

      await loadSession(activeSessionId, false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSkipping(false);
    }
  };

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  const handleNext = async () => {
    const activeSessionId = normalizedRouteSessionId;

    if (!activeSessionId) {
      toast.error("Invalid practice session ID.");
      return;
    }

    setMovingNext(true);

    try {
      const result =
        await customPracticeService.nextQuestion(
          activeSessionId
        );

      if (result?.retryRoundStarted) {
        setRoundBanner(
          "Round 1 complete. Let’s retry the questions that need another attempt."
        );
      }

      if (result?.sessionCompleted) {
        setSessionMessage(
          result.message ||
            "Your practice session is complete."
        );

        setShowNextButton(false);
        setEvaluation(null);
        setAnswer("");

        const refreshed =
          await customPracticeService.getSession(
            activeSessionId
          );

        setSession(refreshed);
        return;
      }

      setSessionMessage(result?.message || "");

      const refreshed =
        await customPracticeService.getSession(
          activeSessionId
        );

      setSession(refreshed);

      setAnswer(
        refreshed?.currentQuestion?.draftAnswer || ""
      );

      setEvaluation(null);
      setShowNextButton(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setMovingNext(false);
    }
  };

  // =========================================================
  // PAUSE SESSION
  // =========================================================

  const handlePause = async (pauseDays) => {
    const activeSessionId = normalizedRouteSessionId;

    if (!activeSessionId) {
      toast.error("Invalid practice session ID.");
      return;
    }

    setPauseLoading(true);

    try {
      await customPracticeService.pauseSession(
        activeSessionId,
        pauseDays
      );

      toast.success("Session paused.");

      setPauseModalOpen(false);

      navigate("/custom-practice");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setPauseLoading(false);
    }
  };

  // =========================================================
  // END SESSION
  // =========================================================

  const handleEnd = async () => {
    const activeSessionId = normalizedRouteSessionId;

    if (!activeSessionId) {
      toast.error("Invalid practice session ID.");
      return;
    }

    setEndLoading(true);

    try {
      const result =
        await customPracticeService.endSession(
          activeSessionId
        );

      setEndModalOpen(false);

      setSession((current) =>
        current
          ? {
              ...current,
              status: result?.status || "ENDED",
            }
          : current
      );

      setEvaluation(null);
      setShowNextButton(false);

      setSessionMessage(
        result?.message || "Practice ended."
      );

      toast.success("Practice ended.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setEndLoading(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!session) {
    return (
      <Card className="text-rose-500">
        Unable to load the selected practice session.
      </Card>
    );
  }

  // =========================================================
  // SESSION STATE
  // =========================================================

  const isTerminal = [
    "COMPLETED",
    "ENDED",
    "EXPIRED",
  ].includes(session.status);

  const showCompletionState = isTerminal;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-4">
      {/* SESSION HEADER */}

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Custom Practice
            </p>

            <h2 className="text-2xl font-bold">
              {session.sessionName}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span
                className={`rounded-full px-2.5 py-1 font-medium ${
                  statusStyles[session.status] ||
                  statusStyles.ACTIVE
                }`}
              >
                {session.status}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Round {session.currentRound || 1}
              </span>

              {session.currentQuestion && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Question{" "}
                  {session.currentQuestion.questionNumber ||
                    1}{" "}
                  of{" "}
                  {session.currentQuestion.totalQuestions ||
                    session.totalQuestions ||
                    0}
                </span>
              )}
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() =>
              navigate("/custom-practice")
            }
          >
            <span className="flex items-center gap-2">
              <PlayCircle size={16} />
              Home
            </span>
          </Button>
        </div>

        {/* PROGRESS */}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>Progress</span>

            <span>
              {session.answeredQuestions || 0}/
              {session.totalQuestions || 0}
            </span>
          </div>

          <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-2.5 rounded-full bg-primary"
              style={{
                width: `${progressValue}%`,
              }}
            />
          </div>
        </div>
      </Card>

      {/* ROUND 2 BANNER */}

      {roundBanner && (
        <Card className="border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <RotateCcw size={18} />

            <p className="font-medium">
              {roundBanner}
            </p>
          </div>
        </Card>
      )}

      {/* ACTIVE QUESTION */}

      {!showCompletionState && currentQuestion ? (
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Question{" "}
                {currentQuestion.questionNumber || 1}
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {currentQuestion.questionText}
              </h3>
            </div>

            {(session.currentRound === 2 ||
              currentQuestion.retryQuestion) && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                Retry Round
              </span>
            )}
          </div>

          {/* ANSWER */}

          <div className="space-y-3">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Your answer

              <textarea
                rows={8}
                value={answer}
                onChange={(event) =>
                  setAnswer(event.target.value)
                }
                placeholder="Type your answer here..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-primary/50 focus:ring dark:border-slate-700 dark:bg-slate-950"
              />
            </label>

            {draftStatus === "saving" ||
            draftSaving ? (
              <p className="text-sm text-slate-500">
                Saving draft...
              </p>
            ) : draftStatus === "error" ? (
              <p className="text-sm text-amber-600">
                Could not save draft.
              </p>
            ) : draftStatus === "saved" ? (
              <p className="text-sm text-emerald-600">
                Draft saved
              </p>
            ) : null}
          </div>

          {/* ACTION BUTTONS */}

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSubmit}
              disabled={
                submitting || !answer.trim()
              }
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader />
                  Evaluating...
                </span>
              ) : (
                "Submit Answer"
              )}
            </Button>

            <Button
              variant="secondary"
              onClick={handleSkip}
              disabled={skipping}
            >
              {skipping ? (
                <span className="flex items-center gap-2">
                  <Loader />
                  Skipping...
                </span>
              ) : (
                "Skip"
              )}
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                setPauseModalOpen(true)
              }
            >
              <span className="flex items-center gap-2">
                <PauseCircle size={16} />
                Pause
              </span>
            </Button>

            <Button
              variant="danger"
              onClick={() =>
                setEndModalOpen(true)
              }
            >
              <span className="flex items-center gap-2">
                <StopCircle size={16} />
                End Practice
              </span>
            </Button>
          </div>

          {sessionMessage && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {sessionMessage}
            </p>
          )}
        </Card>
      ) : (
        /* COMPLETION */

        <Card className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-500" />

            <div>
              <h3 className="text-lg font-semibold">
                {session.status === "COMPLETED"
                  ? "Practice complete"
                  : session.status === "ENDED"
                    ? "Practice ended"
                    : "Session completed"}
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {sessionMessage ||
                  (session.status === "COMPLETED"
                    ? "You’ve finished all required questions."
                    : "You can review your progress and report from here.")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {session.status !== "ENDED" &&
              session.status !== "EXPIRED" && (
                <Button
                  onClick={() => {
                    if (
                      !normalizedRouteSessionId
                    ) {
                      toast.error(
                        "Invalid practice session ID."
                      );
                      return;
                    }

                    navigate(
                      `/custom-practice/report/${normalizedRouteSessionId}`
                    );
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} />
                    View Report
                  </span>
                </Button>
              )}

            <Button
              variant="secondary"
              onClick={() =>
                navigate("/custom-practice")
              }
            >
              Back to Custom Practice
            </Button>
          </div>
        </Card>
      )}

      {/* EVALUATION */}

      {evaluation && (
        <Card className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Evaluation
              </p>

              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {evaluation.status || "Reviewed"}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                evaluationStyles[
                  evaluation.status
                ] ||
                "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {evaluation.status}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-sm text-slate-500">
                Score
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {evaluation.score ?? "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-sm text-slate-500">
                Retry required
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {evaluation.retryRequired
                  ? "Yes"
                  : "No"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            <p className="font-medium text-slate-900 dark:text-slate-100">
              Feedback
            </p>

            <p className="mt-2">
              {evaluation.feedback ||
                "No feedback was returned."}
            </p>
          </div>

          {showNextButton && (
            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                disabled={movingNext}
              >
                {movingNext ? (
                  <span className="flex items-center gap-2">
                    <Loader />
                    Continuing...
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* MODALS */}

      <PausePracticeModal
        isOpen={pauseModalOpen}
        onClose={() =>
          setPauseModalOpen(false)
        }
        onPause={handlePause}
        loading={pauseLoading}
      />

      <EndPracticeModal
        isOpen={endModalOpen}
        onClose={() =>
          setEndModalOpen(false)
        }
        onEnd={handleEnd}
        loading={endLoading}
      />
    </div>
  );
};