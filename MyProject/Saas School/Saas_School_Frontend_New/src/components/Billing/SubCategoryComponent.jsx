import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Plus, Save } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import DeleteComponent from "../DeleteData/DeleteComponent";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
const BASE_URL = import.meta.env.VITE_REACT_BASE_URL_LOCAL;
function SubCategoryComponent() {
  const { theme } = useTheme();
  const schoolId = useSelector((state) => state.auth.schoolId);
  const isDark = theme === "light";
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([
    { _id: null, name: "", categoryId: "", isNew: true },
  ]);
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
  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/subCategories/${schoolId}`);
      if (res.data.success) {
        const normalized = res.data.data.map((item) => ({
          ...item,
          categoryId: item.categoryId?._id || "",
          isNew: false,
        }));
        setSubCategories(normalized);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch subCategories"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);
  const handleChange = (index, field, value) => {
    const updated = [...subCategories];
    updated[index][field] = value;
    setSubCategories(updated);
  };
  const addRow = () => {
    setSubCategories([
      ...subCategories,
      { _id: null, name: "", categoryId: "", isNew: true },
    ]);
  };
  const saveCategory = async (subcategory, index) => {
    // console.log("subcategory", subcategory);
    try {
      if (subcategory.isNew) {
        const res = await axios.post(`${BASE_URL}/api/subCategories`, {
          name: subcategory.name,
          schoolId,
          categoryId: subcategory.categoryId,
        });
        const updated = [...subCategories];
        updated[index] = { ...res.data, isNew: false };
        setSubCategories(updated);
        toast.success(res.data.message || "Subcategory added");
      } else {
        const response = await axios.put(
          `${BASE_URL}/api/subCategories/${subcategory._id}`,
          {
            name: subcategory.name,
            schoolId,
            categoryId: subcategory.categoryId,
          }
        );
        toast.success(response.data.message || "Subcategory updated");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save subcategory"
      );
    }
  };
  return (
    <div
      className={`rounded-xl p-6 shadow-md ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Subcategory Management</h2>
        <Button
          onClick={addRow}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Subcategory
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
              <th className="px-3 py-2 text-left">Subcategory Name</th>
              <th className="px-3 py-2 text-left">Category Name</th>
              <th className="px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map((cat, index) => (
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
                    value={cat?.name}
                    placeholder="Subcategory name"
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
                  <Select
                    value={cat.categoryId}
                    onValueChange={(value) =>
                      handleChange(index, "categoryId", value)
                    }
                    className={`w-full ${
                      theme === "light"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <SelectTrigger
                      className={`w-full ${
                        theme === "light"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent
                      className={
                        theme === "light"
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-800 border-gray-200"
                      }
                    >
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      deletePath={`${BASE_URL}/api/subCategories/${cat._id}/${schoolId}`}
                      name={"Subcategory"}
                      onDelete={() => {
                        setSubCategories(
                          subCategories.filter((_, i) => i !== index)
                        );
                      }}
                      buttonClassName={`${
                        theme === "light"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white transition-colors`}
                    />
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
}
export default SubCategoryComponent;