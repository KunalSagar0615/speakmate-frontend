import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  Button,
  Card,
  Loader,
} from "../../components/common/UI";

import {
  tongueTwisterService,
} from "../../services/tongueTwisterService";

import {
  getErrorMessage,
} from "../../utils/errorMessages";

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

const formatTime = (seconds) => {
  const safeSeconds = Math.max(
    0,
    Number(seconds) || 0
  );

  const minutes = Math.floor(
    safeSeconds / 60
  );

  const remainingSeconds =
    safeSeconds % 60;

  return `${String(minutes).padStart(
    2,
    "0"
  )}:${String(remainingSeconds).padStart(
    2,
    "0"
  )}`;
};

export const TongueTwisterSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = useParams();

  const [session, setSession] =
    useState(
      location.state?.session ?? null
    );

  const [passage, setPassage] =
    useState(
      location.state?.session?.passage ?? ""
    );

  const [passageId, setPassageId] =
    useState(
      location.state?.session?.passageId ??
        null
    );

  const [wordCount, setWordCount] =
    useState(
      location.state?.session?.wordCount ??
        0
    );

  const [loading, setLoading] =
    useState(!passage);

  const [generating, setGenerating] =
    useState(false);

  const [ending, setEnding] =
    useState(false);

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  const [scrollProgress, setScrollProgress] =
    useState(0);

  const animationFrameRef =
    useRef(null);

  const lastTimestampRef =
    useRef(null);

  const movementRef =
    useRef(0);

  // =========================================================
  // WORDS
  // =========================================================

  const words = useMemo(() => {
    if (!passage) {
      return [];
    }

    return passage
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }, [passage]);

  const resolvedWordCount =
    wordCount || words.length;

  // =========================================================
  // FOUR WORDS PER ROW
  // =========================================================

  const rows = useMemo(() => {
    const result = [];

    for (
      let index = 0;
      index < words.length;
      index += 4
    ) {
      result.push(
        words.slice(
          index,
          index + 4
        )
      );
    }

    return result;
  }, [words]);

  // =========================================================
  // SESSION VALIDATION
  // =========================================================

  useEffect(() => {
    if (!isValidSessionId(sessionId)) {
      toast.error(
        "Invalid Tongue Twister session ID."
      );

      navigate(
        "/tongue-twister",
        { replace: true }
      );
    }
  }, [
    sessionId,
    navigate,
  ]);

  // =========================================================
  // LOAD SESSION
  // =========================================================

  useEffect(() => {
    if (
      passage ||
      !isValidSessionId(sessionId)
    ) {
      return;
    }

    let mounted = true;

    const loadSession = async () => {
      setLoading(true);

      try {
        const response =
          await tongueTwisterService.start();

        if (!mounted) {
          return;
        }

        if (
          response?.sessionId === null ||
          response?.sessionId === undefined
        ) {
          throw new Error(
            "Invalid Tongue Twister session returned."
          );
        }

        setSession(response);

        setPassage(
          response.passage || ""
        );

        setPassageId(
          response.passageId ?? null
        );

        setWordCount(
          response.wordCount ?? 0
        );
      } catch (error) {
        if (!mounted) {
          return;
        }

        console.error(
          "Tongue Twister session load error:",
          error
        );

        toast.error(
          getErrorMessage(error)
        );

        navigate(
          "/tongue-twister",
          { replace: true }
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, [
    sessionId,
    passage,
    navigate,
  ]);

  // =========================================================
  // TIMER
  // =========================================================

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        setElapsedSeconds(
          (previous) =>
            previous + 1
        );
      }, 1000);

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, []);

  // =========================================================
  // PASSAGE MOVEMENT
  //
  // ONLY 4 ROWS ARE VISIBLE.
  //
  // First row starts at the bottom.
  //
  // Example:
  //
  // |                    |
  // |                    |
  // |                    |
  // | First line         |
  // |____________________|
  //
  // At the end:
  //
  // | Last line          |
  // |                    |
  // |                    |
  // |                    |
  // |____________________|
  //
  // =========================================================

  useEffect(() => {
    if (
      !passage ||
      loading ||
      rows.length === 0
    ) {
      return;
    }

    /*
     * Height of one text row.
     */
    const ROW_HEIGHT = 56;

    /*
     * IMPORTANT:
     * Only FOUR rows are visible now.
     */
    const VISIBLE_ROWS = 4;

    /*
     * First line starts in the
     * bottom row.
     *
     * 4 rows visible means:
     *
     * 3 row spaces before first line.
     */
    const INITIAL_OFFSET =
      (VISIBLE_ROWS - 1) *
      ROW_HEIGHT;

    /*
     * Distance required to move
     * the final row to the very top.
     */
    const TOTAL_DISTANCE =
      INITIAL_OFFSET +
      Math.max(
        0,
        rows.length - 1
      ) *
        ROW_HEIGHT;

    /*
     * Reading speed.
     */
    const SCROLL_SPEED = 22;

    movementRef.current = 0;
    lastTimestampRef.current =
      null;

    setScrollProgress(0);

    const animate = (timestamp) => {
      if (
        lastTimestampRef.current ===
        null
      ) {
        lastTimestampRef.current =
          timestamp;
      }

      const delta =
        timestamp -
        lastTimestampRef.current;

      lastTimestampRef.current =
        timestamp;

      movementRef.current +=
        (delta / 1000) *
        SCROLL_SPEED;

      /*
       * Exact ending position.
       */
      if (
        movementRef.current >=
        TOTAL_DISTANCE
      ) {
        movementRef.current =
          TOTAL_DISTANCE;

        setScrollProgress(100);

        return;
      }

      /*
       * Progress and movement use
       * EXACTLY the same distance.
       */
      const percentage =
        (movementRef.current /
          TOTAL_DISTANCE) *
        100;

      setScrollProgress(
        Math.min(
          100,
          Math.max(
            0,
            percentage
          )
        )
      );

      animationFrameRef.current =
        window.requestAnimationFrame(
          animate
        );
    };

    animationFrameRef.current =
      window.requestAnimationFrame(
        animate
      );

    return () => {
      if (
        animationFrameRef.current
      ) {
        window.cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      animationFrameRef.current =
        null;

      lastTimestampRef.current =
        null;
    };
  }, [
    passage,
    loading,
    rows.length,
  ]);

  // =========================================================
  // TRANSLATION
  // =========================================================

  const ROW_HEIGHT = 56;

  /*
   * Four visible rows means the
   * first row starts 3 rows down.
   */
  const INITIAL_OFFSET =
    3 * ROW_HEIGHT;

  const translateY =
    INITIAL_OFFSET -
    movementRef.current;

  // =========================================================
  // REPEAT
  // =========================================================

  const handleRepeat = () => {
    /*
     * Cancel current animation.
     */
    if (
      animationFrameRef.current
    ) {
      window.cancelAnimationFrame(
        animationFrameRef.current
      );
    }

    animationFrameRef.current =
      null;

    /*
     * Reset passage position.
     */
    movementRef.current = 0;

    lastTimestampRef.current =
      null;

    /*
     * Reset progress.
     */
    setScrollProgress(0);

    /*
     * Reset timer.
     */
    setElapsedSeconds(0);

    /*
     * Changing passage to the same
     * value does not trigger the effect,
     * so force a tiny state cycle by
     * changing progress first and
     * starting a fresh animation frame.
     */

    window.requestAnimationFrame(() => {
      const ROW_HEIGHT = 56;
      const VISIBLE_ROWS = 4;

      const INITIAL_OFFSET =
        (VISIBLE_ROWS - 1) *
        ROW_HEIGHT;

      const TOTAL_DISTANCE =
        INITIAL_OFFSET +
        Math.max(
          0,
          rows.length - 1
        ) *
          ROW_HEIGHT;

      const SCROLL_SPEED = 22;

      const startTime =
        performance.now();

      const animateRepeat = (
        timestamp
      ) => {
        const elapsed =
          timestamp -
          startTime;

        movementRef.current =
          Math.min(
            TOTAL_DISTANCE,
            (elapsed / 1000) *
              SCROLL_SPEED
          );

        const percentage =
          (movementRef.current /
            TOTAL_DISTANCE) *
          100;

        setScrollProgress(
          Math.min(
            100,
            percentage
          )
        );

        if (
          movementRef.current >=
          TOTAL_DISTANCE
        ) {
          setScrollProgress(100);

          return;
        }

        animationFrameRef.current =
          window.requestAnimationFrame(
            animateRepeat
          );
      };

      animationFrameRef.current =
        window.requestAnimationFrame(
          animateRepeat
        );
    });
  };

  // =========================================================
  // CREATE NEW
  // =========================================================

  const handleCreateNew = async () => {
    if (
      generating ||
      ending ||
      !isValidSessionId(sessionId)
    ) {
      return;
    }

    /*
     * Stop current animation.
     */
    if (
      animationFrameRef.current
    ) {
      window.cancelAnimationFrame(
        animationFrameRef.current
      );
    }

    animationFrameRef.current =
      null;

    setGenerating(true);

    try {
      const response =
        await tongueTwisterService.generate(
          sessionId
        );

      if (
        !response?.passage
      ) {
        throw new Error(
          "No new tongue twister passage was returned."
        );
      }

      setSession(response);

      setPassage(
        response.passage
      );

      setPassageId(
        response.passageId ?? null
      );

      setWordCount(
        response.wordCount ?? 0
      );

      /*
       * Reset reading position.
       */
      movementRef.current = 0;

      lastTimestampRef.current =
        null;

      setScrollProgress(0);

      setElapsedSeconds(0);

      toast.success(
        "New tongue twister created."
      );
    } catch (error) {
      console.error(
        "Create New Tongue Twister error:",
        error
      );

      toast.error(
        getErrorMessage(error)
      );
    } finally {
      setGenerating(false);
    }
  };

  // =========================================================
  // EXIT SESSION
  // =========================================================

  const handleExitSession = async () => {
    if (
      ending ||
      generating ||
      !isValidSessionId(sessionId)
    ) {
      return;
    }

    /*
     * Stop animation immediately.
     */
    if (
      animationFrameRef.current
    ) {
      window.cancelAnimationFrame(
        animationFrameRef.current
      );
    }

    animationFrameRef.current =
      null;

    setEnding(true);

    try {
      await tongueTwisterService.end(
        sessionId
      );

      toast.success(
        "Tongue Twister session completed."
      );

      navigate(
        "/tongue-twister",
        { replace: true }
      );
    } catch (error) {
      console.error(
        "Exit Tongue Twister session error:",
        error
      );

      toast.error(
        getErrorMessage(error)
      );
    } finally {
      setEnding(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center overflow-hidden">
        <Loader />
      </div>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div className="h-[calc(100vh-80px)] w-full overflow-hidden">

      <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-3 px-3 py-3 sm:px-4">

        {/* ===================================================
            HEADER
            =================================================== */}

        <Card className="shrink-0 py-3">

          <div className="flex items-center justify-between">

            {/* LEFT */}

            <div className="flex min-w-0 items-center gap-2 sm:gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/tongue-twister"
                  )
                }
                disabled={
                  generating ||
                  ending
                }
                className="shrink-0 rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Back"
              >
                <ArrowLeft
                  size={20}
                />
              </button>

              <Sparkles
                size={18}
                className="shrink-0 text-primary"
              />

              <span className="truncate text-base font-bold uppercase tracking-wide text-primary sm:text-lg">
                TONGUE TWISTER
              </span>

            </div>

            {/* RIGHT */}

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">

              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">

                <Clock3
                  size={16}
                />

                <span>
                  {formatTime(
                    elapsedSeconds
                  )}
                </span>

              </div>

              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary sm:px-3">
                {resolvedWordCount} words
              </span>

            </div>

          </div>

          {/* PROGRESS */}

          <div className="mt-2">

            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-sky-400 transition-none"
                style={{
                  width: `${scrollProgress}%`,
                }}
              />

            </div>

            <div className="mt-1 flex justify-end">

              <span className="text-xs text-slate-400">
                {Math.round(
                  scrollProgress
                )}%
              </span>

            </div>

          </div>

        </Card>

        {/* ===================================================
            PASSAGE
            =================================================== */}

        <Card className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4">

          <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">

            {/* TOP FADE */}

            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-14 bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent dark:from-slate-950 dark:via-slate-950/80" />

            {/* BOTTOM FADE */}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-14 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent dark:from-slate-950 dark:via-slate-950/80" />

            {/* FOUR ROW VIEWPORT */}

            <div className="relative h-full overflow-hidden">

              <div
                className="absolute left-0 right-0 top-0 mx-auto w-full max-w-3xl will-change-transform"
                style={{
                  transform: `translateY(${translateY}px)`,
                }}
              >

                {rows.map(
                  (
                    row,
                    rowIndex
                  ) => (

                    <div
                      key={`${passageId ?? "passage"}-row-${rowIndex}`}
                      className="flex h-[56px] items-center justify-center whitespace-nowrap text-center text-base font-semibold tracking-wide text-slate-800 dark:text-slate-100 sm:text-xl"
                    >

                      <span className="inline-flex items-center justify-center gap-x-2 sm:gap-x-3">

                        {row.map(
                          (
                            word,
                            wordIndex
                          ) => (

                            <span
                              key={`${passageId ?? "passage"}-${rowIndex}-${wordIndex}`}
                              className="inline-block"
                            >
                              {word}
                            </span>

                          )
                        )}

                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </Card>

        {/* ===================================================
            BUTTONS
            =================================================== */}

        <Card className="shrink-0 py-3">

          <div className="flex items-center justify-center gap-2 sm:gap-3">

            {/* REPEAT */}

            <Button
              variant="secondary"
              onClick={handleRepeat}
              disabled={
                generating ||
                ending ||
                !passage
              }
              className="px-3 sm:px-4"
            >

              <span className="flex items-center gap-1.5">

                <RefreshCw
                  size={16}
                />

                <span>
                  Repeat
                </span>

              </span>

            </Button>

            {/* CREATE NEW */}

            <Button
              onClick={handleCreateNew}
              disabled={
                generating ||
                ending
              }
              className="px-3 sm:px-4"
            >

              {generating ? (
                <Loader />
              ) : (
                <span className="flex items-center gap-1.5">

                  <Sparkles
                    size={16}
                  />

                  <span>
                    Create New
                  </span>

                </span>
              )}

            </Button>

            {/* EXIT */}

            <Button
              variant="danger"
              onClick={handleExitSession}
              disabled={
                generating ||
                ending
              }
              className="px-3 sm:px-4"
            >

              {ending ? (
                <Loader />
              ) : (
                <span className="flex items-center gap-1.5">

                  <X
                    size={16}
                  />

                  <span>
                    Exit Session
                  </span>

                </span>
              )}

            </Button>

          </div>

        </Card>

        {/* ===================================================
            COMPLETION
            =================================================== */}

        {scrollProgress >= 100 && (
          <Card className="shrink-0 py-2.5">

            <div className="flex items-center justify-center gap-2 text-center">

              <CheckCircle2
                className="text-emerald-500"
                size={18}
              />

              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Great job! You reached the end
                of this tongue twister.
              </p>

            </div>

          </Card>
        )}

      </div>

    </div>
  );
};