import { ArrowRight, Bot, ChartLine, Mic, UserRoundCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/common/Footer";
import { TypingAnimation } from "../components/common/TypingAnimation";
import { Button, Card, ThemeToggle } from "../components/common/UI";
import { useAuth } from "../context/AuthContext";

const HERO_PHRASES = [
  "SpeakMate – Your AI Friend",
  "Practice English with AI",
  "Build Communication Skills",
  "Crack Interviews with Confidence",
];

const features = [
  {
    title: "AI Friend",
    icon: Bot,
    desc: "Practice natural conversations with an AI companion. Improve confidence, fluency, and daily communication skills.",
  },
  {
    title: "AI Teacher",
    icon: UserRoundCheck,
    desc: "Receive grammar corrections, vocabulary suggestions, and guided English speaking practice.",
  },
  {
    title: "AI Interviewer",
    icon: Mic,
    desc: "Prepare for technical and HR interviews with realistic AI-generated questions and feedback.",
  },
  {
    title: "Progress Reports",
    icon: ChartLine,
    desc: "Track practice history, streaks, activity, performance trends, and improvement areas.",
  },
];

const AuthCTA = ({ className = "" }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return (
      <Link to="/practice">
        <Button className={`gap-2 ${className}`}>
          Start Practice <ArrowRight size={16} />
        </Button>
      </Link>
    );
  }
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

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between p-6">
        <h1 className="text-2xl font-black text-primary">SpeakMate</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="secondary">Login</Button>
          </Link>
          {isAuthenticated ? (
            <Link to="/practice">
              <Button>Start Practice</Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h2 className="text-4xl font-black md:text-6xl">
          <TypingAnimation phrases={HERO_PHRASES} className="text-primary" />
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-slate-600 dark:text-slate-300">
          Practice speaking with AI in Friend, Interview, and Teacher modes designed for real confidence.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <AuthCTA />
          <Link to="/login">
            <Button variant="secondary">Login</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl flex-1 gap-4 px-6 pb-20 md:grid-cols-2 lg:grid-cols-4">
        {features.map((item) => (
          <Card key={item.title} className="flex flex-col">
            <item.icon className="mb-3 text-primary" size={28} />
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
          </Card>
        ))}
      </section>

      <Footer />
    </div>
  );
}
