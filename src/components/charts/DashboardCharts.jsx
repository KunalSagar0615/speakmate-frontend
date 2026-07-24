import {
  ArrowUpRight,
  CalendarDays,
  FileBarChart2,
  Flame,
  MessageCircle,
  Sparkles,
  Waves,
} from "lucide-react";

const DashboardActionCard = ({
  title,
  description,
  stat,
  statLabel,
  icon: Icon,
  statIcon: StatIcon,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group relative w-full overflow-hidden rounded-2xl
        border border-slate-200/80
        bg-white p-5 text-left
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-sky-300
        hover:shadow-lg hover:shadow-sky-500/10
        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:border-sky-800
        sm:p-6
      "
    >
      {/* Decorative glow */}
      <div
        className="
          pointer-events-none absolute -right-12 -top-12
          h-32 w-32 rounded-full
          bg-sky-100/60 blur-2xl
          transition-all duration-300
          group-hover:bg-sky-200/80
          dark:bg-sky-950/30
          dark:group-hover:bg-sky-900/40
        "
      />

      <div className="relative flex h-full flex-col">
        {/* Top */}
        <div className="flex items-start justify-between">
          <div
            className="
              flex h-11 w-11 items-center justify-center
              rounded-xl bg-sky-50 text-sky-600
              transition-all duration-300
              group-hover:bg-sky-500
              group-hover:text-white
              dark:bg-sky-950/50
              dark:text-sky-400
              dark:group-hover:bg-sky-500
              dark:group-hover:text-white
            "
          >
            <Icon size={22} strokeWidth={2} />
          </div>

          <div
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full text-slate-400
              transition-all duration-300
              group-hover:bg-sky-50
              group-hover:text-sky-600
              dark:group-hover:bg-sky-950/50
              dark:group-hover:text-sky-400
            "
          >
            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>

        {/* Content */}
        <div className="mt-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h2>

          <p className="mt-1.5 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        {/* Stat */}
        <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          <StatIcon size={16} className="text-sky-500" />

          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {stat}
          </span>

          <span className="text-xs text-slate-500 dark:text-slate-400">
            {statLabel}
          </span>
        </div>
      </div>
    </button>
  );
};

export const DashboardHero = ({
  stats,
  userName = "User",
  onStartPractice,
  onCustomPractice,
  onSessions,
  onReports,
}) => {
  const actions = [
    {
      title: "Start Practice",
      description:
        "Start a guided conversation with your AI speaking partner.",
      stat: stats?.currentStreak ?? 0,
      statLabel:
        (stats?.currentStreak ?? 0) === 1 ? "day streak" : "days streak",
      icon: MessageCircle,
      statIcon: Flame,
      onClick: onStartPractice,
    },
    {
      title: "Custom Practice",
      description:
        "Create your own questions and practice exactly what you want.",
      stat: stats?.practiceDays ?? 0,
      statLabel:
        (stats?.practiceDays ?? 0) === 1 ? "practice day" : "practice days",
      icon: Sparkles,
      statIcon: CalendarDays,
      onClick: onCustomPractice,
    },
    {
      title: "Sessions",
      description:
        "Review your previous conversations and practice history.",
      stat: stats?.totalSessions ?? 0,
      statLabel: "completed sessions",
      icon: Waves,
      statIcon: Waves,
      onClick: onSessions,
    },
    {
      title: "Reports",
      description:
        "Explore AI feedback, performance insights and your progress.",
      stat: stats?.reportsGenerated ?? 0,
      statLabel: "reports generated",
      icon: FileBarChart2,
      statIcon: FileBarChart2,
      onClick: onReports,
    },
  ];

  return (
    <section>
      {/* Welcome */}
      <div className="mb-5 sm:mb-6">
        <p className="mb-1 text-sm font-semibold text-sky-500">
          Your Practice Space
        </p>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Welcome back, {userName}
          <span className="ml-2">👋</span>
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
          Practice consistently, improve your communication, and track your
          progress along the way.
        </p>
      </div>

      {/* Main dashboard actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <DashboardActionCard
            key={action.title}
            {...action}
          />
        ))}
      </div>
    </section>
  );
};