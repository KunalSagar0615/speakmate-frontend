import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, Loader } from "../common/UI";
import { computePracticeTrend, computeWeeklyActivity } from "../../utils/dashboardStats";

const EmptyState = ({ message }) => (
  <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
    {message}
  </div>
);

export const WeeklyActivityChart = ({ sessions = [], loading = false }) => {
  const data = useMemo(() => computeWeeklyActivity(sessions), [sessions]);
  const hasData = data.some((item) => item.sessions > 0);

  return (
    <Card>
      <h3 className="mb-4 font-semibold">Weekly Activity</h3>
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      ) : hasData ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.25} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="sessions" fill="#38bdf8" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState message="No activity available yet" />
      )}
    </Card>
  );
};

export const PracticeTrendChart = ({ sessions = [], loading = false }) => {
  const data = useMemo(() => computePracticeTrend(sessions), [sessions]);
  const hasData = data.some((item) => item.sessions > 0);

  return (
    <Card>
      <h3 className="mb-4 font-semibold">Practice Trend</h3>
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      ) : hasData ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.25} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="sessions" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState message="No activity available yet" />
      )}
    </Card>
  );
};
