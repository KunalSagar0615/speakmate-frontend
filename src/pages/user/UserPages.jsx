import {BarChart3, Calendar, CheckCircle2, Flame, LogOut, Mail, Moon, Phone, ShieldCheck, Sun, Target, Trophy, User, BriefcaseBusiness,
  GraduationCap, Globe2, MessageSquare, Volume2, Play, } from "lucide-react";
import { useEffect, useRef, useMemo, useState } from "react";
import { translateText, getTranslationLabel } from "../../utils/translation";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ActivityHeatmap } from "../../components/charts/ActivityHeatmap";
import { DashboardHero } from "../../components/charts/DashboardCharts";
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
import { useReports } from "../../context/ReportsContext.jsx";
import { useSettings } from "../../context/SettingsContext";
import PulseGridLoader from "../../components/common/PulseGridLoader";

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


export const UserDashboardPage = () => {
  const { userId, user } = useAuth();
  const navigate = useNavigate();

  const { loadReports } = useReports();

  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const [heatmapLoading, setHeatmapLoading] = useState(true);

  const ANALYTICS_CACHE_KEY =
    `speakmate_dashboard_analytics_${userId}`;

  useEffect(() => {
    if (!userId) {
      return;
    }

    // --------------------------------------------------
    // PRELOAD REPORTS IN BACKGROUND
    // --------------------------------------------------

    loadReports();

    // --------------------------------------------------
    // LOAD DASHBOARD ANALYTICS
    // --------------------------------------------------

    const cachedAnalytics =
      localStorage.getItem(ANALYTICS_CACHE_KEY);

    if (cachedAnalytics) {
      try {
        const parsed = JSON.parse(cachedAnalytics);

        setAnalytics(parsed);
        setHeatmapLoading(false);
      } catch {
        localStorage.removeItem(
          ANALYTICS_CACHE_KEY
        );
      }
    }

    (async () => {
      setError("");

      try {
        const data =
          await dashboardService.getAnalytics();

        setAnalytics(data);

        localStorage.setItem(
          ANALYTICS_CACHE_KEY,
          JSON.stringify(data)
        );
      } catch {
        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setHeatmapLoading(false);
      }
    })();

  }, [userId, loadReports]);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <DashboardHero
        stats={{
          currentStreak:
            analytics?.currentStreak ?? "...",

          totalSessions:
            analytics?.totalSessions ?? "...",

          practiceDays:
            analytics?.totalPracticeDays ?? "...",

          reportsGenerated:
            analytics?.reportsGenerated ?? "...",
        }}

        userName={
          user?.name ||
          user?.username ||
          "User"
        }

        onFriendPractice={() =>
          navigate("/practice", {
            state: {
              defaultMode: "FRIEND",
            },
          })
        }

        onTeacherPractice={() =>
          navigate("/practice", {
            state: {
              defaultMode: "ENGLISH_COACH",
            },
          })
        }

        onInterviewerPractice={() =>
          navigate("/practice", {
            state: {
              defaultMode: "INTERVIEW",
            },
          })
        }

        onCustomPractice={() =>
          navigate("/custom-practice")
        }

        onReports={() =>
          navigate("/reports")
        }
      />

      <section>

        <div className="mb-4">

          <p className="text-sm font-semibold text-sky-500">
            Your Consistency
          </p>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Every practice day moves you one step forward.
          </p>

        </div>

        {heatmapLoading ? (
          <div className="flex justify-center py-10">
            <PulseGridLoader />
          </div>
        ) : (
          <ActivityHeatmap
            activityHeatmap={
              analytics?.activityHeatmap || {}
            }
          />
        )}

      </section>

    </div>
  );
};

export const StartPracticePage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const defaultMode = location.state?.defaultMode || "";
  const [mode, setMode] = useState(defaultMode);
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

  useEffect(() => {
    if (mode === "ENGLISH_COACH") {
      setCommunicationType("CHAT");
    } else {
      setCommunicationType("");
    }
    setDifficultyLevel("");
    setTopic("");
  }, [mode]);

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
        communicationType === "VOICE" ? `/practice/voice/${data.id}` : `/practice/chat/${data.id}`,
        { state: { mode, difficultyLevel } }
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
        {!defaultMode && (
          <div>
            <RadioGroup
              label="Select Mode"
              name="practice-mode"
              options={MODE_OPTIONS}
              value={mode}
              onChange={handleModeChange}
            />
          </div>
        )}

        {mode && mode !== "ENGLISH_COACH" && (
          <div>
            <RadioGroup
              label="Select Communication Type"
              name="communication-type"
              options={COMMUNICATION_OPTIONS}
              value={communicationType}
              onChange={setCommunicationType}
            />
          </div>
        )}

        {mode &&
          (mode === "ENGLISH_COACH" || communicationType) && (
            <div>
              <RadioGroup
                label="Select Difficulty"
                name="difficulty-level"
                options={DIFFICULTY_OPTIONS}
                value={difficultyLevel}
                onChange={setDifficultyLevel}
              />
            </div>
          )}

        {mode &&
          (mode === "ENGLISH_COACH" || communicationType) &&
          difficultyLevel && (
            <div>
              <Input
                label="Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic for practice"
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
  const location = useLocation();
  const { refreshReports } = useReports();

  // Keep only the CURRENT question in messages.
  // ChatWindow can continue using the existing messages prop.
  const [messages, setMessages] = useState([]);

  const [answer, setAnswer] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [suggestedAnswer, setSuggestedAnswer] = useState("");
  const [suggestedAnswerLoading, setSuggestedAnswerLoading] = useState(false);
  const [suggestedAnswerError, setSuggestedAnswerError] = useState("");
  const [suggestedAnswerCache, setSuggestedAnswerCache] = useState({});

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);

  const [translationPreference, setTranslationPreference] =
    useState("ENGLISH");
  const [translatedQuestion, setTranslatedQuestion] = useState("");
  const [translationLoading, setTranslationLoading] = useState(false);
  const [translationError, setTranslationError] = useState("");

  const mode = location.state?.mode || "FRIEND";
  const difficultyLevel =
    location.state?.difficultyLevel || "BEGINNER";

  // --------------------------------------------------
  // START PRACTICE
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const startPractice = async () => {
      try {
        const first = await conversationService.start(id);

        if (cancelled) return;

        const firstQuestion = first.aiQuestion || "";

        setConversationId(first.id);

        setCurrentQuestion(firstQuestion);
        setQuestionNumber(1);

        // Only ONE question exists in the UI.
        setMessages([
          {
            id: first.id,
            aiQuestion: firstQuestion,
            userAnswer: "",
            aiFeedback: "",
          },
        ]);

        setAnswer("");

        setSuggestedAnswer("");
        setSuggestedAnswerError("");
        setSuggestedAnswerLoading(false);

        setTranslatedQuestion("");
        setTranslationError("");
      } catch {
        if (!cancelled) {
          toast.error("Failed to start conversation");
        }
      }
    };

    startPractice();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // --------------------------------------------------
  // TRANSLATION
  // --------------------------------------------------

  useEffect(() => {
    if (
      !currentQuestion ||
      !translationPreference ||
      translationPreference === "ENGLISH"
    ) {
      setTranslatedQuestion("");
      setTranslationError("");
      setTranslationLoading(false);
      return;
    }

    let cancelled = false;

    setTranslationLoading(true);
    setTranslationError("");

    translateText(currentQuestion, translationPreference)
      .then(({ translatedText, error }) => {
        if (cancelled) return;

        setTranslatedQuestion(
          translatedText || currentQuestion
        );

        setTranslationError(
          error ? "Showing original English text." : ""
        );
      })
      .catch(() => {
        if (cancelled) return;

        setTranslatedQuestion(currentQuestion);
        setTranslationError("");
      })
      .finally(() => {
        if (!cancelled) {
          setTranslationLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentQuestion, translationPreference]);

  // --------------------------------------------------
  // SEND ANSWER
  // --------------------------------------------------

  const onSend = async () => {
    const finalAnswer = answer?.trim();

    if (!finalAnswer || !conversationId || loading) {
      return;
    }

    setLoading(true);

    // Immediately hide the previous suggestion.
    setSuggestedAnswer("");
    setSuggestedAnswerError("");

    try {
      const res = await conversationService.answer({
        conversationId,
        answer: finalAnswer,
      });

      const nextQuestion = res.nextQuestion || "";

      const nextConversationId =
        res.newConversationId ?? res.nextConversationId;

      // ----------------------------------------------
      // Move to the next question
      // ----------------------------------------------

      setConversationId(nextConversationId);

      setCurrentQuestion(nextQuestion);

      setQuestionNumber((prev) => prev + 1);

      setAnswer("");

      // ----------------------------------------------
      // IMPORTANT:
      // Replace the old message instead of pushing
      // another message.
      // ----------------------------------------------

      setMessages([
        {
          id: nextConversationId,
          aiQuestion: nextQuestion,
          userAnswer: "",
          aiFeedback: "",
        },
      ]);

      // ----------------------------------------------
      // Reset question-specific UI
      // ----------------------------------------------

      setSuggestedAnswer("");
      setSuggestedAnswerError("");
      setSuggestedAnswerLoading(false);

      setTranslatedQuestion("");
      setTranslationError("");
    } catch {
      toast.error("Failed to submit answer");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // SHOW SUGGESTED ANSWER
  // --------------------------------------------------

  const onShowSuggestedAnswer = async () => {
    if (
      !currentQuestion ||
      suggestedAnswerLoading ||
      loading
    ) {
      return;
    }

    const cacheKey = `${currentQuestion}|${conversationId || ""
      }`;

    // Use cached answer if available.
    if (suggestedAnswerCache[cacheKey]) {
      setSuggestedAnswer(
        suggestedAnswerCache[cacheKey]
      );
      setSuggestedAnswerError("");
      return;
    }

    setSuggestedAnswerLoading(true);
    setSuggestedAnswerError("");

    try {
      const res =
        await conversationService.getSuggestedAnswer({
          question: currentQuestion,
          mode,
          difficultyLevel,
        });

      const answerText =
        typeof res === "string"
          ? res
          : res?.answer ||
          res?.suggestedAnswer ||
          "";

      setSuggestedAnswer(answerText);

      setSuggestedAnswerCache((prev) => ({
        ...prev,
        [cacheKey]: answerText,
      }));
    } catch {
      setSuggestedAnswerError(
        "Unable to load a suggested answer right now."
      );
    } finally {
      setSuggestedAnswerLoading(false);
    }
  };

  // --------------------------------------------------
  // END SESSION
  // --------------------------------------------------

  const onEnd = async () => {
  try {
    await sessionService.end(id);

    // Update the reports cache before opening Reports.
    await refreshReports();

    toast.success("Session completed successfully");

    navigate(`/reports?session=${id}`);
  } catch {
    toast.error("Failed to end session");
  }
};

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <ChatWindow
      messages={messages}
      questionNumber={questionNumber}
      answer={answer}
      setAnswer={setAnswer}
      onSend={onSend}
      onEnd={onEnd}
      loading={loading}

      suggestedAnswer={suggestedAnswer}
      suggestedAnswerLoading={suggestedAnswerLoading}
      onShowSuggestedAnswer={onShowSuggestedAnswer}
      suggestedAnswerError={suggestedAnswerError}

      translationMode={translationPreference}
      translatedText={translatedQuestion}
      translationLabel={getTranslationLabel(
        translationPreference
      )}
      translationLoading={translationLoading}
      onTranslationChange={setTranslationPreference}
      translationError={translationError}

      showTranslationControls={
        mode === "FRIEND" ||
        mode === "ENGLISH_COACH" ||
        mode === "INTERVIEW"
      }
    />
  );
};

export const VoicePracticePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshReports } = useReports();
  const [question, setQuestion] = useState("Loading first AI question...");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [conversationId, setConversationId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [translationPreference, setTranslationPreference] = useState("ENGLISH");
  const [translatedQuestion, setTranslatedQuestion] = useState("");
  const [suggestedAnswer, setSuggestedAnswer] = useState("");
  const [suggestedAnswerLoading, setSuggestedAnswerLoading] = useState(false);
  const [suggestedAnswerError, setSuggestedAnswerError] = useState("");
  const [suggestedAnswerCache, setSuggestedAnswerCache] = useState({});
  const mode = location.state?.mode || "FRIEND";
  const [translationLoading, setTranslationLoading] = useState(false);
  const [translationError, setTranslationError] = useState("");
  const [transcriptValue, setTranscriptValue] = useState("");
  const {
    transcript,
    displayTranscript,
    listening,
    error,
    startListening,
    stopListening,
    speakText,
    speakSequence,
    stopSpeaking,
    clearTranscript,
    setTranscript,
  } = useVoicePractice();

  useEffect(() => {
    (async () => {
      try {
        const first = await conversationService.start(id);
        setConversationId(first.id);
        setQuestion(first.aiQuestion);
        setQuestionNumber(1);
        setTranscriptValue("");
        setTranslatedQuestion("");
        setTranslationError("");
        speakText(first.aiQuestion);
      } catch {
        toast.error("Failed to start voice practice");
      }
    })();
  }, [id, speakText]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (!question || !translationPreference || translationPreference === "ENGLISH") {
      setTranslatedQuestion("");
      setTranslationError("");
      return;
    }

    let cancelled = false;
    setTranslationLoading(true);
    setTranslationError("");
    translateText(question, translationPreference)
      .then(({ translatedText, error }) => {
        if (!cancelled) {
          setTranslatedQuestion(translatedText || question);
          setTranslationError(error ? "Showing original English text." : "");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTranslatedQuestion(question);
          setTranslationError("");
        }
      })
      .finally(() => {
        if (!cancelled) setTranslationLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [question, translationPreference]);

  useEffect(() => {
    if (!displayTranscript?.trim()) {
      setTranscriptValue(transcript);
      return;
    }
    setTranscriptValue(displayTranscript);
  }, [displayTranscript, transcript]);

  const onShowSuggestedAnswer = async () => {
    if (!question || suggestedAnswerLoading) return;
    const cacheKey = `${question}|${conversationId || ""}`;
    if (suggestedAnswerCache[cacheKey]) {
      setSuggestedAnswer(suggestedAnswerCache[cacheKey]);
      setSuggestedAnswerError("");
      return;
    }

    setSuggestedAnswerLoading(true);
    setSuggestedAnswerError("");
    try {
      const res = await conversationService.getSuggestedAnswer({
        question,
        mode,
        difficultyLevel: location.state?.difficultyLevel || "BEGINNER",
      });
      const answerText = typeof res === "string" ? res : res?.answer || res?.suggestedAnswer || "";
      setSuggestedAnswer(answerText);
      setSuggestedAnswerCache((prev) => ({ ...prev, [cacheKey]: answerText }));
    } catch {
      setSuggestedAnswerError("Unable to load a suggested answer right now.");
    } finally {
      setSuggestedAnswerLoading(false);
    }
  };

  const onSubmit = async () => {
    const finalTranscript = transcriptValue?.trim();
    if (!finalTranscript) return;
    stopListening();
    setLoading(true);
    setFeedback("");
    setSuggestedAnswer("");
    setSuggestedAnswerError("");
    try {
      const res = await conversationService.answer({ conversationId, answer: finalTranscript });
      setFeedback(res.feedback || "Answer submitted");
      clearTranscript();
      setTranscript("");
      setTranscriptValue("");
      setConversationId(res.newConversationId ?? res.nextConversationId);
      setQuestion(res.nextQuestion);
      setQuestionNumber((prev) => prev + 1);
      setTranslatedQuestion("");
      setTranslationError("");
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

    // Update the reports cache before opening Reports.
    await refreshReports();

    toast.success("Session completed successfully");

    navigate(`/reports?session=${id}`);
  } catch {
    toast.error("Failed to end session");
  }
};

  return (
    <VoicePanel
      question={question}
      questionNumber={questionNumber}
      displayTranscript={displayTranscript}
      listening={listening}
      feedback={feedback}
      loading={loading}
      onStart={startListening}
      onReplay={() => speakText(question)}
      onSubmit={onSubmit}
      onEnd={onEnd}
      translationMode={translationPreference}
      translatedText={translatedQuestion}
      translationLabel={getTranslationLabel(translationPreference)}
      translationLoading={translationLoading}
      onTranslationChange={setTranslationPreference}
      translationError={translationError}
      transcriptValue={transcriptValue}
      onTranscriptChange={setTranscriptValue}
      showTranslationControls={mode === "FRIEND" || mode === "ENGLISH_COACH" || mode === "INTERVIEW"}
      suggestedAnswer={suggestedAnswer}
      suggestedAnswerLoading={suggestedAnswerLoading}
      onShowSuggestedAnswer={onShowSuggestedAnswer}
      suggestedAnswerError={suggestedAnswerError}
    />
  );
};

export const SessionsPage = () => {
  const { userId } = useAuth();
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    if (!userId) return;
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
      return;
    }
    loadSessions();
  }, [userId]);

  return (
    <Card>
      <h2 className="mb-4 text-xl font-bold">Session History</h2>
      {loading ? (
        <div className="flex justify-center py-8">
          <PulseGridLoader />
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="max-w-[250px] py-2">Topic</th>
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
                  <td className="max-w-[250px] py-2">
                    <div className="max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap" title={r.topic || "-"}>
                      {r.topic || "-"}
                    </div>
                  </td>
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
          <PulseGridLoader />
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const sessionIdParam = searchParams.get("session");

  const {
    sessions,
    questionCounts,
    reportSessions,
    loading,
  } = useReports();

  const [modeFilter, setModeFilter] = useState("ALL");

  const [selectedSessionId, setSelectedSessionId] = useState(
    sessionIdParam || null
  );

  const [conversations, setConversations] = useState([]);
  const [aiReport, setAiReport] = useState(null);

  const [detailLoading, setDetailLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const MODE_FILTER_OPTIONS = [
    { value: "ALL", label: "All Modes" },
    { value: "INTERVIEW", label: "INTERVIEW" },
    { value: "FRIEND", label: "FRIEND" },
    { value: "ENGLISH_COACH", label: "ENGLISH_COACH" },
  ];

  // =========================================================
  // MODE FILTER
  // =========================================================

  const filteredReportSessions = useMemo(() => {
    if (modeFilter === "ALL") {
      return reportSessions;
    }

    return reportSessions.filter(
      (session) => session.mode === modeFilter
    );
  }, [reportSessions, modeFilter]);

  // =========================================================
  // SELECTED SESSION
  // =========================================================

  const selectedSession = useMemo(() => {
    if (!selectedSessionId) {
      return null;
    }

    return (
      sessions.find(
        (session) =>
          String(session.id) ===
          String(selectedSessionId)
      ) || null
    );
  }, [sessions, selectedSessionId]);

  // =========================================================
  // SYNC URL WITH SELECTED SESSION
  // =========================================================

  useEffect(() => {
    setSelectedSessionId(sessionIdParam || null);
  }, [sessionIdParam]);

  // =========================================================
  // LOAD SELECTED REPORT
  // =========================================================

  useEffect(() => {
    if (!selectedSession?.id) {
      setConversations([]);
      setAiReport(null);
      return;
    }

    let cancelled = false;

    setDetailLoading(true);
    setConversations([]);
    setAiReport(null);

    Promise.all([
      conversationService.getBySession(
        selectedSession.id
      ),

      sessionService
        .getReport(selectedSession.id)
        .catch(() => null),
    ])
      .then(([conversationData, reportData]) => {
        if (cancelled) return;

        setConversations(
          Array.isArray(conversationData)
            ? conversationData
            : []
        );

        setAiReport(reportData || null);
      })
      .catch(() => {
        if (cancelled) return;

        setConversations([]);
        setAiReport(null);

        toast.error(
          "Unable to load this report."
        );
      })
      .finally(() => {
        if (!cancelled) {
          setDetailLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSession?.id]);

  // =========================================================
  // VIEW REPORT
  // =========================================================

  const handleViewReport = (session) => {
    const id = String(session.id);

    setSelectedSessionId(id);

    setSearchParams({
      session: id,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // BACK TO ALL REPORTS
  // =========================================================

  const handleBackToReports = () => {
    setSelectedSessionId(null);

    setSearchParams({});

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // DOWNLOAD PDF
  // =========================================================

  const handleDownload = async (session) => {
    setDownloadingId(session.id);

    try {
      const [
        conversationData,
        reportData,
      ] = await Promise.all([
        conversationService.getBySession(
          session.id
        ),

        sessionService
          .getReport(session.id)
          .catch(() => null),
      ]);

      reportService.downloadPdf(
        session,
        conversationData || [],
        reportData || null
      );

      toast.success(
        "Report downloaded successfully"
      );
    } catch {
      toast.error(
        "Failed to download report"
      );
    } finally {
      setDownloadingId(null);
    }
  };

  // =========================================================
  // INITIAL LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <PulseGridLoader />
      </div>
    );
  }

  // =========================================================
  // SINGLE REPORT VIEW
  // /reports?session=6
  // =========================================================

  if (sessionIdParam) {
    if (!selectedSession) {
      return (
        <div className="space-y-5">
          <Card>
            <div className="flex flex-col items-center justify-center py-12 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <BarChart3
                  size={25}
                  className="text-slate-400"
                />
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                Report Not Found
              </h2>

              <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                We couldn't find the requested
                practice session.
              </p>

              <Button
                type="button"
                className="mt-5"
                onClick={() =>
                  navigate("/reports")
                }
              >
                Back to Reports
              </Button>

            </div>
          </Card>
        </div>
      );
    }

    const answeredConversations =
      reportService.getAnsweredConversations(
        conversations
      );

    return (
      <div className="space-y-5">

        {/* REPORT HEADER */}

        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-semibold text-sky-500">
                Practice Completed
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                Your Practice Report
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {selectedSession.topic ||
                  "Practice Session"}
              </p>
            </div>

            <StatusBadge
              status={selectedSession.status}
            />

          </div>
        </Card>

        {/* REPORT CONTENT */}

        <Card className="space-y-6">

          {detailLoading ? (
            <div className="flex justify-center py-12">
              <PulseGridLoader />
            </div>
          ) : (
            <>

              {/* SESSION SUMMARY */}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                  <p className="text-xs font-medium text-slate-500">
                    Topic
                  </p>

                  <p className="mt-1 break-words font-semibold text-slate-900 dark:text-white">
                    {selectedSession.topic || "-"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                  <p className="text-xs font-medium text-slate-500">
                    Mode
                  </p>

                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {formatMode(
                      selectedSession.mode
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                  <p className="text-xs font-medium text-slate-500">
                    Difficulty
                  </p>

                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {formatDifficulty(
                      selectedSession.difficultyLevel
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                  <p className="text-xs font-medium text-slate-500">
                    Questions
                  </p>

                  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                    {answeredConversations.length}
                  </p>
                </div>

              </div>

              {/* AI OVERALL REPORT */}

              {aiReport?.overallEvaluation && (
                <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5 dark:border-sky-900/40 dark:bg-sky-950/20">
                  <p className="font-semibold text-sky-700 dark:text-sky-300">
                    Overall Evaluation
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {aiReport.overallEvaluation}
                  </p>
                </div>
              )}

              {/* STRENGTHS */}

              {aiReport?.strengths && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                    Strengths
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {aiReport.strengths}
                  </p>
                </div>
              )}

              {/* AREAS OF IMPROVEMENT */}

              {aiReport?.areasOfImprovement && (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 dark:border-rose-900/40 dark:bg-rose-950/20">
                  <p className="font-semibold text-rose-700 dark:text-rose-300">
                    Areas Of Improvement
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {aiReport.areasOfImprovement}
                  </p>
                </div>
              )}

              {/* RECOMMENDATIONS */}

              {aiReport?.recommendations && (
                <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5 dark:border-sky-900/40 dark:bg-sky-950/20">
                  <p className="font-semibold text-sky-700 dark:text-sky-300">
                    Recommendations
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {aiReport.recommendations}
                  </p>
                </div>
              )}

              {/* QUESTION BY QUESTION */}

              <div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-sky-500">
                    Detailed Feedback
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                    Question-by-Question Feedback
                  </h2>
                </div>

                {answeredConversations.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No answered questions were
                      found for this session.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">

                    {answeredConversations.map(
                      (item, index) => (
                        <div
                          key={
                            item.id || index
                          }
                          className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
                        >

                          <p className="font-semibold text-sky-600 dark:text-sky-400">
                            Q{index + 1}:{" "}
                            {item.aiQuestion ||
                              item.question ||
                              "Question unavailable"}
                          </p>

                          <div className="mt-4">
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Your Answer
                            </p>

                            <p className="rounded-xl bg-slate-100 p-3 text-sm leading-6 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              {item.userAnswer ||
                                item.answer ||
                                "No answer"}
                            </p>
                          </div>

                          {(item.aiFeedback ||
                            item.feedback) && (
                            <div className="mt-4">
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                AI Feedback
                              </p>

                              <p className="rounded-xl bg-sky-50 p-3 text-sm leading-6 text-slate-700 dark:bg-sky-950/20 dark:text-slate-300">
                                {item.aiFeedback ||
                                  item.feedback}
                              </p>
                            </div>
                          )}

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

              {/* ACTIONS */}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    navigate("/dashboard")
                  }
                >
                  Back to Home
                </Button>

                <Button
                  type="button"
                  disabled={
                    downloadingId ===
                    selectedSession.id
                  }
                  onClick={() =>
                    handleDownload(
                      selectedSession
                    )
                  }
                >
                  {downloadingId ===
                    selectedSession.id
                    ? "Downloading..."
                    : "Download PDF"}
                </Button>

              </div>

            </>
          )}

        </Card>

      </div>
    );
  }

  // =========================================================
  // ALL REPORTS PAGE
  // /reports
  // =========================================================

  return (
    <div className="space-y-5">

      {/* HEADER */}

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Reports
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review your completed practice
              sessions.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm">

            <span className="font-medium text-slate-600 dark:text-slate-300">
              Filter by Mode:
            </span>

            <select
              value={modeFilter}
              onChange={(e) =>
                setModeFilter(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900"
            >
              {MODE_FILTER_OPTIONS.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>

          </label>

        </div>
      </Card>

      {/* REPORT CARDS */}

      {filteredReportSessions.length === 0 ? (
        <Card>
          <div className="py-10 text-center">
            <p className="font-semibold text-slate-700 dark:text-slate-200">
              No completed reports found
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Complete a practice session to
              generate a report.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">

          {filteredReportSessions.map(
            (session) => (
              <Card
                key={session.id}
                className="transition-all duration-200 hover:-translate-y-0.5 hover:ring-1 hover:ring-sky-500/30"
              >

                {/* TOP */}

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <h3 className="break-words font-semibold text-slate-800 dark:text-slate-100">
                      Topic:{" "}
                      {session.topic ||
                        "Untitled Practice"}
                    </h3>

                    {session.createdAt && (
                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(
                          session.createdAt
                        ).toLocaleDateString()}
                      </p>
                    )}

                  </div>

                  <StatusBadge
                    status={session.status}
                  />

                </div>

                {/* DETAILS */}

                <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">

                  <p>
                    <span className="font-medium">
                      Mode:
                    </span>{" "}
                    {formatMode(session.mode)}
                  </p>

                  <p>
                    <span className="font-medium">
                      Questions:
                    </span>{" "}
                    {questionCounts[
                      session.id
                    ] ?? "..."}
                  </p>

                </div>

                {/* ACTIONS */}

                <div className="mt-5 flex gap-2">

                  <Button
                    type="button"
                    variant="secondary"
                    className="text-xs"
                    onClick={() =>
                      handleViewReport(
                        session
                      )
                    }
                  >
                    View Report
                  </Button>

                  <Button
                    type="button"
                    className="text-xs"
                    disabled={
                      downloadingId ===
                      session.id
                    }
                    onClick={() =>
                      handleDownload(
                        session
                      )
                    }
                  >
                    {downloadingId ===
                      session.id
                      ? "Downloading..."
                      : "Download PDF"}
                  </Button>

                </div>

              </Card>
            )
          )}

        </div>
      )}

    </div>
  );
};


export const ProfilePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/settings", { replace: true });
  }, [navigate]);

  return null;
};

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme();

  const {
    userId,
    logout,
  } = useAuth();

  const {
    profile,
    analytics,
    loading,
    refreshSettings,
  } = useSettings();

  const navigate = useNavigate();

  const [profileError, setProfileError] = useState("");


  // =========================================================
  // VOICE SETTINGS
  // =========================================================

  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(
    () => localStorage.getItem("speakmate-voice") || ""
  );

  // =========================================================
  // LOAD BROWSER VOICES
  // =========================================================

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis
        .getVoices()
        .filter((voice) =>
          voice.lang?.toLowerCase().startsWith("en")
        );

      setAvailableVoices(voices);

      /*
       * If the user has never selected a voice,
       * choose a reasonable English default.
       */
      if (!selectedVoice && voices.length > 0) {
        const defaultVoice =
          voices.find((voice) => voice.default) ||
          voices[0];

        setSelectedVoice(defaultVoice.name);

        localStorage.setItem(
          "speakmate-voice",
          defaultVoice.name
        );
      }
    };

    loadVoices();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      loadVoices
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        loadVoices
      );
    };
  }, []);

  // =========================================================
  // CHANGE VOICE
  // =========================================================

  const handleVoiceChange = (event) => {
    const voiceName = event.target.value;

    setSelectedVoice(voiceName);

    localStorage.setItem(
      "speakmate-voice",
      voiceName
    );
  };

  // =========================================================
  // PREVIEW VOICE
  // =========================================================

  const handlePreviewVoice = () => {
    if (!("speechSynthesis" in window)) {
      toast.error(
        "Text-to-speech is not supported in this browser."
      );
      return;
    }

    const voice = availableVoices.find(
      (item) => item.name === selectedVoice
    );

    if (!voice) {
      toast.error("Please select a voice.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      "Hello! I'm your SpeakMate practice partner. Let's improve your English together."
    );

    utterance.voice = voice;
    utterance.lang = voice.lang;

    window.speechSynthesis.speak(utterance);
  };

  // =========================================================
  // PROFILE
  // =========================================================

  const verified = isEmailVerified(
    profile?.emailVerified
  );

  const handleLogout = () => {
    window.speechSynthesis?.cancel();
    localStorage.removeItem(
      `speakmate_dashboard_analytics_${userId}`
    );
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <PulseGridLoader />
      </div>
    );
  }

  const profileFields = [
    {
      label: "Email",
      value: profile?.email,
      icon: Mail,
    },
    {
      label: "Mobile Number",
      value: profile?.mobileNumber,
      icon: Phone,
    },
    {
      label: "Country",
      value: profile?.country,
      icon: Globe2,
    },
    {
      label: "Education",
      value: profile?.highestEducation,
      icon: GraduationCap,
    },
    {
      label: "Occupation",
      value: profile?.currentOccupation,
      icon: BriefcaseBusiness,
    },
  ].filter((item) => item.value);

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section>
        <p className="text-sm font-semibold text-sky-500">
          Your Account
        </p>

        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Settings
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Manage your profile and personalize your
          SpeakMate experience.
        </p>
      </section>

      {profileError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
          {profileError}
        </div>
      )}

      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        <div className="relative overflow-hidden px-5 py-6 sm:px-7">

          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-sky-100 blur-3xl dark:bg-sky-950/40" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
              <User size={30} />
            </div>

            <div className="min-w-0 flex-1">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="truncate text-xl font-bold text-slate-900 dark:text-white">
                  {profile?.name ||
                    profile?.username ||
                    "SpeakMate User"}
                </h2>

                {verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <ShieldCheck size={13} />
                    Verified
                  </span>
                )}

              </div>

              {profile?.username && (
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  @{profile.username}
                </p>
              )}

              {profile?.email && (
                <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                  {profile.email}
                </p>
              )}

            </div>
          </div>
        </div>

        {/* PROFILE INFORMATION */}

        <div className="border-t border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-7">

          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Profile Information
          </h3>

          <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">

            {profileFields.map(
              ({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex min-w-0 items-start gap-3"
                >

                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-medium text-slate-400">
                      {label}
                    </p>

                    <p className="mt-0.5 break-words text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {value}
                    </p>

                  </div>
                </div>
              )
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          APPEARANCE
      ===================================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Appearance
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Choose the interface that feels most
            comfortable.
          </p>

        </div>

        <div className="grid gap-3 sm:grid-cols-2">

          {/* LIGHT */}

          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${theme === "light"
              ? "border-sky-400 bg-sky-50 ring-2 ring-sky-500/10 dark:bg-sky-950/20"
              : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              }`}
          >

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-950/30">
              <Sun size={21} />
            </div>

            <div>

              <p className="font-semibold text-slate-900 dark:text-white">
                Light Mode
              </p>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Bright and clean interface
              </p>

            </div>

            <div
              className={`ml-auto h-4 w-4 rounded-full border-2 ${theme === "light"
                ? "border-sky-500 bg-sky-500 ring-4 ring-sky-500/10"
                : "border-slate-300 dark:border-slate-600"
                }`}
            />

          </button>

          {/* DARK */}

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${theme === "dark"
              ? "border-sky-400 bg-sky-50 ring-2 ring-sky-500/10 dark:bg-sky-950/20"
              : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              }`}
          >

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-400">
              <Moon size={21} />
            </div>

            <div>

              <p className="font-semibold text-slate-900 dark:text-white">
                Dark Mode
              </p>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Comfortable for low-light
                environments
              </p>

            </div>

            <div
              className={`ml-auto h-4 w-4 rounded-full border-2 ${theme === "dark"
                ? "border-sky-500 bg-sky-500 ring-4 ring-sky-500/10"
                : "border-slate-300 dark:border-slate-600"
                }`}
            />

          </button>

        </div>
      </section>

      {/* =====================================================
          VOICE & SPEECH
      ===================================================== */}

      <section>

        <div className="mb-4">

          <div className="flex items-center gap-2">

            <Volume2
              size={19}
              className="text-sky-500"
            />

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Voice & Speech
            </h2>

          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Choose the voice SpeakMate uses when
            speaking questions and messages.
          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

            {/* VOICE SELECT */}

            <label className="min-w-0 flex-1">

              <span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                AI Speaking Voice
              </span>

              <select
                value={selectedVoice}
                onChange={handleVoiceChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >

                {availableVoices.length === 0 && (
                  <option value="">
                    No English voices available
                  </option>
                )}

                {availableVoices.map((voice) => (
                  <option
                    key={`${voice.name}-${voice.lang}`}
                    value={voice.name}
                  >
                    {voice.name} ({voice.lang})
                  </option>
                ))}

              </select>

            </label>

            {/* PREVIEW */}

            <button
              type="button"
              onClick={handlePreviewVoice}
              disabled={
                !selectedVoice ||
                availableVoices.length === 0
              }
              className="inline-flex min-h-[46px] shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play size={16} />
              Preview Voice
            </button>

          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Available voices depend on your browser
            and device. Preview a voice before
            selecting the one you prefer.
          </p>

        </div>
      </section>

      {/* =====================================================
          PRACTICE OVERVIEW
      ===================================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Practice Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A quick look at your SpeakMate journey.
          </p>

        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <div className="rounded-xl bg-slate-100/80 p-4 dark:bg-slate-900">

            <BarChart3
              size={18}
              className="mb-3 text-sky-500"
            />

            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {analytics?.totalSessions ?? 0}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Sessions
            </p>

          </div>

          <div className="rounded-xl bg-slate-100/80 p-4 dark:bg-slate-900">

            <MessageSquare
              size={18}
              className="mb-3 text-sky-500"
            />

            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {analytics?.totalConversations ?? 0}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Conversations
            </p>

          </div>

          <div className="rounded-xl bg-slate-100/80 p-4 dark:bg-slate-900">

            <Calendar
              size={18}
              className="mb-3 text-sky-500"
            />

            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {analytics?.totalPracticeDays ?? 0}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Practice Days
            </p>

          </div>

          <div className="rounded-xl bg-slate-100/80 p-4 dark:bg-slate-900">

            <Flame
              size={18}
              className="mb-3 text-orange-500"
            />

            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {analytics?.currentStreak ?? 0}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Day Streak
            </p>

          </div>

        </div>

        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">

          <span className="inline-flex items-center gap-1.5">

            <Trophy
              size={15}
              className="text-amber-500"
            />

            Longest streak:

            <strong className="text-slate-700 dark:text-slate-200">
              {analytics?.longestStreak ?? 0} days
            </strong>

          </span>

        </div>
      </section>

      {/* =====================================================
          ACCOUNT
      ===================================================== */}

      <section className="border-t border-slate-200 pt-6 dark:border-slate-800">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="font-bold text-slate-900 dark:text-white">
              Account
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Sign out of your SpeakMate account on
              this device.
            </p>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/30 sm:self-auto"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>
      </section>

    </div>
  );
};