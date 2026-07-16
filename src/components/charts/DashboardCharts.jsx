import { Card } from "../common/UI";

export const DashboardHero = ({ stats, userName = "User", onStartPractice }) => {
  return (
    <Card className="p-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">
          Welcome Back, {userName} 👋
        </h1>

        <p className="text-slate-500 dark:text-slate-400">
          Practice makes progress. Keep improving your communication skills every day.
        </p>

        <div className="flex flex-wrap gap-6 pt-2">
          <div>
            <p className="text-sm text-slate-500">Current Streak</p>
            <p className="text-2xl font-bold">🔥 {stats?.currentStreak || 0} Days</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Sessions Completed</p>
            <p className="text-2xl font-bold">🎤 {stats?.totalSessions || 0}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Practice Days</p>
            <p className="text-2xl font-bold">📅 {stats?.practiceDays || 0}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Reports Generated</p>
            <p className="text-2xl font-bold">📄 {stats?.reportsGenerated || 0}</p>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={onStartPractice}
            className="rounded-xl bg-sky-500 px-6 py-3 font-medium text-white transition hover:bg-sky-600"
          >
            Start Practice
          </button>
        </div>
      </div>
    </Card>
  );
};