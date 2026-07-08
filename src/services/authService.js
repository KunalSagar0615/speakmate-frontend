import axiosClient from "../api/axiosClient";

export const authService = {
  register: async (payload) => (await axiosClient.post("/api/auth/register", payload)).data,
  sendOtp: async (email) => (await axiosClient.post("/api/auth/send-otp", { email })).data,
  verifyOtp: async (payload) => (await axiosClient.post("/api/auth/verify-otp", payload)).data,
  resendOtp: async (email) => (await axiosClient.post(`/api/auth/resend-otp?email=${email}`)).data,
  login: async (payload) => (await axiosClient.post("/api/auth/login", payload)).data,
};
