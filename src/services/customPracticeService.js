import axiosClient from "../api/axiosClient";

const BASE_URL = "/custom-practice";

const normalizeSessionId = (sessionId) => {
  if (
    sessionId === null ||
    sessionId === undefined ||
    sessionId === ""
  ) {
    throw new Error("Invalid practice session ID.");
  }

  const value = String(sessionId).trim();

  if (
    value === "" ||
    value === "undefined" ||
    value === "null"
  ) {
    throw new Error("Invalid practice session ID.");
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("Invalid practice session ID.");
  }

  return parsed;
};

export const customPracticeService = {
  // POST /custom-practice/extract-questions
  extractQuestions: async (content) =>
    (
      await axiosClient.post(
        `${BASE_URL}/extract-questions`,
        { content }
      )
    ).data,

  // POST /custom-practice
  createSession: async (payload) =>
    (
      await axiosClient.post(
        BASE_URL,
        payload
      )
    ).data,

  // GET /custom-practice/paused
  getPausedSessions: async () =>
    (
      await axiosClient.get(
        `${BASE_URL}/paused`
      )
    ).data,

  // GET /custom-practice/history
  getSessionHistory: async () =>
    (
      await axiosClient.get(
        `${BASE_URL}/history`
      )
    ).data,

  // GET /custom-practice/{sessionId}
  getSession: async (sessionId) => {
    const id = normalizeSessionId(sessionId);

    return (
      await axiosClient.get(
        `${BASE_URL}/${id}`
      )
    ).data;
  },

  // POST /custom-practice/{sessionId}/answer
  submitAnswer: async (sessionId, payload) => {
    const id = normalizeSessionId(sessionId);

    return (
      await axiosClient.post(
        `${BASE_URL}/${id}/answer`,
        payload
      )
    ).data;
  },

  // POST /custom-practice/{sessionId}/skip
  skipQuestion: async (sessionId) => {
    const id = normalizeSessionId(sessionId);

    return (
      await axiosClient.post(
        `${BASE_URL}/${id}/skip`
      )
    ).data;
  },

  // POST /custom-practice/{sessionId}/next
  nextQuestion: async (sessionId) => {
    const id = normalizeSessionId(sessionId);

    return (
      await axiosClient.post(
        `${BASE_URL}/${id}/next`
      )
    ).data;
  },

  // PUT /custom-practice/{sessionId}/draft
  saveDraft: async (sessionId, payload) => {
    const id = normalizeSessionId(sessionId);

    await axiosClient.put(
      `${BASE_URL}/${id}/draft`,
      payload
    );
  },

  // POST /custom-practice/{sessionId}/pause
  pauseSession: async (sessionId, pauseDays) => {
    const id = normalizeSessionId(sessionId);

    return (
      await axiosClient.post(
        `${BASE_URL}/${id}/pause`,
        { pauseDays }
      )
    ).data;
  },

  // POST /custom-practice/{sessionId}/pause-default
  pauseSessionDefault: async (sessionId) => {
    const id = normalizeSessionId(sessionId);

    return (
      await axiosClient.post(
        `${BASE_URL}/${id}/pause-default`
      )
    ).data;
  },

  // POST /custom-practice/{sessionId}/resume
  resumeSession: async (sessionId) => {
    const id = normalizeSessionId(sessionId);

    return (
      await axiosClient.post(
        `${BASE_URL}/${id}/resume`
      )
    ).data;
  },

  // POST /custom-practice/{sessionId}/end
  endSession: async (sessionId) => {
    const id = normalizeSessionId(sessionId);

    return (
      await axiosClient.post(
        `${BASE_URL}/${id}/end`
      )
    ).data;
  },

  // GET /custom-practice/{sessionId}/report
  getReport: async (sessionId) => {
    const id = normalizeSessionId(sessionId);

    return (
      await axiosClient.get(
        `${BASE_URL}/${id}/report`
      )
    ).data;
  },
};