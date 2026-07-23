import { ArrowDown, ArrowUp, PlusCircle, Trash2 } from "lucide-react";
import { Button, Input } from "../common/UI";

export const QuestionEditor = ({
  questions,
  setQuestions,
  sessionName,
  setSessionName,
  disabled = false,
  maxQuestions = 100,
}) => {
  const addQuestion = () => {
    if (questions.length >= maxQuestions) return;
    setQuestions([...questions, ""]);
  };

  const updateQuestion = (index, value) => {
    const next = [...questions];
    next[index] = value;
    setQuestions(next);
  };

  const removeQuestion = (index) => {
    const next = questions.filter((_, currentIndex) => currentIndex !== index);
    setQuestions(next);
  };

  const moveQuestion = (index, direction) => {
    const next = [...questions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;
    const [item] = next.splice(index, 1);
    next.splice(targetIndex, 0, item);
    setQuestions(next);
  };

  return (
    <div className="space-y-4">
      <Input
        label="Session Name"
        placeholder="e.g. Spring Boot Interview Prep"
        value={sessionName}
        onChange={(event) => setSessionName(event.target.value)}
        disabled={disabled}
      />

      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900/70">
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100">Questions</p>
          <p className="text-slate-500 dark:text-slate-400">{questions.length} / {maxQuestions} questions</p>
        </div>
        <Button type="button" variant="secondary" onClick={addQuestion} disabled={disabled || questions.length >= maxQuestions}>
          <span className="flex items-center gap-2">
            <PlusCircle size={16} /> Add Question
          </span>
        </Button>
      </div>

      <div className="space-y-3">
        {questions.map((question, index) => (
          <div key={`${index}-${question}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Question {index + 1}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveQuestion(index, "up")}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  aria-label={`Move question ${index + 1} up`}
                  disabled={disabled || index === 0}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => moveQuestion(index, "down")}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  aria-label={`Move question ${index + 1} down`}
                  disabled={disabled || index === questions.length - 1}
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-950/30"
                  aria-label={`Remove question ${index + 1}`}
                  disabled={disabled}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <textarea
              value={question}
              rows={3}
              onChange={(event) => updateQuestion(index, event.target.value)}
              placeholder="Enter a question"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-primary/50 focus:ring dark:border-slate-700 dark:bg-slate-950"
              disabled={disabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
