import {
  ArrowLeft,
  Download,
  FileText,
  History,
  Mic2,
  PlayCircle,
  Sparkles,
  Trophy,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

import {
  Button,
  Loader,
} from "../../components/common/UI";

import { tongueTwisterService } from "../../services/tongueTwisterService";
import { getErrorMessage } from "../../utils/errorMessages";

const formatDate = (value) => {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  } catch {
    return value;
  }
};

const isValidSessionId = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return false;
  }

  return /^\d+$/.test(String(value).trim());
};

export const TongueTwisterHome = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);

      try {
        const [statsData, historyData] =
          await Promise.all([
            tongueTwisterService.getStats(),
            tongueTwisterService.getHistory(),
          ]);

        if (!isMounted) return;

        setStats(
          statsData &&
            typeof statsData === "object"
            ? statsData
            : null
        );

        setHistory(
          Array.isArray(historyData)
            ? historyData
            : []
        );
      } catch (error) {
        if (isMounted) {
          toast.error(
            getErrorMessage(error)
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================================================
  // BACK TO DASHBOARD
  // =========================================================

  const handleBack = () => {
    navigate("/dashboard");
  };

  // =========================================================
  // START SESSION
  // =========================================================

  const handleStartSession = async () => {
    if (starting) return;

    setStarting(true);

    try {
      const session =
        await tongueTwisterService.start();

      const sessionId =
        session?.sessionId ?? null;

      if (!isValidSessionId(sessionId)) {
        console.error(
          "Invalid Tongue Twister session returned:",
          session
        );

        toast.error(
          "Unable to start Tongue Twister session."
        );

        return;
      }

      navigate(
        `/tongue-twister/session/${String(
          sessionId
        )}`,
        {
          state: {
            session,
          },
        }
      );
    } catch (error) {
      console.error(
        "Tongue Twister start error:",
        error
      );

      toast.error(
        getErrorMessage(error)
      );
    } finally {
      setStarting(false);
    }
  };

  // =========================================================
  // FRONTEND PDF
  // =========================================================

  const handleDownload = async () => {
    if (
      downloading ||
      history.length === 0
    ) {
      return;
    }

    setDownloading(true);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const margin = 18;
      const contentWidth =
        pageWidth - margin * 2;

      let y = 0;

      // =========================================================
      // COLORS
      // =========================================================

      const COLORS = {
        background: [247, 250, 253],
        white: [255, 255, 255],

        navy: [15, 23, 42],
        darkText: [30, 41, 59],
        bodyText: [51, 65, 85],

        muted: [100, 116, 139],

        primary: [14, 165, 233],
        primaryDark: [2, 132, 199],

        softBlue: [224, 242, 254],

        border: [226, 232, 240],
      };

      // =========================================================
      // NORMALIZE PASSAGE TEXT
      // =========================================================

      const cleanPassage = (text) => {
        if (!text) return "";

        return String(text)
          // Remove unusual zero-width characters
          .replace(/[\u200B-\u200D\uFEFF]/g, "")
          // Convert tabs/new lines to spaces
          .replace(/\s+/g, " ")
          // Remove spaces before punctuation
          .replace(/\s+([,.!?;:])/g, "$1")
          .trim();
      };

      // =========================================================
      // DRAW PAGE BACKGROUND
      // =========================================================

      const drawBackground = () => {
        pdf.setFillColor(
          ...COLORS.background
        );

        pdf.rect(
          0,
          0,
          pageWidth,
          pageHeight,
          "F"
        );

        // Very subtle top accent
        pdf.setFillColor(
          ...COLORS.primary
        );

        pdf.rect(
          0,
          0,
          pageWidth,
          2.5,
          "F"
        );
      };

      // =========================================================
      // DRAW FIRST PAGE HEADER
      // =========================================================

      const drawFirstPageHeader = () => {
        drawBackground();

        // -------------------------------------------------------
        // BRAND
        // -------------------------------------------------------

        pdf.setFillColor(
          ...COLORS.white
        );

        pdf.roundedRect(
          margin,
          10,
          contentWidth,
          45,
          4,
          4,
          "F"
        );

        // Accent bar
        pdf.setFillColor(
          ...COLORS.primary
        );

        pdf.roundedRect(
          margin + 7,
          17,
          2.5,
          10,
          1.2,
          1.2,
          "F"
        );

        // PrepFriend
        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setFontSize(21);

        pdf.setTextColor(
          ...COLORS.navy
        );

        pdf.text(
          "PrepFriend",
          margin + 14,
          23
        );

        // Tagline
        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(8.5);

        pdf.setTextColor(
          ...COLORS.muted
        );

        pdf.text(
          "Practice. Improve. Succeed.",
          margin + 14,
          29
        );

        // Category
        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setFontSize(7.5);

        pdf.setTextColor(
          ...COLORS.primaryDark
        );

        pdf.text(
          "SPEAKING PRACTICE",
          pageWidth - margin - 7,
          23,
          {
            align: "right",
          }
        );

        // -------------------------------------------------------
        // TITLE
        // -------------------------------------------------------

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setFontSize(16);

        pdf.setTextColor(
          ...COLORS.navy
        );

        pdf.text(
          "Tongue Twister Practice History",
          margin + 7,
          43
        );

        // Total passages
        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(8.5);

        pdf.setTextColor(
          ...COLORS.muted
        );

        pdf.text(
          `${history.length} passages`,
          pageWidth - margin - 7,
          43,
          {
            align: "right",
          }
        );

        y = 67;
      };

      // =========================================================
      // DRAW NORMAL PAGE HEADER
      // =========================================================

      const drawContinuationHeader = () => {
        drawBackground();

        pdf.setFillColor(
          ...COLORS.white
        );

        pdf.roundedRect(
          margin,
          9,
          contentWidth,
          18,
          4,
          4,
          "F"
        );

        pdf.setFillColor(
          ...COLORS.primary
        );

        pdf.roundedRect(
          margin + 7,
          14,
          2.5,
          8,
          1.2,
          1.2,
          "F"
        );

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setFontSize(11);

        pdf.setTextColor(
          ...COLORS.navy
        );

        pdf.text(
          "PrepFriend",
          margin + 14,
          20
        );

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(8);

        pdf.setTextColor(
          ...COLORS.muted
        );

        pdf.text(
          "Tongue Twister Practice History",
          pageWidth - margin - 7,
          20,
          {
            align: "right",
          }
        );

        y = 39;
      };

      // =========================================================
      // FOOTER
      // =========================================================

      const drawFooter = (
        pageNumber,
        totalPages
      ) => {
        pdf.setDrawColor(
          ...COLORS.border
        );

        pdf.setLineWidth(0.25);

        pdf.line(
          margin,
          pageHeight - 17,
          pageWidth - margin,
          pageHeight - 17
        );

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(7.5);

        pdf.setTextColor(
          ...COLORS.muted
        );

        pdf.text(
          "PrepFriend  •  Tongue Twister Practice",
          margin,
          pageHeight - 10
        );

        pdf.text(
          `Page ${pageNumber} of ${totalPages}`,
          pageWidth - margin,
          pageHeight - 10,
          {
            align: "right",
          }
        );
      };

      // =========================================================
      // START FIRST PAGE
      // =========================================================

      drawFirstPageHeader();

      // =========================================================
      // PASSAGES
      // =========================================================

      history.forEach(
        (item, index) => {
          const passage =
            cleanPassage(item?.passage);

          if (!passage) {
            return;
          }

          const wordCount =
            item?.wordCount ??
            passage
              .split(/\s+/)
              .filter(Boolean)
              .length;

          const date =
            formatDate(
              item?.createdAt
            );

          // -----------------------------------------------------
          // WRAP PASSAGE
          // -----------------------------------------------------

          const wrappedText =
            pdf.splitTextToSize(
              passage,
              contentWidth - 12
            );

          const lineHeight = 5.1;

          // Space required by heading + passage
          const passageTextHeight =
            wrappedText.length *
            lineHeight;

          const headingHeight = 15;

          const bottomSpace = 12;

          const requiredHeight =
            headingHeight +
            passageTextHeight +
            bottomSpace;

          // -----------------------------------------------------
          // CREATE NEW PAGE IF REQUIRED
          // -----------------------------------------------------

          if (
            y + requiredHeight >
            pageHeight - 24
          ) {
            pdf.addPage();

            drawContinuationHeader();
          }

          // -----------------------------------------------------
          // PASSAGE ACCENT
          // -----------------------------------------------------

          pdf.setFillColor(
            ...COLORS.primary
          );

          pdf.roundedRect(
            margin,
            y,
            2.5,
            12,
            1.2,
            1.2,
            "F"
          );

          // -----------------------------------------------------
          // PASSAGE TITLE
          // -----------------------------------------------------

          pdf.setFont(
            "helvetica",
            "bold"
          );

          pdf.setFontSize(11.5);

          pdf.setTextColor(
            ...COLORS.primaryDark
          );

          pdf.text(
            `Passage ${history.length - index}`,
            margin + 8,
            y + 5
          );

          // -----------------------------------------------------
          // DATE + WORD COUNT
          // -----------------------------------------------------

          pdf.setFont(
            "helvetica",
            "normal"
          );

          pdf.setFontSize(8.5);

          pdf.setTextColor(
            ...COLORS.muted
          );

          pdf.text(
            `${wordCount} words  •  ${date}`,
            margin + 8,
            y + 10
          );

          y += 17;

          // -----------------------------------------------------
          // PASSAGE BODY
          // -----------------------------------------------------

          pdf.setFont(
            "helvetica",
            "normal"
          );

          pdf.setFontSize(10.3);

          pdf.setTextColor(
            ...COLORS.bodyText
          );

          /*
           * IMPORTANT:
           *
           * We write every wrapped line separately.
           * This prevents strange spacing and gives us
           * exact control over vertical positioning.
           */

          wrappedText.forEach((line) => {
            pdf.text(line, margin + 8, y);
            y += lineHeight;
          });

          // -----------------------------------------------------
          // DIVIDER
          // -----------------------------------------------------

          y += 5;

          pdf.setDrawColor(
            ...COLORS.border
          );

          pdf.setLineWidth(0.25);

          pdf.line(
            margin + 8,
            y,
            pageWidth - margin,
            y
          );

          y += 10;
        }
      );

      // =========================================================
      // ADD FOOTERS
      // =========================================================

      const totalPages =
        pdf.internal.getNumberOfPages();

      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {
        pdf.setPage(page);

        drawFooter(
          page,
          totalPages
        );
      }

      // =========================================================
      // DOWNLOAD
      // =========================================================

      pdf.save(
        "prepfriend-tongue-twister-history.pdf"
      );

      toast.success(
        "History PDF downloaded successfully."
      );
    } catch (error) {
      console.error(
        "Tongue Twister PDF error:",
        error
      );

      toast.error(
        "Unable to create PDF."
      );
    } finally {
      setDownloading(false);
    }
  };

  const completedSessions =
    stats?.completedSessions ?? 0;

  const totalSessions =
    stats?.totalSessions ?? 0;

  const totalPassages =
    stats?.totalPassages ?? 0;

  return (
    <div className="space-y-5">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="rounded-2xl border border-slate-200/80 bg-transparent px-6 py-5 dark:border-slate-800">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT CONTENT */}

          <div className="max-w-3xl">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">

                <Mic2
                  className="h-5 w-5 text-primary"
                />

              </div>

              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                Tongue Twister
              </span>

            </div>

            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Train your pronunciation
            </h2>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Challenge yourself with difficult
              English passages designed to improve
              pronunciation, clarity, fluency, and
              speaking confidence.
            </p>

          </div>

          {/* RIGHT */}

          <div className="flex min-w-[200px] flex-col gap-1">

            <button
              type="button"
              onClick={handleBack}
              className="flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>

            <Button
              onClick={handleStartSession}
              disabled={starting}
              className="w-full"
            >
              {starting ? (
                <Loader />
              ) : (
                <span className="flex items-center gap-2">
                  <PlayCircle size={17} />
                  Start Practice
                </span>
              )}
            </Button>

          </div>

        </div>

      </section>

      {/* =====================================================
          STATISTICS
      ===================================================== */}

      {loading ? (

        <div className="flex h-24 items-center justify-center">

          <Loader />

        </div>

      ) : (

        <section className="grid grid-cols-1 divide-y divide-slate-200 dark:divide-slate-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

          {/* COMPLETED */}

          <div className="flex items-center gap-3 px-3 py-3 first:pl-0 sm:py-2">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">

              <Trophy
                className="h-5 w-5 text-primary"
              />

            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {completedSessions}
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Completed Twisters
              </p>
            </div>

          </div>

          {/* SESSIONS */}

          <div className="flex items-center gap-3 px-3 py-3 sm:py-2">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">

              <Sparkles
                className="h-5 w-5 text-emerald-500"
              />

            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {totalSessions}
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Sessions
              </p>
            </div>

          </div>

          {/* PASSAGES */}

          <div className="flex items-center gap-3 px-3 py-3 last:pr-0 sm:py-2">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">

              <FileText
                className="h-5 w-5 text-blue-500"
              />

            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {totalPassages}
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Passages Practiced
              </p>
            </div>

          </div>

        </section>

      )}

      {/* =====================================================
          HISTORY
      ===================================================== */}

      <section>

        {/* HISTORY HEADER */}

        <div className="mb-3 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <History
              className="h-5 w-5 text-primary"
            />

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Passage History
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your previous tongue twister practice
              </p>
            </div>

          </div>

          <Button
            variant="secondary"
            onClick={handleDownload}
            disabled={
              downloading ||
              history.length === 0
            }
            className="shrink-0"
          >
            {downloading ? (
              <Loader />
            ) : (
              <span className="flex items-center gap-2">
                <Download size={16} />
                <span className="hidden sm:inline">
                  Download PDF
                </span>
                <span className="sm:hidden">
                  PDF
                </span>
              </span>
            )}
          </Button>

        </div>

        {/* ===================================================
            HISTORY SCROLL WINDOW
        =================================================== */}

        {history.length === 0 ? (

          <div className="rounded-xl border border-dashed border-slate-300 px-5 py-6 dark:border-slate-700">

            <p className="font-medium text-slate-700 dark:text-slate-200">
              No tongue twisters yet
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Start your first practice session
              to generate your first passage.
            </p>

          </div>

        ) : (

          <div
            className="
              h-[390px]
              overflow-y-auto
              rounded-xl
              border
              border-slate-200
              bg-white/30
              pr-1
              shadow-inner
              dark:border-slate-800
              dark:bg-slate-950/20

              scrollbar-thin
              scrollbar-thumb-slate-300
              scrollbar-track-transparent

              dark:scrollbar-thumb-slate-700
            "
          >

            <div className="divide-y divide-slate-200 dark:divide-slate-800">

              {history.map(
                (item, index) => (

                  <article
                    key={
                      item.passageId ??
                      `${item.createdAt}-${index}`
                    }
                    className="
                      min-h-[130px]
                      px-5
                      py-4
                      transition
                      hover:bg-slate-50/70
                      dark:hover:bg-slate-900/40
                    "
                  >

                    {/* META */}

                    <div className="flex items-center justify-between gap-3">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="text-xs font-bold uppercase tracking-wide text-primary">
                          Passage{" "}
                          {history.length - index}
                        </span>

                        <span className="text-xs text-slate-300 dark:text-slate-700">
                          •
                        </span>

                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {item.wordCount ?? 0} words
                        </span>

                        <span className="text-xs text-slate-300 dark:text-slate-700">
                          •
                        </span>

                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(
                            item.createdAt
                          )}
                        </span>

                      </div>

                    </div>

                    {/* PASSAGE */}

                    <p className="mt-2 max-w-6xl text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {item.passage}
                    </p>

                  </article>

                )
              )}

            </div>

          </div>

        )}

        {/* SCROLL HINT */}

        {history.length > 3 && (
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Scroll inside the history to view more passages
          </p>
        )}

      </section>

    </div>
  );
};