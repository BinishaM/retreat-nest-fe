import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
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

import {
  getGalleryCategories,
  deleteGalleryCategory,
} from "@/api/galleryCategory";
import ComponentWrapper from "@/common/ComponentWrapper";

const GalleryCategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const hasFetched = useRef(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getGalleryCategories();
      setCategories(data.data || data);
    } catch (err) {
      console.error("Error fetching gallery categories:", err);
      setError("Failed to load gallery categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchCategories();
  }, []);

  const handleDeleteClick = (category: any) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteGalleryCategory(selectedCategory.id);
      toast.success("Category deleted successfully!");
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
    } catch (err) {
      toast.error("Failed to delete category.");
    } finally {
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
        <p>Loading gallery categories...</p>
      </div>
    );
  }

  return (
    <ComponentWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Gallery Category
        </h2>
        <Button
          onClick={() => navigate("/gallery-category/new")}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
        >
          + Add New Category
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
              <TableHead className="w-[60px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((cat: any, index: number) => (
                <TableRow
                  key={cat.id}
                  className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <TableCell className="text-gray-700 dark:text-gray-300">{index + 1}</TableCell>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {cat.name}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">{cat.slug}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {cat.description || "-"}
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-400 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600"
                      onClick={() =>
                        navigate(`/gallery-category/edit/${cat.gallery_category_id}`, {
                          state: { category: cat },
                        })
                      }
                    >
                      <Edit2 className="w-4 h-4 text-gray-900 dark:text-white" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleDeleteClick(cat)}
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center italic text-gray-500 dark:text-gray-400 py-6"
                >
                  No gallery categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription className="text-gray-700 dark:text-gray-400">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900 dark:text-white">{selectedCategory?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
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
    </ComponentWrapper>
  );
};

export default GalleryCategoryList;
