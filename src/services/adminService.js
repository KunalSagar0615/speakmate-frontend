import axiosClient from "../api/axiosClient";

export const adminService = {
  // Dashboard overview
  getOverview: async () => (await axiosClient.get("/admin/dashboard/overview")).data,


  // Month-wise dashboard data
  getMonthlyOverview: async (year, month) => (await axiosClient.get("/admin/dashboard/monthly", {params: { year, month },})).data,


  // Day-wise dashboard data
  getDailyOverview: async (date) => (await axiosClient.get("/admin/dashboard/daily", {params: { date },})).data,


  // All users
  getAllUsers: async () => (await axiosClient.get("/admin/users")).data,


  // Complete details of one user + user's sessions
  getUser: async (userId) => (await axiosClient.get(`/admin/users/${userId}`)).data,
};