import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Minus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import DeleteComponent from "../DeleteData/DeleteComponent";

const BASE_URL = import.meta.env.VITE_REACT_BASE_URL_LOCAL;

const CategoryComponent = () => {
  const { theme } = useTheme();
  const schoolId = useSelector((state) => state.auth.schoolId);

  // console.log("schoolId", schoolId);

  const isDark = theme === "light";

  const [categories, setCategories] = useState([
    { _id: null, name: "", description: "", isNew: true },
  ]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/categories/${schoolId}`);
      if (res.data.status) {
        setCategories(res.data.data);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (index, field, value) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);
  };

  const addRow = () => {
    setCategories([
      ...categories,
      { _id: null, name: "", description: "", isNew: true },
    ]);
  };

  const removeRow = (index) => {
    if (categories.length === 1) return;
    setCategories(categories.filter((_, i) => i !== index));
  };

  /* ================= CREATE / UPDATE ================= */
  const saveCategory = async (category, index) => {
    // console.log("category", category);

    try {

      if (category.isNew) {
        const res = await axios.post(`${BASE_URL}/api/categories`, {
          name: category.name,
          description: category.description,
          schoolId,
        });

        const updated = [...categories];
        updated[index] = { ...res.data, isNew: false };
        setCategories(updated);
        toast.success(res.data.message || "Category added");
      } else {
        const response = await axios.put(
          `${BASE_URL}/api/categories/${category._id}`,
          {
            name: category.name,
            description: category.description,
            schoolId,
          }
        );
        toast.success(response.data.message || "Category updated");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save category");
    }
  };

  /* ================= DELETE ================= */
  const deleteCategory = async (id, index) => {
    if (!id) {
      removeRow(index);
      return;
    }

    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      const res = await axios.delete(
        `${BASE_URL}/api/categories/${id}/${schoolId}`
      );
      setCategories(categories.filter((_, i) => i !== index));
      toast.success(res.data.message || "Category deleted");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div
      className={`rounded-xl p-6 shadow-md ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Category Management</h2>
        <Button
          onClick={addRow}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead
            className={`${
              isDark
                ? "bg-[#112038] text-gray-200"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <tr>
              <th className="px-3 py-2 text-left">SL</th>
              <th className="px-3 py-2 text-left">Category Name</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat, index) => (
              <tr
                key={index}
                className={`border-t ${
                  isDark
                    ? "border-gray-700 hover:bg-[#23304d]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <td className="px-3 py-2">{index + 1}</td>

                <td className="px-3 py-2">
                  <Input
                    value={cat.name}
                    placeholder="Category name"
                    onChange={(e) =>
                      handleChange(index, "name", e.target.value)
                    }
                    className={`w-full ${
                      theme === "light"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </td>

                <td className="px-3 py-2">
                  <Input
                    value={cat.description}
                    placeholder="Description"
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value)
                    }
                    className={`w-full ${
                      theme === "light"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </td>

                <td className="px-3 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => saveCategory(cat, index)}
                      className="text-green-500 hover:text-green-700"
                      title="Save"
                    >
                      <Save size={16} />
                    </button>

                  

                    <DeleteComponent
                    
                      deletePath={`${BASE_URL}/api/categories/${cat._id}/${schoolId}`}
                      name={"Category"}
                      onDelete={() => {
                        setCategories(categories.filter((_, i) => i !== index));
                      }}
                      buttonClassName={`${
                        theme === "light"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white transition-colors`}
                    />

                    {/* <button
                      onClick={() => removeRow(index)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Remove row"
                    >
                      <Minus size={16} />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <p className="text-center py-4 text-sm opacity-70">
            Loading categories...
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryComponent;