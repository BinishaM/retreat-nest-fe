import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ComponentWrapper from "@/common/ComponentWrapper";
import { createGallery, getGalleryImage, updateGallery } from "@/api/gallery";
import { getGalleryCategories } from "@/api/galleryCategory";

const GalleryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const gallery = location.state?.gallery;
  const retreat = location.state?.retreat;
  const retreat_id = retreat.retreat_id;
  const isEdit = Boolean(id);

  const [galleryCategories, setGalleryCategories] = useState([]);
  const [formData, setFormData] = useState({
    caption: gallery?.caption || "",
    galleryCategories: gallery?.gallery_category_id || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});

  const fetchCategories = async () => {
    try {
      const res = await getGalleryCategories();
      setGalleryCategories(
        res.data.map((cat) => ({
          value: cat.gallery_category_id,
          label: cat.name,
        }))
      );
    } catch (err) {
      toast.error("Could not load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch image for edit
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await getGalleryImage(retreat_id, id);

        const blob = new Blob([res.data], { type: res.headers["content-type"] });
        setPreview(URL.createObjectURL(blob));
      } catch (err) {
        toast.error("Could not load image");
      }
    };

    if (isEdit) fetchImage();
  }, [isEdit, id, retreat_id]);

  // Change input
  const handleChange = (e: any) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // File upload
  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.caption.trim()) newErrors.caption = "Caption is required.";
    if (!isEdit && !imageFile) newErrors.image = "Image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    const form = new FormData();
    form.append("caption", formData.caption);
    form.append("gallery_category_id", formData.galleryCategories);

    if (imageFile) form.append("image", imageFile);

    try {
      if (isEdit) {
        await updateGallery(retreat_id, id!, form);
        toast.success("Gallery updated successfully!");
      } else {
        await createGallery(retreat_id, form);
        toast.success("Gallery created successfully!");
      }

      setTimeout(
        () =>
          navigate(`/gallery/`, {
            state: { retreat },
          }),
        1500
      );
    } catch (err) {
      toast.error("Failed to save gallery.");
    }
  };

  return (
    <ComponentWrapper>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-6">
        {isEdit ? "Edit Gallery" : "Add Gallery"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Caption */}
          <div>
            <label className="block font-medium text-gray-900 dark:text-gray-200 mb-1">
              Caption
            </label>
            <input
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              placeholder="Caption text..."
              className={`w-full rounded-md border px-3 py-2 
                bg-white text-gray-900 
                dark:bg-gray-900 dark:text-gray-200
                focus:outline-none focus:ring-2
                ${
                  errors.caption
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-400 dark:border-gray-700 focus:ring-blue-500"
                }`}
            />
            {errors.caption && (
              <p className="text-sm text-red-500 mt-1">{errors.caption}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium text-gray-900 dark:text-gray-200 mb-1">
              Category
            </label>
            <select
              name="galleryCategories"
              value={formData.galleryCategories}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 
                bg-white text-gray-900
                dark:bg-gray-900 dark:text-gray-200 
                focus:outline-none focus:ring-2
                ${
                  errors.galleryCategories
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-400 dark:border-gray-700 focus:ring-blue-500"
                }`}
            >
              <option value="">Select a category</option>
              {galleryCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.galleryCategories && (
              <p className="text-sm text-red-500 mt-1">
                {errors.galleryCategories}
              </p>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium text-gray-900 dark:text-gray-200 mb-2">
            Upload Image
          </label>

          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {!isEdit && (
            <label
              htmlFor="imageUpload"
              className="cursor-pointer px-4 py-2 
                bg-gray-200 text-gray-900 
                dark:bg-gray-700 dark:text-gray-200
                rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Choose Image
            </label>
          )}

          {errors.image && (
            <p className="text-sm text-red-500 mt-1">{errors.image}</p>
          )}

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-40 h-40 object-cover rounded-md border 
                border-gray-300 dark:border-gray-700"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() =>
              navigate(`/gallery/`, {
                state: { retreat },
              })
            }
            className="px-4 py-2 border rounded-md 
              border-gray-400 text-gray-800 hover:bg-gray-200
              dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
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
