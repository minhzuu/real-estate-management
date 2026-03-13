import apiClient from "./apiClient";

const customerService = {
  // GET /customers (Admin only)
  getAllCustomers: async () => {
    const response = await apiClient.get("/customers");
    return response.data.result;
  },

  // GET /customers/my-customers
  getMyCustomers: async () => {
    const response = await apiClient.get("/customers/my-customers");
    return response.data.result;
  },

  // GET /customers/unassigned (Admin/Manager)
  getUnassignedCustomers: async () => {
    const response = await apiClient.get("/customers/unassigned");
    return response.data.result;
  },

  // GET /customers/:id
  getCustomerById: async (id) => {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data.result;
  },

  // GET /customers/search?keyword=
  searchCustomers: async (keyword) => {
    const response = await apiClient.get("/customers/search", {
      params: { keyword },
    });
    return response.data.result;
  },

  // POST /customers
  createCustomer: async (data) => {
    const response = await apiClient.post("/customers", data);
    return response.data.result;
  },

  // PUT /customers/:id
  updateCustomer: async (id, data) => {
    const response = await apiClient.put(`/customers/${id}`, data);
    return response.data.result;
  },

  // DELETE /customers/:id (Admin only)
  deleteCustomer: async (id) => {
    await apiClient.delete(`/customers/${id}`);
  },

  // POST /customers/:id/assign — gán nhân viên
  assignStaff: async (customerId, staffIds) => {
    const response = await apiClient.post(`/customers/${customerId}/assign`, staffIds);
    return response.data.result;
  },

  // DELETE /customers/:id/assign/:uid — xóa gán
  unassignStaff: async (customerId, staffId) => {
    await apiClient.delete(`/customers/${customerId}/assign/${staffId}`);
  },

  // GET /customers/:id/transactions
  getCustomerTransactions: async (customerId) => {
    const response = await apiClient.get(`/customers/${customerId}/transactions`);
    return response.data.result;
  },
};

export default customerService;
