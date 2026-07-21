import React, { useEffect, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const token= useSelector((state: any) => state.user.token);
  // console.log("token : ", token);

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setIsLoading(true);
      
      if (editingCategory) {
        // Update existing category
        const response = await axios.put(`${summaryApi.addCategory}/${editingCategory.id}`, {
          name: categoryName
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("response : ", response);

        if (response.data.success) {
          toast.success("Category updated successfully!");
          setCategories(categories.map(cat => 
            cat.id === editingCategory.id ? { ...cat, name: categoryName } : cat
          ));
        }
      } else {
        // Add new category
        const response = await axios.post(summaryApi.addCategory!, {
          name: categoryName
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          toast.success("Category added successfully!");
          setCategories([...categories, response.data.data]);
        }
      }

      setCategoryName("");
      setIsOpen(false);
      setEditingCategory(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(summaryApi.addCategory!, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsOpen(true);
  };


  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar activeSection="categories" />
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">
                  Add and Manage Categories
                </h1>
                <p className="text-muted-foreground">
                  Add and manage product categories
                </p>
              </div>

               <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setEditingCategory(null);
          setCategoryName("");
        }
      }}>
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : editingCategory ? "Update Category" : "Add Category"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
            </div>

            {/* Categories List */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-muted-foreground">
                ID: {category.id}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(category)}
            >
              Edit
            </Button>
          </div>
        ))}
      </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddCategory;