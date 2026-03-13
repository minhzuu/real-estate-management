import apiClient from "./apiClient";

const userService = {
  // GET /users (all users — used for admin management & staff dropdowns)
  getAllUsers: async () => {
    const response = await apiClient.get("/users");
    return response.data.result;
  },

  // GET /users/:id
  getUserById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.result;
  },

  // POST /users — create user
  createUser: async (data) => {
    const response = await apiClient.post("/users", data);
    return response.data.result;
  },

  // PUT /users/:id — update user
  updateUser: async (id, data) => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data.result;
  },

  // DELETE /users/:id
  deleteUser: async (id) => {
    await apiClient.delete(`/users/${id}`);
  },

  // POST /api/auth/change-password
  changePassword: async (data) => {
    await apiClient.post("/api/auth/change-password", data);
  },
};

export default userService;
