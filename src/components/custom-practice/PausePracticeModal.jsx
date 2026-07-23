import { useMemo, useState } from "react";
import { Button, Card } from "../common/UI";

export const PausePracticeModal = ({ isOpen, onClose, onPause, loading }) => {
  const [pauseDays, setPauseDays] = useState(15);

  const options = useMemo(() => [15, 7, 30, 1], []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <Card className="w-full max-w-md space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Pause Practice</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your progress and drafts will be saved so you can resume later.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Resume within</p>
          <div className="flex flex-wrap gap-2">
            {options.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setPauseDays(value)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${pauseDays === value ? "bg-primary text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}
              >
                {value} days
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={() => onPause(pauseDays)} disabled={loading}>
            {loading ? "Pausing..." : "Pause Practice"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
