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

  return (
    <div className="grid h-[80vh] grid-rows-[1fr_auto] gap-3">
      <Card className="overflow-auto">
        <h2 className="mb-3 text-lg font-semibold">{title}</h2>
        <div className="space-y-4">
          {showTranslationControls && (
            <div className="rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-900/70">
              <label className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="font-medium">Translation:</span>
                <select
                  value={translationMode}
                  onChange={(e) => onTranslationChange?.(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="ENGLISH">English Only</option>
                  <option value="HINDI">English + Hindi</option>
                  <option value="MARATHI">English + Marathi</option>
                </select>
              </label>
              {translationLoading ? (
                <p className="mt-2 text-sm text-slate-500">Translating question...</p>
              ) : translationError ? (
                <p className="mt-2 text-sm text-amber-600">{translationError}</p>
              ) : translatedText && translatedText !== "ENGLISH" ? (
                <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {translatedText}
                </p>
              ) : null}
              <p className="mt-2 text-xs text-slate-500">{translationLabel}</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id}>
              <p className="font-medium text-sky-600">Q: {m.question || m.aiQuestion}</p>

              {(m.answer || m.userAnswer) && <p className="mt-1">A: {m.answer || m.userAnswer}</p>}

              {(m.feedback || m.aiFeedback) && (
                <p className="mt-1 text-emerald-600">Feedback: {m.feedback || m.aiFeedback}</p>
              )}
            </div>
          ))}
          {loading && <p className="animate-pulse text-slate-500">AI is thinking...</p>}
          <div ref={bottomRef} />
        </div>
      </Card>
      <Card className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={onSend} disabled={!answer || loading}>
            Send
          </Button>
          <Button
            variant="secondary"
            onClick={onShowSuggestedAnswer}
            disabled={suggestedAnswerLoading || !messages?.length}
            className="gap-2"
          >
            <Sparkles size={16} />
            {suggestedAnswerLoading ? "Loading..." : "Show Suggested Answer"}
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
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-sky-600">Suggested Answer</p>
            <p>{suggestedAnswer}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export const VoicePanel = ({
  question,
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
}) => (
  <Card className="space-y-5">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Voice Practice</h2>
      {listening && (
        <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
          Listening...
        </span>
      )}
    </div>

    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">AI Question</p>
      <p className="rounded-xl bg-sky-50 p-4 text-slate-700 dark:bg-sky-950/30 dark:text-slate-100">
        {question}
      </p>
      {showTranslationControls && (
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-medium">Translation:</span>
            <select
              value={translationMode}
              onChange={(e) => onTranslationChange?.(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="ENGLISH">English Only</option>
              <option value="HINDI">English + Hindi</option>
              <option value="MARATHI">English + Marathi</option>
            </select>
          </label>
          {translationLoading ? (
            <p className="text-sm text-slate-500">Translating question...</p>
          ) : translationError ? (
            <p className="text-sm text-amber-600">{translationError}</p>
          ) : translatedText && translatedText !== "ENGLISH" ? (
            <p className="rounded-lg border border-slate-200 bg-white/80 p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              {translatedText}
            </p>
          ) : null}
          <p className="text-xs text-slate-500">{translationLabel}</p>
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

    <div className="flex flex-wrap gap-2">
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
      <Button variant="secondary" onClick={onReplay} disabled={loading} className="gap-2">
        <Volume2 size={16} />
        Replay AI Voice
      </Button>
      <Button variant="danger" onClick={onEnd} disabled={loading}>
        End Session
      </Button>
    </div>
  </Card>
);
