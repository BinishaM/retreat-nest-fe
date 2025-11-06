import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { getHotels } from '../../api/hotel'
import { Edit2, Trash2 } from 'lucide-react'

const initialHotels = [
  { id: 1, name: 'Grand Palace Hotel', location: 'New York, USA', contact: '+1 212 555 0198', owner: 'John Smith' },
  { id: 2, name: 'Seaside Resort', location: 'Miami, USA', contact: '+1 305 555 0112', owner: 'Maria Lopez' },
  { id: 3, name: 'Mountain View Lodge', location: 'Aspen, USA', contact: '+1 970 555 0134', owner: 'James Walker' },
  { id: 4, name: 'Desert Oasis Inn', location: 'Phoenix, USA', contact: '+1 602 555 0177', owner: 'Sarah Johnson' },
]

const HotelList = () => {
  const navigate = useNavigate()
  const [hotels, setHotels] = useState(initialHotels)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState(null)

console.log(hotels)
  // ✅ Fetch hotels on mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true)
        const data = await getHotels()
        // setHotels(data)
      } catch (err) {
        console.error('Error fetching hotels:', err)
        setError('Failed to fetch hotel data.')
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [])

  const handleDeleteClick = (hotel) => {
    setSelectedHotel(hotel)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/retreats/${selectedHotel.id}/`)
      // setHotels(hotels.filter((h) => h.id !== selectedHotel.id))
      console.log('✅ Hotel deleted successfully')
    } catch (err) {
      console.error('❌ Failed to delete hotel:', err)
      alert('Error deleting hotel.')
    } finally {
      setShowDeleteModal(false)
      setSelectedHotel(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-600">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
        <p>Loading hotels...</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-800 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-200">Hotel List</h2>
        <button
          onClick={() => navigate('/hotel/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add New Hotel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-700 rounded-md">
        <table className="min-w-full text-sm text-gray-700 border-b text-gray-200">
          <thead className="bg-gray-600 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 text-left text-gray-200">#</th>
              <th className="px-4 py-2 text-left text-gray-200">Hotel Name</th>
              <th className="px-4 py-2 text-left text-gray-200">Slug</th>
              <th className="px-4 py-2 text-left text-gray-200">Description</th>
              <th className="px-4 py-2 text-left text-gray-200">Category</th>
              <th className="px-4 py-2 text-center text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.length > 0 ? (
              hotels.map((hotel, index) => (
                <tr key={hotel.id} className="border hover:bg-gray-800 border-gray-800">
                  <td className="px-4 py-2 text-gray-200">{index + 1}</td>
                  <td className="px-4 py-2 font-medium text-gray-200">{hotel.name}</td>
                  <td className="px-4 py-2 text-gray-200">{hotel.slug}</td>
                  <td className="px-4 py-2 text-gray-200">{hotel.description}</td>
                  <td className="px-4 py-2 text-gray-200">{hotel.category?.join(', ') || '-'}</td>
                  <td className="px-4 py-2 text-gray-200 text-center space-x-2">

                    {/* Edit Button */}
                    <button
                      onClick={() => navigate(`/hotel/edit/${hotel.id}`, { state: { hotel } })}

                      className="inline-flex items-center px-2 py-1 border border-blue-200 rounded hover:bg-gray-500"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>


                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteClick(hotel)}

                      className="inline-flex items-center px-2 py-1 text-red-400 hover:text-red-800 border border-red-200 rounded hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>


                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500 italic">
                  No hotels found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete{' '}
              <span className="font-medium">{selectedHotel?.name}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-600 text-center font-medium">
          {error}
        </div>
      )}
    </div>
  )
}

export default HotelList;
