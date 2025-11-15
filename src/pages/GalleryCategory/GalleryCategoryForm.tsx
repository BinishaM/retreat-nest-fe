import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  createGalleryCategory,
  updateGalleryCategory,
  getGalleryCategory,
} from "@/api/galleryCategory";
import { toast } from "react-toastify";
import ComponentWrapper from "@/common/ComponentWrapper";

const GalleryCategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const existingCategory = location.state?.category;
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: existingCategory?.name || "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Fetch existing category if editing (when not passed via state)
  useEffect(() => {
    const fetchCategory = async () => {
      if (!isEdit || existingCategory) return;
      try {
        const data = await getGalleryCategory(id!);
        setFormData({
          name: data.name || "",
        });
      } catch (error) {
        console.error("Failed to fetch category:", error);
        toast.error("Could not load category details.");
      }
    };
    fetchCategory();
  }, [id, isEdit, existingCategory]);

  // ✅ Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Validate form before submission
  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEdit) {
        await updateGalleryCategory(id!, formData);
        toast.success("Category updated successfully!");
      } else {
        await createGalleryCategory(formData);
        toast.success("Category created successfully!");
      }
      setTimeout(() => navigate("/gallery-category"), 1500);
    } catch (error) {
      console.error("❌ Error saving category:", error);
      toast.error("Failed to save category.");
    }
  };

  return (
    <ComponentWrapper>
      <h2 className="text-lg font-semibold text-gray-200 mb-6">
        {isEdit ? "Edit Gallery Category" : "Add New Gallery Category"}
      </h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-medium text-gray-200 mb-1">
            Category Name
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Beach Retreats"
            className={`w-full rounded-md border px-3 py-2 text-gray-200 bg-white dark:bg-white/[0.05] focus:outline-none focus:ring-2 ${errors.name
              ? "border-red-500 ring-red-400"
              : "border-gray-700 focus:ring-blue-500"
              }`}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/gallery-category")}
            className="px-4 py-2 border border-gray-700 rounded-md text-gray-200 hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </ComponentWrapper>

  );
};

export default GalleryCategoryForm;
