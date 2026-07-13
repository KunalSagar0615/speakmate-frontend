const TRANSLATION_CACHE = new Map();
const IN_FLIGHT_REQUESTS = new Map();

const getTargetLanguage = (language) => {
  const targetLanguages = {
    HINDI: "hi",
    MARATHI: "mr",
  };
  return targetLanguages[language] || "hi";
};

const normalizeText = (text) => String(text || "").trim();

export const translateText = async (text, language) => {
  const normalizedText = normalizeText(text);

  if (!normalizedText || !language || language === "ENGLISH") {
    return { translatedText: normalizedText, error: null };
  }

  const cacheKey = `${language}:${normalizedText}`;
  if (TRANSLATION_CACHE.has(cacheKey)) {
    return TRANSLATION_CACHE.get(cacheKey);
  }

  if (IN_FLIGHT_REQUESTS.has(cacheKey)) {
    return IN_FLIGHT_REQUESTS.get(cacheKey);
  }

  const requestPromise = (async () => {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(normalizedText)}&langpair=en|${getTargetLanguage(language)}`
      );

      if (!response.ok) {
        throw new Error("Translation request failed");
      }

      const payload = await response.json();
      const translatedText = payload?.responseData?.translatedText || payload?.matches?.[0]?.translation || normalizedText;
      const result = { translatedText: translatedText || normalizedText, error: null };
      TRANSLATION_CACHE.set(cacheKey, result);
      return result;
    } catch (error) {
      const fallbackResult = { translatedText: normalizedText, error: error.message || "Translation failed" };
      TRANSLATION_CACHE.set(cacheKey, fallbackResult);
      return fallbackResult;
    } finally {
      IN_FLIGHT_REQUESTS.delete(cacheKey);
    }
  })();

  IN_FLIGHT_REQUESTS.set(cacheKey, requestPromise);
  return requestPromise;
};

export const getTranslationLabel = (value) => {
  const labels = {
    ENGLISH: "English Only",
    HINDI: "English + Hindi",
    MARATHI: "English + Marathi",
  };
  return labels[value] || "English Only";
};
