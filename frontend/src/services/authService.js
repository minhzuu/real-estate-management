import axios from "axios";

const BASE_URL = "http://localhost:8080/real_estate";
const TOKEN_KEY = "token";
const REMEMBER_ME_KEY = "rememberMe";

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("user");
  localStorage.removeItem(REMEMBER_ME_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function getStoredToken() {
  const sessionToken = sessionStorage.getItem(TOKEN_KEY);
  if (sessionToken) return sessionToken;

  const shouldRemember = localStorage.getItem(REMEMBER_ME_KEY) === "true";
  const localToken = localStorage.getItem(TOKEN_KEY);
  if (shouldRemember && localToken) return localToken;

  // Clear legacy tokens that were always written to localStorage.
  if (localToken) {
    localStorage.removeItem(TOKEN_KEY);
  }

  return null;
}

function storeToken(token, rememberMe) {
  clearStoredAuth();
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REMEMBER_ME_KEY, "true");
    return;
  }

  sessionStorage.setItem(TOKEN_KEY, token);
}

const authService = {
  // Đăng nhập — POST /api/auth/login
  login: async (username, password, rememberMe = false) => {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      username,
      password,
    });
    if (response.data.result?.token) {
      storeToken(response.data.result.token, rememberMe);
    }
    return response.data;
  },

  // Đăng xuất — POST /api/auth/logout
  logout: async () => {
    try {
      const token = getStoredToken();
      if (token) {
        await axios.post(
          `${BASE_URL}/api/auth/logout`,
          { token },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearStoredAuth();
    }
  },

  // Lấy thông tin user hiện tại — GET /api/auth/me
  getMyInfo: async () => {
    const token = getStoredToken();
    const response = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.result;
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => !!getStoredToken(),

  // Lấy token
  getToken: () => getStoredToken(),
};

export default authService;
