import apiClient from "./apiClient";

const transactionService = {
  // POST /transactions — Tạo giao dịch cho khách hàng
  createTransaction: async ({ customerId, transactionTypeId, note }) => {
    const response = await apiClient.post("/transactions", {
      customerId,
      transactionTypeId,
      note,
    });
    return response.data.result;
  },

  // GET /transactions/types — Danh sách loại giao dịch
  getTransactionTypes: async () => {
    const response = await apiClient.get("/transactions/types");
    return response.data.result;
  },
};

export default transactionService;
