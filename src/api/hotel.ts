import axios from 'axios'

// Base URL of your backend (adjust port if needed)
// const API_BASE_URL = 'http://localhost:8000/retreats/' // example: Express backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// Get all hotels
export const getHotels = async () => {
    const response = await axios.get(`${API_BASE_URL}/retreats/`)
    return response.data
}

// Get a single hotel by ID
export const getHotelById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`)
    return response.data
}

// Create a new hotel
export const createHotel = async (hotelData) => {
    const response = await axios.post(`${API_BASE_URL}/retreats/`, hotelData)

    return response.data
}

// Update existing hotel
export const updateHotel = async (id, hotelData) => {
    const formData = new FormData()
    Object.keys(hotelData).forEach((key) => {
        formData.append(key, hotelData[key])
    })

    const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
}

// Delete a hotel
export const deleteHotel = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`)
    return response.data
}
