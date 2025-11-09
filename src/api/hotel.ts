import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// Get all hotels
export const getHotels = async () => {
    const response = await axios.get(`${API_BASE_URL}/retreats/`)
    return response.data
}

// Create a new hotel
export const createHotel = async (hotelData) => {
    const response = await axios.post(`${API_BASE_URL}/retreats/`, hotelData)

    return response.data
}


export const updateHotel = async (id, hotelData) => {
    const response = await axios.patch(`${API_BASE_URL}/retreats/${id}/`, hotelData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};



// Delete a hotel
export const deleteHotel = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/retreats/${id}/`)
    return response.data
}
