import { createCategory, updateCategory } from '@/api/category'
import React, { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CategoryForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const category = location.state?.category

  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Category name is required'
    if (!formData.description.trim() || formData.description.length < 10)
      newErrors.description = 'Description must be at least 10 characters long'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEdit) {
        await updateCategory(id, formData);
        toast.success('Category updated successfully!');
      } else {
        await createCategory(formData);
        toast.success('Category created successfully!');
      }

      setTimeout(() => navigate('/category'), 1500);

    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="rounded-2xl border border-gray-800 bg-white dark:bg-white/[0.03] shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-200 mb-6">
        {isEdit ? 'Edit Category' : 'Add New Category'}
      </h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Category Name */}
        <div>
          <label htmlFor="name" className="block font-medium text-gray-200 mb-1">
            Category Name
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            readOnly={isEdit}
            onChange={handleInputChange}
            className={`w-full rounded-md border px-3 py-2 text-gray-200 bg-white dark:bg-white/[0.05] focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 ring-red-400' : 'border-gray-700 focus:ring-blue-500'
              }`}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium text-gray-200 mb-1">
            Short Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full rounded-md border px-3 py-2 text-gray-200 bg-white dark:bg-white/[0.05] focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500 ring-red-400' : 'border-gray-700 focus:ring-blue-500'
              }`}
          />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/category')}
            className="px-4 py-2 border border-gray-700 rounded-md text-gray-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CategoryForm
