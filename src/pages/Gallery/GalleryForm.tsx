import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ComponentWrapper from "@/common/ComponentWrapper";
import { createGallery, updateGallery } from "@/api/gallery";
import { getGalleryCategories } from "@/api/galleryCategory";

const GalleryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const gallery = location.state?.gallery;
  const retreat = location.state?.retreat;
  const retreat_id = retreat.retreat_id;
  const isEdit = Boolean(id);

  const [galleryCategories, setGalleryCategories] = useState([])
  const [formData, setFormData] = useState({
    caption: gallery?.caption || "",
    galleryCategories: gallery?.gallery_category_id || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getGalleryCategories();
        // Map API data to { value, label } format for select
        const options = res.data.map((cat) => ({
          value: cat.gallery_category_id,
          label: cat.name,
        }));
        setGalleryCategories(options);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        toast.error('Could not load categories');
      }
    };

    fetchCategories();
  }, []);


  // Handle text input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Validate fields
  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.caption.trim()) newErrors.caption = "Caption is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const form = new FormData();
    form.append("caption", formData.caption);
    form.append("gallery_category_id", formData.galleryCategories)
    if (imageFile) form.append("image", imageFile);
    try {
      if (isEdit) {
        id && await updateGallery(retreat_id, id, form);
        toast.success("Gallery category updated successfully!");
      } else {
        await createGallery(retreat_id, form);
        toast.success("Gallery category created successfully!");
      }

      setTimeout(() => navigate(`/gallery/`, {
        state: { retreat: retreat },
      }), 1500);
    } catch (error) {
      console.error("❌ Error saving category:", error);
      toast.error("Failed to save category.");
    }
  };

  return (
    <ComponentWrapper>
      <h2 className="text-lg font-semibold text-gray-200 mb-6">
        {isEdit ? "Edit Gallery" : "Add Gallery"}
      </h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Caption */}
          <div>
            <label htmlFor="caption" className="block font-medium text-gray-200 mb-1">
              Caption
            </label>
            <input
              id="caption"
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              placeholder="Caption text..."
              className={`w-full rounded-md border px-3 py-2 text-gray-200 bg-white dark:bg-white/[0.05] focus:outline-none focus:ring-2 ${errors.caption
                ? "border-red-500 ring-red-400"
                : "border-gray-700 focus:ring-blue-500"
                }`}
            />
            {errors.caption && <p className="text-sm text-red-500 mt-1">{errors.caption}</p>}
          </div>
          <div>
            <label htmlFor="category" className="block font-medium text-gray-200 mb-1">
              Category
            </label>
            <select
              id="galleryCategories"
              name="galleryCategories"
              value={formData.galleryCategories}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 text-gray-200 bg-white dark:bg-white/[0.05] focus:outline-none focus:ring-2 ${errors.category ? 'border-red-500 ring-red-400' : 'border-gray-700 focus:ring-blue-500'
                }`}
            >
              <option value="">Select a category</option>
              {galleryCategories?.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.galleryCategories && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium text-gray-200 mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-gray-200 border border-gray-600 p-2 rounded-l"
          />

          {/* Preview */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-40 h-40 object-cover rounded-md border border-gray-700"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"


            onClick={() =>
              navigate(`/gallery/`, {
                state: { retreat: retreat },
              })
            }
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

export default GalleryForm;
