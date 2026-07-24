import axiosClient from "../api/axiosClient";

export const authService = {

  // =========================
  // REGISTER
  // =========================

  register: async (payload) =>
    (
      await axiosClient.post(
        "/api/auth/register",
        payload
      )
    ).data,

  sendOtp: async (email) =>
    (
      await axiosClient.post(
        `/api/auth/send-otp?email=${encodeURIComponent(email)}`
      )
    ).data,

  verifyOtp: async (payload) =>
    (
      await axiosClient.post(
        "/api/auth/verify-otp",
        payload
      )
    ).data,

  resendOtp: async (email) =>
    (
      await axiosClient.post(
        `/api/auth/resend-otp?email=${encodeURIComponent(email)}`
      )
    ).data,


  // =========================
  // LOGIN
  // =========================

  login: async (payload) =>
    (
      await axiosClient.post(
        "/api/auth/login",
        payload
      )
    ).data,


  // =========================
  // FORGOT PASSWORD
  // =========================

  forgotPassword: async (email) =>
    (
      await axiosClient.post(
        "/api/auth/forgot-password",
        {
          email,
        }
      )
    ).data,

  resendPasswordResetOtp: async (email) =>
    (
      await axiosClient.post(
        `/api/auth/forgot-password/resend-otp?email=${encodeURIComponent(email)}`
      )
    ).data,

  verifyPasswordResetOtp: async (email, otp) =>
    (
      await axiosClient.post(
        "/api/auth/forgot-password/verify-otp",
        {
          email,
          otp,
        }
      )
    ).data,

  resetPassword: async (
    email,
    newPassword,
    confirmPassword
  ) =>
    (
      await axiosClient.post(
        "/api/auth/reset-password",
        {
          email,
          newPassword,
          confirmPassword,
        }
      )
    ).data,
};