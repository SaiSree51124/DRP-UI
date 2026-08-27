import axios from "axios";
import { fetchAuthSession } from "@aws-amplify/auth";
import API_CONFIG from "../apiconfig";

const apiClient = axios.create({
  baseURL: API_CONFIG.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  let token;

  try {
    const { tokens } = await fetchAuthSession();
    token = tokens?.accessToken?.toString();
  } catch (error) {
    token = null;
  }

  if (!token && typeof window !== "undefined") {
    token = window.localStorage.getItem("drp.apiToken") || API_CONFIG.ACCESS_TOKEN;
  }

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseMessage = error.response?.data?.message;
    const message =
      responseMessage ||
      (error.response
        ? `Backend request failed (${error.response.status}).`
        : "Unable to reach the backend.");

    return Promise.reject(Object.assign(error, { userMessage: message }));
  }
);

export default apiClient;