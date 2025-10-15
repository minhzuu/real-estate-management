import axios from "axios";

const API_URL = "http://localhost:8080/real_estate/auth";

const authService = {
  // Đăng nhập
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/token`, {
        username,
        password,
      });

      if (response.data.result && response.data.result.token) {
        localStorage.setItem("token", response.data.result.token);
        localStorage.setItem("user", JSON.stringify({ username }));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Đăng nhập thất bại" };
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(`${API_URL}/logout`, { token });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // Lấy thông tin user hiện tại
  getMyInfo: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/real_estate/users/myinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.result;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Không thể lấy thông tin người dùng",
        }
      );
    }
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Lấy token
  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;
