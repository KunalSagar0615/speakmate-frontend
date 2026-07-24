import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MessageCircle, Mic } from "lucide-react";

import {
  Button,
  Card,
  Loader,
} from "../../components/common/UI";
import { QuestionEditor } from "../../components/custom-practice/QuestionEditor";
import { customPracticeService } from "../../services/customPracticeService";
import { getErrorMessage } from "../../utils/errorMessages";

export const CustomPracticeSetup = () => {
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [extractError, setExtractError] = useState("");
  const [creating, setCreating] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Chat is default.
  // We are NOT sending this to backend yet.
  const [communicationType, setCommunicationType] =
    useState("CHAT");

  const isValid = useMemo(() => {
    const cleaned = questions
      .map((question) => question.trim())
      .filter(Boolean);

    return (
      sessionName.trim().length > 0 &&
      cleaned.length > 0 &&
      cleaned.length === questions.length &&
      questions.every(
        (question) => question.trim().length > 0
      )
    );
  }, [questions, sessionName]);

  const handleExtract = async () => {
    if (!content.trim()) {
      setExtractError(
        "Paste some content to extract questions."
      );
      return;
    }

    setExtractError("");
    setExtracting(true);

    try {
      const result =
        await customPracticeService.extractQuestions(
          content.trim()
        );

      const nextQuestions = (
        result?.questions || []
      )
        .map((item) => item.trim())
        .filter(Boolean);

      setQuestions(nextQuestions);
      setShowReview(true);

      if (nextQuestions.length === 0) {
        toast.error(
          "No questions were extracted."
        );
      }
    } catch (error) {
      setExtractError(getErrorMessage(error));
    } finally {
      setExtracting(false);
    }
  };

  const handleCreateSession = async () => {
    if (!isValid) {
      toast.error(
        "Enter a session name and make sure every question has content."
      );
      return;
    }

    setCreating(true);

    try {
      // Keep existing backend request unchanged.
      const session =
        await customPracticeService.createSession({
          sessionName: sessionName.trim(),
          questions: questions.map((question) =>
            question.trim()
          ),
        });

      const sessionId =
        session?.sessionId ?? null;

      if (
        !sessionId ||
        !/^\d+$/.test(String(sessionId))
      ) {
        console.error(
          "Invalid session returned from backend:",
          session
        );

        toast.error(
          "Invalid practice session ID."
        );
        return;
      }

      toast.success(
        `${
          communicationType === "VOICE"
            ? "Voice"
            : "Chat"
        } practice session created.`
      );

      navigate(
        `/custom-practice/session/${String(
          sessionId
        )}`,
        {
          state: {
            session,
            communicationType,
          },
        }
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setCreating(false);
    }
  };

  const handleClear = () => {
    setContent("");
    setQuestions([]);
    setShowReview(false);
    setExtractError("");
    setSessionName("");
    setCommunicationType("CHAT");
  };

  return (
    <div className="space-y-4">
      {/* QUESTION EXTRACTION */}
      <Card className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Custom Practice
          </p>

          <h2 className="text-2xl font-bold">
            Create a new practice session
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Paste your interview or study
            questions and let the AI extract a
            clean list for practice.
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Paste your questions or notes

            <textarea
              rows={8}
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              placeholder="What is Spring Boot? Explain dependency injection..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-primary/50 focus:ring dark:border-slate-700 dark:bg-slate-950"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleExtract}
              disabled={extracting}
            >
              {extracting ? (
                <span className="flex items-center gap-2">
                  <Loader />
                  Extracting...
                </span>
              ) : (
                "Extract Questions"
              )}
            </Button>

            <Button
              variant="secondary"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>

          {extractError && (
            <p className="text-sm text-rose-500">
              {extractError}
            </p>
          )}
        </div>
      </Card>

      {/* REVIEW */}
      {showReview && (
        <Card className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold">
                Review your questions
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Edit, remove, or add questions
                before you start.
              </p>
            </div>

            <div className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
              {questions.length} questions
            </div>
          </div>

          <QuestionEditor
            questions={questions}
            setQuestions={setQuestions}
            sessionName={sessionName}
            setSessionName={setSessionName}
            disabled={creating}
          />

          {/* PRACTICE MODE */}
          <div>
            <div className="mb-2">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Practice Mode
              </h4>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose how you want to answer
                your questions.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {/* CHAT */}
              <button
                type="button"
                disabled={creating}
                onClick={() =>
                  setCommunicationType("CHAT")
                }
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  communicationType === "CHAT"
                    ? "border-sky-500 bg-sky-50 ring-1 ring-sky-500/30 dark:bg-sky-950/30"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-slate-600"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    communicationType === "CHAT"
                      ? "bg-sky-500 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <MessageCircle size={19} />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Chat Mode
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Type and edit your answers
                  </p>
                </div>
              </button>

              {/* VOICE */}
              <button
                type="button"
                disabled={creating}
                onClick={() =>
                  setCommunicationType("VOICE")
                }
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  communicationType === "VOICE"
                    ? "border-sky-500 bg-sky-50 ring-1 ring-sky-500/30 dark:bg-sky-950/30"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-slate-600"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    communicationType === "VOICE"
                      ? "bg-sky-500 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <Mic size={19} />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Voice Mode
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Speak, review and edit your
                    answer
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                navigate("/custom-practice")
              }
            >
              Cancel
            </Button>

            <Button
              onClick={handleCreateSession}
              disabled={creating || !isValid}
            >
              {creating ? (
                <span className="flex items-center gap-2">
                  <Loader />
                  Starting...
                </span>
              ) : communicationType ===
                "VOICE" ? (
                <span className="flex items-center gap-2">
                  <Mic size={16} />
                  Start Voice Practice
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  Start Chat Practice
                </span>
              )}
            </Button>
          </div>

          {!isValid && (
            <p className="text-sm text-amber-600">
              Session name is required, there
              must be at least one question, and
              every question must have content.
            </p>
          )}
        </Card>
      )}
    </div>
  );
};