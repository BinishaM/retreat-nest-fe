import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createHotel, updateHotel } from '../../api/retreat';
import { getCategories } from '../../api/category'; // <-- API call
import { toast } from 'react-toastify';
import ComponentWrapper from '@/common/ComponentWrapper';

const HotelForm = () => {
  const location = useLocation();
  const retreat = location.state?.retreat;
  const categoryOptions = location.state?.categories;
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ...retreat,
    name: retreat?.name || '',
    description: retreat?.description || '',
    category: retreat?.category_id || '',
    slug: retreat?.slug || '',
    social_links: retreat?.social_links || {
      facebook: '',
      instagram: '',
      twitter: '',
      website: '',
    },
  });

  const [categories, setCategories] = useState([]); // fetched categories
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(id);

  // ✅ Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        // Map API data to { value, label } format for select
        const options = res.data.map((cat) => ({
          value: cat.id,
          label: cat.name,
        }));
        setCategories(options);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        toast.error('Could not load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_links.')) {
      const key = name.split('.')[1];
      setFormData({
        ...formData,
        social_links: {
          ...formData.social_links,
          [key]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Retreat name is required';
    if (!formData.description.trim() || formData.description.length < 10)
      newErrors.description = 'Description must be at least 10 characters long';
    if (!formData.category) newErrors.category = 'Select a category';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';

    Object.entries(formData.social_links).forEach(([key, val]) => {
      if (val && !/^https?:\/\/[^\s]+$/.test(val)) {
        newErrors[`social_links.${key}`] = `Enter a valid ${key} URL`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = { ...formData, category_id: Number(formData.category) };
      delete payload.category;

      if (isEdit) {
        const updatedData = { ...payload, name: null };
        delete updatedData.retreat_id;
        await updateHotel(id, updatedData);
        toast.success('Retreat updated successfully!');
      } else {
        await createHotel(payload);
        toast.success('Retreat created successfully!');
      }

      setTimeout(() => navigate('/retreat'), 1500);
    } catch (error) {
      console.error('❌ Error saving retreat:', error);
      toast.error('Failed to save retreat. Check console for details.');
    }
  };

  return (
    <ComponentWrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2 className="text-lg font-semibold text-gray-200 mb-6">
          {isEdit ? 'Edit Retreat' : 'Add New Retreat'}
        </h2>
        {isEdit && <button
          type="submit"
          onClick={() =>
            navigate(`/gallery/`, {
              state: { retreat: retreat },
            })
          }

          className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Manage Gallery
        </button>}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Retreat Name */}
        <div>
          <label htmlFor="name" className="block font-medium text-gray-200 mb-1">
            Retreat Name
          </label>
          <input
            id="name"
            readOnly={isEdit}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full rounded-md border px-3 py-2 text-gray-200 bg-white dark:bg-white/[0.05] focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 ring-red-400' : 'border-gray-700 focus:ring-blue-500'
              }`}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium text-gray-200 mb-1">
            Description
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

        {/* Slug & Category Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block font-medium text-gray-200 mb-1">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="e.g., grand-palace-retreat"
              className={`w-full rounded-md border px-3 py-2 text-gray-200 bg-white dark:bg-white/[0.05] focus:outline-none focus:ring-2 ${errors.slug ? 'border-red-500 ring-red-400' : 'border-gray-700 focus:ring-blue-500'
                }`}
            />
            {errors.slug && <p className="text-sm text-red-500 mt-1">{errors.slug}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block font-medium text-gray-200 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full rounded-md border px-3 py-2 text-gray-200 bg-white dark:bg-white/[0.05] focus:outline-none focus:ring-2 ${errors.category ? 'border-red-500 ring-red-400' : 'border-gray-700 focus:ring-blue-500'
                }`}
            >
              <option value="">Select a category</option>
              {categoryOptions?.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
          </div>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-md font-semibold text-gray-200 mb-3">Social Media Links</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {['facebook', 'instagram', 'twitter', 'website'].map((platform) => (
              <div key={platform}>
                <label htmlFor={platform} className="block font-medium text-gray-200 mb-1 capitalize">
                  {platform}
                </label>
                <input
                  id={platform}
                  name={`social_links.${platform}`}
                  value={formData.social_links[platform]}
                  onChange={handleInputChange}
                  placeholder={`https://${platform}.com/...`}
                  className={`w-full rounded-md border px-3 py-2 text-gray-200 bg-white dark:bg-white/[0.05] focus:outline-none focus:ring-2 ${errors[`social_links.${platform}`]
                    ? 'border-red-500 ring-red-400'
                    : 'border-gray-700 focus:ring-blue-500'
                    }`}
                />
                {errors[`social_links.${platform}`] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors[`social_links.${platform}`]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/retreat')}
            className="px-4 py-2 border border-gray-700 rounded-md text-gray-200 hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </ComponentWrapper>
  )

};

export default HotelForm;

