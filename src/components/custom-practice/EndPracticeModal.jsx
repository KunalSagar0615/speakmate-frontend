import { Button, Card } from "../common/UI";

export const EndPracticeModal = ({ isOpen, onClose, onEnd, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <Card className="w-full max-w-md space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">End Practice?</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            This session cannot be resumed. Unanswered questions will remain unattempted and a partial report will be generated.
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Continue Practice
          </Button>
          <Button variant="danger" onClick={onEnd} disabled={loading}>
            {loading ? "Ending..." : "End Practice"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
