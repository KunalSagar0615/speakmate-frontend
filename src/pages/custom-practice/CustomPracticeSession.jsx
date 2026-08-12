import {
  CheckCircle2,
  Mic,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Sparkles,
  StopCircle,
  Volume2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Button, Card, Loader } from "../../components/common/UI";
import { EndPracticeModal } from "../../components/custom-practice/EndPracticeModal";
import { PausePracticeModal } from "../../components/custom-practice/PausePracticeModal";
import { customPracticeService } from "../../services/customPracticeService";
import { getErrorMessage } from "../../utils/errorMessages";
import { useVoicePractice } from "../../hooks/useVoicePractice";

const statusStyles = {
  ACTIVE:
    "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
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

  /*
   * CHAT / VOICE remains frontend-only.
   *
   * Setup currently passes:
   * state: {
   *   session,
   *   communicationType
   * }
   */
  const initialCommunicationType =
    location.state?.communicationType === "VOICE"
      ? "VOICE"
      : "CHAT";

  const [communicationType] = useState(() => {
    const storedMode = sessionStorage.getItem(
      `custom-practice-mode-${sessionId}`
    );

    if (storedMode === "VOICE" || storedMode === "CHAT") {
      return storedMode;
    }

    return initialCommunicationType;
  });

  const isVoiceMode = communicationType === "VOICE";

  const {
    transcript,
    displayTranscript,
    listening,
    error: voiceError,
    setTranscript,
    clearTranscript,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
  } = useVoicePractice();

  const [session, setSession] = useState(
    location.state?.session || null
  );

  const [loading, setLoading] = useState(
    !location.state?.session
  );

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
  const spokenQuestionRef = useRef(null);

  // =========================================================
  // NORMALIZE SESSION ID
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
  // KEEP FRONTEND MODE AFTER REFRESH
  // =========================================================

  useEffect(() => {
    if (!sessionId) return;

    sessionStorage.setItem(
      `custom-practice-mode-${sessionId}`,
      communicationType
    );
  }, [sessionId, communicationType]);

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
        await customPracticeService.getSession(
          requestedSessionId
        );

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
  // INITIAL LOAD
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

    setAnswer(
      session?.currentQuestion?.draftAnswer || ""
    );
  }, [
    normalizedRouteSessionId,
    navigate,
    session,
  ]);

  // =========================================================
  // CURRENT QUESTION
  // =========================================================

  const currentQuestion = session?.currentQuestion;
  const currentQuestionId = currentQuestion?.questionId;

  const currentQuestionText =
    currentQuestion?.question ||
    currentQuestion?.content ||
    currentQuestion?.questionText ||
    "";

  // =========================================================
  // VOICE TRANSCRIPT -> EDITABLE ANSWER
  // =========================================================

  useEffect(() => {
    if (!isVoiceMode || !displayTranscript || evaluation) {
      return;
    }

    setAnswer(displayTranscript);
    setDraftStatus("idle");
  }, [
    displayTranscript,
    isVoiceMode,
    evaluation,
  ]);

  // =========================================================
  // AUTO-SPEAK EVERY NEW QUESTION IN VOICE MODE
  // =========================================================

  useEffect(() => {
    if (!isVoiceMode) return;

    if (!currentQuestionId || !currentQuestionText) {
      return;
    }

    // Do not speak the same question again because of a re-render.
    if (spokenQuestionRef.current === currentQuestionId) {
      return;
    }

    // Stop anything left from the previous question.
    stopListening();
    stopSpeaking();

    const timer = setTimeout(() => {
      spokenQuestionRef.current = currentQuestionId;

      speakText(currentQuestionText);
    }, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [
    isVoiceMode,
    currentQuestionId,
    currentQuestionText,
    speakText,
    stopListening,
    stopSpeaking,
  ]);

  // =========================================================
  // CLEAN UP VOICE WHEN LEAVING
  // =========================================================

  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, [stopListening, stopSpeaking]);

  // =========================================================
  // DRAFT SAVE
  // =========================================================

  useEffect(() => {
    const activeSessionId = normalizedRouteSessionId;
    const questionId = session?.currentQuestion?.questionId;

    if (!questionId || !activeSessionId || evaluation) {
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setDraftSaving(true);
      setDraftStatus("saving");

      try {
        await customPracticeService.saveDraft(
          activeSessionId,
          {
            questionId,
            draftAnswer: answer.trim() ? answer : null,
          }
        );

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
    evaluation,
  ]);

  // =========================================================
  // MANUAL ANSWER EDIT
  // =========================================================

  const handleAnswerChange = (event) => {
    const value = event.target.value;

    setAnswer(value);
    setDraftStatus("idle");

    /*
     * Keep voice transcript synchronized with manual edits.
     * This prevents the next recognition result from restoring
     * the old, unedited transcript.
     */
    if (isVoiceMode) {
      setTranscript(value);
    }
  };

  // =========================================================
  // START / STOP SPEAKING
  // =========================================================

  const handleVoiceToggle = () => {
    if (!isVoiceMode || evaluation) return;

    if (listening) {
      stopListening();
      return;
    }

    stopSpeaking();

    /*
     * Start recognition from the current editable answer.
     * New speech will append to what the user already has.
     */
    setTranscript(answer.trim());
    startListening();
  };

  // =========================================================
  // REPLAY QUESTION
  // =========================================================

  const handleReplayQuestion = () => {
    if (!currentQuestionText) return;

    stopListening();
    stopSpeaking();
    speakText(currentQuestionText);
  };

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

    if (isVoiceMode) {
      stopListening();
      stopSpeaking();
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
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // SKIP
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

    if (isVoiceMode) {
      stopListening();
      stopSpeaking();
    }

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

      clearTranscript();
      spokenQuestionRef.current = null;

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

    if (isVoiceMode) {
      stopListening();
      stopSpeaking();
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

        clearTranscript();

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

      const nextDraft =
        refreshed?.currentQuestion?.draftAnswer || "";

      setAnswer(nextDraft);

      clearTranscript();

      if (isVoiceMode && nextDraft) {
        setTranscript(nextDraft);
      }

      /*
       * Allow the next question to auto-speak.
       */
      spokenQuestionRef.current = null;

      setEvaluation(null);
      setShowNextButton(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setMovingNext(false);
    }
  };

  // =========================================================
  // PAUSE
  // =========================================================

  const handlePause = async (pauseDays) => {
    const activeSessionId = normalizedRouteSessionId;

    if (!activeSessionId) {
      toast.error("Invalid practice session ID.");
      return;
    }

    stopListening();
    stopSpeaking();

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
  // END
  // =========================================================

  const handleEnd = async () => {
    const activeSessionId = normalizedRouteSessionId;

    if (!activeSessionId) {
      toast.error("Invalid practice session ID.");
      return;
    }

    stopListening();
    stopSpeaking();

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

      sessionStorage.removeItem(
        `custom-practice-mode-${sessionId}`
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

  const totalQuestions = session?.totalQuestions || 0;
  const answeredQuestions =
    session?.answeredQuestions || 0;

  const progress =
    totalQuestions > 0
      ? Math.min(
        100,
        Math.round(
          (answeredQuestions / totalQuestions) * 100
        )
      )
      : 0;

  const questionNumber =
    currentQuestion?.questionNumber ||
    answeredQuestions + 1;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-3">
      {/* SESSION HEADER */}
      <Card className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Custom Practice
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {session.sessionName || "Practice Session"}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[session.status] ||
                  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
              >
                {session.status}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Round {session.currentRound || 1}
              </span>

              {currentQuestion && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {questionNumber} / {totalQuestions}
                </span>
              )}

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {isVoiceMode ? "Voice Mode" : "Chat Mode"}
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() => {
              stopListening();
              stopSpeaking();
              navigate("/custom-practice");
            }}
          >
            <span className="flex items-center gap-2">
              <PlayCircle size={16} />
              Home
            </span>
          </Button>
        </div>

        {roundBanner && (
          <div className="flex items-start gap-2 rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-700 dark:bg-sky-950/30 dark:text-sky-300">
            <RotateCcw
              size={16}
              className="mt-0.5 shrink-0"
            />
            <span>{roundBanner}</span>
          </div>
        )}

        {!showCompletionState && (
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Progress</span>
              <span>
                {answeredQuestions}/{totalQuestions}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-sky-500 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* ACTIVE PRACTICE */}
      {!showCompletionState && currentQuestion ? (
        <Card className="space-y-3">
          {/* QUESTION */}
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 text-lg font-semibold leading-snug text-slate-900 dark:text-slate-100 sm:text-xl">
              <span className="text-primary">
                Q {questionNumber})
              </span>{" "}
              {currentQuestionText}
            </h3>

            {/* REPLAY QUESTION - VOICE ONLY */}
            {isVoiceMode && (
              <button
                type="button"
                onClick={handleReplayQuestion}
                disabled={submitting || skipping}
                title="Replay question"
                aria-label="Replay question"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sky-600 transition hover:bg-sky-50 disabled:opacity-40 dark:text-sky-400 dark:hover:bg-sky-950/30"
              >
                <Volume2 size={18} />
              </button>
            )}
          </div>

          {/* ONE SMALL GAP */}
          <div className="pt-1">
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Your answer
            </label>

            <textarea
              rows={3}
              value={answer}
              onChange={handleAnswerChange}
              disabled={
                submitting ||
                skipping ||
                Boolean(evaluation)
              }
              placeholder={
                isVoiceMode
                  ? "Speak your answer or type here..."
                  : "Type your answer here..."
              }
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none ring-primary/50 transition focus:ring dark:border-slate-700 dark:bg-slate-950"
            />

            {/* VOICE ERROR */}
            {isVoiceMode && voiceError && (
              <p className="mt-1 text-xs text-rose-500">
                {voiceError}
              </p>
            )}

            {/* DRAFT STATUS */}
            {!evaluation && (
              <div className="mt-1 min-h-[18px] text-xs">
                {draftSaving || draftStatus === "saving" ? (
                  <span className="text-slate-400">
                    Saving draft...
                  </span>
                ) : draftStatus === "saved" ? (
                  <span className="text-emerald-500">
                    Draft saved
                  </span>
                ) : draftStatus === "error" ? (
                  <span className="text-amber-500">
                    Could not save draft.
                  </span>
                ) : null}
              </div>
            )}
          </div>

          {/* ALL ACTION BUTTONS IN SAME ROW */}
          <div className="flex flex-wrap items-center gap-2">
            {/* START / STOP SPEAKING - VOICE ONLY */}
            {isVoiceMode && (
              <Button
                variant="secondary"
                onClick={handleVoiceToggle}
                disabled={
                  submitting ||
                  skipping ||
                  Boolean(evaluation)
                }
                title={listening ? "Stop Speaking" : "Start Speaking"}
                aria-label={listening ? "Stop Speaking" : "Start Speaking"}
              >
                {listening ? (
                  <StopCircle size={20} />
                ) : (
                  <Mic size={20} />
                )}
              </Button>
            )}

            <Button
              onClick={handleSubmit}
              disabled={
                submitting ||
                skipping ||
                Boolean(evaluation) ||
                !answer.trim()
              }
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader />
                  Checking...
                </span>
              ) : (
                "Submit Answer"
              )}
            </Button>

            <Button
              variant="secondary"
              onClick={handleSkip}
              disabled={
                skipping ||
                submitting ||
                Boolean(evaluation)
              }
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
              onClick={() => {
                stopListening();
                stopSpeaking();
                setPauseModalOpen(true);
              }}
              disabled={submitting || skipping}
            >
              <span className="flex items-center gap-2">
                <PauseCircle size={16} />
                Pause
              </span>
            </Button>

            <Button
              variant="danger"
              onClick={() => {
                stopListening();
                stopSpeaking();
                setEndModalOpen(true);
              }}
              disabled={submitting || skipping}
            >
              <span className="flex items-center gap-2">
                <StopCircle size={16} />
                End Practice
              </span>
            </Button>
          </div>

          {/* COMPACT EVALUATION */}
          {evaluation && (
            <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/60">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <Sparkles
                      size={16}
                      className="text-primary"
                    />

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${evaluationStyles[
                        evaluation.status
                      ] ||
                        "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                    >
                      {evaluation.status
                        ?.replaceAll("_", " ") ||
                        "Reviewed"}
                    </span>
                  </div>

                  <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {evaluation.feedback ||
                      "No feedback was returned."}
                  </p>

                  {sessionMessage && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {sessionMessage}
                    </p>
                  )}
                </div>

                {showNextButton && (
                  <Button
                    onClick={handleNext}
                    disabled={movingNext}
                    className="shrink-0"
                  >
                    {movingNext ? (
                      <span className="flex items-center gap-2">
                        <Loader />
                        Loading...
                      </span>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          {!evaluation && sessionMessage && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {sessionMessage}
            </p>
          )}
        </Card>
      ) : (
        /* COMPLETION */
        <Card className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />

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
            <Button
              onClick={() => {
                sessionStorage.removeItem(
                  `custom-practice-mode-${sessionId}`
                );

                navigate(
                  `/custom-practice/report/${normalizedRouteSessionId}`
                );
              }}
            >
              View Report
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                sessionStorage.removeItem(
                  `custom-practice-mode-${sessionId}`
                );

                navigate("/custom-practice");
              }}
            >
              Back to Custom Practice
            </Button>
          </div>
        </Card>
      )}

      {/* MODALS */}
      <PausePracticeModal
        isOpen={pauseModalOpen}
        onClose={() => setPauseModalOpen(false)}
        onPause={handlePause}
        loading={pauseLoading}
      />

      <EndPracticeModal
        open={endModalOpen}
        onClose={() => setEndModalOpen(false)}
        onConfirm={handleEnd}
        loading={endLoading}
      />
    </div>
  );
};