import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL, TOKEN_KEY } from "../utils/constants";
import { getStored } from "../utils/storage";
import { getErrorMessage } from "../utils/errorMessages";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

axiosClient.interceptors.request.use((config) => {
  const token = getStored(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getErrorMessage(error);
    const status = error?.response?.status;
    if ([401, 403, 500].includes(status) || !error?.response) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
