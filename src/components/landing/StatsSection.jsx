import { MessageCircle, Trophy, Users, Clock3 } from "lucide-react";

const stats = [
  {
    icon: MessageCircle,
    value: "1000+",
    label: "Conversations",
  },
  {
    icon: Users,
    value: "500+",
    label: "Practice Sessions",
  },
  {
    icon: Trophy,
    value: "50+",
    label: "Topics Covered",
  },
  {
    icon: Clock3,
    value: "24/7",
    label: "AI Availability",
  },
];

export default function StatsSection() {
  return (
    <section className="bg-primary/5 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            SPEAKMATE IN NUMBERS
          </span>

          <h2 className="mt-5 text-3xl font-black md:text-5xl">
            Trusted By Learners Every Day
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-slate-600 dark:text-slate-300">
            Thousands of conversations, practice sessions, and learning moments
            help users improve their communication skills with confidence.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={30} />
                </div>

                <div className="text-4xl font-black text-primary">
                  {stat.value}
                </div>

                <div className="mt-2 text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}