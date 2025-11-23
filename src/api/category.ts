import axios from './axiosClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get all categories
export const getCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/categories/`);
  return response.data;
};

// Get a single category by ID
export const getCategory = async (id: number | string) => {
  const response = await axios.get(`${API_BASE_URL}/categories/${id}/`);
  return response.data;
};

// Create a new category
export const createCategory = async (categoryData: any) => {
  const response = await axios.post(`${API_BASE_URL}/categories/`, categoryData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Update a category
export const updateCategory = async (id: number | string, categoryData: any) => {
  const response = await axios.patch(`${API_BASE_URL}/categories/${id}/`, categoryData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// Delete a category
export const deleteCategory = async (id: number | string) => {
  const response = await axios.delete(`${API_BASE_URL}/categories/${id}/`);
  return response.data;
};
