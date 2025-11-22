import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import ComponentWrapper from "@/common/ComponentWrapper";
import { deleteGallery, getGalleries } from "@/api/gallery";
import { getGalleryCategories } from "@/api/galleryCategory";

const GalleryList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const retreat = location.state?.retreat;
    const retreat_id = retreat.retreat_id;
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [galleryCategory, setGalleryCategory] = useState([]);
    const hasFetched = useRef(false);

    const fetchGalleryCategories = async () => {
        try {
            const res = await getGalleryCategories();
            const options = res.data.map(cat => ({
                value: cat.gallery_category_id,
                label: cat.name,
            }));
            setGalleryCategory(options);
        } catch (err) {
            toast.error("Could not load categories");
        }
    };

    useEffect(() => {
        fetchGalleryCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getGalleries(retreat_id);
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
            await deleteGallery(retreat_id, selectedCategory.gallery_id);
            toast.success("Category deleted successfully!");
            fetchCategories();
            setCategories(prev => prev.filter(c => c.id !== selectedCategory.gallery_id));
        } catch (err) {
            toast.error("Failed to delete category.");
        } finally {
            setShowDeleteModal(false);
            setSelectedCategory(null);
        }
    };

    const getCategoryLabel = (categoryId: number | undefined) => {
        if (categoryId == null) return "-";
        const category = galleryCategory.find(option => option.value === categoryId);
        return category ? category.label : "-";
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-600 dark:text-gray-400">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
                <p>Loading gallery...</p>
            </div>
        );
    }

    return (
        <ComponentWrapper>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Gallery
                </h2>
                <Button
                    onClick={() =>
                        navigate(`/gallery/new`, {
                            state: { retreat: retreat },
                        })
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    + Add Gallery
                </Button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-200">
                            <TableHead className="w-[60px]">#</TableHead>
                            <TableHead>Caption</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {categories.length > 0 ? (
                            categories.map((cat: any, index: number) => (
                                <TableRow
                                    key={cat.id}
                                    className="
                                            hover:bg-gray-100 
                                            dark:hover:bg-gray-800 
                                            transition-colors
                                        "
                                >
                                    <TableCell className="text-gray-700 dark:text-gray-300">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="text-gray-900 dark:text-white font-medium">
                                        {cat.caption}
                                    </TableCell>
                                    <TableCell className="text-gray-700 dark:text-gray-400">
                                        {cat.slug}
                                    </TableCell>
                                    <TableCell className="text-gray-700 dark:text-gray-400">
                                        {getCategoryLabel(cat.gallery_category_id)}
                                    </TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="
                                                    border-gray-300 text-gray-700 hover:bg-gray-200
                                                    dark:border-gray-500 dark:text-white dark:hover:bg-gray-700
                                                "
                                            onClick={() =>
                                                navigate(`/gallery/edit/${cat.gallery_id}`, {
                                                    state: { retreat, gallery: cat },
                                                })
                                            }
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                            onClick={() => handleDeleteClick(cat)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center italic text-gray-600 dark:text-gray-400 py-6"
                                >
                                    No gallery categories found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400">
                            Are you sure you want to delete{" "}
                            <strong className="text-gray-900 dark:text-white">
                                {selectedCategory?.name}
                            </strong>
                            ?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteModal(false)}
                            className="
                                    border-gray-400 text-gray-700 hover:bg-gray-200
                                    dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800
                                "
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

export default GalleryList;
