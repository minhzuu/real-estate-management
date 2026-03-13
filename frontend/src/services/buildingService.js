import apiClient from "./apiClient";

const buildingService = {
  // GET /api/admin/buildings
  getAllBuildings: async () => {
    const response = await apiClient.get("/api/admin/buildings");
    return response.data.result;
  },

  // GET /api/admin/buildings/:id
  getBuildingById: async (id) => {
    const response = await apiClient.get(`/api/admin/buildings/${id}`);
    return response.data.result;
  },

  // GET /api/admin/buildings/search?keyword=
  searchBuildings: async (keyword) => {
    const response = await apiClient.get("/api/admin/buildings/search", {
      params: { keyword },
    });
    return response.data.result;
  },

  // GET /api/public/buildings/search?keyword=
  searchPublicBuildings: async (keyword) => {
    const response = await apiClient.get("/api/public/buildings/search", {
      params: { keyword },
    });
    return response.data.result;
  },

  // POST /api/admin/buildings
  createBuilding: async (data) => {
    const response = await apiClient.post("/api/admin/buildings", data);
    return response.data.result;
  },

  // PUT /api/admin/buildings/:id
  updateBuilding: async (id, data) => {
    const response = await apiClient.put(`/api/admin/buildings/${id}`, data);
    return response.data.result;
  },

  // DELETE /api/admin/buildings/:id
  deleteBuilding: async (id) => {
    await apiClient.delete(`/api/admin/buildings/${id}`);
  },

  // GET /api/admin/buildings/:id/rentareas
  getBuildingRentAreas: async (id) => {
    const response = await apiClient.get(`/api/admin/buildings/${id}/rentareas`);
    return response.data.result;
  },

  // POST /api/admin/buildings/:id/staff
  assignStaffToBuilding: async (buildingId, staffIds) => {
    const response = await apiClient.post(`/api/admin/buildings/${buildingId}/staff`, {
      buildingId,
      staffIds,
    });
    return response.data.result;
  },

  // Public: GET /api/public/buildings (no auth needed)
  getPublicBuildings: async () => {
    const response = await apiClient.get("/api/public/buildings");
    return response.data.result;
  },
};

export default buildingService;
