import { useState } from "react";
import {
  Bot,
  Brain,
  ChartLine,
  Clock3,
  Flame,
  GraduationCap,
  MessageCircle,
  Mic,
  Sparkles,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { Card } from "../common/UI";

export default function ExploreSpeakMate() {
  const [activeTab, setActiveTab] = useState("modes");

  const tabs = [
    { id: "modes", label: "AI Modes" },
    { id: "features", label: "Features" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          EXPLORE SPEAKMATE
        </span>

        <h2 className="mt-5 text-3xl font-black md:text-5xl">
          Everything You Need In One Place
        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-slate-600 dark:text-slate-300">
          Discover AI-powered learning, intelligent feedback, and detailed
          progress analytics designed to improve your communication skills.
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-12 flex justify-center">
        <div className="flex rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-5 py-2 text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:text-primary dark:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI MODES */}
      {activeTab === "modes" && (
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: Bot,
              title: "AI Friend",
              desc: "Practice natural conversations and build communication confidence.",
            },
            {
              icon: Mic,
              title: "AI Interviewer",
              desc: "Prepare for technical and HR interviews with realistic questions.",
            },
            {
              icon: GraduationCap,
              title: "AI English Coach",
              desc: "Improve grammar, vocabulary, fluency and speaking skills.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-4 text-primary">
                  <Icon size={30} />
                </div>

                <h3 className="text-xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-3 text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </Card>
            );
          })}
        </div>
      )}

      {/* FEATURES */}
      {activeTab === "features" && (
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "AI Feedback",
            },
            {
              icon: Brain,
              title: "Interview Preparation",
            },
            {
              icon: MessageCircle,
              title: "Speaking Confidence",
            },
            {
              icon: ChartLine,
              title: "Progress Analytics",
            },
            {
              icon: Trophy,
              title: "Personalized Learning",
            },
            {
              icon: Clock3,
              title: "24/7 Availability",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-4 text-primary">
                  <Icon size={28} />
                </div>

                <h3 className="font-bold">
                  {item.title}
                </h3>
              </Card>
            );
          })}
        </div>
      )}

      {/* ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="text-primary" />
              <h3 className="font-bold">
                Performance Trend
              </h3>
            </div>

            <div className="flex h-40 items-end gap-2">
              {[35, 50, 45, 70, 65, 85, 95].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-primary"
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <div className="flex items-center gap-2">
                <Flame className="text-orange-500" />
                <span className="font-bold">
                  Practice Streak
                </span>
              </div>

              <div className="mt-4 text-4xl font-black text-primary">
                21 Days
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2">
                <ChartLine className="text-green-500" />
                <span className="font-bold">
                  Average Score
                </span>
              </div>

              <div className="mt-4 text-4xl font-black text-primary">
                92%
              </div>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}