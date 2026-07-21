import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { Inventory2 } from "@mui/icons-material";
import { Loader2, Plus, Search } from "lucide-react";
import { useSelector } from "react-redux";
import PaginationComponent from "@/components/pagination/PaginationComponent";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import DeleteComponent from "../DeleteData/DeleteComponent";
import { FaEdit } from "react-icons/fa";

import axios from "axios";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_REACT_BASE_URL_LOCAL;

const InventoryComponent = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const classData = useSelector((state) => state.class.class) || [];
  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editInput, setEditInput] = useState({
    _id: "",
    name: "",
    code: "",
    schoolId: "",
    categoryId: "",
    category: "",
    subCategoryId: "",
    subCategory: "",
    unit: "",
    stock: 0,
    price: 0,
    sellPrice: 0,
    totalPrice: 0,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [createLoader, setCreateLoader] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  // Inventory Add Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addInput, setAddInput] = useState({
    name: "",
    code: "",
    schoolId: "",
    categoryId: "",
    category: "",
    subCategoryId: "",
    subCategory: "",
    unit: "",
    stock: 0,
    price: 0,
    sellPrice: 0,
    totalPrice: 0,
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  // Filter state
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubCategory, setFilterSubCategory] = useState("");
  const [filterSubCategories, setFilterSubCategories] = useState([]);
  const schoolId = useSelector((state) => state.auth.schoolId);
  // When filterCategory changes, fetch subcategories for filter dropdown
  useEffect(() => {
    if (filterCategory) {
      (async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            `${BASE_URL}/api/subCategories/${filterCategory}/${schoolId}`
          );
          if (res.data.success) {
            setFilterSubCategories(res.data.data);
          }
        } catch (error) {
          setFilterSubCategories([]);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setFilterSubCategories([]);
    }
    setFilterSubCategory("");
  }, [filterCategory, schoolId]);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    if (schoolId) fetchCategories();
  }, [schoolId]);

  useEffect(() => {
    if (addInput.categoryId) fetchSubCategories(addInput.categoryId);
    else setSubCategories([]);
  }, [addInput.categoryId]);

  useEffect(() => {
    if (editModalOpen && editInput.categoryId)
      fetchSubCategories(editInput.categoryId, true);
  }, [editInput.categoryId, editModalOpen]);

  // Fetch categories
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

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/inventory/school/${schoolId}`
      );
      // console.log(res.data.data);
      if (res.data.status === true) {
        setInventoryData(res.data.data);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch inventory"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId, isEdit = false) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/subCategories/${categoryId}/${schoolId}`
      );
      if (res.data.success) {
        if (isEdit) {
          setEditSubCategories(res.data.data);
        } else {
          setSubCategories(res.data.data);
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch subCategories"
      );
    } finally {
      setLoading(false);
    }
  };

  const [editSubCategories, setEditSubCategories] = useState([]);

  const handleEditInput = (field, value) => {
    setEditInput((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "categoryId" ? { subCategoryId: "", subCategory: "" } : {}),
    }));
  };

  useEffect(() => {
    setEditInput((prev) => ({
      ...prev,
      totalPrice: Number(prev.stock) * Number(prev.price),
    }));
  }, [editInput.stock, editInput.price]);

  const openEditModal = (item) => {
    setEditInput({
      ...item,
      categoryId: item.categoryId?._id || item.categoryId || "",
      subCategoryId: item.subCategoryId?._id || item.subCategoryId || "",
    });
    setEditModalOpen(true);
  };

  const handleEditInventory = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const payload = {
        ...editInput,
        schoolId,
        category:
          categories.find((c) => c._id === editInput.categoryId)?.name || "",
        subCategory:
          editSubCategories.find((s) => s._id === editInput.subCategoryId)
            ?.name || "",
      };
      const res = await axios.put(
        `${BASE_URL}/api/inventory/${schoolId}/${editInput._id}`,
        payload
      );
      toast.success(res.data.message || "Inventory updated");
      setEditModalOpen(false);
      fetchInventory();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update inventory"
      );
    } finally {
      setEditLoading(false);
    }
  };

  // Handle add input change
  const handleAddInput = (field, value) => {
    setAddInput((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "categoryId" ? { subCategoryId: "", subCategory: "" } : {}),
    }));
  };

  useEffect(() => {
    setAddInput((prev) => ({
      ...prev,
      totalPrice: Number(prev.stock) * Number(prev.price),
    }));
    fetchInventory();
  }, [addInput.stock, addInput.price]);

  const handleAddInventory = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const payload = {
        ...addInput,
        schoolId,
        category:
          categories.find((c) => c._id === addInput.categoryId)?.name || "",
        subCategory:
          subCategories.find((s) => s._id === addInput.subCategoryId)?.name ||
          "",
      };
      const res = await axios.post(`${BASE_URL}/api/inventory`, payload);
      toast.success(res.data.message || "Inventory added");
      setAddModalOpen(false);
      setAddInput({
        name: "",
        code: "",
        schoolId: "",
        categoryId: "",
        category: "",
        subCategoryId: "",
        subCategory: "",
        unit: "",
        stock: 0,
        price: 0,
        sellPrice: 0,
        totalPrice: 0,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add inventory");
    } finally {
      setAddLoading(false);
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search and filter inventoryData
  const filteredData = inventoryData.filter((item) => {
    // Category filter
    if (
      filterCategory &&
      item.categoryId !== filterCategory &&
      item.categoryId?._id !== filterCategory
    )
      return false;
    // Subcategory filter
    if (
      filterSubCategory &&
      item.subCategoryId !== filterSubCategory &&
      item.subCategoryId?._id !== filterSubCategory
    )
      return false;
    // Search filter
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.code?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term) ||
      item.subCategory?.toLowerCase().includes(term) ||
      item.unit?.toLowerCase().includes(term)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const allUnit = [
    { id: 1, name: "Unit" },
    { id: 2, name: "Pcs" },
    { id: 3, name: "Kg" },
    { id: 4, name: "Gm" },
    { id: 5, name: "Ltr" },
    { id: 6, name: "Ml" },
    { id: 7, name: "Dozen" },
  ];

  return (
    <div>
      <div
        className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
          theme === "light"
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <div
          className={`flex flex-col md:flex-row justify-between items-center p-4 sm:p-6 border-b ${
            theme === "light" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="mb-4 md:mb-0">
            <h2
              className={`text-xl font-bold flex items-center ${
                theme === "light" ? "text-white" : "text-gray-800"
              }`}
            >
              <Inventory2 className="mr-2 h-5 w-5" />
              Inventory
            </h2>
            <p
              className={`classesAvailable mt-1 text-sm ${
                theme === "light" ? "text-gray-400" : "text-gray-500"
              }`}
            ></p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
            {/* Search Input and Filters */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto items-center">
              <div
                className={`searchBox relative w-full md:w-64 ${
                  theme === "light" ? "text-white" : "text-gray-800 "
                }`}
              >
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  className={`pl-10 pr-4 py-2 w-full rounded-md border ${
                    theme === "light"
                      ? "bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                      : "bg-white border-gray-300 focus:border-purple-500"
                  } focus:outline-none`}
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Category Filter */}
              <Select
                value={filterCategory}
                onValueChange={(val) => setFilterCategory(val)}
              >
                <SelectTrigger
                  className={`w-36 ${
                    theme === "light"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent
                  className={
                    theme === "light"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-800 border-gray-200"
                  }
                >
                  {/* <SelectItem value="all">All</SelectItem> */}
                  {categories
                    .filter((cat) => cat._id && cat._id !== "")
                    .map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {/* SubCategory Filter */}
              <Select
                value={filterSubCategory}
                onValueChange={(val) => setFilterSubCategory(val)}
                disabled={!filterCategory}
              >
                <SelectTrigger
                  className={`w-40 ${
                    theme === "light"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <SelectValue placeholder="Filter by Subcategory" />
                </SelectTrigger>
                <SelectContent
                  className={
                    theme === "light"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-800 border-gray-200"
                  }
                >
                  {/* <SelectItem value="all">All</SelectItem> */}
                  {filterSubCategories
                    .filter((sub) => sub._id && sub._id !== "")
                    .map((sub) => (
                      <SelectItem key={sub._id} value={sub._id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {/* Reset Filter Button */}
              <button
                type="button"
                className={`ml-2 px-3 py-2 rounded-md border text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                  ${
                    theme === "light"
                      ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
                  }
                `}
                onClick={() => {
                  setFilterCategory("");
                  setFilterSubCategory("");
                  setSearchTerm("");
                }}
                title="Reset Filters"
              >
                Reset
              </button>
            </div>

            {/* Add New Button & Modal */}
            <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
              {/* <DialogTrigger asChild>
                <Button
                  className={`addClasroom ${
                    theme === "light"
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                      : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  } text-white shadow-md hover:shadow-lg transition-all duration-300`}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add Inventory</span>
                </Button>
              </DialogTrigger> */}
              <DialogContent
                className={`sm:max-w-4xl ${
                  theme === "light"
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-800 border-gray-200"
                }`}
              >
                <DialogHeader>
                  <DialogTitle>Add New Inventory Item</DialogTitle>
                  <DialogDescription>
                    Add a new inventory item to your inventory.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddInventory}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1">
                      <Label
                        className={
                          theme === "light" ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        Name *
                      </Label>
                      <Input
                        required
                        value={addInput.name}
                        onChange={(e) => handleAddInput("name", e.target.value)}
                        placeholder="Inventory Name"
                        className={`w-full ${
                          theme === "light"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                    {/* Code */}
                    <div className="flex flex-col gap-1">
                      <Label>Code *</Label>
                      <Input
                        required
                        value={addInput.code}
                        onChange={(e) => handleAddInput("code", e.target.value)}
                        placeholder="Inventory Code / SKU"
                        className={`w-full ${
                          theme === "light"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                    {/* Category */}
                    <div className="flex flex-col gap-1">
                      <Label>Category *</Label>
                      <Select
                        required
                        value={addInput.categoryId}
                        onValueChange={(val) =>
                          handleAddInput("categoryId", val)
                        }
                      >
                        <SelectTrigger
                          className={`w-full ${
                            theme === "light"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent
                          className={
                            theme === "light"
                              ? "bg-gray-700 text-white border-gray-600"
                              : "bg-white text-gray-800 border-gray-200"
                          }
                        >
                          {categories.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* SubCategory */}
                    <div className="flex flex-col gap-1">
                      <Label>Sub Category *</Label>
                      <Select
                        required
                        value={addInput.subCategoryId}
                        onValueChange={(val) =>
                          handleAddInput("subCategoryId", val)
                        }
                        disabled={!addInput.categoryId}
                      >
                        <SelectTrigger
                          className={`w-full ${
                            theme === "light"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          <SelectValue placeholder="Select sub category" />
                        </SelectTrigger>
                        <SelectContent
                          className={
                            theme === "light"
                              ? "bg-gray-700 text-white border-gray-600"
                              : "bg-white text-gray-800 border-gray-200"
                          }
                        >
                          {subCategories.map((sub) => (
                            <SelectItem key={sub._id} value={sub._id}>
                              {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Unit */}
                    <div className="flex flex-col gap-1">
                      <Label>Unit *</Label>
                      <Select
                        required
                        value={addInput.unit}
                        onValueChange={(val) => handleAddInput("unit", val)}
                      >
                        <SelectTrigger
                          className={`w-full ${
                            theme === "light"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                        <SelectContent
                          className={
                            theme === "light"
                              ? "bg-gray-700 text-white border-gray-600"
                              : "bg-white text-gray-800 border-gray-200"
                          }
                        >
                          {allUnit.map((unit) => (
                            <SelectItem key={unit.id} value={unit.name}>
                              {unit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Stock */}
                    <div className="flex flex-col gap-1">
                      <Label>Stock *</Label>
                      <Input
                        required
                        type="number"
                        value={addInput.stock}
                        onChange={(e) =>
                          handleAddInput("stock", e.target.value)
                        }
                        placeholder="Quantity"
                        className={`w-full ${
                          theme === "light"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                    {/* Price */}
                    <div className="flex flex-col gap-1">
                      <Label>Price (per unit) *</Label>
                      <Input
                        required
                        type="number"
                        value={addInput.price}
                        onChange={(e) =>
                          handleAddInput("price", e.target.value)
                        }
                        placeholder="Price"
                        className={`w-full ${
                          theme === "light"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                    {/* Sell Price */}
                    <div className="flex flex-col gap-1">
                      <Label>Sell Price</Label>
                      <Input
                        type="number"
                        value={addInput.sellPrice}
                        onChange={(e) =>
                          handleAddInput("sellPrice", e.target.value)
                        }
                        placeholder="Sell Price"
                        className={`w-full ${
                          theme === "light"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                        }`}
                      />
                    </div>
                    {/* Total Price (readonly) */}
                    <div className="flex flex-col gap-1">
                      <Label>Total Price</Label>
                      <Input
                        value={addInput.totalPrice}
                        disabled
                        className={`w-full ${
                          theme === "light"
                            ? "bg-gray-600 border-gray-600 text-gray-300"
                            : "bg-gray-100 border-gray-300"
                        }`}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={addLoading}>
                      {addLoading ? "Adding..." : "Add Inventory"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="flex flex-col items-center">
              <Loader2
                className={`h-12 w-12 animate-spin ${
                  theme === "light" ? "text-purple-400" : "text-purple-600"
                }`}
              />
              <p
                className={`mt-4 ${
                  theme === "light" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Loading inventory...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {classData.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <GraduationCap
                  className={`w-16 h-16 mb-4 ${
                    theme === "light" ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                <p
                  className={`text-lg font-medium ${
                    theme === "light" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  No inventory found
                </p>
                <p
                  className={`text-sm mt-2 ${
                    theme === "light" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Add your first inventory to get started
                </p>
              </div>
            ) : (
              <>
                {/* Table */}
                <div
                  className={`overflow-x-auto mt-4 rounded-lg border ${
                    theme === "light"
                      ? "border-gray-700 bg-[#1e293b]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <table className="min-w-full text-sm">
                    <thead
                      className={`
        ${
          theme === "light"
            ? "bg-[#112038] text-gray-200"
            : "bg-gray-100 text-gray-700"
        }
      `}
                    >
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">#</th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Item Name
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Code
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Categoory
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Sub Categoory
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Unit
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Price
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Sell Price
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Total
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Total Purchase Stock
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Total Sell Stock
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedData.map((item, index) => (
                        <tr
                          key={index}
                          className={`
            border-t
            ${
              theme === "light"
                ? "border-gray-700 hover:bg-[#23304d]"
                : "border-gray-200 hover:bg-gray-300"
            }
            transition-colors
            ${
              item.stock <= 0
                ? "bg-red-500/20"
                : item.stock < 10
                ? "bg-yellow-500/20"
                : "bg-transparent"
            }
          `}
                        >
                          <td className="px-4 py-3">
                            {(currentPage - 1) * rowsPerPage + index + 1}
                          </td>
                          <td className="px-4 py-3">{item.name}</td>
                          <td className="px-4 py-3">{item.code}</td>
                          <td className="px-4 py-3">{item.category}</td>
                          <td className="px-4 py-3">{item.subCategory}</td>
                          <td className="px-4 py-3 text-right">{item.stock}</td>
                          <td className="px-4 py-3">{item.unit}</td>
                          <td className="px-4 py-3 text-right">
                            ₹{item.price}
                          </td>
                          <td className="px-4 py-3 text-right">
                            ₹{item.sellPrice}
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            ₹{item.totalPrice}
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            {item.totalPurchaseStock}
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            {item.totalSellStock}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex gap-2 justify-end">
                              {/* Edit Dialog */}
                              <Button
                                size="icon"
                                className={`editClassroom ${
                                  theme === "light"
                                    ? "bg-amber-600 hover:bg-amber-700"
                                    : "bg-amber-500 hover:bg-amber-600"
                                } sm:w-8 sm:h-8 w-6 h-6 text-white p-1 sm:p-2 cursor-pointer rounded-sm`}
                                onClick={() => openEditModal(item)}
                                title="Edit"
                              >
                                <FaEdit />
                              </Button>

                              <DeleteComponent
                                deletePath={`${BASE_URL}/api/inventory/${schoolId}/${item._id}`}
                                name={"Inventory"}
                                onDelete={() => {
                                  setInventoryData(
                                    inventoryData.filter(
                                      (inv) => inv._id !== item._id
                                    )
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
                </div>
                {/* edit modal */}
                <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                  <DialogContent
                    className={`sm:max-w-4xl ${
                      theme === "light"
                        ? "bg-gray-800 text-white border-gray-700"
                        : "bg-white text-gray-800 border-gray-200"
                    }`}
                  >
                    <DialogHeader>
                      <DialogTitle>Edit Inventory Item</DialogTitle>
                      <DialogDescription>
                        Update inventory item details.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditInventory}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-4">
                        {/* Name */}
                        <div className="flex flex-col gap-1">
                          <Label>Name *</Label>
                          <Input
                            required
                            value={editInput.name}
                            onChange={(e) =>
                              handleEditInput("name", e.target.value)
                            }
                            placeholder="Inventory Name"
                            className={`w-full ${
                              theme === "light"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                        </div>
                        {/* Code */}
                        <div className="flex flex-col gap-1">
                          <Label>Code *</Label>
                          <Input
                            required
                            value={editInput.code}
                            onChange={(e) =>
                              handleEditInput("code", e.target.value)
                            }
                            placeholder="Inventory Code / SKU"
                            className={`w-full ${
                              theme === "light"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                        </div>
                        {/* Category */}
                        <div className="flex flex-col gap-1">
                          <Label>Category *</Label>
                          <Select
                            required
                            value={editInput.categoryId}
                            onValueChange={(val) =>
                              handleEditInput("categoryId", val)
                            }
                          >
                            <SelectTrigger
                              className={`w-full ${
                                theme === "light"
                                  ? "bg-gray-700 border-gray-600 text-white"
                                  : "bg-white border-gray-300"
                              }`}
                            >
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent
                              className={
                                theme === "light"
                                  ? "bg-gray-700 text-white border-gray-600"
                                  : "bg-white text-gray-800 border-gray-200"
                              }
                            >
                              {categories.map((cat) => (
                                <SelectItem key={cat._id} value={cat._id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {/* SubCategory */}
                        <div className="flex flex-col gap-1">
                          <Label>Sub Category *</Label>
                          <Select
                            required
                            value={editInput.subCategoryId}
                            onValueChange={(val) =>
                              handleEditInput("subCategoryId", val)
                            }
                            disabled={!editInput.categoryId}
                          >
                            <SelectTrigger
                              className={`w-full ${
                                theme === "light"
                                  ? "bg-gray-700 border-gray-600 text-white"
                                  : "bg-white border-gray-300"
                              }`}
                            >
                              <SelectValue placeholder="Select sub category" />
                            </SelectTrigger>
                            <SelectContent
                              className={
                                theme === "light"
                                  ? "bg-gray-700 text-white border-gray-600"
                                  : "bg-white text-gray-800 border-gray-200"
                              }
                            >
                              {editSubCategories.map((sub) => (
                                <SelectItem key={sub._id} value={sub._id}>
                                  {sub.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Unit */}
                        <div className="flex flex-col gap-1">
                          <Label>Unit *</Label>
                          <Select
                            required
                            value={editInput.unit}
                            onValueChange={(val) =>
                              handleEditInput("unit", val)
                            }
                          >
                            <SelectTrigger
                              className={`w-full ${
                                theme === "light"
                                  ? "bg-gray-700 border-gray-600 text-white"
                                  : "bg-white border-gray-300"
                              }`}
                            >
                              <SelectValue placeholder="Select a unit" />
                            </SelectTrigger>
                            <SelectContent
                              className={
                                theme === "light"
                                  ? "bg-gray-700 text-white border-gray-600"
                                  : "bg-white text-gray-800 border-gray-200"
                              }
                            >
                              {allUnit.map((unit) => (
                                <SelectItem key={unit.id} value={unit.name}>
                                  {unit.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Stock */}
                        <div className="flex flex-col gap-1">
                          <Label>Stock *</Label>
                          <Input
                            required
                            type="number"
                            value={editInput.stock}
                            onChange={(e) =>
                              handleEditInput("stock", e.target.value)
                            }
                            placeholder="Quantity"
                            className={`w-full ${
                              theme === "light"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                        </div>
                        {/* Price */}
                        <div className="flex flex-col gap-1">
                          <Label>Price (per unit) *</Label>
                          <Input
                            required
                            type="number"
                            value={editInput.price}
                            onChange={(e) =>
                              handleEditInput("price", e.target.value)
                            }
                            placeholder="Price"
                            className={`w-full ${
                              theme === "light"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                        </div>
                        {/* Sell Price */}
                        <div className="flex flex-col gap-1">
                          <Label>Sell Price</Label>
                          <Input
                            type="number"
                            value={editInput.sellPrice}
                            onChange={(e) =>
                              handleEditInput("sellPrice", e.target.value)
                            }
                            placeholder="Sell Price"
                            className={`w-full ${
                              theme === "light"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300"
                            }`}
                          />
                        </div>
                        {/* Total Price (readonly) */}
                        <div className="flex flex-col gap-1">
                          <Label>Total Price</Label>
                          <Input
                            value={editInput.totalPrice}
                            disabled
                            className={`w-full ${
                              theme === "light"
                                ? "bg-gray-600 border-gray-600 text-gray-300"
                                : "bg-gray-100 border-gray-300"
                            }`}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={editLoading}>
                          {editLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {searchTerm && filteredData.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Search
                      className={`w-12 h-12 mb-3 ${
                        theme === "light" ? "text-gray-400" : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`text-lg font-medium ${
                        theme === "light" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      No results found
                    </p>
                    <p
                      className={`text-sm mt-2 ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Try adjusting your search term
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {filteredData.length > 0 && (
                  <div
                    className={`pagination-component p-4 border-t ${
                      theme === "light" ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <PaginationComponent
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={setRowsPerPage}
                      dataLength={filteredData.length}
                      theme={theme}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InventoryComponent;
