import React, { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import summaryApi from "@/common/api";
import { useSelector } from "react-redux";

interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  imageUrl: string;
}

const AddSubCategory = () => {
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);

  const token = useSelector((state: any) => state.user.token);

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(summaryApi.addCategory!, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error: any) {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(summaryApi.addSubCategory!, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setSubCategories(response.data.data);
      }
    } catch (error: any) {
      toast.error("Failed to fetch subcategories");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subCategoryName.trim() || !selectedCategory) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", subCategoryName);
    formData.append("categoryId", selectedCategory);
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      setIsLoading(true);

      if (editingSubCategory) {
        const response = await axios.put(
          `${summaryApi.addSubCategory}/${editingSubCategory.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          toast.success("SubCategory updated successfully!");
          fetchSubCategories(); // Refresh the list
        }
      } else {
        const response = await axios.post(
          summaryApi.addSubCategory!,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          toast.success(
            response?.data?.message || "SubCategory added successfully!"
          );
          // Reset form
          setEditingSubCategory(null);
          setSubCategoryName("");
          setSelectedCategory(undefined);
          setImageFile(null);
          setIsOpen(false);
          fetchSubCategories(); // Refresh the list
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setSubCategoryName(subCategory.name);
    setSelectedCategory(subCategory.categoryId);
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="hidden md:block">
          <AdminSidebar activeSection="sub-categories" />
        </div>

        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">
                  Add and Manage Sub Categories
                </h1>
                <p className="text-muted-foreground">
                  Add and manage product sub categories
                </p>
              </div>

              <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                  setIsOpen(open);
                  if (!open) {
                    setEditingSubCategory(null);
                    setSubCategoryName("");
                    setSelectedCategory("");
                    setImageFile(null);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Sub Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingSubCategory
                        ? "Edit Sub Category"
                        : "Add New Sub Category"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Select
                      value={selectedCategory ?? undefined}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="Enter sub category name"
                      value={subCategoryName}
                      onChange={(e) => setSubCategoryName(e.target.value)}
                      disabled={isLoading}
                    />

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                      disabled={isLoading}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Saving..."
                        : editingSubCategory
                        ? "Update Sub Category"
                        : "Add Sub Category"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Sub Categories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subCategories.map((subCategory) => (
                <div
                  key={subCategory.id}
                  className="bg-white p-4 rounded-lg shadow flex flex-col gap-2"
                >
                  <div className="aspect-video relative rounded-md overflow-hidden">
                    <img
                      src={subCategory?.imageUrl}
                      alt={subCategory.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{subCategory.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {
                          categories.find(
                            (cat) => cat.id === subCategory.categoryId
                          )?.name
                        }
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(subCategory)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddSubCategory;
