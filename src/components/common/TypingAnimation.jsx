import { useEffect, useState } from "react";

const DEFAULT_PHRASES = ["SpeakMate AI Friend"];

export const TypingAnimation = ({ phrases = DEFAULT_PHRASES, className = "" }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex] || "";
    const typingSpeed = isDeleting ? 40 : 80;
    const pauseAtEnd = 1800;

    if (!isDeleting && displayText === current) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseAtEnd);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      return undefined;
    }

    const timeout = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex, phrases]);

  return (
    <span className={`inline-block min-h-[1.2em] ${className}`}>
      {displayText}
      <span className="ml-1 inline-block w-[3px] animate-pulse bg-current align-middle">&nbsp;</span>
    </span>
  );
};
