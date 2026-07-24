import {
  ArrowDown,
  ArrowUp,
  Check,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button, Input } from "../common/UI";

export const QuestionEditor = ({
  questions,
  setQuestions,
  sessionName,
  setSessionName,
  disabled = false,
  maxQuestions = 100,
}) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const addQuestion = () => {
    if (questions.length >= maxQuestions) return;

    const nextQuestions = [...questions, ""];
    setQuestions(nextQuestions);

    // Immediately edit the newly added question
    setEditingIndex(nextQuestions.length - 1);
    setEditValue("");
  };

  const removeQuestion = (index) => {
    const next = questions.filter(
      (_, currentIndex) => currentIndex !== index
    );

    setQuestions(next);

    if (editingIndex === index) {
      setEditingIndex(null);
      setEditValue("");
    } else if (editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const moveQuestion = (index, direction) => {
    const targetIndex =
      direction === "up" ? index - 1 : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= questions.length
    ) {
      return;
    }

    const next = [...questions];

    [next[index], next[targetIndex]] = [
      next[targetIndex],
      next[index],
    ];

    setQuestions(next);

    if (editingIndex === index) {
      setEditingIndex(targetIndex);
    } else if (editingIndex === targetIndex) {
      setEditingIndex(index);
    }
  };

  const startEditing = (index) => {
    if (disabled) return;

    setEditingIndex(index);
    setEditValue(questions[index]);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const saveEditing = () => {
    if (editingIndex === null) return;

    const value = editValue.trim();

    if (!value) return;

    const next = [...questions];
    next[editingIndex] = value;

    setQuestions(next);
    setEditingIndex(null);
    setEditValue("");
  };

  const handleEditKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      saveEditing();
    }

    if (event.key === "Escape") {
      cancelEditing();
    }
  };

  return (
    <div className="space-y-4">

      {/* Session Name */}
      <Input
        label="Session Name"
        placeholder="e.g. Spring Boot Interview Prep"
        value={sessionName}
        onChange={(event) =>
          setSessionName(event.target.value)
        }
        disabled={disabled}
      />

      {/* Questions Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Questions
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {questions.length} / {maxQuestions}
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={addQuestion}
          disabled={
            disabled ||
            questions.length >= maxQuestions
          }
        >
          <span className="flex items-center gap-2">
            <Plus size={16} />
            Add Question
          </span>
        </Button>
      </div>

      {/* Compact Question List */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">

        {questions.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
            No questions added yet.
          </div>
        ) : (
          questions.map((question, index) => {
            const isEditing = editingIndex === index;

            return (
              <div
                key={index}
                className={`
                  flex gap-3 px-3 py-2
                  transition-colors
                  hover:bg-slate-50
                  dark:hover:bg-slate-800/40
                  ${
                    index !== questions.length - 1
                      ? "border-b border-slate-200 dark:border-slate-800"
                      : ""
                  }
                `}
              >

                {/* Number */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {index + 1}
                </div>

                {/* Question */}
                <div className="min-w-0 flex-1">

                  {isEditing ? (
                    <textarea
                      autoFocus
                      rows={2}
                      value={editValue}
                      onChange={(event) =>
                        setEditValue(event.target.value)
                      }
                      onKeyDown={handleEditKeyDown}
                      placeholder="Enter a question"
                      disabled={disabled}
                      className="
                        block w-full resize-none
                        rounded-lg
                        border border-sky-400
                        bg-white
                        px-3 py-2
                        text-sm
                        leading-5
                        text-slate-800
                        outline-none
                        ring-2 ring-sky-500/10
                        dark:border-sky-700
                        dark:bg-slate-950
                        dark:text-slate-100
                      "
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        startEditing(index)
                      }
                      disabled={disabled}
                      className="
                        block w-full
                        py-1.5
                        text-left
                        text-sm
                        leading-5
                        text-slate-700
                        dark:text-slate-200
                      "
                    >
                      {question || (
                        <span className="italic text-slate-400">
                          Empty question
                        </span>
                      )}
                    </button>
                  )}

                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-start gap-1">

                  {isEditing ? (
                    <>
                      {/* Save */}
                      <button
                        type="button"
                        onClick={saveEditing}
                        disabled={
                          disabled ||
                          !editValue.trim()
                        }
                        title="Save"
                        aria-label={`Save question ${
                          index + 1
                        }`}
                        className="
                          flex h-8 w-8 items-center justify-center
                          rounded-lg
                          text-emerald-600
                          transition
                          hover:bg-emerald-50
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                          dark:text-emerald-400
                          dark:hover:bg-emerald-950/30
                        "
                      >
                        <Check size={16} />
                      </button>

                      {/* Cancel */}
                      <button
                        type="button"
                        onClick={cancelEditing}
                        disabled={disabled}
                        title="Cancel"
                        aria-label={`Cancel editing question ${
                          index + 1
                        }`}
                        className="
                          flex h-8 w-8 items-center justify-center
                          rounded-lg
                          text-slate-500
                          transition
                          hover:bg-slate-100
                          dark:text-slate-400
                          dark:hover:bg-slate-800
                        "
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() =>
                          startEditing(index)
                        }
                        disabled={disabled}
                        title="Edit"
                        aria-label={`Edit question ${
                          index + 1
                        }`}
                        className="
                          flex h-8 w-8 items-center justify-center
                          rounded-lg
                          text-sky-600
                          transition
                          hover:bg-sky-50
                          disabled:opacity-30
                          dark:text-sky-400
                          dark:hover:bg-sky-950/30
                        "
                      >
                        <Pencil size={15} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() =>
                          removeQuestion(index)
                        }
                        disabled={disabled}
                        title="Delete"
                        aria-label={`Delete question ${
                          index + 1
                        }`}
                        className="
                          flex h-8 w-8 items-center justify-center
                          rounded-lg
                          text-rose-500
                          transition
                          hover:bg-rose-50
                          disabled:opacity-30
                          dark:text-rose-400
                          dark:hover:bg-rose-950/30
                        "
                      >
                        <Trash2 size={15} />
                      </button>

                      {/* Move Up */}
                      <button
                        type="button"
                        onClick={() =>
                          moveQuestion(index, "up")
                        }
                        disabled={
                          disabled || index === 0
                        }
                        title="Move up"
                        aria-label={`Move question ${
                          index + 1
                        } up`}
                        className="
                          flex h-8 w-8 items-center justify-center
                          rounded-lg
                          text-slate-500
                          transition
                          hover:bg-slate-100
                          disabled:cursor-not-allowed
                          disabled:opacity-20
                          dark:text-slate-400
                          dark:hover:bg-slate-800
                        "
                      >
                        <ArrowUp size={15} />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={() =>
                          moveQuestion(index, "down")
                        }
                        disabled={
                          disabled ||
                          index === questions.length - 1
                        }
                        title="Move down"
                        aria-label={`Move question ${
                          index + 1
                        } down`}
                        className="
                          flex h-8 w-8 items-center justify-center
                          rounded-lg
                          text-slate-500
                          transition
                          hover:bg-slate-100
                          disabled:cursor-not-allowed
                          disabled:opacity-20
                          dark:text-slate-400
                          dark:hover:bg-slate-800
                        "
                      >
                        <ArrowDown size={15} />
                      </button>
                    </>
                  )}

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Helper */}
      {questions.length > 0 && (
        <p className="text-xs text-slate-400">
          Click a question or the edit icon to edit it.
          Press Enter to save or Shift + Enter for a new line.
        </p>
      )}

    </div>
  );
};