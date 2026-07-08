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

export const WeeklyActivityChart = ({ sessions = [], loading = false }) => {
  const data = computeWeeklyActivity(sessions);

  return (
    <Card>
      <h3 className="mb-4 font-semibold">Weekly Activity</h3>
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="sessions" fill="#38bdf8" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export const PracticeTrendChart = ({ sessions = [], loading = false }) => {
  const data = computePracticeTrend(sessions);

  return (
    <Card>
      <h3 className="mb-4 font-semibold">Practice Trend</h3>
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="sessions" stroke="#0ea5e9" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
