import axios from "axios";
import { clearStoredAuth, getStoredToken } from "./authService";

const BASE_URL = "http://localhost:8080/real_estate";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Inject JWT token on every request
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — clear token and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
