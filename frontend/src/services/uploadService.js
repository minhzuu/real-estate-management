import apiClient from "./apiClient";

const uploadService = {
  uploadImage: async (file, folder = "buildings") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await apiClient.post("/api/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.result.url;
  },
};

export default uploadService;
