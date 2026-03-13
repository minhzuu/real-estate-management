import axios from "axios";
import apiClient from "./apiClient";

const BASE_URL = "http://localhost:8080/real_estate";

const consultService = {
  // Public — GET /api/public/buildings (no auth)
  getPublicBuildings: async () => {
    const response = await axios.get(`${BASE_URL}/api/public/buildings`);
    return response.data.result;
  },

  // Public — GET /api/public/buildings/:id
  getPublicBuildingById: async (id) => {
    const response = await axios.get(`${BASE_URL}/api/public/buildings/${id}`);
    return response.data.result;
  },

  // Public — POST /api/public/buildings/:id/request-consult (no auth)
  submitConsultRequest: async (buildingId, data) => {
    const response = await axios.post(
      `${BASE_URL}/api/public/buildings/${buildingId}/request-consult`,
      data
    );
    return response.data.result;
  },

  // Admin — GET /api/admin/consult-requests (auth required)
  getAllConsultRequests: async () => {
    const response = await apiClient.get("/api/admin/consult-requests");
    return response.data.result;
  },

  // Admin — GET /api/admin/consult-requests/building/:id
  getConsultRequestsByBuilding: async (buildingId) => {
    const response = await apiClient.get(`/api/admin/consult-requests/building/${buildingId}`);
    return response.data.result;
  },

  // Admin — PATCH /api/admin/consult-requests/:id/status
  updateConsultStatus: async (id, status) => {
    const response = await apiClient.patch(`/api/admin/consult-requests/${id}/status`, { status });
    return response.data.result;
  },
};

export default consultService;
