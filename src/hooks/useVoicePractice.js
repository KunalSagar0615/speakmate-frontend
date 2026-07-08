import { useCallback, useEffect, useRef, useState } from "react";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useVoicePractice = () => {
  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += result;
        } else {
          interim += result;
        }
      }

      if (finalText) {
        setTranscript((prev) => `${prev}${prev ? " " : ""}${finalText.trim()}`);
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
        setError("Microphone permission denied. Please allow microphone access.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Please try again.");
      } else if (event.error === "aborted") {
        setError("");
      } else {
        setError("Speech recognition error. Please try again.");
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

    recognitionRef.current = recognition;
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not supported in this browser.");
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
      setError("Could not start microphone. Please try again.");
    }
  }, []);

  const stopListening = useCallback(() => {
    listeningRef.current = false;
    setListening(false);
    setInterimTranscript("");
    recognitionRef.current?.stop();
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  const speakText = useCallback((text) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  }, []);

  const speakSequence = useCallback((parts) => {
    window.speechSynthesis.cancel();
    const queue = parts.filter((text) => text && String(text).trim());
    if (!queue.length) return;

    let index = 0;
    const speakNext = () => {
      if (index >= queue.length) return;
      const utter = new SpeechSynthesisUtterance(queue[index]);
      utter.onend = () => {
        index += 1;
        speakNext();
      };
      utter.onerror = () => {
        index += 1;
        speakNext();
      };
      window.speechSynthesis.speak(utter);
    };
    speakNext();
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  const displayTranscript = `${transcript}${interimTranscript ? (transcript ? " " : "") + interimTranscript : ""}`;

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
