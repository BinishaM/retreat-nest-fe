import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { deleteHotel, getHotels } from "../../api/retreat";
import { Edit2, Trash2 } from "lucide-react";
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
import { toast } from "react-toastify";
import { getCategories } from "@/api/category";
import ComponentWrapper from "@/common/ComponentWrapper";

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
        setCategories(options); // store in state
      } catch (err) {
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
      setError("Failed to fetch retreat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchHotels();
  }, []);

  const handleDeleteClick = (retreat) => {
    setSelectedHotel(retreat);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteHotel(selectedHotel.retreat_id)
      fetchHotels();
      toast.success('Retreat deleted successfully!');
      setHotels((prev) => prev.filter((h) => h.retreat_id !== selectedHotel.retreat_id));
    } catch (err) {
      toast.error('Failed to delete retreat.');
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
    <ComponentWrapper>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Retreat List</h2>
        <Button
          onClick={() =>
            navigate(`/retreat/new`, {
              state: { categories },
            })}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
        >
          + Add New Retreat
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800 text-gray-200">
              <TableHead className="w-[60px]">#</TableHead>
              <TableHead>Retreat Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels.length > 0 ? (
              hotels.map((retreat, index) => (
                <TableRow
                  key={retreat.id}
                  className="hover:bg-gray-800 transition-colors"
                >
                  <TableCell className="text-gray-300">{index + 1}</TableCell>
                  <TableCell className="font-medium text-white">
                    {retreat.name}
                  </TableCell>
                  <TableCell className="text-gray-400">{retreat.slug}</TableCell>
                  <TableCell className="text-gray-400">
                    {retreat.description}
                  </TableCell>
                  <TableCell className="text-gray-400">

                    {getCategoryLabel(retreat.category_id)}
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-500 hover:bg-gray-700"
                      onClick={() =>
                        navigate(`/retreat/edit/${retreat.retreat_id}`, {
                          state: { retreat, categories },
                        })
                      }
                    >
                      <Edit2 className="w-4 h-4 text-white" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handleDeleteClick(retreat)}
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
    </ComponentWrapper>

  );
};

export default HotelList;
