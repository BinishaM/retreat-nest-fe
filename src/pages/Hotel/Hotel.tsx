// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
// import { getHotels } from '../../api/hotel'
// import { Edit2, Trash2 } from 'lucide-react'

// const initialHotels = [
//   { id: 1, name: 'Grand Palace Hotel', location: 'New York, USA', contact: '+1 212 555 0198', owner: 'John Smith' },
//   { id: 2, name: 'Seaside Resort', location: 'Miami, USA', contact: '+1 305 555 0112', owner: 'Maria Lopez' },
//   { id: 3, name: 'Mountain View Lodge', location: 'Aspen, USA', contact: '+1 970 555 0134', owner: 'James Walker' },
//   { id: 4, name: 'Desert Oasis Inn', location: 'Phoenix, USA', contact: '+1 602 555 0177', owner: 'Sarah Johnson' },
// ]

// const HotelList = () => {
//   const navigate = useNavigate()
//   const [hotels, setHotels] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [showDeleteModal, setShowDeleteModal] = useState(false)
//   const [selectedHotel, setSelectedHotel] = useState(null)

// console.log(hotels)
//   // ✅ Fetch hotels on mount
//   useEffect(() => {
//     const fetchHotels = async () => {
//       try {
//         setLoading(true)
//         const data = await getHotels()
//         setHotels(data.data)
//       } catch (err) {
//         console.error('Error fetching hotels:', err)
//         setError('Failed to fetch hotel data.')
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchHotels()
//   }, [])

//   const handleDeleteClick = (hotel) => {
//     setSelectedHotel(hotel)
//     setShowDeleteModal(true)
//   }

//   const handleConfirmDelete = async () => {
//     try {
//       await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/retreats/${selectedHotel.id}/`)
//       // setHotels(hotels.filter((h) => h.id !== selectedHotel.id))
//       console.log('✅ Hotel deleted successfully')
//     } catch (err) {
//       console.error('❌ Failed to delete hotel:', err)
//       alert('Error deleting hotel.')
//     } finally {
//       setShowDeleteModal(false)
//       setSelectedHotel(null)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center py-16 text-gray-600">
//         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
//         <p>Loading hotels...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="rounded-2xl border border-gray-800 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-lg font-semibold text-gray-200">Hotel List</h2>
//         <button
//           onClick={() => navigate('/hotel/new')}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         >
//           + Add New Hotel
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto border border-gray-700 rounded-md">
//         <table className="min-w-full text-sm text-gray-700 border-b text-gray-200">
//           <thead className="bg-gray-600 text-gray-700 uppercase text-xs">
//             <tr>
//               <th className="px-4 py-2 text-left text-gray-200">#</th>
//               <th className="px-4 py-2 text-left text-gray-200">Hotel Name</th>
//               <th className="px-4 py-2 text-left text-gray-200">Slug</th>
//               <th className="px-4 py-2 text-left text-gray-200">Description</th>
//               <th className="px-4 py-2 text-left text-gray-200">Category</th>
//               <th className="px-4 py-2 text-center text-gray-200">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {hotels.length > 0 ? (
//               hotels.map((hotel, index) => (
//                 <tr key={hotel.id} className="border hover:bg-gray-800 border-gray-800">
//                   <td className="px-4 py-2 text-gray-200">{index + 1}</td>
//                   <td className="px-4 py-2 font-medium text-gray-200">{hotel.name}</td>
//                   <td className="px-4 py-2 text-gray-200">{hotel.slug}</td>
//                   <td className="px-4 py-2 text-gray-200">{hotel.description}</td>
//                   <td className="px-4 py-2 text-gray-200">{hotel.category?.join(', ') || '-'}</td>
//                   <td className="px-4 py-2 text-gray-200 text-center space-x-2">

//                     {/* Edit Button */}
//                     <button
//                       onClick={() => navigate(`/hotel/edit/${hotel.id}`, { state: { hotel } })}

//                       className="inline-flex items-center px-2 py-1 border border-blue-200 rounded hover:bg-gray-500"
//                       title="Edit"
//                     >
//                       <Edit2 className="w-4 h-4" />
//                     </button>


//                     {/* Delete Button */}
//                     <button
//                       onClick={() => handleDeleteClick(hotel)}

//                       className="inline-flex items-center px-2 py-1 text-red-400 hover:text-red-800 border border-red-200 rounded hover:bg-red-50"
//                       title="Delete"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>


//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="px-4 py-6 text-center text-gray-500 italic">
//                   No hotels found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>


//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//           <div className="bg-white rounded-md shadow-lg w-full max-w-md p-6">
//             <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
//             <p className="text-gray-700 mb-6">
//               Are you sure you want to delete{' '}
//               <span className="font-medium">{selectedHotel?.name}</span>?
//             </p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmDelete}
//                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div className="mt-4 text-red-600 text-center font-medium">
//           {error}
//         </div>
//       )}
//     </div>
//   )
// }

// export default HotelList;
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { deleteHotel, getHotels } from "../../api/hotel";
import { Edit2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { getCategories } from "@/api/category";

const HotelList = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const hasFetched = useRef(false);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories(); // API call
        const options = res.data.map(cat => ({
          value: cat.category_id,
          label: cat.name,
        }));
        console.log(res, options)
        setCategories(options); // store in state
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        toast.error('Could not load categories');
      }
    }

    fetchCategories();
  }, []);


  const fetchHotels = async () => {
    try {
      setLoading(true);
      const data = await getHotels();
      setHotels(data.data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setError("Failed to fetch hotel data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchHotels();
  }, []);

  const handleDeleteClick = (hotel) => {
    setSelectedHotel(hotel);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteHotel(selectedHotel.retreat_id)
      fetchHotels();
      toast.success('Hotel deleted successfully!');
      setHotels((prev) => prev.filter((h) => h.retreat_id !== selectedHotel.retreat_id));
    } catch (err) {
      toast.error('Failed to delete hotel.');
    } finally {
      setShowDeleteModal(false);
      setSelectedHotel(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
        <p>Loading hotels...</p>
      </div>
    );
  }
  const getCategoryLabel = (categoryId: number | undefined) => {
    if (categoryId == null) return "-"; // handle undefined or null

    const category = categories.find(option => option.value === categoryId);
    return category ? category.label : "-";
  };

  return (
    <div className="bg-[#0f172a] text-white rounded-xl p-6 border border-gray-700 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Hotel List</h2>
        <Button
          onClick={() => navigate("/hotel/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
        >
          + Add New Hotel
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800 text-gray-200">
              <TableHead className="w-[60px]">#</TableHead>
              <TableHead>Hotel Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels.length > 0 ? (
              hotels.map((hotel, index) => (
                <TableRow
                  key={hotel.id}
                  className="hover:bg-gray-800 transition-colors"
                >
                  <TableCell className="text-gray-300">{index + 1}</TableCell>
                  <TableCell className="font-medium text-white">
                    {hotel.name}
                  </TableCell>
                  <TableCell className="text-gray-400">{hotel.slug}</TableCell>
                  <TableCell className="text-gray-400">
                    {hotel.description}
                  </TableCell>
                  <TableCell className="text-gray-400">

                    {getCategoryLabel(hotel.category_id)}
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-500 hover:bg-gray-700"
                      onClick={() =>
                        navigate(`/hotel/edit/${hotel.retreat_id}`, {
                          state: { hotel, categories },
                        })
                      }
                    >
                      <Edit2 className="w-4 h-4 text-white" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handleDeleteClick(hotel)}
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center italic text-gray-400 py-6"
                >
                  No hotels found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-gray-200">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete{" "}
              <strong className="text-white">{selectedHotel?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {error && (
        <div className="mt-4 text-red-500 text-center font-medium">{error}</div>
      )}
    </div>
  );
};

export default HotelList;
