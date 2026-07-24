import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export const ActivityHeatmap = ({ activityHeatmap = {} }) => {
  const [monthOffset, setMonthOffset] = useState(0);

  const { monthLabel, weeks, monthStats, activeDays } = useMemo(() => {
    const today = new Date();

    const viewDate = new Date(
      today.getFullYear(),
      today.getMonth() - monthOffset,
      1
    );

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const leadingDays = firstDay.getDay();

    const totalCells =
      Math.ceil((leadingDays + daysInMonth) / 7) * 7;

    const cells = [];

    for (let i = 0; i < leadingDays; i += 1) {
      cells.push(null);
    }

    let totalSessions = 0;
    let totalActiveDays = 0;

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateKey = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

      const count = Number(activityHeatmap?.[dateKey] || 0);

      totalSessions += count;

      if (count > 0) {
        totalActiveDays += 1;
      }

      cells.push({
        day,
        dateKey,
        count,
      });
    }

    while (cells.length < totalCells) {
      cells.push(null);
    }

    const weekRows = [];

    for (let i = 0; i < cells.length; i += 7) {
      weekRows.push(cells.slice(i, i + 7));
    }

    return {
      monthLabel: viewDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      weeks: weekRows,
      monthStats: totalSessions,
      activeDays: totalActiveDays,
    };
  }, [activityHeatmap, monthOffset]);

  const getIntensity = (count) => {
    if (!count) {
      return "bg-slate-100 dark:bg-slate-800";
    }

    if (count === 1) {
      return "bg-sky-200 dark:bg-sky-900";
    }

    if (count === 2) {
      return "bg-sky-300 dark:bg-sky-800";
    }

    if (count <= 4) {
      return "bg-sky-500 dark:bg-sky-600";
    }

    return "bg-sky-600 dark:bg-sky-500";
  };

  const getDayText = (count) => {
    if (!count) {
      return "text-slate-500 dark:text-slate-400";
    }

    if (count <= 2) {
      return "text-sky-950 dark:text-sky-100";
    }

    return "text-white";
  };

  const goPreviousMonth = () => {
    setMonthOffset((current) => current + 1);
  };

  const goNextMonth = () => {
    setMonthOffset((current) => Math.max(0, current - 1));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-5">

        {/* Month statistics */}
        <div className="flex items-center gap-5">

          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {monthStats}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sessions
            </p>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {activeDays}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active Days
            </p>
          </div>

        </div>

        {/* Month navigation */}
        <div className="flex items-center gap-2 self-start sm:self-auto">

          <button
            type="button"
            onClick={goPreviousMonth}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-sky-800 dark:hover:bg-sky-950/40 dark:hover:text-sky-400"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="min-w-[125px] text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
            {monthLabel}
          </span>

          <button
            type="button"
            onClick={goNextMonth}
            disabled={monthOffset === 0}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:text-slate-400 dark:hover:border-sky-800 dark:hover:bg-sky-950/40 dark:hover:text-sky-400"
          >
            <ChevronRight size={16} />
          </button>

        </div>
      </div>

      {/* Calendar */}
      <div className="overflow-x-auto px-4 py-5 sm:px-5">

        <div className="mx-auto w-max">

          {/* Week day labels */}
          <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2">

            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day) => (
              <div
                key={day}
                className="flex h-7 w-9 items-center justify-center text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:w-11 sm:text-[11px]"
              >
                {day}
              </div>
            ))}

          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">

            {weeks.flat().map((cell, index) =>
              cell ? (
                <div
                  key={cell.dateKey}
                  title={`${cell.dateKey} • ${cell.count} ${
                    cell.count === 1 ? "session" : "sessions"
                  }`}
                  className={`
                    group relative flex h-9 w-9
                    items-center justify-center
                    rounded-lg
                    transition-all duration-200
                    hover:z-10
                    hover:-translate-y-0.5
                    hover:ring-2
                    hover:ring-sky-400/50
                    sm:h-11 sm:w-11
                    ${getIntensity(cell.count)}
                  `}
                >
                  <span
                    className={`
                      text-[11px] font-semibold
                      sm:text-xs
                      ${getDayText(cell.count)}
                    `}
                  >
                    {cell.day}
                  </span>

                  {cell.count > 0 && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-current opacity-70" />
                  )}
                </div>
              ) : (
                <div
                  key={`empty-${index}`}
                  className="h-9 w-9 sm:h-11 sm:w-11"
                />
              )
            )}

          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-5">

        <p className="text-xs text-slate-400">
          Darker squares mean more practice sessions.
        </p>

        <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">

          <span className="mr-1">
            Less
          </span>

          {[0, 1, 2, 3, 6].map((level) => (
            <div
              key={level}
              className={`h-3 w-3 rounded-[3px] ${getIntensity(level)}`}
            />
          ))}

          <span className="ml-1">
            More
          </span>

        </div>
      </div>
    </div>
  );
};