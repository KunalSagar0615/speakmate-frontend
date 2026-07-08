import {
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Flame,
  MessageSquare,
  Moon,
  Sun,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ActivityHeatmap } from "../../components/charts/ActivityHeatmap";
import { PracticeTrendChart, WeeklyActivityChart } from "../../components/charts/DashboardCharts";
import { RadioGroup } from "../../components/common/RadioGroup";
import { Button, Card, Input, Loader, StatCard } from "../../components/common/UI";
import { ChatWindow, VoicePanel } from "../../components/practice/PracticeComponents";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useVoicePractice } from "../../hooks/useVoicePractice";
import { conversationService } from "../../services/conversationService";
import { dashboardService } from "../../services/dashboardService";
import { reportService } from "../../services/reportService";
import { sessionService } from "../../services/sessionService";
import { userService } from "../../services/userService";
import { isEmailVerified } from "../../utils/emailVerified";

const MODE_OPTIONS = [
  {
    value: "FRIEND",
    label: "AI Friend",
    description: "Casual conversation practice",
  },
  {
    value: "ENGLISH_COACH",
    label: "AI Teacher",
    description: "Learn grammar and vocabulary",
  },
  {
    value: "INTERVIEW",
    label: "AI Interviewer",
    description: "HR and technical interviews",
  },
];

const COMMUNICATION_OPTIONS = [
  { value: "CHAT", label: "Text", description: "Type your responses in chat" },
  { value: "VOICE", label: "Voice", description: "Speak and get transcribed answers" },
];

const DIFFICULTY_OPTIONS = [
  { value: "BEGINNER", label: "Beginner", description: "Simple questions and guidance" },
  { value: "INTERMEDIATE", label: "Intermediate", description: "Moderate challenge level" },
  { value: "ADVANCED", label: "Advanced", description: "Complex and detailed practice" },
];

const TOPIC_SUGGESTIONS_BY_MODE = {
  FRIEND: [
    "Daily Conversation",
    "Travel",
    "Movies",
    "Hobbies",
    "Food",
    "Friends",
  ],

  ENGLISH_COACH: [
    "Grammar Practice",
    "Vocabulary Building",
    "Sentence Formation",
    "Speaking Fluency",
    "Pronunciation",
  ],

  INTERVIEW: [
    "Java Interview",
    "Spring Boot Interview",
    "HR Interview",
    "React Interview",
    "System Design",
  ],
};

const formatMode = (mode) => {
  const modeMap = {
    FRIEND: "AI Friend",
    ENGLISH_COACH: "AI Teacher",
    INTERVIEW: "AI Interviewer",
  };

  return modeMap[mode] || mode || "-";
};

const formatDifficulty = (difficulty) => {
  const difficultyMap = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    ADVANCED: "Advanced",
  };

  return difficultyMap[difficulty] || difficulty || "-";
};

const StatusBadge = ({ status }) => {
  const styles = {
    COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    ACTIVE: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
    >
      {status || "UNKNOWN"}
    </span>
  );
};

const ProfileField = ({ label, value }) => {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="font-medium text-slate-800 dark:text-slate-100">{value}</span>
    </div>
  );
};

export const UserDashboardPage = () => {
  const { userId } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [userSessions, analyticsData] = await Promise.all([
          sessionService.getByUserId(userId),
          dashboardService.getAnalytics(),
        ]);
        setSessions(userSessions);
        setAnalytics(analyticsData);
      } catch {
        setError("Unable to load dashboard data.");
        setSessions([]);
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const completedSessions = useMemo(
    () => sessions.filter((s) => s.status === "COMPLETED").length,
    [sessions]
  );

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <Card className="text-rose-500">{error}</Card>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Sessions" value={analytics?.totalSessions ?? 0} />
        <StatCard title="Completed Sessions" value={completedSessions} />
        <StatCard title="Current Streak" value={`${analytics?.currentStreak ?? 0} days`} />
        <StatCard title="Practice Days" value={analytics?.totalPracticeDays ?? 0} />
        <StatCard title="Reports Generated" value={analytics?.reportsGenerated ?? 0} />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <WeeklyActivityChart sessions={sessions} />
        <PracticeTrendChart sessions={sessions} />
      </div>
    </div>
  );
};

export const StartPracticePage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("");
  const [communicationType, setCommunicationType] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [topic, setTopic] = useState("");
  const [creating, setCreating] = useState(false);

  const topicSuggestions = useMemo(
    () => TOPIC_SUGGESTIONS_BY_MODE[mode] || [],
    [mode]
  );

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setTopic("");
  };

  const createSession = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic.");
      return;
    }
    setCreating(true);
    try {
      const data = await sessionService.create({
        topic: topic.trim(),
        status: "ACTIVE",
        userId: userId || 1,
        mode,
        difficultyLevel,
      });
      navigate(
        communicationType === "VOICE" ? `/practice/voice/${data.id}` : `/practice/chat/${data.id}`
      );
    } catch {
      toast.error("Failed to create session.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Start Practice</h2>
        <p className="mt-1 text-sm text-slate-500">
          Follow the guided steps to configure your AI practice session.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">Step 1</p>
          <RadioGroup
            label="Select Mode"
            name="practice-mode"
            options={MODE_OPTIONS}
            value={mode}
            onChange={handleModeChange}
          />
        </div>

        {mode && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">Step 2</p>
            <RadioGroup
              label="Select Communication Type"
              name="communication-type"
              options={COMMUNICATION_OPTIONS}
              value={communicationType}
              onChange={setCommunicationType}
            />
          </div>
        )}

        {mode && communicationType && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">Step 3</p>
            <RadioGroup
              label="Select Difficulty"
              name="difficulty-level"
              options={DIFFICULTY_OPTIONS}
              value={difficultyLevel}
              onChange={setDifficultyLevel}
            />
          </div>
        )}

        {mode && communicationType && difficultyLevel && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">Step 4</p>
            <Input
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Java Interview, Daily Conversation"
              autoComplete="off"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {topicSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setTopic(suggestion)}
                  className="rounded-full border border-sky-200 px-3 py-1 text-xs text-sky-700 transition hover:bg-sky-50 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-sky-950/40"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <Button className="mt-4" onClick={createSession} disabled={creating || !topic.trim()}>
              {creating ? "Creating..." : "Create Session"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export const ChatPracticePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const first = await conversationService.start(id);
        setMessages([
          {
            id: first.id,
            aiQuestion: first.aiQuestion,
            userAnswer: first.userAnswer,
            aiFeedback: first.aiFeedback,
          },
        ]);
        setConversationId(first.id);
      } catch {
        toast.error("Failed to start conversation");
      }
    })();
  }, [id]);

  const onSend = async () => {
    setLoading(true);
    try {
      const res = await conversationService.answer({ conversationId, answer });
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          answer,
          feedback: res.feedback,
        };
        updated.push({ id: res.nextConversationId, aiQuestion: res.nextQuestion });
        return updated;
      });
      setConversationId(res.nextConversationId ?? res.newConversationId);
      setAnswer("");
    } finally {
      setLoading(false);
    }
  };

  const onEnd = async () => {
    try {
      await sessionService.end(id);
      toast.success("Session ended successfully");
    } catch {
      toast.error("Failed to end session");
    } finally {
      navigate("/sessions");
    }
  };

  return (
    <ChatWindow
      messages={messages}
      answer={answer}
      setAnswer={setAnswer}
      onSend={onSend}
      onEnd={onEnd}
      loading={loading}
    />
  );
};

export const VoicePracticePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("Loading first AI question...");
  const [conversationId, setConversationId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    displayTranscript,
    listening,
    error,
    startListening,
    stopListening,
    speakText,
    speakSequence,
    stopSpeaking,
    clearTranscript,
  } = useVoicePractice();

  useEffect(() => {
    (async () => {
      try {
        const first = await conversationService.start(id);
        setConversationId(first.id);
        setQuestion(first.aiQuestion);
        speakText(first.aiQuestion);
      } catch {
        toast.error("Failed to start voice practice");
      }
    })();
  }, [id, speakText]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const onSubmit = async () => {
    if (!displayTranscript?.trim()) return;
    stopListening();
    setLoading(true);
    setFeedback("");
    try {
      const res = await conversationService.answer({ conversationId, answer: displayTranscript.trim() });
      setFeedback(res.feedback || "Answer submitted");
      clearTranscript();
      setConversationId(res.newConversationId ?? res.nextConversationId);
      setQuestion(res.nextQuestion);
      speakSequence([res.feedback, res.nextQuestion]);
    } catch {
      toast.error("Failed to submit answer");
    } finally {
      setLoading(false);
    }
  };

  const onEnd = async () => {
    stopListening();
    stopSpeaking();
    try {
      await sessionService.end(id);
      toast.success("Session ended successfully");
    } catch {
      toast.error("Failed to end session");
    } finally {
      navigate("/sessions");
    }
  };

  return (
    <VoicePanel
      question={question}
      displayTranscript={displayTranscript}
      listening={listening}
      feedback={feedback}
      loading={loading}
      onStart={startListening}
      onReplay={() => speakText(question)}
      onSubmit={onSubmit}
      onEnd={onEnd}
    />
  );
};

export const SessionsPage = () => {
  const { userId } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadSessions = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await sessionService.getByUserId(userId);
      setRows(data);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    loadSessions();
  }, [userId]);

  return (
    <Card>
      <h2 className="mb-4 text-xl font-bold">Session History</h2>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="py-2">Topic</th>
                <th>Mode</th>
                <th>Difficulty</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2">{r.topic}</td>
                  <td>{formatMode(r.mode)}</td>
                  <td>{formatDifficulty(r.difficultyLevel)}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}</td>
                  <td className="space-x-2 py-2">
                    <Button
                      className="px-2 py-1 text-xs"
                      variant="secondary"
                      onClick={() => navigate(`/sessions/${r.id}`)}
                    >
                      View
                    </Button>
                    <Button className="px-2 py-1 text-xs" onClick={() => navigate(`/reports?session=${r.id}`)}>
                      Report
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export const SessionDetailsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    conversationService
      .getBySession(id)
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Card className="space-y-3">
      <h2 className="text-xl font-bold">Session Details</h2>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : (
        data.map((d) => (
          <div key={d.id} className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
            <p className="font-semibold text-sky-600">{d.question || d.aiQuestion}</p>
            <p className="mt-1">{d.answer || d.userAnswer}</p>
            <p className="mt-1 text-emerald-600">{d.feedback || d.aiFeedback}</p>
          </div>
        ))
      )}
    </Card>
  );
};

export const ReportsPage = () => {
  const { userId } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionIdParam = searchParams.get("session");
  const [sessions, setSessions] = useState([]);
  const [questionCounts, setQuestionCounts] = useState({});
  const [modeFilter, setModeFilter] = useState("ALL");
  const [selectedSessionId, setSelectedSessionId] = useState(sessionIdParam || null);
  const [conversations, setConversations] = useState([]);
  const [aiReport, setAiReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const MODE_FILTER_OPTIONS = [
    { value: "ALL", label: "All Modes" },
    { value: "INTERVIEW", label: "INTERVIEW" },
    { value: "FRIEND", label: "FRIEND" },
    { value: "ENGLISH_COACH", label: "ENGLISH_COACH" },
  ];

  const reportSessions = useMemo(() => {
    const completed = sessions.filter((s) => s.status === "COMPLETED");
    if (modeFilter === "ALL") return completed;
    return completed.filter((s) => s.mode === modeFilter);
  }, [sessions, modeFilter]);

  const selectedSession = useMemo(
    () => reportSessions.find((s) => String(s.id) === String(selectedSessionId)) || null,
    [reportSessions, selectedSessionId]
  );

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    sessionService
      .getByUserId(userId)
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!reportSessions.length) {
      setQuestionCounts({});
      return;
    }
    Promise.all(
      reportSessions.map(async (session) => {
        try {
          const summary = await sessionService.getSummary(session.id);
          return [session.id, summary.totalQuestions ?? summary.totalConversations ?? 0];
        } catch {
          return [session.id, 0];
        }
      })
    ).then((entries) => setQuestionCounts(Object.fromEntries(entries)));
  }, [reportSessions]);

  useEffect(() => {
    if (sessionIdParam) {
      setSelectedSessionId(sessionIdParam);
    }
  }, [sessionIdParam]);

  useEffect(() => {
    if (!selectedSession?.id) {
      setConversations([]);
      setAiReport(null);
      return;
    }
    setDetailLoading(true);
    Promise.all([
      conversationService.getBySession(selectedSession.id),
      sessionService.getReport(selectedSession.id).catch(() => null),
    ])
      .then(([convData, reportData]) => {
        setConversations(convData);
        setAiReport(reportData);
      })
      .catch(() => {
        setConversations([]);
        setAiReport(null);
      })
      .finally(() => setDetailLoading(false));
  }, [selectedSession?.id]);

  const handleSelectSession = (session) => {
    setSelectedSessionId(String(session.id));
    setSearchParams({ session: String(session.id) });
  };

  const handleDownload = async (session) => {
    setDownloadingId(session.id);
    try {
      const [convData, reportData] = await Promise.all([
        conversationService.getBySession(session.id),
        sessionService.getReport(session.id).catch(() => null),
      ]);
      reportService.downloadPdf(session, convData, reportData);
      toast.success("Report downloaded successfully");
    } catch {
      toast.error("Failed to download report");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold">Reports</h2>
          <label className="flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-600 dark:text-slate-300">Filter by Mode:</span>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-primary/50 focus:ring dark:border-slate-700 dark:bg-slate-900"
            >
              {MODE_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      {reportSessions.length === 0 ? (
        <Card>
          <p className="text-slate-500">No completed reports found for the selected mode.</p>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {reportSessions.map((session) => (
            <Card
              key={session.id}
              className={`cursor-pointer transition hover:ring-2 hover:ring-primary/30 ${
                String(selectedSessionId) === String(session.id)
                  ? "ring-2 ring-primary"
                  : ""
              }`}
              onClick={() => handleSelectSession(session)}
            >
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                Topic: {session.topic}
              </h3>
              <div className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-medium">Mode:</span> {session.mode}
                </p>
                <p>
                  <span className="font-medium">Questions:</span>{" "}
                  {questionCounts[session.id] ?? "..."}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <StatusBadge status={session.status} />
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="secondary"
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectSession(session);
                  }}
                >
                  View
                </Button>
                <Button
                  className="text-xs"
                  disabled={downloadingId === session.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(session);
                  }}
                >
                  {downloadingId === session.id ? "Downloading..." : "Download PDF"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedSession && (
        <Card className="space-y-3">
          <h3 className="text-lg font-semibold">Report Preview</h3>
          {detailLoading ? (
            <div className="flex justify-center py-6">
              <Loader />
            </div>
          ) : (
            <>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <span className="font-medium">Topic:</span> {selectedSession.topic}
                </p>
                <p>
                  <span className="font-medium">Mode:</span> {formatMode(selectedSession.mode)} (
                  {selectedSession.mode})
                </p>
                <p>
                  <span className="font-medium">Status:</span> {selectedSession.status}
                </p>
                <p>
                  <span className="font-medium">Total Questions:</span>{" "}
                  {reportService.getAnsweredConversations(conversations).length}
                </p>
              </div>

              {aiReport?.overallEvaluation && (
                <div className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
                  <p className="font-semibold">Overall Evaluation</p>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">
                    {aiReport.overallEvaluation}
                  </p>
                </div>
              )}

              {aiReport?.strengths && (
                <div className="rounded-xl bg-emerald-50 p-4 text-sm dark:bg-emerald-950/30">
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">Strengths</p>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">{aiReport.strengths}</p>
                </div>
              )}

              {aiReport?.areasOfImprovement && (
                <div className="rounded-xl bg-rose-50 p-4 text-sm dark:bg-rose-950/30">
                  <p className="font-semibold text-rose-800 dark:text-rose-300">
                    Areas Of Improvement
                  </p>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">
                    {aiReport.areasOfImprovement}
                  </p>
                </div>
              )}

              {aiReport?.recommendations && (
                <div className="rounded-xl bg-sky-50 p-4 text-sm dark:bg-sky-950/30">
                  <p className="font-semibold text-sky-800 dark:text-sky-300">Recommendations</p>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">
                    {aiReport.recommendations}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {reportService.getAnsweredConversations(conversations).map((item, index) => (
                  <div
                    key={item.id || index}
                    className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                  >
                    <p className="font-semibold text-primary">
                      Q{index + 1}: {item.aiQuestion || item.question}
                    </p>
                    <p className="mt-2 rounded-lg bg-slate-100 p-2 text-sm dark:bg-slate-800">
                      {item.userAnswer || item.answer}
                    </p>
                    {(item.aiFeedback || item.feedback) && (
                      <p className="mt-2 rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                        {item.aiFeedback || item.feedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleDownload(selectedSession)}
                disabled={downloadingId === selectedSession.id}
              >
                {downloadingId === selectedSession.id ? "Downloading..." : "Download PDF"}
              </Button>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

const AnalyticsStatCard = ({ title, value, icon: Icon }) => (
  <Card className="flex items-center gap-4">
    <div className="rounded-xl bg-sky-100 p-3 dark:bg-sky-900/40">
      <Icon className="text-primary" size={22} />
    </div>
    <div>
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-50">{value}</p>
    </div>
  </Card>
);

export const ProfilePage = () => {
  const { user: cachedUser, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [analyticsError, setAnalyticsError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setProfileError("");
      setAnalyticsError("");

      const profilePromise = userService
        .getProfile()
        .then((data) => {
          if (!cancelled) {
            setProfile(data);
            setUser({ ...data, role: cachedUser?.role });
          }
        })
        .catch(() => {
          if (!cancelled) {
            setProfileError("Unable to load profile. Please try again.");
            setProfile(cachedUser);
          }
        });

      const analyticsPromise = dashboardService
        .getAnalytics()
        .then((data) => {
          if (!cancelled) setAnalytics(data);
        })
        .catch(() => {
          if (!cancelled) setAnalyticsError("Unable to load analytics.");
        });

      await Promise.allSettled([profilePromise, analyticsPromise]);
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const verified = isEmailVerified(profile?.emailVerified);

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (profileError && !profile) {
    return <Card className="text-rose-500">{profileError}</Card>;
  }

  const modeCards = [
    { key: "FRIEND", label: "AI Friend", icon: MessageSquare },
    { key: "ENGLISH_COACH", label: "AI Teacher", icon: Target },
    { key: "INTERVIEW", label: "AI Interviewer", icon: Award },
  ];

  const difficultyCards = [
    { key: "BEGINNER", label: "Beginner" },
    { key: "INTERMEDIATE", label: "Intermediate" },
    { key: "ADVANCED", label: "Advanced" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold">Profile Information</h2>
        <div className="mt-4">
          <ProfileField label="Name" value={profile?.name} />
          <ProfileField label="Username" value={profile?.username} />
          <ProfileField label="Email" value={profile?.email} />
          <ProfileField label="Mobile Number" value={profile?.mobileNumber} />
          <ProfileField label="Country" value={profile?.country} />
          <ProfileField label="Highest Education" value={profile?.highestEducation} />
          <ProfileField label="Current Occupation" value={profile?.currentOccupation} />
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-500">Email Verified</span>
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                verified ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {verified ? (
                <>
                  <CheckCircle2 size={16} /> Verified ✅
                </>
              ) : (
                <>Not Verified ❌</>
              )}
            </span>
          </div>
        </div>
      </Card>

      {analyticsError && (
        <Card className="text-sm text-amber-600">{analyticsError}</Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsStatCard
          title="Total Sessions"
          value={analytics?.totalSessions ?? 0}
          icon={BarChart3}
        />
        <AnalyticsStatCard
          title="Total Conversations"
          value={analytics?.totalConversations ?? 0}
          icon={MessageSquare}
        />
        <AnalyticsStatCard
          title="Practice Days"
          value={analytics?.totalPracticeDays ?? 0}
          icon={Calendar}
        />
        <AnalyticsStatCard
          title="Reports Generated"
          value={analytics?.reportsGenerated ?? 0}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <AnalyticsStatCard
          title="Current Streak"
          value={`${analytics?.currentStreak ?? 0} days`}
          icon={Flame}
        />
        <AnalyticsStatCard
          title="Longest Streak"
          value={`${analytics?.longestStreak ?? 0} days`}
          icon={Trophy}
        />
        <AnalyticsStatCard
          title="Average Score"
          value={analytics?.averageScore != null ? analytics.averageScore.toFixed(1) : "0.0"}
          icon={Target}
        />
      </div>

      <Card>
        <h3 className="mb-4 text-lg font-semibold">Mode Usage</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {modeCards.map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700"
            >
              <Icon className="text-primary" size={24} />
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold">{analytics?.modeUsage?.[key] ?? 0}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold">Difficulty Usage</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {difficultyCards.map(({ key, label }) => (
            <div
              key={key}
              className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
            >
              <p className="text-sm text-slate-500">{label}</p>
              <p className="text-2xl font-bold">{analytics?.difficultyUsage?.[key] ?? 0}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <ActivityHeatmap activityHeatmap={analytics?.activityHeatmap || {}} />
      </Card>
    </div>
  );
};

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const savePreference = () => {
    setSaved(true);
    toast.success("Theme preference saved");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-5">
        <div>
          <h2 className="text-xl font-bold">Settings</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your appearance and preferences.</p>
        </div>

        <section>
          <h3 className="font-semibold">Theme Preferences</h3>
          <p className="mt-1 text-sm text-slate-500">Choose how SpeakMate looks on your device.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex items-center gap-3 rounded-xl border p-4 transition ${
                theme === "light"
                  ? "border-primary bg-sky-50 ring-2 ring-primary/30 dark:bg-sky-950/30"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <Sun size={20} className="text-amber-500" />
              <span>
                <span className="block font-medium">Light Mode</span>
                <span className="text-xs text-slate-500">Bright and clean interface</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-3 rounded-xl border p-4 transition ${
                theme === "dark"
                  ? "border-primary bg-sky-50 ring-2 ring-primary/30 dark:bg-sky-950/30"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <Moon size={20} className="text-indigo-400" />
              <span>
                <span className="block font-medium">Dark Mode</span>
                <span className="text-xs text-slate-500">Easy on the eyes at night</span>
              </span>
            </button>
          </div>
          <Button className="mt-4" onClick={savePreference}>
            {saved ? "Saved!" : "Save Preference"}
          </Button>
        </section>
      </Card>
    </div>
  );
};
