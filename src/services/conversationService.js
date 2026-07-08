import axiosClient from "../api/axiosClient";

export const conversationService = {
  start: async (sessionId) =>
    (await axiosClient.post(`/conversation/start-conversation/${sessionId}`)).data,
  answer: async (payload) => (await axiosClient.post("/conversation/answer", payload)).data,
  getBySession: async (sessionId) =>
    (await axiosClient.get(`/conversation/session/${sessionId}`)).data,
  getAll: async () => (await axiosClient.get("/conversation/get-all-conversations")).data,
};
