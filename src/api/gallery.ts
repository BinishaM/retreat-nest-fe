import axios from './axiosClient';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get all gallery items
export const getGalleries = async (retreat_id: number | string) => {
  const response = await axios.get(`${API_BASE_URL}/retreats/${retreat_id}/galleries/`);
  return response.data;
};

// Create a new gallery item (with image)
export const createGallery = async (retreat_id: number | string,formData: FormData) => {
  const response = await axios.post(`${API_BASE_URL}/retreats/${retreat_id}/galleries/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update a gallery item (supports formData)
export const updateGallery = async (retreat_id: number | string,id: number | string, formData: FormData) => {
  const response = await axios.patch(`${API_BASE_URL}/retreats/${retreat_id}/galleries/${id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete a gallery item
export const deleteGallery = async (retreat_id: number | string,id: number | string) => {
  const response = await axios.delete(`${API_BASE_URL}/retreats/${retreat_id}/galleries/${id}/`);
  return response.data;
};
