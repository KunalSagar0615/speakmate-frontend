import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ActivityHeatmap = ({ activityHeatmap = {} }) => {
  const [monthOffset, setMonthOffset] = useState(0);

  const { monthLabel, weeks, monthStats } = useMemo(() => {
    const today = new Date();
    const viewDate = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const leadingDays = firstDay.getDay();
    const totalCells = Math.ceil((leadingDays + daysInMonth) / 7) * 7;

    const cells = [];
    for (let i = 0; i < leadingDays; i += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({ day, dateKey, count: Number(activityHeatmap?.[dateKey] || 0) });
    }
    while (cells.length < totalCells) cells.push(null);

    const weekRows = [];
    for (let i = 0; i < cells.length; i += 7) {
      weekRows.push(cells.slice(i, i + 7));
    }

    const monthTotal = Object.entries(activityHeatmap || {}).reduce((sum, [date, count]) => {
      const dateValue = new Date(date);
      if (dateValue.getFullYear() === year && dateValue.getMonth() === month) {
        return sum + Number(count || 0);
      }
      return sum;
    }, 0);

    return {
      monthLabel: viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      weeks: weekRows,
      monthStats: monthTotal,
    };
  }, [activityHeatmap, monthOffset]);

  const getIntensity = (count) => {
    if (!count) return "bg-slate-100 dark:bg-slate-800";
    if (count === 1) return "bg-sky-200 dark:bg-sky-900/60";
    if (count === 2) return "bg-sky-400 dark:bg-sky-700";
    if (count <= 4) return "bg-sky-500 dark:bg-sky-600";
    return "bg-sky-600 dark:bg-sky-500";
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-100">
            Activity Heatmap
          </h3>
          <p className="text-xs text-slate-400">
            {monthStats} sessions this month
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMonthOffset((m) => m + 1)}
            className="rounded-md border border-slate-700 p-1 hover:bg-slate-800"
          >
            <ChevronLeft size={14} />
          </button>

          <span className="min-w-[120px] text-center text-sm font-medium">
            {monthLabel}
          </span>

          <button
            onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
            disabled={monthOffset === 0}
            className="rounded-md border border-slate-700 p-1 hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="flex justify-center overflow-x-auto">
        <div className="inline-flex flex-col">
          {/* Days */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="h-10 w-10 flex items-center justify-center text-xs font-medium text-slate-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Heatmap */}
          <div className="grid grid-cols-7 gap-2">
            {weeks.flat().map((cell, index) =>
              cell ? (
                <div
                  key={cell.dateKey}
                  title={`${cell.dateKey}: ${cell.count} sessions`}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:scale-105 hover:ring-1 hover:ring-sky-400 ${getIntensity(
                    cell.count
                  )}`}
                >
                  <span
                    className={`text-xs font-medium ${cell.count > 0
                      ? "text-white"
                      : "text-slate-500"
                      }`}
                  >
                    {cell.day}
                  </span>
                </div>
              ) : (
                <div
                  key={`empty-${index}`}
                  className="h-10 w-10"
                />
              )
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-1 text-[10px] text-slate-500">
        <span>Less</span>

        {[0, 1, 2, 3, 6].map((level) => (
          <div
            key={level}
            className={`h-3 w-3 rounded-sm ${getIntensity(level)}`}
          />
        ))}

        <span>More</span>
      </div>
    </div>
  );
};
