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

  uploadMultipleImages: async (files, folder = "buildings") => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("folder", folder);

    const response = await apiClient.post("/api/upload/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.result;
  },
};

export default uploadService;
