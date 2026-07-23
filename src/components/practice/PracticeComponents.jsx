import { Mic, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button, Card } from "../common/UI";
export const ChatWindow = ({
  messages,
  answer,
  setAnswer,
  onSend,
  onEnd,
  loading,
  title = "Chat Practice",
  suggestedAnswer,
  suggestedAnswerLoading,
  onShowSuggestedAnswer,
  suggestedAnswerError,
  translationMode,
  translatedText,
  translationLabel,
  translationLoading,
  onTranslationChange,
  translationError,
  showTranslationControls = false,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const latestMessage = messages?.[messages.length - 1];

  return (
    <div className="grid h-[80vh] grid-rows-[1fr_auto] gap-2">
      <Card className="overflow-auto p-4">
        <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          {showTranslationControls && (
            <select
              value={translationMode}
              onChange={(e) => onTranslationChange?.(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="ENGLISH">English Only</option>
              <option value="HINDI">English + Hindi</option>
              <option value="MARATHI">English + Marathi</option>
            </select>
          )}
        </div>

        <div className="space-y-2">
          {messages.map((m, index) => {
            const isLatestQuestion = index === messages.length - 1;

            return (
              <div key={m.id} className="space-y-1">
                {/* Question */}
                <div className="rounded-xl bg-sky-50 p-3 dark:bg-sky-950/30">
                  <p className="text-lg font-medium text-sky-500 leading-tight">
                    Q {index + 1}) {m.question || m.aiQuestion}
                  </p>

                  {isLatestQuestion && showTranslationControls && (
                    <div className="mt-2 space-y-2">
                      {translationLoading ? (
                        <p className="text-sm text-slate-500 leading-tight">
                          Translating...
                        </p>
                      ) : translationError ? (
                        <p className="text-sm text-amber-600">{translationError}</p>
                      ) : translationMode !== "ENGLISH" && translatedText ? (
                        <p className="rounded-lg border border-slate-200 bg-white/80 p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                          {translatedText}
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>

                {isLatestQuestion && translationError && (
                  <p className="text-xs text-amber-600">{translationError}</p>
                )}

                {/* User Answer */}
                {(m.answer || m.userAnswer) && (
                  <p className="text-slate-200">
                    <span className="font-medium">A:</span>{" "}
                    {m.answer || m.userAnswer}
                  </p>
                )}

                {/* Feedback */}
                {(m.feedback || m.aiFeedback) && (
                  <p className="text-emerald-500">
                    <span className="font-medium">Feedback:</span>{" "}
                    {m.feedback || m.aiFeedback}
                  </p>
                )}
              </div>
            );
          })}

          {loading && (
            <p className="animate-pulse text-slate-500">
              AI is thinking...
            </p>
          )}

          <div ref={bottomRef} />
        </div>
      </Card>

      <Card className="space-y-2 p-3">
        {/* Answer Box */}
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={4}
          className="
            min-h-[110px]
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            p-4
            text-sm
            outline-none
            ring-primary/50
            focus:ring
            dark:border-slate-700
            dark:bg-slate-900
          "
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={onSend} disabled={!answer?.trim() || loading}>
            Send
          </Button>

          <Button
            variant="secondary"
            onClick={onShowSuggestedAnswer}
            disabled={
              suggestedAnswerLoading ||
              !latestMessage?.aiQuestion
            }
            className="gap-2"
          >
            <Sparkles size={16} />
            {suggestedAnswerLoading
              ? "Loading..."
              : "Show Suggested Answer"}
          </Button>

          <Button
            variant="danger"
            onClick={onEnd}
            disabled={loading}
          >
            End Session
          </Button>
        </div>

        {suggestedAnswerError && (
          <p className="text-sm text-rose-500">
            {suggestedAnswerError}
          </p>
        )}

        {suggestedAnswer && (
          <div className="rounded-xl border border-sky-200 bg-sky-50/80 p-3 text-sm text-slate-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-slate-200">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-sky-600">
              Suggested Answer
            </p>
            <p>{suggestedAnswer}</p>
          </div>
        )}
      </Card>
    </div>
  );
};
export const VoicePanel = ({
  question,
  questionNumber,
  displayTranscript,
  listening,
  feedback,
  loading,
  onStart,
  onReplay,
  onSubmit,
  onEnd,
  translationMode,
  translatedText,
  translationLabel,
  translationLoading,
  onTranslationChange,
  translationError,
  transcriptValue,
  onTranscriptChange,
  showTranslationControls = false,
  suggestedAnswer,
  suggestedAnswerLoading,
  onShowSuggestedAnswer,
  suggestedAnswerError,
}) => (
  <Card className="space-y-3 p-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <h2 className="text-lg font-semibold">Voice Practice</h2>
      <div className="flex items-center gap-2">
        {showTranslationControls && (
          <select
            value={translationMode}
            onChange={(e) => onTranslationChange?.(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="ENGLISH">English Only</option>
            <option value="HINDI">English + Hindi</option>
            <option value="MARATHI">English + Marathi</option>
          </select>
        )}
        {listening && (
          <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
            Listening...
          </span>
        )}
      </div>
    </div>

    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-500">AI Question</p>
      <p className="rounded-xl bg-sky-50 p-3 text-slate-700 dark:bg-sky-950/30 dark:text-slate-100">
        Q {questionNumber}) {question}
      </p>
      {showTranslationControls && (
        <div className="space-y-2">
          {translationLoading ? (
            <p className="text-sm text-slate-500">Translating question...</p>
          ) : translationError ? (
            <p className="text-sm text-amber-600">{translationError}</p>
          ) : translatedText && translatedText !== "ENGLISH" ? (
            <p className="rounded-lg border border-slate-200 bg-white/80 p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              {translatedText}
            </p>
          ) : null}
        </div>
      )}
    </div>

    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Your Transcript</p>
      <textarea
        value={transcriptValue}
        onChange={(e) => onTranscriptChange?.(e.target.value)}
        placeholder="Click Start Speaking and speak your answer..."
        className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none ring-primary/50 focus:ring dark:border-slate-700 dark:bg-slate-900"
      />
      <p className="mt-2 text-xs text-slate-500">You can edit the recognized text before submitting.</p>
    </div>

    {feedback && (
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">AI Feedback</p>
        <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          {feedback}
        </p>
      </div>
    )}

    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={onStart} disabled={listening || loading} className="gap-2">
        <Mic size={16} />
        Start Speaking
      </Button>
      <Button
        onClick={onSubmit}
        disabled={!transcriptValue?.trim() || loading}
        className="gap-2"
      >
        {loading ? "Submitting..." : "Submit Answer"}
      </Button>
      <Button
        variant="secondary"
        onClick={onShowSuggestedAnswer}
        disabled={suggestedAnswerLoading || !question?.trim()}
        className="gap-2"
      >
        <Sparkles size={16} />
        {suggestedAnswerLoading ? "Loading..." : "💡 Suggested Answer"}
      </Button>
      <Button variant="secondary" onClick={onReplay} disabled={loading} className="gap-2">
        <Volume2 size={16} />
        Replay AI Voice
      </Button>
      <Button variant="danger" onClick={onEnd} disabled={loading}>
        End Session
      </Button>
    </div>

    {suggestedAnswerError && (
      <p className="text-sm text-rose-500">{suggestedAnswerError}</p>
    )}

    {suggestedAnswer && (
      <div className="rounded-xl border border-sky-200 bg-sky-50/80 p-3 text-sm text-slate-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-slate-200">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-sky-600">
          Suggested Answer
        </p>
        <p>{suggestedAnswer}</p>
      </div>
    )}
  </Card>
);
