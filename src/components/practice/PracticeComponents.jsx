import { Mic, Volume2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button, Card, Input } from "../common/UI";

export const ChatWindow = ({
  messages,
  answer,
  setAnswer,
  onSend,
  onEnd,
  loading,
  title = "Chat Practice",
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
      <Card className="flex gap-2">
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="flex-1"
        />
        <Button onClick={onSend} disabled={!answer || loading}>
          Send
        </Button>
        <Button variant="danger" onClick={onEnd} disabled={loading}>
          End Session
        </Button>
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
    </div>

    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Your Transcript</p>
      <div className="min-h-[80px] rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
        {displayTranscript || (
          <span className="text-slate-400">Click &quot;Start Speaking&quot; and speak your answer...</span>
        )}
      </div>
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
        disabled={!displayTranscript?.trim() || loading}
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
