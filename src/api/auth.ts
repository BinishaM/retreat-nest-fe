import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// Create a new gallery item (with image)
export const loginUser = async (formData: FormData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login/`, formData

    );
    return response.data;
};