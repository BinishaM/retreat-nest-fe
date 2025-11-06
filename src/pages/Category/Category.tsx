import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, User, Pencil } from 'lucide-react';
import { Edit2, Trash2 } from 'lucide-react'

// 🧩 Initial mock data (replace with API later)
const initialCategories = [
  { id: 1, name: 'Luxury', description: 'High-end hotels with premium facilities' },
  { id: 2, name: 'Budget', description: 'Affordable hotels with basic amenities' },
  { id: 3, name: 'Resort', description: 'Hotels offering recreational facilities' },
  { id: 4, name: 'Business', description: 'Hotels for corporate and business travelers' },
]

const CategoryList = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState(initialCategories)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // 🗑️ Handle Delete Click
  const handleDeleteClick = (category) => {
    setSelectedCategory(category)
    setShowDeleteModal(true)
  }

  // ✅ Confirm Delete
  const handleConfirmDelete = () => {
    setCategories(categories.filter((c) => c.id !== selectedCategory.id))
    setShowDeleteModal(false)
    setSelectedCategory(null)
  }

  // ❌ Cancel Delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setSelectedCategory(null)
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-800 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-200">Category List</h2>
          <button
            onClick={() => navigate('/category/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add New Category
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-700 rounded-md">
          <table className="min-w-full text-sm text-gray-700 border-b text-gray-200">
            <thead className="bg-gray-600 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 text-left text-gray-200">#</th>
                <th className="px-4 py-2 text-left text-gray-200">Category Name</th>
                <th className="px-4 py-2 text-left text-gray-200">Short Description</th>
                <th className="px-4 py-2 text-center text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr key={category.id} className="border hover:bg-gray-800 border-gray-800">
                    <td className="px-4 py-2 text-gray-200">{index + 1}</td>
                    <td className="px-4 py-2 font-medium text-gray-200">{category.name}</td>
                    <td className="px-4 py-2 text-gray-200">{category.description}</td>
                    <td className="px-4 py-2 text-gray-200 text-center space-x-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => navigate(`/category/edit/${category.id}`, { state: { category } })}
                        className="inline-flex items-center px-2 py-1 border border-blue-200 rounded hover:bg-gray-500"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>


                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteClick(category)}
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
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500 italic">
                    No categories found.
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
                Are you sure you want to delete <span className="font-medium">{selectedCategory?.name}</span>?
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
      </div>

    </>
  )
}

export default CategoryList
