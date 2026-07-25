import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  FileText,
  Gauge,
  GraduationCap,
  GripVertical,
  History,
  Keyboard,
  Lightbulb,
  MessageCircle,
  Mic,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
  UserRound,
} from "lucide-react";
import { Card } from "../common/UI";

const sections = [
  {
    id: "practice",
    label: "Start Practice",
    shortLabel: "Practice",
    icon: Play,
  },
  {
    id: "custom",
    label: "Custom Practice",
    shortLabel: "Custom",
    icon: FileText,
  },
  {
    id: "sessions",
    label: "Sessions",
    shortLabel: "Sessions",
    icon: History,
  },
  {
    id: "reports",
    label: "Reports",
    shortLabel: "Reports",
    icon: BarChart3,
  },
];

const practiceSteps = [
  {
    number: "01",
    title: "Select AI Mode",
    description:
      "Choose how you want SpeakMate to interact with you during your practice.",
  },
  {
    number: "02",
    title: "Communication Type",
    description:
      "Practice by typing your answers or speak naturally using voice mode.",
  },
  {
    number: "03",
    title: "Select Difficulty",
    description:
      "Choose a difficulty level that matches your current English skills.",
  },
  {
    number: "04",
    title: "Choose a Topic",
    description:
      "Enter any topic you want to practice or select one from the suggestions.",
  },
];

function SectionHeading({ badge, title, description }) {
  return (
    <div className="text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
        <Sparkles size={16} />
        {badge}
      </span>

      <h2 className="mt-5 text-3xl font-black md:text-5xl">{title}</h2>

      <p className="mx-auto mt-5 max-w-3xl text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}

function FeaturePoint({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={18} />
      </div>

      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>
    </div>
  );
}

function StartPracticeContent() {
  return (
    <div className="space-y-12">
      <div className="grid gap-5 lg:grid-cols-4">
        {practiceSteps.map((step) => (
          <Card key={step.number} className="relative p-5">
            <span className="text-sm font-black text-primary">
              STEP {step.number}
            </span>

            <h3 className="mt-3 text-lg font-bold">{step.title}</h3>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {step.description}
            </p>
          </Card>
        ))}
      </div>

      <div>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-black text-primary">
            1
          </div>

          <div>
            <h3 className="text-xl font-bold">Select your AI mode</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Each mode focuses on a different type of English practice.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UserRound size={24} />
            </div>

            <h4 className="mt-5 text-xl font-bold">AI Friend</h4>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Practice natural everyday conversations and improve your speaking
              confidence.
            </p>

            <div className="mt-5 space-y-3">
              <FeaturePoint
                icon={MessageCircle}
                title="Daily conversations"
                description="Practice casual and real-life communication."
              />

              <FeaturePoint
                icon={Lightbulb}
                title="Fluency focused"
                description="Small grammar mistakes are tolerated so you can focus on expressing yourself."
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <GraduationCap size={24} />
            </div>

            <h4 className="mt-5 text-xl font-bold">AI Teacher</h4>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Improve your English accuracy with detailed language-focused
              practice.
            </p>

            <div className="mt-5 space-y-3">
              <FeaturePoint
                icon={BookOpen}
                title="Language accuracy"
                description="Focuses on grammar, spelling, sentence structure, tenses, and word choice."
              />

              <FeaturePoint
                icon={CheckCircle2}
                title="Learn from mistakes"
                description="Get feedback that helps you form clearer and more accurate English."
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BriefcaseBusiness size={24} />
            </div>

            <h4 className="mt-5 text-xl font-bold">AI Interviewer</h4>

            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Prepare for interviews with questions based on your selected
              topic.
            </p>

            <div className="mt-5 space-y-3">
              <FeaturePoint
                icon={Target}
                title="Concept focused"
                description="Your knowledge, explanation, and clarity matter more than minor language mistakes."
              />

              <FeaturePoint
                icon={BriefcaseBusiness}
                title="Interview preparation"
                description="Practice answering questions in an interview-style environment."
              />
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="font-black">2</span>
            </div>

            <h3 className="text-lg font-bold">Communication Type</h3>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Keyboard size={20} className="text-primary" />
                <span className="font-semibold">Text</span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Type your answers and practice through chat.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Mic size={20} className="text-primary" />
                  <span className="font-semibold">Voice</span>
                </div>

                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  Recommended
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Speak naturally to build fluency and confidence. Great for AI
                Friend and AI Interviewer.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="font-black">3</span>
            </div>

            <h3 className="text-lg font-bold">Select Difficulty</h3>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Choose the level that best matches your current skills.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <span className="font-semibold">Beginner</span>
              <span className="text-xs text-slate-500">Simple</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <span className="font-semibold">Intermediate</span>
              <span className="text-xs text-slate-500">Balanced</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <span className="font-semibold">Advanced</span>
              <span className="text-xs text-slate-500">Challenging</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="font-black">4</span>
            </div>

            <h3 className="text-lg font-bold">Choose a Topic</h3>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Enter anything you want to talk about or choose a suggested topic.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-sm text-slate-500">Example topic</p>
            <p className="mt-1 font-semibold">Java Spring Boot Interview</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {["Daily Life", "Travel", "Java", "College", "Interview"].map(
              (topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                >
                  {topic}
                </span>
              ),
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function CustomPracticeContent() {
  const steps = [
    {
      icon: FileText,
      title: "Add your questions",
      description:
        "Paste your own question set. You can add up to 100 questions.",
    },
    {
      icon: Bot,
      title: "Extract questions",
      description:
        "SpeakMate identifies and separates the questions from the content you provide.",
    },
    {
      icon: Pencil,
      title: "Review & organize",
      description:
        "Check every question before starting and make any required changes.",
    },
    {
      icon: Play,
      title: "Choose mode & practice",
      description:
        "Select how you want to practice and answer your questions one by one.",
    },
  ];

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <Card key={step.title} className="relative p-6">
              <span className="absolute right-5 top-5 text-3xl font-black text-primary/10">
                0{index + 1}
              </span>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={21} />
              </div>

              <h3 className="mt-5 font-bold">{step.title}</h3>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {step.description}
              </p>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <span className="text-sm font-bold text-primary">
              BEFORE YOU START
            </span>

            <h3 className="mt-2 text-2xl font-black">
              Your questions stay under your control
            </h3>

            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
              After extraction, review your question list and prepare it exactly
              the way you want before starting the session.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FeaturePoint
                icon={Plus}
                title="Add"
                description="Add a missing question."
              />

              <FeaturePoint
                icon={Pencil}
                title="Update"
                description="Edit any extracted question."
              />

              <FeaturePoint
                icon={Trash2}
                title="Delete"
                description="Remove questions you don't need."
              />

              <FeaturePoint
                icon={GripVertical}
                title="Reorder"
                description="Change the question sequence."
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Practice title
                </p>
                <p className="mt-1 font-bold">Java Interview Preparation</p>
              </div>

              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                25 Questions
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "What is dependency injection?",
                "Explain Spring Boot annotations.",
                "What is the difference between JPA and Hibernate?",
              ].map((question, index) => (
                <div
                  key={question}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950/40"
                >
                  <GripVertical
                    size={17}
                    className="shrink-0 text-slate-400"
                  />

                  <span className="text-sm font-semibold text-primary">
                    {index + 1}.
                  </span>

                  <p className="flex-1 text-sm">{question}</p>

                  <Pencil size={15} className="text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SessionsContent() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <h3 className="text-2xl font-black">Your practice, organized</h3>

        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          Sessions help you keep track of your practice activity. Quickly see
          what you practiced, your progress, and the current status of a
          session.
        </p>

        <div className="mt-7 space-y-5">
          <FeaturePoint
            icon={History}
            title="Practice history"
            description="View your previous and ongoing practice sessions in one place."
          />

          <FeaturePoint
            icon={Gauge}
            title="Track progress"
            description="See session progress and understand how much practice you have completed."
          />

          <FeaturePoint
            icon={RotateCcw}
            title="Continue your practice"
            description="When a supported session is paused, return later and continue from where you stopped."
          />

          <FeaturePoint
            icon={Target}
            title="Stay organized"
            description="Use topic, mode, status, and progress information to manage your practice."
          />
        </div>
      </div>

      <Card className="p-5 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Your Sessions</p>
            <h4 className="mt-1 text-xl font-bold">Recent Practice</h4>
          </div>

          <History size={24} className="text-primary" />
        </div>

        <div className="mt-6 space-y-4">
          {[
            {
              title: "Java Interview",
              mode: "AI Interviewer",
              progress: "8 / 10",
              status: "In Progress",
            },
            {
              title: "Daily Conversation",
              mode: "AI Friend",
              progress: "10 / 10",
              status: "Completed",
            },
            {
              title: "Grammar Practice",
              mode: "AI Teacher",
              progress: "5 / 10",
              status: "Paused",
            },
          ].map((session) => (
            <div
              key={session.title}
              className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="font-bold">{session.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{session.mode}</p>
                </div>

                <div className="sm:text-right">
                  <p className="text-sm font-semibold text-primary">
                    {session.progress}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {session.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          Example session data shown for demonstration.
        </p>
      </Card>
    </div>
  );
}

function ReportsContent() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">
              PERFORMANCE REPORT
            </p>
            <h3 className="mt-2 text-2xl font-black">See how you performed</h3>
          </div>

          <BarChart3 size={28} className="text-primary" />
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-primary/5 p-4 text-center">
            <p className="text-3xl font-black text-primary">82</p>
            <p className="mt-1 text-xs text-slate-500">Example Score</p>
          </div>

          <div className="rounded-2xl bg-primary/5 p-4 text-center">
            <p className="text-3xl font-black text-primary">8/10</p>
            <p className="mt-1 text-xs text-slate-500">Answered</p>
          </div>

          <div className="rounded-2xl bg-primary/5 p-4 text-center">
            <p className="text-3xl font-black text-primary">Good</p>
            <p className="mt-1 text-xs text-slate-500">Performance</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <p className="font-bold">AI Feedback</p>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Review feedback from your practice to understand what went well and
            what you should focus on during your next session.
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          Values shown above are examples for explaining the report interface.
        </p>
      </Card>

      <div>
        <h3 className="text-2xl font-black">Turn practice into improvement</h3>

        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          Reports help you understand your performance instead of simply
          completing a conversation and moving on.
        </p>

        <div className="mt-7 space-y-5">
          <FeaturePoint
            icon={BarChart3}
            title="Performance overview"
            description="Get a clear summary of how you performed during the session."
          />

          <FeaturePoint
            icon={MessageCircle}
            title="AI feedback"
            description="Review feedback generated from your answers and communication."
          />

          <FeaturePoint
            icon={CheckCircle2}
            title="Identify strengths"
            description="Understand the areas where your answers and communication were effective."
          />

          <FeaturePoint
            icon={Target}
            title="Know what to improve"
            description="Use your report to focus your next practice session on weaker areas."
          />
        </div>
      </div>
    </div>
  );
}

export default function HowToUse() {
  const [activeSection, setActiveSection] = useState("practice");

  const renderContent = () => {
    switch (activeSection) {
      case "custom":
        return <CustomPracticeContent />;

      case "sessions":
        return <SessionsContent />;

      case "reports":
        return <ReportsContent />;

      default:
        return <StartPracticeContent />;
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        badge="How to Use"
        title="Start practicing in minutes"
        description="From your first AI conversation to custom question practice and performance reports, here's everything you need to know about using SpeakMate."
      />

      <div className="mx-auto mt-12 flex max-w-4xl overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`flex min-w-fit flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Icon size={18} />

              <span className="hidden sm:inline">{section.label}</span>
              <span className="sm:hidden">{section.shortLabel}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-12">{renderContent()}</div>

      <div className="mt-12 rounded-3xl border border-primary/20 bg-primary/5 p-6 text-center md:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles size={23} />
        </div>

        <h3 className="mt-4 text-xl font-black">
          Practice. Learn. Improve. Repeat.
        </h3>

        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Choose the practice method that matches your goal and use your
          feedback to improve with every SpeakMate session.
        </p>

        <button
          type="button"
          onClick={() => {
            const index = sections.findIndex(
              (section) => section.id === activeSection,
            );

            const nextSection = sections[(index + 1) % sections.length];
            setActiveSection(nextSection.id);

            window.scrollTo({
              top: window.scrollY - 150,
              behavior: "smooth",
            });
          }}
          className="mt-5 inline-flex items-center gap-2 font-semibold text-primary"
        >
          Explore next section
          <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
}