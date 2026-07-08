import axiosClient from "../api/axiosClient";

export const sessionService = {
  create: async (payload) => (await axiosClient.post("/session/create-session", payload)).data,
  getByUserId: async (userId) => (await axiosClient.get(`/session/user/${userId}`)).data,
  getAll: async () => (await axiosClient.get("/session/get-all-sessions")).data,
  end: async (sessionId) => (await axiosClient.put(`/session/end/${sessionId}`)).data,
  getSummary: async (sessionId) => (await axiosClient.get(`/session/summary/${sessionId}`)).data,
  getReport: async (sessionId) => (await axiosClient.get(`/session/report/${sessionId}`)).data,
};
