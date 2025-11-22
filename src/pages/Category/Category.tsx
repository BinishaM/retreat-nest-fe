import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';
import { deleteCategory, getCategories } from '@/api/category';
import { toast } from 'react-toastify';
import ComponentWrapper from '@/common/ComponentWrapper';
import { Button } from '@/components/ui/button';

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to fetch category data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCategory(selectedCategory.category_id);
      toast.success('Category deleted successfully!');
      setCategories((prev) => prev.filter((c) => c.category_id !== selectedCategory.category_id));
    } catch (err) {
      toast.error('Failed to delete category.');
    } finally {
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchCategory();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <ComponentWrapper>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Category List</h2>
        <button
          onClick={() => navigate('/category/new')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          + Add New Category
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-300 dark:border-gray-700 rounded-md">
        <table className="min-w-full text-sm border-b text-gray-900 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Category Name</th>
              <th className="px-4 py-2 text-left">Short Description</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <tr key={category.category_id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-medium">{category.name}</td>
                  <td className="px-4 py-2">{category.description || '-'}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <Button
                      className="border-gray-400 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600"
                      variant="outline"

                      onClick={() => navigate(`/category/edit/${category.category_id}`, { state: { category } })}
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleDeleteClick(category)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500 italic">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-md shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Confirm Delete</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-medium">{selectedCategory?.name}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ComponentWrapper>
  );
};

export default CategoryList;
