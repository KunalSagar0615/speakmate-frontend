import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { Button, ThemeToggle } from "../components/common/UI";
import { useAuth } from "../context/AuthContext";

import HeroSection from "../components/landing/HeroSection";
import HowItWorks from "../components/landing/HowItWorks";
import StatsSection from "../components/landing/StatsSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import FAQSection from "../components/landing/FAQSection";
import CTASection from "../components/landing/CTASection";
import LandingFooter from "../components/landing/LandingFooter";
import ExploreSpeakMate from "../components/landing/ExploreSpeakMate";

const AuthCTA = ({ className = "" }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Link to="/register">
      <Button className={`gap-2 ${className}`}>
        Register <ArrowRight size={16} />
      </Button>
    </Link>
  );
};

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [serverReady, setServerReady] = useState(false);

  useEffect(() => {
    let interval;

    const checkHealth = async () => {
      try {
        const response = await fetch(
          "https://speakmate-ai-friend.onrender.com/actuator/health"
        );

        const data = await response.json();

        if (data?.status === "UP") {
          setServerReady(true);

          if (interval) {
            clearInterval(interval);
          }
        }
      } catch {
        // Backend still waking up
      }
    };

    checkHealth();

    interval = setInterval(checkHealth, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-2xl font-black text-primary">
            SpeakMate
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {serverReady ? (
              <>
                <Link to="/login">
                  <Button variant="secondary">
                    Login
                  </Button>
                </Link>


                <Link to="/register">
                  <Button>
                    Register
                  </Button>
                </Link>

              </>
            ) : (
              <div className="flex items-center gap-3 rounded-lg bg-amber-100 px-3 py-2 text-sm font-medium text-amber-700 dark:bg-amber-900/30">
                <span>Preparing AI services...</span>

                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-amber-600"></span>
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-amber-600"
                    style={{ animationDelay: "0.15s" }}
                  ></span>
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-amber-600"
                    style={{ animationDelay: "0.3s" }}
                  ></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>


      <div className="relative overflow-hidden">

        <HeroSection
          serverReady={serverReady}
          isAuthenticated={isAuthenticated}
          AuthCTA={AuthCTA}
        />

        <HowItWorks />

        <ExploreSpeakMate />

        <StatsSection />

        <TestimonialsSection />

        <section id="faq">
          <FAQSection />
        </section>

        <CTASection
          serverReady={serverReady}
          isAuthenticated={isAuthenticated}
          AuthCTA={AuthCTA}
        />
      </div>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}