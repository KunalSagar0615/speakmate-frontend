import { Mic, Volume2, CircleStop , Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button, Card } from "../common/UI";

/* =========================================================
   Suggest Answer Icon
   ========================================================= */

const SuggestAnswerIcon = ({ size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_suggest_answer)">
        <path
          d="M8.53003 21.9601C8.12003 21.9601 7.78003 21.6201 7.78003 21.2101V19.2101C7.78003 18.8001 8.12003 18.4601 8.53003 18.4601C8.94003 18.4601 9.28003 18.8001 9.28003 19.2101V21.2101C9.28003 21.6201 8.94003 21.9601 8.53003 21.9601Z"
          fill="white"
        />

        <path
          d="M12.53 21.9601C12.12 21.9601 11.78 21.6201 11.78 21.2101V19.2101C11.78 18.8001 12.12 18.4601 12.53 18.4601C12.94 18.4601 13.28 18.8001 13.28 19.2101V21.2101C13.28 21.6201 12.94 21.9601 12.53 21.9601Z"
          fill="white"
        />

        <path
          d="M16.53 21.9601C16.12 21.9601 15.78 21.6201 15.78 21.2101V19.2101C15.78 18.8001 16.12 18.4601 16.53 18.4601C16.94 18.4601 17.28 18.8001 17.28 19.2101V21.2101C17.28 21.6201 16.94 21.9601 16.53 21.9601Z"
          fill="white"
        />

        <path
          opacity="0.4"
          d="M22.53 7.71008V12.7101C22.53 14.3701 21.53 15.7101 19.53 15.7101H5.53003C3.53003 15.7101 2.53003 14.3701 2.53003 12.7101V7.71008C2.53003 7.52008 2.55003 7.34008 2.57003 7.16008C2.98003 7.33008 3.30003 7.67008 3.42003 8.11008L3.68003 9.08008C3.84003 9.68008 4.34003 10.0601 4.95003 10.0601C5.56003 10.0601 6.06003 9.68008 6.22003 9.09008L6.48003 8.13008C6.62003 7.62008 6.99003 7.25008 7.50003 7.11008L8.49003 6.84008C9.04121 6.66656 9.44003 6.17271 9.44003 5.59008C9.44003 5.25008 9.32003 4.95008 9.11003 4.71008H19.53C21.53 4.71008 22.53 6.05008 22.53 7.71008Z"
          fill="white"
        />

        <path
          d="M17.78 12.7101C17.78 13.1201 17.44 13.4601 17.03 13.4601H8.03003C7.62003 13.4601 7.28003 13.1201 7.28003 12.7101C7.28003 12.3001 7.62003 11.9601 8.03003 11.9601H17.03C17.44 11.9601 17.78 12.3001 17.78 12.7101Z"
          fill="white"
        />

        <path
          d="M18.28 8.21008C18.28 8.62008 17.94 8.96008 17.53 8.96008H15.53C15.12 8.96008 14.78 8.62008 14.78 8.21008C14.78 7.80008 15.12 7.46008 15.53 7.46008H17.53C17.94 7.46008 18.28 7.80008 18.28 8.21008Z"
          fill="white"
        />

        <path
          d="M8.45997 5.57004C8.45997 5.64004 8.41997 5.80004 8.22997 5.86004L7.24997 6.13004C6.39997 6.36004 5.75997 7.00004 5.52997 7.85004L5.26997 8.81004C5.20997 9.03004 5.03997 9.05004 4.95997 9.05004C4.87997 9.05004 4.70997 9.03004 4.64997 8.81004L4.38997 7.84004C4.15997 7.00004 3.50997 6.36004 2.66997 6.13004L1.69997 5.87004C1.48997 5.81004 1.46997 5.63004 1.46997 5.56004C1.46997 5.48004 1.48997 5.30004 1.69997 5.24004L2.67997 4.98004C3.51997 4.74004 4.15997 4.10004 4.38997 3.26004L4.66997 2.24004C4.73997 2.07004 4.89997 2.04004 4.95997 2.04004C5.01997 2.04004 5.18997 2.06004 5.24997 2.22004L5.52997 3.25004C5.75997 4.09004 6.40997 4.73004 7.24997 4.97004L8.24997 5.25004C8.44997 5.33004 8.45997 5.51004 8.45997 5.57004Z"
          fill="white"
        />
      </g>

      <defs>
        <clipPath id="clip0_suggest_answer">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

/* =========================================================
   Send Icon
   ========================================================= */

const SendIcon = ({ size = 24, color = "currentColor" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_send_icon)">
        <path
          d="M9.50978 4.23062L18.0698 8.51062C21.9098 10.4306 21.9098 13.5706 18.0698 15.4906L9.50978 19.7706C3.74978 22.6506 1.39978 20.2906 4.27978 14.5406L5.14978 12.8106C5.36998 12.3706 5.36998 11.6406 5.14978 11.2006L4.27978 9.46062C1.39978 3.71062 3.75978 1.35062 9.50978 4.23062Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          opacity="0.34"
          d="M5.43994 12H10.8399"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <defs>
        <clipPath id="clip0_send_icon">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

/* =========================================================
   Chat Window
   ========================================================= */

export const ChatWindow = ({
  messages,
  questionNumber,
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
    <div className="grid gap-2">
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
                  <p className="text-lg font-medium leading-tight text-sky-500">
                    Q {questionNumber}) {m.question || m.aiQuestion}
                  </p>

                  {isLatestQuestion && showTranslationControls && (
                    <div className="mt-2 space-y-2">
                      {translationLoading ? (
                        <p className="text-sm leading-tight text-slate-500">
                          Translating...
                        </p>
                      ) : translationError ? (
                        <p className="text-sm text-amber-600">
                          {translationError}
                        </p>
                      ) : translationMode !== "ENGLISH" &&
                        translatedText ? (
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
          className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none ring-primary/50 focus:ring dark:border-slate-700 dark:bg-slate-900"
        />

        <div className="flex flex-wrap items-center gap-2">
          {/* Send */}
          <Button
            onClick={onSend}
            disabled={!answer?.trim() || loading}
            title="Send"
            aria-label="Send"
            className="px-4"
          >
            <SendIcon size={20} color="currentColor" />
          </Button>

          {/* Suggest Answer */}
          <Button
            variant="secondary"
            onClick={onShowSuggestedAnswer}
            disabled={
              suggestedAnswerLoading ||
              !latestMessage?.aiQuestion
            }
            title="Suggest Ans"
            aria-label="Suggest Ans"
            className="px-4"
          >
            <Sparkles size={20} />
          </Button>

          {/* End Session */}
          <Button
            variant="danger"
            onClick={onEnd}
            disabled={loading}
            title="End Session"
            aria-label="End Session"
            className="px-4"
          >
            <CircleStop size={20} />
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

/* =========================================================
   Voice Panel
   ========================================================= */

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
      <p className="text-sm font-medium text-slate-500">
        AI Question
      </p>

      <p className="rounded-xl bg-sky-50 p-3 text-slate-700 dark:bg-sky-950/30 dark:text-slate-100">
        Q {questionNumber}) {question}
      </p>

      {showTranslationControls && (
        <div className="space-y-2">
          {translationLoading ? (
            <p className="text-sm text-slate-500">
              Translating question...
            </p>
          ) : translationError ? (
            <p className="text-sm text-amber-600">
              {translationError}
            </p>
          ) : translatedText && translatedText !== "ENGLISH" ? (
            <p className="rounded-lg border border-slate-200 bg-white/80 p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              {translatedText}
            </p>
          ) : null}
        </div>
      )}
    </div>

    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Your Transcript
      </p>

      <textarea
        value={transcriptValue}
        onChange={(e) => onTranscriptChange?.(e.target.value)}
        placeholder="Click Start Speaking and speak your answer..."
        className="min-h-[110px] w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none ring-primary/50 focus:ring dark:border-slate-700 dark:bg-slate-900"
      />

      <p className="mt-2 text-xs text-slate-500">
        You can edit the recognized text before submitting.
      </p>
    </div>

    {feedback && (
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          AI Feedback
        </p>

        <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          {feedback}
        </p>
      </div>
    )}

    <div className="flex flex-wrap items-center gap-2">
      {/* Start Speaking */}
      <Button
        onClick={onStart}
        disabled={listening || loading}
        title="Start Speaking"
        aria-label="Start Speaking"
      >
        <Mic size={20} />
      </Button>

      {/* Submit Answer */}
      <Button
        onClick={onSubmit}
        disabled={!transcriptValue?.trim() || loading}
        title="Submit Answer"
        aria-label="Submit Answer"
        className="px-4"
      >
        <SendIcon size={20} color="currentColor" />
      </Button>

      {/* Suggest Answer */}
      <Button
        variant="secondary"
        onClick={onShowSuggestedAnswer}
        disabled={
          suggestedAnswerLoading ||
          !question?.trim()
        }
        title="Suggest Ans"
        aria-label="Suggest Ans"
        className="px-4"
      >
        <Sparkles size={20} />
      </Button>

      {/* Replay AI Voice */}
      <Button
        variant="secondary"
        onClick={onReplay}
        disabled={loading}
        title="Replay AI Voice"
        aria-label="Replay AI Voice"
      >
        <Volume2 size={20} />
      </Button>

      {/* End Session */}
      <Button
        variant="danger"
        onClick={onEnd}
        disabled={loading}
        title="End Session"
        aria-label="End Session"
        className="px-4"
      >
        <CircleStop size={20} />
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
);