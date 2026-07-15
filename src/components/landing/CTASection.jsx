import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../common/UI";

export default function CTASection({serverReady, isAuthenticated, AuthCTA,
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="overflow-hidden rounded-3xl bg-primary p-10 text-white shadow-2xl md:p-16">
        <div className="mx-auto max-w-4xl text-center">
          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
            START YOUR JOURNEY TODAY
          </span>

          <h2 className="mt-6 text-4xl font-black md:text-6xl">
            Ready To Improve Your English?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
            Practice conversations, prepare for interviews, receive instant AI
            feedback, and build confidence every day with SpeakMate AI Friend.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {serverReady ? (
              <>
                <AuthCTA />

                <Link to="/login">
                  <Button
                    variant="secondary"
                    className="bg-white text-slate-900 hover:bg-slate-100"
                  >
                    Login
                  </Button>
                </Link>
              </>
            ) : (
              <div className="rounded-xl bg-white/20 px-5 py-3 text-sm font-medium">
                🚀 AI Services are starting... Please wait a few seconds.
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/80">
            <span>✓ AI Conversations</span>
            <span>✓ Interview Preparation</span>
            <span>✓ Progress Tracking</span>
            <span>✓ Instant Feedback</span>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/80">
            <ArrowRight size={16} />
            Start practicing in less than a minute
          </div>
        </div>
      </div>
    </section>
  );
}