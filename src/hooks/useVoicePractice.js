import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

const VOICE_STORAGE_KEY = "speakmate-voice";

export const useVoicePractice = () => {
  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);

  const [transcript, setTranscript] =
    useState("");

  const [
    interimTranscript,
    setInterimTranscript,
  ] = useState("");

  const [listening, setListening] =
    useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // SPEECH RECOGNITION
  // =========================================================

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = "";
      let finalText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i += 1
      ) {
        const result =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += result;
        } else {
          interim += result;
        }
      }

      if (finalText) {
        setTranscript((prev) =>
          `${prev}${
            prev ? " " : ""
          }${finalText.trim()}`
        );

        setInterimTranscript("");
      } else {
        setInterimTranscript(interim);
      }

      setError("");
    };

    recognition.onerror = (event) => {
      listeningRef.current = false;
      setListening(false);

      if (event.error === "not-allowed") {
        setError(
          "Microphone permission denied. Please allow microphone access."
        );
      } else if (
        event.error === "no-speech"
      ) {
        setError(
          "No speech detected. Please try again."
        );
      } else if (
        event.error === "aborted"
      ) {
        setError("");
      } else {
        setError(
          "Speech recognition error. Please try again."
        );
      }
    };

    recognition.onend = () => {
      if (listeningRef.current) {
        try {
          recognition.start();
        } catch {
          listeningRef.current = false;
          setListening(false);
        }
      } else {
        setListening(false);
      }
    };

    recognitionRef.current =
      recognition;

    return () => {
      listeningRef.current = false;

      try {
        recognition.abort();
      } catch {
        // Ignore cleanup errors.
      }
    };
  }, []);

  // =========================================================
  // START LISTENING
  // =========================================================

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    if (listeningRef.current) return;

    setError("");

    listeningRef.current = true;
    setListening(true);

    try {
      recognitionRef.current.start();
    } catch {
      listeningRef.current = false;
      setListening(false);

      setError(
        "Could not start microphone. Please try again."
      );
    }
  }, []);

  // =========================================================
  // STOP LISTENING
  // =========================================================

  const stopListening = useCallback(() => {
    listeningRef.current = false;

    setListening(false);
    setInterimTranscript("");

    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignore stop errors.
    }
  }, []);

  // =========================================================
  // CLEAR TRANSCRIPT
  // =========================================================

  const clearTranscript =
    useCallback(() => {
      setTranscript("");
      setInterimTranscript("");
    }, []);

  // =========================================================
  // GET SELECTED VOICE
  // =========================================================

  const getSelectedVoice =
    useCallback(() => {
      if (
        !(
          "speechSynthesis" in window
        )
      ) {
        return null;
      }

      const voices =
        window.speechSynthesis.getVoices();

      if (!voices.length) {
        return null;
      }

      const savedVoiceName =
        localStorage.getItem(
          VOICE_STORAGE_KEY
        );

      /*
       * First preference:
       * exact voice selected in Settings.
       */
      if (savedVoiceName) {
        const savedVoice = voices.find(
          (voice) =>
            voice.name === savedVoiceName
        );

        if (savedVoice) {
          return savedVoice;
        }
      }

      /*
       * Second preference:
       * browser's default English voice.
       */
      const defaultEnglishVoice =
        voices.find(
          (voice) =>
            voice.default &&
            voice.lang
              ?.toLowerCase()
              .startsWith("en")
        );

      if (defaultEnglishVoice) {
        return defaultEnglishVoice;
      }

      /*
       * Third preference:
       * any English voice.
       */
      const englishVoice =
        voices.find((voice) =>
          voice.lang
            ?.toLowerCase()
            .startsWith("en")
        );

      return (
        englishVoice ||
        voices[0] ||
        null
      );
    }, []);

  // =========================================================
  // APPLY SELECTED VOICE
  // =========================================================

  const prepareUtterance =
    useCallback(
      (text) => {
        const utterance =
          new SpeechSynthesisUtterance(
            String(text)
          );

        const selectedVoice =
          getSelectedVoice();

        if (selectedVoice) {
          utterance.voice =
            selectedVoice;

          utterance.lang =
            selectedVoice.lang;
        } else {
          utterance.lang = "en-US";
        }

        /*
         * Keep speech natural.
         * We can later expose these in Settings
         * if you want speed/pitch controls.
         */
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        return utterance;
      },
      [getSelectedVoice]
    );

  // =========================================================
  // SPEAK SINGLE TEXT
  // =========================================================

  const speakText = useCallback(
    (text) => {
      if (
        !text ||
        !String(text).trim()
      ) {
        return;
      }

      if (
        !(
          "speechSynthesis" in window
        )
      ) {
        return;
      }

      window.speechSynthesis.cancel();

      const utterance =
        prepareUtterance(text);

      window.speechSynthesis.speak(
        utterance
      );
    },
    [prepareUtterance]
  );

  // =========================================================
  // SPEAK MULTIPLE TEXT PARTS
  // =========================================================

  const speakSequence = useCallback(
    (parts) => {
      if (
        !(
          "speechSynthesis" in window
        )
      ) {
        return;
      }

      const queue = (
        Array.isArray(parts)
          ? parts
          : []
      )
        .filter(
          (text) =>
            text &&
            String(text).trim()
        )
        .map((text) =>
          String(text).trim()
        );

      if (!queue.length) return;

      window.speechSynthesis.cancel();

      let index = 0;

      const speakNext = () => {
        if (index >= queue.length) {
          return;
        }

        const utterance =
          prepareUtterance(
            queue[index]
          );

        utterance.onend = () => {
          index += 1;
          speakNext();
        };

        utterance.onerror = () => {
          index += 1;
          speakNext();
        };

        window.speechSynthesis.speak(
          utterance
        );
      };

      speakNext();
    },
    [prepareUtterance]
  );

  // =========================================================
  // STOP SPEAKING
  // =========================================================

  const stopSpeaking =
    useCallback(() => {
      if (
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }
    }, []);

  // =========================================================
  // DISPLAY TRANSCRIPT
  // =========================================================

  const displayTranscript =
    `${transcript}${
      interimTranscript
        ? `${
            transcript ? " " : ""
          }${interimTranscript}`
        : ""
    }`;

  // =========================================================
  // RETURN
  // =========================================================

  return {
    transcript,
    interimTranscript,
    displayTranscript,

    listening,
    error,

    setTranscript,
    clearTranscript,

    startListening,
    stopListening,

    speakText,
    speakSequence,
    stopSpeaking,
  };
};