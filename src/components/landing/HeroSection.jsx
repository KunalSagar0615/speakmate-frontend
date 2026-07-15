import {
  Bot,
  ChartLine,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TypingAnimation } from "../common/TypingAnimation";
import { Button, Card } from "../common/UI";

const HERO_PHRASES = [
  "Crack Interviews with Confidence",
  "Practice English with AI",
  "Build Communication Skills",
];

export default function HeroSection({
  serverReady,
  AuthCTA,
}) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 py-2">
      <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Left Side */}
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles size={14} />
            AI Powered English Learning Platform
          </div>

          <h1 className="text-3xl font-black leading-tight text-primary md:text-4xl lg:text-5xl">
            SpeakMate – Your AI Friend
          </h1>

          <p className="mt-3 max-w-xl text-base text-slate-600 dark:text-slate-300">
            Improve your English speaking, prepare for interviews,
            and build confidence through realistic AI-powered
            conversations and instant feedback.
          </p>

          {/* Trust Badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            {/* {[
              "AI Powered",
              "Interview Prep",
              "English Practice",
              "Progress Tracking",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                ✓ {item}
              </span>
            ))} */}
            <p className="flex gap-1">✓ <TypingAnimation phrases={HERO_PHRASES}/></p>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex flex-wrap gap-3">
            {serverReady ? (
              <>
                <AuthCTA />

                <Link to="/login">
                  <Button variant="secondary">
                    Login
                  </Button>
                </Link>
              </>
            ) : (
              <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                🚀 Preparing AI services...
              </div>
            )}
          </div>

          {/* Status */}
          <div className="mt-4">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium ${serverReady
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                }`}
            >
              <span className="h-2 w-2 rounded-full bg-current"></span>

              {serverReady
                ? "AI Services Online"
                : "Backend Waking Up..."}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="min-w-0">
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                Live Dashboard Preview
              </h3>

              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Online
              </span>
            </div>

            {/* Chat */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Bot
                    size={16}
                    className="text-primary"
                  />
                </div>

                <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
                  Tell me about yourself.
                </div>
              </div>

              <div className="flex justify-end">
                <div className="rounded-xl bg-primary px-3 py-2 text-sm text-white">
                  I am a software developer passionate about AI...
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                <div className="text-xs text-slate-500">
                  Practice Score
                </div>

                <div className="mt-1 text-xl font-bold">
                  92%
                </div>
              </div>

              <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                <div className="text-xs text-slate-500">
                  Sessions
                </div>

                <div className="mt-1 text-xl font-bold">
                  124
                </div>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="mt-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
              <div className="mb-2 flex items-center gap-2">
                <ChartLine
                  size={16}
                  className="text-primary"
                />

                <span className="text-sm font-medium">
                  Weekly Progress
                </span>
              </div>

              <div className="flex h-14 items-end gap-1">
                {[35, 50, 40, 70, 80, 65, 95].map(
                  (h, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t bg-primary"
                      style={{
                        height: `${h}%`,
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <MessageCircle
                  size={18}
                  className="text-primary"
                />

                <div>
                  <div className="text-xs text-slate-500">
                    Conversations
                  </div>

                  <div className="font-bold">
                    1,240+
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <Sparkles
                  size={18}
                  className="text-primary"
                />

                <div>
                  <div className="text-xs text-slate-500">
                    Improvement
                  </div>

                  <div className="font-bold">
                    +85%
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}