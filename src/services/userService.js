import axiosClient from "../api/axiosClient";

export const userService = {
  getProfile: async () => (await axiosClient.get("/profile/me")).data,
  getAllUsers: async () => (await axiosClient.get("/user/get-all-users")).data,
};
