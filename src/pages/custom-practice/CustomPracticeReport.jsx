import { Clock3, Sparkles, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Button, Card, Loader } from "../../components/common/UI";
import { customPracticeService } from "../../services/customPracticeService";
import { getErrorMessage } from "../../utils/errorMessages";

const statusStyles = {
  CORRECT:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",

  PARTIALLY_CORRECT:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",

  INCORRECT:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const CustomPracticeReport = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * Route:
   *
   * /custom-practice/report/:sessionId
   *
   * Example:
   * /custom-practice/report/6
   */
  const normalizedSessionId = useMemo(() => {
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

    if (!Number.isInteger(parsed) || parsed <= 0) {
      return null;
    }

    return String(parsed);
  }, [sessionId]);

  useEffect(() => {
    let mounted = true;

    const loadReport = async () => {
      if (!normalizedSessionId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data =
          await customPracticeService.getReport(
            normalizedSessionId
          );

        if (mounted) {
          setReport(data);
        }
      } catch (error) {
        if (mounted) {
          setReport(null);
          toast.error(getErrorMessage(error));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadReport();

    return () => {
      mounted = false;
    };
  }, [normalizedSessionId]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!normalizedSessionId) {
    return (
      <Card className="space-y-4">
        <p className="font-medium text-rose-500">
          Invalid practice session ID.
        </p>

        <Button
          variant="secondary"
          onClick={() => navigate("/custom-practice")}
        >
          Back to Custom Practice
        </Button>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card className="space-y-4">
        <p className="text-rose-500">
          Unable to load the practice report.
        </p>

        <Button
          variant="secondary"
          onClick={() => navigate("/custom-practice")}
        >
          Back to Custom Practice
        </Button>
      </Card>
    );
  }

  const questions = Array.isArray(report.questions)
    ? report.questions
    : [];

  return (
    <div className="space-y-4">

      {/* =========================
          REPORT SUMMARY
      ========================== */}

      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Custom Practice Report
            </p>

            <h2 className="text-2xl font-bold">
              {report.sessionName || "Practice Session"}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {report.status || "Completed"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center dark:border-slate-700 dark:bg-slate-900/70">
            <p className="text-sm text-slate-500">
              Overall score
            </p>

            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {report.overallScore ?? "—"}
            </p>
          </div>
        </div>

        {/* =========================
            STATISTICS
        ========================== */}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total questions",
              value: report.totalQuestions,
            },
            {
              label: "Answered",
              value: report.answeredQuestions,
            },
            {
              label: "Correct",
              value: report.correctQuestions,
            },
            {
              label: "Partially correct",
              value: report.partiallyCorrectQuestions,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70"
            >
              <p className="text-sm text-slate-500">
                {item.label}
              </p>

              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                {item.value ?? 0}
              </p>
            </div>
          ))}
        </div>

        {/* =========================
            AI FEEDBACK
        ========================== */}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/70">

          <div className="flex items-center gap-2 text-primary">
            <Sparkles size={18} />

            <p className="font-semibold">
              Overall AI feedback
            </p>
          </div>

          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
            {report.overallAiFeedback ||
              "No overall feedback was returned."}
          </p>
        </div>
      </Card>

      {/* =========================
          QUESTION REVIEW
      ========================== */}

      <Card className="space-y-4">

        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />

          <h3 className="text-lg font-semibold">
            Question review
          </h3>
        </div>

        {questions.length === 0 ? (
          <p className="text-sm text-slate-500">
            No question details are available for this session.
          </p>
        ) : (
          questions.map((question, index) => {

            const attempts = Array.isArray(question.attempts)
              ? question.attempts
              : [];

            return (
              <div
                key={
                  question.questionId ??
                  `question-${index}`
                }
                className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70"
              >

                {/* QUESTION */}

                <div className="flex flex-wrap items-start justify-between gap-3">

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Question{" "}
                      {question.questionOrder ??
                        index + 1}
                    </p>

                    <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                      {question.questionText ||
                        "Question unavailable"}
                    </p>
                  </div>

                  {/* FLAGS */}

                  <div className="flex flex-wrap items-center gap-2">

                    {question.skipped && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        Skipped
                      </span>
                    )}

                    {question.notAttempted && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        Not attempted
                      </span>
                    )}

                    {question.retried && (
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                        Retried
                      </span>
                    )}
                  </div>
                </div>

                {/* ATTEMPTS */}

                <div className="mt-3 space-y-3">

                  {attempts.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No attempts recorded.
                    </p>
                  ) : (
                    attempts.map(
                      (attempt, attemptIndex) => {

                        const attemptKey =
                          attempt.attemptId ??
                          attempt.id ??
                          `${question.questionId ?? index}-${attemptIndex}`;

                        return (
                          <div
                            key={attemptKey}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/50"
                          >

                            <div className="flex flex-wrap items-center justify-between gap-2">

                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                Attempt {attemptIndex + 1}
                              </p>

                              <div className="flex flex-wrap items-center gap-2">

                                {attempt.evaluationStatus && (
                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                      statusStyles[
                                        attempt.evaluationStatus
                                      ] ||
                                      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                    }`}
                                  >
                                    {attempt.evaluationStatus}
                                  </span>
                                )}

                                {attempt.attemptType && (
                                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                    {attempt.attemptType}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* ANSWER */}

                            <p className="mt-2 text-sm text-slate-500">
                              Answer
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200">
                              {attempt.userAnswer ||
                                "No answer provided."}
                            </p>

                            {/* FEEDBACK */}

                            <p className="mt-2 text-sm text-slate-500">
                              Feedback
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200">
                              {attempt.feedback ||
                                "No feedback available."}
                            </p>

                            {/* SCORE + TIME */}

                            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">

                              <span className="flex items-center gap-1">
                                <TrendingUp size={14} />
                                Score {attempt.score ?? "—"}
                              </span>

                              <span className="flex items-center gap-1">
                                <Clock3 size={14} />
                                {formatDate(
                                  attempt.submittedAt
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* =========================
            NAVIGATION
        ========================== */}

        <div className="flex flex-wrap justify-end gap-2">

          <Button
            variant="secondary"
            onClick={() =>
              navigate("/custom-practice")
            }
          >
            Back to Custom Practice
          </Button>

          <Button
            onClick={() =>
              navigate("/custom-practice/new")
            }
          >
            Start New Practice
          </Button>

        </div>
      </Card>
    </div>
  );
};