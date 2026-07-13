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

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="mx-auto w-full">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Activity Heatmap
          </h3>
          <p className="text-[11px] text-slate-500">{monthStats} sessions this month</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setMonthOffset((m) => m + 1)}
            className="rounded-md border border-slate-200 p-1 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            aria-label="Previous month"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="min-w-[110px] text-center text-xs font-medium">{monthLabel}</span>
          <button
            type="button"
            onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
            disabled={monthOffset === 0}
            className="rounded-md border border-slate-200 p-1 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
            aria-label="Next month"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="min-w-[280px]">
          <div className="mb-1 grid grid-cols-7 gap-1">
            {dayLabels.map((label, index) => (
              <div key={`${label}-${index}`} className="text-center text-[10px] text-slate-400">
                {label}
              </div>
            ))}
          </div>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="mb-1 grid grid-cols-7 gap-1">
              {week.map((cell, cellIndex) =>
                cell ? (
                  <div
                    key={cell.dateKey}
                    title={`${cell.dateKey}: ${cell.count} session${cell.count !== 1 ? "s" : ""}`}
                    className={`group relative h-5 w-5 rounded-sm sm:h-6 sm:w-6 sm:rounded-md ${getIntensity(cell.count)} transition hover:ring-1 hover:ring-primary/50`}
                  >
                    <span className="sr-only">
                      {cell.dateKey}: {cell.count} sessions
                    </span>
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] text-white group-hover:block dark:bg-slate-700">
                      {cell.dateKey}
                      <br />
                      {cell.count} session{cell.count !== 1 ? "s" : ""}
                    </div>
                  </div>
                ) : (
                  <div key={`empty-${weekIndex}-${cellIndex}`} className="h-5 w-5 sm:h-6 sm:w-6" />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-end gap-0.5 text-[9px] text-slate-500 sm:text-[10px]">
        <span>Less</span>
        {[0, 1, 2, 3, 5].map((level) => (
          <div
            key={level}
            className={`h-2.5 w-2.5 rounded-sm sm:h-3 sm:w-3 ${getIntensity(level === 0 ? 0 : level === 1 ? 1 : level === 2 ? 2 : level === 3 ? 3 : 6)}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};
