import axiosClient from "../api/axiosClient";

export const dashboardService = {
  getAnalytics: async () => (await axiosClient.get("/profile/analytics")).data,
};
