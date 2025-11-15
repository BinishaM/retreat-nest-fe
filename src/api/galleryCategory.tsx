import axios from './axiosClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get all categories
export const getGalleryCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/gallery-categories/`);
  return response.data;
};

// Get a single category by ID
export const getGalleryCategory = async (id: number | string) => {
  const response = await axios.get(`${API_BASE_URL}/gallery-categories/${id}/`);
  return response.data;
};

// Create a new category
export const createGalleryCategory = async (categoryData: any) => {
  const response = await axios.post(`${API_BASE_URL}/gallery-categories/`, categoryData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Update a category
export const updateGalleryCategory = async (id: number | string, categoryData: any) => {
  const response = await axios.patch(`${API_BASE_URL}/gallery-categories/${id}/`, categoryData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Delete a category
export const deleteGalleryCategory = async (id: number | string) => {
  const response = await axios.delete(`${API_BASE_URL}/gallery-categories/${id}/`);
  return response.data;
};
