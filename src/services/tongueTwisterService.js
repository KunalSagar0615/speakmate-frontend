import axiosClient from "../api/axiosClient";

export const tongueTwisterService = {
  start: async () =>
    (await axiosClient.post("/api/tongue-twister/start")).data,

  generate: async (sessionId) =>
    (await axiosClient.post(`/api/tongue-twister/generate/${sessionId}`)).data,

  end: async (sessionId) =>
    (await axiosClient.post(`/api/tongue-twister/end/${sessionId}`)).data,

  getStats: async () =>
    (await axiosClient.get("/api/tongue-twister/stats")).data,

  getHistory: async () =>
    (await axiosClient.get("/api/tongue-twister/history")).data,

  downloadHistory: async () =>
    (
      await axiosClient.get("/api/tongue-twister/download", {
        responseType: "blob",
      })
    ).data,
};